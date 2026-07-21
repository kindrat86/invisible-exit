#!/usr/bin/env npx tsx
/**
 * generate-site-index.ts — build a crawlable HTML sitemap hub at /site-index.html
 * from the live/dist sub-sitemaps. Additive static page. Idempotent.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = join(process.cwd(), "dist");
const BASE = "https://invisibleexit.com";
if (!existsSync(DIST)) { console.log("(no dist/ — skipping site-index)"); process.exit(0); }

const EXCLUDE = new Set(["sitemap.xml", "sitemap-index.xml", "image-sitemap.xml"]);
const subs = readdirSync(DIST).filter((f) => /^sitemap-.*\.xml$/.test(f) && !EXCLUDE.has(f)).sort();
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const label = (u: string) => { try { const p = new URL(u).pathname.replace(/\/$/, ""); const seg = p.split("/").filter(Boolean).pop() || "home"; return seg.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()); } catch { return u; } };

let sections = "";
for (const f of subs) {
  const xml = readFileSync(join(DIST, f), "utf8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).filter((u) => u.startsWith(BASE) && !u.endsWith(".xml"));
  if (urls.length === 0) continue;
  const name = f.replace(/^sitemap-/, "").replace(/\.xml$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const links = urls.slice(0, 200).map((u) => `<li><a href="${new URL(u).pathname}">${esc(label(u))}</a></li>`).join("");
  sections += `<section><h2>${esc(name)} <small>(${urls.length})</small></h2><ul>${links}</ul></section>`;
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Site Index — Invisible Exit</title>
<meta name="description" content="Full index of Invisible Exit: every guide, idea, calculator, profession, city, and comparison for building a faceless side business.">
<link rel="canonical" href="${BASE}/site-index.html">
<style>body{font:16px/1.6 system-ui,sans-serif;max-width:1100px;margin:0 auto;padding:2rem 1rem;color:#111}h1{margin:0 0 1rem}section{margin:1.5rem 0}h2{font-size:1.1rem;border-bottom:1px solid #eee;padding-bottom:.3rem}ul{columns:3;list-style:none;padding:0}@media(max-width:800px){ul{columns:1}}a{color:#2563eb;text-decoration:none}a:hover{text-decoration:underline}small{color:#888;font-weight:400}</style>
</head><body><h1>Invisible Exit — Site Index</h1>
<p>Every page, organized by section. Looking for the homepage? <a href="/">invisibleexit.com</a>.</p>
${sections}</body></html>`;

writeFileSync(join(DIST, "site-index.html"), html);
try { writeFileSync(join(process.cwd(), "public/site-index.html"), html); } catch {}
console.log(`✓ site-index.html generated (${subs.length} sections)`);
