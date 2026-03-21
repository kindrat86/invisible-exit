import { memo, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import {
  formatCurrency,
  projectRevenue,
  monthsToTarget as calcMonthsToTarget,
  calculateTotalProjectedEarnings,
} from "@/lib/fym-calculations";

interface ScenarioCardProps {
  name: string;
  startingRevenue: number;
  monthlyGrowthRate: number;
  monthlyExpenses: number;
  targetMonthlyRevenue: number;
  monthsToExit: number;
  isCurrentPath: boolean;
  colorClass: string;
  strokeColor: string;
  onUpdate?: (field: string, value: number | string) => void;
  onDelete?: () => void;
}

function ScenarioCardInner({
  name,
  startingRevenue,
  monthlyGrowthRate,
  monthlyExpenses,
  targetMonthlyRevenue,
  monthsToExit,
  isCurrentPath,
  colorClass,
  strokeColor,
  onUpdate,
  onDelete,
}: ScenarioCardProps) {
  const calculations = useMemo(() => {
    const mToTarget =
      startingRevenue > 0 && monthlyGrowthRate > 0
        ? calcMonthsToTarget(startingRevenue, monthlyGrowthRate, targetMonthlyRevenue)
        : null;

    const mToLevel4 =
      startingRevenue > 0 && monthlyGrowthRate > 0 && startingRevenue < monthlyExpenses
        ? calcMonthsToTarget(startingRevenue, monthlyGrowthRate, monthlyExpenses)
        : startingRevenue >= monthlyExpenses
          ? 0
          : null;

    const projectedRevenueAtExit =
      startingRevenue * Math.pow(1 + monthlyGrowthRate / 100, monthsToExit);

    const totalProjectedEarnings = calculateTotalProjectedEarnings(
      startingRevenue,
      monthlyGrowthRate,
      monthsToExit
    );

    return {
      monthsToTarget: startingRevenue >= targetMonthlyRevenue ? 0 : mToTarget,
      monthsToLevel4: mToLevel4,
      projectedRevenueAtExit,
      totalProjectedEarnings,
    };
  }, [startingRevenue, monthlyGrowthRate, monthlyExpenses, targetMonthlyRevenue, monthsToExit]);

  const chartData = useMemo(() => {
    if (startingRevenue <= 0) return [];
    const projections = projectRevenue(
      startingRevenue,
      monthlyGrowthRate,
      Math.min(monthsToExit, 36)
    );
    return projections.map((value, i) => ({ month: i, value: Math.round(value) }));
  }, [startingRevenue, monthlyGrowthRate, monthsToExit]);

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5 min-w-[300px] snap-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${colorClass}`} />
          {isCurrentPath ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">
                Current Path
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">
                Auto
              </span>
            </div>
          ) : (
            <Input
              value={name}
              onChange={(e) => onUpdate?.("name", e.target.value)}
              className="h-7 text-sm font-semibold border-0 p-0 focus-visible:ring-0 bg-transparent"
              placeholder="Name this scenario"
            />
          )}
        </div>
        {!isCurrentPath && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Inputs */}
      <div className="space-y-2 text-sm mb-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-500">Side revenue</Label>
          {isCurrentPath ? (
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(startingRevenue)}/mo
            </span>
          ) : (
            <Input
              type="number"
              value={startingRevenue}
              onChange={(e) =>
                onUpdate?.("startingRevenue", parseFloat(e.target.value) || 0)
              }
              className="h-7 w-28 text-right text-sm"
            />
          )}
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-500">Monthly growth</Label>
          {isCurrentPath ? (
            <span className="text-sm font-medium text-gray-900">
              {monthlyGrowthRate}%/mo
            </span>
          ) : (
            <Input
              type="number"
              value={monthlyGrowthRate}
              onChange={(e) =>
                onUpdate?.(
                  "monthlyGrowthRate",
                  parseFloat(e.target.value) || 0
                )
              }
              className="h-7 w-28 text-right text-sm"
            />
          )}
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-500">Monthly expenses</Label>
          {isCurrentPath ? (
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(monthlyExpenses)}/mo
            </span>
          ) : (
            <Input
              type="number"
              value={monthlyExpenses}
              onChange={(e) =>
                onUpdate?.(
                  "monthlyExpenses",
                  parseFloat(e.target.value) || 0
                )
              }
              className="h-7 w-28 text-right text-sm"
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">
            Reaches {formatCurrency(targetMonthlyRevenue)} in:
          </span>
          <span className="font-semibold text-gray-900">
            {startingRevenue <= 0
              ? "N/A"
              : calculations.monthsToTarget === 0
                ? "Already there"
                : calculations.monthsToTarget !== null
                  ? `${calculations.monthsToTarget} months`
                  : "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Walk Away Money in:</span>
          <span className="font-semibold text-gray-900">
            {calculations.monthsToLevel4 === 0
              ? "Already there"
              : calculations.monthsToLevel4 !== null
                ? `${calculations.monthsToLevel4} months`
                : "N/A"}
          </span>
        </div>
      </div>

      {/* Sparkline */}
      {chartData.length > 1 && (
        <div className="mt-3 h-[60px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id={`grad-${name.replace(/\s/g, "")}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2} />
                  <stop
                    offset="95%"
                    stopColor={strokeColor}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                fill={`url(#grad-${name.replace(/\s/g, "")})`}
                strokeWidth={2}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

const ScenarioCard = memo(ScenarioCardInner);
export default ScenarioCard;
