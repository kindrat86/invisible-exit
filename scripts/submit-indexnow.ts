#!/usr/bin/env npx tsx
/**
 * submit-indexnow.ts — submit live URLs to IndexNow (Bing/Yandex → also powers
 * ChatGPT Search + Copilot). Reads the LIVE sitemaps so only real, live URLs
 * are pinged. State-tracked (data/.indexnow-state.json) to submit only new/
 * changed URLs. Non-fatal on any error.
 *
 * Run AFTER deploy:  npx tsx scripts/submit-indexnow.ts
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const HOST = "invisibleexit.com";
const BASE = `https://${HOST}`;
const KEY = "invisibleexit-indexnow-2026";
const KEY_LOCATION = `${BASE}/${KEY}.txt`;
const STATE = join(process.cwd(), "data/.indexnow-state.json");

async function getText(url: string): Promise<string | null> {
  try { const r = await fetch(url, { headers: { "User-Agent": "ie-indexnow" } }); return r.ok ? await r.text() : null; } catch { return null; }
}
const locs = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
function lastmods(xml: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = m[1].match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    const lm = m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim() || "1";
    if (loc) out[loc] = lm;
  }
  return out;
}

async function main() {
  // 0) Verify the key file is live (IndexNow requires it reachable)
  const keyCheck = await getText(KEY_LOCATION);
  if (!keyCheck || !keyCheck.includes(KEY)) {
    console.error(`WARN: key file not live/valid at ${KEY_LOCATION} — skipping IndexNow (non-fatal). Ensure it deployed.`);
    process.exit(0);
  }

  // 1) Collect live URLs + their lastmods from all sub-sitemaps in the index
  const index = await getText(`${BASE}/sitemap.xml`);
  if (!index) { console.error("WARN: live sitemap.xml unreachable — skipping IndexNow (non-fatal)."); process.exit(0); }
  const subUrls = locs(index).filter((u) => u.endsWith(".xml"));
  const current: Record<string, string> = {};
  for (const su of subUrls) {
    const xml = await getText(su);
    if (!xml) continue;
    Object.assign(current, lastmods(xml));
  }
  const allUrls = Object.keys(current);
  if (allUrls.length === 0) { console.error("WARN: 0 URLs from live sitemaps — skipping."); process.exit(0); }

  // 2) Diff against state → only new/changed URLs
  let prev: Record<string, string> = {};
  if (existsSync(STATE)) { try { prev = JSON.parse(readFileSync(STATE, "utf8")); } catch {} }
  const toSubmit = allUrls.filter((u) => prev[u] !== current[u]);
  console.log(`IndexNow: ${allUrls.length} live URLs, ${toSubmit.length} new/changed to submit.`);

  // 3) Submit in batches of 10,000
  async function submit(batch: string[]) {
    try {
      const r = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batch }),
      });
      console.log(`  submitted ${batch.length} → HTTP ${r.status}`);
      return r.status < 400 || r.status === 429;
    } catch (e) { console.error("  submit error (non-fatal):", (e as Error).message); return false; }
  }

  if (toSubmit.length > 0) {
    let ok = true;
    for (let i = 0; i < toSubmit.length; i += 10000) ok = (await submit(toSubmit.slice(i, i + 10000))) && ok;
    if (ok) { mkdirSync(join(process.cwd(), "data"), { recursive: true }); writeFileSync(STATE, JSON.stringify(current)); console.log("✓ IndexNow state updated."); }
    else console.log("Some batches failed; state NOT updated so they retry next run.");
  } else {
    console.log("✓ Nothing new to submit.");
  }
}

main();
