/**
 * Side hustle pages for /side-hustles/:slug
 * Targets "best side hustle for [profession]" search intent.
 * Different from /ideas/ which focuses on micro-SaaS specifically.
 *
 * Greg Isenberg pSEO Round 4 — new search-intent dimension.
 */

export interface SideHustleEntry {
  slug: string;
  profession: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  hustleType: string;
  startupCost: string;
  timeToFirstDollar: string;
  weeklyTimeCommitment: string;
  bestHustles: {
    name: string;
    description: string;
    earningPotential: string;
    startupCost: string;
    skillsNeeded: string;
  }[];
  weeklySchedule: { day: string; task: string; hours: string }[];
  tools: string[];
  pros: string[];
  cons: string[];
  faqs: { question: string; answer: string }[];
}

export const sideHustles: SideHustleEntry[] = [
  {
    slug: "for-software-engineers",
    profession: "Software Engineers",
    metaTitle: "Best Side Hustles for Software Engineers (2025) | Invisible Exit",
    metaDescription: "The most profitable side hustles for software engineers — freelance, products, consulting. See startup costs, earning potential, and weekly schedules.",
    h1: "Best Side Hustles for Software Engineers",
    intro: "Software engineers have the highest-earning side hustle potential of any profession. Your coding skills can generate income within days — not months. Here are the best side hustles ranked by earning potential, time investment, and speed to first dollar.",
    hustleType: "Technical / Digital Products",
    startupCost: "$0-$100",
    timeToFirstDollar: "1-7 days",
    weeklyTimeCommitment: "8-15 hours",
    bestHustles: [
      { name: "Freelance API Development", description: "Build APIs, webhooks, and integrations for startups on Upwork or Toptal.", earningPotential: "$80-$200/hour", startupCost: "$0", skillsNeeded: "REST/GraphQL, cloud deployment, authentication" },
      { name: "Micro-SaaS (B2B)", description: "Build a small SaaS tool solving one painful problem for a niche audience.", earningPotential: "$2K-$20K/month", startupCost: "$20-$50/month hosting", skillsNeeded: "Full-stack, payment integration, customer support" },
      { name: "Code Review Consulting", description: "Offer expert code review services to startups lacking senior engineers.", earningPotential: "$100-$300/hour", startupCost: "$0", skillsNeeded: "5+ years experience, security, architecture" },
      { name: "Chrome Extension", description: "Build a productivity extension and monetize with freemium or ads.", earningPotential: "$500-$5K/month", startupCost: "$5 (developer fee)", skillsNeeded: "JavaScript, Chrome APIs, UI design" },
      { name: "Technical Writing", description: "Write tutorials and documentation for dev tool companies.", earningPotential: "$200-$500/article", startupCost: "$0", skillsNeeded: "Clear writing, deep technical knowledge" },
    ],
    weeklySchedule: [
      { day: "Mon-Thu evenings", task: "Client work or product development", hours: "2 hours/night" },
      { day: "Saturday", task: "Marketing, outreach, customer interviews", hours: "4 hours" },
      { day: "Sunday", task: "Planning, code review, content creation", hours: "3 hours" },
    ],
    tools: ["GitHub", "Vercel", "Stripe", "Linear", "Cursor", "Tailwind CSS"],
    pros: ["Highest hourly rates of any profession", "Can start with zero capital", "Skills directly transfer to products", "Remote-friendly from day one", "Strong market demand"],
    cons: ["Burnout risk if overcommitting", "Need to handle non-coding tasks (sales, support)", "Competitive freelance market", "May conflict with employer IP agreements"],
    faqs: [
      { question: "Can software engineers freelance while employed?", answer: "Generally yes, but check your employment contract for IP assignment clauses, non-compete agreements, and moonlighting policies. Avoid using employer equipment or working on competing products during work hours." },
      { question: "What's the fastest side hustle for software engineers?", answer: "Freelance API development or bug fixes on Upwork. You can land your first client within 3-7 days and start earning $80-$150/hour immediately. Micro-SaaS takes longer but builds recurring revenue." },
      { question: "How much can a software engineer make from side hustles?", answer: "Freelancing: $2K-$8K/month part-time. Micro-SaaS: $0 for months, then $2K-$20K/month recurring. Technical writing: $500-$3K/month. The key is choosing based on whether you need cash now or equity later." },
    ],
  },
  {
    slug: "for-marketers",
    profession: "Marketers",
    metaTitle: "Best Side Hustles for Marketers (2025) | Invisible Exit",
    metaDescription: "The most profitable side hustles for marketers — from freelance SEO to newsletters. Startup costs, earning potential, and weekly schedules included.",
    h1: "Best Side Hustles for Marketers",
    intro: "Marketers have an unfair advantage: you know how to get attention, and attention is monetizable. Unlike engineers who build products, you can generate revenue from day one by selling your expertise. Here are the highest-ROI side hustles for marketing professionals.",
    hustleType: "Creative / Consulting",
    startupCost: "$0-$200",
    timeToFirstDollar: "3-14 days",
    weeklyTimeCommitment: "10-15 hours",
    bestHustles: [
      { name: "Fractional CMO Services", description: "Offer part-time marketing strategy to startups that can't afford a full-time CMO.", earningPotential: "$3K-$8K/month per client", startupCost: "$0", skillsNeeded: "Strategy, team management, analytics, 7+ years experience" },
      { name: "SEO Consulting", description: "Help businesses rank higher with technical SEO audits and content strategy.", earningPotential: "$1K-$5K/month per client", startupCost: "$100 (tools)", skillsNeeded: "Keyword research, technical SEO, content optimization" },
      { name: "Email Newsletter", description: "Build a niche newsletter and monetize with sponsorships.", earningPotential: "$500-$10K/month", startupCost: "$0-$30/month", skillsNeeded: "Writing, audience building, sponsorship sales" },
      { name: "Content Agency", description: "Productize content creation — blog posts, social, email — for a specific niche.", earningPotential: "$5K-$30K/month", startupCost: "$200", skillsNeeded: "Content strategy, hiring, project management" },
      { name: "Paid Ads Management", description: "Manage Google/Meta ads for small businesses on retainer.", earningPotential: "$1K-$3K/month per client", startupCost: "$0", skillsNeeded: "PPC, conversion optimization, analytics" },
    ],
    weeklySchedule: [
      { day: "Tue/Thu evenings", task: "Client work (content, audits, strategy)", hours: "3 hours/night" },
      { day: "Saturday", task: "Business development, outreach, proposals", hours: "4 hours" },
      { day: "Sunday", task: "Personal brand content, newsletter", hours: "2 hours" },
    ],
    tools: ["Ahrefs", "Notion", "ConvertKit/Beehiiv", "Figma", "Google Analytics", "Buffer"],
    pros: ["Revenue from week one", "Low startup costs", "Build a personal brand as a byproduct", "Skills compound over time", "Can transition to agency model"],
    cons: ["Trading time for money initially", "Client acquisition is the hard part", "Inconsistent income early on", "May compete with employer if not careful"],
    faqs: [
      { question: "Can marketers do side hustles without competing with their employer?", answer: "Yes — target different industries, company sizes, or service types. If you do B2B SaaS marketing at work, target local businesses or e-commerce brands on the side. Document everything in writing." },
      { question: "What's the best side hustle for a marketer who wants passive income?", answer: "An email newsletter in a niche you understand. It takes 6-12 months to build an audience, but once you have 5,000+ engaged subscribers, sponsorships generate $500-$5K/month with minimal ongoing work." },
    ],
  },
  {
    slug: "for-designers",
    profession: "Designers",
    metaTitle: "Best Side Hustles for Designers (2025) | Invisible Exit",
    metaDescription: "The most profitable side hustles for designers — from productized design to UI kits. Startup costs, earning potential, and weekly schedules included.",
    h1: "Best Side Hustles for Designers",
    intro: "Designers can monetize their craft faster than almost any creative professional. Unlike many professions, your portfolio IS your marketing — every project you ship becomes a sales asset. Here are the most profitable side hustles ranked by earning potential.",
    hustleType: "Creative / Digital Products",
    startupCost: "$0-$300",
    timeToFirstDollar: "3-10 days",
    weeklyTimeCommitment: "8-15 hours",
    bestHustles: [
      { name: "Productized UI Design", description: "Offer unlimited design requests for a monthly fee (Designjoy model).", earningPotential: "$4K-$15K/month", startupCost: "$0", skillsNeeded: "UI/UX, Figma, fast iteration, client communication" },
      { name: "Digital Products (UI Kits)", description: "Sell Figma UI kits, icon packs, or templates on Gumroad.", earningPotential: "$500-$5K/month", startupCost: "$0", skillsNeeded: "Design systems, marketing, product packaging" },
      { name: "Design Consulting", description: "Offer design audits and UX reviews for startups.", earningPotential: "$150-$400/hour", startupCost: "$0", skillsNeeded: "UX research, heuristic evaluation, presentation" },
      { name: "Webflow Development", description: "Build marketing sites for startups using Webflow.", earningPotential: "$3K-$10K/project", startupCost: "$0", skillsNeeded: "Webflow, responsive design, basic animations" },
      { name: "Design Education", description: "Create design courses, YouTube tutorials, or mentoring sessions.", earningPotential: "$1K-$8K/month", startupCost: "$100", skillsNeeded: "Teaching, video production, patience" },
    ],
    weeklySchedule: [
      { day: "Mon/Wed/Fri evenings", task: "Client design work or product creation", hours: "2-3 hours/night" },
      { day: "Saturday", task: "Marketing, portfolio updates, Dribbble/Behance", hours: "4 hours" },
      { day: "Sunday", task: "Learning, experimentation, personal projects", hours: "2 hours" },
    ],
    tools: ["Figma", "Webflow", "Framer", "Gumroad", "Notion", "Loom"],
    pros: ["Portfolio builds itself", "High hourly rates for senior designers", "Digital products scale infinitely", "Visual skills are in high demand", "Can work 100% remotely"],
    cons: ["Subjective feedback can be draining", "Unlimited revisions model is risky", "Marketplace competition for digital products", "Need strong client boundaries"],
    faqs: [
      { question: "Can designers sell work created at their job?", answer: "No — work created for an employer belongs to them. However, you can create new, original work in your own time. Avoid using employer assets, fonts, or stock subscriptions for side projects." },
      { question: "What's the best passive income for designers?", answer: "Digital products — UI kits, icon packs, Notion templates, or Figma plugins. These take 20-40 hours to create but can earn $500-$5K/month for years with minimal maintenance. Gumroad and Creative Market are the best platforms." },
    ],
  },
  {
    slug: "for-product-managers",
    profession: "Product Managers",
    metaTitle: "Best Side Hustles for Product Managers (2025) | Invisible Exit",
    metaDescription: "The most profitable side hustles for product managers — consulting, advisory, and micro-SaaS. See startup costs and earning potential.",
    h1: "Best Side Hustles for Product Managers",
    intro: "Product managers are uniquely positioned for side hustles because you understand the full picture — user research, roadmap prioritization, and go-to-market. You can monetize this systems-thinking in ways most professionals can't.",
    hustleType: "Strategy / Advisory",
    startupCost: "$0",
    timeToFirstDollar: "7-21 days",
    weeklyTimeCommitment: "6-12 hours",
    bestHustles: [
      { name: "Startup Advisory", description: "Advise 2-3 early-stage startups on product strategy for equity.", earningPotential: "Equity (potential $10K-$500K on exit)", startupCost: "$0", skillsNeeded: "Product strategy, user research, prioritization" },
      { name: "Product Consulting", description: "Help companies with roadmapping, discovery, and prioritization.", earningPotential: "$150-$300/hour", startupCost: "$0", skillsNeeded: "Frameworks, stakeholder management, analytics" },
      { name: "Productized Workshops", description: "Run paid workshops on product discovery, roadmapping, or metrics.", earningPotential: "$2K-$8K/workshop", startupCost: "$0", skillsNeeded: "Public speaking, curriculum design, facilitation" },
      { name: "No-Code Micro-SaaS", description: "Build tools with Bubble, Zapier, or Airtable for niche workflows.", earningPotential: "$500-$5K/month", startupCost: "$30-$100/month", skillsNeeded: "No-code tools, customer interviews, validation" },
      { name: "Product Management Newsletter", description: "Share PM insights, templates, and frameworks to a subscriber base.", earningPotential: "$500-$5K/month (sponsorships)", startupCost: "$0", skillsNeeded: "Writing, audience building, consistency" },
    ],
    weeklySchedule: [
      { day: "Tuesday/Thursday evenings", task: "Advisory calls, consulting work", hours: "2 hours/night" },
      { day: "Saturday morning", task: "Newsletter, content, thought leadership", hours: "3 hours" },
      { day: "Sunday evening", task: "Planning, prep for advisory sessions", hours: "1 hour" },
    ],
    tools: ["Notion", "Linear", "Figma", "Loom", "Calendly", "Beehiiv"],
    pros: ["High-value skills command premium rates", "Advisory roles build your network exponentially", "Can work asynchronously", "Skills transfer directly to startups", "Equity upside from advisory roles"],
    cons: ["Slower to first dollar than freelancing", "Advisory equity may never pay out", "Conflict of interest risk with employer", "Need strong personal brand to attract clients"],
    faqs: [
      { question: "Can product managers advise startups while employed?", answer: "Yes, with disclosure. Most employment agreements allow advisory roles if they don't compete. Check for non-compete clauses and get written approval. Many PMs advise 1-3 startups — it's expected at senior levels." },
      { question: "How do PMs find advisory opportunities?", answer: "Join communities like On Deck, Indie Hackers, or local startup accelerators. Post your expertise on LinkedIn. Most advisory roles come through warm introductions. Expect 0.25%-1% equity for 4-8 hours/month commitment." },
    ],
  },
  {
    slug: "for-accountants",
    profession: "Accountants",
    metaTitle: "Best Side Hustles for Accountants (2025) | Invisible Exit",
    metaDescription: "The most profitable side hustles for accountants — bookkeeping, tax prep, and financial consulting. See startup costs and earning potential.",
    h1: "Best Side Hustles for Accountants",
    intro: "Accountants have one of the most reliable side hustle opportunities. Every business needs financial help, and your credentials create instant trust. The key is choosing between seasonal work (tax prep) and recurring revenue (bookkeeping subscriptions).",
    hustleType: "Financial Services",
    startupCost: "$100-$500",
    timeToFirstDollar: "7-14 days",
    weeklyTimeCommitment: "8-20 hours",
    bestHustles: [
      { name: "Virtual Bookkeeping", description: "Manage books for 5-15 small businesses on monthly retainer.", earningPotential: "$300-$800/month per client", startupCost: "$200 (QuickBooks ProAdvisor)", skillsNeeded: "QuickBooks, categorization, reconciliation" },
      { name: "Tax Preparation (Seasonal)", description: "Prepare individual and small business tax returns Jan-April.", earningPotential: "$5K-$30K per tax season", startupCost: "$500 (PTIN, software)", skillsNeeded: "Tax code knowledge, attention to detail" },
      { name: "Fractional CFO Services", description: "Offer part-time CFO services to startups (revenue $500K-$5M).", earningPotential: "$3K-$8K/month per client", startupCost: "$0", skillsNeeded: "Financial modeling, fundraising, board reporting" },
      { name: "Financial Consulting", description: "Help businesses with cash flow, pricing, and profitability.", earningPotential: "$150-$300/hour", startupCost: "$0", skillsNeeded: "Financial analysis, business strategy, communication" },
      { name: "Accounting Software Setup", description: "Set up QuickBooks/Xero for new businesses.", earningPotential: "$500-$2K per setup", startupCost: "$0", skillsNeeded: "QuickBooks, Xero, chart of accounts design" },
    ],
    weeklySchedule: [
      { day: "Weekday evenings", task: "Bookkeeping, client reconciliations", hours: "1-2 hours/night" },
      { day: "Saturday", task: "Client meetings, financial reviews", hours: "4-6 hours" },
      { day: "Sunday", task: "Admin, continuing education, prep", hours: "2 hours" },
    ],
    tools: ["QuickBooks Online", "Xero", "Excel/Google Sheets", "Expensify", "TaxAct", "Calendly"],
    pros: ["Recurring monthly revenue from bookkeeping", "Seasonal tax work is highly profitable", "Credentials create instant credibility", "Every business is a potential client", "Scalable to an agency model"],
    cons: ["Liability requires proper insurance", "Seasonal tax work is grueling (Jan-April)", "Conflict of interest if working at a firm", "Need PTIN for tax preparation", "Continuing education requirements"],
    faqs: [
      { question: "Can accountants take on private clients while working at a firm?", answer: "It depends on your firm's policies. Most firms prohibit serving the same client type. Check your employment agreement, get written approval, and never use firm resources or client lists. Many accountants do bookkeeping for different industries than their firm serves." },
      { question: "Do I need a CPA to do bookkeeping?", answer: "No — bookkeeping doesn't require a CPA license. You need a PTIN only for tax preparation. For bookkeeping, QuickBooks ProAdvisor certification ($200) is sufficient and highly marketable." },
    ],
  },
  {
    slug: "for-writers",
    profession: "Writers",
    metaTitle: "Best Side Hustles for Writers (2025) | Invisible Exit",
    metaDescription: "The most profitable side hustles for writers — from ghostwriting to newsletters to copywriting. See startup costs and earning potential.",
    h1: "Best Side Hustles for Writers",
    intro: "Writers have more side hustle options than ever. The demand for quality content has exploded, and AI has actually increased the value of distinctive human voices. Here are the most profitable ways to monetize your writing skills.",
    hustleType: "Content / Creative",
    startupCost: "$0-$100",
    timeToFirstDollar: "3-14 days",
    weeklyTimeCommitment: "10-20 hours",
    bestHustles: [
      { name: "Ghostwriting (LinkedIn/X)", description: "Ghostwrite for founders and executives on LinkedIn and X.", earningPotential: "$3K-$15K/month", startupCost: "$0", skillsNeeded: "Personal branding, social media, research" },
      { name: "SEO Content Writing", description: "Write high-ranking blog posts for B2B SaaS companies.", earningPotential: "$200-$500/article", startupCost: "$0", skillsNeeded: "SEO, keyword research, content strategy" },
      { name: "Email Newsletter", description: "Build a paid or sponsored newsletter in a niche.", earningPotential: "$500-$10K/month", startupCost: "$0-$30/month", skillsNeeded: "Niche expertise, consistency, audience building" },
      { name: "Copywriting (Sales Pages)", description: "Write conversion-focused sales pages and email sequences.", earningPotential: "$1K-$5K per project", startupCost: "$0", skillsNeeded: "Persuasion, psychology, A/B testing" },
      { name: "Self-Published Books", description: "Write and publish niche non-fiction on Amazon KDP.", earningPotential: "$500-$5K/month", startupCost: "$100 (editing, cover)", skillsNeeded: "Writing, research, Amazon marketing" },
    ],
    weeklySchedule: [
      { day: "Mon-Fri mornings (before work)", task: "Ghostwriting, client content", hours: "2 hours/day" },
      { day: "Saturday", task: "Newsletter, personal brand, outreach", hours: "4 hours" },
      { day: "Sunday", task: "Long-form writing, book projects", hours: "4 hours" },
    ],
    tools: ["Google Docs", "Notion", "Grammarly", "Hemingway Editor", "Beehiiv", "Scrivener"],
    pros: ["Zero startup costs", "Can work from anywhere", "AI makes research 10x faster", "Builds a personal brand as a byproduct", "Multiple revenue streams possible"],
    cons: ["Competitive market — need a niche", "Ghostwriting means no public credit", "Income can be feast-or-famine", "Sitting for long periods", "Client revisions can be endless"],
    faqs: [
      { question: "Can writers make a full-time income from side hustles?", answer: "Yes. Ghostwriting for 3-4 founders at $2K-$4K/month each generates $6K-$16K/month. SEO content writing for B2B SaaS at $300/article, 10 articles/month = $3K/month. The key is specializing in a high-value niche (B2B SaaS, fintech, AI)." },
      { question: "Is ghostwriting ethical?", answer: "Yes, when done transparently. Most founders publicly acknowledge they work with writers. The value you provide is their ideas and expertise — you're the vessel. It's a centuries-old practice (Hamilton ghostwrote for Washington)." },
    ],
  },
];
