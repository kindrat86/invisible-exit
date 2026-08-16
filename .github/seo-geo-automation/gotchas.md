# SEO/GEO Automation, Gotchas & Mistakes to Avoid

## 2026-03-29, Initial Setup

### Blog posts are static, not CMS
Blog posts live in `src/data/blog-posts.ts`. When new posts are added, the sitemap (`public/sitemap.xml`) and llms.txt (`public/llms.txt`) must be updated manually. There is no auto-generation.

### SPA rewrite catches everything
`vercel.json` rewrites all routes to `index.html`. Static files in `public/` are served first by Vercel, so `robots.txt`, `sitemap.xml`, and `llms.txt` work fine. But if you add a new static file, it must go in `public/`.

### Never mention target audience by name
Do not use phrases like "corporate managers aged 35-45" or similar demographic descriptions in any SEO output, meta tags, or structured data.

### Blog pages were using DOM manipulation
Before this fix, `Blog.tsx` and `BlogPost.tsx` used `document.title` and `document.querySelector` to set meta tags. This is fragile in SPAs. Always use the `SEOHead` component.

### Do not claim a file is missing unless the ASSET INVENTORY says so
For ~5 audit runs this file asserted "og-image.png is referenced but hasn't
been created". That was false the whole time: `public/og-image.png` is a
1200x630 PNG, tracked in git, and `https://invisibleexit.com/og-image.png`
returns HTTP 200 (verified 2026-07-25). The audit prompt never included a
listing of `public/`, so the model inferred absence from silence, and this
file then fed the false claim back into every later run.

The repo context now carries an `ASSET INVENTORY (public/)` section. Treat it
as the only evidence about which non-page files exist. If a path is in that
list, it exists, do not report it missing.

### Brand colors are blue-based only, but amber IS the warning color
BRAND accents (headings, CTAs, links, decorative flourishes) stay blue:
#1B2A4A, #3B82F6, #60A5FA. Never introduce gold/amber as a brand accent.

Amber is NOT banned, it is the site's established warning/urgency semantic,
and the homepage itself uses it that way ~48 times (urgency badges,
`AlertTriangle`, `border-l-4 border-amber-400/50` callouts). Site-wide, 66 of
178 page/component files use amber, and 48 use the `bg-amber-50` +
`border-l-4 border-amber-400` disclaimer callout.

So: `bg-amber-50` legal-disclaimer boxes and warning callouts are CORRECT and
must not be "fixed" to blue. Recolouring a sampled handful of them only
breaks consistency with the other ~40 pages and drops the caution signal.
The 2026-07-25 audit flagged 8 such pages (ProfessionStatePage,
IsItLegalHubPage, NdaGuideHubPage, InsuranceHubPage, BankingHubPage,
TaxGuideHubPage, TimeFrameworkHubPage, HowToGuidePage), reviewed by the
owner and deliberately left as-is. Do not re-report them.
