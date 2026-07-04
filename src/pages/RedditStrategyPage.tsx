import { useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ContentPage, CTABox, Disclaimer, TableWrap, SectionHeading, FAQAccordion } from "@/components/ContentPage";
import { redditStrategies } from "@/data/reddit-strategies";

export default function RedditStrategyPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const entry = redditStrategies.find((e) => e.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <ContentPage
      title={entry.metaTitle}
      description={entry.metaDescription}
      url={`/reddit/${entry.slug}`}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reddit Strategy" }, { label: entry.profession }]}
    >
      <div className="page-fade">
        <span className="content-tag content-tag-amber mb-3">▲ Reddit Growth</span>
        <h1 className="text-h1 text-foreground">{entry.h1}</h1>
        <p className="mt-4 text-body-lg text-muted-foreground">{entry.intro}</p>

        <SectionHeading>Best Subreddits for {entry.profession}</SectionHeading>
        <TableWrap>
          <table className="min-w-full text-sm">
            <thead><tr className="bg-surface-dark text-white"><th className="p-3 text-left">Subreddit</th><th className="p-3 text-left">Size</th><th className="p-3 text-left">Why It Works</th></tr></thead>
            <tbody>
              {entry.bestSubreddits.map((sub, i) => (
                <tr key={i} className="border-b border-border transition-colors hover:bg-surface">
                  <td className="p-3 font-semibold text-orange-600 dark:text-orange-400">r/{sub.name}</td>
                  <td className="p-3 text-muted-foreground">{sub.subscribers}</td>
                  <td className="p-3 text-foreground">{sub.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>

        <SectionHeading>Posting Strategy</SectionHeading>
        <p className="text-body text-muted-foreground">{entry.postingStrategy}</p>

        <SectionHeading>Content Ideas That Get Upvotes</SectionHeading>
        <ul className="space-y-2">
          {entry.contentIdeas.map((idea, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-orange-500 font-bold mt-0.5">▲</span>
              <span className="text-foreground">{idea}</span>
            </li>
          ))}
        </ul>

        <section className="mt-12 rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
          <h2 className="text-xl font-bold text-red-900 dark:text-red-400">Mistakes That Get You Banned</h2>
          <ul className="mt-3 space-y-2">
            {entry.commonMistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-red-500 font-bold mt-0.5">✗</span>
                <span className="text-foreground">{m}</span>
              </li>
            ))}
          </ul>
        </section>

        <FAQAccordion faqs={entry.faqs} />
        <CTABox title="Ready to build your audience?" description="Start with your freedom number — see how close you are to independence." />
      </div>
    </ContentPage>
  );
}
