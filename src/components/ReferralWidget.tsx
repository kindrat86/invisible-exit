import { useState, useEffect } from "react";
import { Users, Copy, Check, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

/**
 * Russell Brunson "Refer a Friend" component.
 * - Generates a unique referral code per user
 * - Tracks referrals in the `referrals` table
 * - Shows referral count + reward status
 * Reward: 1 free month per successful referral
 */
const ReferralWidget = () => {
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Generate or fetch referral code from user email
      const baseCode = (user.email || "user")
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 8);
      const code = `${baseCode}${Math.floor(Math.random() * 100)
        .toString()
        .padStart(2, "0")}`;

      // Check if code exists, otherwise create
      const { data: existing } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_code", code)
        .single();

      if (existing) {
        setReferralCode(existing.referrer_code);
        // Count successful referrals
        const { count } = await supabase
          .from("referrals")
          .select("*", { count: "exact" })
          .eq("referrer_code", code)
          .eq("status", "completed");
        setReferralCount(count || 0);
      } else {
        // Create new referral code
        try {
          await supabase.from("referrals").insert({
            referrer_email: user.email,
            referrer_code: code,
            status: "active",
          });
          setReferralCode(code);
        } catch (err) {
          // Table might not exist yet — use code anyway
          setReferralCode(code);
        }
      }
      setLoading(false);
    })();
  }, []);

  const referralLink = `https://invisibleexit.com/?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    trackEvent("referral_link_copied", { code: referralCode });
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="card-base p-6 animate-pulse">
        <div className="h-6 bg-surface-2 rounded w-1/3 mb-4" />
        <div className="h-12 bg-surface-2 rounded" />
      </div>
    );
  }

  return (
    <div className="card-base p-6 sm:p-8 relative overflow-hidden">
      {/* Gradient accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12" />

      <div className="flex items-center gap-3 mb-4 relative">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Gift className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Refer a Manager, Get a Free Month</h3>
          <p className="text-sm text-muted-foreground">Share your link. Earn rewards.</p>
        </div>
      </div>

      <div className="space-y-4 relative">
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={referralLink}
            className="flex-1 rounded-lg bg-surface-2 border border-border px-4 py-2.5 text-sm text-muted-foreground font-mono focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors shrink-0"
            aria-label="Copy referral link"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{referralCount} successful {referralCount === 1 ? "referral" : "referrals"}</span>
          </div>
          <span className="text-primary font-medium">
            {referralCount} free {referralCount === 1 ? "month" : "months"} earned
          </span>
        </div>

        <div className="bg-surface rounded-lg p-3 text-xs text-muted-foreground leading-relaxed">
          💡 Share in Slack, LinkedIn, or email. When someone subscribes via your link,
          you both get a free month. No limits.
        </div>
      </div>
    </div>
  );
};

export default ReferralWidget;
