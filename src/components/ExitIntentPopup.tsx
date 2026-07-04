import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ArrowRight, Lock, Check, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

/**
 * DOTCOM SECRETS: Chapter 6 — Communication Funnel
 *
 * Russell's Exit Intent Popup: capture visitors who are about to leave
 * without converting. The offer must be irresistible (free + instant value)
 * and the timing must be exit-intent (not time-delayed).
 *
 * Features:
 *   - Detects mouse leaving viewport (desktop)
 *   - Detects fast scroll-up (mobile)
 *   - Shows only ONCE per session (sessionStorage)
 *   - Captures email → Supabase subscribers
 *   - Routes to /freedom after capture
 *   - Respects users who are already on funnel pages
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

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Don't show on funnel/checkout pages
    const pathname = window.location.pathname;
    if (HIDDEN_ROUTES.some((route) => pathname.startsWith(route))) return;

    // Don't show if already shown this session
    if (sessionStorage.getItem("exit_intent_shown")) return;

    // Don't show if already subscribed
    if (localStorage.getItem("ie_subscribed")) return;

    let triggered = false;

    const triggerPopup = () => {
      if (triggered) return;
      triggered = true;
      sessionStorage.setItem("exit_intent_shown", "true");
      trackEvent("exit_intent_triggered");
      setVisible(true);
    };

    // Desktop: mouse leaves viewport through top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !triggered) {
        triggerPopup();
      }
    };

    // Mobile: rapid scroll up after scrolling down
    let lastScrollY = window.scrollY;
    let scrollDepth = 0;

    const handleScroll = () => {
      const currentY = window.scrollY;
      scrollDepth = Math.max(scrollDepth, currentY);

      // If they scrolled down 500px+ and then quickly scroll up 300px+
      if (
        scrollDepth > 500 &&
        lastScrollY - currentY > 300 &&
        !triggered
      ) {
        triggerPopup();
      }
      lastScrollY = currentY;
    };

    // Fallback: show after 60 seconds if not triggered
    const fallbackTimer = setTimeout(() => {
      if (!triggered) triggerPopup();
    }, 60000);

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    trackEvent("exit_intent_submitted");
    try {
      await supabase.from("subscribers").upsert(
        {
          email,
          source: "exit_intent_popup",
        },
        { onConflict: "email" }
      );
      localStorage.setItem("ie_subscribed", "true");
      setSubmitted(true);
      toast.success("Check your inbox!");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setVisible(false);
    trackEvent("exit_intent_closed");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative max-w-lg w-full bg-[hsl(222_47%_11%)] rounded-2xl border border-primary/30 shadow-2xl overflow-hidden animate-scale-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>

        {/* Top gradient strip */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-primary-light to-primary" />

        <div className="p-8 sm:p-10">
          {!submitted ? (
            <>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <Gift className="w-3.5 h-3.5" />
                WAIT — BEFORE YOU GO
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
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
              <div className="flex items-center justify-center gap-4 mt-4 text-white/30 text-xs">
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
                className="block mx-auto mt-4 text-white/20 hover:text-white/40 transition-colors text-xs underline"
              >
                No thanks, I'll stay trapped
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
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
