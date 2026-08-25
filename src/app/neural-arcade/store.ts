"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Phase, ProgressMap } from "./types";

// ── Defensive validation layer ─────────────────────────────
// Sanitizes state loaded from localStorage. Prevents corruption
// from malformed JSON, impossible values, or malicious injection.
const VALID_PHASES: Phase[] = ["theory", "demo", "practice", "challenge", "mastery"];

function sanitizeStars(n: unknown): number {
  if (typeof n !== "number" || !isFinite(n) || n < 0) return 0;
  return Math.min(3, Math.max(0, Math.round(n)));
}

function sanitizeXp(n: unknown): number {
  if (typeof n !== "number" || !isFinite(n) || n < 0) return 0;
  return Math.min(1e9, Math.floor(n)); // cap at 1B to prevent overflow
}

function sanitizeAttempts(n: unknown): number {
  if (typeof n !== "number" || !isFinite(n) || n < 0) return 0;
  return Math.min(1e6, Math.floor(n));
}

function sanitizePhase(p: unknown): Phase {
  if (typeof p === "string" && VALID_PHASES.includes(p as Phase)) return p as Phase;
  return "theory";
}

function sanitizeProgress(raw: unknown): ProgressMap {
  if (typeof raw !== "object" || raw === null) return {};
  const out: ProgressMap = {};
  const obj = raw as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    // Reject prototype-pollution attempts
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
    const val = obj[key];
    if (typeof val !== "object" || val === null) continue;
    const v = val as Record<string, unknown>;
    out[key] = {
      stars: sanitizeStars(v.stars),
      phasesDone: Array.isArray(v.phasesDone)
        ? (v.phasesDone as unknown[]).filter((p): p is Phase =>
            typeof p === "string" && VALID_PHASES.includes(p as Phase)
          )
        : [],
      attempts: sanitizeAttempts(v.attempts),
      completedAt: typeof v.completedAt === "string" ? v.completedAt : undefined,
    };
  }
  return out;
}

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

      openLevel: (id) => set({ activeLevel: id, activePhase: "theory" }),
      closeLevel: () => set({ activeLevel: null, activePhase: "theory" }),
      setPhase: (p) => set({ activePhase: sanitizePhase(p) }),

      completePhase: (levelId, phase, stars) => {
        const cur = get().progress[levelId] ?? {
          stars: 0,
          phasesDone: [] as Phase[],
          attempts: 0,
        };
        const phasesDone = cur.phasesDone.includes(phase)
          ? cur.phasesDone
          : [...cur.phasesDone, phase];
        const newStars = stars != null ? Math.max(cur.stars, sanitizeStars(stars)) : cur.stars;
        const isFirstComplete =
          phase === "challenge" && !cur.phasesDone.includes("challenge");
        const xpGain = stars != null ? 50 + sanitizeStars(stars) * 20 : 25;

        set({
          progress: {
            ...get().progress,
            [levelId]: {
              stars: newStars,
              phasesDone,
              attempts:
                phase === "challenge" && isFirstComplete
                  ? cur.attempts + 1
                  : cur.attempts,
              completedAt:
                isFirstComplete && !cur.completedAt
                  ? new Date().toISOString()
                  : cur.completedAt,
            },
          },
          xp: sanitizeXp(get().xp + (isFirstComplete ? xpGain : stars ? xpGain : 0)),
        });
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
          progress: sanitizeProgress(p.progress),
          xp: sanitizeXp(p.xp),
          activeLevel: typeof p.activeLevel === "string" ? p.activeLevel : null,
          activePhase: sanitizePhase(p.activePhase),
        };
      },
    }
  )
);
