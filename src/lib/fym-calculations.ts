const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function calculateFymScore(burn: number, revenue: number): number {
  return revenue - burn;
}

export function calculateRunway(fymMonthly: number, months: number): number {
  return fymMonthly * months;
}

export function calculateFreedomNumber(burn: number): number {
  return burn * 12 * 3;
}

export function calculateFreedomPercentage(
  revenue: number,
  burn: number
): number {
  if (burn <= 0) return revenue > 0 ? 100 : 0;
  return Math.min((revenue / burn) * 100, 100);
}

export function calculateRunwayProjection(
  revenue: number,
  months: number
): number {
  return revenue * months;
}

export function getFreedomColor(percentage: number): string {
  if (percentage >= 80) return "text-green-500";
  if (percentage >= 40) return "text-amber-500";
  return "text-red-500";
}

export function getFreedomBgColor(percentage: number): string {
  if (percentage >= 80) return "bg-green-500";
  if (percentage >= 40) return "bg-amber-500";
  return "bg-red-500";
}

export function projectRevenue(
  startMrr: number,
  monthlyGrowthRate: number,
  months: number
): number[] {
  const projections: number[] = [];
  let current = startMrr;
  for (let i = 0; i <= months; i++) {
    projections.push(current);
    current = current * (1 + monthlyGrowthRate / 100);
  }
  return projections;
}

export function monthsToTarget(
  startMrr: number,
  monthlyGrowthRate: number,
  targetMrr: number
): number | null {
  if (startMrr <= 0 || monthlyGrowthRate <= 0) return null;
  if (startMrr >= targetMrr) return 0;
  return Math.ceil(
    Math.log(targetMrr / startMrr) / Math.log(1 + monthlyGrowthRate / 100)
  );
}

// ---- Freedom Levels ----

import type { CalculatorInputsExpanded, FreedomLevelDef, ReverseCalcResult } from "@/types/fym";

export const FREEDOM_LEVELS: FreedomLevelDef[] = [
  {
    level: 1,
    name: "Proof of Life",
    description: "You have a real business. Someone pays you.",
    motivationalCopy:
      "Proof exists. A stranger pays you money. The cage has a door. Now build momentum.",
  },
  {
    level: 2,
    name: "Safety Net",
    description: "6 months of expenses covered by projected side income.",
    motivationalCopy:
      "You have a safety net. Even if everything at work goes sideways, you're not starting from zero.",
  },
  {
    level: 3,
    name: "Negotiation Power",
    description:
      "Side income covers 50% of expenses. You negotiate from strength, not desperation.",
    motivationalCopy:
      "You have negotiation power. You're no longer trapped. You stay because you choose to, not because you have to.",
  },
  {
    level: 4,
    name: "Walk Away Money",
    description: "Side income equals expenses. You can quit tomorrow.",
    motivationalCopy:
      "You can walk away. The math works. Now the question isn't 'can I leave?' but 'when do I want to?'",
  },
  {
    level: 5,
    name: "True FYM",
    description:
      "3 years of expenses banked + revenue covers lifestyle. You're free AND wealthy.",
    motivationalCopy:
      "You did it. True FYM. Three years of runway plus income that covers your life. The cage is open. Walk out whenever you're ready.",
  },
];

export const LEVEL_ZERO_COPY =
  "Every exit starts with $0. Use the Idea Directory to find your first project. Your corporate experience isn't a weakness. It's founder gold.";

