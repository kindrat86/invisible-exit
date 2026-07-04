import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { toolCrossReference } from "@/data/tool-cross-reference";

export default function ToolCrossReferencePage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const entry = toolCrossReference.find((e) => e.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} url={`/tools/${entry.slug}`} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link><span className="mx-2">›</span>
          <Link to="/best" className="hover:text-blue-600">Best Tools</Link><span className="mx-2">›</span>
          <span className="text-slate-700">{entry.profession} — {entry.category}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Recommended Tools</h2>
          <div className="mt-6 space-y-4">
            {entry.tools.map((tool, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{tool.name}</h3>
                    <p className="text-sm text-slate-600">{tool.best}</p>
                  </div>
                  <span className="whitespace-nowrap rounded-lg bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{tool.pricing}</span>
                </div>
                <p className="mt-3 text-sm text-slate-700">{tool.why}</p>
                <p className="mt-2 text-xs text-slate-500">Alternative: {tool.alternative}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-indigo-200 bg-indigo-50 p-6">
          <h2 className="text-xl font-bold text-indigo-900">Why {entry.profession} Need Different Tools</h2>
          <p className="mt-3 text-slate-700">{entry.professionSpecificNeeds}</p>
        </section>

        <section className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6">
          <h2 className="text-xl font-bold text-green-900">Budget-Friendly Approach</h2>
          <p className="mt-3 text-slate-700">{entry.budgetFriendly}</p>
        </section>

        {entry.faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">FAQs</h2>
            <div className="mt-4 space-y-4">{entry.faqs.map((f, i) => (<div key={i}><h3 className="font-bold text-slate-900">{f.question}</h3><p className="mt-1 text-slate-600">{f.answer}</p></div>))}</div>
          </section>
        )}

        <div className="mt-10 rounded-xl bg-slate-900 p-6 text-center">
          <Link to="/freedom" className="text-white font-semibold underline">Calculate Your Freedom Number →</Link>
        </div>
      </article>
      <Footer />
    </div>
  );
}
