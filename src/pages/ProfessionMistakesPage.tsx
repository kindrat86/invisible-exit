import { useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ContentPage, CTABox, Disclaimer, SectionHeading, FAQAccordion } from "@/components/ContentPage";
import { professionMistakes } from "@/data/profession-mistakes";

export default function ProfessionMistakesPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const entry = professionMistakes.find((e) => e.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <ContentPage
      title={entry.metaTitle}
      description={entry.metaDescription}
      url={`/mistakes/${entry.slug}`}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Mistakes" }, { label: entry.profession }]}
    >
      <div className="page-fade">
        <span className="content-tag content-tag-red mb-3">⚠ Common Pitfalls</span>
        <h1 className="text-h1 text-foreground">{entry.h1}</h1>
        <p className="mt-4 text-body-lg text-muted-foreground">{entry.intro}</p>

        <SectionHeading>The Mistakes That Derail {entry.profession}</SectionHeading>
        <div className="mt-6 space-y-4">
          {entry.mistakes.map((m, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 transition-all hover:border-border-hover hover:shadow-sm">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 text-sm font-bold dark:bg-red-950/40 dark:text-red-400">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{m.mistake}</h3>
                  <p className="mt-2 text-sm text-muted-foreground"><strong className="text-foreground">Why it happens:</strong> {m.why}</p>
                  <p className="mt-2 text-sm text-green-700 dark:text-green-400"><strong>The fix:</strong> {m.fix}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-12 rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-900/50 dark:bg-green-950/20">
          <h2 className="text-xl font-bold text-green-900 dark:text-green-400">Signs You're on the Right Track</h2>
          <ul className="mt-4 space-y-2">
            {entry.positiveSigns.map((sign, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span className="text-foreground">{sign}</span>
              </li>
            ))}
          </ul>
        </section>

        <FAQAccordion faqs={entry.faqs} />
        <CTABox
          title="Avoiding these mistakes?"
          description="Calculate your freedom number and see how close you are."
        />
        <Disclaimer />
      </div>
    </ContentPage>
  );
}
