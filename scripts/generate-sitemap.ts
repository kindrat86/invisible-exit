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
    // Legal pages
    {
      loc: "https://invisibleexit.com/privacy",
      lastmod: "2026-03-21",
      changefreq: "monthly",
      priority: "0.3",
    },
    {
      loc: "https://invisibleexit.com/terms",
      lastmod: "2026-03-21",
      changefreq: "monthly",
      priority: "0.3",
    },
    {
      loc: "https://invisibleexit.com/about",
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
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
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const outPath = resolve(__dirname, "../public/sitemap.xml");
  writeFileSync(outPath, xml, "utf-8");
  console.log(`Sitemap written to ${outPath} (${entries.length} entries)`);
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
}

main().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});
