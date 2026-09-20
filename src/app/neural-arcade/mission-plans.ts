import type { MissionPlan } from "./mission-types";
import { CORE_MISSION_PLANS } from "./mission-plans-core";
import { SYSTEM_MISSION_PLANS } from "./mission-plans-systems";

const plans = [...CORE_MISSION_PLANS, ...SYSTEM_MISSION_PLANS];

export const MISSION_PLANS: Readonly<Record<string, MissionPlan>> = Object.fromEntries(
  plans.map((plan) => [plan.levelId, plan]),
);
