import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart3,
  Lightbulb,
  Shield,
  Rocket,
  Megaphone,
  ArrowRight,
  Check,
  Lock,
  Quote,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const TOOLS = [
  {
    icon: BarChart3,
    name: "FYM Dashboard",
    outcome: "Know exactly how much you need to quit.",
    description:
      "Tracks your recurring revenue, churn, growth rate, and exit timeline across all your projects.",
    value: "$12/month",
  },
  {
    icon: Lightbulb,
    name: "Idea Pipeline",
    outcome: "Stop guessing. Start validating.",
    description:
      "500+ micro-SaaS ideas scored by industry fit, time investment, and revenue potential. AI-powered validation in 48 hours.",
    value: "$15/month",
  },
  {
    icon: Shield,
    name: "Stealth Ops Hub",
    outcome: "Your employer will never find out.",
    description:
      "Entity separation, compliance audit, digital footprint cleanup. Invisibility score from 0-100 with specific fixes.",
    value: "$25/month",
  },
  {
    icon: Rocket,
    name: "Launch Control",
    outcome: "Ship products faster than your day job allows.",
    description:
      "Full launch automation: checklists, email sequences, go-live tracking. Built for people with 5 hours a week.",
    value: "$18/month",
  },
  {
    icon: Megaphone,
    name: "Brand Manager",
    outcome: "Build an audience without showing your face.",
    description:
      "Content calendar, YouTube scripts, Reddit playbooks. Everything you need to grow an anonymous brand.",
    value: "$27/month",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I validated my first micro-SaaS idea in 3 weeks using the framework. The stealth ops checklist alone was worth 100x the price.",
    name: "Director of Ops",
    role: "Fortune 500 → $4K MRR side business",
  },
  {
    quote:
      "The freedom number calculator changed how I think about my equity. I realized I was building someone else's dream, not mine.",
    name: "Senior PM",
    role: "$145K salary → First SaaS revenue in 60 days",
  },
  {
    quote:
      "I spent two years thinking about starting something. Invisible Exit gave me a system I could actually follow with 5 hours a week.",
    name: "Engineering Manager",
    role: "Built first product while employed",
  },
];

const FAQS = [
  {
    q: "What do I get for $0.97/month?",
    a: "FYM Dashboard tells you exactly how much recurring revenue you need to quit. Idea Pipeline finds and validates your first product in 48 hours. Stealth Ops Hub makes sure your employer never finds out. Launch Control ships your product in weeks, not months. Brand Manager builds your audience without showing your face. All five, one price.",
  },
  {
    q: "Does this violate my employment contract?",
    a: "Most employment contracts restrict you from competing in your employer's industry or using company resources. Invisible Exit is designed around those constraints. You build in unrelated markets, on your own time, with your own tools. The Stealth Ops Hub runs a compliance audit against common contract clauses (non-compete, IP assignment, moonlighting) and flags anything that needs attention. That said, every contract is different. We always recommend reviewing yours with a legal professional.",
  },
  {
    q: "Can my employer find out?",
    a: "The Stealth Ops Hub is specifically designed to prevent that. It includes entity separation guidance, compliance audit tools, and digital footprint cleanup. Your business operates under a completely separate legal structure with no connection to your name.",
  },
  {
    q: "Do I need technical skills to build a micro-SaaS?",
    a: "No. The Idea Pipeline filters for builds that work with no-code tools and AI-assisted development. You don't need to write code. If you can manage a team and run a P&L, you have more than enough skill to build and launch a micro-SaaS. The system handles the technical scaffolding.",
  },
  {
    q: "What if I don't have a business idea yet?",
    a: "That's exactly what the Idea Pipeline is for. It has 500+ validated micro-SaaS ideas organized by industry, time investment, and revenue tier. Most founding members find 3-5 ideas worth exploring in their first session.",
  },
  {
    q: "What if my company IPOs and I get my equity payout?",
    a: "Great. Then you'll have two income streams instead of one. Nothing about Invisible Exit requires you to quit. It's insurance, not an ultimatum. If the IPO happens and it's life-changing money, you celebrate. If it doesn't, or the payout disappoints, you already have a backup generating revenue.",
  },
  {
    q: "How long until I actually make money?",
    a: "Most members validate their first idea within 30 days. First revenue varies: some hit it in 60 days, some in 6 months. It depends on the idea you pick and how you use your 5 hours per week. This is not a 'get rich quick' pitch. It's a system for building real recurring revenue alongside your career.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no commitments. Cancel from your dashboard in one click. Plus there's a 30-day money-back guarantee.",
  },
];

