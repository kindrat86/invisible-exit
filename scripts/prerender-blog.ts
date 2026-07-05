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
import { professionMistakes } from "../src/data/profession-mistakes.js";
import { redditStrategies } from "../src/data/reddit-strategies.js";
import { pricingModels } from "../src/data/pricing-models.js";
import { breakEvenPages } from "../src/data/break-even.js";
import { professionVsCareer } from "../src/data/profession-vs-career.js";
import { firstYearEntries } from "../src/data/first-year.js";
import { toolCrossReference } from "../src/data/tool-cross-reference.js";
import { aiToolProfessionPages } from "../src/data/ai-tool-professions.js";
import { budgetPages } from "../src/data/budget-pages.js";
import { hoursPages } from "../src/data/hours-pages.js";
import { toolAlternatives } from "../src/data/tool-alternatives.js";
import { saasBlueprints } from "../src/data/saas-blueprints.js";
import { revenueRoadmaps } from "../src/data/revenue-roadmaps.js";

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

  // Content image (SEO-critical: inline SVG diagram with descriptive alt text)
  const altText = `${post.title} — visual summary diagram from Invisible Exit`;
  const categoryColors: Record<string, { bg: string; accent: string; text: string }> = {
    "Financial Independence": { bg: "#eff6ff", accent: "#3b82f6", text: "#1e40af" },
    "Stealth Operations": { bg: "#f0fdf4", accent: "#22c55e", text: "#15803d" },
    "Micro-SaaS": { bg: "#faf5ff", accent: "#a855f7", text: "#7e22ce" },
    "Audience Building": { bg: "#fff7ed", accent: "#f97316", text: "#c2410c" },
    "AI Tools": { bg: "#ecfdf5", accent: "#10b981", text: "#047857" },
    "Exit Planning": { bg: "#fef2f2", accent: "#ef4444", text: "#b91c1c" },
    "Strategy": { bg: "#f0f9ff", accent: "#0ea5e9", text: "#0369a1" },
    "Time Management": { bg: "#fffbeb", accent: "#f59e0b", text: "#b45309" },
    "Validation": { bg: "#fdf4ff", accent: "#d946ef", text: "#a21caf" },
    "Growth": { bg: "#f0fdf4", accent: "#16a34a", text: "#15803d" },
  };
  const colors = categoryColors[post.category] || { bg: "#eff6ff", accent: "#3b82f6", text: "#1e40af" };
  const shortTitle = post.title.length > 60 ? post.title.substring(0, 57) + "..." : post.title;
  const contentImageHtml = `
<figure style="margin:0;padding:0 1.5rem 2rem;max-width:48rem;margin-left:auto;margin-right:auto">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" role="img" aria-label="${altText}" style="width:100%;height:auto;border-radius:0.75rem;border:1px solid #e5e7eb">
<rect width="800" height="300" fill="${colors.bg}"/>
<rect x="0" y="0" width="800" height="6" fill="${colors.accent}"/>
<text x="40" y="50" font-family="Inter,sans-serif" font-size="14" font-weight="600" fill="${colors.accent}" letter-spacing="1">${post.category.toUpperCase()}</text>
<text x="40" y="100" font-family="Inter,sans-serif" font-size="24" font-weight="800" fill="#111827">${shortTitle.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>
<line x1="40" y1="130" x2="760" y2="130" stroke="${colors.accent}" stroke-width="2" opacity="0.2"/>
<text x="40" y="170" font-family="Inter,sans-serif" font-size="15" fill="#4b5563" font-weight="500">${post.excerpt.substring(0, 100).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}${post.excerpt.length > 100 ? "..." : ""}</text>
<circle cx="60" cy="230" r="20" fill="${colors.accent}" opacity="0.1"/>
<text x="60" y="236" font-family="Inter,sans-serif" font-size="14" font-weight="700" fill="${colors.accent}" text-anchor="middle">IE</text>
<text x="95" y="226" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="#111827">Invisible Exit</text>
<text x="95" y="244" font-family="Inter,sans-serif" font-size="12" fill="#6b7280">${post.readTime} read</text>
<text x="760" y="270" font-family="Inter,sans-serif" font-size="11" fill="#9ca3af" text-anchor="end">invisibleexit.com/blog/${post.slug}</text>
</svg>
<figcaption style="font-size:0.875rem;color:#6b7280;margin-top:0.5rem;text-align:center;line-height:1.5">${altText}. Key concepts from this article: ${post.excerpt.substring(0, 120).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}.</figcaption>
</figure>`;

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
<div style="max-width:48rem;margin:0 auto" class="quick-answer">
<p style="font-size:0.875rem;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Quick Answer</p>
<p style="font-size:1.125rem;line-height:1.6;color:#111827;font-weight:500">${post.excerpt}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<article style="max-width:48rem;margin:0 auto">
${autoLinkContent(contentToHtml(post.content))}
</article>
</section>
${contentImageHtml}
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

  // Contextual content blocks to add depth for AEO/SEO
  const termLower = term.term.toLowerCase();
  const contextualHtml = `
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Why ${term.term} Matters for Employed Founders</h2>
<p style="line-height:1.7;color:#1f2937;margin-bottom:1rem">For corporate managers and employed professionals building a side business, understanding ${termLower} is essential. It directly affects how you structure your operations, manage legal risk, and plan your transition from employment to entrepreneurship. ${term.detailed}</p>
<p style="line-height:1.7;color:#1f2937;margin-bottom:1rem">The concept of ${termLower} is particularly relevant in the context of micro-SaaS businesses and invisible exits — where employed founders need to navigate employment contracts, non-compete clauses, and entity separation while building recurring revenue streams on the side.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">How to Apply This to Your Side Business</h2>
<p style="line-height:1.7;color:#1f2937;margin-bottom:0.75rem"><strong>Step 1 — Understand the legal context:</strong> ${term.term} interacts with your employment contract, tax obligations, and business formation requirements. Before making any decisions, review how this concept applies to your specific situation. If you are unsure, consult a qualified attorney or CPA.</p>
<p style="line-height:1.7;color:#1f2937;margin-bottom:0.75rem"><strong>Step 2 — Evaluate the impact on your stealth strategy:</strong> If you are building a micro-SaaS while employed, ${termLower} may affect your entity choice, your tax filings, or how visible your business is to your employer. Factor this into your operational planning.</p>
<p style="line-height:1.7;color:#1f2937;margin-bottom:0.75rem"><strong>Step 3 — Use the right tools:</strong> The Invisible Exit platform includes tools designed to help you navigate ${termLower} and related concepts. The Stealth Ops Hub runs compliance checks, the FYM Dashboard tracks financial implications, and the Idea Pipeline validates whether your idea aligns with your constraints.</p>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Common Mistakes to Avoid</h2>
<p style="line-height:1.7;color:#1f2937;margin-bottom:0.5rem">Many employed founders misunderstand ${termLower} and make avoidable mistakes:</p>
<ul style="line-height:1.8;color:#1f2937;padding-left:1.5rem;margin-bottom:1rem">
<li><strong>Ignoring the legal implications:</strong> ${term.term} has specific legal consequences. Do not assume it does not apply to your situation.</li>
<li><strong>Waiting too long to address it:</strong> The best time to understand ${termLower} is before you launch. Fixing mistakes after the fact is expensive.</li>
<li><strong>Confusing it with related concepts:</strong> ${term.term} is often confused with adjacent concepts. Read the related terms below to understand the distinctions.</li>
</ul>
<p style="line-height:1.7;color:#1f2937">If you want a structured approach to building a side business while employed, <a href="/freedom" style="color:#3B82F6">calculate your freedom number first</a> — it will clarify which concepts matter most for your specific timeline.</p>
</div>
</section>`;

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
<figure style="margin:0 auto 2rem;padding:0 1.5rem;max-width:48rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 250" role="img" aria-label="${term.term} definition diagram — key concept from Invisible Exit" style="width:100%;height:auto;border-radius:0.75rem;border:1px solid #e5e7eb">
<rect width="800" height="250" fill="#f8fafc"/>
<rect x="0" y="0" width="800" height="6" fill="#3b82f6"/>
<text x="40" y="45" font-family="Inter,sans-serif" font-size="14" font-weight="600" fill="#3b82f6" letter-spacing="1">DEFINITION</text>
<text x="40" y="90" font-family="Inter,sans-serif" font-size="28" font-weight="800" fill="#111827">${(term.term.length > 40 ? term.term.substring(0, 37) + "..." : term.term).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>
<line x1="40" y1="115" x2="760" y2="115" stroke="#3b82f6" stroke-width="2" opacity="0.2"/>
<text x="40" y="150" font-family="Inter,sans-serif" font-size="14" fill="#4b5563">${term.definition.substring(0, 95).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}${term.definition.length > 95 ? "..." : ""}</text>
<circle cx="60" cy="200" r="16" fill="#3b82f6" opacity="0.1"/>
<text x="60" y="205" font-family="Inter,sans-serif" font-size="12" font-weight="700" fill="#3b82f6" text-anchor="middle">IE</text>
<text x="88" y="197" font-family="Inter,sans-serif" font-size="12" font-weight="600" fill="#111827">Invisible Exit Glossary</text>
<text x="88" y="213" font-family="Inter,sans-serif" font-size="11" fill="#6b7280">${term.category}</text>
<text x="760" y="230" font-family="Inter,sans-serif" font-size="10" fill="#9ca3af" text-anchor="end">invisibleexit.com/glossary/${term.slug}</text>
</svg>
<figcaption style="font-size:0.875rem;color:#6b7280;margin-top:0.5rem;text-align:center">${term.term}: ${term.definition.substring(0, 110).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}.</figcaption>
</figure>
<section style="padding:2rem 1.5rem">
<article style="max-width:48rem;margin:0 auto">
<p style="font-size:1rem;line-height:1.7;color:#1f2937">${term.detailed}</p>
</article>
</section>
${contextualHtml}
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
<section style="padding:3rem 1.5rem;background-color:#f8fafc">
<div style="max-width:56rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem;text-align:center">Explore Resources</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:1rem">
<a href="/ideas" style="display:block;padding:1.25rem;background:white;border-radius:0.75rem;text-decoration:none;color:inherit;box-shadow:0 1px 3px rgba(0,0,0,0.05)"><h3 style="font-weight:700;font-size:1rem;margin-bottom:0.25rem">Micro-SaaS Ideas</h3><p style="font-size:0.75rem;color:#6b7280">155 ideas by profession</p></a>
<a href="/best" style="display:block;padding:1.25rem;background:white;border-radius:0.75rem;text-decoration:none;color:inherit;box-shadow:0 1px 3px rgba(0,0,0,0.05)"><h3 style="font-weight:700;font-size:1rem;margin-bottom:0.25rem">Best AI Tools</h3><p style="font-size:0.75rem;color:#6b7280">120 tool guides</p></a>
<a href="/glossary" style="display:block;padding:1.25rem;background:white;border-radius:0.75rem;text-decoration:none;color:inherit;box-shadow:0 1px 3px rgba(0,0,0,0.05)"><h3 style="font-weight:700;font-size:1rem;margin-bottom:0.25rem">Glossary</h3><p style="font-size:0.75rem;color:#6b7280">30 key terms defined</p></a>
<a href="/guides" style="display:block;padding:1.25rem;background:white;border-radius:0.75rem;text-decoration:none;color:inherit;box-shadow:0 1px 3px rgba(0,0,0,0.05)"><h3 style="font-weight:700;font-size:1rem;margin-bottom:0.25rem">State Guides</h3><p style="font-size:0.75rem;color:#6b7280">52 state business guides</p></a>
<a href="/data" style="display:block;padding:1.25rem;background:white;border-radius:0.75rem;text-decoration:none;color:inherit;box-shadow:0 1px 3px rgba(0,0,0,0.05)"><h3 style="font-weight:700;font-size:1rem;margin-bottom:0.25rem">Data Reports</h3><p style="font-size:0.75rem;color:#6b7280">75 benchmarks & reports</p></a>
<a href="/compare" style="display:block;padding:1.25rem;background:white;border-radius:0.75rem;text-decoration:none;color:inherit;box-shadow:0 1px 3px rgba(0,0,0,0.05)"><h3 style="font-weight:700;font-size:1rem;margin-bottom:0.25rem">Comparisons</h3><p style="font-size:0.75rem;color:#6b7280">50 side-by-side guides</p></a>
<a href="/calculators" style="display:block;padding:1.25rem;background:white;border-radius:0.75rem;text-decoration:none;color:inherit;box-shadow:0 1px 3px rgba(0,0,0,0.05)"><h3 style="font-weight:700;font-size:1rem;margin-bottom:0.25rem">Calculators</h3><p style="font-size:0.75rem;color:#6b7280">Free financial tools</p></a>
<a href="/explore" style="display:block;padding:1.25rem;background:white;border-radius:0.75rem;text-decoration:none;color:inherit;box-shadow:0 1px 3px rgba(0,0,0,0.05)"><h3 style="font-weight:700;font-size:1rem;margin-bottom:0.25rem">Explore All</h3><p style="font-size:0.75rem;color:#6b7280">Complete resource index</p></a>
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
<p style="font-size:0.875rem;color:#6b7280">Trusted by corporate managers from Fortune 500 companies. <a href="/pro" style="color:#3B82F6">$0.97/month</a>. <a href="/freedom" style="color:#3B82F6">Calculate your freedom number</a>. <a href="/blog" style="color:#3B82F6">Read the blog</a>. <a href="/manifesto" style="color:#3B82F6">Read the manifesto</a>. <a href="/guides/freedom-number" style="color:#3B82F6">Freedom Number Guide</a>. <a href="/compare" style="color:#3B82F6">Compare alternatives</a>. <a href="/ideas" style="color:#3B82F6">Micro-SaaS ideas</a>. <a href="/glossary" style="color:#3B82F6">Glossary</a>. <a href="/best" style="color:#3B82F6">Best AI tools</a>. <a href="/guides" style="color:#3B82F6">State guides</a>. <a href="/data" style="color:#3B82F6">Data reports</a>. <a href="/explore" style="color:#3B82F6">Explore all resources</a>. Cancel anytime. No credit card required to start.</p>
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

  const nonCompeteRisk = g.nonCompeteEnforceable === "enforced"
    ? "high"
    : g.nonCompeteEnforceable === "limited"
    ? "moderate"
    : "low";

  const nonCompeteGuidance = g.nonCompeteEnforceable === "enforced"
    ? `${g.state} enforces non-compete agreements, which means employed founders need to be especially careful. Build in a different industry than your employer, use your own equipment, work outside business hours, and operate through a separate LLC. Consider consulting an employment attorney before launching.`
    : g.nonCompeteEnforceable === "limited"
    ? `${g.state} has limited non-compete enforcement, which provides some flexibility for employed founders. However, you should still avoid directly competing with your employer and never use company resources. The limited enforcement typically applies to specific scenarios like sale-of-business agreements.`
    : `${g.state} does not enforce non-compete agreements for most workers, making it one of the more founder-friendly states for side businesses. You still need to respect IP assignment clauses, confidentiality agreements, and moonlighting policies in your employment contract.`;

  const taxGuidance = g.stateIncomeTaxRate.includes("0%")
    ? `With no state income tax, ${g.state} offers a significant advantage for side-business income. You keep more of every dollar earned.`
    : `The ${g.stateIncomeTaxRate} state income tax rate affects your net business income. Factor this into your pricing and revenue projections.`;

  const anonGuidance = g.anonymousLlcAllowed
    ? `${g.state} allows anonymous LLCs, meaning your name does not appear in public state records. This is critical for employed founders who want to keep their side business completely invisible to their employer.`
    : `${g.state} does not allow anonymous LLCs. Your name will appear in state filings. If employer discretion is critical, consider forming your LLC in Wyoming or Delaware (which allow anonymity) and registering it as a foreign LLC in ${g.state}.`;

  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> › <a href="/guides" style="color:#3B82F6;text-decoration:none">State Guides</a> › <span>${g.state}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;margin-bottom:1rem">Starting a Side Business in ${g.state}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:1rem">${g.bestFor}</p>
<p style="line-height:1.7;color:#1f2937">This guide covers everything a corporate manager or employed professional in ${g.state} needs to know about forming an LLC for a side business. From filing fees and annual report requirements to non-compete enforceability and anonymous LLC options, we break down the specific rules, costs, and strategies that matter when building a micro-SaaS or invisible side business while keeping your day job.</p>
</div>
</section>
<figure style="margin:0 auto 2rem;padding:0 1.5rem;max-width:48rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 280" role="img" aria-label="${g.state} side business guide: LLC formation costs, non-compete status, and anonymous LLC options" style="width:100%;height:auto;border-radius:0.75rem;border:1px solid #e5e7eb">
<rect width="800" height="280" fill="#f8fafc"/>
<rect x="0" y="0" width="800" height="6" fill="#3b82f6"/>
<text x="40" y="45" font-family="Inter,sans-serif" font-size="14" font-weight="600" fill="#3b82f6" letter-spacing="1">STATE GUIDE</text>
<text x="40" y="85" font-family="Inter,sans-serif" font-size="26" font-weight="800" fill="#111827">Starting a Side Business in ${g.state}</text>
<line x1="40" y1="110" x2="760" y2="110" stroke="#3b82f6" stroke-width="2" opacity="0.2"/>
<rect x="40" y="130" width="160" height="50" rx="8" fill="#eff6ff"/>
<text x="120" y="155" font-family="Inter,sans-serif" font-size="20" font-weight="800" fill="#1e40af" text-anchor="middle">$${g.llcFilingFee}</text>
<text x="120" y="170" font-family="Inter,sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">LLC FILING FEE</text>
<rect x="220" y="130" width="160" height="50" rx="8" fill="#f0fdf4"/>
<text x="300" y="155" font-family="Inter,sans-serif" font-size="16" font-weight="700" fill="#15803d" text-anchor="middle">${g.stateIncomeTaxRate.length > 14 ? g.stateIncomeTaxRate.substring(0, 12) + ".." : g.stateIncomeTaxRate}</text>
<text x="300" y="170" font-family="Inter,sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">INCOME TAX</text>
<rect x="400" y="130" width="160" height="50" rx="8" fill="${g.nonCompeteEnforceable === "enforced" ? "#fef2f2" : g.nonCompeteEnforceable === "limited" ? "#fffbeb" : "#f0fdf4"}"/>
<text x="480" y="155" font-family="Inter,sans-serif" font-size="14" font-weight="700" fill="${g.nonCompeteEnforceable === "enforced" ? "#b91c1c" : g.nonCompeteEnforceable === "limited" ? "#b45309" : "#15803d"}" text-anchor="middle">${nonCompeteRisk.toUpperCase()}</text>
<text x="480" y="170" font-family="Inter,sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">NON-COMPETE RISK</text>
<rect x="580" y="130" width="180" height="50" rx="8" fill="${g.anonymousLlcAllowed ? "#eff6ff" : "#f3f4f6"}"/>
<text x="670" y="155" font-family="Inter,sans-serif" font-size="14" font-weight="700" fill="${g.anonymousLlcAllowed ? "#1e40af" : "#6b7280"}" text-anchor="middle">${g.anonymousLlcAllowed ? "YES" : "NO"}</text>
<text x="670" y="170" font-family="Inter,sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">ANONYMOUS LLC</text>
<circle cx="60" cy="230" r="16" fill="#3b82f6" opacity="0.1"/>
<text x="60" y="235" font-family="Inter,sans-serif" font-size="12" font-weight="700" fill="#3b82f6" text-anchor="middle">IE</text>
<text x="88" y="227" font-family="Inter,sans-serif" font-size="12" font-weight="600" fill="#111827">${g.state} Side Business Guide</text>
<text x="88" y="243" font-family="Inter,sans-serif" font-size="11" fill="#6b7280">${g.abbreviation} · Processing: ${g.processingTime}</text>
<text x="760" y="260" font-family="Inter,sans-serif" font-size="10" fill="#9ca3af" text-anchor="end">invisibleexit.com/guides/${g.slug}</text>
</svg>
<figcaption style="font-size:0.875rem;color:#6b7280;margin-top:0.5rem;text-align:center">${g.state} LLC formation guide: $${g.llcFilingFee} filing fee, ${g.stateIncomeTaxRate} income tax, non-compete enforcement is ${nonCompeteRisk}, anonymous LLCs ${g.anonymousLlcAllowed ? "allowed" : "not available"}.</figcaption>
</figure>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto" class="quick-answer">
<p style="font-size:0.875rem;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Quick Answer</p>
<p style="font-size:1.125rem;line-height:1.6;color:#111827;font-weight:500">In ${g.state}, LLC filing costs $${g.llcFilingFee}${g.annualReportRequired ? ` plus $${g.annualReportFee}/year annual report` : ", no annual report required"}. Non-compete enforcement is ${nonCompeteRisk}. ${g.anonymousLlcAllowed ? "Anonymous LLCs are allowed." : "Anonymous LLCs are not available."} Processing time: ${g.processingTime}.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">${g.state} LLC Formation Costs & Requirements</h2>
<table style="width:100%;border-collapse:collapse;font-size:0.875rem">
<tr><td style="padding:0.75rem;font-weight:600;border-bottom:1px solid #e5e7eb">LLC Filing Fee</td><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb">$${g.llcFilingFee}</td></tr>
<tr><td style="padding:0.75rem;font-weight:600;border-bottom:1px solid #e5e7eb">Annual Report Fee</td><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb">${g.annualReportRequired ? `$${g.annualReportFee}` : "No annual report required"}</td></tr>
<tr><td style="padding:0.75rem;font-weight:600;border-bottom:1px solid #e5e7eb">Non-Compete Status</td><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb">${g.nonCompeteNotes}</td></tr>
<tr><td style="padding:0.75rem;font-weight:600;border-bottom:1px solid #e5e7eb">State Income Tax</td><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb">${g.stateIncomeTaxRate}</td></tr>
<tr><td style="padding:0.75rem;font-weight:600;border-bottom:1px solid #e5e7eb">Self-Employment Tax</td><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb">${g.selfEmploymentNote}</td></tr>
<tr><td style="padding:0.75rem;font-weight:600;border-bottom:1px solid #e5e7eb">Anonymous LLC</td><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb">${g.anonymousLlcAllowed ? "Yes" : "No"}</td></tr>
<tr><td style="padding:0.75rem;font-weight:600;border-bottom:1px solid #e5e7eb">Processing Time</td><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb">${g.processingTime}</td></tr>
<tr><td style="padding:0.75rem;font-weight:600;border-bottom:1px solid #e5e7eb">Expedited Filing</td><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb">${g.expeditedAvailable ? "Available" : "Not available"}</td></tr>
</table>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Non-Compete Risk for Employed Founders in ${g.state}</h2>
<p style="line-height:1.7;color:#1f2937;margin-bottom:1rem">${nonCompeteGuidance}</p>
<p style="line-height:1.7;color:#1f2937">Read our comprehensive <a href="/non-compete/${g.slug}" style="color:#3B82F6">non-compete risk analysis for ${g.state}</a> for a detailed breakdown of court precedents and enforcement patterns.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Anonymous LLC Options in ${g.state}</h2>
<p style="line-height:1.7;color:#1f2937;margin-bottom:1rem">${anonGuidance}</p>
<p style="line-height:1.7;color:#1f2937">If employer discretion is your top priority, read our <a href="/glossary/what-is-entity-separation" style="color:#3B82F6">entity separation guide</a> to understand how to structure multiple layers of protection.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Tax Implications for ${g.state} Side Businesses</h2>
<p style="line-height:1.7;color:#1f2937;margin-bottom:1rem">${taxGuidance}</p>
<p style="line-height:1.7;color:#1f2937">For LLCs taxed as pass-through entities, your business income appears on your personal tax return. In ${g.state}, this means your side business revenue is taxed at ${g.stateIncomeTaxRate} in addition to the ${g.selfEmploymentNote.toLowerCase()}.</p>
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
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Frequently Asked Questions</h2>
${faqs}
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number</a>
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
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a>
</div></section>
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.75rem;color:#9ca3af"><strong>Disclaimer:</strong> For informational purposes only. Not legal, financial, or tax advice.</p>
</div></section>
</div>`;
}

// ---------- pSEO Round 2 body generators ----------

function professionMistakesBodyHtml(item: typeof professionMistakes[0]): string {
  const mistakes = item.mistakes.map((m: any, i: number) =>
    `<div style="padding:1rem;border:1px solid #fecaca;background:#fef2f2;border-radius:0.5rem;margin-bottom:1rem"><h3 style="font-weight:600;color:#991b1b">${i+1}. ${m.mistake}</h3><p style="font-size:0.875rem;color:#4b5563;margin-top:0.25rem"><strong>Why:</strong> ${m.why}</p><p style="font-size:0.875rem;color:#166534;margin-top:0.25rem"><strong>Fix:</strong> ${m.fix}</p></div>`
  ).join("\n");
  const signs = (item.positiveSigns || []).map((s: string) => `<li>${s}</li>`).join("");
  const faqs = (item.faqs || []).map((f:any) => `<div><h3 style="font-weight:600">${f.question}</h3><p>${f.answer}</p></div>`).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1><p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p></div></section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto">${mistakes}</div></section>
${signs ? `<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem;color:#166534">Signs You're on the Right Track</h2><ul>${signs}</ul></div></section>` : ""}
${faqs ? `<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>` : ""}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a></div></section>
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto"><p style="font-size:0.75rem;color:#9ca3af"><strong>Disclaimer:</strong> For informational purposes only. Not legal, financial, or tax advice.</p></div></section>
</div>`;
}

function redditStrategyBodyHtml(item: typeof redditStrategies[0]): string {
  const subs = item.bestSubreddits.map((s:any) => `<tr><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb;font-weight:600;color:#ea580c">r/${s.name}</td><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb;color:#6b7280">${s.subscribers}</td><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb">${s.why}</td></tr>`).join("\n");
  const ideas = (item.contentIdeas||[]).map((c:string)=>`<li>${c}</li>`).join("");
  const errs = (item.commonMistakes||[]).map((c:string)=>`<li>${c}</li>`).join("");
  const faqs = (item.faqs||[]).map((f:any)=>`<div><h3 style="font-weight:600">${f.question}</h3><p>${f.answer}</p></div>`).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1><p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p></div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">Best Subreddits for ${item.profession}</h2><table style="width:100%;border-collapse:collapse;font-size:0.875rem"><thead><tr style="background:#0f172a;color:white"><th style="padding:0.5rem;text-align:left">Subreddit</th><th style="padding:0.5rem;text-align:left">Size</th><th style="padding:0.5rem;text-align:left">Why</th></tr></thead><tbody>${subs}</tbody></table></div></section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">Posting Strategy</h2><p style="color:#4b5563">${item.postingStrategy}</p></div></section>
${ideas?`<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">Content Ideas</h2><ul>${ideas}</ul></div></section>`:""}
${errs?`<section style="padding:2rem 1.5rem;background-color:#fef2f2"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:0.5rem;color:#dc2626">Mistakes That Get You Banned</h2><ul>${errs}</ul></div></section>`:""}
${faqs?`<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>`:""}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a></div></section>
</div>`;
}

function pricingModelBodyHtml(item: typeof pricingModels[0]): string {
  const pros = (item.pros||[]).map((p:string)=>`<li>${p}</li>`).join("");
  const cons = (item.cons||[]).map((c:string)=>`<li>${c}</li>`).join("");
  const examples = (item.realExamples||[]).map((e:any)=>`<tr><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb;font-weight:600">${e.product}</td><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb;color:#6b7280">${e.pricing}</td><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb;color:#166534;font-weight:600">${e.revenue}</td></tr>`).join("\n");
  const benchmarks = (item.benchmarks||[]).map((b:any)=>`<div><dt style="font-size:0.75rem;color:#6b7280">${b.metric}</dt><dd style="font-weight:700">${b.value}</dd></div>`).join("\n");
  const faqs = (item.faqs||[]).map((f:any)=>`<div><h3 style="font-weight:600">${f.question}</h3><p>${f.answer}</p></div>`).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.model} Pricing</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1><p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p></div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:0.5rem">How It Works</h2><p style="color:#4b5563">${item.howItWorks}</p></div></section>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(16rem,1fr));gap:1rem;padding:2rem 1.5rem;max-width:48rem;margin:0 auto">
