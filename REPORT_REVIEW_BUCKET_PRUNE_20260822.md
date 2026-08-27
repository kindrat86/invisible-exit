# REVIEW Bucket Traffic Prune Report

Date: 2026-08-22 (Europe/Athens)

## PostHog query

- Host: `invisibleexit.com`
- PostHog region: EU
- Project: `143861`
- Event: `$pageview`
- Window: rolling 30 days ending at query time on 2026-08-22
- URL key: `$pathname`
- Count method: total pageview events grouped by pathname

The API returned 260 pageviews across 89 distinct site paths in the same host and time window. This was used as a diagnostic control against an empty or wrongly scoped query.

## Traffic by REVIEW pattern

| Pattern | Distinct URLs with at least 1 pageview | Total pageviews | Highest pageviews for one page | Selected |
|---|---:|---:|---:|---|
| `/how-to/` | 0 | 0 | 0 | Yes |
| `/is-it-legal/` | 0 | 0 | 0 | Yes |
| `/cost-analysis/` | 0 | 0 | 0 | Yes |
| `/side-hustles/` | 0 | 0 | 0 | Yes |
| `/quit-your-job/` | 0 | 0 | 0 | Yes |
| `/weekend-builds/` | 0 | 0 | 0 | Yes |
| `/failure-stories/` | 0 | 0 | 0 | Yes |
| `/case-studies/` | 0 | 0 | 0 | Yes |
| `/reviews/` | 0 | 0 | 0 | Yes |
| `/by-budget/` | 0 | 0 | 0 | Yes |
| `/vs/` | 0 | 0 | 0 | No |
| `/stack/` | 0 | 0 | 0 | No |
| `/salaries/` | 0 | 0 | 0 | No |
| `/milestones/` | 0 | 0 | 0 | No |
| `/timeline/` | 0 | 0 | 0 | No |
| `/alternatives/` | 0 | 0 | 0 | No |
| `/exit-strategies/` | 0 | 0 | 0 | No |
| `/blueprint/` | 0 | 0 | 0 | No |
| `/roadmap/` | 0 | 0 | 0 | No |
| `/tools/` | 1 | 1 | 1 | No |

The 19 zero-traffic patterns tied. The original REVIEW list order was used as the deterministic tie-break. The first 10 zero-traffic patterns became the prune set.

The only REVIEW path with traffic was `/tools/best-no-code-tools-for-real-estate-agents`, with 1 pageview. Its `/tools/` prefix was not selected. No selected pattern had a page with 10 or more pageviews. In fact, every selected pattern had zero pageviews.

## Bottom 10 selected

1. `/how-to/`
2. `/is-it-legal/`
3. `/cost-analysis/`
4. `/side-hustles/`
5. `/quit-your-job/`
6. `/weekend-builds/`
7. `/failure-stories/`
8. `/case-studies/`
9. `/reviews/`
10. `/by-budget/`

## Config and implementation

Added these prefixes alphabetically to `NOINDEX_URL_PATTERNS` in `src/data/noindex-config.ts` under:

```ts
// REVIEW-bucket prune — added 2026-08-22
```

The sitemap generator, static meta prerenderer, and client-side `SEOHead` now read the shared config. This prevents the three copies of the noindex rules from drifting apart.

The sitemap generator also applies the shared config to legacy sub-sitemaps copied from `public/`. It removed 25 noindex URLs that would otherwise have remained in `sitemap-professions.xml` despite having noindex meta tags.

The homepage static title was shortened to `Faceless Side Business Without Quitting | Invisible Exit` because the prior prerender truncation removed `Invisible Exit` and failed the required title gate.

## Build and deploy

- `npm run build`: PASS
- JSON-LD: PASS, 2,007 HTML files and 13,317 JSON-LD blocks checked
- Internal links: PASS, 0 broken targets
- llms drift checks: PASS
- `vercel build --prod`: PASS
- Production deploy: READY
- Deploy URL: https://invisible-exit-i2y7x11x6-sipiteno.vercel.app
- Production alias: https://invisibleexit.com

Vercel CLI 58.9.0 requires `vercel build --prod` before a prebuilt production deploy. The unqualified `vercel build` created a preview artifact, so it was rebuilt with `--prod` and then deployed successfully. Vercel also printed the repository's known non-blocking TypeScript warning in `api/_lib/referral.ts`; the build still completed with status `ok`.

## Live gates

| Gate | Result |
|---|---|
| `curl https://invisibleexit.com/` returns 200 | PASS, HTTP 200 |
| Homepage title contains `Invisible Exit` | PASS, `Faceless Side Business Without Quitting | Invisible Exit` |
| Sample newly noindexed page | PASS, `/how-to/start-a-micro-saas-with-no-money` returned HTTP 200 and `<meta name="robots" content="noindex, follow">` |
| Sample KEEP page | PASS, `/tools/best-no-code-tools-for-real-estate-agents` returned HTTP 200 and `<meta name="robots" content="index, follow">` |
| Direct deployment sample | PASS, newly noindexed page returned HTTP 200 and `noindex, follow` |
| Live sitemap exclusion | PASS, all 10 newly noindexed prefixes have 0 entries across all 19 referenced sub-sitemaps |
| Live sitemap KEEP control | PASS, the sampled `/tools/` page remains present |
| Stray Vercel project metadata | PASS, `/.vercel/project.json` returned HTTP 404 |

## IndexNow

`npx tsx scripts/submit-indexnow.ts` completed successfully after deployment:

- 878 live sitemap URLs found
- 60 new or changed URLs submitted
- IndexNow returned HTTP 200
- Local IndexNow state updated

It was run again after the final legacy-sitemap correction:

- 853 live sitemap URLs found
- 0 new or changed URLs remained
- IndexNow reported that there was nothing new to submit
