import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const OTOFounding = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    document.title = "One-Time Offer: Founding Member | Invisible Exit";

    if (sessionId) {
      supabase.functions
        .invoke("verify-session", { body: { session_id: sessionId } })
        .then(({ data }) => {
          if (data?.status === "paid") {
            setPaymentConfirmed(true);
          }
        });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen">
      {/* Payment Confirmation Banner */}
      {paymentConfirmed && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-4">
          <p className="text-center text-green-800 font-medium">
            Payment confirmed. Your FYM Dashboard is being set up. Check your email for login details.
          </p>
        </div>
      )}

      {/* Section 1: Purchase Confirmation */}
      <section className="bg-white pt-20 pb-12 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            You're In. Your FYM Dashboard Is Being Set Up Right Now.
          </h1>
          <p className="text-gray-600 text-lg">
            Check your email for login details. Your dashboard will be ready in under 60 seconds.
          </p>
        </div>
      </section>

      {/* Section 2: OTO Hook */}
      <section className="bg-gray-50 pt-16 pb-8 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Before You Go to Your Dashboard...
          </h2>
          <p className="text-gray-600 text-lg">
            I have a one-time offer that's only available right now, on this page. Once you leave, this pricing disappears.
          </p>
        </div>
      </section>

      {/* Section 2b: OTO Video */}
      <section className="bg-gray-50 pb-16 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="relative w-full overflow-hidden rounded-xl shadow-lg" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/PLACEHOLDER"
              title="Why 46 Managing Directors Already Locked In"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            Watch: Why 46 Managing Directors Already Locked In
          </p>
        </div>
      </section>

      {/* Section 3: OTO Pitch */}
      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="text-gray-700 text-lg leading-[1.7] space-y-6">
            <p>
              FYM Dashboard shows you where you are. But what if you also had the tools, the community, and the strategy calls to get there faster?
            </p>
            <p>
              I took everything I built, every tool, every workflow, every lesson from building businesses invisibly, and packaged it into Founding Member.
            </p>
            <p>
              It gives you everything in FYM Dashboard, plus the complete toolkit to go from 'tracking' to 'exiting':
            </p>
          </div>
          <ul className="space-y-4 mt-8">
            {[
              "Idea Pipeline: validate new micro-SaaS ideas in 48 hours with AI analysis and go/no-go decision trees",
              "Stealth Ops Hub: legal structure templates, anonymity playbook, compliance database. Everything to stay invisible.",
              "Launch Control: step-by-step launch playbook, content calendar, go-live checklist. Ship faster than your day job allows.",
              "Brand Manager: positioning, visual identity, website templates, voice guide. Build organic YouTube and Reddit presence.",
              "Private community of Managing Directors building the same way you are",
              "Monthly masterclass on invisible income strategies",
              "Beta access to every new feature before anyone else",
              "Annual 1:1 strategy call to review your exit plan",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-[#60A5FA] shrink-0 mt-1" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-700 text-lg leading-[1.7] mt-8">
            After we close the founding round, this goes to $97/mo. Right now, you lock it in for life.
          </p>
        </div>
      </section>

      {/* Section 4: OTO Value Stack */}
      <section className="bg-[#1B2A4A] py-20 px-6">
        <div className="mx-auto max-w-xl">
          <div className="rounded-xl border border-white/10 bg-white/5 p-8">
            <ul className="space-y-4 mb-8">
              {[
                { feature: "FYM Dashboard (already yours)", value: "$12/mo" },
                { feature: "Idea Pipeline", value: "$15/mo" },
                { feature: "Stealth Ops Hub", value: "$25/mo" },
                { feature: "Launch Control", value: "$18/mo" },
                { feature: "Brand Manager", value: "$27/mo" },
                { feature: "Private Community", value: "$49/mo" },
                { feature: "Monthly Masterclass", value: "$97/mo" },
                { feature: "Beta Access", value: "$29/mo" },
                { feature: "Annual Strategy Call ($500/year)", value: "$42/mo" },
              ].map((item) => (
                <li key={item.feature} className="flex items-center justify-between gap-4">
                  <span className="text-white/80">{item.feature}</span>
                  <span className="text-white/40 text-sm whitespace-nowrap">{item.value}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-white/10 pt-6 text-center">
              <p className="text-white/70 text-lg mb-1">
                Total Value: <span className="font-bold text-white text-2xl">$314/mo</span>
              </p>
              <p className="text-white/40 mb-1">
                Normal Price After Founding: <span className="line-through">$97/mo</span>
              </p>
              <p className="text-3xl font-bold text-[#60A5FA] mb-2">
                Your Founding Price: $19/mo, locked for life
              </p>
              <p className="text-white/50 text-sm">
                80% savings. 54 of 100 founding spots remaining.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Guarantee + CTA Buttons */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            Same 30-day no-questions guarantee. If Founding Member isn't worth it, email 'refund' and get every cent back.
          </p>
          <Link
            to="/checkout/founding"
            className="inline-block w-full bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors mb-6"
          >
            Yes, Lock In My Founding Price at $19/mo
          </Link>
          <div>
            <Link
              to="/login"
              className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
            >
              No thanks, take me to my dashboard
            </Link>
          </div>
          {sessionId && (
            <div className="mt-4">
              <Link
                to="/login"
                className="text-[#60A5FA] hover:underline text-sm font-medium"
              >
                Skip and go to dashboard
              </Link>
            </div>
          )}
          <p className="text-gray-400 text-xs mt-6">
            Limited founding spots. This offer is only available on this page.
          </p>
        </div>
      </section>
    </div>
  );
};

export default OTOFounding;
