import { useParams, Link } from "react-router-dom";
import { costAnalysisPages } from "@/data/cost-analysis";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

export default function CostAnalysisPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = costAnalysisPages.find((p) => p.slug === slug);

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
        url={`https://invisibleexit.com/cost-analysis/${data.slug}`}
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

          <div className="flex flex-wrap gap-4 text-sm mb-8">
            <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full font-medium">
              Total Range: {data.totalRange}
            </span>
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-medium">
              Typical: {data.typicalTotal}
            </span>
          </div>
        </div>

        {/* Cost Breakdown Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cost Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 uppercase">Item</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 uppercase">Range</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 uppercase">Typical</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 uppercase">Note</th>
                </tr>
              </thead>
              <tbody>
                {data.breakdown.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{item.item}</td>
                    <td className="py-3 px-4 text-gray-700">{item.range}</td>
                    <td className="py-3 px-4 text-gray-700">{item.typical}</td>
                    <td className="py-3 px-4 text-gray-500 text-sm">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* One-Time vs Recurring */}
        <section className="mb-12 bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">One-Time vs. Recurring Costs</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">One-Time</h3>
              <p className="text-gray-700">{data.oneTimeVsRecurring.oneTime}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Recurring</h3>
              <p className="text-gray-700">{data.oneTimeVsRecurring.recurring}</p>
            </div>
          </div>
        </section>

        {/* Saving Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Save Money</h2>
          <ul className="space-y-3">
            {data.savingTips.map((tip, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className="text-gray-700">{tip}</span>
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
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your Micro-SaaS?</h2>
          <p className="text-blue-100 mb-6">Get the exact blueprint founders use to build profitable side businesses without quitting their jobs.</p>
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
