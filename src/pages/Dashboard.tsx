import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthGuard from "@/components/AuthGuard";
import DashboardNav from "@/components/DashboardNav";
import FYMCalculator from "@/components/FYMCalculator";
import FYMHistory from "@/components/FYMHistory";
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

interface Profile {
  id: string;
  email: string;
  subscription_status: string;
}

function DashboardContent() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

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
        // Show onboarding on first visit
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
    setHistoryRefreshKey((k) => k + 1);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FB]">
        <div className="max-w-4xl mx-auto p-6 space-y-4 pt-20">
          <Skeleton className="h-10 w-48" />
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

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <DashboardNav email={email} />

      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to your FYM Dashboard</DialogTitle>
            <DialogDescription>
              Enter your numbers below to calculate your Founder Yield Monthly.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setShowOnboarding(false)}
            className="bg-[#D4A843] hover:bg-[#E0BC5E] text-[#0B1D3A] font-semibold"
          >
            Get Started
          </Button>
        </DialogContent>
      </Dialog>

      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        {isActive ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="calculator">
              <FYMCalculator userId={userId} onSaved={handleSaved} />
            </TabsContent>
            <TabsContent value="history">
              <FYMHistory userId={userId} refreshKey={historyRefreshKey} />
            </TabsContent>
          </Tabs>
        ) : (
          <ReactivationScreen
            onViewHistory={() => setActiveTab("history")}
          />
        )}

        {!isActive && activeTab === "history" && (
          <div className="mt-6">
            <FYMHistory userId={userId} refreshKey={historyRefreshKey} />
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
