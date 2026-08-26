import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { normalizeAudioSettings } from "../src/app/neural-arcade/lib/sound";
import {
  SUPPORTED_LOCALES,
  UI_MESSAGES,
  normalizeLocale,
} from "../src/app/neural-arcade/i18n";
import { getGlossaryPopoverLayout } from "../src/app/neural-arcade/glossary-layout";

const root = join(import.meta.dir, "..");

describe("audio", () => {
  test("migra preferencias antiguas y conserva música activa por defecto", async () => {
    expect(normalizeAudioSettings(null)).toEqual({ muted: false, music: true });
    expect(normalizeAudioSettings("true")).toEqual({ muted: true, music: true });
    expect(normalizeAudioSettings('{"muted":false,"music":false}')).toEqual({
      muted: false,
      music: false,
    });

    const source = await Bun.file(join(root, "src/app/neural-arcade/lib/sound.ts")).text();
    expect(source).toContain("startBackgroundMusic");
    expect(source).toContain('"pointerdown"');
    expect(source).toContain("ARCADE_TEMPO");
    expect(source).toContain("ARCADE_MELODY");
    expect(source).toContain('"square"');
    expect(source).not.toContain("BACKGROUND_CHORDS");
    expect(source).toContain("if (settings.muted || !settings.music) stopBackgroundMusic()");
  });
});

describe("idiomas", () => {
  test("ofrece español e inglés y normaliza preferencias del navegador", () => {
    expect(SUPPORTED_LOCALES.map(option => option.code)).toEqual(["es", "en"]);
    expect(normalizeLocale("en-US")).toBe("en");
    expect(normalizeLocale("es-MX")).toBe("es");
    expect(normalizeLocale("fr-FR")).toBe("es");
    expect(UI_MESSAGES.es.play).toBe("EMPEZAR A JUGAR");
    expect(UI_MESSAGES.en.play).toBe("START PLAYING");
  });
});

describe("glosario móvil", () => {
  test("mantiene la definición completa dentro de una pantalla de 320 px", () => {
    for (const trigger of [
      { left: 2, right: 42, top: 120, bottom: 142 },
      { left: 278, right: 318, top: 470, bottom: 492 },
    ]) {
      const layout = getGlossaryPopoverLayout(trigger, { width: 320, height: 568 });
      expect(layout.left).toBeGreaterThanOrEqual(12);
      expect(layout.left + layout.width).toBeLessThanOrEqual(308);
      expect(layout.bottom).toBe(12);
      expect(layout.maxHeight).toBeLessThanOrEqual(544);
    }
  });

  test("centra y voltea la definición en escritorio sin rebasar el viewport", () => {
    const below = getGlossaryPopoverLayout(
      { left: 500, right: 560, top: 120, bottom: 144 },
      { width: 1024, height: 768 },
    );
    expect(below.top).toBe(152);
    expect(below.bottom).toBeUndefined();
    expect(below.left).toBeGreaterThanOrEqual(12);
    expect(below.left + below.width).toBeLessThanOrEqual(1012);

    const above = getGlossaryPopoverLayout(
      { left: 990, right: 1020, top: 700, bottom: 724 },
      { width: 1024, height: 768 },
    );
    expect(above.top).toBeUndefined();
    expect(above.bottom).toBe(76);
    expect(above.left + above.width).toBeLessThanOrEqual(1012);
  });
});
