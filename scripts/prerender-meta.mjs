/**
 * Post-build script: injects route-specific meta tags into pre-rendered HTML files.
 *
 * Reads dist/index.html (the SPA shell produced by Vite), then for every public
 * route that needs SEO (homepage, /blog, each blog post, /privacy, /terms) it
 * rewrites the <head> meta tags and writes the result to the matching file path
 * so Vercel can serve it as a static file before falling back to the SPA rewrite.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const SITE = "https://invisibleexit.com";
const SITE_NAME = "Invisible Exit";
const DEFAULT_IMAGE = `${SITE}/og-image.png`;

// ---------------------------------------------------------------------------
// Blog post data (extracted from src/data/blog-posts.ts to avoid TS import)
// ---------------------------------------------------------------------------
const blogPosts = [
  {
    slug: "how-much-money-to-never-work-again",
    title: "How Much Money Do You Actually Need to Never Work Again?",
    excerpt:
      "The math behind financial independence for corporate managers. Why $4,000/month in recurring revenue changes everything.",
    publishedAt: "2026-03-10",
    faqs: [
      { question: "What is the 4% rule for financial independence?", answer: "The 4% rule states you need 25 times your annual expenses saved to retire safely. However, for corporate managers, building $4,000/month in recurring micro-SaaS revenue is a faster, more practical path to financial independence than traditional retirement savings." },
      { question: "How much money does a corporate manager need to never work again?", answer: "Rather than the traditional millions in savings, a corporate manager earning $120K-$200K typically needs $4,000/month in net recurring revenue from a micro-SaaS business. This covers core expenses, provides runway to grow full-time, and eliminates the fear of financial free-fall." },
      { question: "How does micro-SaaS income compare to traditional retirement savings?", answer: "A micro-SaaS charging $29/month needs just 138 customers to generate $4,000/month. This is achievable in 12-18 months, compared to decades of traditional saving. Plus, recurring revenue compounds — every customer added this month still pays next month." },
    ],
  },
  {
    slug: "why-managing-directors-building-micro-saas",
    title:
      "Why Managing Directors Are Building Micro-SaaS Businesses in 2026",
    excerpt:
      "The golden handcuff trap is real. Here's why AI-powered micro-SaaS is the escape hatch for executives with constraints.",
    publishedAt: "2026-03-14",
    faqs: [
      { question: "What is micro-SaaS?", answer: "Micro-SaaS is a small software-as-a-service business typically run by one person or a small team, targeting a specific niche. It generates recurring monthly revenue through subscriptions, usually ranging from $20-$100/month per customer, and can be built and operated in 5-7 hours per week." },
      { question: "Why are corporate executives building side businesses?", answer: "Corporate executives are building side businesses because golden handcuffs (RSUs, bonuses, benefits) create an endless 'just one more year' cycle. AI tools have eliminated the technical barrier to building software, and micro-niches are more profitable than ever." },
      { question: "Can you build a SaaS while working full-time?", answer: "Yes. The Invisible Exit framework is designed for full-time corporate managers with 5-7 hours per week. Using AI tools for development and content, stealth operations for invisibility, and a systematic 18-month timeline, executives can build a micro-SaaS to $4,000/month MRR without quitting their day job." },
    ],
  },
  {
    slug: "invisible-business-model",
    title:
      "The Invisible Business Model: How to Build Revenue Your Employer Can't See",
    excerpt:
      "Entity separation, compliance, digital footprint management. A complete guide to invisible operations.",
    publishedAt: "2026-03-17",
    faqs: [
      { question: "What is the invisible business model?", answer: "The invisible business model is a strategy for building a profitable side business while employed, using entity separation (LLCs in privacy-friendly states), digital footprint management, and operational protocols that prevent your employer from discovering your venture." },
      { question: "How do you build a business that does not conflict with your employer?", answer: "The key is choosing a micro-SaaS that serves a different industry than your employer, using separate devices and networks, forming an LLC (potentially in your spouse's name), and never using company time or resources." },
      { question: "What makes a micro-SaaS business invisible?", answer: "A micro-SaaS is invisible when it operates through a privacy-protected LLC, uses separate digital identities (domain, email, social accounts), markets under a brand name rather than your personal name, and generates revenue through SEO and content marketing." },
    ],
  },
  {
    slug: "zero-to-4000-invisible-exit-timeline",
    title:
      "From $0 to $4,000/Month: The 18-Month Invisible Exit Timeline",
    excerpt:
      "A month-by-month breakdown of building recurring revenue while maintaining your corporate role.",
    publishedAt: "2026-03-20",
    faqs: [
      { question: "How long does it take to build a micro-SaaS to $4,000 MRR?", answer: "Following the Invisible Exit timeline, it takes 12-18 months to reach $4,000/month in recurring revenue. The first 3 months focus on validation, months 4-6 on getting first customers, months 7-12 on content-driven growth, and months 13-18 on hitting target MRR." },
      { question: "What are the first steps to building a micro-SaaS?", answer: "Start by listing 10 industries you understand from corporate experience, identifying pain points in each. Interview 5 people in your top niches, then validate by creating a landing page and getting 5 pre-sales." },
      { question: "How much does it cost to start a micro-SaaS?", answer: "With AI tools, starting a micro-SaaS costs $60-$260/month — covering AI code generators ($50-$100), hosting ($0-$50), and marketing tools ($0-$50). This is a 99% reduction from a traditional startup team cost." },
    ],
    howTo: {
      name: "How to Build a Micro-SaaS to $4,000 MRR in 18 Months",
      description: "A step-by-step guide to building $4,000/month in recurring revenue while keeping your corporate job.",
      totalTime: "P18M",
      steps: [
        { name: "Foundation (Months 1-3)", text: "Choose your niche by listing 10 industries you understand, interview potential customers, validate with a landing page and 5 pre-sales, then build your MVP focusing on one core feature." },
        { name: "First Customers (Months 4-6)", text: "Get to 10 paying customers through direct outreach and community posts. Fix top bugs, add the most requested feature, write SEO content, and set up a referral program." },
        { name: "Growth (Months 7-12)", text: "Run a content marketing machine publishing 2-3 pieces per week. Optimize for churn reduction below 5%, introduce higher pricing tiers, and automate onboarding and support." },
        { name: "The Exit (Months 13-18)", text: "Close the gap to $4,000/month with targeted outreach and small paid ads. Build 6 months of personal savings, document all processes, research health insurance, and give notice on your terms." },
      ],
    },
  },
  {
    slug: "ai-tools-replace-startup-team",
    title: "AI Tools That Replace a 5-Person Startup Team",
    excerpt:
      "Why solo founders with AI can now compete with funded startups. The tools, the workflow, the economics.",
    publishedAt: "2026-03-22",
    faqs: [
      { question: "What AI tools can replace a startup team?", answer: "Key AI tools include: Lovable and Cursor for development ($50-$100/month), v0 by Vercel and Midjourney for design ($10-$30/month), Claude for content and copywriting ($0-$50/month), and Stripe/Supabase/Vercel for operations ($0-$50/month)." },
      { question: "Can one person build a SaaS using AI?", answer: "Yes. In 2026, AI tools can generate production-ready applications from natural language descriptions, create professional UI designs, write marketing content, and handle operational infrastructure." },
      { question: "How much money does AI save for solo founders?", answer: "AI reduces the cost of building and running a SaaS from $22,000-$43,000/month (traditional 5-person team) to $60-$260/month — a 99% cost reduction." },
    ],
  },
  {
    slug: "real-estate-vs-micro-saas-freedom-math",
    title:
      "Real Estate vs. Micro-SaaS: Freedom Math for Corporate Managers",
    excerpt:
      "Which path to financial independence is faster, cheaper, and more invisible? The numbers might surprise you.",
    publishedAt: "2026-03-25",
    faqs: [
      { question: "Is micro-SaaS more profitable than real estate?", answer: "For the first few years, yes. A micro-SaaS can reach $4,000/month net cash flow in 12-18 months with $200 upfront. A rental property requires $80,000+ upfront and may only cash flow $150/month initially." },
      { question: "What is freedom math for corporate managers?", answer: "Freedom math calculates the fastest path from corporate employment to financial independence. It compares investment paths by upfront capital, time to $4,000/month cash flow, hours per week required, invisibility from employers, and scalability." },
      { question: "How do recurring SaaS revenues compare to rental income?", answer: "SaaS margins improve as you scale (70% at 10 customers to 95% at 1,000), while real estate margins often worsen due to management complexity. SaaS has near-zero marginal cost per customer." },
    ],
  },
  {
    slug: "5-hour-weekend-micro-saas-family-time",
    title: "The 5-Hour Weekend: How to Build a Micro-SaaS Without Sacrificing Family Time",
    excerpt:
      "You don't need 40 hours a week to build a business. Here's the exact weekly schedule corporate managers use to ship products in 5 focused hours.",
    publishedAt: "2026-03-28",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function jsonLdScript(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

/**
 * Replace the meta-tag region inside the SPA shell with route-specific tags.
 * The SPA shell has a known structure: between the viewport meta and the
 * Google tag script there are the default SEO tags we need to replace.
 */
