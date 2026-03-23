import { useEffect, useState, useCallback, useMemo, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/components/DashboardLayout";
import FYMCalculator from "@/components/FYMCalculator";
import FYMHistory from "@/components/FYMHistory";
import DashboardOverview from "@/components/fym/DashboardOverview";
import ReactivationScreen from "@/components/ReactivationScreen";
import FeatureGate from "@/components/FeatureGate";
import OnboardingWizard from "@/components/fym/OnboardingWizard";
import CoreStealthActions from "@/components/fym/CoreStealthActions";
import UpgradePage from "@/components/fym/UpgradePage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFymEntries } from "@/hooks/useFymEntries";
import { useLatestFymEntry } from "@/hooks/useLatestFymEntry";
import { useLatestInvisibilityScore } from "@/hooks/useInvisibilityScore";
import { useLatestPipelineEntry, usePipelineHistory } from "@/hooks/useIdeaPipeline";
import { useMorningBriefing } from "@/hooks/useMorningBriefing";
import {
  evaluateFreedomLevel,
  calculateProgressToNextLevel,
  calculateMonthsToLevel,
} from "@/lib/fym-calculations";
import type { CalculatorInputs, CalculatorInputsExpanded, IdeaEntry } from "@/types/fym";

const FymTrends = lazy(() => import("@/components/fym/FymTrends"));
const InvisibilityScore = lazy(() => import("@/components/fym/InvisibilityScore"));
const IdeaQuiz = lazy(() => import("@/components/fym/IdeaQuiz"));
const IdeaDirectory = lazy(() => import("@/components/fym/IdeaDirectory"));
const IdeaPipeline = lazy(() => import("@/components/fym/IdeaPipeline"));
const BrandManager = lazy(() => import("@/components/fym/BrandManager"));
const LaunchControl = lazy(() => import("@/components/fym/LaunchControl"));
const StealthOpsHub = lazy(() => import("@/components/fym/StealthOpsHub"));
const ScenarioEngine = lazy(() => import("@/components/fym/ScenarioEngine"));
const ReverseCalculator = lazy(() => import("@/components/fym/ReverseCalculator"));
const RoadmapVoting = lazy(() => import("@/components/fym/RoadmapVoting"));

interface Profile {
  id: string;
  email: string;
  subscription_status: string;
  subscription_tier: string;
}

const VALID_TABS = [
  "overview", "calculator", "history", "trends", "invisibility",
  "stealth-core", "ideas", "pipeline", "brand", "launch",
  "stealth-full", "scenarios", "reverse-calc", "upgrade", "roadmap",
] as const;

function DashboardContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam && (VALID_TABS as readonly string[]).includes(tabParam) ? tabParam : "overview";

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [pendingPipelineIdea, setPendingPipelineIdea] = useState<IdeaEntry | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [ideasView, setIdeasView] = useState<"quiz" | "directory">("quiz");

  const { data: entries = [], refetch: refetchEntries } = useFymEntries(userId);
  const { data: latestEntry, refetch: refetchLatest } = useLatestFymEntry(userId);
  const { data: latestInvisibility } = useLatestInvisibilityScore(userId);
  const { data: latestPipeline } = useLatestPipelineEntry(userId);
  const { data: pipelineHistory = [] } = usePipelineHistory(userId);

  const setActiveTab = useCallback(
    (tab: string) => {
      if (tab === "overview") {
        setSearchParams({}, { replace: true });
      } else {
        setSearchParams({ tab }, { replace: true });
      }
    },
    [setSearchParams]
  );

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email ?? "");
      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, subscription_status, subscription_tier")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        setNoProfile(true);
      } else {
        setProfile(data as Profile);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Check if onboarding should show
  useEffect(() => {
    if (userId && entries.length === 0 && !loading) {
      const completed = localStorage.getItem(`onboarding_completed_${userId}`);
      if (!completed) {
        setShowOnboarding(true);
      }
    }
  }, [userId, entries.length, loading]);

  // Freedom level calculations for overview + sidebar ring
  const expandedInputs = useMemo<CalculatorInputsExpanded>(() => {
    if (!latestEntry) {
      return {
        monthsToExit: 24,
        monthlyExpenses: 0,
        monthlySideRevenue: 0,
        monthlyGrowthRate: 0,
        corporateSalary: 0,
        targetMonthlyRevenue: 0,
      };
    }
    return {
      monthsToExit: Number(latestEntry.runway_months) || 24,
      monthlyExpenses: Number(latestEntry.monthly_burn) || 0,
      monthlySideRevenue: Number(latestEntry.monthly_revenue) || 0,
      monthlyGrowthRate: Number(latestEntry.monthly_growth_rate) || 0,
      corporateSalary: Number(latestEntry.corporate_salary) || 0,
      targetMonthlyRevenue: Number(latestEntry.target_monthly_revenue) || 0,
    };
  }, [latestEntry]);

  const freedomLevel = useMemo(() => evaluateFreedomLevel(expandedInputs), [expandedInputs]);
  const progressToNext = useMemo(
    () => calculateProgressToNextLevel(expandedInputs, freedomLevel),
    [expandedInputs, freedomLevel]
  );
  const monthsToNextLevel = useMemo(
    () => (freedomLevel < 5 ? calculateMonthsToLevel(expandedInputs, freedomLevel + 1) : null),
    [expandedInputs, freedomLevel]
  );

  const burn = latestEntry ? Number(latestEntry.monthly_burn) : 0;
  const revenue = latestEntry ? Number(latestEntry.monthly_revenue) : 0;
  const freedomPct = burn > 0 ? Math.min(Math.round((revenue / burn) * 100), 100) : 0;

  // Morning briefing for overview
  const briefing = useMorningBriefing(entries, latestEntry, latestInvisibility);

  // Phase completion tracking
  const phaseCompletion = useMemo(() => {
    const completion: Record<number, boolean> = {};

    // Phase 1: Has at least one entry
    completion[1] = entries.length > 0;

    // Phase 2: Has invisibility score
    completion[2] = !!latestInvisibility;

    // Phase 3: Has at least one pipeline entry
    completion[3] = pipelineHistory.length > 0;

    // Phase 4: Check brand/launch progress (localStorage)
    const brandState = localStorage.getItem(`brand_manager_state_${userId}`);
    completion[4] = !!brandState;

    // Phase 5: Check if stealth ops have been accessed
    completion[5] = false; // Advanced features, rarely "complete"

    return completion;
  }, [entries.length, latestInvisibility, pipelineHistory.length, userId]);

  // Pipeline gating: 1 free validation for starters
  const completedValidations = pipelineHistory.filter(
    (entry) => entry.verdict !== null
  ).length;
  const pipelineValidationsRemaining = Math.max(0, 1 - completedValidations);

  const handleSaved = useCallback(() => {
    refetchEntries();
    refetchLatest();
  }, [refetchEntries, refetchLatest]);

  const handleLoadEntry = useCallback(
    (_entry: CalculatorInputs) => {
      setActiveTab("calculator");
    },
    [setActiveTab]
  );

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
    refetchEntries();
    refetchLatest();
  }, [refetchEntries, refetchLatest]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B2A4A]">
        <div className="max-w-5xl mx-auto p-6 space-y-4 pt-20">
          <Skeleton className="h-10 w-48 bg-white/10" />
          <Skeleton className="h-20 w-full bg-white/10" />
          <Skeleton className="h-64 w-full bg-white/10" />
        </div>
      </div>
    );
  }

  if (noProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F4F7FB] to-[#EDF2F7]">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-[#0B1D3A]">
              Your account is being set up.
            </h2>
            <p className="text-[#4A5568]">
              Check your email for login details, or refresh this page in a moment.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isActive = profile?.subscription_status === "active";
  const hasFullAccess = isActive && (profile?.subscription_tier === "founding" || profile?.subscription_tier === "standard");
  const isStarter = isActive && profile?.subscription_tier === "starter";

  const tabFallback = (
    <div className="flex items-center justify-center py-16">
      <div className="space-y-3 w-full max-w-md">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );

  // Onboarding wizard overlay
  if (showOnboarding && isActive) {
    return (
      <OnboardingWizard userId={userId} onComplete={handleOnboardingComplete} />
    );
  }

  if (!isActive) {
    return (
      <DashboardLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        email={email}
        freedomPct={freedomPct}
        isStarter={false}
        subscriptionTier={profile?.subscription_tier}
      >
        <ReactivationScreen onViewHistory={() => setActiveTab("history")} />
        {activeTab === "history" && (
          <div className="mt-6">
            <FYMHistory userId={userId} refreshKey={0} />
            <Button variant="outline" className="mt-4" onClick={() => setActiveTab("overview")}>
              Back
            </Button>
          </div>
        )}
      </DashboardLayout>
    );
  }

  // Nudge banner for incomplete prior phases
  const getNudgeBanner = () => {
    const tabToPhase: Record<string, number> = {
      calculator: 1, history: 1,
      invisibility: 2, "stealth-core": 2,
      ideas: 3, pipeline: 3,
      brand: 4, launch: 4,
      trends: 5, "stealth-full": 5, scenarios: 5, "reverse-calc": 5,
    };
    const currentPhase = tabToPhase[activeTab];
    if (!currentPhase || currentPhase <= 1) return null;

    // Check if prior phases are incomplete
    for (let i = 1; i < currentPhase; i++) {
      if (!phaseCompletion[i]) {
        return (
          <div className="bg-[#60A5FA]/5 border border-[#60A5FA]/10 rounded-lg px-4 py-3 mb-4">
            <p className="text-xs text-[#60A5FA]">
              Tip: Most members complete Phase {i} first. Your freedom number drives everything else.
            </p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      email={email}
      freedomPct={freedomPct}
      isStarter={!!isStarter}
      subscriptionTier={profile?.subscription_tier}
      phaseCompletion={phaseCompletion}
      pipelineValidationsRemaining={pipelineValidationsRemaining}
    >
      {getNudgeBanner()}

      {activeTab === "overview" && (
        <DashboardOverview
          email={email}
          entries={entries}
          latestEntry={latestEntry}
          latestInvisibility={latestInvisibility}
          latestPipeline={latestPipeline}
          onTabChange={setActiveTab}
          freedomLevel={freedomLevel}
          progressToNext={progressToNext}
          monthsToNextLevel={monthsToNextLevel}
          isStarter={!!isStarter}
          hasFullAccess={!!hasFullAccess}
          tier={profile?.subscription_tier}
          briefing={briefing}
          pipelineHistory={pipelineHistory}
          userId={userId}
        />
      )}

      {activeTab === "calculator" && (
        <FYMCalculator
          userId={userId}
          onSaved={handleSaved}
          entries={entries}
          latestEntry={latestEntry}
          latestInvisibility={latestInvisibility}
          onSwitchTab={setActiveTab}
          hasFullAccess={!!hasFullAccess}
        />
      )}

      {activeTab === "history" && (
        <FYMHistory userId={userId} refreshKey={0} onLoadEntry={handleLoadEntry} />
      )}

      {activeTab === "invisibility" && (
        <Suspense fallback={tabFallback}>
          <InvisibilityScore userId={userId} hasFullAccess={!!hasFullAccess} />
        </Suspense>
      )}

      {activeTab === "stealth-core" && (
        <CoreStealthActions userId={userId} onSwitchTab={setActiveTab} />
      )}

      {activeTab === "ideas" && (
        <Suspense fallback={tabFallback}>
          {ideasView === "quiz" ? (
            <IdeaQuiz
              onValidateIdea={(idea) => {
                setPendingPipelineIdea(idea);
                setActiveTab("pipeline");
              }}
              onSwitchTab={setActiveTab}
              onBrowseAll={() => setIdeasView("directory")}
            />
          ) : (
            <IdeaDirectory
              onValidateIdea={(idea) => {
                setPendingPipelineIdea(idea);
                setActiveTab("pipeline");
              }}
              onSwitchTab={setActiveTab}
              hasFullAccess={!!hasFullAccess}
            />
          )}
          {ideasView === "directory" && (
            <div className="mt-4">
              <button
                onClick={() => setIdeasView("quiz")}
                className="text-xs text-[#60A5FA] hover:underline"
              >
                Back to Idea Quiz
              </button>
            </div>
          )}
        </Suspense>
      )}

      {activeTab === "pipeline" && (
        <Suspense fallback={tabFallback}>
          <IdeaPipeline
            userId={userId}
            onSwitchTab={setActiveTab}
            pendingIdea={pendingPipelineIdea}
            onClearPendingIdea={() => setPendingPipelineIdea(null)}
            hasFullAccess={!!hasFullAccess}
          />
        </Suspense>
      )}

      {activeTab === "brand" && (
        <FeatureGate
          hasFullAccess={!!hasFullAccess}
          featureId="brand"
        >
          <Suspense fallback={tabFallback}>
            <BrandManager userId={userId} />
          </Suspense>
        </FeatureGate>
      )}

      {activeTab === "launch" && (
        <FeatureGate
          hasFullAccess={!!hasFullAccess}
          featureId="launch"
        >
          <Suspense fallback={tabFallback}>
            <LaunchControl userId={userId} />
          </Suspense>
        </FeatureGate>
      )}

      {activeTab === "trends" && (
        <FeatureGate
          hasFullAccess={!!hasFullAccess}
          featureId="trends"
        >
          <Suspense fallback={tabFallback}>
            <FymTrends userId={userId} />
          </Suspense>
        </FeatureGate>
      )}

      {activeTab === "stealth-full" && (
        <FeatureGate
          hasFullAccess={!!hasFullAccess}
          featureId="stealth-full"
        >
          <Suspense fallback={tabFallback}>
            <StealthOpsHub userId={userId} />
          </Suspense>
        </FeatureGate>
      )}

      {activeTab === "scenarios" && (
        <FeatureGate
          hasFullAccess={!!hasFullAccess}
          featureId="scenarios"
        >
          <Suspense fallback={tabFallback}>
            <ScenarioEngine inputs={expandedInputs} />
          </Suspense>
        </FeatureGate>
      )}

      {activeTab === "reverse-calc" && (
        <FeatureGate
          hasFullAccess={!!hasFullAccess}
          featureId="reverse-calc"
        >
          <Suspense fallback={tabFallback}>
            <ReverseCalculator inputs={expandedInputs} />
          </Suspense>
        </FeatureGate>
      )}

      {activeTab === "upgrade" && (
        <UpgradePage userId={userId} />
      )}

      {activeTab === "roadmap" && (
        <FeatureGate
          hasFullAccess={!!hasFullAccess}
          featureId="roadmap"
        >
          <Suspense fallback={tabFallback}>
            <RoadmapVoting />
          </Suspense>
        </FeatureGate>
      )}
    </DashboardLayout>
  );
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
