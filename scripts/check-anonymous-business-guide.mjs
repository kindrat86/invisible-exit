#!/usr/bin/env node
/**
 * Static content check for the canonical guide page
 * /how-to-build-a-business-while-employed-without-using-your-real-name
 *
 * Verifies the shipped HTML (public/, copied verbatim into dist/ by Vite and
 * served via the vercel.json rewrite) contains the required title, canonical
 * URL, and the not-legal-advice disclaimer, plus the vercel.json rewrite and
 * the sitemap generator entry. Pure static file checks, no build needed:
 *
 *   node scripts/check-anonymous-business-guide.mjs
 *
 * Exits non-zero on any failure so it can run in prebuild-style pipelines.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SLUG = "how-to-build-a-business-while-employed-without-using-your-real-name";
const CANONICAL = `https://invisibleexit.com/${SLUG}`;
const TITLE = "How to Build a Business While Employed Without Using Your Real Name | InvisibleExit";

let failures = 0;
function check(label, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) failures++;
}

// Prefer the built artifact when it exists; fall back to the tracked source in public/.
let html;
try {
  html = readFileSync(join(ROOT, "dist", `${SLUG}.html`), "utf8");
  console.log("checking dist/ artifact");
} catch {
  html = readFileSync(join(ROOT, "public", `${SLUG}.html`), "utf8");
  console.log("dist/ artifact absent, checking public/ source");
}

check("title tag present", html.includes(`<title>${TITLE}</title>`));
check("canonical link present", html.includes(`href="${CANONICAL}"`));
check("og:url present", html.includes(`content="${CANONICAL}"`));
check("robots index,follow", html.includes('name="robots" content="index,follow"'));
check("not-legal-advice disclaimer present", html.includes("not legal, tax, or financial advice"));
check("educational-purpose disclaimer present", html.includes("general information for educational purposes only"));
check("no anonymity promises", !/guarantee[sd]?\s+anonymity|fully anonymous ownership|100% anonymous/i.test(html));
check("KYC/beneficial ownership honesty covered", html.includes("beneficial owner"));
check("gov sources linked (irs.gov, sba.gov, ftc.gov)",
  html.includes("irs.gov") && html.includes("sba.gov") && html.includes("ftc.gov"));
check("no em dash characters", !html.includes("—"));

const vercel = readFileSync(join(ROOT, "vercel.json"), "utf8");
const vercelConfig = JSON.parse(vercel);
check("vercel.json rewrite serves the clean URL",
  (vercelConfig.rewrites ?? []).some(
    (r) => r.source === `/${SLUG}` && r.destination === `/${SLUG}.html`,
  ));

const sitemapScript = readFileSync(join(ROOT, "scripts", "generate-sitemap.ts"), "utf8");
check("sitemap generator lists the canonical URL", sitemapScript.includes(CANONICAL));

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nall checks passed");
