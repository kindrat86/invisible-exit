import { useState, useCallback } from "react";
import { formatCurrency, calculateFreedomNumber, projectRevenue } from "@/lib/fym-calculations";
import ProgressRing from "@/components/fym/ProgressRing";
import FreedomLevels from "@/components/fym/FreedomLevels";
import MorningBriefing from "@/components/fym/MorningBriefing";
import type { FymEntry, InvisibilityScore, PipelineEntry, MorningBriefingData } from "@/types/fym";
import {
  Calculator,
  EyeOff,
  Lightbulb,
  Rocket,
  ChevronRight,
  Flame,
} from "lucide-react";
import { Input } from "@/components/ui/input";

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
  briefing?: MorningBriefingData | null;
}

export default function DashboardOverview({
  email,
  entries,
  latestEntry,
  latestInvisibility,
  latestPipeline,
  onTabChange,
  freedomLevel,
  progressToNext,
  monthsToNextLevel,
  isStarter,
  briefing,
}: DashboardOverviewProps) {
  const hasEntries = entries.length > 0;

  if (!hasEntries) {
    return (
      <FirstTimeOverview
        onTabChange={onTabChange}
      />
    );
  }

  return (
    <ReturningOverview
      email={email}
      entries={entries}
      latestEntry={latestEntry}
      latestInvisibility={latestInvisibility}
      latestPipeline={latestPipeline}
      onTabChange={onTabChange}
      freedomLevel={freedomLevel}
      progressToNext={progressToNext}
      monthsToNextLevel={monthsToNextLevel}
      isStarter={isStarter}
      briefing={briefing}
    />
  );
}

// ─── First-Time User Overview ───

function FirstTimeOverview({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) {
  const [income, setIncome] = useState(5000);
  const [showResult, setShowResult] = useState(false);

  const freedomNumber = calculateFreedomNumber(income);
  const monthlyTarget = income;
  // Estimate months to target at 15% growth starting from $100
  const estimatedMonths = income > 0
    ? Math.ceil(Math.log(monthlyTarget / 100) / Math.log(1.15))
    : 24;

  const PRESETS = [
    { label: "$3K", value: 3000 },
    { label: "$5K", value: 5000 },
    { label: "$8K", value: 8000 },
    { label: "$12K", value: 12000 },
  ];

  return (
    <div
      className="rounded-2xl p-8 md:p-12 text-center"
      style={{
        background: "linear-gradient(135deg, #1B2A4A 0%, #0F1D36 60%, #0A1628 100%)",
      }}
    >
      {!showResult ? (
        <div className="max-w-lg mx-auto animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
            Your 18-Month Escape Plan Starts Here.
          </h1>
          <p className="text-white/60 text-base mb-8">
            One number changes everything. Let's find yours.
          </p>

          <p className="text-white/80 text-sm mb-3 text-left">
            What's your monthly take-home after taxes?
          </p>

          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-lg font-mono">$</span>
            <Input
              type="number"
              value={income}
              onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              className="pl-8 bg-white/10 border-white/20 text-white text-lg font-mono h-12"
              min={500}
              max={100000}
            />
          </div>

          <div className="flex gap-2 justify-center flex-wrap mb-8">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => setIncome(p.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  income === p.value
                    ? "bg-[#60A5FA] text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => income > 0 && setShowResult(true)}
            className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold px-8 py-3 rounded-xl transition-colors text-base"
          >
            Calculate My Freedom Number
          </button>
        </div>
      ) : (
        <div className="max-w-lg mx-auto animate-fade-in">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Your Freedom Number</p>
          <p className="text-4xl md:text-5xl font-bold text-white font-mono mb-4">
            {formatCurrency(freedomNumber)}
          </p>

          <p className="text-white/70 text-base leading-relaxed mb-6">
            That means you need{" "}
            <span className="text-white font-semibold">{formatCurrency(monthlyTarget)}/month</span>{" "}
            in side revenue to never depend on a salary again.
          </p>

          <p className="text-white/50 text-sm mb-8">
            At 15% monthly growth, starting from $100, you'd hit it in{" "}
            <span className="text-white font-semibold">{estimatedMonths} months</span>.
            Let's build that.
          </p>

          <button
            onClick={() => onTabChange("calculator")}
            className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold px-8 py-3 rounded-xl transition-colors text-base"
          >
            Start Phase 1
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Returning User Overview ───

function ReturningOverview({
  email,
  entries,
  latestEntry,
  latestInvisibility,
  latestPipeline,
  onTabChange,
  freedomLevel,
  progressToNext,
  monthsToNextLevel,
  isStarter,
  briefing,
}: Omit<DashboardOverviewProps, "briefing"> & { briefing?: MorningBriefingData | null }) {
  const currentMrr = latestEntry ? Number(latestEntry.monthly_revenue) : 0;
  const burn = latestEntry ? Number(latestEntry.monthly_burn) : 0;
  const freedomPct = burn > 0 ? Math.min(Math.round((currentMrr / burn) * 100), 100) : 0;
  const invisScore = latestInvisibility?.total_score ?? 0;

  // Determine next move
  const getNextMove = () => {
    if (!latestInvisibility) {
      return {
        text: "Complete your Invisibility Audit",
        time: "10 min",
        tab: "invisibility",
      };
    }
    if (!latestPipeline) {
      return {
        text: "Find your best idea",
        time: "5 min quiz",
        tab: "ideas",
      };
    }
    if (latestPipeline.verdict !== "NO_GO") {
      return {
        text: "Start your Launch Checklist",
        time: "15 min",
        tab: "launch",
      };
    }
    return {
      text: "Log today's numbers",
      time: "30 seconds",
      tab: "calculator",
    };
  };

  const nextMove = getNextMove();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Morning Briefing (hero section) */}
      {briefing && (
        <MorningBriefing briefing={briefing} hasEntries={true} />
      )}

      {/* Freedom Level progress */}
      <FreedomLevels
        currentLevel={freedomLevel}
        progressToNext={progressToNext}
        monthsToNextLevel={monthsToNextLevel}
      />

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

      {/* Your Next Move */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6">
        <p className="section-label mb-1">Recommended</p>
        <h3 className="section-title mb-4">Your Next Move</h3>
        <button
          onClick={() => onTabChange(nextMove.tab)}
          className="w-full flex items-center gap-4 p-4 rounded-lg bg-[#60A5FA]/5 border border-[#60A5FA]/10 hover:bg-[#60A5FA]/10 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#60A5FA]/10 flex items-center justify-center shrink-0">
            <Rocket className="h-5 w-5 text-[#60A5FA]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-[#0B1D3A]">
              {nextMove.text}
            </p>
            <p className="text-xs text-[#8A95A8]">{nextMove.time}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-[#60A5FA] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
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
