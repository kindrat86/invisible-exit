import { useState } from "react";
import { ArrowRight, Mail, Lock, CheckCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface InlineNewsletterProps {
  /** Dark mode for dark-section placement */
  dark?: boolean;
  /** Optional custom heading override */
  heading?: string;
  /** Optional subtext override */
  subtext?: string;
  /** Where this form is placed (for tracking) */
  source?: string;
  /** Compact variant for tight spaces */
  compact?: boolean;
}

/**
 * TRAFFIC SECRETS: Traffic You Own
 *
 * Russell Brunson: "Your email list is your most valuable asset.
 * You don't own your social media followers. You don't own your SEO traffic.
 * You own your email list."
 *
 * This inline form captures emails from blog posts, guides, and content pages.
 * The Freedom Number Calculator result is the lead magnet.
 *
 * Placement: After blog content, mid-article on long posts, at the bottom
 * of every pillar page. Converts readers into subscribers.
 */
const InlineNewsletter = ({
  dark = false,
  heading,
  subtext,
  source = "inline_form",
  compact = false,
}: InlineNewsletterProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || done) return;
    setLoading(true);
    trackEvent("email_signup", { source, placement: "inline" });

    try {
      // Use the same newsletter-welcome API as the squeeze page
      const res = await fetch("/api/newsletter-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          metadata: { placement: "inline" },
        }),
      });

      // Even if API fails (e.g. Vercel dev), show success — we don't want to
      // block the reading experience on a network error
      if (!res.ok) {
        console.error("Newsletter API error:", await res.json().catch(() => ({})));
      }

      setDone(true);
    } catch (err) {
      // Don't punish the reader for a network error
      console.error(err);
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={`rounded-2xl border p-6 text-center ${
        dark
          ? "bg-white/[0.04] border-white/10"
          : "bg-primary/5 border-primary/20"
      }`}>
        <CheckCircle className={`w-8 h-8 mx-auto mb-3 ${dark ? "text-primary-light" : "text-primary"}`} />
        <p className={`font-semibold mb-1 ${dark ? "text-white" : "text-foreground"}`}>
          You're in.
        </p>
        <p className={`text-sm ${dark ? "text-white/50" : "text-muted-foreground"}`}>
          Check your inbox for the Freedom Number Calculator link.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border ${compact ? "p-5" : "p-8"} ${
      dark
        ? "bg-gradient-to-br from-primary/10 to-transparent border-primary/25"
        : "bg-gradient-to-br from-primary/5 to-transparent border-primary/15"
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${
          dark ? "bg-primary/15" : "bg-primary/10"
        }`}>
          <Mail className={`w-5 h-5 ${dark ? "text-primary-light" : "text-primary"}`} />
        </div>
        <h3 className={`font-bold ${compact ? "text-lg" : "text-xl"} ${dark ? "text-white" : "text-foreground"}`}>
          {heading || "Get Your Freedom Number"}
        </h3>
      </div>

      <p className={`mb-5 ${dark ? "text-white/60" : "text-muted-foreground"} ${compact ? "text-sm" : "text-base"}`}>
        {subtext || "Calculate the exact monthly revenue that replaces your salary. Free tool, takes 90 seconds. Sent to your inbox."}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
            dark
              ? "bg-white/10 border border-white/15 text-white placeholder:text-white/30"
              : "bg-background border border-border text-foreground"
          }`}
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? (
            <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>
              Calculate
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className={`flex items-center gap-4 mt-3 text-xs ${dark ? "text-white/40" : "text-muted-foreground/70"}`}>
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          100% Private
        </span>
        <span>No spam, ever</span>
        <span>Unsubscribe anytime</span>
      </div>
    </div>
  );
};

export default InlineNewsletter;
