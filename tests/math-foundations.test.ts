import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { MATH_LEVEL } from "../src/app/neural-arcade/math-primer";

const root = join(import.meta.dir, "..");

describe("fundamentos matemáticos", () => {
  test("presenta el lenguaje mínimo de los vectores antes de embeddings", () => {
    expect(MATH_LEVEL.concepts).toEqual([
      "Vector",
      "Componente",
      "Dimensión",
      "Matriz",
      "Producto punto",
      "Peso",
      "Error",
    ]);

    const glossary = new Map(MATH_LEVEL.glossary.map((entry) => [entry.term, entry.definition]));
    expect(glossary.get("Vector")).toContain("lista ordenada");
    expect(glossary.get("Componente")).toContain("cada número");
    expect(glossary.get("Dimensión")).toContain("cantidad de componentes");
    expect(glossary.get("Producto punto")).toContain("multiplica");
  });

  test("conecta la práctica con ecuaciones de vector, matriz, producto punto y error", () => {
    expect(MATH_LEVEL.theory).toHaveLength(4);
    expect(MATH_LEVEL.theory[0]?.formula).toContain("p + Δp");
    expect(MATH_LEVEL.theory[1]?.formula).toContain("3 \\times 3");
    expect(MATH_LEVEL.theory[2]?.formula).toContain("x \\cdot w");
    expect(MATH_LEVEL.theory[3]?.formula).toContain("e = meta - posición");
  });

  test("las cuatro misiones enseñan la matemática en pantalla, no solo al terminar", async () => {
    const missions = await Bun.file(join(root, "src/app/neural-arcade/components/MathMissions.tsx")).text();
    const beginner = await Bun.file(join(root, "src/app/neural-arcade/components/BeginnerLevel.tsx")).text();

    expect(missions).toContain("Laboratorio de vectores");
    expect(missions).toContain("Dimensión: 2 componentes");
    expect(missions).toContain("Producto punto");
    expect(missions).toContain("Error vectorial");
    expect(beginner).toContain("formatFormula(block.formula)");
  });
});