<div style="padding:1.5rem;border:1px solid #bbf7d0;background:#f0fdf4;border-radius:0.5rem"><h3 style="font-weight:700;color:#166534">Pros</h3><ul style="margin-top:0.5rem">${pros}</ul></div>
<div style="padding:1.5rem;border:1px solid #fecaca;background:#fef2f2;border-radius:0.5rem"><h3 style="font-weight:700;color:#991b1b">Cons</h3><ul style="margin-top:0.5rem">${cons}</ul></div>
</div>
${examples?`<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">Real Examples</h2><table style="width:100%;border-collapse:collapse;font-size:0.875rem"><thead><tr style="background:#0f172a;color:white"><th style="padding:0.5rem;text-align:left">Product</th><th style="padding:0.5rem;text-align:left">Pricing</th><th style="padding:0.5rem;text-align:left">Revenue</th></tr></thead><tbody>${examples}</tbody></table></div></section>`:""}
${benchmarks?`<section style="padding:2rem 1.5rem;background-color:#eff6ff"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">Benchmarks</h2><dl style="display:grid;grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));gap:1rem">${benchmarks}</dl></div></section>`:""}
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:0.5rem">Implementation</h2><p style="color:#4b5563">${item.implementation}</p></div></section>
${faqs?`<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>`:""}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a></div></section>
</div>`;
}

function breakEvenBodyHtml(item: typeof breakEvenPages[0]): string {
  const milestones = item.milestones.map((m:any)=>`<div style="display:flex;gap:0.5rem;padding:0.75rem;border:1px solid #e5e7eb;border-radius:0.375rem;margin-bottom:0.5rem"><span style="background:#dbeafe;color:#1e40af;padding:0.25rem 0.5rem;border-radius:0.25rem;font-size:0.75rem;font-weight:700">${m.month}</span><div><p style="font-weight:600">${m.status}</p><p style="font-size:0.875rem;color:#6b7280">${m.description}</p></div></div>`).join("\n");
  const faqs = (item.faqs||[]).map((f:any)=>`<div><h3 style="font-weight:600">${f.question}</h3><p>${f.answer}</p></div>`).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1><p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p></div></section>
<section style="padding:2rem 1.5rem;background-color:#eff6ff"><div style="max-width:48rem;margin:0 auto"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr));gap:1rem">
<div style="padding:1rem;background:white;border-radius:0.5rem;text-align:center"><p style="font-size:0.75rem;color:#6b7280">Monthly Revenue</p><p style="font-size:1.5rem;font-weight:700">$${item.monthlyRevenue.toLocaleString()}</p></div>
<div style="padding:1rem;background:white;border-radius:0.5rem;text-align:center"><p style="font-size:0.75rem;color:#6b7280">Monthly Costs</p><p style="font-size:1.5rem;font-weight:700;color:#ef4444">$${item.monthlyCosts.toLocaleString()}</p></div>
<div style="padding:1rem;background:white;border-radius:0.5rem;text-align:center"><p style="font-size:0.75rem;color:#6b7280">Break-Even</p><p style="font-size:1.5rem;font-weight:700;color:#22c55e">${item.breakEvenMonths} months</p></div>
<div style="padding:1rem;background:white;border-radius:0.5rem;text-align:center"><p style="font-size:0.75rem;color:#6b7280">Total Investment</p><p style="font-size:1.5rem;font-weight:700">$${item.totalInvestment.toLocaleString()}</p></div>
</div></div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">The Scenario</h2><p style="color:#4b5563">${item.scenario}</p></div></section>
${milestones?`<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">Month-by-Month Breakdown</h2>${milestones}</div></section>`:""}
${faqs?`<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>`:""}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a></div></section>
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto"><p style="font-size:0.75rem;color:#9ca3af"><strong>Disclaimer:</strong> Break-even projections are illustrative.</p></div></section>
</div>`;
}

function professionVsCareerBodyHtml(item: typeof professionVsCareer[0]): string {
  const careerPros = (item.careerPath.pros||[]).map((p:string)=>`<li>${p}</li>`).join("");
  const careerCons = (item.careerPath.cons||[]).map((c:string)=>`<li>${c}</li>`).join("");
  const saasPros = (item.saasPath.pros||[]).map((p:string)=>`<li>${p}</li>`).join("");
  const saasCons = (item.saasPath.cons||[]).map((c:string)=>`<li>${c}</li>`).join("");
  const comparison = (item.comparison||[]).map((c:any)=>`<tr><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb;font-weight:600">${c.factor}</td><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb;color:#4b5563">${c.career}</td><td style="padding:0.5rem;border-bottom:1px solid #e5e7eb;color:#4b5563">${c.saas}</td></tr>`).join("\n");
  const faqs = (item.faqs||[]).map((f:any)=>`<div><h3 style="font-weight:600">${f.question}</h3><p>${f.answer}</p></div>`).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1><p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p></div></section>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(20rem,1fr));gap:1.5rem;padding:2rem 1.5rem;max-width:48rem;margin:0 auto">
<div style="padding:1.5rem;border:1px solid #bfdbfe;background:#eff6ff;border-radius:0.5rem"><h2 style="font-weight:700;color:#1e3a8a">The ${item.profession} Career</h2><p style="font-size:0.875rem;margin-top:0.5rem">Salary: ${item.careerPath.salaryRange}</p><div style="margin-top:1rem"><h4 style="font-size:0.75rem;font-weight:700;color:#166534">Pros</h4><ul style="font-size:0.875rem">${careerPros}</ul></div><div style="margin-top:0.5rem"><h4 style="font-size:0.75rem;font-weight:700;color:#991b1b">Cons</h4><ul style="font-size:0.875rem">${careerCons}</ul></div></div>
<div style="padding:1.5rem;border:1px solid #bbf7d0;background:#f0fdf4;border-radius:0.5rem"><h2 style="font-weight:700;color:#14532d">Micro-SaaS Path</h2><p style="font-size:0.875rem;margin-top:0.5rem">Revenue: ${item.saasPath.potentialRevenue}</p><div style="margin-top:1rem"><h4 style="font-size:0.75rem;font-weight:700;color:#166534">Pros</h4><ul style="font-size:0.875rem">${saasPros}</ul></div><div style="margin-top:0.5rem"><h4 style="font-size:0.75rem;font-weight:700;color:#991b1b">Cons</h4><ul style="font-size:0.875rem">${saasCons}</ul></div></div>
</div>
${comparison?`<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">Head-to-Head</h2><table style="width:100%;border-collapse:collapse;font-size:0.875rem"><thead><tr style="background:#0f172a;color:white"><th style="padding:0.5rem;text-align:left">Factor</th><th style="padding:0.5rem;text-align:left">Career</th><th style="padding:0.5rem;text-align:left">Micro-SaaS</th></tr></thead><tbody>${comparison}</tbody></table></div></section>`:""}
<section style="padding:2rem 1.5rem;background-color:#0f172a"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;color:white">The Verdict</h2><p style="color:#cbd5e1;margin-top:0.5rem">${item.verdict}</p></div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:0.5rem">The Hybrid Approach</h2><p style="color:#4b5563">${item.hybridApproach}</p></div></section>
${faqs?`<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>`:""}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a></div></section>
</div>`;
}

function firstYearBodyHtml(item: typeof firstYearEntries[0]): string {
  const months = item.monthlyPlan.map((m:any)=>`<div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem;margin-bottom:0.75rem"><div style="display:flex;gap:0.5rem;align-items:center"><span style="background:#dbeafe;color:#1e40af;padding:0.25rem 0.5rem;border-radius:0.25rem;font-size:0.75rem;font-weight:700">Month ${m.month}</span><strong>${m.focus}</strong></div><p style="font-size:0.875rem;margin-top:0.25rem"><strong>Goal:</strong> ${m.goal}</p><p style="font-size:0.875rem;color:#6b7280"><strong>Deliverable:</strong> ${m.deliverable}</p><p style="font-size:0.875rem;color:#d97706"><strong>Reality check:</strong> ${m.realityCheck}</p></div>`).join("\n");
  const advantages = (item.advantages||[]).map((a:string)=>`<li>${a}</li>`).join("");
  const challenges = (item.challenges||[]).map((c:string)=>`<li>${c}</li>`).join("");
  const lessons = (item.lessonsLearned||[]).map((l:string)=>`<li>${l}</li>`).join("");
  const faqs = (item.faqs||[]).map((f:any)=>`<div><h3 style="font-weight:600">${f.question}</h3><p>${f.answer}</p></div>`).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1><p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p></div></section>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(20rem,1fr));gap:1.5rem;padding:2rem 1.5rem;max-width:48rem;margin:0 auto">
