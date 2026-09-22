import { describe, expect, test } from "bun:test";
import { evaluateBuild } from "../src/app/neural-arcade/build-decision";
import { MISSION_PLANS } from "../src/app/neural-arcade/mission-plans";

const embeddingBuild = MISSION_PLANS.embed.build;
const core = embeddingBuild.modules.flatMap((module, index) => module.essential ? [index] : []);
const compatibleUpgrade = embeddingBuild.modules.findIndex((module) => !module.essential && module.cost <= embeddingBuild.budget - 6);

describe("decisiones de arquitectura", () => {
  test("acepta un núcleo mínimo verificable sin obligar a gastar el presupuesto", () => {
    expect(evaluateBuild(embeddingBuild, core)).toMatchObject({
      status: "success",
      cost: 6,
      spare: 2,
      upgrades: [],
    });
  });

  test("acepta una mejora opcional compatible y explica cuándo falta una pieza crítica", () => {
    expect(evaluateBuild(embeddingBuild, [...core, compatibleUpgrade])).toMatchObject({
      status: "success",
      cost: 7,
      spare: 1,
      upgrades: [embeddingBuild.modules[compatibleUpgrade]],
    });
    expect(evaluateBuild(embeddingBuild, [0, 1])).toMatchObject({
      status: "missing-core",
      missing: [embeddingBuild.modules[2]],
    });
  });

  test("rechaza un diseño que supera la restricción aunque sus piezas sean útiles", () => {
    expect(evaluateBuild(embeddingBuild, [...core, 5])).toMatchObject({
      status: "over-budget",
      cost: 9,
      budget: 8,
    });
  });

  test("no confunde una promesa del modelo con una mejora de seguridad", () => {
    const safetyBuild = MISSION_PLANS.safety.build;
    const safetyCore = safetyBuild.modules.flatMap((module, index) => module.essential ? [index] : []);
    const promise = safetyBuild.modules.findIndex((module) => module.label === "Promesa de portarse bien");

    expect(evaluateBuild(safetyBuild, [...safetyCore, promise])).toMatchObject({
      status: "irrelevant",
      unsuitable: [safetyBuild.modules[promise]],
    });
  });
});
