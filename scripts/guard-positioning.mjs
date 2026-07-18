#!/usr/bin/env node
/**
 * POSITIONING GUARDRAIL — Invisible Exit is a faceless side-business system for
 * employed professionals, NOT a privacy / anonymous-browsing / incognito tool.
 * (See GUARDRAILS.md and canonical-descriptors.json → invisibleexit.never_call_it.)
 *
 * This runs as the FIRST step of `npm run build`, so a tree contaminated with
 * privacy-browser pSEO can never be built or deployed. Exit 1 = block the build.
 *
 * It is intentionally self-contained (no import from ~/.growth-engine): Vercel
 * only clones this repo at build time.
 *
 * Scope note: it scans the static pages + generators — NOT src/ (which may
 * legitimately recommend a VPN etc. for *founder* anonymity) and NOT the huge
 * built dist/. The signal it keys on is Invisible Exit describing ITSELF as a
 * privacy browser, or linking to the deleted privacy-browser pages.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();

// Deleted privacy-browser page slugs. A clean site never links to these and no
// such file should exist. (vercel.json redirect SOURCES name them on purpose, so
// vercel.json is excluded below.) /for/founders and /glossary/what-is-* are legit
// and deliberately absent from these alternations.
const FORBIDDEN_PATHS =
  /\/(?:vs|alternatives-to)\/(?:tor-browser|mullvad(?:-browser)?|brave|duckduckgo|incognito-mode|epic-browser|incogni|delete-me)\b|\/for\/(?:privacy|journalism|journalists|research|researchers|security|whistleblowing|legal)\b|\/glossary\/(?:private-browsing|fingerprinting|dns-leak|webrtc-leak|session-isolation|tracking-protection|cookie-destruction|data-broker|digital-footprint|right-to-be-forgotten)\b|\/best\/(?:private-browsing-tools|anti-tracking-tools)\b/;

// Privacy-BROWSER product-positioning phrases. Deliberately specific: these
// describe Invisible Exit AS a private-browsing product. Bare tool names
// (tor/mullvad/vpn) are NOT here — the site may legitimately recommend them for
// founder anonymity; resurrected comparison pages are caught by path/filename.
const FORBIDDEN_PHRASES =
  /anonymous session\s*&\s*private browsing|private[- ]browsing sessions?|isolated browsing sessions?|private sessions that auto-destroy|auto-destroy(?:s|ing)?\s+(?:history|cookies|all|session)|destroys?[^.<]{0,40}tracking data on exit|browser fingerprint|anti-tracking tool|private[- ]browsing tool|private-session tool|zero-trace|session-level privacy/i;

// A line is exempt if it is explicitly DISAMBIGUATING ("... is NOT a privacy tool").
const NEGATION = /\bnot\b|isn'?t\b|unrelated|never\b|rather than|instead of|does not/i;

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.vercel', 'og', 'assets', 'i18n', 'i18n_out']);
const SCAN_EXT = new Set(['.html', '.xml', '.md', '.txt']);
const SKIP_FILES = new Set(['vercel.json']);
const GEN_FILES = ['scripts/skyrocket-seo.py', 'scripts/prerender-blog.ts', 'scripts/prerender-meta.mjs'];

const violations = [];

function scanFile(path) {
  const rel = path.replace(ROOT + '/', '');
  // (a) a file whose PATH is a deleted privacy page = resurrected contamination
  if (FORBIDDEN_PATHS.test('/' + rel.replace(/^public\//, ''))) {
    violations.push(`${rel}  resurrected privacy-browser page (should not exist)`);
  }
  let text;
  try { text = readFileSync(path, 'utf8'); } catch { return; }
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (FORBIDDEN_PATHS.test(line)) {
      violations.push(`${rel}:${i + 1}  links to a privacy-browser page → ${line.trim().slice(0, 110)}`);
    }
    if (FORBIDDEN_PHRASES.test(line) && !NEGATION.test(line)) {
      violations.push(`${rel}:${i + 1}  privacy-browser positioning → ${line.trim().slice(0, 110)}`);
    }
  }
}

function walk(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(join(dir, e.name));
    } else if (e.isFile() && !SKIP_FILES.has(e.name) && SCAN_EXT.has(extname(e.name))) {
      scanFile(join(dir, e.name));
    }
  }
}

// static pages + sitemaps
for (const p of ['index.html', 'public']) {
  const full = join(ROOT, p);
  if (existsSync(full)) (statSync(full).isDirectory() ? walk(full) : scanFile(full));
}
// stray root-level pSEO dirs must not come back
for (const d of ['vs', 'alternatives-to', 'for', 'glossary', 'best']) {
  const full = join(ROOT, d);
  if (existsSync(full)) walk(full);
}
// generators (hardcoded hubs / footer nav)
for (const g of GEN_FILES) {
  const full = join(ROOT, g);
  if (existsSync(full)) scanFile(full);
}

if (violations.length) {
  console.error('\n🚨 POSITIONING GUARDRAIL FAILED');
  console.error('   Invisible Exit is a faceless side-business system — NOT a privacy /');
  console.error('   anonymous-browsing tool. Remove the following before building (see GUARDRAILS.md):\n');
  for (const v of violations) console.error('   ✗ ' + v);
  console.error(`\n   ${violations.length} violation(s). Build blocked.\n`);
  process.exit(1);
}
console.log('✅ positioning guard: no privacy/anonymous-browsing contamination');