<div style="padding:1.5rem;border:1px solid #bbf7d0;background:#f0fdf4;border-radius:0.5rem"><h2 style="font-weight:700;color:#166534">Your Advantages</h2><ul style="margin-top:0.5rem;font-size:0.875rem">${advantages}</ul></div>
<div style="padding:1.5rem;border:1px solid #fde68a;background:#fffbeb;border-radius:0.5rem"><h2 style="font-weight:700;color:#92400e">Your Challenges</h2><ul style="margin-top:0.5rem;font-size:0.875rem">${challenges}</ul></div>
</div>
${months?`<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">12-Month Roadmap</h2>${months}</div></section>`:""}
${lessons?`<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">Lessons Learned</h2><ul>${lessons}</ul></div></section>`:""}
${faqs?`<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>`:""}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a></div></section>
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto"><p style="font-size:0.75rem;color:#9ca3af"><strong>Disclaimer:</strong> Projections are illustrative. Results vary.</p></div></section>
</div>`;
}

function toolCrossRefBodyHtml(item: typeof toolCrossReference[0]): string {
  const tools = item.tools.map((t:any)=>`<div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem;margin-bottom:0.75rem"><div style="display:flex;justify-content:space-between"><strong>${t.name}</strong><span style="background:#eff6ff;color:#1e40af;padding:0.25rem 0.5rem;border-radius:0.25rem;font-size:0.75rem;font-weight:600">${t.pricing}</span></div><p style="font-size:0.875rem;color:#6b7280;margin-top:0.25rem">${t.best}</p><p style="font-size:0.875rem;margin-top:0.25rem">${t.why}</p></div>`).join("\n");
  const faqs = (item.faqs||[]).map((f:any)=>`<div><h3 style="font-weight:600">${f.question}</h3><p>${f.answer}</p></div>`).join("\n");
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/best" style="color:#3B82F6;text-decoration:none">Tools</a> &rsaquo; <span>${item.h1}</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1><p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p></div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto">${tools}</div></section>
<section style="padding:2rem 1.5rem;background-color:#eff6ff"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:0.5rem">Why ${item.profession} Need Different Tools</h2><p style="color:#4b5563">${item.professionSpecificNeeds}</p></div></section>
${faqs?`<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>`:""}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a></div></section>
</div>`;
}

// ---------- Flagship page bodies (SEO-critical) ----------

function manifestoBodyHtml(): string {
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>The Manifesto</span></nav>
<section style="padding:6rem 1.5rem 3rem;text-align:center;background:radial-gradient(ellipse at top, #1e3a5f, #0f172a)">
<div style="max-width:48rem;margin:0 auto">
<p style="color:#60a5fa;font-size:0.875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1.5rem">The Manifesto</p>
<h1 style="font-size:2.5rem;font-weight:800;color:white;line-height:1.1;margin-bottom:1.5rem">This Isn't a Side-Hustle Course. It's a New Vehicle.</h1>
<p style="font-size:1.125rem;color:rgba(255,255,255,0.7);max-width:36rem;margin:0 auto 1.5rem">Every other program teaches you to improve — to build a better business, to hustle harder, to optimize your side project. We don't teach improvement. We offer a fundamentally different path to financial freedom.</p>
<p style="color:rgba(255,255,255,0.5);max-width:32rem;margin:0 auto 2rem">If you're a corporate manager earning $120K-$200K with golden handcuffs and less than 0.5% equity — this is your declaration of independence.</p>
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#3b82f6;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number</a>
</div>
</section>
<section style="padding:3rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<p style="color:#3b82f6;font-size:0.875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1rem">The Distinction</p>
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">Improvement vs. A New Opportunity</h2>
<div style="color:#4b5563;line-height:1.8">
<p style="margin-bottom:1rem"><strong>Improvement</strong> is: "How to build a better side business." It competes with 10,000 other courses, books, and YouTube channels. It positions you as just another person learning to hustle.</p>
<p style="margin-bottom:1rem"><strong style="color:#3b82f6">A New Opportunity</strong> is: "A fundamentally different vehicle for financial freedom — one designed specifically for employed managers who need to stay invisible." It creates a category that didn't exist before. A category we own.</p>
<p style="font-weight:500;font-size:1.125rem;color:#0f172a">We don't teach you to build a side business. We hand you the Invisible Exit System — the world's first anonymity-native, stealth-first framework for building recurring revenue while employed.</p>
</div>
</div>
</section>
<section style="padding:3rem 1.5rem;background-color:#f8fafc;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0">
<div style="max-width:56rem;margin:0 auto">
<div style="text-align:center;margin-bottom:3rem">
<p style="color:#3b82f6;font-size:0.875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1rem">Two Paths</p>
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem">The Old Way vs. The Invisible Way</h2>
<p style="color:#4b5563;max-width:36rem;margin:0 auto">You've been sold one path your entire career. Here's why it was never designed to take you where you want to go.</p>
</div>
<div style="max-width:48rem;margin:0 auto">
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding:1rem;margin-bottom:1rem;border:1px solid #e2e8f0;border-radius:0.75rem;background:white">
<div><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#ef4444;margin-bottom:0.25rem">The Vehicle — Old Way</p><p style="font-size:0.875rem;color:#6b7280">Climb the corporate ladder. Wait for equity to vest. Hope the IPO delivers.</p></div>
<div><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#3b82f6;margin-bottom:0.25rem">Invisible Way</p><p style="font-size:0.875rem;color:#0f172a">Build invisible recurring revenue. Own products, not promises.</p></div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding:1rem;margin-bottom:1rem;border:1px solid #e2e8f0;border-radius:0.75rem;background:white">
<div><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#ef4444;margin-bottom:0.25rem">The Timeline — Old Way</p><p style="font-size:0.875rem;color:#6b7280">5-8 years to a liquidity event you don't control.</p></div>
<div><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#3b82f6;margin-bottom:0.25rem">Invisible Way</p><p style="font-size:0.875rem;color:#0f172a">12-18 months to $4,000/month MRR you own today.</p></div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding:1rem;margin-bottom:1rem;border:1px solid #e2e8f0;border-radius:0.75rem;background:white">
<div><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#ef4444;margin-bottom:0.25rem">The Visibility — Old Way</p><p style="font-size:0.875rem;color:#6b7280">LinkedIn brand. Conference talks. Your name on everything.</p></div>
<div><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#3b82f6;margin-bottom:0.25rem">Invisible Way</p><p style="font-size:0.875rem;color:#0f172a">Anonymous entities. Separate identities. Zero exposure.</p></div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding:1rem;margin-bottom:1rem;border:1px solid #e2e8f0;border-radius:0.75rem;background:white">
<div><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#ef4444;margin-bottom:0.25rem">The Skill Set — Old Way</p><p style="font-size:0.875rem;color:#6b7280">Learn to pitch investors. Build a deck. Network at events.</p></div>
<div><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#3b82f6;margin-bottom:0.25rem">Invisible Way</p><p style="font-size:0.875rem;color:#0f172a">Use your existing P&L, team management, and execution skills.</p></div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding:1rem;border:1px solid #e2e8f0;border-radius:0.75rem;background:white">
<div><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#ef4444;margin-bottom:0.25rem">The Risk — Old Way</p><p style="font-size:0.875rem;color:#6b7280">Quit your job. Burn the bridge. Sink or swim.</p></div>
<div><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#3b82f6;margin-bottom:0.25rem">Invisible Way</p><p style="font-size:0.875rem;color:#0f172a">Keep your salary. Build in 5 hours/week. The job funds the exit.</p></div>
</div>
</div>
</div>
</section>
<section style="padding:3rem 1.5rem">
<div style="max-width:56rem;margin:0 auto">
<div style="text-align:center;margin-bottom:3rem">
<p style="color:#3b82f6;font-size:0.875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1rem">The Declaration</p>
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem">The 6 Principles of the Invisible Builder</h2>
<p style="color:#4b5563;max-width:36rem;margin:0 auto">These aren't tips. They're the foundational beliefs of a movement. If you agree with all six, you're one of us.</p>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;max-width:48rem;margin:0 auto">
<div style="padding:1.5rem;border:1px solid #e2e8f0;border-radius:0.75rem"><span style="display:inline-flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;border-radius:0.5rem;background-color:rgba(59,130,246,0.1);color:#3b82f6;font-weight:700;font-size:0.875rem;margin-bottom:1rem">01</span><h3 style="font-weight:700;font-size:1.125rem;margin-bottom:0.75rem">Revenue beats equity.</h3><p style="font-size:0.875rem;color:#6b7280;line-height:1.6">0.5% equity in someone else's company is a leash, not an asset. $4,000/month in recurring revenue from products you own is freedom you control today — not in 5 years when an IPO 'might' happen.</p></div>
<div style="padding:1.5rem;border:1px solid #e2e8f0;border-radius:0.75rem"><span style="display:inline-flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;border-radius:0.5rem;background-color:rgba(59,130,246,0.1);color:#3b82f6;font-weight:700;font-size:0.875rem;margin-bottom:1rem">02</span><h3 style="font-weight:700;font-size:1.125rem;margin-bottom:0.75rem">Anonymity is the advantage.</h3><p style="font-size:0.875rem;color:#6b7280;line-height:1.6">The faceless founder can experiment without fear, fail without consequence, and build in any market — all while the employer, the LinkedIn network, and the competitors have no idea. The mask IS the moat.</p></div>
<div style="padding:1.5rem;border:1px solid #e2e8f0;border-radius:0.75rem"><span style="display:inline-flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;border-radius:0.5rem;background-color:rgba(59,130,246,0.1);color:#3b82f6;font-weight:700;font-size:0.875rem;margin-bottom:1rem">03</span><h3 style="font-weight:700;font-size:1.125rem;margin-bottom:0.75rem">Constraints produce focus.</h3><p style="font-size:0.875rem;color:#6b7280;line-height:1.6">5 hours a week isn't a limitation. It's a forcing function. Full-time founders with 60 hours dilute their effort across a dozen priorities. The 5-hour builder does one thing that matters — every single week.</p></div>
<div style="padding:1.5rem;border:1px solid #e2e8f0;border-radius:0.75rem"><span style="display:inline-flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;border-radius:0.5rem;background-color:rgba(59,130,246,0.1);color:#3b82f6;font-weight:700;font-size:0.875rem;margin-bottom:1rem">04</span><h3 style="font-weight:700;font-size:1.125rem;margin-bottom:0.75rem">The system beats the idea.</h3><p style="font-size:0.875rem;color:#6b7280;line-height:1.6">Stop obsessing over finding the 'right' idea. Build the framework first — freedom number, idea pipeline, stealth ops, launch control, brand. Once the system exists, you can swap ideas in and out like cartridges.</p></div>
<div style="padding:1.5rem;border:1px solid #e2e8f0;border-radius:0.75rem"><span style="display:inline-flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;border-radius:0.5rem;background-color:rgba(59,130,246,0.1);color:#3b82f6;font-weight:700;font-size:0.875rem;margin-bottom:1rem">05</span><h3 style="font-weight:700;font-size:1.125rem;margin-bottom:0.75rem">Boring products pay mortgages.</h3><p style="font-size:0.875rem;color:#6b7280;line-height:1.6">A PDF generator for electricians beats a sexy AI tool. Boring markets have less competition, higher willingness to pay, and lower churn. The Idea Pipeline scores for revenue probability, not excitement.</p></div>
<div style="padding:1.5rem;border:1px solid #e2e8f0;border-radius:0.75rem"><span style="display:inline-flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;border-radius:0.5rem;background-color:rgba(59,130,246,0.1);color:#3b82f6;font-weight:700;font-size:0.875rem;margin-bottom:1rem">06</span><h3 style="font-weight:700;font-size:1.125rem;margin-bottom:0.75rem">Your job is the launchpad, not the trap.</h3><p style="font-size:0.875rem;color:#6b7280;line-height:1.6">Your salary is runway funding that costs zero equity. Your corporate skills (managing teams, reading P&Ls, executing under pressure) are exactly what solo founders lack. The job isn't what you escape — it's what funds the escape.</p></div>
</div>
</div>
</section>
<section style="padding:3rem 1.5rem;background-color:#0f172a">
<div style="max-width:48rem;margin:0 auto">
<div style="text-align:center;margin-bottom:2rem">
<p style="color:#60a5fa;font-size:0.875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1rem">The Vision</p>
<h2 style="font-size:1.875rem;font-weight:700;color:white;margin-bottom:1.5rem">A Future Where 10,000 Managers Own Their Exit</h2>
</div>
<div style="color:rgba(255,255,255,0.6);line-height:1.8">
<p style="margin-bottom:1.25rem">Imagine a world where corporate managers don't wait 8 years for an IPO that may never deliver freedom. Where they don't gamble their family's future on a 0.5% equity lottery ticket.</p>
<p style="margin-bottom:1.25rem">Imagine if 10,000 managers — each building quietly, each earning $4,000/month from products they own — walked into their annual review knowing the golden handcuffs were already off.</p>
<p style="margin-bottom:1.25rem">Not because they quit. Not because they burned a bridge. But because they built an invisible exit — a door only they could see and only they could open.</p>
<p style="color:white;font-weight:500;font-size:1.125rem;margin-top:1rem">That's the future we're building. One manager at a time.</p>
</div>
</div>
</section>
<section style="padding:3rem 1.5rem;text-align:center;border-top:1px solid #e2e8f0">
<div style="max-width:36rem;margin:0 auto">
<p style="color:#3b82f6;font-size:0.875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1rem">Your Move</p>
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem">If You've Read This Far, You're Already Different</h2>
<p style="color:#4b5563;margin-bottom:2rem">97% of managers will read this and go back to their spreadsheet. 3% will calculate their freedom number. That 3% is who this is for.</p>
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#3b82f6;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number — Free</a>
<p style="font-size:0.875rem;color:#6b7280;margin-top:1rem">90 seconds. No credit card. The first step of the invisible exit.</p>
</div>
</section>
</div>`;
}

