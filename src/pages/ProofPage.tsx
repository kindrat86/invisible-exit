import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import TestimonialGrid from "@/components/TestimonialGrid";
import { trackEvent } from "@/lib/analytics";

/**
 * Proof Page
 *
 * Builds trust through verifiable claims and transparent practices,
 * not fictitious numbers or unverifiable case studies.
 */

const ProofPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Why Trust Invisible Exit | Transparent Building System"
        description="A transparent system for corporate managers building side revenue. No vanity metrics. No made-up testimonials. Just tools that work."
        url="/proof"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary-light mb-6 animate-fade-in">
            The Proof
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] animate-fade-up">
            The Work Is{" "}
            <span className="text-gradient-light">the Proof.</span>
          </h1>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: "100ms" }}>
            No vanity metrics. No follower counts. No fabricated testimonials.
            Just real tools, documented systems, and a calculator that works
            — try it yourself in 90 seconds.
          </p>

          <Link
            to="/freedom"
            onClick={() => trackEvent("proof_page_hero_cta_clicked")}
            className="btn-primary text-lg px-8 inline-flex items-center gap-2"
          >
            Calculate Your Freedom Number
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Testimonial Grid — renders only when real testimonials exist */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <TestimonialGrid
            title="Results from Real Builders"
            subtitle="Verified results from corporate managers using the Invisible Exit system. Every testimonial is backed by real data."
          />
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-surface section-normal border-t border-border">
        <div className="container-standard">
          <div className="text-center mb-10">
            <p className="text-eyebrow text-primary mb-4">Why Managers Trust Us</p>
            <h2 className="text-h1 text-foreground mb-4">Built on Proof, Not Promises</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Check, title: "Stripe-Verified Revenue", desc: "Every case study's MRR is verified via Stripe screenshots submitted to Adrian." },
              { icon: Shield, title: "Anonymous by Design", desc: "All member identities are pseudonymous. No real names. No employer info. Ever." },
              { icon: Clock, title: "30-Day Money-Back", desc: "Try the system. If it doesn't work, email 'refund.' You keep everything." },
            ].map((item, i) => (
              <div key={i} className="card-base p-6 text-center">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-foreground text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-4">Your Story Could Be Next.</h2>
          <p className="text-body text-white/60 mb-10 max-w-xl mx-auto">
            Every builder on this platform started with the same 90-second
            calculation. Your freedom number. It changes how you see your salary.
          </p>
          <Link
            to="/freedom"
            onClick={() => trackEvent("proof_page_cta_clicked")}
            className="btn-primary text-lg px-8 inline-flex items-center gap-2"
          >
            Calculate Your Freedom Number
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProofPage;
