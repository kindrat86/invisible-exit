# HERMES TASK — invisibleexit.com Conversion Repair

**Target site:** invisibleexit.com
**Repo:** `~/invisible-exit` — Vite + React SPA (TypeScript), branch **`indexing-discovery-engine`**
**Vercel project:** `invisible-exit` / `prj_yZoL3umIuAFYUpraLiW2pwJEchYz` (deploy mode: **prebuilt**)
**Authored:** 2026-07-22
**Executor:** Hermes Agent (DeepSeek v4 Pro), autonomous
**Real data (90 days):** 380 pageviews · 190 visitors · 255 sessions · **80.4% bounce** · `freedom_number_calculated` fires **7×**

**Objective:** The calculator works and converts when reached (7 completions from 190 visitors). The blockers are **legal-risk income claims**, **fabricated social proof**, and **a working tool buried under a 60-section page**. Fix the liability first, the friction second.

---

## 0. READ THIS FIRST — FIVE HARD RULES

### RULE 1 — THIS SITE MAKES INCOME PROMISES IT CANNOT SUBSTANTIATE. THAT IS THE #1 PROBLEM.

This site sells a money-making product ($7 blueprint → $0.97/mo → $47/mo Pro → $97 workshop → $2,000 intensive) and states specific earnings outcomes:
- `src/components/FrameworkDiagram.tsx:166` — *"RESULT: $4,000+/month MRR while employed — in 12 months"*
- `src/pages/BeliefCrusherPage.tsx:47` — *"$4,100/month in 12 months"*
- `src/data/blog-posts.ts:493` — *"$4,000/month in 9 months"*
- plus *"in 12 months"* outcome framing in `src/pages/Index.tsx:182,2263`, `YouTubeStrategyPage.tsx:282`, `PillarHubPage.tsx:33`, `MasterclassPage.tsx:94`, `src/data/quit-job.ts:378`

There are **zero verified customers** on this domain. Specific, unsubstantiated earnings claims on a paid business-opportunity offer are a regulatory exposure (FTC earnings-claims rules in the US; misleading-advertising rules in the EU) — **independent of whether they convert**. Your job is to convert these from **promises** into **possibilities**, or delete them. Never strengthen one, never add a new one.

### RULE 2 — NEVER FABRICATE PROOF, AND NEVER BLIND-REPLACE AN AMBIGUOUS NUMBER

Two tokens in this repo are ambiguous and a global find/replace will corrupt real content:

- **`127`** is used as a fabricated builder-count *and* may legitimately appear as data elsewhere. Read the surrounding sentence for every hit.
- **`$4,000`** is **legitimate** as the calculator's *example freedom number* (`SmartInputPanel.tsx`, `ExitTimeline.tsx`, `ShareableResult.tsx` — these are input chips and sample outputs) but **illegitimate** as an *earnings promise* (`FrameworkDiagram.tsx:166`). Same digits, opposite meaning. **Do not touch the calculator's example values.**

You may delete a false claim. You may never invent a replacement number.

### RULE 3 — THE POSITIONING GUARD IS STRICTEST ON THIS SITE

`scripts/guard-positioning.mjs` runs **first** in `npm run build`. This is the site that historically **drifted into privacy / anonymous-browsing positioning** via the shared growth-engine — the guard exists specifically because of this domain, and it is stricter here than on sister sites (it also blocks `/for/{privacy,journalism,research,legal}`).

This brand is about **leaving your job**, not private browsing. Run it early and often:
```bash
npm run guard:positioning
```
If it fails, revert the offending line. **Never weaken the guard.**

### RULE 4 — TWO KNOWN LOCAL GOTCHAS: STALE SERVICE WORKER + PRE-EXISTING TSC ERRORS

- **`public/sw.js`** is a real PWA service worker registered at `src/main.tsx:31`. A **stale SW on first load** is a known, documented gotcha on this site — it can serve cached content or an offline shell after a deploy. Do not "optimise" the caching strategy. Any SW change requires a hard-reload + incognito verification.
- This repo has **pre-existing TypeScript errors**. `tsc --noEmit` is expected to be noisy on a clean tree. **Baseline it before you edit** (Section 1.6) and only care about errors you *introduce*. Do not go on a typing crusade.

