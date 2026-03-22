import { formatCurrency } from "@/lib/fym-calculations";
import ProgressRing from "@/components/fym/ProgressRing";
import FreedomLevels from "@/components/fym/FreedomLevels";
import type { FymEntry, InvisibilityScore, PipelineEntry } from "@/types/fym";
import {
  Calculator,
  EyeOff,
  Lightbulb,
  GitBranch,
  ChevronRight,
  Flame,
} from "lucide-react";

interface DashboardOverviewProps {
  email: string;
  entries: FymEntry[];
  latestEntry: FymEntry | null | undefined;
  latestInvisibility: InvisibilityScore | null | undefined;
  latestPipeline: PipelineEntry | null | undefined;
  onTabChange: (tab: string) => void;
  freedomLevel: number;
  progressToNext: number;
  monthsToNextLevel: number | null;
  isStarter: boolean;
}

export default function DashboardOverview({
  email,
  entries,
  latestEntry,
  latestInvisibility,
  onTabChange,
  freedomLevel,
  progressToNext,
  monthsToNextLevel,
  isStarter,
}: DashboardOverviewProps) {
  const name = email.split("@")[0];
  const currentMrr = latestEntry ? Number(latestEntry.monthly_revenue) : 0;
  const burn = latestEntry ? Number(latestEntry.monthly_burn) : 0;
  const freedomPct = burn > 0 ? Math.min(Math.round((currentMrr / burn) * 100), 100) : 0;
  const invisScore = latestInvisibility?.total_score ?? 0;
  const daysTracked = entries.length;

  let subtitle = "Let's see where you stand on your exit.";
  if (latestEntry) {
    if (freedomPct >= 100) {
      subtitle = "You've reached your freedom number. The cage is open.";
    } else {
      subtitle = `Your exit is ${freedomPct}% funded. Keep building.`;
    }
  }

  const quickActions = [
    { label: "Log Today's Numbers", icon: Calculator, tab: "calculator" },
    { label: "Check Invisibility", icon: EyeOff, tab: "invisibility" },
    { label: "Explore Ideas", icon: Lightbulb, tab: "ideas" },
    { label: "Run Pipeline", icon: GitBranch, tab: "pipeline" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome + Progress Ring */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0B1D3A] tracking-tight leading-tight">
              Welcome back, {name}.
            </h1>
            <p className="text-[#4A5568] mt-1.5 text-base">{subtitle}</p>
            {daysTracked > 1 && (
              <div className="flex items-center gap-1.5 mt-2">
                <Flame className="h-4 w-4 text-[#60A5FA]" />
                <span className="text-sm text-[#60A5FA] font-medium">
                  {daysTracked}-entry streak
                </span>
              </div>
            )}
          </div>
          <div className="shrink-0">
            <ProgressRing value={freedomPct} size={120} strokeWidth={8} color="#60A5FA" bgColor="#EDF2F7" />
            <p className="text-center text-xs text-[#9CA3AF] mt-1">Freedom</p>
          </div>
        </div>
      </div>

      {/* Quick Stats — 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Current MRR"
          value={formatCurrency(currentMrr)}
          accent="#60A5FA"
        />
        <StatCard
          label="Freedom"
          value={`${freedomPct}%`}
          accent="#2563EB"
        />
        <StatCard
          label="Invisibility"
          value={`${invisScore}/100`}
          accent="#93C5FD"
        />
      </div>

      {/* Two-column: Journey + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Exit Journey — wider */}
        <div className="lg:col-span-3">
          <FreedomLevels
            currentLevel={freedomLevel}
            progressToNext={progressToNext}
            monthsToNextLevel={monthsToNextLevel}
          />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 h-full">
            <p className="section-label mb-1">Quick Actions</p>
            <h3 className="section-title mb-4">What's Next</h3>
            <div className="space-y-1">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.tab}
                    onClick={() => onTabChange(action.tab)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-[#F4F7FB] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#60A5FA]/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-[#60A5FA]" />
                    </div>
                    <span className="text-sm text-[#4A5568] font-medium flex-1 group-hover:text-[#0B1D3A] transition-colors">
                      {action.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#60A5FA] transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Starter upgrade CTA */}
      {isStarter && (
        <div className="bg-[#1B2A4A] rounded-xl p-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <p className="text-white font-semibold text-base">
              Unlock all 9 tools — $17.99/month
            </p>
            <p className="text-white/50 text-sm mt-1">
              Founding price, locked for life. Limited to 100 members.
            </p>
          </div>
          <a
            href="/oto/founding"
            className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shrink-0"
          >
            Upgrade Now
          </a>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 p-5">
      <div className="flex items-center gap-3">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: accent }}
        />
        <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-medium">
          {label}
        </p>
      </div>
      <p className="text-2xl font-bold text-[#0B1D3A] mt-2 number-display">
        {value}
      </p>
    </div>
  );
}
