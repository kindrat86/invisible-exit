import { useParams, Link } from "react-router-dom";
import { isItLegalPages } from "@/data/is-it-legal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

export default function IsItLegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = isItLegalPages.find((p) => p.slug === slug);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page not found</h1>
          <Link to="/blog" className="text-blue-600 hover:underline">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={data.metaTitle}
        description={data.metaDescription}
        url={`https://invisibleexit.com/is-it-legal/${data.slug}`}
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <Link to="/blog" className="text-blue-600 hover:underline">Resources</Link>
          {" › "}
          <span className="text-gray-800 font-medium">{data.topic}</span>
        </nav>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{data.h1}</h1>
          <p className="text-xl text-gray-600 mb-6">{data.intro}</p>
        </div>

        {/* Short Answer Box */}
        <section className="mb-10 bg-green-50 rounded-xl p-6 border-l-4 border-green-400">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Short Answer</h2>
          <p className="text-gray-700">{data.shortAnswer}</p>
        </section>

        {/* Details */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">In Detail</h2>
          <div className="space-y-3">
            {data.details.map((detail, i) => (
              <p key={i} className="text-gray-700 pl-4 border-l-2 border-gray-200">{detail}</p>
            ))}
          </div>
        </section>

        {/* Key Considerations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Considerations</h2>
          <div className="space-y-4">
            {data.keyConsiderations.map((item, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.item}</h3>
                <p className="text-gray-700">{item.explanation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* State Variations */}
        {data.stateVariations.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">State-by-State Breakdown</h2>
            <div className="space-y-3">
              {data.stateVariations.map((sv, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{sv.state}</h3>
                  <p className="text-gray-700 text-sm">{sv.rule}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-400">
              <Link to="/guides" className="text-blue-600 hover:underline">See all state guides</Link> for detailed breakdowns.
            </p>
          </section>
        )}

        {/* What to Do */}
        <section className="mb-12 bg-blue-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What You Should Do</h2>
          <ul className="space-y-2">
            {data.whatToDo.map((action, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-blue-600 font-bold">→</span>
                <span className="text-gray-700">{action}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-600 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Stay Legal, Build Freely</h2>
          <p className="text-blue-100 mb-6">Get the complete compliance playbook for employed founders. Know exactly what you can and cannot do.</p>
          <a
            href="/masterclass"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Get the Compliance Blueprint →
          </a>
        </section>
      </div>
      <Footer />
    </div>
  );
}
