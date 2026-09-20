import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { normalizeAudioSettings } from "../src/app/neural-arcade/lib/sound";
import {
  SUPPORTED_LOCALES,
  UI_MESSAGES,
  normalizeLocale,
} from "../src/app/neural-arcade/i18n";

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
