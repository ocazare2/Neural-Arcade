import { describe, expect, test } from "bun:test";
import { MISSION_PLANS } from "../src/app/neural-arcade/mission-plans";
import { getPlainLanguageLayer } from "../src/app/neural-arcade/plain-language";

const phases = ["theory", "demo", "practice", "challenge"] as const;

describe("explicaciones sin jerga", () => {
  test("cada misión avanzada traduce su idea antes de pedir vocabulario técnico", () => {
    for (const plan of Object.values(MISSION_PLANS)) {
      for (const phase of phases) {
        const layer = getPlainLanguageLayer(plan, phase);

        expect(layer.phase).toBe(phase);
        expect(layer.heading.length).toBeGreaterThan(8);
        expect(layer.explanation.length).toBeGreaterThan(45);
        expect(layer.example.length).toBeGreaterThan(45);
        expect(layer.technicalTerm.length).toBeGreaterThan(2);
      }
    }
  });

  test("mantiene el término y el ejemplo exactos mientras aclara embeddings", () => {
    const embedding = MISSION_PLANS.embed;
    const layer = getPlainLanguageLayer(embedding, "theory");

    expect(layer).toMatchObject({
      phase: "theory",
      technicalTerm: "Vector de embedding",
      explanation: embedding.concepts[0]?.plain,
      example: embedding.concepts[0]?.example,
    });
  });

  test("conecta mecanismo, comprobación y decisión con el reto que sigue", () => {
    const attention = MISSION_PLANS.attn;

    expect(getPlainLanguageLayer(attention, "demo").explanation).toContain(attention.pipeline.instruction);
    expect(getPlainLanguageLayer(attention, "practice").explanation).toContain(attention.sorter.instruction);
    expect(getPlainLanguageLayer(attention, "challenge").explanation).toContain(attention.build.brief);
  });
});
