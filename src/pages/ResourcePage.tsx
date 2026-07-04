import { useParams, Link } from "react-router-dom";
import { resources } from "@/data/resources";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

export default function ResourcePage() {
  const { slug } = useParams<{ slug: string }>();
  const resource = resources.find((r) => r.slug === slug);

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Resource not found</h1>
          <Link to="/resources" className="text-blue-600 hover:underline">← Browse all resources</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={resource.metaTitle}
        description={resource.metaDescription}
        canonical={`https://invisibleexit.com/resources/${resource.slug}`}
        ogImage={`https://invisibleexit.com/og-image.png`}
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <Link to="/resources" className="text-blue-600 hover:underline">Resources</Link>
          {" › "}
          <span>{resource.title}</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{resource.h1}</h1>
        <p className="text-xl text-gray-600 mb-12">{resource.intro}</p>

        {/* Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">The {resource.steps.length}-Step Process</h2>
          <div className="space-y-4">
            {resource.steps.map((step, i) => (
              <div key={i} className="flex gap-4 border-l-2 border-blue-200 pl-4">
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                    {i + 1}
                  </span>
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <h3 className="font-bold text-gray-900">{step.title}</h3>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{step.timeRequired}</span>
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">{step.category}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended Tools</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-4 py-3 text-left">Tool</th>
                  <th className="px-4 py-3 text-left">Purpose</th>
                  <th className="px-4 py-3 text-left">Cost</th>
                </tr>
              </thead>
              <tbody>
                {resource.tools.map((tool, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-900">{tool.name}</td>
                    <td className="px-4 py-3 text-gray-700">{tool.purpose}</td>
                    <td className="px-4 py-3 text-gray-700">{tool.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Common mistakes */}
        <section className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-12">
          <h2 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3">Common Mistakes to Avoid</h2>
          <ul className="space-y-2">
            {resource.commonMistakes.map((mistake, i) => (
              <li key={i} className="text-gray-800">✗ {mistake}</li>
            ))}
          </ul>
        </section>

        {/* Success metrics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Success Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resource.successMetrics.map((m, i) => (
              <div key={i} className="bg-green-50 rounded-lg p-4 flex justify-between items-center">
                <span className="text-gray-700">{m.metric}</span>
                <span className="font-bold text-green-600">{m.target}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        {resource.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs</h2>
            <div className="space-y-6">
              {resource.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Other resources */}
        <section className="border-t pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Other Resources</h2>
          <div className="flex flex-wrap gap-2">
            {resources.filter((r) => r.slug !== resource.slug).map((r) => (
              <Link
                key={r.slug}
                to={`/resources/${r.slug}`}
                className="px-3 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg text-sm transition-colors"
              >
                {r.title}
              </Link>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
