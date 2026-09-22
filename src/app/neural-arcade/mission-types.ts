interface ConceptGuide {
  concept: string;
  plain: string;
  example: string;
}

export interface PipelineStep {
  label: string;
  detail: string;
}

interface SortLane {
  label: string;
  description: string;
}

export interface SortItem {
  label: string;
  lane: 0 | 1;
  why: string;
}

export interface BuildModule {
  label: string;
  cost: number;
  essential: boolean;
  why: string;
}

export interface BuildPlan {
  title: string;
  brief: string;
  budget: number;
  modules: readonly BuildModule[];
}

export interface MissionPlan {
  levelId: string;
  role: string;
  outcome: string;
  bridge: string;
  concepts: readonly ConceptGuide[];
  pipeline: {
    title: string;
    instruction: string;
    steps: readonly PipelineStep[];
  };
  sorter: {
    title: string;
    instruction: string;
    lanes: readonly [SortLane, SortLane];
    items: readonly SortItem[];
  };
  build: BuildPlan;
}
