import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { ALL_LEVELS } from "../src/app/neural-arcade/curriculum";
import { getLearningLadder, getLearningRung } from "../src/app/neural-arcade/learning-ladder";

const root = join(import.meta.dir, "..");
const advancedLevels = ALL_LEVELS.filter((level) => level.id !== "math" && level.id !== "tokens");

describe("progresión pedagógica", () => {
  test("convierte la teoría de cada nivel avanzado en una escalera visible de básico a experto", () => {
    for (const level of advancedLevels) {
      const ladder = getLearningLadder(level);

      expect(ladder).toHaveLength(4);
      expect(ladder.map((rung) => rung.level)).toEqual(["Básico", "Intermedio", "Avanzado", "Experto"]);
      expect(ladder.map((rung) => rung.phase)).toEqual(["theory", "demo", "practice", "challenge"]);
      expect(ladder.every((rung) => rung.question.length > 35 && rung.action.length > 35)).toBe(true);
    }
  });

  test("la interfaz entrega la capa técnica de la fase actual antes del minijuego", async () => {
    const missions = await Bun.file(join(root, "src/app/neural-arcade/components/MissionLevel.tsx")).text();
    const embedding = ALL_LEVELS.find((level) => level.id === "embed");

    expect(embedding).toBeDefined();
    expect(getLearningRung(embedding!, "practice")).toMatchObject({
      level: "Avanzado",
      title: "Word2vec y la famosa analogía Rey − Hombre + Mujer ≈ Reina",
    });
    expect(missions).toContain("LearningLadder");
    expect(missions).toContain("getLearningRung");
    expect(missions).not.toContain("OptionalTheory");
  });

  test("no enseña estimaciones de cómputo con un error de tres órdenes de magnitud", () => {
    const hardware = ALL_LEVELS.find((level) => level.id === "hardware");

    expect(hardware?.theory[3]?.body).toContain("32,700 horas");
    expect(hardware?.theory[3]?.body).toContain("~1,000 GPUs");
  });
});
