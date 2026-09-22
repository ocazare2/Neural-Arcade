const FORMULA_COMMANDS: Record<string, string> = {
  alpha: "α", beta: "β", cdot: "·", cos: "cos", Delta: "Δ", div: "÷", dots: "…", epsilon: "ε",
  eta: "η", exp: "exp", gamma: "γ", geq: "≥", gg: "≫", in: "∈", infinity: "∞", ldots: "…",
  leq: "≤", ll: "≪", log: "log", max: "max", min: "min", nabla: "∇", partial: "∂", Phi: "Φ",
  pi: "π", prod: "∏", propto: "∝", sigma: "σ", sin: "sin", sum: "∑", theta: "θ", times: "×", to: "→", top: "ᵀ",
};

/** Convierte el subconjunto de LaTex del currículo en una fórmula legible sin una dependencia pesada. */
export function formatFormula(formula: string): string {
  let result = formula
    .replace(/\\(?:text|mathrm|mathcal|mathbb)\{([^{}]*)\}/g, "$1")
    .replace(/\\vec\{([^{}])\}/g, "$1⃗")
    .replace(/\\hat\{([^{}])}/g, "$1̂")
    .replace(/\\underbrace\{([^{}]*)\}(?:_\{[^{}]*\})?/g, "$1")
    .replace(/\\(?:left|right|quad|qquad)\b/g, "")
    .replace(/\\\|/g, "‖")
    .replace(/\\\$/g, "$");

  for (let depth = 0; depth < 4; depth += 1) {
    result = result
      .replace(/\\sqrt\{([^{}]*)\}/g, "√($1)")
      .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1) / ($2)");
  }

  return result
    .replace(/\\([A-Za-z]+)/g, (match, command: string) => FORMULA_COMMANDS[command] ?? match)
    .replace(/[{}]/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
