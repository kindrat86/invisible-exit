import { useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ContentPage, CTABox, Disclaimer, SectionHeading, FAQAccordion } from "@/components/ContentPage";
import { breakEvenPages } from "@/data/break-even";

export default function BreakEvenPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const entry = breakEvenPages.find((e) => e.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <ContentPage
      title={entry.metaTitle}
      description={entry.metaDescription}
      url={`/break-even/${entry.slug}`}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Break-Even Calculator" }, { label: `${entry.mrrLevel} / ${entry.costTier}` }]}
    >
      <div className="page-fade">
        <span className="content-tag content-tag-green mb-3">📊 Break-Even Analysis</span>
        <h1 className="text-h1 text-foreground">{entry.h1}</h1>
        <p className="mt-4 text-body-lg text-muted-foreground">{entry.intro}</p>

        {/* Stats grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="stat-card"><p className="stat-label">Monthly Revenue</p><p className="stat-value">${entry.monthlyRevenue.toLocaleString()}</p></div>
          <div className="stat-card"><p className="stat-label">Monthly Costs</p><p className="stat-value text-red-600 dark:text-red-400">${entry.monthlyCosts.toLocaleString()}</p></div>
          <div className="stat-card"><p className="stat-label">Break-Even</p><p className="stat-value text-green-600 dark:text-green-400">{entry.breakEvenMonths}mo</p></div>
          <div className="stat-card"><p className="stat-label">Total Investment</p><p className="stat-value">${entry.totalInvestment.toLocaleString()}</p></div>
        </div>

        <SectionHeading>The Scenario</SectionHeading>
        <p className="text-body text-muted-foreground">{entry.scenario}</p>

        <SectionHeading>Month-by-Month Breakdown</SectionHeading>
        <div className="mt-4 space-y-3">
          {entry.milestones.map((m, i) => (
            <div key={i} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border-hover">
              <span className="flex-shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">{m.month}</span>
              <div>
                <p className="font-semibold text-foreground">{m.status}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{m.description}</p>
              </div>
            </div>
          ))}
        </div>

        {entry.sensitivity.length > 0 && (
          <section className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20">
            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-400">Sensitivity Analysis</h2>
            <ul className="mt-3 space-y-2">
              {entry.sensitivity.map((s, i) => (
                <li key={i} className="text-foreground"><strong className="text-amber-700 dark:text-amber-500">{s.ifCostsChange}:</strong> {s.newBreakEven}</li>
              ))}
            </ul>
          </section>
        )}

        <FAQAccordion faqs={entry.faqs} />
        <CTABox title="What's your break-even?" description="Calculate your freedom number to find out." />
        <Disclaimer text="Break-even projections are illustrative and based on assumptions. Actual results depend on market, product, execution, and many other factors." />
      </div>
    </ContentPage>
  );
}
