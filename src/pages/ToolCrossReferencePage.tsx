import { useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ContentPage, CTABox, SectionHeading, FAQAccordion } from "@/components/ContentPage";
import { toolCrossReference } from "@/data/tool-cross-reference";

export default function ToolCrossReferencePage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const entry = toolCrossReference.find((e) => e.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <ContentPage
      title={entry.metaTitle}
      description={entry.metaDescription}
      url={`/tools/${entry.slug}`}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Best Tools", href: "/best" }, { label: `${entry.profession} — ${entry.category}` }]}
    >
      <div className="page-fade">
        <span className="content-tag content-tag-blue mb-3">🛠 Tool Stack</span>
        <h1 className="text-h1 text-foreground">{entry.h1}</h1>
        <p className="mt-4 text-body-lg text-muted-foreground">{entry.intro}</p>

        <SectionHeading>Recommended Tools</SectionHeading>
        <div className="mt-6 space-y-4">
          {entry.tools.map((tool, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 transition-all hover:border-border-hover hover:shadow-sm card-premium">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{tool.best}</p>
                </div>
                <span className="content-tag content-tag-blue flex-shrink-0">{tool.pricing}</span>
              </div>
              <p className="mt-3 text-sm text-foreground">{tool.why}</p>
              <p className="mt-2 text-xs text-muted-foreground">Alternative: <span className="text-primary font-medium">{tool.alternative}</span></p>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-xl font-bold text-foreground">Why {entry.profession} Need Different Tools</h2>
          <p className="mt-3 text-muted-foreground">{entry.professionSpecificNeeds}</p>
        </section>

        <section className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-900/50 dark:bg-green-950/20">
          <h2 className="text-xl font-bold text-green-900 dark:text-green-400">Budget-Friendly Approach</h2>
          <p className="mt-3 text-foreground">{entry.budgetFriendly}</p>
        </section>

        <FAQAccordion faqs={entry.faqs} />
        <CTABox title="Found the right tools?" description="Now calculate your freedom number." />
      </div>
    </ContentPage>
  );
}
