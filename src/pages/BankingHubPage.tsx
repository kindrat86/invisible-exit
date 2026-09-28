import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { bankingGuides } from "@/data/banking";

export default function BankingHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Business Banking Guides, Best Banks for LLCs by State | Invisible Exit"
        description="State-by-state business banking guides for LLCs and side businesses. Compare local and online banks, fees, features, and business checking options for every state."
        url="https://invisibleexit.com/banking"
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <span className="text-gray-800 font-medium">Banking Guides</span>
        </nav>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Business Banking by State</h1>
          </div>
          <p className="text-xl text-gray-600">
            The best business bank accounts for your LLC, ranked by state. Compare recommended banks, online banking options, fees, and features tailored to where you formed your business.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {bankingGuides.map((guide) => (
            <Link
              key={guide.slug}
              to={`/banking/${guide.slug}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900">{guide.stateName}</h2>
                <span className="text-sm font-mono text-gray-400">{guide.abbreviation}</span>
              </div>
              <p className="text-sm text-gray-500">
                {guide.recommendedBanks.length} recommended banks
              </p>
            </Link>
          ))}
        </div>

        {/* General Banking Tips Section */}
        <div className="mt-12 bg-amber-50 rounded-xl p-6 border-l-4 border-amber-400">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Tips for Business Banking</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Keep personal and business accounts strictly separate. Clean separation is what preserves your LLC's liability shield, and it makes tax time far simpler.</li>
            <li>• An EIN from the IRS is free and issued online in minutes. Get one before you open the account so it sits under your business's tax ID, not your personal one.</li>
            <li>• FDIC deposit insurance protects at least $250,000 at each FDIC-insured bank. If your operating balance can cross that line, spread it across more than one bank.</li>
            <li>• Compare what you will actually pay: monthly fees, transaction limits, wire costs, and whether the bank exports cleanly to your bookkeeping.</li>
          </ul>
          <p className="mt-3 text-xs text-gray-500">
            Sources: <a href="https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number" className="underline">IRS: Get an EIN</a> (free, issued online) and <a href="https://www.fdic.gov/deposit-insurance" className="underline">FDIC deposit insurance</a> (at least $250,000 at each insured bank). Last verified 2026-09-28.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
