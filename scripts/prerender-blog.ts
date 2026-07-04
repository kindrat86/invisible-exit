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
import { stateGuides } from "../src/data/state-guides.js";
import { industryIdeas } from "../src/data/industry-ideas.js";
import { bestToolsLists } from "../src/data/best-tools.js";
import { calculators } from "../src/data/calculators.js";
import { dataReports } from "../src/data/data-reports.js";
import { resources } from "../src/data/resources.js";
import { alternatives } from "../src/data/alternatives.js";
import { salaries } from "../src/data/salaries.js";
import { revenueMilestones } from "../src/data/revenue-milestones.js";
import { timelines } from "../src/data/timelines.js";
import { professionStacks } from "../src/data/profession-stacks.js";
import { costOfWaitingPages } from "../src/data/cost-of-waiting.js";
import { professionStatePages } from "../src/data/profession-states.js";
import { nonCompeteMatrix } from "../src/data/non-compete-matrix.js";

// ---------- Markdown-like content → HTML ----------

function bold(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

// Auto-link key terms to relevant pages for internal linking (first occurrence only)
function autoLinkContent(html: string): string {
  const linkMap: { pattern: RegExp; href: string; text: string }[] = [
    { pattern: /\bfreedom number\b/i, href: "/freedom", text: "freedom number" },
    { pattern: /\bmicro-SaaS\b/i, href: "/glossary/micro-saas", text: "micro-SaaS" },
    { pattern: /\bnon-compete clause\b/i, href: "/glossary/non-compete", text: "non-compete clause" },
    { pattern: /\banonymous LLC\b/i, href: "/guides/wyoming", text: "anonymous LLC" },
    { pattern: /\bidea validation\b/i, href: "/calculators/idea-validator", text: "idea validation" },
    { pattern: /\bfinancial independence\b/i, href: "/blog/category/financial-independence", text: "financial independence" },
    { pattern: /\bstealth ops\b/i, href: "/blog/category/stealth-operations", text: "stealth ops" },
  ];

  let result = html;
  for (const { pattern, href, text: linkText } of linkMap) {
    // Only link the first occurrence, and only if the exact text isn't already in an <a> tag
    const match = result.match(pattern);
    if (match && !result.includes(`href="${href}"`)) {
      const matchedText = match[0];
      result = result.replace(matchedText, `<a href="${href}" style="color:#3B82F6;text-decoration:none">${matchedText}</a>`);
    }
  }
  return result;
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
<div style="color:#6b7280;font-size:0.875rem"><span>${post.readTime}</span> &middot; <span>${date}</span> &middot; By <a href="/adrian" style="color:#3B82F6;text-decoration:none">Adrian</a>, Founder</div>
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
${autoLinkContent(contentToHtml(post.content))}
</article>
</section>
${howToHtml}
${faqHtml}
${categoryLinkHtml}
${relatedHtml}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.75rem;color:#9ca3af;line-height:1.5"><strong>Disclaimer:</strong> This article is for informational and educational purposes only and does not constitute legal, financial, or tax advice. The author is a pseudonymous business writer, not a licensed attorney, CPA, or financial advisor. Laws vary by jurisdiction and change frequently. Consult a qualified professional before making legal, financial, or business decisions. Invisible Exit is a set of software tools, not a law firm or financial advisory service.</p>
</div>
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

// ---------- Homepage body ----------

function homepageBodyHtml(): string {
  return `<div class="min-h-screen">
<section style="padding-top:6rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem;text-align:center">
<div style="max-width:56rem;margin:0 auto">
<h1 style="font-size:3rem;font-weight:800;line-height:1.1;margin-bottom:1.5rem">Build a Side Business While Employed — Invisibly</h1>
<p style="font-size:1.25rem;color:#4b5563;margin-bottom:2rem">5 AI-powered tools that help corporate managers build anonymous micro-SaaS businesses. Calculate your freedom number, validate ideas, stay invisible.</p>
<p style="font-size:0.875rem;color:#6b7280">From $0.97/month. No code required. Cancel anytime.</p>
</div>
</section>
<section style="padding:3rem 1.5rem">
<div style="max-width:56rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">Five Tools, One Subscription</h2>
<div style="display:grid;gap:1.5rem">
<div><h3 style="font-weight:700;font-size:1.125rem">FYM Dashboard</h3><p>Tracks your recurring revenue, churn, growth rate, and exit timeline across all your projects. Know exactly how much you need to quit.</p></div>
<div><h3 style="font-weight:700;font-size:1.125rem">Idea Pipeline</h3><p>500+ micro-SaaS ideas scored by industry fit, time investment, and revenue potential. AI-powered validation in 48 hours.</p></div>
<div><h3 style="font-weight:700;font-size:1.125rem">Stealth Ops Hub</h3><p>Entity separation, invisibility scoring, and compliance audit against common contract clauses including non-compete and IP assignment.</p></div>
<div><h3 style="font-weight:700;font-size:1.125rem">Launch Control</h3><p>Go-live automation designed for 5-hour weekends. Stripe integration, landing page generation, and launch sequence builder.</p></div>
<div><h3 style="font-weight:700;font-size:1.125rem">Brand Manager</h3><p>Faceless audience building with YouTube scripts, Reddit playbooks, and SEO content — all without using your real name.</p></div>
</div>
</div>
</section>
<section style="padding:3rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">Frequently Asked Questions</h2>
<div style="display:grid;gap:1.5rem">
<div><h3 style="font-weight:600;margin-bottom:0.5rem">What do I get for $0.97/month?</h3><p>Five AI-powered tools: FYM Dashboard, Idea Pipeline, Stealth Ops Hub, Launch Control, and Brand Manager. All five tools, one price.</p></div>
<div><h3 style="font-weight:600;margin-bottom:0.5rem">Does this violate my employment contract?</h3><p>Most contracts restrict competing in your employer's industry or using company resources. Invisible Exit is designed around those constraints. The Stealth Ops Hub runs a compliance audit against common contract clauses.</p></div>
<div><h3 style="font-weight:600;margin-bottom:0.5rem">Can my employer find out?</h3><p>The Stealth Ops Hub includes entity separation guidance, compliance audit tools, and digital footprint cleanup. Your business operates under a completely separate legal structure.</p></div>
<div><h3 style="font-weight:600;margin-bottom:0.5rem">Do I need to know how to code?</h3><p>No. All tools use AI-powered automation. The Idea Pipeline validates concepts, Launch Control handles deployment, and Brand Manager generates content — all without coding.</p></div>
<div><h3 style="font-weight:600;margin-bottom:0.5rem">How much can I make?</h3><p>A micro-SaaS charging $29/month with 138 customers generates $4,000/month in recurring revenue. The FYM Dashboard calculates your specific freedom number based on your expenses.</p></div>
</div>
</div>
</section>
<section style="padding:3rem 1.5rem;text-align:center">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem">Ready to Build Your Invisible Exit?</h2>
<p style="color:#4b5563;margin-bottom:2rem">Start with the Freedom Number calculator. See exactly how close you are.</p>
<a href="/dashboard" style="display:inline-block;padding:1rem 2rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Get Started for $0.97</a>
</div>
</section>
<section style="padding:3rem 1.5rem;background-color:#f0f9ff">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem;text-align:center">What Members Say</h2>
<div style="display:grid;gap:1.5rem">
<div style="padding:1.5rem;background:white;border-radius:0.75rem;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
<p style="font-style:italic;color:#1f2937;margin-bottom:0.75rem">"The freedom number calculator showed me I was 18 months away from being able to leave my VP role. Having that timeline made the side work feel real instead of hopeless."</p>
<p style="font-weight:600;font-size:0.875rem">— Sarah K., Finance Director</p>
</div>
<div style="padding:1.5rem;background:white;border-radius:0.75rem;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
<p style="font-style:italic;color:#1f2937;margin-bottom:0.75rem">"I validated my micro-SaaS idea in 48 hours and had my first paying customer within 3 weeks. The stealth ops hub gave me confidence that my employer would never find out."</p>
<p style="font-weight:600;font-size:0.875rem">— Marcus T., Product Manager</p>
</div>
<div style="padding:1.5rem;background:white;border-radius:0.75rem;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
<p style="font-style:italic;color:#1f2937;margin-bottom:0.75rem">"As someone with zero coding background, the AI-powered tools let me build something real. I went from idea to $2,300/month recurring revenue in 7 months."</p>
<p style="font-weight:600;font-size:0.875rem">— Jennifer L., Operations Manager</p>
</div>
</div>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.875rem;color:#6b7280">Trusted by corporate managers from Fortune 500 companies. $0.97/month. Cancel anytime. No credit card required to start.</p>
</div>
</section>
</div>`;
}

// ---------- About page body ----------

function aboutPageBodyHtml(): string {
  return `<div class="min-h-screen">
<section style="padding-top:6rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;margin-bottom:1rem">About Invisible Exit</h1>
<p style="font-size:1.125rem;color:#4b5563">Built by a corporate manager, for corporate managers who want to build something of their own — without risking their day job.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Who Built This</h2>
<p style="line-height:1.7;color:#1f2937">Invisible Exit was created by Adrian, a corporate managing director who spent years building micro-SaaS businesses on the side. After reaching the point where recurring revenue covered his living expenses, he documented the entire process — the tools, the frameworks, the legal considerations, and the psychology of managing two careers simultaneously.</p>
<p style="line-height:1.7;color:#1f2937;margin-top:1rem">The platform codifies everything learned through trial and error: how to validate ideas without quitting your job, how to operate anonymously, how to manage legal risks, and how to know when your side income is sufficient to make the jump.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">The Methodology</h2>
<p style="line-height:1.7;color:#1f2937">Every tool in Invisible Exit is grounded in real-world experience:</p>
<ul style="line-height:1.7;color:#1f2937;padding-left:1.5rem;margin-top:0.5rem">
<li><strong>Freedom Number Calculator:</strong> Based on the 4% safe withdrawal rate, adjusted for recurring revenue compounding.</li>
<li><strong>Idea Validation:</strong> Uses a scoring framework tested across 50+ micro-SaaS launches.</li>
<li><strong>Stealth Operations:</strong> Built around actual employment contract analysis and entity separation strategies.</li>
<li><strong>Launch Automation:</strong> Designed for the constraint of 5-10 hours per week — not full-time startup hours.</li>
</ul>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">What We Believe</h2>
<ul style="line-height:1.7;color:#1f2937;padding-left:1.5rem">
<li>You should not have to quit your job to start building.</li>
<li>Recurring revenue changes how you think about work permanently.</li>
<li>Anonymity is a feature, not a limitation — it protects you while you build.</li>
<li>AI tools make it possible for one person to do what took a team five years ago.</li>
<li>The best time to start was three years ago. The second best time is this weekend.</li>
</ul>
</div>
</section>
</div>`;
}

// ---------- State guide body ----------

function stateGuideBodyHtml(g: typeof stateGuides[0]): string {
  const tips = g.tips.map((t: string, i: number) => `<li>${t}</li>`).join("\n");
  const faqs = g.faqs.map((f: { question: string; answer: string }) =>
    `<div><h3>${f.question}</h3><p>${f.answer}</p></div>`).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> › <a href="/guides" style="color:#3B82F6;text-decoration:none">State Guides</a> › <span>${g.state}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;margin-bottom:1rem">Starting a Side Business in ${g.state}</h1>
<p style="font-size:1.125rem;color:#4b5563">${g.bestFor}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<table style="width:100%;border-collapse:collapse;font-size:0.875rem">
<tr><td style="padding:0.5rem;font-weight:600;border-bottom:1px solid #e5e7eb">LLC Filing Fee</td><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb">$${g.llcFilingFee}</td></tr>
<tr><td style="padding:0.5rem;font-weight:600;border-bottom:1px solid #e5e7eb">Annual Report Fee</td><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb">$${g.annualReportFee}</td></tr>
<tr><td style="padding:0.5rem;font-weight:600;border-bottom:1px solid #e5e7eb">Non-Compete Status</td><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb">${g.nonCompeteNotes}</td></tr>
<tr><td style="padding:0.5rem;font-weight:600;border-bottom:1px solid #e5e7eb">State Income Tax</td><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb">${g.stateIncomeTaxRate}</td></tr>
<tr><td style="padding:0.5rem;font-weight:600;border-bottom:1px solid #e5e7eb">Anonymous LLC</td><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb">${g.anonymousLlcAllowed ? "Yes" : "No"}</td></tr>
<tr><td style="padding:0.5rem;font-weight:600;border-bottom:1px solid #e5e7eb">Processing Time</td><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb">${g.processingTime}</td></tr>
</table>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Tips for ${g.state} Founders</h2>
<ul style="line-height:1.7;color:#1f2937;padding-left:1.5rem">${tips}</ul>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">FAQs</h2>
${faqs}
</div>
</section>
</div>`;
}

// ---------- Industry ideas body ----------

function industryIdeasBodyHtml(d: typeof industryIdeas[0]): string {
  const ideas = d.ideas.map((idea: any) =>
    `<div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem;margin-bottom:1rem">
<h3 style="font-weight:700">${idea.name} <span style="font-size:0.75rem;color:#6b7280">(${idea.difficulty})</span></h3>
<p style="color:#4b5563;font-size:0.875rem">${idea.description}</p>
<p style="font-size:0.75rem;color:#6b7280">Target: ${idea.targetCustomer} | Pricing: ${idea.pricing} | Potential: ${idea.revenuePotential}</p>
</div>`).join("\n");
  const skills = d.transferableSkills.map((s: string) => `<span style="display:inline-block;padding:0.25rem 0.75rem;background:#e0e7ff;color:#3730a3;border-radius:9999px;font-size:0.75rem;margin:0.25rem">${s}</span>`).join(" ");
  const faqs = d.faqs.map((f: { question: string; answer: string }) =>
    `<div><h3>${f.question}</h3><p>${f.answer}</p></div>`).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> › <a href="/ideas" style="color:#3B82F6;text-decoration:none">Ideas</a> › <span>${d.profession}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800">Micro-SaaS Ideas for ${d.profession}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-top:0.5rem">${d.unfairAdvantage}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:1rem">Skills You Already Have</h2>
<div>${skills}</div>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:1rem">${d.ideas.length} Micro-SaaS Ideas</h2>
${ideas}
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#fef2f2">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;color:#dc2626;margin-bottom:0.5rem">What to Avoid</h2>
<p>${d.whatToAvoid}</p>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>
${faqs}
</div>
</section>
</div>`;
}

// ---------- Best tools body ----------

function bestToolsBodyHtml(list: typeof bestToolsLists[0]): string {
  const tools = list.tools.map((t: any) =>
    `<div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem;margin-bottom:1rem">
<h3 style="font-weight:700">${t.name} <span style="color:#f59e0b">${"★".repeat(Math.round(t.rating))}</span></h3>
<p style="color:#6b7280;font-size:0.875rem">${t.bestFor}</p>
<p style="font-size:0.75rem;font-weight:600;color:#059669">Pricing: ${t.pricing}</p>
<p style="font-size:0.75rem;color:#059669">Pros: ${t.pros.join(", ")}</p>
<p style="font-size:0.75rem;color:#dc2626">Cons: ${t.cons.join(", ")}</p>
</div>`).join("\n");
  const faqs = list.faqs.map((f: { question: string; answer: string }) =>
    `<div><h3>${f.question}</h3><p>${f.answer}</p></div>`).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> › <a href="/best" style="color:#3B82F6;text-decoration:none">Best Tools</a> › <span>${list.title}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800">${list.h1}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-top:0.5rem">${list.intro}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
${tools}
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#eff6ff">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:0.5rem">How to Choose</h2>
<p>${list.buyingGuide}</p>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>
${faqs}
</div>
</section>
</div>`;
}

// ---------- Calculator body ----------

function calculatorBodyHtml(calc: typeof calculators[0]): string {
  const faqs = calc.faqs.map((f: { question: string; answer: string }) =>
    `<div><h3>${f.question}</h3><p>${f.answer}</p></div>`).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> › <a href="/calculators" style="color:#3B82F6;text-decoration:none">Calculators</a> › <span>${calc.h1}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800">${calc.h1}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-top:0.5rem">${calc.intro}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:0.5rem">The Formula</h2>
<p style="font-family:monospace;background:#0f172a;color:#4ade80;padding:1rem;border-radius:0.5rem">${calc.formula}</p>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#eff6ff">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:0.5rem">Example</h2>
<p>${calc.example.scenario}</p>
<p style="font-weight:600">${calc.example.result}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:0.5rem">How This Works</h2>
<p style="line-height:1.7">${calc.explanation}</p>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>
${faqs}
</div>
</section>
</div>`;
}

// ---------- Data report body ----------

function dataReportBodyHtml(report: typeof dataReports[0]): string {
  const stats = report.dataPoints.map((dp: any) =>
    `<div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem">
<p style="font-size:0.75rem;color:#6b7280">${dp.metric}</p>
<p style="font-size:1.5rem;font-weight:700;color:#2563eb">${dp.value}</p>
<p style="font-size:0.75rem;color:#6b7280">${dp.context}</p>
</div>`).join("\n");
  const findings = report.keyFindings.map((f: string, i: number) =>
    `<li style="margin-bottom:0.5rem">${i + 1}. ${f}</li>`).join("\n");
  const tables = report.tables.map((table: any) => {
    const headers = table.headers.map((h: string) => `<th style="padding:0.5rem;text-align:left;background:#0f172a;color:white">${h}</th>`).join("");
    const rows = table.rows.map((row: string[]) =>
      `<tr>${row.map((c: string) => `<td style="padding:0.5rem;border-bottom:1px solid #e5e7eb">${c}</td>`).join("")}</tr>`).join("\n");
    return `<h3 style="font-weight:700;margin:1.5rem 0 0.5rem">${table.title}</h3>
<table style="width:100%;border-collapse:collapse;font-size:0.875rem"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  }).join("\n");
  const takeaways = report.takeaways.map((t: string) => `<li style="color:#059669;margin-bottom:0.25rem">✓ ${t}</li>`).join("\n");
  const faqs = report.faqs.map((f: { question: string; answer: string }) =>
    `<div><h3>${f.question}</h3><p>${f.answer}</p></div>`).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> › <a href="/data" style="color:#3B82F6;text-decoration:none">Research</a> › <span>${report.title}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800">${report.h1}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-top:0.5rem">${report.intro}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:1rem">Key Statistics</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem">${stats}</div>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:0.5rem">Key Findings</h2>
<ul>${findings}</ul>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">${tables}</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f0fdf4">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:0.5rem">Actionable Takeaways</h2>
<ul>${takeaways}</ul>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>
${faqs}
</div>
</section>
</div>`;
}

// ---------- Resource body ----------

function resourceBodyHtml(resource: typeof resources[0]): string {
  const steps = resource.steps.map((step: any, i: number) =>
    `<div style="margin-bottom:1rem;border-left:3px solid #3B82F6;padding-left:1rem">
<h3 style="font-weight:600">${i + 1}. ${step.title}</h3>
<p style="color:#4b5563;font-size:0.875rem">${step.description}</p>
<p style="font-size:0.75rem;color:#6b7280">Time: ${step.timeRequired} | Category: ${step.category}</p>
</div>`).join("\n");
  const tools = resource.tools.map((t: any) =>
    `<tr><td style="padding:0.5rem;font-weight:600">${t.name}</td><td style="padding:0.5rem">${t.purpose}</td><td style="padding:0.5rem">${t.cost}</td></tr>`).join("\n");
  const mistakes = resource.commonMistakes.map((m: string) => `<li style="color:#dc2626;margin-bottom:0.25rem">✗ ${m}</li>`).join("\n");
  const faqs = resource.faqs.map((f: { question: string; answer: string }) =>
    `<div><h3>${f.question}</h3><p>${f.answer}</p></div>`).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> › <a href="/resources" style="color:#3B82F6;text-decoration:none">Resources</a> › <span>${resource.title}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800">${resource.h1}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-top:0.5rem">${resource.intro}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:1rem">The ${resource.steps.length}-Step Process</h2>
${steps}
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:0.5rem">Recommended Tools</h2>
<table style="width:100%;border-collapse:collapse;font-size:0.875rem">
<thead><tr style="background:#0f172a;color:white"><th style="padding:0.5rem;text-align:left">Tool</th><th style="padding:0.5rem;text-align:left">Purpose</th><th style="padding:0.5rem;text-align:left">Cost</th></tr></thead>
<tbody>${tools}</tbody></table>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#fef2f2">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;color:#dc2626;margin-bottom:0.5rem">Common Mistakes</h2>
<ul>${mistakes}</ul>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>
${faqs}
</div>
</section>
</div>`;
}

// ---------- pSEO body generators ----------

function alternativesBodyHtml(item: typeof alternatives[0]): string {
  const altList = item.alternatives
    .map((a: { name: string; why: string }) => `<li><strong>${a.name}</strong> — ${a.why}</li>`)
    .join("\n");
  const faqs = (item.faqs || [])
    .map((f: { question: string; answer: string }) => `<div><h3>${f.question}</h3><p>${f.answer}</p></div>`)
    .join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/blog" style="color:#3B82F6;text-decoration:none">Alternatives</a> &rsaquo; <span>${item.h1}</span>
</nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:1.5rem">${item.intro}</p>
</div></section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Why Switch From ${item.product}?</h2>
<p style="color:#4b5563;margin-bottom:1.5rem">${item.whySwitch}</p>
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Top Alternatives</h2>
<ul style="display:flex;flex-direction:column;gap:1rem">${altList}</ul>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Verdict</h2>
<p style="color:#4b5563">${item.verdict}</p>
</div></section>${faqs ? `<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>` : ""}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.75rem;color:#9ca3af"><strong>Disclaimer:</strong> For informational purposes only. Not legal, financial, or tax advice. Consult a professional.</p>
</div></section>
</div>`;
}

function salaryBodyHtml(item: typeof salaries[0]): string {
  const freedomUrl = `/cost-of-waiting/${item.slug}`;
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/blog" style="color:#3B82F6;text-decoration:none">Salaries</a> &rsaquo; <span>${item.h1}</span>
</nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:1.5rem">Average salary: <strong>${item.avgSalary}</strong> (range: ${item.salaryRange})</p>
<p style="color:#4b5563">${item.intro}</p>
</div></section>
<section style="padding:2rem 1.5rem;background-color:#eff6ff;text-align:center"><div style="max-width:48rem;margin:0 auto">
<p style="font-size:1.125rem;font-weight:700;color:#1e40af;margin-bottom:0.5rem">What Could ${item.avgSalary} Look Like as Passive Income?</p>
<p style="color:#4b5563;margin-bottom:1rem">See how much money you're leaving on the table by not starting your micro-SaaS today.</p>
<a href="${freedomUrl}" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Cost of Waiting &rarr;</a>
</div></section>
${item.tips ? `<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Side Business Tips for ${item.role}</h2><ul>${(item.tips || []).map((t: string) => `<li>${t}</li>`).join("")}</ul></div></section>` : ""}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.75rem;color:#9ca3af"><strong>Disclaimer:</strong> Salary estimates are general ranges. Individual compensation varies. Not financial advice.</p>
</div></section>
</div>`;
}

function milestoneBodyHtml(item: typeof revenueMilestones[0]): string {
  const tactics = item.tactics.map((t: { tactic: string; description: string; effort: string }) =>
    `<div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem"><h3 style="font-weight:600;margin-bottom:0.25rem">${t.tactic}</h3><p style="font-size:0.875rem;color:#4b5563">${t.description}</p><span style="font-size:0.75rem;color:#6b7280">Effort: ${t.effort}</span></div>`
  ).join("\n");
  const mistakes = (item.commonMistakes || []).map((m: string) => `<li>${m}</li>`).join("");
  const faqs = (item.faqs || []).map((f: {question:string; answer:string}) =>
    `<div><h3 style="font-weight:600">${f.question}</h3><p>${f.answer}</p></div>`
  ).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span>
</nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1>
<p style="color:#4b5563;margin-bottom:1rem">${item.intro}</p>
<p style="font-size:0.875rem;color:#6b7280">Time estimate: ${item.timeEstimate}</p>
</div></section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.5rem">What This Stage Means</h2>
<p style="color:#4b5563;margin-bottom:1.5rem">${item.whatThisMeans}</p>
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Key Tactics for Stage: ${item.stage} (${item.mrrRange})</h2>
<div style="display:flex;flex-direction:column;gap:1rem">${tactics}</div>
</div></section>${item.commonMistakes && item.commonMistakes.length ? `<section style="padding:2rem 1.5rem;background-color:#fef2f2"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;color:#dc2626;margin-bottom:0.5rem">Common Mistakes</h2><ul>${mistakes}</ul></div></section>` : ""}${faqs ? `<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>` : ""}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a>
</div></section>
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.75rem;color:#9ca3af"><strong>Disclaimer:</strong> Revenue milestones are illustrative projections, not guarantees. Individual results vary based on market, product, and execution.</p>
</div></section>
</div>`;
}

function timelineBodyHtml(item: typeof timelines[0]): string {
  const checks = (item.metricsToCheck || []).map((m:string) => `<li>${m}</li>`).join("");
  const common = (item.commonAtThisStage || []).map((m:string) => `<li>${m}</li>`).join("");
  const mistakes = (item.mistakes || []).map((m:string) => `<li>${m}</li>`).join("");
  const faqs = (item.faqs || []).map((f:{question:string;answer:string}) =>
    `<div><h3 style="font-weight:600">${f.question}</h3><p>${f.answer}</p></div>`
  ).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span>
</nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1>
<p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p>
</div></section>
<section style="padding:2rem 1.5rem;background-color:#f0fdf4"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Milestones This Month</h2>
<ul style="display:flex;flex-direction:column;gap:0.75rem">${item.milestones.map((m:{milestone:string;completed:boolean}) =>
    `<li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:${m.completed ? '#22c55e' : '#9ca3af'};font-weight:700">${m.completed ? '✓' : '○'}</span><span>${m.milestone}</span></li>`
  ).join("")}</ul>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
${checks ? `<div><h2 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem">Metrics to Check</h2><ul>${checks}</ul></div>` : ""}
${common ? `<div style="margin-top:1.5rem"><h2 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem">What's Normal at This Stage</h2><ul>${common}</ul></div>` : ""}
${mistakes ? `<div style="margin-top:1.5rem"><h2 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:#dc2626">Mistakes to Avoid</h2><ul>${mistakes}</ul></div>` : ""}
<p style="margin-top:1.5rem;font-weight:600">Next up: ${item.whatsNext}</p>
</div></section>${faqs ? `<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>` : ""}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a>
</div></section>
</div>`;
}

function toolStackBodyHtml(item: typeof professionStacks[0]): string {
  const rows = item.stack.map((s: {category:string; tool:string; why:string; cost:string}) =>
    `<tr><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb"><strong>${s.tool}</strong></td><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb">${s.category}</td><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb">${s.why}</td><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb">${s.cost}</td></tr>`
  ).join("\n");
  const faqs = (item.faqs || []).map((f:{question:string;answer:string}) =>
    `<div><h3 style="font-weight:600">${f.question}</h3><p>${f.answer}</p></div>`
  ).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:64rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/best" style="color:#3B82F6;text-decoration:none">Tools</a> &rsaquo; <span>${item.h1}</span>
</nav>
<section style="padding:3rem 1.5rem"><div style="max-width:64rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1>
<p style="color:#4b5563;margin-bottom:1rem">${item.intro}</p>
<p style="font-size:0.875rem;color:#6b7280">Total monthly cost: ${item.totalMonthlyCost} | Replaces: ${item.replaces} | Weekly commitment: ${item.weeklyTimeCommitment}</p>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:64rem;margin:0 auto">
<table style="width:100%;border-collapse:collapse;font-size:0.875rem"><thead><tr style="background:#0f172a;color:white"><th style="padding:0.5rem;text-align:left">Tool</th><th style="padding:0.5rem;text-align:left">Category</th><th style="padding:0.5rem;text-align:left">Why</th><th style="padding:0.5rem;text-align:left">Cost</th></tr></thead><tbody>${rows}</tbody></table>
</div></section>${faqs ? `<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>` : ""}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a>
</div></section>
</div>`;
}

function costOfWaitingBodyHtml(item: typeof costOfWaitingPages[0]): string {
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span>
</nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1>
<p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p>
</div></section>
<section style="padding:2rem 1.5rem;background-color:#eff6ff"><div style="max-width:48rem;margin:0 auto">
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));gap:1rem">
<div style="padding:1rem;background:white;border-radius:0.5rem;text-align:center"><p style="font-size:0.75rem;color:#6b7280">Salary Earned</p><p style="font-size:1.5rem;font-weight:700">${item.salaryEarned}</p></div>
<div style="padding:1rem;background:white;border-radius:0.5rem;text-align:center"><p style="font-size:0.75rem;color:#6b7280">Potential Micro-SaaS Revenue</p><p style="font-size:1.5rem;font-weight:700;color:#22c55e">${item.microSaasRevenue}</p></div>
<div style="padding:1rem;background:white;border-radius:0.5rem;text-align:center"><p style="font-size:0.75rem;color:#6b7280">Opportunity Cost</p><p style="font-size:1.5rem;font-weight:700;color:#ef4444">${item.opportunityCost}</p></div>
${item.equityVested ? `<div style="padding:1rem;background:white;border-radius:0.5rem;text-align:center"><p style="font-size:0.75rem;color:#6b7280">Equity Vested</p><p style="font-size:1.5rem;font-weight:700">${item.equityVested}</p></div>` : ""}
</div>
</div></section>
<section style="padding:2rem 1.5rem;text-align:center"><div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a>
</div></section>
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.75rem;color:#9ca3af"><strong>Disclaimer:</strong> Cost-of-waiting projections are illustrative. Actual returns depend on product, market, and execution.</p>
</div></section>
</div>`;
}

function nonCompeteBodyHtml(item: typeof nonCompeteMatrix[0]): string {
  const faqs = (item.faqs || []).map((f:{question:string;answer:string}) =>
    `<div><h3 style="font-weight:600">${f.question}</h3><p>${f.answer}</p></div>`
  ).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span>
</nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1>
<p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p>
</div></section>
<section style="padding:2rem 1.5rem;background-color:#f0fdf4"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem">Verdict</h2>
<p>${item.verdict}</p>
</div></section>
<section style="padding:2rem 1.5rem;background-color:#eff6ff"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem">Key Considerations for ${item.profession} in ${item.state}</h2>
<p>${item.analysis}</p>
</div></section>${faqs ? `<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>` : ""}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto">
<a href="/guides/${item.state.toLowerCase()}" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Read the ${item.state} State Guide &rarr;</a>
</div></section>
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.75rem;color:#9ca3af"><strong>Legal Disclaimer:</strong> Non-compete information reflects general enforcement patterns. Non-compete law is rapidly evolving. This is NOT legal advice. Consult a licensed employment attorney for your specific situation.</p>
</div></section>
</div>`;
}

