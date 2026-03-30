# SEO/GEO Changelog

## 2026-03-29 — Initial SEO/GEO Automation Setup

### Added
- **GitHub Actions workflow** (`.github/workflows/seo-geo-audit.yml`) — Daily automated SEO audits at 12:00 UTC, weekly deep optimization on Mondays, manual trigger support
- **Automation agent instructions** (`.github/seo-geo-automation/claude.md`) — Master instructions for the SEO/GEO agent with Mode 1 (Daily) and Mode 2 (Weekly) definitions
- **Learnings tracker** (`.github/seo-geo-automation/memory.md`) — Initial findings documented
- **Gotchas tracker** (`.github/seo-geo-automation/gotchas.md`) — Known pitfalls documented
- **Quick-start guide** (`.github/seo-geo-automation/FastStart.txt`)
- **llms.txt** (`public/llms.txt`) — AI/LLM context page listing all public pages and blog posts
- **SEO_CHANGELOG.md** — This file

### Fixed
- **Blog listing page** (`src/pages/Blog.tsx`) — Replaced fragile DOM manipulation with `SEOHead` component + Blog JSON-LD schema
- **Blog post pages** (`src/pages/BlogPost.tsx`) — Replaced DOM manipulation with `SEOHead` component + Article JSON-LD schema (headline, datePublished, author, publisher)
- **Sitemap** (`public/sitemap.xml`) — Added 7 missing URLs: `/blog`, 6 individual blog posts. Total: 10 URLs (was 3)
- **Vercel config** (`vercel.json`) — Added caching headers for static assets and proper content-type for SEO files
- **robots.txt** (`public/robots.txt`) — Added llms.txt reference

### Audit Findings
| Check | Status | Notes |
|-------|--------|-------|
| Sitemap completeness | FIXED | Was missing /blog and all 6 blog posts |
| SEOHead usage | FIXED | Blog.tsx and BlogPost.tsx were using DOM manipulation |
| robots.txt | PASS | AI crawlers already allowed |
| llms.txt | ADDED | Did not exist before |
| JSON-LD (Index) | PASS | Has Organization, WebSite, FAQPage |
| JSON-LD (Blog) | ADDED | Article schema on each post |
| Meta tag lengths | PASS | All within recommended ranges |
| OG image | WARNING | og-image.png referenced but file does not exist |
| Canonical URLs | PASS | Set correctly on all pages |
| Heading hierarchy | PASS | Proper H1 > H2 > H3 on all pages |
| GEO readiness | PARTIAL | FAQ section has schema; blog content is citation-friendly |
