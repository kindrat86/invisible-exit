#!/usr/bin/env python3
"""Submit invisibleexit.com to free AI/SaaS directories for backlinks.
Generates unique descriptions per directory to avoid duplicate content penalties.
"""

SUBMISSIONS = [
    # TIER 1: Highest authority AI directories (do these first)
    {
        "name": "There's An AI For That",
        "url": "https://theresanaiforthat.com/submit/",
        "category": "Business & Finance",
        "description": "Invisible Exit is an AI-powered platform with 5 tools that help employed professionals build anonymous micro-SaaS businesses without quitting their jobs. Calculate your freedom number, validate side-business ideas in 48 hours, run stealth compliance audits, automate launch sequences, and build a faceless brand — all without revealing your identity to your employer.",
    },
    {
        "name": "Futurepedia",
        "url": "https://www.futurepedia.io/submit-tool",
        "category": "Business",
        "description": "Invisible Exit helps corporate employees build profitable side businesses anonymously. Five AI tools cover everything: freedom number calculator, micro-SaaS idea validator, stealth compliance audit, launch automation, and faceless brand builder. Built for employed professionals who want recurring revenue without risking their day job.",
    },
    {
        "name": "Future Tools",
        "url": "https://www.futuretools.io/submit-a-tool",
        "category": "Business & Productivity",
        "description": "Build a $4,000/month side business without quitting your job. Invisible Exit provides AI-powered tools for anonymous micro-SaaS creation: calculate your escape number, validate ideas, stay legally compliant, automate launches, and grow a faceless audience — all while keeping your identity hidden from your employer.",
    },
    {
        "name": "Toolify.ai",
        "url": "https://www.toolify.ai/submit/",
        "category": "Business",
        "description": "Invisible Exit is a membership platform that helps employed professionals build anonymous recurring-revenue businesses. Five AI-powered tools cover financial planning, idea validation, legal compliance, launch automation, and anonymous brand building. From $0.97/month.",
    },
    {
        "name": "TopAI.tools",
        "url": "https://topai.tools/submit",
        "category": "Business & Entrepreneurship",
        "description": "Five AI tools for building an anonymous micro-SaaS side business while employed. Invisible Exit includes a freedom number dashboard, 48-hour idea validator, stealth operations compliance hub, one-click launch automation, and faceless content generator for YouTube and Reddit.",
    },
    # TIER 2: AI tool directories
    {
        "name": "AI Tool Hunt",
        "url": "https://www.aitoolhunt.com/submit",
        "category": "Business",
        "description": "Invisible Exit: AI toolkit for building anonymous micro-SaaS businesses while employed. Freedom calculator, idea validator, compliance audit, launch automation, and brand builder — 5 tools to escape the 9-to-5 without your employer knowing.",
    },
    {
        "name": "AI Tools Directory",
        "url": "https://aitoolsdirectory.com/submit",
        "category": "Business & Finance",
        "description": "The faceless side-business system for employed professionals. Invisible Exit provides AI tools to calculate your freedom number, validate micro-SaaS ideas, stay legally compliant, automate product launches, and build anonymous audience channels.",
    },
    {
        "name": "Insidr.ai",
        "url": "https://www.insidr.ai/submit-tool/",
        "category": "Business",
        "description": "Invisible Exit helps corporate managers build side income anonymously using AI. Five integrated tools: FYM Dashboard (MRR tracking), Idea Pipeline (500+ scored ideas), Stealth Ops Hub (legal compliance), Launch Control (go-live automation), Brand Manager (faceless content).",
    },
    {
        "name": "Easy With AI",
        "url": "https://easywithai.com/submit/",
        "category": "Business & Entrepreneurship",
        "description": "Build a micro-SaaS side business without your employer knowing. Invisible Exit provides AI tools for freedom number calculation, idea validation, stealth compliance, launch automation, and anonymous brand building. Starting at $0.97/month.",
    },
    {
        "name": "AI Valley",
        "url": "https://aivalley.ai/submit/",
        "category": "Business Tools",
        "description": "Invisible Exit: 5 AI-powered tools to build an anonymous side business while employed. Features include freedom number calculator, micro-SaaS idea validator, legal compliance audit, automated launch system, and faceless brand builder for Reddit and YouTube.",
    },
    {
        "name": "AI Scout",
        "url": "https://aiscout.net/submit-a-tool/",
        "category": "Business",
        "description": "The invisible side-business platform. Invisible Exit gives employed professionals 5 AI tools to plan, validate, build, and grow anonymous micro-SaaS revenue without quitting their job or revealing their identity. Founding member price: $0.97/month.",
    },
    {
        "name": "AI Top Tools",
        "url": "https://aitoptools.com/submit/",
        "category": "Business Software",
        "description": "Invisible Exit equips corporate employees with AI-powered tools to build profitable side businesses anonymously. From financial freedom calculation to automated product launches, the platform handles everything needed to generate recurring revenue while staying employed.",
    },
    {
        "name": "AI Tools Club",
        "url": "https://aitoolsclub.com/submit-tool/",
        "category": "Business",
        "description": "Invisible Exit is a membership platform for building anonymous micro-SaaS businesses. Five AI tools: freedom calculator, idea pipeline, stealth ops hub, launch control, and brand manager. Built for employed professionals seeking side income.",
    },
    {
        "name": "AI Tools Arena",
        "url": "https://aitoolsarena.com/submit/",
        "category": "Business Tools",
        "description": "Build anonymous recurring revenue while employed. Invisible Exit's 5 AI tools cover financial planning, idea validation, compliance, launch automation, and content creation for the employed founder who needs to stay invisible.",
    },
    {
        "name": "AItools.fyi",
        "url": "https://aitools.fyi/submit",
        "category": "Business",
        "description": "Invisible Exit turns employed professionals into anonymous micro-SaaS founders. Calculate your freedom number, validate ideas in 48 hours, stay compliant, automate launches, and build a brand without showing your face. From $0.97/month.",
    },
    # TIER 3: Product launch / SaaS directories
    {
        "name": "BetaList",
        "url": "https://betalist.com/submit",
        "category": "SaaS / Business",
        "description": "Invisible Exit is a faceless side-business system for employed professionals. Five AI-powered tools help corporate managers build anonymous micro-SaaS recurring revenue without quitting their jobs, writing code, or revealing their identity.",
    },
    {
        "name": "Launching Next",
        "url": "https://www.launchingnext.com/submit/",
        "category": "SaaS",
        "description": "Invisible Exit: AI toolkit for building an anonymous side business while employed. Includes freedom calculator, idea validator, compliance checker, launch automation, and faceless content creator. $0.97/month founding member price.",
    },
    {
        "name": "Startup Stash",
        "url": "https://startupstash.com/submit/",
        "category": "Business Tools",
        "description": "Invisible Exit provides AI tools for employed professionals to build anonymous micro-SaaS businesses. Freedom number calculator, 500+ validated ideas, stealth compliance, automated launches, and faceless brand building — all in one platform.",
    },
    {
        "name": "MicroLaunch",
        "url": "https://microlaunch.net/submit",
        "category": "Micro-SaaS",
        "description": "Invisible Exit is a micro-SaaS builder for employed professionals. Five AI tools handle the entire anonymous side-business journey: calculate your escape number, validate ideas, stay compliant, automate launches, and grow without showing your face.",
    },
    {
        "name": "Fazier",
        "url": "https://fazier.com/launch/submit",
        "category": "SaaS",
        "description": "Build a $4,000/month side business without quitting. Invisible Exit provides 5 AI-powered tools for anonymous micro-SaaS creation, from financial planning to content generation. Designed for employed professionals who need to stay invisible.",
    },
    {
        "name": "Uneed",
        "url": "https://www.uneed.best/submit",
        "category": "SaaS / Productivity",
        "description": "Invisible Exit: The faceless side-business platform. 5 AI tools for employed professionals to build anonymous micro-SaaS revenue. Freedom calculator, idea validator, ops hub, launch control, and brand manager. From $0.97/month.",
    },
    # TIER 4: Developer / indie communities
    {
        "name": "DevHunt",
        "url": "https://devhunt.org/submit",
        "category": "Developer Tools / SaaS",
        "description": "Invisible Exit is a platform of 5 AI tools that help developers and tech professionals build anonymous micro-SaaS side businesses while employed. Includes MRR tracking, idea validation, legal compliance checks, and automated launch workflows.",
    },
    {
        "name": "Peerlist",
        "url": "https://peerlist.io/scout",
        "category": "Productivity / Business",
        "description": "Invisible Exit: AI-powered side-business toolkit for employed builders. Calculate your freedom number, validate micro-SaaS ideas, run compliance audits, automate launches, and build a faceless brand without quitting your job.",
    },
    {
        "name": "Indie Hackers",
        "url": "https://www.indiehackers.com/products/new",
        "category": "Micro-SaaS",
        "description": "Invisible Exit is the faceless side-business system I built to help employed professionals generate recurring revenue anonymously. 5 AI tools — freedom calculator, idea pipeline, stealth ops, launch control, brand manager — from $0.97/mo. Built for corporate escapees who can't afford to get caught.",
    },
    # TIER 5: Startup databases
    {
        "name": "Crunchbase",
        "url": "https://www.crunchbase.com/add-new",
        "category": "SaaS / Business Software",
        "description": "Invisible Exit provides AI-powered tools for employed professionals to build anonymous micro-SaaS businesses without quitting their jobs. The platform includes financial planning, idea validation, compliance management, launch automation, and content creation tools.",
    },
    {
        "name": "F6S",
        "url": "https://www.f6s.com/startups/add",
        "category": "SaaS / AI",
        "description": "Invisible Exit: AI toolkit for building anonymous recurring-revenue businesses while employed. 5 integrated tools covering financial planning, market validation, legal compliance, go-to-market automation, and anonymous brand building.",
    },
]

