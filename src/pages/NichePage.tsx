import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { niches } from "@/data/niches";

export default function NichePage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = niches.find((n) => n.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Niches</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.niche}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        {/* Market Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-5 text-center">
            <div className="text-lg font-extrabold text-blue-700">{entry.marketSize}</div>
            <div className="mt-1 text-sm text-slate-600">Market Size</div>
          </div>
          <div className="rounded-xl bg-green-50 p-5 text-center">
            <div className="text-lg font-extrabold text-green-700">{entry.growthRate}</div>
            <div className="mt-1 text-sm text-slate-600">Growth Rate</div>
          </div>
          <div className="rounded-xl bg-orange-50 p-5 text-center">
            <div className="text-sm font-bold text-orange-700">{entry.difficulty}</div>
            <div className="mt-1 text-xs text-slate-600">Difficulty</div>
          </div>
        </section>

        {/* Best Ideas */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Best Micro-SaaS Ideas in {entry.niche}</h2>
          <div className="mt-4 space-y-4">
            {entry.bestIdeas.map((idea, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-5">
                <h3 className="text-lg font-bold text-slate-900">{idea.name}</h3>
                <p className="mt-1 text-slate-600">{idea.description}</p>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div><span className="text-slate-500">Customer:</span> <span className="font-semibold">{idea.targetCustomer}</span></div>
                  <div><span className="text-slate-500">Pricing:</span> <span className="font-semibold text-green-700">{idea.pricing}</span></div>
                  <div><span className="text-slate-500">Competition:</span> <span className="font-semibold">{idea.competition}</span></div>
                </div>
                <div className="mt-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                  <strong>Why now:</strong> {idea.whyNow}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trends */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Key Trends</h2>
          <ul className="mt-4 space-y-2">
            {entry.trends.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <span className="mt-1 text-blue-600">📈</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Monetization */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Monetization Strategies</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.monetization.map((m, i) => (
              <span key={i} className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800">{m}</span>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Recommended Tools</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tools.map((tool, i) => (
              <span key={i} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{tool}</span>
            ))}
          </div>
        </section>

        {/* Mistakes */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-red-700">Common Mistakes to Avoid</h2>
          <ul className="mt-4 space-y-2">
            {entry.mistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <span className="mt-1 text-red-600">⚠️</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQs */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="mt-4 space-y-6">
            {entry.faqs.map((f, i) => (
              <div key={i}>
                <h3 className="text-lg font-semibold text-slate-900">{f.question}</h3>
                <p className="mt-1 text-slate-600">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-2xl bg-slate-900 p-8 text-center">
          <h2 className="text-xl font-bold text-white">Found your niche?</h2>
          <p className="mt-2 text-slate-300">Get personalized micro-SaaS ideas for your profession.</p>
          <Link to="/ideas" className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">Browse Ideas →</Link>
        </div>
      </article>

      <RelatedContent />
      <Footer />
    </div>
  );
}
