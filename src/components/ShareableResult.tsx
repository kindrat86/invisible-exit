import { useState, useEffect } from "react";
import { Twitter, Linkedin, MessageSquare, Link2, Check, Share2, Lock, Gift, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/**
 * TRAFFIC SECRETS: Secret #20 — Butterfly Marketing
 *
 * Russell's viral sharing mechanic: the most shareable moment
 * on the site (calculator results) gets a share-to-unlock gate.
 *
 * Users who share get an "unlocked" bonus (a second free tool
 * or a personalized roadmap). This creates a viral loop where
 * every calculator result = 1+ new visitors.
 *
 * Mechanic:
 *   1. User sees their Freedom Number result
 *   2. Share buttons are prominent with a "Unlock your bonus" frame
 *   3. After sharing, a bonus section unlocks (extra resource)
 *   4. Each share = 1 new potential visitor to /freedom
 */

const SHARE_TEXT =
  "My Freedom Number is $4,000/month MRR. That's the exact recurring revenue I need to never work for someone else again. Calculate yours:";

const SHARE_URLS = {
  twitter: (url: string, text: string) =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  linkedin: (url: string) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  reddit: (url: string, title: string) =>
    `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
};

interface ShareableResultProps {
  freedomNumber?: string;
  className?: string;
}

const ShareableResult = ({
  freedomNumber = "$4,000/month MRR",
  className = "",
}: ShareableResultProps) => {
  const [copied, setCopied] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [showBonus, setShowBonus] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/freedom`
      : "https://invisibleexit.com/freedom";
  const shareText = `My Freedom Number is ${freedomNumber}. ${SHARE_TEXT}`;
  const shareTitle = `My Freedom Number is ${freedomNumber}`;

  // Check if user has already shared (session-based, not nagging repeat visitors)
  useEffect(() => {
    if (sessionStorage.getItem("ie_shared_freedom") === "true") {
      setHasShared(true);
      setShowBonus(true);
    }
  }, []);

  const handleShare = (platform: string) => {
    trackEvent("squeeze_page_submitted", { source: `share_${platform}` });

    // Butterfly marketing: mark as shared immediately on click intent
    sessionStorage.setItem("ie_shared_freedom", "true");
    setHasShared(true);
    setShowBonus(true);
    trackEvent("butterfly_share_unlocked", { platform, freedom_number: freedomNumber });

    let url: string;
    switch (platform) {
      case "twitter":
        url = SHARE_URLS.twitter(shareUrl, shareText);
        break;
      case "linkedin":
        url = SHARE_URLS.linkedin(shareUrl);
        break;
      case "reddit":
        url = SHARE_URLS.reddit(shareUrl, shareTitle);
        break;
      default:
        return;
    }
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    trackEvent("squeeze_page_submitted", { source: "share_copy_link" });

    // Copy link also unlocks
    sessionStorage.setItem("ie_shared_freedom", "true");
    setHasShared(true);
    setShowBonus(true);
    trackEvent("butterfly_share_unlocked", { platform: "copy_link", freedom_number: freedomNumber });

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`mt-6 ${className}`}>
      {/* Share Section */}
      <div
        className={`rounded-xl border p-5 transition-all duration-500 ${
          hasShared
            ? "bg-emerald-500/5 border-emerald-500/20"
            : "bg-white/5 border-white/10"
        }`}
      >
        <div className="flex items-center gap-2 mb-3 justify-center">
          {hasShared ? (
            <>
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <p className="text-emerald-400 text-xs uppercase tracking-wide font-semibold">
                Bonus Unlocked — Thank You!
              </p>
            </>
          ) : (
            <>
              <Gift className="w-4 h-4 text-amber-400" />
              <p className="text-amber-400 text-xs uppercase tracking-wide font-semibold">
                Share to unlock your bonus roadmap
              </p>
            </>
          )}
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleShare("twitter")}
            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-sky-500/20 border border-white/10 hover:border-sky-500/30 flex items-center justify-center transition-all group"
            aria-label="Share on Twitter/X"
          >
            <Twitter className="w-4 h-4 text-white/60 group-hover:text-sky-400" />
          </button>
          <button
            onClick={() => handleShare("linkedin")}
            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/30 flex items-center justify-center transition-all group"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4 text-white/60 group-hover:text-blue-400" />
          </button>
          <button
            onClick={() => handleShare("reddit")}
            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/30 flex items-center justify-center transition-all group"
            aria-label="Share on Reddit"
          >
            <MessageSquare className="w-4 h-4 text-white/60 group-hover:text-orange-400" />
          </button>
          <button
            onClick={handleCopyLink}
            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${
              copied
                ? "bg-success/20 border-success/30"
                : "bg-white/5 hover:bg-white/10 border-white/10"
            }`}
            aria-label="Copy link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Link2 className="w-4 h-4 text-white/60" />
            )}
          </button>
        </div>

        <p className="text-white/20 text-xs text-center mt-2">
          Every share helps another manager find the door.
        </p>
      </div>

      {/* Butterfly Marketing: Unlocked Bonus */}
      {showBonus && (
        <div className="mt-4 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-blue-500/5 p-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-5 h-5 text-emerald-400" />
            <h4 className="text-emerald-400 font-bold text-sm">
              🎁 Bonus Unlocked: Your Personal Exit Timeline
            </h4>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-3">
            You shared your Freedom Number. Now here's what nobody tells you: the
            timeline from your current salary to your freedom number is shorter
            than you think — if you follow the right system.
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-2xl font-bold text-white">Mo 4</p>
              <p className="text-xs text-white/40">First $</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-2xl font-bold text-white">Mo 9</p>
              <p className="text-xs text-white/40">$2.1K MRR</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-2xl font-bold text-emerald-400">Mo 14</p>
              <p className="text-xs text-white/40">Freedom</p>
            </div>
          </div>
          <a
            href="/masterclass"
            className="block w-full text-center py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Watch the Free 3-Secret Masterclass →
          </a>
          <p className="text-white/20 text-xs text-center mt-2">
            The exact month-by-month system. No fluff. 18 minutes.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShareableResult;
