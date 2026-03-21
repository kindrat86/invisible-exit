import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { InvisibilityScore } from "@/types/fym";

export function useLatestInvisibilityScore(userId: string) {
  return useQuery({
    queryKey: ["invisibility-latest", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invisibility_scores")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        // Table may not exist yet - return null gracefully
        if (error.code === "42P01" || error.message?.includes("does not exist")) return null;
        throw error;
      }
      return data as InvisibilityScore;
    },
    enabled: !!userId,
    retry: false,
  });
}

export function useSaveInvisibilityScore(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (score: Omit<InvisibilityScore, "id" | "user_id" | "created_at">) => {
      const { data, error } = await supabase
        .from("invisibility_scores")
        .insert({ ...score, user_id: userId })
        .select()
        .single();

      if (error) throw error;
      return data as InvisibilityScore;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invisibility-latest", userId] });
    },
  });
}
