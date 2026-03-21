import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FymEntry } from "@/types/fym";

export function useLatestFymEntry(userId: string) {
  return useQuery({
    queryKey: ["fym-latest-entry", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fym_entries")
        .select("*")
        .eq("user_id", userId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // no rows
        throw error;
      }
      return data as FymEntry;
    },
    enabled: !!userId,
  });
}
