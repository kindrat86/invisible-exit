import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, CheckCircle, Lock, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const COMPARISON = [
  {
    feature: "FYM Dashboard",
    starter: "1 scenario, basic calculator",
    full: "Unlimited scenarios, trends, export",
  },
  {
    feature: "Idea Pipeline",
    starter: "3 ideas, basic validation",
    full: "Unlimited ideas, AI analysis, scoring",
  },
  {
    feature: "Stealth Ops Hub",
    starter: "Basic invisibility score",
    full: "Full audit, fixes, compliance playbook",
  },
  {
    feature: "Launch Control",
    starter: "View-only checklist",
    full: "Full launch automation, tracking",
  },
  {
    feature: "Brand Manager",
    starter: "Basic templates",
    full: "Content calendar, YouTube scripts, Reddit playbooks",
  },
  {
    feature: "Private Community",
    starter: null,
    full: "Access to founding member community",
  },
  {
    feature: "Monthly Masterclass",
    starter: null,
    full: "Live sessions with Adrian",
  },
  {
    feature: "Beta Features",
    starter: null,
    full: "First access to everything new",
  },
];

const OTOFounding = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [foundingCount, setFoundingCount] = useState<number | null>(null);

  const foundingSpotsLeft = foundingCount !== null ? Math.max(0, 100 - foundingCount) : null;
  const isFoundingAvailable = foundingSpotsLeft === null || foundingSpotsLeft > 0;
  const upgradePrice = isFoundingAvailable ? "$17.99" : "$97.99";
  const upgradeTier = isFoundingAvailable ? "founding" : "standard";
  const upgradePriceLabel = isFoundingAvailable
    ? "$17.99/mo, locked for life"
    : "$97.99/month";

  useEffect(() => {
    document.title = "Unlock Full Toolkit | Invisible Exit";

    // Fetch founding member count
    supabase.rpc("get_founding_member_count").then(({ data }) => {
      if (data !== null) setFoundingCount(data);
    });

    // Verify payment if session_id present
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
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier: upgradeTier, returnUrl: window.location.origin + "/confirmation" },
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
    <div className="min-h-screen bg-white">
      {/* Payment Confirmation Banner */}
      {paymentConfirmed && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-4">
          <p className="text-center text-green-800 font-medium">
            Payment confirmed. Your Starter access is being set up now.
          </p>
        </div>
      )}

      {/* Section 1: Confirmation + Hook */}
      <section className="pt-20 pb-12 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            You're In. But Before You Go...
          </h1>
          <p className="text-gray-600 text-lg">
            You just unlocked simplified access to all 5 tools. Right now — only on this page — you can unlock <strong>everything</strong> at founding member pricing.
          </p>
        </div>
      </section>

      {/* Section 2: Side-by-Side Comparison */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Starter vs Full Toolkit
          </h2>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
              <div className="p-4 text-sm font-medium text-gray-500">Feature</div>
              <div className="p-4 text-sm font-medium text-gray-500 text-center">
                Starter<br />
                <span className="text-gray-900 font-bold">$0.97/mo</span>
              </div>
              <div className="p-4 text-sm font-medium text-[#1B2A4A] text-center bg-blue-50">
                Full Toolkit<br />
                <span className="text-[#1B2A4A] font-bold">{upgradePrice}/mo</span>
              </div>
            </div>
            {/* Rows */}
            {COMPARISON.map((row) => (
              <div key={row.feature} className="grid grid-cols-3 border-b border-gray-100 last:border-b-0">
                <div className="p-4 text-sm font-medium text-gray-900">{row.feature}</div>
                <div className="p-4 text-sm text-center">
                  {row.starter ? (
                    <span className="text-gray-500">{row.starter}</span>
                  ) : (
                    <X className="w-4 h-4 text-gray-300 mx-auto" />
                  )}
                </div>
                <div className="p-4 text-sm text-center bg-blue-50/50">
                  <span className="text-gray-700">{row.full}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Scarcity + Price */}
      <section className="bg-[#1B2A4A] py-16 px-6">
        <div className="mx-auto max-w-xl text-center">
          {isFoundingAvailable ? (
            <>
              <p className="text-[#60A5FA] text-sm tracking-widest uppercase mb-4">FOUNDING MEMBER PRICING</p>
              <p className="text-4xl font-bold text-white mb-2">
                {upgradePrice}<span className="text-lg font-normal text-white/50">/month, locked for life</span>
              </p>
              <p className="text-white/60 text-base mb-2">
                After founding closes: $97.99/month
              </p>
              {foundingSpotsLeft !== null && (
                <div className="mt-4 mb-8">
                  <p className="text-[#60A5FA] font-bold text-lg">{foundingSpotsLeft} of 100 founding spots remaining</p>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2 max-w-xs mx-auto">
                    <div
                      className="bg-[#60A5FA] h-2 rounded-full transition-all"
                      style={{ width: `${((100 - foundingSpotsLeft) / 100) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-white/60 text-sm tracking-widest uppercase mb-4">FULL TOOLKIT ACCESS</p>
              <p className="text-4xl font-bold text-white mb-2">
                $97.99<span className="text-lg font-normal text-white/50">/month</span>
              </p>
              <p className="text-white/60 text-base mb-8">
                Founding member spots are filled. Standard pricing applies.
              </p>
            </>
          )}

          <button
            onClick={handleUpgrade}
            disabled={checkoutLoading}
            className="w-full max-w-md bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-bold text-lg px-10 py-5 rounded-xl transition-colors disabled:opacity-50 mb-4"
          >
            {checkoutLoading ? "Loading..." : `Unlock Full Toolkit — ${upgradePriceLabel}`}
          </button>
          <div>
            <Link
              to="/confirmation"
              className="text-white/40 hover:text-white/60 text-sm transition-colors"
            >
              No thanks, I'll start with Starter
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Guarantee */}
      <section className="bg-white py-12 px-6">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-gray-600 text-base">
            30-day money-back guarantee. If the Full Toolkit isn't worth it, email 'refund' and get every cent back. No questions.
          </p>
        </div>
      </section>
    </div>
  );
};

export default OTOFounding;
