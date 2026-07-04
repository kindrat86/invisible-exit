import { Link } from "react-router-dom";
import {
  User,
  Target,
  DollarSign,
  Briefcase,
  Clock,
  Heart,
  Brain,
  TrendingDown,
  Zap,
  AlertTriangle,
  Check,
  ArrowRight,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const DEMOGRAPHICS = [
  { icon: Briefcase, label: "Role", value: "Mid-senior manager, director, or VP" },
  { icon: DollarSign, label: "Income", value: "$90K–$180K/year salary" },
  { icon: TrendingDown, label: "Equity", value: "0.1%–0.5% (vesting over 4 years)" },
  { icon: Clock, label: "Age", value: "32–45 years old" },
  { icon: Users, label: "Family", value: "Married, 1–2 kids, mortgage" },
  { icon: Target, label: "Location", value: "Tier-1 cities, HCOL areas" },
];

const PSYCHOGRAPHICS = [
  {
    icon: Brain,
    title: "The Identity Trap",
    text: "Defines themselves by their job title and salary. 'I'm a Director of Engineering' IS their identity. Removing the title feels like death.",
  },
  {
    icon: AlertTriangle,
    title: "The Golden Handcuffs",
    text: "Earns enough to be comfortable but not enough to be free. The salary is a leash that feels like a reward. Every raise makes the trap tighter.",
  },
  {
    icon: Heart,
    title: "The Loyalty Wound",
    text: "Believes loyalty to the company will be reciprocated. The IPO will come. The equity will vest. The loyalty will be rewarded. It won't.",
  },
  {
    icon: Clock,
    title: "The Time Scarcity",
    text: "5–8 hours/week of genuine free time. Weekends are recovery, not building. Energy is the bottleneck, not money or knowledge.",
  },
];

const DEEP_DESIRES = [
  {
    desire: "Optionality",
    detail: "Not to quit — but to have the ABILITY to quit. The power to say no without fear.",
  },
  {
    desire: "Proof of Separation",
    detail: "Evidence that their worth exists outside the company. One Stripe notification changes everything.",
  },
  {
    desire: "Stealth",
    detail: "To build without their employer, colleagues, or professional network knowing. Anonymity = freedom.",
  },
  {
    desire: "Systems Over Hustle",
    detail: "A repeatable system that works in 5 hours/week, not a grind that demands 40.",
  },
  {
    desire: "Identity Beyond the Title",
    detail: "To stop being 'Director of X' and start being 'someone who builds things that make money while they sleep.'",
  },
];

const DEEP_FEARS = [
  { fear: "Discovery", detail: "Employer finds the side business. Career destroyed." },
  { fear: "Failure", detail: "Spends months building. Nobody buys. Proves they're 'just a manager.'" },
  { fear: "Legal", detail: "Non-compete clause enforced. Sued by their own employer." },
  { fear: "Time Cost", detail: "Building steals time from family. The cure is worse than the disease." },
  { fear: "Embarrassment", detail: "Colleagues find out. The professional reputation is damaged." },
];

const AWARENESS_LEVELS = [
  {
    level: "Unaware",
    percentage: "60%",
    state: "Doesn't know they're trapped. Thinks the golden handcuffs are a reward. Needs the '0.5% equity math' awakening.",
    entry: "Blog posts about equity math, cost-of-waiting calculators, comparison pages",
  },
  {
    level: "Problem Aware",
    percentage: "25%",
    state: "Knows they're stuck but doesn't see a way out. Searching 'how to make extra money' or 'should I quit my job.'",
    entry: "Freedom Number calculator, Story page, Reddit strategy pages",
  },
  {
    level: "Solution Aware",
    percentage: "10%",
    state: "Knows they need a side income stream. Researching micro-SaaS, side hustles, passive income.",
    entry: "Masterclass, Frameworks page, Tool landing pages, Blog pillar content",
  },
  {
    level: "Product Aware",
    percentage: "4%",
    state: "Knows about Invisible Exit specifically. Comparing it to alternatives. Reading reviews.",
    entry: "Pricing page, Proof page, Founding Wall, comparison pages",
  },
  {
    level: "Most Aware",
    percentage: "1%",
    state: "Ready to buy. Just needs the right offer at the right time.",
    entry: "Squeeze page, OTO, tripwire, intensive application",
  },
];

const DREAM_CUSTOMER_PAGE = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Dream Customer Avatar — Who We Build For | Invisible Exit"
        description="The complete psychographic profile of the Invisible Exit dream customer: corporate managers trapped by golden handcuffs who want to build invisible recurring revenue."
        url="/who"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <User className="w-4 h-4" />
            Secret #1: Who Is Your Dream Customer?
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            The Dream Customer <span className="text-gradient-light">Avatar</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            Russell Brunson's first Traffic Secret: before you generate traffic, you must know
            exactly who you're trying to attract.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            This is the complete profile — demographics, psychographics, desires, fears, and
            awareness levels — of the person we build every tool, page, and email for.
          </p>
        </div>
      </section>

      {/* The One Sentence */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <div className="card-base p-8 md:p-12 text-center bg-primary/5 border-primary/20">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              The Dream Customer in One Sentence
            </p>
            <p className="text-xl md:text-2xl font-bold text-foreground leading-relaxed">
              "A corporate manager earning $120K+ with vesting equity who feels trapped by the
              golden handcuffs, has 5–8 hours of weekly free time, and secretly wants to prove
              their worth exists outside the company — without anyone finding out."
            </p>
          </div>
        </div>
      </section>

      {/* Demographics */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Demographics
          </h2>
          <p className="text-muted-foreground mb-8">The measurable, observable facts.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMOGRAPHICS.map((d) => (
              <div key={d.label} className="card-base p-5">
                <div className="flex items-center gap-3 mb-2">
                  <d.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {d.label}
                  </span>
                </div>
                <p className="text-foreground font-medium">{d.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Psychographics */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Psychographics
          </h2>
          <p className="text-muted-foreground mb-8">
            What they believe, how they feel, what keeps them up at night.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PSYCHOGRAPHICS.map((p) => (
              <div key={p.title} className="card-base p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <p.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
                </div>
                <p className="text-body text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Desires */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Deep Desires</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            What they actually want (not what they say they want).
          </p>
          <div className="space-y-4">
            {DEEP_DESIRES.map((d, i) => (
              <div key={i} className="card-base p-5 flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-sm shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{d.desire}</h3>
                  <p className="text-body text-muted-foreground">{d.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Fears */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Deep Fears</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            What stops them from taking action. Every page, email, and offer must address these.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEEP_FEARS.map((f, i) => (
              <div key={i} className="card-base p-5 border-l-4 border-amber-400">
                <h3 className="font-bold text-foreground mb-1">{f.fear}</h3>
                <p className="text-sm text-muted-foreground">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awareness Levels — Eugene Schwartz */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              The 5 Stages of Awareness
            </h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Russell adapted Eugene Schwartz's awareness ladder. Each stage needs different traffic
            and different messaging. Our content must meet them where they are.
          </p>
          <div className="space-y-3">
            {AWARENESS_LEVELS.map((a, i) => (
              <div
                key={i}
                className="card-base p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex items-center gap-4 shrink-0 sm:w-64">
                  <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                      i === 0
                        ? "bg-red-500/15 text-red-600 dark:text-red-400"
                        : i === 1
                        ? "bg-orange-500/15 text-orange-600 dark:text-orange-400"
                        : i === 2
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : i === 3
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-primary/15 text-primary"
                    }`}
                  >
                    {a.percentage}
                  </span>
                  <span className="font-bold text-foreground">{a.level}</span>
                </div>
                <div className="flex-1">
                  <p className="text-body text-foreground">{a.state}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-semibold">Entry point:</span> {a.entry}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50">
            <p className="text-sm text-foreground">
              <strong>Key insight:</strong> 85% of our dream customer is Unaware or Problem-Aware.
              Most of our traffic strategy must target the top of the funnel — awareness-building
              content, not product pages.
            </p>
          </div>
        </div>
      </section>

      {/* Where They Concentrate */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Now That We Know Who They Are…
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            The next question is: where do they congregate online? Where are they already
            hanging out, consuming content, and asking questions?
          </p>
          <Link
            to="/where"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
          >
            Secret #2: Where They Hide <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DREAM_CUSTOMER_PAGE;
