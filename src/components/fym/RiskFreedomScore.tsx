import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  formatCurrency,
  FREEDOM_LEVELS,
  calculateMonthsToLevel,
} from "@/lib/fym-calculations";
import type { CalculatorInputsExpanded, RiskAssessment } from "@/types/fym";

interface RiskFreedomScoreProps {
  inputs: CalculatorInputsExpanded;
  freedomLevel: number;
  riskAssessment: RiskAssessment;
  onSwitchToInvisibility: () => void;
}

function RiskFreedomScoreInner({
  inputs,
  freedomLevel,
  riskAssessment,
  onSwitchToInvisibility,
}: RiskFreedomScoreProps) {
  const gap = inputs.monthlyExpenses - inputs.monthlySideRevenue;
  const monthsToLevel4 = calculateMonthsToLevel(inputs, 4);
  const financialPct = Math.min(100, riskAssessment.financialScore);

  const getBarColor = (score: number) => {
    if (score >= 70) return "#22C55E";
    if (score >= 30) return "#FBBF24";
    return "#F87171";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 p-6">
      <p className="section-label mb-1">Exit Readiness</p>
      <h3 className="section-title mb-4">How Ready Are You to Quit?</h3>

      <div className="grid gap-4 md:grid-cols-2 mb-4">
        {/* Financial Progress Card */}
        <div className="bg-gray-50/60 rounded-lg p-5">
          <p className="section-label mb-3">Financial Progress</p>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Freedom Level:</span>
              <span className="font-semibold text-gray-900 font-mono tabular-nums">
                {freedomLevel}{" "}
                {freedomLevel > 0 && (
                  <span className="font-normal text-gray-500 font-sans">
                    ({FREEDOM_LEVELS[freedomLevel - 1]?.name})
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Side income:</span>
              <span className="font-semibold text-gray-900 font-mono tabular-nums">
                {formatCurrency(inputs.monthlySideRevenue)}/mo
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Gap to Walk Away Money:</span>
              <span
                className={`font-semibold font-mono tabular-nums ${gap > 0 ? "text-red-500" : "text-green-500"}`}
              >
                {gap > 0
                  ? `${formatCurrency(gap)}/mo`
                  : "Reached"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Months to Walk Away Money:</span>
              <span className="font-semibold text-gray-900 font-mono tabular-nums">
                {monthsToLevel4 === 0
                  ? "Already there"
                  : monthsToLevel4 !== null
                    ? `${monthsToLevel4} months`
                    : "N/A"}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Financial progress</span>
              <span className="font-mono tabular-nums">{Math.round(financialPct)}%</span>
            </div>
            <div className="h-2 bg-gray-200/60 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${financialPct}%`,
                  backgroundColor: getBarColor(financialPct),
                }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Your side projects currently pay for {Math.round(financialPct)}% of
              your monthly living costs.
            </p>
          </div>
        </div>

        {/* Risk Exposure Card */}
        <div className="bg-gray-50/60 rounded-lg p-5">
          <p className="section-label mb-3">What You're Risking</p>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">How hidden is your operation:</span>
              <span className="font-semibold text-gray-900 font-mono tabular-nums">
                {riskAssessment.invisibilityScore !== null
                  ? `${riskAssessment.invisibilityScore}/100`
                  : "??/100"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Salary you'd lose if caught:</span>
              <span className="font-semibold text-gray-900 font-mono tabular-nums">
                {formatCurrency(inputs.corporateSalary)}/year
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Salary vs. side income:</span>
              <span className="font-semibold text-gray-900 font-mono tabular-nums">
                {isFinite(riskAssessment.riskRewardRatio)
                  ? `${riskAssessment.riskRewardRatio}:1`
                  : "N/A"}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3 italic">
            {riskAssessment.riskContext}
          </p>

          {riskAssessment.invisibilityScore === null && (
            <Button
              onClick={onSwitchToInvisibility}
              className="mt-4 bg-[#60A5FA] hover:bg-[#3B82F6] text-white rounded-lg px-4 py-2 text-sm font-semibold w-full active:scale-[0.98] shadow-sm shadow-blue-200/50 transition-all duration-200"
            >
              Complete Invisibility Audit
            </Button>
          )}
        </div>
      </div>

      {/* Combined Freedom Readiness Score */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg border border-gray-100/50 p-5">
        <p className="section-label mb-2">Overall Exit Readiness</p>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-gray-900 font-mono tabular-nums">
            {riskAssessment.combinedScore !== null
              ? riskAssessment.combinedScore
              : Math.round(financialPct * 0.6)}
          </span>
          <span className="text-sm text-gray-400">/100</span>
        </div>

        <div className="relative h-3 rounded-full overflow-hidden mb-3">
          {riskAssessment.combinedScore !== null ? (
            <div className="absolute inset-0 bg-gray-200 rounded-full">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${riskAssessment.combinedScore}%`,
                  backgroundColor: getBarColor(riskAssessment.combinedScore),
                }}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex rounded-full overflow-hidden">
              <div className="relative" style={{ width: "60%" }}>
                <div className="absolute inset-0 bg-gray-200" />
                <div
                  className="absolute top-0 left-0 h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${financialPct}%`,
                    backgroundColor: getBarColor(financialPct),
                  }}
                />
              </div>
              <div
                className="relative"
                style={{
                  width: "40%",
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #E5E7EB 0px, #E5E7EB 3px, #F3F4F6 3px, #F3F4F6 6px)",
                }}
              />
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600">
          {riskAssessment.combinedScore !== null
            ? `Your side income covers ${Math.round(financialPct)}% of your expenses, and your operation is ${riskAssessment.invisibilityScore}/100 hidden from your employer.`
            : `Your side income covers ${Math.round(financialPct)}% of your expenses, but we don't know how hidden your operation is yet. Complete your Invisibility audit to see your full exit readiness score.`}
        </p>
      </div>
    </div>
  );
}

const RiskFreedomScore = memo(RiskFreedomScoreInner);
export default RiskFreedomScore;
