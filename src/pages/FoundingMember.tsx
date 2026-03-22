import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FoundingMember = () => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { plan: "founding" },
    });
    setCheckoutLoading(false);
    if (error || !data?.url) {
      toast.error("Could not start checkout. Please try again.");
      return;
    }
    window.location.href = data.url;
  };

  useEffect(() => {
    document.title = "Founding Member: All 5 Tools for $19/mo | Invisible Exit";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Get all 5 Invisible Exit tools, private community, monthly masterclass, and beta access for $19/month locked for life. Limited to 100 founding members."
      );
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "Founding Member: All 5 Tools for $19/mo | Invisible Exit");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc)
      ogDesc.setAttribute(
        "content",
        "Get all 5 Invisible Exit tools, private community, monthly masterclass, and beta access for $19/month locked for life."
      );
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", "https://invisibleexit.com/founding-member");
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#1B2A4A] pt-32 pb-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-white/60 text-sm tracking-widest uppercase mb-4">
            LIMITED TO 100 FOUNDING MEMBERS
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            All 5 Tools. $19/Month. Locked for Life.
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            FYM Dashboard, Idea Pipeline, Stealth Ops Hub, Launch Control, Brand Manager. Plus private community, monthly masterclass, and beta access to everything we build.
          </p>
          <div className="mb-8">
            <span className="text-white text-4xl md:text-5xl font-bold">$19/mo</span>
            <span className="text-white/50 text-lg ml-3 line-through">$97/mo after founding closes</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {checkoutLoading ? "Loading..." : "Lock In Founding Price"}
          </button>
          <p className="text-white/50 text-sm mt-4">Cancel anytime. Price locks forever at $19/month.</p>
        </div>
      </section>

      {/* Story Section (Star, Story, Solution) */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-400 text-sm tracking-widest uppercase text-center mb-10">
            WHY I BUILT THIS
          </p>
          <div className="text-gray-700 text-lg leading-[1.7] space-y-6">
            <p>
              Six months ago, I was sitting in an earnings call on mute. The SVP was explaining our cash burn rate. The board was getting restless. My golden handcuffs were getting tighter. I had 18 months until the IPO window, and suddenly it felt like it could close.
            </p>
            <p>
              I had everything on paper. The title, the equity, the salary. But I had nothing I controlled. One pivot by the CEO and I'm a casualty. One failed fundraise and my equity is worthless.
            </p>
            <p>
              I tried before. A consulting side project here. A small service business there. Every attempt crashed into the same walls: no time with my kid, compliance grey areas, and the constant fear of board discovery.
            </p>
            <p>
              Then the epiphany. Amsterdam, 6 AM, sitting in a Tesla taxi. Someone paid $0.97 via Stripe to a landing page I built for plumbers. A business I know nothing about. In a country I don't live in. Under a name that isn't mine. While I slept on a plane.
            </p>
            <p>
              I started building differently. Not another service. A real product. Using the 5 core tools I developed. FYM Dashboard. Idea Pipeline. Stealth Ops Hub. Launch Control. Brand Manager. Each one automating what used to take days.
            </p>
            <p>
              That's when I realized: this isn't just my path. This is the path for every Managing Director who's trapped by equity, constrained by time, and ready to see the door.
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-8 text-right">-- Adrian</p>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            Everything Inside Founding Member
          </h2>

          {/* 5 Tools */}
          <div className="space-y-6 mb-12">
            {[
              {
                name: "FYM Dashboard",
                value: "$12/mo",
                description: "Track MRR, churn, growth rate, and exit timeline across all your projects.",
              },
              {
                name: "Idea Pipeline",
                value: "$15/mo",
                description: "Validate new micro-SaaS ideas in 48 hours. Scored for invisibility and revenue potential.",
              },
              {
                name: "Stealth Ops Hub",
                value: "$25/mo",
                description: "Entity separation, compliance checks, digital footprint management. Stay invisible.",
              },
              {
                name: "Launch Control",
                value: "$18/mo",
                description: "One-click product launches. Automated deployment. Ship faster than your day job allows.",
              },
              {
                name: "Brand Manager",
                value: "$27/mo",
                description: "AI-generated YouTube scripts, Reddit playbooks, and organic content strategy.",
              },
            ].map((tool) => (
              <div key={tool.name} className="bg-white rounded-xl p-6 flex items-start gap-4 shadow-sm">
                <Check className="h-5 w-5 text-[#60A5FA] shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                    <span className="text-gray-400 text-sm">{tool.value}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bonuses */}
          <div className="space-y-4 mb-12">
            {[
              { name: "Private Community", value: "Priceless" },
              { name: "Monthly Masterclass", value: "$97/mo" },
              { name: "Beta Access to New Features", value: "Included" },
              { name: "Annual Strategy Call", value: "$500" },
            ].map((bonus) => (
              <div key={bonus.name} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#60A5FA] shrink-0" />
                  <span className="text-gray-700 font-medium">{bonus.name}</span>
                </div>
                <span className="text-gray-400 text-sm">{bonus.value}</span>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500 text-lg mb-1">
              Total Value: <span className="font-bold text-gray-900">$694/mo</span>
            </p>
            <p className="text-gray-400 mb-1">
              Full Price After Founding: <span className="line-through">$97/mo</span>
            </p>
            <p className="text-3xl font-bold text-[#60A5FA] mb-2">
              Founding Price: $19/mo
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Locked for life. Limited to 100 members.
            </p>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="inline-block w-full max-w-md bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {checkoutLoading ? "Loading..." : "Lock In Founding Price"}
            </button>
            <p className="text-gray-400 text-sm mt-3">Cancel anytime. No questions asked.</p>
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
            Use everything for 30 days. If it doesn't change how you think about your exit, email us one word: 'refund.' Every cent back within 24 hours. No forms. No calls. No guilt.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            The Founding Window Won't Stay Open
          </h2>
          <p className="text-gray-600 text-lg mb-10">
            $19/month. All 5 tools. Locked for life. After 100 members, the price goes to $97/month.
          </p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {checkoutLoading ? "Loading..." : "Lock In Founding Price"}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FoundingMember;
