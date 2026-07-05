import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

interface CacheEntry {
  text: string;
  timestamp: number;
}

// In-memory + localStorage cache for translated text
const memoryCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_PREFIX = "ie_tr_";

function getCacheKey(text: string, lang: string): string {
  // Simple hash for cache key
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return `${CACHE_PREFIX}${lang}_${Math.abs(hash)}`;
}

function getCached(key: string): string | null {
  // Check memory cache
  const memEntry = memoryCache.get(key);
  if (memEntry && Date.now() - memEntry.timestamp < CACHE_TTL) {
    return memEntry.text;
  }

  // Check localStorage
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
  } catch {
    // localStorage might be full or disabled
  }
  return null;
}

function setCached(key: string, text: string) {
  const entry: CacheEntry = { text, timestamp: Date.now() };
  memoryCache.set(key, entry);
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // ignore
  }
}

/**
 * Hook for translating text content at runtime.
 * Returns translated text if current language is not English, otherwise original.
 *
 * Usage:
 *   const { text } = useTranslatedContent(originalText);
 *   <p>{text}</p>
 *
 * Features:
 *   - Caches translations in localStorage for 24h
 *   - Batch debouncing for multiple calls
 *   - Graceful fallback to English on error
 */
export function useTranslatedContent(text: string): { text: string; loading: boolean; error: boolean } {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const [translated, setTranslated] = useState(text);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // If English, no translation needed
    if (lang === "en" || !text) {
      setTranslated(text);
      setLoading(false);
      setError(false);
      return;
    }

    // Check cache first
    const cacheKey = getCacheKey(text, lang);
    const cached = getCached(cacheKey);
    if (cached) {
      setTranslated(cached);
      setLoading(false);
      setError(false);
      return;
    }

    // Abort any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    const debounce = setTimeout(async () => {
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLang: lang, sourceLang: "en" }),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Translation failed");

        const data = await response.json();
        if (data.translatedText) {
          setTranslated(data.translatedText);
          setCached(cacheKey, data.translatedText);
          setError(false);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          // Fallback to original text
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [text, lang]);

  return { text: translated, loading, error };
}

/**
 * Hook for batch translating multiple texts at once.
 * More efficient than multiple useTranslatedContent calls.
 *
 * Usage:
 *   const { texts } = useTranslatedBatch(["Hello", "World"]);
 *   <p>{texts[0]}</p>
 */
export function useTranslatedBatch(texts: string[]): { texts: string[]; loading: boolean } {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const [translated, setTranslated] = useState(texts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lang === "en") {
      setTranslated(texts);
      return;
    }

    // Check which texts need translation (not cached)
    const needTranslation: { index: number; text: string }[] = [];
    const result = [...texts];

    texts.forEach((text, i) => {
      const cacheKey = getCacheKey(text, lang);
      const cached = getCached(cacheKey);
      if (cached) {
        result[i] = cached;
      } else if (text) {
        needTranslation.push({ index: i, text });
      }
    });

    setTranslated(result);
    if (needTranslation.length === 0) return;

    setLoading(true);

    // Translate in parallel batches
    const batchSize = 5;
    let cancelled = false;

    (async () => {
      for (let i = 0; i < needTranslation.length; i += batchSize) {
        if (cancelled) return;
        const batch = needTranslation.slice(i, i + batchSize);
        const results = await Promise.allSettled(
          batch.map(async ({ text }) => {
            const cacheKey = getCacheKey(text, lang);
            const resp = await fetch("/api/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text, targetLang: lang, sourceLang: "en" }),
            });
            if (!resp.ok) throw new Error("Failed");
            const data = await resp.json();
            setCached(cacheKey, data.translatedText);
            return data.translatedText;
          }),
        );
        results.forEach((r, j) => {
          if (r.status === "fulfilled") {
            result[batch[j].index] = r.value;
          }
        });
        if (!cancelled) setTranslated([...result]);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [texts.join("|||"), lang]);

  return { texts: translated, loading };
}
