#!/usr/bin/env python3
"""
InvisibleExit exit-scenario pSEO generator.
Produces /scenarios/{scenario}/index.html for 15 exit scenarios.
Matches the existing /exit-strategies/ template pattern (standalone HTML, /ux.css, BRUNSON trust bar).
Writes to public/scenarios/ (Vite source) and mirrors to dist/scenarios/ (build output).
Updates both public/sitemap.xml and dist/sitemap.xml.
"""
import json
import re
import shutil
from pathlib import Path

ROOT = Path("/Users/sipi/invisible-exit")
PUB = ROOT / "public"
DIST = ROOT / "dist"
BASE = "https://invisibleexit.com"
TODAY = "2026-07-18"

# 15 exit scenarios. Each: (slug, title, one-liner, warning-signs list, recovery-playbook list)
SCENARIOS = [
    ("co-founder-departure", "Co-Founder Departure",
     "your co-founder is leaving — voluntarily or not — and the side business you built together is suddenly in limbo",
     ["Communication has dropped to transactional updates only", "They've stopped committing to the repo or the content calendar", "Discussions about equity or 'who owns what' have gone quiet", "They're publicly active in a new, adjacent space"],
     ["Inventory every shared asset (repo, domains, payment accounts, social) in a single doc this week", "Transfer ownership of critical accounts before the conversation, not after", "Agree on a 90-day transition window with documented handover milestones", "Re-negotiate equity in writing — verbal splits collapse under stress", "Use Invisible Exit's tools to spin up the successor product quietly if the split goes hostile"]),
    ("burnout-exit", "Burnout Exit",
     "you're exhausted, the day job is taking everything, and quietly shutting the side business down feels easier than continuing",
     ["You haven't shipped or published in 30+ days and feel relief, not guilt", "Every notification from the product triggers dread, not curiosity", "Your day-job performance is slipping and you're blaming the side project", "You've started fantasizing about 'just deleting it all'"],
     ["Do not delete anything — put the product in maintenance mode for 60 days first", "Audit whether the issue is the business or your capacity (they have different fixes)", "If revenue is real, list it for sale before shutting down — micro-SaaS acquisitions clear in 30–90 days", "If you keep it, cut scope to one weekly commitment you can hit from your phone", "Use Invisible Exit's content tools to schedule 8 weeks of evergreen posts before you step back"]),
    ("acquisition-pressure", "Acquisition Pressure",
     "an unsolicited buyer is circling your micro-SaaS and the offer is flattering enough to short-circuit your diligence",
     ["The buyer is pushing for a fast close (under 30 days)", "They're emphasizing valuation but light on the asset-purchase agreement details", "They want exclusivity before you've seen the contract", "Their reference checks come back vague or rehearsed"],
     ["Slow the timeline — every week of delay improves your leverage and your diligence", "Pull trailing-12 revenue, churn, and cohort data before any call", "Demand a clean asset-purchase agreement (not a stock sale) with explicit non-compete scope", "Get a second term sheet or a credible walk-away BATNA before signing", "Use Invisible Exit's valuation tools to model the offer against a 24-month hold"]),
    ("pivot-quiet-exit", "Pivot Quiet Exit",
     "the original product isn't working but you don't want to announce a failure — you're quietly sunsetting it to pivot",
     ["MRR has been flat or declining for 6+ months despite active effort", "Your best customers are asking for features outside your ICP", "You're bored and inventing reasons to avoid the dashboard", "A new direction has been pulling 80% of your energy for 60+ days"],
     ["Don't announce a sunset — migrate the 20% of customers who still love it to a successor product", "Keep the domain, the list, and the brand (they're the real assets)", "Repurpose existing content into the new direction to preserve SEO equity", "Run both in parallel for 90 days, then formally retire the old brand", "Use Invisible Exit's research tools to validate the pivot ICP before committing"]),
    ("health-departure", "Health Departure",
     "a health event — yours or a family member's — means you need to step away from the side business immediately and indefinitely",
     ["A diagnosis or procedure has a defined recovery window of 8+ weeks", "You're already missing commitments and apologizing more than shipping", "Your capacity is genuinely reduced, not just temporarily stretched", "You need the cognitive load reduced, not just the workload"],
     ["Automate or pause everything non-essential this week — no new features", "Set a candid autoresponder to customers (they're more understanding than you fear)", "If revenue is meaningful, hire a fractional operator for 90 days before deciding to sell", "If not, list it for sale now with a 60-day transition — health-driven sales close fast", "Use Invisible Exit's playbook library to find a buyer without it consuming your remaining capacity"]),
    ("family-obligation", "Family Oblligation",
     "a family obligation — caregiving, a move, a new child — is reshaping your capacity and the side business needs to adapt or exit",
     ["Your available hours have dropped by 50%+ and the change is permanent, not temporary", "Your shipping cadence has broken and you can't see when it returns", "The business is fine but the cognitive context-switching is unsustainable", "You're resenting the business for competing with the family obligation"],
     ["Re-scope to what's sustainable at the new capacity (usually 1 weekly commitment)", "Move every recurring task to batch mode — one 90-minute block per week", "If the business needs more than you can give, sell it before it decays", "Price the sale as a 'turnkey' transfer with a 30-day transition", "Use Invisible Exit's automation tools to remove yourself from the daily loop"]),
    ("failed-raise", "Failed Raise",
     "your funding round fell through and you now need to decide whether to keep going independently, sell, or wind down",
     ["Investor conversations went silent after the second meeting", "Your runway assumption was contingent on the raise closing", "You're considering bridge rounds or personal capital to keep going", "Team or contractor commitments were made on the assumption of new capital"],
     ["Recompute a 12-month runway at current revenue, not projected revenue", "Cut any commitment that assumed new capital — do it this week", "Decide explicitly: bootstrap, sell, or wind down. Drift is the most expensive option", "If you sell, position the failed raise as 'chose independence' not 'couldn't close'", "Use Invisible Exit's buyer network tools to test acquisition interest in parallel"]),
    ("market-shift", "Market Shift",
     "a platform change, a new competitor, or a regulatory shift has made your micro-SaaS's market materially worse and you need to exit or pivot",
     ["A platform you depend on (OpenAI, Stripe, Shopify) changed pricing or API access", "A well-funded competitor entered and is buying market share", "A regulation (GDPR-adjacent, AI-act-adjacent) raised your compliance cost", "Your category's search volume is down 30%+ year-over-year"],
     ["Quantify the shift in revenue impact over 6 and 12 months before reacting", "If the shift is structural, sell within 90 days while revenue still looks stable", "If the shift is cyclical, cut scope and wait it out — don't sell at the bottom", "Position the sale around the opportunity, not the threat", "Use Invisible Exit's competitive-research tools to map the new landscape before deciding"]),
    ("team-departure", "Team Departure",
     "a key contractor, VA, or part-time team member is leaving and the operational load is about to fall back on you",
     ["Your main operator or VA gave notice or has gone quiet", "The business runs on tribal knowledge that lives in one person's head", "SOPs are out of date or were never written", "You're about to become the operator again, not just the owner"],
     ["Before they leave, do a 2-week knowledge extraction — record every recurring task", "Write or update SOPs for the 20% of tasks that drive 80% of the output", "Decide whether to replace them, automate, or absorb the work yourself", "If replacing, hire from a lower-cost geography and overlap for 30 days", "Use Invisible Exit's SOP tools to turn one person's knowledge into a system"]),
    ("investor-pressure", "Investor Pressure",
     "your investors or backers are pushing for an exit, a timeline, or a direction you're not aligned with",
     ["Investor updates have become tense or adversarial", "They're introducing 'advisors' who are quietly scouting for a sale", "They're pushing timelines that don't match your revenue trajectory", "Board or advisory calls are running longer and producing less alignment"],
     ["Re-read the investment docs — understand exactly what rights and board control they have", "Get the disagreement in writing (email, not calls) so there's a record", "Model the downside of an early forced exit vs. a 12-month negotiated one", "If alignment is impossible, a clean sale is often better than a slow war", "Use Invisible Exit's negotiation playbooks to structure a graceful exit on your terms"]),
    ("personal-differences", "Personal Differences",
     "you and a partner, contractor, or key collaborator have irreconcilable personal differences and the working relationship is poisoning the business",
     ["Every decision has become a negotiation, not a collaboration", "Communication has moved to text-only because calls are too tense", "You're spending more energy managing the relationship than the business", "Customers or users are starting to notice the friction"],
     ["Separate the relationship problem from the business problem — they need different solutions", "If the business is healthy, one of you should buy the other out cleanly", "Get a third-party valuation so the buyout price isn't another fight", "Document the split in a written operating agreement amendment", "Use Invisible Exit's legal-template tools to draft the split without a lawyer"]),
    ("silent-shutdown", "Silent Shutdown",
     "you've decided to wind the side business down but you want to do it without a public announcement, preserving optionality and reputation",
     ["Revenue has been declining for 6+ months and you've stopped trying to reverse it", "You've stopped investing in marketing, content, or new features", "You're keeping the business alive out of inertia, not intention", "You want to exit without a public 'I failed' post"],
     ["Don't announce — let the business fade by stopping new acquisition spend", "Migrate the remaining paying customers to a successor product or a partner", "Keep the domain, email list, and content live (they retain value for years)", "Formally dissolve the entity only after all subscriptions have churned", "Use Invisible Exit's wind-down checklist to do it cleanly and preserve the brand equity"]),
    ("graceful-exit", "Graceful Exit",
     "you've hit your freedom number and want to sell the micro-SaaS on your terms, at a premium, with a clean transition",
     ["MRR has been stable or growing for 12+ months", "You have a documented SOP library and the business runs without you", "You've hit a freedom number that makes selling attractive", "You want to sell at a premium, not a fire-sale"],
     ["Prepare 24 months of clean financials (P&L, MRR movement, cohort retention)", "Document every system, SOP, and customer relationship in a data room", "Approach 5–10 strategic buyers before listing publicly", "Negotiate a 6–12 month transition period at full consulting rate", "Use Invisible Exit's exit-readiness tools to model premium multiples before you list"]),
    ("industry-exit", "Industry Exit",
     "your industry or vertical is consolidating, regulating, or declining and you need to exit before the window closes",
     ["Two or three of your competitors have been acquired in the last 12 months", "A major regulator has signaled rule changes that affect your category", "Search volume and category interest are declining year-over-year", "Your best customers are being acquired or going out of business"],
     ["Track the consolidation — acquired competitors mean buyers are actively shopping", "Reach out to the acquiring companies directly — they often want tuck-ins", "Time the sale to the consolidation wave, not after it peaks", "Position your business as the last independent in the category", "Use Invisible Exit's market-timing tools to identify the optimal exit window"]),
    ("geographic-relocation", "Geographic Relocation",
     "you're moving countries or regions and the relocation creates tax, legal, or operational reasons to restructure or exit the side business",
     ["Your new country has different tax treatment of foreign SaaS revenue", "Your payment processor or entity structure doesn't transfer cleanly", "Time-zone shifts make operating the business unsustainable", "Visa or employment-status constraints in the new country limit side income"],
     ["Map the tax and legal implications before the move, not after", "Decide whether to restructure (new entity), sell, or wind down", "If selling, time the close to before the move to simplify taxes", "If restructuring, set up the new entity before canceling the old one", "Use Invisible Exit's cross-border tools to model the restructuring options"]),
]


