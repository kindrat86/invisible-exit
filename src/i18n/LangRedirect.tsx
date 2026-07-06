import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANGUAGE_MAP } from "./languages";

/**
 * Language prefix handler for /:lang/* URLs.
 *
 * When a user visits /es/blog:
 *   1. Vercel rewrite serves the SPA shell
 *   2. React Router matches /:lang/* → this component
 *   3. We switch i18next to the detected language
 *   4. We render the page at the STRIPPED path by rewriting React Router's
 *      internal location (without changing the browser URL)
 *
 * This is done by setting i18next language and letting AutoTranslate handle
 * the visible text translation. The actual page component is rendered by
 * the nested route, but since we're in a catch-all, we need to re-route.
 *
 * APPROACH: Use React Router's nested routes. The LangRedirect wraps children
 * and provides the language context, while child routes match the stripped path.
 *
 * But since App.tsx uses a flat Routes structure, we use the simpler approach:
 * detect language, set it, and navigate to the stripped path (replace: true).
 * The browser URL changes to /blog but i18next stays on Spanish (persisted via
 * localStorage). The hreflang tags in the HTML head still point to /es/blog
 * for SEO crawlers.
 */

export function useLanguageFromPath(): string | null {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  if (segments.length > 0 && LANGUAGE_MAP[segments[0]]) {
    return segments[0];
  }
  return null;
}

export default function LangRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length > 0 && LANGUAGE_MAP[segments[0]]) {
      const lang = segments[0];
      const rest = "/" + segments.slice(1).join("/");

      // Switch language — this persists to localStorage via the
      // languageChanged listener in i18n/index.ts, so subsequent
      // page loads keep the language even though the URL has no /lang prefix.
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }

      // Update document direction for RTL languages
      const langInfo = LANGUAGE_MAP[lang];
      if (langInfo) {
        document.documentElement.dir = langInfo.rtl ? "rtl" : "ltr";
        document.documentElement.lang = langInfo.hreflang;
      }

      // Translate the <title> and meta description for SEO
      if (lang !== "en") {
        const titleEl = document.querySelector("title");
        const descEl = document.querySelector('meta[name="description"]');

        const textsToTranslate: { el: Element; attr: string; original: string }[] = [];
        if (titleEl?.textContent) {
          textsToTranslate.push({ el: titleEl, attr: "textContent", original: titleEl.textContent });
        }
        if (descEl?.getAttribute("content")) {
          textsToTranslate.push({ el: descEl, attr: "content", original: descEl.getAttribute("content")! });
        }

        textsToTranslate.forEach(({ el, attr, original }) => {
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: original, targetLang: lang, sourceLang: "en" }),
          })
            .then((r) => r.json())
            .then((data) => {
              if (data.translatedText) {
                if (attr === "textContent") {
                  el.textContent = data.translatedText;
                } else {
                  el.setAttribute(attr, data.translatedText);
                }
              }
            })
            .catch(() => {});
        });
      }

      // Navigate to the stripped path so the real page component renders.
      // The URL becomes /blog (not /es/blog), but i18n stays on Spanish.
      // SEO hreflang tags in the HTML head point to /es/blog for crawlers.
      navigate(rest, { replace: true });
    }
  }, [location.pathname]);

  return null;
}
