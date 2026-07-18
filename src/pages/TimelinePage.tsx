import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import InlineNewsletter from "@/components/InlineNewsletter";
import { timelines, type TimelineEntry } from "@/data/timelines";

export default function TimelinePage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = timelines.find((t) => t.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Timeline</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">Month {entry.month}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        {/* Milestones */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">What You Should Have Done by Month {entry.month}</h2>
          <div className="mt-4 space-y-3">
            {entry.milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
                <span className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  m.completed ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
                }`}>
                  {m.completed ? "✓" : i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{m.milestone}</h3>
                  <p className="mt-1 text-sm text-slate-600">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Metrics to Check */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Metrics to Check This Month</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.metricsToCheck.map((metric, i) => (
              <span key={i} className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                📊 {metric}
              </span>
            ))}
          </div>
        </section>

        {/* Common at This Stage */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">What's Normal at Month {entry.month}</h2>
          <ul className="mt-4 space-y-2">
            {entry.commonAtThisStage.map((item, i) => (
              <li key={i} className="flex gap-2 text-slate-700">
                <span className="text-blue-600">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Mistakes */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Mistakes to Avoid at Month {entry.month}</h2>
          <ul className="mt-4 space-y-2">
            {entry.mistakes.map((mistake, i) => (
              <li key={i} className="flex gap-2 text-slate-700">
                <span className="text-red-500">✗</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* What's Next */}
        <section className="mt-10 rounded-xl bg-slate-900 p-6 text-white">
          <h2 className="text-xl font-bold">What's Next?</h2>
          <p className="mt-2 text-slate-300">{entry.whatsNext}</p>
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
            { to: "/data/micro-saas-revenue-benchmarks-2026", title: "Revenue Benchmarks", description: "Compare your progress" },
            { to: "/resources/micro-saas-launch-checklist", title: "30-Step Launch Checklist", description: "The exact sequence" },
            { to: "/calculators/freedom-number", title: "Freedom Number Calculator", description: "Your target" },
          ]}
          title="Related"
        />
      </article>

      <div className="container-standard py-12">
        <InlineNewsletter source="timeline_footer" />
      </div>

      <Footer />
    </div>
  );
}
