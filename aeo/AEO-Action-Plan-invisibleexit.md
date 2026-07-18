# AEO Action Plan — Invisible Exit

_Prepared 2026-07-18 · AEO architect skill, Ahrefs methodology._

## 0 · Snapshot & scope

- **Brand + URL:** Invisible Exit — https://invisibleexit.com
- **Business type:** **Product / SaaS** (membership: 5 AI tools for anonymous micro-SaaS building) → visibility
  that matters most: **category queries** ("best faceless side business", "anonymous micro-SaaS",
  "alternatives to [competitor]") + **expert-in-answers** for stealth-ops / non-compete / freedom-number
  how-to prompts. A citation can convert directly at $0.97–$252 price points.
- **Branded entity map:**
  - Main brand: **Invisible Exit**
  - Sub-brands / products: **FYM Dashboard**, **Idea Pipeline**, **Stealth Ops Hub**, **Launch Control**,
    **Brand Manager**
  - Proprietary frameworks: **Freedom Number**, **Salary-Runway Method**, **Cartridge System**,
    **Triple-Separation Protocol**, **Invisibility Score**, **5-Hour Weekly Operating System**
  - Personal brand: **Adrian** (anonymous founder — `/adrian`)
  - Community: **Inner Circle**, r/invisibleexit, Dream 100
- **Competitors benchmarked (working set — verify with live SERP when Firecrawl configured):**
  - Category-adjacent: **Starter Story**, **Side Hustle Nation**, **MicroConf / MicroConf Connect**,
    **Indie Hackers**, **The Hustle**, **MySideHustlePath**, **Hussle**
  - Tool-substitute: **Baremetrics / ChartMogul** (FYM Dashboard compares to them), **Validator AI**,
    **Exploding Topics** (idea-pipeline analogues)
- **Priority platforms:** **Google AI Overviews + ChatGPT first** (most eyeballs; ChatGPT's top sources
  are high-DR editorial + Reddit, which is where this brand should be cited); **Perplexity third** because
  ~28.6% of its citations come from Google's top 10 — if you already rank, Perplexity is the fastest win.
  **YouTube** as a cross-platform channel (strongest single correlation with ChatGPT visibility: 0.737).
- **Tools available:** GA4 (GT-KTTZ3L7C, G-1LJVDK6QJN) · PostHog · Reddit/Meta/LinkedIn pixels ·
  prerendered HTML · llms.txt generator. **No Ahrefs, no GSC confirmed this session.** Path taken:
  **tool-agnostic** (bot script + live HTML probe + repo audit). Live SERP sampling was blocked — Firecrawl
  web tools are not configured in this session, so brand-mention numbers are marked **unmeasured** below
  and must be filled in by re-running with Firecrawl enabled or by pasting manual ChatGPT/Perplexity runs.

## 1 · Baseline (manual sampling — fill in)

| Metric | Invisible Exit | Competitor (Starter Story) | Competitor (Side Hustle Nation) | Source |
|---|---|---|---|---|
| AI mentions | **unmeasured** | unmeasured | unmeasured | ChatGPT/Perplexity manual sampling |
| AI citations | **unmeasured** | unmeasured | unmeasured | " |
| AI Share of Voice | **unmeasured** | unmeasured | unmeasured | " |
| Impressions | **unmeasured** | unmeasured | unmeasured | " |
| Referring domains | ~2 in sameAs (Reddit, GitHub) | high | high | on-site sameAs |
| sameAs entities | **2** (Reddit, GitHub) | many | many | live HTML |

