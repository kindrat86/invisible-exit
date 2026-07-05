/**
 * Weekend build pages for /weekend-builds/:slug
 * Targets "things to build in a weekend" / "weekend project ideas"
 *
 * Greg Isenberg pSEO Round 5 — temporal/build-speed dimension.
 */

export interface WeekendBuildEntry {
  slug: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  difficulty: string;
  totalHours: string;
  cost: string;
  revenuePotential: string;
  techStack: string[];
  steps: { hour: string; task: string; outcome: string }[];
  monologue: string;
  whatToDoAfter: string;
  faqs: { question: string; answer: string }[];
}

export const weekendBuilds: WeekendBuildEntry[] = [
  {
    slug: "ai-wrapper-saas",
    category: "AI Tools",
    metaTitle: "Build an AI Wrapper SaaS in a Weekend (Full Guide) | Invisible Exit",
    metaDescription: "Step-by-step guide to building and launching a profitable AI wrapper SaaS in one weekend. Tech stack, pricing, and monetization included.",
    h1: "Build an AI Wrapper SaaS in a Weekend",
    intro: "AI wrappers get a bad reputation, but they're the fastest path to your first $1K MRR. The key: solve a specific workflow problem, not build a generic chatbot. Here's exactly what to build, hour by hour.",
    difficulty: "Medium — requires basic coding or AI-assisted coding",
    totalHours: "16-20 hours over a weekend",
    cost: "$20-$50 (domain + hosting + API credits)",
    revenuePotential: "$500-$5K/month with focused niche",
    techStack: ["Next.js or Vite + React", "OpenAI/Anthropic API", "Vercel (free)", "Stripe ($0 to start)", "Supabase (free tier)"],
    steps: [
      { hour: "Friday 7pm-10pm", task: "Pick a niche problem to solve", outcome: "A specific workflow (e.g., 'real estate listing descriptions from bullet points')" },
      { hour: "Saturday 9am-12pm", task: "Build the core feature with AI", outcome: "A working web app that takes input, calls AI API, returns formatted output" },
      { hour: "Saturday 1pm-5pm", task: "Add authentication + payment", outcome: "Users can sign up, pay $19/month, and use the tool" },
      { hour: "Saturday 6pm-9pm", task: "Design landing page + pricing", outcome: "A compelling landing page that explains the value in 5 seconds" },
      { hour: "Sunday 9am-12pm", task: "Deploy + test end-to-end", outcome: "Live site on custom domain, payment flow works, no crashes" },
      { hour: "Sunday 1pm-5pm", task: "Launch: post on ProductHunt, X, Reddit", outcome: "First 50-100 visitors, first 1-3 paying customers" },
      { hour: "Sunday 6pm-8pm", task: "Set up analytics + feedback", outcome: "Know where users come from and what they want next" },
    ],
    monologue: "Don't overthink the idea. Pick a boring, specific workflow that businesses pay humans to do. Real estate listing descriptions. Cold email personalization. Job description writing. Customer support reply drafts. Each of these is a $5K-$20K/month SaaS if you nail the niche. The AI is the same for all of them — the workflow and prompt engineering is the differentiator.",
    whatToDoAfter: "After the weekend, you'll have a live product with a few customers. The next 30 days: talk to every user, fix bugs, add the #1 requested feature, and write SEO content around your niche. Don't build more features — build distribution.",
    faqs: [
      { question: "Aren't AI wrappers just a race to the bottom?", answer: "Generic ones yes. But niche-specific workflow tools are defensible because: (1) the workflow design is the moat, not the AI call, (2) switching costs increase once users integrate it into their process, (3) you can add proprietary data over time. The race to the bottom is for 'ChatGPT for X' — the winners are 'specific workflow automated with AI.'" },
      { question: "How much does the OpenAI/Anthropic API cost?", answer: "For a niche tool: $0.01-$0.10 per user query. At $19/month per user, you need users to make fewer than 190-1900 queries to break even on API costs. Most niche tools see 5-20 queries per user per month — massive margin. Budget $20-$50 in API credits for launch weekend." },
    ],
  },
  {
    slug: "directory-site",
    category: "Content Sites",
    metaTitle: "Build a Profitable Directory Site in a Weekend | Invisible Exit",
    metaDescription: "Step-by-step guide to building a niche directory site that ranks on Google and generates revenue. Tech stack, SEO strategy, and monetization.",
    h1: "Build a Profitable Directory Site in a Weekend",
    intro: "Directory sites are the most underrated side business. They cost $20 to build, rank on Google within weeks, and generate $500-$10K/month through listings, ads, and affiliates. Here's how to build one this weekend.",
    difficulty: "Low — no coding required with modern tools",
    totalHours: "12-16 hours over a weekend",
    cost: "$20-$50 (domain + hosting)",
    revenuePotential: "$500-$10K/month (takes 3-6 months to rank)",
    techStack: ["Next.js + Tailwind (or Softr/no-code)", "Airtable or Supabase (database)", "Vercel (free hosting)", "Stripe (for paid listings)"],
    steps: [
      { hour: "Friday 7pm-9pm", task: "Pick a niche with commercial intent", outcome: "E.g., 'AI tools for real estate agents' or 'no-code tools for non-technical founders'" },
      { hour: "Saturday 9am-12pm", task: "Build the site structure + database", outcome: "Homepage, category pages, detail pages, search/filter" },
      { hour: "Saturday 1pm-5pm", task: "Seed with 30-50 listings (manual research)", outcome: "A directory that looks established and useful" },
      { hour: "Saturday 6pm-8pm", task: "Write SEO-optimized category descriptions", outcome: "Each category page targets a specific keyword" },
      { hour: "Sunday 9am-1pm", task: "Set up programmatic SEO pages", outcome: "'Best [tool] for [use case]' pages auto-generated from data" },
      { hour: "Sunday 2pm-5pm", task: "Submit to Google Search Console + build backlinks", outcome: "Site indexed, first backlinks from directories and forums" },
      { hour: "Sunday 6pm-8pm", task: "Set up monetization (paid listings + affiliates)", outcome: "Revenue mechanism live" },
    ],
    monologue: "The directory model is simple but execution matters. The best directories: (1) have a clear niche, (2) provide genuine value beyond just a list, (3) have rich detail pages with reviews/comparisons, (4) rank for '[category] + [use case]' long-tail keywords. Don't build a general directory — build the BEST directory for ONE specific niche.",
    whatToDoAfter: "Directories compound with SEO. The first 3 months are slow — keep adding listings, writing category descriptions, and building backlinks. Month 4-6, Google starts ranking you. Month 6-12, traffic and revenue accelerate. Most successful directory owners spend 2-4 hours/week maintaining and growing after the initial build.",
    faqs: [
      { question: "How do directory sites make money?", answer: "Three ways: (1) Paid listings — charge $29-$299/month for featured placement, (2) Affiliate commissions — earn 20-50% when users sign up for listed tools, (3) Display ads — AdSense or Mediavine at $5-$30 RPM. Most directories use all three. The best earners combine paid listings (recurring revenue) with affiliates (passive income)." },
      { question: "What niches work best for directory sites?", answer: "Niches with commercial intent and many options: SaaS tools by category, AI tools by use case, agencies by location/specialty, courses by topic, communities by interest. The key test: are people Googling 'best [X] for [Y]'? If yes, a directory can rank for those searches and monetize through affiliates and paid listings." },
    ],
  },
  {
    slug: "chrome-extension",
    category: "Browser Tools",
    metaTitle: "Build a Chrome Extension in a Weekend (Complete Guide) | Invisible Exit",
    metaDescription: "Step-by-step guide to building, launching, and monetizing a Chrome extension in one weekend. Manifest V3, Chrome Web Store, and freemium pricing.",
    h1: "Build a Profitable Chrome Extension in a Weekend",
    intro: "Chrome extensions are one of the best weekend builds: they solve specific problems, have built-in distribution (Chrome Web Store), and can generate $500-$5K/month with freemium pricing. Here's the complete weekend plan.",
    difficulty: "Medium — JavaScript basics required",
    totalHours: "14-18 hours over a weekend",
    cost: "$5 (Chrome Web Store developer fee, one-time)",
    revenuePotential: "$500-$5K/month",
    techStack: ["JavaScript/TypeScript", "Chrome Extension Manifest V3", "Vite for build tooling", "Stripe for payments (or extensionpay.com)"],
    steps: [
      { hour: "Friday 7pm-10pm", task: "Identify a specific browser pain point", outcome: "E.g., 'extract data from LinkedIn profiles' or 'auto-fill forms from a template'" },
      { hour: "Saturday 9am-1pm", task: "Build the core functionality", outcome: "Extension that works in your browser, solves the problem" },
      { hour: "Saturday 2pm-6pm", task: "Design popup UI + options page", outcome: "Clean, usable interface that explains the value in 3 seconds" },
      { hour: "Sunday 9am-12pm", task: "Add freemium gating (free + premium)", outcome: "Free tier with usage limit, Stripe-powered upgrade flow" },
      { hour: "Sunday 1pm-4pm", task: "Write Chrome Web Store listing", outcome: "Compelling title, description, screenshots, demo video" },
      { hour: "Sunday 5pm-8pm", task: "Submit to Chrome Web Store + launch", outcome: "Extension live (review takes 1-3 days), launch posts written" },
    ],
    monologue: "The best extensions solve ONE specific pain point really well. Don't build a 'productivity suite' — build a 'meeting notes to CRM sync' tool. Specificity wins in the Chrome Web Store. Also: the store is your acquisition channel. Optimize your listing title and description for search. 'Free [specific function] for [specific platform]' outperforms clever names.",
    whatToDoAfter: "Chrome Web Store review takes 1-3 days. While waiting: write a launch blog post, prepare Product Hunt launch, create demo video. After approval: focus on reviews (ask early users), iterate based on feedback, and build content marketing around your extension's use case.",
    faqs: [
      { question: "Can Chrome extensions make money?", answer: "Yes. Top extensions earn $5K-$50K/month. The model: free tier with usage limits, premium at $5-$15/month. The key is solving a frequent pain point that users encounter daily. B2B extensions (data extraction, sales tools, productivity) earn more than consumer extensions because users pay for time savings." },
      { question: "Do I need to know how to code?", answer: "Basic JavaScript is required, but AI tools (Claude, Cursor) can write most of the extension code for you. The hard part isn't coding — it's identifying the right pain point and designing a clean UX. If you can describe what you want in detail, AI can generate the code." },
    ],
  },
  {
    slug: "newsletter",
    category: "Content",
    metaTitle: "Launch a Newsletter in a Weekend (Complete Guide) | Invisible Exit",
    metaDescription: "Step-by-step guide to launching a niche newsletter in one weekend. Platform selection, content strategy, and first 100 subscribers.",
    h1: "Launch a Newsletter in a Weekend",
    intro: "Newsletters are having a renaissance. They cost $0 to start, compound over time, and can generate $500-$50K/month. The key: pick the right niche and launch fast. Here's how to do it in a weekend.",
    difficulty: "Low — no coding required",
    totalHours: "10-14 hours over a weekend",
    cost: "$0 (Beehiiv and Substack have free tiers)",
    revenuePotential: "$500-$50K/month (takes 6-12 months to build audience)",
    techStack: ["Beehiiv or Substack (free)", "Canva (free, for header design)", "Twitter/LinkedIn (for distribution)"],
    steps: [
      { hour: "Friday 7pm-9pm", task: "Pick a niche you can write about for 100+ issues", outcome: "A specific audience and value proposition" },
      { hour: "Saturday 9am-11am", task: "Set up your newsletter platform", outcome: "Branded newsletter page on Beehiiv/Substack" },
      { hour: "Saturday 12pm-3pm", task: "Write your first 3 issues", outcome: "Issue 1 (welcome + core value), Issue 2 (deep dive), Issue 3 (curation)" },
      { hour: "Saturday 4pm-6pm", task: "Create your lead magnet", outcome: "A free resource (guide, checklist, database) that incentivizes signup" },
      { hour: "Sunday 9am-1pm", task: "Write your launch thread/post", outcome: "A compelling 'why I'm starting this' post for X/LinkedIn" },
      { hour: "Sunday 2pm-6pm", task: "Get first 50-100 subscribers", outcome: "Direct outreach, X/LinkedIn post, share in 5 communities" },
    ],
    monologue: "The newsletter game is about consistency, not brilliance. A mediocre newsletter sent every week for 2 years beats a brilliant one sent whenever you feel inspired. Pick a niche narrow enough that you can be the best in the world at it, but broad enough that 10,000+ people care. Examples: 'AI tools for solo lawyers' beats 'technology news.'",
    whatToDoAfter: "After launch, the work is consistency + growth. Send every week. Grow through: (1) social media presence, (2) cross-promotion with other newsletters, (3) referrals (Beehiiv has built-in referral programs), (4) SEO-optimized archive pages. Monetization starts at 1,000 subscribers (sponsorships) and accelerates at 5,000+.",
    faqs: [
      { question: "How many subscribers do I need to make money?", answer: "Sponsorships start at 1,000 engaged subscribers ($50-$200/sponsorship). At 5,000 subscribers: $300-$1,000/sponsorship. At 10,000+: $500-$3,000/sponsorship. You can also add paid tiers ($5-$20/month) at any size — typical conversion is 2-5% of free subscribers." },
      { question: "Beehiiv vs Substack vs ConvertKit — which is best?", answer: "Beehiiv: best for growth (built-in referral program, recommendation network, ad network). Free up to 2,500 subscribers. Substack: best for writers (built-in audience, paid tiers easy). Free but takes 10% of paid subscriptions. ConvertKit: best for creators with existing products. $29/month but most powerful. Start with Beehiiv for growth, switch to ConvertKit when you have products to sell." },
    ],
  },
  {
    slug: "api-as-a-service",
    category: "Developer Tools",
    metaTitle: "Build an API-as-a-Service in a Weekend | Invisible Exit",
    metaDescription: "Step-by-step guide to building and launching a profitable API in one weekend. Data sources, pricing, and developer marketing.",
    h1: "Build an API-as-a-Service in a Weekend",
    intro: "APIs are the ultimate weekend build for developers: solve one data problem, wrap it in a clean API, and charge per-call or per-month. The best part: developers are your customers, so marketing is through documentation and community. Here's the plan.",
    difficulty: "Medium-High — requires coding and API design skills",
    totalHours: "16-20 hours over a weekend",
    cost: "$20-$50 (domain + serverless hosting + data sourcing)",
    revenuePotential: "$500-$10K/month",
    techStack: ["Node.js or Python (FastAPI)", "Vercel/Cloudflare Workers/Railway", "Stripe for billing", "RapidAPI (alternative marketplace)"],
    steps: [
      { hour: "Friday 7pm-10pm", task: "Identify a data need developers have", outcome: "E.g., 'company logo API' or 'real-time crypto prices by blockchain'" },
      { hour: "Saturday 9am-1pm", task: "Build the data pipeline + API", outcome: "Working API with at least one endpoint, deployed" },
      { hour: "Saturday 2pm-6pm", task: "Add authentication + rate limiting", outcome: "API keys, usage tracking, free tier limits" },
      { hour: "Sunday 9am-1pm", task: "Write excellent documentation", outcome: "Quickstart, full API reference, code examples in 3+ languages" },
      { hour: "Sunday 2pm-5pm", task: "Set up Stripe billing + pricing tiers", outcome: "Free tier, Pro tier ($29/month), Enterprise" },
      { hour: "Sunday 6pm-9pm", task: "Launch on RapidAPI, Product Hunt, dev communities", outcome: "First 10-50 signups" },
    ],
    monologue: "The best APIs solve boring data problems: company logos, IP geolocation, email validation, currency conversion, WHOIS data. Pick a data source that's hard to compile but valuable to developers. The moat isn't the API — it's the data quality, freshness, and reliability. Start with free/cheap data sources, upgrade as revenue grows.",
    whatToDoAfter: "API businesses grow through developer communities. Post on Dev.to, Hacker News, Reddit (r/webdev, r/programming). List on RapidAPI and other API marketplaces. Write tutorials that use your API. The best marketing is a great free tier — developers try free, then upgrade when they hit limits.",
    faqs: [
      { question: "What kind of APIs make the most money?", answer: "Data APIs (company data, financial data, geolocation), utility APIs (email validation, image processing), and integration APIs (connect two services that don't have native integration). The highest earners solve B2B problems where companies will pay $99-$499/month for reliable data access." },
      { question: "How do I get my first API customers?", answer: "Three channels: (1) RapidAPI marketplace (built-in distribution, but takes 20%), (2) Developer communities (HN, Reddit, Dev.to posts showing use cases), (3) Direct outreach to companies that need your data. The best free tier is generous enough that developers build with it, then hit limits and upgrade." },
    ],
  },
  {
    slug: "notion-template",
    category: "Digital Products",
    metaTitle: "Create & Sell Notion Templates in a Weekend | Invisible Exit",
    metaDescription: "Step-by-step guide to creating and selling profitable Notion templates. Design, pricing, and Gumroad setup in one weekend.",
    h1: "Create and Sell Notion Templates in a Weekend",
    intro: "Notion templates are the lowest-effort, highest-margin digital product. No coding, no hosting, no customer support beyond 'how do I duplicate this?' If you have expertise in any system, you can create a template this weekend and sell it for $29-$99 per copy.",
    difficulty: "Very Low — no coding or design skills required",
    totalHours: "8-12 hours over a weekend",
    cost: "$0 (Notion is free, Gumroad is free)",
    revenuePotential: "$200-$5K/month",
    techStack: ["Notion (free)", "Gumroad (free, takes a cut of sales)", "Canva (free, for mockups)"],
    steps: [
      { hour: "Friday 7pm-9pm", task: "Pick a template based on your expertise", outcome: "E.g., 'content calendar for solopreneurs' or 'OKR tracker for startups'" },
      { hour: "Saturday 9am-1pm", task: "Build the template in Notion", outcome: "A polished, functional template with example data" },
      { hour: "Saturday 2pm-5pm", task: "Create marketing assets", outcome: "Mockup images, demo video, GIF walkthrough" },
      { hour: "Sunday 9am-12pm", task: "Set up Gumroad product page", outcome: "Compelling description, pricing, preview images" },
      { hour: "Sunday 1pm-4pm", task: "Write launch content", outcome: "Twitter thread, LinkedIn post, Product Hunt submission" },
      { hour: "Sunday 5pm-7pm", task: "Share in 5+ communities", outcome: "First 10-30 sales" },
    ],
    monologue: "The best Notion templates solve a specific workflow for a specific audience. Don't make a 'life dashboard' — make a 'client onboarding system for freelance designers.' Specificity sells because the buyer immediately recognizes it's for them. Price at $29-$99: too cheap and it feels low-value, too expensive and people will try to recreate it themselves.",
    whatToDoAfter: "After launch, create a template bundle (3-5 templates at a discount), start an email list, and create more templates. The top Notion template creators have 10-20 templates generating $3K-$15K/month total. Each template compounds: the more you have, the more cross-promotion works.",
    faqs: [
      { question: "Can you really make money selling Notion templates?", answer: "Yes. Top creators like Thomas Frank, Easlo, and others earn $5K-$50K/month. Even mid-level creators with 5-10 good templates earn $1K-$5K/month. The key is niching down and building an audience. A template without distribution makes $0; a template with 5K Twitter followers makes $2K+." },
      { question: "What should I price my Notion template?", answer: "$29-$49 for single-purpose templates (habit tracker, meeting notes). $49-$99 for comprehensive systems (CRM, project management, content calendar). $99-$199 for bundles. The sweet spot is $49 — high enough to signal value, low enough for impulse purchase. Offer a 'pay what you want' minimum for first-week launch buzz." },
    ],
  },
  {
    slug: "job-board",
    category: "Marketplaces",
    metaTitle: "Build a Niche Job Board in a Weekend | Invisible Exit",
    metaDescription: "Step-by-step guide to building a profitable niche job board in one weekend. Tech stack, SEO strategy, and monetization through paid listings.",
    h1: "Build a Niche Job Board in a Weekend",
    intro: "Niche job boards are the perfect weekend project: they solve a real problem, generate revenue from day one (companies pay to post), and compound with SEO. Here's how to build one this weekend.",
    difficulty: "Low-Medium — no-code options available",
    totalHours: "12-16 hours over a weekend",
    cost: "$20-$100 (domain + hosting/platform)",
    revenuePotential: "$500-$10K/month",
    techStack: ["Next.js or no-code (Softr, Bubble)", "Airtable or Supabase", "Stripe for paid postings", "Vercel (free)"],
    steps: [
      { hour: "Friday 7pm-9pm", task: "Pick a niche with active hiring", outcome: "E.g., 'remote jobs for nurses' or 'jobs at AI startups'" },
      { hour: "Saturday 9am-1pm", task: "Build the job board (list + detail pages)", outcome: "A functional site where jobs can be browsed and posted" },
      { hour: "Saturday 2pm-5pm", task: "Seed with 20-30 real job listings (scrape/manually add)", outcome: "Board looks active and useful" },
      { hour: "Sunday 9am-1pm", task: "Set up paid posting + pricing", outcome: "$99-$299 per listing, Stripe checkout" },
      { hour: "Sunday 2pm-5pm", task: "SEO: write niche career guides + submit to Google", outcome: "Programmatic pages targeting '[niche] jobs in [city]'" },
      { hour: "Sunday 6pm-8pm", task: "Launch: post in niche communities", outcome: "First visitors and potentially first paid listing" },
    ],
    monologue: "The best job boards target niches that general boards (LinkedIn, Indeed) serve poorly. 'AI safety researcher jobs.' 'Vue.js developer jobs.' 'Remote dietitian jobs.' The more specific, the better — you can rank on Google for '[niche] jobs' within months. Revenue comes from companies paying $99-$299 to reach a targeted audience. One listing per week = $5K-$15K/year.",
    whatToDoAfter: "Job boards need two-sided growth: jobs and candidates. Focus on jobs first (without listings, no one visits). Reach out to companies in your niche directly. Use SEO to attract candidates. The compounding loop: more jobs → more candidates → more companies want to post → more jobs. Most boards take 3-6 months to hit traction.",
    faqs: [
      { question: "How do niche job boards make money?", answer: "Three ways: (1) Paid listings: $99-$299 per job post (primary), (2) Featured listings: $50-$100 to pin a job at the top, (3) Resume access: charge candidates for premium features or employers for resume database access. The best boards also add value through curated newsletters, salary data, and career resources." },
      { question: "What niches work best for job boards?", answer: "Niches where: (1) companies struggle to find candidates on general boards, (2) candidates are passionate about their niche, (3) there's enough volume (50+ new jobs/month). Examples: climate tech jobs, AI/ML jobs, remote healthcare, specific programming languages, nonprofit tech. Avoid oversaturated niches (general 'remote jobs' or 'tech jobs')." },
    ],
  },
];
