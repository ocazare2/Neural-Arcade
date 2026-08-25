import { describe, expect, test } from "bun:test";
import { ALL_LEVELS as levels } from "../src/app/neural-arcade/curriculum";
import { CHALLENGE_QUESTIONS, PRACTICE_QUESTIONS } from "../src/app/neural-arcade/quizzes";


describe("currículo", () => {
  test("publica exactamente 26 niveles con IDs e índices únicos", () => {
    expect(levels).toHaveLength(26);
    expect(new Set(levels.map((level) => level.id)).size).toBe(levels.length);
    expect(levels.map((level) => level.index)).toEqual(Array.from({ length: 26 }, (_, index) => index - 1));
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

describe("quizzes", () => {
  const validateQuestions = (questions: typeof PRACTICE_QUESTIONS[string]) => {
    for (const question of questions) {
      expect(question.question.length).toBeGreaterThan(10);
      expect(question.options.length).toBeGreaterThanOrEqual(3);
      expect(Number.isInteger(question.correct)).toBe(true);
      expect(question.correct).toBeGreaterThanOrEqual(0);
      expect(question.correct).toBeLessThan(question.options.length);
      expect(question.explain.length).toBeGreaterThan(20);
      expect(new Set(question.options).size).toBe(question.options.length);
    }
  };

  test("cada nivel tiene al menos 3 preguntas de práctica y 5 de reto", () => {
    for (const level of levels) {
      expect(PRACTICE_QUESTIONS[level.id]?.length ?? 0).toBeGreaterThanOrEqual(3);
      expect(CHALLENGE_QUESTIONS[level.id]?.length ?? 0).toBeGreaterThanOrEqual(5);
    }
  });

  test("todas las preguntas y respuestas son válidas", () => {
    for (const level of levels) {
      validateQuestions(PRACTICE_QUESTIONS[level.id]);
      validateQuestions(CHALLENGE_QUESTIONS[level.id]);
    }
  });
});
