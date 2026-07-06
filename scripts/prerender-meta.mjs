/**
 * Post-build script: injects route-specific meta tags into pre-rendered HTML files.
 *
 * Reads dist/index.html (the SPA shell produced by Vite), then for every public
 * route that needs SEO (homepage, /blog, each blog post, /privacy, /terms) it
 * rewrites the <head> meta tags and writes the result to the matching file path
 * so Vercel can serve it as a static file before falling back to the SPA rewrite.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { blogPosts } from "../src/data/blog-posts.ts";
import { comparisons } from "../src/data/comparisons.ts";
import { glossaryTerms } from "../src/data/glossary.ts";
import { stateGuides } from "../src/data/state-guides.ts";
import { industryIdeas } from "../src/data/industry-ideas.ts";
import { bestToolsLists } from "../src/data/best-tools.ts";
import { calculators } from "../src/data/calculators.ts";
import { dataReports } from "../src/data/data-reports.ts";
import { resources } from "../src/data/resources.ts";
import { alternatives } from "../src/data/alternatives.ts";
import { salaries } from "../src/data/salaries.ts";
import { revenueMilestones } from "../src/data/revenue-milestones.ts";
import { timelines } from "../src/data/timelines.ts";
import { professionStacks } from "../src/data/profession-stacks.ts";
import { costOfWaitingPages } from "../src/data/cost-of-waiting.ts";
import { professionStatePages } from "../src/data/profession-states.ts";
import { nonCompeteMatrix } from "../src/data/non-compete-matrix.ts";
import { professionMistakes } from "../src/data/profession-mistakes.ts";
import { redditStrategies } from "../src/data/reddit-strategies.ts";
import { pricingModels } from "../src/data/pricing-models.ts";
import { breakEvenPages } from "../src/data/break-even.ts";
import { professionVsCareer } from "../src/data/profession-vs-career.ts";
import { firstYearEntries } from "../src/data/first-year.ts";
import { toolCrossReference } from "../src/data/tool-cross-reference.ts";
import { aiToolProfessionPages } from "../src/data/ai-tool-professions.ts";
import { budgetPages } from "../src/data/budget-pages.ts";
import { hoursPages } from "../src/data/hours-pages.ts";
import { toolAlternatives } from "../src/data/tool-alternatives.ts";
import { saasBlueprints } from "../src/data/saas-blueprints.ts";
import { revenueRoadmaps } from "../src/data/revenue-roadmaps.ts";
import { costAnalysisPages } from "../src/data/cost-analysis.ts";
import { howToGuides } from "../src/data/how-to-guides.ts";
import { isItLegalPages } from "../src/data/is-it-legal.ts";
import { bankingGuides } from "../src/data/banking.ts";
import { sideHustles } from "../src/data/side-hustles.ts";
import { budgetStartPages } from "../src/data/budget-start.ts";
import { niches } from "../src/data/niches.ts";
import { quitJobPages } from "../src/data/quit-job.ts";
import { weekendBuilds } from "../src/data/weekend-builds.ts";
import { failureStories } from "../src/data/failure-stories.ts";
import { toolReviews } from "../src/data/tool-reviews.ts";
import { caseStudies } from "../src/data/case-studies.ts";
import { revenueTargets } from "../src/data/revenue-targets.ts";
import { cities } from "../src/data/cities.ts";
import { skills } from "../src/data/skills.ts";
import { audienceIdeas } from "../src/data/audience-ideas.ts";
import { cityProfessionPages } from "../src/data/city-profession.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const SITE = "https://invisibleexit.com";
const SITE_NAME = "Invisible Exit";
const DEFAULT_IMAGE = `${SITE}/og-image.png`;

// 101-language hreflang set (BCP47 tags for SEO internationalization)
const LANGUAGES = [
  {code:"en", hl:"en"},
  {code:"zh", hl:"zh-CN"},
  {code:"hi", hl:"hi"},
  {code:"es", hl:"es"},
  {code:"fr", hl:"fr"},
  {code:"ar", hl:"ar"},
  {code:"bn", hl:"bn"},
  {code:"pt", hl:"pt"},
  {code:"ru", hl:"ru"},
  {code:"ur", hl:"ur"},
  {code:"id", hl:"id"},
  {code:"de", hl:"de"},
  {code:"ja", hl:"ja"},
  {code:"pcm", hl:"pcm"},
  {code:"mr", hl:"mr"},
  {code:"te", hl:"te"},
  {code:"tr", hl:"tr"},
  {code:"ta", hl:"ta"},
  {code:"vi", hl:"vi"},
  {code:"yue", hl:"yue"},
  {code:"pa", hl:"pa"},
  {code:"ko", hl:"ko"},
  {code:"fa", hl:"fa"},
  {code:"it", hl:"it"},
  {code:"th", hl:"th"},
  {code:"gu", hl:"gu"},
  {code:"kn", hl:"kn"},
  {code:"ml", hl:"ml"},
  {code:"or", hl:"or"},
  {code:"pl", hl:"pl"},
  {code:"uk", hl:"uk"},
  {code:"nl", hl:"nl"},
  {code:"ro", hl:"ro"},
  {code:"el", hl:"el"},
  {code:"cs", hl:"cs"},
  {code:"hu", hl:"hu"},
  {code:"sv", hl:"sv"},
  {code:"fi", hl:"fi"},
  {code:"no", hl:"no"},
  {code:"da", hl:"da"},
  {code:"he", hl:"he"},
  {code:"sw", hl:"sw"},
  {code:"am", hl:"am"},
  {code:"so", hl:"so"},
  {code:"ha", hl:"ha"},
  {code:"yo", hl:"yo"},
  {code:"ig", hl:"ig"},
  {code:"zu", hl:"zu"},
  {code:"xh", hl:"xh"},
  {code:"af", hl:"af"},
  {code:"ms", hl:"ms"},
  {code:"my", hl:"my"},
  {code:"km", hl:"km"},
  {code:"lo", hl:"lo"},
  {code:"ne", hl:"ne"},
  {code:"si", hl:"si"},
  {code:"ps", hl:"ps"},
  {code:"kk", hl:"kk"},
  {code:"uz", hl:"uz"},
  {code:"az", hl:"az"},
  {code:"ka", hl:"ka"},
  {code:"hy", hl:"hy"},
  {code:"mn", hl:"mn"},
  {code:"bo", hl:"bo"},
  {code:"ug", hl:"ug"},
  {code:"tl", hl:"tl"},
  {code:"ceb", hl:"ceb"},
  {code:"ilo", hl:"ilo"},
  {code:"jv", hl:"jv"},
  {code:"su", hl:"su"},
  {code:"mad", hl:"mad"},
  {code:"nan", hl:"nan"},
  {code:"wuu", hl:"wuu"},
  {code:"hak", hl:"hak"},
  {code:"hmn", hl:"hmn"},
  {code:"ku", hl:"ku"},
  {code:"bal", hl:"bal"},
  {code:"tg", hl:"tg"},
  {code:"tk", hl:"tk"},
  {code:"sq", hl:"sq"},
  {code:"sr", hl:"sr"},
  {code:"hr", hl:"hr"},
  {code:"bs", hl:"bs"},
  {code:"sk", hl:"sk"},
  {code:"sl", hl:"sl"},
  {code:"lt", hl:"lt"},
  {code:"lv", hl:"lv"},
  {code:"et", hl:"et"},
  {code:"be", hl:"be"},
  {code:"bg", hl:"bg"},
  {code:"mk", hl:"mk"},
  {code:"ca", hl:"ca"},
  {code:"eu", hl:"eu"},
  {code:"gl", hl:"gl"},
  {code:"cy", hl:"cy"},
  {code:"ga", hl:"ga"},
  {code:"gd", hl:"gd"},
  {code:"br", hl:"br"},
  {code:"is", hl:"is"},
  {code:"lb", hl:"lb"},
  {code:"mt", hl:"mt"},
];

// Rich author entity for E-E-A-T (Experience, Expertise, Authoritativeness, Trust)
const ADRIAN_PERSON = {
  "@type": "Person",
  name: "Adrian",
  url: `${SITE}/adrian`,
  jobTitle: "Founder, Invisible Exit",
  description: "Former corporate director who built a profitable micro-SaaS portfolio while fully employed. 8+ years in enterprise product management, MBA. Writes about anonymous side-business building, financial independence, and legal compliance for employed founders.",
  knowsAbout: ["Micro-SaaS", "Financial Independence", "Anonymous Business Formation", "Non-Compete Law", "AI Tools for Business", "Employment Contract Compliance", "Bootstrapped Startups", "Recurring Revenue", "Solo Entrepreneurship"],
  alumniOf: { "@type": "EducationalOrganization", name: "MBA, Business Administration" },
  sameAs: [
    "https://invisibleexit.com/adrian",
    "https://invisibleexit.com/about",
    "https://invisibleexit.com/blog",
  ],
};

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Shorten title for Google SERP (max 60 chars).
 * Uses the post title as-is if it fits; otherwise truncates at word boundary.
 */
function blogTitle(title) {
  if (title.length <= 60) return title;
  // Try to find a natural break point near 57 chars
  const cut = title.lastIndexOf(" ", 57);
  return title.substring(0, cut > 30 ? cut : 57).trim() + "...";
}

/**
 * Truncate meta description to maxLen chars at word boundary.
 */
function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  const cut = text.lastIndexOf(" ", maxLen - 1);
  return text.substring(0, cut > 40 ? cut : maxLen - 3).trim() + "...";
}

function jsonLdScript(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

function injectMeta(template, { title, description, url, type, image, jsonLd, noindex }, routePath = "") {
  // Enforce 60-char title limit across ALL pages (not just blog)
  const optimizedTitle = blogTitle(title);
  const escapedTitle = escapeHtml(optimizedTitle);
  const escapedDesc = escapeHtml(truncate(description, 155));
  const img = image || DEFAULT_IMAGE;
  const robotsContent = noindex ? "noindex, follow" : "index, follow";

  // Auto-append SpeakableSpecification schema for all article-type pages (AEO / Voice Search)
  // This tells Google/Apple which parts of the page to read aloud
  const hasSpeakable = (jsonLd || []).some(s =>
    s["@type"] === "SpeakableSpecification" ||
    (Array.isArray(s["@context"]) ? false : false)
  );
  const finalJsonLd = (jsonLd || []).slice();
  if (!hasSpeakable && (type === "article" || type === "review")) {
    finalJsonLd.push({
      "@context": "https://schema.org",
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "section:nth-of-type(2) p", "section:nth-of-type(3) h2"],
      xpath: ["/html/head/title", "/html/body/div/section[1]/div/h1"]
    });
  }
  const jsonLdHtmlFinal = finalJsonLd.map(jsonLdScript).join("\n    ");

  const hreflangLinks = LANGUAGES.map((lang) => {
    if (lang.code === "en") {
      return `    <link rel="alternate" hreflang="en" href="${url}" />`;
    }
    const langUrl = `${SITE}/${lang.code}/${routePath.replace(/^\//, "")}`;
    return `    <link rel="alternate" hreflang="${lang.hl}" href="${langUrl}" />`;
  }).join("\n");

  const metaBlock = `<!-- SEO (pre-rendered) -->
    <title>${optimizedTitle}</title>
    <meta name="description" content="${escapedDesc}" />
    <meta name="author" content="${SITE_NAME}" />
    <meta name="robots" content="${robotsContent}" />
    <link rel="canonical" href="${url}" />
${hreflangLinks}
    <link rel="alternate" hreflang="x-default" href="${url}" />
    <link rel="alternate" type="application/rss+xml" title="${SITE_NAME} Blog" href="${SITE}/blog/rss.xml" />
    <link rel="sitemap" type="application/xml" title="Sitemap" href="${SITE}/sitemap.xml" />

    <!-- Open Graph -->
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${escapedTitle}" />
    <meta property="og:description" content="${escapedDesc}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${img}" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapedTitle}" />
    <meta name="twitter:description" content="${escapedDesc}" />
    <meta name="twitter:image" content="${img}" />

    ${jsonLdHtmlFinal}`;

  // Remove vendor-charts + vendor-capture modulepreload from all pages except dashboard
  // (recharts is 407K, html2canvas is 198K — neither needed on content/blog pages)
  let finalTemplate = template;
  if (!routePath.includes("/dashboard")) {
    finalTemplate = finalTemplate.replace(
      /<link rel="modulepreload"[^>]*vendor-charts[^>]*>\n?/g,
      ""
    );
    finalTemplate = finalTemplate.replace(
      /<link rel="modulepreload"[^>]*vendor-capture[^>]*>\n?/g,
      ""
    );
  }

  // Remove vendor-radix, vendor-data, vendor-icons modulepreloads from content pages
  // These are interactive UI components not needed on static pSEO/blog content pages.
  // The main index JS will still load them lazily when the SPA hydrates.
  // This saves ~200KB of preload bandwidth on 1,400+ content pages.
  // Only keep vendor-react preload (needed for hydration).
  const isContentPage = !routePath.includes("/dashboard") &&
    !routePath.includes("/fym") &&
    !routePath.includes("/idea-pipeline") &&
    !routePath.includes("/stealth-ops") &&
    !routePath.includes("/launch-control") &&
    !routePath.includes("/brand-manager") &&
    routePath !== "/";

  if (isContentPage) {
    finalTemplate = finalTemplate.replace(
      /<link rel="modulepreload"[^>]*vendor-radix[^>]*>\n?/g,
      ""
    );
    finalTemplate = finalTemplate.replace(
      /<link rel="modulepreload"[^>]*vendor-data[^>]*>\n?/g,
      ""
    );
    finalTemplate = finalTemplate.replace(
      /<link rel="modulepreload"[^>]*vendor-icons[^>]*>\n?/g,
      ""
    );
  }

  // Replace from <!-- Default SEO --> up to the <link rel="preconnect" line
  // (which is the stable anchor in the post-analytics-deferral HTML)
  return finalTemplate.replace(
    /<!-- Default SEO[\s\S]*?(?=\n\s*<link rel="preconnect")/,
    metaBlock + "\n\n    "
  );
}

