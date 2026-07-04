import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const CHAPTERS = [
  {
    num: "01",
    eyebrow: "Background",
    title: "I was the perfect employee.",
    body: [
      "I'm 37. Managing Director at a European tech company. $120K salary. Less than 0.5% equity. On paper, I won the career lottery.",
      "I managed teams of 40+ people. I executed quarterly roadmaps. I ran P&L reviews. I navigated corporate politics with the precision of a Swiss watchmaker.",
      "I was the person other people asked for career advice. And I gave it — confidently, convincingly, completely unaware that I was trapped inside a system designed to keep me believing the next promotion would be the one that changed everything.",
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
    ],
  },
  {
    num: "08",
    eyebrow: "The Wall — Breaking the False Belief",
    title: "Month 4. Zero customers. The false belief shattered.",
    body: [
      "I'd been building for 4 months. One product was live. Nobody cared. Zero customers. I checked Stripe 40 times a day. Nothing.",
      "Here's the false belief that almost killed me: I believed that if I picked the RIGHT idea, success would be inevitable. That the idea was the bottleneck. That choosing correctly was 80% of the work.",
      "I sat in my car after work one Tuesday and thought: maybe I'm not cut out for this. Maybe the golden handcuffs are the best I'll get. Maybe I should just be grateful and stop pretending I can build something. That voice — the one that says 'you chose wrong, give up' — was loud and specific.",
      "Then I opened my freedom number calculation. The math hadn't changed. $4,000/month MRR = optionality. The math doesn't care about your feelings. And then it hit me: the idea wasn't the problem. The SYSTEM was the problem. I had no pipeline. No validation process. No way to test and pivot quickly. I was treating a system problem as an idea problem.",
      "That's when I started building the framework. Two weeks later: first paying customer. $9/month. The cage door cracked open — not because I found the right idea, but because I stopped believing ideas mattered more than systems.",
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
          <p className="text-body-lg text-white/60 max-w-2xl mx-auto mb-8">
            10 chapters. 15 minutes. The Amsterdam taxi moment, Month 4 wall, the competitor
            who almost killed me, and the system that made all of it possible.
          </p>
          <p className="text-white/40 text-sm">
            This is the full Epiphany Bridge — from trapped to free. Read it in one sitting.
          </p>
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
          <div key={activeChapter} className="animate-fade-in">
            <p className="text-eyebrow text-primary-light mb-4">{chapter.eyebrow}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
              {chapter.title}
            </h2>
            <div className="space-y-6">
              {chapter.body.map((para, i) => (
                <p key={i} className="text-base sm:text-lg text-white/70 leading-[1.8]">
                  {para}
                </p>
              ))}
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

      {/* CTA — only on last chapter */}
      {activeChapter === CHAPTERS.length - 1 && (
        <section className="hero-dark section-wide animate-fade-in">
          <div className="container-narrow text-center">
            <p className="text-eyebrow text-primary-light mb-4">Your Turn</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              This is the system that saved me 4 months of frustration.
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              5 tools. $0.97/month. The exact framework you just read about.
            </p>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your best email"
                  className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 py-4 px-5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[52px]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-lg"
                >
                  {loading ? "Loading..." : "Start for $0.97/month"}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            ) : (
              <div className="max-w-md mx-auto card-glass p-8 animate-scale-in">
                <p className="text-white text-lg font-semibold mb-2">You're in.</p>
                <p className="text-white/60 text-sm">
                  Check your inbox. Over the next 5 days, I'll send you the full story —
                  including the Amsterdam moment that started everything.
                </p>
              </div>
            )}
            <p className="text-white/30 text-xs mt-6">
              30-day money-back guarantee. Cancel anytime.
            </p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default StoryPage;
