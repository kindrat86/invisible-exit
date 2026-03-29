# SEO/GEO Automation — Gotchas & Mistakes to Avoid

## 2026-03-29 — Initial Setup

### Blog posts are static, not CMS
Blog posts live in `src/data/blog-posts.ts`. When new posts are added, the sitemap (`public/sitemap.xml`) and llms.txt (`public/llms.txt`) must be updated manually. There is no auto-generation.

### SPA rewrite catches everything
`vercel.json` rewrites all routes to `index.html`. Static files in `public/` are served first by Vercel, so `robots.txt`, `sitemap.xml`, and `llms.txt` work fine. But if you add a new static file, it must go in `public/`.

### Never mention target audience by name
Do not use phrases like "corporate managers aged 35-45" or similar demographic descriptions in any SEO output, meta tags, or structured data.

### Blog pages were using DOM manipulation
Before this fix, `Blog.tsx` and `BlogPost.tsx` used `document.title` and `document.querySelector` to set meta tags. This is fragile in SPAs. Always use the `SEOHead` component.

### OG image does not exist
`og-image.png` is referenced in meta tags but the file hasn't been created. This means social media previews will show a broken image. Needs to be created (1200x630px).

### Brand colors are blue-based only
Never use gold/amber accents. Stick to the homepage's blue palette (#1B2A4A, #3B82F6, #60A5FA).
