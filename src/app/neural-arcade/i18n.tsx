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
    replayJourney: "VOLVER A JUGAR",
    beginnerInvitation: "Empieza moviendo un robot. Aprende una idea a la vez.",
    continue: "CONTINUAR",
    stars: "estrellas",
    xp: "XP",
    levels: "niveles",
    architect: "ARQUITECTO DE IA",
    allDone: "Has dominado desde tokenización hasta orquestación multi-agente. El siguiente paso: construye tu propio sistema.",
    madeFor: "Hecho con amor para aprender IA jugando",
    aiCredit: "Proyecto creado 100% con inteligencia artificial.",
    resetProgress: "Reiniciar progreso",
    resetTitle: "¿Reiniciar todo el progreso?",
    resetDescription: "Perderás todas tus estrellas, XP y misiones completadas. No se puede deshacer.",
    confirmReset: "Sí, reiniciar",
    cancel: "Cancelar",
    back: "Volver",
    level: "NIVEL",
    minute: "min",
    missionProgress: "Progreso de las misiones",
    phaseTheory: "Descubre",
    phaseDemo: "Conecta",
    phasePractice: "Experimenta",
    phaseChallenge: "Construye",
    phaseMastery: "Resumen",
    continueTo: "CONTINUAR A",
    completeLevel: "COMPLETAR NIVEL",
    aiArchitect: "¡ARQUITECTO DE IA!",
    levelComplete: "¡NIVEL COMPLETADO!",
    mastered: "Has dominado",
    allLevelsComplete: "Has completado todos los niveles.",
    retry: "Repetir",
    nextLevel: "Siguiente nivel",
    backToMap: "Volver al mapa",
    skip: "Saltar →",
    onboarding1: "¡Hola! Soy Neuro. En este recorrido vas a entender CÓMO funciona la IA — jugando.",
    onboarding1Button: "¡Vamos!",
    onboarding2: "Empezamos moviendo un robot y dibujando con números. Cada misión te enseña una idea mientras la pruebas.",
    onboarding2Button: "Genial",
    onboarding3: "Puedes probar sin perder vidas. Si quieres saber más, abre la explicación debajo del juego. ¿List@?",
    onboarding3Button: "¡A jugar!",
    loadingDemo: "Cargando misiones…",
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
    replayJourney: "PLAY AGAIN",
    beginnerInvitation: "Start by moving a robot. Learn one idea at a time.",
    continue: "CONTINUE",
    stars: "stars",
    xp: "XP",
    levels: "levels",
    architect: "AI ARCHITECT",
    allDone: "You mastered everything from tokenization to multi-agent orchestration. Next step: build your own system.",
    madeFor: "Made with love to learn AI through play",
    aiCredit: "Project created 100% with artificial intelligence.",
    resetProgress: "Reset progress",
    resetTitle: "Reset all progress?",
    resetDescription: "You will lose every star, XP point, and completed mission. This cannot be undone.",
    confirmReset: "Yes, reset",
    cancel: "Cancel",
    back: "Back",
    level: "LEVEL",
    minute: "min",
    missionProgress: "Mission progress",
    phaseTheory: "Discover",
    phaseDemo: "Connect",
    phasePractice: "Experiment",
    phaseChallenge: "Build",
    phaseMastery: "Recap",
    continueTo: "CONTINUE TO",
    completeLevel: "COMPLETE LEVEL",
    aiArchitect: "AI ARCHITECT!",
    levelComplete: "LEVEL COMPLETE!",
    mastered: "You mastered",
    allLevelsComplete: "You completed every level.",
    retry: "Retry",
    nextLevel: "Next level",
    backToMap: "Back to map",
    skip: "Skip →",
    onboarding1: "Hi! I'm Neuro. Along this journey, you'll understand HOW AI works — by playing.",
    onboarding1Button: "Let's go!",
    onboarding2: "Start by moving a robot and drawing with numbers. Each mission teaches one idea while you try it.",
    onboarding2Button: "Great",
    onboarding3: "Experiment without losing lives. Want to know more? Open the explanation below the game. Ready?",
    onboarding3Button: "Play now!",
    loadingDemo: "Loading missions…",
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
