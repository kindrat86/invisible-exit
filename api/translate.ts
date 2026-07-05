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
 * For SEO: this is used by the client-side translation hook for long-form
 * content that's too large to pre-render (blog posts, guides, etc.).
 * The pre-rendered HTML shells already contain translated titles/meta/H1s.
 */

const CACHE_TTL = 86400; // 24 hours

export default async function handler(req: Request): Promise<Response> {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", "Allow": "POST" },
    });
  }

  try {
    const { text, targetLang, sourceLang } = await req.json();

    // Validation
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'text' field" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!targetLang || typeof targetLang !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'targetLang' field" }), {
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

    // Limit text size (prevent abuse) — 10,000 chars max
    const truncatedText = text.slice(0, 10000);

    // Call Google Translate
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sourceLang || "en")}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(truncatedText)}`;

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
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Translation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const config = {
  runtime: "edge",
};
