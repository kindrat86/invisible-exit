import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Video,
  Users,
  FileText,
  Shield,
  Rocket,
  Target,
  Clock,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const INCLUDES = [
  {
    icon: Target,
    title: "Private Strategy Session (90 min)",
    description: "1-on-1 video call with Adrian. We map your freedom number, audit your employment contract, and build your 90-day execution plan.",
    value: "$1,000",
  },
  {
    icon: FileText,
    title: "Custom Stealth Ops Audit",
    description: "I personally review your entity structure, digital footprint, and compliance risks. You get a written report with every vulnerability flagged and fixed.",
    value: "$750",
  },
  {
    icon: Rocket,
    title: "Idea Validation Sprint",
    description: "I validate 3 micro-SaaS ideas for your specific industry and skill set. You get market sizing, pricing research, and a go/no-go recommendation for each.",
    value: "$500",
  },
  {
    icon: Video,
    title: "Launch Review & Optimization",
    description: "Before you go live, I review your landing page, pricing, and Stripe setup. One call. We fix everything. You launch with confidence.",
    value: "$400",
  },
  {
    icon: Users,
    title: "30-Day Slack Access",
    description: "Direct Slack channel to Adrian for 30 days. Ask anything, anytime. I respond within 12 hours. No question is too small.",
    value: "$600",
  },
  {
    icon: Shield,
    title: "Founding Member Access (All 5 Tools)",
    description: "Full access to all 5 Invisible Exit tools, locked at the founding rate of $17.99/month for life.",
    value: "$215/yr",
  },
];

const BONUSES = [
  {
    title: "Bonus #1: The Employment Contract Audit Checklist",
    description: "The exact 47-point checklist I use to identify non-compete, IP assignment, and moonlighting risks. What to look for, what to redline, what to walk away from.",
    value: "$197",
  },
  {
    title: "Bonus #2: 25 Done-For-You Micro-SaaS Idea Swipes",
    description: "25 fully-researched micro-SaaS ideas organized by industry, revenue tier, and build difficulty. Each includes target market, pricing model, and validation criteria.",
    value: "$297",
  },
  {
    title: "Bonus #3: The Faceless Founder Content Calendar",
    description: "12 months of pre-written content prompts for YouTube, Reddit, and blog. Never stare at a blank screen again. Post on Saturday, have content for the week.",
    value: "$197",
  },
];

const FAQS = [
  {
    q: "How is this different from the $0.97/month or $17.99/month plans?",
    a: "Those are DIY tools. The Intensive is done-with-you. I personally review your situation, validate your ideas, audit your stealth setup, and build your roadmap. You get direct access to me for 30 days.",
  },
  {
    q: "Is this worth $2,000?",
    a: "If the Intensive saves you 3 months of trial and error (which it will), and your time is worth $100+/hour, the ROI is immediate. Most members recover the cost in their first 3 months of MRR.",
  },
  {
    q: "What if I don't have an idea yet?",
    a: "Perfect. The Idea Validation Sprint is designed for exactly this. I'll help you find and validate 3 ideas tailored to your industry and skills before we build anything.",
  },
  {
    q: "Is this anonymous? Can my employer find out?",
    a: "Yes. Everything is conducted under a pseudonym. I never see your real name, employer, or professional identity. All communication is through a private Slack channel and encrypted video calls.",
  },
];

