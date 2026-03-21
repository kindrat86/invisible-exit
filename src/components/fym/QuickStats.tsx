import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/fym-calculations";
import type { FymEntry } from "@/types/fym";
import type { InvisibilityScore } from "@/types/fym";

interface QuickStatsProps {
  entries: FymEntry[];
  latestEntry: FymEntry | null | undefined;
  latestInvisibility: InvisibilityScore | null | undefined;
}

export default function QuickStats({
  entries,
  latestEntry,
  latestInvisibility,
}: QuickStatsProps) {
  const currentMrr = latestEntry ? Number(latestEntry.monthly_revenue) : 0;
  const burn = latestEntry ? Number(latestEntry.monthly_burn) : 0;
  const freedomPct = burn > 0 ? Math.min(Math.round((currentMrr / burn) * 100), 100) : 0;
  const daysTracked = entries.length;
  const invisScore = latestInvisibility?.total_score ?? 0;

  const stats = [
    { label: "Current MRR", value: formatCurrency(currentMrr) },
    { label: "Invisibility", value: `${invisScore}/100` },
    { label: "Days Tracked", value: String(daysTracked) },
    { label: "Freedom", value: `${freedomPct}%` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-[#8A95A8] font-medium uppercase tracking-wide">
              {stat.label}
            </p>
            <p className="text-xl font-bold text-[#0B1D3A] mt-1">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
