import { useState, useEffect } from "react";
import { Users, Copy, Check, Gift, Infinity as InfinityIcon, Linkedin, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

/**
 * Referral Engine widget (Dashboard).
 *
 * Server-backed: /api/referral returns a STABLE code per user plus live
 * conversion counts from referral_conversions (written by the Stripe webhook).
 *
 * The offer:
 *   - Each referral → 1 free month (credited automatically)
 *   - 3 referrals   → free for life
 *   - The person referred gets their first month free too
 */
const FREE_FOR_LIFE_AT = 3;

const ReferralWidget = () => {
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [freeForLife, setFreeForLife] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.functions.invoke("referral", {
          body: { action: "get_or_create" },
        });
        if (data?.code) {
          setReferralCode(data.code);
          setReferralCount(data.conversions ?? 0);
          setFreeForLife(!!data.freeForLife);
        }
      } catch {
        // widget is non-critical
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const referralLink = `https://invisibleexit.com/?ref=${referralCode}`;
  const shareText = encodeURIComponent(
    "I'm using Invisible Exit to build side revenue without my employer finding out. This link gives you your first month free:"
  );

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

  if (!referralCode) return null;

  const remaining = Math.max(0, FREE_FOR_LIFE_AT - referralCount);
  const progressPct = Math.min(100, (referralCount / FREE_FOR_LIFE_AT) * 100);

  return (
    <div className="card-base p-6 sm:p-8 relative overflow-hidden">
      {/* Gradient accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12" />

      <div className="flex items-center gap-3 mb-4 relative">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          {freeForLife ? (
            <InfinityIcon className="w-5 h-5 text-primary" />
          ) : (
            <Gift className="w-5 h-5 text-primary" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {freeForLife
              ? "You're free for life 🎉"
              : "Refer 3 Managers → Free For Life"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {freeForLife
              ? "Keep sharing — every referral still gives a friend their first month free."
              : "Every referral = 1 free month for you + first month free for them."}
          </p>
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

        {/* Progress to free-for-life */}
        {!freeForLife && (
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>{referralCount} of {FREE_FOR_LIFE_AT} referrals</span>
              <span>
                {remaining} more → <span className="text-primary font-medium">free for life</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
              {referralCount} successful {referralCount === 1 ? "referral" : "referrals"}
            </span>
          </div>
          <span className="text-primary font-medium">
            {freeForLife
              ? "Free for life"
              : `${referralCount} free ${referralCount === 1 ? "month" : "months"} earned`}
          </span>
        </div>

        {/* One-click shares */}
        <div className="flex items-center gap-2">
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("referral_share_clicked", { channel: "linkedin" })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5" /> Share on LinkedIn
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent("First month of Invisible Exit — free")}&body=${shareText}%0A%0A${encodeURIComponent(referralLink)}`}
            onClick={() => trackEvent("referral_share_clicked", { channel: "email" })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" /> Email a colleague
          </a>
        </div>

        <div className="bg-surface rounded-lg p-3 text-xs text-muted-foreground leading-relaxed">
          💡 Your link gives colleagues their <strong>first month free</strong>. When they
          subscribe, you get a free month automatically — and at {FREE_FOR_LIFE_AT} referrals
          your membership is <strong>free for life</strong>.
        </div>
      </div>
    </div>
  );
};

export default ReferralWidget;
