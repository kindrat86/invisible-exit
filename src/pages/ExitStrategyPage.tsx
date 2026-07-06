import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { exitStrategyPages } from "@/data/exit-strategies";

export default function ExitStrategyPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  if (!slug) return <Navigate to="/blog" replace />;
  const entry = exitStrategyPages.find((e) => e.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead url={`https://invisibleexit.com/exit-strategies/${entry.slug}`} title={entry.metaTitle} description={entry.metaDescription} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Exit Strategies</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.h1}</span>
        </nav>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">{entry.stageLabel}</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{entry.timeframe}</span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        <div className="mt-8 rounded-xl border-l-4 border-emerald-600 bg-emerald-50 p-6">
          <h2 className="font-bold text-emerald-900">Realistic Valuation</h2>
          <p className="mt-2 text-emerald-800">{entry.realisticValuation}</p>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Why Now?</h2>
          <p className="mt-2 text-slate-600">{entry.whyNow}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Readiness Checklist</h2>
          <ul className="mt-4 space-y-2">
            {entry.readinessChecklist.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <span className="mt-1 text-emerald-600">✅</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Exit Paths</h2>
          <div className="mt-4 space-y-6">
            {entry.exitPaths.map((path, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900">{path.type}</h3>
                <p className="mt-1 text-sm font-medium text-blue-700">Best for: {path.bestFor}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-bold text-green-700">Pros</h4>
                    <ul className="mt-2 space-y-1">
                      {path.pros.map((p, j) => <li key={j} className="text-sm text-slate-600">👍 {p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-red-700">Cons</h4>
                    <ul className="mt-2 space-y-1">
                      {path.cons.map((c, j) => <li key={j} className="text-sm text-slate-600">👎 {c}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-xl bg-slate-50 p-6">
          <h2 className="text-2xl font-bold text-slate-900">Buyer Types</h2>
          <div className="mt-4 space-y-4">
            {entry.buyerTypes.map((buyer, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="font-bold text-slate-900">{buyer.who}</h3>
                <p className="mt-1 text-sm text-slate-600">{buyer.whatTheyWant}</p>
                <p className="mt-1 text-sm font-semibold text-blue-700">{buyer.typicalOffer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Key Numbers &amp; Multiples</h2>
          <div className="mt-4 space-y-2">
            {entry.keyNumbers.map((kn, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <span className="font-semibold text-slate-700">{kn.metric}</span>
                <span className="text-sm font-bold text-blue-700">{kn.multiple}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Preparation Steps</h2>
          <div className="mt-4 space-y-3">
            {entry.preparationSteps.map((step, i) => (
              <div key={i} className="flex gap-4 rounded-lg border border-slate-200 p-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">{i + 1}</div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">{step.step}</div>
                  <div className="mt-1 text-sm text-slate-600">{step.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-xl bg-slate-900 p-6">
          <h3 className="font-bold text-white">What Happens After the Exit</h3>
          <p className="mt-2 text-slate-300">{entry.whatHappensPostExit}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">FAQs</h2>
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
          <h2 className="text-xl font-bold text-white">Ready to build a sellable micro-SaaS?</h2>
          <p className="mt-2 text-slate-300">Learn the framework for building a business that someone will actually pay for.</p>
          <Link to="/pro" className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">Get Started →</Link>
        </div>
      </article>
      <RelatedContent />
      <Footer />
    </div>
  );
}
