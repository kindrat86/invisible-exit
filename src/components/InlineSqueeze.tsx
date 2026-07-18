import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Lock,
  Check,
  Mail,
  Calculator,
  Shield,
  Rocket,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

/**
 * DOTCOM SECRETS Ch 4 & Ch 6 — Inline Squeeze on Homepage
 *
 * Problem: Homepage had no email capture. 8+ competing CTAs. Visitors bounced
 * before reaching the /freedom squeeze page.
 *
 * Fix: Capture email RIGHT HERE on the homepage. Don't make them navigate.
 * After capture, show the funnel progression (the path) so they know exactly
 * what happens next. This converts the homepage from a content page into a
 * funnel entry point.
 *
 * Flow:
 *   1. Email capture (with micro-commitment hook)
 *   2. Success state → show funnel path: Calculate → Blueprint → Build
 *   3. CTA to continue into the /freedom interactive calculator
 */

type SqueezeState = "form" | "success";

const FUNNEL_STEPS = [
  {
    icon: Calculator,
    num: "1",
    title: "Calculate Your Freedom Number",
    desc: "90-second interactive tool. Enter salary + expenses. See your exact MRR target.",
    cta: "Start Calculator",
    href: "/freedom",
    price: "Free",
    priceColor: "text-green-400",
  },
  {
    icon: Shield,
    num: "2",
    title: "Get the Stealth Ops Blueprint",
    desc: "47-point checklist for keeping your employer from finding out. Entity setup, compliance, digital separation.",
    cta: "Get Blueprint",
    href: "/tripwire",
    price: "$7 one-time",
    priceColor: "text-amber-300",
  },
  {
    icon: Rocket,
    num: "3",
    title: "Start the 5-Tool System",
    desc: "All 5 tools — freedom number, idea pipeline, stealth ops, launch control, brand manager.",
    cta: "Start for $0.97/mo",
    href: "/start",
    price: "$0.97/mo",
    priceColor: "text-primary-light",
  },
];

