import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Rocket, X } from "lucide-react";
import { toast } from "sonner";

export default function UpgradeBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (dismissed) return null;

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier: "founding", returnUrl: window.location.origin + "/dashboard" },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      toast.error("Could not start checkout. Please try again.");
      console.error(err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="bg-[#1B2A4A] rounded-xl p-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3 min-w-0">
        <Rocket className="w-5 h-5 text-[#60A5FA] shrink-0" />
        <div className="min-w-0">
          <p className="text-white text-sm font-medium">
            Unlock all features — $17.99/month (founding price, locked for life)
          </p>
          <p className="text-white/50 text-xs">Limited to the first 100 Founding Members</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleUpgrade}
          disabled={checkoutLoading}
          className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {checkoutLoading ? "..." : "Upgrade"}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/30 hover:text-white/60 transition-colors p-1"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
