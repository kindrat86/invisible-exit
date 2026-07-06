import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart3,
  Lightbulb,
  Shield,
  Rocket,
  Megaphone,
  ArrowRight,
  Check,
  Lock,
} from "lucide-react";
import TestimonialGrid from "@/components/TestimonialGrid";
import FrameworkDiagram from "@/components/FrameworkDiagram";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import { useABTest, trackABConversion } from "@/hooks/useABTest";

const TOOLS = [
  {
    icon: BarChart3,
    name: "FYM Dashboard",
    outcome: "Know exactly how much you need to quit.",
    description:
      "Tracks your recurring revenue, churn, growth rate, and exit timeline across all your projects.",
    value: "$12/month",
  },
  {
    icon: Lightbulb,
    name: "Idea Pipeline",
    outcome: "Stop guessing. Start validating.",
    description:
      "500+ micro-SaaS ideas scored by industry fit, time investment, and revenue potential. AI-powered validation in 48 hours.",
    value: "$15/month",
  },
  {
    icon: Shield,
    name: "Stealth Ops Hub",
    outcome: "Your employer will never find out.",
    description:
      "Entity separation, compliance audit, digital footprint cleanup. Invisibility score from 0-100 with specific fixes.",
    value: "$25/month",
  },
  {
    icon: Rocket,
    name: "Launch Control",
    outcome: "Ship products faster than your day job allows.",
    description:
      "Full launch automation: checklists, email sequences, go-live tracking. Built for people with 5 hours a week.",
    value: "$18/month",
  },
  {
    icon: Megaphone,
    name: "Brand Manager",
    outcome: "Build an audience without showing your face.",
    description:
      "Content calendar, YouTube scripts, Reddit playbooks. Everything you need to grow an anonymous brand.",
    value: "$27/month",
  },
];

const FAQS = [
  {
    q: "What do I get for $0.97/month?",
    a: "FYM Dashboard tells you exactly how much recurring revenue you need to quit. Idea Pipeline finds and validates your first product in 48 hours. Stealth Ops Hub makes sure your employer never finds out. Launch Control ships your product in weeks, not months. Brand Manager builds your audience without showing your face. All five, one price.",
  },
  {
    q: "Does this violate my employment contract?",
    a: "Most employment contracts restrict you from competing in your employer's industry or using company resources. Invisible Exit is designed around those constraints. You build in unrelated markets, on your own time, with your own tools. The Stealth Ops Hub runs a compliance audit against common contract clauses (non-compete, IP assignment, moonlighting) and flags anything that needs attention. That said, every contract is different. We always recommend reviewing yours with a legal professional.",
  },
  {
    q: "Can my employer find out?",
    a: "The Stealth Ops Hub is specifically designed to prevent that. It includes entity separation guidance, compliance audit tools, and digital footprint cleanup. Your business operates under a completely separate legal structure with no connection to your name.",
  },
  {
    q: "Do I need technical skills to build a micro-SaaS?",
    a: "No. The Idea Pipeline filters for builds that work with no-code tools and AI-assisted development. You don't need to write code. If you can manage a team and run a P&L, you have more than enough skill to build and launch a micro-SaaS. The system handles the technical scaffolding.",
  },
  {
    q: "What if I don't have a business idea yet?",
    a: "That's exactly what the Idea Pipeline is for. It has 500+ validated micro-SaaS ideas organized by industry, time investment, and revenue tier. Most founding members find 3-5 ideas worth exploring in their first session.",
  },
  {
    q: "What if my company IPOs and I get my equity payout?",
    a: "Great. Then you'll have two income streams instead of one. Nothing about Invisible Exit requires you to quit. It's insurance, not an ultimatum. If the IPO happens and it's life-changing money, you celebrate. If it doesn't, or the payout disappoints, you already have a backup generating revenue.",
  },
  {
    q: "How long until I actually make money?",
    a: "Most members validate their first idea within 30 days. First revenue varies: some hit it in 60 days, some in 6 months. It depends on the idea you pick and how you use your 5 hours per week. This is not a 'get rich quick' pitch. It's a system for building real recurring revenue alongside your career.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no commitments. Cancel from your dashboard in one click. Plus there's a 30-day money-back guarantee.",
  },
];

