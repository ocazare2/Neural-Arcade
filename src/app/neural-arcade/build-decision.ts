import type { BuildModule, BuildPlan } from "./mission-types";

export type BuildDecision =
  | { status: "over-budget"; cost: number; budget: number }
  | { status: "missing-core"; cost: number; missing: BuildModule[] }
  | { status: "success"; cost: number; spare: number; upgrades: BuildModule[] };

/**
 * Evaluates a design as an engineering decision: the essential core must be
 * present, the budget cannot be exceeded, and compatible improvements are
 * welcome rather than treated as a wrong answer.
 */
export function evaluateBuild(build: BuildPlan, selectedIndices: ReadonlySet<number> | readonly number[]): BuildDecision {
  const selected = selectedIndices instanceof Set ? selectedIndices : new Set(selectedIndices);
  const selectedModules = build.modules.filter((_, index) => selected.has(index));
  const cost = selectedModules.reduce((sum, module) => sum + module.cost, 0);

  if (cost > build.budget) return { status: "over-budget", cost, budget: build.budget };

  const missing = build.modules.filter((module, index) => module.essential && !selected.has(index));
  if (missing.length > 0) return { status: "missing-core", cost, missing };

  const upgrades = selectedModules.filter((module) => !module.essential);
  return { status: "success", cost, spare: build.budget - cost, upgrades };
}
