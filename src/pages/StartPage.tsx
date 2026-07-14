import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, Shield, Lock, Zap, Clock, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent, trackGoogleConversion } from "@/lib/analytics";

/**
 * DOTCOM SECRETS Ch 8 — Two-Step Order Page
 *
 * Step 1: The Offer (this page — full stack, guarantee, social proof)
 * Step 2: Stripe Checkout (the actual payment)
 *
 * This page replaces the broken flow where $0.97/mo CTA went to /dashboard
 * (a login page) with no checkout in between.
 *
 * Brunson patterns implemented:
 * - Ch 10: The Stack (show total value → dramatic price reveal)
 * - Ch 14: Order Bump (checkbox add-on during checkout)
 * - Ch 8: Two-step (offer page → Stripe checkout)
 * - Ch 7: Guarantee + risk reversal
 * - Ch 6: Urgency (founding spots countdown)
 */

const STACK_ITEMS = [
  { name: "FYM Dashboard — tracks your exit timeline", value: "$12/mo" },
  { name: "Idea Pipeline — 500+ validated micro-SaaS ideas", value: "$15/mo" },
  { name: "Stealth Ops Hub — entity separation + compliance", value: "$25/mo" },
  { name: "Launch Control — 5-hour launch automation", value: "$18/mo" },
  { name: "Brand Manager — faceless audience building", value: "$27/mo" },
];

const BONUSES = [
  { name: "The Employment Contract Audit Checklist", value: "$27" },
  { name: "25 Done-For-You Micro-SaaS Idea Swipes", value: "$47" },
  { name: "The Faceless Founder Content Calendar", value: "$27" },
];

const TOTAL_VALUE_MONTHLY = 12 + 15 + 25 + 18 + 27; // $97/mo
const TOTAL_BONUS_VALUE = 27 + 47 + 27; // $101
const GRAND_TOTAL = TOTAL_VALUE_MONTHLY + TOTAL_BONUS_VALUE; // $198

const FAQS = [
  {
    q: "Is this really $0.97/month?",
    a: "Yes. Founding members lock in $0.97/month for life. When founding closes, the price goes to $12/month. You keep $0.97 forever.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. One click in your dashboard. No contracts, no friction. Plus there's a 30-day money-back guarantee — email 'refund' and you're out.",
  },
  {
    q: "What if my employer finds out?",
    a: "The Stealth Ops Hub is specifically designed to prevent that. Entity separation, compliance audit, digital footprint cleanup. Your business operates under a completely separate legal structure.",
  },
  {
    q: "Do I need to know how to code?",
    a: "No. The Idea Pipeline filters for no-code and AI-assisted builds. If you can manage a team and run a P&L, you have more than enough skill.",
  },
  {
    q: "What happens after I pay?",
    a: "You'll be redirected to Stripe's secure checkout. After payment, you get a magic link email that logs you into your dashboard instantly. 60 seconds from now you're setting up your Freedom Number.",
  },
];

