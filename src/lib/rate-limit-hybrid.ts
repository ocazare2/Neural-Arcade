/**
 * Hybrid fixed-window limiter. Uses Upstash REST when configured and a
 * bounded in-memory implementation otherwise. Redis outages fall back to the
 * local limiter so a telemetry dependency cannot take down the application.
 */

import { rateLimit as rateLimitInMemory, type RateLimitResult } from "./rate-limit";

const DEFAULT_LIMIT = 100;
const DEFAULT_WINDOW_MS = 60_000;

function hasUpstashConfig(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
  );
}

interface UpstashCommandResponse {
  result?: number | string | null;
  error?: string;
}

async function upstashRateLimit(
  ip: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL!.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const now = Date.now();
  const windowId = Math.floor(now / windowMs);
  const resetTime = (windowId + 1) * windowMs;
  const ttlSeconds = Math.max(1, Math.ceil(windowMs / 1000) + 1);
  const key = `rl:${ip.slice(0, 256)}:${windowId}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3_000);

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(ttlSeconds)],
      ]),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Upstash rate-limit HTTP ${response.status}`);
  }

  const payload = (await response.json()) as UpstashCommandResponse[];
  if (!Array.isArray(payload) || payload[0]?.error || payload[1]?.error) {
    throw new Error("Upstash rate-limit returned an invalid response");
  }

  const count = Number(payload[0]?.result);
  if (!Number.isFinite(count) || count < 1) {
    throw new Error("Upstash rate-limit returned an invalid count");
  }

  return {
    success: count <= limit,
    remaining: Math.max(0, limit - count),
    resetTime,
  };
}

export async function rateLimit(
  ip: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW_MS,
): Promise<RateLimitResult> {
  const safeLimit = Math.max(1, Math.floor(limit));
  const safeWindowMs = Math.max(1, Math.floor(windowMs));

  if (!hasUpstashConfig()) {
    return rateLimitInMemory(ip, safeLimit, safeWindowMs);
  }

  try {
    return await upstashRateLimit(ip, safeLimit, safeWindowMs);
  } catch {
    return rateLimitInMemory(ip, safeLimit, safeWindowMs);
  }
}

export type { RateLimitResult };
