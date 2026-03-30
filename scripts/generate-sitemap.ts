/**
 * Generates public/sitemap.xml from blog-posts data.
 * Run: npx tsx scripts/generate-sitemap.ts
 */
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Re-declare minimal blog post type to avoid importing from src (path alias issues)
interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

// Dynamically import blog posts using tsx which resolves path aliases
async function main() {
  // Import blog data – tsx handles the @/ alias via tsconfig
  const { blogPosts } = await import("../src/data/blog-posts.js");

  const today = new Date().toISOString().split("T")[0];
  const latestPostDate = blogPosts
    .map((p: { publishedAt: string }) => p.publishedAt)
    .sort()
    .pop();

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
    ...blogPosts.map((post: { slug: string; publishedAt: string }) => ({
      loc: `https://invisibleexit.com/blog/${post.slug}`,
      lastmod: post.publishedAt,
      changefreq: "weekly",
      priority: "0.8",
    })),
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
}

main().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});
