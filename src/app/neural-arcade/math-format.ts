const SIMPLE_COMMANDS: Record<string, string> = {
  approx: "≈",
  alpha: "α",
  beta: "β",
  cdot: "·",
  cos: "cos",
  Delta: "Δ",
  div: "÷",
  dots: "…",
  epsilon: "ε",
  eta: "η",
  exp: "exp",
  gamma: "γ",
  geq: "≥",
  gg: "≫",
  in: "∈",
  infinity: "∞",
  ldots: "…",
  leq: "≤",
  ll: "≪",
  log: "log",
  max: "max",
  min: "min",
  nabla: "∇",
  partial: "∂",
  Phi: "Φ",
  pi: "π",
  prod: "∏",
  propto: "∝",
  sigma: "σ",
  sin: "sin",
  sum: "∑",
  theta: "θ",
  times: "×",
  to: "→",
  top: "ᵀ",
};

/** Convierte el subconjunto de LaTeX usado por el currículo a texto visible. */
export function normalizeMathCommands(input: string): string {
  return input
    .replace(/\\(?:text|mathrm|mathcal|mathbb)\{([^{}]*)\}/g, "$1")
    .replace(/\\vec\{([^{}])\}/g, "$1⃗")
    .replace(/\\hat\{([^{}])\}/g, "$1̂")
    .replace(/\\underbrace\{([^{}]*)\}/g, "$1")
    .replace(/\\(?:left|right|quad|qquad)\b/g, "")
    .replace(/\\\|/g, "‖")
    .replace(/\\\$/g, "$")
    .replace(/\\([A-Za-z]+)/g, (match, command: string) => {
      if (command === "frac" || command === "sqrt") return match;
      return SIMPLE_COMMANDS[command] ?? match;
    })
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
