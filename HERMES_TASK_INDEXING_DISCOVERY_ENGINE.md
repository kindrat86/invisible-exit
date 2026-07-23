# HERMES TASK — invisibleexit.com: Instant-Indexing & Discovery Engine

> **Runbook for:** Hermes Agent running DeepSeek v4 Pro
> **Mode:** AUTONOMOUS — build, validate, commit, deploy, and submit for indexing without human intervention, subject to the fail-safes in §1.
> **Repo:** `~/invisible-exit` (Vite + React SPA, ~4,005 built pages, heavy pSEO + i18n)
> **Deploy:** Vercel **prebuilt** with `--archive=tgz` (project `invisible-exit`).
> **Author of runbook:** Claude (2026-07-21), grounded in a live audit.

---

## 0. What you are building and why

invisibleexit.com has **4,005 built pages** (ideas, professions, cities, salaries, niches, compare, guides, blog, glossary, i18n). For a fleet this size, the bottleneck to organic traffic is **discovery and indexation** — search engines have to find, crawl, and index pages before any of them can rank. The audit found this layer is **half-wired**:

1. **IndexNow is set up but dormant.** A valid key file exists (`public/invisibleexit-indexnow-2026.txt`, key = `invisibleexit-indexnow-2026`) but **no script ever submits a single URL.** Instant indexing infrastructure, never fired.
2. **Sitemap index is incomplete.** `sitemap.xml` references 15 of the 18 sub-sitemaps — `sitemap-pseo.xml` and `sitemap-scenarios.xml` are **orphaned** (their pages are built but never submitted). A stale competing `sitemap-index.xml` (2 entries) muddies things.
3. **`public/robots.txt` has no `Sitemap:` line at all.**
4. **No HTML sitemap** for crawl paths / PageRank distribution to deep pages.

You will ship a **Discovery Engine** that fixes all four — deterministically and low-risk.

**Why this is the right lever (and out-of-the-box, not "just Bing SEO"):** IndexNow pings Bing and Yandex — and **Bing's index powers ChatGPT Search and Microsoft Copilot.** So activating instant indexing on a 4,000-page fleet is simultaneously a classic-search AND an **AI-search (AEO)** win: new/changed pages appear in ChatGPT Search / Copilot far faster. Combined with a complete sitemap index + HTML hub, this gets the *whole fleet* discovered — the prerequisite for every downstream ranking.

---

## 1. 🚨 GUARDRAILS + FAIL-SAFES — READ FIRST

### 1a. NEVER fabricate.
- Every URL you submit or list must come from the site's **own sitemaps / built pages**. Do not invent URLs.

### 1b. Only ping LIVE URLs.
- IndexNow must run **after** deploy, against URLs read from the **live** sitemaps — never ping a URL before it's live (that gets the key throttled).

### 1c. Don't break the build.
- This repo has **pre-existing `tsc` errors** — do NOT add a `tsc --noEmit` gate or "fix" unrelated type errors. The build uses `vite build` + `tsx` scripts (lenient). Your new scripts must run cleanly under `npx tsx` (plain, defensively-typed TS). Keep them dependency-free.
- Do NOT touch the SPA router, `index.html`'s existing scripts, or i18n/prerender logic. Everything you add is either a **new script**, a **generated static file in `dist/`/`public/`**, or a **one-line `package.json`/`robots.txt` edit**.

### 1d. Idempotency + non-fatal indexing.
- All scripts must be safe to re-run (no duplicate sitemap entries, no duplicate robots lines).
- IndexNow submission failures are **non-fatal** — log and continue; never let them fail the deploy.

### 1e. Working tree.
- The tree may have minor generated changes (e.g. `public/blog/rss.xml`). `git add` **only the files this task creates/edits** (listed in Definition of Done). Do not commit unrelated changes.

### 1f. Stale service worker.
- Known gotcha: a service worker can serve a stale first load. This does not affect crawlers or your deploy — ignore it, but do not add/modify any SW.

---

## 2. Deliverable A — `scripts/reconcile-sitemap-index.ts`

A post-build reconciler that rebuilds `dist/sitemap.xml` as a **complete** index of every `sitemap-*.xml` present in `dist/` (auto-includes `pseo`, `scenarios`, and any future sub-sitemap). Deterministic and future-proof — beats hand-editing the generator.

```ts
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
```

---

## 3. Deliverable B — `scripts/submit-indexnow.ts`

