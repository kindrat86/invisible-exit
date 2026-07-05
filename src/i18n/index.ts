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

// ── Detect language from URL path ──
function detectLanguageFromPath(): string {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
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

// ── Dynamically import all locale files ──
// We use a bundler glob pattern to import all .ts files in the locales directory.
// For Vite, we'll use import.meta.glob.
const localeModules = import.meta.glob("./locales/*.ts", { eager: true });

const resources: Record<string, { translation: Record<string, string> }> = {
  en: { translation: en },
};

for (const [path, module] of Object.entries(localeModules)) {
  const match = path.match(/\/locales\/(.+)\.ts$/);
  if (match) {
    const code = match[1];
    if (code !== "en") {
      const mod = module as Record<string, unknown>;
      // The exported const name varies; grab the first exported object that's not "en"
      const exportedKey = Object.keys(mod).find((k) => k !== "default");
      if (exportedKey && typeof mod[exportedKey] === "object") {
        resources[code] = { translation: mod[exportedKey] as Record<string, string> };
      }
    }
  }
}

const detectedLang = detectLanguageFromPath();

i18n.use(initReactI18next).init({
  resources,
  lng: detectedLang,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: Object.keys(resources),
  interpolation: {
    escapeValue: false, // React already escapes
  },
  returnNull: false,
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
