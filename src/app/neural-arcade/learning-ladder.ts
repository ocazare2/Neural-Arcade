import type { LevelMeta, Phase, TheoryBlock } from "./types";

const LEARNING_PHASES = ["theory", "demo", "practice", "challenge"] as const satisfies readonly Phase[];

type LearningPhase = (typeof LEARNING_PHASES)[number];

type LearningGuidance = {
  question: string;
  action: string;
};

const GUIDANCE: Record<LearningPhase, LearningGuidance> = {
  theory: {
    question: "¿Qué representa esta pieza y qué problema resuelve antes de intentar usarla?",
    action: "Nombra las entradas, la transformación y la salida en un ejemplo pequeño antes de jugar.",
  },
  demo: {
    question: "¿Qué cambia en cada paso y qué resultado produce ese cambio en el sistema?",
    action: "Sigue el mecanismo en orden y predice qué información debe existir al terminar cada estación.",
  },
  practice: {
    question: "¿Qué supuesto, límite o confusión frecuente cambia la respuesta aparentemente obvia?",
    action: "Distingue las señales parecidas por su función técnica, no solo por cómo suenan sus nombres.",
  },
  challenge: {
    question: "¿Qué decisión conserva lo esencial cuando hay presupuesto, costo o riesgo limitado?",
    action: "Construye primero el núcleo verificable; usa el margen restante para mejoras que realmente aporten valor.",
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
