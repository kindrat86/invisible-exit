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

  // Combined score bar color
  const getBarColor = (score: number) => {
    if (score >= 70) return "#22C55E";
    if (score >= 30) return "#FBBF24";
    return "#F87171";
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
        Risk Analysis
      </p>
      <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-4">
        Risk-Adjusted Freedom Score
      </h3>

      <div className="grid gap-4 md:grid-cols-2 mb-4">
        {/* Financial Progress Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
            Financial Progress
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Freedom Level:</span>
              <span className="font-semibold text-gray-900">
                {freedomLevel}{" "}
                {freedomLevel > 0 && (
                  <span className="font-normal text-gray-500">
                    ({FREEDOM_LEVELS[freedomLevel - 1]?.name})
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Revenue:</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(inputs.monthlySideRevenue)}/mo
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Gap to Level 4:</span>
              <span
                className={`font-semibold ${gap > 0 ? "text-red-500" : "text-green-500"}`}
              >
                {gap > 0
                  ? `${formatCurrency(gap)}/mo`
                  : "Reached"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Months to Level 4:</span>
              <span className="font-semibold text-gray-900">
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
              <span>{Math.round(financialPct)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${financialPct}%`,
                  backgroundColor: getBarColor(financialPct),
                }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Your side income covers {Math.round(financialPct)}% of your
              monthly expenses.
            </p>
          </div>
        </div>

        {/* Risk Exposure Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
            Risk Exposure
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Invisibility Score:</span>
              <span className="font-semibold text-gray-900">
                {riskAssessment.invisibilityScore !== null
                  ? `${riskAssessment.invisibilityScore}/100`
                  : "??/100"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Corporate salary at risk:</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(inputs.corporateSalary)}/year
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Risk/Reward Ratio:</span>
              <span className="font-semibold text-gray-900">
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
              className="mt-4 bg-[#60A5FA] hover:bg-[#3B82F6] text-white rounded-lg px-4 py-2 text-sm font-medium w-full"
            >
              Complete Invisibility Audit
            </Button>
          )}
        </div>
      </div>

      {/* Combined Freedom Readiness Score */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
          Combined Freedom Readiness Score
        </p>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl font-bold text-gray-900">
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
              {/* Financial portion (60%) */}
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
              {/* Missing invisibility portion (40%) */}
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
            ? `Your financial progress is ${Math.round(financialPct)}% and your operational security is ${riskAssessment.invisibilityScore}/100.`
            : `Your financial progress is ${Math.round(financialPct)}% but your operational security is unknown. Complete your Invisibility audit to get your full Freedom Readiness Score.`}
        </p>
      </div>
    </div>
  );
}

const RiskFreedomScore = memo(RiskFreedomScoreInner);
export default RiskFreedomScore;
