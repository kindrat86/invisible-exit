import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { blogPosts } from "@/data/blog-posts";
import { trackEvent } from "@/lib/analytics";

const START_HERE_PATHS = [
  {
    title: "Start Here",
    description:
      "If you are new to Invisible Exit, begin with the roadmap and the freedom math.",
    slugs: [
      "the-invisible-exit-roadmap-what-to-do-in-your-first-90-days",
      "how-much-money-to-never-work-again",
      "zero-to-4000-invisible-exit-timeline",
    ],
  },
  {
    title: "Stay Invisible",
    description:
      "If your biggest concern is employer visibility, contracts, and anonymity, read this track next.",
    slugs: [
      "invisible-business-model",
      "how-to-build-a-business-while-employed-without-using-your-real-name",
      "what-if-your-employer-finds-out-about-your-side-business",
    ],
  },
  {
    title: "Find the Right Idea",
    description:
      "If you are still deciding what to build, use this sequence to narrow faster.",
    slugs: [
      "best-micro-saas-ideas-for-corporate-managers",
      "validate-micro-saas-idea-in-48-hours-without-coding",
      "how-to-choose-between-one-big-startup-idea-and-three-small-micro-saas-bets",
    ],
  },
  {
    title: "Get Traction Without Going Public",
    description:
      "If you need customers and audience while staying low-profile, start with these guides.",
    slugs: [
      "how-corporate-managers-can-get-their-first-paying-customers-without-ads",
      "reddit-for-anonymous-founders-how-to-get-attention-without-looking-like-a-marketer",
      "youtube-without-showing-your-face-the-corporate-managers-content-strategy",
    ],
  },
];

const FEATURED_SLUGS = [
  "the-invisible-exit-roadmap-what-to-do-in-your-first-90-days",
  "invisible-business-model",
  "validate-micro-saas-idea-in-48-hours-without-coding",
  "how-corporate-managers-can-get-their-first-paying-customers-without-ads",
  "the-5-hour-weekly-operating-system-for-building-a-micro-saas-on-the-side",
  "can-ai-really-replace-a-co-founder-what-it-can-and-cannot-do",
];

const CATEGORY_ORDER = [
  "Stealth Operations",
  "Audience Building",
  "Financial Independence",
  "Growth",
  "Micro-SaaS",
  "Exit Planning",
  "Validation",
  "Strategy",
  "Time Management",
  "AI Tools",
];

const slugifyCategory = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const CATEGORY_SUMMARIES: Record<string, { summary: string; ctaLabel: string }> = {
  "Stealth Operations": {
    summary:
      "Everything about anonymity, separation, compliance boundaries, and building without accidental exposure.",
    ctaLabel: "Explore stealth guides",
  },
  "Audience Building": {
    summary:
      "Low-profile distribution systems: blog, Reddit, YouTube, search, and faceless content that still earns trust.",
    ctaLabel: "Explore audience guides",
  },
  "Financial Independence": {
    summary:
      "Freedom math, salary traps, recurring revenue psychology, and what optionality actually looks like in real life.",
    ctaLabel: "Explore freedom math",
  },
  Growth: {
    summary:
      "How to get early customers, learn from real conversations, and avoid paying for clarity before you have earned it.",
    ctaLabel: "Explore growth guides",
  },
  "Micro-SaaS": {
    summary:
      "Idea selection, boring business advantages, and the kinds of products that fit a 5-hour-per-week founder.",
    ctaLabel: "Explore micro-SaaS guides",
  },
  "Exit Planning": {
    summary:
      "Roadmaps, timelines, IPO skepticism, and how to build toward optionality instead of waiting for rescue.",
    ctaLabel: "Explore exit planning",
  },
  Validation: {
    summary:
      "Fast market tests, message checks, and how to stop using coding as a substitute for demand evidence.",
    ctaLabel: "Explore validation guides",
  },
  Strategy: {
    summary:
      "Decision frameworks for employed founders choosing where to focus, what to ignore, and how to narrow faster.",
    ctaLabel: "Explore strategy guides",
  },
  "Time Management": {
    summary:
      "Operating systems for constrained founders who need structured progress rather than motivational hacks.",
    ctaLabel: "Explore time systems",
  },
  "AI Tools": {
    summary:
      "Where AI meaningfully replaces labor, where it does not, and how to use it without outsourcing judgment.",
    ctaLabel: "Explore AI guides",
  },
};

