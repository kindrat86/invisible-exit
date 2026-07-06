/**
 * Post-build script: generates translated HTML variants for ALL languages.
 *
 * For ALL 100 languages × top 20 pages, creates /:lang/path/index.html
 * with translated <title>, <meta description>, and OG tags.
 *
 * Uses Google Translate's free endpoint (no API key).
 * Runs AFTER prerender-meta.mjs and prerender-blog.ts.
 *
 * Architecture:
 *   - Concurrency: 5 languages in parallel, each with sequential page translation
 *   - Caching: translated strings cached in-memory to avoid re-translation
 *   - Rate-limit friendly: 100ms delay between requests per worker
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "..", "dist");
const SITE = "https://invisibleexit.com";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── ALL 100 supported languages ──
const ALL_LANGS = [
  "es","zh","hi","fr","ar","bn","pt","ru","ur","id","de","ja","pcm","mr","te",
  "tr","ta","vi","yue","pa","ko","fa","it","th","gu","kn","ml","or","pl","uk",
  "nl","ro","el","cs","hu","sv","fi","no","da","he","sw","am","so","ha","yo",
  "ig","zu","xh","af","ms","my","km","lo","ne","si","ps","kk","uz","az","ka",
  "hy","mn","bo","ug","tl","ceb","ilo","jv","su","mad","nan","wuu","hak","hmn",
  "ku","bal","tg","tk","sq","sr","hr","bs","sk","sl","lt","lv","et","be","bg",
  "mk","ca","eu","gl","cy","ga","gd","br","is","lb","mt",
];

// ── Translation cache (in-memory, avoids re-translating same strings) ──
const translationCache = new Map(); // key: `${lang}|${text}` → translated

async function translate(text, targetLang) {
  if (targetLang === "en" || !text) return text;

  const cacheKey = `${targetLang}|${text}`;
  if (translationCache.has(cacheKey)) return translationCache.get(cacheKey);

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const segments = data[0];
    let result = text;
    if (Array.isArray(segments)) {
      result = segments.map((s) => s[0]).join("");
    }
    translationCache.set(cacheKey, result);
    return result;
  } catch {
    return text; // graceful fallback
  }
}

// ── Find prerendered English pages ──
async function findPrerenderedPages() {
  const pages = [];

  // Homepage
  const homeHtml = readFileSync(join(DIST, "index.html"), "utf-8");
  const homeTitle = homeHtml.match(/<title>(.*?)<\/title>/)?.[1];
  const homeDesc = homeHtml.match(/<meta name="description" content="(.*?)" \/>/)?.[1];
  if (homeTitle && homeDesc) {
    pages.push({ path: "/", title: homeTitle, description: homeDesc });
  }

  // Blog posts
  const blogDir = join(DIST, "blog");
  if (existsSync(blogDir)) {
    const { readdirSync } = await import("node:fs");
    for (const entry of readdirSync(blogDir)) {
      const htmlPath = join(blogDir, entry, "index.html");
      if (existsSync(htmlPath)) {
        const html = readFileSync(htmlPath, "utf-8");
        const title = html.match(/<title>(.*?)<\/title>/)?.[1];
        const desc = html.match(/<meta name="description" content="(.*?)" \/>/)?.[1];
        if (title && desc) {
          pages.push({ path: `/blog/${entry}`, title, description: desc });
        }
      }
    }
  }

  return pages;
}

// ── Process one language: translate all pages ──
async function processLanguage(langCode, pages) {
  let count = 0;
  for (const page of pages) {
    try {
      const englishHtmlPath =
        page.path === "/"
          ? join(DIST, "index.html")
          : join(DIST, page.path, "index.html");

      if (!existsSync(englishHtmlPath)) continue;

      let html = readFileSync(englishHtmlPath, "utf-8");

      // Translate title and description
      const [translatedTitle, translatedDesc] = await Promise.all([
        translate(page.title, langCode),
        translate(page.description, langCode),
      ]);

      // Replace in HTML
      html = html.replace(/<title>.*?<\/title>/, `<title>${translatedTitle}</title>`);
      html = html.replace(
        /<meta name="description" content=".*?" \/>/,
        `<meta name="description" content="${translatedDesc}" />`
      );
      html = html.replace(
        /<meta property="og:title" content=".*?" \/>/,
        `<meta property="og:title" content="${translatedTitle}" />`
      );
      html = html.replace(
        /<meta property="og:description" content=".*?" \/>/,
        `<meta property="og:description" content="${translatedDesc}" />`
      );
      html = html.replace(/<html lang="en">/, `<html lang="${langCode}">`);

      // Write to /:lang/path/index.html
      const langPath = page.path === "/" ? `/${langCode}` : `/${langCode}${page.path}`;
      const outPath = join(DIST, langPath, "index.html");
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, html, "utf-8");

      count++;
      await sleep(100); // rate-limit friendly
    } catch {
      // skip failures
    }
  }
  return count;
}

async function main() {
  console.log(`🌐 Generating translated HTML variants for ALL ${ALL_LANGS.length} languages...\n`);

  if (!existsSync(DIST)) {
    console.error("❌ dist/ directory not found. Run build first.");
    process.exit(1);
  }

  const pages = await findPrerenderedPages();
  const pagesToTranslate = pages.slice(0, 20); // top 20 pages per language
  console.log(`Found ${pages.length} pre-rendered pages, translating top ${pagesToTranslate.length} per language.\n`);

  let totalTranslated = 0;
  let totalFailed = 0;
  const concurrency = 5; // 5 languages in parallel
  let langIndex = 0;

  async function worker() {
    while (langIndex < ALL_LANGS.length) {
      const langCode = ALL_LANGS[langIndex++];
      const count = await processLanguage(langCode, pagesToTranslate);
      totalTranslated += count;
      console.log(`  ✓ ${langCode}: ${count} pages`);
    }
  }

  await Promise.all(
    Array.from({ length: concurrency }, () => worker())
  );

  console.log(`\n════════════════════════════════════════`);
  console.log(`✅ Total translated HTML variants: ${totalTranslated}`);
  console.log(`🌐 Languages: ${ALL_LANGS.length}`);
  console.log(`📄 Pages per language: ${pagesToTranslate.length}`);
  console.log(`════════════════════════════════════════\n`);
}

main().catch(console.error);