def jd(q, a):
    return {"@type": "Question", "name": q,
            "acceptedAnswer": {"@type": "Answer", "text": a}}


def build_page(scenario):
    slug, title, one_liner, warning_signs, playbook = scenario
    url = f"{BASE}/scenarios/{slug}"

    page_title = f"Quiet Exit: {title} — Warning Signs & Recovery Playbook | Invisible Exit"
    desc = (f"The {title.lower()} exit scenario for micro-SaaS founders: "
            f"{len(warning_signs)} warning signs to watch for and a {len(playbook)}-step recovery playbook. "
            f"How employed professionals exit a side business quietly, on their terms.")

    faqs = [
        (f"How do I know if I'm in a '{title.lower()}' exit scenario?",
         f"The hallmark signs are: " + "; ".join(warning_signs[:3]).lower() + ". If two or more of these are true and have been true for 30+ days, you're likely in a " + title.lower() + " scenario. The Invisible Exit playbook library has a full diagnostic for each scenario."),
        (f"Can I exit a side business quietly without a public announcement?",
         f"Yes. Most micro-SaaS exits are 'silent' — the business is either sold to a buyer who absorbs the brand, migrated to a successor product, or wound down without a public post. Public exits are the exception, not the rule. The recovery playbook on this page walks through the quiet-exit path specific to a " + title.lower() + " scenario."),
        (f"Does Invisible Exit help with the {title.lower()} scenario specifically?",
         f"Yes. Invisible Exit's five AI tools include exit-readiness checklists, valuation modelers, buyer-network access, SOP builders, and wind-down checklists — each tuned to specific exit scenarios including " + title.lower() + ". Membership starts at $0.97/month during the founding period."),
    ]

    article_json = {
        "@context": "https://schema.org", "@type": "Article",
        "headline": f"Quiet Exit: {title}",
        "description": desc,
        "author": {"@type": "Organization", "name": "Invisible Exit", "url": BASE},
        "publisher": {"@type": "Organization", "name": "Invisible Exit", "url": BASE},
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "datePublished": "2026-01-15", "dateModified": TODAY,
    }
    faq_json = {"@context": "https://schema.org", "@type": "FAQPage",
                "mainEntity": [jd(q, a) for q, a in faqs]}
    breadcrumb_json = {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE}/"},
            {"@type": "ListItem", "position": 2, "name": "Exit Scenarios", "item": f"{BASE}/scenarios"},
            {"@type": "ListItem", "position": 3, "name": title, "item": url},
        ],
    }
    org_disambig = {
        "@context": "https://schema.org", "@type": "Organization",
        "name": "Invisible Exit", "url": BASE,
        "description": "Invisible Exit is a faceless side-business system for employed professionals — a membership platform of five AI tools that build anonymous micro-SaaS recurring revenue without quitting your job, writing code, or revealing your identity.",
        "disambiguatingDescription": "Invisible Exit is a faceless side-business membership platform for employed professionals building anonymous micro-SaaS income — unrelated to the video game 'Invisible, Inc.' or traditional business exit-planning / M&A advisory.",
    }

    faq_visible = "\n".join(f"<h3>{q}</h3>\n<p>{a}</p>" for q, a in faqs)
    warning_html = "\n".join(f"<li>{w}</li>" for w in warning_signs)
    playbook_html = "\n".join(f"<li>{p}</li>" for p in playbook)

    # 3 related scenarios (deterministic rotation)
    all_slugs = [s[0] for s in SCENARIOS]
    idx = all_slugs.index(slug)
    related = [all_slugs[(idx + i) % len(all_slugs)] for i in (3, 7, 11)]
    related_html = "\n".join(
        f'<li><a href="{BASE}/scenarios/{r}" style="color:#0066cc">{r.replace("-", " ").title()}</a></li>'
        for r in related
    )

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>{page_title}</title>
<meta name="description" content="{desc}">
<meta name="author" content="Invisible Exit">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{page_title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="article">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}/og/default.svg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{page_title}">
<meta name="twitter:description" content="{desc}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="article:published_time" content="2026-01-15T00:00:00Z">
<meta property="article:modified_time" content="{TODAY}T00:00:00Z">
<script type="application/ld+json">{json.dumps(article_json)}</script>
<script type="application/ld+json">{json.dumps(breadcrumb_json)}</script>
<script type="application/ld+json">{json.dumps(faq_json)}</script>
<script type="application/ld+json">{json.dumps(org_disambig)}</script>
<link rel="stylesheet" href="/ux.css">
<script src="/ux.js" defer></script>
</head>
<body style="font-family:-apple-system,system-ui,sans-serif;max-width:760px;margin:0 auto;padding:24px;line-height:1.7;color:#1a1a1a">
<header><nav style="font-size:.9rem;color:#666;margin-bottom:1.5rem"><a href="{BASE}/" style="color:#0066cc">Invisible Exit</a> › <a href="{BASE}/scenarios" style="color:#0066cc">Exit Scenarios</a> › {title}</nav></header>
<main>
<article>
<h1 style="font-size:2.1rem;line-height:1.2;margin:.3em 0">Quiet Exit: {title}</h1>
<p class="lede" style="font-size:1.1rem;color:#374151;margin-bottom:1.5rem">The <strong>{title.lower()}</strong> exit scenario is the moment {one_liner}. This page covers the {len(warning_signs)} warning signs that tell you you're in it, and a {len(playbook)}-step recovery playbook to exit quietly, on your terms, without a public announcement or a fire-sale.</p>

