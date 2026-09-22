import { describe, expect, test } from "bun:test";
import { advanceTokenBuild } from "../src/app/neural-arcade/token-build";

describe("construcción de tokens", () => {
  test("convierte robot en robotito sin pedir reiniciar ni un botón intermedio", () => {
    const firstPiece = advanceTokenBuild([], "rob");
    const robot = advanceTokenBuild(firstPiece, "ot");

    expect(robot).toEqual({
      pieces: ["rob", "ot"],
      target: "robotito",
      completed: false,
      notice: "¡Robot listo! Añade «ito» para convertirlo en «robotito».",
    });

    expect(advanceTokenBuild(robot, "ito")).toEqual({
      pieces: ["rob", "ot", "ito"],
      target: "robotito",
      completed: true,
      notice: "",
    });
  });

  test("mantiene una ruta de recuperación después de una pieza incorrecta", () => {
    const wrong = advanceTokenBuild([], "ito");

    expect(wrong).toMatchObject({
      pieces: ["ito"],
      target: "robot",
      completed: false,
    });
  });
});
