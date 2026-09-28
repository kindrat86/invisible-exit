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
        title="Tax Guides by State, LLC & Side Business Taxes | Invisible Exit"
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
            <li>• Pay estimated taxes quarterly if you expect to owe at least $1,000 for the year, after withholding and refundable credits.</li>
            <li>• The safe harbors: pay 90% of this year's tax, or 100% of last year's (110% if your prior-year AGI topped $150,000), whichever is smaller.</li>
            <li>• Self-employment tax is Social Security and Medicare for people who work for themselves, and it applies to your net side-business profit.</li>
            <li>• The QBI deduction lets many side-business owners deduct up to 20% of qualified business income, subject to income limits and other rules.</li>
          </ul>
          <p className="mt-3 text-xs text-gray-500">
            Sources: <a href="https://www.irs.gov/pub/irs-pdf/f1040es.pdf" className="underline">IRS Form 1040-ES (2026)</a> ($1,000 threshold and safe harbors), <a href="https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes" className="underline">IRS: self-employment tax</a>, and <a href="https://www.law.cornell.edu/uscode/text/26/199A" className="underline">26 U.S.C. § 199A</a> (QBI). Last verified 2026-09-28.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
