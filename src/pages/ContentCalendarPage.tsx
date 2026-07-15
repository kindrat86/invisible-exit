import { useState } from "react";
import { Link } from "react-router-dom";
import { Twitter, MessageSquare, Linkedin, Youtube, Copy, Check, Calendar, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

type Platform = "twitter" | "reddit" | "linkedin" | "youtube";

interface ContentItem {
  day: number;
  source: string;
  hook: string;
  twitter: string;
  reddit: string;
  linkedin: string;
  youtube: string;
  cta: string;
}

const CONTENT: ContentItem[] = [
  {
    day: 1,
    source: "Seinfeld 1 — Close Call",
    hook: "My colleague found a website that looked like my side project. On a team call.",
    twitter: "Week 3 of my side business.\n\nMy colleague says on a team call: 'Hey, has anyone seen this website? It looks like something we'd build.'\n\nMy blood ran cold for 3 seconds.\n\nThen I remembered:\n\n→ Different name\n→ Different entity\n→ Different Stripe\n→ Different hosting\n\nZero connection to me.\n\nThose 3 seconds of panic were the best $25/month I've ever spent.\n\nIf you're building on the side: could you survive those 3 seconds?",
    reddit: "**Has anyone's employer almost discovered your side project? Here's how I survived it.**\n\nWeek 3 of building my side business. I'm on a team call presenting quarterly results. Midway through, a colleague says: 'Hey, has anyone seen this website? It looks like something [our company] would build.'\n\nMy blood ran cold for about 3 seconds.\n\nThen I remembered: different name, different entity, different payment processor, different hosting. The Stealth Ops setup had done its job. There was nothing connecting that website to me.\n\n'No idea,' I said. 'Must be a competitor.' The call moved on.\n\nThat 3 seconds of panic was the best money I've ever spent on entity separation. If you're building on the side, ask yourself: could you survive those 3 seconds?\n\nWhat's your stealth setup?",
    linkedin: "Week 3 of building a side business while employed.\n\nA colleague found a website that looked suspiciously like my side project. During a team call. With 12 people watching.\n\nMy blood ran cold for 3 seconds.\n\nThen I remembered: separate entity, separate name, separate payment processor, separate hosting. Zero connection to me.\n\nThe call moved on. Nobody connected the dots.\n\nThose 3 seconds of panic taught me something: if you're building on the side, your stealth setup isn't optional. It's the thing that saves your career.\n\nWhat's your plan for those 3 seconds?",
    youtube: "TITLE: Your Employer Found Your Side Project (3 Seconds of Panic)\n\nHOOK: What happens when your colleague finds your side business on a team call?\n\nSCRIPT:\n- Week 3. Team call. Colleague says this website looks like our work.\n- 3 seconds of pure panic.\n- Then I remembered my stealth setup: different entity, name, Stripe, hosting.\n- The call moved on. Nobody knew.\n- Lesson: entity separation isn't paranoia. It's career insurance.\n- CTA: Calculate your freedom number (link in description).",
    cta: "Read the full story: invisibleexit.com/story",
  },
  {
    day: 2,
    source: "Seinfeld 2 — Identity Shift",
    hook: "The $0.97 that changed how I see my $120K salary.",
    twitter: "When I got my first Stripe notification — $0.97 from a stranger — I expected to feel excited.\n\nWhat I didn't expect:\n\n$120K/year stopped feeling like 'what I'm worth.'\n\nIt started feeling like 'one income stream.'\n\nThe psychological shift was instant.\n\nI stopped feeling dependent.\nI started thinking like an owner.\n\nThat's the real value of the first dollar online.\n\nNot the money. The identity shift.",
    reddit: "**The first $0.97 online changed how I see my $120K salary**\n\nWhen I got my first Stripe notification — $0.97 from a stranger who bought my product — I expected excitement.\n\nWhat I didn't expect was how it would change my relationship with my salary.\n\nSuddenly, $120K/year didn't feel like 'what I'm worth.' It felt like 'one income stream.' The psychological shift was instant. I stopped feeling dependent.\n\nAnyone else experience this identity shift with their first dollar online?",
    linkedin: "The first $0.97 I earned online from a stranger changed something I didn't expect.\n\nIt didn't change my bank account. It changed my identity.\n\nFor 8 years, I defined myself by my salary. $120K = what I'm worth. When I saw that Stripe notification — $0.97 from a plumber in Ohio — something shifted.\n\nMy salary stopped being my identity. It became one income stream.\n\nThe first dollar online isn't about money. It's about the identity shift from employee to owner.\n\nHas anyone else experienced this?",
    youtube: "TITLE: How $0.97 Changed My Relationship With My $120K Salary\n\nHOOK: The first dollar you earn online isn't about money. It's about identity.\n\nSCRIPT:\n- Got a Stripe notification: $0.97 from a stranger.\n- Expected excitement. Got something deeper.\n- $120K salary stopped feeling like 'what I'm worth.'\n- It became 'one income stream.'\n- The identity shift: employee → owner.\n- This is why starting matters more than the amount.\n- CTA: Calculate your freedom number.",
    cta: "Start your identity shift: invisibleexit.com/freedom",
  },
  {
    day: 3,
    source: "Seinfeld 3 — Wife's Reaction",
    hook: "I told my wife I wanted to build something on the side. She said: 'Show me the numbers.'",
    twitter: "I told my wife I wanted to build a side business.\n\nHer response: 'That's great. Now show me the numbers.'\n\nShe's a data analyst. She thinks in numbers. I think in narratives.\n\nSo I built a calculator.\n\nWhen I showed her: '$3,200 MRR by month 14' — the conversation changed.\n\nFrom: 'Are you sure?'\nTo: 'How do we get there?'\n\nNumbers turn dreams into plans.",
    reddit: "**Told my wife about my side business idea. Her response was perfect.**\n\nI told my wife I wanted to build something on the side. She said:\n\n'That's great. Now show me the numbers.'\n\nShe's a data analyst. She thinks in numbers. I think in narratives. We argue productively.\n\nSo I built a calculator. When I showed her a clear number — '$3,200 MRR by month 14' — the conversation changed from 'are you sure?' to 'how do we get there?'\n\nThat's why the Freedom Number matters. Spreadsheets turn dreams into plans.\n\nHow did your partner react to your side business?",
    linkedin: "When I told my wife I wanted to build a side business, she said:\n\n'That's great. Now show me the numbers.'\n\nShe's a data analyst. She thinks in spreadsheets. I think in stories.\n\nSo I built a calculator. When I showed her: '$3,200/month MRR by month 14' — the conversation shifted.\n\nFrom 'are you sure?' to 'how do we get there?'\n\nThe Freedom Number isn't about motivation. It's about turning a vague dream into a number your partner can evaluate.\n\nNumbers turn anxiety into strategy.",
    youtube: "TITLE: I Told My Wife About My Side Business. Her Response Was Brutal.\n\nHOOK: 'That's great. Now show me the numbers.'\n\nSCRIPT:\n- Told wife about side business idea.\n- She's a data analyst. Wanted numbers, not narratives.\n- Built a freedom number calculator.\n- $3,200 MRR by month 14 = clear target.\n- Conversation shifted from doubt to planning.\n- Lesson: numbers turn dreams into plans.\n- CTA: Calculate your freedom number together.",
    cta: "Calculate your number: invisibleexit.com/freedom",
  },
  {
    day: 4,
    source: "Seinfeld 4 — Month 4 Wall",
    hook: "Month 4. Zero customers. I almost deleted everything.",
    twitter: "Month 4 of my side business.\n\nZero customers.\n\nI sat at my desk at 11 PM. Cursor over 'Cancel Subscription.' Voice in my head:\n\n'You're not a founder. Go back to managing.'\n\nThen I opened my freedom number calculation.\n\nThe math hadn't changed.\n$4,000/month MRR = optionality.\n\nThe math doesn't care about your feelings.\n\nI closed the cancel tab. Pivoted.\n\nTwo weeks later: first customer. $9/month.",
    reddit: "**Month 4 of my side business. Zero customers. I almost quit. Here's what saved me.**\n\nI'd been building for 4 months. One product live. Nobody cared. Zero customers. I checked Stripe 40 times a day. Nothing.\n\nI sat in my car after work one Tuesday and thought: maybe I'm not cut out for this.\n\nThen I opened my freedom number calculation. The math hadn't changed. $4,000/month MRR = optionality. The math doesn't care about your feelings.\n\nI pivoted using my idea pipeline. Two weeks later: first paying customer. $9/month.\n\nThe system doesn't care about your feelings either. It just needs consistency.\n\nAnyone else hit the Month 4 wall?",
    linkedin: "Month 4. Zero customers. 11 PM on a Tuesday.\n\nI had my cursor over the 'Cancel Subscription' button on my hosting dashboard. The voice in my head was specific:\n\n'You're not a founder. You're a manager. Go back to managing.'\n\nThen I opened my Freedom Number calculation. The math hadn't changed because I had a bad week. $4,000/month MRR = optionality.\n\nI closed the cancel tab. Pivoted. Two weeks later: first customer. $9/month.\n\nThe system doesn't care about your feelings. It just needs consistency.\n\nIf you're in Month 4 right now, keep going.",
    youtube: "TITLE: Month 4, Zero Customers — The Night I Almost Deleted Everything\n\nHOOK: The voice said 'you're not a founder.' Here's how I proved it wrong.\n\nSCRIPT:\n- Month 4. Zero customers. Zero trial signups in 9 days.\n- 11 PM. Cursor over Cancel Subscription.\n- The voice: 'Go back to managing.'\n- Opened freedom number calculation. Math hadn't changed.\n- Pivoted. Two weeks later: first $9/month customer.\n- Lesson: the math doesn't care about feelings.\n- CTA: Calculate your freedom number.",
    cta: "Read the full story: invisibleexit.com/story",
  },
  {
    day: 5,
    source: "Seinfeld 5 — Deleted Twitter",
    hook: "Why I deleted my personal Twitter (2,000 followers) and went faceless.",
    twitter: "Last month I deleted my personal Twitter.\n\n2,000 followers. 5 years of posts. Gone.\n\nInstead, I created an anonymous account for my side business.\n\nNo photo. No real name. Just content.\n\nIn 3 weeks it passed my personal account in engagement.\n\nNobody knows it's me.\n\nAnonymity isn't a limitation.\n\nIt's a strategy.",
    reddit: "**I deleted my personal Twitter (2K followers) to go anonymous. Best decision I've made.**\n\nLast month I deleted my personal Twitter account. 2,000 followers. 5 years of posts. Gone.\n\nInstead, I created an anonymous account for my side business. No photo. No real name. Just the content.\n\nIn 3 weeks it passed my personal account in engagement. Nobody knows it's me.\n\nThe anonymity means I can experiment without fear. Build in markets unrelated to my expertise. Fail publicly (to the 3 people who see it) without my employer or professional network knowing.\n\nAnonymity isn't a limitation. It's a strategy.\n\nHas anyone else gone faceless?",
    linkedin: "I deleted my personal Twitter last month. 2,000 followers. 5 years of posts.\n\nInstead, I built an anonymous brand for my side business. No face. No real name. Just content.\n\nIn 3 weeks, the anonymous account passed my personal account in engagement.\n\nThe lesson: when you're building on the side, anonymity isn't hiding. It's strategy. You can experiment without fear. Fail without consequences. Build in any market.\n\nThe mask is the advantage.",
    youtube: "TITLE: I Deleted My Personal Twitter (2K Followers) to Go Anonymous\n\nHOOK: 5 years of posts. Gone. Here's why.\n\nSCRIPT:\n- Deleted personal Twitter. 2K followers.\n- Created anonymous account. No face, no name.\n- 3 weeks later: more engagement than personal account.\n- Why: anonymity = freedom to experiment.\n- No fear of employer discovery.\n- No professional reputation risk.\n- Anonymity isn't hiding. It's the strategy.\n- CTA: Learn the faceless brand system.",
    cta: "Build your faceless brand: invisibleexit.com/freedom",
  },
  {
    day: 6,
    source: "Seinfeld 6 — Boss's Bonus",
    hook: "My boss got a €15,000 bonus. He was thrilled. My side business made $4,100/month.",
    twitter: "My boss got his annual bonus last week.\n\n€15,000.\n\nHe was thrilled.\n\nMy side business generated $4,100 MRR this month.\n\n$49,200/year.\nGrowing 8% monthly.\nNo boss.\nNo board.\nNo equity dilution.\n\nHis bonus is capped.\nMy MRR compounds.\n\nDifferent games.",
    reddit: "**My boss's €15K bonus vs. my $4.1K/month side business MRR**\n\nMy boss got his annual bonus last week. €15,000. He was thrilled.\n\nMy side business generated $4,100 MRR this month. That's $49,200/year. Growing 8% monthly. No boss. No board. No equity dilution.\n\nHis bonus is capped. My MRR compounds.\n\nI'm not saying this to brag. I'm saying it because the math is the math. If you're earning $120K with 0.5% equity, your boss's bonus IS your ceiling.\n\nUnless you build something of your own.",
    linkedin: "My boss got his annual bonus last week. €15,000. He was genuinely thrilled.\n\nMy side business generated $4,100 in MRR this month. $49,200/year. Growing 8% monthly.\n\nHis bonus is capped by someone else's decision. My MRR compounds based on my execution.\n\nNo boss. No board. No equity dilution.\n\nI'm not sharing this to brag. I'm sharing it because for 8 years, I thought the bonus structure was the game. It's not. It's ONE game. There are others.\n\nThe question isn't 'should you quit.' It's 'are you playing the right game?'",
    youtube: "TITLE: My Boss's €15K Bonus vs My $4.1K/Month Side Business\n\nHOOK: His bonus is capped. My MRR compounds.\n\nSCRIPT:\n- Boss got €15K bonus. Thrilled.\n- My side business: $4,100 MRR. $49K/year.\n- Growing 8% monthly. No boss, no board.\n- His bonus = capped by someone else.\n- My MRR = compounds based on my execution.\n- Different games. Different math.\n- CTA: Calculate which game you're playing.",
    cta: "Calculate your number: invisibleexit.com/freedom",
  },
  {
    day: 7,
    source: "Seinfeld 7 — Turned Down Promotion",
    hook: "I turned down a promotion last week. Here's the math behind why.",
    twitter: "My company offered me a promotion.\n\nDirector → VP.\n15% raise.\nMore equity.\nMore responsibility.\n\nI turned it down.\n\nNot because I'm brave.\n\nThe raise: €18K/year.\nMy side business grew $600 MRR last month alone = $7,200/year.\n\nThe promotion would cost me 10+ hours/week.\nLess time to build.\n\nThe freedom number isn't about quitting.\n\nIt's about the option to say no.",
    reddit: "**I turned down a VP promotion. Here's the math.**\n\nMy company offered me a promotion: Director → VP. 15% raise. More equity. More visibility.\n\nI turned it down.\n\nNot because I'm brave. Because the math didn't work.\n\nThe raise: €18K/year.\nThe cost: 10+ extra hours/week. More visibility (bad for stealth ops). More stress. Less time to build.\n\nMy side business grew by $600 MRR last month alone. That's $7,200/year, and it compounds. The promotion would have killed that growth rate.\n\nThe freedom number isn't about quitting. It's about having the option to say no.\n\nHas anyone else turned down a promotion for their side business?",
    linkedin: "Last week, I turned down a promotion. Director → VP. 15% raise. More equity.\n\nNot because I'm brave. Because the math didn't work.\n\nThe raise would have been €18K/year. But the promotion required 10+ extra hours/week, more visibility (which threatens my stealth setup), and more stress.\n\nMy side business grew $600 MRR last month — $7,200/year, compounding.\n\nThe freedom number isn't about quitting your job. It's about having the option to say no.\n\nWhen you have that option, you stop being managed by fear. You start managing by choice.\n\nThat's worth more than any title.",
    youtube: "TITLE: I Turned Down a VP Promotion (The Math Behind the Decision)\n\nHOOK: 15% raise. More equity. I said no.\n\nSCRIPT:\n- Offered: Director → VP. 15% raise.\n- Raise = €18K/year.\n- Cost = 10+ hrs/week, more visibility, less build time.\n- Side business grew $600 MRR last month = $7,200/year.\n- The promotion would have killed the compounding.\n- Freedom number = option to say no.\n- CTA: Calculate your freedom number.",
    cta: "Calculate your freedom number: invisibleexit.com/freedom",
  },
  {
    day: 8,
    source: "Seinfeld 8 — The 5am Build Session",
    hook: "I built more in 5 hours before work than in 40 hours at the office.",
    twitter: `The alarm goes off at 4:45 AM.

The first 15 minutes are negotiation.

'Stay in bed. Just 30 more minutes. Skip today.'

But I've learned something:

My brain at 5am doesn't have meetings to prep for.
No Slack messages. No \"urgent\" fires.
Just me and the product.

I built $600 MRR in those pre-dawn hours.

Not despite the 5am start. Because of it.

The office steals your execution energy.
You get it back at 5am.`,
    reddit: `**I built more between 5 AM and 7 AM than in my entire work day**

I started waking up at 4:45 AM to work on my side business before my day job.

The first 15 minutes are brutal. But after that, something happens: my brain actually functions better at 5 AM than at 2 PM.

No meetings. No Slack. No "urgent" requests. Just me and the code.

I built $600 of my $4K MRR during those early morning sessions. Not despite the early start. Because of it.

The morning gives you execution energy. The office takes it away.

Has anyone else found early mornings to be the only sane building time?`,
    linkedin: `I built more between 5 AM and 7 AM last week than I did during my entire work day.

The first 15 minutes are rough. Your brain negotiates: "Just this once. Stay in bed."

But here's what I've learned: the office is optimized for meetings and interruptions. It's not optimized for building.

Those 2 hours before the workday starts are mine. No Slack. No "quick sync." No "do you have a minute?"

I built $600 MRR in those hours. Not in spite of the commute and meetings. Because I protected those 2 hours.

What time do you build when nobody's watching?`,
    youtube: `TITLE: I Wake Up at 4:45 AM to Build a Side Business (Here's Why)

HOOK: The office is optimized for meetings. Not for building.

SCRIPT:
- Alarm at 4:45 AM. 15 minutes of negotiation.
- My brain at 5 AM: no Slack, no meetings, no fires.
- Just the product and me.
- Built $600 MRR in pre-dawn hours.
- The office steals your execution energy.
- You get it back early in the morning.
- Lesson: protect your build time before the world wakes up.
- CTA: Start building: invisibleexit.com/start`,
    cta: "Start building: invisibleexit.com/start",
  },
  {
    day: 9,
    source: "Seinfeld 9 — Stripe Dashboard on Apple Watch",
    hook: "I checked my Stripe revenue during a quarterly review. On my Apple Watch.",
    twitter: `Quarterly review.

My manager is walking through the numbers. Revenue is up 8%. Costs are flat. Everyone nods.

Under the table, my Apple Watch buzzes.

Stripe notification: $32.47.

Two customers signed up this hour.

I smiled through the rest of the meeting.

She thought I was excited about the quarterly numbers.

I was thinking about MRR compounding outside the building.`,
    reddit: `**I checked my Stripe revenue during a quarterly performance review**

My manager is presenting Q3 results. Revenue up 8%. Costs flat. The usual corporate theater.

Under the table, my Apple Watch buzzes. Stripe notification: $32.47. Two new customers.

I smiled through the rest of the meeting. She thought I was happy about the quarterly numbers.

I was thinking about the $4K MRR compounding outside the building. The revenue she was presenting is someone else's. The revenue on my watch is mine.

This tiny moment — checking YOUR income while someone presents THEIR income — changed how I sit in meetings.

Anyone else check personal revenue during work hours?`,
    linkedin: `I checked my Stripe revenue during a quarterly review.

My manager was presenting Q3 results. Revenue up 8%. Costs flat. The usual corporate review.

Under the table, my Apple Watch vibrated. Stripe notification: $32.47. Two new customers in the last hour.

I smiled through the rest of the presentation. She thought I was excited about the quarterly numbers.

I was thinking about the income compounding outside the building.

The numbers she presented belong to someone else. The numbers on my watch are mine.

That small moment — checking YOUR income while someone presents THEIR income — changes your relationship with meetings forever.`,
    youtube: `TITLE: I Checked My Side Business Revenue During a Performance Review

HOOK: She thought I was excited about quarterly numbers. I was watching my own revenue compound.

SCRIPT:
- In a quarterly review. Manager presenting results.
- Apple Watch buzzes: Stripe $32.47. Two new customers.
- I smile. She thinks I'm happy about company revenue.
- I'm thinking about MY $4K MRR compounding outside.
- That moment: checking YOUR income while they present THEIR income.
- Changes how you sit in meetings.
- CTA: Calculate your freedom number.`,
    cta: "Calculate your freedom number: invisibleexit.com/freedom",
  },
  {
    day: 10,
    source: "Seinfeld 10 — The LinkedIn Near-Miss",
    hook: "I almost liked a post that would have exposed everything. The one-second rule saved me.",
    twitter: `I was scrolling LinkedIn during lunch.

A post from a colleague: "Anyone know a good tool for building micro-SaaS?"

My finger was hovering over the Like button.

Then I remembered:

One second. My anonymous profile would be linked to my real one.

I pulled my hand back like it was a hot stove.

The one-second rule: before any action, wait one second and ask: "Does this connect to my day job?"

That one second has saved my career 4 times.`,
    reddit: `**Almost liked a LinkedIn post that would have exposed my side business**

Scrolling LinkedIn during lunch. A colleague posts: "Anyone know a good tool for building micro-SaaS?"

My finger is hovering over Like. I genuinely wanted to help.

Then I remembered: one second. My anonymous profile. My real account. They can't connect.

I pulled back like my finger touched a hot stove.

I call this the "one-second rule": before any action on social media, wait one second and ask: "Does this connect to my day job in any way?"

Has anyone else had a near-miss with exposing their side business?`,
    linkedin: `I almost made a career-altering mistake on LinkedIn last week.

A colleague posted: "Anyone know a good tool for building micro-SaaS?" My finger hovered over the Like button.

I genuinely wanted to help. But I remembered: my anonymous builder profile and my real career profile can never intersect.

One second of awareness stopped me.

I call this the One-Second Rule: before any social action, pause and ask: "Could this connect my side business to my employer?"

That rule has saved me multiple times. We share so much online without thinking. When you're building invisibly, every public interaction carries risk.

What's your rule for keeping your worlds separate?`,
    youtube: `TITLE: I Almost Exposed My Side Business on LinkedIn (The One-Second Rule)

HOOK: Finger over the Like button. One second of awareness saved my career.

SCRIPT:
- Scrolling LinkedIn. Colleague asks about micro-SaaS tools.
- Finger over Like button. Want to help.
- Remember: anonymous profile + real profile = cannot connect.
- Pull back like hot stove.
- The one-second rule: pause before any action.
- Has saved my career multiple times.
- Lesson: operating security is daily practice, not one-time setup.
- CTA: Get the system: invisibleexit.com/start`,
    cta: "Get the system: invisibleexit.com/start",
  },
  {
    day: 11,
    source: "Seinfeld 11 — First Churn",
    hook: "My first customer churned. It hurt more than I expected. Here's what it taught me.",
    twitter: `Month 7. First churn.

My first customer — the $9/month one who believed in me — cancelled.

I won't lie. It stung.

Not because of the $9.

Because someone looked at what I built and decided it wasn't worth it anymore.

But here's what I learned:

Churn isn't failure. It's feedback.

→ Why did they leave? (I asked)
→ What would have kept them? (I listened)
→ What can I fix? (I built)

That feedback loop made my product 3x better.`,
    reddit: `**My first customer churned. It hurt more than I expected.**

Month 7 of my side business. My first customer — the $9/month one who believed in my product — cancelled.

It stung. Not because of the $9. Because someone looked at what I built and decided it wasn't worth it anymore.

But here's the thing: churn isn't failure. It's feedback.

I actually emailed them and asked: "Why?" They told me the product was missing a specific feature that would have made it stick.

I built that feature. Six months later, that feature is the reason 80% of my customers stay.

Getting the first churn made my product 3x better. The $9 loss was the best investment I ever made.

Anyone else learn more from a churn than from a signup?`,
    linkedin: `My first customer churned last month. It hurt more than I expected.

My first $9/month customer — the one who believed in this project when nobody else had — cancelled. Not because of the $9. But because someone decided what I built wasn't worth their money anymore.

That feedback was painful. But it was also invaluable.

I asked them why. They told me exactly what was missing. I built it. Now that feature is why 80% of my customers stay.

Losing $9/month was the best investment I ever made. It taught me what retention actually requires.

Churn isn't a signal to give up. It's the most specific, actionable feedback you'll ever get.

Have you learned more from a cancelled subscription than a new one?`,
    youtube: `TITLE: My First Customer Cancelled. Here's What It Taught Me About Retention.

HOOK: Losing $9/month was the best investment I ever made.

SCRIPT:
- Month 7. First customer cancelled. $9/month.
- It stung. Not the money. The rejection.
- Emailed them: why?
- They told me exactly what was missing.
- I built that feature.
- Now 80% of customers stay because of it.
- Churn isn't failure. It's the most specific feedback you'll get.
- CTA: Calculate your freedom number.`,
    cta: "Calculate your freedom number: invisibleexit.com/freedom",
  },
  {
    day: 12,
    source: "Seinfeld 12 — The Tax Question",
    hook: "I had to tell my accountant about three separate income streams. The look on his face.",
    twitter: `Tax season. My accountant asks the usual questions.

"How many W-2 jobs?"

"One. My employer."

"Any other income?"

I pause. "Three micro-SaaS products in an anonymous LLC under a different name."

He closes his notebook.

"Let me get another coffee."

The next 45 minutes were a masterclass in:
→ US-specific entity structures
→ Passive income vs active income rates
→ Deductions I didn't know existed

Best $400 I spent on my business.`,
    reddit: `**My accountant's reaction when I told him about my three side businesses**

Tax season came. My accountant asked the usual questions. Then:

"Any other income?"

I said: "Three micro-SaaS products. Anonymous LLC. Under a different name. Revenue about $4K/month."

He closed his notebook. Got another coffee. Sat down.

The next 45 minutes were the most valuable tax education I've ever had: entity structure optimization, passive vs active income rates, deductions I'd never heard of.

Best $400 I ever spent.

If you have side business income and a regular job, talk to a CPA who understands both. The tax savings alone can fund your first year of hosting.`,
    linkedin: `Tax season taught me something surprising about running a side business while employed.

When I told my accountant about my three micro-SaaS products — separate LLC, anonymous structure, $4K/month MRR — he closed his notebook and got a second coffee.

The next 45 minutes were transformative. He walked me through entity structuring for tax efficiency, passive vs active income classification, and deductions I'd never considered.

That $400 consultation saved me thousands in taxes.

If you're building a side business alongside your career, talk to a professional who understands both worlds. The right tax structure can be the difference between building for profit and building for the taxman.`,
    youtube: `TITLE: I Told My Accountant About 3 Side Businesses. His Reaction Was Priceless.

HOOK: He closed his notebook and got another coffee.

SCRIPT:
- Tax season. Accountant asks about other income.
- I mention three micro-SaaS products, anonymous LLC, $4K MRR.
- He closes notebook. Gets more coffee.
- Next 45 minutes: tax masterclass.
- Entity structures. Passive vs active income. Deductions.
- Best $400 I spent on the business.
- Lesson: proper tax setup saves more than it costs.
- CTA: Start building: invisibleexit.com/start`,
    cta: "Start building: invisibleexit.com/start",
  },
  {
    day: 13,
    source: "Seinfeld 13 — Building During Lunch Breaks",
    hook: "I built a $4K/month business in 45-minute lunch breaks. Here's the math.",
    twitter: `People ask how I find time to build.

The answer is uncomfortable:

45-minute lunch breaks.

5 breaks/week = 3.75 hours
× 52 weeks = 195 hours/year

That's 5 full work weeks of building time.

Hidden in plain sight. During the workday.

The trick: don't eat lunch with colleagues.
Eat at your desk. Build.

They think you're catching up on email.
You're building recurring revenue.`,
    reddit: `**I built my side business almost entirely during 45-minute lunch breaks**

People always ask how I find time with a full-time job. The answer is uncomfortable.

45-minute lunch breaks. 5 per week.

That's 3.75 hours/week. 195 hours/year. Equivalent to 5 full work weeks.

The trick: I stopped eating lunch with colleagues. I ate at my desk and built. Everyone assumed I was catching up on email.

I was building $4K/month MRR.

The time is there. It's just disguised as lunch.`,
    linkedin: `I built a side business almost entirely during 45-minute lunch breaks.

The math: 45 minutes × 5 days = 3.75 hours/week. Over a year, that's 195 hours — the equivalent of 5 full work weeks.

Hidden in plain sight. During the workday.

I stopped eating lunch with colleagues. I ate at my desk and built. They thought I was catching up on email.

The time exists. It's just disguised as something else.`,
    youtube: `TITLE: How I Built $4K/Month During 45-Minute Lunch Breaks

HOOK: 195 hours/year. Hidden in your lunch break.

SCRIPT:
- 45-minute lunch × 5 days = 3.75 hours/week
- 195 hours/year = 5 full work weeks
- Stop eating with colleagues. Build at your desk.
- They think you're doing email. You're building MRR.
- The time is there. It's disguised.
- CTA: Start building: invisibleexit.com/start`,
    cta: "Start building: invisibleexit.com/start",
  },
  {
    day: 14,
    source: "Seinfeld 14 — First $100 Month",
    hook: "Month 6. I hit $100/month. It felt bigger than my salary.",
    twitter: `$100/month.

That's what my side business made in Month 6.

$100. Not life-changing. Not freedom. Not even a car payment.

But it felt bigger than any salary increase I'd ever gotten.

Because:
→ My salary is decided by someone else
→ My $100 was decided by the market
→ My salary is capped. The $100 has no ceiling
→ My salary requires my presence. The $100 came while I slept

$100 changed how I saw money.

Not the amount. The source.`,
    reddit: `**Month 6: My side business hit $100/month. It felt bigger than my salary.**

I know how this sounds. $100/month is nothing. It's not even a car payment.

But it felt bigger than any salary increase I'd ever gotten. Here's why:

My salary is decided by someone else. My $100 was decided by the market.
My salary is capped. The $100 has no ceiling.
My salary requires my physical presence. The $100 came while I slept.

That last one hit me. I made $100 while unconscious. My salary requires me to sit in a specific chair for 40 hours/week.

$100 changed how I saw money forever. Not the amount. The source.

Anyone remember their first $100 month?`,
    linkedin: `In Month 6, my side business hit $100/month in recurring revenue.

$100. Not life-changing money. Not even a car payment.

But it felt bigger than any salary increase I'd ever received.

Because my salary is decided by someone else. My $100 was decided by the market. My salary is capped by a band and a performance review. The $100 has no ceiling. My salary requires my presence in a specific chair. The $100 arrived while I slept.

$100 changed how I understood money. Not the amount. The source.`,
    youtube: `TITLE: Why My First $100/Month Felt Bigger Than My Salary

HOOK: $100 while I slept vs $120K requiring my presence.

SCRIPT:
- Month 6: $100/month MRR.
- Not life-changing. Not even a car payment.
- But it felt bigger than any raise.
- Why: salary is capped, decided by someone else.
- $100 has no ceiling. Came while I slept.
- Changed how I understood money.
- Not the amount. The source.
- CTA: Calculate your freedom number.`,
    cta: "Calculate your freedom number: invisibleexit.com/freedom",
  },
  {
    day: 15,
    source: "Seinfeld 15 — The Competitor Copy",
    hook: "Someone copied my product. I was furious for 12 hours. Then I realized what it meant.",
    twitter: `Someone copied my product.

Not inspired by. Copied. Same UI. Same copy. Same pricing. Different logo.

12 hours of fury.

Then my wife said: "If they copied you, it means you were right."

She was correct.

The copycat validated:
→ The market exists
→ The product solves a real problem
→ The pricing model works
→ The positioning resonates

I stopped being angry. Started building faster.

Competition is validation.
Copying is flattery.
Speed is the only moat.`,
    reddit: `**Someone copied my product word-for-word. Here's why I stopped being angry.**

I found a competitor who copied everything. Same UI. Same copy. Same pricing structure. Different logo.

12 hours of pure fury.

Then my wife said: "If they copied you, it means you were right."

She was correct. The copycat validated: the market exists, the product solves a real problem, the pricing model works, the positioning resonates.

I stopped being angry and started building faster. Added features they couldn't copy (because they don't understand the why). Sped up my release cycle.

Competition is validation. Copying is flattery. Speed is the only real moat.

Has anyone else dealt with a copycat competitor?`,
    linkedin: `Someone copied my product last month.

Not inspired by it. Copied it. Same UI, same copy, same pricing model. Different logo.

I was furious for about 12 hours. Then a mentor said something that reframed everything: "If they copied you, it means you were right."

The copycat validated our market, our problem-solution fit, and our pricing. They spent months replicating what we built. That's not a threat — that's the most expensive market research we never had to pay for.

I stopped being angry and started building faster. Speed is the only moat that matters.`,
    youtube: `TITLE: Someone Copied My Product. Here's Why I'm Grateful.

HOOK: 12 hours of fury. Then my wife said one sentence.

SCRIPT:
- Found competitor. Copied everything. UI, copy, pricing.
- 12 hours of fury.
- Wife: "If they copied you, you were right."
- Copycat validated: market, problem, pricing.
- Stopped being angry. Built faster.
- Speed is the only moat.
- Competition is validation.
- CTA: Read the full story: invisibleexit.com/story`,
    cta: "Read the full story: invisibleexit.com/story",
  },
  {
    day: 16,
    source: "Seinfeld 16 — Sunday Night Anxiety",
    hook: "Sunday night used to mean dread. Now it means excitement. Same brain. Different wiring.",
    twitter: `Sunday night.

For 8 years: dread.

The week ahead. The meetings. The performance theater. The slow drain of execution energy.

Now: excitement.

The difference?

I still have the day job. I still have Monday meetings.

But now I also have 5 hours of building time next week. A product that's growing. Customers who depend on me.

Sunday anxiety doesn't disappear when you start a side business.

It transforms.

From "I have to" to "I get to also."

Same brain. Different wiring.`,
    reddit: `**Sunday night anxiety disappeared when I started a side business**

For 8 years, Sunday night meant dread. The week ahead. The meetings. The performance theater.

Now Sunday night means excitement. Same job. Same Monday meetings. Same 9 AM start.

But now I ALSO have 5 hours of building time. A product that's growing. Customers who depend on me.

The anxiety didn't disappear. It transformed. From "I have to go to work" to "I GET TO also build my thing."

The side business gave me something the day job couldn't: a reason to look forward to Monday.

Anyone else experience this shift?`,
    linkedin: `Sunday night used to mean dread.

For 8 years: the week ahead, the meetings, the slow drain of execution energy that comes from building someone else's vision.

Now Sunday night means excitement.

Same job. Same Monday meetings. Same 9 AM start. But now I also have 5 hours of building time next week. A product that's growing. Customers who depend on me.

The side business didn't eliminate the Sunday anxiety. It transformed it. From "I have to" to "I get to also."

Same brain. Different wiring.`,
    youtube: `TITLE: How a Side Business Cured My Sunday Night Anxiety

HOOK: Same job. Same Monday meetings. Different feeling entirely.

SCRIPT:
- 8 years of Sunday dread.
- Meetings, performance theater, slow drain.
- Started side business. Sunday = excitement now.
- Same job. Same meetings.
- But now: 5 hours of building. Growing product.
- Anxiety didn't disappear. It transformed.
- From "I have to" to "I get to also."
- CTA: Start building: invisibleexit.com/start`,
    cta: "Start building: invisibleexit.com/start",
  },
  {
    day: 17,
    source: "Seinfeld 17 — The Non-Compete Conversation",
    hook: "HR asked if I had outside business activities. My heart rate spiked. Here's what happened.",
    twitter: `HR sent a calendar invite: "Quick chat about outside activities."

My heart rate: 140.

I'd been building for 9 months. Invisible. Anonymous. Separate entity.

Had they found something?

The meeting:

"We're updating our compliance questionnaire. Do you have any outside business activities that could conflict with your role?"

Answer (calm, rehearsed):

"No. I don't compete in any related industry."

Both true. My products are in completely unrelated markets.

The Triple-Separation Protocol works.

But that 30-minute meeting aged me 5 years.`,
    reddit: `**HR asked about outside business activities. Here's what happened.**

Got a calendar invite from HR: "Quick chat about outside activities."

My heart rate hit 140. I'd been building a side business for 9 months. Invisible. Anonymous. Separate entity. Separate name. Separate Stripe.

Had they found something?

The meeting was about updating the annual compliance questionnaire. Standard stuff. "Do you have any outside business activities that could conflict with your role?"

My answer: "No. I don't compete in any related industry."

Both statements true. My micro-SaaS products are in completely unrelated markets.

The Triple-Separation Protocol (entity, name, payment) works. But that 30-minute meeting aged me 5 years.

If you're building on the side: rehearse this answer. Know your non-compete. Build in unrelated markets. The preparation is what keeps you calm.`,
    linkedin: `I got a calendar invite from HR last month: "Quick chat about outside activities."

My heart rate spiked. I'd been building a side business for 9 months — anonymous, separate entity, different name, different payment processor.

The meeting was routine: an annual compliance questionnaire update. "Do you have any outside business activities that could conflict with your role?"

My answer was honest: "No. I don't compete in any related industry." My products exist in completely unrelated markets.

The preparation — separate entity, separate name, separate Stripe, non-competing verticals — is what allowed me to sit in that meeting calmly.

If you're building on the side, understand your employment contract. Build in non-competing markets. The legal separation isn't paranoia. It's peace of mind.`,
    youtube: `TITLE: HR Asked About My Side Business. Here's What I Said.

HOOK: Heart rate 140. Calendar invite from HR: "Outside activities."

SCRIPT:
- HR invite: "chat about outside activities."
- Heart rate 140. 9 months of secret building.
- Meeting: routine compliance questionnaire.
- "Do you have outside business activities?"
- Answer: "No conflicting activities." True.
- Products in unrelated markets.
- Triple-Separation Protocol works.
- But 30 minutes aged me 5 years.
- CTA: Get the system: invisibleexit.com/start`,
    cta: "Get the system: invisibleexit.com/start",
  },
  {
    day: 18,
    source: "Seinfeld 18 — First Support Ticket",
    hook: "My first support ticket made me realize: this isn't a project anymore. People depend on me.",
    twitter: `Support ticket #1.

"My dashboard isn't loading. I need this for a meeting tomorrow."

3 sentences. From a real person. Who paid real money. Who needs my product.

This is the moment a side project stops being a project.

It becomes a responsibility.

I fixed it in 20 minutes. Responded. They replied: "Thank you so much. You saved my presentation."

That "thank you" hit different than any performance review ever has.

Because it was voluntary. Earned. Not extracted.`,
    reddit: `**Got my first support ticket. It changed how I see my side business.**

"My dashboard isn't loading. I need this for a meeting tomorrow."

3 sentences from a real person who paid real money for something I built.

This is the moment a side project stops being a project. It becomes a responsibility.

I fixed it in 20 minutes. Responded. They replied: "Thank you so much. You saved my presentation."

That "thank you" hit differently than any performance review feedback ever has. Because it was voluntary. The customer chose to use my product. Chose to pay for it. And chose to thank me.

At work, "feedback" is something extracted from you during a review cycle. In a side business, it's something freely given by someone who believes in what you built.

Anyone else remember their first support ticket?`,
    linkedin: `My first support ticket arrived last month.

"My dashboard isn't loading. I need this for a meeting tomorrow."

Three sentences from a real person who paid real money for something I built in my spare time.

This is the moment a side project stops being a project. It becomes a responsibility. Someone depends on what you built.

I fixed it in 20 minutes. Their reply: "Thank you so much. You saved my presentation."

That "thank you" felt different than any performance review feedback I've received. Because it was voluntary — earned, not extracted.

Building for customers who chose you hits different than building for an employer who assigned you.`,
    youtube: `TITLE: My First Support Ticket Changed Everything

HOOK: "You saved my presentation." — a customer I'd never met.

SCRIPT:
- Support ticket #1. Dashboard not loading.
- 3 sentences. Real person. Real money. Real need.
- Project stops being a project. Becomes responsibility.
- Fixed in 20 minutes. Customer: "You saved my presentation."
- That "thank you" hit different than any review feedback.
- Voluntary, earned, not extracted.
- CTA: Read the full story: invisibleexit.com/story`,
    cta: "Read the full story: invisibleexit.com/story",
  },
  {
    day: 19,
    source: "Seinfeld 19 — The VPN Revelation",
    hook: "I was logging into my side business dashboard from my work laptop. Then I learned about IP logs.",
    twitter: `I was logging into Stripe, Vercel, and my product dashboard from my work laptop.

Seemed fine. It's my laptop. I use it for personal stuff too.

Then I read about IP logging.

Corporate networks log every connection. Every DNS request. Every TLS handshake.

My employer's IT team could see:
→ Stripe.com (payment processing)
→ Vercel.com (hosting)
→ My product domain

Not the content. But the pattern.

I bought a personal laptop the next day. $400.

Best $400 I ever spent on operational security.`,
    reddit: `**I was accessing my side business from my work laptop. Here's why I stopped.**

For the first 5 months, I used my work laptop for everything. Stripe dashboard, Vercel, my product admin. Seemed fine — I use it for personal browsing too.

Then someone on r/SideHustle mentioned IP logging. I looked into it.

Corporate networks log every outbound connection. Every DNS request. While they can't see the content of HTTPS traffic, they can see WHICH domains you're visiting. And patterns:

→ Stripe.com = payment processing
→ Vercel.com = app deployment
→ A random domain you registered = your product

My employer's IT team could reconstruct that I'm running an online business. They wouldn't know what it is, but the pattern is unmistakable.

I bought a cheap personal laptop the next day. $400. Best investment in operational security I ever made.

If you're building on a work device: stop. Get a separate device. It's not paranoia — it's hygiene.`,
    linkedin: `A security realization that changed my side business setup:

For months, I managed my side business from my work laptop. Stripe, hosting, product dashboard — all from the same machine I use for my day job.

Then I learned about network-level logging. Corporate IT systems log every outbound connection. While HTTPS encrypts the content, the destination domains are visible. Stripe.com, Vercel.com, a domain you recently registered — the pattern reveals a business even if the content doesn't.

I invested in a personal laptop the next day. Complete separation of devices, networks, and identities.

If you're building on the side, device separation isn't paranoia. It's basic operational hygiene.`,
    youtube: `TITLE: Why You Should NEVER Build Your Side Business on a Work Laptop

HOOK: Your employer can see every website you visit. Even with HTTPS.

SCRIPT:
- Used work laptop for everything. Stripe, Vercel, dashboard.
- Learned about IP/DNS logging on corporate networks.
- IT can see: Stripe.com, Vercel.com, your domain.
- Not the content. But the pattern reveals a business.
- Bought personal laptop next day. $400.
- Complete device separation.
- Not paranoia. Basic hygiene.
- CTA: Get the system: invisibleexit.com/start`,
    cta: "Get the system: invisibleexit.com/start",
  },
  {
    day: 20,
    source: "Seinfeld 20 — Wife's Birthday Gift",
    hook: "I bought my wife's birthday gift with side business revenue. She cried. Not from the gift.",
    twitter: `Wife's birthday.

I bought her something she'd wanted for 2 years.

She opened it. Smiled. Then looked at me.

"This is from the side business, isn't it?"

"Yes."

She cried.

Not because of the gift.

Because for the first time in 8 years, I bought something meaningful with money I earned outside the company.

Money that didn't come from the salary she watches me trade my life for.

Money from something I built.

"That's different," she said.

She was right.`,
    reddit: `**Bought my wife's birthday present with side business money. Her reaction surprised me.**

My wife wanted a specific gift for 2 years. I kept saying "next bonus cycle."

This year, I bought it with side business revenue.

She opened it. Smiled. Then looked at me: "This is from the side business, isn't it?"

"Yes."

She cried. Not because of the gift — it wasn't expensive. Because for the first time in 8 years, I bought something with money I earned outside the company.

Money that didn't come from the salary she watches me trade my life for. Money from something I built. On my own time. With my own hands.

"That's different," she said.

She was right. It felt different to me too. Earned differently. Felt differently.

Has anyone else had this moment with their partner?`,
    linkedin: `For my wife's birthday, I bought her something she'd wanted for two years.

But the source of the money mattered more than the gift.

"This is from the side business, isn't it?" she asked.

She cried. Not because of the gift. Because for the first time in our relationship, I bought something meaningful with money I earned entirely on my own — outside the company, outside the salary structure, outside the performance review cycle.

Money from something I built with my own hands, on my own time.

"That's different," she said. She was right. It felt different to me, too.

Some milestones aren't about the revenue number. They're about what the revenue represents.`,
    youtube: `TITLE: I Bought My Wife's Birthday Gift With Side Business Money

HOOK: She cried. Not because of the gift. Because of where the money came from.

SCRIPT:
- Wife wanted something for 2 years. Always "next bonus."
- Bought it with side business revenue this year.
- She knew immediately: "This is from the side business?"
- She cried. Not the gift. The source.
- First money earned entirely outside the company.
- "That's different." She was right.
- Milestones aren't about the number. They're about what it represents.
- CTA: Calculate your freedom number.`,
    cta: "Calculate your freedom number: invisibleexit.com/freedom",
  },
  {
    day: 21,
    source: "Seinfeld 21 — The Performance Review Irony",
    hook: "My performance review praised my 'laser focus.' I was running a side business the entire time.",
    twitter: `Performance review.

My manager's feedback:

"You've shown remarkable focus this year. Your execution has been sharper. You seem more purpose-driven."

I nodded. Said thank you.

What I didn't say:

The focus came from the side business.

Building $4K MRR in 5 hours/week forced me to:
→ Cut unnecessary meetings
→ Decline low-impact projects
→ Protect deep work blocks
→ Say no to everything that wasn't essential

The irony: my day job performance improved BECAUSE of my side business.

The focus was real. It just came from a different source.`,
    reddit: `**My performance review praised my "focus." The side business gave me that focus.**

My manager's feedback this year: "You've shown remarkable focus. Your execution is sharper. You seem more purpose-driven."

I nodded. Said thank you.

What I didn't say: the focus came from my side business.

Building $4K MRR in 5 hours/week forced me to ruthlessly prioritize at work. I cut meetings I didn't need to attend. Declined projects that didn't move the needle. Protected deep work blocks. Said no to everything non-essential.

The irony: my day job performance IMPROVED because of my side business. The side business didn't distract me — it made me more efficient with the time I had.

Has anyone else found that a side business improved their work performance?`,
    linkedin: `My annual performance review praised my "remarkable focus" and "sharper execution."

The irony? That focus came from my side business.

Building a side business in 5 hours/week forced me to become ruthlessly efficient at my day job. I cut unnecessary meetings. Declined low-impact projects. Protected deep work blocks. Said no to everything that wasn't essential.

The side business didn't make me worse at my job. It made me better. Not because I was distracted — because I learned what actually matters.

Sometimes the best thing you can do for your career is build something on the side that teaches you to focus.`,
    youtube: `TITLE: My Boss Praised My Focus. It Came From My Side Business.

HOOK: "Remarkable focus this year." The irony was thick.

SCRIPT:
- Performance review: "You're more focused and purpose-driven."
- The focus came from the side business.
- 5 hours/week building forced ruthless prioritization.
- Cut meetings, declined low-impact work.
- Side business improved day job performance.
- The irony: building outside made me better inside.
- CTA: Start building: invisibleexit.com/start`,
    cta: "Start building: invisibleexit.com/start",
  },
  {
    day: 22,
    source: "Seinfeld 22 — First Affiliate Signup",
    hook: "Someone asked to promote my product. For free. I almost said no out of habit.",
    twitter: `Email subject: "Love your product. Can I promote it?"

First thought: "Is this spam?"

It wasn't. A blogger in my niche genuinely wanted to recommend my tool to their audience.

I almost said no. Corporate instinct: "Why would someone help me for free?"

Then I remembered: affiliate marketing.

30% recurring commission.

They win (passive income).
I win (free customer acquisition).
Customer wins (genuine recommendation).

Win-win-win.

I said yes.

They sent 12 customers in month one.

My CAC: $0.`,
    reddit: `**Someone asked to promote my product. I almost said no.**

Got an email: "Love your product. Can I promote it to my audience?"

My first instinct was suspicion. "Why would someone help me for free?" — 8 years of corporate conditioning.

Then I remembered: affiliate programs exist. I set one up. 30% recurring commission.

They win: passive income from recommending something they already love.
I win: free customer acquisition.
Customer wins: genuine recommendation from someone they trust.

Month one: they sent 12 customers. My customer acquisition cost: $0.

The corporate mindset teaches you to be suspicious of help. The builder mindset teaches you to share the upside. Both can be right — but only one grows your business.

Anyone else run an affiliate program for their side business?`,
    linkedin: `Someone emailed me last month: "I love your product. Can I promote it to my audience?"

My first instinct was suspicion — 8 years of corporate conditioning. Why would someone help me for free?

Then I realized: this is affiliate marketing. I set up a 30% recurring commission program.

They win: passive income from recommending a product they genuinely use.
I win: customer acquisition at zero upfront cost.
The customer wins: a recommendation from a trusted source.

Month one: 12 new customers. CAC: $0.

The corporate mindset makes you suspicious of help. The builder mindset makes you share the upside. Only one of them grows your business.`,
    youtube: `TITLE: Someone Asked to Promote My Product. I Almost Said No.

HOOK: "Can I promote your product?" My corporate instinct said: suspicious.

SCRIPT:
- Email: "Love your product. Can I promote it?"
- First instinct: suspicion. Corporate conditioning.
- Remembered: affiliate marketing exists.
- Set up 30% recurring commission.
- Win-win-win: they earn, I get free CAC, customer gets trusted rec.
- Month one: 12 customers. CAC: $0.
- Corporate mindset vs builder mindset.
- CTA: Get the system: invisibleexit.com/start`,
    cta: "Get the system: invisibleexit.com/start",
  },
  {
    day: 23,
    source: "Seinfeld 23 — The Domain Name Hunt",
    hook: "Choosing anonymous domain names is an art. Here are my 5 rules for stealth domains.",
    twitter: `Every stealth builder faces this: what do you name the domain?

Too generic = forgettable.
Too personal = traceable.

5 rules I follow:

1. No name, initials, or location
2. No connection to your industry
3. Abstract but pronounceable
4. Available on all social platforms
5. Privacy-protected registration (WHOIS guard)

My domains sound like startups, not side projects.

That's the point.

Anonymity isn't hiding.
It's strategy.`,
    reddit: `**My 5 rules for choosing anonymous domain names for stealth projects**

Every stealth builder faces this. Your domain name can either protect you or expose you.

5 rules I follow:

1. No name, initials, or location in the domain
2. No connection to your employer's industry
3. Abstract but pronounceable (think "Stripe" or "Vercel" energy)
4. Available as handles on all major social platforms
5. Privacy-protected registration (WHOIS guard is non-negotiable)

My domains sound like real startups. That's the point. If someone finds them, they look like independent companies. Not side projects of a corporate employee.

What's your domain naming strategy?`,
    linkedin: `Choosing a domain name for a stealth side business is an art form.

Too generic and it's forgettable. Too personal and it's traceable.

5 rules I follow:

1. No personal name, initials, or location
2. No connection to my employer's industry
3. Abstract but pronounceable — the kind of name that sounds like a startup, not a side project
4. Available as handles across all major social platforms
5. Privacy-protected registration with WHOIS guard enabled

My side business domains look like independent companies. That's the point. If someone discovers them, they see a brand — not a corporate employee's weekend project.

Anonymity isn't hiding. It's operational strategy.`,
    youtube: `TITLE: 5 Rules for Choosing Anonymous Domain Names

HOOK: Your domain name can protect you or expose you.

SCRIPT:
- Every stealth builder faces the domain naming challenge.
- Rule 1: No name, initials, or location.
- Rule 2: No connection to employer's industry.
- Rule 3: Abstract but pronounceable.
- Rule 4: Available on all social platforms.
- Rule 5: WHOIS privacy protection.
- Domains should sound like startups, not side projects.
- CTA: Calculate your freedom number.`,
    cta: "Calculate your freedom number: invisibleexit.com/freedom",
  },
  {
    day: 24,
    source: "Seinfeld 24 — MRR Milestone: $500",
    hook: "$500/month MRR is the tipping point. Here's why it's psychologically different from $499.",
    twitter: `$500/month MRR.

Crossed it last Tuesday.

$500 is the psychological tipping point.

At $100, it feels like an experiment.
At $300, it feels like a hobby.
At $500, it feels like a business.

Because:
→ $500 = real expenses you can cover (hosting, tools, ads)
→ $500 = customers you can't ignore
→ $500 = a number that shows up on a tax return
→ $500 = momentum you can feel

The jump from $499 to $500 isn't $1.

It's identity.`,
    reddit: `**$500/month MRR is the psychological tipping point. Here's why.**

I crossed $500 MRR last week. And something shifted.

At $100, my side business felt like an experiment.
At $300, it felt like a serious hobby.
At $500, it feels like a business.

$500 is the point where:
- You can cover real business expenses (hosting, tools, ads) from revenue
- You have enough customers that you can't ignore any single one
- The number shows up meaningfully on a tax return
- The momentum is palpable — you can see the path to $1K, $2K, $4K

The jump from $499 to $500 isn't $1. It's identity. You stop saying "I have a side project" and start saying "I run a business."

Anyone else remember crossing $500? What changed for you?`,
    linkedin: `I crossed $500/month in recurring revenue last week.

$500 is a psychological tipping point that I didn't expect.

At $100, my side business felt like an experiment. At $300, it felt like a serious hobby. At $500, it feels like a business.

$500 is where revenue covers real expenses — hosting, tools, software. Where you have enough customers that churn matters. Where the number shows up meaningfully on a tax return. Where you can see the path to $1K, $2K, $4K.

The jump from $499 to $500 isn't a dollar. It's identity. You stop saying "I have a side project" and start saying "I run a business."`,
    youtube: `TITLE: Why $500/Month MRR Is the Psychological Tipping Point

HOOK: The jump from $499 to $500 isn't $1. It's identity.

SCRIPT:
- Crossed $500 MRR. Something shifted.
- $100 = experiment. $300 = hobby. $500 = business.
- $500 covers real expenses from revenue.
- Enough customers that churn matters.
- Shows up on a tax return.
- Momentum is palpable.
- Identity shift: "side project" → "I run a business."
- CTA: Start building: invisibleexit.com/start`,
    cta: "Start building: invisibleexit.com/start",
  },
  {
    day: 25,
    source: "Seinfeld 25 — The Former Colleague",
    hook: "I ran into a colleague who quit to start a business. He failed. The conversation was uncomfortable.",
    twitter: `Ran into a former colleague at a coffee shop.

He quit 2 years ago to go full-time on his startup. Burned through savings. No revenue. Moved back in with his parents.

"You still at the firm?" he asked.

"Yeah. Still there."

He looked at me with a mix of pity and envy.

What he doesn't know:

I make $4K/month from products I built while staying employed.

He took the romantic path: quit, bet everything, lost.
I took the boring path: stayed, built slowly, won.

The slow path is less glamorous.

But it has a floor.`,
    reddit: `**Ran into a former colleague who quit to start a business. He failed.**

He quit 2 years ago to go full-time. Burned through his savings. No revenue. Had to move back in with his parents.

He asked: "You still at the firm?"

"Yeah. Still there."

He looked at me with what I can only describe as pity mixed with envy.

What he doesn't know: I make $4K/month from products I built while staying employed. I took the boring, invisible path. He took the romantic one.

His path is celebrated in startup culture. Quit everything. Bet on yourself. Go all in.

My path is invisible. Stay employed. Build slowly. Protect the downside.

His path has no floor. Mine does. His failure is public. Mine would be private.

The slow path is less glamorous. But it has a safety net.

Anyone else choosing the invisible path?`,
    linkedin: `I ran into a former colleague at a coffee shop last week.

He quit two years ago to start a business full-time. Burned through savings. No traction. Moved back in with family.

"You still at the firm?" he asked. "Yeah," I said. He gave me a look of pity.

What he doesn't know: I earn $4K/month from products I built while staying employed. His path — quit everything, bet it all — is the one startup culture celebrates. My path — stay employed, build invisibly, protect the downside — is invisible.

His path has no floor. Mine does. His failure was public. Mine would be private.

The slow, invisible path is less glamorous. But it has a safety net that lets you take bigger swings with less risk.`,
    youtube: `TITLE: My Colleague Quit to Start a Business and Failed. I Didn't Quit. I Won.

HOOK: He looked at me with pity. He doesn't know I make $4K/month on the side.

SCRIPT:
- Ran into former colleague. He quit 2 years ago. Failed.
- Burned savings. Moved back with parents.
- "You still at the firm?" Pity in his eyes.
- What he doesn't know: $4K/month from side products.
- His path: romantic, celebrated, no floor.
- My path: invisible, boring, has a safety net.
- The slow path is less glamorous but has a floor.
- CTA: Read the full story: invisibleexit.com/story`,
    cta: "Read the full story: invisibleexit.com/story",
  },
  {
    day: 26,
    source: "Seinfeld 26 — Automating Support",
    hook: "I automated 80% of my support tickets. The business now runs during my work hours.",
    twitter: `The hardest part of a side business: customers need help while you're at work.

Solution: automation.

I built:
→ Knowledge base (answered 60% of questions)
→ Canned responses (handled 20% more)
→ Smart routing (urgent tickets → phone notification)
→ Status page (proactive outage communication)

Result: 80% of support is automated.

The business runs while I'm in meetings.

Customers get instant answers.

I handle the remaining 20% during my evening build session.

A side business that requires your real-time attention isn't a side business.

It's a second job.`,
    reddit: `**How I automated 80% of my customer support (and kept my day job)**

The hardest part of running a side business: customers need help while you're at work. You can't respond for 8 hours. That's a bad customer experience.

Here's what I built:

1. Knowledge base — 60% of tickets are "how do I..." questions. Documented everything. Now customers self-serve.

2. Canned responses — another 20% are variations of the same 5 questions. Saved responses handle these in seconds.

3. Smart routing — truly urgent tickets (payment failures, outages) trigger a phone notification. Everything else waits until evening.

4. Status page — when something breaks, customers check the status page before emailing. Reduces "is it down?" tickets by 90%.

Result: 80% of support is automated. The business runs while I'm in meetings. Customers get instant answers. I handle the 20% that needs a human during my evening session.

A side business that requires your real-time attention isn't a side business. It's a second job.`,
    linkedin: `The biggest threat to a side business isn't competition or market forces. It's support load while you're at your day job.

I solved this by automating 80% of customer support:

1. Knowledge base for self-service (60% of tickets)
2. Canned responses for common questions (20%)
3. Smart routing for urgent issues only (phone alerts for outages/payment failures)
4. Status page for proactive communication (eliminates "is it down?" spam)

The result: my business runs during work hours without me. Customers get instant answers. I handle the remaining 20% in the evening.

A side business that requires your real-time attention isn't a side business. It's a second job. Build the systems that let it run without you.`,
    youtube: `TITLE: How I Automated 80% of My Support While Working Full-Time

HOOK: A side business that needs real-time attention isn't a side business. It's a second job.

SCRIPT:
- Problem: customers need help while you're at work.
- Solution: 4-layer automation.
- Layer 1: Knowledge base (60% self-service).
- Layer 2: Canned responses (20%).
- Layer 3: Smart routing (urgent only → phone).
- Layer 4: Status page (proactive communication).
- Result: 80% automated. Business runs during meetings.
- CTA: Get the system: invisibleexit.com/start`,
    cta: "Get the system: invisibleexit.com/start",
  },
  {
    day: 27,
    source: "Seinfeld 27 — The Burnout Scare",
    hook: "5am builds + 9am work + evening sessions. I hit a wall at month 10. Here's what saved me.",
    twitter: `Month 10. The wall.

5 AM: wake up, build.
9 AM: start work.
6 PM: dinner with family.
8 PM: more building.
11 PM: sleep.

Repeat.

For 10 months, it worked. Then it didn't.

I sat in my car at 5:15 AM and couldn't move. Not tired. Empty.

The fix wasn't motivation. It was subtraction:

→ Cut from 3 products to 1
→ Cut from 7 days to 5
→ Cut from evening sessions to rest

Revenue dipped 15% for a month.

Then recovered. And grew faster.

Because I was building with energy, not fumes.`,
    reddit: `**Month 10: I almost burned out. Here's what saved my side business.**

5am builds. 9am work. Evening sessions. 10 months straight.

Then one morning at 5:15 AM, I sat in my car and couldn't move. Not sleepy. Empty. The kind of tired where your body says "no" and means it.

I had to make changes:

1. Cut from 3 products to 1. The other two were generating $200 combined. Not worth the context switching.
2. Cut from 7 days/week to 5. Weekends are for family and rest.
3. Cut evening sessions entirely. Morning build only.

Revenue dipped about 15% for a month. Then recovered and grew faster than before.

Because I was building with energy, not fumes. A burned-out builder makes worse decisions, ships worse code, writes worse copy.

Rest isn't the enemy of progress. Burnout is.`,
    linkedin: `Month 10 of my side business. I hit the wall.

5 AM builds. 9 AM work start. Evening sessions. 10 months of this schedule. Then one morning, I sat in my car at 5:15 AM and physically couldn't move. Not tired — empty.

I had to make hard choices:

1. Cut from 3 products to 1 (killed $200/month in MRR to save my focus)
2. Cut from 7 days/week to 5 (weekends are non-negotiable for family)
3. Cut evening sessions entirely (morning build only)

Revenue dipped 15% for a month. Then recovered and grew faster.

Because I was building with energy instead of fumes. Burned-out builders make worse decisions. Rest isn't the enemy of progress. Burnout is.`,
    youtube: `TITLE: I Almost Burned Out at Month 10 (Here's What Saved My Business)

HOOK: 5:15 AM. Sitting in my car. Couldn't move.

SCRIPT:
- Month 10. The schedule: 5am build, 9am work, 8pm build.
- One morning: couldn't move. Not tired. Empty.
- The fix wasn't motivation. It was subtraction.
- Cut 3 products → 1. Cut 7 days → 5. Cut evening sessions.
- Revenue dipped 15% for a month.
- Then recovered and grew faster.
- Building with energy, not fumes.
- Rest isn't the enemy. Burnout is.
- CTA: Calculate your freedom number.`,
    cta: "Calculate your freedom number: invisibleexit.com/freedom",
  },
  {
    day: 28,
    source: "Seinfeld 28 — First International Customer",
    hook: "Someone in Tokyo paid for my product. In yen. At 3 AM their time. The internet is wild.",
    twitter: `Stripe notification:

¥3,200. Tokyo, Japan. 3:14 AM JST.

Someone in a different country, in a different timezone, speaking a different language, found my product and paid for it.

While I slept.

This is the part that still amazes me:

At my day job, I serve customers in my timezone, in my language, during my working hours.

My side business serves the entire planet. 24/7. In every currency Stripe supports.

The internet doesn't sleep.
Neither does my MRR.`,
    reddit: `**My first international customer hit different**

Stripe notification: ¥3,200. Tokyo, Japan. 3:14 AM their time.

Someone on the other side of the planet found my product, evaluated it, and paid for it. While I was asleep.

At my day job, I serve customers in my timezone, during my working hours. The scope is bounded by geography and schedule.

My side business has no boundaries. It serves anyone, anywhere, anytime. They found me through search, read my content, tried the product, and paid — all without me being awake.

That's the power of building digital products. The internet doesn't sleep. Your MRR doesn't either.

First international customer hits different. Anyone else remember theirs?`,
    linkedin: `My first international customer arrived at 3:14 AM Tokyo time.

¥3,200. Someone in Japan found my product, evaluated it, and paid for it — while I was asleep in a different timezone, speaking a different language.

This is the part of building digital products that still amazes me. At my day job, I serve a bounded market: my timezone, my language, my working hours. My side business has no such boundaries.

The internet doesn't sleep. Your products work while you don't. A customer in Tokyo can discover, evaluate, and buy what you built — all without you being present.

That's leverage that no salary can provide.`,
    youtube: `TITLE: My First International Customer (Tokyo, 3 AM, While I Slept)

HOOK: ¥3,200 from Tokyo while I was asleep. The internet doesn't sleep.

SCRIPT:
- Stripe notification: ¥3,200. Tokyo. 3:14 AM JST.
- Different country, timezone, language.
- Found product, evaluated, paid — while I slept.
- Day job: bounded by timezone and geography.
- Side business: serves the planet. 24/7.
- The internet doesn't sleep. Neither does MRR.
- CTA: Start building: invisibleexit.com/start`,
    cta: "Start building: invisibleexit.com/start",
  },
  {
    day: 29,
    source: "Seinfeld 29 — The Revelation: Not Quitting",
    hook: "Everyone thinks the goal is to quit your job. It's not. The goal is to have the option.",
    twitter: `Everyone assumes I'm building a side business to quit.

I'm not.

The goal was never to leave my job.

The goal was to not NEED it.

There's a difference:

→ Quitting = binary. You either stay or go.
→ Optionality = continuous. You're free to choose every day.

With $4K/month MRR, I don't have to quit.

But I can.

That changes everything:

How I negotiate.
How I handle bad days.
How I sit in meetings.
How I see my salary.

Not as a chain.
As a choice.

Freedom isn't quitting.
Freedom is having the option.`,
    reddit: `**The goal was never to quit my job. It was to have the option.**

Everyone assumes building a side business is about escaping your day job. Here's the uncomfortable truth: I don't want to quit.

The goal was never to leave. The goal was to not NEED to stay.

With $4K/month in MRR, I don't have to quit. But I can. That option changes everything:

How I negotiate salary (I don't need the raise, so I negotiate from strength)
How I handle bad days (a bad meeting doesn't ruin my week — I have something else)
How I sit in meetings (I'm there because I choose to be, not because I have to be)
How I see my salary (not as a chain — as one income stream among several)

Freedom isn't quitting. Freedom is having the option. And that option is worth more than any raise.

Anyone else building for optionality rather than escape?`,
    linkedin: `Everyone assumes I'm building a side business so I can quit my job.

I'm not.

The goal was never to leave. The goal was to not need to stay.

With $4K/month in recurring revenue, I don't have to quit. But I can. And that option changes everything about how I experience my career:

How I negotiate — from strength, not necessity.
How I handle difficult days — a bad meeting doesn't threaten my livelihood.
How I show up — I'm present because I choose to be, not because I must be.
How I see my salary — as one income stream, not the only one.

Freedom isn't quitting. Freedom is having the option. And that option transforms how you experience every single day of your career.`,
    youtube: `TITLE: Why I'm NOT Quitting My Job (Even With $4K/Month Side Income)

HOOK: Everyone thinks the goal is to quit. It's not. The goal is to not need to.

SCRIPT:
- Assumption: side business = escape plan.
- Reality: I don't want to quit.
- Goal was never to leave. Goal was to not NEED to stay.
- With $4K MRR: I don't have to quit. But I can.
- Changes: negotiation, bad days, meetings, salary.
- Freedom isn't quitting. Freedom is having the option.
- CTA: Read the full story: invisibleexit.com/story`,
    cta: "Read the full story: invisibleexit.com/story",
  },
  {
    day: 30,
    source: "Seinfeld 30 — The Freedom Number Reached",
    hook: "I hit $4,000/month MRR. Here's what I expected to feel vs what I actually felt.",
    twitter: `Month 14.

$4,000/month MRR.

The freedom number.

What I expected to feel: euphoria, celebration, vindication.

What I actually felt: calm.

Not because $4K is underwhelming. Because the goal was never the money.

The goal was the identity shift:

→ Employee who depends on a salary
→ Builder who happens to also be employed

$4K didn't change my lifestyle.
It changed my posture.

I sit differently in meetings now.
I negotiate differently.
I make decisions differently.

Not because I'm planning to quit.

Because I no longer have to stay.

The cage always had a door.
I just built my own key.`,
    reddit: `**Hit $4,000/month MRR. Here's what it actually feels like.**

Month 14. $4,000/month MRR. The freedom number I calculated 14 months ago.

What I expected: euphoria. Celebration. Vindication. "I made it."

What I actually felt: calm. Deep, quiet calm.

Not because $4K is underwhelming. It's not. It's life-changing in the most literal sense. But the goal was never the money.

The goal was the identity shift. From "employee who depends on a salary" to "builder who happens to also be employed."

$4K didn't change my lifestyle. I still go to work. Still attend the same meetings. Still draw the same salary.

What changed: my posture. I sit differently. Negotiate differently. Make decisions differently. Not because I'm planning to quit — because I no longer have to stay.

The cage always had a door. I just built my own key.

To anyone just starting: the first $0.97 is harder than the last $400. Keep going.`,
    linkedin: `This week, I crossed $4,000/month in recurring revenue.

The freedom number I calculated 14 months ago.

What I expected to feel: euphoria, celebration, vindication. What I actually felt: calm. Deep, quiet calm.

The goal was never the money. The goal was the identity shift: from someone who depends on a salary to someone who builds their own income while employed.

$4,000 didn't change my lifestyle. I still work. Still attend meetings. Still draw the same salary. What changed is my posture. I sit differently in rooms where I used to feel trapped. I negotiate from strength, not necessity. I make decisions based on what I want, not what I need.

The cage always had a door. I just built my own key.

To anyone in month 1, 3, or 6: the first dollar is harder than the last thousand. Keep building.`,
    youtube: `TITLE: I Hit $4,000/Month MRR. Here's What It Actually Feels Like.

HOOK: Expected euphoria. Felt calm. Here's why.

SCRIPT:
- Month 14. $4,000/month MRR. The freedom number.
- Expected: euphoria, celebration.
- Actual: deep, quiet calm.
- The goal was never the money. It was the identity shift.
- Employee who depends on salary → builder who's also employed.
- $4K didn't change lifestyle. Changed posture.
- Sit differently. Negotiate differently. Decide differently.
- Not planning to quit. No longer have to stay.
- The cage always had a door. I built my own key.
- CTA: Calculate your freedom number.`,
    cta: "Calculate your freedom number: invisibleexit.com/freedom",
  },
];

const ContentCalendarPage = () => {
  const [platform, setPlatform] = useState<Platform>("twitter");
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (text: string, day: number) => {
    navigator.clipboard.writeText(text);
    setCopied(day);
    setTimeout(() => setCopied(null), 2000);
  };

  const platformConfig = {
    twitter: { icon: Twitter, label: "Twitter/X", color: "text-sky-400", bg: "bg-sky-500/10" },
    reddit: { icon: MessageSquare, label: "Reddit", color: "text-orange-400", bg: "bg-orange-500/10" },
    linkedin: { icon: Linkedin, label: "LinkedIn", color: "text-blue-400", bg: "bg-blue-500/10" },
    youtube: { icon: Youtube, label: "YouTube", color: "text-red-400", bg: "bg-red-500/10" },
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="90-Day Social Content Calendar — Ready-to-Post Stories | Invisible Exit"
        description="30 days of social content from Seinfeld email stories: Twitter threads, Reddit posts, LinkedIn articles, and YouTube scripts. Copy, paste, post."
        url="/content-calendar"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Calendar className="w-4 h-4" />
            Ready-to-Post Content
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            The 90-Day{" "}
            <span className="text-gradient-light">Content Calendar</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            30 days of pre-written social content.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            Seinfeld email stories converted for 4 platforms. Copy. Paste. Post. The content engine
            you've been missing.
          </p>
        </div>
      </section>

      {/* Platform Tabs */}
      <section className="bg-surface section-normal border-y border-border sticky top-[64px] z-30 backdrop-blur-sm bg-surface/95">
        <div className="container-narrow py-4">
          <div className="flex items-center gap-3 justify-center">
            <span className="text-sm text-muted-foreground font-medium">Platform:</span>
            {(Object.keys(platformConfig) as Platform[]).map((p) => {
              const cfg = platformConfig[p];
              return (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    platform === p
                      ? `${cfg.bg} ${cfg.color} border border-current/30`
                      : "text-muted-foreground hover:text-foreground bg-white/5"
                  }`}
                >
                  <cfg.icon className="w-4 h-4" />
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Feed */}
      <section className="bg-white section-wide">
        <div className="container-narrow">
          <div className="space-y-6">
            {CONTENT.map((item) => {
              const cfg = platformConfig[platform];
              const text = item[platform];
              return (
                <div key={item.day} className="card-base overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white font-bold text-sm">
                        Day {item.day}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.source}</p>
                        <p className="text-xs text-muted-foreground italic">"{item.hook}"</p>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${cfg.bg} ${cfg.color} text-xs font-medium`}>
                      <cfg.icon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-sans">
                      {text}
                    </pre>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between p-4 border-t border-border bg-surface/30">
                    <span className="text-xs text-muted-foreground">{item.cta}</span>
                    <button
                      onClick={() => handleCopy(text, item.day)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        copied === item.day
                          ? "bg-success/15 text-success"
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                      }`}
                    >
                      {copied === item.day ? (
                        <>
                          <Check className="w-4 h-4" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cycle restart note */}
          <div className="card-base p-8 mt-8 text-center bg-primary/5 border-primary/20">
            <p className="text-foreground font-semibold mb-2">30-day cycle complete. Repeat with fresh angles.</p>
            <p className="text-sm text-muted-foreground mb-4">
              After 30 days, restart the cycle with new hooks from the Hooks Library. Each cycle
              builds on the last — winning hooks get doubled down, losers get killed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/hooks" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover">
                Browse 50+ Hooks <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/growth-lab" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover">
                Open Growth Lab <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContentCalendarPage;
