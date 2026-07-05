import { Link } from "react-router-dom";
import { Scale } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { isItLegalPages } from "@/data/is-it-legal";

export default function IsItLegalHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Is It Legal? — Side Business Legal Concerns | Invisible Exit"
        description="Clear, factual answers to the legal questions employed founders ask. Non-competes, IP assignment, moonlighting rules, and state-by-state variations."
        url="https://invisibleexit.com/is-it-legal"
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <span className="text-gray-800 font-medium">Legal Concerns</span>
        </nav>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Is It Legal?</h1>
          </div>
          <p className="text-xl text-gray-600">
            The #1 anxiety for employed founders, answered. Clear, factual guidance on the legal questions that keep you up at night. Not legal advice — but a starting point.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {isItLegalPages.map((page) => (
            <Link
              key={page.slug}
              to={`/is-it-legal/${page.slug}`}
              className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-2">{page.topic}</h2>
              <p className="text-gray-600 text-sm mb-3">{page.shortAnswer.substring(0, 140)}...</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-amber-50 rounded-xl p-6 border-l-4 border-amber-400">
          <p className="text-sm text-gray-700">
            <strong>Disclaimer:</strong> These pages provide general informational guidance only. They are not legal advice. Consult a licensed employment attorney for your specific situation.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
