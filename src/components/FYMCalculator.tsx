import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ShareModal from "./ShareModal";
import MorningBriefing from "./fym/MorningBriefing";
import SmartInputPanel from "./fym/SmartInputPanel";
import FreedomLevels from "./fym/FreedomLevels";
import ScenarioEngine from "./fym/ScenarioEngine";
import ReverseCalculator from "./fym/ReverseCalculator";
import RiskFreedomScore from "./fym/RiskFreedomScore";
import { useCalculator } from "@/hooks/useCalculator";
import { useMorningBriefing } from "@/hooks/useMorningBriefing";
import {
  formatCurrency,
  calculateFymScore,
  calculateRunway,
  calculateFreedomNumber,
  FREEDOM_LEVELS,
} from "@/lib/fym-calculations";
import type { FymEntry, InvisibilityScore } from "@/types/fym";

interface FYMCalculatorProps {
  userId: string;
  onSaved: () => void;
  entries: FymEntry[];
  latestEntry: FymEntry | null | undefined;
  latestInvisibility: InvisibilityScore | null | undefined;
  onSwitchTab: (tab: string) => void;
}

export default function FYMCalculator({
  userId,
  onSaved,
  entries,
  latestEntry,
  latestInvisibility,
  onSwitchTab,
}: FYMCalculatorProps) {
  const {
    inputs,
    updateInput,
    resetToDefaults,
    coreResults,
    freedomLevel,
    progressToNext,
    monthsToNextLevel,
    reverseCalc,
    riskAssessment,
  } = useCalculator(latestEntry);

  const briefing = useMorningBriefing(entries, latestEntry, latestInvisibility);
  const risk = riskAssessment(latestInvisibility);

  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareData, setShareData] = useState({ freedomNumber: "", shareUrl: "" });
  const [savedToday, setSavedToday] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);

    const fymMonthly = calculateFymScore(inputs.monthlyExpenses, inputs.monthlySideRevenue);
    const fymTotal = calculateRunway(fymMonthly, inputs.monthsToExit);
    const fymFreedomNumber = calculateFreedomNumber(inputs.monthlyExpenses);

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).toISOString();
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    ).toISOString();

    const { data: existing } = await supabase
      .from("fym_entries")
      .select("id")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .gte("created_at", startOfDay)
      .lt("created_at", endOfDay)
      .limit(1);

    const entryData = {
      runway_months: inputs.monthsToExit,
      monthly_burn: inputs.monthlyExpenses,
      monthly_revenue: inputs.monthlySideRevenue,
      fym_monthly: fymMonthly,
      fym_total: fymTotal,
      fym_freedom_number: fymFreedomNumber,
      monthly_growth_rate: inputs.monthlyGrowthRate,
      corporate_salary: inputs.corporateSalary,
      target_monthly_revenue: inputs.targetMonthlyRevenue,
      freedom_level: freedomLevel,
      combined_readiness_score: risk.combinedScore ?? 0,
    };

    let error;
    if (existing && existing.length > 0) {
      const res = await supabase
        .from("fym_entries")
        .update(entryData)
        .eq("id", existing[0].id);
      error = res.error;
    } else {
      const res = await supabase
        .from("fym_entries")
        .insert({ user_id: userId, ...entryData });
      error = res.error;
    }

    setSaving(false);

    if (error) {
      toast.error("Failed to save entry.");
      console.error(error);
    } else {
      setSavedToday(true);
      const levelName =
        freedomLevel > 0 ? FREEDOM_LEVELS[freedomLevel - 1]?.name : "Pre-Launch";
      const daysToNext =
        monthsToNextLevel !== null && monthsToNextLevel > 0
          ? `${monthsToNextLevel * 30} days to Level ${freedomLevel + 1}`
          : freedomLevel >= 5
            ? "You've reached the top"
            : "Keep building";

      toast.success(
        existing && existing.length > 0
          ? `Updated today's entry. Level ${freedomLevel}: ${levelName}. ${daysToNext} at current growth.`
          : `Entry saved. You're at Level ${freedomLevel}: ${levelName}. ${daysToNext} at current growth.`
      );
      onSaved();
    }
  }, [
    inputs,
    userId,
    freedomLevel,
    monthsToNextLevel,
    risk.combinedScore,
    onSaved,
  ]);

  const handleShare = useCallback(async () => {
    setSharing(true);
    const fymFreedomNumber = calculateFreedomNumber(inputs.monthlyExpenses);
    const { data, error } = await supabase.functions.invoke("create-badge", {
      body: { badge_value: fymFreedomNumber },
    });
    setSharing(false);
    if (error || !data?.share_url) {
      toast.error("Failed to create badge.");
      return;
    }
    setShareData({
      freedomNumber: formatCurrency(fymFreedomNumber),
      shareUrl: data.share_url,
    });
    setShareOpen(true);
  }, [inputs.monthlyExpenses]);

  const sections = [
    { key: "briefing", delay: 0 },
    { key: "inputs", delay: 50 },
    { key: "levels", delay: 100 },
    { key: "scenarios", delay: 150 },
    { key: "reverse", delay: 200 },
    { key: "risk", delay: 250 },
    { key: "actions", delay: 300 },
  ];

  return (
    <div className="space-y-8">
      {/* Section 1: Morning Briefing */}
      <div className="animate-fade-in" style={{ animationDelay: `${sections[0].delay}ms` }}>
        <MorningBriefing briefing={briefing} hasEntries={entries.length > 0} />
      </div>

      {/* Section 2: Smart Input Panel */}
      <div className="animate-fade-in" style={{ animationDelay: `${sections[1].delay}ms` }}>
        <SmartInputPanel
          inputs={inputs}
          onUpdate={updateInput}
          onReset={resetToDefaults}
        />
      </div>

      {/* Section 3: Freedom Levels */}
      <div className="animate-fade-in" style={{ animationDelay: `${sections[2].delay}ms` }}>
        <FreedomLevels
          currentLevel={freedomLevel}
          progressToNext={progressToNext}
          monthsToNextLevel={monthsToNextLevel}
        />
      </div>

      {/* Section 4: Scenario Planner */}
      <div className="animate-fade-in" style={{ animationDelay: `${sections[3].delay}ms` }}>
        <ScenarioEngine inputs={inputs} />
      </div>

      {/* Section 5: Reverse Calculator */}
      <div className="animate-fade-in" style={{ animationDelay: `${sections[4].delay}ms` }}>
        <ReverseCalculator inputs={inputs} />
      </div>

      {/* Section 6: Risk-Adjusted Freedom Score */}
      <div className="animate-fade-in" style={{ animationDelay: `${sections[5].delay}ms` }}>
        <RiskFreedomScore
          inputs={inputs}
          freedomLevel={freedomLevel}
          riskAssessment={risk}
          onSwitchToInvisibility={() => onSwitchTab("invisibility")}
        />
      </div>

      {/* Save & Share */}
      <div
        className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 animate-fade-in"
        style={{ animationDelay: `${sections[6].delay}ms` }}
      >
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={handleSave}
            disabled={saving}
            className={
              savedToday
                ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-all duration-200"
                : "bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold shadow-sm shadow-blue-200/50 active:scale-[0.98] transition-all duration-200"
            }
          >
            {saving
              ? "Saving..."
              : savedToday
                ? "Already logged today. See you tomorrow."
                : "Save Entry"}
          </Button>
          <Button
            onClick={handleShare}
            disabled={sharing}
            variant="outline"
            className="transition-all duration-200 hover:shadow-sm"
          >
            {sharing ? "Creating badge..." : "Share"}
          </Button>
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        freedomNumber={shareData.freedomNumber}
        shareUrl={shareData.shareUrl}
      />
    </div>
  );
}
