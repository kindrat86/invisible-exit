import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getBlogPostBySlug, blogPosts } from "@/data/blog-posts";

function renderInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong class='text-gray-900'>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' class='text-[#3B82F6] hover:underline'>$1</a>");
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Build JSON-LD array
  const jsonLdArray: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      url: `https://invisibleexit.com/blog/${post.slug}`,
      datePublished: post.publishedAt,
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

  // Resolve related posts
  const relatedPosts = (post.relatedSlugs || [])
    .map((s) => blogPosts.find((p) => p.slug === s))
    .filter(Boolean);

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${post.title} | Invisible Exit Blog`}
        description={post.excerpt}
        url={`/blog/${post.slug}`}
        type="article"
        publishedDate={post.publishedAt}
        modifiedDate={post.publishedAt}
      />
      {/* JSON-LD rendered in body for prerender compatibility (Google supports body JSON-LD) */}
      {jsonLdArray.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <Navbar />

      {/* Header */}
      <section className="bg-[#1B2A4A] pt-32 pb-16 px-6">
        <div className="mx-auto max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-white/40 mb-6">
            <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-white/70 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/60 truncate max-w-[200px]">{post.title}</span>
          </nav>
          <span className="block text-[#60A5FA] text-xs font-semibold uppercase tracking-wide mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-white/50 text-sm">
            <span>By Adrian</span>
            <span>&middot;</span>
            <span>{post.readTime}</span>
            <span>&middot;</span>
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

      {/* Content */}
      <section className="bg-white py-16 px-6">
        <article className="mx-auto max-w-3xl prose prose-lg prose-gray prose-headings:text-gray-900 prose-a:text-[#3B82F6] prose-strong:text-gray-900">
          {post.content.split("\n\n").flatMap((block, i) => {
            const lines = block.split("\n");
            const listStart = lines.findIndex((l) => l.match(/^[-\d]/) || l.startsWith("- ["));
            if (listStart > 0 && !block.startsWith("|") && !block.startsWith("#")) {
              const textPart = lines.slice(0, listStart).join("\n");
              const listPart = lines.slice(listStart).join("\n");
              return [
                { key: `${i}a`, block: textPart },
                { key: `${i}b`, block: listPart },
              ];
            }
            return [{ key: String(i), block }];
          }).map(({ key: k, block }) => {
            if (block.startsWith("## ")) {
              return (
                <h2 key={k} className="text-2xl font-bold mt-10 mb-4">
                  {block.replace("## ", "")}
                </h2>
              );
            }
            if (block.startsWith("### ")) {
              return (
                <h3 key={k} className="text-xl font-semibold mt-8 mb-3">
                  {block.replace("### ", "")}
                </h3>
              );
            }
            if (block.startsWith("| ")) {
              const rows = block.split("\n").filter((r) => !r.match(/^\|\s*[-|]+\s*\|$/));
              if (rows.length === 0) return null;
              const header = rows[0].split("|").filter(Boolean).map((c) => c.trim());
              const body = rows.slice(1).map((r) =>
                r.split("|").filter(Boolean).map((c) => c.trim())
              );
              return (
                <div key={k} className="overflow-x-auto my-6">
                  <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50">
                        {header.map((h, j) => (
                          <th key={j} className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {body.map((row, ri) => (
                        <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-4 py-3 text-gray-600 border-b border-gray-100">
                              {cell}
                            </td>
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
                <ul key={k} className="space-y-2 my-4 pl-2">
                  {items.map((item, j) => {
                    const checked = item.startsWith("- [x]");
                    const text = item.replace(/^- \[.\]\s*/, "");
                    return (
                      <li key={j} className="flex items-start gap-2 text-gray-600">
                        <input type="checkbox" checked={checked} readOnly className="mt-1.5" />
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
                <ul key={k} className="list-disc pl-6 space-y-2 my-4">
                  {items.map((item, j) => {
                    const text = item.replace(/^-\s+/, "");
                    return (
                      <li key={j} className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{
                        __html: renderInlineMarkdown(text),
                      }} />
                    );
                  })}
                </ul>
              );
            }
            if (block.match(/^\d+\.\s/)) {
              const items = block.split("\n").filter(Boolean);
              return (
                <ol key={k} className="list-decimal pl-6 space-y-2 my-4">
                  {items.map((item, j) => {
                    const text = item.replace(/^\d+\.\s+/, "");
                    return (
                      <li key={j} className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{
                        __html: renderInlineMarkdown(text),
                      }} />
                    );
                  })}
                </ol>
              );
            }
            return (
              <p key={k} className="text-gray-600 leading-relaxed my-4" dangerouslySetInnerHTML={{
                __html: renderInlineMarkdown(block),
              }} />
            );
          })}
        </article>
      </section>

      {/* FAQ Section */}
      {post.faqs && post.faqs.length > 0 && (
        <section className="bg-white pb-16 px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {post.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-gray-900 font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16 px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related!.slug}
                  to={`/blog/${related!.slug}`}
                  className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow group"
                >
                  <span className="text-[#60A5FA] text-xs font-semibold uppercase tracking-wide mb-3">
                    {related!.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#3B82F6] transition-colors">
                    {related!.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">
                    {related!.excerpt}
                  </p>
                  <span className="text-gray-400 text-xs mt-4">{related!.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Invisible Exit?
          </h2>
          <p className="text-gray-600 mb-8">
            Track your progress from $0 to financial independence with the FYM
            Dashboard.
          </p>
          <Link
            to="/?checkout=starter"
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

export default BlogPost;
