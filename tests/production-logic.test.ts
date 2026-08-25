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
  sanitizeActiveLevel,
  sanitizePhase,
  sanitizeProgress,
} from "../src/app/neural-arcade/progress";
import { recoverPersistedArcadeState } from "../src/app/neural-arcade/recovery";
import { readBooleanFlag, writeBooleanFlag } from "../src/app/neural-arcade/storage";
import { getSiteUrl } from "../src/lib/site-url";

describe("Gradient Roller", () => {
  test("cada ronda inicia en la superficie que se muestra", () => {
    expect(createGradientRound(1).position).toEqual(GRADIENT_SURFACES[1].start);
    expect(createGradientRound(2).position).toEqual(GRADIENT_SURFACES[2].start);
  });

  test("todas las superficies se pueden completar con su learning rate recomendado", () => {
    for (const [round, surface] of GRADIENT_SURFACES.entries()) {
      let state = createGradientRound(round);
      for (let i = 0; i < 100 && !state.solved && !state.exploded; i += 1) {
        state = {
          ...state,
          ...takeGradientStep(round, state.position, surface.goodLr, state.steps),
        };
      }
      expect(state.exploded).toBe(false);
      expect(state.solved).toBe(true);
    }
  });

  test("valida rondas y detecta pasos inestables", () => {
    for (const surface of GRADIENT_SURFACES) {
      expect(Number.isFinite(surface.gx(surface.start.x, surface.start.y))).toBe(true);
      expect(Number.isFinite(surface.gy(surface.start.x, surface.start.y))).toBe(true);
    }
    expect(() => createGradientRound(99)).toThrow(RangeError);
    expect(() => takeGradientStep(99, { x: 0, y: 0 }, 0.1, 0)).toThrow(RangeError);
    const exploded = takeGradientStep(0, { x: 1, y: 1 }, Number.POSITIVE_INFINITY, 0);
    expect(exploded.exploded).toBe(true);
    expect(exploded.position).toEqual({ x: 1, y: 1 });
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
    expect(sanitizePhase("mastery")).toBe("mastery");
    expect(sanitizePhase("unknown")).toBe("theory");
    expect(sanitizeActiveLevel("math", new Set(["math"]))).toBe("math");
    expect(sanitizeActiveLevel("nivel-inyectado", new Set(["math"]))).toBeNull();
    expect(sanitizeActiveLevel({ id: "math" }, new Set(["math"]))).toBeNull();
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

  test("una política de privacidad que bloquea storage no rompe la portada", () => {
    const blockedStorage = {
      getItem: () => { throw new DOMException("blocked"); },
      setItem: () => { throw new DOMException("blocked"); },
    };
    expect(readBooleanFlag(blockedStorage, "flag", true)).toBe(true);
    expect(writeBooleanFlag(blockedStorage, "flag")).toBe(false);

    const values = new Map<string, string>();
    const availableStorage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
    };
    expect(writeBooleanFlag(availableStorage, "flag")).toBe(true);
    expect(readBooleanFlag(availableStorage, "flag")).toBe(true);
  });
});

describe("URL pública", () => {
  test("normaliza configuración, Vercel y fallback local", () => {
    const configured = process.env.NEXT_PUBLIC_SITE_URL;
    const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    try {
      process.env.NEXT_PUBLIC_SITE_URL = "arcade.example.com/";
      expect(getSiteUrl()).toBe("https://arcade.example.com");

      delete process.env.NEXT_PUBLIC_SITE_URL;
      process.env.VERCEL_PROJECT_PRODUCTION_URL = "https://neural-arcade.vercel.app/";
      expect(getSiteUrl()).toBe("https://neural-arcade.vercel.app");

      delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
      expect(getSiteUrl()).toBe("http://localhost:3000");
    } finally {
      if (configured === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
      else process.env.NEXT_PUBLIC_SITE_URL = configured;
      if (vercel === undefined) delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
      else process.env.VERCEL_PROJECT_PRODUCTION_URL = vercel;
    }
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
