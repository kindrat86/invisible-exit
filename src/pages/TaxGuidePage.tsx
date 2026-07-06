import { useParams, Link } from "react-router-dom";
import { taxGuides } from "@/data/tax-guides";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";

export default function TaxGuidePage() {
  const { state } = useParams<{ state: string }>();
  const guide = taxGuides.find((g) => g.slug === state);

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tax guide not found</h1>
          <Link to="/tax-guides" className="text-blue-600 hover:underline">← Browse all tax guides</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`Tax Guide for ${guide.stateName} — LLC & Side Business Taxes | Invisible Exit`}
        description={`Complete tax guide for side businesses and LLCs in ${guide.stateName}. Income tax rate: ${guide.incomeTaxRate}. Sales tax: ${guide.salesTaxNote}. Credits, deductions, filing deadlines.`}
        url={`https://invisibleexit.com/tax-guides/${guide.slug}`}
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <Link to="/tax-guides" className="text-blue-600 hover:underline">Tax Guides</Link>
          {" › "}
          <span>{guide.stateName}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tax Guide for Side Businesses in {guide.stateName}
          </h1>
          <p className="text-xl text-gray-600">
            Understand your tax obligations as a side business or LLC owner in {guide.stateName}. Income tax rates, self-employment tax, sales tax, credits, and deductions.
          </p>
        </div>

        {/* Key Tax Info */}
        <section className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Income Tax Rate</h3>
            <p className="text-2xl font-bold text-gray-900">{guide.incomeTaxRate}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Sales Tax</h3>
            <p className="text-2xl font-bold text-gray-900">{guide.salesTaxNote}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Self-Employment Tax</h3>
            <p className="text-sm text-gray-700 mt-1">{guide.selfEmploymentTaxNote}</p>
          </div>
        </section>

        {/* Estimated Tax Burden */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Estimated Tax Burden</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Revenue</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Total Rate</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Est. Tax</th>
                </tr>
              </thead>
              <tbody>
                {guide.estimatedTaxBurden.map((row, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-gray-900 font-medium">{row.revenue}</td>
                    <td className="px-4 py-3 text-gray-700">{row.totalRate}</td>
                    <td className="px-4 py-3 text-gray-700">{row.estimatedTax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Available Credits */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Credits & Deductions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {guide.availableCredits.slice(0, 6).map((credit, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2">{credit.name}</h3>
                <p className="text-sm text-gray-600">{credit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Deductions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Business Deductions</h2>
          <ul className="space-y-2">
            {guide.deductions.map((d, i) => (
              <li key={i} className="flex gap-2 text-gray-700">
                <span className="text-green-500 flex-shrink-0">✓</span>
                {d}
              </li>
            ))}
          </ul>
        </section>

        {/* Filing Info */}
        <section className="mb-12 bg-blue-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filing Deadlines & Quarterly Payments</h2>
          <div className="space-y-3">
            <p className="text-gray-700"><strong>Deadlines:</strong> {guide.filingDeadlines}</p>
            <p className="text-gray-700"><strong>Quarterly Payments:</strong> {guide.quarterlyPaymentInfo}</p>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs About Taxes in {guide.stateName}</h2>
          <div className="space-y-4">
            {guide.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Browse other states */}
        <section className="border-t pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Browse Other States</h2>
          <div className="flex flex-wrap gap-2">
            {taxGuides.filter((g) => g.slug !== guide.slug).slice(0, 12).map((g) => (
              <Link
                key={g.slug}
                to={`/tax-guides/${g.slug}`}
                className="px-3 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg text-sm transition-colors"
              >
                {g.stateName}
              </Link>
            ))}
          </div>
        </section>

        {/* Related Content */}
        <RelatedContent
          links={[
            { to: "/guides", title: "State-by-State LLC Guides", description: "Filing fees, non-competes, and taxes" },
            { to: "/banking", title: "Business Banking by State", description: "Best bank accounts for your LLC" },
            { to: "/how-to/set-up-an-anonymous-banking-setup", title: "Anonymous Banking Setup", description: "Privacy-first banking" },
            { to: "/resources/micro-saas-launch-checklist", title: "30-Step Launch Checklist", description: "Go from idea to launched" },
          ]}
          title="Related Resources"
        />
      </div>
      <Footer />
    </div>
  );
}
