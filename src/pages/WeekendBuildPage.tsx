import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { weekendBuilds } from "@/data/weekend-builds";

export default function WeekendBuildPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  if (!slug) return <Navigate to="/blog" replace />;
  const entry = weekendBuilds.find((w) => w.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link><span className="mx-2">›</span>
          <span>Weekend Builds</span><span className="mx-2">›</span>
          <span className="text-slate-700">{entry.category}</span>
        </nav>
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-blue-50 p-5 text-center"><div className="text-sm font-bold text-blue-700">{entry.difficulty}</div><div className="mt-1 text-xs text-slate-600">Difficulty</div></div>
          <div className="rounded-xl bg-green-50 p-5 text-center"><div className="text-sm font-bold text-green-700">{entry.totalHours}</div><div className="mt-1 text-xs text-slate-600">Total Time</div></div>
          <div className="rounded-xl bg-purple-50 p-5 text-center"><div className="text-sm font-bold text-purple-700">{entry.cost}</div><div className="mt-1 text-xs text-slate-600">Cost</div></div>
          <div className="rounded-xl bg-orange-50 p-5 text-center"><div className="text-sm font-bold text-orange-700">{entry.revenuePotential}</div><div className="mt-1 text-xs text-slate-600">Revenue Potential</div></div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Hour-by-Hour Plan</h2>
          <div className="mt-4 space-y-3">
            {entry.steps.map((s, i) => (
              <div key={i} className="flex gap-4 rounded-lg bg-slate-50 p-4">
                <div className="flex-shrink-0"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">{i + 1}</div></div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-500">{s.hour}</div>
                  <div className="font-semibold text-slate-900">{s.task}</div>
                  <div className="mt-1 text-sm text-green-700">🎯 {s.outcome}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Tech Stack</h2>
          <div className="mt-4 flex flex-wrap gap-2">{entry.techStack.map((t, i) => <span key={i} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{t}</span>)}</div>
        </section>

        <section className="mt-10 rounded-xl border-l-4 border-purple-500 bg-purple-50 p-6">
          <h3 className="font-bold text-purple-900">The Honest Take</h3>
          <p className="mt-2 text-purple-800">{entry.monologue}</p>
        </section>

        <section className="mt-10 rounded-xl bg-slate-900 p-6">
          <h3 className="font-bold text-white">What to Do After the Weekend</h3>
          <p className="mt-2 text-slate-300">{entry.whatToDoAfter}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">FAQs</h2>
          <div className="mt-4 space-y-6">{entry.faqs.map((f, i) => (<div key={i}><h3 className="text-lg font-semibold text-slate-900">{f.question}</h3><p className="mt-1 text-slate-600">{f.answer}</p></div>))}</div>
        </section>

        <div className="mt-12 rounded-2xl bg-slate-900 p-8 text-center">
          <h2 className="text-xl font-bold text-white">Ready to build?</h2>
          <p className="mt-2 text-slate-300">Get micro-SaaS ideas tailored to your skills.</p>
          <Link to="/ideas" className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">Browse Ideas →</Link>
        </div>
      </article>
      <RelatedContent />
      <Footer />
    </div>
  );
}
