import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Infinity,
  Crown,
  Compass,
  FlaskConical,
  Lock,
  ShieldCheck,
  Check,
  Play,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getFoundingSpotsLeft, getFoundingMemberNumber } from "@/lib/foundingCountdown";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const OTOFounding = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const foundingSpotsLeft = getFoundingSpotsLeft();
  const memberNumber = getFoundingMemberNumber();

  useEffect(() => {
    document.title = "Founding Member Invitation | Invisible Exit";

    if (sessionId) {
      supabase.functions
        .invoke("verify-session", { body: { session_id: sessionId } })
        .then(({ data }) => {
          if (data?.status === "paid") setPaymentConfirmed(true);
        });
    }
  }, [sessionId]);

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: {
            tier: "founding",
            returnUrl: window.location.origin + "/confirmation",
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

  const ctaLabel = checkoutLoading
    ? "Loading..."
    : `Become Founding Member #${memberNumber} — $17.99/mo Locked for Life`;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Payment Confirmation Banner */}
      {paymentConfirmed && (
        <div className="fixed top-[60px] left-0 right-0 z-40 bg-green-50 border-b border-green-200 px-6 py-3">
          <p className="text-center text-green-800 font-medium text-sm">
            Payment confirmed. Your access is being set up now.
          </p>
        </div>
      )}

      {/* Section 1: Hero / Acknowledgment */}
      <section className="bg-[#1B2A4A] pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-blue-400 text-sm tracking-widest uppercase mb-6">
            YOU JUST TOOK THE FIRST STEP
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto mb-6">
            You Found the Door. Here's the Key to Open It Faster.
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12">
            You're one of the few who actually did something. Most people dream
            about escape. You just invested in it.
          </p>

          {/* Video Placeholder */}
          <div className="max-w-3xl mx-auto mb-4">
            <div
              className="aspect-video rounded-2xl border border-white/10 overflow-hidden bg-slate-800 flex items-center justify-center"
              data-video-id="oto-founding-video"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white/30 ml-1" />
                </div>
                <span className="text-white/30 text-sm">
                  Video coming soon
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-white/50 text-center">
            Adrian explains what Founding Members get (2 min)
          </p>
        </div>
      </section>

      {/* Section 2: The "Real Talk" Bridge */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-slate-400 text-sm tracking-widest uppercase mb-8">
            A MESSAGE FROM ADRIAN
          </p>
          <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
            <p>
              Here's what I learned after building my first tool. The dashboard
              shows you where you are. But knowing your number and actually
              reaching your number are two different things.
            </p>
            <p>
              I needed more than a calculator. I needed to validate ideas before
              wasting weekends. I needed legal structures to keep everything
              invisible. I needed a launch system that fits into 5 hours a week.
              I needed a brand that had zero connection to my real name.
            </p>
            <p>
              So I built all of it. And I'm inviting the first 100 people to use
              everything, shape the roadmap, and lock in a price that will never
              increase. I'm calling them Founding Members.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: What Founding Members Get */}
      <section className="bg-[#1B2A4A] py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-blue-400 text-sm tracking-widest uppercase mb-4">
              FOUNDING MEMBER EXCLUSIVES
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              What Only the First 100 Get
            </h2>
            <p className="text-white/60">
              These are not available to anyone else. Ever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Unlimited Everything */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <Infinity className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">
                Unlimited Everything
              </h3>
              <p className="text-white/70 mb-4">
                No caps. No limits. Unlimited scenarios in FYM. Unlimited ideas
                in the Pipeline. Full audit in Stealth Ops. Full automation in
                Launch Control. Complete content calendar in Brand Manager. Use
                every tool to its full potential.
              </p>
              <p className="text-blue-400 text-sm font-semibold">
                $97/month value
              </p>
            </div>

            {/* Card 2: Founding Member Wall */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <Crown className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">
                Founding Member Wall
              </h3>
              <p className="text-white/70 mb-4">
                Your name. Permanently listed as one of the original 100 who
                started Invisible Exit. When this grows to 10,000 members,
                you'll still be there. This is not a feature. It's your place in
                history.
              </p>
              <p className="text-blue-400 text-sm font-semibold">
                Exclusive, cannot be purchased later
              </p>
            </div>

            {/* Card 3: Shape the Roadmap */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <Compass className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">
                Shape the Roadmap
              </h3>
              <p className="text-white/70 mb-4">
                Founding Members vote on what gets built next. Your feature
                requests go to the top of the queue. You're not a user. You're a
                co-creator.
              </p>
              <p className="text-blue-400 text-sm font-semibold">
                $29/month value
              </p>
            </div>

            {/* Card 4: Beta Access */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <FlaskConical className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">
                Beta Access to Everything
              </h3>
              <p className="text-white/70 mb-4">
                Every new tool. Every new feature. Every integration. Weeks
                before anyone else. You see the future of Invisible Exit before
                the public does.
              </p>
              <p className="text-blue-400 text-sm font-semibold">
                $19/month value
              </p>
            </div>

            {/* Card 5: Price Locked (full width on md) */}
            <div className="md:col-span-2 md:max-w-lg md:mx-auto bg-white/5 border border-white/10 rounded-2xl p-8">
              <Lock className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">
                Price Locked for Life
              </h3>
              <p className="text-white/70 mb-4">
                $17.99/month. Today. Tomorrow. Next year. Five years from now.
                While everyone else pays the public price after founding closes.
                Your rate never changes.
              </p>
              <p className="text-blue-400 text-sm font-semibold">
                Save $960/year vs. future pricing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Value Stack */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            The Math
          </h2>
          <p className="text-slate-500 mb-12">
            What Founding Members get, and what it's worth.
          </p>

          <div className="space-y-4 text-left">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <span className="text-slate-700">
                  Unlimited access to all 5 tools
                </span>
              </div>
              <span className="text-slate-400 shrink-0">$97/mo</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <span className="text-slate-700">
                  Founding Member Wall (permanent)
                </span>
              </div>
              <span className="text-slate-400 shrink-0 italic">exclusive</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <span className="text-slate-700">Product Roadmap Vote</span>
              </div>
              <span className="text-slate-400 shrink-0">$29/mo</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <span className="text-slate-700">
                  Beta Access (early features)
                </span>
              </div>
              <span className="text-slate-400 shrink-0">$19/mo</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <span className="text-slate-700">
                  Lifetime Price Lock (save $960/year)
                </span>
              </div>
              <span className="text-slate-400 shrink-0">$80/mo</span>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-8 pt-6">
            <p className="text-slate-400 mb-1">
              Total value:{" "}
              <span className="line-through">$225+/month</span>
            </p>
            <p className="text-3xl font-bold text-blue-500 mb-1">
              $17.99/month
            </p>
            <p className="text-sm text-slate-500">
              Locked for life. After founding closes: $97.99/month.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Scarcity */}
      <section className="bg-[#1B2A4A] py-16 px-6">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-6xl md:text-8xl font-bold text-blue-400 mb-2">
            {foundingSpotsLeft}
          </p>
          <p className="text-xl text-white/70 mb-3">
            of 100 founding spots remaining
          </p>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            When they're gone, this page disappears. The founding price is gone
            permanently.
          </p>
        </div>
      </section>

      {/* Section 6: Primary CTA */}
      <section className="bg-[#1B2A4A] pb-8 px-6">
        <div className="mx-auto max-w-md text-center">
          <button
            onClick={handleUpgrade}
            disabled={checkoutLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 px-10 rounded-xl text-lg shadow-lg shadow-blue-500/20 transition-colors disabled:opacity-50"
          >
            {ctaLabel}
          </button>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Lock className="w-3.5 h-3.5 text-white/40" />
            <span className="text-white/40 text-sm">
              Secure payment via Stripe
            </span>
          </div>
        </div>
      </section>

      {/* Section 7: Guarantee */}
      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Zero Risk</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Try the full Founding Member toolkit for 30 days. If it's not worth
            it, email the word 'refund' and get every cent back. No questions.
            No hassle. No hard feelings.
          </p>
          <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mt-6" />
        </div>
      </section>

      {/* Section 8: Second CTA + Soft Decline */}
      <section className="bg-[#1B2A4A] py-16 px-6">
        <div className="mx-auto max-w-md text-center">
          <button
            onClick={handleUpgrade}
            disabled={checkoutLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 px-10 rounded-xl text-lg shadow-lg shadow-blue-500/20 transition-colors disabled:opacity-50"
          >
            {ctaLabel}
          </button>
          <div className="mt-8">
            <Link
              to="/confirmation"
              className="text-white/40 hover:text-white/60 text-sm underline transition-colors"
            >
              No thanks, take me to my dashboard
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OTOFounding;
