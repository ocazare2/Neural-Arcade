// ═══════════════════════════════════════════════════════════
// NEURAL ARCADE — Tipos del sistema educativo de IA
// ═══════════════════════════════════════════════════════════

export type Phase = "theory" | "demo" | "practice" | "challenge" | "mastery";

type Difficulty = "Básico" | "Intermedio" | "Avanzado" | "Experto";

interface GlossaryTerm {
  term: string;
  symbol?: string;
  definition: string;
  example?: string;
}

interface TheoryBlock {
  title: string;
  level: Difficulty;
  body: string;
  formula?: string;
  formulaExplain?: string;
}

export interface LevelMeta {
  id: string;
  index: number;
  title: string;
  icon: string;
  color: string;
  tag: string;
  summary: string;
  estimatedMin: number;
  concepts: string[];
  paperRef?: { title: string; year: number; authors: string };
  theory: TheoryBlock[];
  glossary: GlossaryTerm[];
}

interface LevelProgress {
  stars: number;
  phasesDone: Phase[];
  attempts: number;
  completedAt?: string;
}

export type ProgressMap = Record<string, LevelProgress>;
