/**
 * /api/email-sequence.ts
 *
 * Vercel serverless route — converted from
 * supabase/functions/email-sequence/index.ts
 *
 * Exports all email template functions, the wrap() helper, the sequence
 * arrays, and a sendEmail() helper so other /api routes can import them.
 *
 * POST { email, day, sequence } → sends a specific email via Resend.
 * (No `day` → returns the schedule for the sequence.)
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";

const FROM = "Adrian <escape@invisibleexit.com>";

export interface EmailEntry {
  day: number;
  subject: string;
  html: string;
}

// ═══ wrap() helper — shared email shell ═══
export function wrap(day: string, title: string, bodyHtml: string, cta = true) {
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#0B1D3A;">
<p style="color:#60A5FA;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;margin-bottom:24px;">INVISIBLE EXIT — ${day}</p>
<h1 style="font-size:24px;font-weight:700;margin-bottom:16px;line-height:1.3;">${title}</h1>
${bodyHtml}
${cta ? `<div style="background:#F0F4FF;border-radius:8px;padding:20px;margin-bottom:24px;text-align:center;">
<p style="font-size:14px;line-height:1.6;color:#4A5568;margin:0 0 12px 0;"><strong>5 Tools. $0.97/month. Cancel anytime. 30-day money-back guarantee.</strong></p>
<a href="https://invisibleexit.com/?checkout=starter" style="display:inline-block;padding:12px 24px;background:#3B82F6;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Start for $0.97/month</a>
</div>` : ""}
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:4px;">Talk soon,</p>
<p style="font-size:16px;font-weight:600;margin-bottom:0;">Adrian</p>
<hr style="border:none;border-top:1px solid #E2E8F0;margin:32px 0;"/>
<p style="font-size:12px;color:#8A95A8;">Invisible Exit — Build a side business while employed, invisibly. Unsubscribe anytime.</p>
</div>`;
}

// ═══ SOAP OPERA — 5 emails over 5 days ═══
export function soap1() {
  return wrap("DAY 1", "You did something 97% of managers won't.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">You gave me your email. That's the difference between people who escape and people who keep waiting.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Most people in your position bookmark articles. Save podcast episodes. Tell themselves "next quarter." They consume content about building something on the side but never actually <strong>start</strong>.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">I'm Adrian. Managing Director at a European tech company. $120K salary. Less than 0.5% equity. And over the next 5 days, I'm going to tell you a story about a taxi ride in Amsterdam that changed everything.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Tomorrow, I'll tell you what happened at 6 AM in that taxi. Two notifications. One changed my perspective permanently.</p>`);
}

export function soap2() {
  return wrap("DAY 2", "Amsterdam. 6 AM. Raining.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">I had just landed on a KLM flight with my wife and 8-year-old. First morning of our family vacation. My phone buzzed in the taxi.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Two notifications sat side by side.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;"><strong>The first:</strong> Corporate escalation emails. People at my company fighting over responsibilities. At 6 AM. On the first morning of my vacation.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;"><strong>The second:</strong> A Stripe notification. "$0.97 received." A complete stranger had paid for a landing page I built for plumbers in the USA. While I slept on a plane.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">I screamed in the taxi. The driver thought I was insane. My wife understood: this wasn't about $0.97. This was proof that <strong>the cage has a door</strong>.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Tomorrow, I'll show you the moment I realized what that door actually looks like.</p>`);
}

export function soap3() {
  return wrap("DAY 3", "The epiphany I had at 37.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">After the Amsterdam trip, I sat down and ran the numbers. Carefully, this time.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">$120K salary. Less than 0.5% equity. Even a $1B exit, after taxes and dilution, invested at 5%, the passive income <strong>still wouldn't cover my yearly salary</strong>. I'd still need to work for someone.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;"><strong>That's not an exit. That's a longer leash.</strong></p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Here's the epiphany: <strong>Corporate loyalty is a transaction, not a virtue.</strong> Less than 0.5% is a leash disguised as a partnership.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">But your 15 years of corporate experience isn't a weakness. It's founder gold. You understand customers, systems, and execution better than anyone with just a pitch deck. You don't need to quit. You need 5 hours a week and a system.</p>`);
}

export function soap4() {
  return wrap("DAY 4", "3 secrets that changed everything.",
    `<p style="font-size:18px;font-weight:600;color:#3B82F6;margin-bottom:8px;">Secret #1: Your job is the perfect launchpad.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:24px;">Your salary is runway funding. Your corporate skills are exactly what solo founders lack. Your 5 hours/week forces focus. While full-time founders burn out, you build sustainably.</p>
<p style="font-size:18px;font-weight:600;color:#3B82F6;margin-bottom:8px;">Secret #2: Anonymity is your greatest asset.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:24px;">When you're anonymous, you can experiment without fear. Build in markets unrelated to your expertise. Fail publicly without your employer ever knowing.</p>
<p style="font-size:18px;font-weight:600;color:#3B82F6;margin-bottom:8px;">Secret #3: The system matters more than the idea.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">I spent months choosing the "right" idea. Wrong. Once you have the system (freedom number → idea pipeline → stealth ops → launch → brand), you can swap ideas in and out.</p>`);
}

export function soap5() {
  return wrap("DAY 5", "The IPO clock is ticking.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Let me tell you about the most expensive word I know. "Someday."</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Someday I'll start something. Someday after the IPO. Someday when the kids are older.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Here's the math: at $120K salary, 0.5% equity, even a $1B exit doesn't buy freedom. Every month you don't build is a month of MRR you'll never earn. At $4,000/month target, that's <strong>$48,000 per year of delay</strong>.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">I built Invisible Exit so you wouldn't need years to figure this out. 5 tools. 5 hours a week. $0.97/month.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">This is the last email in this series. After today, you'll still hear from me weekly. But this sequence — the one designed to move you from "thinking about it" to "doing it" — ends now.</p>`);
}

// ═══ SEINFELD FOLLOW-UP — weekly ongoing ═══
export function seinfeld1() {
  return wrap("FROM THE TRENCHES", "A close call at the office.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Last Wednesday, I was on a Zoom call presenting quarterly results. Midway through, someone asked about a website that looked suspiciously like one of my side projects.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">My heart stopped for about 3 seconds.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Then I remembered: different name, different entity, different payment processor, different hosting. The Stealth Ops Hub had done its job. There was nothing connecting that website to me.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">"No idea," I said. "Must be a competitor." The call moved on.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">That 3 seconds of panic was the best $25/month I've ever spent. If you're building on the side, ask yourself: could you survive those 3 seconds?</p>`);
}

export function seinfeld2() {
  return wrap("FROM THE TRENCHES", "A weird thing happened with my first customer.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">When I got my first Stripe notification — $0.97 from a stranger — I expected to feel excited. What I didn't expect was how it would change my relationship with my salary.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Suddenly, $120K/year didn't feel like "what I'm worth." It felt like "one income stream." The psychological shift was instant. I stopped feeling dependent. I started thinking like an owner.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">That's the real value of the first dollar online. Not the money. The <strong>identity shift</strong>.</p>`);
}

export function seinfeld3() {
  return wrap("FROM THE TRENCHES", '"That\'s great. Now show me the numbers."',
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">My wife is a rational person. When I told her I wanted to build something on the side, she said:</p>
<p style="font-size:20px;font-weight:600;color:#3B82F6;margin-bottom:20px;">"That's great. Now show me the numbers."</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">That's why the Freedom Number Calculator exists. When you can show a clear number — "$3,200 MRR by month 14" — the conversation changes from "are you sure?" to "how do we get there?"</p>`);
}

export function seinfeld4() {
  return wrap("FROM THE TRENCHES", "Month 4 was brutal.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">I'd been building for 4 months. One product live. Zero customers. I was seriously considering shutting it down.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Then I opened the FYM Dashboard. My freedom number hadn't changed. The math was still the math. I was just impatient. I pivoted using the Idea Pipeline, and within 2 weeks I had my first paying customer.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;"><strong>The system doesn't care about your feelings.</strong> Your freedom number doesn't change because you had a bad week. It changes when you adjust your inputs.</p>`);
}

export function seinfeld5() {
  return wrap("FROM THE TRENCHES", "Why I went faceless.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Last month I deleted my personal Twitter. 2,000 followers. 5 years of posts. Gone.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Instead, I created an anonymous account for my side business. No photo. No real name. Just the content. In 3 weeks it passed my personal account in engagement. Nobody knows it's me.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">The Brand Manager tool gave me the content calendar, the scripts, and the playbook. <strong>Anonymity isn't a limitation — it's a strategy.</strong></p>`);
}

export function seinfeld6() {
  return wrap("FROM THE TRENCHES", "The number that changed everything.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">My boss got his annual bonus last week. €15,000. He was thrilled.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">My side business generated <strong>$4,100 MRR</strong> this month. That's $49,200/year. Growing 8% monthly. No boss. No board. No equity dilution.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">His bonus is capped. My MRR compounds. The FYM Dashboard showed me this math 14 months ago. Today the math speaks for itself.</p>`);
}

export function seinfeld7() {
  return wrap("FROM THE TRENCHES", "I said no.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">My company offered me a promotion last week. Director → VP. 15% raise. More equity. More responsibility.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">I turned it down.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Not because I'm brave. Because the FYM Dashboard showed me exactly what the promotion would cost: 10+ extra hours/week, more visibility, more stress, less time to build. The raise would have been €18K/year. My side business grew by $600 MRR last month alone — $7,200/year, and it compounds.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;"><strong>The freedom number isn't about quitting.</strong> It's about having the option to say no.</p>`);
}

export function seinfeld8() {
  return wrap("FROM THE TRENCHES", "The boring product.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Want to know what my best-performing product is? It's not an AI tool. It's not a SaaS platform. It's a <strong>PDF generator for electricians</strong>.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Electricians fill out a form. They get a branded PDF invoice. $9/month. 447 customers. That's $4,023/month.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">The Idea Pipeline found this idea. It scored it low on "excitement" but high on "revenue probability." It was right. <strong>Boring products pay mortgages.</strong></p>`);
}

export function seinfeld9() {
  return wrap("FROM THE TRENCHES", "Competition is a signal.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Someone copied my product last month. Same UI. Same pricing. Even copied my landing page copy.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">I wasn't mad. I was validated.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Here's what I did: I launched version 2.0 the next week. Added 3 features they didn't have. Email my customers personally. Lost 2 customers to the copycat. Gained 14 from the attention the competition created.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;"><strong>Competition means you found a real market.</strong> Copycats are free market research.</p>`);
}

export function seinfeld10() {
  return wrap("FROM THE TRENCHES", "The 7-minute morning.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">People ask how I build a side business with a full-time job and a family. The answer isn't time management. It's energy management.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Every morning, before Slack, before email, before my daughter wakes up, I spend 7 minutes on my side business. 5 days a week. That's 35 minutes of deep work before most people check their phone.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">The Launch Control tool tells me exactly what to do in those 7 minutes. No decision fatigue. No wasted energy. Just execution.</p>`);
}

export function seinfeld11() {
  return wrap("FROM THE TRENCHES", "The full timeline.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">It's been 12 months since I started. Here's the honest timeline:</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Month 1-3: Built, launched, zero customers. Questioned everything.<br>Month 4: First customer ($9/mo). Screamed in the car.<br>Month 6: $850 MRR. Still employed. Employer clueless.<br>Month 9: $2,100 MRR. Turned down a promotion.<br>Month 12: $4,100 MRR across 3 products.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">It wasn't fast. It wasn't easy. But the system worked exactly as designed. The FYM Dashboard kept me on track when motivation failed.</p>`);
}

export function seinfeld12() {
  return wrap("FROM THE TRENCHES", "If I started over.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">If I had to start from zero tomorrow, here's what I'd do differently:</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">1. I'd calculate my freedom number <strong>first</strong>, not after choosing an idea.<br>2. I'd set up entity separation <strong>before</strong> launching, not after.<br>3. I'd pick the most boring idea, not the most exciting one.<br>4. I'd charge from day one. No free tier. No "exposure."<br>5. I'd spend 80% of my time on distribution, 20% on building.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">These are the exact steps the Invisible Exit system walks you through. I learned them the hard way so you don't have to.</p>`);
}

// ═══ WINBACK (legacy email-sequence winback block) ═══
function winback1() {
  return wrap("WIN-BACK", "It's been a while.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">I noticed you haven't opened my last few emails. No hard feelings — I get it. Your inbox is a war zone.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">But I want to check: are you still thinking about building something on the side? Or did you file this under "someday"?</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">If you're still interested, here's what I'd do today: <strong>calculate your freedom number.</strong> Not next week. Not after the IPO. Today.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Because every month you wait is $4,000 in unrealized MRR. That's $48,000/year of delay.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">If you're done, no worries — just ignore this email and I'll stop sending. But if there's still a spark, <strong>reply with the word "still in"</strong> and I'll send you something special.</p>`);
}

function winback2() {
  return wrap("WIN-BACK", "The one thing I'd do differently.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">If I could go back 14 months and tell myself one thing, it would be this:</p>
<p style="font-size:20px;font-weight:600;color:#3B82F6;margin-bottom:20px;">Stop researching. Start building. Even the wrong thing.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">I wasted 3 months on spreadsheets. Market sizing. Competitor analysis. LLC formation research. Zero products launched. Zero revenue. Just anxiety disguised as productivity.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">The first product I launched was wrong. It made $9/month. But building it taught me more than 3 months of research ever did.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">If you've been thinking about starting for more than 30 days, you're already overthinking it. The system is ready. The ideas are validated. The stealth setup is documented. All that's missing is you pressing start.</p>`);
}

// ═══ ASCENSION — buyer upsell to Pro/Founding (7 days) ═══
export function ascension1() {
  return wrap(
    "DAY 1",
    "You Know Your Number. Now Let's Make It Real.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Welcome to the 3% — people who didn't just calculate their freedom number, but actually took the first step.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Here's something nobody tells you about the $0.97 plan: it's the map, not the journey. The 5 tools show you where the door is and give you the skeleton key. But to actually walk through it — to hit your number in months instead of years — most members do one thing differently.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;"><strong>They go from DIY to done-with-others.</strong></p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Tomorrow I'll show you what Pro members get that $0.97 members don't. Hint: it's not just more tools.</p>`,
    false,
  );
}

export function ascension2() {
  return wrap(
    "DAY 3",
    "The Idea Pipeline Won't Validate Itself.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">How's your first week going? If you're like most $0.97 members, you've probably opened the FYM Dashboard, clicked around the Idea Pipeline, and started reading about Stealth Ops.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">And now you're stuck on the same question: <strong>"Which idea do I actually pick?"</strong></p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">This is the wall. Every $0.97 member hits it. Most spend weeks agonizing over the decision. Pro members submit their top 3 ideas and get a <strong>written validation report within 48 hours</strong> — market sizing, pricing research, and a clear go/no-go recommendation.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">A single validated idea is worth $4,000/month. The validation reports alone cost more than Pro membership.</p>`,
    false,
  );
}

export function ascension3() {
  return wrap(
    "DAY 5",
    "🔥 Today Only: Unlock Everything at 93% Off",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">I don't normally do this, but you've been reading my emails and I want to give you the full toolkit to see what happens.</p>
<p style="font-size:18px;font-weight:600;color:#3B82F6;margin-bottom:20px;">Here's the offer: Upgrade to Pro today and get everything.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;"><strong>What you get:</strong></p>
<ul style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">
<li>Weekly group coaching with Adrian (value: $199/mo)</li>
<li>Private community of corporate managers (value: $49/mo)</li>
<li>Idea validation reports — 3/month (value: $150/mo)</li>
<li>Priority Slack access — 12-hour response (value: $99/mo)</li>
<li>Monthly MRR audit — personalized review (value: $199/mo)</li>
<li>All 5 core tools included (value: $12/mo)</li>
</ul>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;"><strong>Total value: $708/month. Your price: $47/month.</strong> That's 93% off. Cancel anytime. 30-day guarantee.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">The $0.97 plan stays active no matter what — this is a complement, not a replacement.</p>`,
  );
}

export function ascension4() {
  return wrap(
    "DAY 7",
    "Your First Week Is Covered. Here's What's Next.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">If you upgraded to Pro this week — welcome. Your first coaching call is Tuesday at 7 PM CET. Submit your ideas in the Slack channel before then so we can review them on the call.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">If you're still on $0.97, that's okay. You have the tools. The only difference between you and the $4,000/month members is: they found someone to hold them accountable and validate their decisions faster.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">The offer stands — $47/month, cancel anytime. The door is open.</p>`,
    false,
  );
}

// ═══ POST-PURCHASE — buyer onboarding (5 days) ═══
export function postPurchase1() {
  return wrap("DAY 1 · ONBOARDING", "Welcome to the 3%. Let's get to work.",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">You did something 97% of managers never do: you took action. Your dashboard is live. Your tools are ready. Here's what to do in the next 10 minutes.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;"><strong>Step 1:</strong> Open the FYM Dashboard. Enter your salary and expenses. See your Freedom Number.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;"><strong>Step 2:</strong> Open the Idea Pipeline. Browse 3 ideas that match your industry.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;"><strong>Step 3:</strong> Check the Stealth Ops Hub. Score your current invisibility level.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">That's it. 10 minutes. You're already ahead of everyone who bookmarked this and said "tomorrow."</p>`);
}

export function postPurchase2() {
  return wrap("DAY 2 · ONBOARDING", "The 90-second habit",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Every morning, I open one dashboard. Not Slack. Not email. My FYM Dashboard.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">90 seconds. I check my MRR, my invisibility score, and my exit timeline. Then I close it and go to work.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">This habit does something psychological: it makes the exit feel real. Every morning, you see the number moving. Even when it's $0, the dashboard reminds you that the system is running. You're not just dreaming about starting. You're tracking it.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Start tomorrow. 90 seconds. Then go build.</p>`);
}

export function postPurchase3() {
  return wrap("DAY 3 · ONBOARDING", "The $2,400 mistake",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">I spent three weekends researching LLC formations. Wyoming vs. Delaware vs. Estonia. Three weekends I should have spent building. That was $2,400 in lost building time.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Don't make this mistake. The Stealth Ops Hub has the answer in 5 minutes. Choose your state, file the forms, move on. The point is to BUILD, not to research building.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">If you catch yourself spending more than one evening on any setup task, stop. You're overthinking. The system has the answer. Use it. Move on.</p>`);
}

export function postPurchase4() {
  return wrap("DAY 5 · ONBOARDING", "The 48-hour validation sprint",
    `<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">This weekend, do one thing: validate one idea. Not build. Not launch. Validate.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">Open the Idea Pipeline. Pick the idea that scored highest for your industry. Run the 48-hour validation framework: who's the customer, what's the pain, what's the pricing, does anyone search for it?</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">If it passes validation, you have your first product. If it doesn't, you saved yourself 3 months of building the wrong thing. Either way, you win.</p>
<p style="font-size:16px;line-height:1.7;color:#4A5568;margin-bottom:20px;">The system beats the idea. Pick one. Validate. Move on.</p>`);
}

// ═══ SEQUENCE ARRAYS ═══
export const SOAP: EmailEntry[] = [
  { day: 0, subject: "The thing 97% of managers will never do...", html: soap1() },
  { day: 1, subject: "I screamed in a taxi (and the driver thought I was insane)", html: soap2() },
  { day: 2, subject: "The cage has a door (most managers never look for it)", html: soap3() },
  { day: 3, subject: "3 things I wish I'd known before I started building", html: soap4() },
  { day: 4, subject: "Why 'someday' is the most expensive word in your vocabulary", html: soap5() },
];

export const SEINFELD: EmailEntry[] = [
  { day: 7, subject: "I almost got caught last week...", html: seinfeld1() },
  { day: 14, subject: "The $0.97 that changed how I see my salary", html: seinfeld2() },
  { day: 21, subject: "What my wife said when I told her I wanted to quit", html: seinfeld3() },
  { day: 28, subject: "The month I almost gave up (and what saved me)", html: seinfeld4() },
  { day: 35, subject: "Why I deleted my personal Twitter (and built a faceless one)", html: seinfeld5() },
  { day: 42, subject: "The number that made my boss's bonus irrelevant", html: seinfeld6() },
  { day: 49, subject: "I turned down a promotion last week. Here's why.", html: seinfeld7() },
  { day: 56, subject: "The boring product that pays my mortgage", html: seinfeld8() },
  { day: 63, subject: "A competitor copied my product. I wasn't mad.", html: seinfeld9() },
  { day: 70, subject: "The 7-minute morning routine that replaced my commute energy", html: seinfeld10() },
  { day: 77, subject: "Year-end review: $0.97 → $4,000 MRR (the full timeline)", html: seinfeld11() },
  { day: 84, subject: "What I'd do differently if I started over tomorrow", html: seinfeld12() },
];

export const WINBACK: EmailEntry[] = [
  { day: 90, subject: "Are you still interested in building your exit?", html: winback1() },
  { day: 95, subject: "I'm closing this chapter (one last thing)", html: winback2() },
];

export const ASCENSION: EmailEntry[] = [
  { day: 1, subject: "Your Freedom Number is [$X]. Here's how to hit it in 90 days.", html: ascension1() },
  { day: 3, subject: "The one thing most $0.97 members miss (and why it matters)", html: ascension2() },
  { day: 5, subject: "🔓 One-Time Offer: Unlock everything — inside", html: ascension3() },
  { day: 7, subject: "Your 7-day trial of Pro starts tomorrow. Here's how it works.", html: ascension4() },
];

export const POST_PURCHASE: EmailEntry[] = [
  { day: 1, subject: "Your tools are live. Here's what to do first.", html: postPurchase1() },
  { day: 2, subject: "The 90-second habit that makes or breaks your exit timeline", html: postPurchase2() },
  { day: 3, subject: "I spent $2,400 on this mistake. You don't have to.", html: postPurchase3() },
  { day: 5, subject: "Your first product: the 48-hour validation sprint", html: postPurchase4() },
];

const SEQUENCE_MAP: Record<string, EmailEntry[]> = {
  soap_opera: SOAP,
  seinfeld: SEINFELD,
  winback: WINBACK,
  ascension: ASCENSION,
  post_purchase: POST_PURCHASE,
};

export function getSequence(name: string): EmailEntry[] {
  return SEQUENCE_MAP[name] ?? SOAP;
}

/**
 * Send a single email via Resend using raw fetch.
 * Reused by all other /api routes — never does HTTP fetch to self.
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { success: false, error: "RESEND_API_KEY not set" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { success: false, error: `Resend ${res.status}: ${body}` };
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (err: any) {
    return { success: false, error: err?.message ?? String(err) };
  }
}

// ═══ HANDLER ═══
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { email, day, sequence = "soap_opera" } = req.body ?? {};
    const allEmails = getSequence(sequence);

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Send a specific email by day
    if (day !== undefined && day !== null) {
      const emailData = allEmails.find((e) => e.day === day);
      if (!emailData) {
        return res.status(400).json({ error: `No email at day ${day}` });
      }

      const result = await sendEmail(email, emailData.subject, emailData.html);
      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }
      return res.status(200).json({ success: true, id: result.id, day });
    }

    // Otherwise return the schedule
    return res.status(200).json({
      success: true,
      sequence,
      totalEmails: allEmails.length,
      schedule: allEmails.map((e) => ({ day: e.day, subject: e.subject })),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? "Internal error" });
  }
}
