import { useState, useMemo, useEffect, useCallback } from "react";
import type { CalculatorInputsExpanded, FymEntry, InvisibilityScore } from "@/types/fym";
import {
  calculateFymScore,
  calculateRunway,
  calculateFreedomNumber,
  calculateFreedomPercentage,
  evaluateFreedomLevel,
  calculateProgressToNextLevel,
  calculateMonthsToLevel,
  calculateRequiredGrowthRate,
  getRealityCheckZone,
  getRealityCheckRecommendation,
  generateMilestones,
  calculateFinancialScore,
  calculateRiskRewardRatio,
  getRiskContext,
  calculateCombinedReadinessScore,
  calculateTotalProjectedEarnings,
} from "@/lib/fym-calculations";

const DEFAULTS: CalculatorInputsExpanded = {
  monthsToExit: 18,
  monthlyExpenses: 10000,
  monthlySideRevenue: 0,
  monthlyGrowthRate: 15,
  corporateSalary: 120000,
  targetMonthlyRevenue: 4000,
};

export function useCalculator(latestEntry: FymEntry | null | undefined) {
  const [inputs, setInputs] = useState<CalculatorInputsExpanded>(() => {
    if (latestEntry) {
      return {
        monthsToExit: latestEntry.runway_months,
        monthlyExpenses: Number(latestEntry.monthly_burn),
        monthlySideRevenue: Number(latestEntry.monthly_revenue),
        monthlyGrowthRate: Number(latestEntry.monthly_growth_rate) || 15,
        corporateSalary: Number(latestEntry.corporate_salary) || 120000,
        targetMonthlyRevenue: Number(latestEntry.target_monthly_revenue) || 4000,
      };
    }
    return DEFAULTS;
  });

  // Sync when latestEntry loads asynchronously
  const [hasLoadedEntry, setHasLoadedEntry] = useState(false);
  useEffect(() => {
    if (latestEntry && !hasLoadedEntry) {
      setInputs({
        monthsToExit: latestEntry.runway_months,
        monthlyExpenses: Number(latestEntry.monthly_burn),
        monthlySideRevenue: Number(latestEntry.monthly_revenue),
        monthlyGrowthRate: Number(latestEntry.monthly_growth_rate) || 15,
        corporateSalary: Number(latestEntry.corporate_salary) || 120000,
        targetMonthlyRevenue: Number(latestEntry.target_monthly_revenue) || 4000,
      });
      setHasLoadedEntry(true);
    }
  }, [latestEntry, hasLoadedEntry]);

  const updateInput = useCallback(
    <K extends keyof CalculatorInputsExpanded>(
      key: K,
      value: CalculatorInputsExpanded[K]
    ) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetToDefaults = useCallback(() => {
    setInputs(DEFAULTS);
  }, []);

  // Core FYM calculations
  const coreResults = useMemo(() => {
    const fymMonthly = calculateFymScore(inputs.monthlyExpenses, inputs.monthlySideRevenue);
    const fymTotal = calculateRunway(fymMonthly, inputs.monthsToExit);
    const freedomNumber = calculateFreedomNumber(inputs.monthlyExpenses);
    const freedomPercentage = calculateFreedomPercentage(
      inputs.monthlySideRevenue,
      inputs.monthlyExpenses
    );
    return { fymMonthly, fymTotal, freedomNumber, freedomPercentage };
  }, [inputs.monthlyExpenses, inputs.monthlySideRevenue, inputs.monthsToExit]);

  // Freedom level
  const freedomLevel = useMemo(() => evaluateFreedomLevel(inputs), [inputs]);

  const progressToNext = useMemo(
    () => calculateProgressToNextLevel(inputs, freedomLevel),
    [inputs, freedomLevel]
  );

  const monthsToNextLevel = useMemo(
    () =>
      freedomLevel < 5
        ? calculateMonthsToLevel(inputs, freedomLevel + 1)
        : null,
    [inputs, freedomLevel]
  );

  // Reverse calculator
  const reverseCalc = useMemo(() => {
    const { monthlySideRevenue, targetMonthlyRevenue, monthsToExit } = inputs;
    if (monthlySideRevenue <= 0) return null;
    if (monthlySideRevenue >= targetMonthlyRevenue) return null;

    const requiredGrowthRate = calculateRequiredGrowthRate(
      monthlySideRevenue,
      targetMonthlyRevenue,
      monthsToExit
    );
    const zone = getRealityCheckZone(requiredGrowthRate);
    const recommendation = getRealityCheckRecommendation(zone);
    const milestones = generateMilestones(
      monthlySideRevenue,
      requiredGrowthRate,
      monthsToExit
    );

    return {
      requiredGrowthRate,
      milestones,
      realityCheckZone: zone,
      recommendation,
    };
  }, [inputs.monthlySideRevenue, inputs.targetMonthlyRevenue, inputs.monthsToExit]);

  // Risk assessment
  const riskAssessment = useCallback(
    (invisibilityScore: InvisibilityScore | null | undefined) => {
      const financialScore = calculateFinancialScore(
        inputs.monthlySideRevenue,
        inputs.monthlyExpenses
      );
      const invScore = invisibilityScore?.total_score ?? null;
      const combinedScore = calculateCombinedReadinessScore(financialScore, invScore);
      const riskRewardRatio = calculateRiskRewardRatio(
        inputs.corporateSalary,
        inputs.monthlySideRevenue
      );
      const riskContext = getRiskContext(riskRewardRatio);

      return {
        financialScore,
        invisibilityScore: invScore,
        combinedScore,
        riskRewardRatio,
        riskContext,
      };
    },
    [inputs.monthlySideRevenue, inputs.monthlyExpenses, inputs.corporateSalary]
  );

  // Scenario: current path computed values
  const currentPathScenario = useMemo(() => {
    const { monthlySideRevenue, monthlyGrowthRate, monthlyExpenses, monthsToExit, targetMonthlyRevenue } = inputs;
    const monthsToTarget =
      monthlySideRevenue > 0 && monthlyGrowthRate > 0
        ? Math.ceil(
            Math.log(targetMonthlyRevenue / monthlySideRevenue) /
              Math.log(1 + monthlyGrowthRate / 100)
          )
        : null;
    const monthsToLevel4 =
      monthlySideRevenue > 0 && monthlyGrowthRate > 0 && monthlySideRevenue < monthlyExpenses
        ? Math.ceil(
            Math.log(monthlyExpenses / monthlySideRevenue) /
              Math.log(1 + monthlyGrowthRate / 100)
          )
        : monthlySideRevenue >= monthlyExpenses
          ? 0
          : null;

    const projectedRevenueAtExit =
      monthlySideRevenue * Math.pow(1 + monthlyGrowthRate / 100, monthsToExit);
    const totalProjectedEarnings = calculateTotalProjectedEarnings(
      monthlySideRevenue,
      monthlyGrowthRate,
      monthsToExit
    );

    return {
      monthsToTarget: monthlySideRevenue >= targetMonthlyRevenue ? 0 : monthsToTarget,
      monthsToLevel4,
      projectedRevenueAtExit,
      totalProjectedEarnings,
    };
  }, [inputs]);

  return {
    inputs,
    updateInput,
    resetToDefaults,
    coreResults,
    freedomLevel,
    progressToNext,
    monthsToNextLevel,
    reverseCalc,
    riskAssessment,
    currentPathScenario,
    defaults: DEFAULTS,
  };
}
