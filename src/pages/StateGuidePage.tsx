import { useParams, Link } from "react-router-dom";
import { stateGuides, type StateGuide } from "@/data/state-guides";
import { glossaryTerms } from "@/data/glossary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import SocialShare from "@/components/SocialShare";
import InlineNewsletter from "@/components/InlineNewsletter";
import { slugifyCategory } from "@/lib/utils";

export default function StateGuidePage() {
  const { state } = useParams<{ state: string }>();
  const guide = stateGuides.find((s) => s.slug === state);

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">State guide not found</h1>
          <Link to="/guides" className="text-blue-600 hover:underline">← Browse all state guides</Link>
        </div>
      </div>
    );
  }

  const nonCompeteLabel = {
    enforced: { text: "Enforced", color: "text-red-600 bg-red-50" },
    limited: { text: "Limited", color: "text-yellow-600 bg-yellow-50" },
    not_enforced: { text: "Not Enforced", color: "text-green-600 bg-green-50" },
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={guide.state + " Side Business Guide: LLC Costs, Non-Competes & Taxes | Invisible Exit"}
        description={`Start a side business in ${guide.state}. LLC filing fee: $${guide.llcFilingFee}. Non-compete status: ${nonCompeteLabel[guide.nonCompeteEnforceable].text}. Annual report: $${guide.annualReportFee}. Complete guide for employed professionals.`}
        canonical={`https://invisibleexit.com/guides/${guide.slug}`}
        ogImage={`https://invisibleexit.com/og-image.png`}
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <Link to="/guides" className="text-blue-600 hover:underline">State Guides</Link>
          {" › "}
          <span>{guide.state}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Starting a Side Business in {guide.state}
          </h1>
          <p className="text-xl text-gray-600">{guide.bestFor}</p>
        </div>

        {/* Quick facts grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">LLC Filing Fee</p>
            <p className="text-2xl font-bold text-gray-900">${guide.llcFilingFee}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Annual Report Fee</p>
            <p className="text-2xl font-bold text-gray-900">${guide.annualReportFee}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Non-Compete</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${nonCompeteLabel[guide.nonCompeteEnforceable].color}`}>
              {nonCompeteLabel[guide.nonCompeteEnforceable].text}
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">State Income Tax</p>
            <p className="text-lg font-bold text-gray-900">{guide.stateIncomeTaxRate}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Anonymous LLC</p>
            <p className="text-lg font-bold text-gray-900">{guide.anonymousLlcAllowed ? "✅ Yes" : "❌ No"}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Processing Time</p>
            <p className="text-lg font-bold text-gray-900">{guide.processingTime}</p>
          </div>
        </div>

        {/* Non-compete details */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Compete Law in {guide.state}</h2>
          <div className={`rounded-lg p-6 mb-4 ${nonCompeteLabel[guide.nonCompeteEnforceable].color.replace("text-", "bg-").replace("-600", "-50").replace("-800", "-50")}`}>
            <p className="text-gray-800">{guide.nonCompeteNotes}</p>
          </div>
        </section>

        {/* Anonymous LLC */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Anonymous LLC in {guide.state}</h2>
          <p className="text-gray-700 leading-relaxed">{guide.anonymousLlcNotes}</p>
        </section>

        {/* Self-employment tax */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Self-Employment Taxes</h2>
          <p className="text-gray-700 leading-relaxed">{guide.selfEmploymentNote}</p>
        </section>

        {/* Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for {guide.state} Founders</h2>
          <ul className="space-y-3">
            {guide.tips.map((tip, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">{i + 1}</span>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQs */}
        {guide.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{guide.state} Side Business FAQs</h2>
            <div className="space-y-6">
              {guide.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related states */}
        <section className="border-t pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Browse Other States</h2>
          <div className="flex flex-wrap gap-2">
            {stateGuides.filter((s) => s.slug !== guide.slug).slice(0, 12).map((s) => (
              <Link
                key={s.slug}
                to={`/guides/${s.slug}`}
                className="px-3 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg text-sm transition-colors"
              >
                {s.state}
              </Link>
            ))}
          </div>
        </section>

        {/* Cross-links: glossary terms + calculators */}
        <RelatedContent
          links={[
            { to: "/glossary/non-compete-clause", title: "What Is a Non-Compete Clause?", description: "Definition and enforcement rules" },
            { to: "/glossary/what-is-an-llc", title: "What Is an LLC?", description: "Limited Liability Company explained" },
            { to: "/calculators/freedom-number", title: "Freedom Number Calculator", description: "Calculate your exit number" },
            { to: "/resources/micro-saas-launch-checklist", title: "30-Step Launch Checklist", description: "Go from idea to launched" },
          ]}
          title="Related Resources"
        />
      </div>

      {/* ── TRAFFIC SECRETS: Share + Email Capture ── */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <SocialShare title={`Anonymous LLC Guide for ${guide!.state} | Invisible Exit`} url={`/guides/${state}`} />
          </div>
          <InlineNewsletter source={`state_guide_${state}`} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