<h2 style="font-size:1.45rem;margin-top:2rem;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">Warning signs you're in a {title.lower()} scenario</h2>
<p>Most founders miss the exit window not because the signs aren't there, but because the signs look like normal operational friction. The {len(warning_signs)} signals below are specific to the {title.lower()} scenario. If two or more have been true for 30+ days, you're likely already in the scenario — and the recovery playbook is the next section.</p>
<ul style="line-height:1.9">
{warning_html}
</ul>

<div style="background:#fef3c7;border-left:4px solid #d97706;padding:1rem 1.25rem;margin:1.5rem 0;border-radius:0 .375rem .375rem">
<strong>The pattern:</strong> exit scenarios rarely arrive as a single event. They arrive as a cluster of small signals that, taken together, point to a structural change in your relationship with the business. The {title.lower()} scenario specifically tends to show up as {warning_signs[0].lower()}.
</div>

<h2 style="font-size:1.45rem;margin-top:2rem;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">Recovery playbook for {title.lower()}</h2>
<p>The playbook below is the quiet-exit path for the {title.lower()} scenario — designed to preserve your revenue, your reputation, and your optionality. Steps are ordered; do them in sequence, not in parallel.</p>
<ol style="line-height:1.9">
{playbook_html}
</ol>

<div style="background:#ecfdf5;border-left:4px solid #059669;padding:1rem 1.25rem;margin:1.5rem 0;border-radius:0 .375rem .375rem 0">
<strong>The principle:</strong> a quiet exit is almost always better than a loud one. Announcing an exit kills your leverage with buyers, triggers customer churn before you're ready, and creates a public narrative you can't control. The playbook above keeps the exit quiet until the deal (or the wind-down) is complete.
</div>

