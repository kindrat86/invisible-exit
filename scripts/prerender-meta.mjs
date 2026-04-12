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
import { blogPosts } from "../src/data/blog-posts.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const SITE = "https://invisibleexit.com";
const SITE_NAME = "Invisible Exit";
const DEFAULT_IMAGE = `${SITE}/og-image.png`;

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

  return template.replace(
    /<!-- Default SEO[\s\S]*?(?=\n\s*<!-- Google tag)/,
    metaBlock + "\n\n    "
  );
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

function getRoutes() {
  const routes = [];

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

    if (post.faqs?.length) {
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

console.log("Pre-rendering meta tags...");
const template = readFileSync(join(DIST, "index.html"), "utf-8");
const routes = getRoutes();

for (const route of routes) {
  writePage(template, route.path, route.meta);
}

console.log(`Done! Pre-rendered ${routes.length} pages.`);
