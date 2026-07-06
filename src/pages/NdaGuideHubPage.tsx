import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ndaGuides } from "@/data/nda-guides";

const ENFORCEMENT_EMOJIS: Record<string, string> = {
  strong: "🔴",
  moderate: "🟡",
  weak: "🟢",
  varies: "⚪",
};

export default function NdaGuideHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="NDA & Non-Compete Guides by State — Side Business Legal Guide | Invisible Exit"
        description="State-by-state NDA and non-compete guides for side businesses. Understand enforceability, what to check in your employment agreement, and how NDAs affect your side business in every state."
        url="https://invisibleexit.com/nda-guides"
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <span className="text-gray-800 font-medium">NDA Guides</span>
        </nav>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">NDA & Non-Compete Guides by State</h1>
          </div>
          <p className="text-xl text-gray-600">
            State-by-state guides to help you understand how NDAs and non-competes affect your side business. Check enforceability, review what to look for in your employment agreement, and know your rights.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {ndaGuides.map((guide) => (
            <Link
              key={guide.slug}
              to={`/nda-guides/${guide.slug}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900">{guide.stateName}</h2>
                <span className="text-sm font-mono text-gray-400">{guide.abbreviation}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{ENFORCEMENT_EMOJIS[guide.ndaEnforceability]}</span>
                <span className="text-sm text-gray-500 capitalize">{guide.ndaEnforceability} enforceability</span>
              </div>
            </Link>
          ))}
        </div>

        {/* General NDA Tips Section */}
        <div className="mt-12 bg-amber-50 rounded-xl p-6 border-l-4 border-amber-400">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Quick NDA Tips for Side Businesses</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• NDAs protect confidential information, not competition. They generally can't stop you from competing in a different industry.</li>
            <li>• Review the "confidential information" definition in your NDA — overly broad definitions can be challenged in court.</li>
            <li>• Never use employer equipment, data, or time for your side business — this weakens your NDA defense significantly.</li>
            <li>• Consider forming an LLC in a different state than your employer to add an extra layer of legal separation.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
