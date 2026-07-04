/**
 * "Cost of Waiting" calculator pages for /cost-of-waiting/:years/:salary.
 * Shows the opportunity cost of NOT building a micro-SaaS.
 * Combines time horizons with salary brackets.
 */

export interface CostOfWaiting {
  slug: string;
  years: number;
  salary: number;
  salaryLabel: string;
  yearsLabel: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  salaryEarned: number;
  microSaasRevenue: number;
  opportunityCost: number;
  equityVested: number;
  compoundedLoss: number;
  monthlyBreakdown: { month: number; salary: number; microSaas: number; gap: number }[];
  faqs: { question: string; answer: string }[];
}

const SALARY_BRACKETS = [80000, 100000, 120000, 150000, 180000, 200000, 250000, 300000];
const YEAR_OPTIONS = [1, 3, 5, 10, 15, 20];

function formatSalary(salary: number): string {
  return `$${(salary / 1000).toFixed(0)}K`;
}

function formatYears(years: number): string {
  return `${years}-${years === 1 ? "year" : "years"}`;
}

function generateEntry(years: number, salary: number): CostOfWaiting {
  const monthsToFreedom = 18;
  const monthlyGrowthRate = 0.15;
  const maxMrr = (salary / 12) * 1.5;

  let microSaasTotal = 0;
  const breakdown: { month: number; salary: number; microSaas: number; gap: number }[] = [];

  for (let month = 1; month <= years * 12; month++) {
    let mrr = 0;
    if (month >= 1) {
      const growthMonths = month - 1;
      mrr = maxMrr * (1 - Math.exp(-growthMonths / (monthsToFreedom * 1.5)));
      mrr = Math.min(mrr, maxMrr);
    }
    const monthlySalary = salary / 12;
    const monthlyMicroSaas = mrr;
    microSaasTotal += monthlyMicroSaas;
    if (month <= 12 || month % 12 === 0) {
      breakdown.push({
        month,
        salary: Math.round(monthlySalary),
        microSaas: Math.round(monthlyMicroSaas),
        gap: Math.round(monthlySalary - monthlyMicroSaas),
      });
    }
  }

  const salaryEarned = salary * years;
  const opportunityCost = salaryEarned - microSaasTotal;
  const equityVested = Math.round(salary * years * 0.005);
  const compoundedLoss = Math.round(microSaasTotal * 1.5);

  return {
    slug: `${years}-years-${formatSalary(salary).toLowerCase().replace("k", "k")}-salary`,
    years,
    salary,
    salaryLabel: formatSalary(salary),
    yearsLabel: formatYears(years),
    metaTitle: `Cost of Waiting ${years} ${years === 1 ? "Year" : "Years"} at ${formatSalary(salary)} Salary | Invisible Exit`,
    metaDescription: `If you wait ${years} ${years === 1 ? "year" : "years"} before building a micro-SaaS at ${formatSalary(salary)}/year, you lose $${(opportunityCost / 1000).toFixed(0)}K+ in potential recurring revenue. See the math.`,
    h1: `The Cost of Waiting ${years} ${years === 1 ? "Year" : "Years"} at ${formatSalary(salary)}/Year`,
    intro: `You earn ${formatSalary(salary)}/year. Over ${years} ${years === 1 ? "year" : "years"}, that's $${(salaryEarned / 1000).toFixed(0)}K in salary. But if you'd started building a micro-SaaS ${years} ${years === 1 ? "year" : "years"} ago, you'd have $${(microSaasTotal / 1000).toFixed(0)}K in additional recurring revenue. Here's the breakdown.`,
    salaryEarned,
    microSaasRevenue: Math.round(microSaasTotal),
    opportunityCost: Math.round(opportunityCost),
    equityVested,
    compoundedLoss,
    monthlyBreakdown: breakdown,
    faqs: [
      {
        question: `What does ${formatSalary(salary)}/year translate to monthly?`,
        answer: `${formatSalary(salary)}/year = $${Math.round(salary / 12).toLocaleString()}/month before taxes. After federal, state, and FICA taxes, take-home is approximately $${Math.round((salary / 12) * 0.68).toLocaleString()}/month depending on your state.`,
      },
      {
        question: `How long does it take to replace a ${formatSalary(salary)} salary with micro-SaaS?`,
        answer: `At ${formatSalary(salary)}/year, your freedom number is approximately $${Math.round((salary / 12) * 0.7).toLocaleString()}/month in net MRR. With a micro-SaaS charging $29/month, that's ${Math.ceil((salary / 12 * 0.7) / 29)} customers. Most founders reach this in 14-20 months.`,
      },
      {
        question: `What if I'd started ${years} ${years === 1 ? "year" : "years"} ago?`,
        answer: `If you'd started ${years} ${years === 1 ? "year" : "years"} ago with consistent effort (5-8 hours/week), you'd have accumulated approximately $${(microSaasTotal / 1000).toFixed(0)}K in total micro-SaaS revenue. That's recurring revenue that continues paying you every month — unlike salary, which stops when you stop working.`,
      },
    ],
  };
}

export const costOfWaitingPages: CostOfWaiting[] = YEAR_OPTIONS.flatMap((years) =>
  SALARY_BRACKETS.map((salary) => generateEntry(years, salary))
);

export function getCostOfWaiting(years: number, salary: number): CostOfWaiting | undefined {
  return costOfWaitingPages.find((p) => p.years === years && p.salary === salary);
}

export function getCostOfWaitingBySlug(slug: string): CostOfWaiting | undefined {
  return costOfWaitingPages.find((p) => p.slug === slug);
}
