/**
 * Post-build script: injects blog body content into pre-rendered HTML files.
 *
 * Runs AFTER prerender-meta.mjs (which handles <head> meta tags).
 * Reads each blog HTML file from dist/ and replaces the empty <div id="root"></div>
 * with full article content so search engine crawlers can index it.
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "..", "dist");

// Import blog data directly (tsx handles TS imports)
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
    if (listStart > 0 && !block.startsWith("|") && !block.startsWith("#")) {
      expanded.push({ block: lines.slice(0, listStart).join("\n") });
      expanded.push({ block: lines.slice(listStart).join("\n") });
    } else {
      expanded.push({ block });
    }
  }

  return expanded
    .map(({ block }) => {
      if (block.startsWith("## "))
        return `<h2>${block.replace("## ", "")}</h2>`;
      if (block.startsWith("### "))
        return `<h3>${block.replace("### ", "")}</h3>`;
      if (block.startsWith("| ")) {
        const rows = block.split("\n").filter((r) => !/^\|\s*[-|]+\s*\|$/.test(r));
        if (rows.length === 0) return "";
        const header = rows[0].split("|").filter(Boolean).map((c) => c.trim());
        const body = rows.slice(1).map((r) => r.split("|").filter(Boolean).map((c) => c.trim()));
        return `<table><thead><tr>${header.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${body.map((row) => `<tr>${row.map((c) => `<td>${bold(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      }
      if (block.startsWith("- [ ]") || block.startsWith("- [x]")) {
        const items = block.split("\n").filter(Boolean);
        return `<ul>${items.map((item) => `<li>${bold(item.replace(/^- \[.\]\s*/, ""))}</li>`).join("")}</ul>`;
      }
      if (block.startsWith("- ")) {
        const items = block.split("\n").filter(Boolean);
        return `<ul>${items.map((item) => `<li>${bold(item.replace(/^-\s+/, ""))}</li>`).join("")}</ul>`;
      }
      if (/^\d+\.\s/.test(block)) {
        const items = block.split("\n").filter(Boolean);
        return `<ol>${items.map((item) => `<li>${bold(item.replace(/^\d+\.\s+/, ""))}</li>`).join("")}</ol>`;
      }
      return `<p>${bold(block)}</p>`;
    })
    .join("\n");
}

// ---------- Body HTML generators ----------

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
<div><span>${post.readTime}</span> &middot; <span>${date}</span></div>
</div>
</section>
<section style="padding:4rem 1.5rem">
<article style="max-width:48rem;margin:0 auto">
${contentToHtml(post.content)}
</article>
</section>
</div>`;
}

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

// ---------- Inject body into existing HTML file ----------

function injectBody(filePath: string, bodyHtml: string): boolean {
  if (!existsSync(filePath)) {
    return false;
  }
  let html = readFileSync(filePath, "utf-8");
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  writeFileSync(filePath, html, "utf-8");
  return true;
}

// ---------- Main ----------

function main() {
  console.log("Injecting blog body content into pre-rendered HTML...");

  let count = 0;

  // Blog listing page
  if (injectBody(resolve(DIST, "blog", "index.html"), blogListingBodyHtml())) {
    console.log("  /blog");
    count++;
  }

  // Individual blog post pages
  for (const post of blogPosts) {
    if (injectBody(resolve(DIST, "blog", post.slug, "index.html"), blogPostBodyHtml(post))) {
      console.log(`  /blog/${post.slug}`);
      count++;
    }
  }

  console.log(`Done. Injected body content into ${count} blog pages.`);
}

main();
