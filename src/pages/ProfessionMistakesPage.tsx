import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { professionMistakes } from "@/data/profession-mistakes";

export default function ProfessionMistakesPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const entry = professionMistakes.find((e) => e.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} url={`/mistakes/${entry.slug}`} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Mistakes</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.profession}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">The Mistakes That Kill Most {entry.profession}</h2>
          <div className="mt-6 space-y-6">
            {entry.mistakes.map((m, i) => (
              <div key={i} className="rounded-xl border border-red-200 bg-red-50 p-6">
                <h3 className="text-lg font-bold text-red-900">{i + 1}. {m.mistake}</h3>
                <p className="mt-2 text-slate-700"><strong>Why it happens:</strong> {m.why}</p>
                <p className="mt-2 text-green-700"><strong>The fix:</strong> {m.fix}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-green-200 bg-green-50 p-6">
          <h2 className="text-2xl font-bold text-green-900">Signs You're on the Right Track</h2>
          <ul className="mt-4 space-y-2">
            {entry.positiveSigns.map((sign, i) => (
              <li key={i} className="flex gap-3"><span className="text-green-600 font-bold">✓</span><span className="text-slate-700">{sign}</span></li>
            ))}
          </ul>
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
        <p className="mt-6 text-xs text-slate-400">Disclaimer: For informational purposes only. Not legal, financial, or tax advice. Consult a professional for your specific situation.</p>
      </article>
      <div className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-3xl px-4">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Related Articles</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link to="/blog" className="text-sm text-blue-600 hover:underline">← All Articles</Link>
            <Link to="/ideas" className="text-sm text-blue-600 hover:underline">Browse Ideas</Link>
            <Link to="/glossary" className="text-sm text-blue-600 hover:underline">Glossary</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
