/**
 * Generates llms.txt and llms-full.txt from the blog data.
 * llms.txt = concise index with all pages and posts
 * llms-full.txt = extended summaries for deeper AI crawler context
 *
 * Run: npx tsx scripts/generate-llms-txt.ts
 * (also runs automatically as part of the build)
 */
import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { blogPosts } from "../src/data/blog-posts.js";
import { glossaryTerms } from "../src/data/glossary.js";
import { comparisons } from "../src/data/comparisons.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, "..", "public");
const SITE = "https://invisibleexit.com";

// ---------- llms.txt (concise index) ----------

function generateLlmsTxt(): string {
  const lines: string[] = [];

  lines.push("# Invisible Exit");
  lines.push("");
  lines.push("> Invisible Exit is a membership platform with 5 AI-powered tools that help corporate managers and employed professionals build anonymous micro-SaaS businesses and invisible recurring revenue streams. Financial freedom without risking your career.");
  lines.push("");
  lines.push("Invisible Exit provides: (1) FYM Dashboard — calculate your freedom number and track recurring revenue; (2) Idea Pipeline — validate micro-SaaS ideas in 48 hours; (3) Stealth Ops Hub — entity separation, compliance audit, and invisibility scoring; (4) Launch Control — go-live automation for time-constrained founders; (5) Brand Manager — faceless audience building with YouTube scripts and Reddit playbooks. Pricing from $0.97/month.");
  lines.push("");
  lines.push("## Core Pages");
  lines.push("");
  lines.push(`- [Home](https://invisibleexit.com/): Main landing page — value proposition, 5 tools, pricing, and FAQ`);
  lines.push(`- [Blog](https://invisibleexit.com/blog): ${blogPosts.length} articles on financial independence, micro-SaaS, stealth operations, and audience building for employed founders`);
  lines.push(`- [Privacy Policy](https://invisibleexit.com/privacy): Privacy policy`);
  lines.push(`- [Terms of Service](https://invisibleexit.com/terms): Terms of service`);
  lines.push("");

  // Group by category
  const cats: Record<string, typeof blogPosts> = {};
  for (const p of blogPosts) {
    (cats[p.category] = cats[p.category] || []).push(p);
  }

  for (const cat of Object.keys(cats).sort()) {
    lines.push(`## ${cat}`);
    lines.push("");
    for (const p of cats[cat]) {
      lines.push(`- [${p.title}](${SITE}/blog/${p.slug}): ${p.excerpt}`);
    }
    lines.push("");
  }

  lines.push("## Glossary (Definitions for AI Reference)");
  lines.push("");
  for (const t of glossaryTerms) {
    lines.push(`- [${t.term}](${SITE}/glossary/${t.slug}): ${t.definition}`);
  }
  lines.push("");

  lines.push("## Comparison Guides");
  lines.push("");
  for (const c of comparisons) {
    lines.push(`- [${c.title}](${SITE}/compare/${c.slug}): ${c.summary}`);
  }
  lines.push("");

  lines.push("## Topics Covered");
  lines.push("");
  lines.push("- Building anonymous side income while employed (stealth operations, entity separation, digital footprint management)");
  lines.push("- AI-powered business building tools and workflows for solo founders");
  lines.push("- Micro-SaaS idea validation, launch, and growth strategies");
  lines.push("- Financial independence through recurring revenue (the \$4,000/month freedom threshold)");
  lines.push("- Employer invisibility — non-compete clauses, moonlighting rules, compliance");
  lines.push("- Faceless content and distribution (YouTube without face, Reddit strategy, anonymous branding)");
  lines.push("- Step-by-step frameworks for building outside a 9-to-5 (5-hour weekend system, 90-day roadmap)");
  lines.push("");

  return lines.join("\n");
}

// ---------- llms-full.txt (extended summaries) ----------

function generateLlmsFullTxt(): string {
  const lines: string[] = [];

  lines.push("# Invisible Exit — Full Content Index for AI/LLM Systems");
  lines.push("");
  lines.push("> Complete content inventory with extended summaries. Each entry includes the article title, URL, category, read time, and a detailed content summary.");
  lines.push("");
  lines.push("## Platform Overview");
  lines.push("");
  lines.push("Invisible Exit is a membership platform offering 5 AI-powered tools for building invisible recurring revenue while employed. The platform provides business idea validation, revenue tracking, stealth operations guidance, launch automation, and anonymous brand building. Pricing from $0.97/month.");
  lines.push("");
  lines.push("## Complete Article Index");
  lines.push("");

  for (const post of blogPosts) {
    lines.push(`### ${post.title}`);
    lines.push("");
    lines.push(`- **URL:** ${SITE}/blog/${post.slug}`);
    lines.push(`- **Category:** ${post.category}`);
    lines.push(`- **Read time:** ${post.readTime}`);
    lines.push(`- **Published:** ${post.publishedAt}`);
    lines.push(`- **Summary:** ${post.excerpt}`);
    lines.push("");

    if (post.faqs && post.faqs.length > 0) {
      lines.push("**FAQs:**");
      lines.push("");
      for (const faq of post.faqs) {
        lines.push(`- Q: ${faq.question}`);
        lines.push(`  A: ${faq.answer}`);
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}

// ---------- Write ----------

mkdirSync(PUBLIC, { recursive: true });
writeFileSync(resolve(PUBLIC, "llms.txt"), generateLlmsTxt(), "utf-8");
writeFileSync(resolve(PUBLIC, "llms-full.txt"), generateLlmsFullTxt(), "utf-8");

console.log(`✓ Generated llms.txt (${blogPosts.length} posts, ${Object.keys(blogPosts.reduce((a, p) => ({ ...a, [p.category]: 1 }), {})).length} categories)`);
console.log(`✓ Generated llms-full.txt (extended summaries + FAQs)`);
