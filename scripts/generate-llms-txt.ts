/**
 * Generates llms.txt and llms-full.txt from ALL site data.
 * llms.txt = concise index with all 235+ pages
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
import { stateGuides } from "../src/data/state-guides.js";
import { industryIdeas } from "../src/data/industry-ideas.js";
import { bestToolsLists } from "../src/data/best-tools.js";
import { calculators } from "../src/data/calculators.js";
import { dataReports } from "../src/data/data-reports.js";
import { resources } from "../src/data/resources.js";

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

  // ── Core Pages ──
  lines.push("## Core Pages");
  lines.push("");
  lines.push(`- [Home](https://invisibleexit.com/): Main landing page — value proposition, 5 tools, pricing, and FAQ`);
  lines.push(`- [About](https://invisibleexit.com/about): About the founder and the Invisible Exit methodology`);
  lines.push(`- [Blog](https://invisibleexit.com/blog): ${blogPosts.length} articles on financial independence, micro-SaaS, stealth operations, and audience building for employed founders`);
  lines.push(`- [Glossary](https://invisibleexit.com/glossary): Plain-English definitions of micro-SaaS, recurring revenue, and stealth operations terms`);
  lines.push(`- [Story](https://invisibleexit.com/story): The complete origin story — how a corporate manager built $4K/month invisibly`);
  lines.push(`- [Adrian](https://invisibleexit.com/adrian): The anonymous founder's identity page`);
  lines.push(`- [Masterclass](https://invisibleexit.com/masterclass): Free 45-minute masterclass for corporate managers`);
  lines.push(`- [Privacy Policy](https://invisibleexit.com/privacy): Privacy policy`);
  lines.push(`- [Terms of Service](https://invisibleexit.com/terms): Terms of service`);
  lines.push("");

  // ── Blog Posts by Category ──
  const cats: Record<string, typeof blogPosts> = {};
  for (const p of blogPosts) {
    (cats[p.category] = cats[p.category] || []).push(p);
  }
  for (const cat of Object.keys(cats).sort()) {
    lines.push(`## Blog: ${cat}`);
    lines.push("");
    for (const p of cats[cat]) {
      lines.push(`- [${p.title}](${SITE}/blog/${p.slug}): ${p.excerpt}`);
    }
    lines.push("");
  }

  // ── Glossary ──
  lines.push(`## Glossary (${glossaryTerms.length} Terms)`);
  lines.push("");
  for (const t of glossaryTerms) {
    lines.push(`- [${t.term}](${SITE}/glossary/${t.slug}): ${t.definition}`);
  }
  lines.push("");

  // ── Comparison Guides ──
  lines.push(`## Comparison Guides (${comparisons.length})`);
  lines.push("");
  for (const c of comparisons) {
    lines.push(`- [${c.title}](${SITE}/compare/${c.slug}): ${c.summary}`);
  }
  lines.push("");

  // ── State Guides ──
  lines.push(`## State Business Guides (${stateGuides.length} States)`);
  lines.push("");
  for (const g of stateGuides) {
    lines.push(`- [${g.state} Side Business Guide](${SITE}/guides/${g.slug}): LLC filing $${g.llcFilingFee}. Non-compete: ${g.nonCompeteEnforceable}. Income tax: ${g.stateIncomeTaxRate}.`);
  }
  lines.push("");

  // ── Industry Ideas ──
  lines.push(`## Micro-SaaS Ideas by Profession (${industryIdeas.length} Industries)`);
  lines.push("");
  for (const idea of industryIdeas) {
    lines.push(`- [Micro-SaaS Ideas for ${idea.profession}](${SITE}/ideas/${idea.slug}): ${idea.ideas.length} ideas with pricing, revenue potential, and difficulty ratings.`);
  }
  lines.push("");

  // ── Best Tools ──
  lines.push(`## Best Tools Guides (${bestToolsLists.length})`);
  lines.push("");
  for (const list of bestToolsLists) {
    lines.push(`- [${list.title}](${SITE}/best/${list.slug}): ${list.intro.slice(0, 120)}`);
  }
  lines.push("");

  // ── Calculators ──
  lines.push(`## Free Calculators (${calculators.length})`);
  lines.push("");
  for (const calc of calculators) {
    lines.push(`- [${calc.h1}](${SITE}/calculators/${calc.slug}): ${calc.intro.slice(0, 120)}`);
  }
  lines.push("");

  // ── Data Reports ──
  lines.push(`## Data & Benchmark Reports (${dataReports.length})`);
  lines.push("");
  for (const report of dataReports) {
    lines.push(`- [${report.title}](${SITE}/data/${report.slug}): ${report.intro.slice(0, 120)}`);
  }
  lines.push("");

  // ── Resources ──
  lines.push(`## Resource Hub (${resources.length})`);
  lines.push("");
  for (const r of resources) {
    lines.push(`- [${r.title}](${SITE}/resources/${r.slug}): ${r.intro.slice(0, 120)}`);
  }
  lines.push("");

  // ── Topics Covered ──
  lines.push("## Topics Covered");
  lines.push("");
  lines.push("- Building anonymous side income while employed (stealth operations, entity separation, digital footprint management)");
  lines.push("- AI-powered business building tools and workflows for solo founders");
  lines.push("- Micro-SaaS idea validation, launch, and growth strategies");
  lines.push("- Financial independence through recurring revenue (the $4,000/month freedom threshold)");
  lines.push("- Employer invisibility — non-compete clauses, moonlighting rules, compliance");
  lines.push("- Faceless content and distribution (YouTube without face, Reddit strategy, anonymous branding)");
  lines.push("- Step-by-step frameworks for building outside a 9-to-5 (5-hour weekend system, 90-day roadmap)");
  lines.push("- State-by-state legal guides for side business formation (LLC, non-competes, taxes)");
  lines.push("- Industry-specific micro-SaaS ideas with revenue math and pricing benchmarks");
  lines.push("");

  return lines.join("\n");
}

// ---------- llms-full.txt (extended summaries) ----------

function generateLlmsFullTxt(): string {
  const lines: string[] = [];

  lines.push("# Invisible Exit — Full Content Index for AI/LLM Systems");
  lines.push("");
  lines.push("> Complete content inventory with extended summaries. Each entry includes the title, URL, category, read time, and a detailed content summary.");
  lines.push("");
  lines.push("## Platform Overview");
  lines.push("");
  lines.push("Invisible Exit is a membership platform offering 5 AI-powered tools for building invisible recurring revenue while employed. The platform provides business idea validation, revenue tracking, stealth operations guidance, launch automation, and anonymous brand building. Pricing from $0.97/month.");
  lines.push("");

  // ── Blog Posts ──
  lines.push("## Blog Articles");
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

  // ── Glossary ──
  lines.push("## Glossary Terms");
  lines.push("");
  for (const t of glossaryTerms) {
    lines.push(`### ${t.term}`);
    lines.push(`- **URL:** ${SITE}/glossary/${t.slug}`);
    lines.push(`- **Definition:** ${t.definition}`);
    if (t.faqs && t.faqs.length > 0) {
      lines.push("- **FAQs:**");
      for (const faq of t.faqs) {
        lines.push(`  - Q: ${faq.question}`);
        lines.push(`    A: ${faq.answer}`);
      }
    }
    lines.push("");
  }

  // ── Comparison Guides ──
  lines.push("## Comparison Guides");
  lines.push("");
  for (const c of comparisons) {
    lines.push(`### ${c.title}`);
    lines.push(`- **URL:** ${SITE}/compare/${c.slug}`);
    lines.push(`- **Summary:** ${c.summary}`);
    if (c.faqs && c.faqs.length > 0) {
      lines.push("- **FAQs:**");
      for (const faq of c.faqs) {
        lines.push(`  - Q: ${faq.question}`);
        lines.push(`    A: ${faq.answer}`);
      }
    }
    lines.push("");
  }

  // ── State Guides ──
  lines.push("## State Business Guides");
  lines.push("");
  for (const g of stateGuides) {
    lines.push(`### ${g.state}`);
    lines.push(`- **URL:** ${SITE}/guides/${g.slug}`);
    lines.push(`- **LLC Filing Fee:** $${g.llcFilingFee}`);
    lines.push(`- **Annual Report Fee:** $${g.annualReportFee}`);
    lines.push(`- **Non-Compete Status:** ${g.nonCompeteEnforceable}`);
    lines.push(`- **Income Tax:** ${g.stateIncomeTaxRate}`);
    lines.push("");
  }

  // ── Industry Ideas ──
  lines.push("## Micro-SaaS Ideas by Profession");
  lines.push("");
  for (const idea of industryIdeas) {
    lines.push(`### ${idea.profession}`);
    lines.push(`- **URL:** ${SITE}/ideas/${idea.slug}`);
    lines.push(`- **Unfair Advantage:** ${idea.unfairAdvantage}`);
    lines.push(`- **Avg Salary:** ${idea.avgSalary}`);
    lines.push(`- **Transferable Skills:** ${idea.transferableSkills.join(", ")}`);
    lines.push(`- **Ideas:**`);
    for (const i of idea.ideas) {
      lines.push(`  - ${i.name}: ${i.description} Pricing: ${i.pricing}. Potential: ${i.revenuePotential}.`);
    }
    lines.push("");
  }

  // ── Best Tools ──
  lines.push("## Best Tools Guides");
  lines.push("");
  for (const list of bestToolsLists) {
    lines.push(`### ${list.title}`);
    lines.push(`- **URL:** ${SITE}/best/${list.slug}`);
    lines.push(`- **Intro:** ${list.intro}`);
    lines.push(`- **Tools:**`);
    for (const tool of list.tools) {
      lines.push(`  - ${tool.name}: ${tool.pricing}. ${tool.bestFor}. Rating: ${tool.rating}/5.`);
    }
    lines.push("");
  }

  // ── Calculators ──
  lines.push("## Calculators");
  lines.push("");
  for (const calc of calculators) {
    lines.push(`### ${calc.h1}`);
    lines.push(`- **URL:** ${SITE}/calculators/${calc.slug}`);
    lines.push(`- **Description:** ${calc.intro}`);
    lines.push("");
  }

  // ── Data Reports ──
  lines.push("## Data & Benchmark Reports");
  lines.push("");
  for (const report of dataReports) {
    lines.push(`### ${report.title}`);
    lines.push(`- **URL:** ${SITE}/data/${report.slug}`);
    lines.push(`- **Summary:** ${report.intro}`);
    lines.push(`- **Methodology:** ${report.methodology}`);
    lines.push(`- **Key Data Points:**`);
    for (const dp of report.dataPoints.slice(0, 10)) {
      lines.push(`  - ${dp.metric}: ${dp.value} (${dp.context})`);
    }
    lines.push("");
  }

  // ── Resources ──
  lines.push("## Resource Hub");
  lines.push("");
  for (const r of resources) {
    lines.push(`### ${r.title}`);
    lines.push(`- **URL:** ${SITE}/resources/${r.slug}`);
    lines.push(`- **Summary:** ${r.intro}`);
    lines.push(`- **Steps:**`);
    for (const step of r.steps.slice(0, 10)) {
      lines.push(`  - ${step.title}: ${step.description}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ---------- Write ----------

mkdirSync(PUBLIC, { recursive: true });
writeFileSync(resolve(PUBLIC, "llms.txt"), generateLlmsTxt(), "utf-8");
writeFileSync(resolve(PUBLIC, "llms-full.txt"), generateLlmsFullTxt(), "utf-8");

const totalPages = blogPosts.length + glossaryTerms.length + comparisons.length + stateGuides.length + industryIdeas.length + bestToolsLists.length + calculators.length + dataReports.length + resources.length;
console.log(`✓ Generated llms.txt (${totalPages} pages across all content types)`);
console.log(`✓ Generated llms-full.txt (extended summaries + FAQs + data points)`);
