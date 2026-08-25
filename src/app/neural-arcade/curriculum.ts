import { LEVELS } from "./data";
import { EXTRA_LEVELS } from "./extra-levels";
import { MATH_LEVEL } from "./math-primer";
import type { LevelMeta } from "./types";

/** Fuente única y ordenada del currículo publicado. */
export const ALL_LEVELS: LevelMeta[] = [MATH_LEVEL, ...LEVELS, ...EXTRA_LEVELS]
  .sort((left, right) => left.index - right.index);