const IntensivePage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    trackEvent("intensive_applied", { source: "intensive_page" });
    try {
      await supabase
        .from("subscribers")
        .upsert(
          { email, source: "intensive_application" },
          { onConflict: "email" }
        );
      setApplied(true);
      toast.success("Application received! Check your email.");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="The Invisible Exit Intensive — Done-With-You 90-Day Program ($2,000)"
        description="Private 1-on-1 coaching with Adrian. Freedom number, stealth audit, idea validation, launch review, and 30 days of direct access. Limited to 5 managers per month."
        url="/intensive"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Target className="w-4 h-4" />
            Limited to 5 Managers Per Month
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            The Invisible Exit <span className="text-gradient-light">Intensive</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-4">
            Done-with-you. Not DIY.
          </p>

          <p className="text-base text-white/50 max-w-xl mx-auto mb-10">
            I personally map your freedom number, audit your stealth setup, validate your ideas,
            and review your launch. 90 days. 1-on-1. $2,000.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-white/50 text-sm mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> 90-day program
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> 1-on-1 with Adrian
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> 30-day Slack access
            </span>
          </div>
        </div>
      </section>

      {/* ── Sales Letter: The "Why Me, Why Now" ── */}
      <section className="bg-white section-normal border-t border-border">
        <div className="container-narrow">
          <div className="max-w-2xl mx-auto text-body text-muted-foreground space-y-5 leading-[1.8]">
            <p className="text-eyebrow text-primary mb-2 text-center">A Note From Adrian</p>
            <h2 className="text-h2 text-foreground mb-6 text-center">If You're Serious About Exiting in 90 Days, Read This.</h2>
            <p>
              I'm going to be direct with you. If you're the kind of person who reads
              the blog, calculates their freedom number, and then... does nothing...
              this page isn't for you. The $0.97 plan is. It's perfect for that.
            </p>
            <p>
              The Intensive is for the manager who's already decided. You know the
              golden handcuffs are real. You've done the equity math. You know 5 hours
              a week is enough — if you use them right. What you don't have is a
              proven system, a second set of eyes on your employment contract, and
              someone who's done it before sitting next to you.
            </p>
            <p>
              That's what the Intensive is. For 90 days, I become your co-founder.
              Not your coach. Not your cheerleader. Your co-founder. I review your
              ideas personally. I audit your stealth setup personally. I review your
              launch personally. If something's wrong, I tell you before it costs you
              $2,400 in wasted time — because I already made that mistake.
            </p>
            <p className="text-foreground font-medium">
              I take 5 managers per month. No more. Because I personally work with
              each one. When the 5 spots are filled, this page changes to a waitlist.
            </p>
            <p>
              If that resonates, apply below. If it doesn't, the $0.97 plan is still
              the best $12/year you'll spend. No hard feelings either way.
            </p>
            <p className="text-sm">
              — Adrian
            </p>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">What's Included</p>
            <h2 className="text-h1 text-foreground mb-4">Everything You Need to Exit in 90 Days</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INCLUDES.map((item) => (
              <div key={item.title} className="card-base p-6 sm:p-8 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-h3 text-foreground">{item.title}</h3>
                      <span className="text-sm font-bold text-primary shrink-0">{item.value}</span>
                    </div>
                    <p className="text-caption">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Stack */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <div className="text-center mb-10">
            <p className="text-eyebrow text-primary mb-4">The Stack</p>
            <h2 className="text-h1 text-foreground mb-4">Total Value: $3,459</h2>
          </div>

          {/* Itemized */}
          <div className="max-w-lg mx-auto space-y-3 mb-8">
            {INCLUDES.map((item) => (
              <div key={item.title} className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success shrink-0" />
                  <span className="text-foreground text-sm">{item.title}</span>
                </div>
                <span className="text-muted-foreground text-sm">{item.value}</span>
              </div>
            ))}
            {BONUSES.map((bonus) => (
              <div key={bonus.title} className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="text-primary text-sm shrink-0">🎁</span>
                  <span className="text-foreground text-sm">{bonus.title}</span>
                </div>
                <span className="text-muted-foreground text-sm">{bonus.value}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between py-4 border-t-2 border-border">
              <span className="text-muted-foreground">Total individual value:</span>
              <span className="text-muted-foreground line-through">$3,459</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground font-semibold text-lg">Your price:</span>
              <span className="text-4xl sm:text-5xl font-bold text-primary">$2,000</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bonuses */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <div className="text-center mb-10">
            <p className="text-eyebrow text-primary mb-4">Plus 3 Bonuses</p>
            <h2 className="text-h1 text-foreground mb-4">Fast-Action Bonuses</h2>
            <p className="text-body text-muted-foreground">Included when you apply within 7 days.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BONUSES.map((bonus) => (
              <div key={bonus.title} className="card-base p-6 border-2 border-primary/20">
                <span className="text-eyebrow text-primary mb-2 block">🎁 Bonus</span>
                <h3 className="text-lg font-bold text-foreground mb-2">{bonus.title}</h3>
                <p className="text-caption mb-3">{bonus.description}</p>
                <span className="text-sm font-bold text-primary">Value: {bonus.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface section-normal border-t border-border">
        <div className="container-narrow">
          <h2 className="text-h1 text-foreground mb-8 text-center">Questions</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {FAQS.map((faq) => (
              <div key={faq.q} className="card-base p-6">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-caption">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-4">Apply for the Intensive</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            Limited to 5 managers per month. Application doesn't guarantee acceptance.
            If accepted, you'll receive a payment link within 48 hours.
          </p>

          {!applied ? (
            <form onSubmit={handleApply} className="max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email to start the application"
                className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 py-4 px-5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4 min-h-[52px]"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg"
              >
                {loading ? "Submitting..." : "Start Application"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
              <p className="text-white/40 text-xs mt-4">
                No payment required to apply. Full details sent by email.
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto card-glass p-8 animate-scale-in">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Application Received</h3>
              <p className="text-white/70 text-sm mb-4">
                I'll review your application personally. If there's a fit, you'll receive
                a payment link and scheduling details within 48 hours.
              </p>
              <Link to="/" className="text-primary-light hover:text-white text-sm transition-colors">
                ← Back to homepage
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IntensivePage;
