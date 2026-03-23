import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthGuard from "@/components/AuthGuard";
import DashboardNav from "@/components/DashboardNav";
import FYMCalculator from "@/components/FYMCalculator";
import FYMHistory from "@/components/FYMHistory";
import WelcomeHeader from "@/components/fym/WelcomeHeader";
import QuickStats from "@/components/fym/QuickStats";
import ReactivationScreen from "@/components/ReactivationScreen";
import UpgradeBanner from "@/components/UpgradeBanner";
import FeatureGate from "@/components/FeatureGate";
import ReportBadgeShareModal from "@/components/ReportBadgeShareModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2 } from "lucide-react";
import { useFymEntries } from "@/hooks/useFymEntries";
import { useLatestFymEntry } from "@/hooks/useLatestFymEntry";
import { useLatestInvisibilityScore } from "@/hooks/useInvisibilityScore";
import { useLatestPipelineEntry } from "@/hooks/useIdeaPipeline";
import {
  calculateFymScore,
  calculateFreedomPercentage,
  calculateFinancialScore,
  calculateCombinedReadinessScore,
  FREEDOM_LEVELS,
} from "@/lib/fym-calculations";
import type { ReportBadgeData } from "@/lib/generateReportBadge";
import type { CalculatorInputs, IdeaEntry } from "@/types/fym";

const FymTrends = lazy(() => import("@/components/fym/FymTrends"));
const InvisibilityScore = lazy(() => import("@/components/fym/InvisibilityScore"));
const ExitTimeline = lazy(() => import("@/components/fym/ExitTimeline"));
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

const VALID_TABS = ["calculator", "history", "trends", "invisibility", "ideas", "pipeline", "brand", "launch", "stealth"] as const;
type TabValue = (typeof VALID_TABS)[number];

function DashboardContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as TabValue | null;
  const activeTab = tabParam && VALID_TABS.includes(tabParam) ? tabParam : "calculator";

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [pendingPipelineIdea, setPendingPipelineIdea] = useState<IdeaEntry | null>(null);
  const [reportBadgeOpen, setReportBadgeOpen] = useState(false);
  const [reportBadgeData, setReportBadgeData] = useState<ReportBadgeData | null>(null);

  const { data: entries = [], refetch: refetchEntries } = useFymEntries(userId);
  const { data: latestEntry, refetch: refetchLatest } = useLatestFymEntry(userId);
  const { data: latestInvisibility } = useLatestInvisibilityScore(userId);
  const { data: latestPipeline } = useLatestPipelineEntry(userId);

  const setActiveTab = useCallback(
    (tab: string) => {
      setSearchParams({ tab }, { replace: true });
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
        const onboardingKey = `fym_onboarded_${user.id}`;
        if (!localStorage.getItem(onboardingKey)) {
          setShowOnboarding(true);
          localStorage.setItem(onboardingKey, "true");
        }
      }
      setLoading(false);
    };
    load();
  }, []);

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

  const handleShareReport = useCallback(() => {
    if (!latestEntry) return;
    const level = latestEntry.freedom_level ?? 0;
    const levelName = level > 0 ? FREEDOM_LEVELS[level - 1]?.name : "Pre-Launch";
    const burn = Number(latestEntry.monthly_burn);
    const revenue = Number(latestEntry.monthly_revenue);
    const fymScore = calculateFymScore(burn, revenue);
    const freedomPct = calculateFreedomPercentage(revenue, burn);
    const financialScore = calculateFinancialScore(revenue, burn);
    const exitReadiness = calculateCombinedReadinessScore(
      financialScore,
      latestInvisibility?.total_score ?? null
    );
    const tier: ReportBadgeData["tier"] =
      profile?.subscription_tier === "founding" || profile?.subscription_tier === "standard"
        ? (profile.subscription_tier as "founding" | "standard")
        : "starter";
    const now = new Date();

    setReportBadgeData({
      tier,
      freedomLevel: level,
      levelName: levelName ?? "Pre-Launch",
      fymScore,
      freedomPercentage: freedomPct,
      exitReadiness,
      generatedDate: now.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    });
    setReportBadgeOpen(true);
  }, [latestEntry, latestInvisibility, profile?.subscription_tier]);

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
      <div className="min-h-screen bg-[#1B2A4A]">
        <DashboardNav email={email} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-white">
              Your account is being set up.
            </h2>
            <p className="text-blue-200">
              Check your email for login details, or refresh this page in a
              moment.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
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

  return (
    <div className="min-h-screen bg-[#1B2A4A]">
      <DashboardNav email={email} />

      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to your FYM Dashboard</DialogTitle>
            <DialogDescription>
              Enter your numbers below to calculate your Founder Yield Monthly.
              Check in every morning. Watch your exit take shape.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setShowOnboarding(false)}
            className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold"
          >
            Get Started
          </Button>
        </DialogContent>
      </Dialog>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isActive ? (
          <>
            {isStarter && <UpgradeBanner />}
            <WelcomeHeader email={email} latestEntry={latestEntry} />
            <QuickStats
              entries={entries}
              latestEntry={latestEntry}
              latestInvisibility={latestInvisibility}
              latestPipeline={latestPipeline}
            />
            {latestEntry && (
              <div className="flex justify-end -mt-4 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShareReport}
                  className="text-xs text-blue-300/70 hover:text-blue-200"
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  Share Report
                </Button>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8 flex overflow-x-auto w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-1">
                <TabsTrigger value="calculator" className="flex-shrink-0 text-blue-200 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md transition-all duration-200 text-sm font-medium">Calculator</TabsTrigger>
                <TabsTrigger value="history" className="flex-shrink-0 text-blue-200 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md transition-all duration-200 text-sm font-medium">History</TabsTrigger>
                <TabsTrigger value="trends" className="flex-shrink-0 text-blue-200 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md transition-all duration-200 text-sm font-medium">Trends</TabsTrigger>
                <TabsTrigger value="invisibility" className="flex-shrink-0 text-blue-200 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md transition-all duration-200 text-sm font-medium">Invisibility</TabsTrigger>
                <TabsTrigger value="ideas" className="flex-shrink-0 text-blue-200 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md transition-all duration-200 text-sm font-medium">Ideas</TabsTrigger>
                <TabsTrigger value="pipeline" className="flex-shrink-0 text-blue-200 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md transition-all duration-200 text-sm font-medium">Pipeline</TabsTrigger>
                <TabsTrigger value="brand" className="flex-shrink-0 text-blue-200 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md transition-all duration-200 text-sm font-medium">Brand</TabsTrigger>
                <TabsTrigger value="launch" className="flex-shrink-0 text-blue-200 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md transition-all duration-200 text-sm font-medium">Launch</TabsTrigger>
                <TabsTrigger value="stealth" className="flex-shrink-0 text-blue-200 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md transition-all duration-200 text-sm font-medium">Stealth Ops</TabsTrigger>
              </TabsList>

              <TabsContent value="calculator">
                <FYMCalculator
                  userId={userId}
                  onSaved={handleSaved}
                  entries={entries}
                  latestEntry={latestEntry}
                  latestInvisibility={latestInvisibility}
                  onSwitchTab={setActiveTab}
                  subscriptionTier={profile?.subscription_tier}
                />
              </TabsContent>

              <TabsContent value="history">
                <FYMHistory
                  userId={userId}
                  refreshKey={0}
                  onLoadEntry={handleLoadEntry}
                />
              </TabsContent>

              <TabsContent value="trends">
                <FeatureGate hasFullAccess={hasFullAccess} lockedMessage="Upgrade to Full Toolkit to see your FYM trends and projections">
                  <Suspense fallback={tabFallback}>
                    <FymTrends userId={userId} />
                  </Suspense>
                </FeatureGate>
              </TabsContent>

              <TabsContent value="invisibility">
                <Suspense fallback={tabFallback}>
                  <InvisibilityScore userId={userId} />
                </Suspense>
              </TabsContent>

              <TabsContent value="ideas">
                <Suspense fallback={tabFallback}>
                  <IdeaDirectory
                    onValidateIdea={(idea) => {
                      setPendingPipelineIdea(idea);
                      setActiveTab("pipeline");
                    }}
                    onSwitchTab={setActiveTab}
                  />
                </Suspense>
              </TabsContent>

              <TabsContent value="pipeline">
                <Suspense fallback={tabFallback}>
                  <IdeaPipeline
                    userId={userId}
                    onSwitchTab={setActiveTab}
                    pendingIdea={pendingPipelineIdea}
                    onClearPendingIdea={() => setPendingPipelineIdea(null)}
                  />
                </Suspense>
              </TabsContent>

              <TabsContent value="brand">
                <FeatureGate hasFullAccess={hasFullAccess} lockedMessage="Upgrade to Full Toolkit to access content calendar, YouTube scripts, and Reddit playbooks">
                  <Suspense fallback={tabFallback}>
                    <BrandManager userId={userId} />
                  </Suspense>
                </FeatureGate>
              </TabsContent>

              <TabsContent value="launch">
                <FeatureGate hasFullAccess={hasFullAccess} lockedMessage="Upgrade to Full Toolkit to access launch automation and tracking">
                  <Suspense fallback={tabFallback}>
                    <LaunchControl userId={userId} />
                  </Suspense>
                </FeatureGate>
              </TabsContent>

              <TabsContent value="stealth">
                <FeatureGate hasFullAccess={hasFullAccess} lockedMessage="Upgrade to Full Toolkit to access the full compliance playbook and fixes">
                  <Suspense fallback={tabFallback}>
                    <StealthOpsHub />
                  </Suspense>
                </FeatureGate>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <ReactivationScreen
            onViewHistory={() => setActiveTab("history")}
          />
        )}

        {reportBadgeData && (
          <ReportBadgeShareModal
            open={reportBadgeOpen}
            onOpenChange={setReportBadgeOpen}
            badgeData={reportBadgeData}
          />
        )}

        {!isActive && activeTab === "history" && (
          <div className="mt-6">
            <FYMHistory userId={userId} refreshKey={0} />
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setActiveTab("calculator")}
            >
              Back
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
