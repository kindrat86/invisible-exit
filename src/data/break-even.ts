/**
 * Break-even calculator pages for /break-even/:slug.
 * Cross-join: 6 revenue tiers × 4 cost brackets = 24 pages.
 */
export interface BreakEvenPage {
  slug: string;
  mrrLevel: string;
  costTier: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  monthlyRevenue: number;
  monthlyCosts: number;
  breakEvenMonths: number;
  totalInvestment: number;
  scenario: string;
  milestones: { month: string; status: string; description: string }[];
  sensitivity: { ifCostsChange: string; newBreakEven: string }[];
  faqs: { question: string; answer: string }[];
}

const revenueLevels = [
  { mrr: 500, label: "$500 MRR", slugPart: "500-mrr" },
  { mrr: 1000, label: "$1K MRR", slugPart: "1k-mrr" },
  { mrr: 2000, label: "$2K MRR", slugPart: "2k-mrr" },
  { mrr: 4000, label: "$4K MRR", slugPart: "4k-mrr" },
  { mrr: 10000, label: "$10K MRR", slugPart: "10k-mrr" },
  { mrr: 25000, label: "$25K MRR", slugPart: "25k-mrr" },
];

const costTiers = [
  { cost: 50, label: "Bootstrapped ($0-100/mo)", slugPart: "bootstrapped" },
  { cost: 300, label: "Low Cost ($100-500/mo)", slugPart: "low-cost" },
  { cost: 1250, label: "Medium Cost ($500-2K/mo)", slugPart: "medium-cost" },
  { cost: 3500, label: "High Cost ($2K-5K/mo)", slugPart: "high-cost" },
];

function generateBreakEven(rev: typeof revenueLevels[0], cost: typeof costTiers[0]): BreakEvenPage {
  const netMonthly = rev.mrr - cost.cost;
  const breakEven = netMonthly > 0 ? Math.ceil(3600 / netMonthly) : 99; // Assume ~$3,600 dev time as base investment
  const totalInvestment = cost.cost * breakEven;
  return {
    slug: `break-even-${rev.slugPart}-${cost.slugPart}`,
    mrrLevel: rev.label,
    costTier: cost.label,
    metaTitle: `Break-Even Calculator: ${rev.label} at ${cost.label} (2026)`,
    metaDescription: `How long does it take to break even on a micro-SaaS earning ${rev.label} with ${cost.label} operating costs? Month-by-month breakdown and sensitivity analysis.`,
    h1: `Break-Even Analysis: ${rev.label} with ${cost.label}`,
    intro: `If your micro-SaaS earns ${rev.label} and your monthly costs are ${cost.label} (${cost.cost > 0 ? `$${cost.cost}/mo` : "near zero"}), here's exactly how long it takes to recover your initial investment — and what happens if costs change.`,
    monthlyRevenue: rev.mrr,
    monthlyCosts: cost.cost,
    breakEvenMonths: breakEven,
    totalInvestment,
    scenario: `You're a solo founder who spent approximately 60 hours building your product over 3 months. At a conservative rate of $60/hour for your time, your invested effort is worth ~$3,600. With ${rev.label} in revenue and $${cost.cost}/mo in costs (hosting, tools, API calls), your net profit is $${netMonthly}/month. You'll recover your investment in ${breakEven} months.`,
    milestones: [
      { month: "Month 1", status: "Pre-launch", description: `Building MVP. Costs: $${cost.cost}. Revenue: $0. Focus: ship fast, validate with 3 pre-orders.` },
      { month: "Month 3", status: "Early revenue", description: `Revenue: $${Math.round(rev.mrr * 0.3)}/mo. Costs: $${cost.cost}/mo. You're ${Math.round(rev.mrr * 0.3) - cost.cost > 0 ? "profitable" : "still investing"} monthly.` },
      { month: "Month 6", status: "Growth", description: `Revenue: $${Math.round(rev.mrr * 0.6)}/mo. Costs: $${cost.cost}/mo. Net: $${Math.round(rev.mrr * 0.6) - cost.cost}/mo.` },
      { month: `Month ${breakEven}`, status: "Break-even", description: `You've recovered your $3,600 investment. Every dollar from here is pure profit.` },
      { month: `Month ${breakEven + 6}`, status: "Profit", description: `Cumulative profit: $${netMonthly * 6}/mo. Consider reinvesting in growth.` },
    ],
    sensitivity: [
      { ifCostsChange: `If costs increase by 50% (to $${Math.round(cost.cost * 1.5)}/mo)`, newBreakEven: `${Math.ceil(3600 / (rev.mrr - cost.cost * 1.5))} months` },
      { ifCostsChange: `If costs decrease by 50% (to $${Math.round(cost.cost * 0.5)}/mo)`, newBreakEven: `${Math.ceil(3600 / (rev.mrr - cost.cost * 0.5))} months` },
      { ifCostsChange: `If revenue drops 30% (to $${Math.round(rev.mrr * 0.7)}/mo)`, newBreakEven: `${rev.mrr * 0.7 > cost.cost ? Math.ceil(3600 / (rev.mrr * 0.7 - cost.cost)) : "Never (costs exceed revenue)"} months` },
    ],
    faqs: [
      {
        question: `Is ${rev.label} realistic for a side business?`,
        answer: `${rev.mrr >= 4000 ? "Yes, but it typically takes 12-18 months of consistent effort. Most solo founders reach this level after finding a specific niche and charging $29-99/month per customer." : rev.mrr >= 1000 ? "Yes, $1K-$2K MRR is achievable within 6-12 months. You need 35-70 paying customers at $29/month." : "Yes, $500 MRR is the first meaningful milestone. It requires just 18 customers at $29/month — achievable in 3-6 months."}`,
      },
      {
        question: `What costs are included in "${cost.label}"?`,
        answer: `Hosting (Vercel/Netlify: $0-20), domain ($10-15/year), database (Supabase: $0-25), email (Resend: $0-20), analytics (PostHog: $0-50),${cost.cost > 100 ? " API calls, payment processing fees (2.9% + $0.30/transaction)," : ""}${cost.cost > 500 ? " automation tools (Zapier/Make: $20-100), CRM, customer support tools," : ""}${cost.cost > 2000 ? " contractors, marketing spend, and professional services" : ""}.`,
      },
      {
        question: "Should I reinvest profits or take them out?",
        answer: `Until you reach ${breakEven <= 6 ? "$4K MRR" : "break-even"}, reinvest everything into growth (content, ads, tools). After break-even, take 30% as profit and reinvest 70%. The goal is reaching your freedom number — typically $4,000/month MRR.`,
      },
    ],
  };
}

export const breakEvenPages: BreakEvenPage[] = revenueLevels.flatMap(rev =>
  costTiers.map(cost => generateBreakEven(rev, cost))
);
