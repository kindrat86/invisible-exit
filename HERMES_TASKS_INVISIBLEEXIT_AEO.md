# Hermes Autonomous Execution Brief — invisibleexit.com AEO/SEO Remediation

**Target repo:** `~/invisible-exit` (branch `main`, HEAD at time of writing: `9cbbcf6`)
**Live domain:** https://invisibleexit.com (Vercel project `invisible-exit`, team `sales-3429s-projects`)
**Deploy command:** `npm run build` (~5 min, full 100-language prerender) → `vercel pull --yes --environment production` (only needed once per machine) → `vercel build --prod --yes` → `vercel deploy --prebuilt --prod --archive=tgz --yes`
**Source audit:** 10-site portfolio AEO/SEO audit, 2026-07-21, invisibleexit.com scored 78/100, 0 critical + 1 high + 1 medium + 3 low findings.
**Executor:** Hermes Agent (autonomous, DeepSeek v4 Pro). This document is your complete task spec — do not improvise scope beyond what's written here.

**Important methodology note:** every task below was re-verified directly against the current repo and the live site before being written into this brief. Two of the source audit's findings — including the "medium" severity one — turned out to already be fixed and did **not** reproduce; see §3. Two more real, precise issues were found during verification that the original audit missed entirely. Trust the file/line citations here over the original audit summary, and re-verify yourself if HEAD has moved since `9cbbcf6`.

---

## 0. Read this whole section before touching anything

### 0.1 Collision check — mandatory first step, every run

```bash
ps aux | grep -i hermes | grep -v grep
vercel ls invisible-exit --scope sales-3429s-projects | head -5
cd ~/invisible-exit && git status --short && git log -1 --format='%H %ci'
```

