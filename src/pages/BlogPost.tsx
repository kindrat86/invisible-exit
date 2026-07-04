import { useEffect, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getBlogPostBySlug, blogPosts } from "@//data/blog-posts";
import { comparisons } from "@//data/comparisons";
import { trackEvent } from "@//lib/analytics";

const slugifyCat = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function renderInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong class='text-foreground font-semibold'>$1</strong>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      "<a href='$2' class='text-primary hover:underline'>$1</a>"
    );
}

const CATEGORY_GUIDES: Record<
  string,
  { title: string; body: string; slug: string; cta: string }
> = {
  "Stealth Operations": {
    title: "Need the full stealth playbook?",
    body: "Read the cornerstone guide on entity separation, compliance, and digital footprint control before you make the project more visible than it needs to be.",
    slug: "invisible-business-model",
    cta: "Read the stealth guide",
  },
  Validation: {
    title: "Still validating? Do this next.",
    body: "Use the 48-hour validation process before you spend another weekend building something nobody asked for.",
    slug: "validate-micro-saas-idea-in-48-hours-without-coding",
    cta: "Read the validation guide",
  },
  Growth: {
    title: "Ready for first customers?",
    body: "Use the no-ads acquisition playbook and let real conversations teach you what the market actually cares about.",
    slug: "how-corporate-managers-can-get-their-first-paying-customers-without-ads",
    cta: "Read the growth guide",
  },
  "Audience Building": {
    title: "Need an audience without becoming public?",
    body: "Use the faceless YouTube and anonymous distribution guides instead of defaulting to personal branding.",
    slug: "youtube-without-showing-your-face-the-corporate-managers-content-strategy",
    cta: "Read the audience guide",
  },
  "Time Management": {
    title: "Need a better weekly system?",
    body: "If time is the bottleneck, tighten your operating rhythm before you add more tools, ideas, or channels.",
    slug: "the-5-hour-weekly-operating-system-for-building-a-micro-saas-on-the-side",
    cta: "Read the 5-hour system",
  },
  Strategy: {
    title: "Need a better decision model?",
    body: "If you keep second-guessing what to build, read the serial-narrowing framework and stop treating idea selection like a personality test.",
    slug: "how-to-choose-between-one-big-startup-idea-and-three-small-micro-saas-bets",
    cta: "Read the strategy guide",
  },
  "Exit Planning": {
    title: "Need the full roadmap?",
    body: "Use the 90-day roadmap to turn vague ambition into a sequence you can actually execute while employed.",
    slug: "the-invisible-exit-roadmap-what-to-do-in-your-first-90-days",
    cta: "Read the roadmap",
  },
  "Financial Independence": {
    title: "Start with the freedom math.",
    body: "If the number still feels vague, work backwards from the freedom threshold before you obsess over product details.",
    slug: "how-much-money-to-never-work-again",
    cta: "Read the freedom math",
  },
  "Micro-SaaS": {
    title: "Need the right micro-SaaS idea?",
    body: "Read the ideas guide next and filter for narrow, painful workflows instead of impressive startup fantasies.",
    slug: "best-micro-saas-ideas-for-corporate-managers",
    cta: "Read the ideas guide",
  },
  "AI Tools": {
    title: "Need the AI leverage model?",
    body: "Understand where AI should replace labor and where founder judgment still has to stay firmly in your hands.",
    slug: "can-ai-really-replace-a-co-founder-what-it-can-and-cannot-do",
    cta: "Read the AI guide",
  },
};