function pillarFreedomNumberBodyHtml(): string {
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/blog" style="color:#3B82F6;text-decoration:none">Blog</a> &rsaquo; <span>Freedom Number Guide</span></nav>
<section style="padding:6rem 1.5rem 3rem;text-align:center;background:radial-gradient(ellipse at top, #1e3a5f, #0f172a)">
<div style="max-width:48rem;margin:0 auto">
<p style="display:inline-block;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);color:#60a5fa;font-size:0.875rem;font-weight:600;padding:0.5rem 1rem;border-radius:9999px;margin-bottom:2rem">Definitive Guide · 3,500+ words</p>
<h1 style="font-size:2.5rem;font-weight:800;color:white;line-height:1.1;margin-bottom:1.5rem">The Complete Freedom Number Guide</h1>
<p style="font-size:1.125rem;color:rgba(255,255,255,0.7);max-width:36rem;margin:0 auto 1rem">How to calculate the exact monthly recurring revenue you need to never work for someone else again — with real numbers, timelines, and the framework to hit it.</p>
<p style="color:rgba(255,255,255,0.5)">Updated July 2026 · 12 min read</p>
</div>
</section>
<article style="padding:3rem 1.5rem;max-width:44rem;margin:0 auto">
<section style="margin-bottom:3rem">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">What Is a Freedom Number?</h2>
<div style="color:#4b5563;line-height:1.8">
<p style="margin-bottom:1.25rem">Your <strong>freedom number</strong> is the monthly recurring revenue (MRR) you need from products you own to fully replace your employment income and living expenses.</p>
<p style="margin-bottom:1.25rem">It's the number that makes the golden handcuffs irrelevant. When your side business generates this much per month, consistently, you have optionality — the freedom to choose whether you keep working for someone else or not.</p>
<p style="margin-bottom:1.25rem">Most corporate managers have never calculated this number. They operate on a vague feeling that "someday" they'll have enough. That vagueness is what keeps them trapped. A specific number changes everything. It turns an abstract dream into a math problem. And math problems have solutions.</p>
<div style="background:rgba(59,130,246,0.05);border-left:4px solid #3b82f6;border-radius:0 0.5rem 0.5rem 0;padding:1.25rem;margin:1.5rem 0">
<p style="color:#0f172a;font-weight:500">The average freedom number for a corporate manager earning $120K-$200K is <strong style="color:#3b82f6">$12,000-$20,000/month in MRR</strong>. That sounds like a lot — until you realize it's 138-450 customers at $29-$97/month. Boring products for boring industries.</p>
</div>
</div>
</section>
<section style="margin-bottom:3rem">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">The Freedom Number Formula</h2>
<div style="color:#4b5563;line-height:1.8">
<p style="margin-bottom:1.25rem">The formula has three components:</p>
<div style="background:#f8fafc;border-radius:0.75rem;padding:1.5rem;border:1px solid #e2e8f0;font-family:monospace;font-size:0.875rem">
<p style="color:#0f172a;font-weight:700;margin-bottom:0.75rem">Freedom Number =</p>
<p style="color:#6b7280">Monthly Living Expenses</p>
<p style="color:#6b7280">+ Monthly Salary Replacement (Annual Salary ÷ 12)</p>
<p style="color:#6b7280">+ Tax &amp; Benefits Buffer (+30%)</p>
<p style="color:#0f172a;font-weight:700;margin-top:0.75rem;border-top:1px solid #e2e8f0;padding-top:0.75rem">= Your Monthly MRR Target</p>
</div>
<p style="margin-top:1.25rem"><strong>Why the 30% buffer?</strong> Your employer covers more than just salary — there's healthcare, retirement match, paid time off, and other benefits worth $15,000-$30,000/year. Plus, self-employment tax is ~15.3% in the US (or equivalent elsewhere). The buffer ensures your freedom number actually replaces your total compensation, not just your base pay.</p>
</div>
</section>
<section style="margin-bottom:3rem">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">How to Calculate Yours (Step by Step)</h2>
<div style="display:grid;gap:1.5rem">
<div style="display:flex;gap:1rem"><div style="width:2rem;height:2rem;border-radius:50%;background:#3b82f6;color:white;font-weight:700;font-size:0.875rem;display:flex;align-items:center;justify-content:center;flex-shrink:0">1</div><div><h3 style="font-weight:600;margin-bottom:0.25rem">Determine your annual salary (including bonuses)</h3><p style="font-size:0.875rem;color:#6b7280">Use your total compensation — base salary plus any expected bonus, not just your base pay. If you earn $120K base + $15K bonus, your number is $135,000.</p></div></div>
<div style="display:flex;gap:1rem"><div style="width:2rem;height:2rem;border-radius:50%;background:#3b82f6;color:white;font-weight:700;font-size:0.875rem;display:flex;align-items:center;justify-content:center;flex-shrink:0">2</div><div><h3 style="font-weight:600;margin-bottom:0.25rem">Calculate monthly living expenses</h3><p style="font-size:0.875rem;color:#6b7280">Include everything: mortgage/rent, food, transportation, childcare, debt payments, subscriptions, healthcare premiums, and discretionary spending. Be honest — underestimating here is the #1 mistake.</p></div></div>
<div style="display:flex;gap:1rem"><div style="width:2rem;height:2rem;border-radius:50%;background:#3b82f6;color:white;font-weight:700;font-size:0.875rem;display:flex;align-items:center;justify-content:center;flex-shrink:0">3</div><div><h3 style="font-weight:600;margin-bottom:0.25rem">Add the 30% tax and benefits buffer</h3><p style="font-size:0.875rem;color:#6b7280">Take your monthly salary replacement + expenses and multiply by 1.30. This covers self-employment taxes, healthcare, retirement contributions, and the benefits you're leaving behind.</p></div></div>
<div style="display:flex;gap:1rem"><div style="width:2rem;height:2rem;border-radius:50%;background:#3b82f6;color:white;font-weight:700;font-size:0.875rem;display:flex;align-items:center;justify-content:center;flex-shrink:0">4</div><div><h3 style="font-weight:600;margin-bottom:0.25rem">Round up to the nearest $100</h3><p style="font-size:0.875rem;color:#6b7280">Round to give yourself a small margin. This is your freedom number — the monthly MRR target that replaces your employment.</p></div></div>
</div>
</section>
<section style="margin-bottom:3rem">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">Freedom Number Examples by Salary</h2>
<table style="width:100%;font-size:0.875rem;border:1px solid #e2e8f0;border-radius:0.5rem;overflow:hidden;border-collapse:collapse">
<thead><tr style="background:#f8fafc"><th style="text-align:left;padding:0.75rem;font-weight:600">Salary</th><th style="text-align:left;padding:0.75rem;font-weight:600">Monthly Expenses</th><th style="text-align:left;padding:0.75rem;font-weight:600;color:#3b82f6">Freedom Number</th><th style="text-align:center;padding:0.75rem;font-weight:600;color:#6b7280">@ $29/mo</th><th style="text-align:center;padding:0.75rem;font-weight:600;color:#6b7280">@ $9/mo</th></tr></thead>
<tbody>
<tr style="border-top:1px solid #e2e8f0"><td style="padding:0.75rem;font-weight:500">$80,000</td><td style="padding:0.75rem">$4,000/mo</td><td style="padding:0.75rem;color:#3b82f6;font-weight:700">$10,700/mo</td><td style="padding:0.75rem;text-align:center">370</td><td style="padding:0.75rem;text-align:center">1,189</td></tr>
<tr style="border-top:1px solid #e2e8f0"><td style="padding:0.75rem;font-weight:500">$100,000</td><td style="padding:0.75rem">$4,500/mo</td><td style="padding:0.75rem;color:#3b82f6;font-weight:700">$12,800/mo</td><td style="padding:0.75rem;text-align:center">442</td><td style="padding:0.75rem;text-align:center">1,422</td></tr>
<tr style="border-top:1px solid #e2e8f0"><td style="padding:0.75rem;font-weight:500">$120,000</td><td style="padding:0.75rem">$5,000/mo</td><td style="padding:0.75rem;color:#3b82f6;font-weight:700">$15,000/mo</td><td style="padding:0.75rem;text-align:center">518</td><td style="padding:0.75rem;text-align:center">1,667</td></tr>
<tr style="border-top:1px solid #e2e8f0"><td style="padding:0.75rem;font-weight:500">$150,000</td><td style="padding:0.75rem">$6,000/mo</td><td style="padding:0.75rem;color:#3b82f6;font-weight:700">$18,500/mo</td><td style="padding:0.75rem;text-align:center">638</td><td style="padding:0.75rem;text-align:center">2,056</td></tr>
<tr style="border-top:1px solid #e2e8f0"><td style="padding:0.75rem;font-weight:500">$200,000</td><td style="padding:0.75rem">$8,000/mo</td><td style="padding:0.75rem;color:#3b82f6;font-weight:700">$24,700/mo</td><td style="padding:0.75rem;text-align:center">852</td><td style="padding:0.75rem;text-align:center">2,745</td></tr>
<tr style="border-top:1px solid #e2e8f0"><td style="padding:0.75rem;font-weight:500">$250,000</td><td style="padding:0.75rem">$10,000/mo</td><td style="padding:0.75rem;color:#3b82f6;font-weight:700">$30,800/mo</td><td style="padding:0.75rem;text-align:center">1,063</td><td style="padding:0.75rem;text-align:center">3,422</td></tr>
</tbody>
</table>
<p style="font-size:0.75rem;color:#6b7280;margin-top:0.75rem">Freedom number = (monthly expenses + monthly salary equivalent) × 1.30 buffer. Customer counts assume 100% of revenue goes toward freedom number (in practice, expect 70-80% margin).</p>
</section>
<section style="margin-bottom:3rem">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">How Many Customers You Need</h2>
<div style="color:#4b5563;line-height:1.8">
<p style="margin-bottom:1.25rem">The beauty of the freedom number is that it reframes the problem. You're not trying to "build a business" — you're trying to acquire a specific number of customers at a specific price point.</p>
<p style="margin-bottom:1.25rem">Higher pricing = fewer customers needed = faster path to freedom. A $97/month product serving a boring industry (electricians, plumbers, accountants) needs just 155 customers. That's achievable in 12-18 months with consistent distribution.</p>
</div>
</section>
<section style="margin-bottom:3rem">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">How Long It Takes to Hit</h2>
<div style="color:#4b5563;line-height:1.8">
<p style="margin-bottom:1.25rem">Based on Invisible Exit member data, here's the honest timeline for hitting your freedom number at 5 hours per week:</p>
<div style="display:grid;gap:0.75rem">
<div style="display:flex;align-items:flex-start;gap:1rem;padding:1rem;border:1px solid #e2e8f0;border-radius:0.5rem"><div style="width:5rem;flex-shrink:0"><p style="font-size:0.75rem;font-weight:700;color:#3b82f6">Months 1-3</p></div><p style="font-size:0.875rem;flex:1">Build and launch first product</p><p style="font-size:0.875rem;font-weight:700">$0</p></div>
<div style="display:flex;align-items:flex-start;gap:1rem;padding:1rem;border:1px solid #e2e8f0;border-radius:0.5rem"><div style="width:5rem;flex-shrink:0"><p style="font-size:0.75rem;font-weight:700;color:#3b82f6">Month 4</p></div><p style="font-size:0.875rem;flex:1">First paying customer</p><p style="font-size:0.875rem;font-weight:700">$9-50/mo</p></div>
<div style="display:flex;align-items:flex-start;gap:1rem;padding:1rem;border:1px solid #e2e8f0;border-radius:0.5rem"><div style="width:5rem;flex-shrink:0"><p style="font-size:0.75rem;font-weight:700;color:#3b82f6">Month 6</p></div><p style="font-size:0.875rem;flex:1">Early traction, pricing validated</p><p style="font-size:0.875rem;font-weight:700">$500-1,000/mo</p></div>
<div style="display:flex;align-items:flex-start;gap:1rem;padding:1rem;border:1px solid #e2e8f0;border-radius:0.5rem"><div style="width:5rem;flex-shrink:0"><p style="font-size:0.75rem;font-weight:700;color:#3b82f6">Month 9</p></div><p style="font-size:0.875rem;flex:1">Growth phase, second product</p><p style="font-size:0.875rem;font-weight:700">$1,500-2,500/mo</p></div>
<div style="display:flex;align-items:flex-start;gap:1rem;padding:1rem;border:1px solid #e2e8f0;border-radius:0.5rem"><div style="width:5rem;flex-shrink:0"><p style="font-size:0.75rem;font-weight:700;color:#3b82f6">Month 12-18</p></div><p style="font-size:0.875rem;flex:1">Approaching or hitting freedom number</p><p style="font-size:0.875rem;font-weight:700">$3,000-5,000+/mo</p></div>
</div>
<p style="margin-top:1.25rem"><strong>Important:</strong> These are averages, not guarantees. Some members hit $2,000 MRR in 4 months. Others take 18 months to reach $1,000. The variable is execution consistency — how reliably you show up for your 5 hours each week.</p>
</div>
</section>
<section style="margin-bottom:3rem">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">The 5-Tool Framework to Reach It</h2>
<div style="color:#4b5563;line-height:1.8">
<p style="margin-bottom:1.25rem">Calculating your freedom number is step one. Building the system to hit it is everything else. The Invisible Exit System uses 5 connected tools: FYM Dashboard (calculates and tracks your freedom number), Idea Pipeline (finds and validates the product that hits it), Stealth Ops Hub (keeps your employer from finding out), Launch Control (ships products in your 5 hours/week), and Brand Manager (gets customers without showing your face).</p>
</div>
</section>
<section style="margin-bottom:3rem">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">5 Mistakes That Delay Freedom</h2>
<div style="display:grid;gap:1rem">
<div style="padding:1.25rem;border:1px solid #e2e8f0;border-radius:0.5rem"><div style="display:flex;align-items:flex-start;gap:0.75rem"><span style="width:1.75rem;height:1.75rem;border-radius:50%;background:rgba(239,68,68,0.1);color:#ef4444;font-weight:700;font-size:0.875rem;display:flex;align-items:center;justify-content:center;flex-shrink:0">1</span><div><h3 style="font-weight:600;font-size:0.875rem;margin-bottom:0.5rem">Not accounting for taxes on your side income</h3><p style="font-size:0.875rem;color:#6b7280">Your $4,000/month MRR isn't $4,000 in your pocket. After self-employment taxes (~15.3%), income taxes, and business expenses, you net roughly 65-70%. Calculate your gross freedom number, then multiply by 1.35 to get the MRR you actually need.</p></div></div></div>
<div style="padding:1.25rem;border:1px solid #e2e8f0;border-radius:0.5rem"><div style="display:flex;align-items:flex-start;gap:0.75rem"><span style="width:1.75rem;height:1.75rem;border-radius:50%;background:rgba(239,68,68,0.1);color:#ef4444;font-weight:700;font-size:0.875rem;display:flex;align-items:center;justify-content:center;flex-shrink:0">2</span><div><h3 style="font-weight:600;font-size:0.875rem;margin-bottom:0.5rem">Forgetting healthcare and benefits</h3><p style="font-size:0.875rem;color:#6b7280">Your employer covers health insurance, retirement match, and other benefits worth $15,000-$30,000/year. Your freedom number must replace ALL compensation, not just salary. Add $1,500-$2,500/month to your target.</p></div></div></div>
<div style="padding:1.25rem;border:1px solid #e2e8f0;border-radius:0.5rem"><div style="display:flex;align-items:flex-start;gap:0.75rem"><span style="width:1.75rem;height:1.75rem;border-radius:50%;background:rgba(239,68,68,0.1);color:#ef4444;font-weight:700;font-size:0.875rem;display:flex;align-items:center;justify-content:center;flex-shrink:0">3</span><div><h3 style="font-weight:600;font-size:0.875rem;margin-bottom:0.5rem">Using churn-ignoring math</h3><p style="font-size:0.875rem;color:#6b7280">If your monthly churn is 5%, you need to add ~5% new customers every month just to break even. At 138 customers and 5% churn, you lose 7 customers/month. Your acquisition rate must exceed that. Always model churn into your timeline.</p></div></div></div>
<div style="padding:1.25rem;border:1px solid #e2e8f0;border-radius:0.5rem"><div style="display:flex;align-items:flex-start;gap:0.75rem"><span style="width:1.75rem;height:1.75rem;border-radius:50%;background:rgba(239,68,68,0.1);color:#ef4444;font-weight:700;font-size:0.875rem;display:flex;align-items:center;justify-content:center;flex-shrink:0">4</span><div><h3 style="font-weight:600;font-size:0.875rem;margin-bottom:0.5rem">Picking a price point that's too low</h3><p style="font-size:0.875rem;color:#6b7280">At $9/month, you need 445 customers for $4,000 MRR. At $29/month, you need 138. At $97/month, you need 41. Higher prices mean fewer customers, less support burden, and faster freedom. Don't race to the bottom.</p></div></div></div>
<div style="padding:1.25rem;border:1px solid #e2e8f0;border-radius:0.5rem"><div style="display:flex;align-items:flex-start;gap:0.75rem"><span style="width:1.75rem;height:1.75rem;border-radius:50%;background:rgba(239,68,68,0.1);color:#ef4444;font-weight:700;font-size:0.875rem;display:flex;align-items:center;justify-content:center;flex-shrink:0">5</span><div><h3 style="font-weight:600;font-size:0.875rem;margin-bottom:0.5rem">Not building the system before the idea</h3><p style="font-size:0.875rem;color:#6b7280">Most people spend 3 months choosing the 'right' idea and zero months building the system that validates, launches, and distributes it. Build the pipeline first. Then ideas become interchangeable cartridges.</p></div></div></div>
</div>
</section>
<section style="margin-bottom:3rem">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">Frequently Asked Questions</h2>
<div style="display:grid;gap:1rem">
<div style="padding:1.25rem;border:1px solid #e2e8f0;border-radius:0.5rem"><h3 style="font-weight:600;font-size:0.875rem;margin-bottom:0.5rem">What exactly is a freedom number?</h3><p style="font-size:0.875rem;color:#6b7280">Your freedom number is the monthly recurring revenue (MRR) you need from products you own to fully replace your employment income and living expenses. It's not about quitting your job — it's about having the option to. Once your MRR hits your freedom number, the golden handcuffs are off. You stay because you choose to, not because you have to.</p></div>
<div style="padding:1.25rem;border:1px solid #e2e8f0;border-radius:0.5rem"><h3 style="font-weight:600;font-size:0.875rem;margin-bottom:0.5rem">How is this different from the 4% rule in FIRE?</h3><p style="font-size:0.875rem;color:#6b7280">The FIRE 4% rule requires you to accumulate a large lump sum (typically $1M-$3M) invested in index funds, then withdraw 4% annually. The freedom number approach replaces that with recurring revenue from products you own. Instead of drawing down a finite pool, you're building a renewable income stream that doesn't deplete. Both paths lead to freedom; the MRR path gets there faster because you don't need to accumulate the full lump sum first.</p></div>
<div style="padding:1.25rem;border:1px solid #e2e8f0;border-radius:0.5rem"><h3 style="font-weight:600;font-size:0.875rem;margin-bottom:0.5rem">Do I need to quit my job to hit my freedom number?</h3><p style="font-size:0.875rem;color:#6b7280">No. That's the entire point of the Invisible Exit system. You build in 5 hours per week while employed. Your salary funds the build. Your corporate skills give you an advantage solo founders lack. Most members hit their first $1,000 MRR within 6-8 months while still fully employed.</p></div>
<div style="padding:1.25rem;border:1px solid #e2e8f0;border-radius:0.5rem"><h3 style="font-weight:600;font-size:0.875rem;margin-bottom:0.5rem">What if my expenses are higher than the examples?</h3><p style="font-size:0.875rem;color:#6b7280">The formula works at any expense level. Higher expenses mean a higher freedom number, which means either more customers or higher pricing. The math doesn't change — it scales. If your freedom number feels unreachable at $9/month pricing, raise your price. At $97/month, a $15,000 freedom number needs just 155 customers.</p></div>
<div style="padding:1.25rem;border:1px solid #e2e8f0;border-radius:0.5rem"><h3 style="font-weight:600;font-size:0.875rem;margin-bottom:0.5rem">How accurate is the freedom number calculator?</h3><p style="font-size:0.875rem;color:#6b7280">The calculator uses standard financial modeling: salary replacement + expense coverage + a 30% buffer for taxes and benefits. It's directionally accurate — it tells you the order of magnitude you're targeting. For exact planning, use the detailed breakdown in your dashboard after calculating.</p></div>
</div>
</section>
<section style="padding:2rem;background:#f8fafc;border-radius:1rem;text-align:center;border:1px solid #e2e8f0">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.75rem">Know your number yet?</h2>
<p style="color:#4b5563;margin-bottom:1.5rem">Stop guessing. Calculate your exact freedom number in 90 seconds.</p>
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#3b82f6;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate My Freedom Number</a>
</section>
</article>
</div>`;
}

function comparePageBodyHtml(): string {
  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>The Honest Comparison</span></nav>
<section style="padding:6rem 1.5rem 3rem;text-align:center;background:radial-gradient(ellipse at top, #1e3a5f, #0f172a)">
<div style="max-width:48rem;margin:0 auto">
<p style="display:inline-block;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);color:#60a5fa;font-size:0.875rem;font-weight:600;padding:0.5rem 1rem;border-radius:9999px;margin-bottom:2rem">The Honest Comparison</p>
<h1 style="font-size:2.5rem;font-weight:800;color:white;line-height:1.1;margin-bottom:1.5rem">Why Not Just Something Else?</h1>
<p style="font-size:1.125rem;color:rgba(255,255,255,0.7);max-width:36rem;margin:0 auto">Every alternative teaches improvement. We offer a new opportunity. Here's the honest comparison — including where each alternative is actually better.</p>
</div>
</section>
<section style="padding:3rem 1.5rem">
<div style="max-width:56rem;margin:0 auto">
<div style="text-align:center;margin-bottom:3rem">
<p style="color:#3b82f6;font-size:0.875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1rem">The Alternatives</p>
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem">6 Paths to Freedom — Compared</h2>
<p style="color:#4b5563;max-width:36rem;margin:0 auto">We're not going to pretend every alternative is bad. Some are good for different goals. Here's where each one wins — and where it falls apart for corporate managers.</p>
</div>
<div style="max-width:48rem;margin:0 auto;display:grid;gap:1.5rem">
<div style="padding:1.5rem;border:1px solid #e2e8f0;border-radius:0.75rem">
<h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem">Side-Hustle Courses ($97-$497)</h3>
<p style="font-size:0.875rem;color:#6b7280;font-style:italic;margin-bottom:1rem">Teach you to build a 'better' side business</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
<div style="background:#f8fafc;border-radius:0.5rem;padding:1rem"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#6b7280;margin-bottom:0.5rem">What they say</p><p style="font-size:0.875rem;color:#6b7280;font-style:italic">"Just start! Pick an idea and go!"</p></div>
<div style="background:rgba(239,68,68,0.05);border-radius:0.5rem;padding:1rem;border:1px solid rgba(239,68,68,0.1)"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#ef4444;margin-bottom:0.5rem">What they miss</p><p style="font-size:0.875rem;color:#6b7280">No stealth framework. No anonymity system. No employment-contract compliance. If your employer finds out, you lose everything.</p></div>
</div>
<div style="background:rgba(59,130,246,0.05);border-radius:0.5rem;padding:1rem;border-left:2px solid #3b82f6;margin-bottom:0.75rem"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#3b82f6;margin-bottom:0.5rem">Our answer</p><p style="font-size:0.875rem;color:#0f172a">We don't teach improvement. We give you a new vehicle — the Invisible Exit System — designed from day one for employed managers who can't be discovered.</p></div>
<p style="font-size:0.75rem;color:#6b7280;font-style:italic"><strong>Verdict:</strong> Good for motivation. Dangerous for corporate managers who need to stay invisible.</p>
</div>
<div style="padding:1.5rem;border:1px solid #e2e8f0;border-radius:0.75rem">
<h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem">FIRE Movement (Financial Independence)</h3>
<p style="font-size:0.875rem;color:#6b7280;font-style:italic;margin-bottom:1rem">Save 70% of income. Invest in index funds. Retire in 20-30 years.</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
<div style="background:#f8fafc;border-radius:0.5rem;padding:1rem"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#6b7280;margin-bottom:0.5rem">What they say</p><p style="font-size:0.875rem;color:#6b7280;font-style:italic">"Live below your means and let compounding do the work."</p></div>
<div style="background:rgba(239,68,68,0.05);border-radius:0.5rem;padding:1rem;border:1px solid rgba(239,68,68,0.1)"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#ef4444;margin-bottom:0.5rem">What they miss</p><p style="font-size:0.875rem;color:#6b7280">Requires decades of frugality. Depends on market returns you don't control. Doesn't create anything you own. You're still dependent — just on the market instead of an employer.</p></div>
</div>
<div style="background:rgba(59,130,246,0.05);border-radius:0.5rem;padding:1rem;border-left:2px solid #3b82f6;margin-bottom:0.75rem"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#3b82f6;margin-bottom:0.5rem">Our answer</p><p style="font-size:0.875rem;color:#0f172a">The freedom number approach uses recurring revenue from products you own. It's renewable — it doesn't deplete. And it takes 12-18 months, not 20-30 years.</p></div>
<p style="font-size:0.75rem;color:#6b7280;font-style:italic"><strong>Verdict:</strong> Valid path, but slow. We offer a faster vehicle that doesn't require decades of sacrifice.</p>
</div>
<div style="padding:1.5rem;border:1px solid #e2e8f0;border-radius:0.75rem">
<h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem">Quit-Your-Job Advice (Founders)</h3>
<p style="font-size:0.875rem;color:#6b7280;font-style:italic;margin-bottom:1rem">Burn the boats. Full commitment. Sink or swim.</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
<div style="background:#f8fafc;border-radius:0.5rem;padding:1rem"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#6b7280;margin-bottom:0.5rem">What they say</p><p style="font-size:0.875rem;color:#6b7280;font-style:italic">"If you have a backup plan, you'll never go all in."</p></div>
<div style="background:rgba(239,68,68,0.05);border-radius:0.5rem;padding:1rem;border:1px solid rgba(239,68,68,0.1)"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#ef4444;margin-bottom:0.5rem">What they miss</p><p style="font-size:0.875rem;color:#6b7280">Ignores the reality that most people have families, mortgages, and healthcare tied to employment. 'Burning the boats' is advice from people who raised $500K before quitting.</p></div>
</div>
<div style="background:rgba(59,130,246,0.05);border-radius:0.5rem;padding:1rem;border-left:2px solid #3b82f6;margin-bottom:0.75rem"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#3b82f6;margin-bottom:0.5rem">Our answer</p><p style="font-size:0.875rem;color:#0f172a">Your job is the launchpad, not the trap. Your salary is runway funding that costs zero equity. Your 5 hours/week forces focus. You don't need to quit — you need a system that works within your constraints.</p></div>
<p style="font-size:0.75rem;color:#6b7280;font-style:italic"><strong>Verdict:</strong> Inspiring for 23-year-olds with no responsibilities. Dangerous for managers with families.</p>
</div>
<div style="padding:1.5rem;border:1px solid #e2e8f0;border-radius:0.75rem">
<h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem">MBA / Executive Coaching ($50K-$120K)</h3>
<p style="font-size:0.875rem;color:#6b7280;font-style:italic;margin-bottom:1rem">Climb higher. Get the credential. Network with other climbers.</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
<div style="background:#f8fafc;border-radius:0.5rem;padding:1rem"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#6b7280;margin-bottom:0.5rem">What they say</p><p style="font-size:0.875rem;color:#6b7280;font-style:italic">"Invest in yourself and the promotions will follow."</p></div>
<div style="background:rgba(239,68,68,0.05);border-radius:0.5rem;padding:1rem;border:1px solid rgba(239,68,68,0.1)"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#ef4444;margin-bottom:0.5rem">What they miss</p><p style="font-size:0.875rem;color:#6b7280">An MBA gives you a credential for someone else's ladder. It doesn't create revenue you own. It doesn't give you optionality. It deepens the golden handcuffs.</p></div>
</div>
<div style="background:rgba(59,130,246,0.05);border-radius:0.5rem;padding:1rem;border-left:2px solid #3b82f6;margin-bottom:0.75rem"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#3b82f6;margin-bottom:0.5rem">Our answer</p><p style="font-size:0.875rem;color:#0f172a">Instead of spending $100K on a credential that makes you more valuable to employers, spend $0.97/month on a system that makes you less dependent on them.</p></div>
<p style="font-size:0.75rem;color:#6b7280;font-style:italic"><strong>Verdict:</strong> Valuable for career advancement. Useless for financial freedom.</p>
</div>
<div style="padding:1.5rem;border:1px solid #e2e8f0;border-radius:0.75rem">
<h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem">No-Code Bootcamps ($500-$2,000)</h3>
<p style="font-size:0.875rem;color:#6b7280;font-style:italic;margin-bottom:1rem">Learn to build apps without code.</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
<div style="background:#f8fafc;border-radius:0.5rem;padding:1rem"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#6b7280;margin-bottom:0.5rem">What they say</p><p style="font-size:0.875rem;color:#6b7280;font-style:italic">"Anyone can build a SaaS with Bubble and Airtable!"</p></div>
<div style="background:rgba(239,68,68,0.05);border-radius:0.5rem;padding:1rem;border:1px solid rgba(239,68,68,0.1)"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#ef4444;margin-bottom:0.5rem">What they miss</p><p style="font-size:0.875rem;color:#6b7280">Teaches the tool, not the system. You learn to build — but not what to build, how to validate it, how to launch it stealthily, or how to get customers without ads.</p></div>
</div>
<div style="background:rgba(59,130,246,0.05);border-radius:0.5rem;padding:1rem;border-left:2px solid #3b82f6;margin-bottom:0.75rem"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#3b82f6;margin-bottom:0.5rem">Our answer</p><p style="font-size:0.875rem;color:#0f172a">Tools are commodities. The system is the asset. The Idea Pipeline tells you what to build. Launch Control tells you how to ship. Brand Manager tells you how to get customers. The tools are just the medium.</p></div>
<p style="font-size:0.75rem;color:#6b7280;font-style:italic"><strong>Verdict:</strong> Good for learning a skill. Insufficient as a path to freedom.</p>
</div>
<div style="padding:1.5rem;border:1px solid #e2e8f0;border-radius:0.75rem">
<h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem">Passive Income Gurus</h3>
<p style="font-size:0.875rem;color:#6b7280;font-style:italic;margin-bottom:1rem">Buy rental properties. Dividend invest. Build a blog and wait.</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
<div style="background:#f8fafc;border-radius:0.5rem;padding:1rem"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#6b7280;margin-bottom:0.5rem">What they say</p><p style="font-size:0.875rem;color:#6b7280;font-style:italic">"Passive income is the dream!"</p></div>
<div style="background:rgba(239,68,68,0.05);border-radius:0.5rem;padding:1rem;border:1px solid rgba(239,68,68,0.1)"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#ef4444;margin-bottom:0.5rem">What they miss</p><p style="font-size:0.875rem;color:#6b7280">Rental properties require capital and active management. Dividends require $1M+ invested. Blogs take 2-3 years to monetize. None are truly passive. None work for someone with 5 hours/week.</p></div>
</div>
<div style="background:rgba(59,130,246,0.05);border-radius:0.5rem;padding:1rem;border-left:2px solid #3b82f6;margin-bottom:0.75rem"><p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#3b82f6;margin-bottom:0.5rem">Our answer</p><p style="font-size:0.875rem;color:#0f172a">Micro-SaaS is as close to passive as recurring revenue gets. Build once, sell infinitely. The Launch Control tool automates the repetitive work. Your 5 hours go to growth, not maintenance.</p></div>
<p style="font-size:0.75rem;color:#6b7280;font-style:italic"><strong>Verdict:</strong> The dream is real. The gurus selling it usually aren't.</p>
</div>
</div>
</div>
</section>
<section style="padding:3rem 1.5rem;text-align:center">
<div style="max-width:36rem;margin:0 auto">
<p style="color:#3b82f6;font-size:0.875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1rem">The Core Difference</p>
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">Everything Else Teaches Improvement. We Offer a New Opportunity.</h2>
<div style="color:#4b5563;line-height:1.8">
<p style="margin-bottom:1.25rem">Side-hustle courses teach you to build a better business. FIRE teaches you to save more money. Quit-your-job advice teaches you to be braver. MBAs teach you to climb higher. All of these are improvement — incremental progress on a path you're already on.</p>
<p style="font-weight:500;font-size:1.125rem;color:#0f172a;margin-top:1rem">Invisible Exit doesn't improve your current path. It hands you a different vehicle entirely — one designed from the ground up for corporate managers who need to stay invisible, work in 5 hours/week, and reach $4,000/month in 12-18 months.</p>
</div>
<a href="/freedom" style="display:inline-block;margin-top:2rem;padding:0.75rem 1.5rem;background-color:#3b82f6;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number</a>
</div>
</section>
</div>`;
}

