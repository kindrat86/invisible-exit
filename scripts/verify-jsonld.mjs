#!/usr/bin/env node
/**
 * Blocking JSON-LD gate on the SHIPPED output.
 *
 * Why this exists alongside scripts/validate_jsonld.py: that one runs at
 * checkout on committed source and skips build directories by design. The
 * corruption that actually reached Google, Search Console "Unparsable
 * structured data / Parsing error: Missing ',' or '}'" on voicelogpro.com,
 * 2026-07-25, is introduced *between* the repo and the deployed page, by
 * the centrally generated pSEO pages and by build-time post-processors. A
 * source-only lint structurally cannot see that class of bug.
 *
 * Two distinct causes produced that one Search Console message:
 *
 *   "@context":"https://***@type":"WebPage"     <- `schema.org","` clobbered,
 *   "@context":"https://schema.org","@type":…      swallowing @type
 *
 *   "mainEntity":[…]`}                         <- leftover JS template-literal
 *   "mainEntity":[…]}                             backtick closing a FAQPage
 *
 * Both are checked by signature as well as by JSON.parse, because a repair
 * step with no verification after it is worse than no repair: it lets a new
 * variant of the corruption ship silently. Blocks that parse but whose
 * @context was corrupted are caught too, since JSON.parse waves those through.
 *
 * Node, not Python, on purpose: every deploy path runs the build (Vercel cloud
 * builds, and local `vercel build && vercel deploy --prebuilt` alike) and node
 * is guaranteed in all of them, while python3 is not.
 *
 * Self-contained by design, no cross-repo import, so it works in Vercel's
 * shallow clone. Keep the copies in the 10 site repos identical.
 *
 * Usage: node scripts/verify-jsonld.mjs [dir ...]      (default: dist)
 *   Exit 1 on any bad block, or if a named directory does not exist.
 *
 * See ~/.growth-engine/GUARDRAILS.md rule 3 for the portfolio-wide context and
 * ~/.growth-engine/validate-jsonld-live.py for the post-deploy live check.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, resolve, relative } from 'node:path';

const dirs = process.argv.slice(2);
if (dirs.length === 0) dirs.push('dist');

// Directories that never contain shippable HTML. `assets` holds hashed bundles
// and is the bulk of a vite dist, so skipping it keeps this fast on large sites.
const SKIP = new Set([
  'node_modules', '.git', '.next', '.vercel', 'assets',
  '__pycache__', '.venv', 'venv', 'coverage',
]);

const BLOCK_RE =
  /<script[^>]*\btype\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi;

const SIGNATURES = [
  {
    re: /https:\/\/\*{3}/,
    msg: 'clobbered @context (https://***, expected https://schema.org)',
  },
  {
    re: /"@context"\s*:\s*"[^"]*@type/,
    msg: '@type swallowed into the @context string',
  },
  {
    re: /\]\s*`\s*\}/,
    msg: 'stray template-literal backtick closing the schema (]`} instead of ]})',
  },
];

const errors = [];
let files = 0;
let blocks = 0;

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (!SKIP.has(e.name)) walk(join(dir, e.name));
      continue;
    }
    if (extname(e.name) !== '.html') continue;
    check(join(dir, e.name));
  }
}

function check(path) {
  const rel = relative(process.cwd(), path) || path;
  let html;
  try {
    html = readFileSync(path, 'utf8');
  } catch {
    return;
  }
  files++;

  BLOCK_RE.lastIndex = 0;
  let m;
  let i = -1;
  while ((m = BLOCK_RE.exec(html)) !== null) {
    i++;
    const raw = m[1].trim();
    if (!raw) continue;
    blocks++;

    for (const { re, msg } of SIGNATURES) {
      if (re.test(raw)) errors.push(`${rel} [block ${i}]: ${msg}`);
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      errors.push(`${rel} [block ${i}]: invalid JSON, ${err.message}`);
      continue;
    }

    for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
      if (!node || typeof node !== 'object') continue;
      const ctx = node['@context'];
      if (ctx === undefined) {
        errors.push(`${rel} [block ${i}]: missing @context`);
      } else if (typeof ctx === 'string' && !ctx.includes('schema.org')) {
        errors.push(`${rel} [block ${i}]: suspect @context ${JSON.stringify(ctx.slice(0, 80))}`);
      }
      if (!('@type' in node) && !('@graph' in node)) {
        errors.push(`${rel} [block ${i}]: missing @type (and no @graph)`);
      }
    }
  }
}

const scanned = [];
for (const d of dirs) {
  const root = resolve(process.cwd(), d);
  if (!existsSync(root)) {
    console.error(`❌ verify-jsonld: ${d} not found, run the build first.`);
    process.exit(1);
  }
  if (!statSync(root).isDirectory()) {
    console.error(`❌ verify-jsonld: ${d} is not a directory.`);
    process.exit(1);
  }
  walk(root);
  scanned.push(d);
}

console.log(
  `[verify-jsonld] scanned ${files} HTML file(s), ${blocks} JSON-LD block(s) in ${scanned.join(', ')}`
);

if (errors.length) {
  console.error(
    `\n❌ verify-jsonld: ${errors.length} error(s), refusing to ship broken structured data:`
  );
  for (const e of errors) console.error(`  - ${e}`);
  console.error(
    '\nFix the generator or post-processor that emitted this, not the page, ' +
      'regeneration will re-introduce a hand-patched file.'
  );
  process.exit(1);
}

console.log('[verify-jsonld] OK, all shipped JSON-LD parses');
