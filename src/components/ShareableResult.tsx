import { useState } from "react";
import { Twitter, Linkedin, MessageSquare, Link2, Check, Share2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const SHARE_TEXT = "My Freedom Number is $4,000/month MRR. That's the exact recurring revenue I need to never work for someone else again. Calculate yours:";

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

const ShareableResult = ({ freedomNumber = "$4,000/month MRR", className = "" }: ShareableResultProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/freedom` : "https://invisibleexit.com/freedom";
  const shareText = `My Freedom Number is ${freedomNumber}. ${SHARE_TEXT}`;
  const shareTitle = `My Freedom Number is ${freedomNumber}`;

  const handleShare = (platform: string) => {
    trackEvent("squeeze_page_submitted", { source: `share_${platform}` });

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
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`mt-6 ${className}`}>
      <div className="flex items-center gap-2 mb-3 justify-center">
        <Share2 className="w-4 h-4 text-white/40" />
        <p className="text-white/40 text-xs uppercase tracking-wide font-medium">
          Share your number
        </p>
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
  );
};

export default ShareableResult;
