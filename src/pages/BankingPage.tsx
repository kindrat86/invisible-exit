import { useParams, Link } from "react-router-dom";
import { bankingGuides } from "@/data/banking";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";

export default function BankingPage() {
  const { state } = useParams<{ state: string }>();
  const guide = bankingGuides.find((g) => g.slug === state);

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Banking guide not found</h1>
          <Link to="/banking" className="text-blue-600 hover:underline">← Browse all banking guides</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`Business Banking in ${guide.stateName} — Best Banks for LLCs & Side Businesses | Invisible Exit`}
        description={`Best business banking options in ${guide.stateName}. Compare local and online banks for your LLC. Recommended banks, fees, and tips for ${guide.stateName} founders.`}
        url={`https://invisibleexit.com/banking/${guide.slug}`}
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <Link to="/banking" className="text-blue-600 hover:underline">Banking Guides</Link>
          {" › "}
          <span>{guide.stateName}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Business Banking in {guide.stateName}
          </h1>
          <p className="text-xl text-gray-600">
            Find the best business bank accounts for your LLC or side business in {guide.stateName}. Compare fees, features, and online banking options.
          </p>
        </div>

        {/* Recommended Banks */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Banks for {guide.stateName}</h2>
          <div className="grid gap-6">
            {guide.recommendedBanks.map((bank, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-200 transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{bank.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{bank.bestFor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Min Deposit</p>
                    <p className="text-lg font-bold text-gray-900">${bank.minDeposit}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {bank.monthlyFee === 0 ? "No monthly fee" : `$${bank.monthlyFee}/mo`}
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  {bank.features.map((feature, j) => (
                    <li key={j} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-green-500 flex-shrink-0">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={bank.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Visit Website →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Online Banking Options */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Online Banking Options for {guide.stateName} LLCs</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {guide.onlineBankingOptions.map((opt, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-1">{opt.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{opt.bestFor}</p>
                <ul className="space-y-1.5">
                  {opt.features.map((f, j) => (
                    <li key={j} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-green-500 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="mb-12 bg-blue-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tips for {guide.stateName} Founders</h2>
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
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs About Business Banking in {guide.stateName}</h2>
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
            {bankingGuides.filter((g) => g.slug !== guide.slug).slice(0, 12).map((g) => (
              <Link
                key={g.slug}
                to={`/banking/${g.slug}`}
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
            { to: "/how-to/set-up-an-anonymous-banking-setup", title: "Anonymous Banking Setup", description: "Privacy-first banking for invisible businesses" },
            { to: "/resources/micro-saas-launch-checklist", title: "30-Step Launch Checklist", description: "Go from idea to launched" },
            { to: "/calculators/freedom-number", title: "Freedom Number Calculator", description: "Calculate your exit number" },
          ]}
          title="Related Resources"
        />
      </div>
      <Footer />
    </div>
  );
}