const ArchiveCard = ({
  article,
  event,
  section,
}: {
  article: (typeof blogPosts)[number];
  event:
    | "blog_start_here_clicked"
    | "blog_featured_clicked"
    | "blog_related_clicked";
  section: string;
}) => (
  <Link
    to={`/blog/${article.slug}`}
    onClick={() => trackEvent(event, { slug: article.slug, section })}
    className="relative bg-white rounded-xl border border-gray-200 p-6 flex flex-col hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all group overflow-hidden"
  >
    <span className="text-[#60A5FA] text-xs font-semibold uppercase tracking-wide mb-3">
      {article.category}
    </span>
    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#3B82F6] transition-colors">
      {article.title}
    </h3>
    <p className="text-gray-600 text-sm leading-relaxed flex-1">{article.excerpt}</p>
    <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
      <span>{article.readTime}</span>
      <span>
        {new Date(article.publishedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    </div>
    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity" />
  </Link>
);

const Blog = () => {
  const sortedPosts = useMemo(
    () => [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    []
  );

  const featuredPosts = FEATURED_SLUGS.map((slug) =>
    blogPosts.find((post) => post.slug === slug)
  ).filter(Boolean) as typeof blogPosts;

  const pathSections = START_HERE_PATHS.map((path) => ({
    ...path,
    posts: path.slugs
      .map((slug) => blogPosts.find((post) => post.slug === slug))
      .filter(Boolean) as typeof blogPosts,
  }));

  const categorySections = useMemo(() => {
    const groups = new Map<string, typeof blogPosts>();
    sortedPosts.forEach((post) => {
      const current = groups.get(post.category) ?? [];
      groups.set(post.category, [...current, post]);
    });

    const ordered = Array.from(groups.entries()).sort((a, b) => {
      const aIndex = CATEGORY_ORDER.indexOf(a[0]);
      const bIndex = CATEGORY_ORDER.indexOf(b[0]);
      const safeA = aIndex === -1 ? 999 : aIndex;
      const safeB = bIndex === -1 ? 999 : bIndex;
      if (safeA !== safeB) return safeA - safeB;
      return a[0].localeCompare(b[0]);
    });

    return ordered.map(([category, posts]) => ({
      category,
      posts,
      summary: CATEGORY_SUMMARIES[category]?.summary ??
        "Guides and frameworks for this part of the Invisible Exit system.",
      ctaLabel: CATEGORY_SUMMARIES[category]?.ctaLabel ?? "Browse this category",
    }));
  }, [sortedPosts]);

  useEffect(() => {
    trackEvent("blog_archive_viewed", {
      post_count: blogPosts.length,
      featured_count: featuredPosts.length,
      category_count: categorySections.length,
    });
  }, [featuredPosts.length, categorySections.length]);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Blog: Invisible Exit Strategies | Invisible Exit"
        description="Articles on building invisible recurring revenue, micro-SaaS businesses, and financial independence. Frameworks, case studies, and actionable guides."
        url="/blog"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Invisible Exit Blog",
            description:
              "Articles on building invisible recurring revenue, micro-SaaS businesses, and financial independence.",
            url: "https://invisibleexit.com/blog",
            publisher: {
              "@type": "Organization",
              name: "Invisible Exit",
              url: "https://invisibleexit.com",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://invisibleexit.com/",
              },
              { "@type": "ListItem", position: 2, name: "Blog" },
            ],
          }),
        }}
      />
      <Navbar />

      <section className="bg-[#1B2A4A] pt-32 pb-16 px-6">
        <div className="mx-auto max-w-5xl">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white/90 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/80">Blog</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-10 items-end">
            <div>
              <p className="text-blue-400 text-sm tracking-widest uppercase mb-4">
                Start here if you want out
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                The Invisible Exit Blog
              </h1>
              <p className="text-white/70 text-lg max-w-3xl">
                Use this archive like a playbook, not a timeline. Start with the roadmap,
                pick the problem that matches your current bottleneck, and move through
                the guides in order.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white/80">
              <p className="text-sm uppercase tracking-wide text-blue-300 mb-3">
                Best first read
              </p>
              <h2 className="text-2xl font-bold text-white mb-3">
                The Invisible Exit Roadmap
              </h2>
              <p className="text-sm leading-relaxed mb-5">
                If you only read one article first, read the 90-day roadmap. It will
                orient the rest of the blog around action instead of random browsing.
              </p>
              <Link
                to="/blog/the-invisible-exit-roadmap-what-to-do-in-your-first-90-days"
                onClick={() =>
                  trackEvent("blog_start_here_clicked", {
                    slug: "the-invisible-exit-roadmap-what-to-do-in-your-first-90-days",
                    section: "hero_best_first_read",
                  })
                }
                className="inline-flex items-center gap-2 bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold px-5 py-3 rounded-xl transition-colors"
              >
                Read the roadmap
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="text-[#60A5FA] text-xs font-semibold uppercase tracking-wide mb-3">
              Start here by situation
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Four reading paths for corporate managers
            </h2>
            <p className="text-gray-600 max-w-3xl">
              Do not read this like a normal company blog. Read the track that matches your current constraint.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pathSections.map((section) => (
              <div key={section.title} className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  {section.description}
                </p>
                <div className="space-y-4">
                  {section.posts.map((article) => (
                    <ArchiveCard
                      key={article.slug}
                      article={article}
                      event="blog_start_here_clicked"
                      section={section.title}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-6 border-t border-gray-100">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[#60A5FA] text-xs font-semibold uppercase tracking-wide mb-3">
                Browse by category
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Pick the part of the system you need right now
              </h2>
              <p className="text-gray-600 max-w-3xl">
                Each category below is a mini-pathway. Use the summaries to choose what
                to read next instead of browsing aimlessly.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categorySections.map((section) => (
              <div key={section.category} className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{section.category}</h3>
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {section.posts.length} posts
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{section.summary}</p>
                <div className="space-y-3 mb-5">
                  {section.posts.slice(0, 3).map((post) => (
                    <Link
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      onClick={() =>
                        trackEvent("blog_featured_clicked", {
                          slug: post.slug,
                          section: `category_${section.category}`,
                        })
                      }
                      className="block rounded-xl bg-white border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <p className="text-sm font-semibold text-gray-900 mb-1">{post.title}</p>
                      <p className="text-xs text-gray-500">{post.readTime}</p>
                    </Link>
                  ))}
                </div>
                <Link
                  to={`/blog/category/${slugifyCategory(section.category)}`}
                  onClick={() =>
                    trackEvent("blog_featured_clicked", {
                      slug: section.posts[0].slug,
                      section: `category_cta_${section.category}`,
                    })
                  }
                  className="text-sm font-semibold text-[#3B82F6] hover:underline"
                >
                  {section.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[#60A5FA] text-xs font-semibold uppercase tracking-wide mb-3">
                Cornerstone reads
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                The articles that explain the entire system
              </h2>
              <p className="text-gray-600 max-w-3xl">
                These are the highest-leverage pieces in the archive. If they do not resonate,
                Invisible Exit is probably not for you.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((article) => (
              <ArchiveCard
                key={article.slug}
                article={article}
                event="blog_featured_clicked"
                section="cornerstone_reads"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-6 border-t border-gray-100">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="text-[#60A5FA] text-xs font-semibold uppercase tracking-wide mb-3">
              Full archive
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Every Invisible Exit article
            </h2>
            <p className="text-gray-600 max-w-3xl">
              Browse everything by date below. Newest posts appear first.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((article) => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                onClick={() =>
                  trackEvent("blog_featured_clicked", {
                    slug: article.slug,
                    section: "full_archive",
                  })
                }
                className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow group"
              >
                <span className="text-[#60A5FA] text-xs font-semibold uppercase tracking-wide mb-3">
                  {article.category}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex-1 group-hover:text-[#3B82F6] transition-colors">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">{article.readTime}</span>
                  <span className="text-gray-400 text-xs">
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-6 border-t border-gray-100">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-[#60A5FA] text-xs font-semibold uppercase tracking-wide mb-2">
              Reference
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Glossary & comparison guides
            </h2>
            <p className="text-gray-600">
              Plain-English definitions and side-by-side comparisons for the decisions employed founders face.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/glossary"
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#3B82F6] transition-colors">
                Glossary
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Definitions of micro-SaaS, recurring revenue, stealth operations, non-compete clauses, freedom numbers, and more.
              </p>
            </Link>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Comparison guides</h3>
              <div className="space-y-2">
                <Link to="/compare/micro-saas-vs-real-estate" className="block text-sm text-[#3B82F6] hover:underline">
                  Micro-SaaS vs. Real Estate
                </Link>
                <Link to="/compare/llc-vs-s-corp-side-business" className="block text-sm text-[#3B82F6] hover:underline">
                  LLC vs. S-Corp
                </Link>
                <Link to="/compare/side-business-vs-full-time-startup" className="block text-sm text-[#3B82F6] hover:underline">
                  Side Business vs. Full-Time Startup
                </Link>
                <Link to="/compare/youtube-vs-blog-for-founders" className="block text-sm text-[#3B82F6] hover:underline">
                  YouTube vs. Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Done reading? Start building.
          </h2>
          <p className="text-gray-600 mb-8">
            Use the FYM Dashboard to work backwards from your freedom number,
            pressure-test your path, and stop guessing what “enough” looks like.
          </p>
          <Link
            to="/?checkout=starter"
            onClick={() =>
              trackEvent("blog_article_cta_clicked", {
                slug: "blog_archive",
                source: "blog_archive_footer_cta",
              })
            }
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors"
          >
            Get Started for $0.97/month
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
