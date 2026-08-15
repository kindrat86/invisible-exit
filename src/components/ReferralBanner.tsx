import { useEffect, useState } from "react";
import { X, Gift } from "lucide-react";
import { getReferralCode } from "@/lib/referral";

/**
 * Referral Engine — referred-visitor banner.
 * When the visitor arrived via a referral link (?ref=CODE), tell them the
 * deal up front: first month free, applied automatically at checkout.
 */
const ReferralBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("ie_ref_banner_dismissed")) return;
    } catch { /* ignore */ }
    if (getReferralCode()) setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem("ie_ref_banner_dismissed", "1");
    } catch { /* ignore */ }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)]">
      <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-[#0B1D3A] text-white shadow-2xl px-4 py-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Gift className="w-4 h-4 text-primary-light" aria-hidden="true" />
        </div>
        <p className="text-sm leading-snug">
          A colleague referred you — <strong>your first month is free</strong>.
          The discount is applied automatically at checkout.
        </p>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ReferralBanner;
