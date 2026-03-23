import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
}

interface RoadmapVote {
  id: string;
  user_id: string;
  feature_id: string;
  vote_type: "up" | "down";
}

export function useRoadmapFeatures() {
  return useQuery({
    queryKey: ["roadmap-features"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("roadmap_features")
        .select("*")
        .order("upvotes", { ascending: false });
      if (error) throw error;
      return data as RoadmapFeature[];
    },
    retry: false,
  });
}

export function useUserVotes(userId: string) {
  return useQuery({
    queryKey: ["roadmap-votes", userId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("roadmap_votes")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return data as RoadmapVote[];
    },
    enabled: !!userId,
    retry: false,
  });
}

export function useVote(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      featureId,
      voteType,
      existingVote,
    }: {
      featureId: string;
      voteType: "up" | "down";
      existingVote?: RoadmapVote;
    }) => {
      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Toggle off: remove vote and decrement counter
          const { error: deleteError } = await (supabase as any)
            .from("roadmap_votes")
            .delete()
            .eq("id", existingVote.id);
          if (deleteError) throw deleteError;

          const counterField = voteType === "up" ? "upvotes" : "downvotes";
          const { data: feature } = await (supabase as any)
            .from("roadmap_features")
            .select(counterField)
            .eq("id", featureId)
            .single();

          await (supabase as any)
            .from("roadmap_features")
            .update({ [counterField]: Math.max(0, (feature?.[counterField] || 1) - 1) })
            .eq("id", featureId);
        } else {
          // Switch vote: update vote type and adjust both counters
          const { error: updateError } = await (supabase as any)
            .from("roadmap_votes")
            .update({ vote_type: voteType })
            .eq("id", existingVote.id);
          if (updateError) throw updateError;

          const oldField = existingVote.vote_type === "up" ? "upvotes" : "downvotes";
          const newField = voteType === "up" ? "upvotes" : "downvotes";

          const { data: feature } = await (supabase as any)
            .from("roadmap_features")
            .select(`${oldField}, ${newField}`)
            .eq("id", featureId)
            .single();

          await (supabase as any)
            .from("roadmap_features")
            .update({
              [oldField]: Math.max(0, (feature?.[oldField] || 1) - 1),
              [newField]: (feature?.[newField] || 0) + 1,
            })
            .eq("id", featureId);
        }
      } else {
        // New vote: insert and increment counter
        const { error: insertError } = await (supabase as any)
          .from("roadmap_votes")
          .insert({ user_id: userId, feature_id: featureId, vote_type: voteType });
        if (insertError) throw insertError;

        const counterField = voteType === "up" ? "upvotes" : "downvotes";
        const { data: feature } = await (supabase as any)
          .from("roadmap_features")
          .select(counterField)
          .eq("id", featureId)
          .single();

        await (supabase as any)
          .from("roadmap_features")
          .update({ [counterField]: (feature?.[counterField] || 0) + 1 })
          .eq("id", featureId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap-features"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-votes", userId] });
    },
    onError: () => {
      toast.error("Could not save your vote. Please try again.");
    },
  });
}

export function useSubmitFeatureRequest() {
  return useMutation({
    mutationFn: async ({ title, description }: { title: string; description: string }) => {
      const { data, error } = await supabase.functions.invoke("roadmap-request", {
        body: { title, description },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Feature request submitted! We'll review it shortly.");
    },
    onError: () => {
      toast.error("Could not submit your request. Please try again.");
    },
  });
}
