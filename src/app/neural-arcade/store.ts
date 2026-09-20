"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Phase, ProgressMap } from "./types";
import { ALL_LEVELS } from "./curriculum";
import {
  applyPhaseCompletion,
  sanitizeActiveLevel,
  sanitizePhase,
  sanitizeProgress,
  sanitizeXp,
} from "./progress";
import { getResumePhase } from "./learning-progress";

const PUBLISHED_LEVEL_IDS = new Set(ALL_LEVELS.map((level) => level.id));

interface ArcadeState {
  progress: ProgressMap;
  xp: number;
  activeLevel: string | null;
  activePhase: Phase;

  openLevel: (id: string) => void;
  closeLevel: () => void;
  setPhase: (p: Phase) => void;
  completePhase: (levelId: string, phase: Phase, stars?: number) => void;
  reset: () => void;
}

export const useArcade = create<ArcadeState>()(
  persist(
    (set, get) => ({
      progress: {},
      xp: 0,
      activeLevel: null,
      activePhase: "theory",

      openLevel: (id) => {
        const activeLevel = sanitizeActiveLevel(id, PUBLISHED_LEVEL_IDS);
        set({
          activeLevel,
          activePhase: activeLevel ? getResumePhase(get().progress, activeLevel) : "theory",
        });
      },
      closeLevel: () => set({ activeLevel: null, activePhase: "theory" }),
      setPhase: (p) => set({ activePhase: sanitizePhase(p) }),

      completePhase: (levelId, phase, stars) => {
        if (!PUBLISHED_LEVEL_IDS.has(levelId)) return;
        set(applyPhaseCompletion(
          { progress: get().progress, xp: get().xp },
          levelId,
          phase,
          stars,
        ));
      },

      reset: () => set({ progress: {}, xp: 0, activeLevel: null, activePhase: "theory" }),
    }),
    {
      name: "neural-arcade-v2",
      // Sanitize state on hydration — defensive against corrupted localStorage
      merge: (persisted, current) => {
        if (typeof persisted !== "object" || persisted === null) return current;
        const p = persisted as Record<string, unknown>;
        return {
          ...current,
          progress: sanitizeProgress(p.progress, PUBLISHED_LEVEL_IDS),
          xp: sanitizeXp(p.xp),
          activeLevel: sanitizeActiveLevel(p.activeLevel, PUBLISHED_LEVEL_IDS),
          activePhase: sanitizePhase(p.activePhase),
        };
      },
    }
  )
);
