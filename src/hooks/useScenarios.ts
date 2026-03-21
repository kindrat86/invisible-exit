import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FymScenarioRow } from "@/types/fym";

export function useScenarios(userId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["fym-scenarios", userId];

  const { data: scenarios = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fym_scenarios")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(2);

      if (error) {
        // Table might not exist yet
        if (error.code === "42P01") return [];
        console.error("Error fetching scenarios:", error);
        return [];
      }
      return (data ?? []) as FymScenarioRow[];
    },
    enabled: !!userId,
  });

  const addScenario = useMutation({
    mutationFn: async (scenario: {
      name: string;
      starting_revenue: number;
      monthly_growth_rate: number;
      monthly_expenses: number;
    }) => {
      const { error } = await supabase.from("fym_scenarios").insert({
        user_id: userId,
        name: scenario.name,
        starting_revenue: scenario.starting_revenue,
        monthly_growth_rate: scenario.monthly_growth_rate,
        monthly_expenses: scenario.monthly_expenses,
        sort_order: scenarios.length,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateScenario = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<
        Pick<
          FymScenarioRow,
          "name" | "starting_revenue" | "monthly_growth_rate" | "monthly_expenses"
        >
      >;
    }) => {
      const { error } = await supabase
        .from("fym_scenarios")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteScenario = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("fym_scenarios")
        .update({ is_active: false })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    scenarios,
    isLoading,
    addScenario,
    updateScenario,
    deleteScenario,
  };
}