function writePage(template, routePath, meta) {
  const html = injectMeta(template, meta, routePath);
  const filePath =
    routePath === "/"
      ? join(DIST, "index.html")
      : join(DIST, routePath, "index.html");

  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, html, "utf-8");
  console.log(`  Pre-rendered: ${routePath}`);
}

function getRoutes() {
  const routes = [];

  routes.push({
    path: "/",
    meta: {
      title: "Invisible Exit | Build a Side Business While Employed",
      description:
        "AI-powered tools that help corporate managers build anonymous micro-SaaS businesses. Calculate your freedom number, validate ideas, stay invisible. From $0.97/mo.",
      url: `${SITE}/`,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE,
          logo: `${SITE}/og-image.png`,
          description:
            "Helping employed professionals build profitable side businesses using AI tools and proven funnel strategies.",
          sameAs: [
            "https://www.youtube.com/@InvisibleExit",
            "https://www.linkedin.com/company/invisible-exit",
            "https://twitter.com/InvisibleExit",
            "https://github.com/kindrat86/invisible-exit"
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE}/blog?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: SITE_NAME,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0.97",
            priceCurrency: "USD",
          },
          description:
            "5 AI-powered tools for building anonymous micro-SaaS businesses: freedom number calculator, idea validator, stealth ops hub, launch automation, and anonymous brand builder.",
          url: SITE,
          screenshot: `${SITE}/og-image.png`,
        },
        {
          "@context": "https://schema.org",
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "127",
          bestRating: "5",
          worstRating: "1",
          itemReviewed: {
            "@type": "SoftwareApplication",
            name: SITE_NAME,
            applicationCategory: "BusinessApplication",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "Review",
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          author: { "@type": "Person", name: "Sarah K." },
          datePublished: "2026-04-15",
          publisher: { "@type": "Organization", name: SITE_NAME },
          reviewBody: "The freedom number calculator showed me I was 18 months away from being able to leave my VP role. Having that timeline made the side work feel real instead of hopeless.",
          itemReviewed: { "@type": "SoftwareApplication", name: SITE_NAME },
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What do I get for $0.97/month?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Five AI-powered tools: FYM Dashboard (tracks recurring revenue and exit timeline), Idea Pipeline (validates micro-SaaS ideas in 48 hours), Stealth Ops Hub (entity separation and invisibility scoring), Launch Control (go-live automation for 5-hour weeks), and Brand Manager (faceless audience building with YouTube scripts and Reddit playbooks). All five tools, one price.",
              },
            },
            {
              "@type": "Question",
              name: "Does Invisible Exit violate my employment contract?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Most employment contracts restrict competing in your employer's industry or using company resources. Invisible Exit is designed around those constraints — you build in unrelated markets, on your own time, with your own tools. The Stealth Ops Hub runs a compliance audit against common contract clauses including non-compete, IP assignment, and moonlighting. Always review your specific contract with a legal professional.",
              },
            },
            {
              "@type": "Question",
              name: "Can my employer find out about my side business?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The Stealth Ops Hub is specifically designed to prevent that. It includes entity separation guidance, compliance audit tools, and digital footprint cleanup. Your business operates under a completely separate legal structure with no connection to your name.",
              },
            },
            {
              "@type": "Question",
              name: "How much money do I need to never work again?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "For corporate managers earning $120K-$200K, the target is $4,000/month in net recurring revenue. This covers core living expenses, provides 12+ months of runway, and eliminates the fear of financial free-fall. A micro-SaaS charging $29/month needs 138 paying customers to reach this threshold — achievable in 12-18 months.",
              },
            },
            {
              "@type": "Question",
              name: "Do I need to know how to code to use Invisible Exit?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. The Idea Pipeline helps you find and validate micro-SaaS ideas using AI tools, and the platform is designed for corporate managers who want to leverage AI rather than write code themselves. AI tools can now replace much of what a 5-person startup team used to do.",
              },
            },
            {
              "@type": "Question",
              name: "How long does it take to build a profitable side business?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Most corporate managers reach $4,000/month in recurring revenue within 12-18 months when following the Invisible Exit framework. The Idea Pipeline validates concepts in 48 hours, and the Launch Control system helps you ship in 5 focused hours per week.",
              },
            },
            {
              "@type": "Question",
              name: "What is a freedom number and how do I calculate it?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Your freedom number is the monthly recurring revenue needed to cover your core living expenses with a 12-month safety buffer. For most corporate managers earning $120K-$200K, it's $4,000/month. Use our free Freedom Number Calculator to get your personalized number in 2 minutes.",
              },
            },
            {
              "@type": "Question",
              name: "Which states are best for anonymous LLCs?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Wyoming, Delaware, and Nevada are the top three states for anonymous LLCs. Wyoming offers the strongest privacy protections at the lowest cost ($100 filing fee). Delaware is ideal if you plan to raise outside investment. Nevada has no state income tax but higher fees.",
              },
            },
            {
              "@type": "Question",
              name: "Can I build a SaaS business without quitting my job?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. The Invisible Exit system is specifically designed for employed professionals. By building in unrelated markets, using your own tools and time, and operating through a separate legal entity, you can reach financial independence without your employer ever knowing.",
              },
            },
          ],
        },
      ],
    },
  });

  routes.push({
    path: "/blog",
    meta: {
      title:
        "Blog: Invisible Exit Strategies for Corporate Managers | Invisible Exit",
      description:
        "Articles on building invisible recurring revenue, micro-SaaS businesses, and financial independence for corporate managers and executives.",
      url: `${SITE}/blog`,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Invisible Exit Blog",
          description:
            "Articles on building invisible recurring revenue, micro-SaaS businesses, and financial independence for corporate managers and executives.",
          url: `${SITE}/blog`,
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Blog" },
          ],
        },
      ],
    },
  });

  for (const post of blogPosts) {
    const postUrl = `${SITE}/blog/${post.slug}`;
    const postJsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: "2026-07-04",
        articleSection: post.category,
        wordCount: post.content.split(/\s+/).length,
        image: {
          "@type": "ImageObject",
          url: `${SITE}/og/${post.slug}.svg`,
          width: 1200,
          height: 630,
        },
        author: {
          "@type": "Person",
          name: "Adrian",
          url: `${SITE}/adrian`,
          jobTitle: "Founder, Invisible Exit",
          description: "Former corporate director who built a profitable micro-SaaS portfolio while fully employed. 8+ years in enterprise product management, MBA. Writes about anonymous side-business building, financial independence, and legal compliance for employed founders.",
          knowsAbout: ["Micro-SaaS", "Financial Independence", "Anonymous Business Formation", "Non-Compete Law", "AI Tools for Business", "Employment Contract Compliance", "Bootstrapped Startups", "Recurring Revenue", "Solo Entrepreneurship"],
          alumniOf: { "@type": "EducationalOrganization", name: "MBA, Business Administration" },
          sameAs: [
            "https://invisibleexit.com/adrian",
            "https://invisibleexit.com/about",
            "https://invisibleexit.com/blog",
          ],
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE,
          logo: {
            "@type": "ImageObject",
            url: `${SITE}/og-image.png`,
          },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
          { "@type": "ListItem", position: 3, name: post.title },
        ],
      },
    ];

    if (post.faqs?.length) {
      postJsonLd.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      });
    }

    if (post.howTo) {
      postJsonLd.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: post.howTo.name,
        description: post.howTo.description,
        totalTime: post.howTo.totalTime,
        step: post.howTo.steps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.name,
          text: step.text,
        })),
      });
    } else if (
      /^how to|how to /i.test(post.title) ||
      /^how to|how to /i.test(post.slug) ||
      /\b(guide|checklist|steps?|framework|strategy|plan|system|process)\b/i.test(post.title) ||
      /^(the\s+)?(best|complete|ultimate|essential)\s/i.test(post.title)
    ) {
      // Auto-generate HowTo schema from H2 headings for instructional posts
      const h2Matches = post.content.match(/^## (.+)$/gm) || [];
      const steps = h2Matches
        .filter((h) => !/^(faq|related|conclusion|summary|key takeaways?|further reading|resources)$/i.test(h.replace(/^##\s+/, "").trim()))
        .slice(0, 10);
      if (steps.length >= 3) {
        postJsonLd.push({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: post.title,
          description: post.excerpt,
          step: steps.map((h, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: h.replace(/^##\s+/, "").trim(),
            text: h.replace(/^##\s+/, "").trim(),
          })),
        });
      }
    }

    routes.push({
      path: `/blog/${post.slug}`,
      meta: {
        title: blogTitle(post.title),
        description: truncate(post.excerpt, 155),
        url: postUrl,
        type: "article",
        image: `${SITE}/og/${post.slug}.svg`,
        jsonLd: [
          ...postJsonLd,
          // Speakable schema for voice search / AEO
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            url: postUrl,
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", ".quick-answer", "figcaption"],
            },
            mainContentOfPage: {
              "@type": "WebPageElement",
              cssSelector: ["article", "figure"],
            },
          },
        ],
      },
    });
  }

  // ---------- Category pages (pSEO) ----------
  const categoryMeta = {
    "Stealth Operations": {
      title: "Stealth Operations for Employed Founders | Invisible Exit",
      description:
        "Complete guide to building a side business invisibly: entity separation, non-compete clauses, moonlighting rules, digital separation, and employer-proof operations.",
      intro:
        "Everything you need to build a side business without your employer finding out. Entity structures, compliance checklists, digital separation, and operational security for corporate managers building invisible recurring revenue.",
      faqs: [
        {
          question: "What is stealth operations for a side business?",
          answer:
            "Stealth operations is the practice of building and running a side business while employed, using entity separation, digital compartmentalization, and compliance management to ensure your employer cannot discover or connect your business activity to your professional identity.",
        },
        {
          question: "Can my employer legally find out about my side business?",
          answer:
            "Your employer can discover a side business through public records, social media, or accidental digital footprints. Stealth operations minimizes this risk through separate legal entities, anonymized digital accounts, and careful footprint management. Most employment contracts restrict competing businesses and company resource use, not general entrepreneurship.",
        },
      ],
    },
    "Financial Independence": {
      title: "Financial Independence for Corporate Managers | Invisible Exit",
      description:
        "How corporate managers can reach financial independence through micro-SaaS recurring revenue instead of traditional retirement savings. The $4,000/month freedom threshold.",
      intro:
        "The math, frameworks, and psychology of reaching financial independence as an employed professional. Why $4,000/month in recurring revenue changes everything — and how to get there faster than traditional saving.",
      faqs: [
        {
          question: "How much money do I need to never work again?",
          answer:
            "For corporate managers earning $120K-$200K, the target is $4,000/month in net recurring revenue. This covers core living expenses, provides 12+ months of runway, and makes leaving your job feel like a lateral move. A micro-SaaS at $29/month needs 138 customers.",
        },
      ],
    },
    "Micro-SaaS": {
      title: "Micro-SaaS for Corporate Managers | Invisible Exit",
      description:
        "How to build, launch, and grow micro-SaaS businesses while employed. Idea selection, validation, pricing, and the economics of small recurring-revenue products.",
      intro:
        "Practical frameworks for building small, profitable software products on the side. From idea selection to your first 138 customers.",
      faqs: [
        {
          question: "What is a micro-SaaS?",
          answer:
            "A micro-SaaS is a small software-as-a-service business targeting a narrow niche, typically run by one person. It charges $10-$100/month and needs 50-500 customers to generate meaningful income. The low overhead and focused scope make it ideal for employed founders.",
        },
      ],
    },
    "Audience Building": {
      title: "Faceless Audience Building for Employed Founders | Invisible Exit",
      description:
        "How to build distribution and audience without showing your face or using your real name. YouTube, Reddit, SEO, and content strategies for anonymous founders.",
      intro:
        "Distribution channels that work for low-profile founders. YouTube without showing your face, Reddit strategies, and SEO-driven content for employed founders who want attention without visibility.",
      faqs: [
        {
          question: "Can I build an audience without showing my face?",
          answer:
            "Yes. Faceless YouTube channels, Reddit contribution strategies, SEO-driven blogs, and newsletter-first approaches all build distribution without requiring personal visibility. The key is routing attention through useful assets rather than your personal identity.",
        },
      ],
    },
    "Exit Planning": {
      title: "Exit Planning for Employed Founders | Invisible Exit",
      description:
        "Roadmaps, timelines, and strategies for planning your invisible exit from employment to entrepreneurship.",
      intro:
        "Step-by-step frameworks for transitioning from employment to entrepreneurship. The 90-day roadmap and the 18-month timeline to $4,000/month.",
      faqs: [
        {
          question: "What is an invisible exit?",
          answer:
            "An invisible exit is the transition from employment to entrepreneurship achieved by building a side business invisibly until your recurring revenue replaces enough of your salary to make leaving feel safe.",
        },
      ],
    },
    Strategy: {
      title: "Strategy for Employed Founders | Invisible Exit",
      description:
        "Decision frameworks, mental models, and strategic thinking for corporate managers building side businesses.",
      intro:
        "Decision frameworks and mental models for choosing what to build and managing the identity split between employee and founder.",
      faqs: [
        {
          question: "Should I build one big startup or several small micro-SaaS businesses?",
          answer:
            "For most employed founders, several small micro-SaaS bets are safer and more realistic than one big startup. Small bets fit constrained schedules and diversify risk.",
        },
      ],
    },
    "Time Management": {
      title: "Time Management for Side Business Founders | Invisible Exit",
      description:
        "How to build a side business in 5 hours per week. Operating systems and time-blocking strategies for employed founders.",
      intro:
        "You don't need 40 hours a week to build a business. The operating systems and weekly rhythms that let corporate managers ship real products in 5 focused hours.",
      faqs: [
        {
          question: "Can I build a micro-SaaS working only 5 hours per week?",
          answer:
            "Yes. The 5-hour weekly operating system dedicates 2 hours to building, 2 hours to distribution, and 1 hour to planning. Over 18 months, you can reach $4,000/month.",
        },
      ],
    },
    Growth: {
      title: "Growth Strategies for Micro-SaaS | Invisible Exit",
      description:
        "How to get your first 10 customers without ads. Outreach playbooks and organic growth strategies for employed founders.",
      intro:
        "Customer acquisition strategies that work without paid ads or a public profile. The corporate manager's outreach playbook.",
      faqs: [
        {
          question: "How do I get my first 10 micro-SaaS customers without ads?",
          answer:
            "Your first 10 customers come from your professional network. Use targeted outreach to people who have the problem you solve. Charge from day one to qualify seriousness.",
        },
      ],
    },
    "AI Tools": {
      title: "AI Tools for Solo Founders | Invisible Exit",
      description:
        "How AI tools let solo founders compete with funded startups. Tool stacks, workflow automation, and what AI can and cannot do.",
      intro:
        "The AI tool stacks and workflows that let one person do the work of a 5-person startup team.",
      faqs: [
        {
          question: "Can AI really replace a startup team?",
          answer:
            "AI can replace much of early-stage execution — coding, copywriting, design. It cannot replace founder judgment and accountability. A solo founder with AI can compete with a funded 5-person team on execution speed.",
        },
      ],
    },
    Validation: {
      title: "Idea Validation for Micro-SaaS | Invisible Exit",
      description:
        "How to validate a micro-SaaS idea in 48 hours without writing code.",
      intro:
        "Fast validation frameworks that prove demand before you build.",
      faqs: [
        {
          question: "How do I validate a micro-SaaS idea without coding?",
          answer:
            "Validate in 48 hours by creating a landing page, driving 100 targeted visitors, and measuring email signups or pre-orders. If you cannot get 5-10 expressions of interest, reframe the idea.",
        },
      ],
    },
  };

  function slugifyCat(s) {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  for (const [catName, catData] of Object.entries(categoryMeta)) {
    const catSlug = slugifyCat(catName);
    const catUrl = `${SITE}/blog/category/${catSlug}`;
    const catPosts = blogPosts.filter((p) => p.category === catName);

    routes.push({
      path: `/blog/category/${catSlug}`,
      meta: {
        title: catData.title,
        description: catData.description,
        url: catUrl,
        type: "website",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: catData.title.replace(" | Invisible Exit", ""),
            description: catData.description,
            url: catUrl,
            isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE },
            hasPart: catPosts.map((p) => ({
              "@type": "Article",
              headline: p.title,
              url: `${SITE}/blog/${p.slug}`,
              datePublished: p.publishedAt,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
              { "@type": "ListItem", position: 3, name: catName },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: catData.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
        ],
      },
    });
  }

  // ---------- Comparison pages (pSEO) ----------

  for (const cmp of comparisons) {
    const cmpUrl = `${SITE}/compare/${cmp.slug}`;
    routes.push({
      path: `/compare/${cmp.slug}`,
      meta: {
        title: cmp.metaTitle,
        description: cmp.metaDescription,
        url: cmpUrl,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: cmp.h1,
            description: cmp.metaDescription,
            url: cmpUrl,
            author: {
              "@type": "Person",
              name: "Adrian",
              url: SITE,
            },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE,
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": cmpUrl },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE}/compare` },
              { "@type": "ListItem", position: 3, name: cmp.h1 },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: cmp.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: cmp.h1,
            description: cmp.metaDescription,
            url: cmpUrl,
            numberOfItems: cmp.table.length,
            itemListElement: cmp.table.map((row, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: row.criteria,
              description: `${row.optionA} vs ${row.optionB}`,
            })),
          },
        ],
      },
    });
  }

  // ---------- Glossary pages (AEO) ----------

  // Glossary index
  routes.push({
    path: "/glossary",
    meta: {
      title:
        "Glossary: Side Business, Micro-SaaS & Invisible Exit Terms | Invisible Exit",
      description:
        "Plain-English definitions of micro-SaaS, recurring revenue, stealth operations, non-compete clauses, freedom numbers, and more. A reference for employed founders.",
      url: `${SITE}/glossary`,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: "Invisible Exit Glossary",
          description:
            "Definitions of key terms for building anonymous side businesses, micro-SaaS, and invisible exits.",
          url: `${SITE}/glossary`,
          hasDefinedTerm: glossaryTerms.map((t) => ({
            "@type": "DefinedTerm",
            name: t.term,
            url: `${SITE}/glossary/${t.slug}`,
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Glossary" },
          ],
        },
      ],
    },
  });

  // Individual glossary term pages
  for (const term of glossaryTerms) {
    const termUrl = `${SITE}/glossary/${term.slug}`;
    const termJsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        name: term.term,
        description: term.definition,
        url: termUrl,
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          name: "Invisible Exit Glossary",
          url: `${SITE}/glossary`,
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `What Is ${term.term}?`,
        description: term.definition,
        url: termUrl,
        author: {
          "@type": "Person",
          name: "Adrian",
          url: SITE,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE,
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": termUrl },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Glossary", item: `${SITE}/glossary` },
          { "@type": "ListItem", position: 3, name: term.term },
        ],
      },
    ];

    if (term.faqs && term.faqs.length > 0) {
      termJsonLd.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: term.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      });
    }

    routes.push({
      path: `/glossary/${term.slug}`,
      meta: {
        title: `What Is ${term.term}? Definition & Guide | Invisible Exit`,
        description: term.definition.slice(0, 155),
        url: termUrl,
        type: "article",
        jsonLd: termJsonLd,
      },
    });
  }

  routes.push({
    path: "/privacy",
    meta: {
      title: "Privacy Policy | Invisible Exit",
      description:
        "Invisible Exit privacy policy. How we collect, use, and protect your data.",
      url: `${SITE}/privacy`,
      type: "website",
      noindex: true,
      jsonLd: [{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Privacy Policy" },
        ],
      }],
    },
  });

  routes.push({
    path: "/terms",
    meta: {
      title: "Terms of Service | Invisible Exit",
      description:
        "Invisible Exit terms of service. Rules and guidelines for using our platform.",
      url: `${SITE}/terms`,
      type: "website",
      noindex: true,
      jsonLd: [{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Terms of Service" },
        ],
      }],
    },
  });

  routes.push({
    path: "/about",
    meta: {
      title: "About Invisible Exit | Built by a Corporate Manager, for Corporate Managers",
      description:
        "Invisible Exit was founded by Adrian, a corporate manager who built a profitable micro-SaaS while employed — without his employer finding out. The platform shares the exact frameworks that worked.",
      url: `${SITE}/about`,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Invisible Exit",
          description:
            "Invisible Exit is a membership platform with 5 AI-powered tools for corporate managers building anonymous micro-SaaS businesses.",
          url: `${SITE}/about`,
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE,
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Adrian",
          jobTitle: "Founder, Invisible Exit",
          url: `${SITE}/about`,
          description:
            "Adrian is a corporate manager who built a profitable micro-SaaS business while employed, without his employer discovering it.",
          sameAs: [
            "https://www.youtube.com/@InvisibleExit",
            "https://www.linkedin.com/company/invisible-exit",
            "https://twitter.com/InvisibleExit",
            "https://github.com/kindrat86/invisible-exit"
          ],
          worksFor: {
            "@type": "Organization",
            name: SITE_NAME,
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "About" },
          ],
        },
      ],
    },
  });

  // --- Expert Secrets Funnel Pages ---
  routes.push({
    path: "/story",
    meta: {
      title: "My Story — How I Built $4K/Month While Employed | Invisible Exit",
      description:
        "The complete Epiphany Bridge story: Amsterdam taxi moment, Month 4 wall, competitor near-miss, and the system that changed everything. 10 chapters. 15 minutes.",
      url: `${SITE}/story`,
      type: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How I Built a $4,000/Month Side Business While Employed — Without Anyone Knowing",
          description:
            "The complete story: Amsterdam taxi moment, Month 4 wall, the competitor who almost killed me, and the system that made all of it possible.",
          author: ADRIAN_PERSON,
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
          datePublished: "2026-07-04",
          articleSection: "Origin Story",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "My Story" },
          ],
        },
      ],
    },
  });

  routes.push({
    path: "/manifesto",
    meta: {
      title: "The Invisible Exit Manifesto — A Movement for Trapped Managers",
      description:
        "This isn't a side-hustle course. It's a new vehicle for financial freedom. Read the 6 principles of the Invisible Builder movement.",
      url: `${SITE}/manifesto`,
      type: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "The Invisible Exit Manifesto — A New Vehicle for Financial Freedom",
          description:
            "Not improvement. A new opportunity. The 6 principles of the Invisible Builder movement for corporate managers.",
          author: ADRIAN_PERSON,
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
          datePublished: "2026-07-04",
          articleSection: "Manifesto",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Manifesto" },
          ],
        },
      ],
    },
  });

  routes.push({
    path: "/guides/freedom-number",
    meta: {
      title: "The Complete Freedom Number Guide (2026) | Invisible Exit",
      description:
        "The definitive guide to calculating your freedom number — the exact monthly recurring revenue you need to never work for someone else again. Formula, examples, timeline, and framework.",
      url: `${SITE}/guides/freedom-number`,
      type: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "The Complete Freedom Number Guide (2026)",
          description:
            "How to calculate the exact monthly recurring revenue you need to never work for someone else again. Formula, examples, timeline, and the 5-tool framework.",
          author: ADRIAN_PERSON,
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
          datePublished: "2026-07-04",
          articleSection: "Financial Independence",
          wordCount: "3500",
        },
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to Calculate Your Freedom Number",
          description:
            "Step-by-step guide to calculating the monthly recurring revenue you need to replace your employment income.",
          step: [
            { "@type": "HowToStep", position: 1, name: "Determine annual salary", text: "Use total compensation including bonuses." },
            { "@type": "HowToStep", position: 2, name: "Calculate monthly expenses", text: "Include all living expenses: housing, food, transportation, childcare." },
            { "@type": "HowToStep", position: 3, name: "Add 30% buffer", text: "Cover taxes, healthcare, and benefits you're leaving behind." },
            { "@type": "HowToStep", position: 4, name: "Round up", text: "Round to nearest $100 for margin." },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What exactly is a freedom number?",
              acceptedAnswer: { "@type": "Answer", text: "Your freedom number is the monthly recurring revenue you need from products you own to fully replace your employment income and living expenses." },
            },
            {
              "@type": "Question",
              name: "How is this different from the 4% rule in FIRE?",
              acceptedAnswer: { "@type": "Answer", text: "The FIRE 4% rule requires a lump sum invested. The freedom number approach uses recurring revenue from products you own — a renewable stream that doesn't deplete." },
            },
            {
              "@type": "Question",
              name: "Do I need to quit my job to hit my freedom number?",
              acceptedAnswer: { "@type": "Answer", text: "No. The Invisible Exit system is designed for employed managers who build in 5 hours per week. Most members hit $1,000 MRR within 6-8 months while employed." },
            },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Guides" },
            { "@type": "ListItem", position: 3, name: "Freedom Number Guide" },
          ],
        },
      ],
    },
  });

  routes.push({
    path: "/compare",
    meta: {
      title: "Invisible Exit vs Every Alternative — The Honest Comparison",
      description:
        "Why Invisible Exit is fundamentally different from side-hustle courses, FIRE, quit-your-job advice, MBAs, bootcamps, and passive income gurus. The honest comparison.",
      url: `${SITE}/compare`,
      type: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Invisible Exit vs Every Alternative — The Honest Comparison",
          description:
            "Comparing Invisible Exit to side-hustle courses, FIRE, quit-your-job advice, MBAs, bootcamps, and passive income gurus.",
          author: ADRIAN_PERSON,
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
          datePublished: "2026-07-04",
          articleSection: "Comparison",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Compare" },
          ],
        },
      ],
    },
  });

  routes.push({
    path: "/adrian",
    meta: {
      title: "Who Is Adrian? — The Anonymous Founder Behind Invisible Exit",
      description:
        "37-year-old Managing Director. $120K salary. <0.5% equity. Building $4K/month on the side. Identity protected by design. Read the full backstory.",
      url: `${SITE}/adrian`,
      type: "profile",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          name: "Who Is Adrian?",
          description:
            "The anonymous founder behind Invisible Exit. A 37-year-old Managing Director building invisible recurring revenue while employed.",
          url: `${SITE}/adrian`,
          about: {
            "@type": "Person",
            name: "Adrian",
            jobTitle: "Managing Director & Founder",
            description:
              "Anonymous corporate manager who built $4,100 MRR in side businesses while employed. Founder of Invisible Exit.",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Adrian" },
          ],
        },
      ],
    },
  });

  routes.push({
    path: "/masterclass",
    meta: {
      title: "Free Masterclass: Build a $4K/Month Side Business While Employed | Invisible Exit",
      description:
        "45-minute masterclass for corporate managers. Learn the 3 secrets to building invisible recurring revenue without quitting your job.",
      url: `${SITE}/masterclass`,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Event",
          name: "Invisible Exit Masterclass",
          description:
            "Free 45-minute masterclass: How corporate managers are building $4,000/month side businesses in 12 months.",
          organizer: { "@type": "Organization", name: SITE_NAME, url: SITE },
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
          isAccessibleForFree: true,
        },
        {
          "@context": "https://schema.org",
          "@type": "Course",
          name: "Invisible Exit Masterclass",
          description:
            "Free 45-minute masterclass for corporate managers. Learn the 3 secrets to building invisible recurring revenue without quitting your job.",
          provider: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE,
            sameAs: SITE,
          },
          inLanguage: "en",
          educationalLevel: "Beginner",
          teaches: [
            "How to calculate your freedom number",
            "How to validate micro-SaaS ideas in 48 hours",
            "Entity separation and stealth operations",
            "Faceless audience building with AI tools",
          ],
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "Online",
            courseWorkload: "PT45M",
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `${SITE}/masterclass`,
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Masterclass" },
          ],
        },
      ],
    },
  });

  routes.push({
    path: "/freedom",
    meta: {
      title: "Free Freedom Number Calculator | Invisible Exit",
      description:
        "Calculate exactly how much recurring revenue you need to quit your job. Free tool. Takes 90 seconds. No credit card.",
      url: `${SITE}/freedom`,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Freedom Number Calculator",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description:
            "Calculate the exact monthly recurring revenue you need to never work for someone else again.",
          url: `${SITE}/freedom`,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Freedom Number Calculator" },
          ],
        },
      ],
    },
  });

  routes.push({
    path: "/inner-circle",
    meta: {
      title: "The Invisible Exit Inner Circle — Private Community for Corporate Builders",
      description:
        "A private community of corporate managers building anonymous side businesses. Weekly office hours, MRR leaderboard, stealth-first culture.",
      url: `${SITE}/inner-circle`,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "The Inner Circle",
          description:
            "Private community of corporate managers building invisible recurring revenue. Anonymous. Accountable. Relentless.",
          url: `${SITE}/inner-circle`,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Inner Circle" },
          ],
        },
      ],
    },
  });

  routes.push({
    path: "/dream-100",
    meta: {
      title: "Dream 100 — Strategic Partner Framework | Invisible Exit",
      description:
        "How we identify, research, and build relationships with the 100 people who already have our audience. The Russell Brunson Dream 100 strategy.",
      url: `${SITE}/dream-100`,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Dream 100 Framework",
          description:
            "Strategic partner identification and outreach framework for Invisible Exit.",
          url: `${SITE}/dream-100`,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Dream 100" },
          ],
        },
      ],
    },
  });

  routes.push({
    path: "/affiliates",
    meta: {
      title: "Affiliate Program — 30% Recurring | Invisible Exit",
      description:
        "Earn 30% recurring commission referring corporate managers to Invisible Exit. Lifetime cookies, monthly payouts.",
      url: `${SITE}/affiliates`,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Affiliate Program — 30% Recurring",
          description:
            "Earn 30% recurring commission referring corporate managers to Invisible Exit.",
          url: `${SITE}/affiliates`,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Affiliates" },
          ],
        },
      ],
    },
  });

  routes.push({
    path: "/intensive",
    meta: {
      title: "The Invisible Exit Intensive — Done-With-You 90-Day Program ($2,000)",
      description:
        "Private 1-on-1 coaching with Adrian. Freedom number, stealth audit, idea validation, launch review, and 30 days of direct access. Limited to 5 managers per month.",
      url: `${SITE}/intensive`,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Invisible Exit Intensive",
          description:
            "Done-with-you 90-day program: strategy session, stealth audit, idea validation sprint, launch review, and 30-day Slack access.",
          brand: { "@type": "Brand", name: SITE_NAME },
          offers: {
            "@type": "Offer",
            price: "2000",
            priceCurrency: "USD",
            availability: "https://schema.org/LimitedAvailability",
            priceValidUntil: "2026-12-31",
            url: `${SITE}/intensive`,
            seller: { "@type": "Organization", name: SITE_NAME },
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "12",
            bestRating: "5",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Invisible Exit Intensive",
          serviceType: "Business Coaching",
          provider: { "@type": "Person", name: "Adrian", url: `${SITE}/adrian` },
          areaServed: "Worldwide",
          description:
            "Done-with-you 90-day program: strategy session, stealth audit, idea validation sprint, launch review, and 30-day Slack access.",
          offers: {
            "@type": "Offer",
            price: "2000",
            priceCurrency: "USD",
            availability: "https://schema.org/LimitedAvailability",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How is this different from the $0.97/month or $17.99/month plans?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Those are DIY tools. The Intensive is done-with-you. I personally review your situation, validate your ideas, audit your stealth setup, and build your roadmap.",
              },
            },
            {
              "@type": "Question",
              name: "Is this worth $2,000?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "If the Intensive saves you 3 months of trial and error, and your time is worth $100+/hour, the ROI is immediate. Most members recover the cost in their first 3 months of MRR.",
              },
            },
          ],
        },
      ],
    },
  });

  // --- Traffic Secrets Pages ---
  const trafficPages = [
    { path: "/traffic-blueprint", title: "Traffic Blueprint — The Complete Distribution Plan | Invisible Exit", desc: "The full Traffic Secrets execution plan: social content engine, Dream 100 outreach, podcast pitches, pillar content, affiliate assets, and the 90-day publishing cadence.", type: "website" },
    { path: "/content-calendar", title: "90-Day Social Content Calendar — Ready-to-Post Stories | Invisible Exit", desc: "17 email stories converted into ready-to-deploy social content: Twitter threads, Reddit posts, LinkedIn articles, and YouTube scripts. Copy, paste, post.", type: "website" },
    { path: "/affiliate-assets", title: "Affiliate Assets — Swipe Copy, Emails, Banners | Invisible Exit", desc: "Everything our affiliates need: pre-written emails, social media posts, banner specs, and tracking link formats. Copy, paste, earn 30% recurring.", type: "website" },
    { path: "/podcast-pitch", title: "Podcast Pitch Kit — Story Formats & Outreach Templates | Invisible Exit", desc: "The Amsterdam taxi story in 5/15/45-minute formats plus cold pitch templates for podcast outreach. Everything you need to get on shows.", type: "website" },
    { path: "/backlink-strategy", title: "Backlink Strategy — Guest Posts, HARO & Link Building Framework | Invisible Exit", desc: "The complete backlink acquisition plan: guest post targets, HARO workflow, link exchange framework, and skyscraper content strategy.", type: "website" },
    // Expert Secrets pages
    { path: "/founding-wall", title: "The Founding Wall — Meet the First 27 Builders | Invisible Exit", desc: "The first 27 Invisible Exit members. Their freedom numbers, their products, their stories. 73 spots remaining.", type: "website" },
    { path: "/frameworks", title: "The 3 Proprietary Frameworks — Origin Stories | Invisible Exit", desc: "The Salary-Runway Method, Triple-Separation Protocol, and Cartridge System. Each framework's origin story and methodology.", type: "website" },
    { path: "/proof", title: "Proof & Results — Member Case Studies | Invisible Exit", desc: "Aggregate stats, detailed case studies, 12-month results timeline, and trust signals from the Invisible Exit community.", type: "website" },
    { path: "/beliefs", title: "Belief Crusher — Break the 3 False Beliefs | Invisible Exit", desc: "Interactive 4-step experience that identifies and shatters the 3 false beliefs keeping you trapped in your corporate job.", type: "website" },
    { path: "/lexicon", title: "Movement Lexicon — 14 Terms That Define Us | Invisible Exit", desc: "The shared vocabulary of the Invisible Exit movement: Freedom Number, Golden Handcuffs, Cartridge System, The 3%, and more.", type: "website" },
    { path: "/one-thing", title: "The One Thing — Build the System First | Invisible Exit", desc: "If you could only learn one thing, it would be this: the system beats the idea. One message, zero distractions.", type: "website" },
    { path: "/join", title: "Join the Movement — 5 Declarations | Invisible Exit", desc: "Before you sign up, declare your commitment. 5 beliefs. 5 principles. The code of the Invisible Builder.", type: "website" },
    { path: "/is-this-you", title: "Is This You? — Self-Qualification Quiz | Invisible Exit", desc: "5 questions to determine if Invisible Exit is the right fit for you. Find out if you're exactly who we built this for.", type: "website" },
    // Dotcom Secrets pages
    { path: "/funnel-metrics", title: "Funnel Metrics Calculator — Interactive | Invisible Exit", desc: "Model your entire funnel with live sliders: traffic, conversion rates, and projected revenue based on Russell Brunson's benchmark rates.", type: "website" },
    { path: "/tripwire", title: "Stealth Blueprint Tripwire — $7 | Invisible Exit", desc: "The $7 tripwire offer: Stealth Blueprint. Converts browsers into buyers. First paid touchpoint in the value ladder.", type: "website" },
    { path: "/weekend-workshop", title: "Weekend Workshop — $97 | Invisible Exit", desc: "A live weekend workshop that takes you from idea to first customer in 48 hours. Mid-ticket offer in the value ladder.", type: "website" },
    { path: "/ask", title: "Ask Campaign — What Should We Build Next? | Invisible Exit", desc: "Tell us what you need. Your answers shape the next tools, features, and content we build.", type: "website" },
    { path: "/free-book", title: "FREE Book — Just Pay Shipping | Invisible Exit", desc: "Get the Invisible Exit book for free. Just pay shipping. 7 chapters, 3 digital bonuses, 30-day guarantee.", type: "website" },
    // Traffic Secrets pages
    { path: "/who", title: "Dream Customer Avatar — Who We Build For | Invisible Exit", desc: "The complete psychographic profile of the Invisible Exit dream customer: demographics, desires, fears, and awareness levels.", type: "website" },
    { path: "/where", title: "Where Your Dream Customer Hides — Community Atlas | Invisible Exit", desc: "31 communities, subreddits, podcasts, newsletters, and platforms where corporate managers trapped by golden handcuffs congregate online.", type: "website" },
    { path: "/ad-library", title: "Ad Creative Library — 8 Ready-to-Launch Campaigns | Invisible Exit", desc: "8 Facebook, Instagram, LinkedIn, and Reddit ad concepts with full targeting presets, copy, and budget recommendations.", type: "website" },
    { path: "/hso", title: "Hook, Story, Offer Matrix — 8 Content Frameworks | Invisible Exit", desc: "Russell Brunson's Hook-Story-Offer framework applied to 8 content channels: Twitter, Reddit, LinkedIn, YouTube, email, podcast, blog, and Quora.", type: "website" },
    { path: "/traffic-roadmap", title: "0 → 100,000 Visitors Roadmap — Phased Traffic Plan | Invisible Exit", desc: "The complete 12-month roadmap from 0 to 100,000 monthly visitors. 5 phases with specific tasks, milestones, and projections.", type: "website" },
    { path: "/testing", title: "The Growing Grid — A/B Testing Dashboard | Invisible Exit", desc: "8 planned A/B tests across the Invisible Exit funnel: hero headline, squeeze page, tripwire pricing, CTA buttons, exit popups, email subjects, and pricing anchors.", type: "website" },
    { path: "/youtube-strategy", title: "YouTube Strategy — 6 Video Scripts + Channel Plan | Invisible Exit", desc: "Complete YouTube strategy for faceless channel: 6 priority video scripts with hooks, thumbnails, SEO keywords, and a 4-phase channel growth plan.", type: "website" },
    { path: "/dream-100-tracker", title: "Dream 100 Tracker — 26 Named Targets & Outreach Pipeline | Invisible Exit", desc: "The actual Dream 100 list with 26 named targets across 3 tiers, outreach status tracking, and a weekly cadence for building relationships.", type: "website" },
    { path: "/pillar-hub", title: "Pillar Content Hub — 5 Definitive Guides to Write | Invisible Exit", desc: "The pillar content strategy: 5 definitive guides (3,500-5,000 words each) targeting high-volume keywords, designed as linkable assets to transform domain authority.", type: "website" },
    { path: "/explore", title: "Explore All Resources — Complete Site Index | Invisible Exit", desc: "Browse all 800+ pages: micro-SaaS ideas by profession, state guides, calculators, comparison pages, glossary terms, data reports, and blog articles.", type: "website" },
    { path: "/cost-analysis", title: "Cost Analysis — How Much Does It Cost? | Invisible Exit", desc: "Realistic cost breakdowns for starting and running a micro-SaaS. From $0 to $2,500 — see exactly where every dollar goes.", type: "website" },
    { path: "/how-to", title: "How-To Guides — Step-by-Step for Employed Founders | Invisible Exit", desc: "Actionable step-by-step guides for building a micro-SaaS while employed. From validation to launch, with tools, timelines, and pro tips.", type: "website" },
    { path: "/is-it-legal", title: "Is It Legal? — Side Business Legal Concerns | Invisible Exit", desc: "Clear, factual answers to the legal questions employed founders ask. Non-competes, IP assignment, moonlighting rules, and state-by-state variations.", type: "website" },
    { path: "/banking", title: "Business Banking Guides — Best Banks for LLCs by State | Invisible Exit", desc: "State-by-state business banking guides for LLCs and side businesses. Compare local and online banks, fees, features, and business checking options for every state.", type: "website" },
    { path: "/side-hustles", title: "Best Side Hustles by Profession (2025) | Invisible Exit", desc: "The most profitable side hustles for every profession — ranked by earning potential, startup cost, and time to first dollar.", type: "website" },
    { path: "/by-budget", title: "Start a Business by Budget — $0 to $10K Guide | Invisible Exit", desc: "What you can build with $0, $500, $5K, or $10K. Realistic earning potential, tool stacks, and 30-day action plans for each budget tier.", type: "website" },
    { path: "/niches", title: "Best Micro-SaaS Niches for 2025 | Invisible Exit", desc: "The most profitable micro-SaaS niches analyzed by market size, growth rate, and competition. Specific product ideas with pricing and monetization.", type: "website" },
    { path: "/quit-your-job", title: "When to Quit Your Job to Start a Business (Honest Guide) | Invisible Exit", desc: "The honest framework for deciding when to quit your job. Financial milestones, readiness signs, and the math — no toxic hustle advice.", type: "website" },
    { path: "/weekend-builds", title: "Weekend Build Ideas — Launch in 48 Hours | Invisible Exit", desc: "Step-by-step guides for building and launching a profitable side business in one weekend. AI wrappers, directories, Chrome extensions, and more.", type: "website" },
    { path: "/failure-stories", title: "Micro-SaaS Failure Stories — Learn From Real Mistakes | Invisible Exit", desc: "Honest analysis of why startups fail. Real failure patterns, warning signs, and lessons to avoid the same mistakes.", type: "website" },
    { path: "/reviews", title: "Tool Reviews for Solo Founders (2025) | Invisible Exit", desc: "Honest reviews of the tools solo founders actually use — Cursor, Vercel, Supabase, Stripe, Linear, Claude. Real verdicts, not affiliate fluff.", type: "website" },
    { path: "/case-studies", title: "Micro-SaaS Case Studies — Real Revenue Numbers & Strategies | Invisible Exit", desc: "Real micro-SaaS case studies with revenue numbers, growth timelines, and strategies. Learn from Typefully, Bannerbear, Senja, and more.", type: "website" },
  ];

  for (const page of trafficPages) {
    routes.push({
      path: page.path,
      meta: {
        title: page.title,
        description: page.desc,
        url: `${SITE}${page.path}`,
        type: page.type,
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: page.title.split(" — ")[0],
            description: page.desc,
            url: `${SITE}${page.path}`,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: page.title.split(" — ")[0] },
            ],
          },
        ],
      },
    });
  }

  // --- Pro Tier ---
  routes.push({
    path: "/pro",
    meta: {
      title: "Invisible Exit Pro — Group Coaching + Community ($47/month)",
      description:
        "Weekly group coaching with Adrian, private community access, idea validation reports, and monthly MRR audits. For managers who want done-with-others support.",
      url: `${SITE}/pro`,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Invisible Exit Pro",
          description:
            "Weekly group coaching calls, private community, idea validation reports, and monthly MRR audits for corporate managers building side businesses.",
          brand: { "@type": "Brand", name: SITE_NAME },
          offers: {
            "@type": "Offer",
            price: "47",
            priceCurrency: "USD",
            description: "per month",
            priceValidUntil: "2026-12-31",
            url: `${SITE}/pro`,
            seller: { "@type": "Organization", name: SITE_NAME },
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "34",
            bestRating: "5",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Invisible Exit Pro",
          serviceType: "Group Coaching + Community",
          provider: { "@type": "Person", name: "Adrian", url: `${SITE}/adrian` },
          areaServed: "Worldwide",
          description:
            "Weekly group coaching calls, private community, idea validation reports, and monthly MRR audits for corporate managers building side businesses.",
          offers: {
            "@type": "Offer",
            price: "47",
            priceCurrency: "USD",
            description: "per month",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Pro" },
          ],
        },
      ],
    },
  });

  // --- State Guides ---
  for (const guide of stateGuides) {
    const nonCompeteText = guide.nonCompeteEnforceable === "not_enforced" ? "banned" :
      guide.nonCompeteEnforceable === "limited" ? "limited" : "enforced";
    routes.push({
      path: `/guides/${guide.slug}`,
      meta: {
        title: `${guide.state} Side Business Guide: LLC, Non-Competes & Taxes | Invisible Exit`,
        description: `Start a side business in ${guide.state}. LLC filing: $${guide.llcFilingFee}. Non-compete: ${nonCompeteText}. Annual report: $${guide.annualReportFee}. Income tax: ${guide.stateIncomeTaxRate}.`,
        url: `${SITE}/guides/${guide.slug}`,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `Starting a Side Business in ${guide.state} (2026 Guide)`,
            description: guide.bestFor,
            author: { "@type": "Person", name: "Adrian", url: SITE },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            datePublished: "2026-04-20",
            articleSection: "Legal Guide",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "State Guides", item: `${SITE}/guides` },
              { "@type": "ListItem", position: 3, name: guide.state },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: guide.faqs.map(f => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // --- Industry Ideas ---
  for (const idea of industryIdeas) {
    routes.push({
      path: `/ideas/${idea.slug}`,
      meta: {
        title: `Micro-SaaS Ideas for ${idea.profession} (2026) | Invisible Exit`,
        description: `${idea.ideas.length} micro-SaaS ideas specifically for ${idea.profession.toLowerCase()}. Real revenue math, pricing, difficulty ratings, and employer conflict warnings.`,
        url: `${SITE}/ideas/${idea.slug}`,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `Micro-SaaS Ideas for ${idea.profession} (2026)`,
            description: idea.unfairAdvantage,
            author: { "@type": "Person", name: "Adrian", url: SITE },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            datePublished: "2026-04-20",
            articleSection: idea.profession,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Ideas", item: `${SITE}/ideas` },
              { "@type": "ListItem", position: 3, name: idea.profession },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: idea.faqs.map(f => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // --- Best Tools ---
  for (const list of bestToolsLists) {
    routes.push({
      path: `/best/${list.slug}`,
      meta: {
        title: list.metaTitle,
        description: list.metaDescription,
        url: `${SITE}/best/${list.slug}`,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: list.h1,
            description: list.intro,
            author: { "@type": "Person", name: "Adrian", url: SITE },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            datePublished: "2026-04-20",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Best Tools", item: `${SITE}/best` },
              { "@type": "ListItem", position: 3, name: list.title },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: list.faqs.map(f => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // --- Calculators ---
  for (const calc of calculators) {
    routes.push({
      path: `/calculators/${calc.slug}`,
      meta: {
        title: calc.metaTitle,
        description: calc.metaDescription,
        url: `${SITE}/calculators/${calc.slug}`,
        type: "website",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: calc.h1,
            description: calc.intro,
            applicationCategory: "CalculatorApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            url: `${SITE}/calculators/${calc.slug}`,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Calculators", item: `${SITE}/calculators` },
              { "@type": "ListItem", position: 3, name: calc.h1 },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: calc.faqs.map(f => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // --- Data Reports ---
  for (const report of dataReports) {
    routes.push({
      path: `/data/${report.slug}`,
      meta: {
        title: report.metaTitle,
        description: report.metaDescription,
        url: `${SITE}/data/${report.slug}`,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: report.h1,
            description: report.intro,
            creator: { "@type": "Organization", name: SITE_NAME },
            datePublished: "2026-04-20",
            keywords: "micro-saas, benchmarks, statistics, 2026",
          },
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: report.h1,
            description: report.intro,
            author: { "@type": "Person", name: "Adrian", url: SITE },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            datePublished: "2026-04-20",
            articleSection: "Research Report",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Data & Research", item: `${SITE}/data` },
              { "@type": "ListItem", position: 3, name: report.title },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: report.faqs.map(f => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // --- Resources ---
  for (const resource of resources) {
    routes.push({
      path: `/resources/${resource.slug}`,
      meta: {
        title: resource.metaTitle,
        description: resource.metaDescription,
        url: `${SITE}/resources/${resource.slug}`,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: resource.h1,
            description: resource.intro,
            totalTime: "P30D",
            step: resource.steps.map((step, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: step.title,
              text: step.description,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Resources", item: `${SITE}/resources` },
              { "@type": "ListItem", position: 3, name: resource.title },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: resource.faqs.map(f => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // ── pSEO Expansion Pages (Greg Isenberg) ──

  // --- Alternatives (X Alternative) ---
  for (const alt of alternatives) {
    const altUrl = `${SITE}/alternatives/${alt.slug}`;
    routes.push({
      path: `/alternatives/${alt.slug}`,
      meta: {
        title: alt.metaTitle,
        description: alt.metaDescription,
        url: altUrl,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: alt.h1,
            description: alt.intro,
            author: { "@type": "Person", name: "Adrian", url: SITE },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            datePublished: "2026-07-04",
            articleSection: "Product Alternatives",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Alternatives" },
              { "@type": "ListItem", position: 3, name: alt.product },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: alt.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // --- Salaries (Role → Side Business) ---
  for (const sal of salaries) {
    const salUrl = `${SITE}/salaries/${sal.slug}`;
    routes.push({
      path: `/salaries/${sal.slug}`,
      meta: {
        title: sal.metaTitle,
        description: sal.metaDescription,
        url: salUrl,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: sal.h1,
            description: sal.intro,
            author: { "@type": "Person", name: "Adrian", url: SITE },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            datePublished: "2026-07-04",
            articleSection: "Salary to SaaS",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Salaries" },
              { "@type": "ListItem", position: 3, name: sal.role },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: sal.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // --- Revenue Milestones ---
  for (const milestone of revenueMilestones) {
    const mUrl = `${SITE}/milestones/${milestone.slug}`;
    routes.push({
      path: `/milestones/${milestone.slug}`,
      meta: {
        title: milestone.metaTitle,
        description: milestone.metaDescription,
        url: mUrl,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: milestone.h1,
            description: milestone.intro,
            author: { "@type": "Person", name: "Adrian", url: SITE },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            datePublished: "2026-07-04",
            articleSection: "Revenue Milestones",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Milestones" },
              { "@type": "ListItem", position: 3, name: milestone.mrrRange },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: milestone.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // --- Timelines ---
  for (const tl of timelines) {
    const tlUrl = `${SITE}/timeline/${tl.slug}`;
    routes.push({
      path: `/timeline/${tl.slug}`,
      meta: {
        title: tl.metaTitle,
        description: tl.metaDescription,
        url: tlUrl,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: tl.h1,
            description: tl.intro,
            author: { "@type": "Person", name: "Adrian", url: SITE },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            datePublished: "2026-07-04",
            articleSection: "Timeline",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Timeline" },
              { "@type": "ListItem", position: 3, name: `Month ${tl.month}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: tl.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // --- Profession Stacks ---
  for (const stack of professionStacks) {
    const sUrl = `${SITE}/stack/${stack.slug}`;
    routes.push({
      path: `/stack/${stack.slug}`,
      meta: {
        title: stack.metaTitle,
        description: stack.metaDescription,
        url: sUrl,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: stack.h1,
            description: stack.intro,
            author: { "@type": "Person", name: "Adrian", url: SITE },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            datePublished: "2026-07-04",
            articleSection: "Tool Stack",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Tool Stacks" },
              { "@type": "ListItem", position: 3, name: stack.profession },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: stack.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // --- Cost of Waiting ---
  for (const cow of costOfWaitingPages) {
    const cUrl = `${SITE}/cost-of-waiting/${cow.slug}`;
    routes.push({
      path: `/cost-of-waiting/${cow.slug}`,
      meta: {
        title: cow.metaTitle,
        description: cow.metaDescription,
        url: cUrl,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: cow.h1,
            description: cow.intro,
            author: { "@type": "Person", name: "Adrian", url: SITE },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            datePublished: "2026-07-04",
            articleSection: "Cost of Waiting",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Cost of Waiting" },
              { "@type": "ListItem", position: 3, name: `${cow.yearsLabel} at ${cow.salaryLabel}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: cow.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // --- Profession × State Cross Pages ---
  for (const ps of professionStatePages) {
    const psUrl = `${SITE}/ideas/${ps.professionSlug}/in/${ps.stateSlug}`;
    routes.push({
      path: `/ideas/${ps.professionSlug}/in/${ps.stateSlug}`,
      meta: {
        title: ps.metaTitle,
        description: ps.metaDescription,
        url: psUrl,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: ps.h1,
            description: ps.intro,
            author: { "@type": "Person", name: "Adrian", url: SITE },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            datePublished: "2026-07-04",
            articleSection: `${ps.profession} in ${ps.state}`,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Ideas", item: `${SITE}/ideas` },
              { "@type": "ListItem", position: 3, name: ps.profession, item: `${SITE}/ideas/${ps.professionSlug}` },
              { "@type": "ListItem", position: 4, name: ps.state },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: ps.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // --- Non-Compete Matrix ---
  for (const nc of nonCompeteMatrix) {
    const ncUrl = `${SITE}/non-compete/${nc.slug}`;
    routes.push({
      path: `/non-compete/${nc.slug}`,
      meta: {
        title: nc.metaTitle,
        description: nc.metaDescription,
        url: ncUrl,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: nc.h1,
            description: nc.intro,
            author: { "@type": "Person", name: "Adrian", url: SITE },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            datePublished: "2026-07-04",
            articleSection: "Non-Compete Guide",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Non-Compete Guide" },
              { "@type": "ListItem", position: 3, name: `${nc.profession} in ${nc.state}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: nc.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // ── pSEO Round 2 (Greg Isenberg expansion) ──

  for (const m of professionMistakes) {
    routes.push({
      path: `/mistakes/${m.slug}`,
      meta: {
        title: m.metaTitle,
        description: m.metaDescription,
        url: `${SITE}/mistakes/${m.slug}`,
        type: "article",
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: m.h1, description: m.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, datePublished: "2026-07-04", dateModified: "2026-07-04" },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Mistakes", item: `${SITE}/mistakes` }, { "@type": "ListItem", position: 3, name: m.h1 }] },
          ...(m.faqs?.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: m.faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }] : []),
        ],
      },
    });
  }

  for (const r of redditStrategies) {
    routes.push({
      path: `/reddit/${r.slug}`,
      meta: {
        title: r.metaTitle,
        description: r.metaDescription,
        url: `${SITE}/reddit/${r.slug}`,
        type: "article",
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: r.h1, description: r.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, datePublished: "2026-07-04", dateModified: "2026-07-04" },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Reddit Strategy", item: `${SITE}/reddit` }, { "@type": "ListItem", position: 3, name: r.h1 }] },
          ...(r.faqs?.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: r.faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }] : []),
        ],
      },
    });
  }

  for (const p of pricingModels) {
    routes.push({
      path: `/pricing-models/${p.slug}`,
      meta: {
        title: p.metaTitle,
        description: p.metaDescription,
        url: `${SITE}/pricing-models/${p.slug}`,
        type: "article",
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: p.h1, description: p.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, datePublished: "2026-07-04", dateModified: "2026-07-04" },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Pricing Models", item: `${SITE}/pricing-models` }, { "@type": "ListItem", position: 3, name: p.h1 }] },
          ...(p.faqs?.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }] : []),
        ],
      },
    });
  }

  for (const b of breakEvenPages) {
    routes.push({
      path: `/break-even/${b.slug}`,
      meta: {
        title: b.metaTitle,
        description: b.metaDescription,
        url: `${SITE}/break-even/${b.slug}`,
        type: "article",
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: b.h1, description: b.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, datePublished: "2026-07-04", dateModified: "2026-07-04" },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Break-Even Calculator", item: `${SITE}/break-even` }, { "@type": "ListItem", position: 3, name: b.h1 }] },
          ...(b.faqs?.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: b.faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }] : []),
        ],
      },
    });
  }

  for (const v of professionVsCareer) {
    routes.push({
      path: `/vs/${v.slug}`,
      meta: {
        title: v.metaTitle,
        description: v.metaDescription,
        url: `${SITE}/vs/${v.slug}`,
        type: "article",
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: v.h1, description: v.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, datePublished: "2026-07-04", dateModified: "2026-07-04" },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Career vs SaaS", item: `${SITE}/vs` }, { "@type": "ListItem", position: 3, name: v.h1 }] },
          ...(v.faqs?.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: v.faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }] : []),
        ],
      },
    });
  }

  for (const f of firstYearEntries) {
    routes.push({
      path: `/first-year/${f.slug}`,
      meta: {
        title: f.metaTitle,
        description: f.metaDescription,
        url: `${SITE}/first-year/${f.slug}`,
        type: "article",
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: f.h1, description: f.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, datePublished: "2026-07-04", dateModified: "2026-07-04" },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "First Year", item: `${SITE}/first-year` }, { "@type": "ListItem", position: 3, name: f.h1 }] },
          ...(f.faqs?.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: f.faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }] : []),
        ],
      },
    });
  }

  for (const t of toolCrossReference) {
    routes.push({
      path: `/tools/${t.slug}`,
      meta: {
        title: t.metaTitle,
        description: t.metaDescription,
        url: `${SITE}/tools/${t.slug}`,
        type: "article",
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: t.h1, description: t.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, datePublished: "2026-07-04", dateModified: "2026-07-04" },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Best Tools", item: `${SITE}/best` }, { "@type": "ListItem", position: 3, name: t.h1 }] },
          ...(t.faqs?.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: t.faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }] : []),
        ],
      },
    });
  }

  // ── Greg Isenberg pSEO Round 3: AI Tool × Profession ──
  for (const p of aiToolProfessionPages) {
    routes.push({
      path: `/ideas/${p.professionSlug}/with/${p.toolSlug}`,
      meta: {
        title: p.metaTitle,
        description: p.metaDescription,
        url: `${SITE}/ideas/${p.professionSlug}/with/${p.toolSlug}`,
        type: "article",
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: p.h1, description: p.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, datePublished: "2026-07-04", dateModified: "2026-07-04" },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Ideas", item: `${SITE}/ideas` }, { "@type": "ListItem", position: 3, name: `${p.profession} + ${p.tool}` }] },
          ...(p.faqs?.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }] : []),
        ],
      },
    });
  }

  // ── Budget pages ──
  for (const b of budgetPages) {
    routes.push({
      path: `/budget/${b.slug}`,
      meta: {
        title: b.metaTitle,
        description: b.metaDescription,
        url: `${SITE}/budget/${b.slug}`,
        type: "article",
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: b.h1, description: b.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, datePublished: "2026-07-04", dateModified: "2026-07-04" },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Budget", item: `${SITE}/budget` }, { "@type": "ListItem", position: 3, name: b.h1 }] },
          ...(b.faqs?.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: b.faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }] : []),
        ],
      },
    });
  }

  // ── Hours pages ──
  for (const h of hoursPages) {
    routes.push({
      path: `/hours/${h.slug}`,
      meta: {
        title: h.metaTitle,
        description: h.metaDescription,
        url: `${SITE}/hours/${h.slug}`,
        type: "article",
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: h.h1, description: h.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, datePublished: "2026-07-04", dateModified: "2026-07-04" },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Hours", item: `${SITE}/hours` }, { "@type": "ListItem", position: 3, name: h.h1 }] },
          ...(h.faqs?.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: h.faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }] : []),
        ],
      },
    });
  }

  // SEO Ghost Fix: Index pages that were missing prerendered meta
  const SEO_INDEX_PAGES = [
    { path: "/best", title: "Best AI Tools for Building Micro-SaaS | Invisible Exit", desc: "The complete directory of AI tools that let corporate managers build, launch, and grow micro-SaaS businesses without coding. Curated by use case." },
    { path: "/guides", title: "State-by-State Anonymous LLC Guide | Invisible Exit", desc: "Complete guides to forming anonymous LLCs in all 50 states. Filing fees, privacy protections, and non-compete analysis for employed founders." },
    { path: "/ideas", title: "Micro-SaaS Ideas by Profession | Invisible Exit", desc: "500+ micro-SaaS ideas organized by profession. Find ideas tailored to your industry expertise, validated by AI for revenue potential." },
    { path: "/calculators", title: "Free Calculators for Employed Founders | Invisible Exit", desc: "Freedom number, break-even, timeline, and invisibility calculators for corporate managers building side businesses." },
    { path: "/data", title: "Data Reports for Side Business Founders | Invisible Exit", desc: "Revenue benchmarks, salary comparisons, and market data for corporate managers building micro-SaaS businesses on the side." },
    { path: "/vs", title: "Career vs SaaS: Profession Comparisons | Invisible Exit", desc: "Detailed comparisons of staying in your career versus building a micro-SaaS side business. Salary math, equity analysis, and MRR timelines." },
    { path: "/alternatives", title: "Invisible Exit Alternatives Compared | Invisible Exit", desc: "How Invisible Exit compares to courses, FIRE communities, bootcamps, and career coaching. Feature-by-feature comparison." },
    { path: "/salaries", title: "Salary to MRR Conversion by Profession | Invisible Exit", desc: "How many micro-SaaS customers you need to replace your salary. Profession-by-profession breakdown with pricing models." },
    { path: "/milestones", title: "Revenue Milestones for Micro-SaaS | Invisible Exit", desc: "From $0 to $4,000 MRR: month-by-month revenue milestones, what to expect at each stage, and how to accelerate." },
    { path: "/timeline", title: "Side Business Timeline Calculator | Invisible Exit", desc: "How long does it take to build a profitable side business? Real timelines based on profession, budget, and weekly hours." },
    { path: "/stack", title: "Tool Stacks for Employed Founders | Invisible Exit", desc: "Recommended tool stacks for building micro-SaaS while employed. Budget configurations from $0 to $500/month." },
    { path: "/cost-of-waiting", title: "The Cost of Waiting to Start | Invisible Exit", desc: "Every month you wait to start your side business costs you in runway, compound growth, and identity shift. Calculate your cost." },
    { path: "/non-compete", title: "Non-Compete Guide for Side Business Founders | Invisible Exit", desc: "State-by-state non-compete analysis. Which states enforce non-competes, how to navigate them, and legal strategies for employed founders." },
    { path: "/mistakes", title: "Common Mistakes Side Business Founders Make | Invisible Exit", desc: "The most expensive mistakes corporate managers make when building side businesses — and how to avoid each one." },
    { path: "/reddit", title: "Reddit Strategy for Anonymous Founders | Invisible Exit", desc: "How to build an audience on Reddit without revealing your identity. Subreddit analysis, posting strategies, and engagement playbooks." },
    { path: "/pricing-models", title: "Micro-SaaS Pricing Models Compared | Invisible Exit", desc: "Subscription, one-time, freemium, usage-based: which pricing model works best for your micro-SaaS? Data-backed analysis." },
    { path: "/break-even", title: "Break-Even Calculator for Micro-SaaS | Invisible Exit", desc: "Calculate how many customers you need to break even on your micro-SaaS. Includes hosting, tools, and time costs." },
    { path: "/first-year", title: "First Year Roadmap for Side Businesses | Invisible Exit", desc: "Month-by-month roadmap for your first year building a micro-SaaS while employed. What to do, what to expect, what to avoid." },
    { path: "/hours", title: "How Many Hours Per Week to Build a SaaS? | Invisible Exit", desc: "Time investment analysis: how many weekly hours you need to build a profitable micro-SaaS. Spoiler: less than you think." },
    { path: "/budget", title: "Side Business Budget Guide | Invisible Exit", desc: "How much does it cost to start a micro-SaaS? Budget breakdowns from $0 to $500/month with recommended tool combinations." },
  ];

  for (const p of SEO_INDEX_PAGES) {
    routes.push({
      path: p.path,
      meta: {
        title: p.title,
        description: p.desc,
        url: `${SITE}${p.path}`,
        type: "website",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: p.title.split("|")[0].trim(),
            description: p.desc,
            url: `${SITE}${p.path}`,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: p.title.split("|")[0].trim(), item: `${SITE}${p.path}` },
            ],
          },
        ],
      },
    });
  }

  // Traffic Secrets: Cold Traffic Bridge (Secret #19)
  routes.push({
    path: "/feeling-stuck",
    meta: {
      title: "Do You Feel Stuck in Your Career? (You're Not Crazy) | Invisible Exit",
      description:
        "If you've ever felt trapped by a good job — salary too comfortable to leave, equity that never materializes, Sunday dread you can't explain — this is for you.",
      url: `${SITE}/feeling-stuck`,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Feeling Stuck? The Career Trap Explained",
          description:
            "Understanding why you feel stuck in your career — and the first step toward building your exit.",
          url: `${SITE}/feeling-stuck`,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Feeling Stuck" },
          ],
        },
      ],
    },
  });

  // Traffic Secrets: Integration Marketing (Secret #17)
  routes.push({
    path: "/partners/embed",
    meta: {
      title: "Integration Marketing — Partner With Invisible Exit",
      description:
        "Embed our Freedom Calculator, add us to your email sequence, or co-create content. 30% recurring commission, 60-day cookies, ready-made assets.",
      url: `${SITE}/partners/embed`,
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Integration Marketing — Partner Program",
          description:
            "Embeddable widgets, email swipe copy, and thank-you page blocks for Invisible Exit affiliates and partners.",
          url: `${SITE}/partners/embed`,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Partners" },
          ],
        },
      ],
    },
  });

  // ---------- Tool Alternatives pages ----------
  for (const ta of toolAlternatives) {
    const url = `${SITE}/alternatives/to/${ta.slug}`;
    routes.push({
      path: `/alternatives/to/${ta.slug}`,
      meta: {
        title: ta.metaTitle,
        description: ta.metaDescription,
        url,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: ta.h1,
            description: ta.metaDescription,
            author: ADRIAN_PERSON,
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            about: { "@type": "SoftwareApplication", name: ta.tool, category: ta.category },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Alternatives", item: `${SITE}/alternatives` },
              { "@type": "ListItem", position: 3, name: `${ta.tool} Alternatives` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${ta.tool} Alternatives`,
            numberOfItems: ta.alternatives.length,
            itemListElement: ta.alternatives.map((alt, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: alt.name,
              url: alt.url,
              description: `${alt.bestFor}. Pricing: ${alt.pricing}`,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: ta.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // ---------- SaaS Blueprint pages ----------
  for (const bp of saasBlueprints) {
    const url = `${SITE}/blueprint/${bp.slug}`;
    routes.push({
      path: `/blueprint/${bp.slug}`,
      meta: {
        title: bp.metaTitle,
        description: bp.metaDescription,
        url,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: bp.h1,
            description: bp.metaDescription,
            step: bp.steps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.name,
              text: s.description,
              tool: s.tools.join(", "),
            })),
            estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
            totalTime: "P30D",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Blueprints" },
              { "@type": "ListItem", position: 3, name: bp.type },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: bp.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // ---------- Revenue Roadmap pages ----------
  for (const rr of revenueRoadmaps) {
    const url = `${SITE}/roadmap/${rr.slug}`;
    routes.push({
      path: `/roadmap/${rr.slug}`,
      meta: {
        title: rr.metaTitle,
        description: rr.metaDescription,
        url,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: rr.h1,
            description: rr.metaDescription,
            author: ADRIAN_PERSON,
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Revenue Roadmaps" },
              { "@type": "ListItem", position: 3, name: rr.target },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: rr.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // ---------- Cost Analysis pages ----------
  for (const ca of costAnalysisPages) {
    const url = `${SITE}/cost-analysis/${ca.slug}`;
    routes.push({
      path: `/cost-analysis/${ca.slug}`,
      meta: {
        title: ca.metaTitle,
        description: ca.metaDescription,
        url,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: ca.h1,
            description: ca.intro,
            author: ADRIAN_PERSON,
                      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE, logo: { "@type": "ImageObject", url: `${SITE}/og-image.png` } },
                      mainEntityOfPage: { "@type": "WebPage", "@id": url },
                    },
                    {
                      "@context": "https://schema.org",
                      "@type": "BreadcrumbList",
                      itemListElement: [
                          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                          { "@type": "ListItem", position: 2, name: "Cost Analysis" },
                          { "@type": "ListItem", position: 3, name: ca.topic },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: ca.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // ---------- How-To guide pages ----------
  for (const hg of howToGuides) {
    const url = `${SITE}/how-to/${hg.slug}`;
    routes.push({
      path: `/how-to/${hg.slug}`,
      meta: {
        title: hg.metaTitle,
        description: hg.metaDescription,
        url,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: hg.h1,
            description: hg.intro,
            author: ADRIAN_PERSON,
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          },
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: hg.h1,
            description: hg.intro,
            step: hg.steps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.name,
              text: s.description,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "How-To Guides" },
              { "@type": "ListItem", position: 3, name: hg.topic },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: hg.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // ---------- Is It Legal pages ----------
  for (const il of isItLegalPages) {
    const url = `${SITE}/is-it-legal/${il.slug}`;
    routes.push({
      path: `/is-it-legal/${il.slug}`,
      meta: {
        title: il.metaTitle,
        description: il.metaDescription,
        url,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: il.h1,
            description: il.intro,
            author: ADRIAN_PERSON,
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Legal Concerns" },
              { "@type": "ListItem", position: 3, name: il.topic },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: il.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // ---------- Banking guides (state by state) ----------
  for (const bg of bankingGuides) {
    const url = `${SITE}/banking/${bg.slug}`;
    const recommendedBankCount = bg.recommendedBanks.length;
    routes.push({
      path: `/banking/${bg.slug}`,
      meta: {
        title: `Business Banking in ${bg.stateName} — Best Banks for LLCs & Side Businesses | Invisible Exit`,
        description: `Best business banking options in ${bg.stateName}. Compare ${recommendedBankCount} recommended banks for your LLC. Fees, features, and online banking options for ${bg.stateName} founders.`,
        url,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `Business Banking in ${bg.stateName}`,
            description: `Best business banking options for LLCs and side businesses in ${bg.stateName}.`,
            author: ADRIAN_PERSON,
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Banking Guides", item: `${SITE}/banking` },
              { "@type": "ListItem", position: 3, name: bg.stateName },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: bg.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // ---------- Greg Isenberg pSEO Round 4: Side Hustle pages ----------
  for (const sh of sideHustles) {
    const url = `${SITE}/side-hustles/${sh.slug}`;
    routes.push({
      path: `/side-hustles/${sh.slug}`,
      meta: {
        title: sh.metaTitle,
        description: sh.metaDescription,
        url,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: sh.h1,
            description: sh.intro,
            author: ADRIAN_PERSON,
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Side Hustles" },
              { "@type": "ListItem", position: 3, name: sh.profession },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: sh.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // ---------- Greg Isenberg pSEO Round 4: Budget Start pages ----------
  for (const bs of budgetStartPages) {
    const url = `${SITE}/by-budget/${bs.slug}`;
    routes.push({
      path: `/by-budget/${bs.slug}`,
      meta: {
        title: bs.metaTitle,
        description: bs.metaDescription,
        url,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: bs.h1,
            description: bs.intro,
            author: ADRIAN_PERSON,
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "By Budget" },
              { "@type": "ListItem", position: 3, name: bs.budgetTier },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: bs.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // ---------- Greg Isenberg pSEO Round 4: Niche pages ----------
  for (const n of niches) {
    const url = `${SITE}/niches/${n.slug}`;
    routes.push({
      path: `/niches/${n.slug}`,
      meta: {
        title: n.metaTitle,
        description: n.metaDescription,
        url,
        type: "article",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: n.h1,
            description: n.intro,
            author: ADRIAN_PERSON,
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Niches" },
              { "@type": "ListItem", position: 3, name: n.niche },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: n.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ],
      },
    });
  }

  // ---------- Greg Isenberg pSEO Round 5: Quit Your Job pages ----------
  for (const q of quitJobPages) {
    const url = `${SITE}/quit-your-job/${q.slug}`;
    routes.push({
      path: `/quit-your-job/${q.slug}`,
      meta: {
        title: q.metaTitle,
        description: q.metaDescription,
        url, type: "article",
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: q.h1, description: q.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, mainEntityOfPage: { "@type": "WebPage", "@id": url } },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Quit Your Job" }, { "@type": "ListItem", position: 3, name: q.profession } ] },
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: q.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
        ],
      },
    });
  }

  // ---------- Greg Isenberg pSEO Round 5: Weekend Build pages ----------
  for (const w of weekendBuilds) {
    const url = `${SITE}/weekend-builds/${w.slug}`;
    routes.push({
      path: `/weekend-builds/${w.slug}`,
      meta: {
        title: w.metaTitle,
        description: w.metaDescription,
        url, type: "article",
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: w.h1, description: w.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, mainEntityOfPage: { "@type": "WebPage", "@id": url } },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Weekend Builds" }, { "@type": "ListItem", position: 3, name: w.category } ] },
          { "@context": "https://schema.org", "@type": "HowTo", name: w.h1, description: w.intro, totalTime: w.totalHours, step: w.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.task, text: s.outcome })) },
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: w.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
        ],
      },
    });
  }

  // ---------- Greg Isenberg pSEO Round 5: Failure Story pages ----------
  for (const f of failureStories) {
    const url = `${SITE}/failure-stories/${f.slug}`;
    routes.push({
      path: `/failure-stories/${f.slug}`,
      meta: {
        title: f.metaTitle,
        description: f.metaDescription,
        url, type: "article",
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: f.h1, description: f.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, mainEntityOfPage: { "@type": "WebPage", "@id": url } },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Failure Stories" }, { "@type": "ListItem", position: 3, name: f.failureType } ] },
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: f.faqs.map((fa) => ({ "@type": "Question", name: fa.question, acceptedAnswer: { "@type": "Answer", text: fa.answer } })) },
        ],
      },
    });
  }

  // ---------- Greg Isenberg pSEO Round 6: Tool Review pages ----------
  for (const t of toolReviews) {
    const url = `${SITE}/reviews/${t.slug}`;
    routes.push({
      path: `/reviews/${t.slug}`,
      meta: {
        title: t.metaTitle,
        description: t.metaDescription,
        url, type: "review",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Review",
            itemReviewed: { "@type": "SoftwareApplication", name: t.toolName, applicationCategory: "SoftwareApplication", operatingSystem: "Web" },
            reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: "5" },
            author: ADRIAN_PERSON,
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
            headline: t.h1,
            description: t.intro,
          },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Reviews" }, { "@type": "ListItem", position: 3, name: t.toolName } ] },
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: t.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
        ],
      },
    });
  }

  // ---------- Greg Isenberg pSEO Round 7: Case Study pages ----------
  for (const c of caseStudies) {
    const url = `${SITE}/case-studies/${c.slug}`;
    routes.push({
      path: `/case-studies/${c.slug}`,
      meta: {
        title: c.metaTitle,
        description: c.metaDescription,
        url, type: "article",
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: c.h1, description: c.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, mainEntityOfPage: { "@type": "WebPage", "@id": url } },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Case Studies" }, { "@type": "ListItem", position: 3, name: c.productName } ] },
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
        ],
      },
    });
  }

  // ---------- Greg Isenberg pSEO Round 8: Revenue Target × Profession pages ----------
  for (const r of revenueTargets) {
    const url = `${SITE}/revenue/${r.slug}`;
    const image = `${SITE}/og/revenue-${r.slug}.svg`;
    routes.push({
      path: `/revenue/${r.slug}`,
      meta: {
        title: r.metaTitle,
        description: r.metaDescription,
        url, type: "article", image,
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: r.h1, description: r.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, datePublished: "2026-07-05", dateModified: "2026-07-05", articleSection: `Revenue Targets for ${r.profession}` },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Revenue Targets" }, { "@type": "ListItem", position: 3, name: `${r.tier} for ${r.profession}` } ] },
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: r.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
          { "@context": "https://schema.org", "@type": "SpeakableSpecification", cssSelector: ["h1", "section:nth-of-type(2) p"], xpath: ["/html/body/div/section[1]/div/h1", "/html/body/div/section[2]/div/p"] },
        ],
      },
    });
  }

  // ---------- Greg Isenberg pSEO Round 8: City pages ----------
  for (const c of cities) {
    const url = `${SITE}/cities/${c.slug}`;
    const image = `${SITE}/og/cities-${c.slug}.svg`;
    routes.push({
      path: `/cities/${c.slug}`,
      meta: {
        title: c.metaTitle,
        description: c.metaDescription,
        url, type: "article", image,
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: c.h1, description: c.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, datePublished: "2026-07-05", dateModified: "2026-07-05", articleSection: `Side Business in ${c.city}` },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Cities" }, { "@type": "ListItem", position: 3, name: c.city } ] },
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
        ],
      },
    });
  }

  // ---------- Greg Isenberg pSEO Round 8: Skill Monetization pages ----------
  for (const s of skills) {
    const url = `${SITE}/skills/${s.slug}`;
    const image = `${SITE}/og/skills-${s.slug}.svg`;
    routes.push({
      path: `/skills/${s.slug}`,
      meta: {
        title: s.metaTitle,
        description: s.metaDescription,
        url, type: "article", image,
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: s.h1, description: s.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, datePublished: "2026-07-05", dateModified: "2026-07-05", articleSection: `Monetizing ${s.skill} Skills` },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Skills" }, { "@type": "ListItem", position: 3, name: s.skill } ] },
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
          { "@context": "https://schema.org", "@type": "SpeakableSpecification", cssSelector: ["h1", "section:nth-of-type(2) p"], xpath: ["/html/body/div/section[1]/div/h1", "/html/body/div/section[2]/div/p"] },
        ],
      },
    });
  }

  // ---------- Greg Isenberg pSEO Round 7: Audience/Demographic pages ----------
  for (const a of audienceIdeas) {
    const url = `${SITE}/audience/${a.slug}`;
    const image = `${SITE}/og/audience-${a.slug}.svg`;
    routes.push({
      path: `/audience/${a.slug}`,
      meta: {
        title: a.metaTitle,
        description: a.metaDescription,
        url, type: "article", image,
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: a.h1, description: a.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, datePublished: "2026-07-05", dateModified: "2026-07-05", articleSection: `Side Business Ideas for ${a.audience}` },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Audience" }, { "@type": "ListItem", position: 3, name: a.audience } ] },
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: a.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
          { "@context": "https://schema.org", "@type": "SpeakableSpecification", cssSelector: ["h1", "section:nth-of-type(2) p"], xpath: ["/html/body/div/section[1]/div/h1", "/html/body/div/section[2]/div/p"] },
        ],
      },
    });
  }

  // ---------- Greg Isenberg pSEO Round 7: City × Profession cross pages ----------
  for (const cp of cityProfessionPages) {
    const url = `${SITE}/cities/${cp.citySlug}/for/${cp.professionSlug}`;
    const image = `${SITE}/og/${cp.slug}.svg`;
    routes.push({
      path: `/cities/${cp.citySlug}/for/${cp.professionSlug}`,
      meta: {
        title: cp.metaTitle,
        description: cp.metaDescription,
        url, type: "article", image,
        jsonLd: [
          { "@context": "https://schema.org", "@type": "Article", headline: cp.h1, description: cp.intro, author: ADRIAN_PERSON, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE }, datePublished: "2026-07-05", dateModified: "2026-07-05", articleSection: `${cp.profession} in ${cp.city}` },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Cities", item: `${SITE}/cities` }, { "@type": "ListItem", position: 3, name: cp.city, item: `${SITE}/cities/${cp.citySlug}` }, { "@type": "ListItem", position: 4, name: cp.profession } ] },
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: cp.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
          { "@context": "https://schema.org", "@type": "SpeakableSpecification", cssSelector: ["h1", "section:nth-of-type(2) p"], xpath: ["/html/body/div/section[1]/div/h1", "/html/body/div/section[2]/div/p"] },
        ],
      },
    });
  }

  // Hub pages for new content types
  routes.push({ path: "/revenue", meta: { title: "How to Make $1K-$20K/Month by Profession — Revenue Roadmaps | Invisible Exit", description: "Realistic paths to $1K, $3K, $5K, $10K, and $20K/month in recurring revenue for 25 professions. Customer math, pricing strategy, and micro-SaaS ideas.", url: `${SITE}/revenue`, type: "website", jsonLd: [
    { "@context": "https://schema.org", "@type": "WebPage", name: "Revenue Targets by Profession", description: "Realistic paths to recurring revenue targets for 25 professions" },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Revenue Targets" } ] }
  ] } });
  routes.push({ path: "/cities", meta: { title: "Side Business Ideas by City — Local Guides for 15+ US Cities | Invisible Exit", description: "Start a side business in your city. Local legal context, startup ecosystem data, and micro-SaaS opportunities for Austin, SF, NYC, Seattle, Denver, and more.", url: `${SITE}/cities`, type: "website", jsonLd: [
    { "@context": "https://schema.org", "@type": "WebPage", name: "Side Business by City", description: "City-level guides for building a side business across the US" },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Cities" } ] }
  ] } });
  routes.push({ path: "/skills", meta: { title: "How to Make Money with Your Skills — 20 Skill Monetization Guides | Invisible Exit", description: "Monetize Python, SQL, Excel, AI prompting, design, writing, SEO, and 13 more skills. Micro-SaaS ideas, freelance rates, and realistic revenue paths.", url: `${SITE}/skills`, type: "website", jsonLd: [
    { "@context": "https://schema.org", "@type": "WebPage", name: "Skill Monetization Guides", description: "How to turn your professional skills into recurring revenue" },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Skills" } ] }
  ] } });
  routes.push({ path: "/audience", meta: { title: "Side Business Ideas by Audience — 15 Demographic Guides | Invisible Exit", description: "Side business and micro-SaaS ideas for college students, parents, veterans, retirees, nurses, teens, immigrants, digital nomads, and more. Tailored to your life situation.", url: `${SITE}/audience`, type: "website", jsonLd: [
    { "@context": "https://schema.org", "@type": "WebPage", name: "Side Business Ideas by Audience", description: "Demographic-specific micro-SaaS and side business guides" },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Audience" } ] }
  ] } });

  return routes;
}

console.log("Pre-rendering meta tags...");
const template = readFileSync(join(DIST, "index.html"), "utf-8");
const routes = getRoutes();

for (const route of routes) {
  writePage(template, route.path, route.meta);
}

console.log(`Done! Pre-rendered ${routes.length} pages.`);
