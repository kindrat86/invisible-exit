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
import { costAnalysisPages } from "../src/data/cost-analysis.js";
import { howToGuides } from "../src/data/how-to-guides.js";
import { isItLegalPages } from "../src/data/is-it-legal.js";

// ── Greg Isenberg pSEO Round 4 ──
import { sideHustles } from "../src/data/side-hustles.js";
import { budgetStartPages } from "../src/data/budget-start.js";
import { niches } from "../src/data/niches.js";

// ── Greg Isenberg pSEO Round 5 ──
import { quitJobPages } from "../src/data/quit-job.js";
import { weekendBuilds } from "../src/data/weekend-builds.js";
import { failureStories } from "../src/data/failure-stories.js";

// ── Greg Isenberg pSEO Round 6 ──
import { toolReviews } from "../src/data/tool-reviews.js";

// ── Greg Isenberg pSEO Round 7 ──
import { caseStudies } from "../src/data/case-studies.js";
import { revenueTargets } from "../src/data/revenue-targets.js";
import { cities } from "../src/data/cities.js";
import { skills } from "../src/data/skills.js";
import { audienceIdeas } from "../src/data/audience-ideas.js";
import { cityProfessionPages } from "../src/data/city-profession.js";

// ---------- Markdown-like content → HTML ----------

function bold(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

// Generate a "Related Resources" section for pSEO pages (improves internal linking)
function relatedLinksSection(links: { href: string; text: string }[]): string {
  if (!links.length) return "";
  const items = links.map(l =>
    `<a href="${l.href}" style="display:block;padding:0.75rem 1rem;border:1px solid #e5e7eb;border-radius:0.5rem;text-decoration:none;color:#374151;font-size:0.875rem;margin-bottom:0.5rem;transition:border-color 0.15s">${l.text}</a>`
  ).join("\n");
  return `<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.25rem;margin-bottom:1rem;color:#0f172a">Related Resources</h2>${items}</div></section>`;
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
    { pattern: /\bside hustle\b/i, href: "/side-hustles", text: "side hustle" },
    { pattern: /\bcase stud/i, href: "/case-studies", text: "case stud" },
    { pattern: /\bfailure stor/i, href: "/failure-stories", text: "failure stor" },
    { pattern: /\bquit your job\b/i, href: "/quit-your-job", text: "quit your job" },
    { pattern: /\bweekend build\b/i, href: "/weekend-builds", text: "weekend build" },
    { pattern: /\btool review\b/i, href: "/reviews", text: "tool review" },
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
${hubSvgFigure("Blog", "53 articles for employed founders", "Invisible Exit blog — articles on financial independence, micro-SaaS, stealth operations, and audience building")}
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
${hubSvgFigure("Blog Category", "Articles by topic", "Blog category page with curated articles for employed founders building micro-SaaS businesses")}
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
${hubSvgFigure("Comparisons", "Side-by-side analysis", "Detailed comparison of micro-SaaS alternatives and frameworks for employed founders")}
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

// ---------- Reusable SVG content image for hub pages ----------
function hubSvgFigure(title: string, subtitle: string, altText: string): string {
  const safeTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeSub = subtitle.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<figure style="margin:0 auto 2rem;padding:0 1.5rem;max-width:48rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" role="img" aria-label="${altText}" style="width:100%;height:auto;border-radius:0.75rem;border:1px solid #e5e7eb">
<rect width="800" height="200" fill="#0f172a" rx="12"/>
<text x="400" y="60" text-anchor="middle" fill="#3B82F6" font-size="22" font-weight="700" font-family="system-ui">${safeTitle}</text>
<text x="400" y="90" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="system-ui">${safeSub}</text>
<rect x="200" y="115" width="400" height="3" fill="#1e3a5f" rx="1"/>
<text x="400" y="145" text-anchor="middle" fill="#64748b" font-size="11" font-family="system-ui">Invisible Exit — Build a Side Business While Employed</text>
<text x="400" y="165" text-anchor="middle" fill="#475569" font-size="10" font-family="system-ui">5 AI-powered tools · From $0.97/month · No code required</text>
</svg>
<figcaption style="font-size:0.875rem;color:#6b7280;margin-top:0.5rem;text-align:center">${altText}</figcaption>
</figure>`;
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
<figure style="margin:0 auto 2rem;padding:0 1.5rem;max-width:56rem">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" role="img" aria-label="The Invisible Exit System: 5 AI-powered tools for building a micro-SaaS business while employed — FYM Dashboard, Idea Pipeline, Stealth Ops Hub, Launch Control, and Brand Manager" style="width:100%;height:auto;border-radius:0.75rem;border:1px solid #e5e7eb">
<rect width="800" height="320" fill="#0f172a" rx="12"/>
<text x="400" y="35" text-anchor="middle" fill="#3B82F6" font-size="18" font-weight="700" font-family="system-ui">The Invisible Exit System</text>
<text x="400" y="58" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="system-ui">5 AI-Powered Tools for Employed Founders</text>
<circle cx="120" cy="130" r="50" fill="#1e3a5f" stroke="#3B82F6" stroke-width="2"/>
<text x="120" y="125" text-anchor="middle" fill="white" font-size="11" font-weight="700" font-family="system-ui">FYM</text>
<text x="120" y="140" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="system-ui">Dashboard</text>
<text x="120" y="200" text-anchor="middle" fill="#64748b" font-size="8" font-family="system-ui">Calculate your</text>
<text x="120" y="212" text-anchor="middle" fill="#64748b" font-size="8" font-family="system-ui">freedom number</text>
<circle cx="260" cy="130" r="50" fill="#1e3a5f" stroke="#3B82F6" stroke-width="2"/>
<text x="260" y="125" text-anchor="middle" fill="white" font-size="11" font-weight="700" font-family="system-ui">Idea</text>
<text x="260" y="140" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="system-ui">Pipeline</text>
<text x="260" y="200" text-anchor="middle" fill="#64748b" font-size="8" font-family="system-ui">Validate ideas</text>
<text x="260" y="212" text-anchor="middle" fill="#64748b" font-size="8" font-family="system-ui">in 48 hours</text>
<circle cx="400" cy="130" r="50" fill="#1e3a5f" stroke="#3B82F6" stroke-width="2"/>
<text x="400" y="125" text-anchor="middle" fill="white" font-size="11" font-weight="700" font-family="system-ui">Stealth</text>
<text x="400" y="140" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="system-ui">Ops Hub</text>
<text x="400" y="200" text-anchor="middle" fill="#64748b" font-size="8" font-family="system-ui">Stay invisible</text>
<text x="400" y="212" text-anchor="middle" fill="#64748b" font-size="8" font-family="system-ui">&amp; compliant</text>
<circle cx="540" cy="130" r="50" fill="#1e3a5f" stroke="#3B82F6" stroke-width="2"/>
<text x="540" y="125" text-anchor="middle" fill="white" font-size="11" font-weight="700" font-family="system-ui">Launch</text>
<text x="540" y="140" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="system-ui">Control</text>
<text x="540" y="200" text-anchor="middle" fill="#64748b" font-size="8" font-family="system-ui">Ship products</text>
<text x="540" y="212" text-anchor="middle" fill="#64748b" font-size="8" font-family="system-ui">in 5 hrs/week</text>
<circle cx="680" cy="130" r="50" fill="#1e3a5f" stroke="#3B82F6" stroke-width="2"/>
<text x="680" y="125" text-anchor="middle" fill="white" font-size="11" font-weight="700" font-family="system-ui">Brand</text>
<text x="680" y="140" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="system-ui">Manager</text>
<text x="680" y="200" text-anchor="middle" fill="#64748b" font-size="8" font-family="system-ui">Get customers</text>
<text x="680" y="212" text-anchor="middle" fill="#64748b" font-size="8" font-family="system-ui">anonymously</text>
<line x1="170" y1="130" x2="210" y2="130" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4"/>
<line x1="310" y1="130" x2="350" y2="130" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4"/>
<line x1="450" y1="130" x2="490" y2="130" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4"/>
<line x1="590" y1="130" x2="630" y2="130" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4"/>
<rect x="250" y="250" width="300" height="40" fill="#1e3a5f" rx="8"/>
<text x="400" y="268" text-anchor="middle" fill="#3B82F6" font-size="11" font-weight="600" font-family="system-ui">Freedom Number = $4K/month MRR</text>
<text x="400" y="282" text-anchor="middle" fill="#64748b" font-size="9" font-family="system-ui">138 customers × $29/month = financial independence</text>
</svg>
<figcaption style="font-size:0.875rem;color:#6b7280;margin-top:0.5rem;text-align:center;line-height:1.5">The Invisible Exit System: 5 connected AI tools that take you from employed to financially independent — calculate your freedom number, validate ideas, stay compliant, launch products, and build an audience without showing your face.</figcaption>
</figure>
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
${hubSvgFigure("About Invisible Exit", "Built by a corporate manager", "About the founder and methodology behind Invisible Exit — 5 AI tools for building anonymous recurring revenue")}
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
${hubSvgFigure("Micro-SaaS Ideas", "Validated by profession", "Curated micro-SaaS ideas with market analysis, competitive landscape, and revenue potential")}
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
${hubSvgFigure("Best AI Tools", "Reviewed for micro-SaaS", "Curated list of the best AI tools, no-code platforms, and services for building micro-SaaS products")}
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
${hubSvgFigure("Calculators", "Financial tools for founders", "Interactive calculators for freedom number, break-even, and pricing — financial planning for employed founders")}
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
${hubSvgFigure("Data Reports", "Original statistics", "Original data and benchmark reports on micro-SaaS economics, designed for citation and reference")}
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
${hubSvgFigure("Resources", "Step-by-step playbooks", "Multi-step resource playbooks for building, launching, and growing a micro-SaaS while employed")}
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
${hubSvgFigure("Alternatives", "Product comparison", "Detailed comparison of product alternatives with pros, cons, pricing, and recommendations")}
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
${hubSvgFigure("Salary to Freedom", "Freedom number math", "Salary-to-freedom number conversion showing how much micro-SaaS revenue replaces your income")}
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
${relatedLinksSection([
  { href: `/ideas/for-${item.slug}s`, text: `← Micro-SaaS Ideas for ${item.role}s` },
  { href: `/side-hustles/for-${item.slug}s`, text: `Best Side Hustles for ${item.role}s` },
  { href: `/mistakes/mistakes-${item.slug}s-make`, text: `Mistakes ${item.role}s Make When Starting a Side Business` },
  { href: `/cost-of-waiting/${item.slug}`, text: `Cost of Waiting for ${item.role}s — How Much You're Losing` },
  { href: `/case-studies`, text: `Micro-SaaS Case Studies with Real Revenue Numbers` },
  { href: `/quit-your-job`, text: `When to Quit Your Job — Honest Framework` },
])}
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
${hubSvgFigure("Revenue Milestones", "Stage-by-stage guide", "Micro-SaaS revenue milestone guide — what to expect and do at each MRR tier")}
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
${hubSvgFigure("Timeline", "Month-by-month roadmap", "Month-by-month timeline for building a micro-SaaS while employed — actionable steps at each stage")}
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
${hubSvgFigure("Tool Stack", "Profession-specific recommendations", "Recommended tool stack tailored to your profession and existing skills")}
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
${hubSvgFigure("Cost of Waiting", "Opportunity cost calculator", "The true financial cost of delaying your micro-SaaS business — lost revenue and compound growth")}
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
${hubSvgFigure("Non-Compete Analysis", "Legal risk assessment", "Non-compete clause analysis — enforceability, key risks, and safe harbors for your profession and state")}
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
${relatedLinksSection([
  { href: `/guides/${item.state.toLowerCase()}`, text: `← Anonymous LLC Guide for ${item.state}` },
  { href: `/ideas/for-${item.profession.toLowerCase().replace(/ /g, "-")}s/in/${item.state.toLowerCase().replace(/ /g, "-")}`, text: `Micro-SaaS Ideas for ${item.profession}s in ${item.state}` },
  { href: `/side-hustles/for-${item.profession.toLowerCase().replace(/ /g, "-")}s`, text: `Best Side Hustles for ${item.profession}s` },
  { href: `/salaries/${item.profession.toLowerCase().replace(/ /g, "-").replace(/s$/, "")}`, text: `Salary & Freedom Number for ${item.profession}s` },
  { href: `/glossary/non-compete`, text: `Non-Compete Clause — Definition & Explanation` },
  { href: `/blog/category/stealth-operations`, text: `Stealth Operations Articles` },
])}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto">
<a href="/guides/${item.state.toLowerCase()}" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Read the ${item.state} State Guide &rarr;</a>
</div></section>
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.75rem;color:#9ca3af"><strong>Legal Disclaimer:</strong> Non-compete information reflects general enforcement patterns. Non-compete law is rapidly evolving. This is NOT legal advice. Consult a licensed employment attorney for your specific situation.</p>
</div></section>
</div>`;
}

function professionStateBodyHtml(item: typeof professionStatePages[0]): string {
  const profSlug = item.professionSlug;
  const stateSlug = item.stateSlug;
  const related = relatedLinksSection([
    { href: `/ideas/${profSlug}`, text: `← All Micro-SaaS Ideas for ${item.profession}` },
    { href: `/side-hustles/${profSlug}`, text: `Best Side Hustles for ${item.profession}` },
    { href: `/salaries/${profSlug.replace(/^for-/, "").replace(/s$/, "")}`, text: `Salary & Freedom Number for ${item.profession}` },
    { href: `/mistakes/mistakes-${profSlug.replace(/^for-/, "").replace(/s$/, "")}s-make`, text: `Mistakes ${item.profession} Make When Starting a Side Business` },
    { href: `/non-compete/${profSlug.replace(/^for-/, "").replace(/s$/, "")}s-${stateSlug}`, text: `Non-Compete Guide for ${item.profession} in ${item.state}` },
    { href: `/guides/${stateSlug}`, text: `Anonymous LLC Guide for ${item.state}` },
    { href: `/case-studies`, text: `Micro-SaaS Case Studies with Real Revenue Numbers` },
    { href: `/weekend-builds`, text: `Weekend Build Ideas — Launch in 48 Hours` },
  ]);
  return `<div class="min-h-screen">
