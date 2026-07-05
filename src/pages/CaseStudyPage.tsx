import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { caseStudies } from "@/data/case-studies";

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  if (!slug) return <Navigate to="/blog" replace />;
  const entry = caseStudies.find((c) => c.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link><span className="mx-2">›</span>
          <span>Case Studies</span><span className="mx-2">›</span>
          <span className="text-slate-700">{entry.productName}</span>
        </nav>

        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{entry.niche}</span>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        {/* Key Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-green-50 p-5 text-center"><div className="text-sm font-bold text-green-700">{entry.revenue}</div><div className="mt-1 text-xs text-slate-600">Revenue</div></div>
          <div className="rounded-xl bg-blue-50 p-5 text-center"><div className="text-sm font-bold text-blue-700">{entry.pricing}</div><div className="mt-1 text-xs text-slate-600">Pricing</div></div>
          <div className="rounded-xl bg-purple-50 p-5 text-center"><div className="text-xs font-bold text-purple-700">{entry.timeToRevenue}</div><div className="mt-1 text-xs text-slate-600">Timeline</div></div>
        </section>

        {/* The Story */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">The Story</h2>
          <p className="mt-3 text-slate-700">{entry.theStory}</p>
        </section>

        {/* What Worked */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">What Worked</h2>
          <div className="mt-4 space-y-3">
            {entry.whatWorked.map((w, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-4">
                <h3 className="font-bold text-slate-900">✅ {w.strategy}</h3>
                <p className="mt-1 text-sm text-slate-600">{w.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Numbers */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Key Numbers</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {entry.keyNumbers.map((n, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-slate-900 p-4">
                <span className="text-sm text-slate-300">{n.metric}</span>
                <span className="font-bold text-white">{n.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Lessons */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Lessons Learned</h2>
          <ul className="mt-4 space-y-2">
            {entry.lessonsLearned.map((l, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700"><span className="mt-1 text-blue-600">💡</span><span>{l}</span></li>
            ))}
          </ul>
        </section>

        {/* What They Did Differently */}
        <section className="mt-10 rounded-xl border-l-4 border-purple-500 bg-purple-50 p-6">
          <h3 className="font-bold text-purple-900">What They Did Differently</h3>
          <p className="mt-2 text-purple-800">{entry.whatTheyDidDifferently}</p>
        </section>

        {/* Tech Stack */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Tech Stack</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.techStack.map((t, i) => <span key={i} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{t}</span>)}
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">FAQs</h2>
          <div className="mt-4 space-y-6">
            {entry.faqs.map((f, i) => (<div key={i}><h3 className="text-lg font-semibold text-slate-900">{f.question}</h3><p className="mt-1 text-slate-600">{f.answer}</p></div>))}
          </div>
        </section>

        <div className="mt-12 rounded-2xl bg-slate-900 p-8 text-center">
          <h2 className="text-xl font-bold text-white">Want to build the next case study?</h2>
          <p className="mt-2 text-slate-300">Get micro-SaaS ideas tailored to your skills.</p>
          <Link to="/ideas" className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">Browse Ideas →</Link>
        </div>
      </article>
      <RelatedContent />
      <Footer />
    </div>
  );
}