function aiToolProfessionBodyHtml(p: typeof aiToolProfessionPages[0]): string {
  const ideas = p.ideas.map((idea, i) => '<div style="padding:1.5rem;border:1px solid #e2e8f0;border-radius:0.75rem;margin-bottom:1.5rem"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.5rem">' + (i+1) + '. ' + idea.name + '</h3><p style="font-size:0.875rem;color:#475569;margin-bottom:1rem">' + idea.concept + '</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem"><div style="background:#f8fafc;border-radius:0.5rem;padding:0.75rem"><p style="font-size:0.75rem;color:#64748b;margin-bottom:0.25rem">Pricing</p><p style="font-size:0.875rem;font-weight:600">' + idea.pricing + '</p></div><div style="background:#f0fdf4;border-radius:0.5rem;padding:0.75rem"><p style="font-size:0.75rem;color:#64748b;margin-bottom:0.25rem">Revenue</p><p style="font-size:0.875rem;font-weight:600;color:#16a34a">' + idea.revenuePotential + '</p></div></div><div style="background:#eff6ff;border-radius:0.5rem;padding:1rem;border-left:2px solid #2563eb"><p style="font-size:0.75rem;font-weight:600;color:#2563eb;margin-bottom:0.25rem">How to use ' + p.tool + '</p><p style="font-size:0.875rem;color:#1e293b">' + idea.howToUseTool + '</p></div></div>').join('');
  const workflow = p.workflow.map((step, i) => '<div style="display:flex;gap:1rem;margin-bottom:0.75rem"><span style="width:2rem;height:2rem;border-radius:50%;background:#2563eb;color:white;font-weight:700;font-size:0.875rem;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + (i+1) + '</span><p style="font-size:0.875rem;color:#475569;padding-top:0.25rem">' + step + '</p></div>').join('');
  const tips = p.toolTips.map(tip => '<li style="margin-bottom:0.5rem">✓ ' + tip + '</li>').join('');
  const faqs = p.faqs.map(f => '<div style="padding:1.25rem;border:1px solid #e2e8f0;border-radius:0.5rem;margin-bottom:1rem"><h3 style="font-weight:600;font-size:0.875rem;margin-bottom:0.5rem">' + f.question + '</h3><p style="font-size:0.875rem;color:#475569">' + f.answer + '</p></div>').join('');
  return '<div class="min-h-screen">\n<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#64748b"><a href="/" style="color:#2563eb;text-decoration:none">Home</a> › <a href="/ideas" style="color:#2563eb;text-decoration:none">Ideas</a> › <span>' + p.profession + ' + ' + p.tool + '</span></nav>\n<article style="padding:3rem 1.5rem;max-width:48rem;margin:0 auto">\n<h1 style="font-size:2.25rem;font-weight:800;margin-bottom:1rem">' + p.h1 + '</h1>\n<p style="font-size:1.125rem;color:#475569;margin-bottom:2rem;line-height:1.7">' + p.intro + '</p>\n<section style="margin-bottom:2.5rem"><h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">5 Micro-SaaS Ideas</h2>' + ideas + '</section>\n<section style="margin-bottom:2.5rem"><h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">The 6-Step Workflow</h2>' + workflow + '</section>\n<section style="background:#f8fafc;border-radius:0.75rem;padding:1.5rem;margin-bottom:2.5rem"><h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">' + p.tool + ' Pro Tips</h2><ul style="list-style:none;padding:0">' + tips + '</ul></section>\n<section style="background:#fffbeb;border:1px solid #fde68a;border-radius:0.75rem;padding:1.5rem;margin-bottom:2.5rem"><h2 style="font-size:1.125rem;font-weight:700;color:#92400e;margin-bottom:0.5rem">Limitations</h2><p style="font-size:0.875rem;color:#78350f">' + p.limitations + '</p></section>\n<section style="margin-bottom:2.5rem"><h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">FAQ</h2>' + faqs + '</section>\n<div style="text-align:center;border-top:1px solid #e2e8f0;padding-top:2rem"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number</a></div>\n</article>\n</div>';
}

function budgetPageBodyHtml(b: typeof budgetPages[0]): string {
  const afford = b.whatYouCanAfford.map(i => '<li style="margin-bottom:0.5rem">✓ ' + i + '</li>').join('');
  const cannot = b.whatYouCannot.map(i => '<li style="margin-bottom:0.5rem">✗ ' + i + '</li>').join('');
  const stackRows = b.stack.map(s => '<tr style="border-top:1px solid #e2e8f0"><td style="padding:0.75rem;font-weight:500">' + s.category + '</td><td style="padding:0.75rem;color:#475569">' + s.tool + '</td><td style="padding:0.75rem;text-align:right;font-weight:600;color:#2563eb">' + s.cost + '</td></tr>').join('');
  const roadmapRows = b.roadmap.map(r => '<div style="display:flex;gap:1rem;padding:0.75rem;border:1px solid #e2e8f0;border-radius:0.5rem;margin-bottom:0.5rem"><div style="width:6rem;shrink:0"><p style="font-size:0.75rem;font-weight:700;color:#2563eb">' + r.week + '</p></div><p style="font-size:0.875rem;flex:1">' + r.task + '</p><p style="font-size:0.875rem;font-weight:600">' + r.cost + '</p></div>').join('');
  const faqs = b.faqs.map(f => '<div style="padding:1.25rem;border:1px solid #e2e8f0;border-radius:0.5rem;margin-bottom:1rem"><h3 style="font-weight:600;font-size:0.875rem;margin-bottom:0.5rem">' + f.question + '</h3><p style="font-size:0.875rem;color:#475569">' + f.answer + '</p></div>').join('');
  return '<div class="min-h-screen">\n<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#64748b"><a href="/" style="color:#2563eb;text-decoration:none">Home</a> › <span>Budget: ' + b.budget + '/month</span></nav>\n<article style="padding:3rem 1.5rem;max-width:48rem;margin:0 auto">\n<h1 style="font-size:2.25rem;font-weight:800;margin-bottom:1rem">' + b.h1 + '</h1>\n<p style="font-size:1.125rem;color:#475569;margin-bottom:2rem;line-height:1.7">' + b.intro + '</p>\n<section style="margin-bottom:2.5rem"><h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">What You Can Afford</h2><ul style="list-style:none;padding:0">' + afford + '</ul></section>\n<section style="margin-bottom:2.5rem"><h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">What You Cannot (Yet)</h2><ul style="list-style:none;padding:0">' + cannot + '</ul></section>\n<section style="margin-bottom:2.5rem"><h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">The Complete Stack</h2><table style="width:100%;font-size:0.875rem;border:1px solid #e2e8f0;border-radius:0.5rem;overflow:hidden;border-collapse:collapse"><thead><tr style="background:#f8fafc"><th style="text-align:left;padding:0.75rem">Category</th><th style="text-align:left;padding:0.75rem">Tool</th><th style="text-align:right;padding:0.75rem">Cost</th></tr></thead><tbody>' + stackRows + '</tbody></table></section>\n<section style="margin-bottom:2.5rem"><h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">Roadmap</h2>' + roadmapRows + '</section>\n<section style="background:#eff6ff;border-radius:0.75rem;padding:1.5rem;margin-bottom:2.5rem;border-left:4px solid #2563eb"><h2 style="font-size:1.125rem;font-weight:700;margin-bottom:0.5rem">First Milestone</h2><p style="font-size:0.875rem;color:#475569">' + b.firstMilestone + '</p></section>\n<section style="margin-bottom:2.5rem"><h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">FAQ</h2>' + faqs + '</section>\n<div style="text-align:center;border-top:1px solid #e2e8f0;padding-top:2rem"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number</a></div>\n</article>\n</div>';
}

function hoursPageBodyHtml(h: typeof hoursPages[0]): string {
  const schedule = h.weeklySchedule.map(s => '<div style="display:flex;gap:1rem;padding:1rem;border:1px solid #e2e8f0;border-radius:0.5rem;margin-bottom:0.75rem"><div style="width:8rem;shrink:0"><p style="font-size:0.75rem;font-weight:700;color:#2563eb">' + s.day + '</p><p style="font-size:0.75rem;color:#64748b">' + s.duration + '</p></div><div><p style="font-size:0.875rem;font-weight:600">' + s.block + '</p><p style="font-size:0.875rem;color:#475569">' + s.task + '</p></div></div>').join('');
  const accomplish = h.whatYouCanAccomplish.map(i => '<li style="margin-bottom:0.5rem">✓ ' + i + '</li>').join('');
  const cannot = h.whatYouCannot.map(i => '<li style="margin-bottom:0.5rem">✗ ' + i + '</li>').join('');
  const framework = h.framework.map(f => '<div style="display:flex;gap:1rem;padding:1rem;border:1px solid #e2e8f0;border-radius:0.5rem;margin-bottom:0.75rem"><div style="width:7rem;shrink:0"><p style="font-size:0.75rem;font-weight:700;color:#2563eb">' + f.phase + '</p></div><div><p style="font-size:0.875rem;font-weight:600">' + f.focus + '</p><p style="font-size:0.75rem;color:#64748b;margin-top:0.25rem">' + f.timeAllocation + '</p></div></div>').join('');
  const tips = h.tips.map((t, i) => '<li style="display:flex;gap:0.5rem;margin-bottom:0.5rem"><span style="width:1.5rem;height:1.5rem;border-radius:50%;background:#dbeafe;color:#2563eb;font-weight:700;font-size:0.75rem;display:inline-flex;align-items:center;justify-content:center;shrink:0">' + (i+1) + '</span><span style="font-size:0.875rem;color:#475569">' + t + '</span></li>').join('');
  const faqs = h.faqs.map(f => '<div style="padding:1.25rem;border:1px solid #e2e8f0;border-radius:0.5rem;margin-bottom:1rem"><h3 style="font-weight:600;font-size:0.875rem;margin-bottom:0.5rem">' + f.question + '</h3><p style="font-size:0.875rem;color:#475569">' + f.answer + '</p></div>').join('');
  return '<div class="min-h-screen">\n<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#64748b"><a href="/" style="color:#2563eb;text-decoration:none">Home</a> › <span>' + h.timeLabel + '</span></nav>\n<article style="padding:3rem 1.5rem;max-width:48rem;margin:0 auto">\n<h1 style="font-size:2.25rem;font-weight:800;margin-bottom:1rem">' + h.h1 + '</h1>\n<p style="font-size:1.125rem;color:#475569;margin-bottom:2rem;line-height:1.7">' + h.intro + '</p>\n<section style="margin-bottom:2.5rem"><h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">Weekly Schedule (' + h.hoursPerWeek + ' hours)</h2>' + schedule + '</section>\n<section style="margin-bottom:2.5rem"><h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">What You Can Accomplish</h2><ul style="list-style:none;padding:0">' + accomplish + '</ul></section>\n<section style="margin-bottom:2.5rem"><h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">What You Cannot</h2><ul style="list-style:none;padding:0">' + cannot + '</ul></section>\n<section style="margin-bottom:2.5rem"><h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">The Framework</h2>' + framework + '</section>\n<section style="background:#eff6ff;border-radius:0.75rem;padding:1.5rem;margin-bottom:2.5rem;border-left:4px solid #2563eb"><h2 style="font-size:1.125rem;font-weight:700;margin-bottom:0.5rem">Milestone Timeline</h2><p style="font-size:0.875rem;color:#475569">' + h.milestoneEstimate + '</p></section>\n<section style="background:#f8fafc;border-radius:0.75rem;padding:1.5rem;margin-bottom:2.5rem"><h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">Pro Tips</h2><ul style="list-style:none;padding:0">' + tips + '</ul></section>\n<section style="margin-bottom:2.5rem"><h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">FAQ</h2>' + faqs + '</section>\n<div style="text-align:center;border-top:1px solid #e2e8f0;padding-top:2rem"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number</a></div>\n</article>\n</div>';
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

  // ── pSEO Round 2 body injection ──
  for (const item of professionMistakes) {
    if (injectBody(resolve(DIST, "mistakes", item.slug, "index.html"), professionMistakesBodyHtml(item))) { count++; }
  }
  for (const item of redditStrategies) {
    if (injectBody(resolve(DIST, "reddit", item.slug, "index.html"), redditStrategyBodyHtml(item))) { count++; }
  }
  for (const item of pricingModels) {
    if (injectBody(resolve(DIST, "pricing-models", item.slug, "index.html"), pricingModelBodyHtml(item))) { count++; }
  }
  for (const item of breakEvenPages) {
    if (injectBody(resolve(DIST, "break-even", item.slug, "index.html"), breakEvenBodyHtml(item))) { count++; }
  }
  for (const item of professionVsCareer) {
    if (injectBody(resolve(DIST, "vs", item.slug, "index.html"), professionVsCareerBodyHtml(item))) { count++; }
  }
  for (const item of firstYearEntries) {
    if (injectBody(resolve(DIST, "first-year", item.slug, "index.html"), firstYearBodyHtml(item))) { count++; }
  }
  for (const item of toolCrossReference) {
    if (injectBody(resolve(DIST, "tools", item.slug, "index.html"), toolCrossRefBodyHtml(item))) { count++; }
  }

  // ── Flagship pages (SEO-critical — were rendering client-side only) ──
  if (injectBody(resolve(DIST, "manifesto", "index.html"), manifestoBodyHtml())) {
    console.log("  /manifesto");
    count++;
  }
  if (injectBody(resolve(DIST, "guides", "freedom-number", "index.html"), pillarFreedomNumberBodyHtml())) {
    console.log("  /guides/freedom-number");
    count++;
  }
  if (injectBody(resolve(DIST, "compare", "index.html"), comparePageBodyHtml())) {
    console.log("  /compare");
    count++;
  }

  // ── Greg Isenberg pSEO Round 3: Budget + Hours pages ──
  for (const b of budgetPages) {
    if (injectBody(resolve(DIST, "budget", b.slug, "index.html"), budgetPageBodyHtml(b))) { count++; }
  }
  for (const h of hoursPages) {
    if (injectBody(resolve(DIST, "hours", h.slug, "index.html"), hoursPageBodyHtml(h))) { count++; }
  }

  // AI Tool × Profession pages
  for (const p of aiToolProfessionPages) {
    const filePath = resolve(DIST, "ideas", p.professionSlug, "with", p.toolSlug, "index.html");
    if (injectBody(filePath, aiToolProfessionBodyHtml(p))) { count++; }
  }

  // Tool Alternatives pages
  for (const ta of toolAlternatives) {
    if (injectBody(resolve(DIST, "alternatives", "to", ta.slug, "index.html"), toolAlternativeBodyHtml(ta))) { count++; }
  }

  // SaaS Blueprint pages
  for (const bp of saasBlueprints) {
    if (injectBody(resolve(DIST, "blueprint", bp.slug, "index.html"), blueprintBodyHtml(bp))) { count++; }
  }

  // Revenue Roadmap pages
  for (const rr of revenueRoadmaps) {
    if (injectBody(resolve(DIST, "roadmap", rr.slug, "index.html"), revenueRoadmapBodyHtml(rr))) { count++; }
  }

  console.log(`Done. Injected body content into ${count} pages.`);
}

// ---------- Tool Alternatives body ----------

function toolAlternativeBodyHtml(ta: typeof toolAlternatives[0]): string {
  const altCards = ta.alternatives.map((alt) =>
    `<div style="padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;margin-bottom:1.5rem">
<h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem">${alt.name}</h3>
<p style="color:#3B82F6;font-size:0.875rem;font-weight:600;margin-bottom:0.5rem">${alt.bestFor}</p>
<p style="font-size:0.875rem;color:#6b7280;margin-bottom:1rem"><strong>Pricing:</strong> ${alt.pricing}</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
<div><p style="font-size:0.75rem;font-weight:700;color:#15803d;text-transform:uppercase;margin-bottom:0.5rem">Pros</p><ul style="font-size:0.875rem;color:#1f2937;padding-left:1.25rem;line-height:1.6">${alt.pros.map((p) => `<li>${p}</li>`).join("")}</ul></div>
<div><p style="font-size:0.75rem;font-weight:700;color:#b91c1c;text-transform:uppercase;margin-bottom:0.5rem">Cons</p><ul style="font-size:0.875rem;color:#1f2937;padding-left:1.25rem;line-height:1.6">${alt.cons.map((c) => `<li>${c}</li>`).join("")}</ul></div>
</div>
</div>`).join("\n");

  const faqs = ta.faqs.map((f) =>
    `<div style="margin-bottom:1.5rem"><h3 style="font-weight:700;margin-bottom:0.5rem">${f.question}</h3><p style="color:#4b5563;line-height:1.7">${f.answer}</p></div>`).join("\n");

  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/alternatives" style="color:#3B82F6;text-decoration:none">Alternatives</a> &rsaquo; <span>${ta.tool} Alternatives</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<span style="display:inline-block;padding:0.25rem 0.75rem;background-color:#dbeafe;color:#1e40af;border-radius:9999px;font-size:0.75rem;font-weight:600;margin-bottom:1rem">${ta.category}</span>
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${ta.h1}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:1rem">${ta.intro}</p>
</div>
</section>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto" class="quick-answer">
<p style="font-size:0.875rem;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Why Look Beyond ${ta.tool}?</p>
<p style="font-size:1rem;line-height:1.6;color:#111827">${ta.why}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">${ta.alternatives.length} ${ta.tool} Alternatives</h2>
${altCards}
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">Frequently Asked Questions</h2>
${faqs}
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number</a>
</div>
</section>
</div>`;
}

// ---------- SaaS Blueprint body ----------

function blueprintBodyHtml(bp: typeof saasBlueprints[0]): string {
  const steps = bp.steps.map((s, i) =>
    `<li style="margin-bottom:1.5rem"><strong>${i + 1}. ${s.name}</strong><p style="color:#4b5563;margin-top:0.25rem;font-size:0.875rem">${s.description}</p><p style="font-size:0.75rem;color:#6b7280;margin-top:0.25rem"><strong>Tools:</strong> ${s.tools.join(", ")} · <strong>Time:</strong> ${s.timeEstimate}</p></li>`).join("\n");

  const timeline = bp.timeline.map((t) =>
    `<tr><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb;font-weight:600">${t.phase}</td><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb">${t.duration}</td><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb">${t.goal}</td></tr>`).join("\n");

  const faqs = bp.faqs.map((f) =>
    `<div style="margin-bottom:1.5rem"><h3 style="font-weight:700;margin-bottom:0.5rem">${f.question}</h3><p style="color:#4b5563;line-height:1.7">${f.answer}</p></div>`).join("\n");

  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Blueprints</span> &rsaquo; <span>${bp.type}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<span style="display:inline-block;padding:0.25rem 0.75rem;background-color:#dbeafe;color:#1e40af;border-radius:9999px;font-size:0.75rem;font-weight:600;margin-bottom:1rem">${bp.category}</span>
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${bp.h1}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:1rem">${bp.intro}</p>
</div>
</section>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.875rem;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Market Opportunity</p>
<p style="font-size:1rem;line-height:1.6;color:#111827">${bp.marketOpportunity}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Recommended Tech Stack</h2>
<div style="display:flex;flex-wrap:wrap;gap:0.5rem">${bp.techStack.map((t) => `<span style="display:inline-block;padding:0.375rem 0.875rem;background:#f3f4f6;border-radius:0.5rem;font-size:0.875rem;font-weight:500">${t}</span>`).join("")}</div>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">Step-by-Step Build Guide</h2>
<ol style="list-style:none;padding:0">${steps}</ol>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Pricing & Monetization</h2>
<table style="width:100%;font-size:0.875rem;border-collapse:collapse">
<tr><td style="padding:0.75rem;font-weight:600;border-bottom:1px solid #e5e7eb">Model</td><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb">${bp.pricing.model}</td></tr>
<tr><td style="padding:0.75rem;font-weight:600;border-bottom:1px solid #e5e7eb">Range</td><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb">${bp.pricing.range}</td></tr>
<tr><td style="padding:0.75rem;font-weight:600;border-bottom:1px solid #e5e7eb">Example</td><td style="padding:0.75rem;border-bottom:1px solid #e5e7eb">${bp.pricing.example}</td></tr>
</table>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Realistic Timeline</h2>
<table style="width:100%;font-size:0.875rem;border-collapse:collapse">
<thead><tr style="background:#f8fafc"><th style="text-align:left;padding:0.75rem">Phase</th><th style="text-align:left;padding:0.75rem">Duration</th><th style="text-align:left;padding:0.75rem">Goal</th></tr></thead>
<tbody>${timeline}</tbody>
</table>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">Frequently Asked Questions</h2>
${faqs}
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number</a>
</div>
</section>
</div>`;
}

// ---------- Revenue Roadmap body ----------

function revenueRoadmapBodyHtml(rr: typeof revenueRoadmaps[0]): string {
  const stages = rr.stages.map((s) =>
    `<div style="padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;margin-bottom:1.5rem">
<h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.25rem">${s.mrr}</h3>
<p style="font-size:0.875rem;color:#3B82F6;font-weight:600;margin-bottom:0.5rem">${s.customers} · ${s.focus}</p>
<p style="font-size:0.75rem;color:#6b7280;margin-bottom:0.75rem">Timeline: ${s.timeToReach}</p>
<ul style="font-size:0.875rem;color:#1f2937;padding-left:1.25rem;line-height:1.8">${s.keyActions.map((a) => `<li>${a}</li>`).join("")}</ul>
</div>`).join("\n");

  const channels = rr.channelStrategy.map((c) =>
    `<div style="padding:1rem;border-left:3px solid #3B82F6;margin-bottom:1rem"><strong>${c.phase}:</strong> ${c.channel}<p style="font-size:0.875rem;color:#6b7280;margin-top:0.25rem">${c.why}</p></div>`).join("\n");

  const faqs = rr.faqs.map((f) =>
    `<div style="margin-bottom:1.5rem"><h3 style="font-weight:700;margin-bottom:0.5rem">${f.question}</h3><p style="color:#4b5563;line-height:1.7">${f.answer}</p></div>`).join("\n");

  return `<div class="min-h-screen">
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/roadmap" style="color:#3B82F6;text-decoration:none">Revenue Roadmaps</a> &rsaquo; <span>${rr.target}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${rr.h1}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:1rem">${rr.intro}</p>
</div>
</section>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto" class="quick-answer">
<p style="font-size:0.875rem;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">The Customer Math</p>
<p style="font-size:1.125rem;line-height:1.6;color:#111827;font-weight:500">At <strong>${rr.customerMath.pricing}</strong>, you need <strong>${rr.customerMath.customersNeeded} customers</strong> to reach <strong>${rr.customerMath.monthlyRevenue}</strong>.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">The Path to ${rr.target}</h2>
${stages}
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Channel Strategy</h2>
${channels}
<p style="margin-top:1.5rem;padding:1rem;background:#fffbeb;border-radius:0.5rem;font-size:0.875rem;color:#92400e"><strong>Realistic timeline:</strong> ${rr.realisticTimeline}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">Frequently Asked Questions</h2>
${faqs}
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number</a>
</div>
</section>
</div>`;
}

main();
