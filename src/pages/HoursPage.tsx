import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Check, X, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Reveal from "@/components/Reveal";
import { hoursPages } from "@/data/hours-pages";

export default function HoursPage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const entry = hoursPages.find((h) => h.slug === slug);
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
          <span className="text-foreground font-medium">{entry.timeLabel}</span>
        </nav>

        {/* Hero */}
        <Reveal>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
            ⏱️ Time Strategy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4 leading-tight">{entry.h1}</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{entry.intro}</p>
        </Reveal>

        {/* Weekly Schedule */}
        <Reveal delay={1}>
          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Weekly Schedule
              <span className="ml-2 text-primary">({entry.hoursPerWeek} hours)</span>
            </h2>
            <div className="space-y-3">
              {entry.weeklySchedule.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border card-hover bg-card">
                  <div className="w-28 sm:w-32 shrink-0">
                    <p className="text-xs font-bold text-primary">{s.day}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.duration}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{s.block}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.task}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* What you can accomplish */}
        <Reveal delay={2}>
          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-green-100 text-green-600">
                <Check className="w-4 h-4" />
              </span>
              What You Can Accomplish
            </h2>
            <ul className="space-y-2.5">
              {entry.whatYouCanAccomplish.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-green-50/50 border border-green-100">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* What you cannot */}
        <Reveal delay={3}>
          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-red-100 text-red-600">
                <X className="w-4 h-4" />
              </span>
              What You Can't
            </h2>
            <ul className="space-y-2.5">
              {entry.whatYouCannot.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/50 border border-border">
                  <X className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* Framework */}
        <Reveal delay={4}>
          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4">The Framework</h2>
            <div className="space-y-3">
              {entry.framework.map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border card-hover bg-card">
                  <div className="w-24 sm:w-28 shrink-0">
                    <p className="text-xs font-bold text-primary">{f.phase}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{f.focus}</p>
                    <p className="text-xs text-muted-foreground mt-1">{f.timeAllocation}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Milestone */}
        <Reveal delay={5}>
          <section className="bg-primary/5 rounded-2xl p-6 mb-10 border-l-4 border-primary">
            <h2 className="text-lg font-bold text-foreground mb-2">📅 Milestone Timeline</h2>
            <p className="text-sm text-foreground leading-relaxed">{entry.milestoneEstimate}</p>
          </section>
        </Reveal>

        {/* Tips */}
        <Reveal delay={6}>
          <section className="bg-surface rounded-2xl p-6 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4">💡 Pro Tips</h2>
            <ul className="space-y-3">
              {entry.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* FAQ */}
        <Reveal delay={7}>
          <section className="mb-10">
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
