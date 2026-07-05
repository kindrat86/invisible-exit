import { useParams, Link } from "react-router-dom";
import { bestToolsLists } from "@/data/best-tools";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArrowRight, Star } from "lucide-react";

export default function BestToolsPage() {
  const { category } = useParams<{ category: string }>();

  // No category = show directory index of all tool lists
  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <SEOHead
          title="Best AI Tools for Building Micro-SaaS | Invisible Exit"
          description="Curated tool guides for solo founders building micro-SaaS businesses. Compare the best no-code, AI, and automation tools."
          url="https://invisibleexit.com/best"
          image="https://invisibleexit.com/og-image.png"
        />
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <nav className="text-sm text-gray-500 mb-8">
            <Link to="/" className="text-blue-600 hover:underline">Home</Link>
            {" › "}
            <span>Best Tools</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Best Tools for Building Micro-SaaS
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Curated guides comparing the best tools for solo founders and side-business builders. Each guide includes pricing, pros, cons, and recommendations.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {bestToolsLists.map((list) => (
              <Link
                key={list.slug}
                to={`/best/${list.slug}`}
                className="group block border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {list.title}
                  </h2>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{list.intro}</p>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-500">{list.tools.length} tools reviewed</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const list = bestToolsLists.find((l) => l.slug === category);

  if (!list) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Navbar />
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Tool list not found</h1>
          <p className="text-gray-600 mb-6">This guide doesn't exist or may have moved.</p>
          <Link to="/best" className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium">
            ← Browse all tool guides
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={list.metaTitle}
        description={list.metaDescription}
        url={`https://invisibleexit.com/best/${list.slug}`}
        image={`https://invisibleexit.com/og-image.png`}
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <Link to="/best" className="text-blue-600 hover:underline">Best Tools</Link>
          {" › "}
          <span>{list.title}</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{list.h1}</h1>
        <p className="text-xl text-gray-600 mb-12">{list.intro}</p>

        {/* Tool cards */}
        <div className="space-y-6 mb-12">
          {list.tools.map((tool, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {tool.name}
                    <span className="text-yellow-400">{"★".repeat(Math.round(tool.rating))}<span className="text-gray-300">{"★".repeat(5 - Math.round(tool.rating))}</span></span>
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">{tool.bestFor}</p>
                </div>
                <span className="flex-shrink-0 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold whitespace-nowrap">
                  {tool.pricing}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-green-600 mb-2">✓ Pros</p>
                  <ul className="space-y-1">
                    {tool.pros.map((pro, j) => (
                      <li key={j} className="text-sm text-gray-700">• {pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-600 mb-2">✗ Cons</p>
                  <ul className="space-y-1">
                    {tool.cons.map((con, j) => (
                      <li key={j} className="text-sm text-gray-700">• {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buying guide */}
        <section className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-12">
          <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wider mb-2 text-sm">How to Choose</h2>
          <p className="text-gray-800">{list.buyingGuide}</p>
        </section>

        {/* FAQs */}
        {list.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs</h2>
            <div className="space-y-6">
              {list.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Other lists */}
        <section className="border-t pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Other Tool Guides</h2>
          <div className="flex flex-wrap gap-2">
            {bestToolsLists.filter((l) => l.slug !== list.slug).map((l) => (
              <Link
                key={l.slug}
                to={`/best/${l.slug}`}
                className="px-3 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg text-sm transition-colors"
              >
                {l.title}
              </Link>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
