/**
 * Serverless endpoint for runtime content translation.
 *
 * POST /api/translate
 * Body: { "text": "...", "targetLang": "es", "sourceLang": "en" }
 * Returns: { "translatedText": "..." }
 *
 * Uses Google Translate's free endpoint (no API key needed).
 * Responses are cached for 24 hours via Cache-Control headers.
 *
 * Security: Rate limited to 60 req/min per IP to prevent abuse.
 */

import { checkRateLimit, getClientIP, rateLimitResponse } from "./_lib/rate-limit";

const CACHE_TTL = 86400; // 24 hours

// Valid language codes (whitelist prevents SSRF via the translate URL)
const VALID_LANGS = new Set([
  "en","es","zh","hi","ar","fr","pt","ja","de","ru","ko","it","tr","nl","pl",
  "uk","id","vi","th","fa","he","bn","ta","te","mr","gu","kn","ml","pa","or",
  "ms","sw","am","ha","yo","ig","zu","xh","af","my","km","lo","ne","si","ps",
  "kk","uz","az","ka","hy","mn","ceb","ilo","jv","su","mad","hmn","ku","bal",
  "tg","tk","sr","hr","bs","sk","sl","lt","lv","et","be","bg","mk","ca","eu",
  "gl","cy","ga","is","gd","br","lb","mt","fil","bo","ug","nan","wuu","hak","pcm",
]);

export default async function handler(req: Request): Promise<Response> {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", "Allow": "POST" },
    });
  }

  // ── Rate limiting: 60 requests per minute per IP ──
  const ip = getClientIP({ headers: Object.fromEntries(req.headers.entries()) });
  const rl = checkRateLimit(`translate:${ip}`, { max: 60, windowMs: 60000 });
  if (!rl.allowed) {
    return rateLimitResponse(rl.resetAt);
  }

  try {
    const { text, targetLang, sourceLang } = await req.json();

    // Validation
    if (!text || typeof text !== "string" || text.length === 0) {
      return new Response(JSON.stringify({ error: "Missing 'text' field" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!targetLang || typeof targetLang !== "string" || !VALID_LANGS.has(targetLang)) {
      return new Response(JSON.stringify({ error: "Invalid 'targetLang'" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (sourceLang && (typeof sourceLang !== "string" || !VALID_LANGS.has(sourceLang))) {
      return new Response(JSON.stringify({ error: "Invalid 'sourceLang'" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If target is English or source === target, return as-is
    if (targetLang === "en" || sourceLang === targetLang) {
      return new Response(JSON.stringify({ translatedText: text }), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=${CACHE_TTL}`,
        },
      });
    }

    // Limit text size (prevent abuse) — 5,000 chars max
    if (text.length > 5000) {
      return new Response(JSON.stringify({ error: "Text too long (max 5000 chars)" }), {
        status: 413,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Call Google Translate
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sourceLang || "en")}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
    });

    if (!response.ok) {
      // Fallback: return original text
      return new Response(JSON.stringify({ translatedText: text, fallback: true }), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `public, s-maxage=300`,
        },
      });
    }

    const data = await response.json();
    const segments = data[0] as Array<[string, string]> | undefined;
    const translatedText = segments ? segments.map((s) => s[0]).join("") : text;

    return new Response(JSON.stringify({ translatedText }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=${CACHE_TTL}`,
        "X-RateLimit-Remaining": String(rl.remaining),
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Translation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const config = {
  runtime: "edge",
};
