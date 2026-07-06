import { useParams, Link } from "react-router-dom";
import { ndaGuides } from "@/data/nda-guides";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";

const ENFORCEMENT_COLORS: Record<string, string> = {
  strong: "bg-red-100 text-red-700",
  moderate: "bg-yellow-100 text-yellow-700",
  weak: "bg-green-100 text-green-700",
  varies: "bg-gray-100 text-gray-700",
};

export default function NdaGuidePage() {
  const { state } = useParams<{ state: string }>();
  const guide = ndaGuides.find((g) => g.slug === state);

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">NDA guide not found</h1>
          <Link to="/nda-guides" className="text-blue-600 hover:underline">← Browse all NDA guides</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`NDA Guide for ${guide.stateName} — Side Business & Non-Compete | Invisible Exit`}
        description={`NDA and non-compete guide for side businesses in ${guide.stateName}. Enforceability: ${guide.ndaEnforceability}. What to check in your employment agreement before starting a side business.`}
        url={`https://invisibleexit.com/nda-guides/${guide.slug}`}
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <Link to="/nda-guides" className="text-blue-600 hover:underline">NDA Guides</Link>
          {" › "}
          <span>{guide.stateName}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              NDA Guide for {guide.stateName}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${ENFORCEMENT_COLORS[guide.ndaEnforceability]}`}>
              {guide.ndaEnforceability.charAt(0).toUpperCase() + guide.ndaEnforceability.slice(1)} enforceability
            </span>
          </div>
          <p className="text-xl text-gray-600">
            Understand how NDAs and non-competes affect your side business in {guide.stateName}. What your employer can and cannot enforce.
          </p>
        </div>

        {/* NDA Key Rules */}
        <section className="mb-12 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Key NDA Rules in {guide.stateName}</h2>
          <p className="text-gray-700">{guide.ndaKeyRules}</p>
        </section>

        {/* Side Business Implications */}
        <section className="mb-12 bg-blue-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What This Means for Your Side Business</h2>
          <p className="text-gray-700">{guide.sideBusinessImplications}</p>
        </section>

        {/* What to Check */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What to Check in Your Agreement</h2>
          <ul className="space-y-3">
            {guide.whatToCheck.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">{i + 1}</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs About NDAs in {guide.stateName}</h2>
          <div className="space-y-4">
            {guide.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Browse other states */}
        <section className="border-t pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Browse Other States</h2>
          <div className="flex flex-wrap gap-2">
            {ndaGuides.filter((g) => g.slug !== guide.slug).slice(0, 12).map((g) => (
              <Link
                key={g.slug}
                to={`/nda-guides/${g.slug}`}
                className="px-3 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg text-sm transition-colors"
              >
                {g.stateName}
              </Link>
            ))}
          </div>
        </section>

        {/* Related Content */}
        <RelatedContent
          links={[
            { to: "/guides", title: "State-by-State LLC Guides", description: "Filing fees, non-competes, and taxes" },
            { to: "/non-compete", title: "Non-Compete Matrix", description: "State-by-state non-compete enforceability" },
            { to: "/is-it-legal", title: "Is It Legal?", description: "Legal concerns for employed founders" },
            { to: "/resources/micro-saas-launch-checklist", title: "30-Step Launch Checklist", description: "Go from idea to launched" },
          ]}
          title="Related Resources"
        />
      </div>
      <Footer />
    </div>
  );
}
