import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { breakEvenPages } from "@/data/break-even";

export default function BreakEvenPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const entry = breakEvenPages.find((e) => e.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} url={`/break-even/${entry.slug}`} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Break-Even Calculator</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.mrrLevel} at {entry.costTier}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        <section className="mt-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-xs text-slate-500">Monthly Revenue</p>
            <p className="text-xl font-bold text-slate-900">${entry.monthlyRevenue.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-xs text-slate-500">Monthly Costs</p>
            <p className="text-xl font-bold text-red-600">${entry.monthlyCosts.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-xs text-slate-500">Break-Even</p>
            <p className="text-xl font-bold text-green-600">{entry.breakEvenMonths} months</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-xs text-slate-500">Total Investment</p>
            <p className="text-xl font-bold text-slate-900">${entry.totalInvestment.toLocaleString()}</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">The Scenario</h2>
          <p className="mt-4 text-slate-700">{entry.scenario}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Month-by-Month Breakdown</h2>
          <div className="mt-4 space-y-3">
            {entry.milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-4 rounded-lg border border-slate-200 p-4">
                <span className="flex-shrink-0 rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">{m.month}</span>
                <div><p className="font-semibold text-slate-900">{m.status}</p><p className="text-sm text-slate-600">{m.description}</p></div>
              </div>
            ))}
          </div>
        </section>

        {entry.sensitivity.length > 0 && (
          <section className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-bold text-amber-900">Sensitivity Analysis</h2>
            <ul className="mt-3 space-y-2">
              {entry.sensitivity.map((s, i) => (
                <li key={i} className="text-slate-700"><strong>{s.ifCostsChange}:</strong> {s.newBreakEven}</li>
              ))}
            </ul>
          </section>
        )}

        {entry.faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">FAQs</h2>
            <div className="mt-4 space-y-4">
              {entry.faqs.map((f, i) => (
                <div key={i}><h3 className="font-bold text-slate-900">{f.question}</h3><p className="mt-1 text-slate-600">{f.answer}</p></div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 rounded-xl bg-slate-900 p-6 text-center">
          <Link to="/freedom" className="text-white font-semibold underline">Calculate Your Freedom Number →</Link>
        </div>
        <p className="mt-6 text-xs text-slate-400">Disclaimer: Break-even projections are illustrative. Actual results depend on market, product, and execution.</p>
      </article>
      <div className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-3xl px-4">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Related Articles</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link to="/calculators" className="text-sm text-blue-600 hover:underline">← Calculators</Link>
            <Link to="/milestones" className="text-sm text-blue-600 hover:underline">Revenue Milestones</Link>
            <Link to="/freedom" className="text-sm text-blue-600 hover:underline">Freedom Number</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
