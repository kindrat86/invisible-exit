import { useParams, Link } from "react-router-dom";
import { howToGuides } from "@/data/how-to-guides";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

export default function HowToGuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const data = howToGuides.find((p) => p.slug === slug);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Guide not found</h1>
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
        url={`https://invisibleexit.com/how-to/${data.slug}`}
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
          <p className="text-xl text-gray-600 mb-4">{data.intro}</p>
        </div>

        {/* Why This Matters */}
        <section className="mb-10 bg-amber-50 rounded-xl p-6 border-l-4 border-amber-400">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Why This Matters</h2>
          <p className="text-gray-700">{data.whyThisMatters}</p>
        </section>

        {/* Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Guide</h2>
          <div className="space-y-6">
            {data.steps.map((step, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.name}</h3>
                    <p className="text-gray-700 mb-3">{step.description}</p>
                    {step.tools && step.tools.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-gray-400 font-medium">Tools:</span>
                        {step.tools.map((tool, j) => (
                          <span key={j} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{tool}</span>
                        ))}
                      </div>
                    )}
                    {step.timeEstimate && (
                      <p className="mt-2 text-sm text-gray-400">
                        ⏱ {step.timeEstimate}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pro Tips */}
        <section className="mb-12 bg-blue-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pro Tips</h2>
          <ul className="space-y-2">
            {data.proTips.map((tip, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-blue-600 font-bold">→</span>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Common Mistakes */}
        <section className="mb-12 bg-red-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Common Mistakes to Avoid</h2>
          <ul className="space-y-2">
            {data.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-red-500 font-bold">✗</span>
                <span className="text-gray-700">{mistake}</span>
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
          <h2 className="text-2xl font-bold text-white mb-4">Follow This Blueprint</h2>
          <p className="text-blue-100 mb-6">Get the step-by-step playbook used by 500+ employed founders to build profitable micro-SaaS businesses.</p>
          <a
            href="/masterclass"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Get the Blueprint →
          </a>
        </section>
      </div>
      <Footer />
    </div>
  );
}
