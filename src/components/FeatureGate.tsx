import { Rocket } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GATE_MESSAGES: Record<string, { title: string; body: string; cta: string }> = {
  "pipeline-unlimited": {
    title: "You validated your first idea.",
    body: "Want to validate your other ideas? Founding members get unlimited validations, plus the full Launch Checklist to take your best idea live.",
    cta: "Unlock Unlimited Validations",
  },
  "brand": {
    title: "Ready to build your invisible brand?",
    body: "Brand Manager gives you positioning templates, visual identity tools, and sales page copy. Everything you need to look like a real company without revealing yourself.",
    cta: "Unlock Brand Manager",
  },
  "launch": {
    title: "Your idea is validated. Time to ship.",
    body: "Launch Control has 47 steps to take you from validated idea to first paying customer, while keeping your day job. Founding members get the full checklist.",
    cta: "Unlock Launch Control",
  },
  "trends": {
    title: "See where you're headed.",
    body: "Trends shows your freedom score and revenue trajectory over time. Spot patterns, track momentum, prove it's working.",
    cta: "Unlock Trends",
  },
  "stealth-full": {
    title: "Go deeper on anonymity.",
    body: "The full Stealth Ops Hub includes legal templates, a step-by-step anonymity playbook, and a compliance database. Everything to keep your exit invisible.",
    cta: "Unlock Full Stealth Ops",
  },
  "scenarios": {
    title: "Model your exit paths.",
    body: "The Scenario Engine lets you compare growth rates, expenses, and timelines side by side. Find the fastest path to your freedom number.",
    cta: "Unlock Scenario Engine",
  },
  "reverse-calc": {
    title: "Work backwards from your goal.",
    body: "The Reverse Calculator tells you exactly what growth rate you need to hit your target revenue by your deadline. Plus a reality check on whether it's achievable.",
    cta: "Unlock Reverse Calculator",
  },
  "roadmap": {
    title: "Shape what gets built next.",
    body: "Founding Members vote on features and submit requests that go to the top of the queue. You're not a user. You're a co-creator.",
    cta: "Unlock Roadmap Voting",
  },
};

interface FeatureGateProps {
  hasFullAccess: boolean;
  featureId?: string;
  featureName?: string;
  lockedMessage?: string;
  children: React.ReactNode;
}

export default function FeatureGate({
  hasFullAccess,
  featureId,
  featureName,
  lockedMessage,
  children,
}: FeatureGateProps) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (hasFullAccess) return <>{children}</>;

  const contextMessage = featureId ? GATE_MESSAGES[featureId] : null;

  const title = contextMessage?.title ?? (featureName ? `Unlock ${featureName}` : "Unlock This Feature");
  const body = contextMessage?.body ?? lockedMessage ?? "Upgrade to Full Toolkit to unlock this feature.";
  const ctaText = contextMessage?.cta ?? "Upgrade to Full Toolkit";

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier: "founding", returnUrl: window.location.origin + "/dashboard" },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch {
      toast.error("Could not start checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center max-w-md mx-auto">
        {/* Decorative pattern */}
        <div className="w-20 h-20 rounded-2xl bg-[#60A5FA]/10 flex items-center justify-center mx-auto mb-6">
          <Rocket className="w-9 h-9 text-[#60A5FA]" />
        </div>

        <h2 className="text-xl font-bold text-[#0B1D3A] mb-2">
          {title}
        </h2>

        <p className="text-[#4A5568] text-sm mb-6 leading-relaxed">
          {body}
        </p>

        <button
          onClick={handleUpgrade}
          disabled={checkoutLoading}
          className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 text-sm"
        >
          {checkoutLoading ? "Loading..." : `${ctaText} — $17.99/mo`}
        </button>

        <p className="text-xs text-[#9CA3AF] mt-3">
          Founding price, locked for life. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