function injectMeta(template, { title, description, url, type, image, jsonLd }) {
  const escapedTitle = escapeHtml(title);
  const escapedDesc = escapeHtml(description);
  const img = image || DEFAULT_IMAGE;
  const jsonLdHtml = (jsonLd || []).map(jsonLdScript).join("\n    ");

  const metaBlock = `<!-- SEO (pre-rendered) -->
    <title>${title}</title>
    <meta name="description" content="${escapedDesc}" />
    <meta name="author" content="${SITE_NAME}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />

    <!-- Open Graph -->
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${escapedTitle}" />
    <meta property="og:description" content="${escapedDesc}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${img}" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapedTitle}" />
    <meta name="twitter:description" content="${escapedDesc}" />
    <meta name="twitter:image" content="${img}" />

    ${jsonLdHtml}`;

  // Replace everything between the apple-touch-icon link and the Google tag script
  const replaced = template.replace(
    /<!-- Default SEO[\s\S]*?(?=\n\s*<!-- Google tag)/,
    metaBlock + "\n\n    "
  );

  return replaced;
}

function writePage(template, routePath, meta) {
  const html = injectMeta(template, meta);
  const filePath =
    routePath === "/"
      ? join(DIST, "index.html")
      : join(DIST, routePath, "index.html");

  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, html, "utf-8");
  console.log(`  Pre-rendered: ${routePath}`);
}

