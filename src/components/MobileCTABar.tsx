import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

/**
 * Sticky bottom CTA bar for mobile devices.
 * Appears after the user scrolls past the hero section (or 600px).
 * Hidden on desktop, on auth pages, and on funnel pages where
 * there's already a CTA.
 */
const HIDDEN_ROUTES = ["/freedom", "/oto/", "/checkout", "/login", "/dashboard", "/masterclass"];

export function MobileCTABar() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  // Check if current route should hide the CTA bar
  const shouldHide = HIDDEN_ROUTES.some((route) => location.pathname.startsWith(route));

  useEffect(() => {
    if (shouldHide) {
      setVisible(false);
      return;
    }

    const handler = () => {
      // Show after scrolling past 600px (past hero on most pages)
      setVisible(window.scrollY > 600);
    };

    // Initial check
    handler();

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [shouldHide, location.pathname]);

  if (shouldHide) return null;

  return (
    <div className={`mobile-cta-bar ${visible ? "visible" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/60 font-medium">{t("nav.freeCalculator")}</p>
          <p className="text-sm text-white font-semibold truncate">{t("mobileCta.label")}</p>
        </div>
        <Link
          to="/freedom"
          className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors flex-shrink-0"
          style={{ minHeight: "44px" }}
        >
          {t("mobileCta.button")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