<h2 style="font-size:1.45rem;margin-top:2rem;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">What this scenario costs if you ignore it</h2>
<p>Founders who ignore the {title.lower()} scenario typically lose 40–70% of the business's value before they act. Revenue decays, customer relationships sour, and the eventual exit (if it happens at all) happens at a fire-sale multiple instead of a premium one. Acting in the first 90 days of the warning signs is the single highest-leverage move in the entire exit timeline.</p>

<h2 style="font-size:1.45rem;margin-top:2rem;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">Frequently asked questions</h2>
{faq_visible}

<div style="background:#0066cc;color:#fff;padding:1rem 1.5rem;border-radius:.5rem;text-align:center;margin:2rem 0">
<a href="{BASE}/#start" style="color:#fff;font-weight:600;font-size:1.1rem">Get the full {title} recovery playbook →</a>
</div>

<section style="margin-top:2.5rem;padding:1rem 1.25rem;background:#f9fafb;border-radius:.5rem">
<h3 style="font-size:1.1em;margin-top:0">Related exit scenarios</h3>
<ul style="list-style:none;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:.4rem 1rem">
{related_html}
<li><a href="{BASE}/exit-strategies" style="color:#0066cc">Exit strategies by revenue level</a></li>
<li><a href="{BASE}/scenarios" style="color:#0066cc">All exit scenarios</a></li>
</ul>
</section>
</article>
</main>

