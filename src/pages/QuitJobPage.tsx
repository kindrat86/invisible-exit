import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { quitJobPages } from "@/data/quit-job";

export default function QuitJobPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  if (!slug) return <Navigate to="/blog" replace />;
  const entry = quitJobPages.find((q) => q.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Quit Your Job</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.profession}</span>
        </nav>
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        <div className="mt-8 rounded-xl border-l-4 border-blue-600 bg-blue-50 p-6">
          <h2 className="font-bold text-blue-900">The Honest Answer</h2>
          <p className="mt-2 text-blue-800">{entry.theHonestAnswer}</p>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-green-700">Signs You're Ready</h2>
          <ul className="mt-4 space-y-2">{entry.signsYouAreReady.map((s, i) => <li key={i} className="text-slate-700">✅ {s}</li>)}</ul>
        </section>
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-red-700">Signs You're NOT Ready</h2>
          <ul className="mt-4 space-y-2">{entry.signsYouAreNot.map((s, i) => <li key={i} className="text-slate-700">⚠️ {s}</li>)}</ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Financial Checklist</h2>
          <div className="mt-4 space-y-2">
            {entry.financialChecklist.map((f, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">
                <div className="flex-1 font-semibold text-slate-700">{f.item}</div>
                <div className="text-sm text-blue-600">{f.target}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">The Framework</h2>
          <div className="mt-4 space-y-3">
            {entry.theFramework.map((f, i) => (
              <div key={i} className="flex gap-4 rounded-lg border border-slate-200 p-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">{i + 1}</div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">{f.milestone}</div>
                  <div className="mt-1 text-sm text-slate-600">📊 {f.criteria}</div>
                  <div className="mt-1 text-sm text-blue-700">→ {f.action}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-red-50 p-6"><h3 className="font-bold text-red-800">If You Quit Too Early</h3><p className="mt-2 text-slate-700">{entry.whatHappensIfYouQuitTooEarly}</p></div>
          <div className="rounded-xl bg-amber-50 p-6"><h3 className="font-bold text-amber-800">If You Wait Too Long</h3><p className="mt-2 text-slate-700">{entry.whatHappensIfYouWaitTooLong}</p></div>
        </section>

        <section className="mt-10 rounded-xl bg-slate-900 p-6">
          <h3 className="font-bold text-white">Real Timeline</h3>
          <p className="mt-2 text-slate-300">{entry.realTimeline}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">FAQs</h2>
          <div className="mt-4 space-y-6">
            {entry.faqs.map((f, i) => (<div key={i}><h3 className="text-lg font-semibold text-slate-900">{f.question}</h3><p className="mt-1 text-slate-600">{f.answer}</p></div>))}
          </div>
        </section>

        <div className="mt-12 rounded-2xl bg-slate-900 p-8 text-center">
          <h2 className="text-xl font-bold text-white">Calculate your freedom number</h2>
          <p className="mt-2 text-slate-300">See exactly how much MRR you need to replace your salary.</p>
          <Link to="/freedom" className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">Calculate Now →</Link>
        </div>
      </article>
      <RelatedContent />
      <Footer />
    </div>
  );
}
