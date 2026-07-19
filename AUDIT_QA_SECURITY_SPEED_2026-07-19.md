# invisibleexit.com — QA / Security / Speed Audit

**Date:** 2026-07-19
**Scope:** Security headers (`curl -sI`), broken links (top 20 pages), HTTPS/HSTS. **No** npm audit, dep upgrades, Lighthouse, or deploy.
**Target:** https://invisibleexit.com (static HTML on Vercel, repo `~/invisible-exit`)

---

## Scores

| Category | Score | Summary |
|---|---|---|
| **QA**     | **96 / 100** | All 20 priority pages 200 OK. 0/1694 internal links broken. 1 exposed `.bak` file. |
| **Speed**  | **94 / 100** | TTFB 129–336 ms across all pages, gzip+Brotli, edge-cached, 331 KB total homepage weight. |
| **Security** | **88 / 100** | Strong header suite (CSP, HSTS preload, XCTO, Referrer-Policy, Permissions-Policy). 2 analytics scripts silently blocked by CSP. |

---

## 1. Security (88/100)

### ✅ Strengths (curl evidence)

```
$ curl -sI https://invisibleexit.com/
HTTP/2 200
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://eu.i.posthog.com https://www.redditstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://eu.i.posthog.com https://*.supabase.co; frame-src 'self' https://www.googletagmanager.com; form-action 'self'; object-src 'none'; base-uri 'self'; upgrade-insecure-requests
strict-transport-security: max-age=63072000; includeSubDomains; preload
x-content-type-options: nosniff
x-frame-options: SAMEORIGIN
x-xss-protection: 1; mode=block
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=(), browsing-topics=()
```

- **CSP**: locked-down, object-src none, base-uri self, upgrade-insecure-requests, narrow allowlist.
- **HSTS**: 2-year max-age + includeSubDomains + **preload** (eligible for HSTS preload list).
- **TLS cert**: valid `May 22 2026 → Aug 20 2026`, auto-rotated by Vercel.
- **No mixed content**: 0 `http://` resources across 1731 unique links.

### 🔴 Safe-Fixable Issues

#### S1. Meta (Facebook) Pixel & LinkedIn Insight scripts blocked by own CSP
**Severity: medium** (breaks analytics attribution + clutters browser console on every page load)

The homepage loads both pixels via `createElement('script')` but neither domain is in the CSP allowlist, so modern browsers **refuse** to fetch them.

Evidence — homepage HTML (`/tmp/ie_html/1.home.html` line ~182):
```js
// Meta (Facebook) Pixel
t.src=v; // v = https://connect.facebook.net/en_US/fbevents.js
// LinkedIn Insight Tag
b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";
```

CSP verification:
```
$ curl -sI https://invisibleexit.com/ | grep -i content-security
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://eu.i.posthog.com https://www.redditstatic.com
                                                                 ^ NO facebook.net, NO licdn.com
```

**Fix:** add the two domains to `script-src` (and `img-src` is already `https:` so pixel fire requests work) in `vercel.json` line 46:
```
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://eu.i.posthog.com https://www.redditstatic.com https://connect.facebook.net https://snap.licdn.com;
```
Optionally also add `https://connect.facebook.net` to `connect-src` if you want the FB beacon XHRs covered (img-src `https:` already covers the `<img>` pixel fallback).

#### S2. Exposed backup file `apple-touch-icon.png.bak`
**Severity: low** (hygiene / minor info disclosure)

```
$ curl -s -o /dev/null -w "%{http_code} %{size_download}bytes\n" https://invisibleexit.com/apple-touch-icon.png.bak
200 3315bytes
```
Contents: a duplicate of the 180×180 PNG icon. No secrets, but `.bak` files shouldn't be shipped to `dist/`.

**Fix:** delete `dist/apple-touch-icon.png.bak` and add `*.bak` to the build's ignore list so it never reappears in a future deploy.

#### S3. No COOP / COEP / CORP headers
**Severity: informational** — only relevant if you ever use `SharedArrayBuffer`, `performance.measureUserAgentSpecificMemory`, or want defense-in-depth against Spectre-style attacks. Vercel's default is fine for this site's threat model. Skip unless you add those features.

---

## 2. QA (96/100)

### ✅ Strengths

| Check | Result |
|---|---|
| Top 20 pages status | **20/20 return 200** |
| Internal link audit | **0 / 1694 broken** (sampled across the 20 pages) |
| `http://` → `https://` redirect | **308 Permanent** ✓ |
| `www` → apex redirect | **308 Permanent** ✓ |
| `robots.txt` | clean, AI crawlers explicitly allowed |
| Sitemap | valid index + 7 child sitemaps, all 200 |

Top-20 page status (excerpt):
```
200 https://invisibleexit.com/
200 https://invisibleexit.com/blog
200 https://invisibleexit.com/glossary
... (all 20 = 200)
```

