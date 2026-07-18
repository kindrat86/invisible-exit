import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe, Search, X, Check, ChevronDown } from "lucide-react";
import { LANGUAGES, DEFAULT_LANGUAGE, type Language } from "@/i18n/languages";

interface LanguageSwitcherProps {
  /** Compact mode for navbar (globe icon + current lang), full mode for footer/settings */
  variant?: "compact" | "full";
  className?: string;
}

/**
 * Language switcher with searchable dropdown.
 * Supports all 100 languages. Switching language changes the URL path
 * (e.g. /blog → /es/blog) so SEO hreflang is correct.
 */
export default function LanguageSwitcher({ variant = "compact", className = "" }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  // Filter languages by search
  const filteredLangs = useMemo(() => {
    if (!search.trim()) return LANGUAGES;
    const q = search.toLowerCase();
    return LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        l.iso.toLowerCase().includes(q),
    );
  }, [search]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search when opened — desktop only (on touch it pops the keyboard
  // over the list before the user can see the options)
  useEffect(() => {
    if (open && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  function switchLanguage(lang: Language) {
    i18n.changeLanguage(lang.code);

    // Navigate to translated URL path
    const currentPath = location.pathname;
    const segments = currentPath.split("/").filter(Boolean);

    // Check if first segment is already a language code
    const firstSeg = segments[0];
    const isFirstLang = LANGUAGES.some((l) => l.code === firstSeg);

    let newPath: string;
    if (lang.code === DEFAULT_LANGUAGE) {
      // Default language: remove lang prefix
      if (isFirstLang) {
        segments.shift();
      }
      newPath = "/" + segments.join("/");
    } else {
      // Non-default: add/replace lang prefix
      if (isFirstLang) {
        segments[0] = lang.code;
      } else {
        segments.unshift(lang.code);
      }
      newPath = "/" + segments.join("/");
    }

    // Preserve query/hash
    const search = location.search;
    const hash = location.hash;
    navigate(newPath + search + hash);
    setOpen(false);
    setSearch("");
  }

  if (variant === "compact") {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10"
          aria-label="Change language"
          aria-expanded={open}
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline text-xs uppercase tracking-wide">{currentLang.code}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <LanguageDropdown
            langs={filteredLangs}
            currentCode={currentLang.code}
            search={search}
            setSearch={setSearch}
            onSelect={switchLanguage}
            searchRef={searchInputRef}
          />
        )}
      </div>
    );
  }

  // Full variant (footer/settings)
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium transition-colors hover:bg-surface-2 w-full justify-between"
        aria-label="Change language"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span>{currentLang.flag}</span>
          <span>{currentLang.nativeName}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <LanguageDropdown
          langs={filteredLangs}
          currentCode={currentLang.code}
          search={search}
          setSearch={setSearch}
          onSelect={switchLanguage}
          searchRef={searchInputRef}
          full
        />
      )}
    </div>
  );
}

// ── Shared dropdown ──
function LanguageDropdown({
  langs,
  currentCode,
  search,
  setSearch,
  onSelect,
  searchRef,
  full = false,
}: {
  langs: Language[];
  currentCode: string;
  search: string;
  setSearch: (v: string) => void;
  onSelect: (lang: Language) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
  full?: boolean;
}) {
  return (
    <div
      className={`absolute ${full ? "bottom-full mb-2" : "top-full mt-2"} right-0 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-popover shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150`}
      role="listbox"
    >
      {/* Search */}
      <div className="p-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search languages…"
            className="w-full pl-8 pr-8 py-2 text-[16px] sm:text-sm rounded-lg bg-surface-2 border-0 focus:ring-2 focus:ring-primary outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Language list */}
      <div className="max-h-72 overflow-y-auto py-1">
        {langs.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">No languages found.</div>
        ) : (
          langs.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelect(lang)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-surface-2 ${
                lang.code === currentCode ? "bg-primary/5 font-medium" : ""
              }`}
              role="option"
              aria-selected={lang.code === currentCode}
            >
              <span className="text-base shrink-0">{lang.flag}</span>
              <span className="flex-1 min-w-0">
                <span className="block truncate">{lang.nativeName}</span>
                <span className="block text-xs text-muted-foreground truncate">{lang.name}</span>
              </span>
              {lang.code === currentCode && <Check className="w-4 h-4 text-primary shrink-0" />}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
