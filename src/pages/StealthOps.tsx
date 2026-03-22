import { useEffect, useState } from "react";
import { Check, Lock } from "lucide-react";
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

const StealthOps = () => {
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
    document.title = "Stealth Ops Hub: Stay Invisible While You Build | Invisible Exit";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Legal structure templates, anonymity playbook, compliance database, and digital footprint scanner. Everything you need to build income your employer will never find."
      );
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "Stealth Ops Hub: Stay Invisible While You Build | Invisible Exit");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc)
      ogDesc.setAttribute(
        "content",
        "Legal structure templates, anonymity playbook, compliance database, and digital footprint scanner. Everything you need to build income your employer will never find."
      );
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", "https://invisibleexit.com/stealth-ops");
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Section 1: Hero */}
      <section className="bg-[#1B2A4A] pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-white/70 text-sm tracking-widest uppercase mb-4">
            FOR THOSE WHO BUILD IN THE SHADOWS
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            One Google Search Away From Losing Everything You've Built
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-6">
            You're building invisible income on the side. But your LLC is registered under your real name. Your domain WHOIS is public. Your Stripe account links to your personal email. One curious colleague. One HR audit. One LinkedIn search by your boss. That's all it takes.
          </p>
          <p className="text-white/60 text-base max-w-2xl mx-auto mb-10">
            Stealth Ops Hub gives you the legal templates, anonymity playbook, compliance database, and digital footprint scanner to make your side operation truly invisible.
          </p>
          <div className="mb-8">
            <span className="text-white text-4xl md:text-5xl font-bold">$0.97/mo</span>
            <span className="text-white/50 text-lg ml-3 line-through">$25/mo</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {checkoutLoading ? "Loading..." : "Go Invisible for $0.97/mo"}
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
              Six months into my first micro-SaaS, I made a mistake that almost ended everything.
            </p>
            <p>
              I registered an LLC under my real name. It was the default option. Took 3 minutes. I didn't think twice.
            </p>
            <p>
              Two weeks later, a colleague sent me a Slack message: "Hey, I was looking up something for a client and found a company registered under your name. Building something on the side?" He added a winking emoji. Like it was a joke.
            </p>
            <p>
              My heart stopped. I played it off. "Oh that's an old thing from college, never went anywhere." He bought it. This time.
            </p>
            <p>
              That night, I spent 4 hours dismantling every trace. New LLC through a registered agent. WHOIS privacy on every domain. Separate email, separate Stripe, separate everything. I built a checklist. Then a compliance tracker. Then a full system.
            </p>
            <p>
              I realized: the tools to build a SaaS are everywhere. The tools to build one invisibly don't exist. So I built them.
            </p>
            <p>
              Stealth Ops Hub is everything I wish I had before that Slack message. Legal templates pre-configured for anonymity. A playbook that covers every exposure point. A scanner that finds what you missed. Because if someone finds your side business before you're ready to leave, you don't get to choose when you exit. They choose for you.
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-8 text-right">-- Adrian</p>
        </div>
      </section>

      {/* Section 3: Problem */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            You're More Exposed Than You Think
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Your name is on public records right now",
                body: "LLC filings, domain registrations, trademark applications. All searchable. All linked to you. One Google search by your boss, and your invisible income isn't invisible anymore.",
              },
              {
                title: "Your digital footprint connects your day job to your side project",
                body: "Same email provider. Same IP address. Same payment processor linked to your personal bank. The dots are there. It just takes one person to connect them.",
              },
              {
                title: "You don't know what you don't know about compliance",
                body: "Different jurisdictions, different rules. Some states require public disclosure. Some countries report foreign income. One missed filing and you have a legal problem, not just an HR one.",
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
                title: "Audit Your Exposure",
                body: "Run the Digital Footprint Scanner. It checks public records, WHOIS databases, social profiles, and corporate registries to find every trace of your side operation.",
              },
              {
                num: "2",
                title: "Get Your Stealth Blueprint",
                body: "Based on your scan results, Stealth Ops Hub generates a personalized anonymity plan: which entities to restructure, which records to seal, which tools to switch.",
              },
              {
                num: "3",
                title: "Implement With Templates",
                body: "Use pre-built legal templates, entity formation guides, and compliance checklists. Everything pre-configured for maximum invisibility. Most members are fully stealth within a weekend.",
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
            Everything You Need to Disappear
          </h2>
          <div className="space-y-20">
            {[
              {
                title: "Separate Your Identity From Your Business in 48 Hours",
                subtitle: "Anonymity Playbook",
                body: "Step-by-step guide to decouple your real name from every public record. Registered agents, anonymous LLCs, privacy-first tools, email separation, payment isolation. Covers US, UK, EU, and 12 more jurisdictions.",
              },
              {
                title: "File the Right Paperwork Without Hiring a $500/hr Lawyer",
                subtitle: "Legal Structure Templates",
                body: "Pre-built templates for anonymous LLC formation, operating agreements, nominee director arrangements, and holding company structures. Customized for side-project operators who need to stay invisible, not Fortune 500 companies.",
              },
              {
                title: "Know the Rules Before You Break Them by Accident",
                subtitle: "Compliance Database",
                body: "Jurisdiction-by-jurisdiction rules for stealth operations. Tax obligations, disclosure requirements, foreign income reporting, employment contract limitations. Searchable by country, state, and business type.",
              },
              {
                title: "Find Every Trace of Your Side Business Before Someone Else Does",
                subtitle: "Digital Footprint Scanner",
                body: "Automated audit tool that scans public records, WHOIS databases, social media, corporate registries, and payment platforms. Flags every exposure point and gives you a fix for each one. Run it monthly.",
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
            What would it cost you if your employer found out tomorrow?
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
                { feature: "Anonymity Playbook: Full Identity Separation Guide", value: "$47" },
                { feature: "Legal Structure Templates: LLC, Holding Co, Nominee", value: "$97" },
                { feature: "Compliance Database: 30+ Jurisdictions", value: "$29/mo" },
                { feature: "Digital Footprint Scanner: Monthly Audits", value: "$19/mo" },
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
                Total Value: <span className="font-bold text-gray-900">$192+</span>
              </p>
              <p className="text-gray-400 mb-1">
                Normal Price: <span className="line-through">$25/mo</span>
              </p>
              <p className="text-3xl font-bold text-[#60A5FA] mb-2">
                Your Price: $0.97/mo
              </p>
              <p className="text-gray-400 text-sm mb-8">
                Introductory pricing locks in for life. New members after launch pay $25/mo.
              </p>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="inline-block w-full text-center bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
              >
                {checkoutLoading ? "Loading..." : "Go Invisible for $0.97/mo"}
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
            Use Stealth Ops Hub for 30 days. Run the scanner. Download the templates. If you don't feel more protected than you've ever been, if you find a single trace we missed, email us one word: 'refund.' Every cent back within 24 hours. No forms. No calls. No guilt.
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
                Is this legal? I'm not trying to hide from the law.
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Absolutely legal. Everything in Stealth Ops Hub uses legitimate privacy structures: registered agents, anonymous LLCs, WHOIS privacy, and standard corporate formation tools. These are the same tools used by venture capitalists, real estate investors, and public figures. You're not hiding from the law. You're exercising your right to business privacy.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                Does my employment contract prevent me from doing this?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                It depends on your contract. Most employment agreements have non-compete or moonlighting clauses, but they vary widely. Our Compliance Database includes a contract analysis checklist that helps you identify exactly which clauses apply and which don't. We always recommend consulting with an employment lawyer for your specific situation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                How often should I run the Digital Footprint Scanner?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Monthly. Public records update, new databases come online, and your digital footprint changes as you grow. We recommend setting a recurring reminder. Most members run it on the first of each month. It takes less than 2 minutes and gives you peace of mind for the next 30 days.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                I already have an LLC. Is it too late?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Not at all. The Anonymity Playbook includes a full section on restructuring existing entities. You can convert a named LLC to an anonymous one, transfer assets to a holding company, or dissolve and reform. Most members who start with an exposed structure are fully stealth within 2-3 weeks.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-5">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                What jurisdictions do you cover?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                The Compliance Database covers all 50 US states, UK, EU (all member states), Canada, Australia, and 12 additional countries. For entity formation, we focus on the top privacy-friendly jurisdictions: Wyoming, Delaware, New Mexico, Nevada, UK LLP structures, and select offshore options. New jurisdictions are added monthly.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Section 10: Final CTA */}
      <section className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            The Best Time to Go Invisible Was Before You Started. The Second Best Time Is Now.
          </h2>
          <p className="text-white/70 text-lg mb-10">
            $0.97/mo. Cancel anytime. Every day your name is on a public record is a day you're one search away from discovery.
          </p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {checkoutLoading ? "Loading..." : "Go Invisible Now"}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StealthOps;