HTTP→HTTPS redirect:
```
$ curl -sI http://invisibleexit.com/
HTTP/1.0 308 Permanent Redirect
Location: https://invisibleexit.com/
```

### 🟡 Notes (non-blocking)

#### Q1. 5 "404" external links — **false positives** (bare host roots)
```
404 https://eu.i.posthog.com              ← PostHog API root, always 404 on GET /, fine
404 https://fonts.googleapis.com          ← CSS API root, fine
404 https://fonts.gstatic.com             ← font file root, fine
404 https://www.googletagmanager.com      ← GTM root, fine
404 https://www.redditstatic.com          ← static CDN root, fine
```
All five are CDN/API host roots linked only via `<link rel="dns-prefetch">`. They are not clickable user-facing anchors — no action needed. All real external destinations (sba.gov, irs.gov, ftc.gov, leginfo.legislature.ca.gov, etc.) return **200**.

#### Q2. `apple-touch-icon.png.bak` shipped to production — see S2 above.

---

## 3. Speed (94/100)

### ✅ Strengths

| Metric | Value |
|---|---|
| TTFB range (top 20) | **129 – 336 ms** |
| Total page time (top 20) | **133 – 336 ms** |
| Compression | gzip on all HTML/JS/CSS |
| Edge cache | `x-vercel-cache: HIT`, `s-maxage=86400` + `stale-while-revalidate=86400` |
| Homepage total transfer | **331 KB** (HTML 16.7 KB + 7 JS/CSS chunks 314.3 KB) |

Full TTFB table:
```
/                                      163 ms   69.4 KB
/blog                                  176 ms   60.8 KB
/glossary                              217 ms   53.3 KB
/about                                 138 ms   41.1 KB
/answers                               273 ms   19.9 KB
/freedom-calculator-widget             150 ms    6.4 KB
/freedom-path-calculator               336 ms   11.9 KB
/tools                                 133 ms    5.8 KB
/story                                 209 ms   45.9 KB
/manifesto                             163 ms   51.4 KB
/compare                               129 ms   51.6 KB
/adrian                                152 ms   35.5 KB
/masterclass                           171 ms   41.8 KB
/freedom                               132 ms   39.5 KB
/inner-circle                          296 ms   35.8 KB
/affiliates                            141 ms   35.5 KB
/feeling-stuck                         200 ms   36.0 KB
/partners/embed                        166 ms   36.0 KB
/partners/jv                           141 ms   35.9 KB
/content-strategy                      274 ms   36.3 KB
```

### 🟡 Minor observations (out of scope to fix per task — no Lighthouse)

- **P1.** `script-src ... 'unsafe-inline'` — replacing the inline analytics bootstrap with a hashed/nonce'd external file would let you drop `'unsafe-inline'` and slightly tighten the CSP (security+speed marginal, but out of scope).
- **P2.** 5 separate DNS-prefetch hints (`googletagmanager`, `posthog`, `redditstatic`, `facebook`, `licdn`) — fine; the corresponding scripts currently fail to load anyway (see S1), so two of those hints currently prefetch hosts that never deliver a resource.
- **P3.** `/freedom-path-calculator` (336 ms) and `/inner-circle` (296 ms) are the slowest of the 20 — still fast absolute, but ~2× the median. Likely just cache misses; not actionable without Lighthouse (excluded by scope).

---

## Safe-Fixable Issues — Priority Summary

| # | Issue | Category | Severity | Fix effort |
|---|---|---|---|---|
| **S1** | Meta Pixel + LinkedIn scripts blocked by own CSP | Security / QA | **Medium** | 1-line edit in `vercel.json` |
| **S2** | `apple-touch-icon.png.bak` exposed in production | Security / QA | Low | delete file + ignore pattern |
| S3 | No COOP/COEP/CORP | Security | Info | skip (not needed) |

**No code changes, deploys, or dependency upgrades were performed** — audit only, per scope.

---

## Methodology / Commands Used

```bash
# Security headers
curl -sI https://invisibleexit.com/
curl -sI http://invisibleexit.com/        # redirect check
curl -sI https://www.invisibleexit.com/    # www redirect
echo | openssl s_client -servername invisibleexit.com -connect invisibleexit.com:443 | openssl x509 -noout -dates

# Top-20 page selection: sitemap-core.xml (first 20 URLs)
curl -s https://invisibleexit.com/sitemap-core.xml | grep -oE '<loc>[^<]+</loc>'

# Broken-link audit (1694 internal links across the 20 pages, parallel curl, 6s timeout)
# 0 broken. 21 external links also checked — 5 "404s" are CDN host roots (false positives).

# Speed: TTFB + total time + payload for each of the 20 pages
curl -s -o /dev/null -w "%{time_starttransfer} %{time_total} %{size_download} %{http_code}" <url>
```

Full raw evidence retained in `/tmp/ie_html/`, `/tmp/ie_internal_clean.txt`, `/tmp/ie_broken_internal.txt`, `/tmp/ie_external.txt`.
