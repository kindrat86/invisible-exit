import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANGUAGE_MAP, DEFAULT_LANGUAGE } from "./languages";

/**
 * Handles /:lang/* URL routing for localization.
 *
 * This component sits inside the Router and:
 * 1. Detects if the current path starts with a language code (e.g. /es/blog)
 * 2. Strips the prefix so React Router can match the underlying route (/blog)
 * 3. Tells i18next to switch to that language
 *
 * We don't modify the actual URL — we just intercept navigation and rewrite
 * the internal route. React Router's useNavigate + useLocation are used to
 * transparently redirect /es/blog → /blog while keeping the browser URL as /es/blog.
 *
 * Implementation: We render a wrapper that uses a "base path" approach.
 * Since React Router v6 doesn't natively support dynamic base paths per-route,
 * we use a simpler approach: redirect /:lang/* → /* with the language set.
 */

const LANG_CODES = Object.keys(LANGUAGE_MAP);

/**
 * Check if a path starts with a known language code.
 * Returns { lang: string | null, rest: string }
 */
export function parseLangFromPath(pathname: string): { lang: string | null; rest: string } {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && LANG_CODES.includes(segments[0])) {
    return {
      lang: segments[0],
      rest: "/" + segments.slice(1).join("/"),
    };
  }
  return { lang: null, rest: pathname };
}

/**
 * Hook that any component can use to build a language-aware path.
 * When the current language is non-default, prefixes the path with /:lang.
 */
export function useLocalizedNavigate() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  return (path: string) => {
    const lang = i18n.language;
    if (lang && lang !== DEFAULT_LANGUAGE && LANGUAGE_MAP[lang]) {
      navigate(`/${lang}${path}`);
    } else {
      navigate(path);
    }
  };
}
