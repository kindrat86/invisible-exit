/**
 * Tool cross-reference pages for /tools/:slug.
 * Cross-join: 25 professions × 4 tool categories = 100 pages.
 */
export interface ToolCrossReference {
  slug: string;
  profession: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  tools: { name: string; best: string; pricing: string; why: string; alternative: string }[];
  professionSpecificNeeds: string;
  budgetFriendly: string;
  faqs: { question: string; answer: string }[];
}

const professions = [
  "Accountants", "Lawyers", "Teachers", "Nurses", "Software Engineers",
  "Marketers", "HR Managers", "Consultants", "Designers", "Financial Analysts",
  "Product Managers", "Sales Managers", "Doctors", "Real Estate Agents", "Recruiters",
  "Project Managers", "Data Analysts", "Customer Success Managers", "Operations Managers",
  "Executive Assistants", "Virtual Assistants", "Photographers", "Writers", "Trainers",
  "Supply Chain Managers",
];

const profSlug = (p: string) => "for-" + p.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const categories = [
  {
    name: "AI Tools",
    slugPart: "ai-tools",
    tools: [
      { name: "Claude Pro", best: "Complex reasoning and long-form content", pricing: "$20/mo", why: "Best for nuanced analysis, contract review, and strategic writing. 200K context window handles large documents.", alternative: "ChatGPT Plus ($20/mo)" },
      { name: "Cursor", best: "AI-assisted code editing", pricing: "$20/mo", why: "AI pair programmer built on VS Code. Write features by describing them in plain English. Handles refactoring and debugging.", alternative: "GitHub Copilot ($10/mo)" },
      { name: "v0 by Vercel", best: "Generating UI components from text descriptions", pricing: "Free tier, $20/mo Pro", why: "Describe a UI in English, get production-ready React code. Perfect for non-designers building interfaces.", alternative: "Bolt.new (free)" },
      { name: "Perplexity Pro", best: "Research and fact-checking", pricing: "$20/mo", why: "AI-powered search with citations. Find accurate market data, competitor analysis, and technical documentation.", alternative: "Phind (free)" },
      { name: "ElevenLabs", best: "Text-to-speech for content creation", pricing: "Free tier, $5/mo Starter", why: "Create voiceovers for YouTube videos, podcasts, and course content without recording yourself.", alternative: "OpenAI TTS ($0.015/min)" },
      { name: "Midjourney", best: "AI-generated images and graphics", pricing: "$10/mo Basic", why: "Generate blog headers, social media graphics, and product mockups. Useful for faceless branding.", alternative: "DALL-E 3 (via ChatGPT)" },
    ],
    needs: "AI tools that understand professional domain language, can process long documents, and help bridge the gap between domain expertise and technical implementation.",
    budget: "Start with Claude Pro ($20/mo) and v0 (free). That's $20/month for a complete AI-powered development stack. Add Cursor ($20/mo) once you're actively coding.",
  },
  {
    name: "No-Code Tools",
    slugPart: "no-code-tools",
    tools: [
      { name: "Bubble", best: "Full web applications without code", pricing: "Free tier, $32/mo paid", why: "Build complex SaaS applications with user accounts, databases, and workflows. The most powerful no-code platform.", alternative: "Glide ($25/mo)" },
      { name: "Airtable", best: "Database + automation in one tool", pricing: "Free tier, $20/mo Plus", why: "Store user data, manage content, and automate workflows. Acts as your database, CMS, and CRM combined.", alternative: "Notion ($10/mo)" },
      { name: "Zapier", best: "Connect 5,000+ apps and automate workflows", pricing: "Free tier, $20/mo paid", why: "Automate email sequences, sync data between tools, and trigger actions. Essential for reducing manual work.", alternative: "Make ($9/mo)" },
      { name: "Webflow", best: "Professional websites and landing pages", pricing: "Free tier, $14/mo paid", why: "Design responsive websites visually. Better than WordPress for marketing pages and content sites.", alternative: "Framer ($15/mo)" },
      { name: "Memberstack", best: "Add memberships and paywalls to any site", pricing: "$25/mo Starter", why: "Charge for access to content, tools, or communities. Handles authentication, billing, and content gating.", alternative: "Outseta ($59/mo)" },
      { name: "Tally", best: "Forms and surveys", pricing: "Free tier, $29/mo Pro", why: "Collect user feedback, run surveys, and qualify leads. Free tier covers most needs.", alternative: "Typeform ($25/mo)" },
    ],
    needs: "No-code tools that can handle professional workflows, integrate with existing business systems, and scale from prototype to production without rewriting.",
    budget: "Start with Bubble free tier, Airtable free tier, and Zapier free tier. That's $0/month. Upgrade when you have paying customers ($32+$20+$20 = $72/mo).",
  },
  {
    name: "Payment Tools",
    slugPart: "payment-tools",
    tools: [
      { name: "Stripe", best: "The gold standard for SaaS payments", pricing: "2.9% + $0.30/transaction", why: "Subscriptions, one-time payments, invoices, tax handling. The most developer-friendly payment processor. Used by 80%+ of SaaS.", alternative: "Paddle (5% + $0.50)" },
      { name: "Lemon Squeezy", best: "Merchant of Record (handles global taxes)", pricing: "5% + $0.50/transaction", why: "Handles EU VAT, GST, and sales tax automatically. Perfect if you don't want to deal with international tax compliance.", alternative: "Paddle (5% + $0.50)" },
      { name: "Polar", best: "Open-source funding + payments", pricing: "4% + $0.40/transaction", why: "Built for developers. Handles GitHub-based licensing, donations, and subscriptions. Great for developer tools.", alternative: "Gumroad (10%)" },
      { name: "Gumroad", best: "Selling digital products and downloads", pricing: "10% flat fee", why: "Simplest way to sell ebooks, courses, and digital downloads. No monthly fee — they take a percentage. Great for starting.", alternative: "SendOwl ($9/mo)" },
      { name: "Buy Me a Coffee", best: "Tips, donations, and memberships", pricing: "5% flat fee", why: "Accept support from users without setting up full payment infrastructure. Good for pre-revenue community building.", alternative: "Ko-fi (0% fee on paid plan)" },
      { name: "Invoice Ninja", best: "Professional invoicing", pricing: "Free tier, $10/mo Pro", why: "Send branded invoices, track payments, and manage clients. Essential for B2B SaaS with enterprise customers.", alternative: "Wave (free invoicing)" },
    ],
    needs: "Payment tools that support subscription billing, handle international taxes, integrate with existing accounting practices, and provide clear revenue reporting.",
    budget: "Start with Stripe (pay per transaction, no monthly fee). Add Lemon Squeezy if you have international customers and don't want to handle taxes. Total: $0/month + transaction fees.",
  },
  {
    name: "Analytics Tools",
    slugPart: "analytics-tools",
    tools: [
      { name: "PostHog", best: "Product analytics + session recording + feature flags", pricing: "Free up to 1M events", why: "All-in-one analytics: funnels, retention, session recordings, A/B testing, and feature flags. Open-source, self-hostable.", alternative: "Mixpanel (free up to 20M events)" },
      { name: "Google Analytics 4", best: "Website traffic and acquisition data", pricing: "Free", why: "Industry standard for web analytics. Tracks traffic sources, user behavior, and conversion events. Essential for SEO.", alternative: "Plausible ($9/mo)" },
      { name: "Plausible", best: "Privacy-focused, GDPR-compliant analytics", pricing: "$9/mo", why: "Lightweight, fast, no cookies. Perfect if you want simple analytics without GDPR headaches. 100x smaller script than GA4.", alternative: "Fathom ($14/mo)" },
      { name: "Vercel Analytics", best: "Core Web Vitals and performance monitoring", pricing: "Free tier, $10/mo Pro", why: "Real user monitoring for page load speed, LCP, CLS, INP. Essential if your site is on Vercel.", alternative: "SpeedCurve ($50/mo)" },
      { name: "Hotjar", best: "Heatmaps and user session recordings", pricing: "Free tier, $32/mo Plus", why: "See where users click, scroll, and get stuck. Visual feedback on UX issues that numbers alone miss.", alternative: "Microsoft Clarity (free)" },
      { name: "Stripe Sigma", best: "Revenue analytics and SQL queries", pricing: "0.5% of volume", why: "Run SQL queries on your Stripe data. Cohort analysis, MRR, churn, LTV — all from your payment processor.", alternative: "Baremetrics ($129/mo)" },
    ],
    needs: "Analytics tools that track both product usage and business metrics, respect user privacy, and provide actionable insights without requiring a data team.",
    budget: "Start with PostHog (free up to 1M events), Google Analytics (free), and Microsoft Clarity (free). That's $0/month for full analytics coverage. Add Vercel Analytics ($10/mo) if performance matters.",
  },
];

