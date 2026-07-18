import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import InlineNewsletter from "@/components/InlineNewsletter";
import { glossaryTerms } from "@/data/glossary";

const GlossaryIndex = () => {
  const [query, setQuery] = useState("");

  // Group by category
  const cats = useMemo(() => {
    const filtered = query.trim()
      ? glossaryTerms.filter(
          (t) =>
            t.term.toLowerCase().includes(query.toLowerCase()) ||
            t.definition.toLowerCase().includes(query.toLowerCase())
        )
      : glossaryTerms;

    const groups: Record<string, typeof glossaryTerms> = {};
    for (const t of filtered) {
      (groups[t.category] = groups[t.category] || []).push(t);
    }
    return groups;
  }, [query]);

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

      <section className="bg-[#1B2A4A] pt-32 pb-12 px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            The Invisible Exit Glossary
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-6">
            Plain-English definitions of every term you need to build a side business
            while employed. From micro-SaaS to moonlighting clauses, stealth operations
            to freedom numbers.
          </p>
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search terms..."
              className="w-full bg-white rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-400 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Search glossary terms"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-4xl">
          {Object.keys(cats).length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No terms found for "{query}"</p>
              <button
                onClick={() => setQuery("")}
                className="mt-4 text-blue-600 hover:underline font-medium"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(cats).map(([cat, terms]) => (
                <div key={cat}>
                  <h2 className="text-sm font-bold text-[#3B82F6] uppercase tracking-wide mb-4">
                    {cat}
                  </h2>
                  <div className="grid gap-3">
                    {terms.map((t) => (
                      <Link
                        key={t.slug}
                        to={`/glossary/${t.slug}`}
                        className="group block bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#3B82F6] transition-colors">
                              {t.term}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                              {t.definition}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container-standard py-12">
        <InlineNewsletter source="glossary_index_footer" />
      </div>

      <Footer />
    </div>
  );
};

export default GlossaryIndex;