export function evaluateFreedomLevel(data: CalculatorInputsExpanded): number {
  const { monthlySideRevenue, monthlyExpenses, monthsToExit, monthlyGrowthRate } = data;

  // Level 5: revenue >= expenses AND total projected savings >= expenses * 36
  if (monthlySideRevenue >= monthlyExpenses && monthlyExpenses > 0) {
    const totalSavings = calculateTotalProjectedSavings(data);
    if (totalSavings >= monthlyExpenses * 36) return 5;
    return 4; // Level 4: revenue >= expenses
  }

  // Level 3: revenue >= 50% of expenses
  if (monthlyExpenses > 0 && monthlySideRevenue >= monthlyExpenses * 0.5) return 3;

  // Level 2: projected side income over months_to_exit >= 6 months of expenses
  if (monthlySideRevenue > 0 && monthlyExpenses > 0) {
    const projectedTotal = calculateTotalProjectedEarnings(
      monthlySideRevenue,
      monthlyGrowthRate,
      monthsToExit
    );
    if (projectedTotal >= monthlyExpenses * 6) return 2;
  }

  // Level 1: revenue >= 100
  if (monthlySideRevenue >= 100) return 1;

  return 0;
}

export function calculateTotalProjectedSavings(
  data: CalculatorInputsExpanded
): number {
  const { monthlySideRevenue, monthlyExpenses, monthsToExit, monthlyGrowthRate } = data;
  let total = 0;
  let revenue = monthlySideRevenue;
  for (let i = 0; i < monthsToExit; i++) {
    const surplus = revenue - monthlyExpenses;
    if (surplus > 0) total += surplus;
    revenue = revenue * (1 + monthlyGrowthRate / 100);
  }
  return total;
}

export function calculateTotalProjectedEarnings(
  startRevenue: number,
  growthRate: number,
  months: number
): number {
  let total = 0;
  let revenue = startRevenue;
  for (let i = 0; i < months; i++) {
    total += revenue;
    revenue = revenue * (1 + growthRate / 100);
  }
  return total;
}

export function calculateProgressToNextLevel(
  data: CalculatorInputsExpanded,
  currentLevel: number
): number {
  const { monthlySideRevenue, monthlyExpenses, monthsToExit, monthlyGrowthRate } = data;

  switch (currentLevel) {
    case 0: {
      // Progress to Level 1: $0 -> $100
      if (monthlySideRevenue <= 0) return 0;
      return Math.min(100, (monthlySideRevenue / 100) * 100);
    }
    case 1: {
      // Progress to Level 2: projected income over months >= 6 months expenses
      if (monthlyExpenses <= 0) return 100;
      const projectedTotal = calculateTotalProjectedEarnings(
        monthlySideRevenue,
        monthlyGrowthRate,
        monthsToExit
      );
      const target = monthlyExpenses * 6;
      return Math.min(100, (projectedTotal / target) * 100);
    }
    case 2: {
      // Progress to Level 3: revenue >= 50% of expenses
      if (monthlyExpenses <= 0) return 100;
      const target = monthlyExpenses * 0.5;
      return Math.min(100, (monthlySideRevenue / target) * 100);
    }
    case 3: {
      // Progress to Level 4: revenue >= expenses
      if (monthlyExpenses <= 0) return 100;
      return Math.min(100, (monthlySideRevenue / monthlyExpenses) * 100);
    }
    case 4: {
      // Progress to Level 5: need savings >= 36 months expenses
      if (monthlyExpenses <= 0) return 100;
      const totalSavings = calculateTotalProjectedSavings(data);
      const target = monthlyExpenses * 36;
      return Math.min(100, (totalSavings / target) * 100);
    }
    default:
      return 100;
  }
}

export function calculateMonthsToLevel(
  data: CalculatorInputsExpanded,
  targetLevel: number
): number | null {
  const { monthlySideRevenue, monthlyExpenses, monthlyGrowthRate } = data;

  if (monthlyGrowthRate <= 0 && monthlySideRevenue <= 0) return null;

  let targetRevenue: number;
  switch (targetLevel) {
    case 1:
      targetRevenue = 100;
      break;
    case 2:
      // Approximate: we need projected total >= 6 * expenses
      // This is complex, so use the simpler heuristic of revenue reaching a meaningful level
      targetRevenue = monthlyExpenses * 0.25;
      break;
    case 3:
      targetRevenue = monthlyExpenses * 0.5;
      break;
    case 4:
      targetRevenue = monthlyExpenses;
      break;
    case 5:
      targetRevenue = monthlyExpenses * 1.5; // Approximate for savings accumulation
      break;
    default:
      return null;
  }

  if (monthlySideRevenue >= targetRevenue) return 0;
  return monthsToTarget(monthlySideRevenue, monthlyGrowthRate, targetRevenue);
}

