import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITE = "https://invisibleexit.com";

// ---------- Import blog data ----------
// We import the TS source directly (tsx handles it)
import { blogPosts } from "../src/data/blog-posts.js";

// ---------- Markdown-like content → HTML ----------

function bold(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function contentToHtml(content: string): string {
  const blocks = content.split("\n\n");
  const expanded: { block: string }[] = [];

  for (const block of blocks) {
    const lines = block.split("\n");
    const listStart = lines.findIndex(
      (l) => /^[-\d]/.test(l) || l.startsWith("- [")
    );
    if (
      listStart > 0 &&
      !block.startsWith("|") &&
      !block.startsWith("#")
    ) {
      expanded.push({ block: lines.slice(0, listStart).join("\n") });
      expanded.push({ block: lines.slice(listStart).join("\n") });
    } else {
      expanded.push({ block });
    }
  }

  return expanded
    .map(({ block }) => {
      if (block.startsWith("## ")) {
        return `<h2>${block.replace("## ", "")}</h2>`;
      }
      if (block.startsWith("### ")) {
        return `<h3>${block.replace("### ", "")}</h3>`;
      }
      // Table
      if (block.startsWith("| ")) {
        const rows = block
          .split("\n")
          .filter((r) => !/^\|\s*[-|]+\s*\|$/.test(r));
        if (rows.length === 0) return "";
        const header = rows[0]
          .split("|")
          .filter(Boolean)
          .map((c) => c.trim());
        const body = rows.slice(1).map((r) =>
          r
            .split("|")
            .filter(Boolean)
            .map((c) => c.trim())
        );
        const headerHtml = header.map((h) => `<th>${h}</th>`).join("");
        const bodyHtml = body
          .map((row) => `<tr>${row.map((c) => `<td>${bold(c)}</td>`).join("")}</tr>`)
          .join("");
        return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
      }
      // Checklist
      if (block.startsWith("- [ ]") || block.startsWith("- [x]")) {
        const items = block.split("\n").filter(Boolean);
        return `<ul>${items
          .map((item) => {
            const text = item.replace(/^- \[.\]\s*/, "");
            return `<li>${bold(text)}</li>`;
          })
          .join("")}</ul>`;
      }
      // Unordered list
      if (block.startsWith("- ")) {
        const items = block.split("\n").filter(Boolean);
        return `<ul>${items
          .map((item) => `<li>${bold(item.replace(/^-\s+/, ""))}</li>`)
          .join("")}</ul>`;
      }
      // Ordered list
      if (/^\d+\.\s/.test(block)) {
        const items = block.split("\n").filter(Boolean);
        return `<ol>${items
          .map((item) => `<li>${bold(item.replace(/^\d+\.\s+/, ""))}</li>`)
          .join("")}</ol>`;
      }
      // Paragraph
      return `<p>${bold(block)}</p>`;
    })
    .join("\n");
}

// ---------- Generate HTML for a blog post page ----------

function blogPostBodyHtml(post: (typeof blogPosts)[0]): string {
  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `<div class="min-h-screen">
<section style="padding-top:8rem;padding-bottom:4rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<span>${post.category}</span>
<h1>${post.title}</h1>
<div><span>${post.readTime}</span> · <span>${date}</span></div>
</div>
</section>
<section style="padding:4rem 1.5rem">
<article style="max-width:48rem;margin:0 auto">
${contentToHtml(post.content)}
</article>
</section>
</div>`;
}

// ---------- Generate HTML for the blog listing page ----------

function blogListingBodyHtml(): string {
  const cards = blogPosts
    .map((post) => {
      const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `<div>
<span>${post.category}</span>
<h2><a href="/blog/${post.slug}">${post.title}</a></h2>
<p>${post.excerpt}</p>
<div><span>${post.readTime}</span> <span>${date}</span></div>
</div>`;
    })
    .join("\n");

  return `<div class="min-h-screen">
<section style="padding-top:8rem;padding-bottom:4rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:56rem;margin:0 auto;text-align:center">
<h1>The Invisible Exit Blog</h1>
<p>Strategies, frameworks, and case studies for corporate managers building invisible recurring revenue.</p>
</div>
</section>
<section style="padding:4rem 1.5rem">
<div style="max-width:72rem;margin:0 auto">
${cards}
</div>
</section>
</div>`;
}

// ---------- Head tag injection ----------

function injectHead(
  html: string,
  opts: {
    title: string;
    description: string;
    url: string;
    type: string;
    publishedDate?: string;
    jsonLd?: Record<string, unknown>;
  }
): string {
  const fullUrl = `${SITE}${opts.url}`;

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${opts.title}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${opts.description}"`
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${fullUrl}"`
  );

  // Replace OG tags
  html = html.replace(
    /<meta property="og:type" content="[^"]*"/,
    `<meta property="og:type" content="${opts.type}"`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${opts.title}"`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${opts.description}"`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${fullUrl}"`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${opts.title}"`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${opts.description}"`
  );

  // Inject JSON-LD before </head>
  if (opts.jsonLd) {
    const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(opts.jsonLd)}</script>`;
    html = html.replace("</head>", `${jsonLdScript}\n</head>`);
  }

  // Inject article:published_time for articles
  if (opts.type === "article" && opts.publishedDate) {
    const articleMeta = `<meta property="article:published_time" content="${opts.publishedDate}" />`;
    html = html.replace("</head>", `${articleMeta}\n</head>`);
  }

  return html;
}

// ---------- Main ----------

function main() {
  const template = readFileSync(resolve(DIST, "index.html"), "utf-8");

  console.log("Pre-rendering blog pages...");

  // 1. Blog listing page
  {
    let html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${blogListingBodyHtml()}</div>`
    );
    html = injectHead(html, {
      title:
        "Blog: Invisible Exit Strategies for Corporate Managers | Invisible Exit",
      description:
        "Articles on building invisible recurring revenue, micro-SaaS businesses, and financial independence for corporate managers and executives.",
      url: "/blog",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "The Invisible Exit Blog",
        description:
          "Strategies, frameworks, and case studies for corporate managers building invisible recurring revenue.",
        url: `${SITE}/blog`,
        publisher: {
          "@type": "Organization",
          name: "Invisible Exit",
          url: SITE,
        },
      },
    });

    const dir = resolve(DIST, "blog");
    mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, "index.html"), html);
    console.log("  /blog");
  }

  // 2. Individual blog post pages
  for (const post of blogPosts) {
    let html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${blogPostBodyHtml(post)}</div>`
    );

    const postUrl = `/blog/${post.slug}`;
    html = injectHead(html, {
      title: `${post.title} | Invisible Exit Blog`,
      description: post.excerpt,
      url: postUrl,
      type: "article",
      publishedDate: post.publishedAt,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        url: `${SITE}${postUrl}`,
        publisher: {
          "@type": "Organization",
          name: "Invisible Exit",
          url: SITE,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE}${postUrl}`,
        },
      },
    });

    const dir = resolve(DIST, "blog", post.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, "index.html"), html);
    console.log(`  ${postUrl}`);
  }

  console.log(`Done. Pre-rendered ${blogPosts.length + 1} blog pages.`);
}

main();
