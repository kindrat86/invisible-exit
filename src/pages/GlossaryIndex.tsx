import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { glossaryTerms } from "@/data/glossary";

const GlossaryIndex = () => {
  // Group by category
  const cats: Record<string, typeof glossaryTerms> = {};
  for (const t of glossaryTerms) {
    (cats[t.category] = cats[t.category] || []).push(t);
  }

  const jsonLdArray = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      name: "Invisible Exit Glossary",
      description:
        "Definitions of key terms for building anonymous side businesses, micro-SaaS, and invisible exits. Designed for corporate managers.",
      url: "https://invisibleexit.com/glossary",
      hasDefinedTerm: glossaryTerms.map((t) => ({
        "@type": "DefinedTerm",
        name: t.term,
        url: `https://invisibleexit.com/glossary/${t.slug}`,
      })),
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Glossary: Side Business, Micro-SaaS & Invisible Exit Terms | Invisible Exit"
        description="Plain-English definitions of micro-SaaS, recurring revenue, stealth operations, non-compete clauses, freedom numbers, and more. A reference for employed founders."
        url="/glossary"
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            The Invisible Exit Glossary
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Plain-English definitions of every term you need to build a side business
            while employed. From micro-SaaS to moonlighting clauses, stealth operations
            to freedom numbers.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-4xl space-y-12">
          {Object.entries(cats).map(([cat, terms]) => (
            <div key={cat}>
              <h2 className="text-sm font-bold text-[#3B82F6] uppercase tracking-wide mb-4">
                {cat}
              </h2>
              <div className="space-y-6">
                {terms.map((t) => (
                  <div key={t.slug} className="border-b border-gray-100 pb-6 last:border-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      <Link
                        to={`/glossary/${t.slug}`}
                        className="hover:text-[#3B82F6] transition-colors"
                      >
                        {t.term}
                      </Link>
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{t.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GlossaryIndex;
