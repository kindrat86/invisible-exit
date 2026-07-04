import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { firstYearEntries } from "@/data/first-year";

export default function FirstYearPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const entry = firstYearEntries.find((e) => e.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} url={`/first-year/${entry.slug}`} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link><span className="mx-2">›</span>
          <span>First Year</span><span className="mx-2">›</span>
          <span className="text-slate-700">{entry.profession}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <h2 className="font-bold text-green-900">Your Advantages as a {entry.profession}</h2>
            <ul className="mt-3 space-y-2">{entry.advantages.map((a, i) => <li key={i} className="text-slate-700">✓ {a}</li>)}</ul>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="font-bold text-amber-900">Your Challenges</h2>
            <ul className="mt-3 space-y-2">{entry.challenges.map((c, i) => <li key={i} className="text-slate-700">⚠ {c}</li>)}</ul>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Your 12-Month Roadmap</h2>
          <div className="mt-4 space-y-4">
            {entry.monthlyPlan.map((m, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">Month {m.month}</span>
                  <h3 className="font-bold text-slate-900">{m.focus}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-700"><strong>Goal:</strong> {m.goal}</p>
                <p className="mt-1 text-sm text-slate-600"><strong>Deliverable:</strong> {m.deliverable}</p>
                <p className="mt-1 text-sm text-amber-600"><strong>Reality check:</strong> {m.realityCheck}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-xl font-bold text-blue-900">Year-End Expectations</h2>
          <div className="mt-4 overflow-hidden rounded-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-blue-100"><tr><th className="p-2">Metric</th><th className="p-2">Target</th><th className="p-2">Stretch Goal</th></tr></thead>
              <tbody>
                {entry.yearEndExpectations.map((e, i) => (
                  <tr key={i} className="border-b border-blue-50"><td className="p-2 font-semibold">{e.metric}</td><td className="p-2 text-slate-600">{e.target}</td><td className="p-2 text-green-600">{e.stretchGoal}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900">Lessons Learned</h2>
          <ul className="mt-4 space-y-2">{entry.lessonsLearned.map((l, i) => <li key={i} className="text-slate-700">→ {l}</li>)}</ul>
        </section>

        {entry.faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">FAQs</h2>
            <div className="mt-4 space-y-4">{entry.faqs.map((f, i) => (<div key={i}><h3 className="font-bold text-slate-900">{f.question}</h3><p className="mt-1 text-slate-600">{f.answer}</p></div>))}</div>
          </section>
        )}

        <div className="mt-10 rounded-xl bg-slate-900 p-6 text-center">
          <Link to="/freedom" className="text-white font-semibold underline">Calculate Your Freedom Number →</Link>
        </div>
        <p className="mt-6 text-xs text-slate-400">Disclaimer: Projections are illustrative. Individual results vary based on effort, market, and execution.</p>
      </article>
      <Footer />
    </div>
  );
}
