import { useParams, Link } from "react-router-dom";
import { insuranceGuides } from "@/data/insurance";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";

export default function InsurancePage() {
  const { state } = useParams<{ state: string }>();
  const guide = insuranceGuides.find((g) => g.slug === state);

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Insurance guide not found for {state}</h1>
          <Link to="/insurance" className="text-blue-600 hover:underline">← Browse all insurance guides</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`Side Business Insurance in ${guide.stateName} — LLC & Solo Founder Guide | Invisible Exit`}
        description={`Small business insurance guide for ${guide.stateName}. General liability, professional liability, workers' comp, and cyber insurance requirements for LLCs and side businesses.`}
        url={`https://invisibleexit.com/insurance/${guide.slug}`}
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <Link to="/insurance" className="text-blue-600 hover:underline">Insurance Guides</Link>
          {" › "}
          <span>{guide.stateName}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Side Business Insurance in {guide.stateName}
          </h1>
          <p className="text-xl text-gray-600">
            The right insurance coverage for your side business or LLC in {guide.stateName}.
            Requirements, recommendations, and cost estimates.
          </p>
        </div>

        {/* Requirements Summary */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements in {guide.stateName}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`rounded-xl border p-5 ${guide.generalLiabilityRequired ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <h3 className="font-semibold text-gray-900 mb-1">General Liability</h3>
              <p className={`font-bold ${guide.generalLiabilityRequired ? 'text-red-600' : 'text-green-600'}`}>
                {guide.generalLiabilityRequired ? "Required" : "Not required by state"}
              </p>
              <p className="text-sm text-gray-600 mt-1">Most commercial leases and contracts will still require it.</p>
            </div>
            <div className={`rounded-xl border p-5 ${guide.workersCompRequired ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <h3 className="font-semibold text-gray-900 mb-1">Workers' Compensation</h3>
              <p className={`font-bold ${guide.workersCompRequired ? 'text-red-600' : 'text-green-600'}`}>
                {guide.workersCompRequired ? "Required" : "Not required for solo founders"}
              </p>
              <p className="text-sm text-gray-600 mt-1">For businesses with employees.</p>
            </div>
          </div>
        </section>

        {/* Recommended Policies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Insurance for {guide.stateName} Businesses</h2>
          <div className="grid gap-6">
            {guide.recommendedPolicies.map((policy, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 transition">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{policy.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{policy.bestFor}</p>
                </div>
                <p className="text-gray-700 mb-3">{policy.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-blue-600">{policy.typicalCost}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* State Specific Rules */}
        <section className="mb-12 bg-blue-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">State-Specific Rules for {guide.stateName}</h2>
          <p className="text-gray-700 leading-relaxed">{guide.stateSpecificRules}</p>
        </section>

        {/* Cost Estimates */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Estimated Costs in {guide.stateName}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold text-gray-900">Revenue Level</th>
                  <th className="py-3 px-4 font-semibold text-gray-900">Monthly Premium</th>
                  <th className="py-3 px-4 font-semibold text-gray-900">Notes</th>
                </tr>
              </thead>
              <tbody>
                {guide.costEstimates.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900 font-medium">{row.revenueLevel}</td>
                    <td className="py-3 px-4 text-gray-700">{row.monthlyPremiumEstimate}</td>
                    <td className="py-3 px-4 text-gray-500 text-sm">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs About Insurance in {guide.stateName}</h2>
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
            {insuranceGuides.filter((g) => g.slug !== guide.slug).slice(0, 12).map((g) => (
              <Link
                key={g.slug}
                to={`/insurance/${g.slug}`}
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
            { to: "/guides", title: "State-by-State LLC Guides", description: "Filing fees, regulations, and requirements" },
            { to: "/banking", title: "Business Banking by State", description: "Best bank accounts for your LLC" },
            { to: "/nda", title: "NDA Guides by State", description: "How NDAs affect your side business" },
            { to: "/calculators/freedom-number", title: "Freedom Number Calculator", description: "Calculate your exit number" },
          ]}
          title="Related Resources"
        />
      </div>
      <Footer />
    </div>
  );
}
