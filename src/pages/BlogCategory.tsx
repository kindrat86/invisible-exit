import { Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useParams, Navigate } from "react-router-dom";
import { blogPosts } from "@/data/blog-posts";
import { trackEvent } from "@/lib/analytics";
import InlineNewsletter from "@/components/InlineNewsletter";

// Category descriptions for SEO + AEO
const CATEGORY_META: Record<
  string,
  {
    title: string;
    description: string;
    intro: string;
    h1: string;
    faqs: { question: string; answer: string }[];
  }
> = {
  "Stealth Operations": {
    title: "Stealth Operations for Employed Founders | Invisible Exit",
    description:
      "Complete guide to building a side business invisibly: entity separation, non-compete clauses, moonlighting rules, digital separation, and employer-proof operations.",
    h1: "Stealth Operations for Employed Founders",
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
      {
        question: "Do I need an LLC to build a stealth business?",
        answer:
          "An LLC provides liability protection and creates a legal separation between your personal identity and your business, which helps with stealth. However, you can start validating and building before forming an entity. The right time to form an LLC is typically before your first paying customer.",
      },
    ],
  },
  "Financial Independence": {
    title: "Financial Independence for Corporate Managers | Invisible Exit",
    description:
      "How corporate managers can reach financial independence through micro-SaaS recurring revenue instead of traditional retirement savings. The $4,000/month freedom threshold.",
    h1: "Financial Independence Through Micro-SaaS",
    intro:
      "The math, frameworks, and psychology of reaching financial independence as an employed professional. Why $4,000/month in recurring revenue changes everything — and how to get there faster than traditional saving.",
    faqs: [
      {
        question: "How much money do I need to never work again?",
        answer:
          "For corporate managers earning $120K-$200K, the target is $4,000/month in net recurring revenue. This covers core living expenses, provides 12+ months of runway, and makes leaving your job feel like a lateral move rather than a cliff dive. A micro-SaaS at $29/month needs 138 customers to reach this.",
      },
      {
        question: "Is recurring revenue better than salary for financial independence?",
        answer:
          "Recurring revenue compounds — every customer added this month continues paying next month. Unlike one-time sales or salary, recurring revenue creates a growing baseline that eventually exceeds your cost of living, at which point your job becomes optional.",
      },
      {
        question: "How long does it take to reach financial independence with micro-SaaS?",
        answer:
          "With consistent effort, corporate managers can reach $4,000/month in recurring revenue in 12-18 months. The timeline depends on niche selection, pricing, and consistent marketing. At 5% monthly churn, maintaining $4,000/month requires adding about 7 new customers per month.",
      },
    ],
  },
  "Micro-SaaS": {
    title: "Micro-SaaS for Corporate Managers | Invisible Exit",
    description:
      "How to build, launch, and grow micro-SaaS businesses while employed. Idea selection, validation, pricing, and the economics of small recurring-revenue products.",
    h1: "Building Micro-SaaS Businesses While Employed",
    intro:
      "Practical frameworks for building small, profitable software products on the side. From idea selection to your first 138 customers, here's how corporate managers are building sellable micro-SaaS assets.",
    faqs: [
      {
        question: "What is a micro-SaaS?",
        answer:
          "A micro-SaaS is a small software-as-a-service business targeting a narrow niche, typically run by one person or a tiny team. It charges recurring monthly revenue ($10-$100/month) and needs 50-500 customers to generate meaningful income. The low overhead and focused scope make it ideal for employed founders.",
      },
      {
        question: "What are the best micro-SaaS ideas for corporate managers?",
        answer:
          "The best ideas are narrow, painful, and easy to explain — not exciting startup ideas. Corporate managers are uniquely positioned to spot workflow problems in their industry. The strongest candidates solve a specific recurring pain that a small, well-defined audience will pay to eliminate.",
      },
    ],
  },
  "Audience Building": {
    title: "Faceless Audience Building for Employed Founders | Invisible Exit",
    description:
      "How to build distribution and audience without showing your face or using your real name. YouTube, Reddit, SEO, and content strategies for anonymous founders.",
    h1: "Audience Building Without a Personal Brand",
    intro:
      "Distribution channels that work for low-profile founders. YouTube without showing your face, Reddit strategies, SEO-driven blog content, and the faceless content stack for employed founders who want attention without visibility.",
    faqs: [
      {
        question: "Can I build an audience without showing my face?",
        answer:
          "Yes. Faceless YouTube channels, Reddit contribution strategies, SEO-driven blogs, and newsletter-first approaches all build distribution without requiring personal visibility. The key is routing attention through useful assets rather than your personal identity.",
      },
      {
        question: "What is the best distribution channel for anonymous founders?",
        answer:
          "Search engine optimization (SEO) is ideal for anonymous founders because it rewards useful specificity over personality. Reddit and faceless YouTube are also strong when used as contribution-driven channels rather than promotional ones.",
      },
    ],
  },
  "Exit Planning": {
    title: "Exit Planning for Employed Founders | Invisible Exit",
    description:
      "Roadmaps, timelines, and strategies for planning your invisible exit from employment to entrepreneurship. From first 90 days to sellable asset.",
    h1: "Planning Your Invisible Exit",
    intro:
      "Step-by-step frameworks for transitioning from employment to entrepreneurship. The 90-day roadmap, the 18-month timeline to $4,000/month, and how to build a micro-SaaS that's sellable.",
    faqs: [
      {
        question: "What is an invisible exit?",
        answer:
          "An invisible exit is the transition from employment to entrepreneurship achieved by building a side business invisibly — without your employer knowing — until your recurring revenue replaces enough of your salary to make leaving feel safe. The business is built quietly, tested thoroughly, and scaled before you ever give notice.",
      },
      {
        question: "How long does an invisible exit take?",
        answer:
          "Most corporate managers can complete an invisible exit in 12-18 months. The first 90 days establish direction and validate the idea. Months 4-12 focus on building recurring revenue to the $4,000/month threshold. The exit itself is a psychological shift as much as a financial one.",
      },
    ],
  },
  "Strategy": {
    title: "Strategy for Employed Founders | Invisible Exit",
    description:
      "Decision frameworks, mental models, and strategic thinking for corporate managers building side businesses. Idea selection, identity shifts, and permission.",
    h1: "Strategic Thinking for Employed Founders",
    intro:
      "Decision frameworks and mental models for choosing what to build, managing the identity split between employee and founder, and stopping the permission-seeking that keeps capable people stuck.",
    faqs: [
      {
        question: "Should I build one big startup or several small micro-SaaS businesses?",
        answer:
          "For most employed founders, several small micro-SaaS bets are safer and more realistic than one big startup. Small bets fit constrained schedules, generate faster feedback, and diversify risk. The right approach depends on your time, risk tolerance, and whether the idea fits the life you actually have.",
      },
    ],
  },
  "Time Management": {
    title: "Time Management for Side Business Founders | Invisible Exit",
    description:
      "How to build a side business in 5 hours per week. Operating systems, weekly rhythms, and time-blocking strategies for employed founders with family commitments.",
    h1: "Building a Business on 5 Hours a Week",
    intro:
      "You don't need 40 hours a week to build a business. The operating systems, weekly rhythms, and prioritization frameworks that let corporate managers ship real products in 5 focused hours.",
    faqs: [
      {
        question: "Can I build a micro-SaaS working only 5 hours per week?",
        answer:
          "Yes, but it requires discipline. The 5-hour weekly operating system dedicates 2 hours to building, 2 hours to distribution, and 1 hour to planning. Over 18 months at this pace, you can validate, build, and reach $4,000/month in recurring revenue.",
      },
    ],
  },
  "Growth": {
    title: "Growth Strategies for Micro-SaaS | Invisible Exit",
    description:
      "How to get your first 10 customers without ads. Outreach playbooks, referral systems, and organic growth strategies for employed founders.",
    h1: "Getting Your First Customers",
    intro:
      "Customer acquisition strategies that work without paid ads or a public profile. The corporate manager's outreach playbook, referral systems, and word-of-mouth engineering.",
    faqs: [
      {
        question: "How do I get my first 10 micro-SaaS customers without ads?",
        answer:
          "Your first 10 customers come from your professional network, not paid ads. Use targeted outreach to people in your industry who have the problem you solve. Your domain expertise and professional credibility are advantages most founders lack. Charge from day one to qualify seriousness.",
      },
    ],
  },
  "AI Tools": {
    title: "AI Tools for Solo Founders | Invisible Exit",
    description:
      "How AI tools let solo founders compete with funded startups. Tool stacks, workflow automation, and what AI can and cannot do for early-stage businesses.",
    h1: "AI Tools for the Solo Founder",
    intro:
      "The AI tool stacks and workflows that let one person do the work of a 5-person startup team. What AI can replace, what it can't, and how to build a leverage-driven operation.",
    faqs: [
      {
        question: "Can AI really replace a startup team?",
        answer:
          "AI can replace much of early-stage execution — coding, copywriting, design, customer support research. It cannot replace founder judgment, ownership, and accountability. A solo founder with AI tools can now compete with a funded 5-person team on execution speed, but strategic decisions remain human work.",
      },
    ],
  },
  Validation: {
    title: "Idea Validation for Micro-SaaS | Invisible Exit",
    description:
      "How to validate a micro-SaaS idea in 48 hours without writing code. Fast, practical validation frameworks for time-constrained corporate managers.",
    h1: "Validating Micro-SaaS Ideas in 48 Hours",
    intro:
      "Fast validation frameworks that prove demand before you build. How to test whether an idea deserves a weekend before investing months of your limited time.",
    faqs: [
      {
        question: "How do I validate a micro-SaaS idea without coding?",
        answer:
          "Validate in 48 hours by creating a landing page describing the solution, driving 100 targeted visitors via your network or communities, and measuring interest via email signups or pre-orders. If you cannot get 5-10 expressions of interest, the idea needs reframing or the audience needs rethinking.",
      },
    ],
  },
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function getCategorySlugs() {
  return Object.keys(CATEGORY_META).map(slugify);
}

