/**
 * Generates RSS XML feed at build time.
 * Output: public/blog/rss.xml
 * Run: npx tsx scripts/generate-rss.ts (part of build)
 */
import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { blogPosts } from "../src/data/blog-posts.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, "..", "public");
const SITE = "https://invisibleexit.com";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateRss(): string {
  const items = blogPosts
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 20)
    .map((post) => {
      const date = new Date(post.publishedAt).toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(post.category)}</category>
      <pubDate>${date}</pubDate>
    </item>`;
    })
    .join("\n");

  const lastBuild = new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Invisible Exit Blog</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Strategies, frameworks, and case studies for corporate managers building invisible recurring revenue and anonymous micro-SaaS businesses.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>`;
}

mkdirSync(resolve(PUBLIC, "blog"), { recursive: true });
writeFileSync(resolve(PUBLIC, "blog", "rss.xml"), generateRss(), "utf-8");
console.log(`✓ Generated /blog/rss.xml (${Math.min(blogPosts.length, 20)} items)`);
