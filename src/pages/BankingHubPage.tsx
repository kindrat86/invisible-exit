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
        title="Business Banking Guides — Best Banks for LLCs by State | Invisible Exit"
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
            <li>• Keep personal and business accounts strictly separate for liability protection.</li>
            <li>• Most online banks (Mercury, Relay, Novo) offer free checking with no minimum balance for LLCs.</li>
            <li>• Look for banks that offer free ACH transfers and QuickBooks integration to save on software costs.</li>
            <li>• If you need branch access, choose a national bank like Chase or Bank of America with local branches.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
