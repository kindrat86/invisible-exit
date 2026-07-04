import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  X,
  Shield,
  Rocket,
  Users,
  DollarSign,
  TrendingUp,
  Target,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

const ALTERNATIVES = [
  {
    name: "Side-Hustle Courses ($97-$497)",
    icon: Target,
    philosophy: "Teach you to build a 'better' side business",
    whatTheySay: "Just start! Pick an idea and go!",
    whatTheyMiss: "No stealth framework. No anonymity system. No employment-contract compliance. If your employer finds out, you lose everything.",
    ourAnswer: "We don't teach improvement. We give you a new vehicle — the Invisible Exit System — designed from day one for employed managers who can't be discovered.",
    verdict: "Good for motivation. Dangerous for corporate managers who need to stay invisible.",
  },
  {
    name: "FIRE Movement (Financial Independence)",
    icon: TrendingUp,
    philosophy: "Save 70% of income. Invest in index funds. Retire in 20-30 years.",
    whatTheySay: "Live below your means and let compounding do the work.",
    whatTheyMiss: "Requires decades of frugality. Depends on market returns you don't control. Doesn't create anything you own. You're still dependent — just on the market instead of an employer.",
    ourAnswer: "The freedom number approach uses recurring revenue from products you own. It's renewable — it doesn't deplete. And it takes 12-18 months, not 20-30 years.",
    verdict: "Valid path, but slow. We offer a faster vehicle that doesn't require decades of sacrifice.",
  },
  {
    name: "Quit-Your-Job Advice (Founders)",
    icon: Rocket,
    philosophy: "Burn the boats. Full commitment. Sink or swim.",
    whatTheySay: "If you have a backup plan, you'll never go all in.",
    whatTheyMiss: "Ignores the reality that most people have families, mortgages, and healthcare tied to employment. 'Burning the boats' is advice from people who raised $500K before quitting.",
    ourAnswer: "Your job is the launchpad, not the trap. Your salary is runway funding that costs zero equity. Your 5 hours/week forces focus. You don't need to quit — you need a system that works within your constraints.",
    verdict: "Inspiring for 23-year-olds with no responsibilities. Dangerous for managers with families.",
  },
  {
    name: "MBA / Executive Coaching ($50K-$120K)",
    icon: Users,
    philosophy: "Climb higher. Get the credential. Network with other climbers.",
    whatTheySay: "Invest in yourself and the promotions will follow.",
    whatTheyMiss: "An MBA gives you a credential for someone else's ladder. It doesn't create revenue you own. It doesn't give you optionality. It deepens the golden handcuffs.",
    ourAnswer: "Instead of spending $100K on a credential that makes you more valuable to employers, spend $0.97/month on a system that makes you less dependent on them.",
    verdict: "Valuable for career advancement. Useless for financial freedom.",
  },
  {
    name: "No-Code Bootcamps ($500-$2,000)",
    icon: DollarSign,
    philosophy: "Learn to build apps without code.",
    whatTheySay: "Anyone can build a SaaS with Bubble and Airtable!",
    whatTheyMiss: "Teaches the tool, not the system. You learn to build — but not what to build, how to validate it, how to launch it stealthily, or how to get customers without ads.",
    ourAnswer: "Tools are commodities. The system is the asset. The Idea Pipeline tells you what to build. Launch Control tells you how to ship. Brand Manager tells you how to get customers. The tools are just the medium.",
    verdict: "Good for learning a skill. Insufficient as a path to freedom.",
  },
  {
    name: "Passive Income Gurus",
    icon: Shield,
    philosophy: "Buy rental properties. Dividend invest. Build a blog and wait.",
    whatTheySay: "Passive income is the dream!",
    whatTheyMiss: "Rental properties require capital and active management. Dividends require $1M+ invested. Blogs take 2-3 years to monetize. None are truly passive. None work for someone with 5 hours/week.",
    ourAnswer: "Micro-SaaS is as close to passive as recurring revenue gets. Build once, sell infinitely. The Launch Control tool automates the repetitive work. Your 5 hours go to growth, not maintenance.",
    verdict: "The dream is real. The gurus selling it usually aren't.",
  },
];

const COMPARISON_TABLE = [
  { feature: "Designed for employed managers", ie: true, alt1: false, alt2: false, alt3: false, alt4: false, alt5: true },
  { feature: "Stealth/anonymity framework", ie: true, alt1: false, alt2: false, alt3: false, alt4: false, alt5: false },
  { feature: "Employment contract compliance", ie: true, alt1: false, alt2: false, alt3: false, alt4: false, alt5: false },
  { feature: "Works in 5 hours/week", ie: true, alt1: true, alt2: false, alt3: false, alt4: true, alt5: false },
  { feature: "Creates revenue you own", ie: true, alt1: true, alt2: false, alt3: true, alt4: false, alt5: true },
  { feature: "Doesn't require quitting", ie: true, alt1: true, alt2: true, alt3: false, alt4: true, alt5: true },
  { feature: "Timeline: 12-18 months", ie: true, alt1: false, alt2: false, alt3: false, alt4: false, alt5: false },
  { feature: "Under $20/month", ie: true, alt1: true, alt2: false, alt3: false, alt4: false, alt5: true },
];

