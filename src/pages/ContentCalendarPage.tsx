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
        description="17 email stories converted into ready-to-deploy social content: Twitter threads, Reddit posts, LinkedIn articles, and YouTube scripts. Copy, paste, post."
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
            17 email stories → 90 days of social content.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            Every story is pre-written for 4 platforms. Copy. Paste. Post. The content engine
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

          {/* More coming */}
          <div className="card-base p-8 mt-8 text-center bg-primary/5 border-primary/20">
            <p className="text-foreground font-semibold mb-2">Days 8–90 coming next.</p>
            <p className="text-sm text-muted-foreground mb-4">
              11 more Seinfeld email stories + Soap Opera sequence = 90 days of daily content.
              Each pre-written for all 4 platforms.
            </p>
            <Link to="/traffic-blueprint" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover">
              Back to Traffic Blueprint <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContentCalendarPage;
