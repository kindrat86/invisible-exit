/**
 * Content Distribution Export
 *
 * TRAFFIC SECRETS: Fill Your Funnel — Multi-Platform Content Distribution
 *
 * Russell Brunson: "You don't have a traffic problem. You have a distribution
 * problem. Take the same content and publish it everywhere."
 *
 * This script takes the content that's already written (hooks, social posts,
 * email sequences) and exports it as ready-to-paste files organized by platform.
 *
 * Output: dist/distribution/
 *   ├── twitter/      — threads, one per file
 *   ├── reddit/       — posts, one per file
 *   ├── linkedin/     — posts, one per file
 *   ├── youtube/      — video scripts, one per file
 *   ├── hooks/        — categorized hook swipe file
 *   └── README.md     — posting schedule + instructions
 *
 * Usage: node scripts/generate-distribution.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "dist", "distribution");

// ── Clean and create output dirs ──
for (const dir of ["twitter", "reddit", "linkedin", "youtube", "hooks"]) {
  mkdirSync(join(OUT, dir), { recursive: true });
}

// ═══════════════════════════════════════════════════
// 7-DAY CONTENT CALENDAR (from ContentCalendarPage.tsx)
// ═══════════════════════════════════════════════════
const CALENDAR = [
  {
    day: 1,
    source: "Seinfeld 1 — Close Call",
    hook: "My colleague found a website that looked like my side project. On a team call.",
    twitter: `Week 3 of my side business.

My colleague says on a team call: 'Hey, has anyone seen this website? It looks like something we'd build.'

My blood ran cold for 3 seconds.

Then I remembered:

→ Different name
→ Different entity
→ Different Stripe
→ Different hosting

Zero connection to me.

Those 3 seconds of panic were the best $25/month I've ever spent.

If you're building on the side: could you survive those 3 seconds?`,
    reddit: `**Has anyone's employer almost discovered your side project? Here's how I survived it.**

Week 3 of building my side business. I'm on a team call presenting quarterly results. Midway through, a colleague says: 'Hey, has anyone seen this website? It looks like something [our company] would build.'

My blood ran cold for about 3 seconds.

Then I remembered: different name, different entity, different payment processor, different hosting. The Stealth Ops setup had done its job. There was nothing connecting that website to me.

'No idea,' I said. 'Must be a competitor.' The call moved on.

That 3 seconds of panic was the best money I've ever spent on entity separation. If you're building on the side, ask yourself: could you survive those 3 seconds?

What's your stealth setup?`,
    linkedin: `Week 3 of building a side business while employed.

A colleague found a website that looked suspiciously like my side project. During a team call. With 12 people watching.

My blood ran cold for 3 seconds.

Then I remembered: separate entity, separate name, separate payment processor, separate hosting. Zero connection to me.

The call moved on. Nobody connected the dots.

Those 3 seconds of panic taught me something: if you're building on the side, your stealth setup isn't optional. It's the thing that saves your career.

What's your plan for those 3 seconds?`,
    youtube: `TITLE: Your Employer Found Your Side Project (3 Seconds of Panic)

HOOK: What happens when your colleague finds your side business on a team call?

SCRIPT:
- Week 3. Team call. Colleague says this website looks like our work.
- 3 seconds of pure panic.
- Then I remembered my stealth setup: different entity, name, Stripe, hosting.
- The call moved on. Nobody knew.
- Lesson: entity separation isn't paranoia. It's career insurance.
- CTA: Calculate your freedom number (link in description).`,
    cta: "Read the full story: invisibleexit.com/story",
  },
  {
    day: 2,
    source: "Seinfeld 2 — Identity Shift",
    hook: "The $0.97 that changed how I see my $120K salary.",
    twitter: `When I got my first Stripe notification — $0.97 from a stranger — I expected to feel excited.

What I didn't expect:

$120K/year stopped feeling like 'what I'm worth.'

It started feeling like 'one income stream.'

The psychological shift was instant.

I stopped feeling dependent.
I started thinking like an owner.

That's the real value of the first dollar online.

Not the money. The identity shift.`,
    reddit: `**The first $0.97 online changed how I see my $120K salary**

When I got my first Stripe notification — $0.97 from a stranger who bought my product — I expected excitement.

What I didn't expect was how it would change my relationship with my salary.

Suddenly, $120K/year didn't feel like 'what I'm worth.' It felt like 'one income stream.' The psychological shift was instant. I stopped feeling dependent.

Anyone else experience this identity shift with their first dollar online?`,
    linkedin: `The first $0.97 I earned online from a stranger changed something I didn't expect.

It didn't change my bank account. It changed my identity.

For 8 years, I defined myself by my salary. $120K = what I'm worth. When I saw that Stripe notification — $0.97 from a plumber in Ohio — something shifted.

My salary stopped being my identity. It became one income stream.

The first dollar online isn't about money. It's about the identity shift from employee to owner.

Has anyone else experienced this?`,
    youtube: `TITLE: How $0.97 Changed My Relationship With My $120K Salary

HOOK: The first dollar you earn online isn't about money. It's about identity.

SCRIPT:
- Got a Stripe notification: $0.97 from a stranger.
- Expected excitement. Got something deeper.
- $120K salary stopped feeling like 'what I'm worth.'
- It became 'one income stream.'
- The identity shift: employee → owner.
- This is why starting matters more than the amount.
- CTA: Calculate your freedom number.`,
    cta: "Start your identity shift: invisibleexit.com/freedom",
  },
  {
    day: 3,
    source: "Seinfeld 3 — Wife's Reaction",
    hook: "I told my wife I wanted to build something on the side. She said: 'Show me the numbers.'",
    twitter: `I told my wife I wanted to build a side business.

Her response: 'That's great. Now show me the numbers.'

She's a data analyst. She thinks in numbers. I think in narratives.

So I built a calculator.

When I showed her: '$3,200 MRR by month 14' — the conversation changed.

From: 'Are you sure?'
To: 'How do we get there?'

Numbers turn dreams into plans.`,
    reddit: `**Told my wife about my side business idea. Her response was perfect.**

I told my wife I wanted to build something on the side. She said:

'That's great. Now show me the numbers.'

She's a data analyst. She thinks in numbers. I think in narratives. We argue productively.

So I built a calculator. When I showed her a clear number — '$3,200 MRR by month 14' — the conversation changed from 'are you sure?' to 'how do we get there?'

That's why the Freedom Number matters. Spreadsheets turn dreams into plans.

How did your partner react to your side business?`,
    linkedin: `When I told my wife I wanted to build a side business, she said:

'That's great. Now show me the numbers.'

She's a data analyst. She thinks in spreadsheets. I think in stories.

So I built a calculator. When I showed her: '$3,200/month MRR by month 14' — the conversation shifted.

From 'are you sure?' to 'how do we get there?'

The Freedom Number isn't about motivation. It's about turning a vague dream into a number your partner can evaluate.

Numbers turn anxiety into strategy.`,
    youtube: `TITLE: I Told My Wife About My Side Business. Her Response Was Brutal.

HOOK: 'That's great. Now show me the numbers.'

SCRIPT:
- Told wife about side business idea.
- She's a data analyst. Wanted numbers, not narratives.
- Built a freedom number calculator.
- $3,200 MRR by month 14 = clear target.
- Conversation shifted from doubt to planning.
- Lesson: numbers turn dreams into plans.
- CTA: Calculate your freedom number together.`,
    cta: "Calculate your number: invisibleexit.com/freedom",
  },
  {
    day: 4,
    source: "Seinfeld 4 — Month 4 Wall",
    hook: "Month 4. Zero customers. I almost deleted everything.",
    twitter: `Month 4 of my side business.

Zero customers.

I sat at my desk at 11 PM. Cursor over 'Cancel Subscription.' Voice in my head:

'You're not a founder. Go back to managing.'

Then I opened my freedom number calculation.

The math hadn't changed.
$4,000/month MRR = optionality.

The math doesn't care about your feelings.

I closed the cancel tab. Pivoted.

Two weeks later: first customer. $9/month.`,
    reddit: `**Month 4 of my side business. Zero customers. I almost quit. Here's what saved me.**

I'd been building for 4 months. One product live. Nobody cared. Zero customers. I checked Stripe 40 times a day. Nothing.

I sat in my car after work one Tuesday and thought: maybe I'm not cut out for this.

Then I opened my freedom number calculation. The math hadn't changed. $4,000/month MRR = optionality. The math doesn't care about your feelings.

I pivoted using my idea pipeline. Two weeks later: first paying customer. $9/month.

The system doesn't care about your feelings either. It just needs consistency.

Anyone else hit the Month 4 wall?`,
    linkedin: `Month 4. Zero customers. 11 PM on a Tuesday.

I had my cursor over the 'Cancel Subscription' button on my hosting dashboard. The voice in my head was specific:

'You're not a founder. You're a manager. Go back to managing.'

Then I opened my Freedom Number calculation. The math hadn't changed because I had a bad week. $4,000/month MRR = optionality.

I closed the cancel tab. Pivoted. Two weeks later: first customer. $9/month.

The system doesn't care about your feelings. It just needs consistency.

If you're in Month 4 right now, keep going.`,
    youtube: `TITLE: Month 4, Zero Customers — The Night I Almost Deleted Everything

HOOK: The voice said 'you're not a founder.' Here's how I proved it wrong.

SCRIPT:
- Month 4. Zero customers. Zero trial signups in 9 days.
- 11 PM. Cursor over Cancel Subscription.
- The voice: 'Go back to managing.'
- Opened freedom number calculation. Math hadn't changed.
- Pivoted. Two weeks later: first $9/month customer.
- Lesson: the math doesn't care about feelings.
- CTA: Calculate your freedom number.`,
    cta: "Read the full story: invisibleexit.com/story",
  },
  {
    day: 5,
    source: "Seinfeld 5 — Deleted Twitter",
    hook: "Why I deleted my personal Twitter (2,000 followers) and went faceless.",
    twitter: `Last month I deleted my personal Twitter.

2,000 followers. 5 years of posts. Gone.

Instead, I created an anonymous account for my side business.

No photo. No real name. Just content.

In 3 weeks it passed my personal account in engagement.

Nobody knows it's me.

Anonymity isn't a limitation.

It's a strategy.`,
    reddit: `**I deleted my personal Twitter (2K followers) to go anonymous. Best decision I've made.**

Last month I deleted my personal Twitter account. 2,000 followers. 5 years of posts. Gone.

Instead, I created an anonymous account for my side business. No photo. No real name. Just the content.

In 3 weeks it passed my personal account in engagement. Nobody knows it's me.

The anonymity means I can experiment without fear. Build in markets unrelated to my expertise. Fail publicly (to the 3 people who see it) without my employer or professional network knowing.

Anonymity isn't a limitation. It's a strategy.

Has anyone else gone faceless?`,
    linkedin: `I deleted my personal Twitter last month. 2,000 followers. 5 years of posts.

Instead, I built an anonymous brand for my side business. No face. No real name. Just content.

In 3 weeks, the anonymous account passed my personal account in engagement.

The lesson: when you're building on the side, anonymity isn't hiding. It's strategy. You can experiment without fear. Fail without consequences. Build in any market.

The mask is the advantage.`,
    youtube: `TITLE: I Deleted My Personal Twitter (2K Followers) to Go Anonymous

HOOK: 5 years of posts. Gone. Here's why.

SCRIPT:
- Deleted personal Twitter. 2K followers.
- Created anonymous account. No face, no name.
- 3 weeks later: more engagement than personal account.
- Why: anonymity = freedom to experiment.
- No fear of employer discovery.
- No professional reputation risk.
- Anonymity isn't hiding. It's the strategy.
- CTA: Learn the faceless brand system.`,
    cta: "Build your faceless brand: invisibleexit.com/freedom",
  },
  {
    day: 6,
    source: "Seinfeld 6 — Boss's Bonus",
    hook: "My boss got a €15,000 bonus. He was thrilled. My side business made $4,100/month.",
    twitter: `My boss got his annual bonus last week.

€15,000.

He was thrilled.

My side business generated $4,100 MRR this month.

$49,200/year.
Growing 8% monthly.
No boss.
No board.
No equity dilution.

His bonus is capped.
My MRR compounds.

Different games.`,
    reddit: `**My boss's €15K bonus vs. my $4.1K/month side business MRR**

My boss got his annual bonus last week. €15,000. He was thrilled.

My side business generated $4,100 MRR this month. That's $49,200/year. Growing 8% monthly. No boss. No board. No equity dilution.

His bonus is capped. My MRR compounds.

I'm not saying this to brag. I'm saying it because the math is the math. If you're earning $120K with 0.5% equity, your boss's bonus IS your ceiling.

Unless you build something of your own.`,
    linkedin: `My boss got his annual bonus last week. €15,000. He was genuinely thrilled.

My side business generated $4,100 in MRR this month. $49,200/year. Growing 8% monthly.

His bonus is capped by someone else's decision. My MRR compounds based on my execution.

No boss. No board. No equity dilution.

I'm not sharing this to brag. I'm sharing it because for 8 years, I thought the bonus structure was the game. It's not. It's ONE game. There are others.

The question isn't 'should you quit.' It's 'are you playing the right game?'`,
    youtube: `TITLE: My Boss's €15K Bonus vs My $4.1K/Month Side Business

HOOK: His bonus is capped. My MRR compounds.

SCRIPT:
- Boss got €15K bonus. Thrilled.
- My side business: $4,100 MRR. $49K/year.
- Growing 8% monthly. No boss, no board.
- His bonus = capped by someone else.
- My MRR = compounds based on my execution.
- Different games. Different math.
- CTA: Calculate which game you're playing.`,
    cta: "Calculate your number: invisibleexit.com/freedom",
  },
  {
    day: 7,
    source: "Seinfeld 7 — Turned Down Promotion",
    hook: "I turned down a promotion last week. Here's the math behind why.",
    twitter: `My company offered me a promotion.

Director → VP.
15% raise.
More equity.
More responsibility.

I turned it down.

Not because I'm brave.

The raise: €18K/year.
My side business grew $600 MRR last month alone = $7,200/year.

The promotion would cost me 10+ hours/week.
Less time to build.

The freedom number isn't about quitting.

It's about the option to say no.`,
    reddit: `**I turned down a VP promotion. Here's the math.**

My company offered me a promotion: Director → VP. 15% raise. More equity. More visibility.

I turned it down.

Not because I'm brave. Because the math didn't work.

The raise: €18K/year.
The cost: 10+ extra hours/week. More visibility (bad for stealth ops). More stress. Less time to build.

My side business grew by $600 MRR last month alone. That's $7,200/year, and it compounds. The promotion would have killed that growth rate.

The freedom number isn't about quitting. It's about having the option to say no.

Has anyone else turned down a promotion for their side business?`,
    linkedin: `Last week, I turned down a promotion. Director → VP. 15% raise. More equity.

Not because I'm brave. Because the math didn't work.

The raise would have been €18K/year. But the promotion required 10+ extra hours/week, more visibility (which threatens my stealth setup), and more stress.

My side business grew $600 MRR last month — $7,200/year, compounding.

The freedom number isn't about quitting your job. It's about having the option to say no.

When you have that option, you stop being managed by fear. You start managing by choice.

That's worth more than any title.`,
    youtube: `TITLE: I Turned Down a VP Promotion (The Math Behind the Decision)

HOOK: 15% raise. More equity. I said no.

SCRIPT:
- Offered: Director → VP. 15% raise.
- Raise = €18K/year.
- Cost = 10+ hrs/week, more visibility, less build time.
- Side business grew $600 MRR last month = $7,200/year.
- The promotion would have killed the compounding.
- Freedom number = option to say no.
- CTA: Calculate your freedom number.`,
    cta: "Calculate your freedom number: invisibleexit.com/freedom",
  },
];

// ═══════════════════════════════════════════════════
// HOOKS LIBRARY (from HooksLibraryPage.tsx — curated subset)
// ═══════════════════════════════════════════════════
const HOOKS = [
  // WHO Gap
  { text: "If you're a corporate manager earning $120K+ and you've never checked if your side business is legal, this thread is for you.", platform: "twitter", gap: "who", awareness: "unaware" },
  { text: "I built a $4K/month side business while working full-time. My employer never found out. Here's how (for managers only):", platform: "twitter", gap: "who", awareness: "problem" },
  { text: "If you have vesting equity and less than 1%, you need to hear this.", platform: "linkedin", gap: "who", awareness: "unaware" },
  { text: "For the 37-year-old Managing Director who wonders if they're trapped: you are. But there's a door.", platform: "linkedin", gap: "who", awareness: "problem" },
  // WHAT Gap
  { text: "I screamed in a taxi over $0.97. Here's why that changed everything:", platform: "twitter", gap: "what", awareness: "unaware" },
  { text: "$1B exit × 0.5% equity = $5M, right? Wrong. Here's what you actually get (after dilution, vesting, and taxes):", platform: "youtube", gap: "what", awareness: "unaware" },
  { text: "Your freedom number isn't $1M. It's probably $4,000/month MRR. Here's how to calculate yours in 90 seconds:", platform: "twitter", gap: "what", awareness: "problem" },
  // WHERE Gap
  { text: "Amsterdam. 6 AM. Raining. Two notifications changed my life. Here's the story:", platform: "twitter", gap: "where", awareness: "unaware" },
  { text: "My colleague found a website that looked like my side project. On a team call. With 12 people watching. Here's what happened next:", platform: "youtube", gap: "where", awareness: "problem" },
  // WHEN Gap
  { text: "Every month you wait costs you ~$4,000 in unrealized MRR. That's $48,000/year of delay. Here's how to stop the clock:", platform: "twitter", gap: "when", awareness: "problem" },
  { text: "You've been telling yourself 'next quarter' for 3 years. The IPO is always 18 months away. Here's what that actually costs you:", platform: "linkedin", gap: "when", awareness: "unaware" },
  // WHY Gap
  { text: "I didn't want to quit my job. I wanted to matter outside of it. Here's what I learned about identity and optionality:", platform: "linkedin", gap: "why", awareness: "unaware" },
  { text: "Corporate loyalty is a transaction, not a virtue. Here's the mindset shift that changed everything for me:", platform: "twitter", gap: "why", awareness: "unaware" },
  // HOW Gap
  { text: "How to build a $4K/month side business without quitting your job, without writing code, and without your employer finding out (full system):", platform: "youtube", gap: "how", awareness: "problem" },
  { text: "Step 1: Calculate your freedom number (90 seconds). Step 2: Validate one micro-SaaS idea (48 hours). Step 3: Build invisible revenue (5h/week). Here's the full framework:", platform: "twitter", gap: "how", awareness: "problem" },
  // Reddit-specific
  { text: "I did the math on my 0.5% equity. Even a $1B exit wouldn't replace my salary. Here's the full breakdown (and what I'm doing instead):", platform: "reddit", gap: "what", awareness: "unaware" },
  { text: "I'm a Managing Director earning $120K. I built $4,100/month in side revenue in 12 months working 5 hours/week. AMA about the system (not the idea):", platform: "reddit", gap: "how", awareness: "problem" },
  // Ad hooks
  { text: "⚠️ Your 0.5% equity is worth less than you think. Here's the math nobody showed you.", platform: "any", gap: "what", awareness: "unaware" },
  { text: "5 tools. $0.97/month. Cancel anytime. If you're a corporate manager, this will change how you see your salary.", platform: "any", gap: "what", awareness: "product" },
];

// ═══════════════════════════════════════════════════
// EXPORT FILES
// ═══════════════════════════════════════════════════

// ── Per-platform content calendar exports ──
for (const item of CALENDAR) {
  const dayStr = String(item.day).padStart(2, "0");
  writeFileSync(join(OUT, "twitter", `day-${dayStr}-thread.txt`), item.twitter + "\n\n" + item.cta);
  writeFileSync(join(OUT, "reddit", `day-${dayStr}-post.txt`), item.reddit + "\n\n" + item.cta);
  writeFileSync(join(OUT, "linkedin", `day-${dayStr}-post.txt`), item.linkedin + "\n\n" + item.cta);
  writeFileSync(join(OUT, "youtube", `day-${dayStr}-script.txt`), item.youtube + "\n\n" + item.cta);
}

// ── Hooks swipe file (one file per gap) ──
const gaps = ["who", "what", "where", "when", "why", "how"];
const gapNames = {
  who: "WHO Gap (Identity & Belonging)",
  what: "WHAT Gap (The Thing / The Result)",
  where: "WHERE Gap (Location & Context)",
  when: "WHEN Gap (Timing & Urgency)",
  why: "WHY Gap (Purpose & Meaning)",
  how: "HOW Gap (Method & System)",
};

for (const gap of gaps) {
  const hooksForGap = HOOKS.filter((h) => h.gap === gap);
  const content = hooksForGap
    .map((h) => `[${h.platform.toUpperCase()}] [${h.awareness}]\n${h.text}\n`)
    .join("\n---\n\n");
  writeFileSync(join(OUT, "hooks", `${gap}-gap.md`), `# ${gapNames[gap]}\n\n${content}`);
}

// ── Reddit-specific hooks ──
const redditHooks = HOOKS.filter((h) => h.platform === "reddit");
writeFileSync(
  join(OUT, "hooks", "reddit-specific.md"),
  `# Reddit Hooks (Value-First, No Link in Hook)\n\n` +
    redditHooks.map((h) => `[${h.awareness}]\n${h.text}\n`).join("\n---\n\n")
);

// ── Ad hooks ──
const adHooks = HOOKS.filter((h) => h.platform === "any");
writeFileSync(
  join(OUT, "hooks", "ad-hooks.md"),
  `# Paid Traffic Hooks (For Ad Creative)\n\n` +
    adHooks.map((h) => `[${h.awareness}]\n${h.text}\n`).join("\n---\n\n")
);

// ── Master README with posting schedule ──
writeFileSync(
  join(OUT, "README.md"),
  `# Invisible Exit — Content Distribution Hub

> TRAFFIC SECRETS: "You don't have a traffic problem. You have a distribution problem."

## What's Here

This folder contains ready-to-post content for every platform.
Each file is formatted and ready to copy-paste.

### 📁 twitter/ — Twitter/X Threads (7 days)
One thread per day. Each thread is a self-contained story with a CTA.
**Best posting time:** Mon-Fri 9-10am or 1-2pm EST

### 📁 reddit/ — Reddit Posts (7 days)
Value-first posts designed for r/Entrepreneur, r/FIRE, r/cscareerquestions, r/SideProject.
**Rules:** No links in the post body. Link goes in comments. Be a person, not a marketer.

### 📁 linkedin/ — LinkedIn Posts (7 days)
Professional tone. Identity-focused. Designed for the corporate manager audience.
**Best posting time:** Tue-Thu 7-9am or 12-1pm

### 📁 youtube/ — Video Scripts (7 days)
Short-form video scripts (YouTube Shorts, TikTok, Reels). 30-60 seconds each.
Hook → Story → CTA. The hook is the first 3 seconds.

### 📁 hooks/ — The Hook Swipe File
50+ hooks organized by the 6 Story Gaps (Who, What, Where, When, Why, How).
Plus Reddit-specific hooks and paid ad hooks.

## Weekly Publishing Cadence

| Day | Platform | Content |
|-----|----------|---------|
| Mon | Twitter/X | Thread (day-01 to day-07 rotating) |
| Tue | Reddit | Value post (r/Entrepreneur or r/FIRE) |
| Wed | LinkedIn | Story post |
| Thu | Blog/Pillar | New pillar content or repurposed post |
| Fri | Dream 100 | Outreach to 5 new partners |
| Sat | YouTube | Short-form video |
| Sun | Podcast | Pitch to 3 new podcasts |

## Dream 100 Outreach

See invisibleexit.com/dream-100 for the full playbook:
1. Identify 100 names (career coaches, FIRE creators, side-hustle podcasters)
2. Research 3+ pieces of their content
3. First touch: personal email, no pitch
4. Follow up 5 times (most deals close on touch 3-5)
5. Over-deliver when they engage

## Content Repurposing Engine

Every email story → 1 Twitter thread + 1 Reddit post + 1 LinkedIn post + 1 YouTube script
Every blog post → 3-5 hooks + 1 newsletter segment + 1 pillar page
Every calculator result → 1 shareable image + 1 testimonial prompt

---
Generated by scripts/generate-distribution.mjs
`
);

console.log(`✓ Distribution export complete:`);
console.log(`  ${CALENDAR.length} daily content packages (×4 platforms = ${CALENDAR.length * 4} files)`);
console.log(`  ${HOOKS.length} hooks organized by Story Gap`);
console.log(`  Output: ${OUT}`);
