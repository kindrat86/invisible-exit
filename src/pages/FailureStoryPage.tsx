import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { failureStories } from "@/data/failure-stories";

export default function FailureStoryPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  if (!slug) return <Navigate to="/blog" replace />;
  const entry = failureStories.find((f) => f.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link><span className="mx-2">›</span>
          <span>Failure Stories</span><span className="mx-2">›</span>
          <span className="text-slate-700">{entry.failureType}</span>
        </nav>
        <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">{entry.failureType}</span>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">The Story</h2>
          <p className="mt-3 text-slate-700">{entry.theStory}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-red-700">What Went Wrong</h2>
          <div className="mt-4 space-y-4">
            {entry.whatWentWrong.map((w, i) => (
              <div key={i} className="rounded-xl border border-red-200 bg-red-50 p-5">
                <h3 className="font-bold text-red-900">❌ {w.mistake}</h3>
                <p className="mt-1 text-sm text-slate-700"><strong>Impact:</strong> {w.impact}</p>
                <p className="mt-1 text-sm text-green-700"><strong>Lesson:</strong> {w.lesson}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">The Numbers</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {entry.theNumbers.map((n, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-slate-900 p-4">
                <span className="text-sm text-slate-300">{n.metric}</span>
                <span className="font-bold text-white">{n.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-xl border-l-4 border-green-600 bg-green-50 p-6">
          <h3 className="font-bold text-green-900">What Would Have Worked</h3>
          <p className="mt-2 text-green-800">{entry.whatWouldHaveWorked}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-amber-700">Warning Signs</h2>
          <ul className="mt-4 space-y-2">{entry.warningSigns.map((w, i) => <li key={i} className="text-slate-700">🚨 {w}</li>)}</ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-green-700">How to Avoid This</h2>
          <ul className="mt-4 space-y-2">{entry.howToAvoid.map((h, i) => <li key={i} className="text-slate-700">✅ {h}</li>)}</ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">FAQs</h2>
          <div className="mt-4 space-y-6">{entry.faqs.map((f, i) => (<div key={i}><h3 className="text-lg font-semibold text-slate-900">{f.question}</h3><p className="mt-1 text-slate-600">{f.answer}</p></div>))}</div>
        </section>

        <div className="mt-12 rounded-2xl bg-slate-900 p-8 text-center">
          <h2 className="text-xl font-bold text-white">Learn from these mistakes</h2>
          <p className="mt-2 text-slate-300">Avoid these failure modes with our profession-specific guides.</p>
          <Link to="/mistakes" className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">Browse Mistake Guides →</Link>
        </div>
      </article>
      <RelatedContent />
      <Footer />
    </div>
  );
}
