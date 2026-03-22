import { useEffect, useState } from "react";
import { Check, Rocket, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LaunchControl = () => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { product: "launch-control" },
    });
    setCheckoutLoading(false);
    if (error || !data?.url) {
      toast.error("Could not start checkout. Please try again.");
      return;
    }
    window.location.href = data.url;
  };

  useEffect(() => {
    document.title = "Launch Control: Idea to Live in Days | Invisible Exit";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Step-by-step launch playbook for corporate managers. Go from idea to live and accepting payments faster than your day job allows. $0.97/mo."
      );
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "Launch Control: Idea to Live in Days | Invisible Exit");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc)
      ogDesc.setAttribute(
        "content",
        "Step-by-step launch playbook for corporate managers. Go from idea to live and accepting payments faster than your day job allows. $0.97/mo."
      );
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", "https://invisibleexit.com/launch-control");
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Section 1: Hero */}
      <section className="bg-[#1B2A4A] pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="bg-[#60A5FA]/20 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-8">
            <Rocket className="h-8 w-8 text-[#60A5FA]" />
          </div>
          <p className="text-white/70 text-sm tracking-widest uppercase mb-4">
            FOR CORPORATE MANAGERS WHO BUILD IN THE SHADOWS
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Go From Idea to Live and Accepting Payments Faster Than Your Day Job Allows
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-6">
            You have the idea. You have the ambition. What you don't have is a playbook that works inside the constraints of a 60-hour corporate week, two kids, and a boss who checks LinkedIn.
          </p>
          <p className="text-white/60 text-base max-w-2xl mx-auto mb-10">
            Launch Control is a step-by-step system that takes you from "I have an idea" to "I just got my first payment" without your employer ever knowing.
          </p>
          <div className="mb-8">
            <span className="text-white text-4xl md:text-5xl font-bold">$0.97/mo</span>
            <span className="text-white/50 text-lg ml-3 line-through">$19/mo</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {checkoutLoading ? "Loading..." : "Add Launch Control for $0.97/mo"}
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
              I spent nine months on my first side project. Nine months of late nights, rabbit holes, and decisions that didn't matter. Should I use Stripe or Paddle? Next.js or plain HTML? .com or .io?
            </p>
            <p>
              By the time I launched, I was exhausted. And the product was mediocre. Not because the idea was bad, but because I burned all my energy on decisions that had nothing to do with getting paid.
            </p>
            <p>
              My second product took eleven days. Same constraints: full-time job, family, secrecy. But I followed a checklist. Every decision was already made. Tech stack: decided. Payment setup: scripted. Domain and hosting: templated. Launch sequence: step by step.
            </p>
            <p>
              Eleven days from "I wonder if anyone would pay for this" to a Stripe notification on my phone. That second product made more in its first week than the first one made in three months.
            </p>
            <p>
              The difference wasn't talent. It wasn't time. It was having a playbook that eliminated every decision except the one that matters: what problem am I solving and who am I solving it for?
            </p>
            <p>
              Launch Control is that playbook. Every step I followed, packaged so you never have to waste nine months learning what I already know.
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-8 text-right">-- Adrian</p>
        </div>
      </section>

      {/* Section 3: Problem */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            Ideas Die in the Gap Between "I Should Build This" and "It's Live"
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "You have the idea, but no playbook",
                body: "You've validated the concept in your head a hundred times. But when you sit down at 10 PM with two hours before sleep, you don't know what to do first. So you research. Again.",
              },
              {
                title: "You're paralyzed by decisions that don't matter",
                body: "Stripe or Paddle? Vercel or Railway? Next.js or Astro? You spend weekends comparing tools instead of shipping. Every decision feels permanent when you only get 6 hours a week.",
              },
              {
                title: "Your day job doesn't leave room for guesswork",
                body: "You have maybe 10 hours a week. You can't afford to spend 8 of them on setup, hosting, and payment integrations. You need a system that makes every hour count.",
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
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: "1",
                title: "Pick Your Idea",
                body: "Use the Idea Validator to choose a project that fits your skills, time, and invisibility requirements. No guesswork.",
              },
              {
                num: "2",
                title: "Follow the Playbook",
                body: "Step-by-step checklists for tech stack, domain, hosting, payment setup, landing page, and launch sequence. Every decision pre-made.",
              },
              {
                num: "3",
                title: "Go Live and Get Paid",
                body: "Ship your product, flip the switch, and get your first payment. Most members go from idea to live in under two weeks.",
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
            Everything You Need to Ship in Days, Not Months
          </h2>
          <div className="space-y-20">
            {[
              {
                title: "Never Stare at a Blank Screen Again",
                subtitle: "Launch Checklist",
                body: "A step-by-step checklist that takes you from zero to live. Each task is specific, time-boxed, and ordered. Just open it and do the next thing.",
              },
              {
                title: "Stop Wasting Weekends Comparing Tools",
                subtitle: "Tech Stack Selector",
                body: "Pre-selected, battle-tested stacks for every type of micro-SaaS. Landing page? Done. API backend? Done. Database? Done. No more analysis paralysis.",
              },
              {
                title: "Accept Payments Before Your Next Sprint Planning",
                subtitle: "Payment Setup Guide",
                body: "Copy-paste Stripe integration scripts, pricing page templates, and checkout flows. Go from zero to accepting payments in under an hour.",
              },
              {
                title: "Your Product Needs a Home. This Gives It One in Minutes",
                subtitle: "Domain & Hosting Playbook",
                body: "Step-by-step guides for buying a domain anonymously, setting up hosting invisibly, and deploying without leaving a trace back to your real identity.",
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

      {/* Section 6: Trial Close */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-2xl md:text-3xl font-medium italic text-gray-700">
            Would it be worth $0.97 to cut your launch time from months to days?
          </p>
        </div>
      </section>

      {/* Section 7: Offer Stack + Pricing */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            Everything You Get for $0.97/mo
          </h2>
          <div className="rounded-xl border border-gray-200 p-8">
            <ul className="space-y-4 mb-8">
              {[
                { feature: "Step-by-Step Launch Checklist", value: "$29/mo" },
                { feature: "Pre-Selected Tech Stacks for Every Use Case", value: "$19/mo" },
                { feature: "Payment Setup Guide with Copy-Paste Scripts", value: "$25/mo" },
                { feature: "Anonymous Domain & Hosting Playbook", value: "$15/mo" },
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
                Total Value: <span className="font-bold text-gray-900">$88/mo</span>
              </p>
              <p className="text-gray-400 mb-1">
                Normal Price: <span className="line-through">$19/mo</span>
              </p>
              <p className="text-3xl font-bold text-[#60A5FA] mb-2">
                Your Price: $0.97/mo
              </p>
              <p className="text-gray-400 text-sm mb-8">
                Introductory pricing locks in for life. New members after launch pay $19/mo.
              </p>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="inline-block w-full text-center bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
              >
                {checkoutLoading ? "Loading..." : "Add Launch Control for $0.97/mo"}
              </button>
              <p className="text-gray-400 text-sm mt-3">Cancel anytime. No questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Guarantee */}
      <section className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            30-Day No-Questions Guarantee
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Use Launch Control for 30 days. If you don't ship faster than you ever have before, if the playbook doesn't eliminate every "what should I do next?" moment, email us one word: 'refund.' Every cent back within 24 hours. No forms. No calls. No guilt.
          </p>
        </div>
      </section>

      {/* Section 9: FAQ */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible defaultValue="faq-1" className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                Do I need to know how to code?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                No. Launch Control includes no-code and AI-assisted paths for every step. If you can follow a checklist and use ChatGPT, you can launch a product. We also include copy-paste scripts for common integrations if you prefer to touch code.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                How is this different from a YouTube tutorial?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                YouTube teaches you concepts. Launch Control gives you a sequence. Every decision is already made. You don't watch and learn, you open the checklist and do the next step. It's the difference between studying for a test and having the answer key.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                Will my employer find out I'm building something?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                The playbook includes specific steps for anonymous domain registration, separate browser profiles, entity separation, and digital footprint management. We built this for people whose careers depend on staying invisible.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                How long does it take to go from idea to live?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Most members with 8-10 hours per week go live within 10-14 days. The playbook is designed for corporate schedules: 1-2 hour blocks in the evenings and a few hours on weekends. No marathon coding sessions required.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-5">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                What if I already have FYM Dashboard?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                They work together perfectly. FYM tracks your numbers once you're live. Launch Control gets you to live in the first place. Think of Launch Control as the ignition and FYM as the instrument panel.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Section 10: Final CTA */}
      <section className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Every Week Without a Playbook Is a Week Your Idea Stays an Idea
          </h2>
          <p className="text-white/70 text-lg mb-10">
            $0.97/mo. Cancel anytime. Go from idea to live before your next performance review.
          </p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {checkoutLoading ? "Loading..." : "Get Launch Control"}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LaunchControl;
