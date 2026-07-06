/**
 * AutoTranslate — automatically translates ALL visible text on a page.
 *
 * This component wraps page content and, when the language is non-English,
 * walks the DOM tree, collects all text nodes, translates them via /api/translate,
 * and replaces them in-place. It preserves all HTML structure, links, formatting.
 *
 * Usage:
 *   <AutoTranslate>
 *     <YourPageContent />
 *   </AutoTranslate>
 *
 * Features:
 *   - Preserves HTML structure (links, bold, headings, lists)
 *   - Excludes <code>, <pre>, <input>, <script>, <style> tags
 *   - Excludes elements with data-no-translate attribute
 *   - Batches translations for efficiency
 *   - Caches results in localStorage (24h)
 *   - Skips numbers, single words, and brand names
 *   - Instant for English (zero overhead)
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

// ── Shared cache (import from T.tsx logic) ──
interface CacheEntry {
  text: string;
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000;
const PREFIX = "ie_tr_";

function h(s: string): string {
  let x = 0;
  for (let i = 0; i < s.length; i++) x = ((x << 5) - x + s.charCodeAt(i)) | 0;
  return String(Math.abs(x));
}

function getCached(text: string, lang: string): string | null {
  const key = `${PREFIX}${lang}_${h(text)}`;
  const mem = cache.get(key);
  if (mem && Date.now() - mem.timestamp < CACHE_TTL) return mem.text;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const e: CacheEntry = JSON.parse(stored);
      if (Date.now() - e.timestamp < CACHE_TTL) {
        cache.set(key, e);
        return e.text;
      }
    }
  } catch {}
  return null;
}

function setCached(text: string, lang: string, translated: string) {
  const key = `${PREFIX}${lang}_${h(text)}`;
  cache.set(key, { text: translated, timestamp: Date.now() });
  try {
    localStorage.setItem(key, JSON.stringify({ text: translated, timestamp: Date.now() }));
  } catch {}
}

// ── Batch translation queue ──
const pending = new Map<string, Promise<string>>();

async function translateOne(text: string, lang: string): Promise<string> {
  if (lang === "en" || !text || text.trim().length < 2) return text;

  // Check cache
  const cached = getCached(text, lang);
  if (cached !== null) return cached;

  // Dedupe in-flight requests
  const reqKey = `${lang}_${h(text)}`;
  if (pending.has(reqKey)) return pending.get(reqKey)!;

  const promise = (async () => {
    try {
      const resp = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang: lang, sourceLang: "en" }),
      });
      if (!resp.ok) return text;
      const data = await resp.json();
      const result: string = data.translatedText || text;
      setCached(text, lang, result);
      return result;
    } catch {
      return text;
    } finally {
      pending.delete(reqKey);
    }
  })();

  pending.set(reqKey, promise);
  return promise;
}

// ── Batch translate with concurrency limit ──
async function translateBatch(
  items: { node: Text; text: string }[],
  lang: string,
  onProgress: () => void
) {
  const concurrency = 8;
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const item = items[idx++];
      if (!item) break;
      const translated = await translateOne(item.text, lang);
      if (translated !== item.text && item.node.parentElement) {
        item.node.textContent = translated;
        onProgress();
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  );
}

// ── Skip these tags entirely ──
const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "CODE",
  "PRE",
  "INPUT",
  "TEXTAREA",
  "BUTTON",
  "SELECT",
  "NOSCRIPT",
  "KBD",
  "SAMP",
  "VAR",
]);

// Brand names / proper nouns to never translate
const SKIP_PATTERNS = [
  /^[\d\s$,.%+-]+$/, // pure numbers/symbols
  /^[A-Z][A-Z0-9\s]+$/, // ALL CAPS acronyms
  /^(Invisible Exit|FYM|SaaS|MRR|LLC|Stripe|Wyoming|IPO|SEO|AI|API|P&L|MBA|PDF)$/i,
];

function shouldSkip(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 3) return true;
  if (trimmed.length > 5000) return true; // too long for single request
  for (const pattern of SKIP_PATTERNS) {
    if (pattern.test(trimmed)) return true;
  }
  return false;
}

// ── Collect translatable text nodes ──
function collectTextNodes(root: HTMLElement): { node: Text; text: string }[] {
  const result: { node: Text; text: string }[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node: Text) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
      if (parent.closest("[contenteditable]")) return NodeFilter.FILTER_REJECT;
      const text = node.textContent || "";
      if (shouldSkip(text)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let current: Node | null;
  while ((current = walker.nextNode())) {
    const text = (current as Text).textContent || "";
    result.push({ node: current as Text, text: text.trim() });
  }
  return result;
}

// ── Main component ──
export function AutoTranslate({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const containerRef = useRef<HTMLDivElement>(null);
  const [translating, setTranslating] = useState(false);
  const location = useLocation();
  const pathKey = location.pathname + location.search;

  useEffect(() => {
    if (lang === "en") return;
    if (!containerRef.current) return;

    // Wait for children to render (lazy-loaded pages need a tick)
    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled || !containerRef.current) return;

      const nodes = collectTextNodes(containerRef.current);
      if (nodes.length === 0) return;

      setTranslating(true);
      translateBatch(nodes, lang, () => {}).then(() => {
        if (!cancelled) setTranslating(false);
      });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [lang, pathKey]); // re-run on language change OR route change

  return (
    <>
      {translating && lang !== "en" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "linear-gradient(90deg, var(--color-primary, #6366f1), var(--color-primary-dark, #4f46e5))",
            color: "white",
            fontSize: "12px",
            padding: "4px 0",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
            pointerEvents: "none",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "white",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            Translating…
          </span>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}
      <div ref={containerRef} data-translating={translating}>
        {children}
      </div>
    </>
  );
}

export default AutoTranslate;
