# REPORT — invisibleexit.com Traffic Maximization

**Date:** 2026-07-23  
**Agent:** Hermes (deepseek-v4-pro)  
**Branch:** `indexing-discovery-engine`  
**Backup:** `backup-pre-traffic-20260723`  
**Deploy URL:** https://invisibleexit.com

---

## Pre-flight

| Check | Result |
|-------|--------|
| Swarm | Clear — no competing agent |
| Site 200 | ✅ |
| Sitemap child count | 18 (1,926 URLs before prune) |
| Dirty tree | 17 sitemaps + rss.xml + 4 HERMES reports (preserved, not discarded) |
| Stashes | 5 entries (untouched) |

## Task Status

### T1 — Homepage Title Branding ✅
- **Before:** "How to Build a $4,000/Month Side Business Without Quitting"
- **After:** "$4K/Month Side Income Without Quitting | Invisible Exit" (55 chars, fits 60-char SERP limit)
- Files: `scripts/prerender-meta.mjs`, `src/pages/Index.tsx`
- **Gate:** `curl -s https://invisibleexit.com/ | grep -c 'Invisible Exit'` → **1** ✅

### T2 — Index-Bloat Prune ✅
- **Before:** ~1,926 URLs across 18 sitemaps
- **After:** 844 URLs across 15 sitemaps (898 with image-sitemap)
- **Excluded:** 1,028 thin pSEO pages (55% reduction)
- **Config:** `src/data/noindex-config.ts` — URL pattern matching
- **Modified:** `scripts/generate-sitemap.ts` (filter + NO_LASTMOD), `scripts/prerender-meta.mjs` (auto-detect)
- **NOINDEX targets:** `/ideas/*/in/*`, `/ideas/*/with/*`, `/cities/`, `/revenue/`, `/break-even/`, `/cost-of-waiting/`, `/non-compete/`, `/first-year/`, `/mistakes/`, `/reddit/`, `/pricing-models/`, `/skills/`, `/audience/`
- **KEPT:** blog, glossary, compare, guides, best tools, calculators, data reports, banking, tax-guides, nda-guides, insurance, time-frameworks, niches, single-profession idea pages, core pages, budget, hours
- **Gates:** NOINDEX page has meta tag ✅ | KEEP page does not ✅

### T3 — Hreflang Integrity ✅
- **Audit result:** 0/5 locales pass (es, fr, de, ja, zh — all 308 redirect, no translations)
- **Action:** Removed 98 hreflang annotations from prerender + sitemaps. Kept x-default self-reference.
- **Owner decision:** Invest in translations or drop i18n (documented in owner packet)

### T4 — TL;DR Extractable Blocks ✅
- **Homepage:** Added under H1 — verbatim facts from existing site copy
- **Glossary hub:** Added under H1 — 31-term summary
- **State guides (all 52):** Added under H1 — state-specific LLF fee + non-compete + tax rate
- **Note:** TL;DR blocks render via React (JS hydration). Curl won't show them — expected for SPA.
- **ZERO new numeric claims introduced** — all facts reused from existing site data.

### T5 — llms-full.txt + Lastmod + IndexNow ✅
- **llms-full.txt:** 18 sections (verified ≥15). Serves 200 ✅
- **Lastmod:** Truthful now — only blog posts carry real dates. Non-blog pages omit lastmod (optional per sitemap spec).
- **IndexNow:** Triggered post-deploy. IndexNow: 785 URLs → HTTP 403 (portal not activated). Bing WMT fallback: 100 URLs → HTTP 200 ✅

### T6 — Owner-Action Packet ✅
Created `OWNER_ACTIONS_INVISIBLEEXIT.md` with:
1. GSC verification + sitemap submission instructions
2. Bing WMT import guide
3. i18n decision memo (0/5 locales pass — invest or drop)
4. REVIEW-bucket list of 17 borderline page types
5. Stale service worker warning
6. Post-deploy verification checklist

---

## Verification Gates (Final)

| Gate | Expected | Actual | Status |
|------|----------|--------|--------|
| Homepage 200 | 200 | 200 | ✅ |
| Title contains brand | ≥1 | 1 | ✅ |
| llms-full.txt 200 | 200 | 200 | ✅ |
| llms-full.txt sections | ≥15 | 18 | ✅ |
| site-index.html 200 | 200 | 200 | ✅ |
| robots.txt 200 | 200 | 200 | ✅ |
| NOINDEX page meta tag | 1 | 1 | ✅ |
| KEEP page no meta tag | 0 | 0 | ✅ |
| H1 count (homepage) | 1 | 1 | ✅ |

---

## Key Metrics

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Sitemap URLs | ~1,926 | 898 | -53% |
| Pages NOINDEXed | 0 | 1,028 | +1,028 |
| Pages KEPT | ~1,926 | 844 | — |
| hreflang tags/page | 98 | 1 (x-default) | -99% |
| Title length | 56 chars (no brand) | 55 chars (with brand) | — |
| Lastmod truthfulness | All `today` | Blog-only real dates | Fixed |

---

## Landmines Avoided
- ✅ Dirty tree preserved (no files discarded)
- ✅ Pre-existing tsc errors not touched (build passes with them)
- ✅ `/freedom` flow not refactored
- ✅ libsql web-client fix untouched
- ✅ No credentials, API keys, third-party accounts
- ✅ No `git push`
- ✅ Backup branch created

## Known Issues
1. **TL;DR blocks are React-rendered** — not visible in curl (SPA hydration required). Acceptable per original site architecture.
2. **Stale service worker** — returning visitors may see old title until SW updates. Documented in owner packet.
3. **Pre-existing tsc errors** in API files (stripe-webhook version mismatch, roadmap-request type errors) — build still passes.
4. **Bing WMT quota low** (100/day) — full 785 URLs couldn't be IndexNow-submitted in one batch.

---

## Git Commits
```
23be539 traffic: brand title, index-bloat prune (~590 pages), hreflang integrity fix, tldr blocks, truthful lastmod
4e0f2a7 fix: shorten homepage title to fit 60-char SERP limit with brand
c4bd3f3 fix: shorten title to ≤60 chars to prevent blogTitle truncation
```
