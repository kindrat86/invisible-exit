import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

/**
 * Category-specific lead magnets for blog content upgrades.
 * Each category gets a unique offer so the upgrade matches reader intent.
 * Brunson principle: every piece of content should have its OWN lead magnet.
 */
const CATEGORY_UPGRADES: Record<
  string,
  { title: string; description: string; icon: string }
> = {
  "Stealth Operations": {
    title: "Get the Stealth Ops Checklist (Free PDF)",
    description:
      "The 47-point checklist for keeping your employer from finding out. Entity setup, compliance audit, digital separation, and operational security — all in a single page.",
    icon: "🛡️",
  },
  "Financial Independence": {
    title: "Get the Freedom Number Calculator (Free Tool)",
    description:
      "Punch in your salary and expenses. See your exact exit number in 90 seconds. No signup required — enter your email and we'll send the link + a breakdown of the math.",
    icon: "💰",
  },
  "Audience Building": {
    title: "Get the Anonymous Audience Playbook (Free PDF)",
    description:
      "The 12-page playbook for building an audience without showing your face. YouTube, Reddit, and Twitter strategies that work behind a pseudonym.",
    icon: "📢",
  },
  "Micro-SaaS": {
    title: "Get the 500-Idea Pipeline (Free Access)",
    description:
      "500+ micro-SaaS ideas scored by industry fit, time investment, and revenue potential. Plus the 48-hour validation process.",
    icon: "💡",
  },
  "Exit Planning": {
    title: "Get the 90-Day Exit Roadmap (Free PDF)",
    description:
      "The exact month-by-month roadmap from salary to freedom. Milestones, tool choices, and decision points for every phase.",
    icon: "🗺️",
  },
  "Growth": {
    title: "Get the First 100 Customers Playbook (Free PDF)",
    description:
      "How corporate managers get their first paying customers without ads, without showing their face, and without spending money.",
    icon: "📈",
  },
  "Validation": {
    title: "Get the 48-Hour Validation Guide (Free PDF)",
    description:
      "Validate any micro-SaaS idea in 48 hours without coding, without spending money, and without quitting your job.",
    icon: "🔬",
  },
  "Strategy": {
    title: "Get the Decision Framework Toolkit (Free PDF)",
    description:
      "The frameworks that help employed founders choose between ideas, allocate time, and sequence decisions. Includes the Cartridge System and Salary-Runway Method.",
    icon: "🧠",
  },
  "Time Management": {
    title: "Get the 5-Hour Operating System (Free PDF)",
    description:
      "The exact weekly system for building a micro-SaaS on 5 hours per week. No productivity fluff — just the schedule.",
    icon: "⏱️",
  },
  "AI Tools": {
    title: "Get the AI Co-Founder Toolkit (Free PDF)",
    description:
      "The AI tools and prompts that replace what you'd normally need a co-founder for. Cursor, Claude, and Supabase patterns for solo builders.",
    icon: "🤖",
  },
};

const DEFAULT_UPGRADE = {
  title: "Get the Freedom Number Checklist (Free PDF)",
  description:
    "The 27-point checklist for calculating your exact freedom number, planning your exit timeline, and tracking your progress. Sent to your inbox.",
  icon: "📋",
};

function getUpgradeForCategory(category?: string) {
  if (category && CATEGORY_UPGRADES[category]) {
    return CATEGORY_UPGRADES[category];
  }
  return DEFAULT_UPGRADE;
}

interface ContentUpgradeProps {
  /** Title override (overrides category-based auto-detect) */
  title?: string;
  /** Description override */
  description?: string;
  /** Source tracking label */
  source?: string;
  /** Which page this appears on */
  slug?: string;
  /** Blog post category — auto-selects the right lead magnet */
  category?: string;
}

/**
 * Inline email capture for blog posts.
 * Russell Brunson: "Every piece of content should have its own lead magnet."
 */
export function ContentUpgrade({
  title,
  description,
  source = "blog_content_upgrade",
  slug = "",
  category,
}: ContentUpgradeProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Pick the best upgrade: explicit override > category match > default
  const upgrade = {
    title: title || getUpgradeForCategory(category).title,
    description: description || getUpgradeForCategory(category).description,
    icon: getUpgradeForCategory(category).icon,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/newsletter-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog" }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          toast.error("Too many attempts. Please try again in a few minutes.");
        } else {
          console.error("Newsletter API error:", await res.json().catch(() => ({})));
          toast.error("Something went wrong — please try again.");
        }
        return;
      }

      trackEvent("content_upgrade_submitted", { source, slug, category });
      setSubmitted(true);
      toast.success("Check your inbox — it's on the way!");
    } catch (err) {
      console.error(err);
      toast.error("Network error — please check your connection and retry.");
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
          Check your inbox for the {upgrade.title.replace(/\(.*\)/, "").trim()}. Also calculate your exact number:
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
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-lg">
          {upgrade.icon}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-primary font-bold mb-1">
            Free Resource
          </p>
          <h3 className="text-sm font-bold text-foreground leading-snug">{upgrade.title}</h3>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{upgrade.description}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          name="email"
          autoComplete="email"
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
          {loading ? "..." : "Send It"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
      <p className="text-xs text-muted-foreground/60 mt-2">No spam. Unsubscribe anytime.</p>
    </div>
  );
}

export default ContentUpgrade;
