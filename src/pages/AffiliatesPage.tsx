import { Link } from "react-router-dom";
import { Users, DollarSign, TrendingUp, ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const BENEFITS = [
  {
    icon: DollarSign,
    title: "30% Recurring Commission",
    description: "Earn 30% of every subscription you refer — for the lifetime of the customer. $0.97 plan earns you $0.29/month. Founding plan ($17.99) earns you $5.40/month per referral.",
  },
  {
    icon: TrendingUp,
    title: "Lifetime Cookie",
    description: "60-day cookie window. If someone clicks your link and subscribes within 60 days, you get the commission. No expiration games.",
  },
  {
    icon: Users,
    title: "Built for Corporate Audiences",
    description: "Your audience of managers, directors, and executives is exactly who Invisible Exit is designed for. High intent, high conversion.",
  },
];

const HOW_IT_WORKS = [
  "Sign up and get your unique referral link",
  "Share it in your newsletter, Slack, LinkedIn, or community",
  "When someone subscribes via your link, you earn 30% recurring",
  "Get paid monthly via PayPal or Stripe Connect",
];

const AffiliatesPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Affiliate Program — 30% Recurring | Invisible Exit"
        description="Earn 30% recurring commission referring corporate managers to Invisible Exit. Lifetime cookies, monthly payouts."
        url="/affiliates"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary-light mb-6">Affiliate Program</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Earn <span className="text-gradient-light">30% Recurring Commission</span><br />
            Helping Managers Escape
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10">
            Refer corporate managers to Invisible Exit and earn lifetime recurring revenue
            on every subscription.
          </p>
          <Link
            to="mailto:escape@invisibleexit.com?subject=Affiliate%20Application"
            className="btn-primary text-lg"
          >
            Apply to Join
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card-base p-6 sm:p-8 card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-h3 text-foreground mb-2">{b.title}</h3>
                <p className="text-caption">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface section-normal">
        <div className="container-narrow">
          <h2 className="text-h1 text-foreground mb-8 text-center">How It Works</h2>
          <div className="space-y-4 max-w-xl mx-auto">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="card-base p-5 flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm shrink-0">
                  {i + 1}
                </span>
                <span className="text-foreground">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue calculator */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <h2 className="text-h1 text-foreground mb-8 text-center">Revenue Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { refs: 10, plan: "Starter ($0.97)", monthly: "$2.90", annual: "$34.80" },
              { refs: 25, plan: "Founding ($17.99)", monthly: "$135/mo", annual: "$1,620/yr" },
              { refs: 100, plan: "Mixed avg", monthly: "$420/mo", annual: "$5,040/yr" },
            ].map((ex) => (
              <div key={ex.refs} className="card-base p-6 text-center">
                <p className="text-3xl font-bold text-primary mb-2">{ex.refs}</p>
                <p className="text-sm text-muted-foreground mb-4">referrals</p>
                <p className="text-caption mb-3">{ex.plan}</p>
                <div className="border-t border-border pt-3 mt-3">
                  <p className="text-xl font-bold text-foreground">{ex.monthly}</p>
                  <p className="text-sm text-muted-foreground">{ex.annual}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-6">Ready to Start Earning?</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            Join the affiliate program and start referring managers today.
            Applications reviewed within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="mailto:escape@invisibleexit.com?subject=Affiliate%20Application"
              className="btn-primary text-lg"
            >
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/"
              className="btn-secondary text-lg border-white/20 text-white hover:bg-white/10"
            >
              Learn More First
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AffiliatesPage;
