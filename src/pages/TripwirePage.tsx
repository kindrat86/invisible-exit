import { Link } from "react-router-dom";
import { ArrowRight, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

/**
 * The original Blueprint checkout promised assets that are not present in the
 * repository or any configured fulfillment system. Keep the route stable for
 * old links, but do not accept payment until a verified deliverable exists.
 */
const TripwirePage = () => {
  return (
    <div className="min-h-screen bg-navy">
      <SEOHead
        title="Stealth Ops Blueprint Temporarily Unavailable | Invisible Exit"
        description="The Stealth Ops Blueprint is temporarily unavailable. Explore the Invisible Exit membership instead."
        url="/tripwire"
        noindex
      />
      <Navbar />

      <main className="hero-dark min-h-[78vh] flex items-center pt-24 pb-16">
        <div className="container-narrow">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-400/20 mb-6">
              <ShieldAlert className="w-8 h-8 text-amber-300" />
            </div>
            <p className="text-eyebrow text-primary-light mb-4">Offer paused</p>
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-5">
              The Stealth Ops Blueprint is temporarily unavailable
            </h1>
            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-xl mx-auto">
              We are not taking payment for this guide until every promised resource has a verified delivery path.
            </p>
            <Link
              to="/start"
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-base"
            >
              Explore the $9/month membership
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs text-white/35 mt-4">
              No Blueprint charge will be added at checkout.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TripwirePage;