### RULE 5 — DO NOT COMMIT THE UNTRACKED TASK FILES
The tree currently carries `HERMES_TASKS_INVISIBLEEXIT_AEO.md`, `HERMES_TASK_INDEXING_DISCOVERY_ENGINE.md` (untracked) and a modified `public/blog/rss.xml` (a generated artifact). **Stage by explicit path only.** Never `git add -A`.

---

## 1. PRE-FLIGHT (abort conditions)

```bash
cd ~/invisible-exit
```

**1.1 — Branch + rollback point.**
```bash
git branch --show-current   # expect: indexing-discovery-engine
git rev-parse HEAD          # RECORD — rollback target
git status --short          # expect: M public/blog/rss.xml + 2 untracked HERMES_*.md
```
**ABORT** if `src/` has uncommitted edits — another agent is mid-task.

**1.2 — Another agent active?**
```bash
ps aux | grep -i hermes | grep -v grep
```
`hermes-webui/server.py` and `hermes_cli.main serve` are normal. **ABORT** if anything references `invisible-exit` or a `vercel` deploy in flight.

**1.3 — Vercel binding + git author.**
```bash
grep projectName .vercel/project.json   # MUST read "invisible-exit"
git config user.email                   # MUST be sales@sipiteno.com
```

**1.4 — Live baseline.**
```bash
curl -s https://invisibleexit.com/ | grep -c "127"
curl -s -o /dev/null -w "%{http_code}\n" https://invisibleexit.com/freedom
```

**1.5 — Positioning guard is green BEFORE you edit.**
```bash
npm run guard:positioning
```
**ABORT** if it already fails on a clean tree.

**1.6 — BASELINE the pre-existing type errors (do not skip — Rule 4).**
```bash
npx tsc --noEmit 2>&1 | tee /tmp/ie-tsc-before.txt | tail -5
npx tsc --noEmit 2>&1 | grep -c "error TS"   # RECORD THIS NUMBER
```
Your edits must not **increase** this count. That is the only type gate that applies.

---

## 2. THE DIAGNOSIS

### 2.1 — P0 (LEGAL): Unsubstantiated income claims

See Rule 1 for the file list. Enumerate the live set:
```bash
grep -rnoE "\\\$[0-9,]+\+?/month( MRR)?( while employed)?( — )?( in [0-9]+ months)?|in [0-9]+ months" \
  --include="*.tsx" --include="*.ts" src/ | head -30
```
Judge each hit against this test:
- **PROMISE** (must be fixed): states or implies the reader *will* earn a specific amount in a specific time. *"RESULT: $4,000+/month MRR while employed — in 12 months"*.
- **EXAMPLE / DEFINITION** (leave alone): explains what a freedom number *is*, or is a calculator input chip / sample output. *"A micro-SaaS charging $29/month with 138 customers generates $4,000/month"* (`src/data/glossary.ts:34`) is a worked arithmetic example, not a promise.

### 2.2 — P0: Fabricated social proof

| Claim | Locations |
|---|---|
| **127 builders** | `InlineSqueeze.tsx:217`, `TestimonialGrid.tsx:131`, `AuthorityBar.tsx:85`, `revenue-roadmaps.ts:141`, `HubAndSpokePage.tsx:93`, `ProofPage.tsx:26,81,93`, `Index.tsx:222,245,452,476,1251` |
| **4.8/5 rating** | `TestimonialGrid.tsx:139`, `ProofPage.tsx:29`, `Index.tsx:455,480` |
| **73 of 100 spots** | `InlineSqueeze.tsx:137` |
| **"spots left" scarcity** | `Index.tsx:457,484` |
| **Named testimonials w/ exact MRR** | `TestimonialGrid.tsx` (e.g. `result: "$4,000/month MRR"`) |

Against **190 real visitors in 90 days**, a "127 builders / 4.8-out-of-5" community does not exist. The named testimonials with precise MRR figures are the highest-risk items: they attribute specific financial outcomes to specific people.

