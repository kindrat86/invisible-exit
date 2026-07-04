import { useParams, Link } from "react-router-dom";
import { dataReports } from "@/data/data-reports";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

export default function DataReportPage() {
  const { report } = useParams<{ report: string }>();
  const data = dataReports.find((r) => r.slug === report);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Report not found</h1>
          <Link to="/data" className="text-blue-600 hover:underline">← Browse all reports</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={data.metaTitle}
        description={data.metaDescription}
        canonical={`https://invisibleexit.com/data/${data.slug}`}
        ogImage={`https://invisibleexit.com/og-image.png`}
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <Link to="/data" className="text-blue-600 hover:underline">Research & Data</Link>
          {" › "}
          <span>{data.title}</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{data.h1}</h1>
        <p className="text-xl text-gray-600 mb-8">{data.intro}</p>

        {/* Methodology */}
        <section className="bg-gray-50 rounded-lg p-6 mb-12">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Methodology</h2>
          <p className="text-gray-700 text-sm">{data.methodology}</p>
        </section>

        {/* Key data points */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.dataPoints.map((dp, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">{dp.metric}</p>
                <p className="text-3xl font-bold text-blue-600 mb-1">{dp.value}</p>
                <p className="text-xs text-gray-500">{dp.context}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key findings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Findings</h2>
          <ul className="space-y-3">
            {data.keyFindings.map((finding, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 text-blue-600 font-bold">{i + 1}.</span>
                <span className="text-gray-700">{finding}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Data tables */}
        {data.tables.map((table, i) => (
          <section key={i} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{table.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    {table.headers.map((h, j) => (
                      <th key={j} className="px-4 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, j) => (
                    <tr key={j} className="border-b border-gray-200 hover:bg-gray-50">
                      {row.map((cell, k) => (
                        <td key={k} className="px-4 py-3 text-gray-700">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {/* Takeaways */}
        <section className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 mb-12">
          <h2 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-3">Actionable Takeaways</h2>
          <ul className="space-y-2">
            {data.takeaways.map((t, i) => (
              <li key={i} className="text-gray-800">✓ {t}</li>
            ))}
          </ul>
        </section>

        {/* FAQs */}
        {data.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs</h2>
            <div className="space-y-6">
              {data.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Citation note */}
        <section className="border-t pt-8">
          <p className="text-sm text-gray-500">
            <strong>Cite this report:</strong> Invisible Exit. "{data.title}." {new Date().getFullYear()}.
            Available at https://invisibleexit.com/data/{data.slug}
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
