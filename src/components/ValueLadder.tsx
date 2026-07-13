import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/**
 * ValueLadder — DotCom Secrets Ch 1
 *
 * Russell Brunson's Value Ladder: each rung delivers 10× the value of the one below.
 * Price goes up because the transformation goes up.
 *
 * The ladder makes the full progression visible to every visitor:
 *   Free → $7 → $0.97/mo → $47/mo → $97 → $2,000
 *
 * Previously this was a plain text list buried at section 17/24.
 * Now it's a visual staircase with glow, gradient, and glassmorphism.
 */

type Rung = {
  num: number;
  phase: string;
  name: string;
  price: string;
  period: string;
  outcome: string;
  valueLabel: string;
  href: string;
  cta: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  glowColor: string;
  priceGradient: string;
  featured?: boolean;
};

const RUNGS: Rung[] = [
  {
    num: 1,
    phase: "Bait",
    name: "Freedom Number Calculator",
    price: "$0",
    period: "Free forever",
    outcome: "Know your exact exit number in 90 seconds. The one metric that makes everything click.",
    valueLabel: "Clarity",
    href: "/freedom",
    cta: "Calculate Free",
    badgeBg: "bg-sky-500/15",
    badgeText: "text-sky-300",
    borderColor: "border-sky-500/20",
    glowColor: "hover:shadow-sky-500/20",
    priceGradient: "text-sky-300",
  },
  {
    num: 2,
    phase: "Tripwire",
    name: "Stealth Ops Blueprint",
    price: "$7",
    period: "one-time",
    outcome: "The 47-point invisibility checklist. Entity, digital footprint, compliance — audited.",
    valueLabel: "Safety",
    href: "/tripwire",
    cta: "Get Blueprint",
    badgeBg: "bg-cyan-500/15",
    badgeText: "text-cyan-300",
    borderColor: "border-cyan-500/20",
    glowColor: "hover:shadow-cyan-500/20",
    priceGradient: "text-cyan-300",
  },
  {
    num: 3,
    phase: "Core Offer",
    name: "The 5-Tool System",
    price: "$0.97",
    period: "/month",
    outcome: "FYM Dashboard, Idea Pipeline, Stealth Ops, Launch Control, Brand Manager. Full toolkit.",
    valueLabel: "System",
    href: "/freedom",
    cta: "Start $0.97/mo",
    badgeBg: "bg-primary/20",
    badgeText: "text-primary-light",
    borderColor: "border-primary/30",
    glowColor: "hover:shadow-primary/30",
    priceGradient: "text-primary-light",
    featured: true,
  },
  {
    num: 4,
    phase: "Continuity+",
    name: "Pro: Coaching + Community",
    price: "$47",
    period: "/month",
    outcome: "Weekly group coaching, private community, idea validation, monthly MRR audits.",
    valueLabel: "Momentum",
    href: "/pro",
    cta: "Apply for Pro",
    badgeBg: "bg-violet-500/15",
    badgeText: "text-violet-300",
    borderColor: "border-violet-500/20",
    glowColor: "hover:shadow-violet-500/20",
    priceGradient: "text-violet-300",
  },
  {
    num: 5,
    phase: "Accelerator",
    name: "Weekend Build Workshop",
    price: "$97",
    period: "one-time",
    outcome: "2-day live workshop. Build + launch your first micro-SaaS with Adrian. Compress 3 months → 1 weekend.",
    valueLabel: "Speed",
    href: "/weekend-workshop",
    cta: "Join Workshop",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-300",
    borderColor: "border-amber-500/20",
    glowColor: "hover:shadow-amber-500/20",
    priceGradient: "text-amber-300",
  },
  {
    num: 6,
    phase: "High-Ticket",
    name: "The 90-Day Intensive",
    price: "$2,000",
    period: "1-on-1 · 90 days",
    outcome: "Adrian becomes your co-founder. Freedom number, stealth audit, idea sprint, launch review. 5 spots/month.",
    valueLabel: "Exit",
    href: "/intensive",
    cta: "Apply for Intensive",
    badgeBg: "bg-rose-500/15",
    badgeText: "text-rose-300",
    borderColor: "border-rose-500/20",
    glowColor: "hover:shadow-rose-500/20",
    priceGradient: "text-rose-300",
  },
];