${hubSvgFigure("Profession × State", "Ideas by location", "Micro-SaaS ideas for your profession in your specific state — local considerations and opportunities")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/ideas/${profSlug}" style="color:#3B82F6;text-decoration:none">${item.profession}</a> &rsaquo; <span>${item.state}</span>
</nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1>
<p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p>
</div></section>
${related}
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
${hubSvgFigure("Common Mistakes", "Profession-specific pitfalls", "Mistakes that professionals make when starting a side business — and how to avoid them")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1><p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p></div></section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto">${mistakes}</div></section>
${signs ? `<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem;color:#166534">Signs You're on the Right Track</h2><ul>${signs}</ul></div></section>` : ""}
${faqs ? `<section style="padding:2rem 1.5rem;background-color:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>` : ""}
${relatedLinksSection([
  { href: `/ideas`, text: `← All Micro-SaaS Ideas` },
  { href: `/side-hustles`, text: `Best Side Hustles by Profession` },
  { href: `/failure-stories`, text: `Micro-SaaS Failure Stories — Learn From Real Mistakes` },
  { href: `/salaries`, text: `Salary to Freedom Number Calculator` },
  { href: `/case-studies`, text: `Successful Micro-SaaS Case Studies` },
  { href: `/quit-your-job`, text: `When to Quit Your Job — Honest Framework` },
])}
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
${hubSvgFigure("Reddit Strategy", "Anonymous audience building", "Reddit marketing strategy with best subreddits, posting schedule, and content templates")}
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
${hubSvgFigure("Pricing Model", "Revenue comparison", "Micro-SaaS pricing model analysis — how it works, pros, cons, and real revenue examples")}
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
${hubSvgFigure("Break-Even", "Financial projection", "Break-even analysis with month-by-month milestones showing when your micro-SaaS becomes profitable")}
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
${hubSvgFigure("Career vs SaaS", "Honest comparison", "Comparing staying in your career versus building a micro-SaaS — salary, equity, risk, and freedom")}
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
${hubSvgFigure("First Year", "12-month roadmap", "Month-by-month first-year roadmap for building a micro-SaaS — goals, deliverables, and reality checks")}
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
${hubSvgFigure("Tool Cross-Reference", "Best tools for your profession", "Recommended tools cross-referenced by profession and use case")}
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
${hubSvgFigure("Manifesto", "A movement for trapped professionals", "The Invisible Exit manifesto — why building anonymous recurring revenue is the path to freedom")}
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
${hubSvgFigure("Freedom Number", "The math of independence", "How to calculate your freedom number and build a system to reach it")}
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
${hubSvgFigure("Honest Comparison", "Invisible Exit vs alternatives", "How Invisible Exit compares to every alternative — features, pricing, and honest tradeoffs")}
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

  // ── Hub page bodies (were 0 words for crawlers) ──
  if (injectBody(resolve(DIST, "cost-analysis", "index.html"), costAnalysisHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "how-to", "index.html"), howToHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "is-it-legal", "index.html"), isItLegalHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "ideas", "index.html"), ideasHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "glossary", "index.html"), glossaryHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "guides", "index.html"), guidesHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "best", "index.html"), bestHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "alternatives", "index.html"), alternativesHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "salaries", "index.html"), salariesHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "data", "index.html"), dataHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "explore", "index.html"), exploreHubBodyHtml())) { count++; }

  // ── Greg Isenberg pSEO Round 4 — hub landing pages ──
  if (injectBody(resolve(DIST, "side-hustles", "index.html"), sideHustlesHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "by-budget", "index.html"), byBudgetHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "niches", "index.html"), nichesHubBodyHtml())) { count++; }

  // ── Greg Isenberg pSEO Round 5 — hub landing pages ──
  if (injectBody(resolve(DIST, "quit-your-job", "index.html"), quitJobHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "weekend-builds", "index.html"), weekendBuildsHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "failure-stories", "index.html"), failureStoriesHubBodyHtml())) { count++; }

  // ── Greg Isenberg pSEO Round 6 — hub landing pages ──
  if (injectBody(resolve(DIST, "reviews", "index.html"), reviewsHubBodyHtml())) { count++; }

  // ── Greg Isenberg pSEO Round 7 — hub landing pages ──
  if (injectBody(resolve(DIST, "case-studies", "index.html"), caseStudiesHubBodyHtml())) { count++; }

  // ── Missing pSEO hub pages (were 0 words for crawlers) ──
  if (injectBody(resolve(DIST, "non-compete", "index.html"), nonCompeteHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "salaries", "index.html"), salariesHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "stack", "index.html"), stackHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "milestones", "index.html"), milestonesHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "timeline", "index.html"), timelineHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "pricing-models", "index.html"), pricingModelsHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "reddit", "index.html"), redditHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "cost-of-waiting", "index.html"), costOfWaitingHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "break-even", "index.html"), breakEvenHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "budget", "index.html"), budgetHubBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "hours", "index.html"), hoursHubBodyHtml())) { count++; }

  // ── Critical funnel pages (0 body words) ──
  if (injectBody(resolve(DIST, "freedom", "index.html"), freedomPageBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "story", "index.html"), storyPageBodyHtml())) { count++; }
  if (injectBody(resolve(DIST, "masterclass", "index.html"), masterclassPageBodyHtml())) { count++; }

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

  // ── Greg Isenberg pSEO: Cost Analysis pages ──
  for (const ca of costAnalysisPages) {
    if (injectBody(resolve(DIST, "cost-analysis", ca.slug, "index.html"), costAnalysisBodyHtml(ca))) { count++; }
  }

  // ── Greg Isenberg pSEO: How-To guides ──
  for (const hg of howToGuides) {
    if (injectBody(resolve(DIST, "how-to", hg.slug, "index.html"), howToBodyHtml(hg))) { count++; }
  }

  // ── Greg Isenberg pSEO: Is It Legal pages ──
  for (const il of isItLegalPages) {
    if (injectBody(resolve(DIST, "is-it-legal", il.slug, "index.html"), isItLegalBodyHtml(il))) { count++; }
  }

  // ── Greg Isenberg pSEO Round 4: Side Hustle pages ──
  for (const sh of sideHustles) {
    if (injectBody(resolve(DIST, "side-hustles", sh.slug, "index.html"), sideHustleBodyHtml(sh))) { count++; }
  }

  // ── Greg Isenberg pSEO Round 4: Budget Start pages ──
  for (const bs of budgetStartPages) {
    if (injectBody(resolve(DIST, "by-budget", bs.slug, "index.html"), budgetStartBodyHtml(bs))) { count++; }
  }

  // ── Greg Isenberg pSEO Round 4: Niche pages ──
  for (const n of niches) {
    if (injectBody(resolve(DIST, "niches", n.slug, "index.html"), nicheBodyHtml(n))) { count++; }
  }

  // ── Greg Isenberg pSEO Round 5: Quit Your Job pages ──
  for (const q of quitJobPages) {
    if (injectBody(resolve(DIST, "quit-your-job", q.slug, "index.html"), quitJobBodyHtml(q))) { count++; }
  }

  // ── Greg Isenberg pSEO Round 5: Weekend Build pages ──
  for (const w of weekendBuilds) {
    if (injectBody(resolve(DIST, "weekend-builds", w.slug, "index.html"), weekendBuildBodyHtml(w))) { count++; }
  }

  // ── Greg Isenberg pSEO Round 5: Failure Story pages ──
  for (const f of failureStories) {
    if (injectBody(resolve(DIST, "failure-stories", f.slug, "index.html"), failureStoryBodyHtml(f))) { count++; }
  }

  // ── Greg Isenberg pSEO Round 6: Tool Review pages ──
  for (const t of toolReviews) {
    if (injectBody(resolve(DIST, "reviews", t.slug, "index.html"), toolReviewBodyHtml(t))) { count++; }
  }

  // ── Greg Isenberg pSEO Round 7: Case Study pages ──
  for (const c of caseStudies) {
    if (injectBody(resolve(DIST, "case-studies", c.slug, "index.html"), caseStudyBodyHtml(c))) { count++; }
  }

  // ── Greg Isenberg pSEO Round 8: Revenue Target pages ──
  for (const r of revenueTargets) {
    if (injectBody(resolve(DIST, "revenue", r.slug, "index.html"), revenueTargetBodyHtml(r))) { count++; }
  }

  // ── Greg Isenberg pSEO Round 8: City pages ──
  for (const c of cities) {
    if (injectBody(resolve(DIST, "cities", c.slug, "index.html"), cityBodyHtml(c))) { count++; }
  }

  // ── Greg Isenberg pSEO Round 8: Skill Monetization pages ──
  for (const s of skills) {
    if (injectBody(resolve(DIST, "skills", s.slug, "index.html"), skillBodyHtml(s))) { count++; }
  }

  // ── Greg Isenberg pSEO Round 9: Audience/Demographic pages ──
  for (const a of audienceIdeas) {
    if (injectBody(resolve(DIST, "audience", a.slug, "index.html"), audienceBodyHtml(a))) { count++; }
  }
  if (audienceIdeas.length > 0) {
    if (injectBody(resolve(DIST, "audience", "index.html"), audienceHubBodyHtml())) { count++; }
  }

  // ── Greg Isenberg pSEO Round 9: City × Profession cross pages ──
  for (const cp of cityProfessionPages) {
    const filePath = resolve(DIST, "cities", cp.citySlug, "for", cp.professionSlug, "index.html");
    if (injectBody(filePath, cityProfessionBodyHtml(cp))) { count++; }
  }

  console.log(`Done. Injected body content into ${count} pages.`);
}

function sideHustleBodyHtml(item: typeof sideHustles[0]): string {
  const hustles = item.bestHustles.map((h: any, i: number) =>
    `<div style="padding:1rem;border:1px solid #e2e8f0;border-radius:0.5rem;margin-bottom:0.75rem"><h3 style="font-weight:700;font-size:1rem;margin-bottom:0.25rem">${i+1}. ${h.name}</h3><p style="font-size:0.875rem;color:#4b5563">${h.description}</p><div style="margin-top:0.5rem;display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;font-size:0.8rem"><span style="color:#6b7280">Earning: <strong style="color:#166534">${h.earningPotential}</strong></span><span style="color:#6b7280">Cost: <strong>${h.startupCost}</strong></span><span style="color:#6b7280">Skills: <strong>${h.skillsNeeded}</strong></span></div></div>`
  ).join("\n");
  const schedule = item.weeklySchedule.map((s: any) =>
    `<div style="display:flex;align-items:center;gap:1rem;padding:0.75rem;background:#f9fafb;border-radius:0.5rem;margin-bottom:0.5rem;font-size:0.875rem"><span style="font-weight:600;color:#374151;min-width:8rem">${s.day}</span><span style="flex:1;color:#6b7280">${s.task}</span><span style="font-weight:600;color:#2563eb">${s.hours}</span></div>`
  ).join("\n");
  const tools = item.tools.map((t: string) => `<span style="display:inline-block;padding:0.25rem 0.75rem;background:#f1f5f9;border-radius:0.375rem;font-size:0.8rem;color:#475569;margin:0.15rem">${t}</span>`).join("");
  const pros = item.pros.map((p: string) => `<li style="color:#374151;margin-bottom:0.25rem">✅ ${p}</li>`).join("");
  const cons = item.cons.map((c: string) => `<li style="color:#374151;margin-bottom:0.25rem">⚠️ ${c}</li>`).join("");
  const faqs = item.faqs.map((f: any) => `<div style="margin-bottom:1.5rem"><h3 style="font-weight:600;font-size:1rem;color:#0f172a">${f.question}</h3><p style="color:#6b7280;font-size:0.9rem;margin-top:0.25rem">${f.answer}</p></div>`).join("");
  return `<div class="min-h-screen">
${hubSvgFigure("Side Hustles", "Profession-specific opportunities", "Best side hustles for professionals looking to build additional income streams")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1><p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem"><div style="background:#eff6ff;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:0.75rem;font-weight:700;color:#1d4ed8">${item.hustleType}</div><div style="font-size:0.7rem;color:#6b7280">Type</div></div><div style="background:#f0fdf4;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:0.75rem;font-weight:700;color:#166534">${item.startupCost}</div><div style="font-size:0.7rem;color:#6b7280">Startup Cost</div></div><div style="background:#faf5ff;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:0.75rem;font-weight:700;color:#7e22ce">${item.timeToFirstDollar}</div><div style="font-size:0.7rem;color:#6b7280">Time to First \$</div></div><div style="background:#fff7ed;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:0.75rem;font-weight:700;color:#c2410c">${item.weeklyTimeCommitment}</div><div style="font-size:0.7rem;color:#6b7280">Weekly Time</div></div></div>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Top 5 Side Hustles Ranked</h2>${hustles}</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Recommended Weekly Schedule</h2>${schedule}</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Recommended Tools</h2><div>${tools}</div></div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:2rem"><div><h3 style="font-weight:700;color:#166534">Pros</h3><ul style="margin-top:0.75rem">${pros}</ul></div><div><h3 style="font-weight:700;color:#dc2626">Cons</h3><ul style="margin-top:0.75rem">${cons}</ul></div></div></section>
${faqs ? `<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>` : ""}
${relatedLinksSection([
  { href: "/ideas", text: "→ Browse all micro-SaaS ideas by profession" },
  { href: "/quit-your-job", text: "→ When should you quit your job? Honest framework" },
  { href: "/salaries", text: "→ Salary to freedom number calculator" },
  { href: "/case-studies", text: "→ Real micro-SaaS case studies with revenue numbers" },
  { href: "/niches", text: "→ Best micro-SaaS niches for 2025" },
])}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a></div></section>
</div>`;
}

function budgetStartBodyHtml(item: typeof budgetStartPages[0]): string {
  const options = item.bestOptions.map((o: any, i: number) =>
    `<div style="padding:1rem;border:1px solid #e2e8f0;border-radius:0.5rem;margin-bottom:0.75rem"><div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem"><h3 style="font-weight:700;font-size:1rem">${o.name}</h3><span style="flex-shrink:0;border-radius:9999px;background:#dbeafe;padding:0.25rem 0.75rem;font-size:0.75rem;font-weight:600;color:#1d4ed8">${o.type}</span></div><p style="font-size:0.875rem;color:#4b5563;margin-top:0.25rem">${o.description}</p><div style="margin-top:0.5rem;display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;font-size:0.8rem"><span style="color:#6b7280">Revenue: <strong style="color:#166534">${o.revenuePotential}</strong></span><span style="color:#6b7280">Cost: <strong>${o.monthlyCost}</strong></span><span style="color:#6b7280">Time to \$: <strong>${o.timeToRevenue}</strong></span></div></div>`
  ).join("\n");
  const plan = item.first30DaysPlan.map((w: any, i: number) =>
    `<div style="display:flex;gap:1rem;padding:0.75rem;background:#f9fafb;border-radius:0.5rem;margin-bottom:0.5rem"><div style="flex-shrink:0;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:#2563eb;color:white;font-weight:700;font-size:0.875rem">${i+1}</div><div style="flex:1"><div style="font-weight:600;color:#0f172a">${w.week}: ${w.focus}</div><div style="font-size:0.8rem;color:#6b7280;margin-top:0.25rem">🎯 ${w.outcome}</div></div></div>`
  ).join("\n");
  const stack = item.stack.map((s: string) => `<span style="display:inline-block;padding:0.25rem 0.75rem;background:#f1f5f9;border-radius:0.375rem;font-size:0.8rem;color:#475569;margin:0.15rem">${s}</span>`).join("");
  const faqs = item.faqs.map((f: any) => `<div style="margin-bottom:1.5rem"><h3 style="font-weight:600;font-size:1rem;color:#0f172a">${f.question}</h3><p style="color:#6b7280;font-size:0.9rem;margin-top:0.25rem">${f.answer}</p></div>`).join("");
  return `<div class="min-h-screen">
${hubSvgFigure("By Budget", "Business startup costs", "Best business ideas based on available capital — from \$0 to \$10,000")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1><p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p></div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Best Options with ${item.budgetTier}</h2>${options}</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Your First 30 Days</h2>${plan}</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Recommended Tool Stack</h2><div>${stack}</div></div></section>
${faqs ? `<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>` : ""}
${relatedLinksSection([
  { href: `/ideas`, text: `← All Micro-SaaS Ideas` },
  { href: `/weekend-builds`, text: `Weekend Build Ideas — Launch in 48 Hours` },
  { href: `/revenue`, text: `Revenue Target Roadmaps — $1K to $20K/month` },
  { href: `/side-hustles`, text: `Best Side Hustles by Profession` },
  { href: `/case-studies`, text: `Micro-SaaS Case Studies with Real Revenue` },
  { href: `/skills`, text: `How to Make Money with Your Skills` },
])}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a></div></section>
</div>`;
}

