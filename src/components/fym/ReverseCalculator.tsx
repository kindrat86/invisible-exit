import { useState, useMemo } from "react";
import {
  formatCurrency,
  calculateRequiredGrowthRate,
  getRealityCheckZone,
  getRealityCheckRecommendation,
  generateMilestones,
} from "@/lib/fym-calculations";
import type { CalculatorInputsExpanded } from "@/types/fym";

interface ReverseCalculatorProps {
  inputs: CalculatorInputsExpanded;
}

export default function ReverseCalculator({ inputs }: ReverseCalculatorProps) {
  // Isolated local overrides (don't affect parent)
  const [localTarget, setLocalTarget] = useState<number | null>(null);
  const [localMonths, setLocalMonths] = useState<number | null>(null);
  const [localRevenue, setLocalRevenue] = useState<number | null>(null);

  const target = localTarget ?? inputs.targetMonthlyRevenue;
  const months = localMonths ?? inputs.monthsToExit;
  const revenue = localRevenue ?? inputs.monthlySideRevenue;

  const result = useMemo(() => {
    if (revenue <= 0) return null;
    if (revenue >= target) return { alreadyMet: true as const };

    const requiredGrowthRate = calculateRequiredGrowthRate(revenue, target, months);
    const zone = getRealityCheckZone(requiredGrowthRate);
    const recommendation = getRealityCheckRecommendation(zone);
    const milestones = generateMilestones(revenue, requiredGrowthRate, months);

    return {
      alreadyMet: false as const,
      requiredGrowthRate,
      zone,
      recommendation,
      milestones,
    };
  }, [revenue, target, months]);

  const zoneColor = (zone: string) => {
    switch (zone) {
      case "very_achievable":
        return "#22C55E";
      case "within_average":
        return "#4ADE80";
      case "ambitious":
        return "#FBBF24";
      case "very_aggressive":
        return "#FB923C";
      case "unrealistic":
        return "#F87171";
      default:
        return "#9CA3AF";
    }
  };

  const zonePercent = (rate: number) => {
    if (rate <= 5) return (rate / 5) * 20;
    if (rate <= 15) return 20 + ((rate - 5) / 10) * 20;
    if (rate <= 25) return 40 + ((rate - 10) / 15) * 20;
    if (rate <= 50) return 60 + ((rate - 25) / 25) * 20;
    return Math.min(100, 80 + ((rate - 50) / 50) * 20);
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
        Work Backward
      </p>
      <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-4">
        Reverse Engineer Your Exit
      </h3>

      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm p-6">
        {/* Fill-in-the-blank question */}
        <p className="text-sm text-gray-700 mb-5 leading-relaxed">
          "I want to reach{" "}
          <input
            type="number"
            value={target}
            onChange={(e) => setLocalTarget(parseFloat(e.target.value) || null)}
            className="inline-block w-24 bg-blue-50 border-b-2 border-[#60A5FA] px-2 font-mono font-bold text-[#1B2A4A] text-center mx-1 outline-none"
          />
          /month in{" "}
          <input
            type="number"
            value={months}
            onChange={(e) => setLocalMonths(parseInt(e.target.value) || null)}
            className="inline-block w-16 bg-blue-50 border-b-2 border-[#60A5FA] px-2 font-mono font-bold text-[#1B2A4A] text-center mx-1 outline-none"
          />{" "}
          months. I'm currently at{" "}
          <input
            type="number"
            value={revenue}
            onChange={(e) => setLocalRevenue(parseFloat(e.target.value) || null)}
            className="inline-block w-24 bg-blue-50 border-b-2 border-[#60A5FA] px-2 font-mono font-bold text-[#1B2A4A] text-center mx-1 outline-none"
          />
          /month. What growth rate do I need?"
        </p>

        {/* Zero revenue state */}
        {revenue <= 0 && (
          <p className="text-sm text-gray-500 italic">
            You need to generate your first dollar before we can calculate
            growth rate. Start with the Idea Directory.
          </p>
        )}

        {/* Already met */}
        {result && "alreadyMet" in result && result.alreadyMet && (
          <p className="text-sm text-green-600 font-medium">
            You've already exceeded your target. Congratulations. Consider
            setting a higher goal.
          </p>
        )}

        {/* Results */}
        {result && !result.alreadyMet && (
          <>
            {/* Answer */}
            <div className="mb-5">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                Answer
              </p>
              <p className="text-4xl font-bold text-[#1B2A4A] font-mono">
                {result.requiredGrowthRate.toFixed(2)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">monthly growth needed</p>
            </div>

            {/* Milestones */}
            <div className="mb-5">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                That means
              </p>
              <div className="space-y-1">
                {result.milestones.map((m, idx) => (
                  <div
                    key={m.month}
                    className={`flex items-center justify-between text-sm py-1.5 px-2 rounded ${
                      idx % 2 === 0 ? "bg-gray-50" : ""
                    }`}
                  >
                    <span className="text-gray-500 w-20">
                      Month {m.month}:
                    </span>
                    <span className="text-gray-900 font-medium flex-1 text-right">
                      {formatCurrency(revenue)} {"->"}  {formatCurrency(m.revenue)}
                    </span>
                    <span className="text-gray-400 text-xs w-28 text-right">
                      (+{formatCurrency(m.delta)} from start)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reality check gauge */}
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                Reality Check
              </p>
              <div className="relative h-3 rounded-full overflow-hidden mb-2">
                {/* Colored segments */}
                <div className="absolute inset-0 flex">
                  <div className="w-[20%] bg-green-400" />
                  <div className="w-[20%] bg-green-300" />
                  <div className="w-[20%] bg-amber-400" />
                  <div className="w-[20%] bg-orange-400" />
                  <div className="w-[20%] bg-red-400" />
                </div>
                {/* Marker */}
                <div
                  className="absolute top-0 w-1 h-full bg-[#1B2A4A] rounded transition-all duration-300"
                  style={{
                    left: `${Math.min(100, zonePercent(result.requiredGrowthRate))}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mb-2">
                <span>0%</span>
                <span>5%</span>
                <span>15%</span>
                <span>25%</span>
                <span>50%+</span>
              </div>
              <p
                className="text-sm font-medium"
                style={{ color: zoneColor(result.zone) }}
              >
                {result.recommendation}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
