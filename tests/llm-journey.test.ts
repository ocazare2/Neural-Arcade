import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { getLLMJourney, LLM_MESSAGE_FLOW, LLM_TRAINING_FLOW } from "../src/app/neural-arcade/llm-journey";

const root = join(import.meta.dir, "..");

describe("mapa del LLM", () => {
  test("mantiene visible la ruta completa del mensaje y la ruta de aprendizaje", () => {
    expect(LLM_MESSAGE_FLOW.map((step) => step.id)).toEqual([
      "text",
      "tokens",
      "ids",
      "embeddings",
      "position",
      "attention",
      "transformer",
      "logits",
      "next-token",
    ]);
    expect(LLM_TRAINING_FLOW.map((step) => step.id)).toEqual([
      "target",
      "loss",
      "gradients",
      "optimizer",
      "weights",
    ]);
    expect(LLM_MESSAGE_FLOW.every((step) => step.plain.length > 20)).toBe(true);
    expect(LLM_TRAINING_FLOW.every((step) => step.plain.length > 20)).toBe(true);
  });

  test("ubica los fundamentos en el mecanismo real sin ocultar la complejidad", () => {
    expect(getLLMJourney("embed")).toMatchObject({
      title: "De un casillero a un mapa aprendido",
      messageStep: "embeddings",
    });
    expect(getLLMJourney("attn")).toMatchObject({ messageStep: "attention" });
    expect(getLLMJourney("trans")).toMatchObject({ messageStep: "transformer" });
    expect(getLLMJourney("gen")).toMatchObject({ messageStep: "next-token" });
    expect(getLLMJourney("backprop")).toMatchObject({ trainingStep: "gradients" });
    expect(getLLMJourney("grad")).toMatchObject({ trainingStep: "optimizer" });
    expect(getLLMJourney("safety")).toBeUndefined();
  });

  test("la misión muestra el mapa antes de jugar los fundamentos", async () => {
    const missions = await Bun.file(join(root, "src/app/neural-arcade/components/MissionLevel.tsx")).text();

    expect(missions).toContain("LLMJourneyMap");
    expect(missions).toContain("getLLMJourney");
  });
});
