import { Link } from "react-router-dom";
import { DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { taxGuides } from "@/data/tax-guides";

export default function TaxGuideHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Tax Guides by State — LLC & Side Business Taxes | Invisible Exit"
        description="State-by-state tax guides for side businesses and LLCs. Compare income tax rates, self-employment tax, sales tax, credits, deductions, and filing requirements for every state."
        url="https://invisibleexit.com/tax-guides"
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <span className="text-gray-800 font-medium">Tax Guides</span>
        </nav>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Tax Guides by State</h1>
          </div>
          <p className="text-xl text-gray-600">
            Understand your tax obligations as a side business or LLC owner in every state. Compare income tax rates, available credits, deductions, and quarterly filing requirements tailored to where you formed your business.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {taxGuides.map((guide) => (
            <Link
              key={guide.slug}
              to={`/tax-guides/${guide.slug}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900">{guide.stateName}</h2>
                <span className="text-sm font-mono text-gray-400">{guide.abbreviation}</span>
              </div>
              <p className="text-sm text-gray-500">
                Income tax: {guide.incomeTaxRate}
              </p>
            </Link>
          ))}
        </div>

        {/* General Tax Tips Section */}
        <div className="mt-12 bg-amber-50 rounded-xl p-6 border-l-4 border-amber-400">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Tax Tips for Side Businesses</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Set aside 25-30% of your side business income for taxes (federal self-employment + state income).</li>
            <li>• Make quarterly estimated tax payments to avoid underpayment penalties. Use IRS Form 1040-ES.</li>
            <li>• Track every business expense. The QBI deduction lets you deduct 20% of qualified business income.</li>
            <li>• Consider a SEP IRA — contributions are tax-deductible and grow tax-deferred until retirement.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
