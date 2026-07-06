import { Link } from "react-router-dom";
import {
  Rocket,
  Share2,
  Gift,
  Users,
  TrendingUp,
  Mail,
  Zap,
  Target,
  ArrowRight,
  Check,
  Flame,
  Eye,
  Sparkles,
  Twitter,
  Linkedin,
  MessageSquare,
  Link2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

/**
 * TRAFFIC SECRETS: Secrets #19-20 — Growth Hacking & Butterfly Marketing
 *
 * Russell's viral traffic playbook. The concept: build share-ability into
 * every step of the funnel so that every visitor brings 0.5+ new visitors.
 *
 * The 7 viral mechanics implemented on this site:
 *   1. ShareableResult component (Freedom Number → share to unlock bonus)
 *   2. FYM Badge generator (shareable achievement badges)
 *   3. Referral widget (refer-a-friend for free month)
 *   4. Affiliate program (30% recurring)
 *   5. JV partnership (50% revenue share)
 *   6. Exit intent popup (last-chance capture)
 *   7. Email forward-to-friend (built into every Soap Opera email)
 *
 * This page documents the full viral loop and scores each mechanic.
 */

interface ViralMechanic {
  icon: typeof Share2;
  title: string;
  status: "live" | "partial" | "planned";
  score: number;
  desc: string;
  mechanic: string;
  kFactor: string;
  link?: string;
  linkLabel?: string;
}

const VIRAL_MECHANICS: ViralMechanic[] = [
  {
    icon: Share2,
    title: "Shareable Results (Freedom Number)",
    status: "live",
    score: 80,
    desc: "After calculating their Freedom Number, users see share buttons (Twitter, LinkedIn, Reddit, copy link) with a share-to-unlock bonus frame.",
    mechanic: "Share-to-unlock: user shares their result → unlocks a bonus resource (extra calculator or personalized roadmap). Each share = 1+ new visitors to /freedom.",
    kFactor: "Est. 0.3 (3 out of 10 users share → 0.3 viral coefficient)",
    link: "/freedom",
    linkLabel: "See it live",
  },
  {
    icon: Gift,
    title: "FYM Badge Generator",
    status: "live",
    score: 75,
    desc: "Users who hit MRR milestones get a shareable badge with their name/achievement. Designed for LinkedIn flex-sharing.",
    mechanic: "Achievement-based sharing: every milestone (first $1, first $100, first $1000) generates a visual badge optimized for social media.",
    kFactor: "Est. 0.2 (badges shared to LinkedIn reach corporate-manager-heavy audiences)",
    link: "/fym",
    linkLabel: "View Badge System",
  },
  {
    icon: Users,
    title: "Referral Program (Refer-a-Friend)",
    status: "live",
    score: 70,
    desc: "Active subscribers get a unique referral link. Refer 1 friend = 1 free month. Refer 3 = 3 months free. Refer 10 = lifetime founding access.",
    mechanic: "Tiered rewards: the more you refer, the bigger the prize. The top tier (lifetime access) is aspirational but achievable.",
    kFactor: "Est. 0.15 (reward-driven, but requires active subscribers)",
  },
  {
    icon: TrendingUp,
    title: "Affiliate Program (30% Recurring)",
    status: "live",
    score: 65,
    desc: "30% recurring commission for life. 60-day cookie. Built for newsletter creators, community leaders, and content creators.",
    mechanic: "Financial incentive: affiliates promote because they earn. Swipe copy, banners, and email templates are pre-built.",
    kFactor: "Est. 0.1 (requires affiliates to actively promote, but high-quality traffic when they do)",
    link: "/affiliates",
    linkLabel: "Join Affiliate Program",
  },
  {
    icon: Flame,
    title: "JV Partnership (50% Revenue Share)",
    status: "live",
    score: 60,
    desc: "50% revenue share for creators with audiences. Co-branded landing pages, dedicated tracking, swipe copy.",
    mechanic: "Premium partnership: for high-audience creators only. Higher commission than affiliates = stronger incentive.",
    kFactor: "Est. 0.08 (small number of partners, but each brings thousands of visitors)",
    link: "/partners/jv",
    linkLabel: "Apply for JV Partnership",
  },
  {
    icon: Mail,
    title: "Email Forward-to-Friend",
    status: "partial",
    score: 50,
    desc: "Every Soap Opera and Seinfeld email includes a PS: 'If this helped you, forward it to someone who needs to read it.'",
    mechanic: "Organic sharing: no reward, just a nudge. The story-driven emails are inherently shareable because they're narrative, not pitch.",
    kFactor: "Est. 0.05 (low but compounding — forwards bring high-intent visitors)",
  },
  {
    icon: Zap,
    title: "Exit Intent Capture",
    status: "live",
    score: 70,
    desc: "Exit-intent popup on key pages captures emails before visitors leave. The lead magnet (Freedom Number) is the offer.",
    mechanic: "Last-chance capture: not viral per se, but ensures no visitor is wasted. Every captured email enters the 17-email sequence.",
    kFactor: "N/A (retention, not virality)",
  },
  {
    icon: Sparkles,
    title: "Pre-built Viral Content Assets",
    status: "planned",
    score: 20,
    desc: "Shareable infographics, calculators, and 'equity math' visuals designed to go viral on LinkedIn and Twitter.",
    mechanic: "Asset-driven sharing: create 10 visual assets (equity calculators, freedom number charts, golden handcuffs infographic) that are inherently shareable.",
    kFactor: "Est. 0.15 potential (visual content shares better than text)",
  },
];

const VIRAL_LOOP = [
  {
    step: "1",
    title: "Visitor arrives (traffic source)",
    desc: "SEO, social, referral, or paid. Lands on homepage, blog, or /freedom directly.",
    icon: Target,
  },
  {
    step: "2",
    title: "Calculates Freedom Number",
    desc: "The lead magnet. 90-second calculator. High perceived value. Requires email to see result.",
    icon: Eye,
  },
  {
    step: "3",
    title: "Shares result (viral trigger)",
    desc: "ShareableResult component presents share buttons. Share-to-unlock bonus incentivizes action.",
    icon: Share2,
  },
  {
    step: "4",
    title: "New visitors arrive from share",
    desc: "Each share = 1+ new potential visitor to /freedom. They enter the loop at step 1.",
    icon: Users,
  },
  {
    step: "5",
    title: "Email sequence nurtures",
    desc: "17-email Soap Opera + Seinfeld sequence. Each email has forward-to-friend PS. Secondary viral loop.",
    icon: Mail,
  },
  {
    step: "6",
    title: "Subscriber converts to customer",
    desc: "Checkout for $0.97/mo. Becomes a subscriber. Can now refer friends for free months (step 7).",
    icon: Check,
  },
  {
    step: "7",
    title: "Customer refers friends (k-factor)",
    desc: "Referral widget + affiliate program. Each customer brings 0.1-0.3 new visitors over their lifetime.",
    icon: Gift,
  },
  {
    step: "8",
    title: "Loop compounds",
    desc: "Every visitor → 0.3 shares → 0.3 new visitors → 0.09 shares → 0.027 new visitors... The viral coefficient compounds.",
    icon: TrendingUp,
  },
];

const GrowthHackingPage = () => {
  const avgScore = Math.round(
    VIRAL_MECHANICS.reduce((sum, m) => sum + m.score, 0) / VIRAL_MECHANICS.length
  );

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Growth Hacking Framework — The Viral Loop Engine | Invisible Exit"
        description="How Invisible Exit builds virality into every step of the funnel. 7 viral mechanics, the full viral loop diagram, and viral coefficient estimates for each."
        url="/growth"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-500/30 text-purple-300 text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Rocket className="w-4 h-4" />
            Traffic Secrets: Growth Hacking & Butterfly Marketing
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
            The{" "}
            <span className="text-gradient-light">Viral Loop</span>{" "}
            Engine
          </h1>
          <p className="text-body-lg text-white/60 max-w-2xl mx-auto mb-4">
            Russell's secret: build share-ability into every step.
            Every visitor should bring 0.5+ new visitors.
          </p>
          <p className="text-base text-white/40 max-w-xl mx-auto mb-8">
            {VIRAL_MECHANICS.length} viral mechanics implemented across the funnel.
            Average viral score: <span className="text-primary-light font-bold">{avgScore}/100</span>.
          </p>
        </div>
      </section>

      {/* The Score */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">The Viral Coefficient</p>
          <h2 className="text-h1 text-foreground mb-4">
            Composite Viral Score: <span className="text-primary">{avgScore}/100</span>
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            A viral coefficient (k-factor) above 1.0 means exponential growth.
            Below 1.0 means linear growth with paid/organic top-up. Our current
            composite k-factor estimate: <strong className="text-foreground">0.23</strong>.
            The goal: push it above <strong className="text-foreground">0.5</strong> within 90 days.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-6 py-3 dark:bg-amber-950/20 dark:border-amber-900/50">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm text-foreground">
              <strong>Next lever:</strong> Pre-built viral visual assets (score 20 → 70).
              Equity math infographics designed for LinkedIn/Twitter sharing.
            </span>
          </div>
        </div>
      </section>

      {/* The 7 Viral Mechanics */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-4 text-center">Secret #20</p>
          <h2 className="text-h1 text-foreground mb-4 text-center">{VIRAL_MECHANICS.length} Viral Mechanics</h2>
          <p className="text-body text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Each mechanic is scored by maturity and estimated viral impact.
            Green = live. Amber = partial. Red = planned.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {VIRAL_MECHANICS.map((m) => (
              <div key={m.title} className="card-base p-6 card-hover">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <m.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold text-foreground">{m.title}</h3>
                      <span className={`text-sm font-bold ${m.score >= 70 ? "text-emerald-500" : m.score >= 50 ? "text-amber-500" : "text-red-500"}`}>
                        {m.score}/100
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                      m.status === "live" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : m.status === "partial" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-red-500/15 text-red-600 dark:text-red-400"
                    }`}>
                      {m.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{m.desc}</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground/60 uppercase tracking-wide font-semibold mb-1">Mechanic</p>
                    <p className="text-xs text-foreground">{m.mechanic}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground/60 uppercase tracking-wide font-semibold mb-1">Viral Coefficient</p>
                    <p className="text-xs text-primary font-medium">{m.kFactor}</p>
                  </div>
                </div>
                {m.link && (
                  <Link
                    to={m.link}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors mt-4"
                  >
                    {m.linkLabel} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Viral Loop Diagram */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">The Viral Loop</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            The complete cycle: from first visitor to compounding referral traffic.
            Every step is designed to feed the next.
          </p>
          <div className="space-y-4">
            {VIRAL_LOOP.map((s, i) => (
              <div key={s.step} className="flex items-start gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-bold text-sm">
                    {s.step}
                  </span>
                  {i < VIRAL_LOOP.length - 1 && (
                    <span className="w-px h-8 bg-border mt-2" />
                  )}
                </div>
                <div className="card-base p-5 flex-1 mb-2">
                  <div className="flex items-center gap-3 mb-1">
                    <s.icon className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-foreground">{s.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/20 text-center">
            <p className="text-sm text-foreground">
              <strong>The math:</strong> If k = 0.3, every 100 visitors bring 30 new visitors.
              Those 30 bring 9. Those 9 bring 2.7. Total: 100 + 30 + 9 + 2.7 = 141.7 visitors
              from 100 initial. That's <strong className="text-primary">41.7% organic growth</strong> on every traffic input.
            </p>
          </div>
        </div>
      </section>

      {/* Share Buttons Preview */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">See It in Action</p>
          <h2 className="text-h1 text-foreground mb-4">The Share Mechanics</h2>
          <p className="text-body text-muted-foreground mb-12 max-w-2xl mx-auto">
            These share buttons appear after every Freedom Number calculation.
            They're the primary viral trigger.
          </p>
          <div className="max-w-md mx-auto card-base p-8">
            <p className="text-sm font-bold text-foreground mb-4">Share your Freedom Number:</p>
            <div className="flex items-center justify-center gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-sky-500/10 text-sky-400">
                <Twitter className="w-5 h-5" />
              </span>
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600/10 text-blue-600">
                <Linkedin className="w-5 h-5" />
              </span>
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-orange-500/10 text-orange-500">
                <MessageSquare className="w-5 h-5" />
              </span>
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                <Link2 className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-6 p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50">
              <p className="text-xs text-foreground">
                <Gift className="w-4 h-4 inline mr-1 text-amber-500" />
                <strong>Share to unlock:</strong> Your personalized 90-day roadmap
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <Rocket className="w-12 h-12 text-primary-light mx-auto mb-6" />
          <h2 className="text-h1 text-white mb-4">Virality Is Engineered.</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            Not hoped for. Engineered. Every step of the funnel has a viral mechanic.
            The loop compounds. Traffic becomes free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/freedom" className="btn-primary text-lg">
              See the Viral Loop in Action
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/hooks"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
            >
              <Zap className="w-4 h-4" /> Browse the Hooks Library
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GrowthHackingPage;
