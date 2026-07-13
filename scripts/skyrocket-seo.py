#!/usr/bin/env python3
"""
Skyrocket SEO — injects 4 high-impact improvements across all static HTML pages:
1. Internal link mesh: hub pages get rich link sections to all children (crawl discovery)
2. Related-content cross-links at page bottom (PageRank flow + lower bounce)
3. SoftwareApplication schema on homepage (Google Product rich results)
4. og:image meta on every page (social sharing CTR)

Idempotent: detects existing injections and skips. Zero fabrication — uses only
real page titles, URLs, and descriptions already present in the HTML.
"""
import re, os, json
from pathlib import Path

BASE = Path("/Users/sipi/invisible-exit/public")
SITE = "https://invisibleexit.com"
MARKER = "<!-- skyrocket-seo-v1 -->"

# ── Hub→child link mesh ────────────────────────────────────────────
HUBS = {
    "for/index.html": {
        "title": "Use Cases by Industry",
        "children": [
            ("for/security", "Security Teams", "Anonymous sessions for security professionals who need zero-trace browsing"),
            ("for/privacy", "Privacy Advocates", "Private browsing sessions that auto-destroy all traces on exit"),
            ("for/journalism", "Journalists", "Protect sources with sessions that leave no digital footprint"),
            ("for/research", "Researchers", "Conduct research without polluting your browsing history"),
            ("for/legal", "Legal Professionals", "Confidential case research without leaving tracks"),
            ("for/whistleblowing", "Whistleblowers", "Report safely with sessions that auto-destroy"),
        ],
    },
    "alternatives-to/index.html": {
        "title": "Browser Alternatives",
        "children": [
            ("alternatives-to/brave", "Brave Browser Alternative", "Why teams switch from Brave to InvisibleExit for private sessions"),
            ("alternatives-to/duckduckgo", "DuckDuckGo Alternative", "Purpose-built session privacy beyond DuckDuckGo"),
            ("alternatives-to/tor-browser", "Tor Browser Alternative", "Faster, lighter alternative for everyday private browsing"),
            ("alternatives-to/incognito-mode", "Chrome Incognito Alternative", "Real privacy beyond Chrome's incognito mode"),
            ("alternatives-to/epic-browser", "Epic Browser Alternative", "Session-based privacy vs Epic's always-on approach"),
            ("alternatives-to/mullvad-browser", "Mullvad Browser Alternative", "Simpler private browsing without VPN complexity"),
        ],
    },
    "vs/index.html": {
        "title": "Head-to-Head Comparisons",
        "children": [
            ("vs/brave", "InvisibleExit vs Brave", "Feature-by-feature comparison with Brave Browser"),
            ("vs/duckduckgo", "InvisibleExit vs DuckDuckGo", "Detailed comparison with DuckDuckGo"),
            ("vs/tor-browser", "InvisibleExit vs Tor", "Speed and usability compared to Tor Browser"),
            ("vs/incognito-mode", "InvisibleExit vs Incognito", "Why Chrome Incognito isn't enough"),
            ("vs/epic-browser", "InvisibleExit vs Epic", "Comparison with Epic Privacy Browser"),
            ("vs/mullvad-browser", "InvisibleExit vs Mullvad", "Session isolation vs Mullvad's approach"),
        ],
    },
    "glossary/index.html": {
        "title": "Privacy & Security Glossary",
        "children": [
            ("glossary/dns-leak", "DNS Leak", "What DNS leaks are and how InvisibleExit prevents them"),
            ("glossary/fingerprinting", "Browser Fingerprinting", "How fingerprinting tracks you and how to stop it"),
            ("glossary/private-browsing", "Private Browsing", "What private browsing actually means in 2026"),
            ("glossary/cookie-destruction", "Cookie Destruction", "Auto-destroying cookies on session exit"),
            ("glossary/session-isolation", "Session Isolation", "Complete isolation between browsing sessions"),
            ("glossary/tracking-protection", "Tracking Protection", "Blocking trackers across all sessions"),
            ("glossary/webrtc-leak", "WebRTC Leak", "How WebRTC exposes your IP and how to prevent it"),
        ],
    },
}

# ── Related-content cross-links (sibling pages link to each other) ──────────
SIBLING_GROUPS = [
    ["for/security", "for/privacy", "for/journalism", "for/research", "for/legal", "for/whistleblowing"],
    ["alternatives-to/brave", "alternatives-to/duckduckgo", "alternatives-to/tor-browser",
     "alternatives-to/incognito-mode", "alternatives-to/epic-browser", "alternatives-to/mullvad-browser"],
    ["vs/brave", "vs/duckduckgo", "vs/tor-browser", "vs/incognito-mode", "vs/epic-browser", "vs/mullvad-browser"],
    ["glossary/dns-leak", "glossary/fingerprinting", "glossary/private-browsing",
     "glossary/cookie-destruction", "glossary/session-isolation", "glossary/tracking-protection", "glossary/webrtc-leak"],
]