function nicheBodyHtml(item: typeof niches[0]): string {
  const ideas = item.bestIdeas.map((idea: any, i: number) =>
    `<div style="padding:1rem;border:1px solid #e2e8f0;border-radius:0.5rem;margin-bottom:0.75rem"><h3 style="font-weight:700;font-size:1rem">${idea.name}</h3><p style="font-size:0.875rem;color:#4b5563;margin-top:0.25rem">${idea.description}</p><div style="margin-top:0.5rem;display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.8rem"><span style="color:#6b7280">Customer: <strong>${idea.targetCustomer}</strong></span><span style="color:#6b7280">Pricing: <strong style="color:#166534">${idea.pricing}</strong></span><span style="color:#6b7280">Competition: <strong>${idea.competition}</strong></span></div><div style="margin-top:0.5rem;padding:0.5rem;background:#eff6ff;border-radius:0.375rem;font-size:0.8rem;color:#1d4ed8"><strong>Why now:</strong> ${idea.whyNow}</div></div>`
  ).join("\n");
  const trends = item.trends.map((t: string) => `<li style="display:flex;align-items:flex-start;gap:0.5rem;color:#374151;margin-bottom:0.5rem;font-size:0.875rem"><span style="color:#2563eb;flex-shrink:0">📈</span><span>${t}</span></li>`).join("");
  const monets = item.monetization.map((m: string) => `<span style="display:inline-block;padding:0.25rem 0.75rem;background:#dcfce7;border-radius:0.375rem;font-size:0.8rem;color:#166534;margin:0.15rem">${m}</span>`).join("");
  const tools = item.tools.map((t: string) => `<span style="display:inline-block;padding:0.25rem 0.75rem;background:#f1f5f9;border-radius:0.375rem;font-size:0.8rem;color:#475569;margin:0.15rem">${t}</span>`).join("");
  const mistakes = item.mistakes.map((m: string) => `<li style="display:flex;align-items:flex-start;gap:0.5rem;color:#374151;margin-bottom:0.5rem;font-size:0.875rem"><span style="color:#dc2626;flex-shrink:0">⚠️</span><span>${m}</span></li>`).join("");
  const faqs = item.faqs.map((f: any) => `<div style="margin-bottom:1.5rem"><h3 style="font-weight:600;font-size:1rem;color:#0f172a">${f.question}</h3><p style="color:#6b7280;font-size:0.9rem;margin-top:0.25rem">${f.answer}</p></div>`).join("");
  return `<div class="min-h-screen">
${hubSvgFigure("Micro-SaaS Niches", "Trending opportunities", "Best micro-SaaS niches to build in 2025 — market analysis and specific product ideas")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1><p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem"><div style="background:#eff6ff;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:1rem;font-weight:700;color:#1d4ed8">${item.marketSize}</div><div style="font-size:0.7rem;color:#6b7280">Market Size</div></div><div style="background:#f0fdf4;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:1rem;font-weight:700;color:#166534">${item.growthRate}</div><div style="font-size:0.7rem;color:#6b7280">Growth Rate</div></div><div style="background:#fff7ed;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:0.8rem;font-weight:700;color:#c2410c">${item.difficulty}</div><div style="font-size:0.7rem;color:#6b7280">Difficulty</div></div></div>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Best Micro-SaaS Ideas in ${item.niche}</h2>${ideas}</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Key Trends</h2><ul>${trends}</ul></div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Monetization Strategies</h2><div>${monets}</div></div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Recommended Tools</h2><div>${tools}</div></div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem;color:#dc2626">Common Mistakes to Avoid</h2><ul>${mistakes}</ul></div></section>
${faqs ? `<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>` : ""}
${relatedLinksSection([
  { href: `/ideas`, text: `← All Micro-SaaS Ideas` },
  { href: `/weekend-builds`, text: `Weekend Build Ideas — Launch in 48 Hours` },
  { href: `/case-studies`, text: `Micro-SaaS Case Studies with Real Revenue` },
  { href: `/revenue`, text: `Revenue Target Roadmaps — $1K to $20K/month` },
  { href: `/failure-stories`, text: `Failure Stories — What NOT to Do` },
  { href: `/skills`, text: `How to Make Money with Your Skills` },
])}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a></div></section>
</div>`;
}

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
${hubSvgFigure("Tool Alternatives", "Compared with pros and cons", "Alternatives to popular tools with detailed pros, cons, pricing, and best-use-case analysis")}
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
${hubSvgFigure("SaaS Blueprint", "How to build this type", "Step-by-step blueprint for building a specific type of micro-SaaS product")}
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
${hubSvgFigure("Revenue Roadmap", "Path to your target income", "Revenue roadmap showing how to reach a specific monthly income target through micro-SaaS")}
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

// ---------- Cost Analysis body ----------

function costAnalysisBodyHtml(ca: typeof costAnalysisPages[0]): string {
  const breakdownRows = ca.breakdown.map((b) =>
    `<tr style="border-bottom:1px solid #e5e7eb">
      <td style="padding:0.75rem 0.75rem;font-weight:600">${b.item}</td>
      <td style="padding:0.75rem 0.75rem;color:#4b5563">${b.range}</td>
      <td style="padding:0.75rem 0.75rem;color:#4b5563">${b.typical}</td>
      <td style="padding:0.75rem 0.75rem;color:#6b7280;font-size:0.875rem">${b.note}</td>
    </tr>`
  ).join("\n");

  const tips = ca.savingTips.map((t) =>
    `<li style="margin-bottom:0.5rem"><span style="color:#22c55e;font-weight:700;margin-right:0.5rem">✓</span>${t}</li>`
  ).join("\n");

  const faqs = ca.faqs.map((f) =>
    `<div style="margin-bottom:1.5rem"><h3 style="font-weight:700;margin-bottom:0.5rem;color:#111827">${f.question}</h3><p style="color:#4b5563;line-height:1.7">${f.answer}</p></div>`
  ).join("\n");

  return `<div class="min-h-screen">
${hubSvgFigure("Cost Analysis", "Detailed financial breakdown", "Detailed cost analysis for starting and running a micro-SaaS — every expense category explained")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${ca.topic}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${ca.h1}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:1rem">${ca.intro}</p>
<div style="display:flex;gap:1rem;flex-wrap:wrap">
<span style="padding:0.5rem 1rem;background:#f0fdf4;color:#15803d;border-radius:9999px;font-size:0.875rem;font-weight:600">Total Range: ${ca.totalRange}</span>
<span style="padding:0.5rem 1rem;background:#eff6ff;color:#1d4ed8;border-radius:9999px;font-size:0.875rem;font-weight:600">Typical: ${ca.typicalTotal}</span>
</div>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">Cost Breakdown</h2>
<table style="width:100%;border-collapse:collapse">
<thead><tr style="border-bottom:2px solid #e5e7eb">
<th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600;color:#6b7280;text-transform:uppercase">Item</th>
<th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600;color:#6b7280;text-transform:uppercase">Range</th>
<th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600;color:#6b7280;text-transform:uppercase">Typical</th>
<th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600;color:#6b7280;text-transform:uppercase">Note</th>
</tr></thead>
<tbody>${breakdownRows}</tbody>
</table>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">One-Time vs. Recurring Costs</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
<div style="padding:1rem;background:white;border-radius:0.5rem;border:1px solid #e5e7eb">
<h3 style="font-weight:600;margin-bottom:0.5rem">One-Time</h3>
<p style="color:#4b5563">${ca.oneTimeVsRecurring.oneTime}</p>
</div>
<div style="padding:1rem;background:white;border-radius:0.5rem;border:1px solid #e5e7eb">
<h3 style="font-weight:600;margin-bottom:0.5rem">Recurring</h3>
<p style="color:#4b5563">${ca.oneTimeVsRecurring.recurring}</p>
</div>
</div>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">How to Save Money</h2>
<ul style="list-style:none;padding:0">${tips}</ul>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">FAQs</h2>
${faqs}
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/masterclass" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Get the Blueprint →</a>
</div>
</section>
<section style="padding:1rem 1.5rem;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.75rem;color:#9ca3af"><strong>Disclaimer:</strong> Costs are estimates based on 2025-2026 data. Prices may vary.</p>
</div></section>
</div>`;
}

// ---------- How-To guide body ----------

function howToBodyHtml(hg: typeof howToGuides[0]): string {
  const steps = hg.steps.map((s, i) =>
    `<div style="display:flex;gap:1rem;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;margin-bottom:1.5rem">
      <div style="flex-shrink:0;width:2rem;height:2rem;background:#2563eb;color:white;border-radius:9999px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.875rem">${i + 1}</div>
      <div style="flex:1">
        <h3 style="font-weight:700;margin-bottom:0.5rem;color:#111827">${s.name}</h3>
        <p style="color:#4b5563;line-height:1.7;margin-bottom:0.75rem">${s.description}</p>
        ${s.tools && s.tools.length > 0 ? '<div style="display:flex;flex-wrap:wrap;gap:0.5rem"><span style="font-size:0.75rem;color:#9ca3af;font-weight:600">Tools:</span>' + s.tools.map(t => '<span style="padding:0.25rem 0.75rem;background:#f3f4f6;color:#4b5563;border-radius:9999px;font-size:0.75rem">' + t + '</span>').join("") + '</div>' : ''}
        ${s.timeEstimate ? '<p style="margin-top:0.5rem;font-size:0.875rem;color:#9ca3af;font-weight:500">⏱ ' + s.timeEstimate + '</p>' : ''}
      </div>
    </div>`
  ).join("\n");

  const proTips = hg.proTips.map((t) =>
    `<li style="margin-bottom:0.5rem"><span style="color:#2563eb;font-weight:700;margin-right:0.5rem">→</span>${t}</li>`
  ).join("\n");

  const mistakes = hg.commonMistakes.map((m) =>
    `<li style="margin-bottom:0.5rem"><span style="color:#ef4444;font-weight:700;margin-right:0.5rem">✗</span>${m}</li>`
  ).join("\n");

  const faqs = hg.faqs.map((f) =>
    `<div style="margin-bottom:1.5rem"><h3 style="font-weight:700;margin-bottom:0.5rem;color:#111827">${f.question}</h3><p style="color:#4b5563;line-height:1.7">${f.answer}</p></div>`
  ).join("\n");

  return `<div class="min-h-screen">
${hubSvgFigure("How-To Guide", "Step-by-step instructions", "Detailed how-to guide with numbered steps, tools, and timeline for employed founders")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${hg.topic}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${hg.h1}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:1rem">${hg.intro}</p>
</div>
</section>
<section style="padding:2rem 1.5rem;background:#fffbeb;border-left:4px solid #f59e0b">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:0.5rem">Why This Matters</h2>
<p style="color:#4b5563">${hg.whyThisMatters}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">Step-by-Step Guide</h2>
${steps}
</div>
</section>
<section style="padding:2rem 1.5rem;background:#eff6ff">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">Pro Tips</h2>
<ul style="list-style:none;padding:0">${proTips}</ul>
</div>
</section>
<section style="padding:2rem 1.5rem;background:#fef2f2">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">Common Mistakes to Avoid</h2>
<ul style="list-style:none;padding:0">${mistakes}</ul>
</div>
</section>
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">FAQs</h2>
${faqs}
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/masterclass" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Get the Blueprint →</a>
</div>
</section>
</div>`;
}

// ---------- Is It Legal body ----------

function isItLegalBodyHtml(il: typeof isItLegalPages[0]): string {
  const details = il.details.map((d) =>
    `<p style="color:#4b5563;line-height:1.7;padding-left:1rem;border-left:2px solid #e5e7eb;margin-bottom:1rem">${d}</p>`
  ).join("\n");

  const considerations = il.keyConsiderations.map((kc) =>
    `<div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem;margin-bottom:1rem">
      <h3 style="font-weight:700;margin-bottom:0.5rem;color:#111827">${kc.item}</h3>
      <p style="color:#4b5563;line-height:1.7">${kc.explanation}</p>
    </div>`
  ).join("\n");

  const stateVariations = il.stateVariations.map((sv) =>
    `<div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem;margin-bottom:0.75rem">
      <h3 style="font-weight:700;margin-bottom:0.25rem">${sv.state}</h3>
      <p style="color:#4b5563;font-size:0.875rem;line-height:1.7">${sv.rule}</p>
    </div>`
  ).join("\n");

  const whatToDo = il.whatToDo.map((a) =>
    `<li style="margin-bottom:0.5rem"><span style="color:#2563eb;font-weight:700;margin-right:0.5rem">→</span>${a}</li>`
  ).join("\n");

  const faqs = il.faqs.map((f) =>
    `<div style="margin-bottom:1.5rem"><h3 style="font-weight:700;margin-bottom:0.5rem;color:#111827">${f.question}</h3><p style="color:#4b5563;line-height:1.7">${f.answer}</p></div>`
  ).join("\n");

  return `<div class="min-h-screen">
${hubSvgFigure("Is It Legal?", "Legal analysis for your situation", "Legal analysis of employment contract clauses, IP ownership, and side business regulations")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${il.topic}</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${il.h1}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:1rem">${il.intro}</p>
</div>
</section>
<section style="padding:2rem 1.5rem;background:#f0fdf4;border-left:4px solid #22c55e">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:0.5rem">Short Answer</h2>
<p style="color:#4b5563;line-height:1.7">${il.shortAnswer}</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">In Detail</h2>
${details}
</div>
</section>
<section style="padding:2rem 1.5rem;background:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1.5rem">Key Considerations</h2>
${considerations}
</div>
</section>
${il.stateVariations.length > 0 ? `<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1.5rem">State-by-State Variations</h2>
${stateVariations}
</div>
</section>` : ""}
<section style="padding:2rem 1.5rem;background:#eff6ff">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">What You Should Do</h2>
<ul style="list-style:none;padding:0">${whatToDo}</ul>
</div>
</section>
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">FAQs</h2>
${faqs}
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/masterclass" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Get the Compliance Blueprint →</a>
</div>
</section>
<section style="padding:1rem 1.5rem;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.75rem;color:#9ca3af"><strong>Legal Disclaimer:</strong> For informational purposes only. Not legal advice. Consult a licensed attorney for your situation.</p>
</div></section>
</div>`;
}

// ---------- Hub page bodies ----------

function costAnalysisHubBodyHtml(): string {
  return `<div class="min-h-screen">
${hubSvgFigure("Cost Analysis", "How much does it cost to build a micro-SaaS?", "Cost breakdown for starting and running a micro-SaaS business while employed — from $0 to $500/month budgets")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Cost Analysis</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Cost Analysis — How Much Does It Cost?</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Detailed breakdowns of every cost involved in starting, running, and scaling a micro-SaaS business while employed. From $0 to $10,000 — know exactly what you'll spend before you start.</p>
</div>
</section>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto" class="quick-answer">
<p style="font-size:0.875rem;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Quick Answer</p>
<p style="font-size:1rem;line-height:1.6;color:#111827">You can start a micro-SaaS for as little as $0 using free tiers, but a realistic budget is $50-$200/month for hosting, domains, and tools. The biggest hidden cost is your time — most employed founders invest 5-15 hours/week.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">All Cost Analysis Guides</h2>
<div style="display:grid;gap:1rem">
<a href="/cost-analysis/starting-from-zero" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit;transition:border-color 0.2s"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">How Much Does It Cost to Start a Micro-SaaS from $0?</h3><p style="font-size:0.875rem;color:#6b7280">The complete $0 starter guide — free tiers, free tools, and what you actually need to pay for.</p></a>
<a href="/cost-analysis/monthly-operating-costs" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">Monthly Operating Costs for a Micro-SaaS</h3><p style="font-size:0.875rem;color:#6b7280">Hosting, domains, email, analytics — the real monthly stack costs broken down by stage.</p></a>
<a href="/cost-analysis/llc-formation-costs" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">LLC Formation Costs by State</h3><p style="font-size:0.875rem;color:#6b7280">Filing fees, registered agent, annual reports — what it costs to form an anonymous LLC.</p></a>
<a href="/cost-analysis/tools-stack-costs" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">AI Tools Stack: What You Actually Need to Pay For</h3><p style="font-size:0.875rem;color:#6b7280">ChatGPT, Claude, Midjourney, coding tools — which AI tools are essential vs nice-to-have.</p></a>
<a href="/cost-analysis/first-year-budget" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">First-Year Budget: $0 to $4K/month MRR</h3><p style="font-size:0.875rem;color:#6b7280">Month-by-month spending plan from idea validation to $4K recurring revenue.</p></a>
</div>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number →</a>
</div>
</section>
</div>`;
}

function howToHubBodyHtml(): string {
  return `<div class="min-h-screen">
${hubSvgFigure("How-To Guides", "Step-by-step for employed founders", "Step-by-step guides for building a micro-SaaS while employed — validation, building, launching, and growing")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>How-To Guides</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">How-To Guides — Step-by-Step for Employed Founders</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Actionable, step-by-step guides for every stage of building a micro-SaaS business while employed. No fluff — just the exact steps, tools, and timeline you need.</p>
</div>
</section>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto" class="quick-answer">
<p style="font-size:0.875rem;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Quick Answer</p>
<p style="font-size:1rem;line-height:1.6;color:#111827">The fastest path from idea to first paying customer: validate in 48 hours, build an MVP in 2-4 weeks, and get your first 10 customers through direct outreach — all while working full-time.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">All How-To Guides</h2>
<div style="display:grid;gap:1rem">
<a href="/how-to/validate-idea-in-48-hours" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">How to Validate a Micro-SaaS Idea in 48 Hours</h3><p style="font-size:0.875rem;color:#6b7280">The exact validation framework — landing page, traffic test, pre-sell, go/no-go decision.</p></a>
<a href="/how-to/start-without-coding" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">How to Start a SaaS Without Knowing How to Code</h3><p style="font-size:0.875rem;color:#6b7280">No-code tools, AI-assisted coding, and when to hire help — the non-technical founder's guide.</p></a>
<a href="/how-to/get-first-10-customers" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">How to Get Your First 10 Paying Customers</h3><p style="font-size:0.875rem;color:#6b7280">Direct outreach templates, community mining, and the pre-sell playbook for zero-audience founders.</p></a>
<a href="/how-to/build-while-employed" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">How to Build a Business While Employed (Without Getting Caught)</h3><p style="font-size:0.875rem;color:#6b7280">Time management, device separation, entity structuring, and compliance for employed founders.</p></a>
<a href="/how-to/stay-anonymous" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">How to Stay Anonymous Online as a Founder</h3><p style="font-size:0.875rem;color:#6b7280">Anonymous LLC, pseudonymous brands, digital footprint cleanup, and operational security.</p></a>
</div>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/ideas" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Browse Micro-SaaS Ideas →</a>
</div>
</section>
</div>`;
}

