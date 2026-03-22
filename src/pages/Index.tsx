import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  Play,
  Lock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    document.title =
      "Invisible Exit: Build Invisible Recurring Revenue While Employed";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "5 AI-powered tools that help corporate managers build anonymous micro-SaaS businesses. Calculate your freedom number, validate ideas, stay invisible. $0.97/month."
      );
    }
  }, []);

  const handleCheckout = async () => {
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
      toast.success("You're in! We'll send you weekly insights.");
      // Send welcome email (fire-and-forget)
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
      <Navbar />

      {/* ── 1. Hero ── */}
      <section className="bg-[#1B2A4A] pt-32 pb-12 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-blue-400 text-sm tracking-widest uppercase mb-6">
            FOR CORPORATE MANAGERS WHO WANT OUT
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-4xl mx-auto mb-6">
            You're Building a Company You'll Never Own.
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12">
            Hey, my name is Adrian. I am a Managing Director. $120K salary. Less
            than 0.5% equity. I sat down one night and ran the numbers. Even a
            $1B exit, after taxes and dilution, if I invested every cent at 5%,
            the passive income still wouldn't cover my yearly salary. I'd still
            need to work for someone. That's not an exit. That's a longer leash.
            So I started building something invisible on the side. Something
            that's mine. Here's the system.
          </p>

          {/* Video placeholder */}
          <div
            id="video-slot"
            className="mx-auto max-w-3xl rounded-xl overflow-hidden"
          >
            <div className="aspect-video bg-[#1e293b] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-400 flex items-center justify-center">
                <Play className="w-7 h-7 text-slate-900 ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
          {/* CTA directly below video */}
          <div className="mt-4">
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="bg-blue-400 hover:bg-blue-500 text-white font-semibold text-lg py-4 px-8 rounded-xl transition-colors inline-flex items-center gap-2 disabled:opacity-50"
            >
              {checkoutLoading ? "Loading..." : "Start Your Invisible Exit, $0.97/month"}
              {!checkoutLoading && <ArrowRight className="w-5 h-5" />}
            </button>
            <p className="text-sm text-white/40 mt-3">
              Cancel anytime. No contracts. No sales calls. 30-day money-back
              guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Belief Shift / Manifesto ── */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-blue-500 text-sm tracking-widest uppercase mb-12">
            WHAT I BELIEVE
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Belief statements */}
            <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
              <p>
                Corporate loyalty is a transaction, not a virtue. Companies
                design equity structures to keep you, not to reward you. Less
                than 0.5% is a leash disguised as a partnership.
              </p>
              <p>
                The acquisition payout is a lottery ticket. You can't build your
                life on someone else's exit timeline.
              </p>
              <p>
                Your 15 years of corporate operations experience isn't a
                weakness. It's founder gold. You understand customers, systems,
                and execution better than anyone with just a pitch deck.
              </p>
              <p>
                You don't need to quit your job to start. You don't need a
                co-founder. You don't need venture capital. You don't need
                anyone's permission. You need 5 hours a week and a system that
                works within your constraints.
              </p>
            </div>

            {/* Right: "After" vision card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                12 Months From Now
              </h3>
              <p className="text-slate-600 leading-relaxed">
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
          <p className="text-2xl md:text-3xl font-bold text-slate-900 text-center mt-16">
            The cage has a door. Most people never look for it.
          </p>
        </div>
      </section>

      {/* ── 3. The 5 Tools ── */}
      <section className="bg-[#1B2A4A] py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-blue-400 text-sm tracking-widest uppercase mb-4">
            THE SYSTEM
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            5 Tools. Each One Solves a Specific Problem.
          </h2>
          <p className="text-white/60 mb-12">
            From "trapped" to "free." All 5 included at $0.97/month.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <tool.icon className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-1">
                  {tool.name}
                </h3>
                <p className="text-white/70 mb-3">{tool.outcome}</p>
                <p className="text-sm text-white/50">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Value Stack ── */}
      <section className="bg-[#F8FAFC] py-20 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            What You Get for $0.97/Month
          </h2>
          <p className="text-slate-500 mb-12">
            Each tool priced individually would cost $97/month. Get access to
            all 5 for less than a coffee.
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-4">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="flex items-center justify-between py-3 border-b border-slate-200"
            >
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-slate-800 font-medium">{tool.name}</span>
              </div>
              <span className="text-slate-500">{tool.value}</span>
            </div>
          ))}

          <div className="pt-4 border-t border-slate-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">Total individual value:</span>
              <span className="text-slate-400 line-through">$97/month</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-900 font-semibold">Your price:</span>
              <span className="text-3xl font-bold text-blue-500">
                $0.97/month
              </span>
            </div>
            <p className="text-sm text-slate-500 text-center mt-4">
              That's 99% off. For founding members who start now.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. Mid-Page CTA ── */}
      <section className="bg-[#1B2A4A] py-20 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            5 Tools. $0.97/month. Cancel Anytime.
          </h2>
          <p className="text-white/50 mb-10">
            Secure payment via Stripe. No sales calls. No spam.
          </p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="bg-blue-400 hover:bg-blue-500 text-white font-semibold text-lg py-4 px-8 rounded-xl transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            {checkoutLoading ? "Loading..." : "Start Your Invisible Exit, $0.97/month"}
            {!checkoutLoading && <ArrowRight className="w-5 h-5" />}
          </button>
          <p className="text-sm text-white/40 text-center mt-4">
            30-day money-back guarantee. If you don't validate at least one idea
            in 30 days, full refund.
          </p>
        </div>
      </section>

      {/* ── 6. Condensed Story ── */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-slate-400 text-sm tracking-widest uppercase mb-8">
            THE BACKSTORY
          </p>
          <div className="text-slate-700 text-lg leading-relaxed space-y-6">
            <p>
              Amsterdam. 6 AM. Raining. I had just landed on a KLM flight with
              my wife and 8-year-old for a family vacation. My phone buzzed in
              the taxi. Two notifications sat side by side.
            </p>
            <p>
              The first: corporate escalation emails. People at my company
              fighting over responsibilities. Again. At 6 AM. On the first
              morning of my vacation.
            </p>
            <p>
              The second: a Stripe notification. "$0.97 received." A complete
              stranger had paid for a landing page I built for plumbers in the
              USA. A business I know nothing about. In a country I don't live
              in. Under a name that isn't mine. While I slept on a plane.
            </p>
            <p>
              I screamed in the taxi. The driver thought I was insane. My wife
              understood: this wasn't about the money. This was proof that the
              cage has a door.
            </p>
            <p>
              I took everything I learned and built it into a system. 5 tools.
              One mission: help corporate managers build invisible recurring
              revenue.
            </p>
          </div>
        </div>
      </section>

      {/* ── 7. Social Proof / Who Is Adrian ── */}
      <section className="bg-white pb-20 px-6">
        <div className="mx-auto max-w-2xl">
          <p className="text-slate-400 text-sm tracking-widest uppercase mb-8 text-center">
            WHO IS ADRIAN?
          </p>
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <p className="text-slate-600 leading-relaxed">
              A 37-year-old Managing Director at a European tech company. $120K
              salary. Less than 0.5% equity. 18-month IPO clock. Building invisible
              recurring revenue and documenting the process. Identity protected,
              because that's the whole point.
            </p>
          </div>
          <p className="text-slate-400 italic text-center mt-6">
            Built by a corporate manager, for corporate managers.
          </p>
        </div>
      </section>

      {/* ── 8. FAQ ── */}
      <section className="bg-white py-20 px-6 border-t border-slate-100">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Questions Corporate Managers Ask</h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold text-slate-900">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 9. Final CTA ── */}
      <section className="bg-[#1B2A4A] py-20 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The Cage Has a Door.
          </h2>
          <p className="text-white/60 mb-10">
            $0.97/month. 5 tools. 5 hours a week. Start building your exit.
          </p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="bg-blue-400 hover:bg-blue-500 text-white font-semibold text-lg py-4 px-8 rounded-xl transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            {checkoutLoading ? "Loading..." : "Start for $0.97/month"}
            {!checkoutLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </section>

      {/* ── 10. Email Capture Safety Net ── */}
      <section className="bg-[#1B2A4A] px-6 pb-8">
        <div className="mx-auto max-w-lg pt-16">
          <div className="border-t border-white/10 mb-12" />
          <p className="text-white/50 text-center text-sm mb-2">
            Not ready yet? No pressure.
          </p>
          <p className="text-white/40 text-center text-sm mb-6">
            Get Adrian's weekly insights on building invisible income. No spam.
            Unsubscribe anytime.
          </p>
          <form
            onSubmit={handleEmailSubscribe}
            className="flex gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            />
            <button
              type="submit"
              disabled={emailLoading}
              className="bg-white/10 hover:bg-white/20 text-white/70 rounded-xl py-3 px-6 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {emailLoading ? "..." : "Subscribe"}
            </button>
          </form>
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <Lock className="w-3 h-3 text-white/30" />
            <span className="text-white/30 text-xs">
              We respect your privacy.
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
