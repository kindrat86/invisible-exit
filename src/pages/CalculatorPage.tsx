import { useParams, Link } from "react-router-dom";
import { calculators } from "@/data/calculators";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

export default function CalculatorPage() {
  const { name } = useParams<{ name: string }>();
  const calc = calculators.find((c) => c.slug === name);

  if (!calc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Calculator not found</h1>
          <Link to="/calculators" className="text-blue-600 hover:underline">← Browse all calculators</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={calc.metaTitle}
        description={calc.metaDescription}
        canonical={`https://invisibleexit.com/calculators/${calc.slug}`}
        ogImage={`https://invisibleexit.com/og-image.png`}
      />
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <Link to="/calculators" className="text-blue-600 hover:underline">Calculators</Link>
          {" › "}
          <span>{calc.title}</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{calc.h1}</h1>
        <p className="text-xl text-gray-600 mb-12">{calc.intro}</p>

        {/* Calculator widget placeholder */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-12 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-md mx-auto">
            {calc.inputs.map((input) => (
              <div key={input.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{input.label}</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    defaultValue={input.default}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold"
                  />
                  {input.suffix && <span className="ml-1 text-sm text-gray-500">{input.suffix}</span>}
                </div>
              </div>
            ))}
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Calculate
          </button>
          <p className="mt-4 text-sm text-gray-500">{calc.resultLabel}</p>
          <p className="text-3xl font-bold text-blue-600">
            {calc.example.result.split(".")[0]}
          </p>
        </div>

        {/* Formula */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">The Formula</h2>
          <code className="block bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">{calc.formula}</code>
        </section>

        {/* Example */}
        <section className="mb-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Example</h2>
          <p className="text-gray-800 mb-2">{calc.example.scenario}</p>
          <p className="font-semibold text-gray-900">{calc.example.result}</p>
        </section>

        {/* Explanation */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How This Works</h2>
          <p className="text-gray-700 leading-relaxed">{calc.explanation}</p>
        </section>

        {/* FAQs */}
        {calc.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs</h2>
            <div className="space-y-6">
              {calc.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related calculators */}
        {calc.relatedCalculators.length > 0 && (
          <section className="border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Calculators</h2>
            <div className="flex flex-wrap gap-2">
              {calc.relatedCalculators.map((slug) => {
                const c = calculators.find((c) => c.slug === slug);
                return c ? (
                  <Link
                    key={slug}
                    to={`/calculators/${slug}`}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg text-sm transition-colors"
                  >
                    {c.h1}
                  </Link>
                ) : null;
              })}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
