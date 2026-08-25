import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";

const root = join(import.meta.dir, "..");

describe("assets de publicación", () => {
  test("el manifest referencia iconos locales existentes", async () => {
    const manifest = await Bun.file(join(root, "public/manifest.json")).json();
    expect(manifest.description).toContain("26 niveles");
    for (const icon of manifest.icons) {
      expect(icon.src.startsWith("/")).toBe(true);
      expect(await Bun.file(join(root, "public", icon.src.slice(1))).exists()).toBe(true);
    }
  });

  test("robots permite indexación y publica el sitemap", () => {
    const value = robots();
    expect(value.rules).toEqual([{ userAgent: "*", allow: "/" }]);
    expect(value.sitemap).toEndWith("/sitemap.xml");
  });

  test("sitemap contiene la portada canónica", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(1);
    expect(entries[0]?.url).toBe("http://localhost:3000");
  });
});