> **To fill this in (do this first, 30 min):** run these 8–10 prompts in ChatGPT, Perplexity, and Google
> (AI Overview), 2–3 times each (citations are probabilistic — sample, don't judge one run). Record
> mentions / citations / which competitors appear:
> - "best way to build a side business without quitting my corporate job"
> - "tools to validate a micro-SaaS idea in 48 hours"
> - "how to build an anonymous / faceless SaaS without my employer finding out"
> - "what is a freedom number and how do I calculate mine"
> - "best states for anonymous LLC for side business"
> - "non-compete clause side hustle what can I do"
> - "[competitor] alternatives" — for each competitor above
> - "moonlighting clause check before starting a side business"
> - "Reddit strategy for anonymous founders"
> - "faceless YouTube channel for SaaS"

## 2 · Gap map → priorities (summary; full version in `brand-gap-analysis-invisibleexit.csv`)

- **Visibility:** the biggest gap. Brand exists on-site but barely off-site. `sameAs` = Reddit + GitHub
  only. **This is the #1 lever** — branded web mentions had the single strongest correlation (0.664)
  with AI Overviews in the 75,000-brand study.
- **Narrative:** on-site entity definition is excellent (llms.txt disambiguates from the *Invisible, Inc.*
  game and M&A exit-planning) but is **not yet reinforced by external consensus**. LLMs won't confidently
  repeat it until ≥5 third-party pages say the same thing.
- **Topic:** strong coverage — 53 blog posts hit most fan-out sub-topics. Refresh the top 5–10 for freshness
  (AI-cited content is ~25.7% fresher than organic; ChatGPT's top-cited pages: 89.7% updated in 2025,
  76% within 30 days).
- **Format:** ✅ **CORRECTED 2026-07-18** — initial audit was wrong. The site already has **10 `/best/*`
  listicles + 11 `/vs/*` comparison pages** (70 URLs total in sitemap-compare + sitemap-tools). Each
  `/best/` page now carries `ItemList` structured data (added this session) mapping the tools array to
  positioned `SoftwareApplication` entries with editorial `Review` ratings — the policy-safe pattern
  (single named author, not self-served aggregateRating) Google uses for listicle rich results.
  Invisible Exit is now an entry on `best-ai-tools-for-solo-founders` (position 8, honest positioning
  as "the system layer for employed founders," not competing with Claude/Cursor). Remaining format gap:
  Invisible Exit is NOT yet an entry on the other 9 listicles — assess each for fit (only add where
  authentic, not forced). `/vs/*` pages compare professions ("accountant vs micro-saas-founder") not
  tools, so IE doesn't belong there.
- **Web mentions:** absent from every directory AI pulls from for SaaS/B2B: Product Hunt, G2, Capterra,
  Trustpilot, AlternativeTo, IndieHackers, Slant.co.
- **Demand:** branded-query resolution unmeasured. The phrase "invisible exit" is generic-sounding and
  competes with the video game and M&A concept — risk that branded searches resolve to the wrong entity.

## 3 · The plan (Fix / Build / Influence, sorted by priority)

### 🔧 Fix (optimize what exists)

- [x] **[P1] Remove or externalize the self-served AggregateRating.** ✅ **DONE + DEPLOYED 2026-07-18.**
  Found and removed **4 independent emitters**:
  1. `index.html` line 231 — hardcoded static `SoftwareApplication` with `ratingValue 4.8 / ratingCount 240 / reviewCount 89`.
  2. `scripts/prerender-meta.mjs` ~line 468 — home `SoftwareApplication` with `4.8/127/89` **plus** the self-published `Review` by "Sarah K.".
  3. `scripts/prerender-meta.mjs` ~line 1720 — `/intensive` `Product` with `4.9/12`.
  4. `scripts/prerender-meta.mjs` ~line 1856 — `/pro` `Product` with `4.8/34`.
  Build verified clean (0 real `aggregateRating` JSON-LD across 2000 prerendered HTML variants).
  **Deployed to prod** (invisible-exit-f0ivam5e3.vercel.app → invisibleexit.com, Ready).
  Live verification: `curl https://invisibleexit.com/ | grep aggregateRating` → only the
  removal comment remains, no schema. Commit `b1baf6c` on branch `growth/2026-07-18-invisibleexit`.
  **Follow-up (separate):** visible "4.8/5" marketing copy in `Index.tsx:321`, `StartPage.tsx:384`,
  `ProofPage.tsx:29`, `TestimonialGrid.tsx:139` is not structured data (not a violation) but is an
  unsubstantiated claim — resolve by standing up Trustpilot Free and replacing with a live widget.
- [x] **[P1] Set up AI self-attribution survey.** ✅ **DONE + DEPLOYED 2026-07-18.** New
  `AttributionSurvey` component mounts on Dashboard first-visit (gated by
  `localStorage.attribution_survey_v1_<userId>`, same pattern as the existing onboarding gate).
  Asks "How did you first hear about Invisible Exit?" with AI-specific options (AI assistant,
  Perplexity, Google AI Overviews) + Google/YouTube/Reddit/Social/Referral/Podcast/Other.
  Fires `attribution_survey_shown / _submitted / _dismissed` events and sets a `attribution_source`
  PostHog person property for cohort analysis. Placed on Dashboard (not CheckoutSuccess, which
  immediately redirects via magic link — Dashboard is the calm post-auth moment).
  **Still TODO (separate, needs GA4 UI work):** the GA4 "AI traffic" channel-group regex
  (`chatgpt\.com|perplexity|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|deepseek.com`)
  is documented in `references/tooling-and-fallbacks.md` but not yet created in the GA4 property —
  that's a one-time admin action in GA4, not a code change.
- [x] **[P2] Add YouTube to `sameAs`.** ✅ **DONE + DEPLOYED 2026-07-18.** Channel `@invisibleexit`
  (resolves HTTP 200) added to all 5 Organization `sameAs` blocks (index.html + 4 in prerender-meta.mjs).
  Live verification: sameAs on prod now lists `[reddit, github, youtube]`.
- [x] **[P2] Redirect-map for hallucinated URLs.** ✅ **ALREADY DONE — no work needed.** The existing
  `vercel.json` SPA catch-all rewrites already cover all 10 likely hallucinated paths
  (`/fym`, `/idea-pipeline`, `/stealth-ops`, `/launch-control`, `/brand-manager`, `/freedom`, `/pro`,
  `/pricing`, `/founding-member`, `/tools`) → `/index.html`. The 5 product names resolve cleanly;
  no 404 risk from AI URL guesses.

### 🏗️ Build (create what's missing)

- [ ] **[P1] Publish 3–5 owned "best" / "vs" listicles** where Invisible Exit is one entry in its own
  category — these are the formats AI cites most (43.8% of ChatGPT citations):
  - "Best Tools for Building a Micro-SaaS While Employed (2026)"
  - "Best Faceless Side-Business Platforms Compared"
  - "Invisible Exit vs Starter Story vs Indie Hackers" (own the comparison)
  - "Best Freedom Number / MRR Calculators"
  - "Best Idea-Validation Tools (48-Hour Test)"
  - Structure: BLUF, atomic sections, entity-rich, specific numbers. Each gets its own prerendered page.
- [ ] **[P1] Ship 3 YouTube search-hit videos** on topics the blog already owns (titles = the searched
  keyword, not clickbait; description = real summary w/ keyword in first 2 lines; add timestamps for
  chapters; **say the keyword aloud** — Google parses audio):
  - "How to Build a Side Business Without Quitting Your Job" (faceless format, screen-recording + slides)
  - "How Much Money Do You Need to Never Work Again? (Freedom Number)"
  - "How to Validate a Micro-SaaS Idea in 48 Hours"
- [ ] **[P2] Official FAQ expansion on the site** with specific numbers/dates to defend against
  misinformation (the methodology's most important anti-hallucination tactic — when AI must choose between
  vague truth and specific fiction, it picks the fiction). Cover: founder identity, pricing breakdown,
  legal compliance scope, what the 5 tools do NOT do, refund policy, who it's not for.

### 📣 Influence (earn off-site mentions — the #1 lever)

- [ ] **[P1] Top mention-earning targets (tier-1 editorial / directories AI already cites for SaaS):**
  1. **Product Hunt** — launch (or relaunch) the 5-tool suite; one of the most-cited domains for "best X"
     in SaaS.
  2. **G2** + **Capterra** — free vendor listings (B2B tool category).
  3. **AlternativeTo** — list each of the 5 tools as alternatives to Baremetrics/ChartMogul/Validator AI/etc.
  4. **Indie Hackers** — founder profile + 1–2 long-form posts (the "can AI replace a co-founder" angle
     plays perfectly here).
  5. **Trustpilot Free** — review collection (also resolves the AggregateRating risk above).
  6. **Starter Story** — pitch a founder interview (anonymous-founder angle is on-brand for them).
  7. **Side Hustle Nation** / **The Hustle** — guest feature or tool review.
  8. **MicroConf Connect** — community presence for employed-founders thread.
  9. **Reddit** — answer genuinely in r/SideHustle, r/SaaS, r/EntrepreneurRideAlong, r/indiehackers,
     r/FIRE (your subreddit exists but resolves 403 to unauth — confirm it's live and seed it with 5–10
     high-value posts before promoting).
  10. **Hacker News** — "Show HN: I built 5 AI tools to help corporate managers exit invisibly" (the
      anonymous angle + $0.97 pricing is HN-bait).
- [ ] **[P2] Niche listicle outreach** — find "best faceless side business" / "anonymous SaaS tools"
  listicles via Google (once Firecrawl is configured or manually) where Invisible Exit is missing; pitch
  the founder for inclusion. Track in a sheet.
- [ ] **[P3] Activate own properties as extra citation sources:** podcast (already have `/podcast-pitch`
  kit — use it to land 3 guest spots in 90 days), LinkedIn company page (currently absent from sameAs),
  Medium cross-posts of the top 5 blog articles.

## 4 · Technical checklist

- [x] **robots.txt AI-bot access** — `check_ai_bots.py invisibleexit.com --edge` → all tested UAs
  (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Googlebot, PerplexityBot) return **HTTP 200** at the
  edge. /api/auth, /api/webhook, /api/cron, /dashboard, /account, /login correctly disallowed. **No
  Cloudflare/WAF bot block.** This layer is best-in-class — no action.
- [x] **JS rendering** — Vite SPA but `prerender-meta.mjs`, `prerender-blog.ts`, `prerender-i18n.mjs` run
  at build → AI crawlers receive fully-formed HTML (verified: raw curl returns title, meta, 5 JSON-LD
  blocks, prerendered body copy). ChatGPT's non-rendering crawler is covered. **No action.**
- [ ] **Page speed / Core Web Vitals** — unmeasured this session. Run PageSpeed Insights on `/`, `/blog`,
  `/freedom`, `/pro`. (Analytics scripts are deferred until `load` — good.)
- [x] **Clean HTML / heading hierarchy** — prerendered, BLUF-style copy, atomic sections in the FAQ.
  Confirm H1→H2→H3 nesting on the top 10 pages once.
- [x] **Schema** — 5 types present (Organization, WebSite w/ SearchAction, SoftwareApplication w/
  AggregateOffer + 8 Offers, FAQPage w/ 9 specific-number Q&As, Review). **Action:** remove/externalize
  AggregateRating (see Fix P1).
- [ ] **Hallucinated-URL 404s** — add redirect-map (see Fix P2); monitor GA4 AI-referrer 404s monthly.

## 5 · Measurement setup

- [ ] **AI referral tracking** — add GA4 "AI traffic" channel group with the regex above (or install
  Ahrefs Web Analytics, free, has a built-in AI-search channel and separates unknown from direct which
  GA4 doesn't).
- [ ] **AI bot analytics** — site is not Cloudflare-fronted (Vercel), so Ahrefs Bot Analytics via
  Cloudflare won't apply. Use Vercel logs or add a lightweight bot-logger edge function to record
  GPTBot/OAI-SearchBot/ClaudeBot/PerplexityBot hits per path — most-crawled pages = strongest citation
  candidates; important pages bots never visit = discovery problem.
- [ ] **"How did you hear about us?" survey** with AI options — add to `/start` checkout + signup (see
  Fix P1).
- [ ] **Brand Radar baseline** — not available (no Ahrefs). Substitute: save today's manual ChatGPT /
  Perplexity / Google AIO prompt results (the 10 prompts in §1) as a dated baseline in
  `aeo/baselines/YYYY-MM-DD.md`. Re-run monthly.

## 6 · Cadence

- **This week (do these five, in order):**
  1. Fill in §1 baseline — run the 10 prompts in ChatGPT/Perplexity/Google AIO (30 min).
  2. **Remove or externalize the AggregateRating** (1 hr, Fix P1) — eliminates a real risk.
  3. Add GA4 "AI traffic" channel + "How did you hear about us?" survey (30 min, Fix P1).
  4. Refresh the top 5 blog posts for freshness (half-day, Fix P1).
  5. Add the redirect-map for hallucinated URLs + YouTube to sameAs (1 hr, Fix P2).
- **This month:** launch on Product Hunt + list on G2/Capterra/AlternativeTo/Trustpilot (Influence P1);
  publish the first "best X" listicle (Build P1); ship the first YouTube search-hit video (Build P1).
- **Monthly:** re-run the 10 baseline prompts; check AI-referral traffic trend + AI-bot crawl patterns;
  refresh 2–3 more posts.
- **Quarterly:** deeper competitive audit (re-run prompts head-to-head against Starter Story, Side Hustle
  Nation, Indie Hackers); prune/expand the mention-outreach sheet; revisit the gap CSV.

---

_Do first: fill in the §1 baseline (30 min) — every later decision depends on knowing whether AI currently
names you at all. Then kill the self-served AggregateRating; it's the only item here that's an active risk
rather than a missed opportunity._
