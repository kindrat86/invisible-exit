import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { audienceIdeas } from "@/data/audience-ideas";

export default function AudiencePage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = audienceIdeas.find((a) => a.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription}
        url={`https://invisibleexit.com/audience/${entry.slug}`} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Audience</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.audience}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        {/* Profile Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-green-50 p-5">
            <div className="text-sm font-bold text-green-700">Advantages</div>
            <p className="mt-1 text-slate-700">{entry.advantages}</p>
          </div>
          <div className="rounded-xl bg-orange-50 p-5">
            <div className="text-sm font-bold text-orange-700">Challenges</div>
            <p className="mt-1 text-slate-700">{entry.challenges}</p>
          </div>
          <div className="rounded-xl bg-blue-50 p-5 text-center">
            <div className="text-lg font-extrabold text-blue-700">{entry.timeCommitment}</div>
            <div className="mt-1 text-sm text-slate-600">Weekly Time Commitment</div>
          </div>
          <div className="rounded-xl bg-purple-50 p-5 text-center">
            <div className="text-lg font-extrabold text-purple-700">{entry.budgetRange}</div>
            <div className="mt-1 text-sm text-slate-600">Startup Budget</div>
          </div>
        </section>

        {/* Best Ideas */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Best Micro-SaaS Ideas for {entry.audience}</h2>
          <div className="mt-4 space-y-4">
            {entry.bestIdeas.map((idea, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-5">
                <h3 className="text-lg font-bold text-slate-900">{idea.name}</h3>
                <p className="mt-1 text-slate-600">{idea.description}</p>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div><span className="text-slate-500">Why it fits:</span> <span className="font-semibold">{idea.whyFit}</span></div>
                  <div><span className="text-slate-500">Pricing:</span> <span className="font-semibold text-green-700">{idea.pricing}</span></div>
                  <div><span className="text-slate-500">Time to revenue:</span> <span className="font-semibold">{idea.timeToRevenue}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Transferable Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.skills.map((s, i) => (
              <span key={i} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{s}</span>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Pro Tips</h2>
          <ul className="mt-4 space-y-2">
            {entry.tips.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <span className="mt-1 text-blue-600">💡</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQs */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
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
          <h2 className="text-xl font-bold text-white">Not your audience?</h2>
          <p className="mt-2 text-slate-300">Browse micro-SaaS ideas tailored to your profession and skills.</p>
          <Link to="/ideas" className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">Browse Ideas →</Link>
        </div>
      </article>

      <RelatedContent />
      <Footer />
    </div>
  );
}
