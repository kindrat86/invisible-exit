import { useState, useMemo } from "react";
import { Plus, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScenarioCard from "./ScenarioCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/fym-calculations";
import type { CalculatorInputsExpanded } from "@/types/fym";

interface LocalScenario {
  id: string;
  name: string;
  startingRevenue: number;
  monthlyGrowthRate: number;
  monthlyExpenses: number;
}

const COLORS = [
  { class: "bg-orange-400", stroke: "#FB923C" },
  { class: "bg-purple-400", stroke: "#C084FC" },
];

interface ScenarioEngineProps {
  inputs: CalculatorInputsExpanded;
  hasFullAccess?: boolean;
}

export default function ScenarioEngine({ inputs, hasFullAccess = true }: ScenarioEngineProps) {
  const [scenarios, setScenarios] = useState<LocalScenario[]>([]);

  const addScenario = () => {
    if (scenarios.length >= 2) return;
    const letter = scenarios.length === 0 ? "A" : "B";
    setScenarios((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: `Scenario ${letter}`,
        startingRevenue: inputs.monthlySideRevenue,
        monthlyGrowthRate: inputs.monthlyGrowthRate,
        monthlyExpenses: inputs.monthlyExpenses,
      },
    ]);
  };

  const updateScenario = (id: string, field: string, value: number | string) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const deleteScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  const summary = useMemo(() => {
    if (scenarios.length === 0) return null;

    const currentMonths =
      inputs.monthlySideRevenue > 0 && inputs.monthlyGrowthRate > 0
        ? Math.ceil(
            Math.log(inputs.targetMonthlyRevenue / inputs.monthlySideRevenue) /
              Math.log(1 + inputs.monthlyGrowthRate / 100)
          )
        : null;

    let fastest: { name: string; months: number | null } | null = null;
    for (const s of scenarios) {
      if (s.startingRevenue <= 0 || s.monthlyGrowthRate <= 0) continue;
      const m =
        s.startingRevenue >= inputs.targetMonthlyRevenue
          ? 0
          : Math.ceil(
              Math.log(inputs.targetMonthlyRevenue / s.startingRevenue) /
                Math.log(1 + s.monthlyGrowthRate / 100)
            );
      if (fastest === null || (m !== null && m < (fastest.months ?? Infinity))) {
        fastest = { name: s.name, months: m };
      }
    }

    if (!fastest || currentMonths === null) return null;
    if (
      fastest.months === null ||
      fastest.months >= currentMonths
    )
      return null;

    const diff = currentMonths - fastest.months;
    const expensesDiff = scenarios.reduce((best, s) => {
      const d = inputs.monthlyExpenses - s.monthlyExpenses;
      return d > best ? d : best;
    }, 0);

    let text = `${fastest.name} reaches ${formatCurrency(inputs.targetMonthlyRevenue)}/month ${diff} months faster than Current Path.`;
    if (expensesDiff > 0) {
      text += ` Key difference: lower expenses save ${formatCurrency(expensesDiff * diff)} in burn and ${diff * 30} days of waiting.`;
    }

    return text;
  }, [scenarios, inputs]);

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-label mb-1">What-If Scenarios</p>
          <h3 className="section-title">Compare Different Paths to Freedom</h3>
        </div>
        {hasFullAccess && scenarios.length < 2 && (
          <Button
            variant="outline"
            size="sm"
            onClick={addScenario}
            className="text-sm border-dashed hover:border-[#60A5FA] hover:text-[#60A5FA] transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Scenario
          </Button>
        )}
        {!hasFullAccess && (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-sm border-dashed opacity-50 cursor-not-allowed"
            title="Compare growth paths with Founding Member"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Scenario
          </Button>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1">
        <ScenarioCard
          name="Current Path"
          startingRevenue={inputs.monthlySideRevenue}
          monthlyGrowthRate={inputs.monthlyGrowthRate}
          monthlyExpenses={inputs.monthlyExpenses}
          targetMonthlyRevenue={inputs.targetMonthlyRevenue}
          monthsToExit={inputs.monthsToExit}
          isCurrentPath={true}
          colorClass="bg-[#60A5FA]"
          strokeColor="#60A5FA"
        />

        {hasFullAccess ? (
          scenarios.map((s, idx) => (
            <ScenarioCard
              key={s.id}
              name={s.name}
              startingRevenue={s.startingRevenue}
              monthlyGrowthRate={s.monthlyGrowthRate}
              monthlyExpenses={s.monthlyExpenses}
              targetMonthlyRevenue={inputs.targetMonthlyRevenue}
              monthsToExit={inputs.monthsToExit}
              isCurrentPath={false}
              colorClass={COLORS[idx]?.class ?? "bg-gray-400"}
              strokeColor={COLORS[idx]?.stroke ?? "#9CA3AF"}
              onUpdate={(field, value) => updateScenario(s.id, field, value)}
              onDelete={() => deleteScenario(s.id)}
            />
          ))
        ) : (
          <div className="min-w-[280px] snap-start shrink-0 rounded-xl border border-[#60A5FA]/20 bg-[#60A5FA]/5 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-xl bg-[#60A5FA]/10 flex items-center justify-center mb-3">
              <Rocket className="w-5 h-5 text-[#60A5FA]" />
            </div>
            <h4 className="text-sm font-semibold text-[#0B1D3A] mb-1">
              Compare growth paths
            </h4>
            <p className="text-xs text-[#4A5568] mb-4 leading-relaxed">
              Add scenarios to find the fastest path to your freedom number.
            </p>
            <button
              onClick={async () => {
                try {
                  const { data, error } = await supabase.functions.invoke("create-checkout", {
                    body: { tier: "founding", returnUrl: window.location.origin + "/dashboard" },
                  });
                  if (error) throw error;
                  if (data?.url) window.location.href = data.url;
                } catch {
                  toast.error("Could not start checkout. Please try again.");
                }
              }}
              className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold px-4 py-2 rounded-lg transition-colors text-xs"
            >
              See Founding Toolkit — $17.99/mo
            </button>
            <p className="text-[10px] text-[#9CA3AF] mt-2">
              Founding price, locked for life.
            </p>
          </div>
        )}
      </div>

      {summary && (
        <div className="mt-4 bg-blue-50/50 border border-blue-100/50 rounded-lg p-4 text-sm text-gray-700">
          {summary}
        </div>
      )}
    </div>
  );
}
