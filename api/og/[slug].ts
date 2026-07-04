import { blogPosts } from "../../src/data/blog-posts.ts";

interface RequestContext {
  params: { slug?: string };
}

// 1200x630 OG image dimensions
const W = 1200;
const H = 630;

// Brand colors
const BG_DARK = "#1B2A4A";
const BLUE = "#60A5FA";
const WHITE = "#FFFFFF";
const GRAY = "#94A3B8";

// Word-wrap helper for the title
function wrapText(ctx: any, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? current + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 4); // max 4 lines
}

export async function GET(req: RequestContext) {
  const slug = req.params.slug;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const canvas = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BG_DARK}"/>
      <stop offset="100%" style="stop-color:#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Decorative accent bar -->
  <rect x="0" y="0" width="6" height="${H}" fill="${BLUE}"/>

  <!-- Category badge -->
  <rect x="80" y="80" width="${post.category.length * 9 + 24}" height="36" rx="18" fill="rgba(96,165,250,0.15)"/>
  <text x="92" y="104" font-family="Arial, sans-serif" font-size="15" font-weight="600" fill="${BLUE}" letter-spacing="0.05em">${post.category.toUpperCase()}</text>

  <!-- Title (multi-line) -->
  ${wrapTitle(post.title, 1040)}

  <!-- Brand line -->
  <text x="80" y="${H - 60}" font-family="Arial, sans-serif" font-size="22" font-weight="600" fill="${GRAY}">Invisible Exit</text>
  <text x="${W - 200}" y="${H - 60}" font-family="Arial, sans-serif" font-size="22" fill="${GRAY}">${post.readTime}</text>

  <!-- Blue accent dot -->
  <circle cx="${W - 80}" cy="${H - 54}" r="5" fill="${BLUE}"/>
</svg>`.trim();

  return new Response(canvas, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Approximate SVG text wrapping (SVG doesn't have measureText)
function wrapTitle(title: string, maxWidth: number): string {
  const escaped = escapeXml(title);
  const words = escaped.split(" ");
  const lines: string[] = [];
  let current = "";

  // Approximate: ~0.55 * fontSize per char for bold at 44px
  const charWidth = 24;

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

  const startY = 190;
  const lineHeight = 56;
  const maxLines = 4;

  return lines
    .slice(0, maxLines)
    .map((line, i) => {
      const y = startY + i * lineHeight;
      return `<text x="80" y="${y}" font-family="Arial, sans-serif" font-size="44" font-weight="700" fill="${WHITE}">${line}</text>`;
    })
    .join("\n  ");
}

export const config = {
  runtime: "edge",
};
