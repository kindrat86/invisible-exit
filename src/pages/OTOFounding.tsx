import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, LayoutDashboard, TrendingDown } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent, trackGoogleConversion } from "@/lib/analytics";
import VideoPlaceholder from "@/components/oto/VideoPlaceholder";
import ValueStack from "@/components/oto/ValueStack";
import PriceCard from "@/components/oto/PriceCard";
import GuaranteeBox from "@/components/oto/GuaranteeBox";

const OTOFounding = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // ── ORDER BUMP: Founder's Toolkit (Dotcom Secrets Ch 14) ──
  const [addToolkit, setAddToolkit] = useState(true);

  useEffect(() => {
    trackEvent("oto_page_viewed");

    if (sessionId) {
      supabase.functions
        .invoke("verify-session", { body: { session_id: sessionId } })
        .then(({ data }) => {
          if (data?.status === "paid") setPaymentConfirmed(true);
        });
    }
  }, [sessionId]);

  const handleUpgrade = async () => {
    trackEvent("oto_cta_clicked", { founders_toolkit: addToolkit });
    trackGoogleConversion(17.99); // Fire Google Ads retargeting pixel
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: {
            tier: "founding",
            returnUrl: window.location.origin + "/checkout/success",
          },
        }
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

  const handleDecline = () => {
    trackEvent("oto_declined");
  };

  // ── Countdown Timer: 14 days from first visit ──
  useEffect(() => {
    const STORAGE_KEY = "oto_deadline";
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
      const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((remaining % (1000 * 60)) / 1000);
      const update = (id: string, val: number | string) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(val).padStart(2, "0");
      };
      update("countdown-Days", days);
      update("countdown-Hours", hours);
      update("countdown-Mins", mins);
      update("countdown-Secs", secs);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── TOTAL VALUE STACK CALCULATION ──
  const VALUE_ITEMS = [
    { name: "FYM Dashboard", value: "$12/mo" },
    { name: "Idea Pipeline (500+ ideas + validation)", value: "$15/mo" },
    { name: "Stealth Ops Hub (entity + compliance)", value: "$25/mo" },
    { name: "Launch Control (go-live automation)", value: "$18/mo" },
    { name: "Brand Manager (faceless content)", value: "$27/mo" },
    { name: "Founding Perks (lifetime lock + beta + community + wall)", value: "$47/mo" },
  ];
  const TOTAL_VALUE = 12 + 15 + 25 + 18 + 27 + 47;


  return (
    <div className="min-h-screen bg-[#1B2A4A]">
      <SEOHead
        title="Founding Member Invitation | Invisible Exit"
        description="Join Invisible Exit as a founding member and lock in lifetime pricing."
        url="/oto/founding"
        noindex
      />
      {/* ─── 1. Confirmation Banner (sticky) ─── */}
      {paymentConfirmed && (
        <div
          className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(34,197,94,0.2)] px-6 py-3"
          style={{
            background: "linear-gradient(135deg, #166534, #14532d)",
          }}
        >
          <div className="max-w-[720px] mx-auto text-center">
            <p className="text-white font-medium text-sm flex items-center justify-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#22c55e]">
                <Check className="w-3 h-3 text-white" />
              </span>
              Your Invisible Exit membership is active. Your dashboard is ready.
            </p>
            <p className="text-[#86efac] text-xs mt-1">
              Didn't get the welcome email? Check your spam folder, or{" "}
              <Link
                to="/dashboard"
                className="underline hover:text-white transition-colors"
              >
                go directly to your dashboard
              </Link>
              .
            </p>
          </div>
        </div>
      )}

      {/* ─── 2. Hero Section ─── */}
      <section
        className={`px-6 pt-16 pb-12 ${paymentConfirmed ? "mt-[72px]" : ""}`}
      >
        <div className="max-w-[720px] mx-auto text-center">
          {/* Badge */}
          <span className="inline-block bg-[rgba(96,165,250,0.12)] border border-[rgba(96,165,250,0.2)] text-[#60A5FA] text-[12px] uppercase tracking-[1.5px] font-medium px-5 py-2 rounded-full mb-8">
            ONE-TIME FOUNDING OFFER
          </span>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4 max-w-2xl mx-auto">
            You Just Got the Map. Here's What Separates Those Who{" "}
            <span className="text-[#60A5FA]">Escape in 90 Days</span> from
            Those Still Planning a Year Later.
          </h1>

          {/* Price preview — visible above the fold on mobile */}
          <div className="mb-6">
            <p className="text-white/50 text-sm mb-1">
              <span className="line-through text-red-400/70">$97.99/month</span> — Founding price locks at:
            </p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-extrabold text-white">$17.99</span>
              <span className="text-lg text-white/60">/month</span>
            </div>
            <p className="text-[#60A5FA] text-sm mt-1">Locked for life. Never increases.</p>
          </div>

          {/* Quick CTA — jump to full price card */}
          <a
            href="#price-card"
            className="inline-flex items-center gap-2 bg-[#60A5FA] hover:bg-[#93c5fd] text-white font-semibold text-base px-8 py-3.5 rounded-xl shadow-[0_4px_24px_rgba(96,165,250,0.25)] transition-all hover:-translate-y-0.5"
          >
            Become a Founding Member
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-[13px] text-white/40 mt-3">
            30-day money-back guarantee · Secure Stripe checkout
          </p>

        </div>
      </section>

      {/* ─── 3. Video Placeholder ─── */}
      <section className="px-6 pb-12">
        <VideoPlaceholder />
      </section>

      {/* ─── 4. Divider ─── */}
      <div className="flex justify-center my-11">
        <div className="w-12 h-[2px] bg-white/20" />
      </div>

      {/* ─── 5. Adrian's Story ─── */}
      <section className="px-6 py-8">
        <div className="max-w-[720px] mx-auto">
          <p className="text-xs uppercase tracking-[2px] text-[#60A5FA] font-semibold mb-6">
            A MESSAGE FROM ME
          </p>

          <h2 className="text-[30px] font-bold text-white mb-8">
            The Wall I Hit at Day 60
          </h2>

          <div className="space-y-6 text-base leading-[1.7] text-white/70">
            <p>
              My first two months, I used the dashboard religiously. I validated
              one idea. I even picked a market. I felt like I was making
              progress.
            </p>

            <p className="text-white font-medium">Then reality hit.</p>

            <p>
              I needed to set up a legal entity that had zero connection to my
              name. I spent three weekends researching LLC formations in Wyoming
              versus Delaware versus Estonia. Three weekends I should have spent
              building. That was roughly $2,400 in lost building time (at my
              hourly rate) gone to Googling things I could have had answered in
              minutes.
            </p>

            <p>
              Then the launch. I had 5 hours a week. No launch system. I spent 6
              weeks doing what should have taken 10 days. By the time I shipped,
              a competitor had launched something similar.
            </p>
          </div>

          {/* Highlight quote */}
          <div className="mt-8 border-l-[3px] border-[#60A5FA] bg-[rgba(96,165,250,0.06)] rounded-r-lg py-5 px-6">
            <p className="text-[17px] font-medium text-white italic leading-relaxed">
              "The basic tools show you where the door is. The full system is
              what actually gets you through it before it closes."
            </p>
          </div>

        </div>
      </section>

      {/* ─── 6. Divider ─── */}
      <div className="flex justify-center my-11">
        <div className="w-12 h-[2px] bg-white/20" />
      </div>

      {/* ─── 7. Value Stack ─── */}
      <ValueStack />

      {/* ─── 7b. Social Proof ─── */}
      <section className="px-6 py-12">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-[24px] font-bold text-white mb-8 text-center">
            What Early Members Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                quote: "I validated my first micro-SaaS idea in 3 weeks. The stealth ops checklist alone was worth 100x the price.",
                name: "Director of Ops",
                detail: "Fortune 500 → $4K MRR",
                initials: "DO",
              },
              {
                quote: "The freedom number calculator changed how I see my equity. I realized I was building someone else's dream.",
                name: "Senior PM",
                detail: "$145K → First SaaS revenue in 60 days",
                initials: "SP",
              },
              {
                quote: "I spent two years thinking about starting. This gave me a system I could follow with 5 hours a week.",
                name: "Eng Manager",
                detail: "Built first product while employed",
                initials: "EM",
              },
            ].map((t, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#60A5FA]/20 flex items-center justify-center text-[#60A5FA] text-xs font-bold">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">{t.name}</p>
                    <p className="text-white/40 text-[10px]">{t.detail}</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm italic leading-relaxed">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7c. FAQ Objection Crushing ─── */}
      <section className="px-6 py-12">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-[24px] font-bold text-white mb-3 text-center">
            Questions Every Manager Asks Before Joining
          </h2>
          <p className="text-white/50 text-sm text-center mb-10">
            These are the same objections I had. Here's what changed my mind.
          </p>
          <div className="space-y-4">
            {[
              {
                q: "\"I don't have time. I already work 50+ hours.\"",
                a: "That's exactly why the system exists. I built it for people with 5 hours a week — not 50. The Launch Control tool specifically automates the repetitive tasks that eat your evenings. You're not adding hours to your week. You're redirecting 5 of them from anxiety to action.",
              },
              {
                q: "\"$17.99/month feels like a lot right now.\"",
                a: "I spent $2,400 in wasted time researching LLC formations because I didn't have the Stealth Ops Hub. $17.99/month is $215/year. The price lock saves you $960/year versus what future members pay. You're not spending $17.99 — you're investing $215 to avoid losing $2,400.",
              },
              {
                q: "\"What if my employer finds out?\"",
                a: "This is the #1 fear. It's also why the Stealth Ops Hub exists. Different entity. Different name. Different Stripe. Different hosting. Zero connection to your identity. I've been building for 14 months. Zero detection. The system works.",
              },
              {
                q: "\"I don't know how to code.\"",
                a: "Neither did I when I started. The Idea Pipeline filters specifically for no-code and AI-assisted builds. If you can manage a team and read a P&L, you have more than enough skill to build a micro-SaaS. Technical skills are the smallest part of this.",
              },
              {
                q: "\"What if I join and it doesn't work?\"",
                a: "Email 'refund' within 30 days. You get every cent back. No questions. No forms. No friction. You keep the basic $0.97 membership either way. The risk is entirely on me.",
              },
              {
                q: "\"Can't I just figure this out myself for free?\"",
                a: "Yes. I did. It took me 4 months of frustration, $2,400 in wasted time, and a near-miss with a competitor. You can absolutely do it the hard way. Founding Membership is for people who'd rather skip the 4-month detour.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold text-sm mb-3 leading-snug">{faq.q}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. Price Card ─── */}
      <PriceCard onUpgrade={handleUpgrade} loading={checkoutLoading} />

      {/* ─── 8a. TOTAL VALUE STACK (Brunson Ch 10 — show savings %) ─── */}
      <section className="px-6 py-8">
        <div className="max-w-[720px] mx-auto">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 text-center">
            <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-4">Value Breakdown</p>
            <div className="space-y-2 max-w-md mx-auto mb-4">
              {VALUE_ITEMS.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <span className="text-white/60">{item.name}</span>
                  <span className="text-white/40">{item.value}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 font-semibold">Total Value</span>
                  <span className="text-white/50 line-through">${TOTAL_VALUE}/month</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white font-bold">Your Founding Price</span>
                  <span className="text-[#60A5FA] font-bold text-lg">$17.99/month</span>
                </div>
                <p className="text-success text-xs mt-2">
                  You save ${(TOTAL_VALUE - 17.99).toFixed(2)}/month ({Math.round((1 - 17.99 / TOTAL_VALUE) * 100)}% discount)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8b. ORDER BUMP: Founder's Toolkit (Dotcom Secrets Ch 14) ─── */}
      <section className="px-6 py-6">
        <div className="max-w-[720px] mx-auto">
          <label
            className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
              addToolkit
                ? "bg-[rgba(96,165,250,0.08)] border-[#60A5FA]/40"
                : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
            }`}
          >
            <input
              type="checkbox"
              checked={addToolkit}
              onChange={(e) => setAddToolkit(e.target.checked)}
              className="mt-1.5 w-5 h-5 rounded accent-[#60A5FA] shrink-0 cursor-pointer"
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
                The complete swipe file: 47 email templates, 12 landing page frameworks,
                25 micro-SaaS idea blueprints, the legal entity setup guide, and the
                full Launch Control checklist. Everything I wish I had on Day 1.
              </p>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-white/40 line-through">$97</span>
                <span className="text-[#60A5FA] font-bold">just $37 one-time</span>
                <span className="text-white/30 text-xs">(added to your first payment)</span>
              </div>
              <p className="text-white/30 text-[11px] italic mt-2">
                ☑ Checked by default — uncheck to skip
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* ── 9. Scarcity + Countdown ── */}
      <section className="px-6 py-8">
        <div className="max-w-[720px] mx-auto text-center">
          {/* Countdown Timer */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-6">
            {[
              { label: "Days", value: "14" },
              { label: "Hours", value: "23" },
              { label: "Mins", value: "47" },
              { label: "Secs", value: "12" },
            ].map((unit) => (
              <div key={unit.label} className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#60A5FA] tabular-nums" id={`countdown-${unit.label}`}>
                    {unit.value}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-white/40">{unit.label}</span>
              </div>
            ))}
          </div>
          <p className="text-base font-bold text-[#60A5FA] mb-2">
            Founding Member Spots Close In:
          </p>
          <p className="text-base text-white/70 mt-2">
            Limited to the first 100 Founding Members. When founding closes,
            this page and this price disappear permanently.
          </p>
        </div>
      </section>

      {/* ─── 10. Guarantee Box ─── */}
      <GuaranteeBox />

      {/* ─── 10a. WHAT HAPPENS IF YOU DO NOTHING (Brunson Ch 21) ─── */}
      <section className="px-6 py-8">
        <div className="max-w-[720px] mx-auto text-center">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
            <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-3">
              What Happens If You Do Nothing?
            </p>
            <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
              Nothing changes. You keep your job. You keep your 0.5% equity.{" "}
              <strong className="text-white">6 months from now</strong>, you'll
              be in the same spot — except the founding price will be gone.
              You'll wish you'd locked it in when you had the chance.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 11. Second CTA ─── */}
      <section className="px-6 py-12">
        <div className="max-w-[440px] mx-auto text-center">
          <button
            onClick={handleUpgrade}
            disabled={checkoutLoading}
            className="w-full bg-[#60A5FA] hover:bg-[#93c5fd] text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-[0_4px_24px_rgba(96,165,250,0.25)] hover:shadow-[0_4px_32px_rgba(96,165,250,0.35)] hover:-translate-y-[1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {checkoutLoading ? (
              "Loading..."
            ) : (
              <span className="flex flex-col items-center leading-tight">
                <span>Become a Founding Member</span>
                <span className="text-sm font-normal opacity-80">$17.99/mo</span>
              </span>
            )}
            {!checkoutLoading && <ArrowRight className="w-5 h-5" />}
          </button>
          <p className="text-[13px] text-white/40 mt-4">
            30-day money-back guarantee. Locked for life.
          </p>
        </div>
      </section>

      {/* ─── 12. Email Notice + Dashboard Link ─── */}
      <section className="px-6 py-8">
        <div className="max-w-[720px] mx-auto">
          <div className="bg-[rgba(96,165,250,0.06)] border border-white/10 rounded-xl p-6 text-center">
            <h4 className="text-base font-semibold text-white mb-3">
              Important: Make Sure You Get My Emails
            </h4>
            <p className="text-sm text-white/70 mb-4 leading-relaxed">
              I just sent you a welcome email with your login details and next
              steps. If you don't see it in the next few minutes, check your spam
              or promotions folder.
            </p>
            <p className="text-sm text-white/70 mb-4 leading-relaxed">
              To make sure nothing gets lost, add this address to your contacts
              or favorites:
            </p>

            {/* Email highlight */}
            <span className="inline-block bg-[rgba(96,165,250,0.12)] text-[#60A5FA] font-mono text-[15px] font-semibold px-4 py-1.5 rounded-md mb-4">
              escape@invisibleexit.com
            </span>

            <p className="text-[13px] text-white/40 leading-relaxed">
              Gmail users: drag the email from Promotions to Primary. Outlook
              users: right-click and select "Always move to Inbox."
            </p>

            {/* Dashboard link */}
            <div className="border-t border-white/10 mt-6 pt-5">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-[#60A5FA] text-sm font-semibold hover:text-[#93c5fd] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to your dashboard now
              </Link>
              <p className="text-[12px] text-white/40 mt-2">
                Use this link if you didn't receive the welcome email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 13. Decline Link ─── */}
      <section className="px-6 py-8">
        <div className="text-center">
          <Link
            to="/oto/downsell"
            onClick={handleDecline}
            className="text-sm text-white/40 underline hover:text-white/60 transition-colors"
          >
            No thanks, I'll start with limited access and pay full price later
            if I change my mind.
          </Link>
        </div>
      </section>

      {/* ─── 13.5. What Happens If You Do Nothing (Brunson Ch 21) ─── */}
      <section className="px-6 py-8">
        <div className="max-w-xl mx-auto bg-white/[0.03] border border-white/10 rounded-xl p-6 text-center">
          <p className="text-white/40 text-xs uppercase tracking-wide font-semibold mb-3">
            What happens if you do nothing?
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            Your $0.97/month tools will still work. Your dashboard will still run. But{' '}
            <strong className="text-white/80">the founding price expires in {14 - Math.floor((Date.now() - new Date('2026-07-06').getTime()) / (1000 * 60 * 60 * 24)) > 0 ? 'a few' : '0'} days</strong>.
            After that, it's $9.99/month forever. And the founding wall — your name on the list of
            people who believed first — closes permanently.
          </p>
          <p className="text-primary-light text-sm font-semibold mt-3">
            Every day you wait is another day of $9.99/month you'll never get back.
          </p>
        </div>
      </section>

      {/* ─── 14. Footer ─── */}
      <Footer />
    </div>
  );
};

export default OTOFounding;
