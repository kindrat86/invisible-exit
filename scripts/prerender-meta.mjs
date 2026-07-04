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

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const SITE = "https://invisibleexit.com";
const SITE_NAME = "Invisible Exit";
const DEFAULT_IMAGE = `${SITE}/og-image.png`;

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function jsonLdScript(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

function injectMeta(template, { title, description, url, type, image, jsonLd }) {
  const escapedTitle = escapeHtml(title);
  const escapedDesc = escapeHtml(description);
  const img = image || DEFAULT_IMAGE;
  const jsonLdHtml = (jsonLd || []).map(jsonLdScript).join("\n    ");

  const metaBlock = `<!-- SEO (pre-rendered) -->
    <title>${title}</title>
    <meta name="description" content="${escapedDesc}" />
    <meta name="author" content="${SITE_NAME}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />

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

    ${jsonLdHtml}`;

  // Replace from <!-- Default SEO --> up to the <link rel="preconnect" line
  // (which is the stable anchor in the post-analytics-deferral HTML)
  return template.replace(
    /<!-- Default SEO[\s\S]*?(?=\n\s*<link rel="preconnect")/,
    metaBlock + "\n\n    "
  );
}

function writePage(template, routePath, meta) {
  const html = injectMeta(template, meta);
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
        "5 AI-powered tools that help corporate managers build anonymous micro-SaaS businesses. Calculate your freedom number, validate ideas, stay invisible. From $0.97/mo.",
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
        dateModified: post.publishedAt,
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
          url: SITE,
          jobTitle: "Founder, Invisible Exit",
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
    }

    routes.push({
      path: `/blog/${post.slug}`,
      meta: {
        title: `${post.title} | Invisible Exit Blog`,
        description: post.excerpt,
        url: postUrl,
        type: "article",
        image: `${SITE}/og/${post.slug}.svg`,
        jsonLd: postJsonLd,
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

  return routes;
}

console.log("Pre-rendering meta tags...");
const template = readFileSync(join(DIST, "index.html"), "utf-8");
const routes = getRoutes();

for (const route of routes) {
  writePage(template, route.path, route.meta);
}

console.log(`Done! Pre-rendered ${routes.length} pages.`);