const START_HERE_SLUG = "the-invisible-exit-roadmap-what-to-do-in-your-first-90-days";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const jsonLdArray: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      url: `https://invisibleexit.com/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      articleSection: post.category,
      wordCount: post.content.split(/\s+/).length,
      image: {
        "@type": "ImageObject",
        url: `https://invisibleexit.com/og/${post.slug}.svg`,
        width: 1200,
        height: 630,
      },
      author: {
        "@type": "Person",
        name: "Adrian",
        url: "https://invisibleexit.com",
        jobTitle: "Founder, Invisible Exit",
      },
      publisher: {
        "@type": "Organization",
        name: "Invisible Exit",
        url: "https://invisibleexit.com",
        logo: {
          "@type": "ImageObject",
          url: "https://invisibleexit.com/og-image.png",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://invisibleexit.com/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://invisibleexit.com/blog" },
        { "@type": "ListItem", position: 3, name: post.title },
      ],
    },
  ];

  if (post.faqs && post.faqs.length > 0) {
    jsonLdArray.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  if (post.howTo) {
    jsonLdArray.push({
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

  const relatedPosts = useMemo(() => {
    const explicit = (post.relatedSlugs || [])
      .map((s) => blogPosts.find((p) => p.slug === s))
      .filter(Boolean) as typeof blogPosts;

    const fallback = blogPosts
      .filter((candidate) => candidate.slug !== post.slug)
      .filter(
        (candidate) =>
          candidate.category === post.category &&
          !explicit.some((selected) => selected.slug === candidate.slug)
      )
      .slice(0, Math.max(0, 3 - explicit.length));

    return [...explicit, ...fallback].slice(0, 3);
  }, [post]);

  const categoryGuide = CATEGORY_GUIDES[post.category];
  const categoryGuidePost = categoryGuide
    ? blogPosts.find((candidate) => candidate.slug === categoryGuide.slug)
    : undefined;
  const startHerePost = blogPosts.find((candidate) => candidate.slug === START_HERE_SLUG);

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${post.title} | Invisible Exit Blog`}
        description={post.excerpt}
        url={`/blog/${post.slug}`}
        type="article"
        image={`https://invisibleexit.com/og/${post.slug}.svg`}
        publishedDate={post.publishedAt}
        modifiedDate={post.publishedAt}
      />
      {jsonLdArray.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-white/40 mb-6 overflow-hidden">
            <Link to="/" className="hover:text-white/70 transition-colors shrink-0">
              Home
            </Link>
            <span className="shrink-0">/</span>
            <Link
              to="/blog"
              className="hover:text-white/70 transition-colors shrink-0"
              onClick={() =>
                trackEvent("blog_back_to_hub_clicked", {
                  slug: post.slug,
                  source: "breadcrumb",
                })
              }
            >
              Blog
            </Link>
            <span className="shrink-0">/</span>
            <span className="text-white/60 truncate">{post.title}</span>
          </nav>

          <span className="block text-eyebrow text-primary-light mb-4">
            {post.category}
          </span>
          <h1 className="text-h1 text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-body-lg text-white/70 leading-relaxed mb-6">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/50 text-sm">
            <span>By Adrian</span>
            <span aria-hidden>·</span>
            <span>{post.readTime}</span>
            <span aria-hidden>·</span>
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Quick Answer / TL;DR */}
      <section className="bg-primary/5 border-l-4 border-primary py-5 sm:py-6 section">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-2">Quick Answer</p>
          <p className="text-lg text-foreground leading-relaxed font-medium">
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* Article body */}
      <section className="bg-white section-normal">
        <article className="container-narrow prose-content">
          {post.content
            .split("\n\n")
            .flatMap((block, i) => {
              const lines = block.split("\n");
              const listStart = lines.findIndex(
                (l) => l.match(/^[-\d]/) || l.startsWith("- [")
              );
              if (listStart > 0 && !block.startsWith("|") && !block.startsWith("#")) {
                const textPart = lines.slice(0, listStart).join("\n");
                const listPart = lines.slice(listStart).join("\n");
                return [
                  { key: `${i}a`, block: textPart },
                  { key: `${i}b`, block: listPart },
                ];
              }
              return [{ key: String(i), block }];
            })
            .map(({ key: k, block }) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={k}>
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("### ")) {
                return (
                  <h3 key={k}>
                    {block.replace("### ", "")}
                  </h3>
                );
              }
              if (block.startsWith("| ")) {
                const rows = block
                  .split("\n")
                  .filter((r) => !r.match(/^\|\s*[-|]+\s*\|$/));
                if (rows.length === 0) return null;
                const header = rows[0].split("|").filter(Boolean).map((c) => c.trim());
                const body = rows
                  .slice(1)
                  .map((r) => r.split("|").filter(Boolean).map((c) => c.trim()));
                return (
                  <div key={k} className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          {header.map((h, j) => (
                            <th key={j}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {body.map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => (
                              <td key={ci}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              if (block.startsWith("- [ ]") || block.startsWith("- [x]")) {
                const items = block.split("\n").filter(Boolean);
                return (
                  <ul key={k} className="space-y-2 my-4 pl-2 list-none">
                    {items.map((item, j) => {
                      const checked = item.startsWith("- [x]");
                      const text = item.replace(/^- \[.\]\s*/, "");
                      return (
                        <li key={j} className="flex items-start gap-2.5">
                          <input type="checkbox" checked={checked} readOnly className="mt-1.5 accent-primary" />
                          <span>{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                );
              }
              if (block.startsWith("- ")) {
                const items = block.split("\n").filter(Boolean);
                return (
                  <ul key={k}>
                    {items.map((item, j) => {
                      const text = item.replace(/^-\s+/, "");
                      return (
                        <li
                          key={j}
                          dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(text) }}
                        />
                      );
                    })}
                  </ul>
                );
              }
              if (block.match(/^\d+\.\s/)) {
                const items = block.split("\n").filter(Boolean);
                return (
                  <ol key={k}>
                    {items.map((item, j) => {
                      const text = item.replace(/^\d+\.\s+/, "");
                      return (
                        <li
                          key={j}
                          dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(text) }}
                        />
                      );
                    })}
                  </ol>
                );
              }
              return (
                <p
                  key={k}
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(block) }}
                />
              );
            })}
        </article>
      </section>

      {/* Next steps: Category guide + Start here */}
      {(categoryGuide && categoryGuidePost) || startHerePost ? (
        <section className="bg-surface section-tight border-y border-border">
          <div className="container-narrow grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryGuide && categoryGuidePost && (
              <div className="card-base p-6">
                <p className="text-eyebrow text-primary mb-3">Read this next</p>
                <h2 className="text-h3 text-foreground mb-3">{categoryGuide.title}</h2>
                <p className="text-caption mb-5">{categoryGuide.body}</p>
                <Link
                  to={`/blog/${categoryGuidePost.slug}`}
                  onClick={() =>
                    trackEvent("blog_related_clicked", {
                      slug: post.slug,
                      related_slug: categoryGuidePost.slug,
                      source: "category_guide",
                    })
                  }
                  className="btn-primary"
                >
                  {categoryGuide.cta}
                </Link>
              </div>
            )}
            {startHerePost && startHerePost.slug !== post.slug && (
              <div className="card-base p-6">
                <p className="text-eyebrow text-primary mb-3">New to Invisible Exit?</p>
                <h2 className="text-h3 text-foreground mb-3">Start with the roadmap</h2>
                <p className="text-caption mb-5">
                  If this article resonates, use the 90-day roadmap to see how all the pieces fit together in sequence.
                </p>
                <Link
                  to={`/blog/${startHerePost.slug}`}
                  onClick={() =>
                    trackEvent("blog_related_clicked", {
                      slug: post.slug,
                      related_slug: startHerePost.slug,
                      source: "start_here_guide",
                    })
                  }
                  className="btn-secondary"
                >
                  Read the roadmap
                </Link>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* FAQs */}
      {post.faqs && post.faqs.length > 0 && (
        <section className="bg-white pb-16 section">
          <div className="container-narrow">
            <h2 className="text-h2 text-foreground mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {post.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-foreground font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-surface section-normal border-t border-border">
          <div className="container-narrow">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-eyebrow text-primary mb-2">Keep moving</p>
                <h2 className="text-h2 text-foreground">Related Articles</h2>
              </div>
              <Link
                to={`/blog/category/${slugifyCat(post.category)}`}
                onClick={() =>
                  trackEvent("blog_back_to_hub_clicked", {
                    slug: post.slug,
                    source: "related_articles_category_link",
                  })
                }
                className="text-sm font-medium text-primary hover:underline"
              >
                More in {post.category}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  onClick={() =>
                    trackEvent("blog_related_clicked", {
                      slug: post.slug,
                      related_slug: related.slug,
                      source: "related_articles",
                    })
                  }
                  className="card-base p-6 flex flex-col card-hover group"
                >
                  <span className="text-eyebrow text-primary mb-3">
                    {related.category}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-caption flex-1">{related.excerpt}</p>
                  <span className="text-xs text-muted-foreground mt-4">{related.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related comparisons */}
      {(() => {
        const relevant = comparisons
          .filter((c) => {
            const titleLower = post.title.toLowerCase();
            const contentLower = post.content.toLowerCase();
            const cmpLower = (c.optionA + " " + c.optionB + " " + c.title).toLowerCase();
            return (
              cmpLower.split(" ").some((w) => w.length > 4 && (titleLower.includes(w) || contentLower.includes(w)))
            );
          })
          .slice(0, 2);
        if (relevant.length === 0) return null;
        return (
          <section className="bg-white section-tight border-t border-border">
            <div className="container-narrow">
              <p className="text-eyebrow text-primary mb-2">Related comparisons</p>
              <h2 className="text-h2 text-foreground mb-6">Side-by-side guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relevant.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/compare/${c.slug}`}
                    className="card-base bg-surface p-6 card-hover group"
                  >
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {c.optionA} vs. {c.optionB}
                    </h3>
                    <p className="text-caption">
                      {c.summary.slice(0, 140)}…
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary-light mb-3">Turn theory into a number</p>
          <h2 className="text-h2 text-white mb-4">Ready to Start Your Invisible Exit?</h2>
          <p className="text-body text-white/70 mb-8 max-w-xl mx-auto">
            Use the FYM Dashboard to work backwards from your freedom number, pressure-test your path, and stop guessing what your exit actually requires.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/freedom"
              onClick={() =>
                trackEvent("blog_article_cta_clicked", {
                  slug: post.slug,
                  source: "article_footer_freedom_calc",
                  category: post.category,
                })
              }
              className="btn-primary text-lg"
            >
              Calculate Your Freedom Number (Free)
            </Link>
            <Link
              to="/story"
              onClick={() =>
                trackEvent("blog_article_cta_clicked", {
                  slug: post.slug,
                  source: "article_footer_story",
                  category: post.category,
                })
              }
              className="btn-secondary text-lg border-white/20 text-white hover:bg-white/10"
            >
              Read My Full Story First
            </Link>
            <Link
              to="/blog"
              onClick={() =>
                trackEvent("blog_back_to_hub_clicked", {
                  slug: post.slug,
                  source: "article_footer_back_to_hub",
                })
              }
              className="btn-secondary text-lg border-white/20 text-white hover:bg-white/10"
            >
              Back to the blog hub
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <ExitIntentPopup />
    </div>
  );
};

export default BlogPost;
