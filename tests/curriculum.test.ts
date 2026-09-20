import { describe, expect, test } from "bun:test";
import {
  ALL_LEVELS as levels,
  CURRICULUM_CHAPTERS,
  CURRICULUM_LEVEL_ORDER,
  getChapterForLevel,
  getLevelPosition,
  getNextLevel,
  getPreviousLevel,
} from "../src/app/neural-arcade/curriculum";
import { LEVELS } from "../src/app/neural-arcade/data";
import { EXTRA_LEVELS } from "../src/app/neural-arcade/extra-levels";
import { MATH_LEVEL } from "../src/app/neural-arcade/math-primer";


describe("currículo", () => {
  test("publica exactamente 26 niveles con IDs e índices únicos", () => {
    expect(levels).toHaveLength(26);
    expect(new Set(levels.map((level) => level.id)).size).toBe(levels.length);
    expect(levels.map((level) => level.index)).toEqual(Array.from({ length: 26 }, (_, index) => index - 1));
  });

  test("sigue la secuencia pedagógica canónica", () => {
    expect(levels.map((level) => level.id)).toEqual([...CURRICULUM_LEVEL_ORDER]);
  });

  test("cada nivel publicado es una copia y no modifica su metadata original", () => {
    const sourceLevels = [MATH_LEVEL, ...LEVELS, ...EXTRA_LEVELS];
    const sourceById = new Map(sourceLevels.map((level) => [level.id, level]));

    for (const level of levels) {
      expect(level).not.toBe(sourceById.get(level.id));
    }
  });

  test("los capítulos cubren la secuencia una sola vez y tienen texto bilingüe", () => {
    const chapterLevelIds = CURRICULUM_CHAPTERS.flatMap((chapter) => [...chapter.levelIds]);

    expect(chapterLevelIds).toEqual([...CURRICULUM_LEVEL_ORDER]);
    expect(new Set(chapterLevelIds).size).toBe(levels.length);

    for (const chapter of CURRICULUM_CHAPTERS) {
      for (const locale of ["es", "en"] as const) {
        expect(chapter.title[locale].length).toBeGreaterThan(3);
        expect(chapter.goal[locale].length).toBeGreaterThan(20);
        expect(chapter.bridge[locale].length).toBeGreaterThan(20);
      }
    }
  });

  test("expone navegación y capítulos sin depender de los índices originales", () => {
    expect(getLevelPosition("math")).toBe(0);
    expect(getLevelPosition("safety")).toBe(25);
    expect(getLevelPosition("desconocido")).toBe(-1);

    expect(getPreviousLevel("math")).toBeUndefined();
    expect(getNextLevel("math")?.id).toBe("tokens");
    expect(getPreviousLevel("agent")?.id).toBe("reasoning");
    expect(getNextLevel("agent")?.id).toBe("orch");
    expect(getNextLevel("safety")).toBeUndefined();
    expect(getPreviousLevel("desconocido")).toBeUndefined();
    expect(getNextLevel("desconocido")).toBeUndefined();

    expect(getChapterForLevel("tokens")?.id).toBe("fundamentos");
    expect(getChapterForLevel("agent")?.id).toBe("chat-agente");
    expect(getChapterForLevel("desconocido")).toBeUndefined();
  });

  test("cada nivel tiene contenido pedagógico completo", () => {
    for (const level of levels) {
      expect(level.title.length).toBeGreaterThan(2);
      expect(level.summary.length).toBeGreaterThan(20);
      expect(level.estimatedMin).toBeGreaterThan(0);
      expect(level.concepts.length).toBeGreaterThanOrEqual(4);
      expect(level.glossary.length).toBeGreaterThanOrEqual(4);
      expect(level.theory.length).toBeGreaterThanOrEqual(4);
      expect(
        level.theory.every(
          (block) => block.title && block.body.length + (block.formulaExplain?.length ?? 0) > 100,
        ),
      ).toBe(true);
    }
  });
});
