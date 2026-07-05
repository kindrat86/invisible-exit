import { Link } from "react-router-dom";
import { ListChecks } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { howToGuides } from "@/data/how-to-guides";

export default function HowToHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="How-To Guides — Step-by-Step for Employed Founders | Invisible Exit"
        description="Actionable step-by-step guides for building a micro-SaaS while employed. From validation to launch, with tools, timelines, and pro tips."
        url="https://invisibleexit.com/how-to"
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <span className="text-gray-800 font-medium">How-To Guides</span>
        </nav>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <ListChecks className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">How-To Guides</h1>
          </div>
          <p className="text-xl text-gray-600">
            Step-by-step playbooks for building a profitable micro-SaaS without quitting your job. Each guide includes tools, timelines, and common mistakes to avoid.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {howToGuides.map((guide) => (
            <Link
              key={guide.slug}
              to={`/how-to/${guide.slug}`}
              className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-2">{guide.topic}</h2>
              <p className="text-gray-600 text-sm mb-3">{guide.intro.substring(0, 120)}...</p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                  {guide.steps.length} steps
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
