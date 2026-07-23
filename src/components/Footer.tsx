import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Mail, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { label: "Belief Crusher", to: "/beliefs" },
      { label: "Movement Lexicon", to: "/lexicon" },
      { label: "The One Thing", to: "/one-thing" },
      { label: "Join the Movement", to: "/join" },
      { label: "Is This You?", to: "/is-this-you" },
      { label: "Dream Customer Avatar", to: "/who" },
      { label: "Where They Hide", to: "/where" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Story", to: "/story" },
      { label: "Integration Marketing", to: "/partners/embed" },
      { label: "Cold Traffic Bridge", to: "/feeling-stuck" },
      { label: "Free Masterclass", to: "/masterclass" },
      { label: "Press & Media Kit", to: "/press" },
      { label: "The Inner Circle", to: "/inner-circle" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Ideas by Profession", to: "/ideas" },
      { label: "AI Tool Ideas", to: "/ideas/for-accountants/with/chatgpt" },
      { label: "Budget Stacks", to: "/budget/0-dollars" },
      { label: "Time Strategy", to: "/hours/5-hours-per-week" },
      { label: "First Year Roadmaps", to: "/first-year" },
      { label: "State Guides", to: "/guides" },
      { label: "Best Tools", to: "/best" },
      { label: "Tool Cross-Reference", to: "/tools" },
      { label: "Tool Stacks", to: "/stack" },
      { label: "Calculators", to: "/calculators" },
      { label: "Freedom Number Calculator", to: "/calculators/freedom-number" },
      { label: "Micro-SaaS Pricing Calculator", to: "/calculators/micro-saas-pricing" },
      { label: "Churn Impact Calculator", to: "/calculators/churn-impact" },
      { label: "AI Automation Niches", to: "/niches/ai-automation" },
      { label: "Developer Tool Niches", to: "/niches/developer-tools" },
      { label: "Break-Even Calculator", to: "/break-even" },
    ],
  },
  {
    title: "Research",
    links: [
      { label: "Non-Compete: Engineers in Texas", to: "/non-compete/software-engineers-texas" },
      { label: "Career vs SaaS", to: "/vs" },
      { label: "Common Mistakes", to: "/mistakes" },
      { label: "Reddit Strategy", to: "/reddit" },
      { label: "Alternatives", to: "/alternatives" },
      { label: "Salaries → SaaS", to: "/salaries" },
      { label: "Non-Compete Guide", to: "/non-compete" },
      { label: "About", to: "/about" },
      { label: "Affiliates (30%)", to: "/affiliates" },
      { label: "Pro ($47/mo)", to: "/pro" },
      { label: "Weekend Workshop ($97)", to: "/weekend-workshop" },
    ],
  },
];

