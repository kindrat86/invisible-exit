import { Link } from "react-router-dom";
import { HeartHandshake } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { insuranceGuides } from "@/data/insurance";

export default function InsuranceHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Side Business Insurance by State — LLC Insurance Guides | Invisible Exit"
        description="State-by-state insurance guides for side businesses and LLCs. Compare requirements for general liability, workers' comp, professional liability, and cyber insurance across all 50 states plus DC."
        url="https://invisibleexit.com/insurance"
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <span className="text-gray-800 font-medium">Insurance Guides</span>
        </nav>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <HeartHandshake className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Insurance Guides by State</h1>
          </div>
          <p className="text-xl text-gray-600">
            The right insurance coverage for your side business or LLC, state by state. General
            liability, workers' compensation, professional liability, and cyber insurance requirements
            and cost estimates.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {insuranceGuides.map((guide) => (
            <Link
              key={guide.slug}
              to={`/insurance/${guide.slug}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900">{guide.stateName}</h2>
                <span className="text-sm font-mono text-gray-400">{guide.abbreviation}</span>
              </div>
              <p className="text-sm text-gray-500">
                {guide.workersCompRequired ? "WC required" : "No WC for solo founders"}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-amber-50 rounded-xl p-6 border-l-4 border-amber-400">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Insurance Tips for Side Businesses</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• General liability insurance ($30–50/month) is the minimum — most commercial leases and contracts require it.</li>
            <li>• If you build software (SaaS, apps), add professional liability (E&O) — it covers coding errors that cost clients money.</li>
            <li>• Store customer data? Cyber liability insurance ($40–150/month) covers breach response and legal defense.</li>
            <li>• Workers' comp laws vary significantly by state. Know your state's threshold before hiring your first employee.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
