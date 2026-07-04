import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { redditStrategies } from "@/data/reddit-strategies";

export default function RedditStrategyPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const entry = redditStrategies.find((e) => e.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} url={`/reddit/${entry.slug}`} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Reddit Strategy</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.profession}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Best Subreddits for {entry.profession}</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white"><tr><th className="p-3">Subreddit</th><th className="p-3">Size</th><th className="p-3">Why It Works</th></tr></thead>
              <tbody>
                {entry.bestSubreddits.map((sub, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="p-3 font-semibold text-orange-600">r/{sub.name}</td>
                    <td className="p-3 text-slate-500">{sub.subscribers}</td>
                    <td className="p-3 text-slate-700">{sub.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Posting Strategy</h2>
          <p className="mt-4 text-slate-700">{entry.postingStrategy}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Content Ideas That Get Upvotes</h2>
          <ul className="mt-4 space-y-2">
            {entry.contentIdeas.map((idea, i) => (
              <li key={i} className="flex gap-3"><span className="text-orange-500 font-bold">▲</span><span className="text-slate-700">{idea}</span></li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-xl font-bold text-red-900">Mistakes That Get You Banned</h2>
          <ul className="mt-3 space-y-2">
            {entry.commonMistakes.map((m, i) => (
              <li key={i} className="text-slate-700">✗ {m}</li>
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