export function calculateRequiredGrowthRate(
  currentRevenue: number,
  targetRevenue: number,
  months: number
): number {
  if (currentRevenue <= 0 || months <= 0) return 0;
  if (currentRevenue >= targetRevenue) return 0;
  return (Math.pow(targetRevenue / currentRevenue, 1 / months) - 1) * 100;
}

export function getRealityCheckZone(
  rate: number
): ReverseCalcResult["realityCheckZone"] {
  if (rate <= 5) return "very_achievable";
  if (rate <= 15) return "within_average";
  if (rate <= 25) return "ambitious";
  if (rate <= 50) return "very_aggressive";
  return "unrealistic";
}

export function getRealityCheckRecommendation(
  zone: ReverseCalcResult["realityCheckZone"]
): string {
  switch (zone) {
    case "very_achievable":
      return "Very achievable. This growth rate is well below industry average.";
    case "within_average":
      return "Within industry average for early-stage SaaS (10-15% MoM). This is achievable.";
    case "ambitious":
      return "Ambitious but possible. Requires strong product-market fit and active marketing.";
    case "very_aggressive":
      return "Very aggressive. Consider extending your timeline or reducing expenses.";
    case "unrealistic":
      return "Unrealistic at this rate. Extend your timeline, cut expenses, or increase starting revenue.";
  }
}

export function generateMilestones(
  currentRevenue: number,
  requiredRate: number,
  totalMonths: number
): ReverseCalcResult["milestones"] {
  const checkpoints = [1, 3, 6, 12, 18].filter((m) => m <= totalMonths);
  if (!checkpoints.includes(totalMonths)) checkpoints.push(totalMonths);

  const avgPrice = 29;
  return checkpoints.map((month) => {
    const revenue = currentRevenue * Math.pow(1 + requiredRate / 100, month);
    const delta = revenue - currentRevenue;
    return {
      month,
      revenue: Math.round(revenue),
      delta: Math.round(delta),
      approxNewCustomers: Math.ceil(
        (currentRevenue * Math.pow(1 + requiredRate / 100, 1) - currentRevenue) /
          avgPrice
      ),
    };
  });
}

export function calculateRiskRewardRatio(
  salary: number,
  monthlySideIncome: number
): number {
  const annualSideIncome = monthlySideIncome * 12;
  if (annualSideIncome <= 0) return Infinity;
  return Math.round(salary / annualSideIncome);
}

export function getRiskContext(ratio: number): string {
  if (!isFinite(ratio))
    return "Your corporate income is your only income. Focus on growth AND invisibility.";
  if (ratio > 20)
    return "Your corporate income dwarfs your side income. Focus on growth AND invisibility.";
  if (ratio > 5)
    return "You're building real income but still heavily exposed. Keep growing.";
  if (ratio > 2) return "You're approaching balance. Freedom is close.";
  if (ratio > 1)
    return "Your side income nearly matches your salary. You're almost there.";
  return "Your side income exceeds your corporate salary. Why are you still there?";
}

export function calculateCombinedReadinessScore(
  financialScore: number,
  invisibilityScore: number | null
): number | null {
  if (invisibilityScore === null) return null;
  return Math.round(financialScore * 0.6 + invisibilityScore * 0.4);
}

export function calculateFinancialScore(
  monthlyRevenue: number,
  monthlyExpenses: number
): number {
  if (monthlyExpenses <= 0) return monthlyRevenue > 0 ? 100 : 0;
  return Math.min(100, (monthlyRevenue / monthlyExpenses) * 100);
}
