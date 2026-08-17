/**
 * Build-time drift guard for llms.txt / llms-full.txt.
 *
 * The generator (scripts/generate-llms-txt.ts) emits these files from the
 * data arrays. It runs BEFORE the prerenderers historically, so it has no
 * knowledge of what actually gets built: when a prerenderer route changes (a
 * family is retired, or a slug scheme moves), the generator silently
 * re-advertises dead URLs to AI crawlers. check-internal-links.mjs prunes
 * those dead links from dist/ (the shipped artifact), but public/llms.txt —
 * the file the generator writes and git tracks — stays dirty until the next
 * build, and the drift stays silent.
 *
 * This assertion makes drift LOUD instead of silent. It runs AFTER
 * check-internal-links.mjs has pruned dist/, and asserts that the set of
 * invisibleexit.com URLs in the raw generator output (public/) is identical to
 * the set in the post-prune artifact (dist/). Any URL the generator advertised
 * that does not resolve to a built file shows up here as a diff and fails the
 * build.
 *
 * The fix for a failure is in scripts/generate-llms-txt.ts — correct the URL
 * template that drifted from the prerenderer's route. Do NOT weaken this guard.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://invisibleexit.com";
const SURFACES = ["llms.txt", "llms-full.txt"];

function extractPaths(text) {
  const paths = new Set();
  const patterns = [
    // markdown link target
    /\]\(([^)]+)\)/g,
    // bare URL (covers llms-full.txt's `**URL:** https://…` fields)
    /https:\/\/invisibleexit\.com[^\s)\]"',]*/g,
  ];
  const raws = [];
  for (const re of patterns) {
    for (const m of text.matchAll(re)) raws.push(m[1] ?? m[0]);
  }
  for (let raw of raws) {
    raw = String(raw).trim().replace(/[.,;:]+$/, "");
    if (raw.startsWith(SITE)) {
      raw = raw.slice(SITE.length) || "/";
    } else if (!raw.startsWith("/")) {
      continue; // external or relative, not ours to validate
    }
    raw = raw.split("#")[0].split("?")[0];
    if (!raw.startsWith("/")) continue;
    if (raw.startsWith("/api/")) continue; // dynamic, not a missing page
    paths.add(raw);
  }
  return paths;
}

let failed = false;

for (const name of SURFACES) {
  const pub = join(ROOT, "public", name);
  const dist = join(ROOT, "dist", name);

  if (!existsSync(pub)) {
    console.error(`[assert-llms-drift] ${name}: public file missing (generator did not run?)`);
    failed = true;
    continue;
  }
  if (!existsSync(dist)) {
    console.error(`[assert-llms-drift] ${name}: dist file missing (vite build did not run?)`);
    failed = true;
    continue;
  }

  const pubPaths = extractPaths(readFileSync(pub, "utf-8"));
  const distPaths = extractPaths(readFileSync(dist, "utf-8"));

  const onlyPublic = [...pubPaths].filter((p) => !distPaths.has(p)).sort();
  const onlyDist = [...distPaths].filter((p) => !pubPaths.has(p)).sort();

  if (onlyPublic.length === 0 && onlyDist.length === 0) {
    console.log(`[assert-llms-drift] ${name}: OK — ${pubPaths.size} URLs, public == dist, no drift`);
    continue;
  }

  failed = true;
  console.error(`\n[assert-llms-drift] FAIL: ${name} — URL sets differ between public/ and dist/`);
  if (onlyPublic.length) {
    const fam = {};
    for (const p of onlyPublic) { const f = p.split("/")[1] || "/"; fam[f] = (fam[f] ?? 0) + 1; }
    const top = Object.entries(fam).sort((a, b) => b[1] - a[1])
      .map(([f, n]) => `/${f}/ ×${n}`).join(", ");
    console.error(`  ${onlyPublic.length} URL(s) in public/ but NOT in dist/ (advertised-but-not-built): ${top}`);
    for (const p of onlyPublic.slice(0, 20)) console.error(`    ${SITE}${p}`);
    if (onlyPublic.length > 20) console.error(`    … and ${onlyPublic.length - 20} more`);
    console.error("  These are DATA DRIFT: generate-llms-txt.ts emits a family the");
    console.error("  prerenderer no longer builds. Fix the URL template in that script.");
  }
  if (onlyDist.length) {
    console.error(`  ${onlyDist.length} URL(s) in dist/ but NOT in public/ (unexpected, investigate)`);
    for (const p of onlyDist.slice(0, 20)) console.error(`    ${SITE}${p}`);
  }
}

if (failed) {
  console.error("\n[assert-llms-drift] drift detected. Do NOT deploy; the file we hand AI");
  console.error("crawlers still advertises dead URLs. Fix generate-llms-txt.ts and rebuild.");
  process.exit(1);
}

console.log("[assert-llms-drift] OK, no URL drift between public/ and dist/ machine-facing surfaces");
