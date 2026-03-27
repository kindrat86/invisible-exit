/**
 * Post-build script: generates per-route HTML files with correct meta tags,
 * OG tags, Twitter cards, canonical URLs, and JSON-LD for crawlers that
 * don't execute JavaScript.
 *
 * Run after `vite build` via: tsx scripts/generate-seo-pages.ts
 *
 * When adding new blog posts to src/data/blog-posts.ts, they are
 * automatically picked up — no changes needed here.
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { blogPosts } from "../src/data/blog-posts";

const BASE_URL = "https://invisibleexit.com";
const OG_IMAGE = `${BASE_URL}/og-image.png`;
const DIST = resolve(import.meta.dirname, "..", "dist");

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogType: "website" | "article";
  jsonLd?: object[];
  publishedAt?: string;
}

// ── Static page metadata ──────────────────────────────────────────────
const PAGES: Record<string, PageMeta> = {
  "/": {
    title: "Invisible Exit — Build a Side Business While Employed",
    description:
      "5 AI-powered tools that help corporate managers build anonymous micro-SaaS businesses. Calculate your freedom number, validate ideas, stay invisible. From $0.97/mo.",
    canonical: `${BASE_URL}/`,
    ogType: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Invisible Exit",
        url: BASE_URL,
        description:
          "Helping employed professionals build profitable side businesses using AI tools and proven funnel strategies.",
        sameAs: ["https://www.youtube.com/@InvisibleExit"],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Invisible Exit",
        url: BASE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: `${BASE_URL}/blog?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  },
  "/blog": {
    title:
      "Blog: Invisible Exit Strategies for Corporate Managers | Invisible Exit",
    description:
      "Articles on building invisible recurring revenue, micro-SaaS businesses, and financial independence for corporate managers and executives.",
    canonical: `${BASE_URL}/blog`,
    ogType: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Invisible Exit Blog",
        url: `${BASE_URL}/blog`,
        description:
          "Articles on building invisible recurring revenue, micro-SaaS businesses, and financial independence for corporate managers and executives.",
      },
    ],
  },
  "/privacy": {
    title: "Privacy Policy | Invisible Exit",
    description:
      "How Invisible Exit collects, uses, and protects your personal information. Read our privacy policy.",
    canonical: `${BASE_URL}/privacy`,
    ogType: "website",
  },
  "/terms": {
    title: "Terms of Service | Invisible Exit",
    description:
      "Terms and conditions for using the Invisible Exit platform. Read before signing up.",
    canonical: `${BASE_URL}/terms`,
    ogType: "website",
  },
};

// ── Blog posts (auto-generated from src/data/blog-posts.ts) ───────────
for (const post of blogPosts) {
  PAGES[`/blog/${post.slug}`] = {
    title: `${post.title} | Invisible Exit Blog`,
    description: post.excerpt,
    canonical: `${BASE_URL}/blog/${post.slug}`,
    ogType: "article",
    publishedAt: post.publishedAt,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        url: `${BASE_URL}/blog/${post.slug}`,
        datePublished: post.publishedAt,
        author: { "@type": "Organization", name: "Invisible Exit" },
        publisher: { "@type": "Organization", name: "Invisible Exit" },
      },
    ],
  };
}

// ── HTML rewriting ────────────────────────────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function replaceMeta(html: string, meta: PageMeta): string {
  const t = escapeHtml(meta.title);
  const d = escapeHtml(meta.description);
  const c = escapeHtml(meta.canonical);
  const ogT = escapeHtml(meta.ogType);

  // Replace existing tags in the HTML shell
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
  html = html.replace(
    /(<meta name="description" content=")[^"]*"/,
    `$1${d}"`,
  );
  html = html.replace(/(<link rel="canonical" href=")[^"]*"/, `$1${c}"`);
  html = html.replace(
    /(<meta property="og:type" content=")[^"]*"/,
    `$1${ogT}"`,
  );
  html = html.replace(
    /(<meta property="og:title" content=")[^"]*"/,
    `$1${t}"`,
  );
  html = html.replace(
    /(<meta property="og:description" content=")[^"]*"/,
    `$1${d}"`,
  );
  html = html.replace(
    /(<meta property="og:url" content=")[^"]*"/,
    `$1${c}"`,
  );
  html = html.replace(
    /(<meta name="twitter:title" content=")[^"]*"/,
    `$1${t}"`,
  );
  html = html.replace(
    /(<meta name="twitter:description" content=")[^"]*"/,
    `$1${d}"`,
  );

  // Inject article:published_time for blog posts
  if (meta.ogType === "article" && meta.publishedAt) {
    html = html.replace(
      "</head>",
      `    <meta property="article:published_time" content="${meta.publishedAt}" />\n  </head>`,
    );
  }

  // Inject JSON-LD
  if (meta.jsonLd?.length) {
    const ldScripts = meta.jsonLd
      .map(
        (ld) =>
          `    <script type="application/ld+json">${JSON.stringify(ld)}</script>`,
      )
      .join("\n");
    html = html.replace("</head>", `${ldScripts}\n  </head>`);
  }

  return html;
}

// ── Main ──────────────────────────────────────────────────────────────
const baseHtml = readFileSync(resolve(DIST, "index.html"), "utf-8");
let generated = 0;

for (const [route, meta] of Object.entries(PAGES)) {
  const outPath =
    route === "/"
      ? resolve(DIST, "index.html")
      : resolve(DIST, route.slice(1), "index.html");

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, replaceMeta(baseHtml, meta));
  generated++;
}

console.log(`SEO: generated ${generated} pages with meta tags and JSON-LD`);