Activates the dormant IndexNow key. Reads URLs from the **live** sitemaps, submits new/changed ones to IndexNow (Bing + Yandex + Copilot/ChatGPT-Search index), and tracks state so it never spams.

```ts
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
```

---

## 4. Deliverable C — robots.txt + HTML sitemap hub

### 4a. Fix `public/robots.txt` (idempotent)
It currently declares **no** `Sitemap:` line. Append these two lines if not already present:
```
Sitemap: https://invisibleexit.com/sitemap.xml
Sitemap: https://invisibleexit.com/image-sitemap.xml
```
Verify: `grep -c "Sitemap:" public/robots.txt` → must be ≥ 1. (Also confirm the build copies `public/robots.txt` to `dist/robots.txt`; if the build regenerates robots, add the lines to whatever script emits it instead.)

### 4b. `scripts/generate-site-index.ts` — human/crawler HTML hub
Generates `dist/site-index.html` (and `public/site-index.html` so it survives rebuilds): a plain, crawlable index linking to every section hub + a sample of deep pages. Distributes crawl paths + PageRank to deep pages.

```ts
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
```
Add `/site-index.html` to the core sitemap: after generating, append it to `dist/sitemap-core.xml` before `</urlset>` **only if not already present** (idempotent), or add it to whatever list `scripts/generate-sitemap.ts` builds for core. Minimal one-entry addition.

---

## 5. Deliverable D — wire scripts into `package.json`

Add two scripts and append the two build-time generators to the `build` chain (the IndexNow submit runs post-deploy, NOT in build).

In `"scripts"`, add:
```json
"reconcile:sitemap": "npx tsx scripts/reconcile-sitemap-index.ts",
"generate:site-index": "npx tsx scripts/generate-site-index.ts",
"submit:indexnow": "npx tsx scripts/submit-indexnow.ts"
```
Then append to the END of the existing `"build"` value (after `generate:distribution`):
```
 && npm run generate:site-index && npm run reconcile:sitemap
```
(Order matters: `generate:site-index` reads sub-sitemaps, then `reconcile:sitemap` rebuilds the index including `site-index` if you added it to core.)

---

## 6. VALIDATE (before deploy) — all must pass

```bash
cd ~/invisible-exit
npm run build   # runs the full chain incl. your two new steps

# a) sitemap index now references pseo + scenarios (previously orphaned)
grep -c "sitemap-pseo.xml" dist/sitemap.xml       # expect 1
grep -c "sitemap-scenarios.xml" dist/sitemap.xml  # expect 1
echo "index entries:"; grep -c "<loc>" dist/sitemap.xml   # expect ~18

# b) robots has Sitemap line + it reached dist
grep -c "Sitemap:" dist/robots.txt                # expect >= 1

# c) HTML hub built and non-empty
test -s dist/site-index.html && grep -c "Site Index" dist/site-index.html

# d) scripts are syntactically OK under tsx (no run needed for reconcile beyond build)
npx tsx -e "console.log('tsx ok')"

# e) key file still present in dist (needed for IndexNow)
test -f dist/invisibleexit-indexnow-2026.txt && echo "✓ key present"
```
If any fail, fix the relevant script/file and re-run `npm run build`. Do not deploy a failed build.

---

## 7. DEPLOY + SUBMIT (autonomous)

```bash
cd ~/invisible-exit
# Commit only your files
git checkout -b indexing-discovery-engine
git add scripts/reconcile-sitemap-index.ts scripts/submit-indexnow.ts scripts/generate-site-index.ts \
        package.json public/robots.txt public/site-index.html
git commit -m "Add instant-indexing & discovery engine (IndexNow + complete sitemap index + HTML hub)"

# Deploy — Vercel prebuilt with archive flag (project invisible-exit).
# dist/ is already built by step 6. Use the repo's established prebuilt deploy:
npx vercel build --prod
npx vercel deploy --prebuilt --prod --archive=tgz
# (If a deploy script exists — check `grep -n deploy package.json` or scripts/ — prefer it.)

# --- Verify the live sitemap is now complete ---
sleep 20
curl -s https://invisibleexit.com/sitemap.xml | grep -c "sitemap-scenarios.xml"   # expect 1 (was 0)
curl -s https://invisibleexit.com/site-index.html | grep -c "Site Index"           # expect 1
curl -sI https://invisibleexit.com/invisibleexit-indexnow-2026.txt | head -1       # expect 200

# --- Fire IndexNow against the LIVE sitemaps (Bing/Yandex → Copilot/ChatGPT Search) ---
npx tsx scripts/submit-indexnow.ts
```
The IndexNow script is non-fatal: if the key file check or submit fails, it logs and exits 0 — the deploy still stands. On first run it submits the whole fleet; thereafter only new/changed URLs.

