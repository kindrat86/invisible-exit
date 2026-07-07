/**
 * NLWeb Endpoint — Vite / Express / Vercel Serverless
 * ---------------------------------------------------------------------------
 * Spec: https://nlweb.dev
 *
 * ESM module. Works as:
 *   1. Vercel serverless function → place at  api/nlweb.js  (ESM project)
 *                                        or  api/nlweb.cjs (CJS project)
 *   2. Express route              → app.get/post("/api/nlweb", handler)
 *   3. Vite middleware            → adapt with connect-style wrapper
 *
 * Config: reads `a2a-config.json` from repo root (shared with A2A endpoint).
 */

import fs from "node:fs";
import path from "node:path";

let cachedConfig = null;

function loadConfigSync() {
  if (cachedConfig) return cachedConfig;
  const cfgPath =
    process.env.A2A_CONFIG_PATH ||
    path.join(process.cwd(), "a2a-config.json");
  try {
    cachedConfig = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  } catch {
    cachedConfig = {
      siteName: "Unconfigured Site",
      description:
        "NLWeb endpoint installed but no a2a-config.json found at repo root.",
      domain: "",
      capabilities: [],
      contentItems: [],
    };
  }
  return cachedConfig;
}

function rankContent(query, items) {
  const q = (query || "").toLowerCase();
  const terms = q.split(/\s+/).filter((t) => t.length > 2);
  if (terms.length === 0) return items || [];
  return (items || [])
    .map((it) => {
      const haystack = `${it.title} ${it.description}`.toLowerCase();
      let score = 0;
      for (const t of terms) if (haystack.includes(t)) score += 1;
      return { item: it, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item);
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") {
    res.status(204);
    return res.end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cfg = loadConfigSync();

  // Accept query from body (POST) or query string (GET)
  const query =
    (req.body && req.body.query) ||
    (req.query && req.query.query) ||
    (req.query && req.query.q) ||
    "";

  // No query → return site manifest (NLWeb discovery form)
  if (!query || !query.trim()) {
    return res.status(200).json({
      site: cfg.siteName,
      description: cfg.description,
      domain: cfg.domain,
      content: cfg.contentItems,
      capabilities: cfg.capabilities,
    });
  }

  const results = rankContent(query, cfg.contentItems);

  return res.status(200).json({
    query,
    site: cfg.siteName,
    results: results.map((r) => ({
      title: r.title,
      url: r.url,
      description: r.description,
    })),
    total: results.length,
  });
}

export { handler };
