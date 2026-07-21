#!/usr/bin/env npx tsx
/**
 * reconcile-sitemap-index.ts — rebuild dist/sitemap.xml so the sitemap INDEX
 * references EVERY content sub-sitemap in dist/ (fixes orphaned pseo/scenarios).
 * Runs at the END of the build. Idempotent.
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = join(process.cwd(), "dist");
const BASE = "https://invisibleexit.com";
const today = new Date().toISOString().slice(0, 10);

if (!existsSync(DIST)) { console.log("(no dist/ — skipping sitemap reconcile)"); process.exit(0); }

// All content sub-sitemaps, EXCLUDING the index files themselves.
const EXCLUDE = new Set(["sitemap.xml", "sitemap-index.xml"]);
const subs = readdirSync(DIST)
  .filter((f) => /^sitemap-.*\.xml$/.test(f) && !EXCLUDE.has(f))
  .concat(existsSync(join(DIST, "image-sitemap.xml")) ? ["image-sitemap.xml"] : [])
  .sort();

if (subs.length === 0) { console.error("FAIL: no sub-sitemaps found in dist/. Not overwriting index."); process.exit(1); }

const entries = subs.map((f) => {
  let lastmod = today;
  try { lastmod = statSync(join(DIST, f)).mtime.toISOString().slice(0, 10); } catch {}
  return `  <sitemap>\n    <loc>${BASE}/${f}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`;
}).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;
writeFileSync(join(DIST, "sitemap.xml"), xml);

// Neutralize the stale competing index so it can't confuse crawlers: make it
// identical to the canonical one (don't delete — a 404 on a previously-known
// file is worse than a duplicate).
if (existsSync(join(DIST, "sitemap-index.xml"))) writeFileSync(join(DIST, "sitemap-index.xml"), xml);

console.log(`✓ sitemap index reconciled: ${subs.length} sub-sitemaps referenced (${subs.join(", ")})`);