---

## 8. POST-DEPLOY (do these to complete the loop)

1. **Google Search Console** (Google ignores IndexNow): add/confirm the sitemap `https://invisibleexit.com/sitemap.xml` under Sitemaps (now complete). Google's own `/ping` endpoint was retired in 2023 — do NOT try to ping Google; a clean, complete, freshly-`lastmod`'d sitemap + Search Console is the correct path.
2. **Bing Webmaster Tools:** confirm the sitemap; IndexNow submissions will already be flowing.
3. **Weekly refresh** (keeps instant-indexing live as pages change) — add to a Hermes weekly task:
   ```bash
   cd ~/invisible-exit && npm run build && npx vercel build --prod && \
   npx vercel deploy --prebuilt --prod --archive=tgz && npx tsx scripts/submit-indexnow.ts
   ```

---

## 9. Expected results (honest, mechanism-based — estimates, not guarantees)

**This is an upstream discovery/indexation play.** It doesn't add content — it ensures the 4,005 pages you already have get **found, crawled, and indexed** across search + AI-search engines. Indexation is the prerequisite for all organic traffic; you can't rank a page an engine hasn't indexed.

| Effect | Mechanism | Realistic outcome | When |
|---|---|---|---|
| **Faster + fuller indexation (Bing/Yandex)** | IndexNow pushes new/changed URLs instantly instead of waiting for crawl | New/updated pages indexed in hours–days on Bing/Yandex vs. weeks | days |
| **AI-search presence (ChatGPT Search / Copilot)** | Bing's index powers both; IndexNow feeds Bing | Faster appearance in ChatGPT Search & Copilot answers — a genuine AEO win most sites miss | 1–4 weeks |
| **Google discovers the orphaned pages** | `pseo` + `scenarios` sub-sitemaps now in the index; complete sitemap + accurate `lastmod` | Previously-unsubmitted pages enter Google's crawl queue; re-crawl prioritization improves | 2–6 weeks |
| **Crawl-path + PageRank to deep pages** | `/site-index.html` hub links every section/deep page | Deep pages leave "discovered – not indexed"; better crawl-budget use on a 4k-page site | 3–8 weeks |

**Straight talk:**
- **Google does not use IndexNow** — the Google win here comes from the *complete sitemap index + freshness + HTML hub*, not the ping. The ping's value is Bing/Yandex + (importantly) the AI-search engines Bing feeds.
- The size of the win scales with **how many pages are currently unindexed.** If most of the 4,005 are already indexed, expect a modest lift + faster future updates; if a large share are undiscovered (likely, given orphaned sitemaps + no IndexNow + no HTML hub), the lift can be substantial.
- This is the *upstream* fix. Once pages are reliably indexed, the next levers are on-page quality + internal linking + off-site authority. Measure in Search Console: **Coverage → "Indexed" count** should rise; then watch impressions.

---

## 10. Rollback
All changes are additive (3 new scripts, generated static files) plus a `package.json` build-chain append and 2 robots lines. Roll back: `git revert` the commit, rebuild, redeploy. Delete `data/.indexnow-state.json` if you want the next run to resubmit everything.

### Definition of done
- [ ] `scripts/reconcile-sitemap-index.ts`, `scripts/submit-indexnow.ts`, `scripts/generate-site-index.ts` created.
- [ ] `package.json`: 3 scripts added + build chain appends `generate:site-index` and `reconcile:sitemap`.
- [ ] `public/robots.txt` has ≥1 `Sitemap:` line; `dist/sitemap.xml` references all ~18 sub-sitemaps incl. `pseo` + `scenarios`.
- [ ] `dist/site-index.html` built and reachable after deploy.
- [ ] Build passes; committed to a branch; deployed via Vercel prebuilt `--archive=tgz`.
- [ ] Live sitemap verified complete; `submit-indexnow.ts` ran against LIVE URLs (non-fatal if it skips).
- [ ] Weekly refresh noted. Zero fabricated URLs. Router/i18n/SW/layout untouched.
```
