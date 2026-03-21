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
    { label: "Current MRR", value: formatCurrency(currentMrr), accent: "#60A5FA" },
    { label: "Invisibility", value: `${invisScore}/100`, accent: "#A78BFA" },
    { label: "Days Tracked", value: String(daysTracked), accent: "#34D399" },
    { label: "Freedom", value: `${freedomPct}%`, accent: "#FBBF24" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
        >
          <div
            className="h-1 transition-all duration-300 group-hover:h-1.5"
            style={{ backgroundColor: stat.accent }}
          />
          <div className="p-5">
            <p className="section-label">{stat.label}</p>
            <p className="text-2xl font-bold text-[#0B1D3A] mt-1.5 number-display">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
