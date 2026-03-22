import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PipelineEntry } from "@/types/fym";

export function usePipelineHistory(userId: string) {
  return useQuery({
    queryKey: ["pipeline-history", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("idea_pipeline")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        if (error.code === "42P01" || error.message?.includes("does not exist")) return [];
        throw error;
      }
      return (data ?? []) as unknown as PipelineEntry[];
    },
    enabled: !!userId,
    retry: false,
  });
}

export function useLatestPipelineEntry(userId: string) {
  return useQuery({
    queryKey: ["pipeline-latest", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("idea_pipeline")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        if (error.code === "42P01" || error.message?.includes("does not exist")) return null;
        throw error;
      }
      return data as unknown as PipelineEntry;
    },
    enabled: !!userId,
    retry: false,
  });
}

export function useSavePipelineEntry(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      entry: Omit<PipelineEntry, "id" | "user_id" | "created_at">
    ) => {
      const { data, error } = await supabase
        .from("idea_pipeline")
        .insert({ ...entry, user_id: userId } as never)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as PipelineEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline-history", userId] });
      queryClient.invalidateQueries({ queryKey: ["pipeline-latest", userId] });
    },
  });
}

export function useUpdateActionPlan(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      entryId,
      actionPlanChecked,
    }: {
      entryId: string;
      actionPlanChecked: Record<string, boolean>;
    }) => {
      const { error } = await supabase
        .from("idea_pipeline")
        .update({ action_plan_checked: actionPlanChecked } as never)
        .eq("id", entryId)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline-history", userId] });
      queryClient.invalidateQueries({ queryKey: ["pipeline-latest", userId] });
    },
  });
}
