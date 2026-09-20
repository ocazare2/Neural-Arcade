import { describe, expect, test } from "bun:test";
import {
  getMissionProgress,
  getResumePhase,
  hasLevelProgress,
  isLevelComplete,
  isLevelUnlocked,
} from "../src/app/neural-arcade/learning-progress";
import type { Phase, ProgressMap } from "../src/app/neural-arcade/types";

const LEVELS = ["math", "perceptron", "training"];

function progressFor(phasesDone: Phase[], overrides: Partial<ProgressMap[string]> = {}): ProgressMap[string] {
  return { phasesDone, stars: 0, attempts: 0, ...overrides };
}

describe("reanudar el aprendizaje", () => {
  test("una partida nueva comienza en la primera misión", () => {
    expect(getResumePhase({}, "math")).toBe("theory");
    expect(getResumePhase({ math: progressFor([]) }, "math")).toBe("theory");
  });

  test("retoma la primera misión pendiente después del progreso parcial", () => {
    expect(getResumePhase({ math: progressFor(["theory"]) }, "math")).toBe("demo");
    expect(getResumePhase({ math: progressFor(["theory", "demo"]) }, "math")).toBe("practice");
    expect(getResumePhase({ math: progressFor(["theory", "demo", "practice"]) }, "math")).toBe("challenge");
  });

  test("un guardado no secuencial no salta una misión pendiente", () => {
    expect(getResumePhase({ math: progressFor(["practice", "demo"]) }, "math")).toBe("theory");
  });

  test("un reto completado histórico conserva el acceso al cierre del nivel", () => {
    expect(getResumePhase({ math: progressFor(["challenge"], { stars: 2, attempts: 1 }) }, "math")).toBe("mastery");
  });

  test("tras cerrar el nivel permite volver a jugar desde la primera misión", () => {
    expect(getResumePhase({ math: progressFor(["theory", "demo", "practice", "challenge", "mastery"]) }, "math")).toBe("theory");
    expect(getResumePhase({ math: progressFor(["challenge", "mastery"]) }, "math")).toBe("theory");
  });
});

describe("acceso a los niveles", () => {
  test("el primer nivel está abierto y los siguientes requieren terminar el anterior", () => {
    expect(isLevelUnlocked({}, LEVELS, 0)).toBe(true);
    expect(isLevelUnlocked({}, LEVELS, 1)).toBe(false);
    expect(isLevelUnlocked({ math: progressFor(["theory", "demo", "practice"]) }, LEVELS, 1)).toBe(false);
    expect(isLevelUnlocked({ math: progressFor(["challenge"]) }, LEVELS, 1)).toBe(true);
  });

  test("terminar un nivel no desbloquea todos los posteriores", () => {
    expect(isLevelUnlocked({ math: progressFor(["challenge"]) }, LEVELS, 2)).toBe(false);
    expect(isLevelUnlocked({ perceptron: progressFor(["challenge"]) }, LEVELS, 2)).toBe(true);
  });

  test("conserva acceso a un nivel con fases, intentos o estrellas guardadas", () => {
    for (const entry of [
      progressFor(["theory"]),
      progressFor([], { attempts: 1 }),
      progressFor([], { stars: 1 }),
    ]) {
      const progress = { training: entry };
      expect(hasLevelProgress(progress, "training")).toBe(true);
      expect(isLevelUnlocked(progress, LEVELS, 2)).toBe(true);
    }
  });

  test("una entrada vacía no cuenta como progreso ni abre el nivel", () => {
    expect(hasLevelProgress({}, "training")).toBe(false);
    const progress = { training: progressFor([]) };
    expect(hasLevelProgress(progress, "training")).toBe(false);
    expect(isLevelUnlocked(progress, LEVELS, 2)).toBe(false);
  });
});

describe("completitud y contador de misiones", () => {
  test("completar el reto determina el fin del nivel, sin exigir estrellas", () => {
    expect(isLevelComplete({}, "math")).toBe(false);
    expect(isLevelComplete({ math: progressFor(["theory", "demo", "practice"], { stars: 3 }) }, "math")).toBe(false);
    expect(isLevelComplete({ math: progressFor(["challenge"]) }, "math")).toBe(true);
    expect(isLevelComplete({ math: progressFor(["challenge", "mastery"]) }, "math")).toBe(true);
  });

  test("cuenta cuatro misiones jugables y excluye la pantalla de cierre", () => {
    expect(getMissionProgress({}, "math")).toEqual({ completed: 0, total: 4 });
    expect(getMissionProgress({ math: progressFor(["theory", "demo"]) }, "math")).toEqual({ completed: 2, total: 4 });
    expect(getMissionProgress({ math: progressFor(["theory", "demo", "practice", "challenge", "mastery"]) }, "math")).toEqual({ completed: 4, total: 4 });
    expect(getMissionProgress({ math: progressFor(["mastery"]) }, "math")).toEqual({ completed: 0, total: 4 });
  });

  test("los duplicados históricos no inflan el número de misiones completadas", () => {
    expect(getMissionProgress({ math: progressFor(["theory", "theory", "challenge", "challenge", "mastery"]) }, "math")).toEqual({ completed: 2, total: 4 });
  });
});