const StartPage = () => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const fromTripwire = searchParams.get("from") === "tripwire";

  // Clean the query param from URL so it doesn't persist on refresh
  useEffect(() => {
    if (fromTripwire) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Countdown timer (14-day deadline from first visit)
  useEffect(() => {
    trackEvent("start_page_viewed");
    const STORAGE_KEY = "starter_deadline";
    let deadline = localStorage.getItem(STORAGE_KEY);
    if (!deadline) {
      deadline = (Date.now() + 14 * 24 * 60 * 60 * 1000).toString();
      localStorage.setItem(STORAGE_KEY, deadline);
    }
    const tick = () => {
      const remaining = parseInt(deadline!) - Date.now();
      if (remaining <= 0) return;
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const update = (id: string, val: string) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };
      update("start-countdown-days", String(days).padStart(2, "0"));
      update("start-countdown-hours", String(hours).padStart(2, "0"));
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckout = async () => {
    trackEvent("start_page_checkout_clicked");
    trackGoogleConversion(0.97);
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          tier: "starter",
          returnUrl: window.location.origin + "/checkout/success",
        },
      });
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
        title="Start Building for $0.97/Month | Invisible Exit"
        description="Get all 5 tools — FYM Dashboard, Idea Pipeline, Stealth Ops Hub, Launch Control, Brand Manager — for $0.97/month. 30-day money-back guarantee."
        url="/start"
        noindex
      />
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16">
          <div className="container-narrow text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs text-amber-200 font-semibold uppercase tracking-wider">
                {fromTripwire
                  ? "🎉 YOUR $7 BLUEPRINT IS WAITING — NOW UNLOCK THE FULL SYSTEM"
                  : "73 of 100 founding spots remaining"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-[1.1] animate-fade-up">
              {fromTripwire ? (
                <>You Got the Map. Now <span className="text-gradient-light">Get the Vehicle.</span></>
              ) : (
                <>You're 60 Seconds Away From{" "}
                <span className="text-gradient-light">Building Your Invisible Exit.</span></>
              )}
            </h1>
            <p className="text-body-lg text-white/60 max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "50ms" }}>
              {fromTripwire
                ? "The Stealth Ops Blueprint shows you how to stay invisible. These 5 tools show you what to build, validate, launch, and grow — all while keeping your day job."
                : "All 5 tools. 3 bonuses. $0.97/month. Locked for life."}
            </p>

            {/* Trust bar */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
              {["30-day money-back guarantee", "Cancel anytime", "Secure Stripe checkout"].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-xs text-white/40">
                  <Check className="w-3.5 h-3.5 text-success" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── The Stack (DotCom Secrets Ch 10) ── */}
        <section className="bg-white section-normal border-t border-border">
          <div className="container-narrow">
            <p className="text-eyebrow text-primary mb-4 text-center">The Full Stack</p>
            <h2 className="text-h1 text-foreground mb-2 text-center">Here's Everything You Get</h2>
            <p className="text-body text-muted-foreground text-center mb-10 max-w-xl mx-auto">
              5 tools + 3 fast-action bonuses. Total value <strong className="text-foreground">${GRAND_TOTAL}</strong>. Your founding price: less than a dollar.
            </p>

            {/* Core tools */}
            <div className="max-w-2xl mx-auto">
              <p className="text-eyebrow text-muted-foreground mb-3">Core Tools (5)</p>
              <div className="space-y-3 mb-8">
                {STACK_ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-border animate-fade-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-success" />
                      </div>
                      <span className="text-foreground font-medium">{item.name}</span>
                    </div>
                    <span className="text-muted-foreground text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Bonuses */}
              <p className="text-eyebrow text-primary mb-3">🎁 Fast-Action Bonuses (3) — Included when you start today</p>
              <div className="space-y-3 mb-8">
                {BONUSES.map((bonus, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-border"
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
              </div>

              {/* Total → Price reveal */}
              <div className="pt-6 mt-4 border-t-2 border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Total value:</span>
                  <span className="text-muted-foreground line-through">${GRAND_TOTAL}/month</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Founding member discount:</span>
                  <span className="text-success font-semibold">−99.5%</span>
                </div>
                <div className="flex items-center justify-between py-4">
                  <span className="text-foreground font-semibold text-lg">Your price today:</span>
                  <div className="text-right">
                    <span className="text-4xl sm:text-5xl font-bold text-primary">$0.97</span>
                    <span className="text-lg font-normal text-muted-foreground">/mo</span>
                  </div>
                </div>
                <p className="text-caption text-center mb-6">
                  That's ${GRAND_TOTAL}/month in value for $0.97/month. Locked for life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Button (The Two-Step: Step 1 → Step 2) ── */}
        <section className="bg-white section-normal">
          <div className="container-narrow text-center">
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="btn-primary text-lg px-10 py-5 inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[64px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkoutLoading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Redirecting to secure checkout...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Start for $0.97/mo
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-sm text-muted-foreground mt-4">
              $0.97/month · Secure Stripe checkout.
              {" "}Cancel anytime.
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground/60">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                256-bit SSL encrypted
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Powered by Stripe
              </span>
            </div>
          </div>
        </section>

        {/* ── Guarantee Box ── */}
        <section className="bg-surface section-normal border-y border-border">
          <div className="container-narrow">
            <div className="max-w-xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 border border-success/20 mb-6">
                <Shield className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-h3 text-foreground mb-3">30-Day Money-Back Guarantee</h3>
              <p className="text-body text-muted-foreground leading-relaxed mb-4">
                Try every tool for 30 days. If you don't have a validated freedom number, a clear
                exit timeline, and at least 3 micro-SaaS ideas worth building — email the word
                "refund" and you get every cent back. No questions. No forms. No friction.
              </p>
              <p className="text-sm text-foreground font-medium">
                The risk is entirely on me. You either build your invisible exit, or you lose nothing.
              </p>
            </div>
          </div>
        </section>

        {/* ── Urgency (Ch 6) ── */}
        <section className="bg-white section-normal">
          <div className="container-narrow text-center">
            <div className="inline-flex items-center gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl px-8 py-6">
              <Clock className="w-8 h-8 text-red-500 shrink-0" />
              <div className="text-left">
                <p className="text-foreground font-bold text-sm mb-1">Founding price closes soon.</p>
                <p className="text-muted-foreground text-xs">
                  <span id="start-countdown-days" className="font-bold text-red-500">14</span> days,{" "}
                  <span id="start-countdown-hours" className="font-bold text-red-500">23</span> hours remaining.
                  After that, the price goes to $12/month permanently.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ / Objection Crushing ── */}
        <section className="bg-surface section-normal border-t border-border">
          <div className="container-narrow">
            <h2 className="text-h2 text-foreground mb-8 text-center">Questions Before You Start?</h2>
            <div className="max-w-2xl mx-auto space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-card rounded-xl p-5 border border-border">
                  <h3 className="text-foreground font-semibold text-sm mb-2 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {faq.q}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="hero-dark section-wide">
          <div className="container-narrow text-center">
            <Zap className="w-10 h-10 text-primary-light mx-auto mb-6" />
            <h2 className="text-h1 text-white mb-4">Ready to Find Your Door?</h2>
            <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
              60 seconds from now you'll have your dashboard open, calculating the exact number
              that sets you free.
            </p>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="btn-primary text-lg px-10 py-5 inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[64px] disabled:opacity-50"
            >
              {checkoutLoading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Redirecting to checkout...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Start for $0.97/mo
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-sm text-white/40 mt-4">
              30-day money-back guarantee · Cancel anytime · Locked at $0.97/month for life
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-white/30">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                127 managers building now
              </span>
              <span>·</span>
              <span>★★★★★ 4.8/5</span>
              <span>·</span>
              <span>73 founding spots left</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StartPage;
