import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FYM = () => {
  useEffect(() => {
    document.title = "FYM Dashboard: Track Your Invisible Income | Invisible Exit";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Track recurring revenue, churn, and growth across your micro-SaaS projects. Built for corporate managers building income streams invisibly. $0.97/mo."
      );
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "FYM Dashboard: Track Your Invisible Income | Invisible Exit");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc)
      ogDesc.setAttribute(
        "content",
        "Track recurring revenue, churn, and growth across your micro-SaaS projects. Built for corporate managers building income streams invisibly. $0.97/mo."
      );
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", "https://invisibleexit.com/fym");
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Section 1: Hero */}
      <section className="bg-[#1B2A4A] pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-white/70 text-sm tracking-widest uppercase mb-4">
            FOR MANAGING DIRECTORS BUILDING INVISIBLE INCOME
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            $0.97 From a Stranger While I Slept on a Plane. That's When I Knew the Cage Had a Door.
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-6">
            You're a Managing Director pulling in six figures. But every night after the kids are in bed, you're in a separate browser, building something your employer must never see. You know $4,000/mo in recurring revenue is your ticket out. You just don't know how close you actually are.
          </p>
          <p className="text-white/60 text-base max-w-2xl mx-auto mb-10">
            The FYM Dashboard gives you financial visibility across all your micro-SaaS projects. Revenue, churn, growth rate, invisibility score. All in one place.
          </p>
          <div className="mb-8">
            <span className="text-white text-4xl md:text-5xl font-bold">$0.97/mo</span>
            <span className="text-white/50 text-lg ml-3 line-through">$12/mo</span>
          </div>
          <Link
            to="/checkout/fym"
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors"
          >
            Start Tracking for $0.97/mo
          </Link>
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
              Amsterdam. 6 AM. Raining. I had just landed on a KLM flight with my wife and 8-year-old for a family vacation. We climbed into a Tesla taxi outside Schiphol. The driver started the meter. My phone buzzed.
            </p>
            <p>
              Two notifications sat side by side in the same tray.
            </p>
            <p>
              The first: a chain of corporate escalation emails. People at my company fighting over responsibilities, grey zones, internal conflicts that had been kicked up to me. Again. At 6 AM. On the first morning of my vacation.
            </p>
            <p>
              The second: a Stripe notification. '$0.97 received.'
            </p>
            <p>
              A complete stranger, somewhere in the world, had found a landing page I built for plumbers in the USA. A business I know nothing about. In a country I don't live in. Under a name that isn't mine. And they paid me. While I slept on a plane.
            </p>
            <p>
              I screamed.
            </p>
            <p>
              The taxi driver looked in the rearview mirror, shocked. My wife looked at me like I was insane. Screaming about less than one euro in a taxi in Amsterdam. Then she saw my face. And she understood: this wasn't about the money. This was the proof that the cage has a door.
            </p>
            <p>
              Later that day, I jumped on a call for those corporate escalations. And something had shifted. I resolved the issue faster, better, more effectively, because I was already detached from the corporate game. I wasn't playing for survival anymore. I was playing while already planning my exit.
            </p>
            <p>
              That's when I built what I wish existed: a dashboard that shows your exact MRR across every platform, scores how invisible your operation is, and tells you exactly how many months until you can hand in your notice.
            </p>
            <p>
              The $0.97 was not income. It was proof. Proof that a complete stranger will pay you for something you built alone, with AI, anonymously, while sleeping. And if $0.97 works, $97 works. $970 works. $9,700/mo works. The model scales. And nobody needs to know.
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-8 text-right">-- Adrian</p>
        </div>
      </section>

      {/* Section 3: Problem */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            You Can't Exit What You Can't Measure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "What if you could see every dollar of invisible income in one place?",
                body: "Your revenue is split across Stripe, PayPal, and three different SaaS dashboards. You spend Sunday nights in spreadsheets instead of with your family.",
              },
              {
                title: "Are you one Google search away from your boss finding your side project?",
                body: "One wrong move and your employer finds out. You need a system that scores how invisible your operation actually is.",
              },
              {
                title: "You want $4,000/mo. But are you 3 months away or 3 years?",
                body: "You know you want $2,500-$4,000/mo recurring. But you have no idea if you're on track or how many months away you are.",
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
                title: "Connect Your Accounts",
                body: "Link your Stripe, PayPal, and SaaS platforms. Takes less than 2 minutes.",
              },
              {
                num: "2",
                title: "Get Your Numbers Instantly",
                body: "FYM calculates your MRR, invisibility score, and exit timeline automatically.",
              },
              {
                num: "3",
                title: "Check In Every Morning",
                body: "Open your dashboard before your first meeting. Know exactly when you can walk away.",
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
            Everything You Need to Measure Your Exit
          </h2>
          <div className="space-y-20">
            {[
              {
                title: "Know Your Exact MRR Across Every Platform in 10 Seconds",
                subtitle: "Unified Revenue Tracker",
                body: "Connect all your income streams. See MRR, ARR, churn rate, and growth trend in one dashboard. Updated daily.",
              },
              {
                title: "Sleep Soundly Knowing Your Side Projects Are Invisible",
                subtitle: "Invisibility Score",
                body: "Our proprietary scoring system checks how invisible your operation is. Digital footprint, entity separation, compliance gaps. Get a score from 0-100 and specific fixes.",
              },
              {
                title: "See the Exact Date You Can Hand In Your Resignation",
                subtitle: "Exit Timeline Calculator",
                body: "Set your target ($2,500-$4,000/mo). FYM shows you exactly how many months away you are based on current growth rate. Adjusted weekly.",
              },
              {
                title: "Never Run Out of Invisible Income Ideas",
                subtitle: "Idea Directory: 500+ Validated Ideas",
                body: "Browse 500+ validated micro-SaaS ideas organized by industry, revenue tier, and time investment. Each scored for invisibility compatibility.",
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
            Would it be worth $0.97 to never wonder 'am I close?' again?
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
                { feature: "Know Your Exact MRR Across Every Platform", value: "$29/mo" },
                { feature: "Invisibility Score: 0-100 with Specific Fixes", value: "$19/mo" },
                { feature: "Exit Timeline: Your Exact Resignation Date", value: "$15/mo" },
                { feature: "500+ Validated Micro-SaaS Ideas Directory", value: "$47/mo" },
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
                Total Value: <span className="font-bold text-gray-900">$110/mo</span>
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
              <Link
                to="/checkout/fym"
                className="inline-block w-full text-center bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors"
              >
                Start for $0.97/mo
              </Link>
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
            Use FYM Dashboard for 30 days. If you don't check it every single morning like your coffee, if it doesn't make you feel in control of your exit for the first time, email us one word: 'refund.' You'll get every cent back within 24 hours. No forms. No calls. No guilt.
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
                Will my employer know I'm using this?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                No. FYM Dashboard is a private web app. It doesn't appear on any public profile, doesn't send notifications to anyone, and doesn't require your work email. Your data is encrypted and only accessible with your login credentials. We built this specifically for people who need to stay invisible.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                What if I don't have any revenue yet?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                That's exactly when to start. Use the Idea Directory to find your first project, then track it from dollar one. Many members start at $0 MRR and use the exit timeline as motivation to hit their first $100/mo.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                Why not just use a spreadsheet?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                You can. Most of us did. But a spreadsheet doesn't calculate your invisibility score, doesn't auto-update from Stripe and PayPal, and doesn't tell you how many months until you can quit. FYM replaces the Sunday night spreadsheet session with a 10-second morning check.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                Can I upgrade later?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes. After joining FYM Dashboard, you'll have the option to upgrade to Founding Member, which includes the full toolkit: Idea Pipeline, Stealth Ops Hub, Launch Control, Brand Manager, private community, monthly masterclass, and an annual strategy call.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Section 10: Final CTA */}
      <section className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Every Day You Don't Measure Is a Day You Fly Blind
          </h2>
          <p className="text-white/70 text-lg mb-10">
            $0.97/mo. Cancel anytime. Your invisible income deserves a real dashboard.
          </p>
          <Link
            to="/checkout/fym"
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors"
          >
            Get FYM Dashboard
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FYM;