// ── Collapsible section for mobile ──
function CollapsibleSection({
  title,
  links,
  defaultOpen = true,
}: {
  title: string;
  links: { label: string; to: string }[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="md:col-span-1">
      {/* Mobile: collapsible header button, Desktop: just a heading */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between md:cursor-default text-white font-semibold text-sm uppercase tracking-wider mb-4"
        aria-expanded={open}
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 text-white/40 transition-transform md:hidden ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <ul className={`space-y-2.5 ${open ? "block" : "hidden md:block"}`}>
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="block text-white/60 hover:text-white/90 text-sm transition-colors py-1"
              style={{ minHeight: "44px", lineHeight: "44px" }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || done) return;
    setLoading(true);
    trackEvent("footer_email_signup");

    try {
      const res = await fetch("/api/newsletter-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      if (!res.ok) {
        if (res.status === 429) {
          toast.error("Too many attempts. Please try again in a few minutes.");
        } else {
          toast.error("Something went wrong — please try again.");
        }
        return;
      }
      setDone(true);
      toast.success("You're in! Check your inbox.");
    } catch (err) {
      console.error(err);
      toast.error("Network error — please check your connection and retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[hsl(222_47%_9%)] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Newsletter band — Traffic You Own (Secrets 11-15) ── */}
        <div className="py-10 md:py-12 border-b border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/15">
                  <Mail className="w-4.5 h-4.5 text-primary-light" />
                </div>
                <h3 className="text-white font-bold text-lg">
                  Get the weekly exit plan
                </h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-md">
                One actionable insight every week: real MRR numbers, stealth strategies,
                and micro-SaaS lessons from someone doing it while employed. No fluff.
              </p>
            </div>

            {done ? (
              <div className="flex items-center gap-3 text-white/80 text-sm font-medium md:justify-end">
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-success/20 shrink-0">
                  <Check className="w-4 h-4 text-success" />
                </div>
                You're subscribed — check your inbox for the welcome email.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full max-w-md md:ml-auto">
                <input
                  type="email"
                  required
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/30 px-4 py-3 text-[16px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[48px]"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all disabled:opacity-50 whitespace-nowrap min-h-[48px]"
                >
                  {loading ? "..." : "Subscribe"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
          {!done && (
            <p className="text-white/60 text-xs mt-3">
              No spam. Unsubscribe anytime. 100% private.
            </p>
          )}
        </div>

        {/* Top: Link columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 md:py-16">
          {/* Brand */}
          <div className="md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/30">
                <span className="block w-3 h-3 rounded-sm bg-primary" />
              </span>
              <span>Invisible Exit</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Build a side business while employed — invisibly.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://www.reddit.com/r/invisibleexit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="Reddit"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.105 6.79c.769 0 1.383.614 1.383 1.383s-.614 1.383-1.383 1.383-1.383-.614-1.383-1.383.614-1.383 1.383-1.383zM12 8.456c1.588 0 2.863 1.276 2.863 2.864 0 .226-.025.45-.075.665.147.068.285.15.414.244l2.18-1.143a.723.723 0 0 1 .676 1.278l-2.19 1.149c.007.073.012.147.012.222 0 .078-.005.155-.012.232l2.19 1.149a.723.723 0 0 1-.676 1.278l-2.18-1.143a2.382 2.382 0 0 1-.414.244c.05.215.075.44.075.665 0 1.588-1.275 2.864-2.863 2.864s-2.863-1.276-2.863-2.864c0-.225.025-.45.075-.665a2.38 2.38 0 0 1-.414-.244l-2.18 1.143a.723.723 0 0 1-.676-1.278l2.19-1.149A2.87 2.87 0 0 1 9.137 12c0-.075.005-.152.012-.229l-2.19-1.149a.723.723 0 0 1 .676-1.278l2.18 1.143c.129-.094.267-.176.414-.244a2.87 2.87 0 0 1-.075-.665c0-1.588 1.275-2.864 2.863-2.864zm0 1.657c-.656 0-1.206.55-1.206 1.207 0 .656.55 1.206 1.206 1.206s1.206-.55 1.206-1.206c0-.657-.55-1.207-1.206-1.207zm0 4.822c-.656 0-1.206.55-1.206 1.206 0 .657.55 1.207 1.206 1.207s1.206-.55 1.206-1.207c0-.656-.55-1.206-1.206-1.206z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@InvisibleExit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://github.com/kindrat86"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
              <a
                href="https://x.com/invisibleexit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.indiehackers.com/product/invisible-exit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="Indie Hackers"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 15l-4.5-4.5 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
                </svg>
              </a>
            </div>

            {/* Portfolio cross-links — reciprocal backlink mesh */}
            <div className="mt-5 pt-4 border-t border-white/5">
              <p className="text-white/60 text-xs mb-2">Our Network</p>
              <div className="flex flex-wrap gap-x-1 gap-y-1">
                <a href="https://gitdealflow.com" target="_blank" rel="noopener" className="text-white/60 hover:text-white/90 text-xs transition-colors py-2 px-1 min-h-[44px] inline-flex items-center">GitDealFlow</a>
                <a href="https://signals.gitdealflow.com" target="_blank" rel="noopener" className="text-white/60 hover:text-white/90 text-xs transition-colors py-2 px-1 min-h-[44px] inline-flex items-center">Signals</a>
                <a href="https://sipiteno.com" target="_blank" rel="noopener" className="text-white/60 hover:text-white/90 text-xs transition-colors py-2 px-1 min-h-[44px] inline-flex items-center">Sipiteno</a>
                <a href="https://unlocksaas.com" target="_blank" rel="noopener" className="text-white/60 hover:text-white/90 text-xs transition-colors py-2 px-1 min-h-[44px] inline-flex items-center">UnlockSaaS</a>
                <a href="https://voicelogpro.com" target="_blank" rel="noopener" className="text-white/60 hover:text-white/90 text-xs transition-colors py-2 px-1 min-h-[44px] inline-flex items-center">VoiceLogPro</a>
                <a href="https://carshake.online" target="_blank" rel="noopener" className="text-white/60 hover:text-white/90 text-xs transition-colors py-2 px-1 min-h-[44px] inline-flex items-center">CarShake</a>
                <a href="https://churnlens.site" target="_blank" rel="noopener" className="text-white/60 hover:text-white/90 text-xs transition-colors py-2 px-1 min-h-[44px] inline-flex items-center">ChurnLens</a>
                <a href="https://sanctionsai.dev" target="_blank" rel="noopener" className="text-white/60 hover:text-white/90 text-xs transition-colors py-2 px-1 min-h-[44px] inline-flex items-center">SanctionsAI</a>
              </div>
            </div>
          </div>

          {/* Collapsible sections */}
          {FOOTER_SECTIONS.map((section) => (
            <CollapsibleSection
              key={section.title}
              title={section.title}
              links={section.links}
              defaultOpen={false}
            />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-white/5">
          <p className="text-white/50 text-xs sm:text-sm order-2 sm:order-1">
            © {new Date().getFullYear()} Invisible Exit. All rights reserved.
          </p>
          <div className="flex items-center gap-4 order-1 sm:order-2">
            <p className="hidden sm:block text-white/50 text-xs sm:text-sm">
              Built by a corporate manager, for corporate managers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
