import { useState } from "react";
import { Twitter, Linkedin, MessageSquare, Copy, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface SocialShareProps {
  /** The title of the content being shared */
  title: string;
  /** The URL path (without domain) e.g. /blog/how-much-money */
  url?: string;
  /** Optional custom share text (defaults to title) */
  text?: string;
  /** Visual variant: "horizontal" for inline buttons, "stacked" for sidebar */
  variant?: "horizontal" | "stacked";
  /** Dark mode (for pages with dark backgrounds) */
  dark?: boolean;
}

const SITE_URL = "https://invisibleexit.com";

/**
 * TRAFFIC SECRETS: The Viral Loop
 *
 * Russell Brunson: "Every piece of content needs a sharing mechanism.
 * Without it, your traffic is limited to the people who already know you."
 *
 * This component adds social sharing to every blog post, calculator result,
 * and content page — turning passive readers into distribution nodes.
 */
const SocialShare = ({
  title,
  url,
  text,
  variant = "horizontal",
  dark = false,
}: SocialShareProps) => {
  const [copied, setCopied] = useState(false);

  const fullUrl = url ? `${SITE_URL}${url}` : typeof window !== "undefined" ? window.location.href : SITE_URL;
  const shareText = text || title;

  const shareLinks = [
    {
      name: "Twitter/X",
      icon: Twitter,
      color: dark ? "text-sky-400 hover:bg-sky-500/15" : "text-sky-500 hover:bg-sky-500/10",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}&via=invisibleexit`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: dark ? "text-blue-400 hover:bg-blue-500/15" : "text-blue-600 hover:bg-blue-500/10",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
    },
    {
      name: "Reddit",
      icon: MessageSquare,
      color: dark ? "text-orange-400 hover:bg-orange-500/15" : "text-orange-500 hover:bg-orange-500/10",
      href: `https://www.reddit.com/submit?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(shareText)}`,
    },
  ];

  const handleShare = (platform: string) => {
    trackEvent("social_share", { platform, url: fullUrl, title: shareText });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      trackEvent("social_share", { platform: "copy_link", url: fullUrl });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = fullUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col gap-2 ${dark ? "" : ""}`}>
        <span className={`text-xs font-semibold uppercase tracking-wider mb-1 ${dark ? "text-white/40" : "text-muted-foreground"}`}>
          Share
        </span>
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleShare(link.name)}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${link.color}`}
            aria-label={`Share on ${link.name}`}
          >
            <link.icon className="w-4 h-4" />
          </a>
        ))}
        <button
          onClick={handleCopy}
          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
            copied
              ? "bg-emerald-500/15 text-emerald-500"
              : dark
              ? "text-white/40 hover:bg-white/10"
              : "text-muted-foreground hover:bg-muted"
          }`}
          aria-label="Copy link"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${dark ? "" : ""}`}>
      <span className={`text-sm font-medium mr-2 ${dark ? "text-white/50" : "text-muted-foreground"}`}>
        Share:
      </span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare(link.name)}
          className={`inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${link.color}`}
          aria-label={`Share on ${link.name}`}
        >
          <link.icon className="w-4 h-4" />
        </a>
      ))}
      <button
        onClick={handleCopy}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
          copied
            ? "bg-emerald-500/15 text-emerald-500"
            : dark
            ? "text-white/40 hover:bg-white/10"
            : "text-muted-foreground hover:bg-muted"
        }`}
        aria-label="Copy link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default SocialShare;
