#!/usr/bin/env node
/**
 * RSS → Social Auto-Poster
 * ========================
 * TRAFFIC SECRETS Sec 3: Fill Your Funnel — Content Distribution Engine
 *
 * Reads the blog RSS feed (invisibleexit.com/blog/rss.xml) and outputs
 * ready-to-post social media content for each recent post.
 *
 * When social media API keys are configured (see .env.example), this can
 * auto-post directly. Until then, it generates a posting queue that can be
 * manually pasted or fed into Buffer/Hypefury/Make.
 *
 * Usage:
 *   node scripts/auto-post.mjs          → generate today's post
 *   node scripts/auto-post.mjs --dry    → list RSS posts without generating
 *   node scripts/auto-post.mjs --all    → generate for all posts (first run)
 *
 * Output: dist/social-queue/
 *   ├── twitter/   — ready-to-paste tweets
 *   ├── linkedin/  — ready-to-paste LinkedIn posts
 *   └── queue.json — posting schedule
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "dist", "social-queue");
const RSS_URL = "https://invisibleexit.com/blog/rss.xml";
const STATE_FILE = join(OUT, "posted.json");

/** Per-post social templates */
function generateTweet(title, url, category) {
  const hooks = {
    "financial-independence": `The math that showed me my 0.5% equity won't buy freedom:`,
    "micro-saas": `I built this without quitting my job, without my employer knowing:`,
    "stealth-operations": `Week 3. Colleague found my site on a team call. What happened next:`,
    "exit-planning": `\"$4,000/month MRR = optionality.\" Here's the timeline:`,
    "ai-tools": `AI replaced my 5-person startup team. Here's what actually works:`,
    "time-management": `5 hours/week. That's all it took. Here's the system:`,
    growth: `From $0 to $4,100 MRR in 12 months. The honest timeline:`,
    validation: `Stop guessing. Start validating. The 48-hour framework:`,
    "audience-building": `I deleted my personal Twitter (2K followers) and went faceless. Why:`,
    strategy: `The system matters more than the idea. Here's why:`,
  };

  const hook = hooks[category] || "Just posted on Invisible Exit:";
  const cta = "Calculate your freedom number → invisibleexit.com/freedom";

  return `${hook}\n\n"${title}"\n\n${url}\n\n${cta}`;
}

function generateLinkedIn(title, url, category) {
  const categoryIntros = {
    "financial-independence":
      "I ran the numbers on my equity package. Here's what I found.",
    "micro-saas":
      "I built a profitable micro-SaaS while working a full-time job. No code. No boss finding out.",
    "stealth-operations":
      "The 3 seconds of panic that taught me stealth ops matter.",
    "exit-planning":
      "Your freedom number isn't $1M. It's probably $4K/month MRR.",
    "ai-tools":
      "AI didn't replace my thinking. It replaced the busywork that was eating my weekends.",
    "time-management":
      "The 5-hour weekly system that outperforms 60-hour founders.",
    growth: "12 months. $0 to $4,100 MRR. The unedited timeline.",
    validation:
      "3 months picking the wrong idea vs. 48 hours validating the right one.",
    "audience-building":
      "Why I deleted my personal brand and built a faceless one instead.",
    strategy:
      "Your 15 years of corporate experience isn't a weakness. It's founder gold.",
  };

  const intro = categoryIntros[category] || "New post on Invisible Exit.";

  return `${intro}

Just published: "${title}"
${url}

📊 I write weekly about building invisible recurring revenue while employed. No hype. Just the system that took me from golden handcuffs to $4,100/month in 14 months.

→ Calculate your freedom number: invisibleexit.com/freedom`;
}

/** Load state to avoid reposting */
function loadState() {
  try {
    return JSON.parse(readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return { posted: [] };
  }
}

function saveState(state) {
  mkdirSync(dirname(STATE_FILE), { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

/** Main */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry");
  const postAll = args.includes("--all");

  console.log("📡 Fetching RSS feed...");

  let rssText;
  try {
    const res = await fetch(RSS_URL);
    rssText = await res.text();
  } catch (err) {
    console.error("❌ Failed to fetch RSS:", err.message);
    console.log("Make sure the site is deployed and /blog/rss.xml is accessible.");
    process.exit(1);
  }

  // Parse items with simple regex (no XML parser needed for RSS)
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/;
  const linkRegex = /<link>(.*?)<\/link>/;
  const categoryRegex = /<category>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/category>/;
  const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;

  const state = loadState();
  const items = [];
  let match;

  while ((match = itemRegex.exec(rssText)) !== null) {
    const itemXml = match[1];
    const titleM = titleRegex.exec(itemXml);
    const linkM = linkRegex.exec(itemXml);
    const catM = categoryRegex.exec(itemXml);
    const dateM = pubDateRegex.exec(itemXml);

    if (!titleM || !linkM) continue;

    const slug = linkM[1].split("/").pop();
    if (state.posted.includes(slug) && !postAll) continue;

    items.push({
      title: titleM[1],
      url: linkM[1],
      category: catM?.[1]?.toLowerCase().replace(/\s+/g, "-") || "strategy",
      pubDate: dateM?.[1] || "",
      slug,
    });
  }

  if (items.length === 0) {
    console.log("✅ No new posts to distribute. Everything's been posted.");
    return;
  }

  console.log(`📝 Found ${items.length} unposted item(s)`);

  if (dryRun) {
    console.log("\n── RSS Posts (dry run) ──");
    for (const item of items.slice(0, 10)) {
      console.log(`  • ${item.title} [${item.category}] ${item.pubDate}`);
    }
    return;
  }

  // Limit to 1 post for regular runs, all for --all
  const toPost = postAll ? items : items.slice(0, 1);

  for (const item of toPost) {
    const day = new Date().toISOString().split("T")[0];
    const tweet = generateTweet(item.title, item.url, item.category);
    const linkedin = generateLinkedIn(item.title, item.url, item.category);

    // Write output files
    const twDir = join(OUT, "twitter");
    const liDir = join(OUT, "linkedin");
    mkdirSync(twDir, { recursive: true });
    mkdirSync(liDir, { recursive: true });

    const filename = `${day}-${item.slug}`;
    writeFileSync(join(twDir, `${filename}.txt`), tweet);
    writeFileSync(join(liDir, `${filename}.txt`), linkedin);

    console.log(`\n🐦 TWITTER (${join(twDir, filename + ".txt")}):`);
    console.log("──");
    console.log(tweet);
    console.log("\n💼 LINKEDIN:");
    console.log("──");
    console.log(linkedin);

    // Mark as posted
    state.posted.push(item.slug);
  }

  // Cleanup: keep only last 200 in posted list
  if (state.posted.length > 200) {
    state.posted = state.posted.slice(-200);
  }

  saveState(state);

  console.log(`\n✅ ${toPost.length} post(s) generated.`);
  console.log(`📂 Output: ${OUT}/twitter/ and ${OUT}/linkedin/`);
  console.log();
  console.log("📋 Next steps:");
  console.log("   1. Review the generated content");
  console.log("   2. Post manually or set up Buffer/Hypefury automation");
  console.log("   3. To auto-post, configure X_API_KEY and LINKEDIN_TOKEN in .env");
  console.log("   4. Schedule this script via cronjob or Vercel Cron");
}

main().catch(console.error);
