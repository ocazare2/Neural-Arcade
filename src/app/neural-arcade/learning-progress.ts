import type { Phase, ProgressMap } from "./types";

const LEARNING_PHASES: readonly Phase[] = [
  "theory",
  "demo",
  "practice",
  "challenge",
  "mastery",
];

const PLAYABLE_PHASES = LEARNING_PHASES.slice(0, 4);

export function isLevelComplete(progress: ProgressMap, levelId: string): boolean {
  return progress[levelId]?.phasesDone.includes("challenge") ?? false;
}

export function hasLevelProgress(progress: ProgressMap, levelId: string): boolean {
  const entry = progress[levelId];
  return Boolean(entry && (entry.phasesDone.length > 0 || entry.attempts > 0 || entry.stars > 0));
}

export function getResumePhase(progress: ProgressMap, levelId: string): Phase {
  const done = progress[levelId]?.phasesDone ?? [];
  if (done.includes("challenge")) {
    return done.includes("mastery") ? "theory" : "mastery";
  }
  return PLAYABLE_PHASES.find((phase) => !done.includes(phase)) ?? "challenge";
}

export function getMissionProgress(progress: ProgressMap, levelId: string): {
  completed: number;
  total: number;
} {
  const done = progress[levelId]?.phasesDone ?? [];
  return {
    completed: PLAYABLE_PHASES.filter((phase) => done.includes(phase)).length,
    total: PLAYABLE_PHASES.length,
  };
}

export function isLevelUnlocked(
  progress: ProgressMap,
  orderedLevelIds: readonly string[],
  position: number,
): boolean {
  if (position <= 0) return true;
  const levelId = orderedLevelIds[position];
  const previousId = orderedLevelIds[position - 1];
  return hasLevelProgress(progress, levelId) || isLevelComplete(progress, previousId);
}
