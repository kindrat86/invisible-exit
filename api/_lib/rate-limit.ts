/**
 * Rate limiting middleware for Vercel serverless functions.
 *
 * Uses an in-memory Map for per-instance rate limiting.
 * For production at scale, upgrade to Upstash Redis (@upstash/ratelimit).
 *
 * Usage:
 *   import { checkRateLimit, rateLimitResponse } from "./_lib/rate-limit";
 *
 *   const ip = req.headers["x-forwarded-for"] || "unknown";
 *   const allowed = checkRateLimit(`translate:${ip}`, { max: 30, windowMs: 60000 });
 *   if (!allowed) return rateLimitResponse();
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}

/**
 * Check if a request is within the rate limit.
 * @param key - Unique identifier (e.g., `endpoint:ip`)
 * @param options.max - Max requests in window
 * @param options.windowMs - Time window in milliseconds
 * @returns true if allowed, false if rate limited
 */
export function checkRateLimit(
  key: string,
  options: { max: number; windowMs: number }
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanup();

  const now = Date.now();
  const existing = store.get(key);

  if (!existing || now > existing.resetTime) {
    // New window
    store.set(key, { count: 1, resetTime: now + options.windowMs });
    return { allowed: true, remaining: options.max - 1, resetAt: now + options.windowMs };
  }

  existing.count++;

  if (existing.count > options.max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: options.max - existing.count,
    resetAt: existing.resetTime,
  };
}

/**
 * Get client IP from Vercel request headers.
 */
export function getClientIP(req: { headers: Record<string, string | string[]> }): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0];
  }
  const realIP = req.headers["x-real-ip"];
  if (typeof realIP === "string") return realIP;
  return "unknown";
}

/**
 * Standard rate limit exceeded response with proper headers.
 */
export function rateLimitResponse(resetAt: number): Response {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
  return new Response(
    JSON.stringify({ error: "Rate limit exceeded", retryAfter }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": "exceeded",
      },
    }
  );
}
