import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { timeFrameworks } from "@/data/time-frameworks";

export default function TimeFrameworkHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Time Management Frameworks for Side Businesses & Employed Founders | Invisible Exit"
        description="Proven time management frameworks for side businesses. From the 5-Hour Weekend to the 90-Day Sprint — find the system that works for your schedule."
        url="https://invisibleexit.com/time-frameworks"
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <span className="text-gray-800 font-medium">Time Management Frameworks</span>
        </nav>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Time Management Frameworks</h1>
          </div>
          <p className="text-xl text-gray-600">
            Proven time management systems designed for employed founders. Each framework includes
            step-by-step instructions, required time commitment, and expected results.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {timeFrameworks.map((fw) => (
            <Link
              key={fw.slug}
              to={`/time-frameworks/${fw.slug}`}
              className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-2">{fw.frameworkName}</h2>
              <p className="text-sm text-gray-500 mb-3">By {fw.author}</p>
              <p className="text-sm text-gray-700 mb-3 line-clamp-2">{fw.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                  {fw.weeklyTimeCommitment}/week
                </span>
                <span className="text-xs text-gray-400">{fw.steps.length} steps</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-amber-50 rounded-xl p-6 border-l-4 border-amber-400">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Which Framework Is Right for You?</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• <strong>No time at all?</strong> Start with the 2-Hour Rule or Pomodoro Side Hustle.</li>
            <li>• <strong>Struggling with consistency?</strong> The 5 AM Club or Maker Week / Manager Weekend.</li>
            <li>• <strong>Too many ideas, not enough action?</strong> The 90-Day Sprint forces you to pick one thing.</li>
            <li>• <strong>Feel busy but not productive?</strong> Batch Processing or Hour Stacking.</li>
            <li>• <strong>Want a complete system?</strong> The Weekly Review (GTD) + Time Blocking is the gold standard.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