<footer style="margin-top:3rem;padding-top:1.5rem;border-top:1px solid #e5e7eb;color:#6b7280;font-size:.9rem">
<p>© 2026 Invisible Exit. The faceless side-business system for employed professionals.</p>
<p><a href="{BASE}/" style="color:#0066cc">Home</a> · <a href="{BASE}/faq" style="color:#0066cc">FAQ</a> · <a href="{BASE}/about" style="color:#0066cc">About</a></p>
</footer>

<section class="brunson-trust-bar" style="background:linear-gradient(135deg, #0f172a, #1e293b);color:#e8eaed;padding:40px 24px;margin:60px 0 0;border-top:3px solid #00d4aa;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:900px;margin:0 auto">
<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:28px;margin-bottom:28px">
<div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">138</span><br><span style="font-size:.82rem;color:#94a3b8">Customers building</span></div>
<div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">$4K</span><br><span style="font-size:.82rem;color:#94a3b8">Target /month</span></div>
<div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">5</span><br><span style="font-size:.82rem;color:#94a3b8">AI tools included</span></div>
<div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">$0.97</span><br><span style="font-size:.82rem;color:#94a3b8">Founding /mo</span></div>
</div>
<p style="font-size:1.05rem;margin-bottom:24px;color:#cbd5e1">138 managers are already building quietly. Founding spots are limited and the price locks forever.</p>
<a href="{BASE}/#start" style="display:inline-block;background:linear-gradient(135deg,#00d4aa,#2deec0);color:#04130e;padding:14px 32px;border-radius:12px;font-weight:700;text-decoration:none;font-size:.95rem;box-shadow:0 8px 24px -10px rgba(0,212,170,.5)">Get Started for $0.97 →</a>
<p style="margin-top:18px;font-size:.78rem;color:#6b7178">🛡️ If you do not earn $4K/mo within 12 months, we refund every cent. Founding price locked.</p>
</div>
</section>
</body>
</html>
"""
    # Write to public/ (Vite source)
    pub_dir = PUB / "scenarios" / slug
    pub_dir.mkdir(parents=True, exist_ok=True)
    (pub_dir / "index.html").write_text(html, encoding="utf-8")
    # Mirror to dist/ (build output)
    dist_dir = DIST / "scenarios" / slug
    dist_dir.mkdir(parents=True, exist_ok=True)
    (dist_dir / "index.html").write_text(html, encoding="utf-8")
    return url


def build_index():
    """Build /scenarios/ index page linking all 15 scenarios."""
    url = f"{BASE}/scenarios"
    items = "\n".join(
        f'<li style="margin:10px 0;padding:12px;border:1px solid #e0e0e0;border-radius:8px;background:#fff"><a href="{BASE}/scenarios/{s[0]}" style="font-weight:600;font-size:1.05rem;color:#0066cc;text-decoration:none">{s[1]}</a><p style="color:#666;font-size:.9rem;margin:6px 0 0">{s[2].capitalize()}</p></li>'
        for s in SCENARIOS
    )
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>Micro-SaaS Exit Scenarios — 15 Quiet-Exit Playbooks | Invisible Exit</title>
<meta name="description" content="15 micro-SaaS exit scenarios with warning signs and recovery playbooks: co-founder departure, burnout, acquisition pressure, failed raise, and more. Quiet exits on your terms.">
<link rel="canonical" href="{url}">
<meta name="robots" content="index, follow">
<link rel="stylesheet" href="/ux.css">
<script src="/ux.js" defer></script>
<script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@type":"Organization","name":"Invisible Exit","url":BASE,"description":"Invisible Exit is a faceless side-business system for employed professionals — a membership platform of five AI tools that build anonymous micro-SaaS recurring revenue without quitting your job, writing code, or revealing your identity.","disambiguatingDescription":"Invisible Exit is a faceless side-business membership platform for employed professionals building anonymous micro-SaaS income — unrelated to the video game 'Invisible, Inc.' or traditional business exit-planning / M&A advisory."})}</script>
<script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":f"{BASE}/"},{"@type":"ListItem","position":2,"name":"Exit Scenarios","item":url}]})}</script>
</head>
<body style="font-family:-apple-system,system-ui,sans-serif;max-width:760px;margin:0 auto;padding:24px;line-height:1.6;color:#1a1a1a">
<header><nav><a href="{BASE}/" style="color:#0066cc">Invisible Exit</a> › Exit Scenarios</nav></header>
<main>
<h1 style="font-size:2rem">Micro-SaaS Exit Scenarios</h1>
<p>15 quiet-exit playbooks for micro-SaaS founders. Each scenario covers the warning signs and a step-by-step recovery playbook — designed to preserve revenue, reputation, and optionality.</p>
<ul style="list-style:none;padding:0">
{items}
</ul>
</main>
<footer style="margin-top:3rem;padding-top:1.5rem;border-top:1px solid #e5e7eb;color:#6b7280;font-size:.9rem">
<p>© 2026 Invisible Exit.</p>
</footer>
</body>
</html>
"""
    for base in (PUB, DIST):
        d = base / "scenarios"
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(html, encoding="utf-8")
    return url


def update_sitemap(urls, index_url):
    for sm_path in (PUB / "sitemap.xml", DIST / "sitemap.xml"):
        if not sm_path.exists():
            continue
        text = sm_path.read_text(encoding="utf-8")
        # Idempotent: remove any existing /scenarios/ entries we own
        lines = [l for l in text.splitlines() if "/scenarios/" not in l]
        text = "\n".join(lines)
        all_urls = [index_url] + urls
        additions = "\n".join(
            f"  <url><loc>{u}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>"
            for u in all_urls
        )
        if "</urlset>" in text:
            text = text.replace("</urlset>", additions + "\n</urlset>")
        else:
            text = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + additions + "\n</urlset>\n"
        sm_path.write_text(text, encoding="utf-8")


def main():
    urls = [build_page(s) for s in SCENARIOS]
    index_url = build_index()
    update_sitemap(urls, index_url)
    print(f"Generated {len(urls)} scenario pages + 1 index")
    print(f"Sample: {urls[0]}")


if __name__ == "__main__":
    main()
