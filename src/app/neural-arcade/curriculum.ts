import { LEVELS } from "./data";
import { EXTRA_LEVELS } from "./extra-levels";
import { MATH_LEVEL } from "./math-primer";
import type { LevelMeta } from "./types";

type CurriculumLocale = "es" | "en";
type LocalizedCurriculumText = Readonly<Record<CurriculumLocale, string>>;

/**
 * La secuencia canónica del curso. Los IDs son estables para conservar el
 * progreso guardado; la posición pedagógica se resuelve únicamente aquí.
 */
export const CURRICULUM_LEVEL_ORDER = [
  "math",
  "tokens",
  "embed",
  "neuron",
  "backprop",
  "grad",
  "attn",
  "trans",
  "gen",
  "hardware",
  "scaling",
  "posttraining",
  "align",
  "inference",
  "modern",
  "multimodal",
  "context",
  "rag",
  "memory",
  "tools",
  "mcp",
  "skills",
  "reasoning",
  "agent",
  "orch",
  "safety",
] as const;

type CurriculumLevelId = (typeof CURRICULUM_LEVEL_ORDER)[number];
type CurriculumChapterId =
  | "fundamentos"
  | "aprendizaje"
  | "motor-llm"
  | "modelo-producto"
  | "chat-agente";

export interface CurriculumChapter {
  id: CurriculumChapterId;
  levelIds: readonly CurriculumLevelId[];
  title: LocalizedCurriculumText;
  goal: LocalizedCurriculumText;
  bridge: LocalizedCurriculumText;
}

/** Capítulos narrativos que explican qué se construye y por qué sigue lo siguiente. */
export const CURRICULUM_CHAPTERS = [
  {
    id: "fundamentos",
    levelIds: ["math", "tokens", "embed"],
    title: {
      es: "Fundamentos del lenguaje",
      en: "Language foundations",
    },
    goal: {
      es: "Convertir texto en piezas y coordenadas numéricas que una máquina pueda comparar.",
      en: "Turn text into numeric pieces and coordinates that a machine can compare.",
    },
    bridge: {
      es: "Con el lenguaje convertido en números, ya podemos construir una red que aprenda de ellos.",
      en: "Once language is represented as numbers, we can build a network that learns from them.",
    },
  },
  {
    id: "aprendizaje",
    levelIds: ["neuron", "backprop", "grad"],
    title: {
      es: "Cómo aprende una red",
      en: "How a network learns",
    },
    goal: {
      es: "Entender cómo una neurona decide, cómo se reparte el error y cómo se ajustan sus parámetros.",
      en: "Understand how a neuron decides, how error flows backward, and how its parameters improve.",
    },
    bridge: {
      es: "Ahora conectaremos esas piezas para que muchas palabras puedan influirse entre sí.",
      en: "Next, we connect those pieces so many words can influence one another.",
    },
  },
  {
    id: "motor-llm",
    levelIds: ["attn", "trans", "gen"],
    title: {
      es: "El motor de un LLM",
      en: "The LLM engine",
    },
    goal: {
      es: "Construir el recorrido desde la atención hasta un transformer que predice el siguiente token.",
      en: "Build the path from attention to a transformer that predicts the next token.",
    },
    bridge: {
      es: "Ya existe un motor generativo; falta entrenarlo a escala y convertirlo en un producto útil.",
      en: "The generative engine now works; it still needs scale, refinement, and a useful product form.",
    },
  },
  {
    id: "modelo-producto",
    levelIds: ["hardware", "scaling", "posttraining", "align", "inference", "modern", "multimodal"],
    title: {
      es: "Del modelo al producto",
      en: "From model to product",
    },
    goal: {
      es: "Descubrir cómo se entrena, mejora, sirve y amplía un modelo moderno para trabajar con varios medios.",
      en: "Discover how a modern model is trained, refined, served, and expanded across multiple media.",
    },
    bridge: {
      es: "Con un modelo listo para conversar, añadiremos contexto, conocimiento, herramientas y autonomía.",
      en: "With a conversation-ready model, we can add context, knowledge, tools, and autonomy.",
    },
  },
  {
    id: "chat-agente",
    levelIds: ["context", "rag", "memory", "tools", "mcp", "skills", "reasoning", "agent", "orch", "safety"],
    title: {
      es: "Del chat al agente",
      en: "From chat to agent",
    },
    goal: {
      es: "Transformar un chat en un sistema que recuerda, consulta, razona, actúa y coordina con seguridad.",
      en: "Turn a chat into a system that remembers, retrieves, reasons, acts, and coordinates safely.",
    },
    bridge: {
      es: "La última misión une todo el recorrido: crear agentes útiles sin perder control, privacidad ni seguridad.",
      en: "The final mission unites the journey: build useful agents without losing control, privacy, or safety.",
    },
  },
] as const satisfies readonly CurriculumChapter[];

const SOURCE_LEVELS: readonly LevelMeta[] = [MATH_LEVEL, ...LEVELS, ...EXTRA_LEVELS];
const SOURCE_LEVELS_BY_ID = new Map(SOURCE_LEVELS.map((level) => [level.id, level]));

if (SOURCE_LEVELS_BY_ID.size !== SOURCE_LEVELS.length) {
  throw new Error("El currículo contiene IDs de nivel duplicados.");
}

const orderedIds = new Set<string>(CURRICULUM_LEVEL_ORDER);
const unpublishedIds = SOURCE_LEVELS.filter((level) => !orderedIds.has(level.id)).map((level) => level.id);

if (unpublishedIds.length > 0 || orderedIds.size !== SOURCE_LEVELS.length) {
  throw new Error(`La secuencia del currículo no cubre todos los niveles: ${unpublishedIds.join(", ") || "faltan niveles"}.`);
}

/** Fuente única y ordenada del currículo publicado. */
export const ALL_LEVELS: LevelMeta[] = CURRICULUM_LEVEL_ORDER.map((id, position) => {
  const source = SOURCE_LEVELS_BY_ID.get(id);

  if (!source) {
    throw new Error(`No existe metadata para el nivel \"${id}\".`);
  }

  return { ...source, index: position - 1 };
});

/** Devuelve la posición visual base cero; -1 indica que el ID no está publicado. */
export function getLevelPosition(levelId: string): number {
  return ALL_LEVELS.findIndex((level) => level.id === levelId);
}

export function getPreviousLevel(levelId: string): LevelMeta | undefined {
  const position = getLevelPosition(levelId);
  return position > 0 ? ALL_LEVELS[position - 1] : undefined;
}

export function getNextLevel(levelId: string): LevelMeta | undefined {
  const position = getLevelPosition(levelId);
  return position >= 0 ? ALL_LEVELS[position + 1] : undefined;
}

export function getChapterForLevel(levelId: string): CurriculumChapter | undefined {
  return CURRICULUM_CHAPTERS.find((chapter) => chapter.levelIds.some((id) => id === levelId));
}
