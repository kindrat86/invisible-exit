/**
 * Post-build internal-link guard.
 *
 * Why this exists: on 2026-07-25 an exhaustive crawl found 122 broken internal
 * links on invisibleexit.com. Every one was a hub page linking a slug its data
 * never produces — /reddit linked "for-accountants" while the data emits
 * "reddit-for-accountants", /pricing-models linked "freemium" while the data emits
 * "freemium-pricing", /non-compete linked a bare profession into a route keyed by
 * profession+state, and SalaryPage cross-linked all 25 professions into families
 * with 6-25 pages. The hub link lists were hardcoded arrays that had drifted from
 * the data the prerenderer iterates.
 *
 * Two capped crawls had previously reported this site as "0 broken" — the defect
 * was only visible to an uncapped crawl of production. This check makes it visible
 * at build time instead, from dist/, which is the same set of files that ships.
 *
 * Checks every internal href in every emitted page against:
 *   - a file in dist (dir/index.html, or path.html)
 *   - a redirect/rewrite source in vercel.json
 *
 * BASELINE BEHAVIOUR — deliberate. This repo is deployed continuously and by
 * automation; a guard that fails immediately on a large pre-existing backlog would
 * block every deploy and spawn CI-failure sessions. So it fails only on links that
 * are NOT in scripts/internal-links-baseline.json. Shrink that file as families are
 * fixed; regenerate with `node scripts/check-internal-links.mjs --update-baseline`.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const BASELINE = join(ROOT, "scripts", "internal-links-baseline.json");
const UPDATE = process.argv.includes("--update-baseline");

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (e.endsWith(".html")) out.push(p);
  }
  return out;
}

// ---- what routing accepts, independent of files on disk ---------------------
const vercel = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf-8"));
const routeSources = [
  ...(vercel.redirects ?? []),
  ...(vercel.rewrites ?? []),
].map((r) => r.source);

/**
 * vercel source -> RegExp.
 *
 * ORDER IS LOAD-BEARING. `:name(pattern)` must be handled BEFORE bare `:name`,
 * because the param name is consumed by its own group. Converting `:name` first
 * turns the locale rule `/:lang(zh|hi|…|te|…)/:path*` into `[^/]+(zh|hi|…)/.*`,
 * which matches `/non-compete/accountants` — `[^/]+` eats "non-compe" and "te"
 * satisfies the Telugu alternative. That false positive excused ~49 genuinely
 * broken links when this guard was first written.
 */
function sourceToRe(src) {
  let out = "";
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === ":") {
      const m = /^:([a-zA-Z]+)(\(([^)]*)\))?(\*)?/.exec(src.slice(i));
      if (m) {
        const [, , , group, star] = m;
        if (group) out += `(?:${group})`;      // :lang(zh|hi) -> (?:zh|hi)
        else if (star) out += ".*";            // :path*       -> .*
        else out += "[^/]+";                   // :slug        -> [^/]+
        if (group && star) out += ".*";
        i += m[0].length;
        continue;
      }
    }
    // Literal char — escape anything regex-significant.
    out += /[.+?^${}()|[\]\\*]/.test(ch) ? "\\" + ch : ch;
    i++;
  }
  return new RegExp("^" + out + "$");
}
const routeRes = routeSources.map(sourceToRe);

function servedByRouting(p) {
  return routeRes.some((re) => re.test(p));
}

function servedByFile(p) {
  const clean = p.replace(/\/+$/, "");
  if (clean === "") return existsSync(join(DIST, "index.html"));
  return (
    existsSync(join(DIST, clean, "index.html")) ||
    existsSync(join(DIST, clean + ".html")) ||
    existsSync(join(DIST, clean)) // real asset (png, pdf, xml…)
  );
}

// ---- scan -------------------------------------------------------------------
if (!existsSync(DIST)) {
  console.error("[check-internal-links] dist/ not found — run the build first.");
  process.exit(1);
}

const pages = walk(DIST);
const broken = new Map(); // href -> Set(source pages)

for (const file of pages) {
  const html = readFileSync(file, "utf-8");
  for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    let href = m[1].trim();
    if (/^(https?:|mailto:|tel:|javascript:|data:|#)/i.test(href)) continue;
    if (!href.startsWith("/")) continue;         // relative — skip, rare here
    href = href.split("#")[0].split("?")[0];
    if (href === "") continue;
    // Template literals that leaked into static HTML are their own bug class, but
    // they are not "missing pages" — surface them separately, never silently.
    // A BARE "$" is not a leak: cost-of-waiting slugs legitimately contain one
    // (`/cost-of-waiting/5-years-$100k-salary`). Only flag actual interpolation
    // syntax — ${…}, a backtick, {{…}}, or string concatenation.
    if (/\$\{|`|\{\{|\}\}|\+\s*['"]|['"]\s*\+/.test(href)) {
      const k = `TEMPLATE_LEAK ${href}`;
      if (!broken.has(k)) broken.set(k, new Set());
      broken.get(k).add(relative(DIST, file));
      continue;
    }
    if (servedByFile(href) || servedByRouting(href)) continue;
    if (!broken.has(href)) broken.set(href, new Set());
    broken.get(href).add(relative(DIST, file));
  }
}

const found = [...broken.keys()].sort();

if (UPDATE) {
  writeFileSync(BASELINE, JSON.stringify({ generated: "manual", allow: found }, null, 2) + "\n");
  console.log(`[check-internal-links] baseline written: ${found.length} allowed entries`);
  process.exit(0);
}

const baseline = existsSync(BASELINE)
  ? new Set(JSON.parse(readFileSync(BASELINE, "utf-8")).allow ?? [])
  : new Set();

const fresh = found.filter((h) => !baseline.has(h));
const fixed = [...baseline].filter((h) => !found.includes(h));

console.log(`[check-internal-links] scanned ${pages.length} page(s)`);
console.log(`  broken internal link targets: ${found.length} (baseline allows ${baseline.size})`);
if (fixed.length) {
  console.log(`  ✅ ${fixed.length} baseline entr${fixed.length === 1 ? "y" : "ies"} now resolve — ` +
              `re-run with --update-baseline to shrink the baseline`);
}

if (fresh.length) {
  console.error(`\n[check-internal-links] FAIL: ${fresh.length} NEW broken internal link target(s):`);
  for (const h of fresh) {
    const srcs = [...broken.get(h)];
    console.error(`  ${h}`);
    console.error(`      linked from ${srcs.length} page(s), e.g. ${srcs[0]}`);
  }
  console.error(
    "\nFix the link (usually a hub list that drifted from its data's slug scheme)," +
    "\nor if the target is genuinely meant to exist, generate the page." +
    "\nDo NOT add it to the baseline to get green."
  );
  process.exit(1);
}

console.log("[check-internal-links] OK — no new broken internal links");
