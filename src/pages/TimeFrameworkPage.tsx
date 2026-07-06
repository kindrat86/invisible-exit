import { useParams, Link } from "react-router-dom";
import { timeFrameworks } from "@/data/time-frameworks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";

export default function TimeFrameworkPage() {
  const { slug } = useParams<{ slug: string }>();
  const framework = timeFrameworks.find((f) => f.slug === slug);

  if (!framework) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Time management framework not found</h1>
          <Link to="/time-frameworks" className="text-blue-600 hover:underline">← Browse all time frameworks</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`${framework.frameworkName} — Time Management for Side Businesses | Invisible Exit`}
        description={`${framework.description.substring(0, 155)}`}
        url={`https://invisibleexit.com/time-frameworks/${framework.slug}`}
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <Link to="/time-frameworks" className="text-blue-600 hover:underline">Time Frameworks</Link>
          {" › "}
          <span>{framework.frameworkName}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{framework.frameworkName}</h1>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
              By {framework.author}
            </div>
            <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium">
              {framework.weeklyTimeCommitment}/week
            </div>
          </div>
          <p className="text-xl text-gray-600">{framework.description}</p>
          <div className="mt-4 bg-amber-50 rounded-lg p-3 border-l-4 border-amber-400">
            <p className="text-sm text-gray-700"><strong>Best for:</strong> {framework.bestFor}</p>
          </div>
        </div>

        {/* Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="space-y-4">
            {framework.steps.map((step, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    <span className="text-blue-600 mr-2">{i + 1}.</span>
                    {step.title}
                  </h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{step.duration}</span>
                </div>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tools Needed */}
        <section className="mb-12 bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tools You'll Need</h2>
          <div className="flex flex-wrap gap-2">
            {framework.toolsNeeded.map((tool, i) => (
              <span key={i} className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-sm text-gray-700">
                {tool}
              </span>
            ))}
          </div>
        </section>

        {/* Results */}
        <section className="mb-12 bg-green-50 rounded-xl p-6 border-l-4 border-green-400">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What You Can Expect</h2>
          <p className="text-gray-700 leading-relaxed">{framework.results}</p>
        </section>

        {/* Common Mistakes */}
        <section className="mb-12 bg-red-50 rounded-xl p-6 border-l-4 border-red-400">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Common Mistakes</h2>
          <p className="text-gray-700 leading-relaxed">{framework.commonMistakes}</p>
        </section>

        {/* FAQs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs</h2>
          <div className="space-y-4">
            {framework.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Browse other frameworks */}
        <section className="border-t pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Other Time Management Frameworks</h2>
          <div className="flex flex-wrap gap-2">
            {timeFrameworks.filter((f) => f.slug !== framework.slug).map((f) => (
              <Link
                key={f.slug}
                to={`/time-frameworks/${f.slug}`}
                className="px-3 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg text-sm transition-colors"
              >
                {f.frameworkName}
              </Link>
            ))}
          </div>
        </section>

        {/* Related Content */}
        <RelatedContent
          links={[
            { to: "/guides", title: "State-by-State LLC Guides", description: "Filing fees and requirements" },
            { to: "/how-to", title: "How-To Guides", description: "Step-by-step for employed founders" },
            { to: "/calculators/freedom-number", title: "Freedom Number Calculator", description: "Calculate your exit number" },
            { to: "/resources", title: "Resources", description: "Curated guides and templates" },
          ]}
          title="Related Resources"
        />
      </div>
      <Footer />
    </div>
  );
}