// ---------------------------------------------------------------------------
// Route definitions
// ---------------------------------------------------------------------------
function getRoutes() {
  const routes = [];

  // Homepage
  routes.push({
    path: "/",
    meta: {
      title: "Invisible Exit | Build a Side Business While Employed",
      description:
        "5 AI-powered tools that help corporate managers build anonymous micro-SaaS businesses. Calculate your freedom number, validate ideas, stay invisible. From $0.97/mo.",
      url: `${SITE}/`,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE,
          description:
            "Helping employed professionals build profitable side businesses using AI tools and proven funnel strategies.",
          sameAs: ["https://www.youtube.com/@InvisibleExit"],
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE}/blog?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        },
      ],
    },
  });

  // Blog index
  routes.push({
    path: "/blog",
    meta: {
      title:
        "Blog: Invisible Exit Strategies for Corporate Managers | Invisible Exit",
      description:
        "Articles on building invisible recurring revenue, micro-SaaS businesses, and financial independence for corporate managers and executives.",
      url: `${SITE}/blog`,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Invisible Exit Blog",
          description:
            "Articles on building invisible recurring revenue, micro-SaaS businesses, and financial independence for corporate managers and executives.",
          url: `${SITE}/blog`,
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Blog" },
          ],
        },
      ],
    },
  });

  // Blog posts
  for (const post of blogPosts) {
    const postUrl = `${SITE}/blog/${post.slug}`;
    const postJsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: {
          "@type": "Person",
          name: "Adrian",
          url: SITE,
          jobTitle: "Founder, Invisible Exit",
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE,
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
          { "@type": "ListItem", position: 3, name: post.title },
        ],
      },
    ];

    if (post.faqs && post.faqs.length > 0) {
      postJsonLd.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      });
    }

    if (post.howTo) {
      postJsonLd.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: post.howTo.name,
        description: post.howTo.description,
        totalTime: post.howTo.totalTime,
        step: post.howTo.steps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.name,
          text: step.text,
        })),
      });
    }

    routes.push({
      path: `/blog/${post.slug}`,
      meta: {
        title: `${post.title} | Invisible Exit Blog`,
        description: post.excerpt,
        url: postUrl,
        type: "article",
        jsonLd: postJsonLd,
      },
    });
  }

  // Privacy
  routes.push({
    path: "/privacy",
    meta: {
      title: "Privacy Policy | Invisible Exit",
      description:
        "Invisible Exit privacy policy. How we collect, use, and protect your data.",
      url: `${SITE}/privacy`,
      type: "website",
      jsonLd: [{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Privacy Policy" },
        ],
      }],
    },
  });

  // Terms
  routes.push({
    path: "/terms",
    meta: {
      title: "Terms of Service | Invisible Exit",
      description:
        "Invisible Exit terms of service. Rules and guidelines for using our platform.",
      url: `${SITE}/terms`,
      type: "website",
      jsonLd: [{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Terms of Service" },
        ],
      }],
    },
  });

  return routes;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
console.log("Pre-rendering meta tags...");
const template = readFileSync(join(DIST, "index.html"), "utf-8");
const routes = getRoutes();

for (const route of routes) {
  writePage(template, route.path, route.meta);
}

console.log(`Done! Pre-rendered ${routes.length} pages.`);
