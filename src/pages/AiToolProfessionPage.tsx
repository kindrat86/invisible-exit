import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Check, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { aiToolProfessionPages } from "@/data/ai-tool-professions";

export default function AiToolProfessionPage() {
  const { profession, tool } = useParams<{ profession: string; tool: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [profession, tool]);

  if (!profession || !tool) return <Navigate to="/blog" replace />;

  const slug = `${profession}-with-${tool}`;
  const entry = aiToolProfessionPages.find((p) => p.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/ideas" className="hover:text-blue-600">Ideas</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.profession} + {entry.tool}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">{entry.h1}</h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">{entry.intro}</p>

        {/* Ideas */}
        <section className="space-y-6 mb-12">
          <h2 className="text-2xl font-bold text-slate-900">5 Micro-SaaS Ideas</h2>
          {entry.ideas.map((idea, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-900">{i + 1}. {idea.name}</h3>
                <span className="shrink-0 ml-4 text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700">{idea.difficulty}</span>
              </div>
              <p className="text-sm text-slate-600 mb-4">{idea.concept}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Pricing</p>
                  <p className="text-sm font-semibold text-slate-900">{idea.pricing}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Revenue Potential</p>
                  <p className="text-sm font-semibold text-green-700">{idea.revenuePotential}</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-l-2 border-blue-500">
                <p className="text-xs font-semibold text-blue-700 uppercase mb-1">How to use {entry.tool}</p>
                <p className="text-sm text-slate-700">{idea.howToUseTool}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Workflow */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">The 6-Step Workflow</h2>
          <div className="space-y-3">
            {entry.workflow.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">{i + 1}</span>
                <p className="text-sm text-slate-700 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tool Tips */}
        <section className="bg-slate-50 rounded-xl p-6 mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">{entry.tool} Pro Tips</h2>
          <ul className="space-y-2">
            {entry.toolTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Limitations */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-bold text-amber-900 mb-2">⚠️ Limitations</h2>
          <p className="text-sm text-amber-800">{entry.limitations}</p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">FAQ</h2>
          <div className="space-y-4">
            {entry.faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-5">
                <h3 className="font-semibold text-slate-900 mb-2 text-sm">{faq.question}</h3>
                <p className="text-sm text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center border-t border-slate-200 pt-8">
          <Link to="/freedom" className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors">
            Calculate Your Freedom Number →
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}
