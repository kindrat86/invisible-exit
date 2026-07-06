import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Shield,
  Clock,
  Zap,
  RotateCcw,
} from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent, trackGoogleConversion, trackRedditConversion } from "@/lib/analytics";

/**
 * DOTCOM SECRETS: Chapter 15 — The Downsell
 *
 * Russell's downsell pattern:
 *   1. Acknowledge the objection ("I understand")
 *   2. Reframe — remove something to lower the price (not just discount)
 *   3. NEW anchor — show what they DON'T get vs what they DO get
 *   4. Fresh urgency — this page is also one-time (countdown timer)
 *   5. Clean exit — if they decline here, send them somewhere useful
 *
 * The key insight: a downsell removes value to justify the lower price.
 * It's NOT just a discount. It's a different offer.
 */
const DownsellPage = () => {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ mins: 9, secs: 59 });

  // ── Countdown: 10 minutes from page load (Dotcom Secrets Ch 18) ──
  useEffect(() => {
    trackEvent("downsell_page_viewed");

    const STORAGE_KEY = "downsell_deadline";
    let deadline = localStorage.getItem(STORAGE_KEY);
    if (!deadline) {
      deadline = (Date.now() + 10 * 60 * 1000).toString();
      localStorage.setItem(STORAGE_KEY, deadline);
    }

    const tick = () => {
      const remaining = parseInt(deadline!) - Date.now();
      if (remaining <= 0) {
        setTimeLeft({ mins: 0, secs: 0 });
        return;
      }
      setTimeLeft({
        mins: Math.floor(remaining / (1000 * 60)),
        secs: Math.floor((remaining % (1000 * 60)) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckout = async () => {
    trackEvent("downsell_purchased", { price: "9.99" });
    trackGoogleConversion(9.99);
    trackRedditConversion(9.99);
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          tier: "standard",
          returnUrl: window.location.origin + "/confirmation?tier=standard",
        },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      toast.error("Could not start checkout. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COMPARISON = [
    { feature: "FYM Dashboard (freedom number calculator)", founding: true, standard: true },
    { feature: "Idea Pipeline (500+ ideas + 48h validation)", founding: true, standard: true },
    { feature: "Stealth Ops Hub (entity + compliance)", founding: true, standard: true },
    { feature: "Launch Control (go-live automation)", founding: true, standard: true },
    { feature: "Brand Manager (faceless content tools)", founding: true, standard: true },
    { feature: "Lifetime price lock", founding: true, standard: false },
    { feature: "Beta access to new tools", founding: true, standard: false },
    { feature: "Private community access", founding: true, standard: false },
    { feature: "Monthly masterclass replays", founding: true, standard: false },
    { feature: "Feature roadmap voting", founding: true, standard: false },
    { feature: "Name on the founding wall", founding: true, standard: false },
  ];

  return (
    <div className="min-h-screen bg-[hsl(222_47%_11%)]">
      <SEOHead
        title="Wait — Before You Go... | Invisible Exit"
        description="Get all 5 tools at the standard rate. No founding perks. Cancel anytime."
        url="/oto/downsell"
        noindex
      />

      {/* Urgency bar with live countdown */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-sm border-b border-primary/30 px-4 py-2.5">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-3">
          <Clock className="w-4 h-4 text-white shrink-0" />
          <p className="text-white text-sm font-semibold">
            This offer expires in{" "}
            <span className="tabular-nums font-bold text-amber-300">
              {String(timeLeft.mins).padStart(2, "0")}:{String(timeLeft.secs).padStart(2, "0")}
            </span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-20 pb-16 md:pt-24">
        {/* ── 1. Acknowledge ── */}
        <div className="text-center mb-12">
          <p className="text-eyebrow text-primary-light mb-6">Wait — Before You Go...</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            I understand.{" "}
            <span className="text-white/50">$17.99/month</span> is a stretch right now.
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            You still want the full system. The entity separation tools. The launch automation.
            The content calendar. But the founding price doesn't fit right now.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto mt-4">
            Here's what I can do. <strong className="text-white/70">I'll remove the founding perks</strong> —
            the community, the masterclass replays, the beta access, the price lock. You get all 5
            tools. Nothing else. At a lower price.
          </p>
        </div>

        {/* ── 2. The Reframed Offer ── */}
        <div className="relative bg-gradient-to-br from-primary/[0.12] to-transparent border-2 border-primary/30 rounded-2xl p-8 sm:p-10 mb-8">
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold uppercase tracking-[1.5px] px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
            <Zap className="w-3 h-3 inline mr-1" />
            ALTERNATIVE OFFER
          </span>

          {/* Price Reveal */}
          <div className="text-center mb-8">
            <p className="text-sm text-white/50 mb-2">
              All 5 tools. No founding perks. No price lock.
            </p>
            <div className="flex items-baseline justify-center gap-3 mb-2">
              <span className="text-white/30 text-xl line-through">$17.99</span>
              <span className="text-5xl sm:text-6xl font-extrabold text-primary-light">$9.99</span>
              <span className="text-lg text-white/50">/month</span>
            </div>
            <p className="text-success text-sm font-semibold">
              You save $8/month ($96/year) — but you lose the founding perks below.
            </p>
          </div>

          {/* ── 3. What You Get vs Don't Get ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* What you GET */}
            <div className="bg-success/[0.06] border border-success/20 rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-success mb-3">
                ✓ You still get
              </p>
              <div className="space-y-2.5">
                {COMPARISON.filter((c) => c.standard).map((item) => (
                  <div key={item.feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">{item.feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What you LOSE */}
            <div className="bg-red-500/[0.06] border border-red-500/20 rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-red-400 mb-3">
                ✗ You lose
              </p>
              <div className="space-y-2.5">
                {COMPARISON.filter((c) => !c.standard).map((item) => (
                  <div key={item.feature} className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-white/50 text-sm line-through">{item.feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 disabled:opacity-50 min-h-[56px]"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                Get All 5 Tools for $9.99/month
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="text-xs text-white/40 mt-3 text-center">
            Secure payment via Stripe. Cancel anytime.
          </p>
        </div>

        {/* ── 4. Risk Reversal ── */}
        <div className="relative rounded-2xl border-2 border-success/40 bg-gradient-to-br from-success/[0.08] to-transparent mb-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-success text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
              🛡️ Guarantee
            </div>
          </div>
          <div className="p-6 pt-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/15 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-1">
                  30-Day "Better Than Risk-Free" Guarantee
                </h3>
                <p className="text-white/50 text-sm">
                  Try all 5 tools for 30 days. If it's not for you, email "refund."
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                "Full refund within 24 hours — no questions, no forms",
                "You keep every framework, checklist, and your freedom number calculation",
                "You keep the basic $0.97/month membership forever",
                "We part as friends. No hard feelings.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span className="text-white/70 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 5. Clean Exit ── */}
        <div className="text-center space-y-4">
          <div>
            <Link
              to="/dashboard"
              className="text-sm text-white/40 underline hover:text-white/60 transition-colors"
            >
              No thanks, I'll stick with the $0.97 basic plan
            </Link>
          </div>
          <div>
            <Link
              to="/oto/founding"
              className="inline-flex items-center gap-1.5 text-sm text-primary-light/60 hover:text-primary-light transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Actually, show me the Founding Member offer again
            </Link>
          </div>
        </div>

        {/* ── The "What Happens If You Do Nothing" ── */}
        <div className="mt-16 max-w-xl mx-auto">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 text-center">
            <p className="text-white/40 text-xs uppercase tracking-wide font-semibold mb-3">
              What happens if you do nothing?
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              Nothing changes. You keep your job. You keep your 0.5% equity. You keep hoping the
              IPO delivers. Six months from now, you'll be in the same spot — except{" "}
              <strong className="text-white/80">the founding price will be gone</strong>, and
              you'll wish you'd locked it in when you had the chance.
            </p>
            <p className="text-primary-light text-sm font-semibold mt-3">
              Every month you wait is another month of unrealized MRR.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DownsellPage;
