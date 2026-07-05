/**
 * Translation generation script — uses Google Translate's free endpoint.
 * Translates each string individually for reliability across all scripts.
 *
 * Usage:
 *   npx tsx scripts/generate-translations.ts
 *   npx tsx scripts/generate-translations.ts --only es,fr,de
 *   npx tsx scripts/generate-translations.ts --force
 */

import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { LANGUAGES } from "../src/i18n/languages.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, "..", "src", "i18n", "locales");

const args = process.argv.slice(2);
const force = args.includes("--force");
const onlyArg = args.find((a) => a.startsWith("--only"));
const onlyLangs = onlyArg ? onlyArg.split("=")[1]?.split(",") || [] : [];

const enModule = await import("../src/i18n/locales/en.ts");
const enStrings: Record<string, string> = enModule.en;
const enKeys = Object.keys(enStrings);
console.log(`Loaded ${enKeys.length} English source strings.`);

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Translate a single string via Google Translate ──
async function translateOne(text: string, targetLang: string): Promise<string> {
  // Skip short strings that are likely brand names / placeholders
  if (!text || text.length < 2) return text;

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) return text;

    const data = await response.json();
    const segments = data[0] as Array<[string, string]> | undefined;
    if (!segments || segments.length === 0) return text;

    // Join all segments (Google splits on sentences)
    return segments.map((s) => s[0]).join("");
  } catch {
    return text; // fallback to English
  }
}

// ── Translate all strings for one language ──
async function translateLanguage(lang: (typeof LANGUAGES)[number]): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  let done = 0;

  // Process strings in concurrent batches of 10
  const batchSize = 10;
  for (let i = 0; i < enKeys.length; i += batchSize) {
    const batch = enKeys.slice(i, i + batchSize);
    const translations = await Promise.all(
      batch.map((key) => translateOne(enStrings[key], lang.iso)),
    );
    batch.forEach((key, j) => {
      result[key] = translations[j];
    });
    done += batch.length;
    // Small delay between batches
    if (i + batchSize < enKeys.length) await sleep(100);
  }

  return result;
}

// ── Write locale file ──
function writeLocale(code: string, nativeName: string, strings: Record<string, string>) {
  const entries = Object.entries(strings)
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join("\n");
  const safeName = code.replace(/[-]/g, "_");
  const content = `/** Auto-generated translations for ${nativeName} (${code}). Do not edit manually. */\n\nexport const ${safeName} = {\n${entries}\n} as const;\n`;
  writeFileSync(join(LOCALES_DIR, `${code}.ts`), content, "utf-8");
}

// ── Batch concurrency for languages ──
async function runLangBatch<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index++;
      results[currentIndex] = await fn(items[currentIndex]);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// ── Main ──

let languagesToProcess = LANGUAGES.filter((l) => l.code !== "en");

if (onlyLangs.length > 0) {
  languagesToProcess = languagesToProcess.filter((l) => onlyLangs.includes(l.code));
}

if (!force) {
  const before = languagesToProcess.length;
  languagesToProcess = languagesToProcess.filter((l) => !existsSync(join(LOCALES_DIR, `${l.code}.ts`)));
  const skipped = before - languagesToProcess.length;
  if (skipped > 0) console.log(`Skipping ${skipped} existing locales.`);
}

console.log(`\nTranslating ${languagesToProcess.length} languages (individual string mode)…\n`);

let success = 0;
let failed = 0;
const failedLangs: string[] = [];

// Process 3 languages concurrently
await runLangBatch(languagesToProcess, 3, async (lang) => {
  try {
    const result = await translateLanguage(lang);

    // Check how many strings were actually translated (not just English fallbacks)
    const translatedCount = enKeys.filter((k) => result[k] !== enStrings[k]).length;

    if (translatedCount < enKeys.length * 0.3) {
      console.error(`  ⚠ ${lang.code} (${lang.nativeName}) — only ${translatedCount}/${enKeys.length} translated`);
      // Still write what we have
    }

    writeLocale(lang.code, lang.nativeName, result);
    console.log(`  ✓ ${lang.code} (${lang.nativeName}) — ${translatedCount}/${enKeys.length} translated`);
    success++;
  } catch (err: any) {
    console.error(`  ✗ ${lang.code} (${lang.nativeName}) — ${err.message}`);
    failed++;
    failedLangs.push(lang.code);
  }
  await sleep(300);
});

console.log(`\n════════════════════════════════════════`);
console.log(`Translation complete: ${success} succeeded, ${failed} failed.`);
if (failedLangs.length > 0) {
  console.log(`Failed: ${failedLangs.join(", ")}`);
}
console.log(`════════════════════════════════════════`);
