import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, X } from "lucide-react";

/**
 * Sticky bottom CTA bar for mobile devices.
 * Features:
 * - Appears after scrolling past hero (600px)
 * - Swipe down to dismiss
 * - Tracks scroll direction: hides when scrolling down, shows when scrolling up
 * - Hidden on desktop, auth pages, and funnel pages
 */
const HIDDEN_ROUTES = ["/freedom", "/oto/", "/checkout", "/login", "/dashboard", "/masterclass"];

export function MobileCTABar() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const location = useLocation();
  const touchStartY = useRef(0);
  const lastScrollY = useRef(0);
  const scrollDownCount = useRef(0);

  // Check if current route should hide the CTA bar
  const shouldHide = HIDDEN_ROUTES.some((route) => location.pathname.startsWith(route));

  useEffect(() => {
    if (shouldHide) {
      setVisible(false);
      return;
    }

    const handler = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current;

      // Show after scrolling past hero (600px)
      if (currentY <= 600) {
        setVisible(false);
        scrollDownCount.current = 0;
      } else if (currentY > 600 && !scrollingDown) {
        // Scrolling up past hero: show
        setVisible(true);
        scrollDownCount.current = 0;
      } else if (scrollingDown && currentY > 600) {
        // Scrolling down: increment counter, hide after 3 consecutive down-scroll events
        scrollDownCount.current += 1;
        if (scrollDownCount.current >= 3) {
          setVisible(false);
        }
      }

      lastScrollY.current = currentY;
    };

    // Initial check
    handler();

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [shouldHide, location.pathname]);

  // Reset dismissed state when route changes
  useEffect(() => {
    setDismissed(false);
  }, [location.pathname]);

  // Swipe down to dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY > 50) {
      // Swiped down more than 50px
      setVisible(false);
      setDismissed(true);
    }
  };

  if (shouldHide || dismissed) return null;

  return (
    <div
      className="mobile-cta-bar"
      data-visible={visible}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/60 font-medium">{t("nav.freeCalculator")}</p>
          <p className="text-sm text-white font-semibold truncate">{t("mobileCta.label")}</p>
        </div>
        <Link
          to="/freedom"
          className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors flex-shrink-0 active:scale-95"
          style={{ minHeight: "44px" }}
        >
          {t("mobileCta.button")}
          <ArrowRight className="w-4 h-4" />
        </Link>
        <button
          onClick={() => { setVisible(false); setDismissed(true); }}
          className="flex items-center justify-center w-10 h-10 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0 active:scale-90"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Swipe indicator */}
      <div className="flex justify-center mt-1">
        <div className="w-8 h-1 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
