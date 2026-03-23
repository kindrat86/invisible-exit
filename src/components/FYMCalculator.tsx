import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import ShareModal from "./ShareModal";
import SmartInputPanel from "./fym/SmartInputPanel";
import FreedomLevels from "./fym/FreedomLevels";
import ScenarioEngine from "./fym/ScenarioEngine";
import ReverseCalculator from "./fym/ReverseCalculator";
import RiskFreedomScore from "./fym/RiskFreedomScore";
import LevelUpCelebration from "./fym/LevelUpCelebration";
import { useCalculator } from "@/hooks/useCalculator";
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
  hasFullAccess?: boolean;
}

export default function FYMCalculator({
  userId,
  onSaved,
  entries,
  latestEntry,
  latestInvisibility,
  onSwitchTab,
  hasFullAccess = true,
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

  const risk = riskAssessment(latestInvisibility);
  const hasEntries = entries.length > 0;
  const isFirstTime = !hasEntries;

  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareData, setShareData] = useState({ freedomNumber: "", shareUrl: "" });
  const [savedToday, setSavedToday] = useState(false);
  const [deepAnalysisOpen, setDeepAnalysisOpen] = useState(false);
  const [deepAnalysisEverOpened, setDeepAnalysisEverOpened] = useState(() => {
    return localStorage.getItem(`deep_analysis_opened_${userId}`) === "true";
  });

  // Celebration state
  const [celebration, setCelebration] = useState<{
    previousLevel: number;
    newLevel: number;
    freedomPct: number;
  } | null>(null);

  const handleDeepAnalysisToggle = (open: boolean) => {
    setDeepAnalysisOpen(open);
    if (open && !deepAnalysisEverOpened) {
      setDeepAnalysisEverOpened(true);
      localStorage.setItem(`deep_analysis_opened_${userId}`, "true");
    }
  };

  const handleSave = useCallback(async () => {
    setSaving(true);

    const previousLevel = latestEntry?.freedom_level ?? 0;
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

      // Check for level transition
      if (freedomLevel > previousLevel) {
        const burn = inputs.monthlyExpenses;
        const revenue = inputs.monthlySideRevenue;
        const freedomPct = burn > 0 ? Math.min(Math.round((revenue / burn) * 100), 100) : 0;
        setCelebration({
          previousLevel,
          newLevel: freedomLevel,
          freedomPct,
        });
      }

      const levelName =
        freedomLevel > 0 ? FREEDOM_LEVELS[freedomLevel - 1]?.name : "Pre-Launch";
      const daysToNext =
        monthsToNextLevel !== null && monthsToNextLevel > 0
          ? `~${monthsToNextLevel * 30} days to Level ${freedomLevel + 1}`
          : freedomLevel >= 5
            ? "You've reached the top"
            : "Keep building";

      toast.success(
        existing && existing.length > 0
          ? `Updated today's entry. Level ${freedomLevel}: ${levelName}. ${daysToNext}.`
          : `Entry saved. Level ${freedomLevel}: ${levelName}. ${daysToNext}.`
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
    latestEntry,
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

  // Mock data for blurred previews
  const mockScenarioInputs = {
    monthsToExit: 18,
    monthlyExpenses: 5000,
    monthlySideRevenue: 500,
    monthlyGrowthRate: 15,
    corporateSalary: 80000,
    targetMonthlyRevenue: 8000,
  };

  const mockReverseInputs = {
    monthsToExit: 18,
    monthlyExpenses: 5000,
    monthlySideRevenue: 500,
    monthlyGrowthRate: 15,
    corporateSalary: 80000,
    targetMonthlyRevenue: 8000,
  };

  return (
    <div className="space-y-8">
      {/* Celebration overlay */}
      {celebration && (
        <LevelUpCelebration
          previousLevel={celebration.previousLevel}
          newLevel={celebration.newLevel}
          freedomPct={celebration.freedomPct}
          onDismiss={() => setCelebration(null)}
          hasFullAccess={hasFullAccess}
        />
      )}

      {/* Section A: Log Your Numbers */}
      <div className="animate-fade-in">
        <SmartInputPanel
          inputs={inputs}
          onUpdate={updateInput}
          onReset={resetToDefaults}
          isFirstTime={isFirstTime}
        />
      </div>

      {/* Section B: Your Path */}
      <div className="animate-fade-in" style={{ animationDelay: "50ms" }}>
        <FreedomLevels
          currentLevel={freedomLevel}
          progressToNext={progressToNext}
          monthsToNextLevel={monthsToNextLevel}
        />
      </div>

      {/* Deep Analysis section */}
      <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        {hasFullAccess ? (
          /* Founding users: collapsible Deep Analysis */
          <Collapsible open={deepAnalysisOpen} onOpenChange={handleDeepAnalysisToggle}>
            <CollapsibleTrigger className="w-full bg-white rounded-xl border border-gray-200/80 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[#0B1D3A]">
                  Deep Analysis: Scenarios, Reverse Calculator, Risk Score
                </span>
                {!deepAnalysisEverOpened && (
                  <Badge className="bg-[#60A5FA]/10 text-[#60A5FA] border-[#60A5FA]/20 text-[10px]">
                    New
                  </Badge>
                )}
              </div>
              <ChevronDown
                className={`h-4 w-4 text-[#8A95A8] transition-transform duration-200 ${
                  deepAnalysisOpen ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 mt-4">
              <ScenarioEngine inputs={inputs} />
              <ReverseCalculator inputs={inputs} />
              <RiskFreedomScore
                inputs={inputs}
                freedomLevel={freedomLevel}
                riskAssessment={risk}
                onSwitchToInvisibility={() => onSwitchTab("invisibility")}
              />
            </CollapsibleContent>
          </Collapsible>
        ) : (
          /* Starter users: static blurred previews */
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-4">
              <span className="text-sm font-semibold text-[#0B1D3A]">
                Deep Analysis
              </span>
            </div>

            {/* Teaser 1: Scenario Engine */}
            <div className="relative rounded-xl border border-border/50 overflow-hidden">
              <div className="filter blur-[6px] pointer-events-none select-none opacity-70">
                <ScenarioEngine inputs={mockScenarioInputs} />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">"What If?" Scenario Engine</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  Compare up to 3 different growth paths side by side.
                  See which combination of revenue, expenses, and growth rate
                  gets you to freedom fastest.
                </p>
                <p className="text-xs text-muted-foreground/80 mb-4 italic">
                  Founding members use Scenario Engine to shave 4-8 months off their timeline
                  by optimizing one variable.
                </p>
                <Button
                  onClick={() => onSwitchTab("upgrade")}
                  className="bg-[#D4A843] hover:bg-[#C49A3A] text-[#0B1D3A] font-semibold"
                >
                  See Founding Toolkit
                </Button>
              </div>
            </div>

            {/* Teaser 2: Reverse Calculator */}
            <div className="relative rounded-xl border border-border/50 overflow-hidden">
              <div className="filter blur-[6px] pointer-events-none select-none opacity-70">
                <ReverseCalculator inputs={mockReverseInputs} />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Reverse Calculator</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  "I want to reach $X/month in Y months. What growth rate do I need?"
                  Work backwards from your goal. Know exactly what's required.
                </p>
                <Button
                  onClick={() => onSwitchTab("upgrade")}
                  className="bg-[#D4A843] hover:bg-[#C49A3A] text-[#0B1D3A] font-semibold"
                >
                  See Founding Toolkit
                </Button>
              </div>
            </div>

            {/* Teaser 3: Risk-Adjusted Freedom Score (split rendering) */}
            <div className="relative rounded-xl border border-border/50 overflow-hidden">
              <div className="filter blur-[6px] pointer-events-none select-none opacity-70">
                <RiskFreedomScore
                  inputs={inputs}
                  freedomLevel={freedomLevel}
                  riskAssessment={risk}
                  onSwitchToInvisibility={() => onSwitchTab("invisibility")}
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Exit Readiness Score</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  Your exit readiness combines financial progress (60%) and
                  invisibility score (40%) into a single number.
                  How ready are you to walk away?
                </p>
                <Button
                  onClick={() => onSwitchTab("upgrade")}
                  className="bg-[#D4A843] hover:bg-[#C49A3A] text-[#0B1D3A] font-semibold"
                >
                  See Founding Toolkit
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Save & Share bar */}
      <div className="sticky bottom-0 z-10 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/80 shadow-lg p-4">
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
