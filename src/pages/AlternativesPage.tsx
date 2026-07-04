import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { alternatives, type Alternative } from "@/data/alternatives";

export default function AlternativesPage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = alternatives.find((a) => a.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead
        title={entry.metaTitle}
        description={entry.metaDescription}
        ogImage={`/og/${entry.slug}.svg`}
      />

      <article className="mx-auto max-w-3xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Alternatives</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.product}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        {/* Why Switch */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Why You Might Want to Switch</h2>
          <ul className="mt-4 space-y-3">
            {entry.whySwitch.map((reason, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-blue-600 font-bold">→</span>
                <span className="text-slate-700">{reason}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Alternatives */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Top Alternatives</h2>
          <div className="mt-6 space-y-6">
            {entry.alternatives.map((alt, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      <a href={alt.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                        {alt.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-slate-600">{alt.bestFor}</p>
                  </div>
                  <span className="whitespace-nowrap rounded-lg bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    {alt.pricing}
                  </span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-bold text-green-700">Pros</h4>
                    <ul className="mt-2 space-y-1">
                      {alt.pros.map((pro, j) => (
                        <li key={j} className="text-sm text-slate-600">✓ {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-red-700">Cons</h4>
                    <ul className="mt-2 space-y-1">
                      {alt.cons.map((con, j) => (
                        <li key={j} className="text-sm text-slate-600">✗ {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verdict */}
        <section className="mt-10 rounded-xl bg-slate-900 p-6 text-white">
          <h2 className="text-xl font-bold">The Verdict</h2>
          <p className="mt-3 text-slate-300">{entry.verdict}</p>
          <Link
            to="/freedom"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Calculate Your Freedom Number →
          </Link>
        </section>

        {/* FAQs */}
        {entry.faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-4 space-y-4">
              {entry.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                  <p className="mt-1 text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        <RelatedContent
          links={[
            { to: "/best/best-ai-tools-for-solo-founders", title: "Best AI Tools for Solo Founders", description: "The complete tool stack" },
            { to: "/calculators/freedom-number", title: "Freedom Number Calculator", description: "When can you quit?" },
            { to: "/compare/anonymous-vs-public-founder", title: "Anonymous vs Public Founder", description: "Which path is right?" },
            { to: `/ideas/for-software-engineers`, title: "Micro-SaaS Ideas for Engineers", description: "5 ideas with revenue math" },
          ]}
          title="Related Resources"
        />
      </article>

      <Footer />
    </div>
  );
}
