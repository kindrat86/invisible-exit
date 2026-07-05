import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { getCityProfessionPage } from "@/data/city-profession";

export default function CityProfessionPage() {
  const { citySlug, professionSlug } = useParams<{ citySlug: string; professionSlug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [citySlug, professionSlug]);

  if (!citySlug || !professionSlug) return <Navigate to="/blog" replace />;

  const combinedSlug = `${citySlug}-for-${professionSlug}`;
  const entry = getCityProfessionPage(combinedSlug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription}
        url={`https://invisibleexit.com/cities/${entry.citySlug}/for/${entry.professionSlug}`} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <Link to={`/cities/${entry.citySlug}`} className="hover:text-blue-600">{entry.city}</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.profession}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        {/* Local Scene */}
        <section className="mt-8 rounded-xl bg-blue-50 p-6">
          <h2 className="text-xl font-bold text-slate-900">The Local Scene</h2>
          <p className="mt-2 text-slate-700">{entry.localScene}</p>
          <div className="mt-3 rounded-lg bg-white p-4">
            <p className="text-sm font-semibold text-slate-700">Cost of living: {entry.costProfile}</p>
          </div>
        </section>

        {/* Networking */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Networking & Community</h2>
          <ul className="mt-4 space-y-2">
            {entry.networkingOps.map((n, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <span className="mt-1 text-green-600">🤝</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Advantages */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Why {entry.city} Works for {entry.profession}</h2>
          <ul className="mt-4 space-y-2">
            {entry.advantages.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <span className="mt-1 text-blue-600">✓</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Best Ideas */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Micro-SaaS Ideas for {entry.profession} in {entry.city}</h2>
          <ul className="mt-4 space-y-3">
            {entry.bestIdeas.map((idea, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg border border-slate-200 p-4 text-slate-700">
                <span className="mt-0.5 font-bold text-blue-600">{i + 1}.</span>
                <span>{idea}</span>
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
          <h2 className="text-xl font-bold text-white">Ready to start in {entry.city}?</h2>
          <p className="mt-2 text-slate-300">Get a personalized micro-SaaS idea based on your profession.</p>
          <Link to="/ideas" className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">Browse Ideas →</Link>
        </div>
      </article>

      <RelatedContent />
      <Footer />
    </div>
  );
}
