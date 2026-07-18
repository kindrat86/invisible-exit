import { useState } from "react";
import { Quote, Twitter, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ClickToTweetProps {
  quote: string;
  via?: string;
  className?: string;
}

/**
 * Click-to-Tweet component.
 * Brunson principle: Social sharing doesn't happen unless you make it frictionless.
 * A styled pull-quote that opens a Twitter/X share intent on click.
 * Also copies to clipboard as a backup.
 */
export function ClickToTweet({
  quote,
  via = "InvisibleExit",
  className = "",
}: ClickToTweetProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    trackEvent("click_to_tweet_clicked", { quote: quote.slice(0, 80) });

    const text = `${quote} — @${via}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&via=${via}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`"${quote}" — @${via}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative my-8 cursor-pointer rounded-xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6 hover:border-primary/40 hover:bg-primary/[0.06] transition-all ${className}`}
    >
      <div className="absolute -top-3 left-4">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
          <Quote className="w-3.5 h-3.5 text-primary" />
        </div>
      </div>

      <blockquote className="text-base sm:text-lg text-foreground/90 leading-relaxed font-medium italic">
        "{quote}"
      </blockquote>

      <div className="flex items-center justify-between mt-4 gap-3">
        <span className="text-xs text-muted-foreground/60">
          Click to share on X
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              copied
                ? "bg-success/20 text-success"
                : "bg-white/10 hover:bg-primary/20 text-muted-foreground hover:text-primary"
            }`}
            aria-label="Copy quote"
            title="Copy quote"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Twitter className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClickToTweet;
