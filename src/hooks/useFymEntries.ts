import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FymEntry } from "@/types/fym";

type TimeRange = "7d" | "30d" | "90d" | "all";

function getDateFilter(range: TimeRange): string | null {
  if (range === "all") return null;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export function useFymEntries(userId: string, timeRange: TimeRange = "all") {
  return useQuery({
    queryKey: ["fym-entries", userId, timeRange],
    queryFn: async () => {
      let query = supabase
        .from("fym_entries")
        .select("*")
        .eq("user_id", userId)
        .is("deleted_at", null)
        .order("created_at", { ascending: true });

      const dateFilter = getDateFilter(timeRange);
      if (dateFilter) {
        query = query.gte("created_at", dateFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as FymEntry[]) ?? [];
    },
    enabled: !!userId,
  });
}
