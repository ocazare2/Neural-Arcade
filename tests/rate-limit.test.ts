import { beforeEach, describe, expect, test } from "bun:test";
import { __resetRateLimitForTests, rateLimit } from "../src/lib/rate-limit";

beforeEach(() => __resetRateLimitForTests());

describe("rate limiter", () => {
  test("permite hasta el límite y bloquea la siguiente solicitud", () => {
    expect(rateLimit("client", 2, 60_000)).toMatchObject({ success: true, remaining: 1 });
    expect(rateLimit("client", 2, 60_000)).toMatchObject({ success: true, remaining: 0 });
    expect(rateLimit("client", 2, 60_000)).toMatchObject({ success: false, remaining: 0 });
  });

  test("mantiene buckets independientes por cliente", () => {
    rateLimit("client-a", 1, 60_000);
    expect(rateLimit("client-a", 1, 60_000).success).toBe(false);
    expect(rateLimit("client-b", 1, 60_000).success).toBe(true);
  });

  test("reinicia un bucket después de expirar", async () => {
    expect(rateLimit("client", 1, 1).success).toBe(true);
    await Bun.sleep(5);
    expect(rateLimit("client", 1, 60_000).success).toBe(true);
  });
});
