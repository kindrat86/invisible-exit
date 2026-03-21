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
