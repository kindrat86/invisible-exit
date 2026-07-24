# HERMES REPORT — invisibleexit.com Conversion Repair

**Date:** 2026-07-22  
**Branch:** `indexing-discovery-engine`  
**Commit:** `fb9a702`  
**Rollback:** `3cc633e`  
**Deploy:** https://invisibleexit.com (Vercel production, 60s deploy)

---

## 1. INCOME-CLAIM TABLE

| File | Line | Original | Classification | Action |
|------|------|----------|---------------|--------|
| `FrameworkDiagram.tsx` | 166 | "RESULT: $4,000+/month MRR while employed — in 12 months" | PROMISE | Changed to "GOAL: build recurring revenue while still employed" |
| `BeliefCrusherPage.tsx` | 47 | "reached $4,100/month in 12 months while still employed" | PROMISE | Changed to "built sustainable side revenue while staying employed" |
| `blog-posts.ts` | 493 | "Some people hit $4,000/month in 9 months. Others take 24." | PROMISE | Changed to "Timelines vary widely. Some people move faster; others take more time." |
| `Index.tsx` | 181 | SEO title: "Build a $4,000/Month Side Business..." | PROMISE | Changed to "Build Side Revenue Without Quitting Your Job" |
| `Index.tsx` | 182 | SEO description: "$4,000/month...in 12 months" | PROMISE | Removed specific figure and timeline |
| `Index.tsx` | 2263 | "how I went from trapped to $4,100 MRR in 12 months" | PROMISE | Changed to "how I went from trapped to building real side revenue" |
| `MasterclassPage.tsx` | 93-94 | Narrative body with monthly MRR + "$4,100 MRR in 12 months" stat | PROMISE | Replaced specific MRR figures with "Growing MRR" / "Recurring revenue" |
| `PillarHubPage.tsx` | 33 | "($0 → $4,100 MRR in 12 months)" | PROMISE | Changed to "($0 → recurring side revenue)" |
| `HooksLibraryPage.tsx` | 156 | "build a $4K/month side business" | PROMISE | Changed to "build recurring side revenue" |
| `HooksLibraryPage.tsx` | 161 | "build $4,100/month MRR in 12 months" | PROMISE | Changed to "build recurring monthly revenue" |
| `HooksLibraryPage.tsx` | 167 | "built $4,100/month in side revenue in 12 months" | PROMISE | Changed to "built recurring side revenue" |
| `glossary.ts` | 34 | "A micro-SaaS charging $29/month with 138 customers generates $4,000/month" | EXAMPLE | **LEFT UNTOUCHED** — arithmetic example, not a promise |
| `ShareableResult.tsx` | 23,40 | "$4,000/month MRR" | EXAMPLE | **LEFT UNTOUCHED** — calculator sample output |
| `SmartInputPanel.tsx` | — | "4000" | EXAMPLE | **LEFT UNTOUCHED** — calculator input chip |
| `revenue-roadmaps.ts` | 141 | `customersNeeded: 127` | MATH | **LEFT UNTOUCHED** — arithmetic ($10,000 ÷ $79/mo = 127), not social proof |
| `Index.tsx` | 1251 | "$127 overnight" | NEUTRAL | **LEFT UNTOUCHED** — dollar amount in reader-insert narrative |
| `quit-job.ts` | 378 | "return to employment within 12 months" | STAT | **LEFT UNTOUCHED** — failure statistic, not success promise |

---

## 2. SOCIAL-PROOF REMOVALS

| Claim | Files changed | Replacement |
|-------|--------------|-------------|
| **127 builders/managers/members** | `TestimonialGrid.tsx`, `InlineSqueeze.tsx`, `AuthorityBar.tsx`, `BeliefCrusherPage.tsx`, `Index.tsx`, `StartPage.tsx`, `SqueezePage.tsx`, `HubAndSpokePage.tsx` | Removed count; replaced with qualitative framing (e.g., "Managers building now") or removed entirely |
| **4.8/5 rating** | `TestimonialGrid.tsx`, `Index.tsx`, `StartPage.tsx` | Removed entirely — no review platform backs this |
| **73 of 100 / spots left** | `InlineSqueeze.tsx`, `Index.tsx`, `StartPage.tsx`, `SqueezePage.tsx`, `MasterclassPage.tsx`, `FoundingWallPage.tsx`, `HooksLibraryPage.tsx` | Replaced with "Founding membership open" (no fabricated count) |
| **Named MRR testimonials** | `TestimonialGrid.tsx` (6 entries), `ProofPage.tsx` (STATS, CASE_STUDIES, TIMELINE_RESULTS), `Index.tsx` (Schema.org AggregateRating + fake reviews) | All removed. TestimonialGrid now renders `null` when no real testimonials exist. ProofPage rewritten to honest framing. |
| **$31K+ Combined MRR** | `TestimonialGrid.tsx` | Removed |
| **App.tsx trust bar** | `App.tsx` — "$4,000 Monthly Recurring Target" and "138 Customers Onboarded" | Replaced with verifiable metrics: "5h/wk Time Commitment", "$0.97 Founding Price", "5 AI Tools Included", "30-Day Money-Back Guarantee" |

**Confirmation:** No replacement number was invented. Every removal was replaced with qualitative framing or nothing.

---

## 3. CALCULATOR (/freedom)

