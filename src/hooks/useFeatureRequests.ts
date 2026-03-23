import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type {
  FeatureRequest,
  FeatureVote,
  FeatureRequestLimit,
  VoteResult,
  FeatureStatus,
} from "@/types/features";
import { MAX_SUBMISSIONS_PER_MONTH } from "@/lib/constants";

function getCurrentMonthYear(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// ─── Public board hooks ────────────────────────────────────

export function useFeatureRequests() {
  return useQuery({
    queryKey: ["feature-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_requests" as never)
        .select("*")
        .eq("is_approved", true)
        .order("vote_count", { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as FeatureRequest[];
    },
  });
}

export function useUserVotes(userId: string) {
  return useQuery({
    queryKey: ["feature-votes", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_votes" as never)
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      const votes = (data ?? []) as unknown as FeatureVote[];
      const map = new Map<string, "up" | "down">();
      for (const v of votes) {
        map.set(v.feature_id, v.vote_type);
      }
      return map;
    },
    enabled: !!userId,
  });
}

export function useSubmissionLimit(userId: string) {
  const monthYear = getCurrentMonthYear();
  return useQuery({
    queryKey: ["feature-limit", userId, monthYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_request_limits" as never)
        .select("*")
        .eq("user_id", userId)
        .eq("month_year", monthYear)
        .maybeSingle();

      if (error) throw error;
      return (data as unknown as FeatureRequestLimit | null) ?? {
        submission_count: 0,
      };
    },
    enabled: !!userId,
  });
}

export function useSubmitFeature(userId: string) {
  const queryClient = useQueryClient();
  const monthYear = getCurrentMonthYear();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      email,
    }: {
      title: string;
      description: string;
      email: string;
    }) => {
      // Check rate limit
      const { data: limitData } = await supabase
        .from("feature_request_limits" as never)
        .select("submission_count")
        .eq("user_id", userId)
        .eq("month_year", monthYear)
        .maybeSingle();

      const currentCount =
        (limitData as unknown as { submission_count: number } | null)
          ?.submission_count ?? 0;

      if (currentCount >= MAX_SUBMISSIONS_PER_MONTH) {
        throw new Error(
          "You have reached the monthly limit of 30 requests. Your limit resets next month."
        );
      }

      // Insert feature request
      const { error: insertError } = await supabase
        .from("feature_requests" as never)
        .insert({
          title,
          description,
          submitted_by: userId,
          submitted_email: email,
          is_approved: false,
          status: "pending",
        } as never);

      if (insertError) throw insertError;

      // Upsert submission limit
      const { error: limitError } = await supabase
        .from("feature_request_limits" as never)
        .upsert(
          {
            user_id: userId,
            month_year: monthYear,
            submission_count: currentCount + 1,
          } as never,
          { onConflict: "user_id,month_year" }
        );

      if (limitError) {
        console.error("Failed to update submission limit:", limitError);
      }

      // Send notification emails (fire and forget)
      try {
        await supabase.functions.invoke("send-feature-request-emails", {
          body: {
            feature_title: title,
            feature_description: description,
            user_email: email,
          },
        });
      } catch (emailErr) {
        console.error("Failed to send feature request emails:", emailErr);
      }
    },
    onSuccess: () => {
      toast.success(
        "Your request has been submitted and is pending review. You will receive a confirmation email shortly."
      );
      queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["feature-limit", userId, monthYear],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit feature request.");
    },
  });
}

export function useVote(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      featureId,
      voteType,
    }: {
      featureId: string;
      voteType: "up" | "down";
    }) => {
      const { data, error } = await supabase.rpc("handle_vote" as never, {
        p_feature_id: featureId,
        p_user_id: userId,
        p_vote_type: voteType,
      } as never);

      if (error) throw error;
      return data as unknown as VoteResult;
    },
    onMutate: async ({ featureId, voteType }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ["feature-requests"] });
      await queryClient.cancelQueries({
        queryKey: ["feature-votes", userId],
      });

      // Snapshot previous values
      const prevFeatures = queryClient.getQueryData<FeatureRequest[]>([
        "feature-requests",
      ]);
      const prevVotes = queryClient.getQueryData<Map<string, "up" | "down">>([
        "feature-votes",
        userId,
      ]);

      // Optimistic update for votes map
      if (prevVotes) {
        const newVotes = new Map(prevVotes);
        const existingVote = newVotes.get(featureId);

        if (!existingVote) {
          newVotes.set(featureId, voteType);
        } else if (existingVote === voteType) {
          newVotes.delete(featureId);
        } else {
          newVotes.set(featureId, voteType);
        }
        queryClient.setQueryData(["feature-votes", userId], newVotes);
      }

      // Optimistic update for feature list
      if (prevFeatures) {
        const existingVote = prevVotes?.get(featureId) ?? null;
        const newFeatures = prevFeatures.map((f) => {
          if (f.id !== featureId) return f;

          let delta = 0;
          if (!existingVote) {
            delta = voteType === "up" ? 1 : -1;
          } else if (existingVote === voteType) {
            delta = voteType === "up" ? -1 : 1;
          } else {
            delta = voteType === "up" ? 2 : -2;
          }

          return { ...f, vote_count: f.vote_count + delta };
        });
        queryClient.setQueryData(["feature-requests"], newFeatures);
      }

      return { prevFeatures, prevVotes };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.prevFeatures) {
        queryClient.setQueryData(["feature-requests"], context.prevFeatures);
      }
      if (context?.prevVotes) {
        queryClient.setQueryData(
          ["feature-votes", userId],
          context.prevVotes
        );
      }
      toast.error("Failed to register your vote. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["feature-votes", userId],
      });
    },
  });
}

// ─── Admin hooks ───────────────────────────────────────────

export function usePendingFeatures() {
  return useQuery({
    queryKey: ["feature-requests-pending"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_requests" as never)
        .select("*")
        .eq("is_approved", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as FeatureRequest[];
    },
  });
}

export function useAllFeatures() {
  return useQuery({
    queryKey: ["feature-requests-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_requests" as never)
        .select("*")
        .order("vote_count", { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as FeatureRequest[];
    },
  });
}

export function useApproveFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (featureId: string) => {
      const { error } = await supabase
        .from("feature_requests" as never)
        .update({ is_approved: true, status: "under_review" } as never)
        .eq("id", featureId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Feature request approved.");
      queryClient.invalidateQueries({ queryKey: ["feature-requests-pending"] });
      queryClient.invalidateQueries({ queryKey: ["feature-requests-all"] });
      queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
    },
    onError: () => {
      toast.error("Failed to approve feature request.");
    },
  });
}

export function useRejectFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (featureId: string) => {
      const { error } = await supabase
        .from("feature_requests" as never)
        .delete()
        .eq("id", featureId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Feature request rejected and removed.");
      queryClient.invalidateQueries({ queryKey: ["feature-requests-pending"] });
      queryClient.invalidateQueries({ queryKey: ["feature-requests-all"] });
    },
    onError: () => {
      toast.error("Failed to reject feature request.");
    },
  });
}

export function useUpdateFeatureStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      featureId,
      status,
    }: {
      featureId: string;
      status: FeatureStatus;
    }) => {
      const { error } = await supabase
        .from("feature_requests" as never)
        .update({ status } as never)
        .eq("id", featureId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status updated.");
      queryClient.invalidateQueries({ queryKey: ["feature-requests-all"] });
      queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
    },
    onError: () => {
      toast.error("Failed to update status.");
    },
  });
}
