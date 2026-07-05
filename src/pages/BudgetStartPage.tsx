import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { budgetStartPages } from "@/data/budget-start";

export default function BudgetStartPage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = budgetStartPages.find((b) => b.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>By Budget</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.budgetTier}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        {/* Best Options */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Best Business Options with {entry.budgetTier}</h2>
          <div className="mt-4 space-y-4">
            {entry.bestOptions.map((o, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold text-slate-900">{o.name}</h3>
                  <span className="flex-shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{o.type}</span>
                </div>
                <p className="mt-1 text-slate-600">{o.description}</p>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                  <div><span className="text-slate-500">Revenue:</span> <span className="font-semibold text-green-700">{o.revenuePotential}</span></div>
                  <div><span className="text-slate-500">Cost:</span> <span className="font-semibold">{o.monthlyCost}</span></div>
                  <div><span className="text-slate-500">Time to $:</span> <span className="font-semibold">{o.timeToRevenue}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What You Can/Cannot Build */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-green-50 p-6">
            <h3 className="text-lg font-bold text-green-800">✅ What You Can Build</h3>
            <p className="mt-2 text-slate-700">{entry.whatYouCanBuild}</p>
          </div>
          <div className="rounded-xl bg-red-50 p-6">
            <h3 className="text-lg font-bold text-red-800">❌ What You Cannot Build</h3>
            <p className="mt-2 text-slate-700">{entry.whatYouCannotBuild}</p>
          </div>
        </section>

        {/* 30-Day Plan */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Your First 30 Days</h2>
          <div className="mt-4 space-y-3">
            {entry.first30DaysPlan.map((w, i) => (
              <div key={i} className="flex gap-4 rounded-lg bg-slate-50 p-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">{i + 1}</div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">{w.week}: {w.focus}</div>
                  <div className="mt-1 text-sm text-slate-600">🎯 {w.outcome}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stack */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Recommended Tool Stack</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.stack.map((s, i) => (
              <span key={i} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{s}</span>
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
