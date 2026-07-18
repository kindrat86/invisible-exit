#!/usr/bin/env python3
"""
Content Syndication Playbook for invisibleexit.com
===================================================
Republishing blog posts on high-authority platforms creates backlinks.
Each platform gets a unique intro + canonical link back to the original.

Strategy:
- Medium: Republish top 5 blog posts with "Originally published at" link
- Dev.to: Tech/entrepreneurship angle posts (FYM Dashboard, micro-SaaS ideas)
- Substack: Newsletter version that links back to full articles
- Reddit: Post summaries in r/sidehustle, r/entrepreneur, r/microsaas
- Hacker News: Submit calculator tools & data-driven posts
- LinkedIn Articles: Repost to personal profile + company page
"""

SYNDICATION_TARGETS = [
    # ===== TIER 1: Direct backlinks (dofollow or high-DA) =====
    {
        "platform": "Medium",
        "url": "https://medium.com/new-story",
        "backlink_type": "canonical (cross-domain rel=canonical via import)",
        "domain_authority": 95,
        "strategy": "Use Medium's 'Import Story' feature — it automatically sets rel=canonical to your URL. This is the #1 syndication backlink play.",
        "posts_to_syndicate": [
            "https://invisibleexit.com/blog/freedom-number",
            "https://invisibleexit.com/blog/how-to-start-micro-saas-while-employed",
            "https://invisibleexit.com/blog/anonymous-llc-side-business",
            "https://invisibleexit.com/blog/best-ai-tools-side-hustle-2026",
            "https://invisibleexit.com/blog/hub-and-spoke-content-strategy",
        ],
        "template": """---
title: "{TITLE}"
canonical_url: {ORIGINAL_URL}
published_at: {DATE}
tags: [side-hustle, micro-saas, entrepreneurship, financial-independence]
---

*Originally published at [Invisible Exit]({ORIGINAL_URL})*

{BODY_FIRST_3_PARAGRAPHS}

[Continue reading on Invisible Exit →]({ORIGINAL_URL})
""",
    },
    
    {
        "platform": "Dev.to",
        "url": "https://dev.to/new",
        "backlink_type": "canonical URL field in post settings",
        "domain_authority": 90,
        "strategy": "Dev.to has a 'canonical URL' field in post settings. Set it to your original post URL for full SEO credit. Focus on tech/entrepreneurship crossover posts.",
        "posts_to_syndicate": [
            "https://invisibleexit.com/blog/freedom-number",
            "https://invisibleexit.com/blog/best-ai-tools-side-hustle-2026",
            "https://invisibleexit.com/blog/micro-saas-ideas-no-code",
        ],
        "template": """---
title: "{TITLE}"
canonical_url: {ORIGINAL_URL}
tags: [microsaas, sideproject, entrepreneurship, ai]
---

{BODY_FIRST_3_PARAGRAPHS}

%[https://invisibleexit.com/og-image.png]

*This post was originally published on [Invisible Exit]({ORIGINAL_URL}). I'm sharing it here for the dev.to community.*
""",
    },

    {
        "platform": "Substack",
        "url": "https://invisibleexit.substack.com/publish",
        "backlink_type": "In-content link to full article",
        "domain_authority": 88,
        "strategy": "Create a Substack publication. Each newsletter issue summarizes a blog post with a 'Read the full guide →' link. Substack pages get indexed and pass authority.",
    },

    # ===== TIER 2: Community backlinks =====
    {
        "platform": "Reddit r/sidehustle",
        "url": "https://www.reddit.com/r/sidehustle/submit",
        "backlink_type": "In-post link (contextual, high-engagement potential)",
        "domain_authority": 91,
        "strategy": "Don't just drop links — share genuine value. Post the calculator as a free tool with a text post explaining the methodology.",
        "post_ideas": [
            "I built a free Freedom Number calculator that shows exactly how much side income you need to quit — no email required",
            "After 3 years of building side businesses while employed, here's my complete playbook (53 free guides)",
            "The 4% rule for side hustles: How to calculate your escape number [free tool]",
        ],
    },
    {
        "platform": "Hacker News (Show HN)",
        "url": "https://news.ycombinator.com/submit",
        "backlink_type": "Direct link in submission",
        "domain_authority": 93,
        "strategy": "Submit the Freedom Number Calculator as 'Show HN: Freedom Number Calculator — how much side income to quit your job'",
    },

    # ===== TIER 3: Profile backlinks =====
    {
        "platform": "LinkedIn Company Page",
        "url": "https://www.linkedin.com/company/invisible-exit",
        "backlink_type": "Profile website link",
        "domain_authority": 98,
        "strategy": "Create a LinkedIn company page with website link. Post article summaries as LinkedIn Articles.",
    },
    {
        "platform": "GitHub Profile",
        "url": "https://github.com/kindrat86",
        "backlink_type": "Profile website link + repo description",
        "domain_authority": 96,
        "strategy": "Already exists (kindrat86). Add invisibleexit.com to profile website field. Pin a relevant repo.",
    },
    {
        "platform": "YouTube Channel",
        "url": "https://www.youtube.com/@invisibleexit",
        "backlink_type": "Channel about section link",
        "domain_authority": 99,
        "strategy": "Already exists. Add website link in channel header + video descriptions.",
    },
]

# ===== EMBEDDABLE CALCULATOR VIRAL LOOP =====
EMBED_STRATEGY = """
EMBEDDABLE CALCULATOR VIRAL BACKLINK LOOP
=========================================
The Freedom Number Calculator at invisibleexit.com/embed/freedom-calculator
is designed to be embedded on other sites. Each embed = one permanent backlink.

PROMOTION PLAN:
1. Post on r/sidehustle, r/financialindependence, r/personalfinance:
   "I built a free embeddable Freedom Number calculator — just add one line of HTML"
2. Reach out to personal finance bloggers:
   "I noticed your article on financial independence. I built a free embeddable 
   calculator your readers might find useful — no signup, just an iframe."
3. Create a Product Hunt launch for the calculator tool specifically
4. Submit to "free tools for bloggers" directories
5. Post on Indie Hackers with the embed code

EMBED CODE:
<iframe src="https://invisibleexit.com/embed/freedom-calculator"
        width="100%" height="720" frameborder="0"
        style="max-width:520px;border-radius:16px;"
        title="Freedom Number Calculator">
</iframe>
"""

if __name__ == "__main__":
    print("# Content Syndication & Backlink Playbook")
    print(f"## For: invisibleexit.com\n")
    
    for t in SYNDICATION_TARGETS:
        print(f"### {t['platform']}")
        print(f"- **URL**: {t['url']}")
        print(f"- **DA**: {t['domain_authority']}")
        print(f"- **Backlink type**: {t['backlink_type']}")
        print(f"- **Strategy**: {t['strategy']}")
        if 'posts_to_syndicate' in t:
            print(f"- **Posts to syndicate**:")
            for p in t['posts_to_syndicate']:
                print(f"  - {p}")
        if 'post_ideas' in t:
            print(f"- **Post ideas**:")
            for p in t['post_ideas']:
                print(f"  - {p}")
        print()
    
    print(EMBED_STRATEGY)
