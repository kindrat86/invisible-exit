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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFymEntries } from "@/hooks/useFymEntries";
import { useLatestFymEntry } from "@/hooks/useLatestFymEntry";
import { useLatestInvisibilityScore } from "@/hooks/useInvisibilityScore";
import { useLatestPipelineEntry } from "@/hooks/useIdeaPipeline";
import {
  evaluateFreedomLevel,
  calculateProgressToNextLevel,
  calculateMonthsToLevel,
} from "@/lib/fym-calculations";
import type { CalculatorInputs, CalculatorInputsExpanded, IdeaEntry } from "@/types/fym";

const FymTrends = lazy(() => import("@/components/fym/FymTrends"));
const InvisibilityScore = lazy(() => import("@/components/fym/InvisibilityScore"));
const IdeaDirectory = lazy(() => import("@/components/fym/IdeaDirectory"));
const IdeaPipeline = lazy(() => import("@/components/fym/IdeaPipeline"));
const BrandManager = lazy(() => import("@/components/fym/BrandManager"));
const LaunchControl = lazy(() => import("@/components/fym/LaunchControl"));
const StealthOpsHub = lazy(() => import("@/components/fym/StealthOpsHub"));

interface Profile {
  id: string;
  email: string;
  subscription_status: string;
  subscription_tier: string;
}

const VALID_TABS = [
  "overview", "calculator", "history", "trends", "invisibility",
  "ideas", "pipeline", "brand", "launch", "stealth",
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

  const { data: entries = [], refetch: refetchEntries } = useFymEntries(userId);
  const { data: latestEntry, refetch: refetchLatest } = useLatestFymEntry(userId);
  const { data: latestInvisibility } = useLatestInvisibilityScore(userId);
  const { data: latestPipeline } = useLatestPipelineEntry(userId);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F4F7FB] to-[#EDF2F7]">
        <div className="max-w-5xl mx-auto p-6 space-y-4 pt-20">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-64 w-full" />
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

  if (!isActive) {
    return (
      <DashboardLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        email={email}
        freedomPct={freedomPct}
        isStarter={false}
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

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      email={email}
      freedomPct={freedomPct}
      isStarter={!!isStarter}
    >
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
        />
      )}

      {activeTab === "history" && (
        <FYMHistory userId={userId} refreshKey={0} onLoadEntry={handleLoadEntry} />
      )}

      {activeTab === "trends" && (
        <FeatureGate
          hasFullAccess={!!hasFullAccess}
          featureName="Trend Analysis"
          lockedMessage="See how your numbers are trending and where you'll be in 6 months."
        >
          <Suspense fallback={tabFallback}>
            <FymTrends userId={userId} />
          </Suspense>
        </FeatureGate>
      )}

      {activeTab === "invisibility" && (
        <Suspense fallback={tabFallback}>
          <InvisibilityScore userId={userId} />
        </Suspense>
      )}

      {activeTab === "ideas" && (
        <Suspense fallback={tabFallback}>
          <IdeaDirectory
            onValidateIdea={(idea) => {
              setPendingPipelineIdea(idea);
              setActiveTab("pipeline");
            }}
            onSwitchTab={setActiveTab}
          />
        </Suspense>
      )}

      {activeTab === "pipeline" && (
        <FeatureGate
          hasFullAccess={!!hasFullAccess}
          featureName="Idea Pipeline"
          lockedMessage="Validate your ideas with AI-powered scoring in 48 hours."
        >
          <Suspense fallback={tabFallback}>
            <IdeaPipeline
              userId={userId}
              onSwitchTab={setActiveTab}
              pendingIdea={pendingPipelineIdea}
              onClearPendingIdea={() => setPendingPipelineIdea(null)}
            />
          </Suspense>
        </FeatureGate>
      )}

      {activeTab === "brand" && (
        <FeatureGate
          hasFullAccess={!!hasFullAccess}
          featureName="Brand Manager"
          lockedMessage="Content calendar, YouTube scripts, and Reddit playbooks to grow your anonymous brand."
        >
          <Suspense fallback={tabFallback}>
            <BrandManager userId={userId} />
          </Suspense>
        </FeatureGate>
      )}

      {activeTab === "launch" && (
        <FeatureGate
          hasFullAccess={!!hasFullAccess}
          featureName="Launch Control"
          lockedMessage="Full launch automation, checklists, and go-live tracking for people with 5 hours a week."
        >
          <Suspense fallback={tabFallback}>
            <LaunchControl userId={userId} />
          </Suspense>
        </FeatureGate>
      )}

      {activeTab === "stealth" && (
        <FeatureGate
          hasFullAccess={!!hasFullAccess}
          featureName="Stealth Ops Hub"
          lockedMessage="Entity separation, compliance audit, and digital footprint cleanup."
        >
          <Suspense fallback={tabFallback}>
            <StealthOpsHub />
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
