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

    // Check for existing entry today
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

  return (
    <div className="space-y-8">
      {/* Section 1: Morning Briefing */}
      <MorningBriefing briefing={briefing} hasEntries={entries.length > 0} />

      {/* Section 2: Smart Input Panel */}
      <SmartInputPanel
        inputs={inputs}
        onUpdate={updateInput}
        onReset={resetToDefaults}
      />

      {/* Section 3: Freedom Levels */}
      <FreedomLevels
        currentLevel={freedomLevel}
        progressToNext={progressToNext}
        monthsToNextLevel={monthsToNextLevel}
      />

      {/* Section 4: Scenario Planner */}
      <ScenarioEngine inputs={inputs} />

      {/* Section 5: Reverse Calculator */}
      <ReverseCalculator inputs={inputs} />

      {/* Section 6: Risk-Adjusted Freedom Score */}
      <RiskFreedomScore
        inputs={inputs}
        freedomLevel={freedomLevel}
        riskAssessment={risk}
        onSwitchToInvisibility={() => onSwitchTab("invisibility")}
      />

      {/* Save & Share */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={handleSave}
          disabled={saving}
          variant="outline"
          className="transition-transform active:scale-95"
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
          className="bg-[#0B1D3A] hover:bg-[#132D5E] text-white"
        >
          {sharing ? "Creating badge..." : "Share"}
        </Button>
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
