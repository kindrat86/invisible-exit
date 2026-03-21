import { useEffect } from "react";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const scrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
};

const FYM = () => {
  useEffect(() => {
    document.title = "FYM Dashboard: Track Your Invisible Income | Invisible Exit";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Track recurring revenue, churn, and growth across your micro-SaaS projects. Built for corporate managers building income streams invisibly. EUR 0.97/month."
      );
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "FYM Dashboard: Track Your Invisible Income | Invisible Exit");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc)
      ogDesc.setAttribute(
        "content",
        "Track recurring revenue, churn, and growth across your micro-SaaS projects. Built for corporate managers building income streams invisibly. EUR 0.97/month."
      );
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", "https://invisibleexit.com/fym");
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#1B2A4A] pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-white/70 text-sm tracking-wide mb-4">
            For Managing Directors Building Invisible Income
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Track Your Recurring Revenue to EUR 4,000/Month
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            The FYM Dashboard gives you financial visibility across all your micro-SaaS projects.
            Revenue, churn, growth rate, invisibility score. All in one place.
          </p>
          <div className="mb-8">
            <span className="text-white text-4xl md:text-5xl font-bold">EUR 0.97/month</span>
            <span className="text-white/50 text-lg ml-3 line-through">EUR 12/mo</span>
          </div>
          <a
            href="#pricing"
            onClick={scrollToPricing}
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors"
          >
            Start Tracking for EUR 0.97/month
          </a>
          <p className="text-white/50 text-sm mt-4">Cancel anytime. No questions asked.</p>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            You Can't Exit What You Can't Measure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Scattered Numbers",
                body: "Your revenue is split across Stripe, PayPal, and three different SaaS dashboards. You spend Sunday nights in spreadsheets instead of with your family.",
              },
              {
                title: "No Invisibility Check",
                body: "One wrong move and your employer finds out. You need a system that scores how invisible your operation actually is.",
              },
              {
                title: "No Exit Timeline",
                body: "You know you want EUR 2,500-4,000/month recurring. But you have no idea if you're on track or how many months away you are.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-gray-50 rounded-xl p-8 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Everything You Need to Measure Your Exit
          </h2>
          <div className="space-y-20">
            {[
              {
                title: "Unified Revenue Tracker",
                body: "Connect all your income streams. See MRR, ARR, churn rate, and growth trend in one dashboard. Updated daily.",
              },
              {
                title: "Invisibility Score",
                body: "Our proprietary scoring system checks how invisible your operation is. Digital footprint, entity separation, compliance gaps. Get a score from 0-100 and specific fixes.",
              },
              {
                title: "Exit Timeline Calculator",
                body: "Set your target (EUR 2,500-4,000/month). FYM shows you exactly how many months away you are based on current growth rate. Adjusted weekly.",
              },
              {
                title: "Idea Directory",
                body: "Browse 500+ validated micro-SaaS ideas organized by industry, revenue tier, and time investment. Each scored for invisibility compatibility.",
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={`flex flex-col ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-12`}
              >
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70 text-lg leading-relaxed">{feature.body}</p>
                </div>
                <div className="flex-1 w-full">
                  <div className="rounded-xl border border-white/10 bg-white/5 flex items-center justify-center h-56 md:h-64">
                    <span className="text-white/30 text-sm">Screenshot coming soon</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FYM Dashboard */}
            <div className="rounded-xl border border-gray-200 p-8 flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">FYM Dashboard</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">EUR 0.97</span>
                <span className="text-gray-500">/month</span>
                <span className="block text-gray-400 line-through text-sm mt-1">EUR 12/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Unified Revenue Tracker",
                  "Invisibility Score",
                  "Exit Timeline",
                  "Idea Directory",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-[#60A5FA] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#pricing"
                onClick={scrollToPricing}
                className="inline-block text-center border-2 border-[#60A5FA] text-[#60A5FA] hover:bg-[#60A5FA] hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Start for EUR 0.97/month
              </a>
              <p className="text-gray-400 text-sm text-center mt-3">Cancel anytime</p>
            </div>

            {/* Founding Member */}
            <div className="rounded-xl border-2 border-[#60A5FA] p-8 flex flex-col relative shadow-lg shadow-[#60A5FA]/10">
              <span className="absolute -top-3 left-6 bg-[#60A5FA] text-white text-xs font-semibold px-3 py-1 rounded-full">
                Recommended
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Founding Member</h3>
              <div className="mb-1">
                <span className="text-4xl font-bold text-gray-900">EUR 19</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-sm text-[#60A5FA] font-medium mb-2">locked for life</p>
              <span className="text-gray-400 line-through text-sm mb-6">
                EUR 97/month after founding closes
              </span>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "FYM Dashboard",
                  "Idea Pipeline",
                  "Stealth Ops Hub",
                  "Launch Control",
                  "Brand Manager",
                  "Private community",
                  "Monthly masterclass",
                  "Beta access",
                  "Annual strategy call",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-[#60A5FA] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#pricing"
                onClick={scrollToPricing}
                className="inline-block text-center bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Lock In Founding Price
              </a>
              <p className="text-gray-400 text-sm text-center mt-3">Limited founding spots</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            30-Day No-Questions Guarantee
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            If you're not using FYM Dashboard daily after 30 days, we'll refund every cent. No
            emails, no forms, no guilt. Just a refund.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="employer">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                Will my employer know I'm using this?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                No. FYM Dashboard is designed for invisibility. No employer-visible digital
                footprint. We don't even send marketing emails to work addresses.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="no-revenue">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                What if I don't have any revenue yet?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                That's exactly when to start. FYM Dashboard includes the Idea Directory with 500+
                validated micro-SaaS ideas. Start tracking from day zero.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="upgrade">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                Can I upgrade to Founding Member later?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes, but the founding price (EUR 19/month locked for life) is only available during
                the founding window. After that, it's EUR 97/month.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="difference">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                What's the difference between FYM Dashboard and Founding Member?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                FYM Dashboard is one of 5 tools. Founding Member gives you all 5 plus private
                community, monthly masterclasses, and beta access to new features.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Start Measuring Your Exit
          </h2>
          <p className="text-white/70 text-lg mb-10">
            EUR 0.97/month. Cancel anytime. Your invisible income deserves a real dashboard.
          </p>
          <a
            href="#pricing"
            onClick={scrollToPricing}
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors"
          >
            Get FYM Dashboard
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FYM;
