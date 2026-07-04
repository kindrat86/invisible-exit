import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { professionStacks, type ProfessionStack } from "@/data/profession-stacks";

export default function ProfessionStackPage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = professionStacks.find((s) => s.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Tool Stacks</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.profession}</span>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-4xl">{entry.icon}</span>
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        </div>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        {/* Cost Summary */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-5 text-center">
            <div className="text-2xl font-extrabold text-blue-700">{entry.totalMonthlyCost}</div>
            <div className="mt-1 text-sm text-slate-600">Total Monthly Cost</div>
          </div>
          <div className="rounded-xl bg-green-50 p-5 text-center">
            <div className="text-lg font-bold text-green-700">{entry.replaces}</div>
            <div className="mt-1 text-sm text-slate-600">What It Replaces</div>
          </div>
          <div className="rounded-xl bg-purple-50 p-5 text-center">
            <div className="text-lg font-bold text-purple-700">{entry.weeklyTimeCommitment}</div>
            <div className="mt-1 text-sm text-slate-600">Time Needed</div>
          </div>
        </section>

        {/* The Stack */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">The Complete Stack</h2>
          <div className="mt-4 space-y-4">
            {entry.stack.map((item, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">{item.tool}</h3>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{item.why}</p>
                  </div>
                  <span className="whitespace-nowrap rounded-lg bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    {item.cost}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10 rounded-xl bg-gradient-to-br from-slate-900 to-blue-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to Start Building?</h2>
          <p className="mt-2 text-slate-300">
            Get all 5 AI-powered tools — including the Idea Pipeline that validates your micro-SaaS in 48 hours.
          </p>
          <Link
            to="/freedom"
            className="mt-4 inline-block rounded-lg bg-white px-8 py-3 font-bold text-slate-900 hover:bg-slate-100"
          >
            Calculate Your Freedom Number →
          </Link>
        </section>

        {/* FAQs */}
        {entry.faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">FAQs</h2>
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

        <RelatedContent
          links={[
            { to: `/ideas/${entry.slug}`, title: `Micro-SaaS Ideas for ${entry.profession}`, description: "5 tailored ideas" },
            { to: "/best/best-ai-tools-for-solo-founders", title: "Best AI Tools for Solo Founders", description: "Full comparison" },
            { to: "/resources/ai-tool-stack-for-solo-founders", title: "AI Tool Stack Guide", description: "Detailed walkthrough" },
            { to: "/calculators/freedom-number", title: "Freedom Number Calculator", description: "Your exit number" },
          ]}
          title="Related Resources"
        />
      </article>

      <Footer />
    </div>
  );
}