function isItLegalHubBodyHtml(): string {
  return `<div class="min-h-screen">
${hubSvgFigure("Is It Legal?", "Side business legal concerns explained", "Legal analysis of non-competes, IP ownership, moonlighting policies, and anonymous LLCs for employed founders")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Is It Legal?</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Is It Legal? — Side Business Legal Concerns</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Clear, practical answers to the legal questions every employed founder asks. Non-compete clauses, IP ownership, moonlighting policies, anonymous businesses — know your rights and risks.</p>
</div>
</section>
<section style="background-color:#fef2f2;border-left:4px solid #ef4444;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.75rem;color:#9ca3af"><strong>Disclaimer:</strong> For informational purposes only. Not legal advice. Consult a licensed attorney for your specific situation.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">All Legal Guides</h2>
<div style="display:grid;gap:1rem">
<a href="/is-it-legal/non-compete-enforceable" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">Is Your Non-Compete Actually Enforceable?</h3><p style="font-size:0.875rem;color:#6b7280">State-by-state enforceability, reasonable scope tests, and the 2024 FTC non-compete ban explained.</p></a>
<a href="/is-it-legal/work-on-side-project" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">Is It Legal to Work on a Side Project While Employed?</h3><p style="font-size:0.875rem;color:#6b7280">Moonlighting policies, duty of loyalty, and when your employer can claim your side work.</p></a>
<a href="/is-it-legal/anonymous-llc" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">Is It Legal to Form an Anonymous LLC?</h3><p style="font-size:0.875rem;color:#6b7280">Which states allow anonymous LLCs, what information is public, and how privacy actually works.</p></a>
<a href="/is-it-legal/use-ai-at-work" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">Is It Legal to Use AI Tools Built at Work for Your Side Business?</h3><p style="font-size:0.875rem;color:#6b7280">IP assignment clauses, work-for-hire doctrine, and the danger of using employer resources.</p></a>
<a href="/is-it-legal/own-ip-while-employed" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">Who Owns the IP You Create While Employed?</h3><p style="font-size:0.875rem;color:#6b7280">IP assignment agreements, outside-hours clauses, and how to protect your side project IP.</p></a>
</div>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/masterclass" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Get the Compliance Blueprint →</a>
</div>
</section>
</div>`;
}

function ideasHubBodyHtml(): string {
  const professions = ["accountants", "lawyers", "data-analysts", "marketers", "product-managers", "software-engineers", "sales-managers", "consultants", "hr-managers", "designers", "project-managers", "financial-analysts", "operations-managers", "teachers", "nurses", "engineers", "recruiters", "real-estate-agents", "customer-success-managers", "account-managers", "developers", "analysts", "managers", "executives", "directors"];
  const cards = professions.slice(0, 25).map((p) =>
    `<a href="/ideas/for-${p}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1rem;font-weight:700;margin-bottom:0.25rem;color:#111827;text-transform:capitalize">Micro-SaaS Ideas for ${p.replace(/-/g, " ")}</h3><p style="font-size:0.8rem;color:#6b7280">5 validated ideas with market analysis</p></a>`).join("\n");

  return `<div class="min-h-screen">
${hubSvgFigure("Micro-SaaS Ideas", "By profession — 125+ validated ideas", "Micro-SaaS ideas organized by professional expertise — 25 professions with 5 ideas each")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Ideas</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Micro-SaaS Ideas by Profession</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Curated micro-SaaS ideas tailored to your professional expertise. Each profession has 5 validated ideas with market analysis, competitive landscape, and revenue potential — designed to be built while employed.</p>
</div>
</section>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto" class="quick-answer">
<p style="font-size:0.875rem;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Quick Answer</p>
<p style="font-size:1rem;line-height:1.6;color:#111827">The best micro-SaaS ideas come from your professional domain — problems you understand deeply because you live them daily. Browse ideas for your profession, validate in 48 hours, and start building.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">Browse Ideas by Profession (${professions.length})</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
${cards}
</div>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/how-to/validate-idea-in-48-hours" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Learn the 48-Hour Validation Method →</a>
</div>
</section>
</div>`;
}

function glossaryHubBodyHtml(): string {
  const terms = glossaryTerms.map((t) =>
    `<a href="/glossary/${t.slug}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1rem;font-weight:700;margin-bottom:0.25rem;color:#111827">${t.term}</h3><p style="font-size:0.8rem;color:#6b7280">${t.definition.substring(0, 100)}...</p></a>`).join("\n");

  return `<div class="min-h-screen">
${hubSvgFigure("Micro-SaaS Glossary", "Plain-English definitions", "Definitions of micro-SaaS, recurring revenue, stealth operations, and financial independence terms")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Glossary</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Micro-SaaS Glossary</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Plain-English definitions of every term you need to understand micro-SaaS, recurring revenue, stealth operations, and financial independence. Written for employed founders, not venture capitalists.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">All Terms (${glossaryTerms.length})</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
${terms}
</div>
</div>
</section>
</div>`;
}

function guidesHubBodyHtml(): string {
  const guides = stateGuides.slice(0, 20).map((g) =>
    `<a href="/guides/${g.slug}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1rem;font-weight:700;margin-bottom:0.25rem;color:#111827">${g.state} Side Business Guide</h3><p style="font-size:0.8rem;color:#6b7280">LLC costs, non-compete status, tax rates</p></a>`).join("\n");

  return `<div class="min-h-screen">
${hubSvgFigure("State Business Guides", "50 states + DC — LLC, taxes, non-competes", "State-by-state guides covering LLC filing fees, annual reports, non-compete enforceability, and anonymous LLC availability")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>State Guides</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">State-by-State Side Business Guides</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Complete guides for all 50 US states + DC. Each guide covers LLC filing fees, annual report costs, non-compete enforceability, state income tax, and anonymous LLC availability — everything an employed founder needs before forming an entity.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">Browse State Guides (${stateGuides.length})</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
${guides}
</div>
<p style="margin-top:1.5rem"><a href="/guides/california" style="color:#3B82F6;text-decoration:none;font-size:0.875rem">View all ${stateGuides.length} state guides →</a></p>
</div>
</section>
</div>`;
}

function bestHubBodyHtml(): string {
  const lists = bestToolsLists.map((l) =>
    `<a href="/best/${l.slug}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1rem;font-weight:700;margin-bottom:0.25rem;color:#111827">${l.title}</h3><p style="font-size:0.8rem;color:#6b7280">${l.tools?.length || l.items?.length || "N/A"} tools reviewed</p></a>`).join("\n");

  return `<div class="min-h-screen">
${hubSvgFigure("Best AI Tools", "Curated for micro-SaaS founders", "Curated directories of the best AI tools, no-code platforms, and SaaS services for building micro-SaaS")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Best Tools</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Best AI Tools for Building Micro-SaaS</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Curated directories of the best AI tools, no-code platforms, and SaaS services for building, launching, and growing a micro-SaaS business. Each tool is reviewed for cost, learning curve, and suitability for employed founders with limited time.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">All Tool Lists (${bestToolsLists.length})</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
${lists}
</div>
</div>
</section>
</div>`;
}

function alternativesHubBodyHtml(): string {
  const items = alternatives.map((a) =>
    `<a href="/alternatives/${a.slug}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1rem;font-weight:700;margin-bottom:0.25rem;color:#111827">${a.product} Alternatives</h3><p style="font-size:0.8rem;color:#6b7280">${a.category} — ${a.alternatives.length} alternatives compared</p></a>`).join("\n");

  return `<div class="min-h-screen">
${hubSvgFigure("Alternatives", "Honest product comparisons", "Comparisons of Invisible Exit against other tools and platforms for building micro-SaaS businesses")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Alternatives</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Invisible Exit Alternatives Compared</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Honest comparisons of Invisible Exit against other tools and platforms. We break down what each alternative does well, where it falls short, and who it's best for — including when Invisible Exit is NOT the right choice.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">All Comparisons (${alternatives.length})</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
${items}
</div>
</div>
</section>
</div>`;
}

function salariesHubBodyHtml(): string {
  return `<div class="min-h-screen">
${hubSvgFigure("Salary → Freedom", "Convert your salary to freedom math", "Salary-to-freedom-number converter showing how much micro-SaaS revenue replaces your employment income")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Salary → Freedom</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Salary to Freedom Number Converter</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">How many months of micro-SaaS revenue would it take to replace your salary? These pages intercept salary search traffic and convert it into freedom math — showing exactly how recurring revenue replaces employment income.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">Salary Guides</h2>
<p>Browse salary-to-freedom calculations for common professions. Each page shows the freedom number, monthly MRR target, and timeline to replace the salary.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem;margin-top:1.5rem">
<a href="/freedom" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1rem;font-weight:700;color:#111827">Calculate Your Own Freedom Number</h3><p style="font-size:0.8rem;color:#6b7280">Enter your salary to get a personalized freedom number</p></a>
</div>
</div>
</section>
</div>`;
}

function dataHubBodyHtml(): string {
  const reports = dataReports.map((r) =>
    `<a href="/data/${r.slug}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1rem;font-weight:700;margin-bottom:0.25rem;color:#111827">${r.title}</h3><p style="font-size:0.8rem;color:#6b7280">${r.excerpt?.substring(0, 80) || "Original data report"}</p></a>`).join("\n");

  return `<div class="min-h-screen">
${hubSvgFigure("Data & Benchmarks", "Original statistics for citation", "Original data reports and benchmark statistics on micro-SaaS economics and employed founder behavior")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Data Reports</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Original Data & Benchmark Reports</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Original statistics, benchmarks, and data-driven analysis on micro-SaaS economics, employed founder behavior, and recurring revenue benchmarks. Designed to be cited by journalists, bloggers, and researchers.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">All Data Reports (${dataReports.length})</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
${reports}
</div>
</div>
</section>
</div>`;
}

function exploreHubBodyHtml(): string {
  return `<div class="min-h-screen">
${hubSvgFigure("Explore Resources", "Complete site index — 900+ pages", "Central hub linking to all Invisible Exit content categories — ideas, guides, tools, glossary, data, and more")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Explore</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:56rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Explore All Resources</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">The complete index of Invisible Exit resources — 900+ pages of ideas, guides, tools, calculators, comparisons, and data reports for employed founders building micro-SaaS businesses.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:56rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">Content Categories</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem">
<a href="/ideas" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:#111827">💡 Micro-SaaS Ideas</h3><p style="font-size:0.875rem;color:#6b7280">25 professions × 5 ideas each = 125+ validated micro-SaaS ideas with market analysis</p></a>
<a href="/guides" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:#111827">🏛️ State Guides</h3><p style="font-size:0.875rem;color:#6b7280">50 states + DC — LLC costs, non-compete status, tax rates, anonymous LLC availability</p></a>
<a href="/best" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:#111827">🛠️ Best Tools</h3><p style="font-size:0.875rem;color:#6b7280">Curated AI tool lists for building, launching, and growing micro-SaaS</p></a>
<a href="/glossary" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:#111827">📖 Glossary</h3><p style="font-size:0.875rem;color:#6b7280">30+ plain-English definitions of micro-SaaS and financial independence terms</p></a>
<a href="/compare" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:#111827">⚖️ Comparisons</h3><p style="font-size:0.875rem;color:#6b7280">Honest comparisons of Invisible Exit vs alternatives</p></a>
<a href="/calculators" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:#111827">🧮 Calculators</h3><p style="font-size:0.875rem;color:#6b7280">Freedom number, break-even, cost-of-waiting, and pricing calculators</p></a>
<a href="/data" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:#111827">📊 Data Reports</h3><p style="font-size:0.875rem;color:#6b7280">Original statistics and benchmark reports for citation</p></a>
<a href="/cost-analysis" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:#111827">💰 Cost Analysis</h3><p style="font-size:0.875rem;color:#6b7280">How much it costs to start, run, and scale a micro-SaaS</p></a>
<a href="/how-to" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:#111827">📋 How-To Guides</h3><p style="font-size:0.875rem;color:#6b7280">Step-by-step guides for every stage of building while employed</p></a>
<a href="/is-it-legal" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:#111827">⚖️ Is It Legal?</h3><p style="font-size:0.875rem;color:#6b7280">Legal guides on non-competes, IP, moonlighting, anonymous LLCs</p></a>
<a href="/alternatives" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:#111827">🔄 Alternatives</h3><p style="font-size:0.875rem;color:#6b7280">Notion, Substack, Stripe alternatives for micro-SaaS founders</p></a>
<a href="/blog" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:#111827">📝 Blog</h3><p style="font-size:0.875rem;color:#6b7280">53 articles on financial independence, micro-SaaS, and stealth operations</p></a>
</div>
</div>
</section>
</div>`;
}

function masterclassPageBodyHtml(): string {
  return `<div class="min-h-screen">
${hubSvgFigure("Free Masterclass", "Build a $4K/month side business", "Free 45-minute masterclass for corporate managers — the 5-step system for building anonymous recurring revenue")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Free Masterclass</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<span style="display:inline-block;padding:0.25rem 0.75rem;background-color:#dbeafe;color:#1e40af;border-radius:9999px;font-size:0.75rem;font-weight:600;margin-bottom:1rem">Free 45-Minute Masterclass</span>
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Build a $4K/Month Side Business While Employed — Without Your Boss Finding Out</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">A free 45-minute masterclass for corporate managers and employed professionals who want to build anonymous recurring revenue streams. Learn the exact system used to build a $4K/month micro-SaaS portfolio while working full-time.</p>
</div>
</section>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto" class="quick-answer">
<p style="font-size:0.875rem;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">What You'll Learn</p>
<p style="font-size:1rem;line-height:1.6;color:#111827">The 5-step system for building a micro-SaaS while employed: (1) Calculate your freedom number, (2) Find ideas in your professional domain, (3) Validate in 48 hours, (4) Build with AI tools in 5 hours/week, (5) Launch and get your first 10 customers — all while maintaining complete anonymity and compliance with your employment contract.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">In This Masterclass</h2>
<ul style="font-size:1rem;color:#1f2937;line-height:2;padding-left:1.5rem">
<li>How to calculate your "freedom number" — the exact monthly recurring revenue that replaces your salary</li>
<li>The 5 most profitable micro-SaaS models for employed founders (with real revenue examples)</li>
<li>How to validate any idea in 48 hours without writing a single line of code</li>
<li>Anonymous LLC formation — which states protect your identity, how much it costs, and how to set it up</li>
<li>Compliance audit — how to check your employment contract for non-compete, IP assignment, and moonlighting clauses</li>
<li>The "5-Hour Weekend" method — how to find time to build even with a demanding full-time job and family</li>
<li>Faceless audience building — getting customers without showing your face or using your real name</li>
</ul>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Who This Is For</h2>
<p style="font-size:1rem;color:#4b5563;line-height:1.7">Corporate managers, directors, and employed professionals who want to build a side business but can't risk their career. If you have 5+ hours a week, want recurring revenue, and need to stay anonymous — this masterclass is for you.</p>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/join" style="display:inline-block;padding:0.875rem 2rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600;font-size:1.125rem">Watch the Free Masterclass →</a>
<p style="margin-top:1rem;font-size:0.875rem;color:#6b7280">45 minutes · Free · No credit card required</p>
</div>
</section>
</div>`;
}

function freedomPageBodyHtml(): string {
  return `<div class="min-h-screen">
${hubSvgFigure("Freedom Number", "When does your job become optional?", "Freedom number calculator — the monthly recurring revenue that replaces your salary and gives you independence")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Freedom Number</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">What's Your Freedom Number?</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Your Freedom Number is the monthly recurring revenue that replaces your salary and gives you the choice to keep working — or not. It's the single most important number for any employed founder. Calculate yours below and see how close you are to financial independence.</p>
</div>
</section>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto" class="quick-answer">
<p style="font-size:0.875rem;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Quick Answer</p>
<p style="font-size:1rem;line-height:1.6;color:#111827">Freedom Number = (Your Annual Salary + Taxes + Benefits) ÷ 12. For a $100K salary, your Freedom Number is approximately $8,000-$10,000/month in recurring revenue. At $4K/month MRR, you're 40-50% of the way there.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1.5rem">How to Calculate Your Freedom Number</h2>
<p style="font-size:1rem;color:#1f2937;line-height:1.7;margin-bottom:1rem">Your Freedom Number isn't just your salary divided by 12. You need to account for:</p>
<ul style="font-size:1rem;color:#1f2937;line-height:2;padding-left:1.5rem">
<li><strong>Base salary</strong> — your gross annual income</li>
<li><strong>Self-employment taxes</strong> — ~15.3% for Social Security + Medicare (employer portion)</li>
<li><strong>Health insurance</strong> — what your employer pays (~$6K-$15K/year for a family)</li>
<li><strong>Retirement contributions</strong> — employer match + any pension</li>
<li><strong>Other benefits</strong> — life insurance, disability, gym, etc.</li>
</ul>
<p style="font-size:1rem;color:#4b5563;line-height:1.7;margin-top:1rem">A common rule of thumb: multiply your gross salary by 1.3-1.5x, then divide by 12. A $100K salary becomes a $11K-$12.5K Freedom Number.</p>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/fym" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number Now →</a>
</div>
</section>
</div>`;
}

