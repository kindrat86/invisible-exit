import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANGUAGE_MAP } from "./languages";

/**
 * Catch-all route component that handles /:lang/* URLs.
 *
 * When a user visits /es/blog, React Router doesn't match /blog (because the
 * path is /es/blog). This component intercepts any unmatched path, checks if
 * the first segment is a language code, and if so:
 *   1. Switches i18next to that language
 *   2. Redirects to the path without the language prefix (/blog)
 *
 * The browser URL stays as /es/blog during the redirect-free initial load
 * because we use `replace: true` — but actually we want to KEEP the /es prefix
 * in the URL for SEO. So instead of redirecting, we need a different approach.
 *
 * FINAL APPROACH: We use React Router's `basename` feature. But since basename
 * is set at router creation and can't be dynamic, we instead intercept here:
 * render the page at the stripped path by navigating internally.
 *
 * However, the simplest working approach for Vercel + SPA is:
 *   - The Vercel rewrite serves /index.html for /es/blog
 *   - The SPA loads, React Router sees /es/blog, doesn't match → hits this catch-all
 *   - We strip /es, set the language, and navigate to /blog
 *   - The URL bar shows /blog (not /es/blog) — acceptable for UX, and the
 *     hreflang tags in the HTML head already point to /es/blog for SEO
 *
 * For true URL preservation, we'd need to wrap every Route in :lang? groups.
 * That's a larger refactor — this gets us working immediately.
 */
export default function LangRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length > 0 && LANGUAGE_MAP[segments[0]]) {
      const lang = segments[0];
      const rest = "/" + segments.slice(1).join("/");

      // Switch language
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }

      // Navigate to the stripped path (this renders the actual page)
      navigate(rest, { replace: true });
    }
  }, [location.pathname]);

  // This component renders nothing — it just redirects
  return null;
}
