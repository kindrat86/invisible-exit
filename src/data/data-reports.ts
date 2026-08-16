/**
 * Data/benchmark report pages for /data/{slug}.
 *
 * EMPTIED 2026-08-13 (organic operator, guardrail 5.1/5.8, honesty).
 * The 5 reports that lived here (micro-saas-revenue-benchmarks-2026,
 * side-business-statistics-2026, non-compete-enforcement-by-state,
 * micro-saas-pricing-benchmarks, churn-benchmarks-by-niche) published
 * pseudo-precise figures ("Median MRR at month 12: $890", "+220%
 * correlation", per-niche churn tables) that traced to NO dataset.
 * A methodology disclaimer does not make an unsourced number sourced.
 * Every figure had to resolve to a source_url or the report goes, they
 * could not, so they went. The old URLs 301 to /data (see vercel.json).
 *
 * The REAL datasets survive as static pages with per-figure citations:
 *   public/data/golden-handcuffs-index/   (BLS JOLTS/tenure/CES)
 *   public/data/micro-saas-exit-multiples/ (named marketplace reports)
 *
 * Do NOT repopulate this array unless every dataPoint carries a
 * source_url to a real, checkable dataset. A properly-cited state-by-state
 * moonlighting/non-compete reference is planned as a separate asset
 * (backlog item 5), real statutes only.
 */

export interface DataPoint {
  metric: string;
  value: string;
  context: string;
}

export interface DataReport {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  methodology: string;
  dataPoints: DataPoint[];
  keyFindings: string[];
  tables: {
    title: string;
    headers: string[];
    rows: string[][];
  }[];
  takeaways: string[];
  faqs: { question: string; answer: string }[];
}

export const dataReports: DataReport[] = [];