const ComparePage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Invisible Exit vs Every Alternative — The Honest Comparison"
        description="Why Invisible Exit is fundamentally different from side-hustle courses, FIRE, quit-your-job advice, MBAs, bootcamps, and passive income gurus. The honest comparison."
        url="/compare"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Target className="w-4 h-4" />
            The Honest Comparison
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
            Why Not Just{" "}
            <span className="text-gradient-light">Something Else?</span>
          </h1>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto mb-4">
            Every alternative teaches improvement. We offer a new opportunity.
            Here's the honest comparison — including where each alternative is
            actually better.
          </p>
        </div>
      </section>

      {/* Alternatives */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The Alternatives</p>
            <h2 className="text-h1 text-foreground mb-4">6 Paths to Freedom — Compared</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              We're not going to pretend every alternative is bad. Some are good
              for different goals. Here's where each one wins — and where it
              falls apart for corporate managers.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {ALTERNATIVES.map((alt) => (
              <div key={alt.name} className="card-base p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <alt.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{alt.name}</h3>
                    <p className="text-sm text-muted-foreground italic mt-1">{alt.philosophy}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* What they say */}
                  <div className="bg-surface rounded-lg p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">What they say</p>
                    <p className="text-sm text-muted-foreground italic">"{alt.whatTheySay}"</p>
                  </div>
                  {/* What they miss */}
                  <div className="bg-destructive/5 rounded-lg p-4 border border-destructive/10">
                    <p className="text-xs uppercase tracking-wide text-destructive font-semibold mb-2">What they miss</p>
                    <p className="text-sm text-muted-foreground">{alt.whatTheyMiss}</p>
                  </div>
                </div>

                {/* Our answer */}
                <div className="mt-4 bg-primary/5 rounded-lg p-4 border-l-2 border-primary">
                  <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-2">Our answer</p>
                  <p className="text-sm text-foreground">{alt.ourAnswer}</p>
                </div>

                {/* Verdict */}
                <p className="text-xs text-muted-foreground mt-3 italic">
                  <strong className="text-foreground">Verdict:</strong> {alt.verdict}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <div className="text-center mb-8">
            <p className="text-eyebrow text-primary mb-4">The Matrix</p>
            <h2 className="text-h1 text-foreground mb-4">Feature Comparison</h2>
          </div>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden min-w-[600px]">
              <thead>
                <tr className="bg-white">
                  <th className="text-left p-3 font-semibold text-foreground">Feature</th>
                  <th className="text-center p-3 font-bold text-primary bg-primary/5">Invisible Exit</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">Courses</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">FIRE</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">Quit</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">MBA</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">Bootcamp</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_TABLE.map((row) => (
                  <tr key={row.feature} className="border-t border-border">
                    <td className="p-3 text-foreground text-xs sm:text-sm">{row.feature}</td>
                    <td className="p-3 text-center bg-primary/5">
                      {row.ie ? <Check className="w-4 h-4 text-success mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      {row.alt1 ? <Check className="w-4 h-4 text-success mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      {row.alt2 ? <Check className="w-4 h-4 text-success mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      {row.alt3 ? <Check className="w-4 h-4 text-success mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      {row.alt4 ? <Check className="w-4 h-4 text-success mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      {row.alt5 ? <Check className="w-4 h-4 text-success mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The Core Difference */}
      <section className="bg-white section-normal">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">The Core Difference</p>
          <h2 className="text-h1 text-foreground mb-6">
            Everything Else Teaches{" "}
            <span className="text-destructive line-through">Improvement</span>.
            <br />
            We Offer a{" "}
            <span className="text-primary">New Opportunity</span>.
          </h2>
          <div className="max-w-2xl mx-auto text-body text-muted-foreground space-y-5">
            <p>
              Side-hustle courses teach you to build a <em>better</em> business.
              FIRE teaches you to save <em>more</em> money. Quit-your-job advice
              teaches you to be <em>braver</em>. MBAs teach you to climb{" "}
              <em>higher</em>.
            </p>
            <p>
              All of these are improvement — incremental progress on a path you're
              already on. And improvement puts you in competition with everyone
              else teaching improvement.
            </p>
            <p className="text-foreground font-medium text-lg pt-4">
              Invisible Exit doesn't improve your current path. It hands you a
              different vehicle entirely — one designed from the ground up for
              corporate managers who need to stay invisible, work in 5 hours/week,
              and reach $4,000/month in 12-18 months.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-4">See If It's Right for You</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            Calculate your freedom number. If the math makes sense, try the system
            for $0.97. If it doesn't, you'll know in 90 seconds — no cost.
          </p>
          <Link
            to="/freedom"
            onClick={() => trackEvent("compare_page_cta")}
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

export default ComparePage;
