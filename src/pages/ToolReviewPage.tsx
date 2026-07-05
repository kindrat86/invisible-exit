import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { toolReviews } from "@/data/tool-reviews";

export default function ToolReviewPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  if (!slug) return <Navigate to="/blog" replace />;
  const entry = toolReviews.find((t) => t.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link><span className="mx-2">›</span>
          <span>Reviews</span><span className="mx-2">›</span>
          <span className="text-slate-700">{entry.toolName}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl font-bold text-slate-700">{entry.toolName[0]}</div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
            <p className="mt-1 text-sm text-slate-500">{entry.tagline}</p>
          </div>
        </div>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        {/* Rating + Pricing Cards */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-amber-50 p-5 text-center">
            <div className="text-3xl font-extrabold text-amber-700">{entry.rating}/5</div>
            <div className="mt-1 text-sm text-slate-600">Our Rating</div>
          </div>
          <div className="rounded-xl bg-blue-50 p-5 text-center">
            <div className="text-sm font-extrabold text-blue-700">{entry.pricing}</div>
            <div className="mt-1 text-xs text-slate-600">Pricing</div>
          </div>
          <div className="rounded-xl bg-green-50 p-5 text-center">
            <div className="text-sm font-extrabold text-green-700">{entry.freeTier}</div>
            <div className="mt-1 text-xs text-slate-600">Free Tier</div>
          </div>
        </section>

        {/* Best For */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">Best For</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {entry.bestFor.map((b, i) => <span key={i} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">✅ {b}</span>)}
          </div>
        </section>

        {/* Pros & Cons */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-green-50 p-5">
            <h3 className="font-bold text-green-800">👍 Pros</h3>
            <ul className="mt-3 space-y-1.5">{entry.pros.map((p, i) => <li key={i} className="text-sm text-slate-700">{p}</li>)}</ul>
          </div>
          <div className="rounded-xl bg-red-50 p-5">
            <h3 className="font-bold text-red-800">👎 Cons</h3>
            <ul className="mt-3 space-y-1.5">{entry.cons.map((c, i) => <li key={i} className="text-sm text-slate-700">{c}</li>)}</ul>
          </div>
        </section>

        {/* Features */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Key Features</h2>
          <div className="mt-4 space-y-3">
            {entry.features.map((f, i) => (
              <div key={i} className={`rounded-xl border p-4 ${f.isStandout ? 'border-blue-200 bg-blue-50' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">{f.name}</h3>
                  {f.isStandout && <span className="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-semibold text-blue-800">Standout</span>}
                </div>
                <p className="mt-1 text-sm text-slate-600">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">How It Compares</h2>
          <div className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200">
            {entry.comparisonTable.map((c, i) => (
              <div key={i} className="flex items-start gap-4 p-4">
                <div className="w-1/3 text-sm font-semibold text-slate-700">{c.feature}</div>
                <div className="w-2/3 text-sm text-slate-600">{c.verdict}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Verdict */}
        <section className="mt-10 rounded-xl border-l-4 border-blue-600 bg-blue-50 p-6">
          <h2 className="text-xl font-bold text-blue-900">Our Verdict</h2>
          <p className="mt-2 text-blue-800">{entry.verdict}</p>
        </section>

        {/* Alternatives */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Alternatives to Consider</h2>
          <div className="mt-4 space-y-3">
            {entry.alternatives.map((a, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">{a.name}</h3>
                <p className="mt-0.5 text-sm text-slate-600">{a.why}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="mt-4 space-y-6">
            {entry.faqs.map((f, i) => (
              <div key={i}><h3 className="text-lg font-semibold text-slate-900">{f.question}</h3><p className="mt-1 text-slate-600">{f.answer}</p></div>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-2xl bg-slate-900 p-8 text-center">
          <h2 className="text-xl font-bold text-white">Building a micro-SaaS?</h2>
          <p className="mt-2 text-slate-300">Get personalized tool recommendations based on your profession.</p>
          <Link to="/ideas" className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">Browse Ideas →</Link>
        </div>
      </article>
      <RelatedContent />
      <Footer />
    </div>
  );
}
