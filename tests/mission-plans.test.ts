import { describe, expect, test } from "bun:test";
import { evaluateBuild } from "../src/app/neural-arcade/build-decision";
import { ALL_LEVELS } from "../src/app/neural-arcade/curriculum";
import { MISSION_PLANS } from "../src/app/neural-arcade/mission-plans";

const MISSION_LEVELS = ALL_LEVELS.filter((level) => level.id !== "math" && level.id !== "tokens");

describe("misiones conceptuales", () => {
  test("cada nivel posterior a la introducción tiene un plan único", () => {
    expect(Object.keys(MISSION_PLANS).sort()).toEqual(MISSION_LEVELS.map((level) => level.id).sort());
  });

  test("cada concepto declarado se explica una sola vez en Descubre", () => {
    for (const level of MISSION_LEVELS) {
      const plan = MISSION_PLANS[level.id];
      expect(plan).toBeDefined();
      expect(plan.levelId).toBe(level.id);
      expect(plan.concepts.map((guide) => guide.concept)).toEqual(level.concepts);
      expect(new Set(plan.concepts.map((guide) => guide.concept)).size).toBe(level.concepts.length);
      for (const guide of plan.concepts) {
        expect(guide.plain.length).toBeGreaterThan(35);
        expect(guide.example.length).toBeGreaterThan(35);
      }
    }
  });

  test("Conecta siempre construye un flujo causal de cuatro pasos", () => {
    for (const plan of Object.values(MISSION_PLANS)) {
      expect(plan.pipeline.steps).toHaveLength(4);
      expect(new Set(plan.pipeline.steps.map((step) => step.label)).size).toBe(4);
      expect(plan.pipeline.steps.every((step) => step.detail.length > 25)).toBe(true);
    }
  });

  test("Experimenta reparte seis señales entre dos zonas equilibradas", () => {
    for (const plan of Object.values(MISSION_PLANS)) {
      expect(plan.sorter.lanes).toHaveLength(2);
      expect(plan.sorter.items).toHaveLength(6);
      expect(plan.sorter.items.filter((item) => item.lane === 0)).toHaveLength(3);
      expect(plan.sorter.items.filter((item) => item.lane === 1)).toHaveLength(3);
      expect(plan.sorter.items.every((item) => item.why.length > 25)).toBe(true);
    }
  });

  test("Diseña tiene un núcleo viable y conserva decisiones opcionales cuando caben", () => {
    for (const plan of Object.values(MISSION_PLANS)) {
      const essential = plan.build.modules.filter((module) => module.essential);
      const essentialCost = essential.reduce((sum, module) => sum + module.cost, 0);
      const coreIndexes = plan.build.modules.flatMap((module, index) => module.essential ? [index] : []);
      const compatibleUpgrade = plan.build.modules.findIndex((module) => !module.essential && module.upgrade !== false && module.cost <= plan.build.budget - essentialCost);
      expect(plan.build.modules).toHaveLength(6);
      expect(essential.length).toBeGreaterThanOrEqual(3);
      expect(essential.length).toBeLessThanOrEqual(4);
      expect(essentialCost).toBeLessThanOrEqual(plan.build.budget);
      expect(plan.build.modules.every((module) => module.cost > 0 && module.why.length > 25)).toBe(true);
      expect(evaluateBuild(plan.build, coreIndexes).status).toBe("success");
      if (compatibleUpgrade >= 0) expect(evaluateBuild(plan.build, [...coreIndexes, compatibleUpgrade]).status).toBe("success");
    }
  });
});
