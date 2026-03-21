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
import { useFymEntries } from "@/hooks/useFymEntries";
import { useLatestFymEntry } from "@/hooks/useLatestFymEntry";
import { useLatestInvisibilityScore } from "@/hooks/useInvisibilityScore";
import type { CalculatorInputs } from "@/types/fym";

const FymTrends = lazy(() => import("@/components/fym/FymTrends"));
const InvisibilityScore = lazy(() => import("@/components/fym/InvisibilityScore"));
const ExitTimeline = lazy(() => import("@/components/fym/ExitTimeline"));
const IdeaDirectory = lazy(() => import("@/components/fym/IdeaDirectory"));

interface Profile {
  id: string;
  email: string;
  subscription_status: string;
}

const VALID_TABS = ["calculator", "history", "trends", "invisibility", "ideas"] as const;
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
  const [loadedEntry, setLoadedEntry] = useState<CalculatorInputs | null>(null);

  const { data: entries = [], refetch: refetchEntries } = useFymEntries(userId);
  const { data: latestEntry, refetch: refetchLatest } = useLatestFymEntry(userId);
  const { data: latestInvisibility } = useLatestInvisibilityScore(userId);

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
        .select("id, email, subscription_status")
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
    (entry: CalculatorInputs) => {
      setLoadedEntry(entry);
      setActiveTab("calculator");
    },
    [setActiveTab]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FB]">
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
      <div className="min-h-screen bg-[#F4F7FB]">
        <DashboardNav email={email} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-[#0B1D3A]">
              Your account is being set up.
            </h2>
            <p className="text-[#4A5568]">
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

  const tabFallback = (
    <div className="flex items-center justify-center py-16">
      <div className="space-y-3 w-full max-w-md">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
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

      <main className="max-w-5xl mx-auto p-4 sm:p-6">
        {isActive ? (
          <>
            <WelcomeHeader email={email} latestEntry={latestEntry} />
            <QuickStats
              entries={entries}
              latestEntry={latestEntry}
              latestInvisibility={latestInvisibility}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 flex overflow-x-auto w-full">
                <TabsTrigger value="calculator" className="flex-shrink-0">Calculator</TabsTrigger>
                <TabsTrigger value="history" className="flex-shrink-0">History</TabsTrigger>
                <TabsTrigger value="trends" className="flex-shrink-0">Trends</TabsTrigger>
                <TabsTrigger value="invisibility" className="flex-shrink-0">Invisibility</TabsTrigger>
                <TabsTrigger value="ideas" className="flex-shrink-0">Ideas</TabsTrigger>
              </TabsList>

              <TabsContent value="calculator">
                <FYMCalculator
                  userId={userId}
                  onSaved={handleSaved}
                  initialValues={loadedEntry}
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
                <Suspense fallback={tabFallback}>
                  <FymTrends userId={userId} />
                </Suspense>
              </TabsContent>

              <TabsContent value="invisibility">
                <Suspense fallback={tabFallback}>
                  <InvisibilityScore userId={userId} />
                </Suspense>
              </TabsContent>

              <TabsContent value="ideas">
                <Suspense fallback={tabFallback}>
                  <IdeaDirectory />
                </Suspense>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <ReactivationScreen
            onViewHistory={() => setActiveTab("history")}
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