const InlineSqueeze = () => {
  const [state, setState] = useState<SqueezeState>("form");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    trackEvent("inline_squeeze_submitted", { source: "homepage_inline" });

    try {
      const res = await fetch("/api/newsletter-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "squeeze",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err.error?.includes("rate")) {
          toast.error("Too many attempts. Please try again in a few minutes.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
        setLoading(false);
        return;
      }

      setState("success");
      toast.success("You're in! Check your inbox.");

      // Smooth scroll to the success section
      setTimeout(() => {
        successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch (err) {
      toast.error("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── FORM STATE ──
  if (state === "form") {
    return (
      <section
        id="get-started"
        className="relative overflow-hidden py-20 sm:py-24"
        style={{
          background:
            "linear-gradient(180deg, #0B1D3A 0%, #0F2547 50%, #0B1D3A 100%)",
        }}
      >
        {/* Ambient glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-narrow relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            {/* Urgency badge */}
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs text-amber-200 font-semibold uppercase tracking-wider">
                73 of 100 founding spots remaining
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 leading-[1.15] animate-fade-up">
              Enter your email to see{" "}
              <span className="text-gradient-light">your exact path out.</span>
            </h2>

            <p className="text-lg text-white/60 mb-2 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "50ms" }}>
              No credit card. No spam. Just a 90-second calculator that tells you
              exactly how much recurring revenue you need to replace your salary —
              and how long it takes at your hours/week.
            </p>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
              {["100% Private", "No credit card", "Takes 90 seconds", "Unsubscribe anytime"].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-xs text-white/40">
                  <Check className="w-3.5 h-3.5 text-primary-light" />
                  {item}
                </span>
              ))}
            </div>

            {/* Email form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto animate-fade-up"
              style={{ animationDelay: "150ms" }}
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="email"
                  required
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your best email address"
                  className="w-full rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/30 py-4 pl-12 pr-5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all min-h-[56px]"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="btn-primary inline-flex items-center justify-center gap-2 text-base px-7 py-4 min-h-[56px] whitespace-nowrap disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Show Me My Path
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Micro-copy: what happens next */}
            <p className="text-white/30 text-xs mt-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
              Enter your email → Calculate your freedom number → Get your personalized exit timeline.
              <br />
              The calculator runs instantly. No waiting.
            </p>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-3 mt-6 text-xs text-white/40 animate-fade-up" style={{ animationDelay: "250ms" }}>
              <span className="flex items-center gap-1">
                <span className="flex -space-x-2">
                  {["bg-blue-400", "bg-green-400", "bg-purple-400", "bg-orange-400"].map((c, i) => (
                    <span key={i} className={`w-5 h-5 rounded-full ${c} border-2 border-[#0B1D3A] flex items-center justify-center text-[9px] font-bold text-white`}>
                      {["S", "M", "J", "A"][i]}
                    </span>
                  ))}
                </span>
                127 managers building now
              </span>
              <span>·</span>
              <span className="text-amber-300">★★★★★</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── SUCCESS STATE ──
  return (
    <section
      id="get-started"
      ref={successRef}
      className="relative overflow-hidden py-20 sm:py-24"
      style={{
        background:
          "linear-gradient(180deg, #0B1D3A 0%, #0F2547 50%, #0B1D3A 100%)",
      }}
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-narrow relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Success confirmation */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/30 mb-6 animate-scale-in">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              You're in. Check your inbox.
            </h2>
            <p className="text-white/50 text-sm max-w-md mx-auto">
              Welcome email sent to <strong className="text-white/70">{email}</strong>.
              Now here's your path — 3 steps from trapped to building.
            </p>
          </div>

          {/* Funnel progression: The 3-step path */}
          <div className="space-y-4 mb-8">
            <p className="text-center text-eyebrow text-primary-light mb-6">
              Your 3-Step Path to Freedom
            </p>

            {FUNNEL_STEPS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div key={step.num} className="animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-primary/30 transition-all group">
                    {/* Step number */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                        <StepIcon className="w-6 h-6 text-primary-light" />
                      </div>
                      {i < FUNNEL_STEPS.length - 1 && (
                        <div className="hidden sm:block absolute top-full left-1/2 -translate-x-1/2 w-px h-6 bg-white/10" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary-light uppercase tracking-wider">
                          Step {step.num}
                        </span>
                        <span className={`text-xs font-semibold ${step.priceColor}`}>
                          · {step.price}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1">
                        {step.title}
                      </h3>
                      <p className="text-white/40 text-xs leading-relaxed mb-3">
                        {step.desc}
                      </p>
                    </div>

                    {/* CTA */}
                    <Link
                      to={step.href}
                      onClick={() => trackEvent("inline_squeeze_step_clicked", { step: step.num })}
                      className="shrink-0 inline-flex items-center justify-center gap-1.5 w-full sm:w-auto text-xs font-semibold text-primary-light hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-lg transition-all"
                    >
                      {step.cta}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Primary CTA: Start the calculator */}
          <div className="text-center">
            <Link
              to="/freedom"
              onClick={() => trackEvent("inline_squeeze_primary_cta", { target: "freedom_calculator" })}
              className="btn-primary text-lg px-8 inline-flex items-center gap-2 animate-fade-up"
              style={{ animationDelay: "400ms" }}
            >
              <Sparkles className="w-5 h-5" />
              Start the Freedom Calculator (Free)
            </Link>
            <p className="text-white/30 text-xs mt-3">
              90 seconds. No credit card. See your number instantly.
            </p>
          </div>

          {/* Trust bar */}
          <div className="flex items-center justify-center gap-4 mt-8 text-white/30 text-xs animate-fade-up" style={{ animationDelay: "500ms" }}>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              100% Private
            </span>
            <span>·</span>
            <span>No spam, ever</span>
            <span>·</span>
            <span>Unsubscribe anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InlineSqueeze;
