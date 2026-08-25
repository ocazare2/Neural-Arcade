export interface GradientPoint {
  x: number;
  y: number;
}

export interface GradientSurface {
  name: string;
  gx: (x: number, y: number) => number;
  gy: (x: number, y: number) => number;
  start: GradientPoint;
  target: GradientPoint;
  goodLr: number;
}

export interface GradientRoundState {
  position: GradientPoint;
  steps: number;
  solved: boolean;
  exploded: boolean;
  points: number;
}

export const GRADIENT_SURFACES: readonly GradientSurface[] = [
  {
    name: "Cuenco",
    gx: (x) => 2 * (x - 5),
    gy: (_x, y) => 2 * (y - 5),
    start: { x: 1, y: 1 },
    target: { x: 5, y: 5 },
    goodLr: 0.1,
  },
  {
    name: "Ravine",
    gx: (x, y) => -40 * x * (y - x ** 2) - 2 * (1 - x),
    gy: (x, y) => 20 * (y - x ** 2),
    start: { x: -1, y: 1 },
    target: { x: 1, y: 1 },
    goodLr: 0.05,
  },
  {
    name: "Silla",
    gx: (x) => 2 * x,
    gy: (_x, y) => -2 * y,
    start: { x: 2, y: 0 },
    target: { x: 0, y: 0 },
    goodLr: 0.1,
  },
] as const;

export function createGradientRound(round: number): GradientRoundState {
  const surface = GRADIENT_SURFACES[round];
  if (!surface) throw new RangeError(`Ronda de gradiente inválida: ${round}`);
  return {
    position: { ...surface.start },
    steps: 0,
    solved: false,
    exploded: false,
    points: 0,
  };
}

export function takeGradientStep(
  round: number,
  position: GradientPoint,
  learningRate: number,
  previousSteps: number,
): GradientRoundState {
  const surface = GRADIENT_SURFACES[round];
  if (!surface) throw new RangeError(`Ronda de gradiente inválida: ${round}`);

  const next = {
    x: position.x - learningRate * surface.gx(position.x, position.y),
    y: position.y - learningRate * surface.gy(position.x, position.y),
  };
  const steps = previousSteps + 1;
  const exploded =
    !Number.isFinite(next.x) ||
    !Number.isFinite(next.y) ||
    Math.abs(next.x) > 15 ||
    Math.abs(next.y) > 15;
  const solved = !exploded && Math.hypot(
    next.x - surface.target.x,
    next.y - surface.target.y,
  ) < 0.5;

  return {
    position: exploded ? position : next,
    steps,
    exploded,
    solved,
    points: solved ? Math.max(10, 105 - steps * 5) : 0,
  };
}
