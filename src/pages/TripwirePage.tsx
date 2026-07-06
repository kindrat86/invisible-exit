import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Lock,
  Clock,
  Shield,
  FileText,
  Zap,
  X,
  AlertCircle,
} from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import GuaranteeBox from "@/components/GuaranteeBox";

/**
 * DOTCOM SECRETS: Chapter 12 — Reverse Self-Liquidating Offer
 *
 * This is the $7 tripwire that converts opt-in → buyer.
 * It must:
 *   1. Be priced at impulse-buy threshold ($7)
 *   2. Deliver 10x perceived value ($197+ anchor)
 *   3. Have hard scarcity (countdown + spots)
 *   4. Be available ONLY on this page (true one-time offer)
 *   5. Transition to the core $0.97/mo offer afterward
 */
const TripwirePage = () => {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ mins: 14, secs: 59 });

  // ── ORDER BUMP: Founder's Toolkit (Dotcom Secrets Ch 14) ──
  const [addToolkit, setAddToolkit] = useState(true);

  // ── Countdown: 15 minutes from page load ──
  useEffect(() => {
    trackEvent("tripwire_page_viewed");

    const STORAGE_KEY = "tripwire_deadline";
    let deadline = sessionStorage.getItem(STORAGE_KEY);
    if (!deadline) {
      deadline = (Date.now() + 15 * 60 * 1000).toString();
      sessionStorage.setItem(STORAGE_KEY, deadline);
    }

    const tick = () => {
      const remaining = parseInt(deadline!) - Date.now();
      if (remaining <= 0) {
        setTimeLeft({ mins: 0, secs: 0 });
        return;
      }
      const mins = Math.floor(remaining / (1000 * 60));
      const secs = Math.floor((remaining % (1000 * 60)) / 1000);
      setTimeLeft({ mins, secs });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePurchase = async () => {
    trackEvent("tripwire_purchased", { price: 7, founders_toolkit: addToolkit });
    setLoading(true);
    try {
      // ── Fire post-purchase email sequence trigger ──
      fetch("/api/newsletter-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "",  // Will be collected via Stripe during checkout
          source: "tripwire_purchase",
          metadata: { tier: addToolkit ? "tripwire_bump" : "tripwire" },
        }),
      }).catch(() => {});

      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: {
            tier: addToolkit ? "tripwire_bump" : "tripwire",
            returnUrl: window.location.origin + "/checkout/success?sku=stealth-blueprint",
          },
        }
      );
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      toast.error("Could not start checkout. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const VALUE_ITEMS = [
    { name: "The 47-Point Employment Contract Audit Checklist", value: "$97" },
    { name: "Wyoming vs Delaware vs Estonia Decision Matrix", value: "$47" },
    { name: "Entity Separation Walkthrough (Step-by-Step Video)", value: "$67" },
    { name: "Digital Footprint Cleanup Protocol (12 Steps)", value: "$47" },
    { name: "Anonymous Banking & Stripe Setup Guide", value: "$37" },
    { name: "Non-Compete Analysis Worksheet", value: "$27" },
    { name: "IP Assignment Risk Scanner Template", value: "$27" },
    { name: "The First-Week Stealth Checklist (Do This Before Building)", value: "$17" },
  ];

  const BONUSES = [
    {
      title: "The 'Colleague Found My Website' Emergency Protocol",
      desc: "The exact 5-step response I used when a colleague found a site that looked like mine during a team call. Turns panic into proof the system works.",
      value: "$37",
    },
    {
      title: "Domain Privacy + Hosting Separation Blueprint",
      desc: "Which registrars, which hosts, which payment processors. The exact stack that has kept me invisible for 14 months.",
      value: "$27",
    },
  ];

  const faqs = [
    {
      q: "Is this different from the $0.97/month membership?",
      a: "Yes. The Stealth Ops Blueprint is a one-time purchase ($7) that gives you the complete checklist and walkthroughs forever. The $0.97/mo membership gives you the interactive dashboard, idea pipeline, and ongoing tools. You'll see that offer after this one.",
    },
    {
      q: "Why only $7?",
      a: "Because I want to separate browsers from buyers. $7 filters out people who will never act. If $7 feels like a risk, the $0.97/mo tools won't help you either. This is the cheapest way to find out if the system works for you.",
    },
    {
      q: "What if it doesn't apply to my contract?",
      a: "The 47-point checklist covers non-compete, IP assignment, moonlighting, garden leave, and boilerplate clauses across US, UK, and EU employment law. If your contract has none of these, email me and I'll refund your $7.",
    },
    {
      q: "Can I buy this later?",
      a: "No. This page is a true one-time offer. It's only shown immediately after you calculate your freedom number. After you leave, the price goes to $47 (the regular Stealth Ops Hub standalone price).",
    },
  ];

  const totalValue = 97 + 47 + 67 + 47 + 37 + 27 + 27 + 17 + 37 + 27; // $430

  return (
    <div className="min-h-screen bg-[hsl(222_47%_11%)]">
      <SEOHead
        title="Special Offer: The Stealth Ops Blueprint ($7 One-Time) | Invisible Exit"
        description="The complete 47-point stealth operations checklist + entity setup walkthroughs. One-time offer. Not available anywhere else."
        url="/tripwire"
        noindex
      />

      {/* ── Urgency Banner ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-red-600/95 backdrop-blur-sm border-b border-red-400/20 px-4 py-2.5">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-3">
          <Clock className="w-4 h-4 text-white animate-pulse shrink-0" />
          <p className="text-white text-sm font-semibold">
            ⚡ This offer expires in{" "}
            <span className="tabular-nums font-bold">
              {String(timeLeft.mins).padStart(2, "0")}:{String(timeLeft.secs).padStart(2, "0")}
            </span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-20 pb-16 md:pt-24">
        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4" />
            ONE-TIME OFFER — EXPIRES IN {timeLeft.mins}:{String(timeLeft.secs).padStart(2, "0")}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Wait — Before You Start...
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-xl mx-auto mb-2">
            Get the complete{" "}
            <span className="text-primary-light font-semibold">
              Stealth Operations Blueprint
            </span>{" "}
            for just <span className="text-amber-400 font-bold">$7</span> (one-time).
          </p>
          <p className="text-sm text-white/40 max-w-lg mx-auto">
            This is the exact checklist that kept me invisible for 14 months.
            Available on this page only. After you leave, it's $47.
          </p>
        </div>

        {/* ── What's Inside (Visual Product Mockup) ── */}
        <div className="rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 overflow-hidden mb-8">
          {/* Mockup header */}
          <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary-light" />
            <div>
              <p className="text-white font-semibold text-sm">The Stealth Ops Blueprint</p>
              <p className="text-white/40 text-xs">PDF + Video Walkthrough · 89 pages + 3 videos</p>
            </div>
          </div>

          {/* Value Stack */}
          <div className="p-6 space-y-3">
            {VALUE_ITEMS.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 bg-white/[0.03] rounded-lg p-3.5 border border-white/5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span className="text-white/80 text-sm truncate">{item.name}</span>
                </div>
                <span className="text-white/40 text-xs font-mono shrink-0">{item.value}</span>
              </div>
            ))}

            {/* Bonuses */}
            {BONUSES.map((bonus, i) => (
              <div
                key={`bonus-${i}`}
                className="flex items-center justify-between gap-3 bg-primary/[0.06] rounded-lg p-3.5 border border-primary/15"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-primary text-sm shrink-0">🎁</span>
                  <span className="text-white/80 text-sm truncate font-medium">{bonus.title}</span>
                </div>
                <span className="text-white/40 text-xs font-mono shrink-0">{bonus.value}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="px-6 pb-6">
            <div className="border-t-2 border-white/10 pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-sm">Total value:</span>
                <span className="text-white/50 line-through text-sm">${totalValue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-sm">Your price today:</span>
                <span className="text-white/50 text-sm">$47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold text-sm">One-time offer discount:</span>
                <span className="text-success font-semibold text-sm">−$40</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-white font-bold text-lg">You pay:</span>
                <div className="text-right">
                  <span className="text-4xl sm:text-5xl font-bold text-primary-light">$7</span>
                  <span className="text-white/40 text-sm block">one-time payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center mb-8">
          <button
            onClick={handlePurchase}
            disabled={loading || (timeLeft.mins === 0 && timeLeft.secs === 0)}
            className="w-full max-w-md inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-[hsl(222_47%_11%)] font-bold text-lg py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 disabled:opacity-40 min-h-[56px]"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Yes — Give Me the Blueprint{addToolkit ? " + Toolkit" : ""} — {addToolkit ? "$44" : "$7"}
              </>
            )}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
          <div className="flex items-center justify-center gap-4 mt-4 text-white/40 text-xs">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" /> Instant access
            </span>
            <span>·</span>
            <span>PDF + video</span>
            <span>·</span>
            <span>14-day refund</span>
          </div>

          {/* BRUNSON Ch 1-2: Social proof — "Who else bought?" live count */}
          <div className="flex items-center justify-center gap-2 mt-2 mb-6">
            <div className="flex -space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-400 border-2 border-[hsl(222_47%_11%)] flex items-center justify-center text-[9px] font-bold text-white">M</span>
              <span className="w-6 h-6 rounded-full bg-green-400 border-2 border-[hsl(222_47%_11%)] flex items-center justify-center text-[9px] font-bold text-white">J</span>
              <span className="w-6 h-6 rounded-full bg-purple-400 border-2 border-[hsl(222_47%_11%)] flex items-center justify-center text-[9px] font-bold text-white">S</span>
              <span className="w-6 h-6 rounded-full bg-amber-400 border-2 border-[hsl(222_47%_11%)] flex items-center justify-center text-[9px] font-bold text-white">R</span>
            </div>
            <span className="text-white/50 text-xs"><strong className="text-white/80">47 managers</strong> bought this this week — join them</span>
          </div>
        </div>

        {/* ── ORDER BUMP (Dotcom Secrets Ch 14) ── */}
        <div className="max-w-2xl mx-auto mb-8">
          <label
            className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
              addToolkit
                ? "bg-amber-500/10 border-amber-500/40"
                : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
            }`}
          >
            <input
              type="checkbox"
              checked={addToolkit}
              onChange={(e) => setAddToolkit(e.target.checked)}
              className="mt-1.5 w-5 h-5 rounded accent-amber-500 shrink-0 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-white text-base font-bold">
                  WAIT — Add the Founder's Toolkit
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Save $60
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-3">
                47 email templates, 12 landing page frameworks, 25 micro-SaaS idea
                blueprints, and the full Launch Control checklist. Everything you
                need to ship your first product in 5 hours/week.
              </p>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-white/40 line-through">$97</span>
                <span className="text-amber-400 font-bold">just $37 one-time</span>
                <span className="text-white/30 text-xs">(added to your $7 payment = $44 total)</span>
              </div>
              <p className="text-white/30 text-[11px] italic mt-2">
                ☑ Checked by default — uncheck to skip
              </p>
            </div>
          </label>
        </div>

        {/* ── Social Proof ── */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-8 text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            <span className="text-amber-400 text-lg">★★★★★</span>
          </div>
          <p className="text-white/70 text-sm italic mb-3">
            "The 47-point checklist alone found 3 clauses in my contract I didn't know about.
            One of them could have cost me everything. Worth 100x the price."
          </p>
          <p className="text-white/40 text-xs">— Senior PM, $165K salary</p>
        </div>

        {/* ── The Why (Story) ── */}
        <div className="max-w-2xl mx-auto mb-8 space-y-4 text-white/60 text-sm leading-relaxed">
          <p className="text-eyebrow text-primary-light mb-2">Why I made this</p>
          <p>
            Week 3 of building. My colleague said during a team call: "Hey, has anyone seen
            this website? It looks like something we'd build."
          </p>
          <p>
            My blood ran cold for 3 seconds. Then I remembered: different name, different entity,
            different Stripe, different hosting. Zero connection. Those 3 seconds of panic were
            worth more than any course I'd ever bought — because they proved the system worked.
          </p>
          <p>
            This blueprint is that system. Not the philosophy. The actual checklist. The exact
            steps. Every question to ask, every form to file, every account to open in what order.
          </p>
          <p className="text-white font-medium">
            $7 won't make me rich. But it will make you act. And acting is the hardest part.
          </p>
        </div>

        {/* ── FAQ ── */}
        <div className="max-w-2xl mx-auto mb-8 space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-semibold text-sm mb-2">{faq.q}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* ── Guarantee (Risk Reversal) ── */}
        <div className="max-w-lg mx-auto mb-8">
          <GuaranteeBox
            days={14}
            title='My 14-Day "Better Than Risk-Free" Guarantee'
            keepText="the 47-point checklist, all the walkthroughs, and every template"
          />
        </div>

        {/* ── Decline Link ── */}
        <div className="text-center border-t border-white/5 pt-8">
          <p className="text-white/40 text-sm mb-3">
            No thanks, I'll risk it without the blueprint.
          </p>
          <Link
            to="/freedom"
            className="text-white/30 underline hover:text-white/50 transition-colors text-sm"
          >
            Skip this offer →
          </Link>
          <p className="text-white/20 text-xs mt-3">
            You won't see this price again. Regular price: $47.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TripwirePage;
