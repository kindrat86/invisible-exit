import { Link, useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { comparisons, type ComparisonData } from "@/data/comparisons";
import { blogPosts } from "@/data/blog-posts";
import { trackEvent } from "@/lib/analytics";

function ComparisonTable({ data }: { data: ComparisonData }) {
  return (
    <div className="comp-table-wrap">
      {/* Desktop: traditional table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Criteria
              </th>
              <th className="text-left py-4 px-4 text-base font-bold text-gray-900">
                {data.optionA}
              </th>
              <th className="text-left py-4 px-4 text-base font-bold text-gray-900">
                {data.optionB}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.table.map((row, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-3 px-4 text-sm font-medium text-gray-700">
                  {row.criteria}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {row.optionA}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {row.optionB}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked card layout */}
      <div className="sm:hidden space-y-3">
        {data.table.map((row, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{row.criteria}</p>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-start gap-3 px-4 py-3">
                <span className="flex-shrink-0 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md min-w-[70px] text-center">
                  {data.optionA}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{row.optionA}</p>
              </div>
              <div className="flex items-start gap-3 px-4 py-3">
                <span className="flex-shrink-0 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md min-w-[70px] text-center">
                  {data.optionB}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{row.optionB}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ComparePage = () => {
  const { vs } = useParams<{ vs: string }>();
  const data = comparisons.find((c) => c.slug === vs);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [vs]);

  if (!data) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPost = data.relatedSlug
    ? blogPosts.find((p) => p.slug === data.relatedSlug)
    : undefined;

  const url = `https://invisibleexit.com/compare/${data.slug}`;

  const jsonLdArray = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.h1,
      description: data.metaDescription,
      url,
      author: {
        "@type": "Person",
        name: "Adrian",
        url: "https://invisibleexit.com",
      },
      publisher: {
        "@type": "Organization",
        name: "Invisible Exit",
        url: "https://invisibleexit.com",
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://invisibleexit.com/" },
        { "@type": "ListItem", position: 2, name: "Comparisons", item: "https://invisibleexit.com/compare" },
        { "@type": "ListItem", position: 3, name: data.h1 },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title={data.metaTitle}
        description={data.metaDescription}
        url={`/compare/${data.slug}`}
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
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white/90 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/80">{data.h1}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {data.h1}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">{data.intro}</p>
        </div>
      </section>

      {/* TL;DR Summary Box — optimized for featured snippets */}
      <section className="bg-blue-50 border-l-4 border-[#3B82F6] py-8 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-sm font-bold text-[#3B82F6] uppercase tracking-wide mb-3">
            Quick Answer
          </h2>
          <p className="text-gray-900 text-lg leading-relaxed font-medium">
            {data.summary}
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {data.optionA} vs. {data.optionB}: Side-by-Side
          </h2>
          <p className="text-gray-500 mb-8">
            How {data.optionA} and {data.optionB} compare across the criteria that matter for corporate managers.
          </p>
          <ComparisonTable data={data} />
        </div>
      </section>

      {/* Verdicts */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="mx-auto max-w-4xl grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Choose {data.optionA} if…
            </h3>
            <p className="text-gray-600 leading-relaxed">{data.verdictA}</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Choose {data.optionB} if…
            </h3>
            <p className="text-gray-600 leading-relaxed">{data.verdictB}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {data.faqs.length > 0 && (
        <section className="bg-white py-16 px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {data.faqs.map((faq, i) => (
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

      {/* Related article */}
      {relatedPost && (
        <section className="bg-[#1B2A4A] py-12 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-white/50 text-sm mb-2">Related deep dive</p>
            <h3 className="text-xl font-bold text-white mb-4">
              {relatedPost.title}
            </h3>
            <p className="text-white/70 mb-6">{relatedPost.excerpt}</p>
            <Link
              to={`/blog/${relatedPost.slug}`}
              className="inline-block bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              onClick={() =>
                trackEvent("blog_article_cta_clicked", {
                  slug: relatedPost.slug,
                  source: "comparison_related",
                })
              }
            >
              Read the full article
            </Link>
          </div>
        </section>
      )}

      {/* Other comparisons */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="mx-auto max-w-4xl">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Other comparisons
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {comparisons
              .filter((c) => c.slug !== data.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  to={`/compare/${c.slug}`}
                  className="block bg-white p-5 rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="text-[#3B82F6] font-semibold text-sm">
                    {c.optionA} vs. {c.optionB}
                  </span>
                  <p className="text-gray-600 text-sm mt-1">{c.summary.slice(0, 120)}…</p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ComparePage;
