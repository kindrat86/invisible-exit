/**
 * Inline translation components for full page content localization.
 *
 * <T>      — translates a short inline string (headings, labels, buttons)
 * <TBlock> — translates a block of text (paragraphs, descriptions)
 * <TList>  — translates an array of strings, returns translated array
 * <TRich>  — translates text containing JSX/markdown, preserves markup
 *
 * All components use the /api/translate edge endpoint with localStorage caching.
 * When language is English, they render the original text with zero overhead.
 */

import { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

// ── Shared cache (same logic as useTranslatedContent) ──
interface CacheEntry {
  text: string;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h
const CACHE_PREFIX = "ie_tr_";

function hash(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) - h + text.charCodeAt(i)) | 0;
  }
  return String(Math.abs(h));
}

function getCache(text: string, lang: string): string | null {
  const key = `${CACHE_PREFIX}${lang}_${hash(text)}`;
  const mem = memoryCache.get(key);
  if (mem && Date.now() - mem.timestamp < CACHE_TTL) return mem.text;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const entry: CacheEntry = JSON.parse(stored);
      if (Date.now() - entry.timestamp < CACHE_TTL) {
        memoryCache.set(key, entry);
        return entry.text;
      }
      localStorage.removeItem(key);
    }
  } catch {}
  return null;
}

function setCache(text: string, lang: string, translated: string) {
  const key = `${CACHE_PREFIX}${lang}_${hash(text)}`;
  const entry: CacheEntry = { text: translated, timestamp: Date.now() };
  memoryCache.set(key, entry);
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {}
}

// ── Core translation fetch ──
const batchQueue: { text: string; lang: string; resolve: (t: string) => void }[] = [];
const batchTimer: ReturnType<typeof setTimeout> | null = null;

async function translateText(text: string, lang: string): Promise<string> {
  if (lang === "en" || !text || text.trim().length === 0) return text;

  // Check cache
  const cached = getCache(text, lang);
  if (cached !== null) return cached;

  try {
    const resp = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang: lang, sourceLang: "en" }),
    });
    if (!resp.ok) throw new Error("Translation failed");
    const data = await resp.json();
    const result: string = data.translatedText || text;
    setCache(text, lang, result);
    return result;
  } catch {
    return text; // graceful fallback to English
  }
}

/**
 * <T> — translates a short string inline.
 *
 * Usage:
 *   <T>Build a side business while employed</T>
 *   <T text="Some text" />
 *
 * Props:
 *   text  — if provided, translates this string; otherwise translates children
 *   as    — HTML tag to render (default: span)
 */
export function T({
  children,
  text,
  as: Tag = "span",
  className,
}: {
  children?: ReactNode;
  text?: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const source = text || (typeof children === "string" ? children : "");
  const [translated, setTranslated] = useState(source);

  useEffect(() => {
    if (lang === "en" || !source) {
      setTranslated(source);
      return;
    }
    let cancelled = false;
    translateText(source, lang).then((t) => {
      if (!cancelled) setTranslated(t);
    });
    return () => {
      cancelled = true;
    };
  }, [source, lang]);

  // @ts-expect-error dynamic tag
  return <Tag className={className}>{translated}</Tag>;
}

/**
 * <TBlock> — translates a block of text (paragraph, heading, etc.)
 * Same as <T> but defaults to <p> and handles longer text better.
 */
export function TBlock({
  children,
  text,
  as: Tag = "p",
  className,
}: {
  children?: ReactNode;
  text?: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const source = text || (typeof children === "string" ? children : "");
  const [translated, setTranslated] = useState(source);

  useEffect(() => {
    if (lang === "en" || !source) {
      setTranslated(source);
      return;
    }
    let cancelled = false;
    translateText(source, lang).then((t) => {
      if (!cancelled) setTranslated(t);
    });
    return () => {
      cancelled = true;
    };
  }, [source, lang]);

  // @ts-expect-error dynamic tag
  return <Tag className={className}>{translated}</Tag>;
}

/**
 * useT hook — translate a string, returns { text, loading }
 * For use in hooks/non-JSX contexts.
 */
export function useT(source: string): { text: string; loading: boolean } {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const [state, setState] = useState({ text: source, loading: false });

  useEffect(() => {
    if (lang === "en" || !source) {
      setState({ text: source, loading: false });
      return;
    }
    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));
    translateText(source, lang).then((t) => {
      if (!cancelled) setState({ text: t, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, [source, lang]);

  return state;
}

/**
 * useTMany hook — translate multiple strings at once.
 * Returns an array aligned with input. More efficient than multiple useT calls.
 */
export function useTMany(sources: string[]): { texts: string[]; loading: boolean } {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const [texts, setTexts] = useState(sources);
  const [loading, setLoading] = useState(false);

  const key = sources.join("|||");

  useEffect(() => {
    if (lang === "en") {
      setTexts(sources);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    // Translate all in parallel (with concurrency limit)
    const concurrency = 5;
    const results = [...sources];
    let index = 0;

    async function worker() {
      while (index < sources.length) {
        const i = index++;
        results[i] = await translateText(sources[i], lang);
        if (!cancelled) setTexts([...results]);
      }
    }

    Promise.all(Array.from({ length: Math.min(concurrency, sources.length) }, worker)).then(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, lang]);

  return { texts, loading };
}

/**
 * useTObject hook — translate an object's string fields.
 * Pass any data object, get back a translated copy.
 *
 *   const tPost = useTObject(blogPost, ['title', 'excerpt', 'content'])
 */
export function useTObject<T extends Record<string, unknown>>(
  obj: T,
  fields: (keyof T)[]
): { data: T; loading: boolean } {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const [data, setData] = useState(obj);
  const [loading, setLoading] = useState(false);

  const objKey = fields.map((f) => String(obj[f])).join("|||");

  useEffect(() => {
    if (lang === "en") {
      setData(obj);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const result = { ...obj };
      await Promise.all(
        fields.map(async (f) => {
          const val = obj[f];
          if (typeof val === "string" && val) {
            result[f] = (await translateText(val, lang)) as unknown as T[keyof T];
          }
        })
      );
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objKey, lang]);

  return { data, loading };
}

export default T;
