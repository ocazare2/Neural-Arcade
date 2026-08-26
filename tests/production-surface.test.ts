import { describe, expect, test } from "bun:test";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const read = (path: string) => Bun.file(join(root, path)).text();

describe("superficie publicada", () => {
  test("no anuncia minijuegos pendientes ni conserva controles de puntuación ficticios", async () => {
    const games = await read("src/app/neural-arcade/components/MiniGames.tsx");
    expect(games).not.toContain("Mini-juego en desarrollo");
    expect(games).not.toContain("+10 pts");
    expect(games).not.toContain("PLACEHOLDER GAMES");
  });

  test("muestra el crédito de creación con IA dentro de la aplicación", async () => {
    const app = await read("src/app/neural-arcade/NeuralArcade.tsx");
    const messages = await read("src/app/neural-arcade/i18n.tsx");
    expect(app).toContain('t("aiCredit")');
    expect(messages).toContain("100% con inteligencia artificial");
  });

  test("los diálogos declaran semántica modal", async () => {
    const onboarding = await read("src/app/neural-arcade/components/Onboarding.tsx");
    const app = await read("src/app/neural-arcade/NeuralArcade.tsx");
    expect(onboarding).toContain('role="dialog"');
    expect(onboarding).toContain('aria-modal="true"');
    expect(app).toContain('role="dialog"');
    expect(app).toContain('aria-modal="true"');
    expect(app).toContain("inert={homeIsInert ? true : undefined}");
  });

  test("la portada expone un landmark principal", async () => {
    const app = await read("src/app/neural-arcade/NeuralArcade.tsx");
    expect(app).toContain("<main");
  });

  test("las respuestas de los cuestionarios usan botones nativos", async () => {
    const runner = await read("src/app/neural-arcade/components/QuizRunner.tsx");
    expect(runner).not.toContain('role="button"');
    expect(runner).toContain('type="button"');
    expect(runner).not.toContain("highlightGlossary(opt");
  });

  test("respeta la preferencia de movimiento reducido", async () => {
    const page = await read("src/app/page.tsx");
    const css = await read("src/app/globals.css");
    expect(page).toContain('reducedMotion="user"');
    expect(css).toContain("prefers-reduced-motion: reduce");
  });

  test("el service worker precarga de forma independiente y no guarda errores HTTP", async () => {
    const worker = await read("public/sw.js");
    expect(worker).not.toContain("cache.addAll");
    expect(worker).not.toContain(".catch(() => {})");
    expect(worker.match(/response\.ok|res\.ok/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
    expect(worker).toContain("event.origin !== self.location.origin");
  });

  test("usa una sola versión pública", async () => {
    const pkg = await Bun.file(join(root, "package.json")).json();
    const api = await read("src/app/api/route.ts");
    const app = await read("src/app/neural-arcade/NeuralArcade.tsx");
    const worker = await read("public/sw.js");
    expect(api).toContain("APP_VERSION");
    expect(app).toContain("APP_VERSION");
    expect(worker).toContain(`neural-arcade-v${pkg.version}`);
  });

  test("fija la versión mayor de Node usada en producción", async () => {
    const pkg = await Bun.file(join(root, "package.json")).json();
    expect(pkg.engines.node).toBe("24.x");
  });

  test("no publica mensajes internos del error boundary", async () => {
    const boundary = await read("src/app/neural-arcade/components/ErrorBoundary.tsx");
    expect(boundary).toContain('process.env.NODE_ENV !== "production"');
  });

  test("permite hidratar en desarrollo sin generar archivos internos de agentes", async () => {
    const config = await read("next.config.ts");
    expect(config).toContain("agentRules: false");
    expect(config).toContain('process.env.NODE_ENV === "development"');
    expect(config).toContain("'unsafe-eval'");
  });

  test("evita el conflicto entre standalone y el adaptador de Vercel", async () => {
    const config = await read("next.config.ts");
    const prepareStandalone = await read("scripts/prepare-standalone.mjs");
    expect(config).toContain('output: process.env.VERCEL ? undefined : "standalone"');
    expect(prepareStandalone).toContain("if (process.env.VERCEL)");
  });

  test("los selectores de Zustand no crean fallbacks inestables", async () => {
    const shell = await read("src/app/neural-arcade/components/LevelShell.tsx");
    expect(shell).not.toContain("useArcade(s => s.progress[level.id]?.phasesDone ?? [])");
  });
});