SITE = {
    "name": "Invisible Exit",
    "tagline": "Build a $4,000/Month Side Business Without Quitting",
    "url": "https://invisibleexit.com",
    "logo": "https://invisibleexit.com/og-image.png",
    "pricing": "Freemium (from $0.97/month)",
    "twitter": "https://x.com/invisibleexit",
}

if __name__ == "__main__":
    print(f"# Directory Submission List for {SITE['name']}")
    print(f"Site: {SITE['url']}")
    print(f"Total directories: {len(SUBMISSIONS)}")
    print()
    
    for i, d in enumerate(SUBMISSIONS, 1):
        print(f"## {i}. {d['name']}")
        print(f"   Submit: {d['url']}")
        print(f"   Category: {d['category']}")
        print(f"   Description: {d['description']}")
        print(f"   Website: {SITE['url']}")
        print(f"   Twitter: {SITE['twitter']}")
        print()
    
    print("---")
    print("## Assets to have ready")
    print(f"- Logo: {SITE['logo']}")
    print("- Screenshots: Dashboard view, Freedom Calculator, Idea Pipeline")
    print("- Demo video: 60-second platform walkthrough (if available)")
    print("- UTM: ?utm_source=DIRNAME&utm_medium=directory&utm_campaign=backlinks2026")
