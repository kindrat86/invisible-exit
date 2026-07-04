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
import { glossaryTerms } from "../src/data/glossary.js";
import { comparisons } from "../src/data/comparisons.js";

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

function slugifyCategory(cat: string): string {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function blogPostBodyHtml(post: (typeof blogPosts)[0]): string {
  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const catSlug = slugifyCategory(post.category);

  // Find related posts (same category, excluding current)
  const related = blogPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  // FAQ HTML section
  let faqHtml = "";
  if (post.faqs && post.faqs.length > 0) {
    const faqItems = post.faqs
      .map(
        (f) =>
          `<div><h3>${f.question}</h3><p>${f.answer}</p></div>`
      )
      .join("\n");
    faqHtml = `
<section style="padding:3rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">Frequently Asked Questions</h2>
${faqItems}
</div>
</section>`;
  }

  // HowTo schema section
  let howToHtml = "";
  if (post.howTo) {
    const steps = post.howTo.steps
      .map(
        (s, i) =>
          `<li><strong>${s.name}</strong><p>${s.text}</p></li>`
      )
      .join("\n");
    howToHtml = `
<section style="padding:3rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:0.5rem">${post.howTo.name}</h2>
<p style="color:#6b7280;margin-bottom:0.5rem">${post.howTo.description}</p>
<p style="font-size:0.875rem;color:#6b7280;margin-bottom:1.5rem">Total time: ${post.howTo.totalTime}</p>
<ol style="list-style:decimal;padding-left:1.5rem;display:flex;flex-direction:column;gap:1rem">
${steps}
</ol>
</div>
</section>`;
  }

  // Related posts section
  let relatedHtml = "";
  if (related.length > 0) {
    const cards = related
      .map(
        (p) =>
          `<div><span style="font-size:0.75rem;color:#6b7280">${p.category}</span><h3 style="margin-top:0.25rem"><a href="/blog/${p.slug}">${p.title}</a></h3><p style="font-size:0.875rem;color:#6b7280;margin-top:0.25rem">${p.excerpt}</p></div>`
      )
      .join("\n");
    relatedHtml = `
<section style="padding:3rem 1.5rem;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">More in ${post.category}</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(16rem,1fr));gap:1.5rem">
${cards}
</div>
</div>
</section>`;
  }

  // Category link + comparison links
  const categoryLinkHtml = `
<section style="padding:2rem 1.5rem;text-align:center">
<div style="max-width:48rem;margin:0 auto">
<a href="/blog/category/${catSlug}" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Explore all ${post.category} articles &rarr;</a>
</div>
</section>`;

  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/blog" style="color:#3B82F6;text-decoration:none">Blog</a> &rsaquo; <a href="/blog/category/${catSlug}" style="color:#3B82F6;text-decoration:none">${post.category}</a> &rsaquo; <span>${post.title}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<span style="display:inline-block;padding:0.25rem 0.75rem;background-color:#dbeafe;color:#1e40af;border-radius:9999px;font-size:0.75rem;font-weight:600;margin-bottom:1rem">${post.category}</span>
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${post.title}</h1>
<div style="color:#6b7280;font-size:0.875rem"><span>${post.readTime}</span> &middot; <span>${date}</span></div>
</div>
</section>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem 1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.875rem;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Quick Answer</p>
<p style="font-size:1.125rem;line-height:1.6;color:#111827;font-weight:500">${post.excerpt}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<article style="max-width:48rem;margin:0 auto">
${contentToHtml(post.content)}
</article>
</section>
${howToHtml}
${faqHtml}
${categoryLinkHtml}
${relatedHtml}
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
<span style="font-size:0.75rem;color:#3B82F6;font-weight:600">${post.category}</span>
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

// ---------- Category page body ----------

function categoryPageBodyHtml(categoryName: string, slug: string): string {
  const posts = blogPosts.filter((p) => slugifyCategory(p.category) === slug);
  const cards = posts
    .map(
      (post) => `<div>
<span style="font-size:0.75rem;color:#3B82F6;font-weight:600">${post.category}</span>
<h2 style="margin-top:0.25rem"><a href="/blog/${post.slug}">${post.title}</a></h2>
<p style="font-size:0.875rem;color:#4b5563;margin-top:0.25rem">${post.excerpt}</p>
<div style="font-size:0.75rem;color:#6b7280;margin-top:0.5rem"><span>${post.readTime}</span></div>
</div>`
    )
    .join("\n");

  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/blog" style="color:#3B82F6;text-decoration:none">Blog</a> &rsaquo; <span>${categoryName}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;margin-bottom:1rem">${categoryName} Articles</h1>
<p style="font-size:1.125rem;color:#4b5563">${posts.length} articles on ${categoryName.toLowerCase()} for corporate managers building invisible businesses.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<div style="display:grid;gap:2rem">
${cards}
</div>
</div>
</section>
</div>`;
}

// ---------- Glossary page body ----------

function glossaryPageBodyHtml(term: (typeof glossaryTerms)[0]): string {
  let faqHtml = "";
  if (term.faqs && term.faqs.length > 0) {
    const items = term.faqs
      .map((f) => `<div><h3>${f.question}</h3><p>${f.answer}</p></div>`)
      .join("\n");
    faqHtml = `
<section style="padding:3rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">Frequently Asked Questions</h2>
${items}
</div>
</section>`;
  }

  let relatedHtml = "";
  if (term.relatedTerms && term.relatedTerms.length > 0) {
    const links = term.relatedTerms
      .map(
        (slug) =>
          `<a href="/glossary/${slug}" style="display:inline-block;padding:0.5rem 1rem;background-color:#e0e7ff;color:#3730a3;border-radius:0.5rem;text-decoration:none;font-weight:500">${slug.replace(/-/g, " ").replace(/^what is /, "")}</a>`
      )
      .join(" ");
    relatedHtml = `
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">Related Terms</h2>
<div>${links}</div>
</div>
</section>`;
  }

  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/glossary" style="color:#3B82F6;text-decoration:none">Glossary</a> &rsaquo; <span>${term.term}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<span style="display:inline-block;padding:0.25rem 0.75rem;background-color:#dbeafe;color:#1e40af;border-radius:9999px;font-size:0.75rem;font-weight:600;margin-bottom:1rem">${term.category}</span>
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2">What is ${term.term}?</h1>
</div>
</section>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.875rem;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Definition</p>
<p style="font-size:1.125rem;line-height:1.6;color:#111827">${term.definition}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<article style="max-width:48rem;margin:0 auto">
<p style="font-size:1rem;line-height:1.7;color:#1f2937">${term.detailed}</p>
</article>
</section>
${faqHtml}
${relatedHtml}
</div>`;
}

// ---------- Comparison page body ----------

function comparisonPageBodyHtml(comp: (typeof comparisons)[0]): string {
  const tableRows = comp.table
    .map(
      (row) =>
        `<tr><td style="padding:0.75rem;font-weight:600;border-bottom:1px solid #e5e7eb">${row.criteria}</td><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb">${row.optionA}</td><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb">${row.optionB}</td></tr>`
    )
    .join("\n");

  let faqHtml = "";
  if (comp.faqs && comp.faqs.length > 0) {
    const items = comp.faqs
      .map((f) => `<div><h3>${f.question}</h3><p>${f.answer}</p></div>`)
      .join("\n");
    faqHtml = `
<section style="padding:3rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">Frequently Asked Questions</h2>
${items}
</div>
</section>`;
  }

  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/blog" style="color:#3B82F6;text-decoration:none">Blog</a> &rsaquo; <span>${comp.optionA} vs ${comp.optionB}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${comp.h1}</h1>
<p style="font-size:1.125rem;color:#4b5563">${comp.intro}</p>
</div>
</section>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.875rem;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Quick Summary</p>
<p style="font-size:1.0625rem;line-height:1.6;color:#111827">${comp.summary}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto;overflow-x:auto">
<table style="width:100%;border-collapse:collapse;font-size:0.875rem">
<thead><tr style="background-color:#0f172a;color:white">
<th style="padding:0.75rem;text-align:left">Criteria</th>
<th style="padding:0.75rem;text-align:left">${comp.optionA}</th>
<th style="padding:0.75rem;text-align:left">${comp.optionB}</th>
</tr></thead>
<tbody>
${tableRows}
</tbody>
</table>
</div>
</section>
<section style="padding:3rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem">The Verdict</h2>
<div style="display:grid;gap:1.5rem">
<div style="padding:1.5rem;background-color:#f0fdf4;border-left:4px solid #22c55e;border-radius:0.5rem">
<h3 style="font-weight:700;margin-bottom:0.5rem">Choose ${comp.optionA} if:</h3>
<p>${comp.verdictA}</p>
</div>
<div style="padding:1.5rem;background-color:#fef3c7;border-left:4px solid #f59e0b;border-radius:0.5rem">
<h3 style="font-weight:700;margin-bottom:0.5rem">Choose ${comp.optionB} if:</h3>
<p>${comp.verdictB}</p>
</div>
</div>
</div>
</section>
${faqHtml}
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
  console.log("Injecting body content into pre-rendered HTML...");

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

  // Category pages
  const categories = [...new Set(blogPosts.map((p) => p.category))];
  for (const cat of categories) {
    const slug = slugifyCategory(cat);
    if (injectBody(resolve(DIST, "blog", "category", slug, "index.html"), categoryPageBodyHtml(cat, slug))) {
      console.log(`  /blog/category/${slug}`);
      count++;
    }
  }

  // Glossary pages
  for (const term of glossaryTerms) {
    if (injectBody(resolve(DIST, "glossary", term.slug, "index.html"), glossaryPageBodyHtml(term))) {
      console.log(`  /glossary/${term.slug}`);
      count++;
    }
  }

  // Comparison pages
  for (const comp of comparisons) {
    if (injectBody(resolve(DIST, "compare", comp.slug, "index.html"), comparisonPageBodyHtml(comp))) {
      console.log(`  /compare/${comp.slug}`);
      count++;
    }
  }

  console.log(`Done. Injected body content into ${count} pages.`);
}

main();
