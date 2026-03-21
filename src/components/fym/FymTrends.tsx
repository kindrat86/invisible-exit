import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Line,
  ComposedChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFymEntries } from "@/hooks/useFymEntries";
import { formatCurrency } from "@/lib/fym-calculations";

type TimeRange = "7d" | "30d" | "90d" | "all";

interface FymTrendsProps {
  userId: string;
}

export default function FymTrends({ userId }: FymTrendsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const { data: entries = [], isLoading } = useFymEntries(userId, timeRange);

  const chartData = useMemo(
    () =>
      entries.map((e) => ({
        date: new Date(e.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        fymScore: Number(e.fym_monthly),
        freedomPct:
          Number(e.monthly_burn) > 0
            ? Math.min(
                Math.round(
                  (Number(e.monthly_revenue) / Number(e.monthly_burn)) * 100
                ),
                100
              )
            : 0,
      })),
    [entries]
  );

  const ranges: { value: TimeRange; label: string }[] = [
    { value: "7d", label: "7 days" },
    { value: "30d", label: "30 days" },
    { value: "90d", label: "90 days" },
    { value: "all", label: "All time" },
  ];

  if (isLoading) {
    return (
      <p className="text-[#8A95A8] text-center py-8">Loading trends...</p>
    );
  }

  if (entries.length < 3) {
    return (
      <Card className="bg-white border border-gray-200">
        <CardContent className="py-16 text-center">
          <p className="text-[#4A5568] text-lg font-medium mb-2">
            Track at least 3 entries to see your trends.
          </p>
          <p className="text-[#8A95A8]">
            You have {entries.length} so far. Consistency is the compound
            interest of freedom.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {ranges.map((r) => (
          <Button
            key={r.value}
            variant={timeRange === r.value ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(r.value)}
            className={
              timeRange === r.value
                ? "bg-[#0B1D3A] hover:bg-[#132D5E] text-white"
                : ""
            }
          >
            {r.label}
          </Button>
        ))}
      </div>

      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-sm text-[#8A95A8] font-medium uppercase tracking-wide">
            FYM Score Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="fymGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `$${v}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "fymScore") return [formatCurrency(value), "FYM Score"];
                  return [`${value}%`, "Freedom %"];
                }}
              />
              <ReferenceLine yAxisId="left" y={0} stroke="#8A95A8" strokeDasharray="3 3" />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="fymScore"
                stroke="#60A5FA"
                fill="url(#fymGradient)"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="freedomPct"
                stroke="#4ADE80"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