- If a Hermes process is currently running against `~/invisible-exit`, or a deploy landed in the last ~30 minutes, wait and re-check every 10 minutes before starting.
- If `git status --short` shows uncommitted changes, stop and do not touch the tree — another process may be mid-edit. Report this instead of proceeding.
- Confirm `git log -1` still shows `9cbbcf6` (or a later commit that clearly isn't a broken/partial one) before starting. (The tree was clean at brief-writing time — no unusual dirty-tree risk noted here, unlike some sibling repos in this portfolio.)

### 0.2 Trusted-Types CSP — this one is currently FIXED, keep it that way

A `Content-Security-Policy` with `require-trusted-types-for 'script'` and no matching `trustedTypes.createPolicy()` shim blanks a site completely on load (documented repeated incident on this owner's portfolio — ~40h outages on `signals.gitdealflow.com` and `churnlens.site`). This repo's `vercel.json` does carry `require-trusted-types-for 'script'` (line 46) — **but the shim is already present and correctly deployed**: `index.html` lines 10-11 register `window.trustedTypes.createPolicy('default', {...})`, confirmed live via `curl -s https://invisibleexit.com/ | grep trustedTypes.createPolicy`. **No task below touches this — do not remove or reorder that inline script relative to anything that runs before it in `<head>`, and do not touch lines 1-20 of `index.html` for any reason.**

### 0.3 Other known footguns on this repo (from prior incident history — do not reintroduce)

- **Native-binary DB crash:** `api/_lib/db.ts` must import `@libsql/client/web` (pure JS), not the default node entry — the native `libsql` binary isn't available when `vercel build --prebuilt` runs on macOS, and every DB-touching function (auth, stripe-webhook, newsletter) previously died with `FUNCTION_INVOCATION_FAILED` until this was fixed. Don't change the libsql import path.
- **Stale service worker:** the old `ie-v1` service worker serves one stale cached page after any deploy; `ie-v2`+ is network-first. If you check the site immediately after your own deploy and it looks unchanged, reload once before concluding something's wrong — this is expected, not a regression.
- **`npx tsc --noEmit` has ~40 pre-existing errors** (supabase types, untyped analytics event names) that are not a regression signal — `vite build` ignores them. Don't try to "fix" these as part of this brief; they're known, accepted, and out of scope.
- **pSEO footer is hardcoded directly in source `index.html`** (~line 247) and propagates to all 127 prerendered routes — if any task below touches the footer, changes apply site-wide across every prerendered page, not just the homepage.

### 0.4 Guardrails you must never bypass

- `npm run guard:positioning` (`scripts/guard-positioning.mjs`) runs automatically as the first step of `npm run build` and fails the build if any page drifts into forbidden positioning language. If it fails, fix the offending text — do not bypass.
- Never use `git commit --no-verify`. Always create new commits; never `git commit --amend` on a pushed/deployed commit. Never `git push --force` to `main`.
- Never touch `api/_lib/auth.ts`, `api/db/*.ts`, or any authentication/rate-limiting code — a security-hardening pass already locked these down (2026-07-18: `/api/db/query`+`/api/db/mutate` access policies, login rate limiting, JWT fail-closed, insert-only+rate-limited subscriber writes). Entirely out of scope for this brief.

### 0.5 What you are NOT authorized to change autonomously

See §6 "Owner-gated — do not execute" at the bottom. Anything not explicitly listed as a task in §1–§2 is out of scope.

---

## 1. P2 — MEDIUM (this is the highest-severity task that actually reproduced — see §3 for why the audit's original "high")

### TASK-01: Fix redundant/confusing `Sitemap:` directives in `robots.txt`

**File:** `~/invisible-exit/public/robots.txt` (bottom 3 lines)

**Root cause (confirmed, and more precise than the audit's framing):** `robots.txt` currently declares three separate `Sitemap:` lines:
```
Sitemap: https://invisibleexit.com/sitemap.xml
Sitemap: https://invisibleexit.com/sitemap-index.xml
Sitemap: https://invisibleexit.com/image-sitemap.xml
```
Fetching all three live confirms this isn't just cosmetic redundancy — it's an actual double-wrapped sitemap-index: `sitemap.xml` is itself a `<sitemapindex>` covering 16 real topic sub-sitemaps (core/blog/guides/etc). `sitemap-index.xml` is a **second, separate `<sitemapindex>`** that just wraps `sitemap.xml` plus `image-sitemap.xml` — i.e. a sitemap-index pointing at another sitemap-index, which is confusing and unnecessary. `image-sitemap.xml` is a genuinely distinct, real image sitemap not covered anywhere inside `sitemap.xml`'s 16 sub-sitemaps.

**Fix:** Remove the `sitemap-index.xml` line only. Keep the other two (they cover genuinely different, non-overlapping content):
```
Sitemap: https://invisibleexit.com/sitemap.xml
Sitemap: https://invisibleexit.com/image-sitemap.xml
```
Check whether `public/robots.txt` is hand-maintained or generated by a script before editing directly — if there's a generator (search `scripts/` for anything writing `robots.txt`), edit the generator instead of the static file so the fix survives the next build. If no generator exists for `robots.txt` specifically, edit `public/robots.txt` directly.

```bash
cd ~/invisible-exit
grep -rl "robots.txt" scripts/ 2>/dev/null | grep -v node_modules   # check for a generator first
```

**Verification (before commit):**
```bash
cd ~/invisible-exit
grep -c "^Sitemap:" public/robots.txt   # must be 2, was 3
grep -q "sitemap-index.xml" public/robots.txt && echo "FAIL: still present" || echo "OK: removed"
```

---

## 2. P3 — LOW

### TASK-02: Point Organization `sameAs` at the on-brand X/Twitter handle instead of the operator's personal one

**File:** `~/invisible-exit/index.html`, `Organization` JSON-LD block, `sameAs` array (~lines 118-124).

**Root cause (confirmed, and this corrects the audit — see §3):** The `sameAs` array is **not** empty (the audit claimed no `sameAs` links were found — false); it already has 5 real entries:
```json
"sameAs": [
  "https://www.reddit.com/r/invisibleexit",
  "https://github.com/kindrat86",
  "https://www.youtube.com/@invisibleexit",
  "https://x.com/sipiteno",
  "https://www.indiehackers.com/product/invisible-exit"
]
```
Four of these are correctly on-brand (`invisibleexit`-named or the shared portfolio GitHub org). The fifth, `https://x.com/sipiteno`, is the operator's personal/portfolio-wide account — but the site's own footer (`src/components/Footer.tsx` line ~308) already links to a different, on-brand handle: `https://x.com/invisibleexit`. The Organization schema should reference the same brand-specific handle the site itself links to, not the personal one, for entity consistency.

**Fix:** In `index.html`'s `sameAs` array, replace `"https://x.com/sipiteno"` with `"https://x.com/invisibleexit"` (matching `Footer.tsx`'s existing link — do not invent a new handle; this one is already real and already linked elsewhere on the site).

**Verification (before commit):**
```bash
cd ~/invisible-exit
grep -c '"https://x.com/invisibleexit"' index.html   # must be >=1 in sameAs after edit
grep -c '"https://x.com/sipiteno"' index.html         # check it's not referenced elsewhere for a different legitimate reason before assuming 0 is correct
npm run build 2>&1 | tail -20   # must complete clean
```

### TASK-03: Remove the stale stub `llms.txt` from the repo root

**File:** `~/invisible-exit/llms.txt` (repo root — 3-line stub, NOT the deploy source)

**Root cause (confirmed):** The live, production `https://invisibleexit.com/llms.txt` is a full, well-structured file (disambiguation clause, product summary, page index) generated by `scripts/generate-llms-txt.ts` as part of `npm run build` (`generate:llms` step). The stale root-level `llms.txt` in the repo (confirmed: 3 lines, just a "Statistics Hub" stub) has no effect on production — it's not the deploy source — but sitting at the repo root under the exact filename a future editor would assume is canonical, it's a real trap.

**Fix:** Delete `~/invisible-exit/llms.txt`. Do not touch `scripts/generate-llms-txt.ts` — that's the real source and is already working correctly.

**Verification (before commit):**
```bash
cd ~/invisible-exit
test -f llms.txt && echo "FAIL: still present" || echo "OK: removed"
npm run generate:llms   # confirm the generator still runs clean without the stale file present
```

---

## 3. Findings from the source audit that did NOT reproduce — corrected here

- **"CSP enforces Trusted Types but no `trustedTypes.createPolicy()` registration was found ... latent fragility"** (originally flagged medium severity) — **already fixed.** `index.html` lines 10-11 register the policy, confirmed live on the production response. No action needed; see §0.2. This was the audit's second-highest-severity finding for this site and it does not currently exist as a problem.
- **"Organization schema has no visible `sameAs` array"** — false as stated; there are 5 entries. The real, narrower issue (which the audit missed entirely) is that one of the 5 points at the wrong (personal, not brand) handle — see TASK-02.
- **"`RESEND_API_KEY` not set"** (from prior portfolio memory, not the audit itself, but worth correcting here since it would otherwise look like an open item) — also already fixed. `vercel env ls production` on this project confirms `RESEND_API_KEY` is set (Production, Encrypted). No action needed.

---

## 4. Deploy protocol — follow exactly, in order

1. Re-run the §0.1 collision check. If clear, proceed.
2. Make TASK-01, TASK-02, TASK-03 edits.
3. Run every verification command from each task. All must pass before committing.
4. Commit:
   ```bash
   cd ~/invisible-exit
   git add public/robots.txt index.html
   git rm llms.txt
   git commit -m "fix: drop redundant sitemap-index.xml robots.txt line, correct Organization sameAs to on-brand X handle, remove stale root llms.txt stub"
   ```
5. Build (full prerender, ~5 minutes — do not interrupt):
   ```bash
   npm run build
   ```
   This runs `guard:positioning` → `generate:sitemap` → `generate:llms` (regenerates the real `dist/llms.txt` — unaffected by TASK-03's deletion of the unrelated root stub) → `generate:og` → `generate:rss` → `vite build` → `prerender-meta.mjs` → `prerender-blog.ts` → `prerender-i18n.mjs` (100-language prerender) → `generate:distribution`. All steps must complete with no errors.
6. Prep and deploy (no cloud build CPU spend — prebuilt archive upload):
   ```bash
   vercel pull --yes --environment production   # only needed once per machine; skip if already configured
   vercel build --prod --yes
   vercel deploy --prebuilt --prod --archive=tgz --yes
   ```

**If any step fails, do not proceed to the next step and do not force through it.** Report the exact error in your execution log (§7) and stop.

---

## 5a. Post-deploy verification — mandatory

```bash
# Note: the old service worker may serve one stale cached page on your first check — reload once (see §0.3) before treating any of these as a failure.

# 1. Confirm robots.txt now has exactly 2 Sitemap lines, sitemap-index.xml gone
curl -s https://invisibleexit.com/robots.txt | grep "^Sitemap:"   # must show exactly sitemap.xml + image-sitemap.xml, no sitemap-index.xml

# 2. Confirm sameAs now references the on-brand handle
curl -s https://invisibleexit.com/ | grep -o '"https://x.com/invisibleexit"'   # must match

# 3. Confirm the stale llms.txt removal didn't affect the REAL served llms.txt (different file, generated separately)
curl -s https://invisibleexit.com/llms.txt | head -5   # must still show the full disambiguation/product-summary content, not a 404 or the 3-line stub

# 4. Confirm Trusted-Types shim is still intact (this is the check that matters most given this incident's history elsewhere in the portfolio)
curl -s https://invisibleexit.com/ | grep -c "trustedTypes.createPolicy"   # must be >=1
curl -s https://invisibleexit.com/ | wc -c   # should be roughly the same order of magnitude as before (~77KB), not near-zero

# 5. Spot-check a few other routes are still fine
for path in / /about /freedom /blog /guides /compare; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://invisibleexit.com$path")
  echo "$path: $code"
done   # all must be 200
```

**If you have any headless-browser or screenshot capability, use it to visually confirm the homepage renders normally** — a `curl` 200 does not prove the page isn't blank (see §0.2's incident history on sibling sites).

## 5b. Rollback plan — use immediately if §5a verification fails

```bash
# Option A — instant: roll the Vercel alias back to the last known-good deployment
vercel rollback --scope sales-3429s-projects

# Option B — revert and redeploy clean
cd ~/invisible-exit
git revert --no-edit HEAD
npm run build && vercel build --prod --yes && vercel deploy --prebuilt --prod --archive=tgz --yes
```

---

## 7. Execution log — append your results here as you work

```
### 2026-07-21 run (commit 80c2546)
- §0.1: Collision check clear (HEAD=9cbbcf6, tree clean, no competing processes)
- TASK-01: done — removed sitemap-index.xml line from public/robots.txt, verified 2 Sitemap lines live post-deploy
- TASK-02: done — sameAs x.com/sipiteno → x.com/invisibleexit in index.html line 122, verified live (2 matches: schema + footer)
- TASK-03: done — deleted stale root llms.txt stub (3-line placeholder), confirmed real dist/llms.txt unaffected (782 pages served)
- Confirmed already-fixed (no action taken): Trusted-Types shim intact (createPolicy count=2), RESEND_API_KEY set
- Build: npm run build completed clean (~5 min, 10/10 steps passed, 2000 i18n variants)
- Deploy: vercel build + vercel deploy --prebuilt --prod --archive=tgz (27s Vercel build, Ready)
- Post-deploy verification:
  ✓ Check 1: robots.txt has 2 Sitemap lines (sitemap.xml + image-sitemap.xml), sitemap-index.xml gone
  ✓ Check 2: sameAs references x.com/invisibleexit (confirmed live)
  ✓ Check 3: llms.txt serves full disambiguation/product-summary content (782 pages)
  ✓ Check 4: Trusted-Types createPolicy count=2, page size 76,753 bytes (~77KB)
  ✓ Check 5: All routes 200 (/, /about, /freedom, /blog, /guides, /compare)
- No rollback needed
```

---

## 6. Owner-gated — do not execute autonomously

- **"$4,000/month, ~138 customers" and related quantified claims tied to the pseudonymous founder "Adrian"** — the audit's top (high-severity) finding, and it's real: this is a genuine E-E-A-T/YMYL trust gap for a site making specific financial-earnings claims with no verifiable identity, by explicit business-model design (the product sells anonymity). Any fix here — adding a revenue-verification badge, redacted case studies, a consistent pseudonymous brand persona, or disclaimer language — is a positioning decision the owner has already deferred once (see prior memory). Do not add, remove, or reword any of this copy.
- **Fake-testimonial / fake-counter figures** ("127 managers", "73 spots", "Sara K.", "100 founding spots / 27 claimed", etc. — confirmed present across `src/components/InlineSqueeze.tsx`, `AuthorityBar.tsx`, `src/pages/Index.tsx`, `FoundingWallPage.tsx`, `Confirmation.tsx`, `StartPage.tsx`, `MasterclassPage.tsx`, `SqueezePage.tsx`, `HubAndSpokePage.tsx`) — flagged in prior portfolio memory as a deferred owner decision, same category as the sibling `voicelogpro.com` funnel. Note: "127 building" vs "100 founding spots/27 claimed" is confirmed to be a deliberate two-tier fiction (members vs. paid founding) by prior owner decision, not a bug — do not "fix" that specific pairing. Do not touch any of this copy.
- **CSP'd dead Meta/LinkedIn pixels in `index.html`** — a deferred owner decision (delete the dead pixel code, or explicitly whitelist it in `vercel.json` if it's meant to be live) noted in prior portfolio memory. Not touched by this brief.
- **Adding `AggregateRating`/`Review` schema** — only if genuine review data exists; do not fabricate. Not attempted in this brief since no real review source was found during verification.
- **Adding a registered legal entity name (`legalName` in Organization schema)** — only if the owner wants to formalize NAP/entity trust beyond the current anonymous-founder model; not something this brief can decide.
- Anything not listed as a numbered TASK above.

---

**End of brief.** Work top to bottom (P2 → P3), verify after the deploy per §5a before considering the run complete, and never skip the §0.1 collision check between work sessions.
