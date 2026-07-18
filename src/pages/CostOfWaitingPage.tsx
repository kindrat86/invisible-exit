import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import InlineNewsletter from "@/components/InlineNewsletter";
import { costOfWaitingPages, type CostOfWaiting } from "@/data/cost-of-waiting";

export default function CostOfWaitingPage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = costOfWaitingPages.find((p) => p.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Cost of Waiting</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.yearsLabel} at {entry.salaryLabel}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        {/* The Numbers */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-900 p-6 text-white">
            <div className="text-sm text-slate-400">Salary Earned ({entry.yearsLabel})</div>
            <div className="mt-1 text-3xl font-extrabold">${(entry.salaryEarned / 1000).toFixed(0)}K</div>
            <div className="mt-1 text-sm text-slate-400">By staying employed</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white">
            <div className="text-sm text-blue-100">Micro-SaaS Revenue ({entry.yearsLabel})</div>
            <div className="mt-1 text-3xl font-extrabold">${(entry.microSaasRevenue / 1000).toFixed(0)}K</div>
            <div className="mt-1 text-sm text-blue-100">If you'd started building</div>
          </div>
        </section>

        {/* Opportunity Cost */}
        <section className="mt-6 rounded-xl border-2 border-red-200 bg-red-50 p-6">
          <div className="text-center">
            <div className="text-sm font-semibold uppercase tracking-wide text-red-600">Opportunity Cost</div>
            <div className="mt-2 text-5xl font-extrabold text-red-700">
              ${entry.opportunityCost < 0 ? "0" : (entry.opportunityCost / 1000).toFixed(0)}K
            </div>
            <p className="mt-2 text-sm text-red-800">
              That's how much recurring revenue you miss out on by waiting {entry.yearsLabel}.
            </p>
          </div>
        </section>

        {/* Monthly Breakdown */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">The Month-by-Month Math</h2>
          <p className="mt-2 text-slate-600">What your micro-SaaS revenue would look like if you started {entry.yearsLabel} ago:</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 text-left font-semibold text-slate-700">Month</th>
                  <th className="py-2 text-right font-semibold text-slate-700">Salary/Month</th>
                  <th className="py-2 text-right font-semibold text-slate-700">MRR Potential</th>
                  <th className="py-2 text-right font-semibold text-slate-700">Gap</th>
                </tr>
              </thead>
              <tbody>
                {entry.monthlyBreakdown.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-2 text-slate-700">Month {row.month}</td>
                    <td className="py-2 text-right text-slate-600">${row.salary.toLocaleString()}</td>
                    <td className="py-2 text-right font-semibold text-blue-600">${row.microSaas.toLocaleString()}</td>
                    <td className="py-2 text-right text-red-500">${row.gap.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10 rounded-xl bg-slate-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Stop Waiting. Start Building.</h2>
          <p className="mt-2 text-slate-300">
            Every month you wait costs you ${Math.round(entry.opportunityCost / (entry.years * 12)).toLocaleString()} in potential recurring revenue.
          </p>
          <Link
            to="/freedom"
            className="mt-4 inline-block rounded-lg bg-white px-8 py-3 font-bold text-slate-900 hover:bg-slate-100"
          >
            Calculate My Freedom Number →
          </Link>
        </section>

        {/* FAQs */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">FAQs</h2>
          <div className="mt-4 space-y-4">
            {entry.faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                <p className="mt-1 text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <RelatedContent
          links={[
            { to: `/salaries/product-manager`, title: "Product Manager → Side Business", description: "See the math for your role" },
            { to: "/data/micro-saas-revenue-benchmarks-2026", title: "Revenue Benchmarks 2026", description: "Real data from 500+ SaaS" },
            { to: "/resources/micro-saas-launch-checklist", title: "30-Step Launch Checklist", description: "Start today" },
          ]}
          title="Take Action"
        />
      </article>

      <div className="container-standard py-12">
        <InlineNewsletter source="cost_of_waiting_footer" />
      </div>

      <Footer />
    </div>
  );
}