function storyPageBodyHtml(): string {
  return `<div class="min-h-screen">
${hubSvgFigure("Origin Story", "How a corporate manager built $4K/month", "The complete story of building a profitable micro-SaaS portfolio while fully employed — without anyone finding out")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>The Story</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<span style="display:inline-block;padding:0.25rem 0.75rem;background-color:#dbeafe;color:#1e40af;border-radius:9999px;font-size:0.75rem;font-weight:600;margin-bottom:1rem">Origin Story</span>
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">How a Corporate Manager Built $4K/Month Invisibly</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">The complete story of how a former corporate director built a profitable micro-SaaS portfolio while fully employed — without anyone finding out. No viral launch, no venture capital, no personal brand. Just quiet, systematic execution.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">The Beginning</h2>
<p style="font-size:1rem;color:#1f2937;line-height:1.8;margin-bottom:1.5rem">It started with a simple question: "If I lost my job tomorrow, how long could I survive?" The answer was 3 months. That was the wake-up call. I was a corporate director with an MBA, a good salary, and zero financial independence. If the company decided to let me go, I'd have nothing to show for 8+ years of work.</p>
<p style="font-size:1rem;color:#1f2937;line-height:1.8;margin-bottom:1.5rem">I didn't want to quit. I liked my job. But I wanted a safety net — recurring revenue that didn't depend on showing up at an office. The answer was micro-SaaS: small, focused software products with monthly subscriptions that could be built nights and weekends, run anonymously, and scaled without employees.</p>
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem;margin-top:2rem">The System</h2>
<p style="font-size:1rem;color:#1f2937;line-height:1.8;margin-bottom:1.5rem">Over 18 months, I built a system: (1) Calculate the freedom number, (2) Find ideas in my professional domain, (3) Validate in 48 hours, (4) Build with AI tools in 5 hours/week, (5) Launch and get first 10 customers, (6) Stay anonymous through entity separation and compliance. The result: $4,000/month in recurring revenue from products nobody knew I owned.</p>
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem;margin-top:2rem">Why Invisible Exit?</h2>
<p style="font-size:1rem;color:#1f2937;line-height:1.8;margin-bottom:1.5rem">After hitting $4K/month, I realized there were millions of corporate managers in the same position — wanting financial independence but unable to risk their career. I built Invisible Exit to share the exact system, tools, and methodology. Five AI-powered tools that handle the hard parts: calculating your freedom number, validating ideas, ensuring compliance, automating launch, and building an audience without showing your face.</p>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/masterclass" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Watch the Free Masterclass →</a>
</div>
</section>
</div>`;
}

// ---------- Missing pSEO hub bodies ----------

