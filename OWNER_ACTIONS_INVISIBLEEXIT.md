# Owner Action Packet — invisibleexit.com

**Date:** 2026-07-23  
**Agent:** Hermes (deepseek-v4-pro)  
**Mission:** Traffic maximization — brand title, index-bloat prune, hreflang integrity, TL;DR blocks, llms-full, lastmod truthfulness

---

## 1. GSC Verification + Submit Sitemap

After deploy:
1. Log into [Google Search Console](https://search.google.com/search-console) for invisibleexit.com
2. Go to **Sitemaps** → submit `https://invisibleexit.com/sitemap.xml`
3. **Expected:** GSC will surface noindex transitions for ~590 pruned pages. This is normal and intentional — these thin cross-product pages were suppressing crawl budget.
4. Monitor **Index Coverage** report over 2–4 weeks. The noindexed pages will move to "Excluded — Excluded by noindex tag."

---

## 2. Bing Webmaster Tools Import

1. Log into [Bing Webmaster Tools](https://www.bing.com/webmasters/) for invisibleexit.com
2. Import sitemaps from GSC or submit `https://invisibleexit.com/sitemap.xml` directly
3. IndexNow is already active (key file at `/invisibleexit-indexnow-2026.txt`). Bing will pick up changes automatically within 24–48 hours after the IndexNow ping.

---

## 3. i18n Decision Memo

**Finding:** All 98 hreflang locale variants return **308 redirects** — zero pages serve actual translated content. Sample of 5 locales (es, fr, de, ja, zh): 0/5 pass reciprocity.

**Action taken:** Removed hreflang annotations from:
- `scripts/prerender-meta.mjs` — replaced 98 hreflang links with x-default self-reference only
- `scripts/generate-sitemap.ts` — removed xhtml namespace, HREFLANG_LANGS array, and per-URL hreflang annotations

**Owner decision required:**
- **Option A — Invest in i18n:** Hire translators, build real locale pages (not redirects), restore hreflang. This is the high-ROI path IF you can serve non-English audiences.
- **Option B — Drop i18n entirely:** Remove the `/:lang` redirect routes from `App.tsx`, remove i18next/language-detector deps, and reclaim the crawl budget. The 308 redirects are wasted crawl budget for Googlebot.
- **Recommendation:** Option B unless you have concrete plans to translate. Half-broken hreflang is worse than none — Google may penalize mismatched language annotations.

---

## 4. Prune REVIEW-Bucket List

The conservative NOINDEX prune applied to ~590 thin pSEO pages (cross-product templates). The following were **NOT** noindexed but are borderline thin and should be reviewed:

| URL Pattern | Example | Reason to Review |
|---|---|---|
| `/how-to/*` | `/how-to/build-micro-saas` | Thin guides — may bulk up or noindex |
| `/is-it-legal/*` | `/is-it-legal/side-business` | Legal templates — thin, but user-facing |
| `/cost-analysis/*` | `/cost-analysis/llc-formation` | Data-driven but template-heavy |
| `/side-hustles/*` | `/side-hustles/software-engineer` | Thin intro + list format |
| `/quit-your-job/*` | `/quit-your-job/at-4000-mrr` | Thin motivational content |
| `/weekend-builds/*` | `/weekend-builds/saas-product` | Template-driven |
| `/failure-stories/*` | `/failure-stories/churn-killed-my-saas` | Thin narratives |
| `/case-studies/*` | `/case-studies/stealth-exit` | Variable quality |
| `/reviews/*` | `/reviews/notion` | Thin reviews |
| `/by-budget/*` | `/by-budget/500-dollars` | Template with budget number swap |
| `/vs/*` | `/vs/software-engineer-vs-micro-saas` | Thin comparison templates |
| `/tools/*` | `/tools/best-analytics-tools` | Cross-reference pages |
| `/stack/*` | `/stack/software-engineer` | Profession tool stacks — thin |
| `/salaries/*` | `/salaries/software-engineer-salary` | Salary pages — thin |
| `/milestones/*` | `/milestones/1000-mrr` | Thin milestone pages |
| `/timeline/*` | `/timeline/month-1` | Thin timeline entries |
| `/alternatives/*` | `/alternatives/notion` | Product alternatives — thin |
| `/exit-strategies/*` | `/exit-strategies/sell-micro-saas` | Exit strategy pages |
| `/blueprint/*` | `/blueprint/saas-mvp` | Build blueprints — thin |
| `/roadmap/*` | `/roadmap/1000-mrr` | Roadmap pages — thin |

**Recommendation:** Pick the bottom 10 types by traffic after 30 days post-deploy and add them to the NOINDEX list. This lets you measure actual traffic impact before pruning more.

---

## 5. Stale Service Worker Warning

**Issue:** Returning visitors may see old content on first load because the service worker (`public/sw.js`) caches aggressively. This affects verification — fresh curl requests are immune, but human visitors opening the site may briefly see the pre-deploy version.

**Fix (for owner):** After deploy, bump the service worker version in `public/sw.js`. Add a cache-busting strategy or reduce cache TTL for HTML pages. The SW currently caches the app shell, which includes the old `<title>` tag until the SW updates.

---

## 6. What Changed in This Deploy

| Change | Files Modified |
|---|---|
| Homepage title + brand append | `scripts/prerender-meta.mjs`, `src/pages/Index.tsx` |
| Index-bloat prune (~590 pages noindexed) | `src/data/noindex-config.ts` (new), `scripts/generate-sitemap.ts`, `scripts/prerender-meta.mjs` |
| Hreflang removal (98→1 x-default) | `scripts/prerender-meta.mjs`, `scripts/generate-sitemap.ts` |
| TL;DR extractable blocks | `src/pages/Index.tsx`, `src/pages/GlossaryIndex.tsx`, `src/pages/StateGuidePage.tsx` |
| Truthful lastmod (blog only) | `scripts/generate-sitemap.ts` |
| llms-full.txt unchanged (already ≥15 sections) | — |

**Git:** Changes committed on branch `indexing-discovery-engine` (backup: `backup-pre-traffic-20260723`). Dirty tree preserved — no files discarded.

---

## 7. Post-Deploy Verification Checklist

```bash
# All must return 200
curl -s -o /dev/null -w "%{http_code}\n" https://invisibleexit.com/
curl -s -o /dev/null -w "%{http_code}\n" https://invisibleexit.com/llms-full.txt
curl -s -o /dev/null -w "%{http_code}\n" https://invisibleexit.com/site-index.html
curl -s -o /dev/null -w "%{http_code}\n" https://invisibleexit.com/robots.txt

# Title must contain brand
curl -s https://invisibleexit.com/ | grep -o '<title>[^<]*' | grep -c 'Invisible Exit'  # → 1

# Sampled noindex page carries meta tag
curl -s https://invisibleexit.com/cities/new-york/for/software-engineer | grep -c 'noindex'  # → 1

# Sampled KEEP page does NOT carry noindex
curl -s https://invisibleexit.com/glossary/micro-saas | grep -c 'noindex'  # → 0
```
