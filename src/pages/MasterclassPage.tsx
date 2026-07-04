import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Calendar, Clock, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const SLIDES = [
  {
    title: "Welcome",
    eyebrow: "From Adrian — Your Host",
    hook: "For the next 45 minutes, I'll show you exactly how corporate managers are building $4,000/month side businesses.",
    body: "I'm Adrian. Managing Director at a European tech company. $120K salary. Less than 0.5% equity. And over the next 45 minutes, I'm going to show you the system that took me from trapped to $4,100/month — without quitting, without coding, and without my employer finding out. This isn't theory. This is the exact framework, step by step.",
    stat: "By Adrian, Managing Director",
  },
  {
    title: "The Hook",
    eyebrow: "Why You're Here",
    hook: "You earn $120K-$200K. You have less than 0.5% equity. And you just realized something uncomfortable.",
    body: "You did the math. Even if your company IPOs at a billion dollars — your 0.5% becomes $5M. After dilution and taxes: $2.4M. Invested at 5%: $120K/year. That's your salary. Even a billion-dollar exit doesn't buy your freedom. It buys you a longer leash. You're here because you felt that truth in your gut before I put numbers on it.",
    stat: "$120K salary ≠ freedom",
  },
  {
    title: "The Story — Amsterdam",
    eyebrow: "My Epiphany Bridge",
    hook: "6 AM. Taxi in Amsterdam. Two notifications that changed everything.",
    body: "I'd just landed on a KLM flight with my wife and 8-year-old. First morning of vacation. My phone buzzed. Two notifications sat side by side. The first: corporate escalation emails — colleagues fighting over responsibilities at 6 AM on my vacation. The second: a Stripe notification — \"$0.97 received\" from a stranger who bought a landing page I built while I slept. I screamed in the taxi. The driver thought I was insane. My wife understood. The cage has a door.",
    stat: "First $0.97 = identity shift",
  },
  {
    title: "Secret #1: The Vehicle",
    eyebrow: "Your Job Is the Launchpad",
    hook: "Everyone says quit your job to build a startup. They're wrong.",
    body: "Here's the story: I almost quit. I had my resignation letter drafted. Then I realized — my salary is runway funding that doesn't cost me equity. My corporate skills (managing teams, P&Ls, execution) are exactly what solo founders lack. My 5 hours/week forces ruthless focus that full-time founders with 60 hours can never replicate. The vehicle isn't a startup. The vehicle is YOUR JOB. It funds you, constrains you, and gives you the skills to win.",
    stat: "Employment = unfair advantage",
  },
  {
    title: "Secret #2: The Stealth",
    eyebrow: "Anonymity Is Your Asset",
    hook: "Week 3. My colleague found a website that looked like my side project. On a team call.",
    body: "My blood ran cold for 3 seconds. Then I remembered: different name, different entity, different payment processor, different hosting. Zero connection to me. The call moved on. Those 3 seconds of panic were the best $25/month I ever spent. Anonymity means you can experiment without fear, fail without consequences, and build in any market — all while your employer, your LinkedIn network, and your competitors have no idea. The Stealth Ops Hub makes this systematic.",
    stat: "Zero detection in 14 months",
  },
  {
    title: "Secret #3: The System",
    eyebrow: "5 Tools, One Pipeline",
    hook: "I spent 3 months choosing the 'right' idea. Then I launched the wrong one and it made $9/month.",
    body: "The lesson: stop obsessing over the idea. Build the SYSTEM first. FYM Dashboard (freedom number) → Idea Pipeline (500+ ideas, 48h validation) → Stealth Ops (entity + compliance) → Launch Control (go-live automation) → Brand Manager (faceless content). Once you have the system, you can swap ideas in and out like cartridges. The system doesn't care which idea you pick. The system cares that you HAVE a system.",
    stat: "5 tools, $0.97/month",
  },
  {
    title: "The Results",
    eyebrow: "12-Month Timeline",
    hook: "Here's the honest timeline. Not the highlight reel.",
    body: "Month 1–3: Built, launched, zero customers. Almost quit twice. Month 4: First customer ($9/mo). Screamed in the car. Month 6: $850 MRR. Still employed. Employer clueless. Month 9: $2,100 MRR. Turned down a promotion. Month 12: $4,100 MRR across 3 products. The boring product (a PDF generator for electricians) pays most of the mortgage. I didn't get rich. I got free. There's a difference.",
    stat: "$4,100 MRR in 12 months",
  },
  {
    title: "The Stack",
    eyebrow: "What You Get",
    hook: "5 tools worth $97/month. 3 bonuses worth $101. Total value: $328/month.",
    body: "All 5 tools (FYM Dashboard, Idea Pipeline, Stealth Ops Hub, Launch Control, Brand Manager) + 3 bonuses (Employment Contract Audit Checklist, 25 Micro-SaaS Idea Swipes, Faceless Founder Content Calendar). Total value $328/month. Your price as a founding member: $0.97/month. That's 99.7% off. Not because the tools are cheap — because I want this in the hands of people who act.",
    stat: "$328/month → $0.97/month",
  },
  {
    title: "Your Next Step",
    eyebrow: "The Offer — Act Now",
    hook: "Every month you wait costs you $4,000 in unrealized MRR.",
    body: "All 5 tools. $0.97/month. Cancel anytime. 30-day money-back guarantee. The founding price is limited to the first 100 members — after that, it goes to $9.99/month. If you've read this far, you're already in the 3%. The 97% would have left by slide 3. Calculate your freedom number today and see exactly how close you are.",
    stat: "Start for $0.97 — before founding closes",
  },
];

const MasterclassPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  const nextSlide = () => setSlideIdx((i) => Math.min(i + 1, SLIDES.length - 1));
  const prevSlide = () => setSlideIdx((i) => Math.max(i - 1, 0));
  const slide = SLIDES[slideIdx];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    trackEvent("masterclass_registered", { source: "masterclass_page" });
    try {
      await supabase
        .from("subscribers")
        .upsert(
          { email, source: "masterclass_registration" },
          { onConflict: "email" }
        );
      await supabase.functions
        .invoke("newsletter-welcome", { body: { email } })
        .catch(() => {});
      setRegistered(true);
      toast.success("You're registered! Check your email for the access link.");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Free Masterclass: Build a $4K/Month Side Business While Employed | Invisible Exit"
        description="45-minute masterclass for corporate managers. Learn the 3 secrets to building invisible recurring revenue without quitting your job."
        url="/masterclass"
      />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Play className="w-4 h-4" />
            Free 45-Minute Masterclass
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            How Corporate Managers Are Building{" "}
            <span className="text-gradient-light">$4,000/Month Side Businesses</span>{" "}
            in 12 Months
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-4">
            Without quitting your job. Without writing code. Without your employer finding out.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-white/50 text-sm mb-12">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> 45 minutes
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Watch on-demand
            </span>
            <span>·</span>
            <span>Free replay included</span>
          </div>

          {/* Interactive Slide Deck VSL */}
          <div className="mx-auto max-w-2xl rounded-2xl overflow-hidden shadow-2xl shadow-black/40 mb-8 border border-white/10">
            <div className="aspect-video bg-[hsl(222_47%_14%)] flex flex-col items-center justify-center p-6 sm:p-10 relative">
              {/* Slide content */}
              <div key={slideIdx} className="text-center animate-fade-in">
                <p className="text-eyebrow text-primary-light mb-3">{slide.eyebrow}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{slide.title}</h3>
                <p className="text-sm sm:text-base font-semibold text-primary-light/90 leading-relaxed mb-3 max-w-md mx-auto">
                  {slide.hook}
                </p>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-4 max-w-md mx-auto">{slide.body}</p>
                <p className="text-lg font-bold text-primary-light">{slide.stat}</p>
              </div>

              {/* Navigation arrows */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-4">
                <button
                  onClick={prevSlide}
                  disabled={slideIdx === 0}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-30"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <span className="text-white/40 text-xs">{slideIdx + 1} / {SLIDES.length}</span>
                <button
                  onClick={nextSlide}
                  disabled={slideIdx === SLIDES.length - 1}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-30"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {!registered ? (
            <form onSubmit={handleRegister} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 py-3.5 px-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[48px]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 min-h-[48px] whitespace-nowrap"
                >
                  {loading ? "..." : "Watch Free"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-white/40 text-xs mt-3">
                We'll send the replay link to your inbox. No spam.
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto card-glass p-6 animate-scale-in">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
                <Check className="w-5 h-5 text-success" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">You're registered!</h2>
              <p className="text-white/70 text-sm mb-6">
                Check <strong className="text-white">{email}</strong> for the replay link.
                The masterclass takes 45 minutes — watch it on your lunch break.
              </p>

              {/* Clear next steps */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <p className="text-white/50 text-xs uppercase tracking-wide font-semibold mb-2">While you wait:</p>
                <Link
                  to="/freedom"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-xl transition-all text-sm"
                >
                  Calculate Your Freedom Number (Free)
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/story"
                  className="w-full inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 font-medium py-3 px-4 rounded-xl transition-all text-sm border border-white/10"
                >
                  Read the Full Origin Story
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* What You'll Learn (from slides) */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">What You'll Learn</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">10 Slides. 45 Minutes. Zero Fluff.</h2>
          <div className="space-y-3">
            {SLIDES.map((s, i) => (
              <div key={i} className="card-base p-4 flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.eyebrow}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="bg-surface section-normal">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">Who Is This For?</p>
          <h2 className="text-h1 text-foreground mb-8">Corporate Managers Earning $120K-$200K</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              "You have a stable salary but feel trapped by the golden handcuffs",
              "You have less than 0.5% equity and an uncertain IPO timeline",
              "You want to build something that's yours — but you can't quit yet",
              "You have 5 hours a week and want to use them strategically",
              "You're worried your employer might find out about your side project",
              "You don't know how to code but want to build a real product",
            ].map((item, i) => (
              <div key={i} className="card-base p-5">
                <Check className="w-5 h-5 text-success mb-2" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MasterclassPage;