- `src/components/fym/` **logic and example values are UNCHANGED** — verified via `git diff --stat src/components/fym/` (empty)
- `SmartInputPanel.tsx` still contains the `$4,000` example chip — untouched per Rule 2
- The intro step now leads directly with the salary input + quick-select chips ($80K/$120K/$160K/etc.)
- One ask above the fold: "Continue" (no competing CTAs)
- Old narrative content (hook bullets, customer portrait) moved below the result as "The Story Behind This Calculator"

**Step-level instrumentation added:**

| Event | Fires when | Location |
|-------|-----------|----------|
| `freedom_calc_started` | Intro → expenses (salary submitted) | SqueezePage.tsx:182 |
| `freedom_calc_income_entered` | Salary step → expenses | SqueezePage.tsx:278 |
| `freedom_calc_expenses_entered` | Expenses step → timeline | SqueezePage.tsx:363 |
| `freedom_calc_hours_entered` | Timeline step → calculate | SqueezePage.tsx:476 |
| `freedom_number_calculated` | (pre-existing) Result computed | SqueezePage.tsx:88 |

All events fire once per step via form submit handlers — no `useEffect` re-fire risk.

---

## 4. TYPE-ERROR COUNT

| Stage | Count |
|-------|-------|
| Baseline (pre-edit) | **0** |
| After all edits | **0** |
| Change | **0 (no increase)** |

Note: The task's claim of "pre-existing TypeScript errors" was not reproducible — `tsc --noEmit` exits cleanly on the unmodified tree. The Vercel build shows API-level TS errors in `api/` directory serverless functions, which are separate from the React `src/` and pre-existing.

---

## 5. GUARANTEE UNIFICATION

**Canonical terms:** 30-day money-back guarantee (matching `GuaranteeBox.tsx` default `days = 30`).

| Surface | Before | After |
|---------|--------|-------|
| `oto/GuaranteeBox.tsx` | Duplicate component | **DELETED** |
| `OTOFounding.tsx` | Imported from `@/components/oto/GuaranteeBox` | Repointed to `@/components/GuaranteeBox` |
| `TripwirePage.tsx` | `days={14}` (14-day guarantee) | Normalized to `days={30}` |
| `WeekendWorkshopPage.tsx` | `days={30}` — OK | Unchanged |
| `BookFunnelPage.tsx` | `days={30}` — OK | Unchanged |
| `ToolLandingPage.tsx` | Hardcoded "30-Day No-Questions Guarantee" section | Replaced with `<GuaranteeBox variant="bold" days={30} />` |
| `App.tsx` | Hardcoded "If you do not build revenue, you do not pay." | Updated trust bar to "30-day money-back guarantee. No questions, no forms." |
| FAQ/pricing references | Descriptive mentions of 30-day guarantee | Unchanged (consistent with canonical) |

---

## 6. SERVICE WORKER

**Investigation:** No custom "You are offline" banner component found in the codebase. The `public/sw.js` uses `skipWaiting()` + `clients.claim()` with a network-first navigation strategy and cache-fallback. The likely cause of the reported offline banner is a browser-native interstitial triggered by a cache-miss in `PAGE_CACHE` when the `/` fallback isn't present in that cache store.

**Action taken:** **SKIPPED** — per the task's instruction: "If the cause is not obvious within a reasonable effort, skip and record it." The SW caching strategy was not modified (the task explicitly forbids rewriting it).

**Recommendation for future fix:** Ensure the `/` route is also cached in `PAGE_CACHE` on SW activate (currently it's only in `STATIC_CACHE`), so the fallback at line 67 (`cache.match('/')`) always succeeds.

---

## 7. ESCALATE TO OWNER

1. **The value ladder now has zero social proof.** This is honest and correct — but it means the $7 → $2,000 ladder sells to cold traffic with no third-party validation. Real testimonials must be *earned* from real customers; they cannot be written. This is the owner's next constraint, not a copy problem.

2. **Verify removed claims.** Whether any of the removed claims (127 builders, 4.8/5, named MRR testimonials) were ever sourced from real data. If they were, the owner can restore them **with verifiable evidence** (Stripe screenshots, real names, real permission).

3. **Step 3.6 (homepage 60→5 sections) is deliberately deferred** as its own task. The ~60-section homepage should shrink to ~5 sections (hook → calculator CTA → 3 proof points → one FAQ → footer). When done, relocate (never delete) the manifesto, backstory, value ladder, and cross-promo content to their own routes — the ~4,005-page pSEO fleet's sitemap expects routes to persist.

---

## 8. SUCCESS CRITERIA — ALL MET

- ✅ No specific earnings promise (figure + deadline) survives in `src/`
- ✅ `4.8/5`, `73 of 100`, `spots left`, `127 builders`, and named-MRR testimonials are gone — with nothing invented in their place
- ✅ `src/components/fym/` calculator logic and example values unchanged
- ✅ `/freedom` shows salary input in first viewport, one ask
- ✅ `npx tsc --noEmit` error count = 0 (≤ baseline of 0)
- ✅ `npm run guard:positioning` passes
- ✅ Full 12-stage `npm run build` passes
- ✅ All routes return 200 (`/`, `/freedom`, `/proof`, `/tripwire`)
- ✅ `HERMES_*.md` and `public/blog/rss.xml` were never staged
- ✅ `public/sw.js` unchanged (SW investigation skipped, recorded)
- ✅ Guarantee unified on single component, `days=30` canonical
- ✅ OTO duplicate `GuaranteeBox.tsx` deleted, import repointed
