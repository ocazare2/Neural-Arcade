import type { LevelMeta, Phase, TheoryBlock } from "./types";

const LEARNING_PHASES = ["theory", "demo", "practice", "challenge"] as const satisfies readonly Phase[];

type LearningPhase = (typeof LEARNING_PHASES)[number];

type LearningGuidance = {
  question: string;
  action: string;
};

const GUIDANCE: Record<LearningPhase, LearningGuidance> = {
  theory: {
    question: "¿Qué entra, qué sale y para qué sirve esta pieza en un ejemplo que puedas ver?",
    action: "Primero descríbela con tus palabras; después conserva su nombre técnico y su modelo exacto.",
  },
  demo: {
    question: "Si cambias una pieza, ¿qué ocurre justo después y por qué?",
    action: "Sigue una sola señal en orden y predice el resultado antes de moverla.",
  },
  practice: {
    question: "¿Qué detalle pequeño cambia una respuesta que parecía obvia?",
    action: "Compara qué hace cada señal, no solo cómo suena su nombre técnico.",
  },
  challenge: {
    question: "¿Qué no puede faltar y qué mejora vale la pena con un límite real?",
    action: "Haz funcionar primero el núcleo; después añade solo mejoras que cambien el resultado.",
  },
};

export type LearningRung = TheoryBlock & {
  phase: LearningPhase;
  step: 1 | 2 | 3 | 4;
  question: string;
  action: string;
};

function getTheoryBlock(level: LevelMeta, index: number): TheoryBlock {
  const block = level.theory[index] ?? level.theory.at(-1);
  if (!block) throw new Error(`El nivel ${level.id} necesita teoría para la escalera pedagógica.`);
  return block;
}

export function getLearningRung(level: LevelMeta, phase: LearningPhase): LearningRung {
  const index = LEARNING_PHASES.indexOf(phase);
  const block = getTheoryBlock(level, index);
  const guidance = GUIDANCE[phase];
  return {
    ...block,
    phase,
    step: (index + 1) as LearningRung["step"],
    question: guidance.question,
    action: guidance.action,
  };
}

export function getLearningLadder(level: LevelMeta): LearningRung[] {
  return LEARNING_PHASES.map((phase) => getLearningRung(level, phase));
}
