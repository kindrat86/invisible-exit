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
  isFirstTime?: boolean;
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
      className={`text-xs px-3.5 py-1.5 rounded-full border font-medium transition-all duration-200 ease-out active:scale-95 ${
        active
          ? "bg-[#60A5FA] text-white border-[#60A5FA] shadow-sm shadow-blue-200/50"
          : "border-gray-200 text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm"
      }`}
    >
      {label}
    </button>
  );
}

function CurrencyInput({
  id,
  value,
  onChange,
  min,
  max,
  className,
}: {
  id: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  className?: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-mono pointer-events-none">
        $
      </span>
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`pl-7 font-mono tabular-nums ${className ?? ""}`}
      />
    </div>
  );
}

export default function SmartInputPanel({
  inputs,
  onUpdate,
  onReset,
  isFirstTime = false,
}: SmartInputPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-label mb-1">Your Numbers</p>
          <h3 className="section-title">What You Spend & Earn</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-red-400 transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-red-50 border border-transparent hover:border-red-200"
        >
          Reset
        </button>
      </div>

      {/* Row 1: What You Spend & Earn */}
      <p className="section-label mb-3 pb-2 border-b border-gray-100">
        What You Spend & Earn Today
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Months to exit */}
        <div className="space-y-2">
          <Label htmlFor="monthsToExit" className="text-sm text-gray-700">
            Months until you want to quit
            <HelpTip text="How many months from now do you want to hand in your resignation? Most people target 12-24 months. The shorter the window, the faster you need to grow." />
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
            className="font-mono tabular-nums"
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
            What you spend each month to live
            <HelpTip text="Add up everything: rent or mortgage, groceries, insurance, childcare, car, subscriptions. This is the number your side income needs to cover before you can quit." />
          </Label>
          <CurrencyInput
            id="monthlyExpenses"
            min={100}
            max={500000}
            value={inputs.monthlyExpenses}
            onChange={(v) => onUpdate("monthlyExpenses", v)}
          />
          <div className="flex gap-2 flex-wrap">
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
            What your side projects earn right now
            <HelpTip text="Total monthly recurring revenue from all your side businesses combined. Stripe payments, subscriptions, any recurring income outside your corporate salary. $0 is fine — everyone starts there." />
          </Label>
          <CurrencyInput
            id="monthlySideRevenue"
            min={0}
            max={1000000}
            value={inputs.monthlySideRevenue}
            onChange={(v) => onUpdate("monthlySideRevenue", v)}
          />
          <div className="flex gap-2 flex-wrap">
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

      {/* Row 2: Your Exit Trajectory (hidden for first-time users) */}
      {!isFirstTime && (
      <>
      <p className="section-label mb-3 pb-2 border-b border-gray-100">
        Your Exit Trajectory
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Growth rate */}
        <div className="space-y-2">
          <Label htmlFor="monthlyGrowthRate" className="text-sm text-gray-700">
            How fast your revenue grows each month
            <HelpTip text="If you earn $500 this month and $575 next month, that's 15% growth. Early-stage SaaS businesses typically grow 10-15% per month. Pick Conservative if you're just starting out." />
          </Label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                id="monthlyGrowthRate"
                type="number"
                min={0}
                max={100}
                value={inputs.monthlyGrowthRate}
                onChange={(e) =>
                  onUpdate("monthlyGrowthRate", parseFloat(e.target.value) || 0)
                }
                className="w-20 pr-7 font-mono tabular-nums"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-mono pointer-events-none">
                %
              </span>
            </div>
            <Slider
              value={[inputs.monthlyGrowthRate]}
              onValueChange={([v]) => onUpdate("monthlyGrowthRate", v)}
              min={0}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
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
            Your corporate salary per year
            <HelpTip text="Your total annual pay from your day job before tax. This is the golden handcuff number — the income you need your side projects to replace so you can walk away." />
          </Label>
          <CurrencyInput
            id="corporateSalary"
            min={0}
            max={10000000}
            value={inputs.corporateSalary}
            onChange={(v) => onUpdate("corporateSalary", v)}
          />
          <div className="flex gap-2 flex-wrap">
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
            The monthly income that sets you free
            <HelpTip text="The monthly recurring revenue you need from side projects to cover your lifestyle and quit your job. For most people, this equals monthly expenses plus a safety margin." />
          </Label>
          <CurrencyInput
            id="targetMonthlyRevenue"
            min={100}
            max={1000000}
            value={inputs.targetMonthlyRevenue}
            onChange={(v) => onUpdate("targetMonthlyRevenue", v || 100)}
          />
          <div className="flex gap-2 flex-wrap">
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
      </>
      )}
    </div>
  );
}
