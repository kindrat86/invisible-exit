/**
 * i18next configuration — initialized from locale files bundled with the app.
 * Language is detected from URL path (/<lang>/...) or localStorage fallback.
 *
 * For 100 languages, we bundle all locale TS files so switching is instant.
 * The locale files are small (~80 keys each), so total payload is manageable.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./locales/en";
import { DEFAULT_LANGUAGE, LANGUAGE_MAP } from "./languages";

// ── Detect language from URL path or localStorage ──
function detectLanguageFromPath(): string {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  // Priority 1: If localStorage has a language set by LangRedirect, use it
  // (the redirect strips /es from URL, so we need to remember the choice)
  try {
    const stored = localStorage.getItem("i18n_lang");
    if (stored && LANGUAGE_MAP[stored]) {
      return stored;
    }
  } catch {
    // ignore
  }

  // Priority 2: Check URL path for /:lang prefix
  const path = window.location.pathname;
  const segments = path.split("/").filter(Boolean);
  if (segments.length > 0) {
    const first = segments[0];
    if (LANGUAGE_MAP[first]) {
      return first;
    }
  }
  return DEFAULT_LANGUAGE;
}

// ── Load locale files — eager for English (default), lazy for others ──
// English is always bundled (it's the default). Other locales load on demand.
import { en } from "./locales/en";

const resources: Record<string, { translation: Record<string, string> }> = {
  en: { translation: en },
};

// Lazy-load other locales on demand (saves ~400KB from initial bundle)
const localeLoaders = import.meta.glob("./locales/*.ts");

async function loadLocale(code: string): Promise<Record<string, string> | null> {
  if (code === "en") return en;
  const path = `./locales/${code}.ts`;
  const loader = localeLoaders[path];
  if (!loader) return null;
  try {
    const mod = (await loader()) as Record<string, unknown>;
    const exportedKey = Object.keys(mod).find((k) => k !== "default");
    if (exportedKey && typeof mod[exportedKey] === "object") {
      return mod[exportedKey] as Record<string, string>;
    }
  } catch {
    // Locale file not found or failed to load
  }
  return null;
}

const detectedLang = detectLanguageFromPath();

// List of all supported language codes (for supportedLngs)
const ALL_LANG_CODES = Object.keys(LANGUAGE_MAP);

i18n.use(initReactI18next).init({
  resources,
  lng: detectedLang,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: ALL_LANG_CODES,
  partialBundledLanguages: true, // allows adding languages after init
  interpolation: {
    escapeValue: false, // React already escapes
  },
  returnNull: false,
});

// If detected language is not English, load its locale file
if (detectedLang !== "en") {
  loadLocale(detectedLang).then((translations) => {
    if (translations) {
      i18n.addResourceBundle(detectedLang, "translation", translations, true, true);
      i18n.changeLanguage(detectedLang); // trigger re-render with loaded translations
    }
  });
}

// Preload locale when language changes (for LanguageSwitcher)
i18n.on("languageChanged", async (lng) => {
  if (lng !== "en" && !i18n.hasResourceBundle(lng, "translation")) {
    const translations = await loadLocale(lng);
    if (translations) {
      i18n.addResourceBundle(lng, "translation", translations, true, true);
    }
  }
});

// ── Set document direction for RTL languages ──
function updateDocumentDirection(lang: string) {
  const langInfo = LANGUAGE_MAP[lang];
  if (langInfo) {
    document.documentElement.dir = langInfo.rtl ? "rtl" : "ltr";
    document.documentElement.lang = langInfo.hreflang;
  }
}

updateDocumentDirection(detectedLang);
i18n.on("languageChanged", (lng) => {
  updateDocumentDirection(lng);
  try {
    localStorage.setItem("i18n_lang", lng);
  } catch {
    // ignore
  }
});

export default i18n;