### 2.3 — P1: The calculator — the one thing that works — is buried

`freedom_number_calculated` fires **7×**: the tool functions and people who reach it finish it. But it sits below a 60-section page opening with an abstract *"The Cage Has a Door"* hook. `/freedom` is nominally the squeeze page yet carries a second full sales page bolted underneath.

There is also **no step-level instrumentation** — only the terminal `freedom_number_calculated`. You cannot see where the other ~96% abandon.

### 2.4 — P2: Guarantee fragmentation

There are **two separate GuaranteeBox components** plus hardcoded guarantee copy:
- `src/components/GuaranteeBox.tsx` — parameterised, `days = 30` default, 4 callers (`OTOFounding.tsx:447`, `TripwirePage.tsx:383`, `WeekendWorkshopPage.tsx:391`, `BookFunnelPage.tsx:565`)
- `src/components/oto/GuaranteeBox.tsx:26` — a **duplicate** component
- `src/components/ToolLandingPage.tsx:261` — hardcoded *"30-Day No-Questions Guarantee"*
- `src/App.tsx:469` — hardcoded *"30-day money-back guarantee. If you do not build revenue, you…"*

Four surfaces that can drift apart. Any caller passing a different `days` creates a visible contradiction.

### 2.5 — P2: "You are offline" banner during normal navigation

An offline banner appeared mid-session during testing on a live connection. `public/sw.js` is registered at `src/main.tsx:31`. A visitor who sees "You are offline" while online concludes the site is broken and leaves — a silent bounce invisible in aggregate analytics.

---

## 3. EXECUTION

Work in order. Each step has a gate. A failed gate → revert **that step only**, record it, continue.

### STEP 3.1 — Defuse the income claims (do this FIRST — it is the liability)

For every hit classified **PROMISE** in 2.1, rewrite to remove the guaranteed-outcome framing. Keep the aspiration, drop the certainty and the specific figure-plus-deadline pairing.

- `src/components/FrameworkDiagram.tsx:166` — *"RESULT: $4,000+/month MRR while employed — in 12 months"* → reframe as the framework's **goal**, not its result, and remove the figure/deadline pair. E.g. *"GOAL: build recurring revenue while still employed."*
- `src/pages/BeliefCrusherPage.tsx:47` — *"$4,100/month in 12 months"* → remove the specific figure/timeline promise.
- `src/data/blog-posts.ts:493` — *"$4,000/month in 9 months"* → if this is narrated as a real person's outcome and you cannot verify them, remove the claim.
- Review each remaining *"in 12 months"* hit in context; where it completes an earnings promise, defuse it. Where it is neutral prose, leave it.

**Add no disclaimer that implies the claims were once substantiated.** Removing them is cleaner than footnoting them.

**Gate 3.1:**
```bash
grep -rn "while employed — in 12 months\|4,100/month in 12\|4,000/month in 9" --include="*.tsx" --include="*.ts" src/   # MUST be empty
# calculator example values MUST survive untouched:
grep -c "4000" src/components/fym/SmartInputPanel.tsx    # MUST still be >= 1
git diff --stat src/components/fym/                       # MUST be empty
npm run guard:positioning
```

---

### STEP 3.2 — Remove the fabricated social proof

Work each location in the 2.2 table. **Read every `127` in context before editing** (Rule 2).

- **127 builders** → remove the count. Rewrite to a claim needing no number (*"Built by people still holding down a day job"*). **Do not substitute a smaller invented number.**
- **4.8/5 rating** → no review platform backs this. Delete the rating and its star UI. If deleting breaks a layout grid, reflow rather than backfilling another stat.
- **73 of 100 spots / "spots left"** → hardcoded fake scarcity. Delete the counter. State the cap without a claimed figure, or remove the scarcity framing entirely.
- **Named testimonials with exact MRR** (`TestimonialGrid.tsx`) → these attribute specific financial outcomes to specific named people and cannot be verified. **Remove the testimonial data entries.** If `TestimonialGrid` then renders empty, remove its call sites too rather than leaving a hollow heading.

