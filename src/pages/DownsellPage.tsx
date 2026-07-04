import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, Shield } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const DownsellPage = () => {
  return (
    <div className="min-h-screen bg-[hsl(222_47%_11%)]">
      <SEOHead
        title="Special Offer | Invisible Exit"
        description="Get all 5 tools at a reduced rate."
        url="/oto/downsell"
        noindex
      />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 md:py-28">
        <div className="text-center mb-12">
          <p className="text-eyebrow text-primary-light mb-6">Wait — Before You Go...</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            I understand. $17.99 is a stretch right now.
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            You still want the full system. The entity separation tools. The launch automation.
            The content calendar. Here's what I can do:
          </p>
        </div>

        {/* Offer card */}
        <div className="relative bg-white/5 border border-primary/30 rounded-2xl p-8 sm:p-10 text-center shadow-glow mb-8">
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold uppercase tracking-[1.5px] px-4 py-1.5 rounded-full whitespace-nowrap">
            ONE-TIME OFFER
          </span>

          <p className="text-base text-white/60 mt-4 mb-3">
            Not ready for founding? Get the full toolkit at the standard rate:
          </p>

          <div className="mb-3">
            <span className="text-5xl font-extrabold text-white">$9.99</span>
            <span className="text-lg text-white/50 ml-2">/month</span>
          </div>

          <p className="text-sm text-primary-light mb-8">
            All 5 tools. No founding perks. No price lock. Cancel anytime.
          </p>

          <div className="space-y-3 mb-8 text-left max-w-sm mx-auto">
            {[
              "FYM Dashboard (freedom number calculator)",
              "Idea Pipeline (500+ ideas + 48h validation)",
              "Stealth Ops Hub (entity + compliance)",
              "Launch Control (go-live automation)",
              "Brand Manager (faceless content tools)",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-success" />
                </div>
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>

          <Link
            to="/?checkout=standard"
            className="w-full max-w-sm mx-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 min-h-[52px]"
          >
            Get All 5 Tools for $9.99/mo
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-xs text-white/40 mt-4">
            Secure payment via Stripe. Cancel anytime.
          </p>
        </div>

        {/* Guarantee */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center mb-8">
          <Shield className="w-7 h-7 text-primary-light mx-auto mb-3" />
          <p className="text-white/70 text-sm">
            30-day money-back guarantee. If it's not worth it, email "refund" and get every cent back.
          </p>
        </div>

        {/* Decline link */}
        <div className="text-center">
          <Link
            to="/dashboard"
            className="text-sm text-white/40 underline hover:text-white/60 transition-colors"
          >
            No thanks, I'll stick with the $0.97 basic plan
          </Link>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/oto/founding"
            className="inline-flex items-center gap-1.5 text-sm text-primary-light/60 hover:text-primary-light transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Actually, show me the Founding Member offer again
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DownsellPage;
