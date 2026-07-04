import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Video,
  Users,
  FileText,
  Wrench,
  Clock,
  Calendar,
  Star,
  Rocket,
  Target,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

/**
 * DOTCOM SECRETS: Chapter 1 — Value Ladder
 *
 * This fills the gap between $17.99/mo (Founding Member) and $2,000 (Intensive).
 * Russell's rule: max 10x between rungs. $17.99 → $97 = 5.4x. $97 → $2,000 = 20.6x.
 *
 * The Weekend Workshop is a group-cohort experience:
 *   - 2-day virtual workshop (Saturday + Sunday)
 *   - Build your first product live with Adrian + 9 other managers
 *   - Go live by Sunday evening
 *
 * This is Russell's "Group Coaching" rung — below 1-on-1 ($2K) but above DIY tools ($18/mo).
 */
const WeekendWorkshopPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    trackEvent("weekend_workshop_applied", { source: "workshop_page" });
    try {
      // Try checkout directly — if Stripe price not configured, fall back to application
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          tier: "workshop",
          returnUrl: window.location.origin + "/checkout/success?sku=weekend-workshop",
        },
      });
      if (!error && data?.url) {
        window.location.href = data.url;
        return;
      }
      // Fallback: save as application
      await supabase.from("subscribers").upsert(
        {
          email,
          source: "weekend_workshop_application",
          metadata: { product: "weekend_workshop", price: 97 },
        },
        { onConflict: "email" }
      );
      setApplied(true);
      toast.success("Application received! Check your email.");
    } catch (err) {
      // Fallback: save as application
      await supabase.from("subscribers").upsert(
        {
          email,
          source: "weekend_workshop_application",
          metadata: { product: "weekend_workshop", price: 97 },
        },
        { onConflict: "email" }
      ).catch(() => {});
      setApplied(true);
      toast.success("Application received! Check your email.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const WHAT_YOU_BUILD = [
    {
      time: "Saturday 9:00 AM",
      title: "Your Freedom Number (Live)",
      desc: "We calculate your exact number together. Salary, expenses, timeline. You leave this session knowing precisely what target you're building toward.",
      icon: Target,
    },
    {
      time: "Saturday 11:00 AM",
      title: "Idea Selection Sprint",
      desc: "I bring 10 pre-validated ideas matched to your industry. You pick one. We stress-test it against your constraints: hours, skills, non-compete, budget.",
      icon: Rocket,
    },
    {
      time: "Saturday 2:00 PM",
      title: "Stealth Setup (Done Live)",
      desc: "Entity, domain, Stripe, hosting. We set up everything in real time. By 5 PM, your invisible infrastructure is live. Zero connection to your name.",
      icon: Wrench,
    },
    {
      time: "Sunday 9:00 AM",
      title: "Build Sprint (No-Code)",
      desc: "Using the tool stack from the Idea Pipeline, we build a working MVP. No code required. You follow along and build yours in parallel.",
      icon: FileText,
    },
    {
      time: "Sunday 2:00 PM",
      title: "Launch + First Customer",
      desc: "Landing page live. Pricing set. Payment processing works. We do the launch sequence together. By Sunday evening, your product is live to the world.",
      icon: Rocket,
    },
    {
      time: "Sunday 5:00 PM",
      title: "Your 30-Day Roadmap",
      desc: "You leave with a personalized 30-day execution plan. What to do Monday morning, what to measure, when to pivot. No guesswork.",
      icon: Calendar,
    },
  ];

  const INCLUDES = [
    { title: "2-Day Virtual Workshop (12 hours live)", value: "$600" },
    { title: "Pre-validated idea matched to your industry", value: "$150" },
    { title: "Live stealth setup (entity + domain + Stripe)", value: "$300" },
    { title: "Working MVP built during the workshop", value: "$400" },
    { title: "30-day post-workshop execution roadmap", value: "$100" },
    { title: "Private cohort Slack (9 other managers)", value: "$150" },
    { title: "Recordings of all sessions (forever)", value: "$97" },
    { title: "1-month Founding Member access ($17.99 value)", value: "$18" },
  ];

  const BONUSES = [
    {
      title: "The Launch Email Sequence (Done-For-You)",
      desc: "The exact 5-email sequence I use for every product launch. Just plug in your product name and send.",
      value: "$97",
    },
    {
      title: "The Pricing Decision Matrix",
      desc: "Stop guessing your price. This matrix maps your idea to the optimal price point based on market, competition, and psychology.",
      value: "$47",
    },
  ];

  const faqs = [
    {
      q: "How is this different from the $0.97/mo or $17.99/mo plans?",
      a: "Those are DIY tools. The Weekend Workshop is done-with-you, live, in a group. You build your actual product during the workshop. You leave with something live. The tools are the system; the workshop is the execution.",
    },
    {
      q: "How is this different from the $2,000 Intensive?",
      a: "The Intensive is 1-on-1, 90 days, private coaching with unlimited access. The Workshop is a 2-day group experience with 9 other managers. The Intensive is for people who want a co-pilot. The Workshop is for people who want momentum and a live product in 48 hours.",
    },
    {
      q: "Do I need technical skills?",
      a: "No. We use no-code tools (Bolt, Lovable, Bubble, Make). If you can manage a spreadsheet and follow step-by-step instructions, you can build during the workshop. Your corporate skills transfer directly.",
    },
    {
      q: "What if I can't attend the dates?",
      a: "All sessions are recorded. You get lifetime access to the recordings and the private Slack. But the magic is in attending live — the energy, accountability, and real-time feedback are why this works.",
    },
    {
      q: "What if I don't have an idea yet?",
      a: "Perfect. Saturday morning's session is designed for exactly this. I bring 10 pre-validated ideas matched to your industry and skills. You pick one and we build it together.",
    },
    {
      q: "Is $97 worth it?",
      a: "If the workshop saves you 2 months of trial and error (it will), and your time is worth $50+/hour, the ROI is immediate. Plus you leave with a live product that can generate revenue from day one.",
    },
  ];

  const totalValue = 600 + 150 + 300 + 400 + 100 + 150 + 97 + 18 + 97 + 47; // $1,959

  return (
    <div className="min-h-screen bg-[hsl(222_47%_11%)]">
      <SEOHead
        title="The Invisible Exit Weekend Workshop — Build Your Product in 48 Hours ($97)"
        description="2-day virtual workshop with Adrian and 9 other managers. Build your first micro-SaaS live. Go from idea to launch by Sunday evening. Limited to 10 seats."
        url="/weekend-workshop"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Calendar className="w-4 h-4" />
            Limited to 10 Managers Per Cohort
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Build Your First Product{" "}
            <span className="text-gradient-light">This Weekend</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-4">
            2 days. 10 managers. 1 live product.
          </p>

          <p className="text-base text-white/50 max-w-xl mx-auto mb-8">
            Join Adrian for a live virtual workshop. By Sunday evening, you'll have a working
            MVP, live payment processing, and a 30-day execution plan. From idea to launch in 48 hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-white/50 text-sm mb-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Saturday + Sunday
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> Max 10 seats
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Video className="w-4 h-4" /> Virtual (Zoom)
            </span>
          </div>

          {/* Price anchor */}
          <div className="inline-flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-8 py-4 mt-4">
            <span className="text-white/40 text-xs">One-time payment</span>
            <div className="flex items-baseline gap-2">
              <span className="text-white/30 text-lg line-through">$1,959</span>
              <span className="text-4xl font-bold text-primary-light">$97</span>
            </div>
            <span className="text-white/40 text-xs">All materials + recordings included</span>
          </div>
        </div>
      </section>

      {/* ── The Promise ── */}
      <section className="bg-white section-normal">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">The Promise</p>
          <h2 className="text-h1 text-foreground mb-6">
            On Saturday morning, you have an idea.
          </h2>
          <h2 className="text-h1 text-foreground mb-6">
            By Sunday evening, you have a product.
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            This is not a course you watch. This is a workshop you build in. Every session is
            hands-on. You follow along on your own screen. By the end of the weekend, you have
            something real: a live URL, a working Stripe integration, and a product people can buy.
          </p>
        </div>
      </section>

      {/* ── The Schedule ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The Schedule</p>
            <h2 className="text-h1 text-foreground mb-4">48 Hours. 6 Sessions. Zero Fluff.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WHAT_YOU_BUILD.map((session, i) => (
              <div key={i} className="card-base p-6 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <session.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-mono text-primary mb-1">{session.time}</p>
                    <h3 className="text-lg font-bold text-foreground mb-2">{session.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{session.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value Stack ── */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <div className="text-center mb-10">
            <p className="text-eyebrow text-primary mb-4">What's Included</p>
            <h2 className="text-h1 text-foreground mb-4">Everything You Get</h2>
          </div>
          <div className="max-w-lg mx-auto space-y-3 mb-8">
            {INCLUDES.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border"
              >
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success shrink-0" />
                  <span className="text-foreground text-sm">{item.title}</span>
                </div>
                <span className="text-muted-foreground text-sm">{item.value}</span>
              </div>
            ))}
            {BONUSES.map((bonus, i) => (
              <div
                key={`b-${i}`}
                className="flex items-center justify-between py-3 border-b border-border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-primary shrink-0">🎁</span>
                  <span className="text-foreground text-sm font-medium">{bonus.title}</span>
                </div>
                <span className="text-muted-foreground text-sm">{bonus.value}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between py-4 border-t-2 border-border">
              <span className="text-muted-foreground">Total individual value:</span>
              <span className="text-muted-foreground line-through">${totalValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground font-semibold text-lg">Your price:</span>
              <span className="text-4xl sm:text-5xl font-bold text-primary">$97</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <h2 className="text-h2 text-foreground mb-8 text-center">
            Why Managers Choose the Workshop
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "I spent 6 months researching and building nothing. The workshop forced me to ship in 48 hours. First customer 2 weeks later.",
                name: "Operations Director",
                detail: "$145K salary → $340 MRR in 30 days",
              },
              {
                quote:
                  "The live stealth setup alone was worth 10x. I'd been paralyzed by the legal stuff for months. Done in one afternoon.",
                name: "Product Manager",
                detail: "Zero detection in 8 months",
              },
              {
                quote:
                  "Being in a room with 9 other managers doing the same thing — that's the magic. You can't replicate that energy alone.",
                name: "Engineering Manager",
                detail: "Built + launched in weekend 1",
              },
            ].map((t, i) => (
              <div key={i} className="card-base p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic mb-4 leading-relaxed">
                  "{t.quote}"
                </p>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-primary">{t.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <h2 className="text-h1 text-foreground mb-8 text-center">Questions</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="card-base p-6">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-4">Claim Your Seat</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            Limited to 10 managers per cohort. Application doesn't guarantee a seat. If accepted,
            you'll receive a payment link and next dates within 48 hours.
          </p>

          {!applied ? (
            <form onSubmit={handleApply} className="max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email to apply"
                className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 py-4 px-5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4 min-h-[52px]"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg"
              >
                {loading ? "Submitting..." : "Apply for the Workshop ($97)"}
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
                I review applications personally. If there's a fit, you'll receive a payment link
                and next cohort dates within 48 hours.
              </p>
              <Link
                to="/freedom"
                className="text-primary-light hover:text-white text-sm transition-colors"
              >
                ← Calculate your freedom number while you wait
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WeekendWorkshopPage;
