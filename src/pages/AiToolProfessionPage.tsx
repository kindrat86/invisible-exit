import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Reveal from "@/components/Reveal";
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
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-20 pb-16">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-muted-foreground/50">›</span>
          <Link to="/ideas" className="hover:text-primary transition-colors">Ideas</Link>
          <span className="text-muted-foreground/50">›</span>
          <span className="text-foreground font-medium truncate">{entry.profession} + {entry.tool}</span>
        </nav>

        {/* Hero */}
        <Reveal>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
            🤖 AI Tool × Profession
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4 leading-tight">{entry.h1}</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{entry.intro}</p>
        </Reveal>

        {/* Ideas */}
        <Reveal delay={1}>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">5 Micro-SaaS Ideas</h2>
            <div className="space-y-5">
              {entry.ideas.map((idea, i) => (
                <div key={i} className="card-base card-hover p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold text-foreground leading-tight">{i + 1}. {idea.name}</h3>
                    <span className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                      idea.difficulty === "Low" ? "bg-green-100 text-green-700" :
                      idea.difficulty === "Medium" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {idea.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{idea.concept}</p>

                  {/* Pricing/Revenue grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-surface rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Pricing</p>
                      <p className="text-sm font-semibold text-foreground">{idea.pricing}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Revenue Potential</p>
                      <p className="text-sm font-semibold text-green-700">{idea.revenuePotential}</p>
                    </div>
                  </div>

                  {/* How to use tool */}
                  <div className="bg-primary/5 rounded-lg p-4 border-l-2 border-primary">
                    <p className="text-xs font-semibold text-primary uppercase mb-1.5">How to use {entry.tool}</p>
                    <p className="text-sm text-foreground leading-relaxed">{idea.howToUseTool}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Workflow */}
        <Reveal delay={2}>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">The 6-Step Workflow</h2>
            <div className="space-y-3">
              {entry.workflow.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground pt-1.5 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Tool Tips */}
        <Reveal delay={3}>
          <section className="bg-surface rounded-2xl p-6 mb-12">
            <h2 className="text-xl font-bold text-foreground mb-4">{entry.tool} Pro Tips</h2>
            <ul className="space-y-3">
              {entry.toolTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* Limitations */}
        <Reveal delay={4}>
          <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12">
            <h2 className="text-lg font-bold text-amber-900 mb-2">⚠️ Limitations</h2>
            <p className="text-sm text-amber-800 leading-relaxed">{entry.limitations}</p>
          </section>
        </Reveal>

        {/* FAQ */}
        <Reveal delay={5}>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">FAQ</h2>
            <div className="space-y-3">
              {entry.faqs.map((faq, i) => (
                <details key={i} className="group bg-card border border-border rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer font-semibold text-foreground text-sm hover:bg-surface/50 transition-colors select-none">
                    {faq.question}
                    <svg className="w-5 h-5 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </Reveal>

        {/* CTA */}
        <div className="text-center border-t border-border pt-8">
          <Link to="/freedom" className="btn-primary">
            Calculate Your Freedom Number
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}