const Index = () => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "starter") {
      window.history.replaceState({}, "", window.location.pathname);
      handleCheckout();
    }
  }, []);

  const handleCheckout = async () => {
    trackEvent("homepage_cta_clicked", { source: "landing_page" });
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        { body: { tier: "starter" } }
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

  const handleEmailSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) return;
    setEmailLoading(true);
    try {
      const { error } = await supabase
        .from("subscribers")
        .upsert(
          { email: subscribeEmail, source: "landing_page" },
          { onConflict: "email" }
        );
      if (error) throw error;
      trackEvent("homepage_subscribe_submitted", { source: "landing_page" });
      toast.success("You're in! We'll send you weekly insights.");
      supabase.functions
        .invoke("newsletter-welcome", { body: { email: subscribeEmail } })
        .catch((err) => console.error("Welcome email error:", err));
      setSubscribeEmail("");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Invisible Exit | Build a Side Business While Employed"
        description="5 AI-powered tools that help corporate managers build anonymous micro-SaaS businesses. Calculate your freedom number, validate ideas, stay invisible. From $0.97/mo."
        url="/"
      />
      <Navbar />

      <main>
      {/* ── 1. Hero ── */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24 section">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary-light mb-6 animate-fade-in">
            For Corporate Managers Who Want Out
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] animate-fade-up">
            How to Build a{" "}
            <span className="text-gradient-light">$4,000/Month Side Business</span>{" "}
            Without Quitting Your Job, Without Writing Code, and Without Your Employer Finding Out
          </h1>

          <p className="text-body-lg text-white/70 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "100ms" }}>
            5 AI-powered tools that take you from "trapped in the golden handcuffs"
            to real recurring revenue — in 12 months, working 5 hours a week.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 mb-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="btn-primary w-full sm:w-auto text-lg px-8"
            >
              {checkoutLoading ? "Loading..." : "Get All 5 Tools — $0.97/month"}
              {!checkoutLoading && <ArrowRight className="w-5 h-5" />}
            </button>
            <Link
              to="/freedom"
              className="text-white/60 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
            >
              Not ready yet? Calculate your Freedom Number free →
            </Link>
            <p className="text-sm text-white/40 mt-1">
              Cancel anytime. No contracts. 30-day money-back guarantee.
            </p>
          </div>

          {/* Value bullets */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/50 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "300ms" }}>
            {[
              "Freedom number calculator",
              "500+ validated micro-SaaS ideas",
              "Stealth ops & compliance audit",
              "Launch automation",
              "Faceless brand builder",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-success" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 1b. The 3 Secrets (Russell's framework) ── */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The Framework</p>
            <h2 className="text-h1 text-foreground mb-4">The 3 Secrets Nobody Tells Corporate Managers</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Everything in Invisible Exit is built on these 3 principles.
              If you understand them, the system works.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "1",
                title: "Your Job Is the Perfect Launchpad",
                body: "Your salary is runway funding. Your corporate skills (managing teams, reading P&Ls, executing projects) are exactly what solo founders lack. Your 5 hours/week forces ruthless focus.",
              },
              {
                num: "2",
                title: "Anonymity Is Your Greatest Asset",
                body: "When you're anonymous, you can experiment without fear. Build in unrelated markets. Fail publicly without your employer or professional network ever knowing. Your business operates under a separate entity.",
              },
              {
                num: "3",
                title: "The System Beats the Idea",
                body: "Stop obsessing over the 'right' idea. Build the system first: freedom number → idea pipeline → stealth ops → launch → brand. Once you have the system, you can swap ideas in and out.",
              },
            ].map((secret) => (
              <div key={secret.num} className="card-base p-6 sm:p-8 card-hover">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold text-lg mb-4">
                  {secret.num}
                </span>
                <h3 className="text-h3 text-foreground mb-3">{secret.title}</h3>
                <p className="text-caption">{secret.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Belief Shift / Manifesto ── */}
      <section className="bg-white section-wide">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-12 text-center">What I Believe</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left: Belief statements */}
            <div className="space-y-6 text-muted-foreground text-body animate-fade-up">
              <p>
                Corporate loyalty is a transaction, not a virtue. Companies design
                equity structures to keep you, not to reward you. Less than 0.5%
                is a leash disguised as a partnership.
              </p>
              <p>
                The acquisition payout is a lottery ticket. You can't build your
                life on someone else's exit timeline.
              </p>
              <p>
                Your 15 years of corporate operations experience isn't a weakness.
                It's founder gold. You understand customers, systems, and execution
                better than anyone with just a pitch deck.
              </p>
              <p>
                You don't need to quit your job to start. You don't need a
                co-founder. You don't need venture capital. You need 5 hours a
                week and a system that works within your constraints.
              </p>
            </div>

            {/* Right: "After" vision card */}
            <div className="card-base bg-surface p-6 sm:p-8 lg:p-10 card-hover animate-fade-up" style={{ animationDelay: "150ms" }}>
              <h3 className="text-h3 text-foreground mb-4">12 Months From Now</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                You wake up, check your phone. Not Slack notifications. Stripe
                dashboard: $3,200 MRR across 3 micro-SaaS tools. You go to work
                the same as always, but something is different. You resolve
                conflicts faster because you care less. You're already detached
                from the corporate game. On weekends, you spend 5 hours refining
                your tools. Your wife knows. Your employer doesn't. The golden
                handcuffs are still on your wrists, but you've found the key.
              </p>
            </div>
          </div>

          {/* Bottom bold statement */}
          <p className="text-h2 text-foreground text-center mt-16 max-w-4xl mx-auto leading-tight">
            The cage has a door.<br />
            <span className="text-gradient">Most people never look for it.</span>
          </p>
        </div>
      </section>

      {/* ── 3. Start Here Reading Path ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <div className="max-w-3xl mb-10">
            <p className="text-eyebrow text-primary mb-4">Not Ready to Buy?</p>
            <h2 className="text-h1 text-foreground mb-4">Read these 3 guides first.</h2>
            <p className="text-body text-muted-foreground">
              If the pitch resonates but you need more proof, start with the
              roadmap, the stealth guide, and the no-ads customer guide.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                slug: "the-invisible-exit-roadmap-what-to-do-in-your-first-90-days",
                category: "Exit Planning",
                title: "The Invisible Exit Roadmap",
                excerpt: "The first 90 days matter because they create direction, not just motion.",
              },
              {
                slug: "invisible-business-model",
                category: "Stealth Operations",
                title: "The Invisible Business Model",
                excerpt: "How to build revenue your employer cannot easily see.",
              },
              {
                slug: "how-corporate-managers-can-get-their-first-paying-customers-without-ads",
                category: "Growth",
                title: "First Paying Customers Without Ads",
                excerpt: "How to get early customers through clarity, trust, and direct conversations.",
              },
            ].map((guide) => (
              <Link
                key={guide.slug}
                to={`/blog/${guide.slug}`}
                onClick={() =>
                  trackEvent("homepage_blog_clicked", {
                    source: "homepage_start_here_section",
                    slug: guide.slug,
                  })
                }
                className="card-base p-6 card-hover group"
              >
                <span className="text-eyebrow text-primary mb-3 block">
                  {guide.category}
                </span>
                <h3 className="text-h3 text-foreground mb-3 group-hover:text-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-caption">{guide.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. The 5 Tools ── */}
      <section className="hero-dark section-wide">
        <div className="container-standard">
          <p className="text-eyebrow text-primary-light mb-4 text-center">The System</p>
          <h2 className="text-h1 text-white mb-2 text-center">5 Tools. Each Solves a Specific Problem.</h2>
          <p className="text-body text-white/60 mb-12 text-center max-w-2xl mx-auto">
            From "trapped" to "free." All 5 included at $0.97/month.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool, i) => (
              <div
                key={tool.name}
                className="card-glass p-6 sm:p-8 transition-all hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${i * 75}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <tool.icon className="w-6 h-6 text-primary-light" />
                </div>
                <h3 className="text-h3 text-white mb-1">{tool.name}</h3>
                <p className="text-white/70 mb-3 font-medium">{tool.outcome}</p>
                <p className="text-sm text-white/50 leading-relaxed">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Testimonials ── */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-4 text-center">What Members Say</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">Built by managers. Used by managers.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card-base p-6 sm:p-8">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-body text-foreground mb-6 italic leading-relaxed">"{t.quote}"</p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-caption">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Value Stack ── */}
      <section className="bg-surface section-normal">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-foreground mb-2">What You Get for $0.97/Month</h2>
          <p className="text-body text-muted-foreground mb-12">
            Each tool priced individually would cost $97/month. Get all 5 for less than a coffee.
          </p>
        </div>

        <div className="container-narrow space-y-3">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="flex items-center justify-between py-3.5 border-b border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <span className="text-foreground font-medium">{tool.name}</span>
              </div>
              <span className="text-muted-foreground text-sm">{tool.value}</span>
            </div>
          ))}

          <div className="pt-6 mt-4 border-t-2 border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Total individual value:</span>
              <span className="text-muted-foreground line-through">$97/month</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground font-semibold">Your price:</span>
              <span className="text-3xl sm:text-4xl font-bold text-primary">$0.97/month</span>
            </div>
            <p className="text-caption text-center mt-4">
              That's 99% off. For founding members who start now.
            </p>
          </div>
        </div>
      </section>

      {/* ── 7. Mid-Page CTA ── */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-4">5 Tools. $0.97/month. Cancel Anytime.</h2>
          <p className="text-body text-white/50 mb-10">
            Secure payment via Stripe. No sales calls. No spam.
          </p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="btn-primary text-lg px-8 w-full sm:w-auto"
          >
            {checkoutLoading ? "Loading..." : "Start Your Invisible Exit — $0.97/month"}
            {!checkoutLoading && <ArrowRight className="w-5 h-5" />}
          </button>
          <p className="text-sm text-white/40 text-center mt-4">
            30-day money-back guarantee. If you don't validate at least one idea in 30 days, full refund.
          </p>
        </div>
      </section>

      {/* ── 8. Story ── */}
      <section className="bg-white section-wide">
        <div className="container-narrow">
          <p className="text-eyebrow text-muted-foreground mb-8">The Backstory</p>
          <div className="text-body text-muted-foreground space-y-6">
            <p>
              Amsterdam. 6 AM. Raining. I had just landed on a KLM flight with my
              wife and 8-year-old for a family vacation. My phone buzzed in the
              taxi. Two notifications sat side by side.
            </p>
            <p>
              The first: corporate escalation emails. People at my company
              fighting over responsibilities. Again. At 6 AM. On the first morning
              of my vacation.
            </p>
            <p>
              The second: a Stripe notification. "$0.97 received." A complete
              stranger had paid for a landing page I built for plumbers in the
              USA. A business I know nothing about. In a country I don't live in.
              Under a name that isn't mine. While I slept on a plane.
            </p>
            <p>
              I screamed in the taxi. The driver thought I was insane. My wife
              understood: this wasn't about the money. This was proof that the
              cage has a door.
            </p>
            <p>
              I took everything I learned and built it into a system. 5 tools. One
              mission: help corporate managers build invisible recurring revenue.
            </p>
          </div>
        </div>
      </section>

      {/* ── 9. Social Proof ── */}
      <section className="bg-white pb-20 section">
        <div className="container-narrow">
          <p className="text-eyebrow text-muted-foreground mb-8 text-center">Who Is Adrian?</p>
          <div className="card-base bg-surface p-6 sm:p-8">
            <p className="text-body text-muted-foreground leading-relaxed text-center">
              A 37-year-old Managing Director at a European tech company. $120K
              salary. Less than 0.5% equity. 18-month IPO clock. Building
              invisible recurring revenue and documenting the process. Identity
              protected, because that's the whole point.
            </p>
          </div>
          <p className="text-muted-foreground italic text-center mt-6 text-caption">
            Built by a corporate manager, for corporate managers.
          </p>
        </div>
      </section>

      {/* ── 10. FAQ ── */}
      <section className="bg-white section-normal border-t border-border">
        <div className="container-narrow">
          <h2 className="text-h1 text-foreground mb-8">Questions Corporate Managers Ask</h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold text-foreground">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 11. Final CTA ── */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-4">The Cage Has a Door.</h2>
          <p className="text-body text-white/60 mb-10">
            $0.97/month. 5 tools. 5 hours a week. Start building your exit.
          </p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="btn-primary text-lg px-8 w-full sm:w-auto"
          >
            {checkoutLoading ? "Loading..." : "Start for $0.97/month"}
            {!checkoutLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </section>

      {/* ── 12. Email Capture ── */}
      <section className="hero-dark section pb-8">
        <div className="container-narrow pt-16">
          <div className="border-t border-white/10 mb-12" />
          <p className="text-white/50 text-center text-sm mb-2">Not ready yet? No pressure.</p>
          <p className="text-white/40 text-center text-sm mb-6">
            Get Adrian's weekly insights on building invisible income. No spam. Unsubscribe anytime.
          </p>
          <form
            onSubmit={handleEmailSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors min-h-[48px]"
            />
            <button
              type="submit"
              disabled={emailLoading}
              className="bg-white/10 hover:bg-white/20 text-white/80 rounded-xl py-3.5 px-6 text-sm font-medium transition-colors disabled:opacity-50 min-h-[48px] whitespace-nowrap"
            >
              {emailLoading ? "..." : "Subscribe"}
            </button>
          </form>
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <Lock className="w-3 h-3 text-white/30" />
            <span className="text-white/30 text-xs">We respect your privacy.</span>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
};

export default Index;
