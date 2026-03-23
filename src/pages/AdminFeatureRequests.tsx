import { useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import DashboardNav from "@/components/DashboardNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePendingFeatures,
  useAllFeatures,
  useApproveFeature,
  useRejectFeature,
  useUpdateFeatureStatus,
} from "@/hooks/useFeatureRequests";
import { ADMIN_EMAIL, FEATURE_STATUS_OPTIONS } from "@/lib/constants";
import StatusBadge from "@/components/features/StatusBadge";
import type { FeatureRequest, FeatureStatus } from "@/types/features";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function PendingReviewTab() {
  const { data: pending, isLoading } = usePendingFeatures();
  const approveMutation = useApproveFeature();
  const rejectMutation = useRejectFeature();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full bg-white/10 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!pending || pending.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl bg-white/5 border border-white/10">
        <p className="text-blue-200/70 text-sm">No pending feature requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pending.map((feature: FeatureRequest) => (
        <div
          key={feature.id}
          className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3"
        >
          <h3 className="text-white font-semibold">{feature.title}</h3>
          <p className="text-blue-200/70 text-sm leading-relaxed">
            {feature.description}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-blue-200/50">
            <span>
              Submitted by: {feature.submitted_email ?? "Unknown"}
            </span>
            <span>Submitted at: {formatDate(feature.created_at)}</span>
          </div>
          <div className="flex gap-3 pt-1">
            <Button
              size="sm"
              onClick={() => approveMutation.mutate(feature.id)}
              disabled={approveMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => rejectMutation.mutate(feature.id)}
              disabled={rejectMutation.isPending}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AllFeaturesTab() {
  const { data: features, isLoading } = useAllFeatures();
  const updateStatusMutation = useUpdateFeatureStatus();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full bg-white/10 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!features || features.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl bg-white/5 border border-white/10">
        <p className="text-blue-200/70 text-sm">No feature requests found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {features.map((feature: FeatureRequest) => (
        <div
          key={feature.id}
          className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-white font-semibold">{feature.title}</h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {feature.is_approved ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-900/50 text-emerald-300">
                  Live
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300">
                  Pending
                </span>
              )}
            </div>
          </div>

          <p className="text-blue-200/70 text-sm leading-relaxed">
            {feature.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-blue-200/50">
            <span>Votes: {feature.vote_count}</span>
            <span>
              By: {feature.submitted_email ?? "Pre-seeded"}
            </span>
            <span>{formatDate(feature.created_at)}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-blue-200/50">Status:</span>
            <Select
              value={feature.status}
              onValueChange={(value) =>
                updateStatusMutation.mutate({
                  featureId: feature.id,
                  status: value as FeatureStatus,
                })
              }
            >
              <SelectTrigger className="w-[160px] h-8 bg-white/5 border-white/10 text-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1B2A4A] border-white/10">
                {FEATURE_STATUS_OPTIONS.map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    className="text-white text-xs hover:bg-white/10 focus:bg-white/10 focus:text-white"
                  >
                    {statusLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <StatusBadge status={feature.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminContent() {
  const [activeTab, setActiveTab] = useState("pending");
  const { data: pending } = usePendingFeatures();
  const pendingCount = pending?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#1B2A4A]">
      <DashboardNav email={ADMIN_EMAIL} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl font-bold text-white mb-6">
          Feature Request Admin
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-white/5 border border-white/10 rounded-lg p-1">
            <TabsTrigger
              value="pending"
              className="text-blue-200 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md text-sm font-medium"
            >
              Pending Review{pendingCount > 0 ? ` (${pendingCount})` : ""}
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="text-blue-200 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md text-sm font-medium"
            >
              All Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <PendingReviewTab />
          </TabsContent>

          <TabsContent value="all">
            <AllFeaturesTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function AdminFeatureRequests() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  );
}
