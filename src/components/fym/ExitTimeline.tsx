import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLatestFymEntry } from "@/hooks/useLatestFymEntry";
import {
  formatCurrency,
  projectRevenue,
  monthsToTarget,
} from "@/lib/fym-calculations";

interface ExitTimelineProps {
  userId: string;
}

const TARGET_PRESETS = [2500, 3000, 4000];
const GROWTH_PRESETS = [
  { label: "Conservative (5%)", value: 5 },
  { label: "Moderate (15%)", value: 15 },
  { label: "Aggressive (30%)", value: 30 },
];

export default function ExitTimeline({ userId }: ExitTimelineProps) {
  const { data: latestEntry } = useLatestFymEntry(userId);

  const [targetMrr, setTargetMrr] = useState(4000);
  const [customTarget, setCustomTarget] = useState("");
  const [growthRate, setGrowthRate] = useState(15);
  const [currentMrr, setCurrentMrr] = useState<string>("");

  const startMrr =
    currentMrr !== ""
      ? parseFloat(currentMrr) || 0
      : latestEntry
        ? Number(latestEntry.monthly_revenue)
        : 0;

  const months = monthsToTarget(startMrr, growthRate, targetMrr);
  const projectionMonths = months ? Math.min(months + 6, 60) : 24;

  const chartData = useMemo(() => {
    if (startMrr <= 0) return [];
    const conservative = projectRevenue(startMrr, growthRate * 0.5, projectionMonths);
    const expected = projectRevenue(startMrr, growthRate, projectionMonths);
    const aggressive = projectRevenue(startMrr, growthRate * 1.5, projectionMonths);

    return Array.from({ length: projectionMonths + 1 }, (_, i) => ({
      month: `M${i}`,
      conservative: Math.round(conservative[i]),
      expected: Math.round(expected[i]),
      aggressive: Math.round(aggressive[i]),
    }));
  }, [startMrr, growthRate, projectionMonths]);

  const milestones = useMemo(() => {
    const items = [
      { label: "First $100", target: 100 },
      { label: "$500/mo", target: 500 },
      { label: "$1,000/mo", target: 1000 },
      { label: "$2,500/mo", target: 2500 },
      { label: "$4,000/mo", target: 4000 },
    ].filter((m) => m.target <= targetMrr * 1.2);

    return items.map((m) => ({
      ...m,
      reached: startMrr >= m.target,
      monthsAway: monthsToTarget(startMrr, growthRate, m.target),
    }));
  }, [startMrr, growthRate, targetMrr]);

  const realityCheck = useMemo(() => {
    if (startMrr <= 0) return null;
    const checkpoints = [3, 6, 12, 18];
    return checkpoints.map((m) => ({
      month: m,
      value: Math.round(startMrr * Math.pow(1 + growthRate / 100, m)),
    }));
  }, [startMrr, growthRate]);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6 space-y-6">
          <div>
            <Label className="text-sm font-medium text-[#4A5568]">
              Target Monthly Revenue (USD)
            </Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {TARGET_PRESETS.map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={targetMrr === t && !customTarget ? "default" : "outline"}
                  className={
                    targetMrr === t && !customTarget
                      ? "bg-[#0B1D3A] hover:bg-[#132D5E] text-white"
                      : ""
                  }
                  onClick={() => {
                    setTargetMrr(t);
                    setCustomTarget("");
                  }}
                >
                  {formatCurrency(t)}
                </Button>
              ))}
              <Input
                type="number"
                placeholder="Custom"
                className="w-28"
                value={customTarget}
                onChange={(e) => {
                  setCustomTarget(e.target.value);
                  const v = parseFloat(e.target.value);
                  if (v > 0) setTargetMrr(v);
                }}
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-[#4A5568]">
              Current MRR: {formatCurrency(startMrr)}
            </Label>
            <Input
              type="number"
              min={0}
              placeholder={
                latestEntry
                  ? `From last entry: ${formatCurrency(Number(latestEntry.monthly_revenue))}`
                  : "e.g., 200"
              }
              value={currentMrr}
              onChange={(e) => setCurrentMrr(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-[#4A5568]">
              Monthly Growth Rate: {growthRate}%
            </Label>
            <div className="flex gap-2 mt-2 flex-wrap mb-3">
              {GROWTH_PRESETS.map((p) => (
                <Button
                  key={p.value}
                  size="sm"
                  variant={growthRate === p.value ? "default" : "outline"}
                  className={
                    growthRate === p.value
                      ? "bg-[#0B1D3A] hover:bg-[#132D5E] text-white"
                      : ""
                  }
                  onClick={() => setGrowthRate(p.value)}
                >
                  {p.label}
                </Button>
              ))}
            </div>
            <Slider
              value={[growthRate]}
              onValueChange={([v]) => setGrowthRate(v)}
              min={1}
              max={50}
              step={1}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Zero state */}
      {startMrr <= 0 && (
        <Card className="bg-white border border-gray-200">
          <CardContent className="py-12 text-center">
            <p className="text-[#4A5568] text-lg font-medium mb-2">
              You haven't started generating revenue yet.
            </p>
            <p className="text-[#8A95A8]">
              That's okay. The best time to plant a tree was 20 years ago. The
              second best time is now. Start with one tool, one idea, one $0.97
              payment from a stranger.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Timeline strip */}
      {startMrr > 0 && (
        <>
          {months !== null && (
            <Card className="bg-[#0B1D3A] text-white border-0">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-[#60A5FA] uppercase tracking-wide font-medium">
                  Months to Freedom
                </p>
                <p className="text-5xl font-bold mt-2">{months}</p>
                <p className="text-gray-300 mt-2">
                  At {growthRate}% monthly growth, you reach{" "}
                  {formatCurrency(targetMrr)}/mo in {months} months
                </p>
              </CardContent>
            </Card>
          )}

          {/* Milestones */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {milestones.map((m) => (
              <Card
                key={m.label}
                className={`flex-shrink-0 border ${
                  m.reached
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <CardContent className="p-3 text-center min-w-[120px]">
                  <p
                    className={`text-xs font-medium ${
                      m.reached ? "text-green-600" : "text-[#8A95A8]"
                    }`}
                  >
                    {m.reached ? "Reached" : m.monthsAway !== null ? `${m.monthsAway}mo away` : "---"}
                  </p>
                  <p className="text-sm font-bold text-[#0B1D3A] mt-1">
                    {m.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Projection chart */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm text-[#8A95A8] font-medium uppercase tracking-wide">
                Revenue Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="expectedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === "expected"
                        ? `Your estimate (${growthRate}%)`
                        : name === "conservative"
                          ? `Conservative (${Math.round(growthRate * 0.5)}%)`
                          : `Aggressive (${Math.round(growthRate * 1.5)}%)`,
                    ]}
                  />
                  <ReferenceLine
                    y={targetMrr}
                    stroke="#F87171"
                    strokeDasharray="5 5"
                    label={{ value: `Target: ${formatCurrency(targetMrr)}`, position: "right", fontSize: 11 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="conservative"
                    stroke="#9CA3AF"
                    fill="none"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  <Area
                    type="monotone"
                    dataKey="expected"
                    stroke="#60A5FA"
                    fill="url(#expectedGrad)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="aggressive"
                    stroke="#4ADE80"
                    fill="none"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Reality check */}
          {realityCheck && (
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-sm text-[#8A95A8] font-medium uppercase tracking-wide">
                  Reality Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#4A5568] mb-4">
                  At {growthRate}% monthly growth, starting from{" "}
                  {formatCurrency(startMrr)}:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {realityCheck.map((c) => (
                    <div key={c.month} className="text-center">
                      <p className="text-xs text-[#8A95A8] uppercase">
                        Month {c.month}
                      </p>
                      <p
                        className={`text-lg font-bold ${
                          c.value >= targetMrr
                            ? "text-green-500"
                            : "text-[#0B1D3A]"
                        }`}
                      >
                        {formatCurrency(c.value)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
