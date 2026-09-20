import { describe, expect, test } from "bun:test";
import {
  applyPhaseCompletion,
  sanitizeActiveLevel,
  sanitizePhase,
  sanitizeProgress,
} from "../src/app/neural-arcade/progress";
import { recoverPersistedArcadeState } from "../src/app/neural-arcade/recovery";
import { readBooleanFlag, writeBooleanFlag } from "../src/app/neural-arcade/storage";
import { getSiteUrl } from "../src/lib/site-url";

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
