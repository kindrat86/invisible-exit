/**
 * Generates public/sitemap.xml from blog-posts, comparisons, and glossary data.
 * Run: npx tsx scripts/generate-sitemap.ts
 */
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

// Dynamically import data using tsx which resolves path aliases
async function main() {
  const { blogPosts } = await import("../src/data/blog-posts.js");
  const { comparisons } = await import("../src/data/comparisons.js");
  const { glossaryTerms } = await import("../src/data/glossary.js");
  const { stateGuides } = await import("../src/data/state-guides.js");
  const { industryIdeas } = await import("../src/data/industry-ideas.js");
  const { bestToolsLists } = await import("../src/data/best-tools.js");
  const { calculators } = await import("../src/data/calculators.js");
  const { dataReports } = await import("../src/data/data-reports.js");
  const { resources } = await import("../src/data/resources.js");
  const { alternatives } = await import("../src/data/alternatives.js");
  const { salaries } = await import("../src/data/salaries.js");
  const { revenueMilestones } = await import("../src/data/revenue-milestones.js");
  const { timelines } = await import("../src/data/timelines.js");
  const { professionStacks } = await import("../src/data/profession-stacks.js");
  const { costOfWaitingPages } = await import("../src/data/cost-of-waiting.js");
  const { professionStatePages } = await import("../src/data/profession-states.js");
  const { nonCompeteMatrix } = await import("../src/data/non-compete-matrix.js");

  // pSEO Round 2
  const { professionMistakes } = await import("../src/data/profession-mistakes.js");
  const { redditStrategies } = await import("../src/data/reddit-strategies.js");
  const { pricingModels } = await import("../src/data/pricing-models.js");
  const { breakEvenPages } = await import("../src/data/break-even.js");
  const { professionVsCareer } = await import("../src/data/profession-vs-career.js");
  const { firstYearEntries } = await import("../src/data/first-year.js");
  const { toolCrossReference } = await import("../src/data/tool-cross-reference.js");

  // Greg Isenberg pSEO Round 3
  const { aiToolProfessionPages } = await import("../src/data/ai-tool-professions.js");
  const { budgetPages } = await import("../src/data/budget-pages.js");
  const { hoursPages } = await import("../src/data/hours-pages.js");
  const { toolAlternatives } = await import("../src/data/tool-alternatives.js");
  const { saasBlueprints } = await import("../src/data/saas-blueprints.js");
  const { revenueRoadmaps } = await import("../src/data/revenue-roadmaps.js");
  const { costAnalysisPages } = await import("../src/data/cost-analysis.js");
  const { howToGuides } = await import("../src/data/how-to-guides.js");
  const { isItLegalPages } = await import("../src/data/is-it-legal.js");

  // Greg Isenberg pSEO Round 4
  const { sideHustles } = await import("../src/data/side-hustles.js");
  const { budgetStartPages } = await import("../src/data/budget-start.js");
  const { niches } = await import("../src/data/niches.js");

  // Greg Isenberg pSEO Round 5
  const { quitJobPages } = await import("../src/data/quit-job.js");
  const { weekendBuilds } = await import("../src/data/weekend-builds.js");
  const { failureStories } = await import("../src/data/failure-stories.js");

  // Greg Isenberg pSEO Round 6
  const { toolReviews } = await import("../src/data/tool-reviews.js");

  // Greg Isenberg pSEO Round 7
  const { caseStudies } = await import("../src/data/case-studies.js");
  const { revenueTargets } = await import("../src/data/revenue-targets.js");
  const { cities } = await import("../src/data/cities.js");
  const { skills } = await import("../src/data/skills.js");
  const { audienceIdeas } = await import("../src/data/audience-ideas.js");
  const { cityProfessionPages } = await import("../src/data/city-profession.js");

  // Greg Isenberg pSEO: Exit Strategy pages
  const { exitStrategyPages } = await import("../src/data/exit-strategies.js");

  // Greg Isenberg pSEO Round 8
  const { taxGuides } = await import("../src/data/tax-guides.js");
  const { ndaGuides } = await import("../src/data/nda-guides.js");
  const { insuranceGuides } = await import("../src/data/insurance.js");
  const { timeFrameworks } = await import("../src/data/time-frameworks.js");
  const { bankingGuides } = await import("../src/data/banking.js");

  const today = new Date().toISOString().split("T")[0];
  const latestPostDate = blogPosts
    .map((p: { publishedAt: string }) => p.publishedAt)
    .sort()
    .pop() || today;

  // Build category slugs dynamically from blog posts
  const categorySlugs = [...new Set(
    blogPosts.map((p: { category: string }) =>
      p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    )
  )];

  const entries: SitemapEntry[] = [
    {
      loc: "https://invisibleexit.com/",
      lastmod: today,
      changefreq: "weekly",
      priority: "1.0",
    },
    {
      loc: "https://invisibleexit.com/blog",
      lastmod: latestPostDate,
      changefreq: "daily",
      priority: "0.9",
    },
    // Category landing pages (dynamic from blog data)
    ...categorySlugs.map((cat: string) => ({
      loc: `https://invisibleexit.com/blog/category/${cat}`,
      lastmod: today,
      changefreq: "weekly" as const,
      priority: "0.7" as const,
    })),
    // Comparison pages (dynamic from comparisons data)
    ...comparisons.map((c: { slug: string }) => ({
      loc: `https://invisibleexit.com/compare/${c.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Glossary index + term pages (dynamic from glossary data)
    {
      loc: "https://invisibleexit.com/glossary",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.7",
    },
    ...glossaryTerms.map((t: { slug: string }) => ({
      loc: `https://invisibleexit.com/glossary/${t.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Blog posts
    ...blogPosts.map((post: { slug: string; publishedAt: string }) => ({
      loc: `https://invisibleexit.com/blog/${post.slug}`,
      lastmod: post.publishedAt,
      changefreq: "weekly",
      priority: "0.8",
    })),
    // State guides (pSEO)
    ...stateGuides.map((s: { slug: string }) => ({
      loc: `https://invisibleexit.com/guides/${s.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Industry ideas (pSEO)
    ...industryIdeas.map((p: { slug: string }) => ({
      loc: `https://invisibleexit.com/ideas/${p.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.8" as const,
    })),
    // Best tools lists (pSEO)
    ...bestToolsLists.map((t: { slug: string }) => ({
      loc: `https://invisibleexit.com/best/${t.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Calculators
    ...calculators.map((c: { slug: string }) => ({
      loc: `https://invisibleexit.com/calculators/${c.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.8" as const,
    })),
    // Data reports
    ...dataReports.map((d: { slug: string }) => ({
      loc: `https://invisibleexit.com/data/${d.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.8" as const,
    })),
    // Resources
    ...resources.map((r: { slug: string }) => ({
      loc: `https://invisibleexit.com/resources/${r.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Legal pages (removed from sitemap — they are noindex)
    // /privacy and /terms are legal pages with no SEO value
    // Keeping them in the sitemap signals to Google they're important when they're not
    {
      loc: "https://invisibleexit.com/about",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      loc: "https://invisibleexit.com/answers",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.8",
    },
    {
      loc: "https://invisibleexit.com/freedom-calculator-widget",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.9",
    },
    {
      loc: "https://invisibleexit.com/freedom-path-calculator",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.9",
    },
    {
      loc: "https://invisibleexit.com/tools",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.9",
    },
    // Funnel + Expert Secrets pages
    {
      loc: "https://invisibleexit.com/story",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.9",
    },
    {
      loc: "https://invisibleexit.com/manifesto",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.9",
    },
    {
      loc: "https://invisibleexit.com/guides/freedom-number",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.9",
    },
    {
      loc: "https://invisibleexit.com/compare",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      loc: "https://invisibleexit.com/adrian",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      loc: "https://invisibleexit.com/masterclass",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      loc: "https://invisibleexit.com/freedom",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      loc: "https://invisibleexit.com/inner-circle",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/affiliates",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.6",
    },
    {
      loc: "https://invisibleexit.com/feeling-stuck",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/partners/embed",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.6",
    },
    {
      loc: "https://invisibleexit.com/partners/jv",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/content-strategy",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/resources",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.7",
    },
    // SEO Ghost Fix: Index pages added to sitemap
    { loc: "https://invisibleexit.com/best", lastmod: today, changefreq: "weekly", priority: "0.7" },
    { loc: "https://invisibleexit.com/guides", lastmod: today, changefreq: "weekly", priority: "0.7" },
    { loc: "https://invisibleexit.com/ideas", lastmod: today, changefreq: "weekly", priority: "0.7" },
    { loc: "https://invisibleexit.com/calculators", lastmod: today, changefreq: "monthly", priority: "0.7" },
    { loc: "https://invisibleexit.com/data", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: "https://invisibleexit.com/vs", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: "https://invisibleexit.com/alternatives", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: "https://invisibleexit.com/salaries", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: "https://invisibleexit.com/milestones", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: "https://invisibleexit.com/timeline", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: "https://invisibleexit.com/stack", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: "https://invisibleexit.com/cost-of-waiting", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: "https://invisibleexit.com/non-compete", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: "https://invisibleexit.com/mistakes", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: "https://invisibleexit.com/reddit", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: "https://invisibleexit.com/pricing-models", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: "https://invisibleexit.com/break-even", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: "https://invisibleexit.com/first-year", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: "https://invisibleexit.com/hours", lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: "https://invisibleexit.com/budget", lastmod: today, changefreq: "monthly", priority: "0.6" },
    // /for hub + audience pages (previously only listed in the now-removed orphan sitemap-pseo.xml).
    // Canonical is /for (no trailing slash); the orphan listed /for/ which 308-redirects, so it is dropped.
    { loc: "https://invisibleexit.com/for", lastmod: today, changefreq: "monthly", priority: "0.7" },
    { loc: "https://invisibleexit.com/for/founders", lastmod: today, changefreq: "monthly", priority: "0.6" },
    {
      loc: "https://invisibleexit.com/dream-100",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.6",
    },
    {
      loc: "https://invisibleexit.com/intensive",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    // Traffic Secrets pages
    {
      loc: "https://invisibleexit.com/traffic-blueprint",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      loc: "https://invisibleexit.com/hooks",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.8",
    },
    {
      loc: "https://invisibleexit.com/growth",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      loc: "https://invisibleexit.com/content-calendar",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/affiliate-assets",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.6",
    },
    {
      loc: "https://invisibleexit.com/podcast-pitch",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.6",
    },
    {
      loc: "https://invisibleexit.com/backlink-strategy",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.6",
    },
    // Expert Secrets pages
    {
      loc: "https://invisibleexit.com/founding-wall",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.8",
    },
    {
      loc: "https://invisibleexit.com/frameworks",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/proof",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.8",
    },
    {
      loc: "https://invisibleexit.com/beliefs",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/lexicon",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.6",
    },
    {
      loc: "https://invisibleexit.com/one-thing",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/join",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/is-this-you",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    // Dotcom Secrets pages
    {
      loc: "https://invisibleexit.com/funnel-metrics",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/tripwire",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/weekend-workshop",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/ask",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.6",
    },
    {
      loc: "https://invisibleexit.com/free-book",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    },
    // Traffic Secrets pages
    {
      loc: "https://invisibleexit.com/who",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/where",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/ad-library",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/hso",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/traffic-roadmap",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      loc: "https://invisibleexit.com/testing",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/youtube-strategy",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/dream-100-tracker",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.7",
    },
    {
      loc: "https://invisibleexit.com/pillar-hub",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      loc: "https://invisibleexit.com/explore",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.8",
    },
    // Hub pages for new pSEO categories
    { loc: "https://invisibleexit.com/cost-analysis", lastmod: today, changefreq: "weekly", priority: "0.8" },
    { loc: "https://invisibleexit.com/how-to", lastmod: today, changefreq: "weekly", priority: "0.8" },
    { loc: "https://invisibleexit.com/is-it-legal", lastmod: today, changefreq: "weekly", priority: "0.8" },
    // Value Ladder tiers
    {
      loc: "https://invisibleexit.com/pro",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    },
    // ── pSEO Expansion Pages (Greg Isenberg) ──
    // Alternatives (X Alternative)
    ...alternatives.map((a: { slug: string }) => ({
      loc: `https://invisibleexit.com/alternatives/${a.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Salary pages
    ...salaries.map((s: { slug: string }) => ({
      loc: `https://invisibleexit.com/salaries/${s.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Revenue milestones
    ...revenueMilestones.map((m: { slug: string }) => ({
      loc: `https://invisibleexit.com/milestones/${m.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Timeline pages
    ...timelines.map((t: { slug: string }) => ({
      loc: `https://invisibleexit.com/timeline/${t.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Profession tool stacks
    ...professionStacks.map((s: { slug: string }) => ({
      loc: `https://invisibleexit.com/stack/${s.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Cost of waiting
    ...costOfWaitingPages.map((c: { slug: string }) => ({
      loc: `https://invisibleexit.com/cost-of-waiting/${c.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.6" as const,
    })),
    // Profession × State cross pages
    ...professionStatePages.map((p: { professionSlug: string; stateSlug: string }) => ({
      loc: `https://invisibleexit.com/ideas/${p.professionSlug}/in/${p.stateSlug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Non-compete matrix
    ...nonCompeteMatrix.map((n: { slug: string }) => ({
      loc: `https://invisibleexit.com/non-compete/${n.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),

    // pSEO Round 2 — Greg Isenberg expansion
    ...professionMistakes.map((m: { slug: string }) => ({
      loc: `https://invisibleexit.com/mistakes/${m.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    ...redditStrategies.map((r: { slug: string }) => ({
      loc: `https://invisibleexit.com/reddit/${r.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    ...pricingModels.map((p: { slug: string }) => ({
      loc: `https://invisibleexit.com/pricing-models/${p.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.8" as const,
    })),
    ...breakEvenPages.map((b: { slug: string }) => ({
      loc: `https://invisibleexit.com/break-even/${b.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    ...professionVsCareer.map((v: { slug: string }) => ({
      loc: `https://invisibleexit.com/vs/${v.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    ...firstYearEntries.map((f: { slug: string }) => ({
      loc: `https://invisibleexit.com/first-year/${f.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    ...toolCrossReference.map((t: { slug: string }) => ({
      loc: `https://invisibleexit.com/tools/${t.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Greg Isenberg pSEO Round 3: AI Tool × Profession
    ...aiToolProfessionPages.map((p: { professionSlug: string; toolSlug: string }) => ({
      loc: `https://invisibleexit.com/ideas/${p.professionSlug}/with/${p.toolSlug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Budget pages
    ...budgetPages.map((b: { slug: string }) => ({
      loc: `https://invisibleexit.com/budget/${b.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.8" as const,
    })),
    // Hours pages
    ...hoursPages.map((h: { slug: string }) => ({
      loc: `https://invisibleexit.com/hours/${h.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.8" as const,
    })),
    // Tool Alternatives pages
    ...toolAlternatives.map((ta: { slug: string }) => ({
      loc: `https://invisibleexit.com/alternatives/to/${ta.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.9" as const,
    })),
    // SaaS Blueprint pages
    ...saasBlueprints.map((bp: { slug: string }) => ({
      loc: `https://invisibleexit.com/blueprint/${bp.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.8" as const,
    })),
    // Revenue Roadmap pages
    ...revenueRoadmaps.map((rr: { slug: string }) => ({
      loc: `https://invisibleexit.com/roadmap/${rr.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.9" as const,
    })),
    // Cost Analysis pages
    ...costAnalysisPages.map((ca: { slug: string }) => ({
      loc: `https://invisibleexit.com/cost-analysis/${ca.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // How-To guides
    ...howToGuides.map((hg: { slug: string }) => ({
      loc: `https://invisibleexit.com/how-to/${hg.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Is It Legal pages
    ...isItLegalPages.map((il: { slug: string }) => ({
      loc: `https://invisibleexit.com/is-it-legal/${il.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // ── Greg Isenberg pSEO Round 4 ──
    // Side Hustle pages
    ...sideHustles.map((sh: { slug: string }) => ({
      loc: `https://invisibleexit.com/side-hustles/${sh.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Budget Start pages
    ...budgetStartPages.map((bs: { slug: string }) => ({
      loc: `https://invisibleexit.com/by-budget/${bs.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Niche pages
    ...niches.map((n: { slug: string }) => ({
      loc: `https://invisibleexit.com/niches/${n.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // ── Greg Isenberg pSEO Round 5 ──
    // Quit Your Job pages
    ...quitJobPages.map((q: { slug: string }) => ({
      loc: `https://invisibleexit.com/quit-your-job/${q.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.8" as const,
    })),
    // Weekend Build pages
    ...weekendBuilds.map((w: { slug: string }) => ({
      loc: `https://invisibleexit.com/weekend-builds/${w.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // Failure Story pages
    ...failureStories.map((f: { slug: string }) => ({
      loc: `https://invisibleexit.com/failure-stories/${f.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // ── Greg Isenberg pSEO Round 6 ──
    // Tool Review pages
    ...toolReviews.map((t: { slug: string }) => ({
      loc: `https://invisibleexit.com/reviews/${t.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.8" as const,
    })),
    // ── Greg Isenberg pSEO Round 7 ──
    // Case Study pages
    ...caseStudies.map((c: { slug: string }) => ({
      loc: `https://invisibleexit.com/case-studies/${c.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.8" as const,
    })),
    // ── Greg Isenberg pSEO Round 8 ──
    // Revenue Target pages
    ...revenueTargets.map((r: { slug: string }) => ({
      loc: `https://invisibleexit.com/revenue/${r.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.8" as const,
    })),
    // City pages
    ...cities.map((c: { slug: string }) => ({
      loc: `https://invisibleexit.com/cities/${c.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.8" as const,
    })),
    // Skill Monetization pages
    ...skills.map((s: { slug: string }) => ({
      loc: `https://invisibleexit.com/skills/${s.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.8" as const,
    })),
    // Audience/Demographic pages (Greg Isenberg Round 7)
    ...audienceIdeas.map((a: { slug: string }) => ({
      loc: `https://invisibleexit.com/audience/${a.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.8" as const,
    })),
    ...audienceIdeas.length > 0 ? [{ loc: "https://invisibleexit.com/audience", lastmod: today, changefreq: "monthly" as const, priority: "0.7" as const }] : [],
    // Exit Strategy pages (Greg Isenberg pSEO)
    ...exitStrategyPages.map((e: { slug: string }) => ({
      loc: `https://invisibleexit.com/exit-strategies/${e.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.8" as const,
    })),
    // Hub page for exit strategies
    exitStrategyPages.length > 0 ? { loc: "https://invisibleexit.com/exit-strategies", lastmod: today, changefreq: "weekly" as const, priority: "0.7" as const } : [],
    // City × Profession cross pages (Greg Isenberg Round 7)
    ...cityProfessionPages.map((cp: { citySlug: string; professionSlug: string }) => ({
      loc: `https://invisibleexit.com/cities/${cp.citySlug}/for/${cp.professionSlug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // ── Greg Isenberg pSEO Round 8: Tax, NDA, Insurance, Time Frameworks ──
    { loc: "https://invisibleexit.com/tax-guides", lastmod: today, changefreq: "weekly" as const, priority: "0.8" as const },
    ...taxGuides.map((t: { slug: string }) => ({
      loc: `https://invisibleexit.com/tax-guides/${t.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    { loc: "https://invisibleexit.com/nda-guides", lastmod: today, changefreq: "weekly" as const, priority: "0.8" as const },
    ...ndaGuides.map((n: { slug: string }) => ({
      loc: `https://invisibleexit.com/nda-guides/${n.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    { loc: "https://invisibleexit.com/insurance", lastmod: today, changefreq: "weekly" as const, priority: "0.8" as const },
    ...insuranceGuides.map((i: { slug: string }) => ({
      loc: `https://invisibleexit.com/insurance/${i.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    { loc: "https://invisibleexit.com/time-frameworks", lastmod: today, changefreq: "weekly" as const, priority: "0.8" as const },
    ...timeFrameworks.map((t: { slug: string }) => ({
      loc: `https://invisibleexit.com/time-frameworks/${t.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
    // ── Banking guides ──
    { loc: "https://invisibleexit.com/banking", lastmod: today, changefreq: "weekly" as const, priority: "0.8" as const },
    ...bankingGuides.map((bg: { slug: string }) => ({
      loc: `https://invisibleexit.com/banking/${bg.slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.7" as const,
    })),
  ];

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const publicDir = resolve(__dirname, "../public");

  // ── Split sitemap into sub-sitemaps by type for better crawl efficiency ──
// Google recommends max ~500 URLs per sitemap. We have ~1,800 URLs, so we split.
const submaps: Record<string, SitemapEntry[]> = {
  "core": entries.filter(e =>
    !e.loc.includes("/blog/") &&
    !e.loc.includes("/guides/") &&
    !e.loc.includes("/ideas/") &&
    !e.loc.includes("/best/") &&
    !e.loc.includes("/glossary/") &&
    !e.loc.includes("/compare/") &&
    !e.loc.includes("/alternatives/") &&
    !e.loc.includes("/salaries/") &&
    !e.loc.includes("/milestones/") &&
    !e.loc.includes("/timeline/") &&
    !e.loc.includes("/stack/") &&
    !e.loc.includes("/cost-of-waiting/") &&
    !e.loc.includes("/non-compete/") &&
    !e.loc.includes("/mistakes/") &&
    !e.loc.includes("/reddit/") &&
    !e.loc.includes("/pricing-models/") &&
    !e.loc.includes("/break-even/") &&
    !e.loc.includes("/vs/") &&
    !e.loc.includes("/first-year/") &&
    !e.loc.includes("/tools/") &&
    !e.loc.includes("/calculators/") &&
    !e.loc.includes("/data/") &&
    !e.loc.includes("/resources/") &&
    !e.loc.includes("/cost-analysis/") &&
    !e.loc.includes("/how-to/") &&
    !e.loc.includes("/is-it-legal/") &&
    !e.loc.includes("/side-hustles/") &&
    !e.loc.includes("/by-budget/") &&
    !e.loc.includes("/niches/") &&
    !e.loc.includes("/quit-your-job/") &&
    !e.loc.includes("/weekend-builds/") &&
    !e.loc.includes("/failure-stories/") &&
    !e.loc.includes("/reviews/") &&
    !e.loc.includes("/case-studies/") &&
    !e.loc.includes("/revenue/") &&
    !e.loc.includes("/cities/") &&
    !e.loc.includes("/skills/") &&
    !e.loc.includes("/audience/") &&
    !e.loc.includes("/banking/") &&
    !e.loc.includes("/tax-guides/") &&
    !e.loc.includes("/nda-guides/") &&
    !e.loc.includes("/insurance/") &&
    !e.loc.includes("/time-frameworks/")
  ),
  "blog": entries.filter(e => e.loc.includes("/blog/")),
  "guides": entries.filter(e => e.loc.includes("/guides/")),
  "ideas": entries.filter(e => e.loc.includes("/ideas/")),
  "tools": entries.filter(e => e.loc.includes("/best/") || e.loc.includes("/tools/") || e.loc.includes("/stack/") || e.loc.includes("/reviews/")),
  "glossary": entries.filter(e => e.loc.includes("/glossary/")),
  "compare": entries.filter(e => e.loc.includes("/compare/") || e.loc.includes("/alternatives/") || e.loc.includes("/vs/")),
  "data": entries.filter(e => e.loc.includes("/calculators/") || e.loc.includes("/data/") || e.loc.includes("/salaries/") || e.loc.includes("/milestones/") || e.loc.includes("/timeline/") || e.loc.includes("/cost-of-waiting/") || e.loc.includes("/cost-analysis/") || e.loc.includes("/is-it-legal/") || e.loc.includes("/by-budget/") || e.loc.includes("/niches/")),
  "professions": entries.filter(e => e.loc.includes("/mistakes/") || e.loc.includes("/reddit/") || e.loc.includes("/pricing-models/") || e.loc.includes("/break-even/") || e.loc.includes("/first-year/") || e.loc.includes("/non-compete/") || e.loc.includes("/how-to/") || e.loc.includes("/side-hustles/") || e.loc.includes("/quit-your-job/")),
  "ideas-builds": entries.filter(e => e.loc.includes("/weekend-builds/") || e.loc.includes("/failure-stories/") || e.loc.includes("/niches/") || e.loc.includes("/case-studies/") || e.loc.includes("/revenue/") || e.loc.includes("/cities/") || e.loc.includes("/skills/") || e.loc.includes("/audience/")),
  "banking": entries.filter(e => e.loc.includes("/banking/")),
  "tax-guides": entries.filter(e => e.loc.includes("/tax-guides/")),
  "nda-guides": entries.filter(e => e.loc.includes("/nda-guides/")),
  "insurance": entries.filter(e => e.loc.includes("/insurance/")),
  "time-frameworks": entries.filter(e => e.loc.includes("/time-frameworks/")),
};

// Write each sub-sitemap (with hreflang + image annotations)
// Top languages for hreflang annotations (full list in src/i18n/languages.ts)
const HREFLANG_LANGS = [
  "es", "zh", "hi", "ar", "fr", "pt", "ja", "de", "ru", "ko",
  "it", "tr", "nl", "pl", "uk", "id", "vi", "th", "fa", "he",
  "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "or", "ms",
  "sw", "am", "ha", "yo", "ig", "zu", "xh", "af", "my", "km",
  "lo", "ne", "si", "ps", "kk", "uz", "az", "ka", "hy", "mn",
  "ceb", "ilo", "jv", "su", "mad", "hmn", "ku", "bal", "tg",
  "tk", "sr", "hr", "bs", "sk", "sl", "lt", "lv", "et", "be",
  "bg", "mk", "ca", "eu", "gl", "cy", "ga", "is", "gd", "br",
  "lb", "mt", "fil", "bo", "ug", "nan", "wuu", "hak", "pcm",
];

const submapFiles: string[] = [];
for (const [name, subs] of Object.entries(submaps)) {
  if (subs.length === 0) continue;
  const subXml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
    subs.map(e => {
      let url = '  <url>\n    <loc>' + e.loc + '</loc>\n    <lastmod>' + e.lastmod + '</lastmod>\n    <changefreq>' + e.changefreq + '</changefreq>\n    <priority>' + e.priority + '</priority>\n';
      // hreflang annotations — English + all supported languages
      const path = e.loc.replace('https://invisibleexit.com', '');
      url += '    <xhtml:link rel="alternate" hreflang="en" href="' + e.loc + '" />\n';
      url += '    <xhtml:link rel="alternate" hreflang="x-default" href="' + e.loc + '" />\n';
      for (const lang of HREFLANG_LANGS) {
        url += '    <xhtml:link rel="alternate" hreflang="' + lang + '" href="https://invisibleexit.com/' + lang + path + '" />\n';
      }
      // Image annotation for blog posts
      if (e.loc.includes('/blog/') && !e.loc.includes('/category/')) {
        const slug = e.loc.split('/blog/')[1];
        url += '    <image:image>\n      <image:loc>https://invisibleexit.com/og/' + slug + '.svg</image:loc>\n      <image:title>' + (blogPosts.find((p: any) => p.slug === slug)?.title || slug) + '</image:title>\n    </image:image>\n';
      }
      // Image annotation for pSEO pages with OG images
      if (!e.loc.includes('/blog/') && !e.loc.includes('/category/') && !e.loc.endsWith('invisibleexit.com/')) {
        const pseoSlug = e.loc.replace('https://invisibleexit.com/', '').replace(/\//g, '-');
        if (pseoSlug && pseoSlug.length > 0) {
          url += '    <image:image>\n      <image:loc>https://invisibleexit.com/og/' + pseoSlug + '.svg</image:loc>\n    </image:image>\n';
        }
      }
      url += '  </url>';
      return url;
    }).join('\n') +
    '\n</urlset>\n';
  const fileName = 'sitemap-' + name + '.xml';
  writeFileSync(resolve(publicDir, fileName), subXml, "utf-8");
  submapFiles.push(fileName);
  console.log('  ' + fileName + ': ' + subs.length + ' URLs');
}

// Write sitemap index
const indexXml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  submapFiles.map(f => '  <sitemap>\n    <loc>https://invisibleexit.com/' + f + '</loc>\n    <lastmod>' + today + '</lastmod>\n  </sitemap>').join('\n') +
  '\n</sitemapindex>\n';
writeFileSync(resolve(publicDir, "sitemap.xml"), indexXml, "utf-8");

// Note: sitemap-full.xml is no longer generated.
// The split sub-sitemap approach (sitemap-{type}.xml) is the canonical structure.
// Keeping a 1,463-URL monolithic sitemap wastes disk and creates crawl-budget confusion.

console.log(`\nSitemap index written (${entries.length} total URLs across ${submapFiles.length} sub-sitemaps)`);
console.log(`  Blog posts: ${blogPosts.length}`);
console.log(`  Categories: ${categorySlugs.length}`);
console.log(`  Comparisons: ${comparisons.length}`);
console.log(`  Glossary terms: ${glossaryTerms.length}`);
console.log(`  State guides: ${stateGuides.length}`);
console.log(`  Industry ideas: ${industryIdeas.length}`);
console.log(`  Best tools lists: ${bestToolsLists.length}`);
console.log(`  Calculators: ${calculators.length}`);
console.log(`  Data reports: ${dataReports.length}`);
console.log(`  Resources: ${resources.length}`);
console.log(`  Cost analysis: ${costAnalysisPages.length}`);
console.log(`  How-to guides: ${howToGuides.length}`);
console.log(`  Is-it-legal: ${isItLegalPages.length}`);
console.log(`  Side hustles: ${sideHustles.length}`);
console.log(`  Budget start: ${budgetStartPages.length}`);
console.log(`  Niches: ${niches.length}`);
console.log(`  Tool reviews: ${toolReviews.length}`);
console.log(`  Case studies: ${caseStudies.length}`);
console.log(`  Exit strategies: ${exitStrategyPages.length}`);
}

main().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});
