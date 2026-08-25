import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit-hybrid";

// Node.js is the supported runtime for the server-side rate limiter.
export const runtime = "nodejs";

// This endpoint is dynamic because its response contains per-client rate-limit state.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const RATE_LIMIT_MAX = 100; // requests
const RATE_LIMIT_WINDOW_MS = 60_000; // per minute

/**
 * Extract a stable client identifier for rate-limiting.
 * Prefers the first IP from `x-forwarded-for` (set by Vercel / Cloudflare /
 * most reverse proxies), then `x-real-ip`, then a synthetic key when no
 * IP can be determined (local dev, edge without proxy headers).
 */
function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first.slice(0, 256);
  }
  const xReal = req.headers.get("x-real-ip");
  if (xReal) return xReal.trim().slice(0, 256);
  return "anonymous";
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const { success, remaining, resetTime } = await rateLimit(
    ip,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS,
  );

  const headers = {
    "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(resetTime),
  };

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests", retryAfter: Math.ceil((resetTime - Date.now()) / 1000) },
      { status: 429, headers: { ...headers, "Retry-After": String(Math.ceil((resetTime - Date.now()) / 1000)) } },
    );
  }

  return NextResponse.json(
    {
      message: "Neural Arcade API",
      version: "4.0",
      status: "ok",
    },
    { headers },
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "GET" } },
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "GET" } },
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "GET" } },
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "GET" } },
  );
}
