import { useEffect, useState } from "react";
import { Check, Lock, Palette, Youtube, Globe, Megaphone } from "lucide-react";
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

const BrandManager = () => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { cancelPath: "/brand-manager" },
    });
    setCheckoutLoading(false);
    if (error || !data?.url) {
      toast.error("Could not start checkout. Please try again.");
      return;
    }
    window.location.href = data.url;
  };

  useEffect(() => {
    document.title = "Brand Manager: Build an Invisible Brand | Invisible Exit";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Positioning, visual identity, website templates, and organic channel playbooks. Built for corporate managers building invisible income."
      );
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "Brand Manager: Build an Invisible Brand | Invisible Exit");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc)
      ogDesc.setAttribute(
        "content",
        "Positioning, visual identity, website templates, and organic channel playbooks. Built for corporate managers building invisible income."
      );
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", "https://invisibleexit.com/brand-manager");
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Section 1: Hero */}
      <section className="bg-[#1B2A4A] pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-white/70 text-sm tracking-widest uppercase mb-4">
            FOR MANAGING DIRECTORS BUILDING INVISIBLE BRANDS
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Your Side Business Has No Brand. That's Why Nobody's Buying.
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-6">
            You built the product. You set up Stripe. You even got a few sales. But organic traffic is zero. Nobody finds you on YouTube. Nobody talks about you on Reddit. Your landing page looks like it was made in 2014. You don't have a brand problem. You have an invisibility-without-presence problem.
          </p>
          <p className="text-white/60 text-base max-w-2xl mx-auto mb-10">
            Brand Manager gives you positioning, visual identity, website templates, a voice guide, and organic channel playbooks. Everything you need to build a brand that sells without revealing who you are.
          </p>
          <div className="mb-8">
            <span className="text-white text-4xl md:text-5xl font-bold">$19/mo</span>
            <span className="text-white/50 text-lg ml-3">as part of Founding Member</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {checkoutLoading ? "Loading..." : "Get Brand Manager for $19/mo"}
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
              My first micro-SaaS made $47 in its first month. I was thrilled. Then month two: $51. Month three: $48. Month four: $44. Flat. Dying.
            </p>
            <p>
              I looked at my landing page. It was a white page with a headline, three bullet points, and a Stripe button. No logo. No colors. No voice. No personality. It looked like a test page someone forgot to delete.
            </p>
            <p>
              Then I looked at the competitors who were growing. They had YouTube channels with faceless tutorials. Reddit accounts dropping value in niche subreddits. Landing pages that looked like they were built by a design team. Consistent colors, consistent voice, consistent presence.
            </p>
            <p>
              They weren't better products. They were better brands.
            </p>
            <p>
              I realized something that changed everything: anonymous doesn't mean invisible. You can build a brand that people trust, follow, and buy from, without ever showing your face or revealing your name. The brand is the mask. And the mask is what sells.
            </p>
            <p>
              I rebuilt my landing page. Created a simple visual identity. Started a faceless YouTube channel. Posted helpful threads on Reddit under a brand name. Within 90 days, organic traffic went from 12 visits/month to 1,400. MRR tripled.
            </p>
            <p>
              Brand Manager is everything I learned, packaged into templates, playbooks, and tools so you can do it in days instead of months.
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-8 text-right">-- Adrian</p>
        </div>
      </section>

      {/* Section 3: Problem */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            You Built a Product. But You Didn't Build a Brand.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Megaphone,
                title: "No positioning means no differentiation",
                body: "Your product does the same thing as 15 others. Without clear positioning, you're competing on price alone. And price is a race to the bottom.",
              },
              {
                icon: Palette,
                title: "No visual identity means no trust",
                body: "Your landing page looks like a weekend project. Visitors bounce in 3 seconds because nothing signals credibility, consistency, or professionalism.",
              },
              {
                icon: Youtube,
                title: "No organic channels means no compounding growth",
                body: "You're relying on one-off launches and paid ads. Without YouTube, Reddit, or SEO content, your traffic resets to zero every month.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-xl p-8 shadow-sm"
              >
                <card.icon className="h-8 w-8 text-[#60A5FA] mb-4" />
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
                title: "Define Your Positioning",
                body: "Answer 5 questions about your product and market. Brand Manager generates your unique positioning statement, tagline, and competitive angle.",
              },
              {
                num: "2",
                title: "Generate Your Visual Identity",
                body: "Pick a style direction. Get a complete brand kit: colors, typography, logo concepts, and landing page templates. Ready to deploy in minutes.",
              },
              {
                num: "3",
                title: "Launch Organic Channels",
                body: "Follow step-by-step playbooks for faceless YouTube, Reddit authority building, and SEO content. All designed to grow without revealing your identity.",
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
            Everything You Need to Build an Invisible Brand
          </h2>
          <div className="space-y-20">
            {[
              {
                title: "Know Exactly How to Position Your Product in a Crowded Market",
                subtitle: "Brand Positioning Engine",
                body: "Stop guessing what makes you different. The positioning engine analyzes your product, your market, and your competitors, then generates a positioning statement, tagline, and elevator pitch that actually resonate.",
              },
              {
                title: "Look Like a $10M Company on a $0 Design Budget",
                subtitle: "Visual Identity Kit",
                body: "Get a complete brand identity in minutes: color palette, typography system, logo concepts, social media templates, and style guide. Everything consistent, professional, and designed to build trust at first glance.",
              },
              {
                title: "Launch a Landing Page That Converts, Not Just Exists",
                subtitle: "Website Templates",
                body: "Choose from battle-tested landing page templates built for micro-SaaS. Optimized for conversion, mobile-first, and ready to customize with your brand kit. No design skills required.",
              },
              {
                title: "Build Organic Traffic Without Showing Your Face",
                subtitle: "Organic Channel Playbooks",
                body: "Step-by-step guides for faceless YouTube channels, Reddit authority building, and SEO content strategy. Each playbook includes scripts, posting schedules, and growth benchmarks. Designed for people who need to stay anonymous.",
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
            Would it be worth $19/mo to build a brand that sells while you sleep?
          </p>
        </div>
      </section>

      {/* Section 7: Offer Stack + Pricing */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            Everything You Get as a Founding Member
          </h2>
          <div className="rounded-xl border border-gray-200 p-8">
            <ul className="space-y-4 mb-8">
              {[
                { feature: "Brand Positioning Engine", value: "$12/mo" },
                { feature: "Visual Identity Kit", value: "$15/mo" },
                { feature: "Website Templates Library", value: "$10/mo" },
                { feature: "Organic Channel Playbooks (YouTube + Reddit)", value: "$18/mo" },
                { feature: "Voice & Tone Guide", value: "$8/mo" },
                { feature: "FYM Dashboard (MRR + Exit Timeline)", value: "$12/mo" },
                { feature: "Idea Pipeline + Stealth Ops Hub", value: "$40/mo" },
                { feature: "Private Community + Monthly Masterclass", value: "$146/mo" },
                { feature: "Annual Strategy Call ($500/year)", value: "$42/mo" },
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
                Total Value: <span className="font-bold text-gray-900">$303/mo</span>
              </p>
              <p className="text-gray-400 mb-1">
                Normal Price After Founding: <span className="line-through">$97/mo</span>
              </p>
              <p className="text-3xl font-bold text-[#60A5FA] mb-2">
                Your Founding Price: $19/mo, locked for life
              </p>
              <p className="text-gray-400 text-sm mb-8">
                80% savings. Limited founding spots remaining.
              </p>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="inline-block w-full text-center bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
              >
                {checkoutLoading ? "Loading..." : "Lock In My Founding Price at $19/mo"}
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
            Use Brand Manager for 30 days. If your landing page doesn't look better, your positioning isn't clearer, and your organic channels aren't growing, email us one word: 'refund.' You'll get every cent back within 24 hours. No forms. No calls. No guilt.
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
                Can I build a brand without revealing my identity?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes. That's exactly what Brand Manager is designed for. Every template, playbook, and guide is built for anonymous operators. You'll create a brand identity that builds trust and authority without ever attaching your real name, face, or employer. The brand is the mask.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                I have zero design skills. Will this work for me?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Absolutely. The Visual Identity Kit generates everything for you: colors, fonts, logo concepts, and templates. You don't need Figma, Photoshop, or any design experience. Pick a direction, customize the output, and deploy. Most members have their brand kit ready in under 30 minutes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                How much time does the organic channel strategy take?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                The playbooks are designed for people with full-time jobs. The YouTube playbook requires 2-3 hours per week for faceless videos. The Reddit strategy takes 20 minutes per day. The SEO content plan is one article per week. All designed to compound over time without burning you out.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-left text-gray-900 text-base">
                What's included in the Founding Member tier?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Everything. Brand Manager (positioning, visual identity, templates, voice guide, organic playbooks), plus FYM Dashboard, Idea Pipeline, Stealth Ops Hub, Launch Control, private community, monthly masterclass, beta access to new features, and an annual 1:1 strategy call. All for $19/mo locked for life.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Section 10: Final CTA */}
      <section className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            A Product Without a Brand Is a Secret Nobody Asked to Keep
          </h2>
          <p className="text-white/70 text-lg mb-10">
            $19/mo. Cancel anytime. Build a brand that sells while you stay invisible.
          </p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {checkoutLoading ? "Loading..." : "Get Brand Manager Now"}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BrandManager;
