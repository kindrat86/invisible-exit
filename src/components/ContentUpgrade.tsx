import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

interface ContentUpgradeProps {
  /** Title of the lead magnet */
  title?: string;
  /** Description of what they get */
  description?: string;
  /** Source tracking label */
  source?: string;
  /** Which page this appears on */
  slug?: string;
}

/**
 * Inline email capture for blog posts.
 * Russell Brunson: "Every piece of content should have its own lead magnet."
 */
export function ContentUpgrade({
  title = "Get the Freedom Number Checklist",
  description = "The 27-point checklist for calculating, planning, and hitting your exact freedom number. Free PDF. Sent to your inbox.",
  source = "blog_content_upgrade",
  slug = "",
}: ContentUpgradeProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    trackEvent("content_upgrade_submitted", { source, slug });

    try {
      await supabase.from("subscribers").upsert(
        {
          email,
          source,
          metadata: { content_upgrade_slug: slug },
        },
        { onConflict: "email" }
      );

      await supabase.functions
        .invoke("newsletter-welcome", { body: { email } })
        .catch((err) => console.error("Welcome email error:", err));

      setSubmitted(true);
      toast.success("Check your inbox — your checklist is on the way!");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="my-8 rounded-xl border border-success/30 bg-success/5 p-5 text-center">
        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
          <Check className="w-5 h-5 text-success" />
        </div>
        <p className="text-sm font-semibold text-foreground mb-1">You're in!</p>
        <p className="text-xs text-muted-foreground">
          Check your inbox for the checklist. Also calculate your exact number:
        </p>
        <Link
          to="/freedom"
          className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover text-sm font-medium mt-3"
        >
          Calculate Your Freedom Number <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-primary font-bold mb-1">
            Free Resource
          </p>
          <h3 className="text-sm font-bold text-foreground leading-snug">{title}</h3>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[44px]"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-sm py-2.5 px-5 rounded-lg transition-all disabled:opacity-50 whitespace-nowrap min-h-[44px]"
        >
          {loading ? "..." : "Send PDF"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
      <p className="text-xs text-muted-foreground/60 mt-2">No spam. Unsubscribe anytime.</p>
    </div>
  );
}

export default ContentUpgrade;
