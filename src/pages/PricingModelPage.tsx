import { useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ContentPage, CTABox, TableWrap, SectionHeading, FAQAccordion } from "@/components/ContentPage";
import { pricingModels } from "@/data/pricing-models";

export default function PricingModelPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const entry = pricingModels.find((e) => e.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <ContentPage
      title={entry.metaTitle}
      description={entry.metaDescription}
      url={`/pricing-models/${entry.slug}`}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing Models" }, { label: entry.model }]}
    >
      <div className="page-fade">
        <span className="content-tag content-tag-blue mb-3">$ Pricing Strategy</span>
        <h1 className="text-h1 text-foreground">{entry.h1}</h1>
        <p className="mt-4 text-body-lg text-muted-foreground">{entry.intro}</p>

        <SectionHeading>How It Works</SectionHeading>
        <p className="text-body text-muted-foreground">{entry.howItWorks}</p>

        <div className="pros-cons-grid">
          <div className="pros-card">
            <h3>Pros</h3>
            <ul>{entry.pros.map((p, i) => <li key={i}>✓ {p}</li>)}</ul>
          </div>
          <div className="cons-card">
            <h3>Cons</h3>
            <ul>{entry.cons.map((c, i) => <li key={i}>✗ {c}</li>)}</ul>
          </div>
        </div>

        <SectionHeading>Best For</SectionHeading>
        <p className="text-body text-muted-foreground">{entry.bestFor}</p>

        {entry.realExamples.length > 0 && (
          <>
            <SectionHeading>Real-World Examples</SectionHeading>
            <TableWrap>
              <table className="min-w-full text-sm">
                <thead><tr className="bg-surface-dark text-white"><th className="p-3 text-left">Product</th><th className="p-3 text-left">Pricing</th><th className="p-3 text-left">Revenue</th></tr></thead>
                <tbody>
                  {entry.realExamples.map((ex, i) => (
                    <tr key={i} className="border-b border-border transition-colors hover:bg-surface">
                      <td className="p-3 font-semibold text-foreground">{ex.product}</td>
                      <td className="p-3 text-muted-foreground">{ex.pricing}</td>
                      <td className="p-3 font-semibold text-green-600 dark:text-green-400">{ex.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </>
        )}

        {entry.benchmarks.length > 0 && (
          <section className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-xl font-bold text-foreground">Benchmarks</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {entry.benchmarks.map((b, i) => (
                <div key={i} className="stat-card text-left">
                  <dt className="stat-label">{b.metric}</dt>
                  <dd className="stat-value">{b.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <SectionHeading>Implementation</SectionHeading>
        <p className="text-body text-muted-foreground">{entry.implementation}</p>

        <FAQAccordion faqs={entry.faqs} />
        <CTABox
          title="Choosing a pricing model?"
          description="Calculate your freedom number first — then price accordingly."
        />
      </div>
    </ContentPage>
  );
}
