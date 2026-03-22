import { formatCurrency } from "@/lib/fym-calculations";
import type { FymEntry, PipelineEntry } from "@/types/fym";
import type { InvisibilityScore } from "@/types/fym";

interface QuickStatsProps {
  entries: FymEntry[];
  latestEntry: FymEntry | null | undefined;
  latestInvisibility: InvisibilityScore | null | undefined;
  latestPipeline?: PipelineEntry | null | undefined;
}

function getPipelineLabel(entry: PipelineEntry | null | undefined): string {
  if (!entry) return "—";
  if (entry.verdict === "GO") return "GO";
  if (entry.verdict === "CONDITIONAL_GO") return "MAYBE";
  return "NO-GO";
}

export default function QuickStats({
  entries,
  latestEntry,
  latestInvisibility,
  latestPipeline,
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
    { label: "Pipeline", value: getPipelineLabel(latestPipeline), accent: "#F472B6" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white/5 rounded-xl border border-white/10 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
        >
          <div
            className="h-1 transition-all duration-300 group-hover:h-1.5"
            style={{ backgroundColor: stat.accent }}
          />
          <div className="p-5">
            <p className="text-[11px] uppercase tracking-wider text-blue-300/70 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1.5 number-display">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