const BlogCategory = () => {
  const { category } = useParams<{ category: string }>();

  // Reverse-lookup the category name from slug
  const categoryName = Object.keys(CATEGORY_META).find(
    (c) => slugify(c) === category
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  if (!categoryName || !CATEGORY_META[categoryName]) {
    return <Navigate to="/blog" replace />;
  }

  const meta = CATEGORY_META[categoryName];
  const posts = blogPosts.filter((p) => p.category === categoryName);
  const categorySlug = slugify(categoryName);
  const url = `https://invisibleexit.com/blog/category/${categorySlug}`;

  const jsonLdArray = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: meta.h1,
      description: meta.description,
      url,
      isPartOf: {
        "@type": "WebSite",
        name: "Invisible Exit",
        url: "https://invisibleexit.com",
      },
      hasPart: posts.map((p) => ({
        "@type": "Article",
        headline: p.title,
        url: `https://invisibleexit.com/blog/${p.slug}`,
        datePublished: p.publishedAt,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://invisibleexit.com/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://invisibleexit.com/blog" },
        { "@type": "ListItem", position: 3, name: categoryName },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: meta.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title={meta.title}
        description={meta.description}
        url={`/blog/category/${categorySlug}`}
      />
      {jsonLdArray.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <Navbar />

      <section className="bg-[#1B2A4A] pt-32 pb-16 px-6">
        <div className="mx-auto max-w-4xl">
          <nav className="flex items-center gap-2 text-sm text-white/40 mb-6">
            <Link to="/" className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-white/70 transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-white/60">{categoryName}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {meta.h1}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">{meta.intro}</p>
          <div className="mt-6 text-white/50 text-sm">
            {posts.length} article{posts.length !== 1 ? "s" : ""} in this category
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-4xl space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-gray-100 pb-8 last:border-0"
            >
              <span className="text-[#60A5FA] text-xs font-semibold uppercase tracking-wide">
                {post.category}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2 mb-2">
                <Link
                  to={`/blog/${post.slug}`}
                  className="hover:text-[#3B82F6] transition-colors"
                  onClick={() =>
                    trackEvent("blog_category_post_clicked", {
                      slug: post.slug,
                      category: categorySlug,
                    })
                  }
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>{post.readTime}</span>
                <span>&middot;</span>
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ section for AEO */}
      {meta.faqs.length > 0 && (
        <section className="bg-gray-50 py-16 px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {meta.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container-standard py-12">
        <InlineNewsletter source={`blog_category_${category}`} />
      </div>

      <Footer />
    </div>
  );
};

export default BlogCategory;
