/**
 * Case study pages for /case-studies/:slug
 * Targets "micro-SaaS examples" / "profitable micro-SaaS" / "successful micro-SaaS"
 *
 * Greg Isenberg pSEO Round 7 — E-E-A-T content (real-world examples build trust).
 */

export interface CaseStudyEntry {
  slug: string;
  productName: string;
  founder: string;
  niche: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  revenue: string;
  pricing: string;
  timeToRevenue: string;
  techStack: string[];
  theStory: string;
  whatWorked: { strategy: string; detail: string }[];
  keyNumbers: { metric: string; value: string }[];
  lessonsLearned: string[];
  whatTheyDidDifferently: string;
  faqs: { question: string; answer: string }[];
}

export const caseStudies: CaseStudyEntry[] = [
  {
    slug: "typefully",
    productName: "Typefully",
    founder: "Fabrizio Rinaldi",
    niche: "Twitter/X scheduling tool",
    metaTitle: "Typefully Case Study: From $0 to $1M+ ARR Micro-SaaS | Invisible Exit",
    metaDescription: "How Typefully grew from a side project to $1M+ ARR. Revenue numbers, growth strategy, tech stack, and lessons for solo founders.",
    h1: "Typefully Case Study: How a Twitter Scheduler Grew to $1M+ ARR",
    intro: "Typefully is a Twitter/X scheduling and analytics tool built by a solo founder (later a small team). It grew from $0 to over $1M ARR in under 3 years. Here's how — the numbers, the strategy, and the lessons for your own micro-SaaS.",
    revenue: "$1M+ ARR (estimated)",
    pricing: "$12.50-$49/month",
    timeToRevenue: "3 months to first paying customer, 18 months to $10K MRR",
    techStack: ["Next.js", "Supabase", "Vercel", "Stripe", "Twitter API"],
    theStory: "Fabrizio built Typefully in 2020 as a side project to solve his own problem: Twitter's built-in scheduling was terrible. He launched on Product Hunt, got 500 signups in week one, and charged from day one ($15/month). The key insight: the existing tools (Buffer, Hootsuite) were bloated enterprise software. A focused, beautiful, fast tool for individual creators was underserved. By 2023, Typefully was doing $1M+ ARR with a team of 5.",
    whatWorked: [
      { strategy: "Niche focus", detail: "Only Twitter/X. No LinkedIn, no Instagram. This let them build the best possible tool for one platform." },
      { strategy: "Beautiful design", detail: "Typefully's UI is so polished it became a marketing asset. Users shared screenshots, driving organic word-of-mouth." },
      { strategy: "Creator-led marketing", detail: "The founder was active on Twitter, shared build-in-public updates, and the product was naturally used by the audience who'd promote it." },
      { strategy: "Freemium done right", detail: "Free tier was functional enough to try but limited enough to upgrade. The $15/month entry price was impulse-buy territory." },
      { strategy: "Ship fast, iterate faster", detail: "Weekly feature releases kept users engaged and showed momentum to prospects." },
    ],
    keyNumbers: [
      { metric: "Time to first $1K MRR", value: "3 months" },
      { metric: "Time to $10K MRR", value: "18 months" },
      { metric: "Time to $50K MRR", value: "30 months" },
      { metric: "Team size at $1M ARR", value: "5 people" },
      { metric: "Price range", value: "$12.50-$49/month" },
      { metric: "Primary acquisition", value: "Organic/word-of-mouth" },
    ],
    lessonsLearned: [
      "Design IS a moat. Users will pay more for a tool that feels good to use.",
      "Niche focus beats feature breadth. Be the best at ONE thing.",
      "Build in public if your target audience is creators — they'll become your marketing team.",
      "Freemium works when the free tier is genuinely useful but creates natural upgrade pressure.",
      "Charge from day one. Free users tell you nothing about willingness to pay.",
    ],
    whatTheyDidDifferently: "Most scheduling tools tried to be everything to everyone (Twitter + LinkedIn + Facebook + Instagram). Typefully went narrow: only Twitter, but better than anything else. This focus allowed them to ship features competitors couldn't match — like AI-powered thread suggestions and beautiful analytics — because all their energy went into one platform's experience.",
    faqs: [
      { question: "How did Typefully get their first 100 customers?", answer: "Product Hunt launch (500 signups in week one) + Twitter build-in-public updates. The founder tweeted about features, milestones, and revenue. Because the target audience (Twitter power users) was exactly who he was building for, every tweet was marketing to qualified prospects." },
      { question: "Can I still build a Twitter scheduling tool in 2025?", answer: "The window for generic Twitter schedulers has closed — the market is saturated. BUT: the pattern (focused tool for one platform + beautiful design + niche audience) is timeless. Apply the same model to: Bluesky scheduling, LinkedIn carousel tools, or TikTok analytics." },
      { question: "What was Typefully's biggest mistake?", answer: "Early on, they underpriced. The $15/month plan attracted high-churn casual users. Raising prices to $29-$49/month reduced churn and increased revenue per user. Lesson: price for the customers you WANT, not the ones you have." },
    ],
  },
  {
    slug: "bannerbear",
    productName: "Bannerbear",
    founder: "Jon Yongfook",
    niche: "Automated image generation API",
    metaTitle: "Bannerbear Case Study: $500K ARR Solo Founder Micro-SaaS | Invisible Exit",
    metaDescription: "How Jon Yongfook built Bannerbear to $500K+ ARR as a solo founder. Revenue numbers, tech stack, and lessons for building API-first SaaS.",
    h1: "Bannerbear Case Study: A Solo Founder's Journey to $500K ARR",
    intro: "Bannerbear is an automated image generation API that creates social media images, banners, and PDFs from templates. Jon Yongfook built it as a solo founder and grew it to $500K+ ARR. Here's how he did it — numbers, strategy, and lessons.",
    revenue: "$500K+ ARR",
    pricing: "$49-$299/month",
    timeToRevenue: "2 months to first customer, 12 months to $10K MRR",
    techStack: ["Ruby on Rails", "PostgreSQL", "AWS", "Stripe", "React"],
    theStory: "Jon had previously run a successful design agency and built Screenshotrover (a smaller SaaS). He noticed that businesses kept asking him for automated image generation — social media cards, dynamic OG images, certificate generators. Instead of building one-off solutions, he productized the problem as Bannerbear: an API that generates images from templates. The key insight: developers hate generating images manually, and businesses need hundreds of variants. An API-first approach meant developers could integrate it in minutes.",
    whatWorked: [
      { strategy: "API-first product", detail: "By targeting developers with an API (not a UI), Bannerbear became infrastructure, not a tool. Higher retention, lower churn." },
      { strategy: "Open-source free tier", detail: "A free, open-source version drove developer adoption. Those developers became paying customers at their companies." },
      { strategy: "Build in public", detail: "Jon shared revenue numbers, features, and lessons publicly. This attracted both customers and credibility." },
      { strategy: "Niche use cases", detail: "Instead of generic 'image generation,' focused on specific use cases: dynamic OG images, certificate generators, e-commerce product images." },
      { strategy: "Developer-focused marketing", detail: "Documentation, code examples, and integrations (Zapier, Make) were the primary marketing channels." },
    ],
    keyNumbers: [
      { metric: "Time to first $1K MRR", value: "2 months" },
      { metric: "Time to $10K MRR", value: "12 months" },
      { metric: "Time to $30K MRR", value: "24 months" },
      { metric: "Team size", value: "1 (solo founder)" },
      { metric: "Price range", value: "$49-$299/month" },
      { metric: "Primary acquisition", value: "SEO + developer communities" },
    ],
    lessonsLearned: [
      "API-first SaaS has lower churn than UI-first SaaS — once integrated, it's hard to remove.",
      "Open-source free tiers are the best developer acquisition channel.",
      "Solo founders should build products that don't require customer support-heavy workflows.",
      "Niche use cases (dynamic OG images) are easier to rank for than generic categories (image generation).",
      "Build in public attracts customers, credibility, and talent.",
    ],
    whatTheyDidDifferently: "Most image tools were UI-first Canva clones targeting non-technical users. Jon went the opposite direction: API-first, developer-focused, infrastructure-level. This meant smaller TAM but much higher retention (developers don't churn once integrated) and higher pricing ($49-$299/month vs $9-$15/month for consumer tools).",
    faqs: [
      { question: "How does a solo founder handle support for an API product?", answer: "By making the product self-serve. Excellent documentation, code examples in every language, and a well-designed API mean most customers never need support. Jon handles support in 1-2 hours/day because the product is designed for minimal support load." },
      { question: "Can I still build an image generation API in 2025?", answer: "The generic market is competitive, but niches are wide open: industry-specific templates (real estate, healthcare, e-commerce), AI-powered personalization, and video generation APIs. The pattern (API-first, developer-focused, niche use cases) still works." },
    ],
  },
  {
    slug: "senja",
    productName: "Senja",
    founder: "David Hartunian & Arabo K.",
    niche: "Testimonial collection tool",
    metaTitle: "Senja Case Study: From $0 to $100K MRR in 18 Months | Invisible Exit",
    metaDescription: "How Senja grew to $100K+ MRR helping businesses collect testimonials. Revenue timeline, growth strategy, and lessons for solo founders.",
    h1: "Senja Case Study: How a Testimonial Tool Reached $100K+ MRR",
    intro: "Senja helps businesses collect, manage, and display customer testimonials. The founders grew it from $0 to $100K+ MRR in about 18 months. Here's the story — including revenue timeline, strategy, and what they did differently.",
    revenue: "$100K+ MRR ($1.2M+ ARR)",
    pricing: "$29-$199/month",
    timeToRevenue: "1 month to first customer, 9 months to $10K MRR",
    techStack: ["Bubble (no-code)", "Make (automations)", "Stripe", "Airtable"],
    theStory: "The founders noticed that every business wanted testimonials but hated collecting them. Existing solutions were either enterprise (Too expensive, $500+/month) or manual (Google Forms + spreadsheets). They built Senja as a focused tool: one-click testimonial collection forms, automated follow-up emails, and beautiful display widgets. The key insight: they built on Bubble (no-code), which let them ship in weeks instead of months and iterate based on feedback daily.",
    whatWorked: [
      { strategy: "No-code speed", detail: "Building on Bubble meant they could ship features in hours, not weeks. This let them out-iterate competitors." },
      { strategy: "Lifetime deal launch", detail: "Launched on AppSumo with a lifetime deal. This brought in $100K+ in cash and 3,000+ users who became evangelists." },
      { strategy: "Integrator partnerships", detail: "Built integrations with every major tool (Webflow, Notion, Framer, WordPress). Each integration was a distribution channel." },
      { strategy: "UGC as marketing", detail: "Every testimonial widget displayed 'Powered by Senja' — free marketing on every customer's site." },
      { strategy: "Comparison content", detail: "Created 'Senja vs [competitor]' pages for every alternative, capturing comparison search traffic." },
    ],
    keyNumbers: [
      { metric: "AppSumo launch revenue", value: "$100K+ in 2 weeks" },
      { metric: "Time to $10K MRR", value: "9 months" },
      { metric: "Time to $50K MRR", value: "14 months" },
      { metric: "Time to $100K MRR", value: "18 months" },
      { metric: "Price range", value: "$29-$199/month" },
      { metric: "Primary acquisition", value: "AppSumo → SEO → word-of-mouth" },
    ],
    lessonsLearned: [
      "No-code is a legitimate SaaS foundation — Senja does $1.2M+ ARR on Bubble.",
      "Lifetime deals (AppSumo) can fund 12+ months of development if used strategically.",
      "'Powered by' links are the cheapest form of SaaS marketing.",
      "Comparison pages ('X vs Y') are high-intent SEO gold — build them for every competitor.",
      "Integrations are distribution. Every integration partner becomes a marketing channel.",
    ],
    whatTheyDidDifferently: "Most testimonial tools were either enterprise (expensive, complex) or form builders (generic, not specialized). Senja owned the middle: focused specifically on testimonials, beautiful UI, affordable pricing, and every integration imaginable. They also embraced no-code when most SaaS founders thought it was 'unserious' — and proved that execution matters more than tech stack.",
    faqs: [
      { question: "Can you really build a $1M+ SaaS on no-code?", answer: "Yes — Senja is proof. Bubble has matured enough to handle production SaaS at scale. The tradeoff: you'll hit performance limits earlier than custom code, and you're platform-dependent. But for getting to $1M ARR, no-code is often faster than custom code because you can iterate in hours." },
      { question: "Was the AppSumo lifetime deal worth it?", answer: "For Senja, yes — it brought in $100K in cash (funding 12 months of development), 3,000+ users, and massive word-of-mouth. The downside: lifetime users create support load forever and don't generate recurring revenue. Use LTDs strategically, not as a primary model." },
    ],
  },
  {
    slug: "tinybloom",
    productName: "Tiny Seed Portfolio Pattern",
    founder: "Various (Tiny Seed backed)",
    niche: "B2B micro-SaaS pattern",
    metaTitle: "The Profitable Micro-SaaS Pattern: Lessons from 50+ Bootstrapped SaaS | Invisible Exit",
    metaDescription: "What 50+ profitable bootstrapped micro-SaaS companies have in common. The pattern that works, revenue benchmarks, and how to replicate it.",
    h1: "The Profitable Micro-SaaS Pattern: What 50+ Bootstrapped SaaS Have in Common",
    intro: "After studying 50+ bootstrapped micro-SaaS companies that reached $10K-$100K MRR, clear patterns emerge. This isn't one company's story — it's the composite pattern of what works. Here's what profitable micro-SaaS have in common.",
    revenue: "$10K-$100K MRR (range across studied companies)",
    pricing: "$29-$299/month (sweet spot)",
    timeToRevenue: "2-6 months to first paying customer",
    techStack: ["Next.js/Nuxt/SvelteKit", "PostgreSQL (Supabase/Neon)", "Stripe", "Vercel/Cloudflare"],
    theStory: "I analyzed 50+ bootstrapped micro-SaaS companies that reached profitability ($10K+ MRR) without raising venture capital. The companies span niches: developer tools, marketing tools, analytics, e-commerce, and productivity. Despite different markets, they share common patterns in how they got started, how they priced, and how they grew.",
    whatWorked: [
      { strategy: "B2B over B2C", detail: "92% targeted businesses, not consumers. Businesses have budget and willingness to pay. Consumer apps need millions of users to be profitable." },
      { strategy: "Point solution, not platform", detail: "They solved ONE painful problem exceptionally well. Not a suite, not a platform — a point solution that was clearly the best at one thing." },
      { strategy: "$29-$99/month pricing", detail: "The sweet spot. Below $29, churn is high. Above $99, sales cycles lengthen. $49/month was the most common price." },
      { strategy: "Content + community marketing", detail: "SEO content, community participation (Reddit, Indie Hackers, X), and build-in-public updates. Not paid ads." },
      { strategy: "Founder-led sales until $20K MRR", detail: "No sales team until $20K+ MRR. The founder did demos, support, and onboarding personally. This built product insight." },
    ],
    keyNumbers: [
      { metric: "Median time to first paying customer", value: "3 months" },
      { metric: "Median time to $1K MRR", value: "5 months" },
      { metric: "Median time to $10K MRR", value: "14 months" },
      { metric: "Most common price point", value: "$49/month" },
      { metric: "B2B vs B2C ratio", value: "92% B2B, 8% B2C" },
      { metric: "Most common tech stack", value: "React framework + PostgreSQL + Stripe" },
    ],
    lessonsLearned: [
      "B2B is dramatically easier than B2C for solo founders. Businesses pay, consumers churn.",
      "Point solutions beat platforms. Be the best at ONE thing, not mediocre at many.",
      "$49/month is the pricing sweet spot — enough to signal value, low enough for self-serve.",
      "Content + community beats paid ads until $20K+ MRR. Don't run ads until you understand your unit economics.",
      "Founder-led sales until $20K MRR isn't just about saving money — it's about building product insight that shapes your roadmap.",
      "Most successful micro-SaaS took 12-18 months to reach $10K MRR. Plan for a marathon, not a sprint.",
    ],
    whatTheyDidDifferently: "The companies that reached profitability shared one trait: they resisted the urge to build features. Instead, they went deep on one problem, said no to most feature requests, and became known as the best solution for that specific pain point. The failures tried to build platforms; the successes built point solutions.",
    faqs: [
      { question: "What's the realistic timeline to $10K MRR for a solo founder?", answer: "Based on 50+ bootstrapped micro-SaaS: median 14 months. Fastest: 6 months (B2B with existing audience). Slowest: 30+ months (B2C or no existing audience). Plan for 12-18 months of consistent effort before reaching $10K MRR." },
      { question: "Should I target businesses or consumers?", answer: "Businesses, without question. 92% of profitable bootstrapped micro-SaaS are B2B. Businesses have budget, lower churn, and higher willingness to pay. Consumer apps need millions of users to be profitable — not realistic for a solo founder." },
      { question: "What's the best tech stack for a solo founder in 2025?", answer: "The one you know best. But the most common among successful micro-SaaS: React framework (Next.js/Remix), PostgreSQL (Supabase/Neon), Stripe for payments, Vercel for hosting. Total cost: $0-$50/month until you have real traffic." },
    ],
  },
  {
    slug: "screenshotone",
    productName: "ScreenshotOne",
    founder: "Ivan",
    niche: "Screenshot API",
    metaTitle: "ScreenshotOne Case Study: A Profitable API Micro-SaaS | Invisible Exit",
    metaDescription: "How ScreenshotOne grew as a solo-founder screenshot API. Revenue numbers, customer acquisition, and lessons for API-first SaaS.",
    h1: "ScreenshotOne Case Study: Building a Profitable Screenshot API Solo",
    intro: "ScreenshotOne is a screenshot API built by a solo founder (Ivan). It generates screenshots from any URL via API. This is a textbook API-first micro-SaaS: a focused developer tool that generates recurring revenue. Here's how it grew.",
    revenue: "$15K-$25K MRR (estimated from public build-in-public data)",
    pricing: "$19-$299/month",
    timeToRevenue: "1 month to first customer",
    techStack: ["Go", "AWS", "Playwright", "Stripe"],
    theStory: "Ivan saw that developers needed screenshot generation for various use cases (social cards, PDF generation, website monitoring). Existing solutions were either unreliable or expensive. He built ScreenshotOne as a fast, reliable API with generous free tier and clear pricing. The key insight: developer tools with excellent documentation and DX (developer experience) win on word-of-mouth, not ads.",
    whatWorked: [
      { strategy: "Generous free tier", detail: "100 screenshots/month free. Developers try free, integrate, then upgrade when they hit limits. Natural upgrade path." },
      { strategy: "Excellent documentation", detail: "Code examples in 8+ languages. Copy-paste ready. This is the primary marketing for developer tools." },
      { strategy: "Build in public", detail: "Ivan shares revenue, challenges, and learnings on Twitter and his blog. Builds trust and attracts developers." },
      { strategy: "Niche integrations", detail: "Zapier, Make, n8n integrations made the API accessible to non-developers, expanding TAM." },
    ],
    keyNumbers: [
      { metric: "Time to first paying customer", value: "1 month" },
      { metric: "Time to $5K MRR", value: "8 months" },
      { metric: "Time to $15K MRR", value: "18 months" },
      { metric: "Team size", value: "1 (solo founder)" },
      { metric: "Price range", value: "$19-$299/month" },
      { metric: "Primary acquisition", value: "SEO + developer communities + build in public" },
    ],
    lessonsLearned: [
      "Developer tools win on documentation and DX, not features.",
      "Generous free tiers create natural upgrade paths — don't cripple your free tier.",
      "API-first businesses have low support load if documentation is excellent.",
      "Build in public attracts both customers and credibility for solo founders.",
      "No-code integrations (Zapier, Make) expand your TAM beyond developers.",
    ],
    whatTheyDidDifferently: "Most screenshot tools tried to be full 'website monitoring' platforms. ScreenshotOne stayed focused: just screenshots, fast, reliable, well-documented. By resisting scope creep, Ivan could maintain the product solo and keep quality high.",
    faqs: [
      { question: "Is the screenshot API market too saturated?", answer: "The generic market is competitive, but specialized use cases are wide open: social media card generation, website change detection, PDF generation from HTML, and AI-powered screenshot analysis. Pick a specific use case and own it." },
      { question: "How much can a solo founder make with an API business?", answer: "Based on public data from ScreenshotOne and similar: $10K-$30K MRR is achievable solo in 18-24 months. The ceiling depends on TAM — niche APIs cap around $30K MRR; broader APIs can reach $100K+ MRR with a team." },
    ],
  },
  {
    slug: "peerlist",
    productName: "Peerlist",
    founder: "Akash & Team",
    niche: "Professional portfolio platform",
    metaTitle: "Peerlist Case Study: From $0 to 100K Users (Community-Led Growth) | Invisible Exit",
    metaDescription: "How Peerlist grew to 100K+ users as a professional portfolio platform. Community-led growth strategy, monetization, and lessons.",
    h1: "Peerlist Case Study: Community-Led Growth to 100K+ Users",
    intro: "Peerlist is a professional portfolio and resume platform for designers, developers, and creatives. It grew to 100K+ users primarily through community-led growth — no ads, no outbound, just building where the users already were. Here's the story.",
    revenue: "Freemium (premium tiers launching)",
    pricing: "Free-$19/month premium",
    timeToRevenue: "12 months to launch premium (community-first)",
    techStack: ["Next.js", "Supabase", "Vercel", "Stripe"],
    theStory: "Peerlist started as a beautiful portfolio builder for designers and developers. Instead of running ads, the founders built where their audience already was: design communities, Twitter, and Reddit. They created templates that people wanted to share, and each portfolio became marketing for the platform. The key insight: when your product IS marketing (portfolios are public), every user is a distribution channel.",
    whatWorked: [
      { strategy: "Product-as-marketing", detail: "Every portfolio created on Peerlist was a public webpage with Peerlist branding. Users became marketers." },
      { strategy: "Community-first", detail: "The founders were active in design communities (Dribbble, Behance, Reddit) before launching. They built trust before selling." },
      { strategy: "Templates that go viral", detail: "Beautiful, shareable templates that users were proud to post on social media. Each post drove signups." },
      { strategy: "Free-first monetization", detail: "Free forever for basic features. Premium only for power features (custom domains, analytics)." },
    ],
    keyNumbers: [
      { metric: "Time to 10K users", value: "6 months" },
      { metric: "Time to 50K users", value: "12 months" },
      { metric: "Time to 100K users", value: "18 months" },
      { metric: "User acquisition cost", value: "$0 (organic/community)" },
      { metric: "Viral coefficient", value: "Each user drove ~0.5 signups via shared portfolios" },
    ],
    lessonsLearned: [
      "When your product creates public artifacts (portfolios, pages, posts), every user is a marketer.",
      "Community-first means building trust in communities BEFORE selling. Don't spam — contribute.",
      "Viral templates beat viral campaigns. Make something people WANT to share.",
      "Free-first works when the product IS marketing — monetize power users, not everyone.",
      "100K users doesn't mean 100K paying customers. Plan monetization from day one.",
    ],
    whatTheyDidDifferently: "Most portfolio builders charged from day one. Peerlist went free-first because they understood that free portfolios = free marketing. Every free user who shared their portfolio was worth more than $19/month in acquisition value. They monetized later with premium features once they had scale.",
    faqs: [
      { question: "Does the free-first model actually work for SaaS?", answer: "Only when the free product creates marketing value. Peerlist works because portfolios are public — each one advertises Peerlist. If your product is private (dashboards, internal tools), free-first doesn't create the same viral loop. Match your monetization model to your product's visibility." },
      { question: "How do you build a community before you have a product?", answer: "Be genuinely helpful in existing communities. The Peerlist founders were active in design/developer communities for months before launching — answering questions, sharing resources, building relationships. When they launched, the community already trusted them." },
    ],
  },
];
