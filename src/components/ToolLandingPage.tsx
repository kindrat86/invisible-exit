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

interface Feature {
  title: string;
  subtitle: string;
  body: string;
}

interface OfferItem {
  feature: string;
  value: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ToolLandingPageProps {
  meta: {
    title: string;
    description: string;
    ogUrl: string;
  };
  hero: {
    prehead: string;
    headline: string;
    story: string;
    subtext: string;
    price: string;
    normalPrice: string;
  };
  epiphany: {
    paragraphs: string[];
    signature: string;
  };
  problems: Array<{ title: string; body: string }>;
  steps: Array<{ title: string; body: string }>;
  features: Feature[];
  trialClose: string;
  offerItems: OfferItem[];
  totalValue: string;
  faqs: FAQ[];
  finalCta: {
    headline: string;
    subtext: string;
    buttonText: string;
  };
  checkoutPlan: string;
}

const ToolLandingPage = ({
  meta,
  hero,
  epiphany,
  problems,
  steps,
  features,
  trialClose,
  offerItems,
  totalValue,
  faqs,
  finalCta,
  checkoutPlan,
}: ToolLandingPageProps) => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { plan: checkoutPlan },
    });
    setCheckoutLoading(false);
    if (error || !data?.url) {
      toast.error("Could not start checkout. Please try again.");
      return;
    }
    window.location.href = data.url;
  };

  useEffect(() => {
    document.title = meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", meta.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", meta.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", meta.description);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", meta.ogUrl);
  }, [meta]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#1B2A4A] pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-white/70 text-sm tracking-widest uppercase mb-4">{hero.prehead}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {hero.headline}
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-6">{hero.story}</p>
          <p className="text-white/60 text-base max-w-2xl mx-auto mb-10">{hero.subtext}</p>
          <div className="mb-8">
            <span className="text-white text-4xl md:text-5xl font-bold">{hero.price}</span>
            <span className="text-white/50 text-lg ml-3 line-through">{hero.normalPrice}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {checkoutLoading ? "Loading..." : `Start for ${hero.price}`}
          </button>
          <p className="text-white/50 text-sm mt-4">Cancel anytime. No questions asked.</p>
        </div>
      </section>

      {/* Epiphany Bridge */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-400 text-sm tracking-widest uppercase text-center mb-10">WHY I BUILT THIS</p>
          <div className="text-gray-700 text-lg leading-[1.7] space-y-6">
            {epiphany.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-8 text-right">{epiphany.signature}</p>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            {problems.length > 0 ? "The Problem" : ""}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problems.map((card) => (
              <div key={card.title} className="bg-white rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="bg-[#60A5FA] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mx-auto mb-5">
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-white/70 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            What's Inside
          </h2>
          <div className="space-y-20">
            {features.map((feature, i) => (
              <div
                key={feature.subtitle}
                className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12`}
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

      {/* Trial Close */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-2xl md:text-3xl font-medium italic text-gray-700">{trialClose}</p>
        </div>
      </section>

      {/* Offer Stack */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            Everything You Get for {hero.price}
          </h2>
          <div className="rounded-xl border border-gray-200 p-8">
            <ul className="space-y-4 mb-8">
              {offerItems.map((item) => (
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
                Total Value: <span className="font-bold text-gray-900">{totalValue}</span>
              </p>
              <p className="text-gray-400 mb-1">
                Normal Price: <span className="line-through">{hero.normalPrice}</span>
              </p>
              <p className="text-3xl font-bold text-[#60A5FA] mb-2">Your Price: {hero.price}</p>
              <p className="text-gray-400 text-sm mb-8">
                Introductory pricing locks in for life.
              </p>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="inline-block w-full text-center bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
              >
                {checkoutLoading ? "Loading..." : `Start for ${hero.price}`}
              </button>
              <p className="text-gray-400 text-sm mt-3">Cancel anytime. No questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">30-Day No-Questions Guarantee</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Use it for 30 days. If it doesn't deliver, email us one word: 'refund.' Every cent back within 24 hours.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible defaultValue="faq-0" className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-gray-900 text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{finalCta.headline}</h2>
          <p className="text-white/70 text-lg mb-10">{finalCta.subtext}</p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {checkoutLoading ? "Loading..." : finalCta.buttonText}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ToolLandingPage;
