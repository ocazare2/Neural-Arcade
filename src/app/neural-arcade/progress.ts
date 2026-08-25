import type { Phase, ProgressMap } from "./types";

export const VALID_PHASES: readonly Phase[] = [
  "theory",
  "demo",
  "practice",
  "challenge",
  "mastery",
];

export function sanitizeStars(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return 0;
  return Math.min(3, Math.round(value));
}

export function sanitizeXp(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return 0;
  return Math.min(1e9, Math.floor(value));
}

function sanitizeAttempts(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return 0;
  return Math.min(1e6, Math.floor(value));
}

export function sanitizePhase(value: unknown): Phase {
  if (typeof value === "string" && VALID_PHASES.includes(value as Phase)) return value as Phase;
  return "theory";
}

export function sanitizeProgress(
  raw: unknown,
  validLevelIds?: ReadonlySet<string>,
): ProgressMap {
  if (typeof raw !== "object" || raw === null) return {};

  const output: ProgressMap = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (
      key === "__proto__" ||
      key === "constructor" ||
      key === "prototype" ||
      (validLevelIds && !validLevelIds.has(key)) ||
      typeof value !== "object" ||
      value === null
    ) continue;

    const candidate = value as Record<string, unknown>;
    const phasesDone = Array.isArray(candidate.phasesDone)
      ? [...new Set(candidate.phasesDone.filter((phase): phase is Phase =>
          typeof phase === "string" && VALID_PHASES.includes(phase as Phase),
        ))]
      : [];

    output[key] = {
      stars: sanitizeStars(candidate.stars),
      phasesDone,
      attempts: sanitizeAttempts(candidate.attempts),
      completedAt: typeof candidate.completedAt === "string" ? candidate.completedAt : undefined,
    };
  }
  return output;
}

interface ProgressState {
  progress: ProgressMap;
  xp: number;
}

export function applyPhaseCompletion(
  state: ProgressState,
  levelId: string,
  phase: Phase,
  stars?: number,
  completedAt = new Date().toISOString(),
): ProgressState {
  const current = state.progress[levelId] ?? {
    stars: 0,
    phasesDone: [] as Phase[],
    attempts: 0,
  };
  const scoredChallenge = phase === "challenge" && stars != null;
  const firstChallengeCompletion = scoredChallenge && !current.phasesDone.includes("challenge");
  const shouldCompletePhase = phase !== "challenge" || scoredChallenge;
  const phasesDone = shouldCompletePhase && !current.phasesDone.includes(phase)
    ? [...current.phasesDone, phase]
    : current.phasesDone;
  const safeStars = stars == null ? 0 : sanitizeStars(stars);

  return {
    progress: {
      ...state.progress,
      [levelId]: {
        stars: Math.max(current.stars, safeStars),
        phasesDone,
        attempts: current.attempts + (scoredChallenge ? 1 : 0),
        completedAt: firstChallengeCompletion && !current.completedAt
          ? completedAt
          : current.completedAt,
      },
    },
    xp: sanitizeXp(
      state.xp + (firstChallengeCompletion ? 50 + safeStars * 20 : 0),
    ),
  };
}
