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

  // 3) Submit: try IndexNow first (Bing/Yandex relay), fall back to Bing WMT SubmitUrlBatch.
  // IndexNow requires portal activation; SubmitUrlBatch works without it (500/day limit).
  const BING_API_KEY = process.env.BING_WEBMASTER_API_KEY || "";

  async function submitIndexNow(batch: string[]): Promise<boolean> {
    try {
      const r = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batch }),
      });
      console.log(`  IndexNow: ${batch.length} URLs → HTTP ${r.status}`);
      return r.status < 400 || r.status === 429;
    } catch (e) { console.error("  IndexNow error (non-fatal):", (e as Error).message); return false; }
  }

  async function submitBingWmt(batch: string[]): Promise<boolean> {
    if (!BING_API_KEY) { console.error("  BING_WEBMASTER_API_KEY not set — skipping Bing WMT fallback."); return false; }
    // Query remaining quota; cap batch to what's available (500/day limit)
    let remaining = 500;
    try {
      const qr = await fetch(`https://www.bing.com/webmasterapi/api.svc/json/GetUrlSubmissionQuota?siteUrl=${encodeURIComponent(`https://${HOST}`)}&apikey=${BING_API_KEY}`);
      if (qr.ok) {
        const qj = await qr.json() as any;
        if (qj?.d?.DailyQuota != null) remaining = qj.d.DailyQuota;
      }
    } catch { /* ignore — proceed with default */ }
    if (remaining <= 0) {
      console.log(`  BingWMT: daily quota exhausted (0 remaining) — skipping.`);
      return true; // not an error, just skip
    }
    const capped = batch.slice(0, remaining);
    console.log(`  BingWMT: submitting ${capped.length} URLs (${remaining} daily quota remaining)`);
    try {
      const r = await fetch(`https://www.bing.com/webmasterapi/api.svc/json/SubmitUrlBatch?apikey=${BING_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ siteUrl: `https://${HOST}`, urlList: capped }),
      });
      console.log(`  BingWMT: → HTTP ${r.status}`);
      return r.status < 400 || r.status === 429;
    } catch (e) { console.error("  BingWMT submit error (non-fatal):", (e as Error).message); return false; }
  }

  if (toSubmit.length > 0) {
    // Try IndexNow first; if it fails (403 = not activated), fall back to Bing WMT
    let ok = false;
    ok = await submitIndexNow(toSubmit.slice(0, 10000));
    if (!ok) {
      console.log("  IndexNow failed (likely not activated in portal) — falling back to Bing WMT SubmitUrlBatch.");
      ok = await submitBingWmt(toSubmit);
    }
    if (ok) { mkdirSync(join(process.cwd(), "data"), { recursive: true }); writeFileSync(STATE, JSON.stringify(current)); console.log("✓ IndexNow state updated."); }
    else console.log("Both IndexNow and Bing WMT failed; state NOT updated so they retry next run.");
  } else {
    console.log("✓ Nothing new to submit.");
  }
}

main();
