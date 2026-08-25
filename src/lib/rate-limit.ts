/**
 * Fixed-window limiter for development and single-instance deployments.
 * Memory is capped so arbitrary client identifiers cannot grow the process
 * without bounds. Multi-instance production should configure Upstash.
 */

interface RateBucket {
  count: number;
  resetTime: number;
}

const buckets = new Map<string, RateBucket>();
const DEFAULT_LIMIT = 100;
const DEFAULT_WINDOW_MS = 60_000;
const MAX_BUCKETS = 10_000;
const PRUNE_INTERVAL = 256;
let operationCount = 0;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

function pruneBuckets(now: number): void {
  operationCount += 1;
  if (operationCount % PRUNE_INTERVAL !== 0 && buckets.size < MAX_BUCKETS) return;

  for (const [key, bucket] of buckets) {
    if (bucket.resetTime <= now) buckets.delete(key);
  }

  while (buckets.size >= MAX_BUCKETS) {
    const oldestKey = buckets.keys().next().value;
    if (typeof oldestKey !== "string") break;
    buckets.delete(oldestKey);
  }
}

export function rateLimit(
  ip: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW_MS,
): RateLimitResult {
  const safeLimit = Math.max(1, Math.floor(limit));
  const safeWindowMs = Math.max(1, Math.floor(windowMs));
  const now = Date.now();
  pruneBuckets(now);

  const key = ip.slice(0, 256);
  const existing = buckets.get(key);

  if (!existing || existing.resetTime <= now) {
    const resetTime = now + safeWindowMs;
    buckets.set(key, { count: 1, resetTime });
    return { success: true, remaining: safeLimit - 1, resetTime };
  }

  existing.count += 1;
  if (existing.count > safeLimit) {
    return { success: false, remaining: 0, resetTime: existing.resetTime };
  }

  return {
    success: true,
    remaining: safeLimit - existing.count,
    resetTime: existing.resetTime,
  };
}

export function __resetRateLimitForTests(): void {
  buckets.clear();
  operationCount = 0;
}