function professionStateBodyHtml(item: typeof professionStatePages[0]): string {
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span>
</nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1>
<p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p>
</div></section>
<section style="padding:2rem 1.5rem;background-color:#f0fdf4"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem">The Opportunity</h2>
<p>${item.opportunity}</p>
</div></section>
${item.challenges ? `<section style="padding:2rem 1.5rem;background-color:#fef2f2"><div style="max-width:48rem;margin:0 auto"><h2 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem">Challenges</h2><p>${item.challenges}</p></div></section>` : ""}
${item.executionAdvice ? `<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem">Execution Advice</h2><p>${item.executionAdvice}</p></div></section>` : ""}
${item.faqs && item.faqs.length ? `<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>${item.faqs.map((f:{question:string;answer:string}) => `<div><h3 style="font-weight:600">${f.question}</h3><p>${f.answer}</p></div>`).join("\n")}</div></section>` : ""}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a>
</div></section>
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.75rem;color:#9ca3af"><strong>Disclaimer:</strong> For informational purposes only. Not legal, financial, or tax advice. State regulations and non-compete laws change frequently.</p>
</div></section>
</div>`;
}

function main() {
  console.log("Injecting body content into pre-rendered HTML...");

  let count = 0;

  // Homepage
  if (injectBody(resolve(DIST, "index.html"), homepageBodyHtml())) {
    console.log("  /");
    count++;
  }

  // About page
  if (injectBody(resolve(DIST, "about", "index.html"), aboutPageBodyHtml())) {
    console.log("  /about");
    count++;
  }

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

  // State guide pages
  for (const guide of stateGuides) {
    if (injectBody(resolve(DIST, "guides", guide.slug, "index.html"), stateGuideBodyHtml(guide))) {
      count++;
    }
  }

  // Industry ideas pages
  for (const idea of industryIdeas) {
    if (injectBody(resolve(DIST, "ideas", idea.slug, "index.html"), industryIdeasBodyHtml(idea))) {
      count++;
    }
  }

  // Best tools pages
  for (const list of bestToolsLists) {
    if (injectBody(resolve(DIST, "best", list.slug, "index.html"), bestToolsBodyHtml(list))) {
      count++;
    }
  }

  // Calculator pages
  for (const calc of calculators) {
    if (injectBody(resolve(DIST, "calculators", calc.slug, "index.html"), calculatorBodyHtml(calc))) {
      count++;
    }
  }

  // Data report pages
  for (const report of dataReports) {
    if (injectBody(resolve(DIST, "data", report.slug, "index.html"), dataReportBodyHtml(report))) {
      count++;
    }
  }

  // Resource pages
  for (const resource of resources) {
    if (injectBody(resolve(DIST, "resources", resource.slug, "index.html"), resourceBodyHtml(resource))) {
      count++;
    }
  }

  // ── pSEO page types (Greg Isenberg expansion) ──

  // Alternatives
  for (const item of alternatives) {
    if (injectBody(resolve(DIST, "alternatives", item.slug, "index.html"), alternativesBodyHtml(item))) {
      console.log(`  /alternatives/${item.slug}`);
      count++;
    }
  }

  // Salaries
  for (const item of salaries) {
    if (injectBody(resolve(DIST, "salaries", item.slug, "index.html"), salaryBodyHtml(item))) {
      console.log(`  /salaries/${item.slug}`);
      count++;
    }
  }

  // Revenue Milestones
  for (const item of revenueMilestones) {
    if (injectBody(resolve(DIST, "milestones", item.slug, "index.html"), milestoneBodyHtml(item))) {
      console.log(`  /milestones/${item.slug}`);
      count++;
    }
  }

  // Timelines
  for (const item of timelines) {
    if (injectBody(resolve(DIST, "timeline", item.slug, "index.html"), timelineBodyHtml(item))) {
      console.log(`  /timeline/${item.slug}`);
      count++;
    }
  }

  // Profession Tool Stacks
  for (const item of professionStacks) {
    if (injectBody(resolve(DIST, "stack", item.slug, "index.html"), toolStackBodyHtml(item))) {
      console.log(`  /stack/${item.slug}`);
      count++;
    }
  }

  // Cost of Waiting
  for (const item of costOfWaitingPages) {
    if (injectBody(resolve(DIST, "cost-of-waiting", item.slug, "index.html"), costOfWaitingBodyHtml(item))) {
      console.log(`  /cost-of-waiting/${item.slug}`);
      count++;
    }
  }

  // Non-Compete Matrix
  for (const item of nonCompeteMatrix) {
    if (injectBody(resolve(DIST, "non-compete", item.slug, "index.html"), nonCompeteBodyHtml(item))) {
      console.log(`  /non-compete/${item.slug}`);
      count++;
    }
  }

  // Profession × State pages (/ideas/:profession/in/:state)
  for (const item of professionStatePages) {
    // Slug is like "for-accountants-in-texas" — need to extract profession+state
    const parts = item.slug.replace("for-", "").split("-in-");
    if (parts.length === 2) {
      const profSlug = `for-${parts[0]}`;
      const stateSlug = parts[1];
      if (injectBody(resolve(DIST, "ideas", profSlug, "in", stateSlug, "index.html"), professionStateBodyHtml(item))) {
        console.log(`  /ideas/${profSlug}/in/${stateSlug}`);
        count++;
      }
    }
  }

  console.log(`Done. Injected body content into ${count} pages.`);
}

main();
