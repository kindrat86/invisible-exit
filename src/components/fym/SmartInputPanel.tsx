import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import type { CalculatorInputsExpanded } from "@/types/fym";

interface SmartInputPanelProps {
  inputs: CalculatorInputsExpanded;
  onUpdate: <K extends keyof CalculatorInputsExpanded>(
    key: K,
    value: CalculatorInputsExpanded[K]
  ) => void;
  onReset: () => void;
}

const GROWTH_PRESETS = [
  { label: "Conservative (5%)", value: 5 },
  { label: "Moderate (15%)", value: 15 },
  { label: "Aggressive (30%)", value: 30 },
];

const TARGET_PRESETS = [
  { label: "$2,500", value: 2500 },
  { label: "$4,000", value: 4000 },
  { label: "$10,000", value: 10000 },
];

const EXPENSES_PRESETS = [
  { label: "$3,000", value: 3000 },
  { label: "$5,000", value: 5000 },
  { label: "$8,000", value: 8000 },
];

const SIDE_REVENUE_PRESETS = [
  { label: "$0", value: 0 },
  { label: "$500", value: 500 },
  { label: "$2,000", value: 2000 },
];

const SALARY_PRESETS = [
  { label: "$60k", value: 60000 },
  { label: "$100k", value: 100000 },
  { label: "$150k", value: 150000 },
];

function HelpTip({ text }: { text: string }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help inline-block ml-1" />
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-[240px] text-xs"
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function PresetPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
        active
          ? "bg-[#60A5FA] text-white border-[#60A5FA]"
          : "border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300"
      }`}
    >
      {label}
    </button>
  );
}

export default function SmartInputPanel({
  inputs,
  onUpdate,
  onReset,
}: SmartInputPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
          Your Numbers
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Reset to defaults
        </button>
      </div>

      {/* Row 1: Financial Reality */}
      <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
        Financial Reality
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Months to exit */}
        <div className="space-y-2">
          <Label htmlFor="monthsToExit" className="text-sm text-gray-700">
            Months to target exit
            <HelpTip text="When do you want to be free? Most members target 12-24 months." />
          </Label>
          <Input
            id="monthsToExit"
            type="number"
            min={1}
            max={120}
            value={inputs.monthsToExit}
            onChange={(e) =>
              onUpdate(
                "monthsToExit",
                Math.max(1, Math.min(120, parseInt(e.target.value) || 1))
              )
            }
          />
          <Slider
            value={[inputs.monthsToExit]}
            onValueChange={([v]) => onUpdate("monthsToExit", v)}
            min={1}
            max={120}
            step={1}
          />
        </div>

        {/* Monthly expenses */}
        <div className="space-y-2">
          <Label htmlFor="monthlyExpenses" className="text-sm text-gray-700">
            Monthly personal expenses (USD)
            <HelpTip text="Include rent/mortgage, food, insurance, childcare, everything. Be honest, not aspirational." />
          </Label>
          <Input
            id="monthlyExpenses"
            type="number"
            min={100}
            max={500000}
            value={inputs.monthlyExpenses}
            onChange={(e) =>
              onUpdate("monthlyExpenses", parseFloat(e.target.value) || 0)
            }
          />
          <div className="flex gap-1.5 flex-wrap">
            {EXPENSES_PRESETS.map((p) => (
              <PresetPill
                key={p.value}
                label={p.label}
                active={inputs.monthlyExpenses === p.value}
                onClick={() => onUpdate("monthlyExpenses", p.value)}
              />
            ))}
          </div>
        </div>

        {/* Monthly side revenue */}
        <div className="space-y-2">
          <Label
            htmlFor="monthlySideRevenue"
            className="text-sm text-gray-700"
          >
            Current monthly side revenue (USD)
            <HelpTip text="Your total MRR from all side projects combined. If $0, that's fine. We all start there." />
          </Label>
          <Input
            id="monthlySideRevenue"
            type="number"
            min={0}
            max={1000000}
            value={inputs.monthlySideRevenue}
            onChange={(e) =>
              onUpdate("monthlySideRevenue", parseFloat(e.target.value) || 0)
            }
          />
          <div className="flex gap-1.5 flex-wrap">
            {SIDE_REVENUE_PRESETS.map((p) => (
              <PresetPill
                key={p.value}
                label={p.label}
                active={inputs.monthlySideRevenue === p.value}
                onClick={() => onUpdate("monthlySideRevenue", p.value)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Growth Model */}
      <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
        Growth Model
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Growth rate */}
        <div className="space-y-2">
          <Label htmlFor="monthlyGrowthRate" className="text-sm text-gray-700">
            Expected monthly growth rate (%)
            <HelpTip text="SaaS industry average is 10-15% MoM for early-stage. Be realistic." />
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="monthlyGrowthRate"
              type="number"
              min={0}
              max={100}
              value={inputs.monthlyGrowthRate}
              onChange={(e) =>
                onUpdate("monthlyGrowthRate", parseFloat(e.target.value) || 0)
              }
              className="w-20"
            />
            <Slider
              value={[inputs.monthlyGrowthRate]}
              onValueChange={([v]) => onUpdate("monthlyGrowthRate", v)}
              min={0}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {GROWTH_PRESETS.map((p) => (
              <PresetPill
                key={p.value}
                label={p.label}
                active={inputs.monthlyGrowthRate === p.value}
                onClick={() => onUpdate("monthlyGrowthRate", p.value)}
              />
            ))}
          </div>
        </div>

        {/* Corporate salary */}
        <div className="space-y-2">
          <Label htmlFor="corporateSalary" className="text-sm text-gray-700">
            Current annual corporate salary (USD)
            <HelpTip text="Your day job salary. Used to calculate risk exposure and full freedom number." />
          </Label>
          <Input
            id="corporateSalary"
            type="number"
            min={0}
            max={10000000}
            value={inputs.corporateSalary}
            onChange={(e) =>
              onUpdate("corporateSalary", parseFloat(e.target.value) || 0)
            }
          />
          <div className="flex gap-1.5 flex-wrap">
            {SALARY_PRESETS.map((p) => (
              <PresetPill
                key={p.value}
                label={p.label}
                active={inputs.corporateSalary === p.value}
                onClick={() => onUpdate("corporateSalary", p.value)}
              />
            ))}
          </div>
        </div>

        {/* Target monthly revenue */}
        <div className="space-y-2">
          <Label
            htmlFor="targetMonthlyRevenue"
            className="text-sm text-gray-700"
          >
            Target monthly revenue (USD)
            <HelpTip text="What monthly recurring revenue means freedom for you?" />
          </Label>
          <Input
            id="targetMonthlyRevenue"
            type="number"
            min={100}
            max={1000000}
            value={inputs.targetMonthlyRevenue}
            onChange={(e) =>
              onUpdate(
                "targetMonthlyRevenue",
                parseFloat(e.target.value) || 100
              )
            }
          />
          <div className="flex gap-1.5 flex-wrap">
            {TARGET_PRESETS.map((p) => (
              <PresetPill
                key={p.value}
                label={p.label}
                active={inputs.targetMonthlyRevenue === p.value}
                onClick={() => onUpdate("targetMonthlyRevenue", p.value)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
