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
  },
  {
    slug: "why-managing-directors-building-micro-saas",
    title:
      "Why Managing Directors Are Building Micro-SaaS Businesses in 2026",
    excerpt:
      "The golden handcuff trap is real. Here's why AI-powered micro-SaaS is the escape hatch for executives with constraints.",
    publishedAt: "2026-03-14",
  },
  {
    slug: "invisible-business-model",
    title:
      "The Invisible Business Model: How to Build Revenue Your Employer Can't See",
    excerpt:
      "Entity separation, compliance, digital footprint management. A complete guide to invisible operations.",
    publishedAt: "2026-03-17",
  },
  {
    slug: "zero-to-4000-invisible-exit-timeline",
    title:
      "From $0 to $4,000/Month: The 18-Month Invisible Exit Timeline",
    excerpt:
      "A month-by-month breakdown of building recurring revenue while maintaining your corporate role.",
    publishedAt: "2026-03-20",
  },
  {
    slug: "ai-tools-replace-startup-team",
    title: "AI Tools That Replace a 5-Person Startup Team",
    excerpt:
      "Why solo founders with AI can now compete with funded startups. The tools, the workflow, the economics.",
    publishedAt: "2026-03-22",
  },
  {
    slug: "real-estate-vs-micro-saas-freedom-math",
    title:
      "Real Estate vs. Micro-SaaS: Freedom Math for Corporate Managers",
    excerpt:
      "Which path to financial independence is faster, cheaper, and more invisible? The numbers might surprise you.",
    publishedAt: "2026-03-25",
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
        },
      ],
    },
  });

  // Blog posts
  for (const post of blogPosts) {
    const postUrl = `${SITE}/blog/${post.slug}`;
    routes.push({
      path: `/blog/${post.slug}`,
      meta: {
        title: `${post.title} | Invisible Exit Blog`,
        description: post.excerpt,
        url: postUrl,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            author: { "@type": "Person", name: SITE_NAME },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE,
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
          },
        ],
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
      jsonLd: [],
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
      jsonLd: [],
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
