import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { pricingModels } from "@/data/pricing-models";

export default function PricingModelPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const entry = pricingModels.find((e) => e.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} url={`/pricing-models/${entry.slug}`} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Pricing Models</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.model}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
          <p className="mt-4 text-slate-700">{entry.howItWorks}</p>
        </section>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <h3 className="font-bold text-green-900">Pros</h3>
            <ul className="mt-3 space-y-2">{entry.pros.map((p, i) => <li key={i} className="text-slate-700">✓ {p}</li>)}</ul>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-bold text-red-900">Cons</h3>
            <ul className="mt-3 space-y-2">{entry.cons.map((c, i) => <li key={i} className="text-slate-700">✗ {c}</li>)}</ul>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900">Best For</h2>
          <p className="mt-4 text-slate-700">{entry.bestFor}</p>
        </section>

        {entry.realExamples.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-900">Real Examples</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-white"><tr><th className="p-3">Product</th><th className="p-3">Pricing</th><th className="p-3">Revenue</th></tr></thead>
                <tbody>
                  {entry.realExamples.map((ex, i) => (
                    <tr key={i} className="border-b border-slate-100"><td className="p-3 font-semibold">{ex.product}</td><td className="p-3 text-slate-600">{ex.pricing}</td><td className="p-3 text-green-600 font-semibold">{ex.revenue}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {entry.benchmarks.length > 0 && (
          <section className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
            <h2 className="text-xl font-bold text-blue-900">Benchmarks</h2>
            <dl className="mt-3 grid gap-4 sm:grid-cols-2">
              {entry.benchmarks.map((b, i) => (
                <div key={i}><dt className="text-sm text-slate-500">{b.metric}</dt><dd className="font-bold text-slate-900">{b.value}</dd></div>
              ))}
            </dl>
          </section>
        )}

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900">Implementation</h2>
          <p className="mt-4 text-slate-700">{entry.implementation}</p>
        </section>

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
      </article>
      <div className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-3xl px-4">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Related Articles</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link to="/blog" className="text-sm text-blue-600 hover:underline">← All Articles</Link>
            <Link to="/calculators" className="text-sm text-blue-600 hover:underline">Calculators</Link>
            <Link to="/best" className="text-sm text-blue-600 hover:underline">Best Tools</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
