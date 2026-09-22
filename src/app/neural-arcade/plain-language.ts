import type { MissionPlan } from "./mission-types";

export type PlainLanguagePhase = "theory" | "demo" | "practice" | "challenge";

export interface PlainLanguageLayer {
  phase: PlainLanguagePhase;
  heading: string;
  technicalTerm: string;
  explanation: string;
  example: string;
}

function conceptFor(plan: MissionPlan, index: number) {
  const concept = plan.concepts[index] ?? plan.concepts.at(-1);
  if (!concept) throw new Error(`La misión ${plan.levelId} necesita al menos un concepto explicado.`);
  return concept;
}

function pipelineExample(plan: MissionPlan) {
  return plan.pipeline.steps
    .map((step, index) => `${index + 1}. ${step.label}: ${step.detail}`)
    .join(" ");
}

function sorterExample(plan: MissionPlan) {
  const [firstLane, secondLane] = plan.sorter.lanes;
  return `${firstLane.label}: ${firstLane.description} ${secondLane.label}: ${secondLane.description}`;
}

function buildExample(plan: MissionPlan) {
  const core = plan.build.modules.filter((module) => module.essential).map((module) => module.label);
  return `El núcleo comprobable reúne ${core.join(", ")}. Las demás piezas solo se añaden si mejoran la misión sin romper el límite de ${plan.build.budget} fichas.`;
}

/**
 * A plain-language doorway into an exact technical layer. It does not replace
 * the original theory or formula: it gives the player a concrete handle first.
 */
export function getPlainLanguageLayer(plan: MissionPlan, phase: PlainLanguagePhase): PlainLanguageLayer {
  if (phase === "theory") {
    const concept = conceptFor(plan, 0);
    return {
      phase,
      heading: "Primero, míralo en algo concreto",
      technicalTerm: concept.concept,
      explanation: concept.plain,
      example: concept.example,
    };
  }

  if (phase === "demo") {
    const concept = conceptFor(plan, 1);
    return {
      phase,
      heading: "Ahora sigue un cambio a la vez",
      technicalTerm: concept.concept,
      explanation: plan.pipeline.instruction,
      example: pipelineExample(plan),
    };
  }

  if (phase === "practice") {
    const concept = conceptFor(plan, 2);
    return {
      phase,
      heading: "Comprueba qué detalle cambia el resultado",
      technicalTerm: concept.concept,
      explanation: plan.sorter.instruction,
      example: sorterExample(plan),
    };
  }

  const concept = conceptFor(plan, 3);
  return {
    phase,
    heading: "Usa el modelo para decidir",
    technicalTerm: concept.concept,
    explanation: plan.build.brief,
    example: buildExample(plan),
  };
}
