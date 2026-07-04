/**
 * "X Alternative" pages for /alternatives/:slug.
 * Each page targets searches for "[product] alternative" or "[product] alternatives for solo founders".
 */

export interface AlternativeEntry {
  slug: string;
  product: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  whySwitch: string[];
  alternatives: { name: string; url: string; pricing: string; bestFor: string; pros: string[]; cons: string[] }[];
  verdict: string;
  faqs: { question: string; answer: string }[];
}

export const alternatives: AlternativeEntry[] = [
  {
    slug: "notion-alternative",
    product: "Notion",
    category: "Productivity",
    metaTitle: "Notion Alternatives for Solo Founders Building Micro-SaaS (2026)",
    metaDescription: "The best Notion alternatives for solo founders who need lightweight knowledge management, project tracking, and documentation without the complexity.",
    h1: "Best Notion Alternatives for Solo Founders",
    intro: "Notion is powerful, but for a solo founder with 5-10 hours per week, it can feel like a second job maintaining databases. Here are lighter alternatives that let you get back to building.",
    whySwitch: [
      "Notion's database complexity is overkill for a solopreneur tracking 3 projects",
      "No offline mode on mobile limits access during commute",
      "Loading time on large workspaces hurts frictionless capture",
      "Monthly cost adds up when you just need docs and task lists",
    ],
    alternatives: [
      { name: "Obsidian", url: "https://obsidian.md", pricing: "Free / $5/month sync", bestFor: "Local-first knowledge management with markdown", pros: ["Works offline", "Local files", "Huge plugin ecosystem"], cons: ["No native collaboration", "Sync costs extra"] },
      { name: "Craft", url: "https://craft.do", pricing: "Free / $5/month", bestFor: "Beautiful docs on Apple devices", pros: ["Best mobile experience", "Native Apple apps", "Clean interface"], cons: ["Apple-only", "Limited DB features"] },
      { name: "Dendron", url: "https://dendron.so", pricing: "Free (open source)", bestFor: "VSCode-based knowledge base for developers", pros: ["VS Code native", "Markdown", "Open source"], cons: ["Developer-focused", "Steep learning curve"] },
      { name: "Anytype", url: "https://anytype.io", pricing: "Free", bestFor: "Privacy-focused Notion alternative", pros: ["Local-first", "Encrypted", "Graph view"], cons: ["Still in beta", "Smaller community"] },
    ],
    verdict: "Obsidian is the best Notion alternative for solo founders. It's local-first, free, and handles knowledge management without making you feel like you're building a second product.",
    faqs: [
      { question: "Is Obsidian better than Notion?", answer: "For solo founders, yes. Obsidian is faster, works offline, and doesn't require a subscription. The trade-off is no built-in databases." },
      { question: "What about Notion's databases?", answer: "Most solo founders don't need relational databases. A simple markdown note with tags and links covers 90% of use cases with zero friction." },
    ],
  },
  {
    slug: "substack-alternative",
    product: "Substack",
    category: "Newsletter",
    metaTitle: "Substack Alternatives for Anonymous Solo Founders (2026)",
    metaDescription: "The best Substack alternatives for faceless newsletter growth. Beehiiv, ConvertKit, and more — each compared for anonymous founders building audiences.",
    h1: "Best Substack Alternatives for Anonymous Founders",
    intro: "Substack is great for writers, but its discoverability is dropping and the platform takes 10% of revenue. For anonymous founders building a newsletter alongside a micro-SaaS, there are better options.",
    whySwitch: [
      "Substack takes 10% of subscription revenue on top of Stripe/Paddle fees",
      "No native landing pages or sales funnel tools",
      "Limited customization for building a brand vs. Substack's brand",
      "No course or digital product hosting — you need another tool",
    ],
    alternatives: [
      { name: "Beehiiv", url: "https://beehiiv.com", pricing: "Free / $42/month", bestFor: "All-in-one newsletter + growth tools", pros: ["Built-in growth tools", "Recommendations", "AI writing assistant"], cons: ["Free tier has limits", "Learning curve"] },
      { name: "ConvertKit", url: "https://convertkit.com", pricing: "Free (up to 1K subs) / $29/month", bestFor: "Creator-focused email marketing with automations", pros: ["Great automations", "Tag-based", "Landing pages"], cons: ["Expensive at scale", "Design limited"] },
      { name: "Ghost", url: "https://ghost.org", pricing: "$9/month (self-host)", bestFor: "Open-source newsletter with full control", pros: ["Open source", "Own your data", "Memberships"], cons: ["Self-hosting required", "More technical setup"] },
      { name: "Buttondown", url: "https://buttondown.email", pricing: "$9/month", bestFor: "Simple, indie-friendly newsletter tool", pros: ["Simple UI", "API-first", "Affordable"], cons: ["Fewer features", "Smaller community"] },
    ],
    verdict: "Beehiiv is the best Substack alternative for anonymous founders. Free tier, built-in growth tools, and no revenue cut. You can build, grow, and monetize without giving away 10%.",
    faqs: [
      { question: "Can I keep my Substack subscribers if I switch?", answer: "Yes, you can export your subscriber list from Substack as CSV and import it into any alternative. Your paid subscribers will need to be re-setup in the new platform." },
      { question: "What about SEO for my newsletter?", answer: "Beehiiv and Ghost both offer better SEO than Substack. Your newsletter archive becomes searchable content that drives organic traffic." },
    ],
  },
  {
    slug: "carrd-alternative",
    product: "Carrd",
    category: "Landing Pages",
    metaTitle: "Carrd Alternatives for Micro-SaaS Landing Pages (2026)",
    metaDescription: "The best Carrd alternatives for solo founders building micro-SaaS landing pages. Framer, Unicorn Platform, and more compared.",
    h1: "Best Carrd Alternatives for Micro-SaaS Landing Pages",
    intro: "Carrd is perfect for simple one-pagers, but micro-SaaS often needs more: pricing tables, authentication, blog integration, and payment forms. Here are alternatives that grow with you.",
    whySwitch: [
      "Carrd's one-page limit restricts SEO content depth for blog + landing pages",
      "No native blog capabilities — you need a separate tool",
      "Limited form handling for pre-sales and waitlists",
      "No A/B testing for optimizing conversion",
    ],
    alternatives: [
      { name: "Framer", url: "https://framer.com", pricing: "Free / $15/month", bestFor: "Design-first landing pages with animations", pros: ["Beautiful designs", "CMS built-in", "Free .framer.site domain"], cons: ["Learning curve", "Expensive for multiple sites"] },
      { name: "Unicorn Platform", url: "https://unicornplatform.com", pricing: "$19/month", bestFor: "SaaS landing pages designed for conversions", pros: ["SaaS-specific templates", "Blog built-in", "Changelog"], cons: ["Less design freedom", "Fewer integrations"] },
      { name: "Vercel + Tailwind", url: "https://vercel.com", pricing: "Free", bestFor: "Developers who want full control over their landing page", pros: ["Free hosting", "Maximum flexibility", "Edge functions"], cons: ["Requires coding", "No visual editor"] },
    ],
    verdict: "Framer is the best Carrd alternative for most founders. It gives you beautiful landing pages with CMS, blog, and forms — all in one tool.",
    faqs: [
      { question: "Can I migrate from Carrd to Framer?", answer: "Not directly — you'll need to rebuild your page. However, Framer's import tools make it easier. Spend the afternoon on it and you'll have a better, more flexible site." },
      { question: "Do I need a separate blog tool with Framer?", answer: "No, Framer has built-in CMS for blog posts. One tool, one domain, one stack." },
    ],
  },
  {
    slug: "gumroad-alternative",
    product: "Gumroad",
    category: "Payments",
    metaTitle: "Gumroad Alternatives for Micro-SaaS (2026)",
    metaDescription: "The best Gumroad alternatives for solo founders selling SaaS subscriptions and digital products. Stripe, Paddle, Lemon Squeezy compared.",
    h1: "Best Gumroad Alternatives for Micro-SaaS",
    intro: "Gumroad is great for selling ebooks and templates, but for micro-SaaS with recurring subscriptions, the 10% fee and limited analytics make it expensive. Here are better options.",
    whySwitch: [
      "Gumroad takes 10% on top of payment processing fees — expensive for recurring billing",
      "No native tax handling for physical goods or global sales",
      "Limited analytics for subscription metrics like churn and LTV",
      "Not designed for SaaS features like team accounts or usage-based billing",
    ],
    alternatives: [
      { name: "Stripe", url: "https://stripe.com", pricing: "2.9% + 30¢", bestFor: "Full-featured payment processing for SaaS", pros: ["Best subscription APIs", "Tax automation", "Global reach"], cons: ["Technical setup", "Payout delays"] },
      { name: "Paddle", url: "https://paddle.com", pricing: "5% + $0.50", bestFor: "Global SaaS payments with tax compliance handled", pros: ["Tax compliance covered", "Dunning included", "Subscription management"], cons: ["Higher fee", "Two-week payout hold"] },
      { name: "Lemon Squeezy", url: "https://lemonsqueezy.com", pricing: "5% + 50¢", bestFor: "Indie-friendly payment platform", pros: ["Tax handled", "Simple setup", "Beautiful checkout"], cons: ["Newer platform", "Fewer integrations"] },
    ],
    verdict: "For micro-SaaS, use Stripe for subscriptions. The API is unmatched, fees are lower at scale, and you have full control over the checkout experience. For digital products alongside a SaaS, add Gumroad or Lemon Squeezy.",
    faqs: [
      { question: "Can I use Stripe without coding?", answer: "Yes — Stripe Payment Links and Stripe Checkout let you accept payments with zero code. Link a payment link from any landing page." },
      { question: "What about EU VAT handling?", answer: "Stripe Tax handles EU VAT automatically for digital products. Paddle and Lemon Squeezy also handle it. Gumroad does too, but the fee is higher." },
    ],
  },
  {
    slug: "wordpress-alternative",
    product: "WordPress",
    category: "CMS",
    metaTitle: "WordPress Alternatives for Solo Founders (2026)",
    metaDescription: "The best WordPress alternatives for solo founders who need a blog + content site without the maintenance burden of WordPress.",
    h1: "Best WordPress Alternatives for Solo Founders",
    intro: "WordPress powers 43% of the web, but maintaining it as a solo founder with 5 hours per week is expensive overhead. Updates, security, plugins, hosting — it adds up. Here are lighter options.",
    whySwitch: [
      "WordPress requires regular maintenance (updates, backups, security)",
      "Plugin conflicts and bloat slow down your site",
      "Hosting costs more than alternatives for the same traffic",
      "No built-in subscription or membership features without plugins",
    ],
    alternatives: [
      { name: "Ghost", url: "https://ghost.org", pricing: "$9/month", bestFor: "Content-first newsletter with membership", pros: ["Built-in newsletters", "Clean editor", "Fast"], cons: ["Limited plugins", "Customization requires code"] },
      { name: "Write.as", url: "https://write.as", pricing: "$3/month", bestFor: "Distraction-free writing", pros: ["Simple", "Privacy-focused", "Very affordable"], cons: ["Too simple for most", "No plugins"] },
      { name: "Astro + Decap CMS", url: "https://astro.build", pricing: "Free (open source)", bestFor: "Static site generator with CMS", pros: ["Extremely fast", "Free hosting", "Markdown-driven"], cons: ["Requires development skills", "No visual editor"] },
    ],
    verdict: "Ghost is the best WordPress alternative for solo founders. It handles newsletters, memberships, and content — all in one platform — without plugin management.",
    faqs: [
      { question: "Can I migrate from WordPress to Ghost?", answer: "Yes, Ghost has a built-in WordPress import tool. It migrates posts, authors, and tags. Redirect your old URLs for SEO continuity." },
      { question: "Does Ghost support SEO?", answer: "Yes, Ghost has excellent SEO out of the box: canonical URLs, structured data, XML sitemaps, and fast page load times." },
    ],
  },
];