function nonCompeteHubBodyHtml(): string {
  const professions = ["software-engineers", "product-managers", "lawyers", "doctors", "financial-analysts", "marketers", "consultants", "designers", "sales-managers", "accountants"];
  const links = professions.map(p =>
    `<a href="/non-compete/${p}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1rem;font-weight:700;color:#111827;text-transform:capitalize">${p.replace(/-/g," ")} Non-Compete Guide</h3></a>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure("Non-Compete Analysis", "Profession × state enforceability", "Non-compete clause analysis by profession and state — enforceability, risks, and safe harbors for employed founders")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Non-Compete Analysis</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Non-Compete Clause Analysis by Profession & State</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Detailed analysis of non-compete enforceability for employed founders. Cross-reference your profession with your state to understand your specific risk level, key legal considerations, and how to build safely. Non-compete clauses are governed by state law and enforced differently across professions — knowing where you stand is the first step to building your invisible exit.</p>
</div>
</section>
<section style="background-color:#fef2f2;border-left:4px solid #ef4444;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto">
<p style="font-size:0.875rem;color:#991b1b"><strong>Not legal advice.</strong> Non-compete law is rapidly evolving. Always consult a licensed employment attorney for your situation.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Browse by Profession (100+ state-specific pages)</h2>
<p style="font-size:1rem;color:#4b5563;margin-bottom:1.5rem">Each profession has a detailed guide for each of the top 10 states. Select your profession below to find your state's specific analysis.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem">${links}</div>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">What You'll Find in Each Guide</h2>
<ul style="font-size:1rem;color:#1f2937;line-height:2;padding-left:1.5rem">
<li>Whether your state enforces non-compete agreements</li>
<li>How enforceability varies by profession and job role</li>
<li>Key risks to watch for — including boilerplate clauses in your contract</li>
<li>Safe harbors — what you can do without triggering enforcement</li>
<li>Legal disclaimer tailored to your specific jurisdiction</li>
</ul>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/masterclass" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Get the Compliance Blueprint →</a>
</div>
</section>
</div>`;
}

function stackHubBodyHtml(): string {
  const entries = ["for-marketers", "for-software-engineers", "for-product-managers", "for-consultants", "for-designers", "for-sales-managers", "for-accountants", "for-lawyers", "for-data-analysts", "for-financial-analysts", "for-hr-managers", "for-operations-managers"];
  const links = entries.map(e =>
    `<a href="/stack/${e}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1rem;font-weight:700;color:#111827;text-transform:capitalize">${e.replace("for-","").replace(/-/g," ")} Tool Stack</h3></a>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure("Tool Stacks", "By profession — tailored recommendations", "Profession-specific tool stacks for building micro-SaaS products — tailored to your existing skills")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Tool Stacks</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Recommended Tool Stacks by Profession</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Curated tool stacks for building micro-SaaS products. Each stack is tailored to a profession's existing skills — tools that complement what you already know so you can build faster, cheaper, and with less friction. No generic lists, just targeted recommendations.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Browse Tool Stacks (${entries.length})</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem">${links}</div>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Why Profession-Specific Stacks?</h2>
<p style="font-size:1rem;color:#4b5563;line-height:1.7">A designer needs different tools than a software engineer to build a micro-SaaS. Designers excel at frontend and UX, so their stack emphasizes no-code builders and visual tools. Engineers can leverage existing coding skills for faster backends. Each stack assumes you're starting from your current skill set and fills the gaps with the minimum viable toolchain — no over-engineering, no unnecessary complexity.</p>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/best" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Browse All Tool Lists →</a>
</div>
</section>
</div>`;
}

function milestonesHubBodyHtml(): string {
  return `<div class="min-h-screen">
${hubSvgFigure("Revenue Milestones", "From $0 to $50K+ MRR", "Stage-by-stage micro-SaaS revenue milestone guides — pricing, team needs, and distribution at each level")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Revenue Milestones</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Micro-SaaS Revenue Milestones</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Stage-by-stage guides for every MRR milestone. From $0 to $50K+ MRR, know what to expect at each level — pricing, team needs, distribution channels, and common mistakes. Each milestone includes a month-by-month playbook, key metrics to track, and the specific actions you need to reach the next tier.</p>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#eff6ff;border-left:4px solid #3B82F6">
<div style="max-width:48rem;margin:0 auto">
<p style="font-size:1rem;line-height:1.6;color:#111827"><strong>The 6 key milestones:</strong> $0 (validation complete) → $500 (first revenue) → $1K (consistent) → $2K (growing) → $4K (freedom number) → $10K+ (scaling). Each stage requires different strategies, pricing, and distribution channels.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Browse Milestones</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem">
<a href="/milestones/reaching-0-to-500-mrr" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">$0 to $500 MRR</h3><p style="font-size:0.875rem;color:#6b7280">Your first paying customers and validation</p></a>
<a href="/milestones/reaching-500-to-1000-mrr" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">$500 to $1K MRR</h3><p style="font-size:0.875rem;color:#6b7280">Consistency and market fit</p></a>
<a href="/milestones/reaching-1000-to-2000-mrr" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">$1K to $2K MRR</h3><p style="font-size:0.875rem;color:#6b7280">Growth and optimization</p></a>
<a href="/milestones/reaching-2000-to-4000-mrr" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">$2K to $4K MRR</h3><p style="font-size:0.875rem;color:#6b7280">The freedom number zone</p></a>
</div>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number →</a>
</div>
</section>
</div>`;
}

function timelineHubBodyHtml(): string {
  return `<div class="min-h-screen">
${hubSvgFigure("Timelines", "Month-by-month roadmaps", "Month-by-month micro-SaaS timelines for employed founders — what to do and expect at each stage")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Timelines</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Month-by-Month Micro-SaaS Timelines</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Actionable month-by-month timelines for building a micro-SaaS while employed. Each timeline shows exactly what to do each month, what to expect at every stage, and which mistakes to avoid. Designed for founders with 5-10 hours per week.</p>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#eff6ff;border-left:4px solid #3B82F6">
<div style="max-width:48rem;margin:0 auto">
<p style="font-size:1rem;line-height:1.6;color:#111827"><strong>Quick Answer:</strong> Most employed founders can go from idea → first paying customer in 60-90 days with 5-10 hours per week. The first 30 days should be validation-only — no code until someone signals willingness to pay.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Browse Timelines</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem">
<a href="/timeline/zero-to-first-customer" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">Zero to First Customer</h3><p style="font-size:0.875rem;color:#6b7280">90-day timeline from idea to paying user</p></a>
<a href="/timeline/zero-to-500-mrr" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">Zero to $500 MRR</h3><p style="font-size:0.875rem;color:#6b7280">6-month timeline to consistent revenue</p></a>
</div>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/story" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Read the Origin Story →</a>
</div>
</section>
</div>`;
}

function pricingModelsHubBodyHtml(): string {
  const models = ["flat-rate", "usage-based", "tiered", "freemium", "per-seat", "per-feature", "outcome-based", "flat-rate-plus-overage", "two-sided-marketplace", "community-plus-premium", "equity-deferred", "agency-model", "donation-plus", "revenue-share"];
  const links = models.map(m =>
    `<a href="/pricing-models/${m}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1rem;font-weight:700;color:#111827;text-transform:capitalize">${m.replace(/-/g," ")} Model</h3></a>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure("Pricing Models", "Compared with real examples", "Micro-SaaS pricing model comparisons — flat-rate, usage-based, tiered, freemium with revenue benchmarks")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Pricing Models</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Micro-SaaS Pricing Models Compared</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Compare the most effective pricing models for micro-SaaS. Flat-rate, usage-based, tiered, freemium, and more — with real revenue examples, benchmarks, and pros/cons for each. Choose the model that maximizes revenue with minimal complexity for your solo operation.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Browse Pricing Models (${models.length})</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem">${links}</div>
</div>
</section>
</div>`;
}

function redditHubBodyHtml(): string {
  const entries = ["for-marketers", "for-software-engineers", "for-product-managers", "for-consultants", "for-designers", "for-sales-managers", "for-accountants", "for-lawyers", "for-data-analysts", "for-financial-analysts", "for-hr-managers", "for-operations-managers"];
  const links = entries.map(e =>
    `<a href="/reddit/${e}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-size:1rem;font-weight:700;color:#111827;text-transform:capitalize">${e.replace("for-","").replace(/-/g," ")} Reddit Strategy</h3></a>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure("Reddit Strategy", "Profession-specific playbooks", "Reddit marketing strategy for anonymous founders — best subreddits, posting schedules, and content templates")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Reddit Strategy</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Reddit Strategy for Employed Founders</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">How to build an audience and get customers on Reddit without revealing your identity. Profession-specific strategies with best subreddits, posting schedules, content templates, and common mistakes that get founders banned. Reddit is the #1 acquisition channel for anonymous founders — if you know how to use it right.</p>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#eff6ff;border-left:4px solid #3B82F6">
<div style="max-width:48rem;margin:0 auto">
<p style="font-size:1rem;line-height:1.6;color:#111827"><strong>Key insight:</strong> The most successful anonymous founders on Reddit never post links to their products. They contribute genuine value in industry-specific subreddits, build reputation over 3-6 months, and let interested users find their product through their profile.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Browse Strategies (${entries.length})</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem">${links}</div>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">What Each Guide Includes</h2>
<ul style="font-size:1rem;color:#1f2937;line-height:2;padding-left:1.5rem">
<li>Best subreddits for your profession — subscriber counts and why they work</li>
<li>Posting strategy tailored to your industry's culture and rules</li>
<li>Content ideas that attract your ideal customers without self-promotion</li>
<li>Common mistakes that get your account suspended</li>
<li>FAQ section answering the specific questions your profession asks</li>
</ul>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/ideas" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Browse Micro-SaaS Ideas →</a>
</div>
</section>
</div>`;
}

function costOfWaitingHubBodyHtml(): string {
  return `<div class="min-h-screen">
${hubSvgFigure("Cost of Waiting", "Calculate your opportunity cost", "The true cost of delaying your micro-SaaS — how much recurring revenue you lose by waiting another year")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Cost of Waiting</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">The Cost of Waiting to Start Your Micro-SaaS</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Calculate the true cost of delaying your micro-SaaS business. See exactly how much salary-equivalent revenue you leave on the table by waiting another year, three years, or five years. The opportunity cost of inaction is higher than most employed founders realize.</p>
</div>
</section>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto">
<p style="font-size:1rem;line-height:1.6;color:#111827"><strong>Quick math:</strong> At $4K/month MRR (the freedom number), waiting 3 years costs you $144,000 in lost revenue — plus the compounding effect of reinvestment and the equity-building that happens as your business matures. Every month you wait is a month of recurring revenue you'll never get back.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">See the Cost for Your Salary</h2>
<p style="font-size:1rem;color:#4b5563;margin-bottom:1.5rem">Cost-of-waiting projections for different salary brackets and time horizons:</p>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem">
<a href="/cost-of-waiting/1-years-100k-salary" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">$100K salary, 1 year</h3><p style="font-size:0.875rem;color:#6b7280">See what 1 year of delay costs at $100K salary</p></a>
<a href="/cost-of-waiting/3-years-100k-salary" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">$100K salary, 3 years</h3><p style="font-size:0.875rem;color:#6b7280">3-year delay cost at $100K salary</p></a>
<a href="/cost-of-waiting/5-years-100k-salary" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">$100K salary, 5 years</h3><p style="font-size:0.875rem;color:#6b7280">5-year delay cost at $100K salary</p></a>
</div>
</div>
</section>
<section style="padding:2rem 1.5rem;background-color:#f9fafb">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Why the Cost Is Higher Than You Think</h2>
<ul style="font-size:1rem;color:#1f2937;line-height:2;padding-left:1.5rem">
<li><strong>Compound revenue:</strong> MRR compounds as you add customers, raise prices, and launch new products</li>
<li><strong>Asset value:</strong> A micro-SaaS at $4K MRR is worth 24-36× monthly revenue ($96K-$144K)</li>
<li><strong>Skill building:</strong> Every month of building teaches you distribution, pricing, and customer psychology</li>
<li><strong>Data advantage:</strong> Starting earlier means you have more data to optimize from — and more time to iterate</li>
</ul>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number →</a>
</div>
</section>
</div>`;
}

function breakEvenHubBodyHtml(): string {
  return `<div class="min-h-screen">
${hubSvgFigure("Break-Even Analysis", "When will your SaaS pay for itself?", "Break-even analysis for micro-SaaS — month-by-month projections based on revenue tiers and costs")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Break-Even Analysis</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Break-Even Analysis for Micro-SaaS</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">How long until your micro-SaaS breaks even? Detailed month-by-month projections based on revenue tiers, costs, and growth rates. See exactly when your initial investment is recovered and your business becomes self-sustaining — with realistic timelines for employed founders building on the side.</p>
</div>
</section>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto">
<p style="font-size:1rem;line-height:1.6;color:#111827"><strong>Quick Answer:</strong> Most micro-SaaS products break even in 3-6 months on a $500-$2K initial investment. With AI tools reducing development costs, you can launch an MVP for under $100 in hosting and domain fees.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Browse Break-Even Scenarios</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem">
<a href="/break-even/500-mrr" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">$500 MRR Break-Even</h3><p style="font-size:0.875rem;color:#6b7280">Break-even timeline for a $500/month micro-SaaS</p></a>
<a href="/break-even/2000-mrr" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">$2K MRR Break-Even</h3><p style="font-size:0.875rem;color:#6b7280">Break-even timeline for a $2K/month micro-SaaS</p></a>
<a href="/break-even/4000-mrr" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">$4K MRR Break-Even</h3><p style="font-size:0.875rem;color:#6b7280">Break-even timeline for a $4K/month micro-SaaS (freedom number)</p></a>
</div>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number →</a>
</div>
</section>
</div>`;
}

function budgetHubBodyHtml(): string {
  return `<div class="min-h-screen">
${hubSvgFigure("Budget Levels", "Start on any budget — $0 to $500/month", "Budget guides for starting a micro-SaaS — what you get at each spending level from $0 to premium")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Budget Levels</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Start Your Micro-SaaS on Any Budget</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">You can start a micro-SaaS on any budget. From $0 using free tiers (Vercel, Supabase, Resend, GitHub) to $500/month for a premium stack — we break down exactly what you get at each spending level so you can make an informed decision based on your current resources.</p>
</div>
</section>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto">
<p style="font-size:1rem;line-height:1.6;color:#111827"><strong>The $0 truth:</strong> You can validate, build, and launch a micro-SaaS MVP for $0 using free tiers. Vercel, Supabase, Resend, and GitHub cover everything you need for an MVP. Upgrade only when you have paying customers.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Browse Budget Levels</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem">
<a href="/budget/0-dollars" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">$0 Budget</h3><p style="font-size:0.875rem;color:#6b7280">Everything you need is free</p></a>
<a href="/budget/50-dollars" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">$50/month Budget</h3><p style="font-size:0.875rem;color:#6b7280">Basic pro tools</p></a>
<a href="/budget/100-dollars" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">$100/month Budget</h3><p style="font-size:0.875rem;color:#6b7280">Comfortable stack</p></a>
<a href="/budget/500-dollars" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">$500/month Budget</h3><p style="font-size:0.875rem;color:#6b7280">Premium everything</p></a>
</div>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/cost-analysis" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">View Cost Analysis Guides →</a>
</div>
</section>
</div>`;
}

function hoursHubBodyHtml(): string {
  return `<div class="min-h-screen">
${hubSvgFigure("Hours Per Week", "Build with limited time", "Time-budget roadmaps for building a micro-SaaS with 1-10 hours per week")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Hours Per Week</span>
</nav>
<section style="padding-top:4rem;padding-bottom:3rem;padding-left:1.5rem;padding-right:1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Build a Micro-SaaS with Limited Time</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:2rem">Realistic roadmaps for building a micro-SaaS when you only have 1-10 hours per week. See what's achievable at each time commitment level with AI-powered tools and efficient workflows. Your time constraint is NOT a deal-breaker — it's a forcing function for better decisions.</p>
</div>
</section>
<section style="background-color:#eff6ff;border-left:4px solid #3B82F6;padding:1.5rem;margin-bottom:2rem">
<div style="max-width:48rem;margin:0 auto">
<p style="font-size:1rem;line-height:1.6;color:#111827"><strong>Quick math:</strong> With 5 hours per week and AI tools, you can go from idea → MVP in 6-8 weeks. The key is ruthless prioritization: build only what's necessary for validation and the core value proposition.</p>
</div>
</section>
<section style="padding:2rem 1.5rem">
<div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Browse Time Commitments</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem">
<a href="/hours/5-hours-per-week" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">5 Hours/Week</h3><p style="font-size:0.875rem;color:#6b7280">The sweet spot for employed founders</p></a>
<a href="/hours/10-hours-per-week" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">10 Hours/Week</h3><p style="font-size:0.875rem;color:#6b7280">Accelerated timeline</p></a>
<a href="/hours/3-hours-per-week" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit"><h3 style="font-weight:700;color:#111827">3 Hours/Week</h3><p style="font-size:0.875rem;color:#6b7280">Minimum viable commitment</p></a>
</div>
</div>
</section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb">
<div style="max-width:48rem;margin:0 auto">
<a href="/masterclass" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Watch the Free Masterclass →</a>
</div>
</section>
</div>`;
}

// ---------- Greg Isenberg pSEO Round 4 — Hub landing page bodies ----------

function sideHustlesHubBodyHtml(): string {
  const links = sideHustles.map((s) =>
    `<a href="/side-hustles/${s.slug}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit;margin-bottom:0.75rem"><h3 style="font-weight:700;color:#111827;margin-bottom:0.25rem">${s.profession}</h3><p style="font-size:0.875rem;color:#6b7280">${s.hustleType} · ${s.startupCost} startup · ${s.timeToFirstDollar} to first dollar</p></a>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure("Side Hustles", "Profession-specific income ideas", "Best side hustles for every profession — compare startup costs, earning potential, and time commitments")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Side Hustles by Profession</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Best Side Hustles by Profession</h1>
<p style="color:#4b5563;margin-bottom:1.5rem">Not all side hustles are created equal. Your profession gives you unique advantages — leverage them. Browse side hustle ideas tailored to your career, ranked by earning potential, startup cost, and time to first dollar.</p>
</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Browse by Profession</h2>
${links}
</div></section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number →</a>
</div></section>
</div>`;
}

function byBudgetHubBodyHtml(): string {
  const links = budgetStartPages.map((b) =>
    `<a href="/by-budget/${b.slug}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit;margin-bottom:0.75rem"><h3 style="font-weight:700;color:#111827;margin-bottom:0.25rem">${b.h1}</h3><p style="font-size:0.875rem;color:#6b7280">Start with ${b.budgetTier} · ${b.bestOptions.length} business options analyzed</p></a>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure("By Budget", "Starting capital guide", "Business ideas ranked by startup cost — from zero dollars to serious capital")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Build by Budget</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">What You Can Build With Your Budget</h1>
<p style="color:#4b5563;margin-bottom:1.5rem">How much money do you actually need to start a business? Less than you think. Browse business options by budget tier — from $0 to $10,000 — with realistic earning potential, tool stacks, and 30-day action plans.</p>
</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Browse by Budget Tier</h2>
${links}
</div></section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number →</a>
</div></section>
</div>`;
}

function nichesHubBodyHtml(): string {
  const links = niches.map((n) =>
    `<a href="/niches/${n.slug}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit;margin-bottom:0.75rem"><h3 style="font-weight:700;color:#111827;margin-bottom:0.25rem">${n.niche}</h3><p style="font-size:0.875rem;color:#6b7280">${n.marketSize} · ${n.growthRate} · ${n.difficulty}</p></a>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure("Niche Micro-SaaS", "Market analysis", "The best niches for building micro-SaaS products — analyzed by market size, competition, and growth potential")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Micro-SaaS Niches</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Best Micro-SaaS Niches for 2025</h1>
<p style="color:#4b5563;margin-bottom:1.5rem">The best way to pick a micro-SaaS niche is to go where the market is growing, competition is manageable, and you have a unique angle. Here are the most promising niches analyzed with specific product ideas, monetization strategies, and key trends.</p>
</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Browse Niches</h2>
${links}
</div></section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number →</a>
</div></section>
</div>`;
}

// ---------- Greg Isenberg pSEO Round 5 — Body generators ----------

function quitJobBodyHtml(item: typeof quitJobPages[0]): string {
  const ready = item.signsYouAreReady.map((s: string) => `<li style="color:#374151;margin-bottom:0.25rem">✅ ${s}</li>`).join("");
  const notReady = item.signsYouAreNot.map((s: string) => `<li style="color:#374151;margin-bottom:0.25rem">⚠️ ${s}</li>`).join("");
  const checklist = item.financialChecklist.map((f: any) => `<div style="display:flex;align-items:center;gap:1rem;padding:0.75rem;background:#f9fafb;border-radius:0.5rem;margin-bottom:0.5rem;font-size:0.875rem"><span style="flex:1;font-weight:600;color:#374151">${f.item}</span><span style="color:#2563eb">${f.target}</span></div>`).join("\n");
  const framework = item.theFramework.map((f: any, i: number) => `<div style="display:flex;gap:1rem;padding:1rem;border:1px solid #e2e8f0;border-radius:0.5rem;margin-bottom:0.75rem"><div style="flex-shrink:0;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:#2563eb;color:white;font-weight:700;font-size:0.875rem">${i+1}</div><div style="flex:1"><div style="font-weight:600;color:#0f172a">${f.milestone}</div><div style="font-size:0.8rem;color:#6b7280;margin-top:0.25rem">📊 ${f.criteria}</div><div style="font-size:0.8rem;color:#2563eb;margin-top:0.25rem">→ ${f.action}</div></div></div>`).join("\n");
  const faqs = item.faqs.map((f: any) => `<div style="margin-bottom:1.5rem"><h3 style="font-weight:600;font-size:1rem;color:#0f172a">${f.question}</h3><p style="color:#6b7280;font-size:0.9rem;margin-top:0.25rem">${f.answer}</p></div>`).join("");
  return `<div class="min-h-screen">
${hubSvgFigure("Quit Your Job", "The decision framework", "When is the right time to quit your job to start a business? Honest, numbers-based framework.")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1><p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p></div></section>
<section style="padding:1.5rem"><div style="max-width:48rem;margin:0 auto;border-left:4px solid #2563eb;background:#eff6ff;padding:1.5rem;border-radius:0.5rem"><h2 style="font-weight:700;color:#1e3a8a">The Honest Answer</h2><p style="color:#1e40af;margin-top:0.5rem">${item.theHonestAnswer}</p></div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:2rem"><div><h3 style="font-weight:700;color:#166534">Signs You're Ready</h3><ul style="margin-top:0.75rem">${ready}</ul></div><div><h3 style="font-weight:700;color:#dc2626">Signs You're NOT Ready</h3><ul style="margin-top:0.75rem">${notReady}</ul></div></div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Financial Checklist</h2>${checklist}</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">The Framework</h2>${framework}</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:2rem"><div style="background:#fef2f2;padding:1.5rem;border-radius:0.75rem"><h3 style="font-weight:700;color:#991b1b">If You Quit Too Early</h3><p style="color:#374151;margin-top:0.5rem;font-size:0.875rem">${item.whatHappensIfYouQuitTooEarly}</p></div><div style="background:#fffbeb;padding:1.5rem;border-radius:0.75rem"><h3 style="font-weight:700;color:#92400e">If You Wait Too Long</h3><p style="color:#374151;margin-top:0.5rem;font-size:0.875rem">${item.whatHappensIfYouWaitTooLong}</p></div></div></section>
<section style="padding:1.5rem"><div style="max-width:48rem;margin:0 auto;background:#0f172a;padding:1.5rem;border-radius:0.75rem"><h3 style="font-weight:700;color:white">Real Timeline</h3><p style="color:#cbd5e1;margin-top:0.5rem">${item.realTimeline}</p></div></section>
${faqs ? `<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>` : ""}
${relatedLinksSection([
  { href: `/ideas`, text: `← All Micro-SaaS Ideas` },
  { href: `/side-hustles`, text: `Best Side Hustles by Profession` },
  { href: `/salaries`, text: `Salary to Freedom Number Calculator` },
  { href: `/cost-of-waiting`, text: `Cost of Waiting — How Much You're Losing` },
  { href: `/case-studies`, text: `Micro-SaaS Case Studies with Real Revenue` },
  { href: `/failure-stories`, text: `Failure Stories — Learn From Real Mistakes` },
  { href: `/revenue`, text: `Revenue Target Roadmaps by Profession` },
])}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a></div></section>
</div>`;
}

function weekendBuildBodyHtml(item: typeof weekendBuilds[0]): string {
  const steps = item.steps.map((s: any, i: number) => `<div style="display:flex;gap:1rem;padding:0.75rem;background:#f9fafb;border-radius:0.5rem;margin-bottom:0.5rem"><div style="flex-shrink:0;width:2.5rem;height:2.5rem;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:#2563eb;color:white;font-weight:700">${i+1}</div><div style="flex:1"><div style="font-size:0.8rem;font-weight:600;color:#6b7280">${s.hour}</div><div style="font-weight:600;color:#0f172a">${s.task}</div><div style="font-size:0.8rem;color:#166534;margin-top:0.25rem">🎯 ${s.outcome}</div></div></div>`).join("\n");
  const stack = item.techStack.map((t: string) => `<span style="display:inline-block;padding:0.25rem 0.75rem;background:#f1f5f9;border-radius:0.375rem;font-size:0.8rem;color:#475569;margin:0.15rem">${t}</span>`).join("");
  const faqs = item.faqs.map((f: any) => `<div style="margin-bottom:1.5rem"><h3 style="font-weight:600;font-size:1rem;color:#0f172a">${f.question}</h3><p style="color:#6b7280;font-size:0.9rem;margin-top:0.25rem">${f.answer}</p></div>`).join("");
  return `<div class="min-h-screen">
${hubSvgFigure("Weekend Builds", "48-hour launch plan", "Build and launch a profitable side business in one weekend — hour-by-hour plan with tech stack and monetization")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1><p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem"><div style="background:#eff6ff;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:0.75rem;font-weight:700;color:#1d4ed8">${item.difficulty}</div><div style="font-size:0.7rem;color:#6b7280">Difficulty</div></div><div style="background:#f0fdf4;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:0.75rem;font-weight:700;color:#166534">${item.totalHours}</div><div style="font-size:0.7rem;color:#6b7280">Total Time</div></div><div style="background:#faf5ff;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:0.75rem;font-weight:700;color:#7e22ce">${item.cost}</div><div style="font-size:0.7rem;color:#6b7280">Cost</div></div><div style="background:#fff7ed;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:0.75rem;font-weight:700;color:#c2410c">${item.revenuePotential}</div><div style="font-size:0.7rem;color:#6b7280">Revenue</div></div></div>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Hour-by-Hour Plan</h2>${steps}</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Tech Stack</h2><div>${stack}</div></div></section>
<section style="padding:1.5rem"><div style="max-width:48rem;margin:0 auto;border-left:4px solid #7e22ce;background:#faf5ff;padding:1.5rem;border-radius:0.5rem"><h3 style="font-weight:700;color:#581c87">The Honest Take</h3><p style="color:#6b21a8;margin-top:0.5rem">${item.monologue}</p></div></section>
<section style="padding:1.5rem"><div style="max-width:48rem;margin:0 auto;background:#0f172a;padding:1.5rem;border-radius:0.75rem"><h3 style="font-weight:700;color:white">What to Do After the Weekend</h3><p style="color:#cbd5e1;margin-top:0.5rem">${item.whatToDoAfter}</p></div></section>
${faqs ? `<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>` : ""}
${relatedLinksSection([
  { href: `/ideas`, text: `← All Micro-SaaS Ideas` },
  { href: `/case-studies`, text: `Micro-SaaS Case Studies — Real Revenue Numbers` },
  { href: `/revenue`, text: `Revenue Target Roadmaps — $1K to $20K/month` },
  { href: `/quit-your-job`, text: `When to Quit Your Job — Honest Framework` },
  { href: `/skills`, text: `How to Make Money with Your Skills` },
  { href: `/side-hustles`, text: `Best Side Hustles by Profession` },
])}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a></div></section>
</div>`;
}

function failureStoryBodyHtml(item: typeof failureStories[0]): string {
  const wrong = item.whatWentWrong.map((w: any) => `<div style="padding:1rem;border:1px solid #fecaca;background:#fef2f2;border-radius:0.5rem;margin-bottom:0.75rem"><h3 style="font-weight:700;color:#991b1b">❌ ${w.mistake}</h3><p style="font-size:0.875rem;color:#4b5563;margin-top:0.25rem"><strong>Impact:</strong> ${w.impact}</p><p style="font-size:0.875rem;color:#166534;margin-top:0.25rem"><strong>Lesson:</strong> ${w.lesson}</p></div>`).join("\n");
  const nums = item.theNumbers.map((n: any) => `<div style="display:flex;align-items:center;justify-content:space-between;background:#0f172a;padding:0.75rem 1rem;border-radius:0.5rem;margin-bottom:0.5rem"><span style="font-size:0.8rem;color:#cbd5e1">${n.metric}</span><span style="font-weight:700;color:white">${n.value}</span></div>`).join("\n");
  const warnings = item.warningSigns.map((w: string) => `<li style="color:#374151;margin-bottom:0.25rem">🚨 ${w}</li>`).join("");
  const avoids = item.howToAvoid.map((h: string) => `<li style="color:#374151;margin-bottom:0.25rem">✅ ${h}</li>`).join("");
  const faqs = item.faqs.map((f: any) => `<div style="margin-bottom:1.5rem"><h3 style="font-weight:600;font-size:1rem;color:#0f172a">${f.question}</h3><p style="color:#6b7280;font-size:0.9rem;margin-top:0.25rem">${f.answer}</p></div>`).join("");
  return `<div class="min-h-screen">
${hubSvgFigure("Failure Stories", "Learn from real mistakes", "Why startups fail — honest analysis of common failure patterns and how to avoid them")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><span style="display:inline-block;background:#fee2e2;color:#b91c1c;padding:0.25rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:600">${item.failureType}</span><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin:0.75rem 0 1rem">${item.h1}</h1><p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p></div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">The Story</h2><p style="color:#374151">${item.theStory}</p></div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem;color:#dc2626">What Went Wrong</h2>${wrong}</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">The Numbers</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">${nums}</div></div></section>
<section style="padding:1.5rem"><div style="max-width:48rem;margin:0 auto;border-left:4px solid #16a34a;background:#f0fdf4;padding:1.5rem;border-radius:0.5rem"><h3 style="font-weight:700;color:#14532d">What Would Have Worked</h3><p style="color:#166534;margin-top:0.5rem">${item.whatWouldHaveWorked}</p></div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:2rem"><div><h3 style="font-weight:700;color:#b45309">Warning Signs</h3><ul style="margin-top:0.75rem">${warnings}</ul></div><div><h3 style="font-weight:700;color:#166534">How to Avoid</h3><ul style="margin-top:0.75rem">${avoids}</ul></div></div></section>
${faqs ? `<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>` : ""}
${relatedLinksSection([
  { href: "/case-studies", text: "→ Success stories: real micro-SaaS revenue numbers" },
  { href: "/quit-your-job", text: "→ When to quit your job — honest framework" },
  { href: "/side-hustles", text: "→ Best side hustles by profession" },
  { href: "/weekend-builds", text: "→ Weekend build ideas to start fast" },
  { href: "/niches", text: "→ Best micro-SaaS niches for 2025" },
])}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto"><a href="/mistakes" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Browse Mistake Guides &rarr;</a></div></section>
</div>`;
}

function quitJobHubBodyHtml(): string {
  const links = quitJobPages.map((q) =>
    `<a href="/quit-your-job/${q.slug}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit;margin-bottom:0.75rem"><h3 style="font-weight:700;color:#111827;margin-bottom:0.25rem">${q.profession}</h3><p style="font-size:0.875rem;color:#6b7280">${q.theHonestAnswer.substring(0, 120)}...</p></a>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure("Quit Your Job", "The decision framework", "When to quit your job to start a business — honest, numbers-based framework for every profession")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>When to Quit Your Job</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">When Should You Quit Your Job?</h1><p style="color:#4b5563;margin-bottom:1.5rem">The most common question we get. The answer isn't 'just do it' or 'never take risk.' It's a calculation. Browse profession-specific frameworks below — each with financial milestones, readiness signs, and honest timelines.</p></div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Browse by Profession</h2>${links}</div></section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto"><a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number →</a></div></section>
</div>`;
}

function weekendBuildsHubBodyHtml(): string {
  const links = weekendBuilds.map((w) =>
    `<a href="/weekend-builds/${w.slug}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit;margin-bottom:0.75rem"><h3 style="font-weight:700;color:#111827;margin-bottom:0.25rem">${w.h1}</h3><p style="font-size:0.875rem;color:#6b7280">${w.category} · ${w.totalHours} · ${w.revenuePotential}</p></a>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure("Weekend Builds", "48-hour launch ideas", "Build and launch a profitable side business in one weekend — step-by-step plans with tech stacks and monetization")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Weekend Builds</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Weekend Build Ideas</h1><p style="color:#4b5563;margin-bottom:1.5rem">What can you build in 48 hours that could generate $500-$5K/month? Here are step-by-step plans with hour-by-hour schedules, tech stacks, and honest revenue potential. No fluff — just actionable builds you can start Friday night.</p></div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Browse Weekend Builds</h2>${links}</div></section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto"><a href="/ideas" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Browse All Ideas →</a></div></section>
</div>`;
}

function failureStoriesHubBodyHtml(): string {
  const links = failureStories.map((f) =>
    `<a href="/failure-stories/${f.slug}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit;margin-bottom:0.75rem"><span style="display:inline-block;background:#fee2e2;color:#b91c1c;padding:0.15rem 0.5rem;border-radius:9999px;font-size:0.7rem;font-weight:600">${f.failureType}</span><h3 style="font-weight:700;color:#111827;margin:0.5rem 0 0.25rem">${f.h1}</h3><p style="font-size:0.875rem;color:#6b7280">${f.intro.substring(0, 120)}...</p></a>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure("Failure Stories", "Learn from real mistakes", "Why startups fail — honest analysis of common failure patterns, warning signs, and lessons")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Failure Stories</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Micro-SaaS Failure Stories</h1><p style="color:#4b5563;margin-bottom:1.5rem">Success stories teach you what worked. Failure stories teach you what to avoid — and they're more useful. Here are the most common ways micro-SaaS startups die, with real patterns, numbers, and lessons. Learn from others' mistakes.</p></div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Browse Failure Stories</h2>${links}</div></section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto"><a href="/mistakes" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Browse Mistake Guides →</a></div></section>
</div>`;
}

// ---------- Greg Isenberg pSEO Round 6 — Body generator ----------

function toolReviewBodyHtml(item: typeof toolReviews[0]): string {
  const pros = item.pros.map((p: string) => `<li style="color:#374151;font-size:0.875rem;margin-bottom:0.25rem">${p}</li>`).join("");
  const cons = item.cons.map((c: string) => `<li style="color:#374151;font-size:0.875rem;margin-bottom:0.25rem">${c}</li>`).join("");
  const features = item.features.map((f: any) =>
    `<div style="padding:1rem;border:1px solid ${f.isStandout ? '#bfdbfe' : '#e2e8f0'};background:${f.isStandout ? '#eff6ff' : 'white'};border-radius:0.5rem;margin-bottom:0.5rem"><div style="display:flex;align-items:center;gap:0.5rem"><h3 style="font-weight:700;color:#0f172a;font-size:0.95rem">${f.name}</h3>${f.isStandout ? '<span style="display:inline-block;background:#dbeafe;color:#1e40af;padding:0.1rem 0.5rem;border-radius:9999px;font-size:0.7rem;font-weight:600">Standout</span>' : ''}</div><p style="color:#6b7280;font-size:0.85rem;margin-top:0.25rem">${f.description}</p></div>`
  ).join("\n");
  const comparisons = item.comparisonTable.map((c: any) => `<div style="display:flex;align-items:flex-start;gap:1rem;padding:0.75rem 1rem;border-bottom:1px solid #e5e7eb;font-size:0.875rem"><div style="font-weight:600;color:#374151;min-width:10rem">${c.feature}</div><div style="color:#4b5563">${c.verdict}</div></div>`).join("\n");
  const alts = item.alternatives.map((a: any) => `<div style="padding:0.75rem;border:1px solid #e2e8f0;border-radius:0.5rem;margin-bottom:0.5rem;font-size:0.875rem"><div style="font-weight:600;color:#0f172a">${a.name}</div><div style="color:#6b7280;margin-top:0.2rem">${a.why}</div></div>`).join("\n");
  const faqs = item.faqs.map((f: any) => `<div style="margin-bottom:1.5rem"><h3 style="font-weight:600;font-size:1rem;color:#0f172a">${f.question}</h3><p style="color:#6b7280;font-size:0.9rem;margin-top:0.25rem">${f.answer}</p></div>`).join("");
  return `<div class="min-h-screen">
${hubSvgFigure("Tool Reviews", "Honest software reviews", "In-depth reviews of the tools solo founders actually use — honest verdicts, not affiliate fluff")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><div style="display:flex;align-items:flex-start;gap:1rem"><div style="flex-shrink:0;width:3rem;height:3rem;display:flex;align-items:center;justify-content:center;background:#f1f5f9;border-radius:0.75rem;font-size:1.5rem;font-weight:700;color:#475569">${item.toolName[0]}</div><div><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2">${item.h1}</h1><p style="font-size:0.875rem;color:#6b7280;margin-top:0.25rem">${item.tagline}</p></div></div><p style="color:#4b5563;margin-top:1rem">${item.intro}</p>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;margin-top:1.5rem"><div style="background:#fffbeb;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:1.5rem;font-weight:700;color:#d97706">${item.rating}/5</div><div style="font-size:0.7rem;color:#6b7280">Rating</div></div><div style="background:#eff6ff;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:0.8rem;font-weight:700;color:#1d4ed8">${item.pricing}</div><div style="font-size:0.7rem;color:#6b7280">Pricing</div></div><div style="background:#f0fdf4;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:0.8rem;font-weight:700;color:#166534">${item.freeTier}</div><div style="font-size:0.7rem;color:#6b7280">Free Tier</div></div></div>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Best For</h2><div style="display:flex;flex-wrap:wrap;gap:0.5rem">${item.bestFor.map((b: string) => `<span style="display:inline-block;padding:0.35rem 0.75rem;background:#f1f5f9;border-radius:0.375rem;font-size:0.85rem;color:#475569">✅ ${b}</span>`).join("")}</div></div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:2rem"><div style="background:#f0fdf4;padding:1.25rem;border-radius:0.75rem"><h3 style="font-weight:700;color:#166534">👍 Pros</h3><ul style="margin-top:0.75rem">${pros}</ul></div><div style="background:#fef2f2;padding:1.25rem;border-radius:0.75rem"><h3 style="font-weight:700;color:#dc2626">👎 Cons</h3><ul style="margin-top:0.75rem">${cons}</ul></div></div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Key Features</h2>${features}</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">How It Compares</h2><div style="border:1px solid #e2e8f0;border-radius:0.75rem">${comparisons}</div></div></section>
<section style="padding:1.5rem"><div style="max-width:48rem;margin:0 auto;border-left:4px solid #2563eb;background:#eff6ff;padding:1.5rem;border-radius:0.5rem"><h2 style="font-weight:700;color:#1e3a8a">Our Verdict</h2><p style="color:#1e40af;margin-top:0.5rem">${item.verdict}</p></div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Alternatives</h2>${alts}</div></section>
${faqs ? `<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>` : ""}
${relatedLinksSection([
  { href: "/failure-stories", text: "→ Learn from micro-SaaS failure stories" },
  { href: "/weekend-builds", text: "→ Weekend build ideas — launch in 48 hours" },
  { href: "/reviews", text: "→ Tool reviews for solo founders" },
  { href: "/side-hustles", text: "→ Best side hustles by profession" },
  { href: "/niches", text: "→ Best micro-SaaS niches for 2025" },
])}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto"><a href="/ideas" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Browse Ideas →</a></div></section>
</div>`;
}

function reviewsHubBodyHtml(): string {
  const links = toolReviews.map((t) =>
    `<a href="/reviews/${t.slug}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit;margin-bottom:0.75rem"><div style="display:flex;align-items:center;gap:1rem"><div style="flex-shrink:0;width:2.5rem;height:2.5rem;display:flex;align-items:center;justify-content:center;background:#f1f5f9;border-radius:0.5rem;font-weight:700">${t.toolName[0]}</div><div style="flex:1"><h3 style="font-weight:700;color:#111827">${t.toolName} — ${t.h1}</h3><p style="font-size:0.875rem;color:#6b7280;margin-top:0.15rem">${t.tagline} · ⭐ ${t.rating}/5 · ${t.pricing}</p></div></div></a>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure("Tool Reviews", "Honest software reviews", "Real talk: what solo founders should actually pay for and what's not worth it")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Tool Reviews</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Tool Reviews for Solo Founders</h1><p style="color:#4b5563;margin-bottom:1.5rem">Everyone recommends tools. We actually use them. These are honest reviews of the software I rely on to build invisible-exit.com — Cursor, Vercel, Supabase, Stripe, Linear, Claude. No affiliate fluff, no sponsored tiers. Just real verdicts from daily use.</p></div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Browse Reviews</h2>${links}</div></section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto"><a href="/ideas" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Browse Ideas →</a></div></section>
</div>`;
}

// ---------- Greg Isenberg pSEO Round 7 — Body generator ----------

function caseStudyBodyHtml(item: typeof caseStudies[0]): string {
  const worked = item.whatWorked.map((w: any) => `<div style="padding:1rem;border:1px solid #e2e8f0;border-radius:0.5rem;margin-bottom:0.5rem"><h3 style="font-weight:700;color:#0f172a;font-size:0.95rem">✅ ${w.strategy}</h3><p style="color:#6b7280;font-size:0.85rem;margin-top:0.25rem">${w.detail}</p></div>`).join("\n");
  const nums = item.keyNumbers.map((n: any) => `<div style="display:flex;align-items:center;justify-content:space-between;background:#0f172a;padding:0.75rem 1rem;border-radius:0.5rem;margin-bottom:0.5rem"><span style="font-size:0.8rem;color:#cbd5e1">${n.metric}</span><span style="font-weight:700;color:white;font-size:0.875rem">${n.value}</span></div>`).join("\n");
  const lessons = item.lessonsLearned.map((l: string) => `<li style="display:flex;align-items:flex-start;gap:0.5rem;color:#374151;margin-bottom:0.5rem;font-size:0.875rem"><span style="color:#2563eb;flex-shrink:0">💡</span><span>${l}</span></li>`).join("");
  const stack = item.techStack.map((t: string) => `<span style="display:inline-block;padding:0.25rem 0.75rem;background:#f1f5f9;border-radius:0.375rem;font-size:0.8rem;color:#475569;margin:0.15rem">${t}</span>`).join("");
  const faqs = item.faqs.map((f: any) => `<div style="margin-bottom:1.5rem"><h3 style="font-weight:600;font-size:1rem;color:#0f172a">${f.question}</h3><p style="color:#6b7280;font-size:0.9rem;margin-top:0.25rem">${f.answer}</p></div>`).join("");
  return `<div class="min-h-screen">
${hubSvgFigure("Case Studies", "Real revenue numbers", "Micro-SaaS case studies with actual revenue, timelines, and strategies — learn from real founders")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>${item.h1}</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><span style="display:inline-block;background:#dbeafe;color:#1d4ed8;padding:0.25rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:600">${item.niche}</span><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin:0.75rem 0 1rem">${item.h1}</h1><p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem"><div style="background:#f0fdf4;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:0.85rem;font-weight:700;color:#166534">${item.revenue}</div><div style="font-size:0.7rem;color:#6b7280">Revenue</div></div><div style="background:#eff6ff;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:0.8rem;font-weight:700;color:#1d4ed8">${item.pricing}</div><div style="font-size:0.7rem;color:#6b7280">Pricing</div></div><div style="background:#faf5ff;padding:0.75rem;border-radius:0.75rem;text-align:center"><div style="font-size:0.75rem;font-weight:700;color:#7e22ce">${item.timeToRevenue}</div><div style="font-size:0.7rem;color:#6b7280">Timeline</div></div></div>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">The Story</h2><p style="color:#374151">${item.theStory}</p></div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">What Worked</h2>${worked}</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Key Numbers</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">${nums}</div></div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Lessons Learned</h2><ul>${lessons}</ul></div></section>
<section style="padding:1.5rem"><div style="max-width:48rem;margin:0 auto;border-left:4px solid #7e22ce;background:#faf5ff;padding:1.5rem;border-radius:0.5rem"><h3 style="font-weight:700;color:#581c87">What They Did Differently</h3><p style="color:#6b21a8;margin-top:0.5rem">${item.whatTheyDidDifferently}</p></div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Tech Stack</h2><div>${stack}</div></div></section>
${faqs ? `<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">FAQs</h2>${faqs}</div></section>` : ""}
${relatedLinksSection([
  { href: "/reviews", text: "→ Tool reviews — Cursor, Vercel, Supabase, Stripe" },
  { href: "/weekend-builds", text: "→ Build your own micro-SaaS in a weekend" },
  { href: "/failure-stories", text: "→ Learn from micro-SaaS failure stories" },
  { href: "/quit-your-job", text: "→ When to quit your job — honest framework" },
  { href: "/side-hustles", text: "→ Best side hustles by profession" },
])}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto"><a href="/ideas" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Browse Ideas →</a></div></section>
</div>`;
}

function caseStudiesHubBodyHtml(): string {
  const links = caseStudies.map((c) =>
    `<a href="/case-studies/${c.slug}" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit;margin-bottom:0.75rem"><span style="display:inline-block;background:#dbeafe;color:#1d4ed8;padding:0.15rem 0.5rem;border-radius:9999px;font-size:0.7rem;font-weight:600">${c.niche}</span><h3 style="font-weight:700;color:#111827;margin:0.5rem 0 0.25rem">${c.h1}</h3><p style="font-size:0.875rem;color:#6b7280">${c.revenue} · ${c.pricing}</p></a>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure("Case Studies", "Real revenue numbers", "Micro-SaaS case studies with actual revenue, timelines, and strategies — learn from real founders")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280"><a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Case Studies</span></nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto"><h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Micro-SaaS Case Studies</h1><p style="color:#4b5563;margin-bottom:1.5rem">Real micro-SaaS companies with real revenue numbers, growth timelines, and strategies. No vanity metrics — just honest breakdowns of what worked, what didn't, and what you can learn. These are the case studies I wish I had when starting.</p></div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto"><h2 style="font-weight:700;font-size:1.5rem;margin-bottom:1rem">Browse Case Studies</h2>${links}</div></section>
<section style="padding:2rem 1.5rem;text-align:center;border-top:1px solid #e5e7eb"><div style="max-width:48rem;margin:0 auto"><a href="/ideas" style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Browse Ideas →</a></div></section>
</div>`;
}

main();

// ---------- Greg Isenberg pSEO Round 8: Revenue Target body ----------

function revenueTargetBodyHtml(item: typeof revenueTargets[0]): string {
  const ideas = item.bestIdeas.map((idea: string, i: number) =>
    `<li style="margin-bottom:0.5rem;color:#374151">${i + 1}. <strong>${idea}</strong></li>`
  ).join("\n");
  const faqs = item.faqs.map((f: { question: string; answer: string }) =>
    `<div style="margin-bottom:1rem"><h3 style="font-weight:600;color:#111827">${f.question}</h3><p style="color:#4b5563">${f.answer}</p></div>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure("Revenue Target", item.tier, `How to reach ${item.monthlyRevenue} in recurring revenue — realistic math, pricing, and timeline`)}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/revenue" style="color:#3B82F6;text-decoration:none">Revenue Targets</a> &rsaquo; <span>${item.tier} for ${item.profession}</span>
</nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1>
<p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p>
</div></section>
<section style="padding:2rem 1.5rem;background:#f0fdf4"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem">The Revenue Math</h2>
<p style="margin-bottom:0.5rem"><strong>Monthly Target:</strong> ${item.monthlyRevenue}</p>
<p style="margin-bottom:0.5rem"><strong>Customer Count:</strong> ${item.customerMath}</p>
<p style="margin-bottom:0.5rem"><strong>Pricing Strategy:</strong> ${item.pricingStrategy}</p>
<p><strong>Timeline:</strong> ${item.timeline}</p>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">Best Micro-SaaS Ideas for ${item.profession}</h2>
<ol style="padding-left:1.5rem">${ideas}</ol>
</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>
${faqs}
</div></section>
${relatedLinksSection([
  { href: `/ideas/for-${item.professionSlug}`, text: `← Micro-SaaS Ideas for ${item.profession}` },
  { href: `/salaries/${item.professionSlug.replace(/s$/, "")}`, text: `Salary & Freedom Number for ${item.profession}` },
  { href: `/side-hustles/for-${item.professionSlug}`, text: `Best Side Hustles for ${item.profession}` },
  { href: `/mistakes/mistakes-${item.professionSlug.replace(/s$/, "")}s-make`, text: `Mistakes ${item.profession} Make` },
  { href: `/case-studies`, text: `Micro-SaaS Case Studies with Real Revenue` },
  { href: `/weekend-builds`, text: `Weekend Build Ideas — Launch in 48 Hours` },
])}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a>
</div></section>
</div>`;
}

// ---------- Greg Isenberg pSEO Round 8: City body ----------

function cityBodyHtml(item: typeof cities[0]): string {
  const faqs = item.faqs.map((f: { question: string; answer: string }) =>
    `<div style="margin-bottom:1rem"><h3 style="font-weight:600;color:#111827">${f.question}</h3><p style="color:#4b5563">${f.answer}</p></div>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure(item.city, item.state, `Side business ecosystem in ${item.city}, ${item.state} — legal context, startup scene, and opportunities`)}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/cities" style="color:#3B82F6;text-decoration:none">Cities</a> &rsaquo; <span>${item.city}</span>
</nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1>
<p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem">
<div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem"><div style="font-size:0.75rem;color:#6b7280">Avg Salary</div><div style="font-weight:700">${item.avgSalary}</div></div>
<div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem"><div style="font-size:0.75rem;color:#6b7280">Cost of Living</div><div style="font-weight:700">${item.costOfLiving}</div></div>
<div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem"><div style="font-size:0.75rem;color:#6b7280">Population</div><div style="font-weight:700">${item.population}</div></div>
<div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem"><div style="font-size:0.75rem;color:#6b7280">Startup Scene</div><div style="font-weight:700">${item.startupEcosystem}</div></div>
</div></section>
<section style="padding:2rem 1.5rem;background:#eff6ff"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem">Legal Context</h2>
<p style="color:#4b5563">${item.legalContext}</p>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem">Local Advantage</h2>
<p style="color:#4b5563">${item.localAdvantage}</p>
</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>
${faqs}
</div></section>
${relatedLinksSection([
  { href: `/guides/${item.stateSlug}`, text: `← Anonymous LLC Guide for ${item.state}` },
  { href: `/ideas`, text: `All Micro-SaaS Ideas` },
  { href: `/non-compete`, text: `Non-Compete Guide by State` },
  { href: `/case-studies`, text: `Micro-SaaS Case Studies` },
  { href: `/quit-your-job`, text: `When to Quit Your Job` },
])}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a>
</div></section>
</div>`;
}

// ---------- Greg Isenberg pSEO Round 8: Skill Monetization body ----------

function skillBodyHtml(item: typeof skills[0]): string {
  const paths = item.monetizationPaths.map((p: string) => `<li style="margin-bottom:0.5rem;color:#374151">${p}</li>`).join("\n");
  const ideas = item.microSaaSIdeas.map((idea: string, i: number) => `<li style="margin-bottom:0.5rem;color:#374151">${i + 1}. <strong>${idea}</strong></li>`).join("\n");
  const faqs = item.faqs.map((f: { question: string; answer: string }) =>
    `<div style="margin-bottom:1rem"><h3 style="font-weight:600;color:#111827">${f.question}</h3><p style="color:#4b5563">${f.answer}</p></div>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure(item.skill, item.category, `How to monetize ${item.skill} skills — freelance rates, SaaS ideas, and revenue paths`)}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/skills" style="color:#3B82F6;text-decoration:none">Skills</a> &rsaquo; <span>${item.skill}</span>
</nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1>
<p style="color:#4b5563;margin-bottom:1.5rem">${item.intro}</p>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">
<div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem;text-align:center"><div style="font-size:0.75rem;color:#6b7280">Category</div><div style="font-weight:700">${item.category}</div></div>
<div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem;text-align:center"><div style="font-size:0.75rem;color:#6b7280">Demand</div><div style="font-weight:700">${item.demandLevel}</div></div>
<div style="padding:1rem;border:1px solid #e5e7eb;border-radius:0.5rem;text-align:center"><div style="font-size:0.75rem;color:#6b7280">Freelance Rate</div><div style="font-weight:700">${item.avgFreelanceRate}</div></div>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">Monetization Paths</h2>
<ul style="padding-left:1.5rem">${paths}</ul>
</div></section>
<section style="padding:2rem 1.5rem;background:#f0fdf4"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">Micro-SaaS Ideas Using ${item.skill}</h2>
<ol style="padding-left:1.5rem">${ideas}</ol>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem">Time to Revenue</h2>
<p style="color:#4b5563">${item.timeToRevenue}</p>
</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>
${faqs}
</div></section>
${relatedLinksSection([
  { href: `/ideas`, text: `← All Micro-SaaS Ideas` },
  { href: `/case-studies`, text: `Micro-SaaS Case Studies with Real Revenue` },
  { href: `/weekend-builds`, text: `Weekend Build Ideas — Launch in 48 Hours` },
  { href: `/revenue`, text: `Revenue Target Roadmaps by Profession` },
  { href: `/quit-your-job`, text: `When to Quit Your Job` },
])}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a>
</div></section>
</div>`;
}

// ---------- Greg Isenberg pSEO Round 9: Audience/Demographic body ----------

function audienceBodyHtml(item: typeof audienceIdeas[0]): string {
  const ideas = item.bestIdeas.map((idea: { name: string; description: string; whyFit: string; pricing: string; timeToRevenue: string }, i: number) =>
    `<div style="margin-bottom:1.5rem;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem">
<h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.5rem;color:#111827">${i + 1}. ${idea.name}</h3>
<p style="color:#4b5563;margin-bottom:0.75rem">${idea.description}</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.875rem">
<div><span style="color:#6b7280">Why it fits:</span> <strong style="color:#374151">${idea.whyFit}</strong></div>
<div><span style="color:#6b7280">Pricing:</span> <strong style="color:#374151">${idea.pricing}</strong></div>
<div><span style="color:#6b7280">Time to revenue:</span> <strong style="color:#374151">${idea.timeToRevenue}</strong></div>
</div>
</div>`
  ).join("\n");
  const skillsList = item.skills.map((s: string) => `<span style="display:inline-block;padding:0.25rem 0.75rem;background:#f3f4f6;border-radius:0.375rem;font-size:0.875rem;margin:0.25rem;color:#374151">${s}</span>`).join("");
  const tips = item.tips.map((t: string) => `<li style="margin-bottom:0.5rem;color:#374151">${t}</li>`).join("\n");
  const faqs = item.faqs.map((f: { question: string; answer: string }) =>
    `<div style="margin-bottom:1rem"><h3 style="font-weight:600;color:#111827">${f.question}</h3><p style="color:#4b5563">${f.answer}</p></div>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure(item.audience, "Side Business Guide", `Best micro-SaaS and side business ideas for ${item.audience.toLowerCase()}`)}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/audience" style="color:#3B82F6;text-decoration:none">Audience</a> &rsaquo; <span>${item.audience}</span>
</nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:1.5rem">${item.intro}</p>
</div></section>
<section style="padding:1.5rem;max-width:48rem;margin:0 auto"><div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
<div style="padding:1.25rem;background:#f0fdf4;border-radius:0.75rem"><div style="font-size:0.75rem;color:#16a34a;font-weight:600;margin-bottom:0.25rem">ADVANTAGES</div><p style="font-size:0.875rem;color:#374151">${item.advantages}</p></div>
<div style="padding:1.25rem;background:#fff7ed;border-radius:0.75rem"><div style="font-size:0.75rem;color:#ea580c;font-weight:600;margin-bottom:0.25rem">CHALLENGES</div><p style="font-size:0.875rem;color:#374151">${item.challenges}</p></div>
<div style="padding:1.25rem;background:#eff6ff;border-radius:0.75rem;text-align:center"><div style="font-size:1.25rem;font-weight:700;color:#2563eb">${item.timeCommitment}</div><div style="font-size:0.75rem;color:#6b7280">Time Commitment</div></div>
<div style="padding:1.25rem;background:#faf5ff;border-radius:0.75rem;text-align:center"><div style="font-size:1.25rem;font-weight:700;color:#9333ea">${item.budgetRange}</div><div style="font-size:0.75rem;color:#6b7280">Startup Budget</div></div>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Best Micro-SaaS Ideas for ${item.audience}</h2>
${ideas}
</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">Transferable Skills</h2>
<div>${skillsList}</div>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">Pro Tips</h2>
<ul style="padding-left:1.5rem">${tips}</ul>
</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>
${faqs}
</div></section>
${relatedLinksSection([
  { href: `/audience`, text: `All Audience Guides` },
  { href: `/ideas`, text: `Micro-SaaS Ideas by Profession` },
  { href: `/niches`, text: `Best Micro-SaaS Niches for 2025` },
  { href: `/case-studies`, text: `Micro-SaaS Case Studies with Real Revenue` },
  { href: `/budget`, text: `Side Business Budget Guide` },
  { href: `/revenue`, text: `Revenue Target Roadmaps` },
])}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a>
</div></section>
</div>`;
}

function audienceHubBodyHtml(): string {
  const cards = audienceIdeas.map((a: typeof audienceIdeas[0]) =>
    `<a href="/audience/${a.slug}" style="display:block;padding:1.5rem;border:1px solid #e5e7eb;border-radius:0.75rem;text-decoration:none;color:inherit">
<h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;color:#111827">${a.audience}</h3>
<p style="font-size:0.875rem;color:#6b7280">${a.metaDescription.slice(0, 120)}...</p>
</a>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure("Side Business by Audience", "15 demographic guides", "Side business and micro-SaaS ideas tailored to your life situation")}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <span>Audience</span>
</nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">Side Business Ideas by Audience</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:1.5rem">Side business and micro-SaaS ideas tailored to your life situation. Whether you're a college student, stay-at-home parent, military veteran, retiree, or digital nomad — find ideas that fit your schedule, budget, and skills.</p>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:1rem">
${cards}
</div></section>
</div>`;
}

// ---------- Greg Isenberg pSEO Round 9: City × Profession cross body ----------

function cityProfessionBodyHtml(item: typeof cityProfessionPages[0]): string {
  const ideas = item.bestIdeas.map((idea: string, i: number) =>
    `<li style="margin-bottom:0.75rem;color:#374151"><strong>${i + 1}.</strong> ${idea}</li>`
  ).join("\n");
  const networking = item.networkingOps.map((n: string) =>
    `<li style="margin-bottom:0.5rem;color:#374151">${n}</li>`
  ).join("\n");
  const advantages = item.advantages.map((a: string) =>
    `<li style="margin-bottom:0.5rem;color:#374151">${a}</li>`
  ).join("\n");
  const faqs = item.faqs.map((f: { question: string; answer: string }) =>
    `<div style="margin-bottom:1rem"><h3 style="font-weight:600;color:#111827">${f.question}</h3><p style="color:#4b5563">${f.answer}</p></div>`
  ).join("\n");
  return `<div class="min-h-screen">
${hubSvgFigure(`${item.profession} in ${item.city}`, item.city, `Best micro-SaaS ideas for ${item.profession.toLowerCase()} in ${item.city}`)}
<nav style="padding:1rem 1.5rem;max-width:48rem;margin:0 auto;font-size:0.875rem;color:#6b7280">
<a href="/" style="color:#3B82F6;text-decoration:none">Home</a> &rsaquo; <a href="/cities/${item.citySlug}" style="color:#3B82F6;text-decoration:none">${item.city}</a> &rsaquo; <span>${item.profession}</span>
</nav>
<section style="padding:3rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin-bottom:1rem">${item.h1}</h1>
<p style="font-size:1.125rem;color:#4b5563;margin-bottom:1.5rem">${item.intro}</p>
</div></section>
<section style="padding:1.5rem;max-width:48rem;margin:0 auto"><div style="padding:1.5rem;background:#eff6ff;border-radius:0.75rem">
<h2 style="font-size:1.125rem;font-weight:700;margin-bottom:0.5rem">The Local Scene</h2>
<p style="color:#374151;margin-bottom:0.75rem">${item.localScene}</p>
<div style="padding:0.75rem;background:white;border-radius:0.5rem"><p style="font-size:0.875rem;font-weight:600;color:#374151">${item.costProfile}</p></div>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Networking &amp; Community</h2>
<ul style="padding-left:1.5rem">${networking}</ul>
</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Why ${item.city} Works for ${item.profession}</h2>
<ul style="padding-left:1.5rem;list-style:none">${advantages}</ul>
</div></section>
<section style="padding:2rem 1.5rem"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Micro-SaaS Ideas for ${item.profession} in ${item.city}</h2>
<ol style="padding-left:1.5rem">${ideas}</ol>
</div></section>
<section style="padding:2rem 1.5rem;background:#f9fafb"><div style="max-width:48rem;margin:0 auto">
<h2 style="font-weight:700;margin-bottom:1rem">FAQs</h2>
${faqs}
</div></section>
${relatedLinksSection([
  { href: `/cities/${item.citySlug}`, text: `Side Business in ${item.city} — Full Guide` },
  { href: `/cities`, text: `All City Guides` },
  { href: `/ideas`, text: `Micro-SaaS Ideas by Profession` },
  { href: `/revenue`, text: `Revenue Target Roadmaps by Profession` },
  { href: `/case-studies`, text: `Micro-SaaS Case Studies` },
  { href: `/budget`, text: `Side Business Budget Guide` },
])}
<section style="padding:2rem 1.5rem;border-top:1px solid #e5e7eb;text-align:center"><div style="max-width:48rem;margin:0 auto">
<a href="/freedom" style="display:inline-block;padding:0.75rem 1.5rem;background-color:#0f172a;color:white;border-radius:0.5rem;text-decoration:none;font-weight:600">Calculate Your Freedom Number &rarr;</a>
</div></section>
</div>`;
}
