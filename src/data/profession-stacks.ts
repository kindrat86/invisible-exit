/**
 * Recommended tool stacks by profession for /stack/:profession pages.
 * Combines existing best-tools data with industry context.
 */

export interface StackItem {
  category: string;
  tool: string;
  why: string;
  cost: string;
}

export interface ProfessionStack {
  slug: string;
  profession: string;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  totalMonthlyCost: string;
  replaces: string;
  stack: StackItem[];
  weeklyTimeCommitment: string;
  faqs: { question: string; answer: string }[];
}

export const professionStacks: ProfessionStack[] = [
  {
    slug: "for-accountants",
    profession: "Accountants",
    icon: "📊",
    metaTitle: "The Complete Tool Stack for Accountants Building Micro-SaaS (2026)",
    metaDescription: "The exact tools accountants need to build a profitable micro-SaaS side business. AI coding, payments, analytics, and automation — $89/month total.",
    h1: "The Accountant's Micro-SaaS Tool Stack",
    intro: "Accountants already understand compliance, billing cycles, and financial workflows. This is the exact tool stack that lets you turn that domain expertise into a profitable micro-SaaS — without writing code full-time or quitting your job.",
    totalMonthlyCost: "$89/month",
    replaces: "$340K+ in team salaries",
    stack: [
      { category: "AI / Coding", tool: "Claude Pro", why: "Best for financial logic, compliance text, and formula generation. Understands accounting terminology.", cost: "$20/month" },
      { category: "AI / Coding", tool: "Cursor Pro", why: "AI-powered IDE for building your SaaS without a developer. Writes and refactors code.", cost: "$20/month" },
      { category: "Payments", tool: "Stripe", why: "Subscriptions, invoicing, and tax handling. Accountants already know Stripe from client work.", cost: "2.9% + 30¢/transaction" },
      { category: "Database", tool: "Supabase", why: "Postgres database with auth and API. Free tier covers your first 50 customers.", cost: "Free → $25/month" },
      { category: "Analytics", tool: "PostHog", why: "Track user behavior, funnel metrics, and churn. Self-hostable for privacy.", cost: "Free" },
      { category: "Hosting", tool: "Vercel", why: "Deploy your SaaS in one click. Free tier handles moderate traffic.", cost: "Free → $20/month" },
      { category: "Email", tool: "Resend", why: "Transaction emails for receipts, alerts, and onboarding sequences.", cost: "Free → $20/month" },
      { category: "Automation", tool: "Zapier", why: "Connect QuickBooks, Xero, and your SaaS without writing integration code.", cost: "Free → $20/month" },
    ],
    weeklyTimeCommitment: "8-10 hours/week (2hr building, 4hr validating, 2hr distribution, 1hr admin)",
    faqs: [
      { question: "Do I need to know how to code?", answer: "No. Claude Pro and Cursor Pro handle 80% of coding. You need to understand the logic and requirements — which accountants already do." },
      { question: "Can I use QuickBooks or Xero APIs?", answer: "Yes, but check your firm's policies first. Build for a different client segment than your employer serves. The Stripe and Plaid APIs are safer starting points." },
    ],
  },
  {
    slug: "for-software-engineers",
    profession: "Software Engineers",
    icon: "💻",
    metaTitle: "The Complete Tool Stack for Software Engineers Building Micro-SaaS (2026)",
    metaDescription: "The exact tools software engineers need to build a profitable micro-SaaS side business. IDE, hosting, payments, analytics — $70/month total.",
    h1: "The Software Engineer's Micro-SaaS Tool Stack",
    intro: "Software engineers have the technical skills — the challenge is scope, speed, and staying invisible. This stack maximizes what you can build in limited hours while keeping your side business separate from your employer.",
    totalMonthlyCost: "$70/month",
    replaces: "Zero — you ARE the team",
    stack: [
      { category: "AI / Coding", tool: "Cursor Pro", why: "The best AI coding experience. Multi-file refactoring, inline completions, and codebase awareness.", cost: "$20/month" },
      { category: "AI / Coding", tool: "Claude Pro", why: "For architecture decisions, code review, and writing copy/docs you'd rather not write yourself.", cost: "$20/month" },
      { category: "Payments", tool: "Stripe", why: "Developer-first API, excellent docs, handles subscriptions and tax.", cost: "2.9% + 30¢/transaction" },
      { category: "Database", tool: "Supabase", why: "Open-source Firebase alternative. Postgres, auth, real-time, storage. Generous free tier.", cost: "Free → $25/month" },
      { category: "Analytics", tool: "PostHog", why: "Open-source product analytics. Event tracking, feature flags, session replay.", cost: "Free" },
      { category: "Hosting", tool: "Vercel", why: "Edge network, automatic HTTPS, preview deployments. Perfect for Next.js/React.", cost: "Free → $20/month" },
      { category: "Monitoring", tool: "Sentry", why: "Error tracking and performance monitoring. Free tier covers early stage.", cost: "Free → $26/month" },
      { category: "Domain", tool: "Cloudflare", why: "DNS, CDN, DDoS protection. $10/year domain registration.", cost: "$10/year" },
    ],
    weeklyTimeCommitment: "6-8 hours/week (you build faster, so spend more time on distribution)",
    faqs: [
      { question: "How do I avoid IP claims from my employer?", answer: "Never use company equipment, code, or time. Build in a different domain than your employer. Use a personal laptop and separate accounts for everything." },
      { question: "Should I open source my side project?", answer: "Only if it drives distribution. For most micro-SaaS, closed-source is better — you're selling a service, not software. Open source周边工具 to build authority." },
    ],
  },
  {
    slug: "for-product-managers",
    profession: "Product Managers",
    icon: "📦",
    metaTitle: "The Complete Tool Stack for Product Managers Building Micro-SaaS (2026)",
    metaDescription: "The exact tools PMs need to build a profitable micro-SaaS side business. No-code, AI, and automation tools — $95/month total.",
    h1: "The Product Manager's Micro-SaaS Tool Stack",
    intro: "Product managers know what to build — the gap is execution speed. This stack bridges that gap with AI-powered tools that let you ship without a full engineering team. No coding bootcamp required.",
    totalMonthlyCost: "$95/month",
    replaces: "1 full-stack developer + 1 designer ($250K+/year)",
    stack: [
      { category: "AI / Coding", tool: "Cursor Pro", why: "Build functional MVPs from specs. The closest thing to having a developer who executes your PRDs.", cost: "$20/month" },
      { category: "AI / Coding", tool: "Claude Pro", why: "Write specs, user stories, and copy. Generate competitive analysis and feature prioritization.", cost: "$20/month" },
      { category: "No-Code", tool: "Bubble or Framer", why: "Rapid prototyping and landing pages without touching code. Ship a testable MVP in a weekend.", cost: "$25-$32/month" },
      { category: "Design", tool: "Figma", why: "Design mockups and wireframes. You already know this from your day job.", cost: "Free → $12/month" },
      { category: "Payments", tool: "Stripe", why: "Payment links for pre-sales. Set up subscriptions in minutes.", cost: "2.9% + 30¢/transaction" },
      { category: "Analytics", tool: "PostHog", why: "Funnel tracking and user behavior. PMs love data — this is your dashboard.", cost: "Free" },
      { category: "Hosting", tool: "Vercel", why: "Deploy from GitHub in one click. Zero DevOps required.", cost: "Free → $20/month" },
      { category: "Research", tool: "Perplexity Pro", why: "Market research with cited sources. Validate demand before building.", cost: "$20/month" },
    ],
    weeklyTimeCommitment: "8-10 hours/week (PMs need extra time on distribution since code is delegated to AI)",
    faqs: [
      { question: "Can I use product management skills from my day job?", answer: "Absolutely — spec writing, prioritization, and user research transfer directly. The risk is building too much before validating. Ship smaller." },
      { question: "Should I hire a developer instead of using AI?", answer: "Start with AI tools. If your SaaS reaches $2K+ MRR, then hire a contractor for complex features. AI handles 80% of early-stage code." },
    ],
  },
  {
    slug: "for-marketers",
    profession: "Marketing Managers",
    icon: "📈",
    metaTitle: "The Complete Tool Stack for Marketing Managers Building Micro-SaaS (2026)",
    metaDescription: "The exact tools marketers need to build a profitable micro-SaaS side business. Content, automation, and analytics — $85/month total.",
    h1: "The Marketing Manager's Micro-SaaS Tool Stack",
    intro: "Marketers have the distribution skills most founders lack. This stack gives you the building tools to match — so you can create a product AND get it in front of customers, which is the harder half.",
    totalMonthlyCost: "$85/month",
    replaces: "1 developer + 1 content team ($200K+/year)",
    stack: [
      { category: "AI / Coding", tool: "Cursor Pro", why: "Build landing pages, simple SaaS MVPs, and automation scripts without a developer.", cost: "$20/month" },
      { category: "AI / Coding", tool: "Claude Pro", why: "Write copy, email sequences, and content at scale. Your marketing brain + AI output = fast execution.", cost: "$20/month" },
      { category: "Email", tool: "Beehiiv or ConvertKit", why: "Newsletter-first distribution. Build an audience before you have a product.", cost: "Free → $25/month" },
      { category: "Design", tool: "Canva Pro", why: "Social media graphics, ad creative, and brand assets without a designer.", cost: "$13/month" },
      { category: "Payments", tool: "Stripe", why: "Payment links and subscriptions. Easy checkout for digital products.", cost: "2.9% + 30¢/transaction" },
      { category: "Analytics", tool: "PostHog + Google Analytics", why: "Track every funnel step. You already know GA — add PostHog for product analytics.", cost: "Free" },
      { category: "Automation", tool: "Zapier", why: "Connect your CRM, email, and SaaS without writing integration code.", cost: "Free → $20/month" },
      { category: "Social", tool: "Buffer or Typefully", why: "Schedule and analyze social content across platforms.", cost: "Free → $15/month" },
    ],
    weeklyTimeCommitment: "8-12 hours/week (marketers should over-index on distribution since that's their edge)",
    faqs: [
      { question: "What's the best micro-SaaS for a marketing manager?", answer: "Tools that solve marketing pain points: content repurposing, social scheduling, analytics dashboards. You know the pain because you live it." },
      { question: "Should I build a product or a service first?", answer: "Start with a productized service (done-for-you with a fixed price and scope). Transition to SaaS once you understand the workflow. Revenue from day one." },
    ],
  },
  {
    slug: "for-designers",
    profession: "Designers",
    icon: "🎨",
    metaTitle: "The Complete Tool Stack for Designers Building Micro-SaaS (2026)",
    metaDescription: "The exact tools designers need to build a profitable micro-SaaS side business. Design systems, no-code, and monetization — $80/month total.",
    h1: "The Designer's Micro-SaaS Tool Stack",
    intro: "Designers have the visual edge that most SaaS founders lack. This stack gives you the technical layer to ship beautiful, functional products without learning to code the traditional way.",
    totalMonthlyCost: "$80/month",
    replaces: "1 front-end developer ($120K+/year)",
    stack: [
      { category: "Design", tool: "Figma Pro", why: "Design system, wireframes, and prototypes. You already know this — now monetize it.", cost: "$12/month" },
      { category: "No-Code", tool: "Framer Pro", why: "Design-to-site without code. Ship beautiful landing pages and simple web apps.", cost: "$20/month" },
      { category: "AI / Coding", tool: "Cursor Pro", why: "Turn designs into functional SaaS. The AI handles the code translation from your mockups.", cost: "$20/month" },
      { category: "AI / Coding", tool: "Claude Pro", why: "Write copy, generate component variations, and handle the non-design work.", cost: "$20/month" },
      { category: "Payments", tool: "Gumroad + Stripe", why: "Sell digital products (templates, UI kits) immediately. Add Stripe for SaaS subscriptions.", cost: "10% / 2.9%+30¢" },
      { category: "Hosting", tool: "Vercel", why: "Deploy Framer exports or React apps instantly.", cost: "Free → $20/month" },
      { category: "Assets", tool: "Midjourney", why: "Generate marketing imagery and illustrations for your SaaS.", cost: "$10/month" },
    ],
    weeklyTimeCommitment: "6-8 hours/week (designers ship faster visually, so spend time on distribution)",
    faqs: [
      { question: "Should I sell design assets or build a SaaS?", answer: "Start with digital products (templates, UI kits) for immediate revenue. Use that audience to validate and fund your SaaS. Both paths work." },
      { question: "Can I build a SaaS without coding?", answer: "Yes. Framer + Stripe + Airtable can get you to $1K MRR. Beyond that, Cursor Pro + Claude Pro let you build custom functionality." },
    ],
  },
  {
    slug: "for-consultants",
    profession: "Management Consultants",
    icon: "💼",
    metaTitle: "The Complete Tool Stack for Consultants Building Micro-SaaS (2026)",
    metaDescription: "The exact tools management consultants need to build a profitable micro-SaaS side business. Research, analysis, and automation — $90/month total.",
    h1: "The Management Consultant's Micro-SaaS Tool Stack",
    intro: "Consultants know frameworks, analysis, and client communication. This stack turns those skills into shippable products — from research tools to automated reports to client portals.",
    totalMonthlyCost: "$90/month",
    replaces: "1 developer + 1 research analyst ($200K+/year)",
    stack: [
      { category: "AI / Coding", tool: "Claude Pro", why: "Synthesize research, generate frameworks, and write analysis. Your consulting brain + Claude's speed.", cost: "$20/month" },
      { category: "AI / Coding", tool: "Cursor Pro", why: "Build dashboards, calculators, and data tools. The AI handles the engineering.", cost: "$20/month" },
      { category: "Research", tool: "Perplexity Pro", why: "Real-time research with cited sources. Faster than your firm's research team.", cost: "$20/month" },
      { category: "Data", tool: "Airtable", why: "Structured data management for client projects. Visual database that non-technical users understand.", cost: "Free → $20/month" },
      { category: "Payments", tool: "Stripe", why: "Charge for access to your tools, reports, or dashboards.", cost: "2.9% + 30¢/transaction" },
      { category: "Automation", tool: "Zapier", why: "Automate report generation, data pipelines, and client notifications.", cost: "Free → $20/month" },
      { category: "Hosting", tool: "Vercel", why: "Deploy calculators and dashboards instantly.", cost: "Free → $20/month" },
    ],
    weeklyTimeCommitment: "6-8 hours/week (consultants travel — use flights and hotel evenings)",
    faqs: [
      { question: "Can I build tools for my consulting niche?", answer: "Yes, if you target a different segment than your employer serves. Build for smaller clients who can't afford Big Four rates." },
      { question: "What's the best micro-SaaS for consultants?", answer: "Tools that productize your expertise: automated assessment tools, industry benchmark calculators, or template generators for common deliverables." },
    ],
  },
  {
    slug: "for-lawyers",
    profession: "Lawyers",
    icon: "⚖️",
    metaTitle: "The Complete Tool Stack for Lawyers Building Micro-SaaS (2026)",
    metaDescription: "The exact tools lawyers need to build a profitable micro-SaaS side business. Document automation, compliance, and client tools — $85/month total.",
    h1: "The Lawyer's Micro-SaaS Tool Stack",
    intro: "Lawyers understand regulatory frameworks, contract language, and compliance — highly monetizable expertise. This stack lets you turn legal knowledge into automated tools that non-lawyers will pay for.",
    totalMonthlyCost: "$85/month",
    replaces: "1 developer + 1 paralegal ($180K+/year)",
    stack: [
      { category: "AI / Coding", tool: "Claude Pro", why: "Draft and analyze legal text at scale. Generate contract templates and compliance checklists.", cost: "$20/month" },
      { category: "AI / Coding", tool: "Cursor Pro", why: "Build document automation tools and legal tech SaaS without a developer.", cost: "$20/month" },
      { category: "Database", tool: "Supabase", why: "Store templates, client data, and case information securely.", cost: "Free → $25/month" },
      { category: "Payments", tool: "Stripe", why: "Charge for document generation, legal checkups, or compliance tools.", cost: "2.9% + 30¢/transaction" },
      { category: "Automation", tool: "Zapier", why: "Connect your tools to email, e-signature platforms, and CRM.", cost: "Free → $20/month" },
      { category: "Hosting", tool: "Vercel", why: "Deploy secure web apps with HTTPS by default.", cost: "Free → $20/month" },
      { category: "Research", tool: "Perplexity Pro", why: "Research regulations and case law with cited sources.", cost: "$20/month" },
    ],
    weeklyTimeCommitment: "6-8 hours/week (use billable-hour gaps and weekends)",
    faqs: [
      { question: "Is building legal tech considered unauthorized practice of law?", answer: "No, if you're providing tools and templates, not legal advice. Clearly disclaim that your tools are not a substitute for legal counsel. Consult your state bar's guidelines." },
      { question: "What's the best legal micro-SaaS?", answer: "Tools that automate repetitive legal work for non-lawyers: NDA generators, compliance checklists, contract risk scanners, and deadline calculators." },
    ],
  },
  {
    slug: "for-financial-analysts",
    profession: "Financial Analysts",
    icon: "💰",
    metaTitle: "The Complete Tool Stack for Financial Analysts Building Micro-SaaS (2026)",
    metaDescription: "The exact tools financial analysts need to build a profitable micro-SaaS side business. Data, models, and dashboards — $75/month total.",
    h1: "The Financial Analyst's Micro-SaaS Tool Stack",
    intro: "Financial analysts understand models, data, and forecasting. This stack lets you turn those skills into SaaS tools that small businesses and other analysts will pay for.",
    totalMonthlyCost: "$75/month",
    replaces: "1 developer + 1 data engineer ($220K+/year)",
    stack: [
      { category: "AI / Coding", tool: "Claude Pro", why: "Generate financial models, write analysis, and debug formulas.", cost: "$20/month" },
      { category: "AI / Coding", tool: "Cursor Pro", why: "Build dashboards and calculators without learning full-stack development.", cost: "$20/month" },
      { category: "Data", tool: "Airtable + Google Sheets API", why: "Manage structured data and connect to your SaaS. Analysts already live in spreadsheets.", cost: "Free → $20/month" },
      { category: "Visualization", tool: "Recharts or Chart.js", why: "Interactive charts for your SaaS dashboards.", cost: "Free (open source)" },
      { category: "Payments", tool: "Stripe", why: "Charge for access to your models, dashboards, or data tools.", cost: "2.9% + 30¢/transaction" },
      { category: "Hosting", tool: "Vercel", why: "Deploy your financial tools with instant scaling.", cost: "Free → $20/month" },
      { category: "Data Source", tool: "Alpha Vantage or FRED API", why: "Free financial data APIs for market data, economic indicators.", cost: "Free" },
    ],
    weeklyTimeCommitment: "8-10 hours/week (use evenings after market close)",
    faqs: [
      { question: "Can I use data from my employer?", answer: "Absolutely not. Use public APIs (FRED, Alpha Vantage, Yahoo Finance). Never use proprietary firm data or client information." },
      { question: "What's the best financial micro-SaaS?", answer: "Tools for small businesses: cash flow forecasters, pricing calculators, valuation tools, and benchmarking dashboards. SMBs need financial tools but can't afford a Bloomberg terminal." },
    ],
  },
  {
    slug: "for-nurses",
    profession: "Nurses",
    icon: "🏥",
    metaTitle: "The Complete Tool Stack for Nurses Building Micro-SaaS (2026)",
    metaDescription: "The exact tools nurses need to build a profitable micro-SaaS side business. Health-tech, scheduling, and patient tools — $70/month total.",
    h1: "The Nurse's Micro-SaaS Tool Stack",
    intro: "Nurses understand healthcare workflows, patient communication, and clinical operations. This stack turns that frontline expertise into tools that clinics, patients, and other nurses will pay for.",
    totalMonthlyCost: "$70/month",
    replaces: "1 developer ($120K+/year)",
    stack: [
      { category: "AI / Coding", tool: "Claude Pro", why: "Write health education content, generate care plans, and build patient communication tools.", cost: "$20/month" },
      { category: "AI / Coding", tool: "Cursor Pro", why: "Build scheduling tools, patient trackers, and health calculators.", cost: "$20/month" },
      { category: "No-Code", tool: "Glide or Softr", why: "Build mobile-friendly apps from spreadsheets. Perfect for patient-facing tools.", cost: "Free → $25/month" },
      { category: "Payments", tool: "Stripe", why: "Charge for premium health tools, courses, or templates.", cost: "2.9% + 30¢/transaction" },
      { category: "Database", tool: "Airtable", why: "Manage patient education content, care protocols, and scheduling data.", cost: "Free → $20/month" },
      { category: "Hosting", tool: "Vercel", why: "Deploy HIPAA-conscious web apps (use a BAA for any PHI).", cost: "Free → $20/month" },
    ],
    weeklyTimeCommitment: "6-8 hours/week (use days off — nurses have flexible schedules)",
    faqs: [
      { question: "Do I need to worry about HIPAA?", answer: "Only if you handle Protected Health Information (PHI). Build tools that don't store PHI, or use HIPAA-compliant infrastructure (Supabase with BAA, Azure with BAA)." },
      { question: "What's the best micro-SaaS for nurses?", answer: "Tools that solve clinical workflow pain: shift scheduling, patient education generators, medication interaction checkers, or CEU tracking tools." },
    ],
  },
  {
    slug: "for-teachers",
    profession: "Teachers",
    icon: "📚",
    metaTitle: "The Complete Tool Stack for Teachers Building Micro-SaaS (2026)",
    metaDescription: "The exact tools teachers need to build a profitable micro-SaaS side business. EdTech, content, and monetization — $65/month total.",
    h1: "The Teacher's Micro-SaaS Tool Stack",
    intro: "Teachers understand curriculum design, assessment, and learner psychology. This stack turns those skills into educational tools that students, parents, and other educators will pay for.",
    totalMonthlyCost: "$65/month",
    replaces: "1 developer + content team ($150K+/year)",
    stack: [
      { category: "AI / Coding", tool: "Claude Pro", why: "Generate lesson plans, quiz questions, and educational content at scale.", cost: "$20/month" },
      { category: "AI / Coding", tool: "Cursor Pro", why: "Build quiz tools, flashcard apps, and grading automation.", cost: "$20/month" },
      { category: "No-Code", tool: "Glide", why: "Build educational apps from spreadsheets. No coding required.", cost: "Free → $25/month" },
      { category: "Payments", tool: "Stripe + Gumroad", why: "Sell digital products (worksheets, courses) and SaaS subscriptions.", cost: "2.9% + 30¢/transaction" },
      { category: "Content", tool: "Canva Pro", why: "Create professional worksheets, presentations, and educational graphics.", cost: "$13/month" },
      { category: "Hosting", tool: "Vercel", why: "Deploy educational web apps for free.", cost: "Free → $20/month" },
    ],
    weeklyTimeCommitment: "8-10 hours/week (use evenings, weekends, and summer breaks)",
    faqs: [
      { question: "Can I sell materials I created for my classroom?", answer: "Check your employment contract. Many districts claim IP rights to materials created during employment. Create new, original content outside of school hours and equipment." },
      { question: "What's the best micro-SaaS for teachers?", answer: "Tools for other educators: quiz generators, lesson plan templates, parent communication tools, or student progress trackers. You know the pain points." },
    ],
  },
];

export function getStackBySlug(slug: string): ProfessionStack | undefined {
  return professionStacks.find((s) => s.slug === slug);
}
