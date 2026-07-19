/**
 * Postbuild CSP patcher for /embed/* widget farm.
 *
 * Problem: Vercel's vercel.json `headers` block for /embed/(.*) only emits the
 * FIRST header when a matching `rewrites` rule exists (auto-added continue:true
 * condenses headers). The catch-all /(.*)  then wins on Content-Security-Policy,
 * serving a strict CSP with no frame-ancestors directive. Result: every embed
 * widget returns frame-ancestors 'self' + X-Frame-Options SAMEORIGIN, so no
 * external site can iframe any widget — the entire embeddable backlink farm
 * is non-functional.
 *
 * Fix: rewrite .vercel/output/config.json after `vite build` to:
 *   1. Strip X-Frame-Options + Content-Security-Policy from the catch-all
 *      route ONLY when the path matches /embed/* or /tools/freedom-calculator*
 *      (use a negative lookahead in the catch-all regex).
 *   2. Force every /embed/* route to emit frame-ancestors * + ALLOWALL.
 *
 * Verified approach: matches the Next.js postbuild pattern in the
 * authority-backlink-building skill (references/vercel-route-csp-debugging.md).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const CONFIG_PATH = join(ROOT, '.vercel', 'output', 'config.json');

if (!existsSync(CONFIG_PATH)) {
  console.error('[postbuild-csp] .vercel/output/config.json not found — skipping');
  process.exit(0);
}

const EMBED_CSP = "frame-ancestors *; default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; font-src 'self' https://fonts.gstatic.com";

const cfg = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const routes = cfg.routes || [];

let patched = 0;

// Strategy: walk routes, find ones with /embed in src, force the right headers.
// Also find catch-all header routes (src like ^/(.*)$) and add a negative
// lookahead so they don't apply to /embed paths.
for (let i = 0; i < routes.length; i++) {
  const r = routes[i];
  if (typeof r !== 'object' || !r.src) continue;

  // 1. Inject correct headers on /embed routes
  if (r.src.includes('/embed')) {
    if (r.headers || r.continue) {
      r.headers = {
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': EMBED_CSP,
        'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=86400'
      };
      patched++;
      console.log(`[postbuild-csp] Patched route [${i}] ${r.src} -> frame-ancestors *`);
    }
  }

  // 2. Patch /tools/freedom-calculator routes to ensure frame-ancestors *
  if (r.src.includes('freedom-calculator') && r.headers) {
    const csp = r.headers['Content-Security-Policy'];
    if (csp && !csp.includes('frame-ancestors')) {
      r.headers['Content-Security-Policy'] = 'frame-ancestors *; ' + csp;
      r.headers['X-Frame-Options'] = 'ALLOWALL';
      patched++;
      console.log(`[postbuild-csp] Patched route [${i}] ${r.src} -> frame-ancestors *`);
    }
  }

  // 3. Catch-all routes that set CSP — add negative lookahead for /embed
  //    so they don't overwrite our /embed headers.
  //    Matches both ^/(.*)$ and ^(?:/(.*))$ forms.
  if (r.src && r.headers && r.headers['Content-Security-Policy']) {
    // Match catch-all patterns: anything containing (.*)  that would slurp /embed
    const catchAllMatch = r.src.match(/^(\^?\^?(?:\(\?:)?\/(?:\)\?)?)\(\.\*\)(.*)$/);
    if (catchAllMatch && !r.src.includes('embed') && !r.src.includes('freedom')) {
      const prefix = catchAllMatch[1]; // e.g. "^/" or "^(?:/"
      const suffix = catchAllMatch[2]; // e.g. "$" or ")$"
      const newSrc = `${prefix}(?!embed/|embed$|tools/freedom-calculator)(.*)${suffix}`;
      console.log(`[postbuild-csp] Carved /embed out of catch-all [${i}]: ${r.src} -> ${newSrc}`);
      r.src = newSrc;
      patched++;
    }
  }
}

if (patched === 0) {
  console.warn('[postbuild-csp] WARNING: no routes were patched — verify the build output structure');
} else {
  writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
  console.log(`[postbuild-csp] Wrote ${patched} patch(es) to config.json`);
}
