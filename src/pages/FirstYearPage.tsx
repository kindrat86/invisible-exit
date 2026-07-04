import { useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ContentPage, CTABox, Disclaimer, SectionHeading, FAQAccordion } from "@/components/ContentPage";
import { firstYearEntries } from "@/data/first-year";

export default function FirstYearPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const entry = firstYearEntries.find((e) => e.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <ContentPage
      title={entry.metaTitle}
      description={entry.metaDescription}
      url={`/first-year/${entry.slug}`}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "First Year" }, { label: entry.profession }]}
    >
      <div className="page-fade">
        <span className="content-tag content-tag-green mb-3">📅 12-Month Roadmap</span>
        <h1 className="text-h1 text-foreground">{entry.h1}</h1>
        <p className="mt-4 text-body-lg text-muted-foreground">{entry.intro}</p>

        {/* Advantages + Challenges */}
        <div className="pros-cons-grid">
          <div className="pros-card">
            <h3>Your Advantages</h3>
            <ul>{entry.advantages.map((a, i) => <li key={i}>✓ {a}</li>)}</ul>
          </div>
          <div className="cons-card">
            <h3>Your Challenges</h3>
            <ul>{entry.challenges.map((c, i) => <li key={i}>⚠ {c}</li>)}</ul>
          </div>
        </div>

        {/* Monthly roadmap */}
        <SectionHeading>Your 12-Month Roadmap</SectionHeading>
        <div className="mt-4 space-y-3">
          {entry.monthlyPlan.map((m, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 transition-all hover:border-border-hover hover:shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">Month {m.month}</span>
                <h3 className="font-bold text-foreground">{m.focus}</h3>
              </div>
              <div className="mt-2 pl-2 border-l-2 border-border space-y-1">
                <p className="text-sm text-foreground"><strong>Goal:</strong> {m.goal}</p>
                <p className="text-sm text-muted-foreground"><strong>Deliverable:</strong> {m.deliverable}</p>
                <p className="text-sm text-amber-600 dark:text-amber-500"><strong>Reality check:</strong> {m.realityCheck}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Year-end expectations */}
        {entry.yearEndExpectations.length > 0 && (
          <section className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-xl font-bold text-foreground">Year-End Expectations</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {entry.yearEndExpectations.map((e, i) => (
                <div key={i} className="stat-card text-left">
                  <p className="stat-label">{e.metric}</p>
                  <p className="stat-value text-base">{e.target}</p>
                  <p className="mt-0.5 text-xs text-green-600 dark:text-green-400">Stretch: {e.stretchGoal}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lessons */}
        <SectionHeading>Lessons Learned</SectionHeading>
        <ul className="space-y-2">
          {entry.lessonsLearned.map((l, i) => (
            <li key={i} className="flex items-start gap-3 text-foreground">
              <span className="text-primary font-bold mt-0.5">→</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>

        <FAQAccordion faqs={entry.faqs} />
        <CTABox title="Start your first year today" description="Calculate your freedom number and begin." />
        <Disclaimer />
      </div>
    </ContentPage>
  );
}
