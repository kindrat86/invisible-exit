import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import InlineNewsletter from "@/components/InlineNewsletter";
import { revenueMilestones, type RevenueMilestone } from "@/data/revenue-milestones";

export default function RevenueMilestonePage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = revenueMilestones.find((m) => m.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Revenue Milestones</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.mrrRange}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        {/* What This Means */}
        <section className="mt-8 rounded-xl border-l-4 border-blue-600 bg-blue-50 p-6">
          <h2 className="text-lg font-bold text-blue-900">What Reaching {entry.mrrRange} MRR Means</h2>
          <p className="mt-2 text-blue-900">{entry.whatThisMeans}</p>
          <p className="mt-2 text-sm text-blue-700">Typical time at this stage: {entry.timeEstimate}</p>
        </section>

        {/* Key Metrics */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Key Metrics to Hit</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {entry.keyMetrics.map((metric, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <span className="text-slate-700">{metric.metric}</span>
                <span className="font-bold text-blue-600">{metric.target}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tactics */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Tactics for This Stage</h2>
          <div className="mt-4 space-y-4">
            {entry.tactics.map((t, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-900">{t.tactic}</h3>
                  <span className={`whitespace-nowrap rounded px-2 py-0.5 text-xs font-semibold ${
                    t.effort === "Low" ? "bg-green-100 text-green-700" :
                    t.effort === "Medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {t.effort} effort
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{t.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Common Mistakes at This Stage</h2>
          <ul className="mt-4 space-y-2">
            {entry.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex gap-2 text-slate-700">
                <span className="text-red-500">✗</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Tools */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Tools for This Stage</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.toolsNeeded.map((tool, i) => (
              <span key={i} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                {tool}
              </span>
            ))}
          </div>
        </section>

        {/* FAQs */}
        {entry.faqs.length > 0 && (
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
        )}

        <RelatedContent
          links={[
            { to: "/data/micro-saas-revenue-benchmarks-2026", title: "Revenue Benchmarks 2026", description: "How you compare to 500+ SaaS" },
            { to: "/calculators/freedom-number", title: "Freedom Number Calculator", description: "Your target MRR" },
            { to: "/resources/customer-acquisition-playbook", title: "Customer Acquisition Playbook", description: "Get more customers" },
          ]}
          title="Next Steps"
        />
      </article>

      <div className="container-standard py-12">
        <InlineNewsletter source="revenue_milestone_footer" />
      </div>

      <Footer />
    </div>
  );
}
