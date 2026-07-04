import { Link, useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { glossaryTerms } from "@/data/glossary";
import { blogPosts } from "@/data/blog-posts";

const GlossaryTermPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const term = glossaryTerms.find((t) => t.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!term) {
    return <Navigate to="/glossary" replace />;
  }

  const url = `https://invisibleexit.com/glossary/${term.slug}`;

  const related = (term.relatedTerms || [])
    .map((slug) => glossaryTerms.find((t) => t.slug === slug))
    .filter(Boolean);

  const jsonLdArray = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: term.term,
      description: term.definition,
      url,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Invisible Exit Glossary",
        url: "https://invisibleexit.com/glossary",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `What Is ${term.term}?`,
      description: term.definition,
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
        { "@type": "ListItem", position: 2, name: "Glossary", item: "https://invisibleexit.com/glossary" },
        { "@type": "ListItem", position: 3, name: term.term },
      ],
    },
    ...(term.faqs
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: term.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`What Is ${term.term}? Definition & Guide | Invisible Exit`}
        description={term.definition.slice(0, 155)}
        url={`/glossary/${term.slug}`}
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
        <div className="mx-auto max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-white/40 mb-6">
            <Link to="/" className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/glossary" className="hover:text-white/70 transition-colors">
              Glossary
            </Link>
            <span>/</span>
            <span className="text-white/60">{term.term}</span>
          </nav>
          <span className="text-[#60A5FA] text-xs font-semibold uppercase tracking-wide mb-4 block">
            {term.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            What Is {term.term}?
          </h1>
        </div>
      </section>

      {/* Definition box — featured-snippet optimized */}
      <section className="bg-blue-50 border-l-4 border-[#3B82F6] py-8 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-900 text-lg leading-relaxed font-medium">
            <strong>{term.term}:</strong> {term.definition}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {term.term} Explained
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">{term.detailed}</p>
          </div>

          {term.faqs && term.faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {term.faqs.map((faq, i) => (
                  <div key={i}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-12 border-t border-gray-200 pt-8">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                Related Terms
              </h3>
              <div className="flex flex-wrap gap-3">
                {related.map((r) => (
                  <Link
                    key={r!.slug}
                    to={`/glossary/${r!.slug}`}
                    className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    {r!.term}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Cross-links: related blog posts */}
      <section className="mx-auto max-w-3xl px-4 pb-8">
        <RelatedContent
          links={blogPosts
            .filter((p) => {
              const termLower = term!.term.toLowerCase();
              return p.title.toLowerCase().includes(termLower.slice(0, 8)) ||
                p.excerpt.toLowerCase().includes(termLower.slice(0, 8));
            })
            .slice(0, 4)
            .map((p) => ({ to: `/blog/${p.slug}`, title: p.title, description: p.excerpt }))}
          title="Articles Mentioning This Term"
        />
      </section>

      <Footer />
    </div>
  );
};

export default GlossaryTermPage;
