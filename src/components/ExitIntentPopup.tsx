import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ArrowRight, Lock, Check, Gift } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

/**
 * DOTCOM SECRETS: Chapter 6 — Communication Funnel
 *
 * Russell's Exit Intent Popup: capture visitors who are about to leave
 * without converting. The offer must be irresistible (free + instant value)
 * and the timing must be exit-intent (NOT time-delayed — a timed popup is
 * exactly the intrusive interstitial Google penalizes on mobile).
 *
 * Trigger rules:
 *   - Desktop: mouse leaves viewport through the top
 *   - Mobile: fast scroll-up after real scroll depth — but never on pSEO
 *     content routes (organic landers must not get interstitials)
 *   - Once per session (sessionStorage) AND at most once per 7 days
 *     (localStorage timestamp) — storage failures never crash the page
 */

const HIDDEN_ROUTES = [
  "/freedom",
  "/oto/",
  "/checkout",
  "/login",
  "/dashboard",
  "/masterclass",
  "/tripwire",
  "/ask",
];

/** Organic-entry content routes: no scroll-triggered popups on mobile. */
const CONTENT_ROUTES = [
  "/blog",
  "/glossary",
  "/guides",
  "/ideas",
  "/tools",
  "/data",
  "/professions",
  "/compare",
  "/alternatives",
  "/for/",
  "/salary",
  "/banking",
  "/insurance",
];

const SHOWN_AT_KEY = "ie_exit_shown_at";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function safeGet(storage: "local" | "session", key: string): string | null {
  try {
    return (storage === "local" ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function safeSet(storage: "local" | "session", key: string, value: string) {
  try {
    (storage === "local" ? localStorage : sessionStorage).setItem(key, value);
  } catch {
    /* private mode / blocked storage — degrade silently */
  }
}

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const onHiddenRoute = HIDDEN_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );
  const onContentRoute = CONTENT_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );

  const handleClose = useCallback(() => {
    setVisible(false);
    trackEvent("exit_intent_closed");
  }, []);

  // Close if the user navigates while the popup is open
  useEffect(() => {
    setVisible((v) => (v && onHiddenRoute ? false : v));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (onHiddenRoute) return;

    // Once per session
    if (safeGet("session", "exit_intent_shown")) return;

    // Already subscribed
    if (safeGet("local", "ie_subscribed")) return;

    // At most once per 7 days across sessions
    const shownAt = Number(safeGet("local", SHOWN_AT_KEY) || 0);
    if (shownAt && Date.now() - shownAt < SEVEN_DAYS_MS) return;

    let triggered = false;

    const triggerPopup = () => {
      if (triggered) return;
      // Never fire on funnel/checkout pages, even if listeners linger
      if (
        HIDDEN_ROUTES.some((r) => window.location.pathname.startsWith(r))
      ) {
        return;
      }
      triggered = true;
      safeSet("session", "exit_intent_shown", "true");
      safeSet("local", SHOWN_AT_KEY, String(Date.now()));
      trackEvent("exit_intent_triggered");
      setVisible(true);
    };

    // Desktop: mouse leaves viewport through top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !triggered) {
        triggerPopup();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    // Mobile: rapid scroll up after real depth — suppressed on content routes
    let handleScroll: (() => void) | null = null;
    if (!onContentRoute) {
      let lastScrollY = window.scrollY;
      let scrollDepth = 0;

      handleScroll = () => {
        const currentY = window.scrollY;
        scrollDepth = Math.max(scrollDepth, currentY);
        if (scrollDepth > 1200 && lastScrollY - currentY > 350 && !triggered) {
          triggerPopup();
        }
        lastScrollY = currentY;
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (handleScroll) window.removeEventListener("scroll", handleScroll);
    };
  }, [onHiddenRoute, onContentRoute, location.pathname]);

  // Dialog behavior while open: scroll lock, focus management, Escape, coordination hook
  useEffect(() => {
    if (!visible) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    document.body.dataset.popupOpen = "true";
    dialogRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      delete document.body.dataset.popupOpen;
      previousFocus.current?.focus?.();
    };
  }, [visible, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-intent" }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          toast.error("Too many attempts. Please try again in a few minutes.");
        } else {
          const err = await res.json().catch(() => ({}));
          console.error("Newsletter API error:", err);
          toast.error("Something went wrong — please try again.");
        }
        return;
      }

      trackEvent("exit_intent_submitted");
      safeSet("local", "ie_subscribed", "true");
      setSubmitted(true);
      toast.success("Check your inbox!");
    } catch (err) {
      console.error(err);
      toast.error("Network error — please check your connection and retry.");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm overscroll-contain touch-none"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-title"
        tabIndex={-1}
        className="relative max-w-lg w-full bg-[hsl(222_47%_11%)] rounded-2xl border border-primary/30 shadow-2xl overflow-hidden max-h-[calc(100vh-2rem)] supports-[height:100dvh]:max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain focus:outline-none"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-white/80" />
        </button>

        {/* Top gradient strip */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-primary-light to-primary" />

        <div className="p-6 sm:p-10">
          {!submitted ? (
            <>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <Gift className="w-3.5 h-3.5" />
                WAIT — BEFORE YOU GO
              </div>

              {/* Headline */}
              <h2
                id="exit-intent-title"
                className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight"
              >
                Get the{" "}
                <span className="text-gradient-light">
                  Freedom Number Cheat Sheet
                </span>{" "}
                (Free)
              </h2>

              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                The exact formula for calculating how much recurring revenue
                you need to quit your job. Plus the 5-tool system roadmap.
                Delivered to your inbox in 30 seconds.
              </p>

              {/* Bullets */}
              <div className="space-y-2 mb-6">
                {[
                  "The freedom number formula (salary + expenses / pricing)",
                  "Your personalized exit timeline calculator",
                  "The 5-tool invisible business roadmap",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span className="text-white/70 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  name="email"
                  autoComplete="email"
                  aria-label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your best email address"
                  className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 py-3.5 px-5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-base py-3.5 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Me the Cheat Sheet"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 mt-4 text-white/50 text-xs">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 100% Private
                </span>
                <span>·</span>
                <span>No spam, ever</span>
                <span>·</span>
                <span>Unsubscribe anytime</span>
              </div>

              {/* Skip link */}
              <button
                onClick={handleClose}
                className="block mx-auto mt-4 text-white/60 hover:text-white/80 transition-colors text-sm underline"
              >
                No thanks
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-success" />
              </div>
              <h2
                id="exit-intent-title"
                className="text-2xl font-bold text-white mb-3"
              >
                Check your inbox.
              </h2>
              <p className="text-white/60 text-sm mb-6">
                The cheat sheet is on its way to{" "}
                <strong className="text-white">{email}</strong>.
                While you wait, calculate your freedom number:
              </p>
              <Link
                to="/freedom"
                onClick={handleClose}
                className="btn-primary inline-flex items-center gap-2"
              >
                Calculate My Freedom Number
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
