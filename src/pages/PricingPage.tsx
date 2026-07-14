import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Shield, Zap, Users, Video, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

/**
 * /pricing — Fixes the 404 that was in the schema markup.
 * Shows the full value ladder: Free → $0.97/mo → $7 tripwire → $47/mo Pro.
 * Brunson DotCom Secrets Ch 1 (Value Ladder) + Ch 7 (One Funnel One Offer).
 */

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Calculate your freedom number. Start the journey.",
    features: [
      "Freedom Number Calculator (90 seconds)",
      "Personalized exit timeline",
      "Newsletter (2x/week)",
    ],
    cta: "Calculate for Free",
    href: "/freedom",
    highlight: false,
  },
  {
    name: "Starter",
    price: "$0.97",
    period: "/month",
    description: "All 5 tools. Everything you need to build invisible revenue.",
    features: [
      "FYM Dashboard (exit timeline tracker)",
      "Idea Pipeline (500+ validated ideas)",
      "Stealth Ops Hub (compliance + anonymity)",
      "Launch Control (5-hour launch system)",
      "Brand Manager (faceless content)",
      "30-day money-back guarantee",
    ],
    cta: "Start for $0.97/mo",
    href: "/start",
    highlight: true,
    badge: "Founding price — locked for life",
  },
  {
    name: "Pro",
    price: "$47",
    period: "/month",
    description: "Coaching + community. For builders who want velocity.",
    features: [
      "Everything in Starter",
      "Private community of corporate managers",
      "Weekly group coaching calls",
      "Idea validation reports (3/month)",
      "Monthly MRR audits",
      "Early access to new tools",
    ],
    cta: "Join Pro",
    href: "/pro",
    highlight: false,
  },
];

const PricingPage = () => {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleStarterCheckout = async () => {
    trackEvent("pricing_page_starter_clicked");
    setLoadingTier("starter");
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier: "starter", returnUrl: window.location.origin + "/checkout/success" },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      toast.error("Could not start checkout. Please try again.");
      console.error(err);
    } finally {
      setLoadingTier(null);
    }
  };

  const handleProCheckout = async () => {
    trackEvent("pricing_page_pro_clicked");
    setLoadingTier("pro");
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier: "standard", returnUrl: window.location.origin + "/checkout/success" },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      toast.error("Could not start checkout. Please try again.");
      console.error(err);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Pricing | Invisible Exit"
        description="Simple pricing. Start for $0.97/month (founding price, locked for life). Pro is $47/month with coaching and community. 30-day money-back guarantee."
        url="/pricing"
      />
      <Navbar />

      <main>
        <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20">
          <div className="container-narrow text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Simple Pricing.{" "}
              <span className="text-gradient-light">Build Your Exit.</span>
            </h1>
            <p className="text-body-lg text-white/60 max-w-xl mx-auto mb-8">
              Start for less than a dollar. Founding members lock in $0.97/month for life.
            </p>
            <div className="inline-flex items-center gap-3 bg-success/10 border border-success/20 rounded-full px-5 py-2.5">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm text-success font-medium">
                30-day money-back guarantee on all plans
              </span>
            </div>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="bg-white section-normal border-t border-border">
          <div className="container-standard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative card-base p-6 sm:p-8 transition-all ${
                    tier.highlight
                      ? "border-2 border-primary shadow-[0_8px_40px_rgba(59,130,246,0.12)] md:-translate-y-3"
                      : "border border-border"
                  }`}
                >
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-block bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full whitespace-nowrap">
                        ★ {tier.badge}
                      </span>
                    </div>
                  )}

                  <h3 className="text-foreground font-bold text-lg mb-1">{tier.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{tier.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                    <span className="text-muted-foreground text-sm font-normal">{tier.period}</span>
                  </div>

                  <div className="space-y-2.5 mb-8">
                    {tier.features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>

                  {tier.name === "Starter" ? (
                    <button
                      onClick={handleStarterCheckout}
                      disabled={loadingTier === "starter"}
                      className={`w-full inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3.5 rounded-xl transition-all min-h-[48px] ${
                        tier.highlight
                          ? "bg-primary text-white hover:bg-primary-hover shadow-[0_4px_20px_rgba(59,130,246,0.2)]"
                          : "bg-surface text-foreground border border-border hover:border-primary/40"
                      } disabled:opacity-50`}
                    >
                      {loadingTier === "starter" ? (
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <>
                          {tier.cta}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : tier.name === "Pro" ? (
                    <button
                      onClick={handleProCheckout}
                      disabled={loadingTier === "pro"}
                      className="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3.5 rounded-xl transition-all min-h-[48px] bg-surface text-foreground border border-border hover:border-primary/40 disabled:opacity-50"
                    >
                      {loadingTier === "pro" ? (
                        <span className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                      ) : (
                        <>
                          {tier.cta}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      to={tier.href}
                      onClick={() => trackEvent("pricing_page_free_clicked")}
                      className="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3.5 rounded-xl transition-all bg-surface text-foreground border border-border hover:border-primary/40"
                    >
                      {tier.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Higher tiers note */}
            <div className="max-w-2xl mx-auto mt-12 text-center">
              <div className="bg-surface rounded-xl p-6 border border-border">
                <p className="text-eyebrow text-muted-foreground mb-3">Higher Tiers</p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                  <Link to="/intensive" className="text-primary hover:text-primary-hover font-medium">
                    1-on-1 Intensive ($2K) →
                  </Link>
                  <Link to="/weekend-workshop" className="text-primary hover:text-primary-hover font-medium">
                    Weekend Workshop ($97) →
                  </Link>
                  <Link to="/free-book" className="text-primary hover:text-primary-hover font-medium">
                    Free Book (just shipping) →
                  </Link>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="max-w-xl mx-auto mt-12 text-center">
              <div className="inline-flex items-center gap-3 bg-success/10 border border-success/20 rounded-full px-6 py-3">
                <Shield className="w-5 h-5 text-success" />
                <span className="text-sm font-semibold text-success">
                  30-Day Money-Back Guarantee · Cancel Anytime
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
