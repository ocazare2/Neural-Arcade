"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Locale = "es" | "en";

export const SUPPORTED_LOCALES: ReadonlyArray<{
  code: Locale;
  label: string;
  shortLabel: string;
}> = [
  { code: "es", label: "Español", shortLabel: "ES" },
  { code: "en", label: "English", shortLabel: "EN" },
];

export const UI_MESSAGES = {
  es: {
    languageLabel: "Idioma de la interfaz",
    music: "Música",
    musicOn: "Música encendida",
    musicOff: "Música apagada",
    muteAll: "Silenciar música y efectos",
    unmuteAll: "Activar música y efectos",
    tagline: "De matemáticas a sistemas agentic · 26 niveles",
    play: "EMPEZAR A JUGAR",
    continue: "CONTINUAR",
    stars: "estrellas",
    xp: "XP",
    levels: "niveles",
    architect: "ARQUITECTO DE IA",
    allDone: "Has dominado desde tokenización hasta orquestación multi-agente. El siguiente paso: construye tu propio sistema.",
    theoryBlocks: "bloques de teoría",
    demos: "demos",
    interactiveGlossary: "glosario interactivo",
    madeFor: "Hecho con amor para aprender IA jugando",
    aiCredit: "Proyecto creado 100% con inteligencia artificial.",
    resetProgress: "Reiniciar progreso",
    resetTitle: "¿Reiniciar todo el progreso?",
    resetDescription: "Perderás todas tus estrellas, XP y fases completadas. No se puede deshacer.",
    confirmReset: "Sí, reiniciar",
    cancel: "Cancelar",
    back: "Volver",
    level: "NIVEL",
    minute: "min",
    phaseTheory: "Teoría",
    phaseDemo: "Demo",
    phasePractice: "Práctica",
    phaseChallenge: "Reto",
    phaseMastery: "Maestría",
    continueTo: "CONTINUAR A",
    completeLevel: "COMPLETAR NIVEL",
    aiArchitect: "¡ARQUITECTO DE IA!",
    levelComplete: "¡NIVEL COMPLETADO!",
    mastered: "Has dominado",
    allLevelsComplete: "Has completado todos los niveles.",
    retry: "Repetir",
    nextLevel: "Siguiente nivel",
    backToMap: "Volver al mapa",
    howToRead: "Cómo leer este nivel",
    howToReadIntro: "Avanzamos de Básico a Experto. Lee los 4 bloques antes de pasar a la fase Demo.",
    touchBlueTerms: "Toca los términos azules para ver definiciones. Las fórmulas tienen un botón para expandir su explicación.",
    levelGlossary: "Glosario del nivel",
    terms: "términos",
    mastery: "MAESTRÍA",
    essence: "Aquí está la esencia.",
    centralFormula: "Fórmula central",
    proFact: "Dato Pro · frontera actual",
    levelMastered: "¡Nivel dominado!",
    levelMasteredBody: "Vuelve al mapa para desbloquear el siguiente nivel. Puedes repetir el reto cuando quieras para mejorar tus estrellas.",
    paperReference: "PAPER DE REFERENCIA",
    hideExplanation: "Ocultar explicación",
    explainFormula: "Explicar la fórmula",
    basic: "Básico",
    intermediate: "Intermedio",
    advanced: "Avanzado",
    expert: "Experto",
    practiceUnavailable: "Práctica no disponible para este nivel",
    skipToChallenge: "Puedes saltar directamente al Reto.",
    challengeComplete: "Reto completado",
    correctPlural: "correctas",
    error: "error",
    errors: "errores",
    question: "Pregunta",
    of: "de",
    correctFeedback: "✓ Correcto.",
    wrongFeedback: "✗ No exacto.",
    hint: "Pista disponible: revisa la sección de teoría antes de responder.",
    skip: "Saltar →",
    onboarding1: "¡Hola! Soy Neuro. En los próximos minutos vas a entender CÓMO funciona la IA — jugando.",
    onboarding1Button: "¡Vamos!",
    onboarding2: "Vas a construir esto desde cero. Nivel por nivel. Cada nivel es un mini-juego.",
    onboarding2Button: "Genial",
    onboarding3: "Sin teoría aburrida. Sin textos largos. Solo juego. ¿List@?",
    onboarding3Button: "¡A jugar!",
    loadingDemo: "Cargando demo…",
    demoLoadError: "No se pudo cargar la demo",
    reloadToRetry: "Recarga la página para intentarlo de nuevo. Tu progreso está guardado en este dispositivo.",
    practiceIntro: "Práctica con pistas. Estas preguntas no afectan tu puntaje; sirven para prepararte para el reto.",
    continueChallenge: "CONTINUAR AL RETO",
    finalChallenge: "Reto final",
    questions: "preguntas",
    noHints: "sin pistas",
    scoreDetermines: "tu puntaje determina las estrellas",
    continueMastery: "CONTINUAR A MAESTRÍA",
  },
  en: {
    languageLabel: "Interface language",
    music: "Music",
    musicOn: "Music on",
    musicOff: "Music off",
    muteAll: "Mute music and effects",
    unmuteAll: "Enable music and effects",
    tagline: "From math to agentic systems · 26 levels",
    play: "START PLAYING",
    continue: "CONTINUE",
    stars: "stars",
    xp: "XP",
    levels: "levels",
    architect: "AI ARCHITECT",
    allDone: "You mastered everything from tokenization to multi-agent orchestration. Next step: build your own system.",
    theoryBlocks: "theory blocks",
    demos: "demos",
    interactiveGlossary: "interactive glossary",
    madeFor: "Made with love to learn AI through play",
    aiCredit: "Project created 100% with artificial intelligence.",
    resetProgress: "Reset progress",
    resetTitle: "Reset all progress?",
    resetDescription: "You will lose every star, XP point, and completed phase. This cannot be undone.",
    confirmReset: "Yes, reset",
    cancel: "Cancel",
    back: "Back",
    level: "LEVEL",
    minute: "min",
    phaseTheory: "Theory",
    phaseDemo: "Demo",
    phasePractice: "Practice",
    phaseChallenge: "Challenge",
    phaseMastery: "Mastery",
    continueTo: "CONTINUE TO",
    completeLevel: "COMPLETE LEVEL",
    aiArchitect: "AI ARCHITECT!",
    levelComplete: "LEVEL COMPLETE!",
    mastered: "You mastered",
    allLevelsComplete: "You completed every level.",
    retry: "Retry",
    nextLevel: "Next level",
    backToMap: "Back to map",
    howToRead: "How to read this level",
    howToReadIntro: "We move from Basic to Expert. Read all four blocks before continuing to the Demo phase.",
    touchBlueTerms: "Tap blue terms to see their definitions. Formulas include a button that expands their explanation.",
    levelGlossary: "Level glossary",
    terms: "terms",
    mastery: "MASTERY",
    essence: "Here is the essence.",
    centralFormula: "Core formula",
    proFact: "Pro insight · current frontier",
    levelMastered: "Level mastered!",
    levelMasteredBody: "Return to the map to unlock the next level. You can replay the challenge at any time to improve your stars.",
    paperReference: "REFERENCE PAPER",
    hideExplanation: "Hide explanation",
    explainFormula: "Explain the formula",
    basic: "Basic",
    intermediate: "Intermediate",
    advanced: "Advanced",
    expert: "Expert",
    practiceUnavailable: "Practice is unavailable for this level",
    skipToChallenge: "You can continue directly to the Challenge.",
    challengeComplete: "Challenge complete",
    correctPlural: "correct",
    error: "mistake",
    errors: "mistakes",
    question: "Question",
    of: "of",
    correctFeedback: "✓ Correct.",
    wrongFeedback: "✗ Not quite.",
    hint: "Hint available: review the theory section before answering.",
    skip: "Skip →",
    onboarding1: "Hi! I'm Neuro. In the next few minutes, you'll understand HOW AI works — by playing.",
    onboarding1Button: "Let's go!",
    onboarding2: "You will build it from scratch, one level at a time. Every level is a mini-game.",
    onboarding2Button: "Great",
    onboarding3: "No boring theory. No long walls of text. Just play. Ready?",
    onboarding3Button: "Play now!",
    loadingDemo: "Loading demo…",
    demoLoadError: "The demo could not be loaded",
    reloadToRetry: "Reload the page to try again. Your progress is saved on this device.",
    practiceIntro: "Guided practice. These questions do not affect your score; they prepare you for the challenge.",
    continueChallenge: "CONTINUE TO CHALLENGE",
    finalChallenge: "Final challenge",
    questions: "questions",
    noHints: "no hints",
    scoreDetermines: "your score determines the stars",
    continueMastery: "CONTINUE TO MASTERY",
  },
} as const;

export type MessageKey = keyof typeof UI_MESSAGES.es;

export function normalizeLocale(value: string | null | undefined): Locale {
  return value?.toLowerCase().startsWith("en") ? "en" : "es";
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);
const LOCALE_STORAGE_KEY = "neural-arcade-locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    let next: Locale;
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      next = normalizeLocale(stored ?? window.navigator.language);
    } catch {
      next = normalizeLocale(window.navigator.language);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate a browser-only preference after SSR
    setLocaleState(next);
    document.documentElement.lang = next;
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Privacy modes may block storage; the current session still updates.
    }
  }, []);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale,
    t: key => UI_MESSAGES[locale][key],
  }), [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
