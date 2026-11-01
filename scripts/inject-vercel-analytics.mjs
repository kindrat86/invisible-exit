// Adds the Vercel Web Analytics tracker to every built HTML page that lacks it.
// Usage: node scripts/inject-vercel-analytics.mjs [dir]   (default: dist)
import fs from 'fs';
import path from 'path';

const SNIPPET =
  '<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)}</script>' +
  '<script defer src="/_vercel/insights/script.js"></script>';
const root = path.resolve(process.argv[2] || 'dist');
let count = 0;

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) {
      const html = fs.readFileSync(p, 'utf8');
      if (html.includes('/_vercel/insights/script.js') || !/<\/head>/i.test(html)) continue;
      fs.writeFileSync(p, html.replace(/<\/head>/i, () => SNIPPET + '</head>'));
      count++;
    }
  }
}

walk(root);
console.log(`inject-vercel-analytics: tracker added to ${count} pages in ${root}`);
