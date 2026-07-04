import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ArrowRight, Calculator } from "lucide-react";

const STORAGE_KEY = "ie_exit_popup_shown";
const SCROLL_THRESHOLD = 0.5; // Show after scrolling 50% of page
const IDLE_THRESHOLD = 30000; // Also show after 30s of inactivity (no scroll/click)

const ExitIntentPopup = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already shown this session, or on non-blog pages
    if (localStorage.getItem(STORAGE_KEY)) return;
    if (!window.location.pathname.startsWith("/blog")) return;
    // Don't show on the squeeze page or homepage
    if (window.location.pathname === "/freedom" || window.location.pathname === "/") return;

    let shown = false;

    const showPopup = () => {
      if (shown) return;
      shown = true;
      setVisible(true);
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      // Track via PostHog
      window.dispatchEvent(
        new CustomEvent("ie:analytics", {
          detail: { event: "exit_intent_popup_shown", timestamp: Date.now() },
        })
      );
    };

    // Trigger 1: Exit intent (mouse leaves top of viewport)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    // Trigger 2: Scrolled past threshold
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled >= SCROLL_THRESHOLD) {
        showPopup();
      }
    };

    // Trigger 3: Idle for 30 seconds
    let idleTimer: ReturnType<typeof setTimeout>;
    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(showPopup, IDLE_THRESHOLD);
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", resetIdle, { passive: true });
    document.addEventListener("click", resetIdle);
    resetIdle();

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", resetIdle);
      document.removeEventListener("click", resetIdle);
      clearTimeout(idleTimer);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleEscape = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleClose();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
      onKeyDown={handleEscape}
      tabIndex={-1}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md card-glass p-8 rounded-2xl border border-white/15 shadow-2xl animate-scale-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 mb-6">
            <Calculator className="w-7 h-7 text-primary-light" />
          </div>

          <p className="text-eyebrow text-primary-light mb-3">Before You Go...</p>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
            Want to know your exact{" "}
            <span className="text-gradient-light">Freedom Number?</span>
          </h2>

          <p className="text-white/60 text-sm mb-6 leading-relaxed">
            The exact monthly revenue you need to never work for someone else again.
            Free calculator. Takes 90 seconds. No credit card.
          </p>

          <Link
            to="/freedom"
            onClick={handleClose}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 min-h-[52px] mb-3"
          >
            Calculate My Freedom Number
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleClose}
            className="text-white/30 hover:text-white/50 text-xs transition-colors"
          >
            No thanks, I'll keep guessing
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
