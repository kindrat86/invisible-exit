# SEO/GEO Automation — Learnings

## 2026-03-29 — Initial Setup

### Site Architecture
- SPA with react-helmet-async for per-page SEO; `SEOHead` component handles title, meta, OG, Twitter, canonical, JSON-LD
- Blog posts are static data in `src/data/blog-posts.ts` (not CMS) — sitemap must be manually updated when posts are added
- Vercel serves files from `public/` directly before applying SPA rewrite, so `robots.txt`, `sitemap.xml`, `llms.txt` are served correctly without special config

### Current State
- 6 blog posts as of initial setup
- Index page has Organization + WebSite + FAQPage JSON-LD
- Blog listing and individual posts now use SEOHead with proper Article JSON-LD
- AI crawlers explicitly allowed in robots.txt (GPTBot, ChatGPT-User, Google-Extended, PerplexityBot, ClaudeBot, Applebot-Extended)
- llms.txt created with all public pages listed
- OG image `/og-image.png` EXISTS and ships (1200x630 PNG, tracked in git,
  serves HTTP 200 live; `/og-image.webp` too) — verified 2026-07-25. Earlier
  entries claiming it was missing were wrong; do not re-report it.

### Keyword Targets
- "build side income while employed"
- "anonymous side business"
- "micro-SaaS for corporate managers"
- "financial independence recurring revenue"
- "invisible business model"
- "freedom number calculator"

### What Works
- SEOHead component is flexible and well-built — supports all needed props
- JSON-LD structured data on homepage covers Organization, WebSite (with SearchAction), and FAQPage
- robots.txt is comprehensive with AI crawler rules
