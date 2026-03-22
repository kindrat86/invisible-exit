import { Rocket } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FeatureGateProps {
  hasFullAccess: boolean;
  featureName?: string;
  lockedMessage?: string;
  children: React.ReactNode;
}

export default function FeatureGate({
  hasFullAccess,
  featureName,
  lockedMessage,
  children,
}: FeatureGateProps) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (hasFullAccess) return <>{children}</>;

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
          {featureName ? `Unlock ${featureName}` : "Unlock This Feature"}
        </h2>

        <p className="text-[#4A5568] text-sm mb-6 leading-relaxed">
          {lockedMessage || "Upgrade to Full Toolkit to unlock this feature."}
        </p>

        <button
          onClick={handleUpgrade}
          disabled={checkoutLoading}
          className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 text-sm"
        >
          {checkoutLoading ? "Loading..." : "Upgrade to Full Toolkit — $17.99/mo"}
        </button>

        <p className="text-xs text-[#9CA3AF] mt-3">
          Founding price, locked for life. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