const Index = () => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // ── A/B TEST: Hero headline (Dotcom Secrets Ch 3b) ──
  // Variant A: "How to Build a $4,000/Month Side Business..." (benefit-focused)
  // Variant B: "The Cage Has a Door. Here's the Key." (curiosity/pattern-interrupt)
  const heroVariant = useABTest("hero_headline_v1", ["benefit", "curiosity"], [50, 50]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "starter") {
      window.history.replaceState({}, "", window.location.pathname);
      handleCheckout();
    }
  }, []);

  const handleCheckout = async () => {
    trackEvent("homepage_cta_clicked", { source: "landing_page" });
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        { body: { tier: "starter" } }
      );
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      toast.error("Could not start checkout. Please try again.");
      console.error(err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Invisible Exit | Build a Side Business While Employed"
        description="5 AI-powered tools that help corporate managers build anonymous micro-SaaS businesses. Calculate your freedom number, validate ideas, stay invisible. From $0.97/mo."
        url="/"
      />
      <Navbar />

      <main>
      {/* ── 1. Hero ── */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24 section">
        <div className="container-narrow text-center">
          {/* EXPERT SECRETS Ch 1: Polarizing Leader — "If this offends you, leave" */}
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs text-red-300 font-semibold uppercase tracking-wider">
              ⚠️ WARNING: If This Offends You, This Isn't for You.
            </span>
          </div>

          <p className="text-eyebrow text-primary-light mb-6 animate-fade-in" style={{ animationDelay: "50ms" }}>
            For Corporate Managers Who Want Out
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] animate-fade-up">
            {heroVariant === "benefit" ? (
              <>
                How to Build a{" "}
                <span className="text-gradient-light">$4,000/Month Side Business</span>{" "}
                Without Quitting Your Job, Without Writing Code, and Without Your Employer Finding Out
              </>
            ) : (
              <>
                The Cage Has a{" "}
                <span className="text-gradient-light">Door.</span>{" "}
                Here's the Key Nobody Told You About.
              </>
            )}
          </h1>

          {/* DOTCOM SECRETS Ch 2: Category Creation — right below the headline */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4 animate-fade-up" style={{ animationDelay: "50ms" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary-light font-medium">
              Not a course · Not a community · The world's first anonymity-native business system
            </span>
          </div>

          <p className="text-body-lg text-white/70 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "100ms" }}>
            {heroVariant === "benefit"
              ? `5 AI-powered tools that take you from "trapped in the golden handcuffs" to real recurring revenue — in 12 months, working 5 hours a week.`
              : `Most corporate managers will spend 15 years climbing a ladder that leads to someone else's exit. I found a different door. I'll show you the key.`}
          </p>

          {/* CTA — ONE THING: Calculate Freedom Number → squeeze page */}
          <div className="flex flex-col items-center gap-4 mb-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Link
              to="/freedom"
              onClick={() => {
                trackEvent("homepage_hero_cta_clicked", { target: "freedom_calculator" });
                trackABConversion("hero_headline_v1", "hero_cta_clicked", { variant: heroVariant });
              }}
              className="btn-primary w-full sm:w-auto text-lg px-8 inline-flex items-center justify-center gap-2"
            >
              Calculate Your Freedom Number (Free)
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-white/40 mt-1">
              Free calculator. Takes 90 seconds. No credit card.
            </p>
          </div>

          {/* EXPERT SECRETS Ch 15: Rallying Cry + Ch 14: Reluctant Hero (below CTA) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 animate-fade-up" style={{ animationDelay: "250ms" }}>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="text-primary text-sm font-bold">\"</span>
              <span className="text-white/50 text-xs italic">
                I didn't want to build this. I wanted to build in peace. But I had to leave the key.
              </span>
              <span className="text-primary text-sm font-bold">\"</span>
              <span className="text-white/30 text-[10px]">— Adrian</span>
            </div>
          </div>

          {/* EXPERT SECRETS Ch 16: Cost of Delay — live counter */}
          <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6 animate-fade-up" style={{ animationDelay: "280ms" }}>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-amber-200 text-xs font-medium">
              Every month you wait costs you ~$4,000 in unrealized MRR. That's <strong className="text-amber-100">$48,000/year of delay</strong>.
            </span>
          </div>

          {/* EXPERT SECRETS Ch 17: 3-Step Action Path */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white/50 max-w-2xl mx-auto mb-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">1</span>
              Calculate your Freedom Number (90s)
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">2</span>
              Validate one micro-SaaS idea (48h)
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">3</span>
              Build invisible revenue (5h/week)
            </span>
          </div>

          {/* Value bullets */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/50 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "300ms" }}>
            {[
              "Freedom number calculator",
              "500+ validated micro-SaaS ideas",
              "Stealth ops & compliance audit",
              "Launch automation",
              "Faceless brand builder",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-success" />
                {item}
              </span>
            ))}
          </div>

          {/* Social proof — real-time count */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-white/40 animate-fade-up" style={{ animationDelay: "350ms" }}>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              127 building now
            </span>
            <span>·</span>
            <span>★★★★★ 4.8/5</span>
            <span>·</span>
            <span>73 founding spots left</span>
            <span>·</span>
            <span className="text-primary-light font-semibold">\"We don't wait for exits. We build our own.\"</span>
          </div>
        </div>
      </section>

      {/* ── 1b. Social Proof Bar ── */}
      <section className="bg-primary py-3 sm:py-4 border-b border-primary-dark">
        <div className="container-standard">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center">
            <span className="flex items-center gap-2 text-white/90 text-xs sm:text-sm font-medium">
              <span className="flex -space-x-2">
                {["bg-blue-400", "bg-green-400", "bg-purple-400", "bg-orange-400"].map((c, i) => (
                  <span key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-primary flex items-center justify-center text-[10px] font-bold text-white`}>
                    {["S", "M", "J", "A"][i]}
                  </span>
                ))}
              </span>
              127 managers building now
            </span>
            <span className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm">
              <span className="text-amber-300">★★★★★</span>
              <span className="font-medium">4.8/5 rating</span>
            </span>
            <span className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-medium">73 founding spots left</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── 1c. Death of the Old Vehicle ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <p className="text-eyebrow text-muted-foreground mb-4 text-center">The Funeral</p>
          <h2 className="text-h2 text-foreground mb-8 text-center">
            Let's kill the dream of equity freedom.
          </h2>
          <div className="max-w-2xl mx-auto text-body text-muted-foreground space-y-5">
            <p>
              You have <strong className="text-foreground">0.5% equity</strong>. Your company
              is 18 months from IPO. You've been telling yourself the same story I told myself:
              when we go public, this changes everything.
            </p>
            <p>
              Here's the math.
            </p>
            <div className="bg-white rounded-xl p-6 border border-border my-6 font-mono text-sm">
              <p className="text-muted-foreground">$1B exit (best case)</p>
              <p className="text-muted-foreground">× 0.5% equity = <span className="text-foreground">$5,000,000</span></p>
              <p className="text-muted-foreground">− dilution (~20%) = $4,000,000</p>
              <p className="text-muted-foreground">− taxes (~40%) = <span className="text-foreground">$2,400,000</span></p>
              <p className="text-muted-foreground">invested at 5% = <span className="text-foreground font-bold">$120,000/year</span></p>
              <p className="text-muted-foreground">your current salary: <span className="text-foreground">$120,000/year</span></p>
            </div>
            <p>
              <strong className="text-primary">Even a billion-dollar exit doesn't buy your freedom.</strong>
              It buys you a longer leash. The same leash, with more steps.
            </p>
            <p>
              The old vehicle — salary, equity, promotion ladder — was never designed to
              take you to freedom. It was designed to keep you productive for someone else's
              exit. The faster we bury that dream, the faster we build something real.
            </p>
            <p className="text-foreground font-medium text-lg pt-4">
              The new vehicle is simpler: $4,000/month in recurring revenue from products
              you own. Not equity in someone else's company. Revenue from your own.
            </p>
          </div>
        </div>
      </section>

      {/* ── 1a. Who-What-Why-How Positioning (Dotcom Secrets Ch 9) ── */}
      <section className="bg-white section-normal border-t border-border">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">The Positioning</p>
          <div className="max-w-3xl mx-auto space-y-1 text-left sm:text-center">
            <p className="text-body text-muted-foreground">
              <strong className="text-foreground">WHO</strong> this is for: Corporate managers earning $120K–$200K who feel trapped by golden handcuffs but can't (or won't) quit.
            </p>
            <p className="text-body text-muted-foreground">
              <strong className="text-foreground">WHAT</strong> it is: 5 AI-powered tools that help you build anonymous micro-SaaS revenue while employed — in 5 hours per week.
            </p>
            <p className="text-body text-muted-foreground">
              <strong className="text-foreground">WHY</strong> it works: Because your salary isn't your worth — it's one income stream. The system, not the idea, produces $4,000/month MRR in 12–18 months.
            </p>
            <p className="text-body text-muted-foreground">
              <strong className="text-foreground">HOW</strong>: Calculate your Freedom Number → validate an idea in 48 hours → build under a separate entity → ship in 5 focused hours/week → track MRR until it replaces your salary.
            </p>
          </div>
        </div>
      </section>

      {/* ── 1b. The 3 Secrets (Russell's framework) ── */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The Framework</p>
            <h2 className="text-h1 text-foreground mb-4">The 3 Frameworks Nobody Teaches Corporate Managers</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              These aren't tips or motivation. Each is a proprietary framework
              with a name, a process, and a specific output. They took me 14
              months of failure to discover.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "1",
                framework: "The Salary-Runway Method",
                title: "Your Job Is the Perfect Launchpad",
                story: "I almost quit. Resignation letter drafted. Then I did the math: my salary funds my build without dilution. Full-time founders raise $500K and give up 20%. I give up nothing. My P&L skills? Solo founders don't have them. My 5 hours/week constraint? It forces focus that 60-hour founders can't replicate.",
                epiphany: "The vehicle isn't a startup. The vehicle is YOUR JOB.",
                steps: ["Calculate your effective hourly rate", "Identify 5 hours of weekly dead time", "Map corporate skills → founder skills"],
              },
              {
                num: "2",
                framework: "The Triple-Separation Protocol",
                title: "Anonymity Is Your Greatest Asset",
                story: "Week 3. Team call. Colleague says: 'This website looks like something we'd build.' My blood ran cold for 3 seconds. Then I remembered: different name, different entity, different Stripe, different hosting. Zero connection. Those 3 seconds of panic were the best $25/month I ever spent.",
                epiphany: "Anonymity isn't hiding. It's freedom to fail without consequences.",
                steps: ["Separate the legal entity (Wyoming LLC)", "Separate the digital footprint (hosting, Stripe, domain)", "Separate the identity (no name, no LinkedIn, no cross-link)"],
              },
              {
                num: "3",
                framework: "The Cartridge System",
                title: "The System Beats the Idea",
                story: "I spent 3 months choosing the 'right' idea. Spreadsheets. Market sizing. Analysis paralysis. Then I launched the wrong one. It made $9/month. So I pivoted. Second product: $47/month. Third: $850. Fourth: $4,100. The system didn't care which idea I picked.",
                epiphany: "Build the system first. Swap ideas like cartridges.",
                steps: ["Build the 5-tool pipeline first", "Launch the 'wrong' idea to test the system", "Pivot ideas without rebuilding infrastructure"],
              },
            ].map((secret) => (
              <div key={secret.num} className="card-base p-6 sm:p-8 card-hover">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold text-lg mb-4">
                  {secret.num}
                </span>
                <p className="text-xs uppercase tracking-wide text-primary font-bold mb-1">
                  Framework: {secret.framework}
                </p>
                <h3 className="text-h3 text-foreground mb-3">{secret.title}</h3>
                <p className="text-caption text-muted-foreground italic mb-3 leading-relaxed border-l-2 border-primary/30 pl-4">
                  "{secret.story}"
                </p>
                <div className="bg-surface rounded-lg p-3 mb-3 space-y-1.5">
                  {secret.steps.map((step, si) => (
                    <div key={si} className="flex items-start gap-2">
                      <span className="text-primary text-xs font-bold mt-0.5">{si + 1}.</span>
                      <span className="text-xs text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm font-semibold text-primary">{secret.epiphany}</p>
              </div>
            ))}
          </div>

          {/* Manifesto link */}
          <div className="text-center mt-12">
            <Link
              to="/manifesto"
              onClick={() => trackEvent("homepage_manifesto_clicked")}
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold text-sm transition-colors"
            >
              Read the full manifesto — the 6 principles of the Invisible Builder
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Case studies / Proof stories */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                secret: "Vehicle",
                story: "Sarah K., Finance Director",
                before: "Spent 6 months researching startup ideas. Analysis paralysis. Had the skills but no system.",
                action: "Used salary as runway. Picked a boring fintech tool for SMBs. Validated in 2 weeks. Launched in 6.",
                result: "$3,200 MRR in 8 months",
                quote: "My corporate skills gave me an unfair advantage that full-time founders don't have.",
              },
              {
                secret: "Stealth",
                story: "Marcus T., Product Manager",
                before: "Worried his employer would discover his side project. Nearly didn't start.",
                action: "Set up separate LLC, anonymous domain, different Stripe account. Colleague found a similar site on a team call. Zero connection traced.",
                result: "Zero detection in 14 months",
                quote: "Those 3 seconds of panic were the best $25/month I've ever spent.",
              },
              {
                secret: "System",
                story: "Jennifer L., Operations Manager",
                before: "Obsessed over finding the 'perfect' idea for 5 months. Built nothing.",
                action: "Stopped choosing ideas. Started working the system. Pivoted twice using the Idea Pipeline. Third product was a PDF generator for logistics companies.",
                result: "$2,300 MRR with 5 hrs/week",
                quote: "I stopped obsessing over the perfect idea and started working the system.",
              },
            ].map((cs) => (
              <div key={cs.secret} className="card-base p-5 border-l-4 border-primary/40">
                <p className="text-eyebrow text-primary text-xs mb-2">{cs.secret}</p>
                <p className="text-sm font-semibold text-foreground mb-3">{cs.story}</p>
                <p className="text-xs text-muted-foreground mb-2"><span className="font-semibold text-foreground">Before:</span> {cs.before}</p>
                <p className="text-xs text-muted-foreground mb-3"><span className="font-semibold text-foreground">After:</span> {cs.action}</p>
                <p className="text-caption text-sm italic mb-3">"{cs.quote}"</p>
                <p className="text-success text-sm font-bold">{cs.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Category / New Opportunity (Expert Secrets Ch 3) ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <div className="text-center mb-10">
            <p className="text-eyebrow text-primary mb-4">A New Category — Not a Better Tool</p>
            <h2 className="text-h1 text-foreground mb-4">
              What Is <span className="text-gradient">The Invisible Exit System?</span>
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              This isn't a course. It's not a community. It's not a SaaS tool.
              It's a new category — the world's first anonymity-native framework
              for building recurring revenue while employed.
            </p>
          </div>

          {/* Old vs New Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Old */}
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-6">
              <p className="text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wide mb-4">
                The Old Opportunity
              </p>
              <h3 className="font-bold text-foreground mb-3 text-sm">"Side Hustle" Courses</h3>
              <div className="space-y-2">
                {[
                  "Teach you to improve — build a better side business",
                  "Require you to build publicly (personal brand, LinkedIn)",
                  "Compete with 10,000 other courses teaching the same thing",
                  "Put you in competition with your employer's market",
                  "Assume you'll quit your job to succeed",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-red-400 text-xs shrink-0 mt-0.5">✗</span>
                    <p className="text-red-700/70 dark:text-red-300/70 text-xs">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* New */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl p-6">
              <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wide mb-4">
                The New Opportunity
              </p>
              <h3 className="font-bold text-foreground mb-3 text-sm">The Invisible Exit System</h3>
              <div className="space-y-2">
                {[
                  "Teaches you to build invisible — your employer never knows",
                  "Operates under a pseudonym with separate entities",
                  "Uses proprietary frameworks no one else teaches",
                  "Builds in markets unrelated to your employer",
                  "Uses your job as runway — no quitting required",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 text-xs shrink-0 mt-0.5">✓</span>
                    <p className="text-emerald-700 dark:text-emerald-300 text-xs font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category statement */}
          <div className="text-center mt-8 max-w-2xl mx-auto">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <p className="text-sm text-foreground font-medium leading-relaxed">
                The 5 tools are the <strong className="text-primary">implementation</strong> of 3 proprietary frameworks:{" "}
                <Link to="/frameworks" className="text-primary hover:text-primary-hover underline">The Salary-Runway Method</Link>,{" "}
                <Link to="/frameworks" className="text-primary hover:text-primary-hover underline">The Triple-Separation Protocol</Link>, and{" "}
                <Link to="/frameworks" className="text-primary hover:text-primary-hover underline">The Cartridge System</Link>.
                You're not buying tools. You're buying a new vehicle.
              </p>
            </div>
            <Link
              to="/frameworks"
              onClick={() => trackEvent("homepage_frameworks_link_clicked")}
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold text-sm transition-colors mt-4"
            >
              Learn the 3 frameworks →
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-white section-wide">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-12 text-center">What I Believe</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left: Belief statements */}
            <div className="space-y-6 text-muted-foreground text-body animate-fade-up">
              <p>
                Corporate loyalty is a transaction, not a virtue. Companies design
                equity structures to keep you, not to reward you. Less than 0.5%
                is a leash disguised as a partnership.
              </p>
              <p>
                The acquisition payout is a lottery ticket. You can't build your
                life on someone else's exit timeline.
              </p>
              <p>
                Your 15 years of corporate operations experience isn't a weakness.
                It's founder gold. You understand customers, systems, and execution
                better than anyone with just a pitch deck.
              </p>
              <p>
                You don't need to quit your job to start. You don't need a
                co-founder. You don't need venture capital. You need 5 hours a
                week and a system that works within your constraints.
              </p>
            </div>

            {/* Right: "After" vision card */}
            <div className="card-base bg-surface p-6 sm:p-8 lg:p-10 card-hover animate-fade-up" style={{ animationDelay: "150ms" }}>
              <h3 className="text-h3 text-foreground mb-4">12 Months From Now</h3>

              {/* Reader-insert: "Imagine This" (Expert Secrets Ch 4) */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                <p className="text-eyebrow text-primary text-xs mb-2">Imagine This</p>
                <p className="text-sm text-foreground/80 italic leading-relaxed">
                  It's a Saturday morning. Your phone buzzes. You pick it up —
                  not to check Slack, but to check Stripe. <strong className="text-primary not-italic">$127 overnight.</strong>{" "}
                  From 4 customers you've never met, in a country you've never
                  visited, for a product you built in your lunch breaks. Your
                  spouse brings you coffee. She knows. Your employer doesn't.
                </p>
              </div>

              <p className="text-body text-muted-foreground leading-relaxed">
                You wake up, check your phone. Not Slack notifications. Stripe
                dashboard: $3,200 MRR across 3 micro-SaaS tools. You go to work
                the same as always, but something is different. You resolve
                conflicts faster because you care less. You're already detached
                from the corporate game. On weekends, you spend 5 hours refining
                your tools. Your wife knows. Your employer doesn't. The golden
                handcuffs are still on your wrists, but you've found the key.
              </p>
            </div>
          </div>

          {/* Bottom bold statement */}
          <p className="text-h2 text-foreground text-center mt-16 max-w-4xl mx-auto leading-tight">
            The cage has a door.<br />
            <span className="text-gradient">Most people never look for it.</span>
          </p>
        </div>
      </section>

      {/* ── Uncomfortable Truths (Expert Secrets Ch 1 — Polarizing Leader) ── */}
      <section className="bg-red-50 dark:bg-red-950/10 section-normal border-y border-red-200 dark:border-red-900/20">
        <div className="container-narrow">
          <div className="text-center mb-10">
            <p className="text-eyebrow text-red-600 dark:text-red-400 mb-4">Uncomfortable Truths</p>
            <h2 className="text-h1 text-foreground mb-4">
              If This Offends You, This Isn't for You.
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              I'm going to say some things that will make 30% of you close this
              page. Good. The remaining 70% are my people. Let's find out which
              group you're in.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {[
              {
                truth: "Your 0.5% equity is worthless.",
                detail: "After dilution, taxes, and a 5-year lockup, your 'life-changing' equity buys you a longer leash, not a way out. I ran the math. So should you.",
              },
              {
                truth: "Your employer doesn't care about you.",
                detail: "Not maliciously. They can't. A company is a legal entity optimized for shareholder value. You are a line item. Loyalty to a line item is a category error.",
              },
              {
                truth: "'Someday' is the most expensive word you own.",
                detail: "Every month you wait is another month of unrealized MRR. At $4,000/month, one year of 'someday' costs you $48,000. That's real money you'll never get back.",
              },
              {
                truth: "Your personal brand is a liability.",
                detail: "Building publicly means your employer can see everything. Your competitors can copy everything. Your failures are permanent. Anonymity isn't hiding — it's strategy.",
              },
              {
                truth: "You don't need more motivation. You need math.",
                detail: "Motiation fades by Thursday. Math is forever. Your freedom number — the exact monthly revenue that replaces your salary — is the only number that matters. Everything else is noise.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-surface border border-red-200 dark:border-red-900/30 rounded-xl p-5 flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold text-sm shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-foreground text-sm mb-1">{item.truth}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground italic">
              If you're still reading, you're in the 70%. Welcome.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2b. The Conflict (failure story) ── */}
      <section className="bg-white section-normal border-t border-border">
        <div className="container-narrow">
          {/* Epiphany Bridge: The Desire (Expert Secrets Ch 5-6) */}
          <p className="text-eyebrow text-muted-foreground mb-4">The Desire</p>
          <h2 className="text-h2 text-foreground mb-6">I Didn't Want Escape. I Wanted Optionality.</h2>
          <div className="text-body text-muted-foreground space-y-5">
            <p>
              People assume I wanted to quit. I didn't. I loved parts of my job — the team, the
              strategy, the wins. What I wanted was something simpler and more dangerous:
              <strong className="text-foreground"> optionality.</strong> The ability to stay
              because I chose to, not because I had to. The freedom to disagree in a meeting
              without calculating the financial consequences. I wanted to build something that
              was <em>mine</em> — not a line item in someone else's cap table.
            </p>
            <p>
              For 8 years, I told myself the IPO was coming. That my 0.5% would become real.
              The golden handcuffs felt like a partnership. I wasn't unhappy. I was
              <strong className="text-foreground"> comfortably trapped</strong> — and that's the
              most dangerous kind of trapped, because nothing forces you to move.
            </p>
          </div>

          <div className="my-12" />

          <p className="text-eyebrow text-muted-foreground mb-4">The Conflict</p>
          <h2 className="text-h2 text-foreground mb-6">Month 4: The Wall</h2>
          <div className="text-body text-muted-foreground space-y-5">
            <p>
              I'd been building for 4 months. One product live. <strong className="text-foreground">Zero customers.</strong> My
              5 hours a week felt pointless. I was seriously considering shutting it down and
              accepting the golden handcuffs.
            </p>
            <p>
              Then I spent <strong className="text-foreground">three weekends</strong> researching LLC
              formations — Wyoming vs. Delaware vs. Estonia — instead of building. That was roughly
              <strong className="text-foreground"> $2,400 in lost building time</strong> (at my hourly rate)
              gone to Googling things I could have had answered in minutes.
            </p>
            <p>
              The launch took 6 weeks. It should have taken 10 days. By the time I shipped, a
              competitor had launched something similar. I almost quit.
            </p>
            <p>
              <strong className="text-primary">That's why Invisible Exit exists.</strong> Not to sell you
              motivation. To hand you the exact system that would have saved me 4 months of
              frustration, $2,400 in wasted time, and a near-miss with a competitor.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2c. The 3 False Beliefs (Russell's Epiphany Bridge Framework) ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The 3 Lies You've Been Told</p>
            <h2 className="text-h1 text-foreground mb-4">
              3 Beliefs Keeping You Trapped
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Russell Brunson teaches that every person has 3 false beliefs before they buy.
              Let me break each one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vehicle Belief */}
            <div className="card-base p-6 sm:p-8 border-l-4 border-red-400/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  Lie #1: The Vehicle
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                "I need to quit my job to build something real."
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                <strong className="text-foreground">The truth:</strong> Your job IS the vehicle.
                Your salary is non-dilutive runway. Your corporate skills are exactly what solo
                founders lack. Your 5-hour constraint forces a focus that 60-hour founders can't replicate.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                <p className="text-xs text-red-700">
                  <strong>False belief:</strong> "Employment and entrepreneurship are mutually exclusive."
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-700">
                  <strong>New belief:</strong> "My job funds my build. I don't quit until the MRR replaces my salary."
                </p>
              </div>
            </div>

            {/* Internal Belief */}
            <div className="card-base p-6 sm:p-8 border-l-4 border-amber-400/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-amber-100 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  Lie #2: Internal
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                "I don't have the skills to build a product."
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                <strong className="text-foreground">The truth:</strong> You manage teams, run P&Ls,
                execute roadmaps, navigate stakeholders. Those ARE founder skills. The technical
                part is the smallest piece — AI and no-code handle that. Your unfair advantage is
                operational excellence, not code.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                <p className="text-xs text-amber-700">
                  <strong>False belief:</strong> "I'm not technical enough to build software."
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-700">
                  <strong>New belief:</strong> "My 15 years of management is the skill. Code is a commodity now."
                </p>
              </div>
            </div>

            {/* External Belief */}
            <div className="card-base p-6 sm:p-8 border-l-4 border-blue-400/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  Lie #3: External
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                "If I build something, my employer will find out."
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                <strong className="text-foreground">The truth:</strong> With proper entity
                separation — different name, different LLC, different Stripe, different hosting —
                the connection is mathematically zero. I built for 14 months with zero detection.
                A colleague even found a similar site on a call. Nothing traced back.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <p className="text-xs text-blue-700">
                  <strong>False belief:</strong> "Anything I build online is traceable to me."
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-700">
                  <strong>New belief:</strong> "With the Stealth Ops system, my employer cannot find out."
                </p>
              </div>
            </div>
          </div>

          {/* The Epiphany */}
          <div className="text-center mt-12 max-w-2xl mx-auto">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
              <p className="text-eyebrow text-primary mb-3">The Epiphany</p>
              <p className="text-h3 text-foreground font-bold leading-tight">
                When all 3 beliefs shift, you don't need motivation.
                <br />
                You just need a system.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                That's what the 5 tools are. Not courses. Not motivation. A system that works
                within the constraints you already have.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Start Here Reading Path ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <div className="max-w-3xl mb-10">
            <p className="text-eyebrow text-primary mb-4">Not Ready to Buy?</p>
            <h2 className="text-h1 text-foreground mb-4">Read these 3 guides first.</h2>
            <p className="text-body text-muted-foreground">
              If the pitch resonates but you need more proof, start with the
              roadmap, the stealth guide, and the no-ads customer guide.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                slug: "the-invisible-exit-roadmap-what-to-do-in-your-first-90-days",
                category: "Exit Planning",
                title: "The Invisible Exit Roadmap",
                excerpt: "The first 90 days matter because they create direction, not just motion.",
              },
              {
                slug: "invisible-business-model",
                category: "Stealth Operations",
                title: "The Invisible Business Model",
                excerpt: "How to build revenue your employer cannot easily see.",
              },
              {
                slug: "how-corporate-managers-can-get-their-first-paying-customers-without-ads",
                category: "Growth",
                title: "First Paying Customers Without Ads",
                excerpt: "How to get early customers through clarity, trust, and direct conversations.",
              },
            ].map((guide) => (
              <Link
                key={guide.slug}
                to={`/blog/${guide.slug}`}
                onClick={() =>
                  trackEvent("homepage_blog_clicked", {
                    source: "homepage_start_here_section",
                    slug: guide.slug,
                  })
                }
                className="card-base p-6 card-hover group"
              >
                <span className="text-eyebrow text-primary mb-3 block">
                  {guide.category}
                </span>
                <h3 className="text-h3 text-foreground mb-3 group-hover:text-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-caption">{guide.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. The 5 Tools ── */}
      <section className="hero-dark section-wide">
        <div className="container-standard">
          <p className="text-eyebrow text-primary-light mb-4 text-center">The System</p>
          <h2 className="text-h1 text-white mb-2 text-center">5 Tools. Each Solves a Specific Problem.</h2>
          <p className="text-body text-white/60 mb-12 text-center max-w-2xl mx-auto">
            From "trapped" to "free." All 5 included at $0.97/month.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool, i) => (
              <div
                key={tool.name}
                className="card-glass p-6 sm:p-8 transition-all hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${i * 75}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <tool.icon className="w-6 h-6 text-primary-light" />
                </div>
                <h3 className="text-h3 text-white mb-1">{tool.name}</h3>
                <p className="text-white/70 mb-3 font-medium">{tool.outcome}</p>
                <p className="text-sm text-white/50 leading-relaxed">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4b. The Framework (Expert Secrets Ch 10) ── */}
      <section className="bg-white section-normal border-t border-border">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The System</p>
            <h2 className="text-h1 text-foreground mb-4">5 Steps. From Trapped to Building.</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Each step answers one question and produces one output. No theory.
              No motivation. Just a system that works within your constraints.
            </p>
          </div>
          <FrameworkDiagram />
        </div>
      </section>

      {/* ── 4c. Movement Tracker (Expert Secrets Ch 2) ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">The Movement</p>
          <h2 className="text-h1 text-foreground mb-4">
            Our Mission: 1,000 Managers Building Invisible Freedom
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto mb-10">
            We're building a movement of 1,000 corporate managers who stopped
            waiting for an IPO and started building real recurring revenue.
            Here's where we are.
          </p>

          {/* Big progress bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-end justify-between mb-3">
              <div className="text-left">
                <p className="text-3xl font-bold text-primary">127</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">builders</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-muted-foreground">1,000</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">goal</p>
              </div>
            </div>
            <div className="h-4 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-primary-light to-success rounded-full"
                style={{ width: "12.7%" }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>12.7% of the way there</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                4 joined this week
              </span>
            </div>
          </div>

          <Link
            to="/founding-wall"
            onClick={() => trackEvent("homepage_movement_tracker_clicked")}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold text-sm transition-colors"
          >
            See who's already building →
          </Link>
        </div>
      </section>

      {/* ── 5. Testimonials (Structured Social Proof System) ── */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <TestimonialGrid
            title="Built by Managers. Used by Managers."
            subtitle="Real results from corporate managers using the Invisible Exit system. Results, transformations, objection-crushers, and specific details."
          />
        </div>
      </section>

      {/* ── 6. Value Stack + Bonuses ── */}
      <section className="bg-surface section-normal">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">The Full Stack</p>
          <h2 className="text-h1 text-foreground mb-2">What You Get for $0.97/Month</h2>
          <p className="text-body text-muted-foreground mb-8">
            5 tools + 3 bonuses. Total value $328/month. Your price: less than a coffee.
          </p>

          {/* Guarantee Badge */}
          <div className="inline-flex items-center gap-3 bg-success/10 border border-success/20 rounded-full px-6 py-3 mb-8">
            <Shield className="w-5 h-5 text-success" />
            <span className="text-sm font-semibold text-success">
              30-Day Money-Back Guarantee. Zero Risk.
            </span>
          </div>
        </div>

        <div className="container-narrow space-y-3">
          {/* Core Tools */}
          <p className="text-eyebrow text-muted-foreground mb-2 animate-fade-up">Core Tools (5)</p>
          {TOOLS.map((tool, i) => (
            <div
              key={tool.name}
              className="flex items-center justify-between py-3.5 border-b border-border animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <span className="text-foreground font-medium">{tool.name}</span>
              </div>
              <span className="text-muted-foreground text-sm">{tool.value}</span>
            </div>
          ))}

          {/* Bonuses */}
          <p className="text-eyebrow text-primary mt-6 mb-2">🎁 Fast-Action Bonuses (3) — Included when you start today</p>
          {[
            { name: "The Employment Contract Audit Checklist", value: "$27" },
            { name: "25 Done-For-You Micro-SaaS Idea Swipes", value: "$47" },
            { name: "The Faceless Founder Content Calendar", value: "$27" },
          ].map((bonus) => (
            <div
              key={bonus.name}
              className="flex items-center justify-between py-3.5 border-b border-border"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 text-primary text-xs">
                  🎁
                </span>
                <span className="text-foreground font-medium">{bonus.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground/50 text-xs line-through">{bonus.value}</span>
                <span className="text-success text-sm font-semibold">FREE</span>
              </div>
            </div>
          ))}

          {/* Total with dramatic "All this for" moment */}
          <div className="pt-6 mt-4 border-t-2 border-border">
            <p className="text-center text-h2 text-foreground font-bold mb-6 mt-2">
              So... how much for all of this?
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Total value:</span>
              <span className="text-muted-foreground line-through">$328/month</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Founding member discount:</span>
              <span className="text-success font-semibold">−99.7%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground font-semibold text-lg">Your price:</span>
              <span className="text-4xl sm:text-5xl font-bold text-primary">$0.97<span className="text-lg font-normal text-muted-foreground">/mo</span></span>
            </div>
            <p className="text-caption text-center mt-4">
              That's $3,924/year in value for $11.64/year. 99.7% off. For founding members who start now.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6b. The Path Forward (Ch 2: Continuity/Frequency) ── */}
      <section className="bg-white section-normal border-t border-border">
        <div className="container-standard">
          <div className="text-center mb-10">
            <p className="text-eyebrow text-primary mb-4">The Path Forward</p>
            <h2 className="text-h1 text-foreground mb-4">From $0.97 to Freedom</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              This isn't a one-time purchase. It's a progression. Each step builds on the last.
              You're not buying tools — you're buying a path.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {[
              {
                step: "Step 1",
                title: "Calculate your freedom number (Free)",
                desc: "Know exactly how much recurring revenue you need to replace your salary.",
                price: "$0",
                cta: "/freedom",
                ctaText: "Calculate Free →",
              },
              {
                step: "Step 2",
                title: "Get the Stealth Ops Blueprint ($7)",
                desc: "The 47-point checklist that keeps your employer from finding out. One-time.",
                price: "$7",
                cta: "/tripwire",
                ctaText: "Get the Blueprint →",
              },
              {
                step: "Step 3",
                title: "Start the 5-tool system ($0.97/mo)",
                desc: "All 5 tools. Freedom number, idea pipeline, stealth ops, launch, brand.",
                price: "$0.97/mo",
                cta: "/freedom",
                ctaText: "Start for $0.97/mo →",
              },
              {
                step: "Step 4",
                title: "Build your product live ($97 workshop)",
                desc: "2-day weekend workshop. Build + launch your first product with Adrian.",
                price: "$97",
                cta: "/weekend-workshop",
                ctaText: "Join the Workshop →",
              },
              {
                step: "Step 5",
                title: "Scale with 1-on-1 coaching ($2K intensive)",
                desc: "90 days. Private coaching. Adrian becomes your co-founder.",
                price: "$2,000",
                cta: "/intensive",
                ctaText: "Apply for Intensive →",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-4 border-b border-border last:border-0 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {i + 1}
                  </div>
                  {i < 4 && <div className="w-px h-8 bg-border mt-1" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.step}</p>
                  <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-primary">{item.price}</p>
                  <Link
                    to={item.cta}
                    className="text-xs text-primary hover:text-primary-hover font-medium"
                  >
                    {item.ctaText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Mid-Page CTA → Story (not checkout) ── */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-4">Want the full story first?</h2>
          <p className="text-body text-white/50 mb-10">
            Read how I went from trapped to $4,100 MRR in 12 months. 10 chapters. 15 minutes.
          </p>
          <Link
            to="/story"
            onClick={() => trackEvent("homepage_mid_cta_clicked", { target: "story_page" })}
            className="btn-primary text-lg px-8 inline-flex items-center gap-2"
          >
            Read My Full Story
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── 8. Story ── */}
      <section className="bg-white section-wide">
        <div className="container-narrow">
          <p className="text-eyebrow text-muted-foreground mb-8">The Backstory</p>
          <div className="text-body text-muted-foreground space-y-6">
            <p>
              Amsterdam. 6 AM. Raining. I had just landed on a KLM flight with my
              wife and 8-year-old for a family vacation. My phone buzzed in the
              taxi. Two notifications sat side by side.
            </p>
            <p>
              The first: corporate escalation emails. People at my company
              fighting over responsibilities. Again. At 6 AM. On the first morning
              of my vacation.
            </p>
            <p>
              The second: a Stripe notification. "$0.97 received." A complete
              stranger had paid for a landing page I built for plumbers in the
              USA. A business I know nothing about. In a country I don't live in.
              Under a name that isn't mine. While I slept on a plane.
            </p>
            <p>
              I screamed in the taxi. The driver thought I was insane. My wife
              understood: this wasn't about the money. This was proof that the
              cage has a door.
            </p>
            <p>
              I took everything I learned and built it into a system. 5 tools. One
              mission: help corporate managers build invisible recurring revenue.
            </p>
          </div>
        </div>
      </section>

      {/* ── 8b. "Who Else" Pattern + Ask Campaign CTA ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">Who Else?</p>
          <h2 className="text-h1 text-foreground mb-4">
            Who Else Wants to Join 127 Managers Already Building?
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto mb-8">
            Every one of them started with the same question you have right now.
            What's yours? Ask it — and I'll answer it personally.
          </p>
          <Link
            to="/ask"
            onClick={() => trackEvent("homepage_ask_cta_clicked")}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Ask Adrian Your #1 Question
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── 9. Social Proof ── */}
      <section className="bg-white pb-20 section">
        <div className="container-narrow">
          <p className="text-eyebrow text-muted-foreground mb-8 text-center">Who Is Adrian?</p>
          <div className="card-base bg-surface p-6 sm:p-8">
            <p className="text-body text-muted-foreground leading-relaxed text-center">
              A 37-year-old Managing Director at a European tech company. $120K
              salary. Less than 0.5% equity. 18-month IPO clock. Building
              invisible recurring revenue and documenting the process. Identity
              protected, because that's the whole point.
            </p>
          </div>
          <p className="text-muted-foreground italic text-center mt-6 text-caption">
            Built by a corporate manager, for corporate managers.
          </p>
        </div>
      </section>

      {/* ── 10. FAQ ── */}
      <section className="bg-white section-normal border-t border-border">
        <div className="container-narrow">
          <h2 className="text-h1 text-foreground mb-8">Questions Corporate Managers Ask</h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold text-foreground">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 10.5. Continuous Loop: Why Members Stay (Dotcom Secrets Ch 12) ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The Continuous Loop</p>
            <h2 className="text-h1 text-foreground mb-4">Why Members Stay Month After Month</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              A subscription is a promise. Russell Brunson's Chapter 12 teaches that the
              continuous loop — the thing that makes people stay — must compound value every
              month. Here's what keeps Invisible Exit members engaged long after the first week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                week: "Week 1",
                title: "Your Freedom Number",
                detail: "Calculate your exact exit number. The dashboard tracks your MRR progress toward it in real-time. Every dollar earned moves the needle.",
                retention: "The number becomes a daily obsession.",
              },
              {
                week: "Week 2-4",
                title: "Idea Pipeline Momentum",
                detail: "Validate 3 micro-SaaS ideas in 48 hours each. The AI scoring system ranks them by revenue potential, time investment, and stealth feasibility.",
                retention: "New validated ideas every month.",
              },
              {
                week: "Month 2-3",
                title: "Launch & First Revenue",
                detail: "Ship your first product using Launch Control. Track every customer in the FYM Dashboard. Watch your invisibility score improve as your MRR grows.",
                retention: "Real numbers on the dashboard = skin in the game.",
              },
              {
                week: "Month 3+",
                title: "Compound Growth",
                detail: "Monthly MRR audits identify churn risks. New tool releases every quarter. Community leaderboard shows your rank among anonymous builders.",
                retention: "The gap between you and the leaderboard shrinks every week.",
              },
            ].map((phase, i) => (
              <div
                key={i}
                className="card-base p-6 border-t-4 border-primary/30"
              >
                <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-2">{phase.week}</p>
                <h3 className="font-bold text-foreground text-sm mb-2">{phase.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{phase.detail}</p>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-2">
                  <p className="text-xs text-primary italic">{phase.retention}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              The loop compounds: more MRR → higher invisibility score → more confidence →
              more products → more MRR. The system feeds itself. That's why members who start
              at $0.97/month upgrade to Founding — the loop is worth more than any single tool.
            </p>
          </div>
        </div>
      </section>

      {/* ── 11. Final CTA — Continuous Loop + Multi-CTA ── */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          {/* Qualifier */}
          <p className="text-eyebrow text-primary-light mb-4">
            If you've read this far, you're in the 3%.
          </p>

          <h2 className="text-h1 text-white mb-4">The Cage Has a Door.</h2>
          <p className="text-body text-white/60 mb-2">
            The 97% would have left by now. The fact that you're still here means something.
          </p>
          <p className="text-body text-white/60 mb-10 max-w-xl mx-auto">
            You have two choices. Keep scrolling. Or find out how close you are to walking through it.
          </p>

          {/* Primary CTA */}
          <div className="mb-6">
            <Link
              to="/freedom"
              onClick={() => trackEvent("homepage_final_cta_clicked", { target: "freedom_calculator" })}
              className="btn-primary text-lg px-8 inline-flex items-center gap-2"
            >
              Calculate Your Freedom Number (Free)
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-white/40 mt-3">
              No credit card. No spam. 90 seconds. Just the number that changes how you see your salary.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 max-w-md mx-auto my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs uppercase tracking-wide">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Secondary CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Link
              to="/story"
              className="group rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 p-4 transition-all text-left"
            >
              <p className="text-white/80 font-semibold text-sm mb-1">Read My Story</p>
              <p className="text-white/40 text-xs">The full Amsterdam moment. 10 chapters.</p>
            </Link>
            <Link
              to="/masterclass"
              className="group rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 p-4 transition-all text-left"
            >
              <p className="text-white/80 font-semibold text-sm mb-1">Watch the Masterclass</p>
              <p className="text-white/40 text-xs">14 slides. 45 minutes. Zero fluff.</p>
            </Link>
            <Link
              to="/ask"
              className="group rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 p-4 transition-all text-left"
            >
              <p className="text-white/80 font-semibold text-sm mb-1">Ask Me Anything</p>
              <p className="text-white/40 text-xs">Your #1 question, answered personally.</p>
            </Link>
          </div>

          {/* Final urgency */}
          <div className="mt-12 inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <p className="text-white/50 text-xs">
              <strong className="text-white/70">73 of 100</strong> founding spots remaining ·{" "}
              <strong className="text-white/70">127</strong> managers building now
            </p>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
};

export default Index;
