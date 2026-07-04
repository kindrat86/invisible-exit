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
}

main().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});
