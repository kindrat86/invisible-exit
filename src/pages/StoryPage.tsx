import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mic, ArrowRight, ArrowLeft, Headphones, Play, Clock, Monitor, Lightbulb, ShieldCheck, BadgeCheck, Building2, TrendingUp, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { AudioNarrator } from "@/components/AudioNarrator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const CHAPTERS = [
  {
    num: "01",
    eyebrow: "Background",
    title: "I was the perfect employee.",
    body: [
      "I'm Adrian. I'm 37. Managing Director at a European tech company. $120K salary. Less than 0.5% equity. On paper, I won the career lottery.",
      "I managed teams of 40+ people. I executed quarterly roadmaps. I ran P&L reviews. I navigated corporate politics with the precision of a Swiss watchmaker.",
      "I was the person other people asked for career advice. And I gave it — confidently, convincingly, completely unaware that I was trapped inside a system designed to keep me believing the next promotion would be the one that changed everything.",
      "— Adrian",
    ],
  },
  {
    num: "01b",
    eyebrow: "The Desire",
    title: "I didn't want to quit. I wanted to matter.",
    body: [
      "Here's what nobody tells you about the golden handcuffs: they don't feel like handcuffs. They feel like belonging. Like purpose. Like being part of something bigger than yourself.",
      "I wanted to build something that was mine. Not a line item on someone else's cap table. Not a product that could be killed in a reorganization I'd never attend. Something I owned. Something that couldn't be taken away in a board meeting.",
      "But I didn't want to quit. I liked my team. I liked the paycheck. I liked the stability that let me sleep at night. I just wanted... more. I wanted to know that if the company disappeared tomorrow, my family would be fine. That's all I wanted: optionality. The freedom to choose.",
      "I didn't know it yet, but that desire — for optionality, not escape — was the seed of everything that followed.",
      "— Adrian",
    ],
  },
  {
    num: "02",
    eyebrow: "The Hook",
    title: "0.5% equity. 18 months to IPO.",
    body: [
      "For 8 years, I told myself the same story: the IPO is coming. When it comes, my 0.5% becomes real money. That's the payoff. That's why I stayed.",
      "Then I did the math. Carefully. For the first time.",
      "$1B exit → my 0.5% = $5M. After dilution and taxes (~40%) = $3M. Invested at 5% = $150K/year passive income. My salary is $120K.",
      "Even a BILLION DOLLAR EXIT wouldn't buy my freedom. The golden handcuffs were never designed to come off. They were designed to feel like they might.",
      "— Adrian",
    ],
  },
  {
    num: "03",
    eyebrow: "The Origin",
    title: "Amsterdam. 6 AM. Raining.",
    body: [
      "I'd landed on a KLM flight with my wife and our 8-year-old. First morning of a family vacation. My phone buzzed in the taxi.",
      "Two notifications sat side by side on the lock screen.",
      "The first: corporate escalation emails. People at my company fighting over responsibilities. At 6 AM. On the first morning of my vacation.",
      "The second: a Stripe notification. \"$0.97 received.\" A complete stranger — a plumber in Ohio — had paid for a landing page I'd built. While I slept on a plane. Under a name that isn't mine.",
      "I screamed in the taxi. The driver thought I was insane. My wife understood: this wasn't about $0.97. This was proof that the cage has a door.",
      "— Adrian",
    ],
  },
  {
    num: "04",
    eyebrow: "The Epiphany",
    title: "Corporate loyalty is a transaction, not a virtue.",
    body: [
      "After Amsterdam, I couldn't unsee the math. I sat with it for days. It made me uncomfortable in a way I couldn't ignore.",
      "Here's what I realized: I had been treating my employment like a marriage — a bond of loyalty and shared purpose. But my employer treated it like a transaction. A line item. A salary that could be cut, a role that could be restructured, a person who could be replaced in a board meeting I'd never attend.",
      "Less than 0.5% equity is not a partnership. It's a leash disguised as one.",
      "The epiphany wasn't bitter. It was liberating. Because it meant I owed them exactly what they owed me: professional work for professional pay. Nothing more. And my 5 hours a week — the ones I'd been giving to anxiety and Googling — could belong to me.",
      "— Adrian",
    ],
  },
  {
    num: "05",
    eyebrow: "Secret #1 — The Vehicle",
    title: "Your job is the perfect launchpad.",
    body: [
      "Everyone told me: if you want to build a startup, quit your job. Get funding. Hire a team. Move fast, break things, burn out by 35.",
      "That advice is catastrophically wrong for people like us.",
      "Your salary is runway funding — but unlike a VC's money, it doesn't cost you equity. Your corporate skills (managing teams, reading P&Ls, executing projects under pressure) are exactly what solo founders lack. And your 5 hours a week — constrained, precious, non-negotiable — forces a kind of ruthless focus that full-time founders with 60 hours and no deadline can never replicate.",
      "I didn't need to quit. I needed to build WITHIN my constraints, not in spite of them.",
      "— Adrian",
    ],
  },
  {
    num: "06",
    eyebrow: "Secret #2 — The Stealth",
    title: "Anonymity is your greatest asset.",
    body: [
      "Week 3 of building. My colleague said during a team call: \"Hey, has anyone seen this website? It looks like something [my employer] would build.\"",
      "My blood ran cold for about 3 seconds. Then I remembered: different name, different entity, different payment processor, different hosting, different niche. Zero connection to me.",
      "Those 3 seconds of panic were the best feeling I've ever had. Because they proved the system worked.",
      "When you're anonymous, you can experiment without fear. You can build in markets unrelated to your expertise. You can fail publicly — publicly to the 3 people who visit your site — without your employer, your LinkedIn network, or your professional reputation ever knowing. Anonymity isn't hiding. It's freedom.",
      "— Adrian",
    ],
  },
  {
    num: "07",
    eyebrow: "Secret #3 — The System",
    title: "The system beats the idea.",
    body: [
      "I spent 3 months choosing the \"right\" idea. Spreadsheet after spreadsheet. Market sizing. Competitor analysis. Procrastination disguised as research.",
      "Then I launched the wrong idea. And it made $9/month. So I pivoted. The second product made $47/month. The third hit $850. The fourth crossed $4,000.",
      "The lesson was brutal and simple: stop obsessing over the idea. Build the system first — freedom number → idea pipeline → stealth ops → launch → brand — and you can swap ideas in and out like cartridges in a printer.",
      "The system doesn't care which idea you pick. The system cares that you HAVE a system.",
      "— Adrian",
    ],
  },
  {
    num: "08",
    eyebrow: "The Wall — Breaking the False Belief",
    title: "Month 4. Zero customers. I cried in my parking lot.",
    body: [
      "I'd been building for 4 months. One product was live. Nobody cared. Zero customers. I checked Stripe 40 times a day. Nothing. Zero. The kind of quiet that screams.",
      "It was a Tuesday. Mid-November. Cold enough that my windshield fogged up before the defroster kicked in. I was sitting in my 2018 Toyota Corolla — the one with 80,000 miles and a crack in the driver-side cupholder — in the parking lot of my office. The gym bag on the passenger seat still had last week's socks in it. I'd been meaning to take them out. For 11 days.",
      "That detail — the gym bag, the socks, the 11 days — is what broke me. Not the Stripe dashboard. Not the zero dollars. The gym bag. Because it meant I wasn't even showing up for myself anymore. I was showing up for a dashboard nobody looked at.",
      "Here's the false belief that almost killed me: I believed that if I picked the RIGHT idea, success would be inevitable. That the idea was the bottleneck. That choosing correctly was 80% of the work. I had spent 3 months picking and I had $0 to show for it.",
      "I sat there in that cold car and thought: maybe I'm not cut out for this. Maybe the golden handcuffs are the best I'll get. Maybe I should just be grateful and stop pretending I can build something. That voice — the one that says 'you chose wrong, give up' — was loud and specific. It sounded like my own voice but with better grammar.",
      "Then I did something I hadn't done in months: I opened my freedom number calculation. I had built it so carefully on Day 1, then never looked at it again. The math hadn't changed. $4,000/month MRR = optionality. The mortgage was $2,100. Car was $340. The school was $800. I wasn't trying to get rich. I was trying to get breathing room.",
      "The math doesn't care about your feelings. And in that parking lot, it hit me: the idea wasn't the problem. The SYSTEM was the problem. I had no pipeline. No validation process. No way to test and pivot quickly. I was treating a system problem as an idea problem. Like trying to fix a broken engine by changing the radio station.",
      "That's when I stopped. Not the product — stopped believing. I drove home (stopped for groceries, normal Tuesday), made dinner, put my kid to bed, and started from scratch. Not with a new idea. With a piece of paper. One question: if the idea doesn't matter, what does? The answer wrote itself: a system to generate, validate, and launch ideas on a 5-hour/week budget.",
      "Two weeks later: first paying customer. $9/month. The cage door cracked open — not because I found the right idea, but because I stopped believing ideas mattered more than systems.",
      "— Adrian",
    ],
  },
  {
    num: "08b",
    eyebrow: "The Vision",
    title: "I saw my future in two timelines.",
    body: [
      "That same night — after the parking lot, after the groceries, after the kid went to bed — I sat at the kitchen table and did something I'd never done before. I wrote two visions of my life, side by side, 18 months into the future.",
      "Timeline A: I kept doing what I was doing. Another 18 months of corporate execution. Another quarterly review. Another team offsite where we discuss 'culture' while people check their phones under the table. Maybe a promotion. My 0.5% equity presumably worth... something. Not nothing. But not enough.",
      "I pictured the exact Tuesday morning of that future: same alarm, same commute, same coffee from the same machine, same Slack notifications I'd read before the first sip. Financially stable. Emotionally numb. Nothing wrong — and nothing mine.",
      "Timeline B: I had $4,000/month in recurring revenue. Not from luck. From a system. In Timeline B, my Tuesday morning looked like this: I woke up, opened a revenue dashboard I controlled, saw three Stripe deposits from three separate products, and knew — knew in my bones — that I could walk into my boss's office, quit, and be fine. I wouldn't do it. I like my job. But I COULD. That knowing was the entire point.",
      "The difference between the two timelines wasn't talent. It wasn't luck. It wasn't access. The difference was a single decision: do I build IN my constraints, or do I wait until I have no constraints left?",
      "Timeline A costs nothing. Timeline B costs 5 hours a week and the courage to be bad at something new for six months. I chose B. That's not a motivational line. That's a literal kitchen-table accounting. I chose the harder option because the Tuesday morning in Timeline A was eating me alive.",
      "— Adrian",
    ],
  },
  {
    num: "09",
    eyebrow: "External Conflict",
    title: "The competitor who almost killed me.",
    body: [
      "Month 5. I was 3 weeks from launching version 2.0. Then a competitor launched something almost identical. Same pricing. Same landing page structure. They had a team of 4. I had 5 hours a week.",
      "I almost quit again. For the second time in 5 months.",
      "Instead, I did something counterintuitive: I launched version 2.0 the same week they launched. Added 3 features they didn't have. Emailed every person on my waitlist personally. Lost 2 customers to the copycat. Gained 14 from the attention the competition created.",
      "Competition didn't kill me. It validated the market. Copycats are free market research. I just had to be faster, more personal, and more specific.",
      "— Adrian",
    ],
  },
  {
    num: "10",
    eyebrow: "The One Thing",
    title: "12 months. $4,100 MRR. Still employed. Still invisible.",
    body: [
      "Here's the honest timeline:",
      "Month 1–3: Built, launched, zero customers. Questioned everything. Almost quit twice.",
      "Month 4: First customer ($9/mo). Screamed in the car.",
      "Month 6: $850 MRR. Still employed. Employer clueless.",
      "Month 9: $2,100 MRR. Turned down a promotion because the raise would have cost me 10 hours/week and $7,200/year in potential MRR.",
      "Month 12: $4,100 MRR across 3 products. The boring one (a PDF generator for electricians) pays most of the mortgage.",
      "I didn't get rich. I got free. There's a difference. Rich is a number. Free is an option. I bought the option to say no — to the promotion, to the next reorganization, to the 0.5% that will never buy my life.",
      "— Adrian",
    ],
  },
  {
    num: "11",
    eyebrow: "Return with the Elixir",
    title: "I didn't want to build this. I built it because I had to.",
    body: [
      "After Month 12, something unexpected happened. Colleagues started noticing I was different. Calmer. Less anxious. More willing to push back. A friend in Finance pulled me aside: 'Something changed. What happened?'",
      "I couldn't tell him the truth. So I told him a version of it: 'I found something that makes the corporate game feel less important.' He said: 'Can you show me?'",
      "That's when I realized: the system I built for myself — the frameworks, the checklists, the tools — wasn't just for me. It was the elixir. The thing the hero brings back from the journey. And there were thousands of managers trapped in the same cage, waiting for someone to hand them the key.",
      "I didn't want to build Invisible Exit. I wanted to keep building micro-SaaS products in peace. But every time I explained the system to someone, they got the same look I had in that Amsterdam taxi. The look of someone who just realized the cage has a door.",
      "So here it is. Not a course. Not motivation. The actual system. The frameworks named, the tools built, the checklists written. Everything I wish someone had handed me on Day 1. Take it. Use it. And when you hit your freedom number — when you scream in your own car — come tell me about it. That's the only payment I need.",
    ],
  },
];

