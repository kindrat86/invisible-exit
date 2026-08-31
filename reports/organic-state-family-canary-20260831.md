# Invisible Exit state-family consolidation canary

Status: PREPARED, NOT DEPLOYED. Owner approval is required before the canary is implemented.

## Evidence

- GSC property: `https://invisibleexit.com/`
- Window: `2026-08-01` through `2026-08-30` (`dataState=all`)
- Scope: 204 child URLs, 51 in each of `/banking/`, `/insurance/`, `/tax-guides/`, and `/nda-guides/`.
- Result: 156 child URLs had zero impressions; 48 had impressions; all 204 had zero clicks.
- Total child-page impressions in the window: 132.
- Machine-readable evidence: `reports/organic-state-family-canary-20260831.json`.

| Family | Child URLs | Zero-impression | With impressions | Impressions | Clicks | Canary |
|---|---:|---:|---:|---:|---:|---:|
| `/banking/` | 51 | 27 | 24 | 91 | 0 | 13 |
| `/insurance/` | 51 | 45 | 6 | 10 | 0 | 13 |
| `/tax-guides/` | 51 | 34 | 17 | 30 | 0 | 12 |
| `/nda-guides/` | 51 | 50 | 1 | 1 | 0 | 12 |

## Guardrail mechanics

- Rollback baseline: commit `566649caf1adb40aa6648ee8937634340b6cd5ac`, pushed to `origin/main` before any canary implementation.
- Canary size: exactly 50 child URLs, all with zero GSC impressions and zero clicks in the stated window.
- Hold: 7 complete days after production verification before any remaining child URL changes.
- Full rollout remains a separate owner-gated decision. The canary leaves 154 child URLs unchanged.
- Redirect status: exact HTTP 301 using Vercel `redirects[].statusCode`; do not use `permanent: true`, which emits 308. Reference: https://vercel.com/docs/project-configuration/vercel-json#redirects
- Targets: each child redirects to its existing topic hub (`/banking`, `/insurance`, `/tax-guides`, or `/nda-guides`).
- Net-new indexable URLs: zero.

## Implementation slice after approval

1. Rebuild the four existing hubs as consolidated topic pages with an accessible state selector. Remove links that point back into redirected canary URLs. Do not add URLs.
2. Remove unsourced numeric and legal claims from the four hubs or attach committed source manifests before retaining them. The current hubs are not acceptable final redirect targets as written.
3. Add the 50 exact 301 rules to `vercel.json` with `statusCode: 301`.
4. Exclude exactly those 50 paths from generated sitemaps, llms files, site-index output, OG generation, and internal-link emitters. Leave every non-canary child unchanged during the hold.
5. Run the full build and route tests, then deploy only from the committed and pushed SHA through `deploy_from_commit.sh`.
6. Browser-verify all four hubs for real H1 and body content. Verify all 50 redirects have one hop, exact 301 status, correct destination, and no redirect loop. Browser-verify one unchanged child per family remains 200 and indexable.
7. Hold for 7 complete days. Compare child-family clicks, impressions, redirect failures, 404s, sitemap membership, and indexed-and-impressed ratio before proposing the remaining 154 URLs.

## Exact 50-URL canary

### /banking/ -> /banking

- `/banking/arizona`
- `/banking/colorado`
- `/banking/connecticut`
- `/banking/delaware`
- `/banking/district-of-columbia`
- `/banking/florida`
- `/banking/idaho`
- `/banking/illinois`
- `/banking/indiana`
- `/banking/iowa`
- `/banking/kentucky`
- `/banking/louisiana`
- `/banking/maryland`
### /insurance/ -> /insurance

- `/insurance/alabama`
- `/insurance/arizona`
- `/insurance/arkansas`
- `/insurance/colorado`
- `/insurance/connecticut`
- `/insurance/delaware`
- `/insurance/district-of-columbia`
- `/insurance/florida`
- `/insurance/georgia`
- `/insurance/hawaii`
- `/insurance/illinois`
- `/insurance/indiana`
- `/insurance/iowa`
### /tax-guides/ -> /tax-guides

- `/tax-guides/alaska`
- `/tax-guides/arizona`
- `/tax-guides/arkansas`
- `/tax-guides/connecticut`
- `/tax-guides/delaware`
- `/tax-guides/district-of-columbia`
- `/tax-guides/hawaii`
- `/tax-guides/idaho`
- `/tax-guides/illinois`
- `/tax-guides/indiana`
- `/tax-guides/kansas`
- `/tax-guides/louisiana`
### /nda-guides/ -> /nda-guides

- `/nda-guides/alabama`
- `/nda-guides/alaska`
- `/nda-guides/arizona`
- `/nda-guides/arkansas`
- `/nda-guides/california`
- `/nda-guides/colorado`
- `/nda-guides/delaware`
- `/nda-guides/district-of-columbia`
- `/nda-guides/florida`
- `/nda-guides/georgia`
- `/nda-guides/hawaii`
- `/nda-guides/idaho`

## Stop conditions

Do not continue to the remaining 154 child URLs if any canary URL produces a chain or loop, any target hub lacks a real H1/body, an unchanged control URL changes status or robots behavior, the build is red, or a canary URL earns a click before implementation and needs re-evaluation.
