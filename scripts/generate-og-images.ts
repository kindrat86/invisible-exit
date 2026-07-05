/**
 * Pre-generates per-post OG images as static SVG files at build time.
 * Output: public/og/{slug}.svg for every blog post.
 *
 * Run: npx tsx scripts/generate-og-images.ts
 * (also runs automatically as part of the build)
 */
import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { blogPosts } from "../src/data/blog-posts.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", "public", "og");

const W = 1200;
const H = 630;
const BG_DARK = "#1B2A4A";
const BLUE = "#60A5FA";
const WHITE = "#FFFFFF";
const GRAY = "#94A3B8";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapTitle(title: string, maxWidth: number): string {
  const escaped = escapeXml(title);
  const words = escaped.split(" ");
  const lines: string[] = [];
  let current = "";
  const charWidth = 24; // approx for 44px bold

  for (const word of words) {
    const test = current ? current + " " + word : word;
    if (test.length * charWidth > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  const startY = 200;
  const lineHeight = 56;
  const maxLines = 5;

  return lines
    .slice(0, maxLines)
    .map((line, i) => {
      const y = startY + i * lineHeight;
      return `<text x="80" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700" fill="${WHITE}">${line}</text>`;
    })
    .join("\n  ");
}

function generateSvg(post: (typeof blogPosts)[number]): string {
  const categoryUpper = escapeXml(post.category.toUpperCase());
  const badgeWidth = Math.min(categoryUpper.length * 9 + 24, 400);

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BG_DARK}"/>
      <stop offset="100%" style="stop-color:#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="6" height="${H}" fill="${BLUE}"/>
  <rect x="80" y="80" width="${badgeWidth}" height="36" rx="18" fill="rgba(96,165,250,0.15)"/>
  <text x="92" y="104" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="600" fill="${BLUE}" letter-spacing="0.05em">${categoryUpper}</text>
  ${wrapTitle(post.title, 1040)}
  <text x="80" y="${H - 50}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="${GRAY}">Invisible Exit</text>
  <text x="${W - 200}" y="${H - 50}" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="${GRAY}">${escapeXml(post.readTime)}</text>
  <circle cx="${W - 80}" cy="${H - 44}" r="5" fill="${BLUE}"/>
</svg>`;
}

mkdirSync(OUT, { recursive: true });

let count = 0;
for (const post of blogPosts) {
  const svg = generateSvg(post);
  writeFileSync(resolve(OUT, `${post.slug}.svg`), svg, "utf-8");
  count++;
}

// Generate OG images for pSEO pages (revenue targets, cities, skills, case studies, reviews, etc.)
function generatePseoSvg(title: string, category: string): string {
  const categoryUpper = escapeXml(category.toUpperCase());
  const badgeWidth = Math.min(categoryUpper.length * 9 + 24, 400);

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BG_DARK}"/>
      <stop offset="100%" style="stop-color:#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="6" height="${H}" fill="${BLUE}"/>
  <rect x="80" y="80" width="${badgeWidth}" height="36" rx="18" fill="rgba(96,165,250,0.15)"/>
  <text x="92" y="104" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="600" fill="${BLUE}" letter-spacing="0.05em">${categoryUpper}</text>
  ${wrapTitle(title, 1040)}
  <text x="80" y="${H - 50}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="${GRAY}">Invisible Exit</text>
  <circle cx="${W - 80}" cy="${H - 44}" r="5" fill="${BLUE}"/>
</svg>`;
}

// Dynamic import pSEO data
const { revenueTargets } = await import("../src/data/revenue-targets.js");
const { cities } = await import("../src/data/cities.js");
const { skills } = await import("../src/data/skills.js");
const { caseStudies } = await import("../src/data/case-studies.js");
const { toolReviews } = await import("../src/data/tool-reviews.js");
const { sideHustles } = await import("../src/data/side-hustles.js");
const { niches } = await import("../src/data/niches.js");
const { quitJobPages } = await import("../src/data/quit-job.js");
const { weekendBuilds } = await import("../src/data/weekend-builds.js");
const { failureStories } = await import("../src/data/failure-stories.js");
const { professionStatePages } = await import("../src/data/profession-states.js");
const { salaries } = await import("../src/data/salaries.js");
const { professionMistakes } = await import("../src/data/profession-mistakes.js");

for (const r of revenueTargets) {
  writeFileSync(resolve(OUT, `revenue-${r.slug}.svg`), generatePseoSvg(r.h1, "Revenue Target"), "utf-8");
  count++;
}
for (const c of cities) {
  writeFileSync(resolve(OUT, `cities-${c.slug}.svg`), generatePseoSvg(c.h1, c.city), "utf-8");
  count++;
}
for (const s of skills) {
  writeFileSync(resolve(OUT, `skills-${s.slug}.svg`), generatePseoSvg(s.h1, s.category), "utf-8");
  count++;
}
for (const c of caseStudies) {
  writeFileSync(resolve(OUT, `case-studies-${c.slug}.svg`), generatePseoSvg(c.h1, "Case Study"), "utf-8");
  count++;
}
for (const t of toolReviews) {
  writeFileSync(resolve(OUT, `reviews-${t.slug}.svg`), generatePseoSvg(t.h1 || t.name, "Tool Review"), "utf-8");
  count++;
}
for (const s of sideHustles) {
  writeFileSync(resolve(OUT, `side-hustles-${s.slug}.svg`), generatePseoSvg(s.h1, "Side Hustles"), "utf-8");
  count++;
}
for (const n of niches) {
  writeFileSync(resolve(OUT, `niches-${n.slug}.svg`), generatePseoSvg(n.h1, "Micro-SaaS Niche"), "utf-8");
  count++;
}
for (const q of quitJobPages) {
  writeFileSync(resolve(OUT, `quit-your-job-${q.slug}.svg`), generatePseoSvg(q.h1, "Quit Your Job"), "utf-8");
  count++;
}
for (const w of weekendBuilds) {
  writeFileSync(resolve(OUT, `weekend-builds-${w.slug}.svg`), generatePseoSvg(w.h1, "Weekend Build"), "utf-8");
  count++;
}
for (const f of failureStories) {
  writeFileSync(resolve(OUT, `mistakes-${f.slug}.svg`), generatePseoSvg(f.h1, "Failure Story"), "utf-8");
  count++;
}
for (const p of professionStatePages) {
  writeFileSync(resolve(OUT, `ideas-${p.professionSlug}-in-${p.stateSlug}.svg`), generatePseoSvg(p.h1, "Micro-SaaS Ideas"), "utf-8");
  count++;
}
for (const s of salaries) {
  writeFileSync(resolve(OUT, `salaries-${s.slug}.svg`), generatePseoSvg(s.h1, "Salary Guide"), "utf-8");
  count++;
}
for (const m of professionMistakes) {
  writeFileSync(resolve(OUT, `mistakes-${m.slug}.svg`), generatePseoSvg(m.h1, "Common Mistakes"), "utf-8");
  count++;
}

console.log(`✓ Generated ${count} OG images in public/og/`);
