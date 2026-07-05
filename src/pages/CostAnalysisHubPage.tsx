import { Link } from "react-router-dom";
import { DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { costAnalysisPages } from "@/data/cost-analysis";

export default function CostAnalysisHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Cost Analysis — How Much Does It Cost? | Invisible Exit"
        description="Realistic cost breakdowns for starting and running a micro-SaaS. From $0 to $2,500 — see exactly where every dollar goes."
        url="https://invisibleexit.com/cost-analysis"
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <span className="text-gray-800 font-medium">Cost Analysis</span>
        </nav>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Cost Analysis</h1>
          </div>
          <p className="text-xl text-gray-600">
            Realistic cost breakdowns for every stage of building a micro-SaaS. Know exactly where every dollar goes before you spend it.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {costAnalysisPages.map((page) => (
            <Link
              key={page.slug}
              to={`/cost-analysis/${page.slug}`}
              className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-2">{page.topic}</h2>
              <p className="text-gray-600 text-sm mb-3">{page.intro.substring(0, 120)}...</p>
              <div className="flex gap-3 text-xs">
                <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                  {page.totalRange}
                </span>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                  Typical: {page.typicalTotal}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
