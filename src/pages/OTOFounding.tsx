import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Check, LayoutDashboard } from "lucide-react";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import VideoPlaceholder from "@/components/oto/VideoPlaceholder";
import ValueStack from "@/components/oto/ValueStack";
import PriceCard from "@/components/oto/PriceCard";
import GuaranteeBox from "@/components/oto/GuaranteeBox";

const DASHBOARD_URL = "https://app.invisibleexit.com/dashboard";

const OTOFounding = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [foundingCount, setFoundingCount] = useState<number | null>(null);

  const foundingSpotsLeft =
    foundingCount !== null ? Math.max(0, 100 - foundingCount) : 54;

  useEffect(() => {
    document.title = "Founding Member Invitation | Invisible Exit";
    trackEvent("oto_page_viewed");

    supabase.rpc("get_founding_member_count").then(({ data }) => {
      if (data !== null) setFoundingCount(data);
    });

    if (sessionId) {
      supabase.functions
        .invoke("verify-session", { body: { session_id: sessionId } })
        .then(({ data }) => {
          if (data?.status === "paid") setPaymentConfirmed(true);
        });
    }
  }, [sessionId]);

  const handleUpgrade = async () => {
    trackEvent("oto_cta_clicked");
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

  const handleVideoClick = () => {
    trackEvent("oto_video_clicked");
    toast.info("Video coming soon.");
  };

  return (
    <div className="min-h-screen bg-[#1B2A4A]">
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
              <a
                href={DASHBOARD_URL}
                className="underline hover:text-white transition-colors"
              >
                go directly to your dashboard
              </a>
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
          <h1 className="text-4xl font-bold text-white leading-tight mb-6 max-w-2xl mx-auto">
            You Just Got the Map. Here's What Separates Those Who{" "}
            <span className="text-[#60A5FA]">Escape in 90 Days</span> from
            Those Still Planning a Year Later.
          </h1>

          {/* Subtitle */}
          <p className="text-[17px] text-white/70 max-w-[560px] mx-auto leading-relaxed">
            I have something for the first {foundingSpotsLeft} members only.
            Read this once. It won't appear again.
          </p>
        </div>
      </section>

      {/* ─── 3. Video Placeholder ─── */}
      <section className="px-6 pb-12">
        <VideoPlaceholder onPlayClick={handleVideoClick} />
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

          <p className="mt-8 text-base leading-[1.7] text-white/70">
            That's why I built the complete toolkit. And that's why I'm offering
            it to you right now, as one of the first {foundingSpotsLeft} people,
            at a price I will never offer again.
          </p>
        </div>
      </section>

      {/* ─── 6. Divider ─── */}
      <div className="flex justify-center my-11">
        <div className="w-12 h-[2px] bg-white/20" />
      </div>

      {/* ─── 7. Value Stack ─── */}
      <ValueStack />

      {/* ─── 8. Price Card ─── */}
      <PriceCard onUpgrade={handleUpgrade} loading={checkoutLoading} />

      {/* ─── 9. Scarcity Note ─── */}
      <section className="px-6 py-8">
        <div className="max-w-[720px] mx-auto text-center">
          <p className="text-base font-bold text-[#60A5FA]">
            Limited to the first 100 Founding Members.
          </p>
          <p className="text-base text-white/70 mt-2">
            When founding closes, this page and this price disappear
            permanently.
          </p>
        </div>
      </section>

      {/* ─── 10. Guarantee Box ─── */}
      <GuaranteeBox />

      {/* ─── 11. Second CTA ─── */}
      <section className="px-6 py-12">
        <div className="max-w-[440px] mx-auto text-center">
          <button
            onClick={handleUpgrade}
            disabled={checkoutLoading}
            className="w-full bg-[#60A5FA] hover:bg-[#93c5fd] text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-[0_4px_24px_rgba(96,165,250,0.25)] hover:shadow-[0_4px_32px_rgba(96,165,250,0.35)] hover:-translate-y-[1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {checkoutLoading
              ? "Loading..."
              : "Become a Founding Member — $17.99/mo"}
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
              <a
                href={DASHBOARD_URL}
                className="inline-flex items-center gap-2 text-[#60A5FA] text-sm font-semibold hover:text-[#93c5fd] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to your dashboard now
              </a>
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
          <a
            href={DASHBOARD_URL}
            onClick={handleDecline}
            className="text-sm text-white/40 underline hover:text-white/60 transition-colors"
          >
            No thanks, I'll start with limited access and pay full price later
            if I change my mind.
          </a>
        </div>
      </section>

      {/* ─── 14. Footer ─── */}
      <Footer />
    </div>
  );
};

export default OTOFounding;
