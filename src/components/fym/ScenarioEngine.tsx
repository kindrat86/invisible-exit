import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScenarioCard from "./ScenarioCard";
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
}

export default function ScenarioEngine({ inputs }: ScenarioEngineProps) {
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

  // Comparison summary
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
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
            What-If Scenarios
          </p>
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
            Compare Different Paths to Freedom
          </h3>
        </div>
        {scenarios.length < 2 && (
          <Button
            variant="outline"
            size="sm"
            onClick={addScenario}
            className="text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Scenario
          </Button>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
        {/* Current Path */}
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

        {/* Custom scenarios */}
        {scenarios.map((s, idx) => (
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
        ))}
      </div>

      {/* Comparison summary */}
      {summary && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
          {summary}
        </div>
      )}
    </div>
  );
}
