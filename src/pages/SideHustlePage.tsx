import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { sideHustles, type SideHustleEntry } from "@/data/side-hustles";

export default function SideHustlePage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = sideHustles.find((s) => s.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Side Hustles</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.profession}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        {/* Key Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-blue-50 p-5 text-center">
            <div className="text-sm font-bold text-blue-700">{entry.hustleType}</div>
            <div className="mt-1 text-xs text-slate-600">Hustle Type</div>
          </div>
          <div className="rounded-xl bg-green-50 p-5 text-center">
            <div className="text-sm font-bold text-green-700">{entry.startupCost}</div>
            <div className="mt-1 text-xs text-slate-600">Startup Cost</div>
          </div>
          <div className="rounded-xl bg-purple-50 p-5 text-center">
            <div className="text-sm font-bold text-purple-700">{entry.timeToFirstDollar}</div>
            <div className="mt-1 text-xs text-slate-600">Time to First $</div>
          </div>
          <div className="rounded-xl bg-orange-50 p-5 text-center">
            <div className="text-sm font-bold text-orange-700">{entry.weeklyTimeCommitment}</div>
            <div className="mt-1 text-xs text-slate-600">Weekly Time</div>
          </div>
        </section>

        {/* Best Hustles */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Top 5 Side Hustles Ranked</h2>
          <div className="mt-4 space-y-4">
            {entry.bestHustles.map((h, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-5">
                <h3 className="text-lg font-bold text-slate-900">{i + 1}. {h.name}</h3>
                <p className="mt-1 text-slate-600">{h.description}</p>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                  <div><span className="text-slate-500">Earning:</span> <span className="font-semibold text-green-700">{h.earningPotential}</span></div>
                  <div><span className="text-slate-500">Cost:</span> <span className="font-semibold">{h.startupCost}</span></div>
                  <div><span className="text-slate-500">Skills:</span> <span className="font-semibold">{h.skillsNeeded}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Weekly Schedule */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Recommended Weekly Schedule</h2>
          <div className="mt-4 space-y-2">
            {entry.weeklySchedule.map((s, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">
                <div className="w-32 flex-shrink-0 text-sm font-bold text-slate-700">{s.day}</div>
                <div className="flex-1 text-slate-600">{s.task}</div>
                <div className="text-sm font-semibold text-blue-600">{s.hours}</div>
              </div>
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

        {/* Pros & Cons */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-green-700">Pros</h2>
            <ul className="mt-3 space-y-2">
              {entry.pros.map((p, i) => <li key={i} className="text-slate-700">✅ {p}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-700">Cons</h2>
            <ul className="mt-3 space-y-2">
              {entry.cons.map((c, i) => <li key={i} className="text-slate-700">⚠️ {c}</li>)}
            </ul>
          </div>
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
          <h2 className="text-xl font-bold text-white">Ready to calculate your freedom number?</h2>
          <p className="mt-2 text-slate-300">See exactly how much MRR you need to replace your salary.</p>
          <Link to="/freedom" className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">Calculate Now →</Link>
        </div>
      </article>

      <RelatedContent />
      <Footer />
    </div>
  );
}
