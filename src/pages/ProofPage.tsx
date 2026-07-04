import { Link } from "react-router-dom";
import { ArrowRight, Star, TrendingUp, Shield, Clock, Users, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import TestimonialGrid from "@/components/TestimonialGrid";
import { trackEvent } from "@/lib/analytics";

/**
 * EXPERT SECRETS: Chapter 12 — The Offer / Proof
 *
 * Russell: "Proof is the bridge between belief and action."
 *
 * This page consolidates ALL social proof into one place:
 *   - Aggregate stats (members, MRR, countries)
 *   - categorized testimonials (results, transformation, objection, detail)
 *   - Case studies with specific metrics
 *   - Timeline of results
 *   - Trust signals
 *
 * Visitors who need more proof before buying land here from CTAs
 * throughout the funnel.
 */

const STATS = [
  { value: "127", label: "Active builders", icon: Users },
  { value: "$50K+", label: "Combined monthly MRR", icon: TrendingUp },
  { value: "14", label: "Countries represented", icon: Shield },
  { value: "4.8/5", label: "Average member rating", icon: Star },
];

const CASE_STUDIES = [
  {
    name: "Marcus T.",
    role: "Product Manager, SaaS company",
    salary: "$165K",
    timeline: "8 months",
    mrr: "$3,200",
    product: "PDF generator for electricians",
    story:
      "I'd been researching side business ideas for 2 years. Never started. The freedom number calculator showed me I needed $4,200/month. That made it real. I picked a boring product — a PDF generator for electricians — because the Idea Pipeline scored it highest for revenue probability. I launched in 6 weeks. First customer in week 7. Now at $3,200 MRR in 8 months. My employer has no idea.",
    breakthrough: "The freedom number made it mathematical instead of emotional.",
  },
  {
    name: "Sarah K.",
    role: "Finance Director, Fortune 500",
    salary: "$140K",
    timeline: "6 months",
    mrr: "$3,800",
    product: "Invoice tool for freelancers",
    story:
      "I was the ultimate skeptic. I'd bought 3 other courses before. None worked because they all required building publicly. The Triple-Separation Protocol was the missing piece. I set up a Wyoming LLC, anonymous domain, different Stripe. My colleague actually found a similar product during a team call. Nothing traced to me. Those 3 seconds of panic turned into 3 seconds of triumph.",
    breakthrough: "Anonymity removed the fear that had been paralyzing me for 5 years.",
  },
  {
    name: "Jennifer L.",
    role: "Operations Manager, Logistics",
    salary: "$130K",
    timeline: "5 months",
    mrr: "$2,300",
    product: "Logistics scheduling SaaS",
    story:
      "I spent 5 months obsessed with finding the perfect idea. Built nothing. The Cartridge System reframed everything: stop choosing, start building. I launched the 'wrong' idea first — a scheduling tool for small logistics companies. It worked. Not because the idea was brilliant, but because the system found the customers. I pivoted twice after that using the same pipeline.",
    breakthrough: "The system doesn't care which idea you pick. That changed everything.",
  },
];

const TIMELINE_RESULTS = [
  { month: "Month 1-3", phase: "Building", result: "Zero customers. Question everything.", status: "hard" },
  { month: "Month 4", phase: "First revenue", result: "First customer. $9/month. Screamed in the car.", status: "breakthrough" },
  { month: "Month 6", phase: "Traction", result: "$850 MRR. Still employed. Employer clueless.", status: "growing" },
  { month: "Month 9", phase: "Momentum", result: "$2,100 MRR. Turned down a promotion.", status: "growing" },
  { month: "Month 12", phase: "Freedom number", result: "$4,100 MRR across 3 products.", status: "achieved" },
];

const ProofPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Proof: Real Results from Real Managers | Invisible Exit"
        description="127 corporate managers. $50K+ combined MRR. 14 countries. Real case studies, real timelines, real revenue. See what happens when managers stop waiting."
        url="/proof"
      />
      <Navbar />

      {/* Hero with aggregate stats */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary-light mb-6 animate-fade-in">
            The Proof
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] animate-fade-up">
            127 Managers.{" "}
            <span className="text-gradient-light">$50K+ in MRR.</span>{" "}
            Zero Employers Notified.
          </h1>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: "100ms" }}>
            No vanity metrics. No follower counts. Just recurring revenue,
            verified by Stripe screenshots. This is what happens when managers
            stop waiting.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="text-center animate-fade-up"
                style={{ animationDelay: `${i * 75}ms` }}
              >
                <stat.icon className="w-6 h-6 text-primary-light mx-auto mb-2" />
                <p className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">Case Studies</p>
            <h2 className="text-h1 text-foreground mb-4">3 Managers. 3 Products. 3 Breakthroughs.</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Each one was exactly where you are now. Here's what changed.
            </p>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {CASE_STUDIES.map((cs, i) => (
              <div key={i} className="card-base p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {cs.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">{cs.name}</p>
                        <p className="text-xs text-muted-foreground">{cs.role}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-right">
                    <div>
                      <p className="text-xs text-muted-foreground">Salary</p>
                      <p className="text-sm font-bold text-foreground">{cs.salary}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Timeline</p>
                      <p className="text-sm font-bold text-foreground">{cs.timeline}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">MRR</p>
                      <p className="text-sm font-bold text-success">{cs.mrr}</p>
                    </div>
                  </div>
                </div>

                {/* Story */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {cs.story}
                </p>

                {/* Product */}
                <div className="bg-surface rounded-lg p-3 mb-4">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Product:</strong> {cs.product}
                  </p>
                </div>

                {/* Breakthrough */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1">The Breakthrough</p>
                  <p className="text-sm text-foreground italic">"{cs.breakthrough}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Timeline */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The Timeline</p>
            <h2 className="text-h1 text-foreground mb-4">What 12 Months Looks Like</h2>
            <p className="text-body text-muted-foreground max-w-xl mx-auto">
              Adrian's actual journey. Not the highlight reel.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {TIMELINE_RESULTS.map((t, i) => (
              <div key={i} className="flex items-start gap-4 py-4 border-b border-border last:border-0">
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                      t.status === "achieved"
                        ? "bg-success/15 text-success"
                        : t.status === "breakthrough"
                        ? "bg-primary/15 text-primary"
                        : t.status === "growing"
                        ? "bg-amber-500/15 text-amber-500"
                        : "bg-red-500/15 text-red-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < TIMELINE_RESULTS.length - 1 && <div className="w-px h-12 bg-border mt-1" />}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-primary font-mono text-xs">{t.month}</p>
                    <span className="text-muted-foreground text-xs">·</span>
                    <p className="text-foreground text-xs font-semibold">{t.phase}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Grid */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <TestimonialGrid
            title="More Results from Invisible Builders"
            subtitle="Results, transformations, objection-crushers, and specific details from corporate managers building invisible recurring revenue."
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
            Every case study on this page started with the same 90-second
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
