export type TokenBuildTarget = "robot" | "robotito";

export type TokenBuildState = {
  pieces: string[];
  target: TokenBuildTarget;
  completed: boolean;
  notice: string;
};

type TokenBuildInput = string[] | Pick<TokenBuildState, "pieces" | "target">;

/**
 * Advances the small subword-building exercise one chip at a time.
 * Once "rob" + "ot" is assembled, the same chips stay on the board so the
 * learner can extend the word with "ito" instead of being sent to a reset.
 */
export function advanceTokenBuild(current: TokenBuildInput, piece: string): TokenBuildState {
  const pieces = Array.isArray(current) ? current : current.pieces;
  const target: TokenBuildTarget = Array.isArray(current) ? "robot" : current.target;
  const nextPieces = [...pieces, piece];
  const word = nextPieces.join("");

  if (target === "robot" && word === "robot") {
    return {
      pieces: nextPieces,
      target: "robotito",
      completed: false,
      notice: "¡Robot listo! Añade «ito» para convertirlo en «robotito».",
    };
  }

  if (target === "robotito" && word === "robotito") {
    return { pieces: nextPieces, target, completed: true, notice: "" };
  }

  return {
    pieces: nextPieces,
    target,
    completed: false,
    notice: target.startsWith(word)
      ? "La palabra empieza bien. Añade la siguiente pieza."
      : "La palabra aún no coincide. Usa Deshacer y prueba otra pieza; no pierdes puntos.",
  };
}
