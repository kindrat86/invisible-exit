import { useState } from "react";
import { Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UpgradeOverlayProps {
  children: React.ReactNode;
  title: string;
  description: string;
  ctaText?: string;
}

export default function UpgradeOverlay({
  children,
  title,
  description,
  ctaText = "See Founding Toolkit",
}: UpgradeOverlayProps) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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
    <div className="relative rounded-xl border border-gray-200/50 overflow-hidden">
      <div className="filter blur-[6px] pointer-events-none select-none opacity-70">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#60A5FA]/10 flex items-center justify-center mb-4">
          <Rocket className="w-7 h-7 text-[#60A5FA]" />
        </div>

        <h3 className="text-lg font-semibold text-[#0B1D3A] mb-2">
          {title}
        </h3>

        <p className="text-sm text-[#4A5568] max-w-md mb-5 leading-relaxed">
          {description}
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
