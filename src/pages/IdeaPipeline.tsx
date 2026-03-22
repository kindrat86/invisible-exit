import { useEffect, useState } from "react";
import { Check, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IdeaDirectory from "@/components/fym/IdeaDirectory";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const IdeaPipeline = () => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {},
    });
    setCheckoutLoading(false);
    if (error || !data?.url) {
      toast.error("Could not start checkout. Please try again.");
      return;
    }
    window.location.href = data.url;
  };

  useEffect(() => {
    document.title = "Idea Pipeline: 1,000+ Invisible Business Ideas | Invisible Exit";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Browse 1,000+ micro-SaaS ideas scored for invisibility, filtered by revenue, time, and difficulty. Validate in 48 hours. Built for corporate managers."
      );
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Section 1: Hero */}
      <section className="bg-[#1B2A4A] pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-white/70 text-sm tracking-widest uppercase mb-4">
            FOR CORPORATE MANAGERS WHO NEED A SIDE PROJECT THAT STAYS INVISIBLE
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            1,000+ Micro-SaaS Ideas. Each One Scored for Invisibility. Yours to Build Tonight.
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-6">
            Stop Googling "side project ideas" at 11 PM. The Idea Pipeline gives you 1,000+ validated
            business ideas filtered by revenue potential, time investment, technical difficulty, and
            how invisible they are from your employer.
          </p>
          <p className="text-white/60 text-base max-w-2xl mx-auto mb-10">
            Every idea includes a monetization model, example tools, startup cost, and a 48-hour
            validation playbook. Pick one. Validate it this weekend. Start earning next month.
          </p>
          <div className="mb-8">
            <span className="text-white text-4xl md:text-5xl font-bold">$0.97/mo</span>
            <span className="text-white/50 text-lg ml-3 line-through">$12/mo</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {checkoutLoading ? "Loading..." : "Unlock 1,000+ Ideas for $0.97/mo"}
          </button>
          <p className="text-white/50 text-sm mt-4">Cancel anytime. No questions asked.</p>
        </div>
      </section>

      {/* Section 2: Epiphany Bridge Story */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-400 text-sm tracking-widest uppercase text-center mb-10">
            WHY I BUILT THIS
          </p>
          <div className="text-gray-700 text-lg leading-[1.7] space-y-6">
            <p>
              I spent three months researching my first side project. Three months of reading blog
              posts, watching YouTube videos, and filling notebooks with ideas that went nowhere.
            </p>
            <p>
              Every "top 50 side hustle" list was the same recycled garbage: dropshipping, print on
              demand, start a podcast. Nothing for someone who needs to stay anonymous. Nothing for
              someone whose employer has a moonlighting clause.
            </p>
            <p>
              When I finally found the right idea, a simple landing page builder for plumbers, it
              took me 48 hours to validate and two weeks to get my first paying customer. The idea
              itself was worth three months of my life.
            </p>
            <p>
              So I built what I wish existed from day one: a curated directory of 1,000+ micro-SaaS
              ideas, each one scored for how invisible it is, how much it can earn, and exactly how
              to validate it in a weekend. No more guessing. No more wasted months.
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-8 text-right">-- Adrian</p>
        </div>
      </section>

      {/* Section 3: Problem */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            The Hardest Part Isn't Building. It's Knowing What to Build.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Drowning in generic business ideas that don't apply to you?",
                body: "Every list assumes you want to be a public founder. You need ideas that work anonymously, under an LLC, with no personal brand required.",
              },
              {
                title: "No way to know if an idea will blow your cover?",
                body: "Some side projects require client calls, social media presence, or industry networking. One wrong idea and your employer's HR team gets a tip.",
              },
              {
                title: "Wasting weekends on ideas that don't validate?",
                body: "You have maybe 10 hours a week. You can't afford to spend 3 months on an idea that was dead on arrival. You need a shortcut to validation.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-xl p-8 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            From Idea to Validation in 48 Hours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: "1",
                title: "Browse 1,000+ Curated Ideas",
                body: "Every idea is scored for invisibility, revenue potential, time investment, and technical difficulty. Filter to match your exact situation.",
              },
              {
                num: "2",
                title: "Pick One That Fits Your Life",
                body: "Filter by industry, startup cost, and hours per week. Find ideas that match your skills, your budget, and your need to stay invisible.",
              },
              {
                num: "3",
                title: "Validate This Weekend",
                body: "Each idea includes a specific validation method you can execute in 48 hours. Cold emails, Reddit posts, landing page tests. Know before you build.",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="bg-[#60A5FA] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mx-auto mb-5">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-white/70 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Features */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            Everything You Need to Find Your Next Invisible Income Stream
          </h2>
          <div className="space-y-20">
            {[
              {
                title: "1,000+ Ideas You Won't Find on Any Blog",
                subtitle: "Curated Idea Directory",
                body: "Not recycled listicles. Each idea is a specific, actionable micro-SaaS concept with a defined niche, monetization model, and example tool stack. Updated regularly.",
              },
              {
                title: "Know Instantly If an Idea Will Blow Your Cover",
                subtitle: "Invisibility Scoring",
                body: "Every idea is scored 1-10 for invisibility. A 10 means zero personal branding, no client calls, no social media. A 5 means some client-facing work. Filter to your comfort level.",
              },
              {
                title: "Filter by Revenue, Time, Cost, and Skill Level",
                subtitle: "Smart Filters",
                body: "Only have 3 hours a week? Filter for it. Want ideas under $200 to start? Filter for it. Need no-code only? Filter for it. Find exactly what fits your constraints.",
              },
              {
                title: "Stop Researching. Start Validating.",
                subtitle: "48-Hour Validation Playbooks",
                body: "Each idea includes a specific validation method: cold email 20 prospects, post on Reddit, launch a landing page. Execute this weekend, know by Monday if it's worth building.",
              },
            ].map((feature, i) => (
              <div
                key={feature.subtitle}
                className={`flex flex-col ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-12`}
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">{feature.subtitle}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{feature.body}</p>
                </div>
                <div className="flex-1 w-full">
                  <div className="rounded-xl bg-gradient-to-br from-[#1B2A4A] to-[#60A5FA]/30 border border-white/10 flex flex-col items-center justify-center h-56 md:h-64 gap-3">
                    <Lock className="h-8 w-8 text-white/40" />
                    <span className="text-white/40 text-sm">Preview available after signup</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Live Preview */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            See It in Action
          </h2>
          <p className="text-gray-600 text-lg text-center max-w-2xl mx-auto mb-12">
            Here's a taste of the Idea Pipeline. Search, filter, and explore real ideas from the
            directory. The full version includes 1,000+ ideas with detailed validation playbooks.
          </p>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <IdeaDirectory />
          </div>
        </div>
      </section>

      {/* Section 7: Trial Close */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-2xl md:text-3xl font-medium italic text-gray-700">
            Would it be worth $0.97 to stop guessing what to build and start building tonight?
          </p>
        </div>
      </section>

      {/* Section 8: Offer Stack + Pricing */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            Everything You Get for $0.97/mo
          </h2>
          <div className="rounded-xl border border-gray-200 p-8">
            <ul className="space-y-4 mb-8">
              {[
                { feature: "1,000+ Curated Micro-SaaS Ideas", value: "$47/mo" },
                { feature: "Invisibility Score for Every Idea (1-10)", value: "$19/mo" },
                { feature: "Smart Filters: Revenue, Time, Cost, Skill", value: "$15/mo" },
                { feature: "48-Hour Validation Playbook per Idea", value: "$29/mo" },
                { feature: "FYM Dashboard: Track Revenue & Exit Timeline", value: "$29/mo" },
              ].map((item) => (
                <li key={item.feature} className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#60A5FA] shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item.feature}</span>
                  </div>
                  <span className="text-gray-400 text-sm whitespace-nowrap">{item.value}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-6 text-center">
              <p className="text-gray-500 text-lg mb-1">
                Total Value: <span className="font-bold text-gray-900">$139/mo</span>
              </p>
              <p className="text-gray-400 mb-1">
                Normal Price: <span className="line-through">$12/mo</span>
              </p>
              <p className="text-3xl font-bold text-[#60A5FA] mb-2">
                Your Price: $0.97/mo
              </p>
              <p className="text-gray-400 text-sm mb-8">
                Introductory pricing locks in for life. New members after launch pay $12/mo.
              </p>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="inline-block w-full text-center bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
              >
                {checkoutLoading ? "Loading..." : "Unlock the Idea Pipeline for $0.97/mo"}
              </button>
              <p className="text-gray-400 text-sm mt-3">Cancel anytime. No questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: Guarantee */}
      <section className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            30-Day No-Questions Guarantee
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Browse the full Idea Pipeline for 30 days. If you don't find at least one idea worth
            validating, if it doesn't save you weeks of research, email us one word: "refund."
            Every cent back within 24 hours. No forms. No calls. No guilt.
          </p>
        </div>
      </section>

      {/* Section 10: FAQ */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible defaultValue="faq-1" className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                Are these real ideas or AI-generated fluff?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Every seed idea is based on real market opportunities. The directory includes ideas
                across 20 industries, each with specific monetization models, tool stacks, and
                validation methods. These aren't vague concepts like "start an app" — they're
                specific niches like "AI-powered review response generator for multi-location
                restaurants."
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                What does "invisibility score" mean?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Each idea is scored 1-10 for how invisible it is from your employer. A score of
                9-10 means you can run it with zero personal branding, under an LLC, with no
                face or real name attached. A score of 5-6 means some client interaction may be
                needed. Filter by score to match your risk tolerance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                I have no coding experience. Are there ideas for me?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes. Filter by "No-Code" or "Low-Code" difficulty. Many ideas use tools like
                Lovable, Bubble, or Zapier, and require zero programming knowledge. The idea cards
                show you exactly which tools you'll need.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                Do I get the FYM Dashboard too?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes. Your $0.97/mo subscription includes full access to the FYM Dashboard (revenue
                tracking, invisibility score, exit timeline) plus the complete Idea Pipeline. Once
                you pick an idea and start earning, switch to the dashboard to track your progress
                toward your exit number.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Section 11: Final CTA */}
      <section className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Every Week Without an Idea Is a Week You Stay in the Cage
          </h2>
          <p className="text-white/70 text-lg mb-10">
            $0.97/mo. 1,000+ ideas. Each one scored, filtered, and ready to validate this weekend.
          </p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {checkoutLoading ? "Loading..." : "Get the Idea Pipeline"}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IdeaPipeline;
