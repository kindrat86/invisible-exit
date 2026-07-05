import { useState } from "react";
import { Twitter, Linkedin, Link2, Check, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url?: string;
  className?: string;
}

export function ShareButtons({ title, url, className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const shareText = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}&via=InvisibleExit`,
      "_blank",
      "noopener,noreferrer,width=600,height=400"
    );
  };

  const handleLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer,width=600,height=400"
    );
  };

  const handleReddit = () => {
    window.open(
      `https://www.reddit.com/submit?url=${encodedUrl}&title=${shareText}`,
      "_blank",
      "noopener,noreferrer,width=600,height=600"
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-white/70 font-medium mr-1">Share:</span>
      <button
        onClick={handleTwitter}
        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary hover:text-white text-white/80 flex items-center justify-center transition-all"
        aria-label="Share on Twitter/X"
        title="Share on Twitter/X"
      >
        <Twitter className="w-4 h-4" />
      </button>
      <button
        onClick={handleLinkedIn}
        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary hover:text-white text-white/80 flex items-center justify-center transition-all"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </button>
      <button
        onClick={handleReddit}
        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary hover:text-white text-white/80 flex items-center justify-center transition-all"
        aria-label="Share on Reddit"
        title="Share on Reddit"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
      <button
        onClick={handleCopy}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
          copied
            ? "bg-green-500/20 text-green-400"
            : "bg-white/10 hover:bg-primary hover:text-white text-white/80"
        }`}
        aria-label="Copy link"
        title="Copy link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default ShareButtons;