**Gate 3.2:**
```bash
grep -rn "4\.8/5" --include="*.tsx" --include="*.ts" src/          # MUST be empty
grep -rn "73 of 100\|spots left" --include="*.tsx" src/            # MUST be empty
grep -rniE "127 (builders|founders|members)" --include="*.tsx" --include="*.ts" src/  # MUST be empty
npx tsc --noEmit 2>&1 | grep -c "error TS"   # MUST NOT exceed the 1.6 baseline
npm run guard:positioning
```

---

### STEP 3.3 — Put the calculator above the fold on `/freedom`

**Scope this step to `/freedom` only.** Do not restructure the homepage in the same run (see 3.6).

`/freedom` is the squeeze page and must do exactly one job. Reorder so the **first viewport** contains: a one-line plain value proposition + the calculator's **first input** (the salary field with its `$80K / $120K / $160K` quick-select chips), and nothing else competing.

Everything currently above the calculator (extended narrative, value-stack) moves **below** it. The FAQ, value-stack, and network cross-promo that sit underneath may stay — but nothing may sit between the top of the page and the calculator.

Constraints:
- **Do not modify the calculator's logic, state, or example values** — it demonstrably works. This is a **reordering** of page sections only.
- Remove competing CTAs (Get Blueprint, Start $0.97/mo, Apply for Pro, Join Workshop, Apply for Intensive, Get Free Book) from `/freedom`'s first screen. One ask.

**Gate 3.3:**
```bash
git diff --stat src/components/fym/   # MUST be empty — calculator internals untouched
npx tsc --noEmit 2>&1 | grep -c "error TS"   # MUST NOT exceed baseline
npm run build   # full 12-stage build must pass
```

---

### STEP 3.4 — Instrument the calculator's steps

Only the terminal `freedom_number_calculated` fires today. Add a capture at **each** step of the multi-step flow using the tracking helper already used in this repo (find it: `grep -rn "posthog.capture\|trackEvent" src/ | head`). Do not introduce a new analytics library.