function generateTool(profession: string, cat: typeof categories[0]): ToolCrossReference {
  const profLower = profession.toLowerCase();
  return {
    slug: `best-${cat.slugPart}-${profSlug(profession)}`,
    profession,
    category: cat.name,
    metaTitle: `Best ${cat.name} for ${profession} Building Micro-SaaS (2026)`,
    metaDescription: `The exact ${cat.name.toLowerCase()} ${profLower} need to build a profitable micro-SaaS side business. Real tools, pricing, alternatives, and profession-specific recommendations.`,
    h1: `Best ${cat.name} for ${profession} Building Micro-SaaS`,
    intro: `${profession} building side businesses need ${cat.name.toLowerCase()} that leverage their professional expertise while bridging gaps in technical skills. Here are the best ${cat.name.toLowerCase()} for ${profLower} — with real pricing, why each matters for your profession, and budget-friendly alternatives.`,
    tools: cat.tools,
    professionSpecificNeeds: cat.needs,
    budgetFriendly: cat.budget,
    faqs: [
      {
        question: `Which ${cat.name.toLowerCase()} should ${profLower} start with?`,
        answer: `Start with the free tier of each recommended tool. Most offer generous free tiers that cover your first 100-500 users. Only upgrade when you have paying customers generating revenue to cover the cost.`,
      },
      {
        question: `How much should ${profLower} spend monthly on ${cat.name.toLowerCase()}?`,
        answer: `$0-$50/month in the first 3 months (pre-revenue). $50-$150/month once you have 10+ paying customers. $150-$500/month at $2K+ MRR. Never let tool costs exceed 10% of your monthly revenue.`,
      },
      {
        question: `Are there ${cat.name.toLowerCase()} specifically designed for ${profLower}?`,
        answer: `Most ${cat.name.toLowerCase()} are profession-agnostic. The value comes from how you apply them to your domain expertise. Your professional knowledge of ${profession.toLowerCase()} workflows is the differentiator — the tools are just enablers.`,
      },
    ],
  };
}

export const toolCrossReference: ToolCrossReference[] = professions.flatMap(prof =>
  categories.map(cat => generateTool(prof, cat))
);
