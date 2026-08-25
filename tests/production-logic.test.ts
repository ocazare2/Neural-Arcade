import { describe, expect, test } from "bun:test";
import { ALL_LEVELS } from "../src/app/neural-arcade/curriculum";
import {
  CONCEPT_GAME_MODULES,
  REQUIRED_CONCEPT_GAME_IDS,
} from "../src/app/neural-arcade/concept-game-data";
import {
  GRADIENT_SURFACES,
  createGradientRound,
  takeGradientStep,
} from "../src/app/neural-arcade/gradient-game";
import { normalizeMathCommands } from "../src/app/neural-arcade/math-format";
import {
  applyPhaseCompletion,
  sanitizeProgress,
} from "../src/app/neural-arcade/progress";
import { recoverPersistedArcadeState } from "../src/app/neural-arcade/recovery";

describe("Gradient Roller", () => {
  test("cada ronda inicia en la superficie que se muestra", () => {
    expect(createGradientRound(1).position).toEqual(GRADIENT_SURFACES[1].start);
    expect(createGradientRound(2).position).toEqual(GRADIENT_SURFACES[2].start);
  });

  test("la tercera superficie se puede completar", () => {
    let state = createGradientRound(2);
    for (let i = 0; i < 40 && !state.solved; i += 1) {
      state = { ...state, ...takeGradientStep(2, state.position, 0.1, state.steps) };
    }
    expect(state.solved).toBe(true);
  });
});

describe("renderizado matemático", () => {
  test("convierte comandos frecuentes a texto legible", () => {
    expect(normalizeMathCommands("\\text{score} = \\eta \\cdot \\nabla L")).toBe("score = η · ∇ L");
  });

  test("ninguna fórmula publicada conserva comandos no soportados", () => {
    const structural = new Set(["frac", "sqrt"]);
    const leftovers = ALL_LEVELS.flatMap((level) =>
      level.theory.flatMap((block) => {
        if (!block.formula) return [];
        return [...normalizeMathCommands(block.formula).matchAll(/\\\\([A-Za-z]+)/g)]
          .map((match) => match[1])
          .filter((command) => !structural.has(command));
      }),
    );
    expect(leftovers).toEqual([]);
  });
});

describe("progreso", () => {
  test("repetir un reto cuenta el intento sin duplicar XP", () => {
    const first = applyPhaseCompletion(
      { progress: {}, xp: 0 },
      "math",
      "challenge",
      3,
      "2026-01-01T00:00:00.000Z",
    );
    const second = applyPhaseCompletion(
      first,
      "math",
      "challenge",
      3,
      "2026-01-02T00:00:00.000Z",
    );
    expect(second.xp).toBe(first.xp);
    expect(second.progress.math.attempts).toBe(2);
  });

  test("descarta niveles retirados y fases duplicadas al hidratar", () => {
    const sanitized = sanitizeProgress(
      {
        math: { stars: 2, attempts: 1, phasesDone: ["challenge", "challenge"] },
        retired: { stars: 3, attempts: 9, phasesDone: ["challenge"] },
      },
      new Set(["math"]),
    );
    expect(Object.keys(sanitized)).toEqual(["math"]);
    expect(sanitized.math.phasesDone).toEqual(["challenge"]);
  });
});

describe("recuperación", () => {
  test("conserva el progreso pero vuelve al mapa", () => {
    const stored = JSON.stringify({
      state: {
        progress: { math: { stars: 3, phasesDone: ["challenge"], attempts: 1 } },
        xp: 110,
        activeLevel: "grad",
        activePhase: "demo",
      },
      version: 0,
    });
    const recovered = JSON.parse(recoverPersistedArcadeState(stored) ?? "null");
    expect(recovered.state.activeLevel).toBeNull();
    expect(recovered.state.activePhase).toBe("theory");
    expect(recovered.state.progress.math.stars).toBe(3);
  });

  test("elimina almacenamiento irrecuperable", () => {
    expect(recoverPersistedArcadeState("{not-json")).toBeNull();
  });
});

describe("minijuegos conceptuales", () => {
  test("los diez niveles antes incompletos tienen tres retos válidos", () => {
    expect(Object.keys(CONCEPT_GAME_MODULES).sort()).toEqual([...REQUIRED_CONCEPT_GAME_IDS].sort());
    for (const game of Object.values(CONCEPT_GAME_MODULES)) {
      expect(game.rounds.length).toBeGreaterThanOrEqual(3);
      for (const round of game.rounds) {
        expect(round.options.length).toBeGreaterThanOrEqual(3);
        expect(round.correct).toBeGreaterThanOrEqual(0);
        expect(round.correct).toBeLessThan(round.options.length);
        expect(new Set(round.options).size).toBe(round.options.length);
      }
    }
  });
});