function RungCard({ rung, isMobile }: { rung: Rung; isMobile?: boolean }) {
  return (
    <div
      className={`card-glass relative p-5 sm:p-6 border ${rung.borderColor} transition-all duration-300 ${rung.glowColor} hover:shadow-2xl hover:-translate-y-1.5 group`}
      style={!isMobile ? { minHeight: `${280 + rung.num * 28}px` } : undefined}
    >
      {/* Giant faded step number */}
      <span className="absolute top-3 right-4 text-5xl font-black text-white/[0.04] pointer-events-none select-none">
        {rung.num}
      </span>

      {/* Phase badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${rung.badgeBg} ${rung.badgeText}`}>
          {rung.phase}
        </span>
        {rung.featured && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-400/15 text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Most popular
          </span>
        )}
      </div>

      {/* Product name */}
      <h3 className="text-white font-bold text-sm sm:text-base mb-3 leading-tight">
        {rung.name}
      </h3>

      {/* Price */}
      <div className="mb-4">
        <span className={`text-3xl sm:text-4xl font-black ${rung.priceGradient}`}>
          {rung.price}
        </span>
        <span className="text-white/30 text-xs ml-1.5">{rung.period}</span>
      </div>

      {/* Outcome */}
      <p className="text-white/45 text-xs leading-relaxed mb-5">
        {rung.outcome}
      </p>

      {/* Value label */}
      <div className="mb-4">
        <span className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">
          Value delivered:
        </span>
        <span className={`ml-2 text-xs font-bold ${rung.badgeText}`}>
          {rung.valueLabel}
        </span>
      </div>

      {/* CTA */}
      <Link
        to={rung.href}
        onClick={() => trackEvent("value_ladder_cta_clicked", { rung: rung.num, phase: rung.phase, target: rung.href })}
        className={`inline-flex items-center gap-1 text-xs font-bold ${rung.badgeText} group-hover:gap-2 transition-all`}
      >
        {rung.cta}
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

const ValueLadder = () => {
  return (
    <section className="hero-dark-radial section-wide relative overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-rose-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-standard relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-eyebrow text-primary-light mb-4">
            DotCom Secrets · Chapter 1
          </p>
          <h2 className="text-h1 text-white mb-4">
            The <span className="text-gradient-light">Value Ladder</span>
          </h2>
          <p className="text-body text-white/60 max-w-2xl mx-auto">
            Every rung delivers{" "}
            <span className="text-primary-light font-bold">10× the value</span>{" "}
            of the one below it. Start free. Climb at your own pace. Most members
            never go past step 3 — and that's exactly right.
          </p>
        </div>

        {/* 10x principle callout */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/40">
            <span className="flex items-center gap-1.5 bg-white/[0.03] border border-white/10 rounded-full px-3 py-1.5">
              💎 Price goes up → Transformation goes up 10×
            </span>
            <span className="flex items-center gap-1.5 bg-white/[0.03] border border-white/10 rounded-full px-3 py-1.5">
              🔄 Self-select your entry point
            </span>
            <span className="flex items-center gap-1.5 bg-white/[0.03] border border-white/10 rounded-full px-3 py-1.5">
              ⚡ No pressure to climb
            </span>
          </div>
        </div>

        {/* Desktop: horizontal staircase */}
        <div className="hidden lg:flex items-end justify-center gap-3 xl:gap-4 mb-8">
          {RUNGS.map((rung) => (
            <RungCard key={rung.num} rung={rung} />
          ))}
        </div>

        {/* Tablet: 2 rows × 3 cards */}
        <div className="hidden md:grid lg:hidden grid-cols-3 gap-4 mb-8">
          <div className="col-span-3 grid grid-cols-3 gap-4">
            {RUNGS.slice(0, 3).map((rung) => (
              <RungCard key={rung.num} rung={rung} />
            ))}
          </div>
          <div className="col-span-3 grid grid-cols-3 gap-4">
            {RUNGS.slice(3).map((rung) => (
              <RungCard key={rung.num} rung={rung} />
            ))}
          </div>
        </div>

        {/* Mobile: vertical stack with connectors */}
        <div className="md:hidden space-y-3 mb-8">
          {RUNGS.map((rung, i) => (
            <div key={rung.num}>
              <RungCard rung={rung} isMobile />
              {i < RUNGS.length - 1 && (
                <div className="flex justify-center py-1">
                  <span className="text-white/15 text-lg">↑</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom summary */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6 text-center">
            <p className="text-white/50 text-sm leading-relaxed">
              <span className="text-primary-light font-bold">Total potential value:</span>{" "}
              $2,154+ in tools, coaching, and done-with-you support.
              <br className="hidden sm:block" />
              <span className="text-white/35">
                {" "}Start at $0. Pay more only when the system proves itself.
              </span>
            </p>
          </div>

          {/* Principle quote */}
          <p className="text-center text-white/25 text-xs italic mt-6 max-w-xl mx-auto">
            "The Value Ladder isn't about upselling. It's about delivering more
            transformation at each step. The price goes up because the value goes
            up 10×." — Russell Brunson, DotCom Secrets
          </p>
        </div>
      </div>
    </section>
  );
};

export default ValueLadder;
