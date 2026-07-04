import { useParams, Link } from "react-router-dom";
import { industryIdeas } from "@/data/industry-ideas";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

export default function IndustryIdeasPage() {
  const { profession } = useParams<{ profession: string }>();
  const data = industryIdeas.find((p) => p.slug === profession);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profession not found</h1>
          <Link to="/ideas" className="text-blue-600 hover:underline">← Browse all professions</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`Micro-SaaS Ideas for ${data.profession} (2026) | Invisible Exit`}
        description={`${data.ideas.length} profitable micro-SaaS ideas specifically for ${data.profession.toLowerCase()}. Leverage your unfair advantage. Real revenue math, pricing, and difficulty ratings.`}
        canonical={`https://invisibleexit.com/ideas/${data.slug}`}
        ogImage={`https://invisibleexit.com/og-image.png`}
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {" › "}
          <Link to="/ideas" className="text-blue-600 hover:underline">Ideas by Profession</Link>
          {" › "}
          <span>{data.profession}</span>
        </nav>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Micro-SaaS Ideas for {data.profession}
          </h1>
          <p className="text-xl text-gray-600 mb-6">{data.unfairAdvantage}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-medium">
              Avg Salary: {data.avgSalary}
            </span>
            <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full font-medium">
              {data.ideas.length} Ideas
            </span>
          </div>
        </div>

        {/* Unfair advantage */}
        <section className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-12">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Your Unfair Advantage</h2>
          <p className="text-lg text-gray-800">{data.unfairAdvantage}</p>
        </section>

        {/* Transferable skills */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills You Already Have</h2>
          <div className="flex flex-wrap gap-2">
            {data.transferableSkills.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Ideas */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{data.ideas.length} Micro-SaaS Ideas</h2>
          <div className="space-y-6">
            {data.ideas.map((idea, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{idea.name}</h3>
                  <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                    idea.difficulty === "Low" ? "bg-green-100 text-green-700" :
                    idea.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {idea.difficulty}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{idea.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Target Customer</p>
                    <p className="font-medium text-gray-900">{idea.targetCustomer}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Pricing</p>
                    <p className="font-medium text-gray-900">{idea.pricing}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Revenue Potential</p>
                    <p className="font-medium text-green-600">{idea.revenuePotential}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What to avoid */}
        <section className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-12">
          <h2 className="text-lg font-bold text-red-600 mb-2">⚠️ What to Avoid</h2>
          <p className="text-gray-800">{data.whatToAvoid}</p>
        </section>

        {/* Tools they know */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tools You Already Know (Leverage These)</h2>
          <div className="flex flex-wrap gap-2">
            {data.toolsTheyAlreadyKnow.map((tool, i) => (
              <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                {tool}
              </span>
            ))}
          </div>
        </section>

        {/* FAQs */}
        {data.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs</h2>
            <div className="space-y-6">
              {data.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Other professions */}
        <section className="border-t pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ideas for Other Professions</h2>
          <div className="flex flex-wrap gap-2">
            {industryIdeas.filter((p) => p.slug !== data.slug).slice(0, 12).map((p) => (
              <Link
                key={p.slug}
                to={`/ideas/${p.slug}`}
                className="px-3 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg text-sm transition-colors"
              >
                {p.icon} {p.profession}
              </Link>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