Suggested events (match the repo's existing naming style): `freedom_calc_started`, `freedom_calc_income_entered`, `freedom_calc_expenses_entered`, `freedom_calc_hours_entered`.

Each must fire **once** per step per session — guard against re-fires on re-render (the calculator is a controlled multi-step form; a naive `useEffect` will spam events on every keystroke).

**Gate 3.4:**
```bash
grep -rc "freedom_calc_" src/components/fym/ | grep -v ":0"   # MUST show new events
npx tsc --noEmit 2>&1 | grep -c "error TS"   # MUST NOT exceed baseline
```

---

### STEP 3.5 — Reconcile the guarantee to a single source

Pick the canonical terms (default: **30-day money-back**, matching `GuaranteeBox.tsx`'s `days = 30`).

- Delete the duplicate `src/components/oto/GuaranteeBox.tsx` and repoint its importers at `src/components/GuaranteeBox.tsx`.
- Replace the hardcoded guarantee copy in `src/App.tsx:469` and `src/components/ToolLandingPage.tsx:261` with the shared component.
- Check all four `<GuaranteeBox` callers — if any passes a `days` value other than 30, either justify it (a genuinely different product term) or normalise it.

**Do not invent new guarantee terms.** A guarantee is a contractual commitment; you may only unify what already exists.

**Gate 3.5:**
```bash
test ! -f src/components/oto/GuaranteeBox.tsx && echo "duplicate removed"
grep -rn "day money-back\|Day No-Questions" --include="*.tsx" src/ | grep -v "components/GuaranteeBox.tsx"   # ideally empty
npx tsc --noEmit 2>&1 | grep -c "error TS"   # MUST NOT exceed baseline
```

---

### STEP 3.6 — Homepage reduction (DO NOT DO THIS IN THIS RUN)

The homepage is ~60 sections and needs to become ~5 (hook → calculator CTA → 3 proof points → one FAQ → footer). That is a large structural edit and **must not** share a deploy with the legal fixes above — entangling them makes a clean revert impossible.

Record it as the recommended next task. When it is done, relocate (never delete) the manifesto, backstory, value ladder, and cross-promo content to their own routes: this site has a ~4,005-page pSEO fleet and the sitemap engine (`npm run reconcile:sitemap`) expects routes to keep existing. **Never delete a route referenced by a sitemap.**

---

### STEP 3.7 — Service-worker offline banner (investigate; fix only if certain)

```bash
grep -rn "offline\|onLine\|controllerchange\|skipWaiting\|clients.claim" public/sw.js src/main.tsx | head -20
```

Likely cause: the SW serves an offline fallback when a navigation request misses the cache, or an updated SW takes control mid-session without `clients.claim()`/reload coordination.

**Only apply a fix you are confident in.** A safe, minimal improvement is to ensure the offline UI is shown **only** when `navigator.onLine === false`, rather than on any cache miss. **Do not** rewrite the caching strategy, and **do not** unregister the SW — this is a live PWA and a bad SW change can serve a stale or blank shell to every returning visitor.

If the cause is not obvious within a reasonable effort, **skip and record it.** This is explicitly the lowest-priority step.

**Gate 3.7:** if you changed `public/sw.js`, you must verify in Section 6 with **both** a hard-reload **and** a fresh incognito window. If you cannot verify, revert the SW change.

---

## 4. VALIDATION (before deploy)

```bash
cd ~/invisible-exit

# 4.1 Claims are gone
grep -rn "4\.8/5" --include="*.tsx" --include="*.ts" src/                        # empty
grep -rn "73 of 100\|spots left" --include="*.tsx" src/                          # empty
grep -rniE "127 (builders|founders|members)" --include="*.tsx" --include="*.ts" src/  # empty
grep -rn "while employed — in 12 months" --include="*.tsx" src/                  # empty

# 4.2 Calculator internals untouched
git diff --stat src/components/fym/    # empty (except any Step 3.4 instrumentation, which is expected)

# 4.3 Type errors did not increase
npx tsc --noEmit 2>&1 | grep -c "error TS"   # MUST be <= the Section 1.6 baseline

# 4.4 Positioning guard + FULL build
npm run build
```
`npm run build` runs, in order: `guard:positioning` → sitemap → llms → og → rss → `vite build` → prerender-meta → prerender-blog → prerender-i18n → distribution → site-index → `reconcile:sitemap`. **All must pass.** A `🚨 POSITIONING GUARDRAIL FAILED` means you introduced privacy-tool vocabulary — revert that line.

```bash
# 4.5 Nothing unintended staged
git status --short   # HERMES_*.md and public/blog/rss.xml must NOT be staged
```

---

## 5. COMMIT & DEPLOY

**5.1 — Stage explicitly (never `git add -A`).**
```bash
git add src/components/FrameworkDiagram.tsx src/components/TestimonialGrid.tsx \
        src/components/AuthorityBar.tsx src/components/InlineSqueeze.tsx \
        src/components/GuaranteeBox.tsx src/components/ToolLandingPage.tsx \
        src/pages/Index.tsx src/pages/ProofPage.tsx src/pages/BeliefCrusherPage.tsx \
        src/pages/HubAndSpokePage.tsx src/App.tsx
# add only the files you actually changed; drop any that you did not
git status --short   # REVIEW
```

**5.2 — Commit.**
```bash
git commit -m "fix(invisibleexit): remove unsubstantiated income claims and fabricated proof

- Defuse specific earnings promises (\$4,000+/mo in 12 months etc.) into goals;
  this site has no verified customers and specific income claims are a
  regulatory exposure independent of conversion
- Remove 127-builders, 4.8/5 rating, 73-of-100 scarcity and named-MRR testimonials
- /freedom: lead with the calculator, one ask above the fold
- Add step-level calculator instrumentation to locate the drop-off
- Unify guarantee onto a single component
Calculator logic and example values untouched."
```

**5.3 — Deploy (prebuilt).**
```bash
npx vercel build --prod
npx vercel deploy --prebuilt --prod --archive=tgz
```
`--archive=tgz` is required — this is a ~4,005-page fleet and the plain-upload path fails above 15,000 files.

**Known flake:** Vercel deploys from this machine stick on `UNKNOWN` roughly half the time. Wait 60s, re-run the identical command **once**. Two failures → stop and report.

---

## 6. POST-DEPLOY VERIFICATION

⚠ **This site is a PWA with a service worker.** A normal reload may serve you a cached page and hide a regression. Verify with a **hard reload** and a **fresh incognito window**.

```bash
sleep 45

# 6.1 Claims gone from served HTML
curl -s https://invisibleexit.com/ | grep -c "4.8/5"      # MUST be 0
curl -s https://invisibleexit.com/ | grep -c "spots left" # MUST be 0

# 6.2 Routes healthy
for u in / /freedom /proof /tripwire; do
  printf "%s -> %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' https://invisibleexit.com$u)"
done   # ALL MUST be 200
```

**6.3 — MANDATORY rendered checks:**
1. Open `https://invisibleexit.com/freedom` in a fresh **incognito** window. Confirm the calculator's first input is visible **in the first viewport** without scrolling.
2. Complete the calculator end-to-end. Confirm it still produces a freedom number — **the tool working is more important than every other change in this task.**
3. Navigate between two pages and confirm **no "You are offline" banner** appears.
4. Confirm no console errors.

**Rollback:**
```bash
git revert --no-edit HEAD
npx vercel build --prod && npx vercel deploy --prebuilt --prod --archive=tgz
```
If a bad service worker is suspected of persisting after rollback, note it in the report — a stale SW can outlive a deploy for returning visitors and may need a cache-version bump.

---

## 7. REPORT (write this file, always — even on abort)

Write `~/invisible-exit/HERMES_REPORT_CONVERSION_REPAIR.md` with:

1. **Income-claim table** — every hit, classified PROMISE vs EXAMPLE, what you changed, and what you deliberately left (e.g. the `glossary.ts` arithmetic example). This is the most important section.
2. **Social-proof removals** — each claim, each file/line, and confirmation that no replacement number was invented.
3. **Calculator** — confirmation that `src/components/fym/` logic and example values are unchanged, plus the new step events added.
4. **Type-error count** — baseline vs after. They must not increase.
5. **Guarantee** — the canonical terms and every surface now sourcing from the shared component.
6. **Service worker** — what you found, what you changed (or why you skipped), and the incognito verification result.
7. **Escalate to owner:**
   - **The value ladder now has no social proof at all.** That is correct and honest — but it means the $7 → $2,000 ladder is selling to cold traffic with zero third-party validation. Real testimonials must be *earned*; they cannot be written. This is the owner's next constraint, not a copy problem.
   - Whether any of the removed claims (127 builders, 4.8/5, named MRR testimonials) were ever sourced from real data. If they were, the owner can restore them **with evidence**.
   - Step 3.6 (homepage 60 → 5 sections) is deliberately deferred as its own task.

---

## 8. WHAT SUCCESS LOOKS LIKE

- No specific earnings promise (figure + deadline) survives anywhere in `src/`.
- `4.8/5`, `73 of 100`, `spots left`, `127 builders`, and named-MRR testimonials are gone — with **nothing invented** in their place.
- `src/components/fym/` calculator logic and example values are **unchanged**, and the calculator still completes end-to-end in incognito.
- `/freedom` shows the calculator's first input in the first viewport, with one ask.
- `npx tsc --noEmit` error count is **≤** the pre-edit baseline.
- `npm run guard:positioning` passes; the full 12-stage `npm run build` passes.
- No "You are offline" banner during normal navigation.
- `HERMES_*.md` and `public/blog/rss.xml` were never staged.

**The deepest point:** the persuasion here is genuinely well-built and the calculator demonstrably works — 7 of 190 visitors finished it without being asked twice. What is strangling this site is not weak copy; it is that the page **promises specific money it cannot prove**, surrounds that promise with **proof it invented**, and then hides the one honest, working asset sixty sections down. Remove the invented parts, lead with the tool, and let the real numbers start accumulating.
