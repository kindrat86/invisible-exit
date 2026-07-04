import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { budgetPages } from "@/data/budget-pages";

export default function BudgetPage() {
  const { amount } = useParams<{ amount: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [amount]);

  if (!amount) return <Navigate to="/blog" replace />;

  const entry = budgetPages.find((b) => b.slug === amount);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Budget: {entry.budget}/month</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">{entry.h1}</h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">{entry.intro}</p>

        {/* What you can afford */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">What You Can Afford</h2>
          <ul className="space-y-2">
            {entry.whatYouCanAfford.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-600 font-bold shrink-0">✓</span>
                <span className="text-sm text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* What you cannot */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">What You Can't (Yet)</h2>
          <ul className="space-y-2">
            {entry.whatYouCannot.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">✗</span>
                <span className="text-sm text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Stack */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">The Complete Stack</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-3 font-semibold">Category</th>
                  <th className="text-left p-3 font-semibold">Tool</th>
                  <th className="text-right p-3 font-semibold">Cost</th>
                </tr>
              </thead>
              <tbody>
                {entry.stack.map((s, i) => (
                  <tr key={i} className="border-t border-slate-200">
                    <td className="p-3 font-medium">{s.category}</td>
                    <td className="p-3 text-slate-700">{s.tool}</td>
                    <td className="p-3 text-right font-semibold text-blue-600">{s.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Roadmap</h2>
          <div className="space-y-3">
            {entry.roadmap.map((r, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-lg border border-slate-200">
                <div className="w-24 shrink-0">
                  <p className="text-xs font-bold text-blue-600">{r.week}</p>
                </div>
                <p className="text-sm text-slate-700 flex-1">{r.task}</p>
                <p className="text-sm font-semibold text-slate-900 shrink-0">{r.cost}</p>
              </div>
            ))}
          </div>
        </section>

        {/* First milestone */}
        <section className="bg-blue-50 rounded-xl p-6 mb-10 border-l-4 border-blue-500">
          <h2 className="text-lg font-bold text-slate-900 mb-2">First Milestone</h2>
          <p className="text-sm text-slate-700">{entry.firstMilestone}</p>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">FAQ</h2>
          <div className="space-y-4">
            {entry.faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-5">
                <h3 className="font-semibold text-slate-900 mb-2 text-sm">{faq.question}</h3>
                <p className="text-sm text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center border-t border-slate-200 pt-8">
          <Link to="/freedom" className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors">
            Calculate Your Freedom Number →
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}
