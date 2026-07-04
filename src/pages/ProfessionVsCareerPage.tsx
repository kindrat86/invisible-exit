import { useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ContentPage, CTABox, TableWrap, SectionHeading, FAQAccordion } from "@/components/ContentPage";
import { professionVsCareer } from "@/data/profession-vs-career";

export default function ProfessionVsCareerPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const entry = professionVsCareer.find((e) => e.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <ContentPage
      title={entry.metaTitle}
      description={entry.metaDescription}
      url={`/vs/${entry.slug}`}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Career vs SaaS" }, { label: entry.profession }]}
      maxWidth="standard"
    >
      <div className="page-fade">
        <span className="content-tag content-tag-blue mb-3">⚖ Career vs SaaS</span>
        <h1 className="text-h1 text-foreground">{entry.h1}</h1>
        <p className="mt-4 text-body-lg text-muted-foreground">{entry.intro}</p>

        {/* Side-by-side comparison cards */}
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-lg font-bold text-foreground">The {entry.profession} Career</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Salary</dt><dd className="font-semibold text-foreground">{entry.careerPath.salaryRange}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Growth</dt><dd className="font-semibold text-foreground">{entry.careerPath.growthPotential}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Risk</dt><dd className="font-semibold text-foreground">{entry.careerPath.riskLevel}</dd></div>
            </dl>
            <div className="pros-cons-grid !mt-4">
              <div className="pros-card !p-4"><h3 className="text-sm">Pros</h3><ul>{entry.careerPath.pros.map((p, i) => <li key={i}>✓ {p}</li>)}</ul></div>
              <div className="cons-card !p-4"><h3 className="text-sm">Cons</h3><ul>{entry.careerPath.cons.map((c, i) => <li key={i}>✗ {c}</li>)}</ul></div>
            </div>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-900/50 dark:bg-green-950/20">
            <h2 className="text-lg font-bold text-foreground">The Micro-SaaS Path</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Revenue</dt><dd className="font-semibold text-foreground">{entry.saasPath.potentialRevenue}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted-foreground">First $</dt><dd className="font-semibold text-foreground">{entry.saasPath.timeToFirstDollar}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Risk</dt><dd className="font-semibold text-foreground">{entry.saasPath.riskLevel}</dd></div>
            </dl>
            <div className="pros-cons-grid !mt-4">
              <div className="pros-card !p-4"><h3 className="text-sm">Pros</h3><ul>{entry.saasPath.pros.map((p, i) => <li key={i}>✓ {p}</li>)}</ul></div>
              <div className="cons-card !p-4"><h3 className="text-sm">Cons</h3><ul>{entry.saasPath.cons.map((c, i) => <li key={i}>✗ {c}</li>)}</ul></div>
            </div>
          </div>
        </div>

        {/* Comparison table */}
        {entry.comparison && entry.comparison.length > 0 && (
          <>
            <SectionHeading>Head-to-Head Comparison</SectionHeading>
            <TableWrap>
              <table className="min-w-full text-sm">
                <thead><tr className="bg-surface-dark text-white"><th className="p-3 text-left">Factor</th><th className="p-3 text-left">Career</th><th className="p-3 text-left">Micro-SaaS</th></tr></thead>
                <tbody>
                  {entry.comparison.map((row, i) => (
                    <tr key={i} className="border-b border-border transition-colors hover:bg-surface">
                      <td className="p-3 font-semibold text-foreground">{row.factor}</td>
                      <td className="p-3 text-muted-foreground">{(row as any).career}</td>
                      <td className="p-3 text-muted-foreground">{(row as any).saas ?? (row as any).saas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </>
        )}

        <section className="mt-8 rounded-xl bg-surface-dark p-6 text-white">
          <h2 className="text-xl font-bold">The Verdict</h2>
          <p className="mt-3 text-white/80">{entry.verdict}</p>
        </section>

        <SectionHeading>The Hybrid Approach</SectionHeading>
        <p className="text-body text-muted-foreground">{entry.hybridApproach}</p>

        <FAQAccordion faqs={entry.faqs} />
        <CTABox title="Why not both?" description="Keep your career. Build on the side. Calculate when you can quit." />
      </div>
    </ContentPage>
  );
}