const StoryPage = () => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    trackEvent("story_page_viewed", { chapter: activeChapter + 1 });
  }, [activeChapter]);

  const nextChapter = () => setActiveChapter((c) => Math.min(c + 1, CHAPTERS.length - 1));
  const prevChapter = () => setActiveChapter((c) => Math.max(c - 1, 0));
  const chapter = CHAPTERS[activeChapter];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    trackEvent("story_email_submitted", { source: "story_page_cta" });
    try {
      await supabase
        .from("subscribers")
        .upsert(
          { email, source: "story_page" },
          { onConflict: "email" }
        );
      await supabase.functions
        .invoke("newsletter-welcome", { body: { email } })
        .catch(() => {});
      setSubmitted(true);
      toast.success("You're in. Check your inbox.");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(222_47%_11%)]">
      <SEOHead
        title="My Story — How I Built $4K/Month While Employed | Invisible Exit"
        description="The complete story: Amsterdam taxi moment, Month 4 wall, competitor near-miss, and the system that changed everything. 10 chapters. Read in 15 minutes."
        url="/story"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary-light mb-6">The Complete Story</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
            How I Built a{" "}
            <span className="text-gradient-light">$4,000/Month Side Business</span>{" "}
            While Employed — Without Anyone Knowing
          </h1>
          <p className="text-body-lg text-white/60 max-w-2xl mx-auto mb-4">
            10 chapters. 15 minutes. The Amsterdam taxi moment, Month 4 wall, the competitor
            who almost killed me, and the system that made all of it possible.
          </p>
          {/* EXPERT SECRETS Ch 7: Audio narrator — listen instead of read */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <AudioNarrator activeChapter={activeChapter} />
            <span className="text-white/30 text-xs">Listen with browser audio. Works on mobile.</span>
          </div>
          {/* EXPERT SECRETS Ch 3: New Category badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary-light font-medium">
              This isn't a side-hustle story. It's the origin of a new category of business.
            </span>
          </div>
          <p className="text-white/40 text-sm">
            Start at Chapter 1 or jump to any chapter below. Read in one sitting.
          </p>
        </div>
      </section>

      {/* ── EXPERT SECRETS Ch 2: ATTRACTIVE CHARACTER — establish identity before story ── */}
      <section className="border-b border-white/10 py-12 sm:py-16">
        <div className="container-narrow">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Avatar — stylized monogram, not a photo. Maintains the anonymity IS the brand positioning. */}
            <div className="shrink-0 relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent border border-primary/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary-light">A</span>
              </div>
              {/* Verified badge */}
              <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-[hsl(222_47%_11%)] border border-success/30 flex items-center justify-center" title="Verified — income claims documented">
                <BadgeCheck className="w-5 h-5 text-success" />
              </div>
            </div>

            {/* Identity + authority markers */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-eyebrow text-primary-light mb-2">Your Guide</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Adrian
              </h2>
              <p className="text-white/50 text-sm mb-4">
                Former Corporate Director · 8+ years in enterprise product · MBA
              </p>

              {/* Authority chips — Brunson's "identity badges" that build trust fast */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/10 rounded-full px-3 py-1 text-xs text-white/60">
                  <TrendingUp className="w-3.5 h-3.5 text-success" />
                  $4,100/mo verified
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/10 rounded-full px-3.5 py-1 text-xs text-white/60">
                  <Building2 className="w-3.5 h-3.5 text-primary-light" />
                  3 active products
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/10 rounded-full px-3 py-1 text-xs text-white/60">
                  <Briefcase className="w-3.5 h-3.5 text-white/50" />
                  Still employed
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/10 rounded-full px-3 py-1 text-xs text-white/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  Entity-separated & legal
                </span>
              </div>
            </div>
          </div>

          {/* The anonymity-as-proof card — Brunson's "Vulnerable Storyteller" archetype */}
          <div className="mt-8 bg-white/[0.03] border border-white/10 rounded-xl p-5 max-w-2xl mx-auto">
            <p className="text-white/60 text-sm leading-relaxed text-center">
              <strong className="text-white">Why no face or last name?</strong> Anonymity
              isn't a gimmick here — it's the proof of concept. I'm still employed. My employer
              still doesn't know. The system you're about to read about works so well that
              revealing my identity would defeat its entire purpose. Everything here is documented
              and independently verifiable through Stripe statements, company registrations, and
              tax filings. I just can't attach them to my LinkedIn profile — yet.
            </p>
          </div>
        </div>
      </section>

      {/* EXPERT SECRETS Ch 7-8: Chapter preview grid */}
      <section className="bg-white/5 border-y border-white/10 py-6">
        <div className="container-narrow">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {CHAPTERS.map((ch, i) => (
              <button
                key={ch.num}
                onClick={() => setActiveChapter(i)}
                className={`text-left p-3 rounded-xl transition-all ${
                  i === activeChapter
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-white/[0.03] border border-white/5 hover:bg-white/[0.06]"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider text-primary-light font-semibold block mb-1">{ch.eyebrow}</span>
                <p className="text-xs text-white font-medium leading-tight truncate-2">{ch.title}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter progress bar */}
      <div className="sticky top-[64px] z-30 bg-[hsl(222_47%_11%)]/95 backdrop-blur-sm border-y border-white/5">
        <div className="container-narrow py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {CHAPTERS.map((ch, i) => (
                <button
                  key={ch.num}
                  onClick={() => setActiveChapter(i)}
                  className={`shrink-0 w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    i === activeChapter
                      ? "bg-primary text-white"
                      : i < activeChapter
                      ? "bg-primary/20 text-primary-light"
                      : "bg-white/5 text-white/30"
                  }`}
                  aria-label={`Chapter ${ch.num}`}
                >
                  {ch.num}
                </button>
              ))}
            </div>
            <span className="text-white/40 text-xs shrink-0">
              {activeChapter + 1} / {CHAPTERS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Chapter content */}
      <section className="section-wide py-16 sm:py-20">
        <div className="container-narrow" style={{ maxWidth: "42rem" }}>
          <div key={activeChapter} className="animate-fade-in" data-story-chapter>
            <p className="text-eyebrow text-primary-light mb-4">{chapter.eyebrow}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
              {chapter.title}
            </h2>
            <div className="space-y-6">
              {chapter.body.map((para, i) => {
                const isSignOff = para.startsWith("— Adrian");
                return isSignOff ? (
                  <p key={i} className="text-sm font-medium text-primary-light/80 italic tracking-wide pt-2">
                    {para}
                  </p>
                ) : (
                  <p key={i} className="text-base sm:text-lg text-white/70 leading-[1.8]">
                    {para}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Nav arrows */}
          <div className="flex items-center justify-between mt-16 pt-8 border-t border-white/10">
            <button
              onClick={prevChapter}
              disabled={activeChapter === 0}
              className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            {activeChapter < CHAPTERS.length - 1 ? (
              <button
                onClick={nextChapter}
                className="inline-flex items-center gap-2 text-primary-light hover:text-white transition-colors font-medium"
              >
                Next chapter <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-white/30 text-sm">End of story</span>
            )}
          </div>
        </div>
      </section>

      {/* ── MASTERCLASS BRIDGE: After Chapter 3 (0.5% Equity Hook) ── */}
      {activeChapter === 2 && (
        <section className="section-wide animate-fade-in border-t border-white/10 py-12">
          <div className="container-narrow">
            <div className="max-w-md mx-auto text-center">
              <p className="text-eyebrow text-primary-light mb-3">Want to See How This Ends?</p>
              <h3 className="text-white font-bold text-lg mb-3">
                The free masterclass breaks down the exact math — and the solution.
              </h3>
              <p className="text-white/50 text-sm mb-6">
                What if your equity is worth less than you think? And what if there's a better
                vehicle that doesn't require a billion-dollar exit?
              </p>
              <Link
                to="/masterclass"
                onClick={() => trackEvent("story_masterclass_bridge_clicked", { chapter: 3 })}
                className="inline-flex items-center gap-2 text-primary-light hover:text-white font-medium text-sm transition-colors"
              >
                Jump to the Free Masterclass →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── MASTERCLASS BRIDGE: After Chapter 7 (The System) ── */}
      {activeChapter === 6 && (
        <section className="hero-dark section-wide animate-fade-in border-t border-white/10">
          <div className="container-narrow text-center">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 sm:p-12">
              <span className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <Play className="w-4 h-4" />
                Free 45-Minute Masterclass
              </span>

              <p className="text-eyebrow text-primary-light mb-4">See the System Broken Down</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                This Is the System — But There's More to the Picture
              </h2>
              <p className="text-white/60 text-base max-w-lg mx-auto mb-8">
                The 10 chapters above give you the framework. The masterclass gives you every slide —
                including the exact false beliefs breakdown, the value stack, and the step-by-step
                implementation plan. 14 slides. 45 minutes. Read-only, no video needed.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-lg mx-auto">
                {[
                  { icon: Lightbulb, label: "3 False Beliefs Broken Down" },
                  { icon: Monitor, label: "14 Interactive Slides" },
                  { icon: Clock, label: "45 Minutes, Read at Your Pace" },
                ].map((item) => (
                  <div key={item.label} className="bg-white/[0.04] border border-white/10 rounded-xl p-4 text-center">
                    <item.icon className="w-5 h-5 text-primary-light mx-auto mb-2" />
                    <span className="text-white/60 text-xs font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/masterclass"
                onClick={() => trackEvent("story_masterclass_bridge_clicked", { chapter: 7 })}
                className="btn-primary text-lg px-8 inline-flex items-center gap-2"
              >
                Go to the Free Masterclass →
              </Link>
              <p className="text-white/40 text-xs mt-3">
                No email required. Start reading immediately.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA — only on last chapter */}
      {activeChapter === CHAPTERS.length - 1 && (
        <section className="hero-dark section-wide animate-fade-in">
          <div className="container-narrow text-center">
            {/* EXPERT SECRETS Ch 2 + 14: Reluctant Hero — vulnerability before the offer */}
            <div className="max-w-lg mx-auto mb-10">
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 text-left">
                <p className="text-eyebrow text-primary-light mb-3 text-center">A Note From Adrian</p>
                <div className="space-y-4 text-white/60 text-sm leading-relaxed">
                  <p>
                    <strong className="text-white">I didn't want to build this.</strong> I wanted to keep
                    building micro-SaaS products in peace. I wanted to collect my $4,100/month,
                    walk into work calm, and go home. I didn't want to be a guru, a coach, or a
                    movement leader. That's not my personality.
                  </p>
                  <p>
                    But then a colleague pulled me aside and said: <em>"Something changed. What happened?"</em>
                    And I realized: if I kept this to myself, I'd be no better than the company
                    holding my 0.5% equity.
                  </p>
                  <p className="text-white font-medium">
                    So I'm sharing it. Reluctantly. Imperfectly. But completely. Because the cage
                    has a door, and I found the key. The least I can do is leave it unlocked for
                    the next person.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-eyebrow text-primary-light mb-4">Your Next Step</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Two Ways Forward — Pick Your Path
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              The full story is in your head now. Here's how to turn it into action.
            </p>

            {/* Two-option path: Masterclass first, then tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-10">
              <Link
                to="/masterclass"
                onClick={() => trackEvent("story_final_cta_masterclass")}
                className="group card-glass p-6 hover:bg-white/[0.08] transition-all border border-primary/30 hover:border-primary/50 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
                  <Play className="w-5 h-5 text-primary-light" />
                </div>
                <h3 className="text-white font-bold text-base mb-1 group-hover:text-primary-light transition-colors">
                  Watch the Free Masterclass →
                </h3>
                <p className="text-white/50 text-xs">
                  14 slides. The complete 5-tool system broken down step by step.
                </p>
              </Link>

              <div className="card-glass p-6 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center mb-3">
                  <ArrowRight className="w-5 h-5 text-success" />
                </div>
                <h3 className="text-white font-bold text-base mb-1">
                  Start With the Tools ($0.97)
                </h3>
                <p className="text-white/50 text-xs mb-4">
                  Skip the theory. Get the 5 tools and start building today.
                </p>
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      className="w-full rounded-lg bg-white/10 border border-white/15 text-white placeholder:text-white/40 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all disabled:opacity-50"
                    >
                      {loading ? "..." : "Start for $0.97/month"}
                      {!loading && <ArrowRight className="w-4 h-4 inline ml-1" />}
                    </button>
                  </form>
                ) : (
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-center">
                    <p className="text-success text-sm font-semibold">You're in!</p>
                    <p className="text-white/50 text-xs mt-1">Check your inbox.</p>
                  </div>
                )}
              </div>
            </div>

            <p className="text-white/30 text-xs">
              30-day money-back guarantee. Cancel anytime. No risk.
            </p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default StoryPage;