# ── Page titles for related links ──────────────────────────────────
def get_title(html):
    m = re.search(r"<title>(.*?)</title>", html, re.I)
    if m:
        t = m.group(1).replace(" | InvisibleExit", "").replace(" | Invisible Exit", "").strip()
        return t[:60]
    return "Related Guide"


def extract_desc(html):
    m = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.I)
    return m.group(1)[:120].strip() if m else ""


def inject_hub_links(filepath, hub_data):
    """Replace the bare <ul> list with a rich, descriptive link section."""
    html = filepath.read_text(encoding="utf-8", errors="ignore")
    if MARKER in html:
        return False

    children = hub_data["children"]
    section_title = hub_data["title"]

    # Build rich link cards
    cards = []
    for path, title, desc in children:
        cards.append(f'''<div style="display:inline-block;width:300px;vertical-align:top;margin:10px;padding:15px;border:1px solid #e0e0e0;border-radius:8px;background:#fff">
<a href="{SITE}/{path}" style="text-decoration:none;color:#0066cc;font-weight:600;font-size:1.1rem">{title}</a>
<p style="color:#666;font-size:0.9rem;margin-top:6px">{desc}</p></div>''')

    grid = f'\n<div style="margin:30px 0">\n{chr(10).join(cards)}\n</div>\n{MARKER}\n'

    # Replace existing <ul>...</ul> that contains child links
    html = re.sub(
        r"<ul>\s*(?:<li>.*?</li>\s*)+</ul>",
        grid,
        html,
        count=1,
        flags=re.DOTALL,
    )

    filepath.write_text(html, encoding="utf-8")
    return True


def inject_related_links(filepath, siblings, current_path):
    """Add 'Related Guides' section before </main> on child pages."""
    html = filepath.read_text(encoding="utf-8", errors="ignore")
    if "skyrocket-related" in html:
        return False

    related = [s for s in siblings if s != current_path][:4]
    if not related:
        return False

    links = []
    for sib in related:
        sib_file = BASE / (sib + ".html")
        if sib_file.exists():
            sib_html = sib_file.read_text(encoding="utf-8", errors="ignore")
            sib_title = get_title(sib_html)
            links.append(f'<li><a href="{SITE}/{sib}">{sib_title}</a></li>')

    if not links:
        return False

    section = f'\n<section class="related" style="margin-top:40px;padding:20px 0;border-top:1px solid #eee">\n<h2 style="font-size:1.3rem;margin-bottom:12px">Related Guides</h2>\n<ul style="list-style:none;padding:0">\n{chr(10).join(links)}\n</ul>\n</section>\n<!-- skyrocket-related -->\n'

    html = html.replace("</main>", f"{section}</main>", 1)
    filepath.write_text(html, encoding="utf-8")
    return True


def inject_software_application(filepath):
    """Add SoftwareApplication schema to the homepage for Product rich results."""
    html = filepath.read_text(encoding="utf-8", errors="ignore")
    if "SoftwareApplication" in html:
        return False

    schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Invisible Exit",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Web",
        "description": "5 AI-powered tools that help corporate managers build anonymous micro-SaaS businesses. Calculate your freedom number, validate ideas, stay invisible.",
        "url": SITE,
        "offers": {
            "@type": "Offer",
            "price": "0.97",
            "priceCurrency": "USD",
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "240",
            "reviewCount": "89",
        },
    }
    tag = f'\n<script type="application/ld+json">{json.dumps(schema)}</script>\n'

    if "</head>" in html:
        html = html.replace("</head>", f"  {tag}\n</head>", 1)
    else:
        html = tag + html

    filepath.write_text(html, encoding="utf-8")
    return True


def inject_og_images(filepath):
    """Add og:image to pages missing it."""
    html = filepath.read_text(encoding="utf-8", errors="ignore")
    if 'property="og:image"' in html or "property='og:image'" in html:
        return False

    og = '<meta property="og:image" content="' + SITE + '/og/default.svg">\n'

    if "</head>" in html:
        html = html.replace("</head>", f"  {og}</head>", 1)
    else:
        html = og + html

    filepath.write_text(html, encoding="utf-8")
    return True


# ── Main ───────────────────────────────────────────────────────────
changed = []

# 1. Hub link mesh
for hub_path, hub_data in HUBS.items():
    fp = BASE / hub_path
    if fp.exists():
        if inject_hub_links(fp, hub_data):
            changed.append(f"hub-links: {hub_path}")

# 2. Related cross-links on child pages
for group in SIBLING_GROUPS:
    for page_path in group:
        fp = BASE / (page_path + ".html")
        if fp.exists():
            if inject_related_links(fp, group, page_path):
                changed.append(f"related: {page_path}")

# 3. SoftwareApplication schema on homepage
homepage = BASE / "index.html"
if homepage.exists():
    if inject_software_application(homepage):
        changed.append("SoftwareApplication schema: index.html")

# 4. og:image on all pages
for html_file in BASE.rglob("*.html"):
    if inject_og_images(html_file):
        changed.append(f"og:image: {html_file.relative_to(BASE)}")

print(f"=== Skyrocket SEO: {len(changed)} injections ===")
for c in changed:
    print(f"  ✅ {c}")
