/**
 * Generates llms.txt and llms-full.txt from ALL site data.
 * llms.txt = concise index with all 465 pages (blog + pSEO expansion)
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
// pSEO page types (Greg Isenberg sprint)
import { alternatives } from "../src/data/alternatives.js";
import { salaries } from "../src/data/salaries.js";
import { revenueMilestones } from "../src/data/revenue-milestones.js";
import { timelines } from "../src/data/timelines.js";
import { professionStacks } from "../src/data/profession-stacks.js";
import { costOfWaitingPages } from "../src/data/cost-of-waiting.js";
import { professionStatePages } from "../src/data/profession-states.js";
import { nonCompeteMatrix } from "../src/data/non-compete-matrix.js";
import { toolAlternatives } from "../src/data/tool-alternatives.js";
import { saasBlueprints } from "../src/data/saas-blueprints.js";
import { revenueRoadmaps } from "../src/data/revenue-roadmaps.js";

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

  // Blog category landing pages (dynamic from blog data)
  const blogCats = [...new Set(
    blogPosts.map((p) =>
      p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    )
  )].sort();
  for (const cat of blogCats) {
    lines.push(`- [Blog: ${cat.replace(/-/g, " ")}](https://invisibleexit.com/blog/category/${cat}): Category landing page`);
  }
  lines.push(`- [Glossary](https://invisibleexit.com/glossary): Plain-English definitions of micro-SaaS, recurring revenue, and stealth operations terms`);
  lines.push(`- [Story](https://invisibleexit.com/story): The complete origin story — how a corporate manager built $4K/month invisibly`);
  lines.push(`- [Adrian](https://invisibleexit.com/adrian): The anonymous founder's identity page`);
  lines.push(`- [Masterclass](https://invisibleexit.com/masterclass): Free 45-minute masterclass for corporate managers`);
  lines.push(`- [Privacy Policy](https://invisibleexit.com/privacy): Privacy policy`);
  lines.push(`- [Terms of Service](https://invisibleexit.com/terms): Terms of service`);
  lines.push("");
  lines.push("## Funnel & Framework Pages");
  lines.push("");
  lines.push(`- [Pro Membership](https://invisibleexit.com/pro): Pro tier — full access to all 5 AI tools`);
  lines.push(`- [Freedom Number Calculator](https://invisibleexit.com/freedom): Calculate your freedom number and MRR target`);
  lines.push(`- [Inner Circle](https://invisibleexit.com/inner-circle): Private community of employed founders building invisible revenue`);
  lines.push(`- [Affiliate Program](https://invisibleexit.com/affiliates): Earn recurring commissions referring Invisible Exit`);
  lines.push(`- [Dream 100](https://invisibleexit.com/dream-100): Dream 100 audience-building framework`);
  lines.push(`- [Intensive](https://invisibleexit.com/intensive): 1-on-1 intensive coaching program`);
  lines.push(`- [Traffic Blueprint](https://invisibleexit.com/traffic-blueprint): Full traffic generation blueprint for micro-SaaS`);
  lines.push(`- [Content Calendar](https://invisibleexit.com/content-calendar): 90-day content calendar for faceless founders`);
  lines.push(`- [Affiliate Assets](https://invisibleexit.com/affiliate-assets): Swipe copy and creative assets for affiliates`);
  lines.push(`- [Podcast Pitch Kit](https://invisibleexit.com/podcast-pitch): Pitch templates for anonymous podcast outreach`);
  lines.push(`- [Backlink Strategy](https://invisibleexit.com/backlink-strategy): Step-by-step backlink acquisition playbook`);
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

  // ── pSEO: Alternatives ──
  lines.push(`## Product Alternatives (${alternatives.length})`);
  lines.push("");
  lines.push(`- [All Alternatives](${SITE}/alternatives): Index of product alternatives for solo founders`);
  for (const a of alternatives) {
    lines.push(`- [${a.h1}](${SITE}/alternatives/${a.slug}): ${a.metaDescription}`);
  }
  lines.push("");

  // ── pSEO: Salaries ──
  lines.push(`## Salary → Freedom Number (${salaries.length})`);
  lines.push("");
  lines.push(`- [All Salary Guides](${SITE}/salaries): Index of role salary-to-MRR conversions`);
  for (const s of salaries) {
    lines.push(`- [${s.h1}](${SITE}/salaries/${s.slug}): ${s.metaDescription}`);
  }
  lines.push("");

  // ── pSEO: Revenue Milestones ──
  lines.push(`## Revenue Milestones (${revenueMilestones.length})`);
  lines.push("");
  lines.push(`- [All Milestones](${SITE}/milestones): Index of MRR stage guides`);
  for (const m of revenueMilestones) {
    lines.push(`- [${m.h1}](${SITE}/milestones/${m.slug}): ${m.metaDescription}`);
  }
  lines.push("");

  // ── pSEO: Timeline ──
  lines.push(`## Builder Timeline (${timelines.length})`);
  lines.push("");
  lines.push(`- [Full Timeline](${SITE}/timeline): Month-by-month micro-SaaS roadmap`);
  for (const t of timelines) {
    lines.push(`- [${t.h1}](${SITE}/timeline/${t.slug}): ${t.metaDescription}`);
  }
  lines.push("");

  // ── pSEO: Profession Stacks ──
  lines.push(`## Profession Tool Stacks (${professionStacks.length})`);
  lines.push("");
  lines.push(`- [All Stacks](${SITE}/stack): Index of tool stacks by profession`);
  for (const s of professionStacks) {
    lines.push(`- [${s.h1}](${SITE}/stack/${s.slug}): ${s.metaDescription}`);
  }
  lines.push("");

  // ── pSEO: Cost of Waiting ──
  lines.push(`## Cost of Waiting (${costOfWaitingPages.length})`);
  lines.push("");
  lines.push(`- [All Cost-of-Waiting Scenarios](${SITE}/cost-of-waiting): Index of opportunity cost calculators`);
  for (const c of costOfWaitingPages) {
    lines.push(`- [${c.h1}](${SITE}/cost-of-waiting/${c.slug}): ${c.metaDescription}`);
  }
  lines.push("");

  // ── pSEO: Profession × State ──
  lines.push(`## Micro-SaaS Ideas by Profession × State (${professionStatePages.length})`);
  lines.push("");
  for (const p of professionStatePages) {
    lines.push(`- [${p.h1}](${SITE}/ideas/${p.professionSlug}/in/${p.stateSlug}): ${p.metaDescription}`);
  }
  lines.push("");

  // ── pSEO: Non-Compete Matrix ──
  lines.push(`## Non-Compete Risk Matrix (${nonCompeteMatrix.length})`);
  lines.push("");
  lines.push(`- [Full Non-Compete Matrix](${SITE}/non-compete): Profession × state enforceability cross-reference`);
  for (const n of nonCompeteMatrix) {
    lines.push(`- [${n.h1}](${SITE}/non-compete/${n.slug}): ${n.metaDescription}`);
  }
  lines.push("");

  // ── pSEO: Career vs SaaS Comparisons ──
  lines.push(`## Profession × Career Comparisons`);
  lines.push("");
  lines.push(`- [Career vs Micro-SaaS Overview](${SITE}/vs): All profession comparisons`);
  lines.push(`- [Customer Success Manager vs Micro-SaaS](${SITE}/vs/customer-succes-vs-micro-saas-founder): Salary, risk, and freedom math`);
  lines.push(`- [Product Manager vs Micro-SaaS](${SITE}/vs/product-manager-vs-micro-saas-founder): Which path wins for long-term freedom`);
  lines.push(`- [Software Engineer vs Micro-SaaS](${SITE}/vs/software-engineer-vs-micro-saas-founder): Comparing two paths to independence`);
  lines.push(`- [Marketing Manager vs Micro-SaaS](${SITE}/vs/marketing-manager-vs-micro-saas-founder): Career trajectory comparison`);
  lines.push("");

  // ── pSEO: First Year Roadmaps ──
  lines.push(`## First Year Roadmaps`);
  lines.push("");
  lines.push(`- [First Year Overview](${SITE}/first-year): Month-by-month guides for every profession`);
  lines.push(`- [First Year as Software Engineer](${SITE}/first-year/first-year-as-software-engineer): What to expect in your first year`);
  lines.push(`- [First Year as Product Manager](${SITE}/first-year/first-year-as-product-manager): Month-by-month roadmap for PMs`);
  lines.push(`- [First Year as Financial Analyst](${SITE}/first-year/first-year-as-financial-analyst): Side business timeline for analysts`);
  lines.push(`- [First Year as Operations Manager](${SITE}/first-year/first-year-as-operations-manager): First 12 months roadmap`);
  lines.push("");

  // ── pSEO: Budget Guides ──
  lines.push(`## Budget Guides`);
  lines.push("");
  lines.push(`- [Budget Overview](${SITE}/budget): All budget configurations`);
  lines.push(`- [$0/Month Budget](${SITE}/budget/0-dollars): Free tool stack for zero-budget founders`);
  lines.push(`- [$50/Month Budget](${SITE}/budget/50-dollars): Starter budget configuration`);
  lines.push(`- [$100/Month Budget](${SITE}/budget/100-dollars): Growth budget for employed founders`);
  lines.push(`- [$500/Month Budget](${SITE}/budget/500-dollars): Scale budget for serious builders`);
  lines.push("");

  // ── pSEO: Hours Per Week Guides ──
  lines.push(`## Hours Per Week Guides`);
  lines.push("");
  lines.push(`- [Hours Overview](${SITE}/hours): All time investment guides`);
  lines.push(`- [5 Hours Per Week](${SITE}/hours/5-hours-per-week): Minimum viable time investment`);
  lines.push(`- [10 Hours Per Week](${SITE}/hours/10-hours-per-week): Balanced side-business schedule`);
  lines.push(`- [15 Hours Per Week](${SITE}/hours/15-hours-per-week): Accelerated growth timeline`);
  lines.push(`- [20 Hours Per Week](${SITE}/hours/20-hours-per-week): Maximum sustainable hours while employed`);
  lines.push("");

  // ── pSEO: Tool Cross-Reference ──
  lines.push(`## Tool Cross-Reference Guides`);
  lines.push("");
  lines.push(`- [Tool Cross-Reference Index](${SITE}/tools): All AI tool comparisons`);
  lines.push(`- [Best Analytics Tools](${SITE}/tools/best-analytics-tools-for-product-managers): Analytics tools for PMs`);
  lines.push(`- [Best Development Tools](${SITE}/tools/best-development-tools-for-software-engineers): Dev tools for engineers`);
  lines.push(`- [Best Marketing Tools](${SITE}/tools/best-marketing-tools-for-marketing-managers): Marketing stacks for side businesses`);
  lines.push("");

  // ── pSEO: Tool Alternatives (Greg Isenberg) ──
  lines.push(`## Tool Alternatives (${toolAlternatives.length})`);
  lines.push("");
  lines.push(`- [All Tool Alternatives](${SITE}/alternatives): Browse all alternatives`);
  for (const ta of toolAlternatives) {
    lines.push(`- [${ta.tool} Alternatives](${SITE}/alternatives/to/${ta.slug}): ${ta.metaDescription.substring(0, 120)}`);
  }
  lines.push("");

  // ── pSEO: SaaS Blueprints ──
  lines.push(`## SaaS Build Blueprints (${saasBlueprints.length})`);
  lines.push("");
  lines.push(`- [All Blueprints](${SITE}/blueprint): Browse all build guides`);
  for (const bp of saasBlueprints) {
    lines.push(`- [${bp.type} Blueprint](${SITE}/blueprint/${bp.slug}): ${bp.metaDescription.substring(0, 120)}`);
  }
  lines.push("");

  // ── pSEO: Revenue Roadmaps ──
  lines.push(`## Revenue Roadmaps (${revenueRoadmaps.length})`);
  lines.push("");
  lines.push(`- [All Revenue Roadmaps](${SITE}/roadmap): Browse all MRR targets`);
  for (const rr of revenueRoadmaps) {
    lines.push(`- [Roadmap to ${rr.target}](${SITE}/roadmap/${rr.slug}): ${rr.metaDescription.substring(0, 120)}`);
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

  // ── pSEO: Alternatives ──
  lines.push("## Product Alternatives (X Alternative Pages)");
  lines.push("");
  for (const a of alternatives) {
    lines.push(`### ${a.h1}`);
    lines.push(`- **URL:** ${SITE}/alternatives/${a.slug}`);
    lines.push(`- **Product:** ${a.product} (${a.category})`);
    lines.push(`- **Summary:** ${a.intro}`);
    lines.push(`- **Why switch:** ${(a.whySwitch || []).join("; ")}`);
    lines.push(`- **Alternatives:**`);
    for (const alt of a.alternatives) {
      lines.push(`  - ${alt.name}: ${alt.pricing}. Best for ${alt.bestFor}.`);
    }
    lines.push(`- **Verdict:** ${a.verdict}`);
    if (a.faqs && a.faqs.length > 0) {
      lines.push("- **FAQs:**");
      for (const faq of a.faqs) {
        lines.push(`  - Q: ${faq.question}`);
        lines.push(`    A: ${faq.answer}`);
      }
    }
    lines.push("");
  }

  // ── pSEO: Salaries ──
  lines.push("## Salary → Freedom Number Pages");
  lines.push("");
  for (const s of salaries) {
    lines.push(`### ${s.h1}`);
    lines.push(`- **URL:** ${SITE}/salaries/${s.slug}`);
    lines.push(`- **Role:** ${s.role}`);
    lines.push(`- **Avg Salary:** ${s.avgSalary} (${s.salaryRange})`);
    lines.push(`- **Freedom Number:** ${s.freedomNumber}`);
    lines.push(`- **Timeline:** ${s.timeline}`);
    lines.push(`- **Transferable Skills:** ${s.transferableSkills.join(", ")}`);
    lines.push(`- **Best Micro-SaaS Ideas:** ${s.bestMicroSaaSIdeas.join("; ")}`);
    if (s.faqs && s.faqs.length > 0) {
      lines.push("- **FAQs:**");
      for (const faq of s.faqs) {
        lines.push(`  - Q: ${faq.question}`);
        lines.push(`    A: ${faq.answer}`);
      }
    }
    lines.push("");
  }

  // ── pSEO: Revenue Milestones ──
  lines.push("## Revenue Milestone Pages");
  lines.push("");
  for (const m of revenueMilestones) {
    lines.push(`### ${m.h1}`);
    lines.push(`- **URL:** ${SITE}/milestones/${m.slug}`);
    lines.push(`- **Stage:** ${m.stage} (${m.mrrRange})`);
    lines.push(`- **Summary:** ${m.intro}`);
    lines.push(`- **Key Metrics:**`);
    for (const km of m.keyMetrics) {
      lines.push(`  - ${km.metric}: ${km.target}`);
    }
    lines.push(`- **Tactics:**`);
    for (const tac of m.tactics) {
      lines.push(`  - ${tac.tactic} (${tac.effort} effort): ${tac.description}`);
    }
    lines.push(`- **Common Mistakes:** ${(m.commonMistakes || []).join("; ")}`);
    lines.push(`- **Time Estimate:** ${m.timeEstimate}`);
    if (m.faqs && m.faqs.length > 0) {
      lines.push("- **FAQs:**");
      for (const faq of m.faqs) {
        lines.push(`  - Q: ${faq.question}`);
        lines.push(`    A: ${faq.answer}`);
      }
    }
    lines.push("");
  }

  // ── pSEO: Timeline ──
  lines.push("## Builder Timeline Pages");
  lines.push("");
  for (const t of timelines) {
    lines.push(`### ${t.h1}`);
    lines.push(`- **URL:** ${SITE}/timeline/${t.slug}`);
    lines.push(`- **Month:** ${t.month}`);
    lines.push(`- **Summary:** ${t.intro}`);
    lines.push(`- **Milestones:**`);
    for (const ms of t.milestones) {
      lines.push(`  - [${ms.completed ? "✓" : "○"}] ${ms.milestone}: ${ms.description}`);
    }
    lines.push(`- **Metrics to Check:** ${(t.metricsToCheck || []).join("; ")}`);
    lines.push(`- **Common Mistakes:** ${(t.mistakes || []).join("; ")}`);
    lines.push(`- **What's Next:** ${t.whatsNext}`);
    if (t.faqs && t.faqs.length > 0) {
      lines.push("- **FAQs:**");
      for (const faq of t.faqs) {
        lines.push(`  - Q: ${faq.question}`);
        lines.push(`    A: ${faq.answer}`);
      }
    }
    lines.push("");
  }

  // ── pSEO: Profession Stacks ──
  lines.push("## Profession Tool Stack Pages");
  lines.push("");
  for (const s of professionStacks) {
    lines.push(`### ${s.h1}`);
    lines.push(`- **URL:** ${SITE}/stack/${s.slug}`);
    lines.push(`- **Profession:** ${s.profession}`);
    lines.push(`- **Total Monthly Cost:** ${s.totalMonthlyCost} (replaces ${s.replaces})`);
    lines.push(`- **Summary:** ${s.intro}`);
    lines.push(`- **Stack:**`);
    for (const item of s.stack) {
      lines.push(`  - ${item.category}: ${item.tool} — ${item.why} (${item.cost})`);
    }
    lines.push(`- **Weekly Time:** ${s.weeklyTimeCommitment}`);
    if (s.faqs && s.faqs.length > 0) {
      lines.push("- **FAQs:**");
      for (const faq of s.faqs) {
        lines.push(`  - Q: ${faq.question}`);
        lines.push(`    A: ${faq.answer}`);
      }
    }
    lines.push("");
  }

  // ── pSEO: Cost of Waiting ──
  lines.push("## Cost of Waiting Pages");
  lines.push("");
  for (const c of costOfWaitingPages) {
    lines.push(`### ${c.h1}`);
    lines.push(`- **URL:** ${SITE}/cost-of-waiting/${c.slug}`);
    lines.push(`- **Salary:** ${c.salaryLabel} | **Horizon:** ${c.yearsLabel}`);
    lines.push(`- **Salary Earned:** $${c.salaryEarned.toLocaleString()}`);
    lines.push(`- **Micro-SaaS Revenue (if started):** $${c.microSaasRevenue.toLocaleString()}`);
    lines.push(`- **Opportunity Cost:** $${c.opportunityCost.toLocaleString()}`);
    lines.push(`- **Compounded Loss:** $${c.compoundedLoss.toLocaleString()}`);
    lines.push(`- **Summary:** ${c.intro}`);
    if (c.faqs && c.faqs.length > 0) {
      lines.push("- **FAQs:**");
      for (const faq of c.faqs) {
        lines.push(`  - Q: ${faq.question}`);
        lines.push(`    A: ${faq.answer}`);
      }
    }
    lines.push("");
  }

  // ── pSEO: Profession × State ──
  lines.push("## Micro-SaaS Ideas by Profession × State");
  lines.push("");
  for (const p of professionStatePages) {
    lines.push(`### ${p.h1}`);
    lines.push(`- **URL:** ${SITE}/ideas/${p.professionSlug}/in/${p.stateSlug}`);
    lines.push(`- **Profession:** ${p.profession} | **State:** ${p.state}`);
    lines.push(`- **Summary:** ${p.intro}`);
    if (p.faqs && p.faqs.length > 0) {
      lines.push("- **FAQs:**");
      for (const faq of p.faqs) {
        lines.push(`  - Q: ${faq.question}`);
        lines.push(`    A: ${faq.answer}`);
      }
    }
    lines.push("");
  }

  // ── pSEO: Non-Compete Matrix ──
  lines.push("## Non-Compete Risk Matrix");
  lines.push("");
  for (const n of nonCompeteMatrix) {
    lines.push(`### ${n.h1}`);
    lines.push(`- **URL:** ${SITE}/non-compete/${n.slug}`);
    lines.push(`- **Profession:** ${n.profession} | **State:** ${n.state}`);
    lines.push(`- **Can Build:** ${n.canBuild ? "Yes" : "No (high risk)"}`);
    lines.push(`- **Enforceability:** ${n.enforceabilityStatus}`);
    lines.push(`- **Key Risks:** ${(n.keyRisks || []).join("; ")}`);
    lines.push(`- **Safe Harbors:** ${(n.safeHarbors || []).join("; ")}`);
    if (n.faqs && n.faqs.length > 0) {
      lines.push("- **FAQs:**");
      for (const faq of n.faqs) {
        lines.push(`  - Q: ${faq.question}`);
        lines.push(`    A: ${faq.answer}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ---------- Write ----------

mkdirSync(PUBLIC, { recursive: true });
writeFileSync(resolve(PUBLIC, "llms.txt"), generateLlmsTxt(), "utf-8");
writeFileSync(resolve(PUBLIC, "llms-full.txt"), generateLlmsFullTxt(), "utf-8");

const totalPages =
  blogPosts.length +
  glossaryTerms.length +
  comparisons.length +
  stateGuides.length +
  industryIdeas.length +
  bestToolsLists.length +
  calculators.length +
  dataReports.length +
  resources.length +
  alternatives.length +
  salaries.length +
  revenueMilestones.length +
  timelines.length +
  professionStacks.length +
  costOfWaitingPages.length +
  professionStatePages.length +
  nonCompeteMatrix.length;
console.log(`✓ Generated llms.txt (${totalPages} pages across all content types)`);
console.log(`✓ Generated llms-full.txt (extended summaries + FAQs + data points)`);
