import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import ShareModal from "./ShareModal";
import ProgressRing from "./fym/ProgressRing";
import { useCountUp } from "@/hooks/useCountUp";
import {
  formatCurrency,
  calculateFymScore,
  calculateRunway,
  calculateFreedomNumber,
  calculateFreedomPercentage,
  getFreedomColor,
} from "@/lib/fym-calculations";
import type { CalculatorInputs } from "@/types/fym";

interface FYMCalculatorProps {
  userId: string;
  onSaved: () => void;
  initialValues?: CalculatorInputs | null;
}

interface Results {
  runwayMonths: number;
  monthlyBurn: number;
  monthlyRevenue: number;
  fymMonthly: number;
  fymTotal: number;
  fymFreedomNumber: number;
  freedomPercentage: number;
}

export default function FYMCalculator({
  userId,
  onSaved,
  initialValues,
}: FYMCalculatorProps) {
  const isFirstTime = !localStorage.getItem(`fym_first_calc_${userId}`);

  const [runwayMonths, setRunwayMonths] = useState(isFirstTime ? "18" : "");
  const [monthlyBurn, setMonthlyBurn] = useState(isFirstTime ? "4500" : "");
  const [monthlyRevenue, setMonthlyRevenue] = useState(isFirstTime ? "0" : "");
  const [results, setResults] = useState<Results | null>(null);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareData, setShareData] = useState({
    freedomNumber: "",
    shareUrl: "",
  });
  const [reactiveMode, setReactiveMode] = useState(false);
  const [showDefaults, setShowDefaults] = useState(isFirstTime);
  const [savedToday, setSavedToday] = useState(false);

  // Load initial values from history row click
  useEffect(() => {
    if (initialValues) {
      setRunwayMonths(String(initialValues.runwayMonths));
      setMonthlyBurn(String(initialValues.monthlyBurn));
      setMonthlyRevenue(String(initialValues.monthlyRevenue));
      setShowDefaults(false);
      // Trigger reactive calc
      if (reactiveMode) {
        doCalculate(
          initialValues.runwayMonths,
          initialValues.monthlyBurn,
          initialValues.monthlyRevenue
        );
      }
    }
  }, [initialValues]);

  const doCalculate = useCallback(
    (runway: number, burn: number, revenue: number) => {
      if (!runway || runway < 1 || runway > 120) return;
      if (isNaN(burn) || burn < 0) return;
      if (isNaN(revenue) || revenue < 0) return;

      const fymMonthly = calculateFymScore(burn, revenue);
      const fymTotal = calculateRunway(fymMonthly, runway);
      const fymFreedomNumber = calculateFreedomNumber(burn);
      const freedomPercentage = calculateFreedomPercentage(revenue, burn);

      setResults({
        runwayMonths: runway,
        monthlyBurn: burn,
        monthlyRevenue: revenue,
        fymMonthly,
        fymTotal,
        fymFreedomNumber,
        freedomPercentage,
      });
    },
    []
  );

  // Reactive mode: auto-calculate on input change
  useEffect(() => {
    if (!reactiveMode) return;

    const timer = setTimeout(() => {
      const runway = parseInt(runwayMonths, 10);
      const burn = parseFloat(monthlyBurn);
      const revenue = parseFloat(monthlyRevenue);
      doCalculate(runway, burn, revenue);
    }, 300);

    return () => clearTimeout(timer);
  }, [runwayMonths, monthlyBurn, monthlyRevenue, reactiveMode, doCalculate]);

  const handleCalculate = () => {
    const runway = parseInt(runwayMonths, 10);
    const burn = parseFloat(monthlyBurn);
    const revenue = parseFloat(monthlyRevenue);

    if (!runway || runway < 1 || runway > 120) {
      toast.error("Runway must be between 1 and 120 months.");
      return;
    }
    if (isNaN(burn) || burn < 0) {
      toast.error("Monthly expenses must be 0 or more.");
      return;
    }
    if (isNaN(revenue) || revenue < 0) {
      toast.error("Monthly revenue must be 0 or more.");
      return;
    }

    doCalculate(runway, burn, revenue);
    setReactiveMode(true);
    setShowDefaults(false);
    localStorage.setItem(`fym_first_calc_${userId}`, "true");
  };

  const handleSave = async () => {
    if (!results) return;
    setSaving(true);

    // Check for existing entry today
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).toISOString();
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    ).toISOString();

    const { data: existing } = await supabase
      .from("fym_entries")
      .select("id")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .gte("created_at", startOfDay)
      .lt("created_at", endOfDay)
      .limit(1);

    let error;

    if (existing && existing.length > 0) {
      // Update existing entry
      const res = await supabase
        .from("fym_entries")
        .update({
          runway_months: results.runwayMonths,
          monthly_burn: results.monthlyBurn,
          monthly_revenue: results.monthlyRevenue,
          fym_monthly: results.fymMonthly,
          fym_total: results.fymTotal,
          fym_freedom_number: results.fymFreedomNumber,
        })
        .eq("id", existing[0].id);
      error = res.error;
    } else {
      // Insert new entry
      const res = await supabase.from("fym_entries").insert({
        user_id: userId,
        runway_months: results.runwayMonths,
        monthly_burn: results.monthlyBurn,
        monthly_revenue: results.monthlyRevenue,
        fym_monthly: results.fymMonthly,
        fym_total: results.fymTotal,
        fym_freedom_number: results.fymFreedomNumber,
      });
      error = res.error;
    }

    setSaving(false);

    if (error) {
      toast.error("Failed to save entry.");
      console.error(error);
    } else {
      const pct = Math.round(results.freedomPercentage);
      setSavedToday(true);
      toast.success(
        existing && existing.length > 0
          ? `Updated today's entry. You're at ${pct}% of your freedom number.`
          : `Entry saved. You're at ${pct}% of your freedom number.`
      );
      onSaved();
    }
  };

  const handleShare = async () => {
    if (!results) return;
    setSharing(true);
    const { data, error } = await supabase.functions.invoke("create-badge", {
      body: { badge_value: results.fymFreedomNumber },
    });
    setSharing(false);
    if (error || !data?.share_url) {
      toast.error("Failed to create badge.");
      return;
    }
    setShareData({
      freedomNumber: formatCurrency(results.fymFreedomNumber),
      shareUrl: data.share_url,
    });
    setShareOpen(true);
  };

  // Animated values
  const animFymMonthly = useCountUp(results?.fymMonthly ?? 0);
  const animFymTotal = useCountUp(results?.fymTotal ?? 0);
  const animFreedomNumber = useCountUp(results?.fymFreedomNumber ?? 0);

  const freedomPct = results?.freedomPercentage ?? 0;
  const ringColor =
    freedomPct >= 80
      ? "#4ADE80"
      : freedomPct >= 40
        ? "#FBBF24"
        : "#F87171";

  return (
    <div className="space-y-6">
      {showDefaults && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          We've added some sample numbers to get you started. Replace them with
          your real data to see your actual FYM score.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="runway">Months until your target exit date</Label>
          <div className="space-y-2">
            <Input
              id="runway"
              type="number"
              min={1}
              max={120}
              placeholder="e.g., 18"
              value={runwayMonths}
              onChange={(e) => setRunwayMonths(e.target.value)}
            />
            <Slider
              value={[parseInt(runwayMonths, 10) || 18]}
              onValueChange={([v]) => setRunwayMonths(String(v))}
              min={1}
              max={120}
              step={1}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="burn">Total monthly personal expenses (USD)</Label>
          <Input
            id="burn"
            type="number"
            min={0}
            placeholder="e.g., 4500"
            value={monthlyBurn}
            onChange={(e) => setMonthlyBurn(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="revenue">
            Current monthly side-business revenue (USD)
          </Label>
          <Input
            id="revenue"
            type="number"
            min={0}
            placeholder="e.g., 1200"
            value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(e.target.value)}
          />
        </div>
      </div>

      {!reactiveMode && (
        <Button
          onClick={handleCalculate}
          className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold px-8"
        >
          Calculate
        </Button>
      )}

      {results && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* FYM Score Card */}
            <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-xl hover:translate-y-[-2px] hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-[#8A95A8] font-medium uppercase tracking-wide">
                  Your FYM Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p
                      className={`text-4xl md:text-5xl font-bold tabular-nums ${
                        results.fymMonthly >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {formatCurrency(animFymMonthly)}
                    </p>
                    <p className="text-sm text-[#8A95A8] mt-1">
                      {results.fymMonthly >= 0
                        ? `+${formatCurrency(results.fymMonthly)}/month surplus`
                        : `${formatCurrency(results.fymMonthly)}/month deficit`}
                    </p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <ProgressRing
                      value={freedomPct}
                      size={64}
                      strokeWidth={5}
                      color={ringColor}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#0B1D3A]">
                      {Math.round(freedomPct)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Runway Projection Card */}
            <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-xl hover:translate-y-[-2px] hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-[#8A95A8] font-medium uppercase tracking-wide">
                  Your Runway Projection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl md:text-5xl font-bold text-[#0B1D3A] tabular-nums">
                  {formatCurrency(animFymTotal)}
                </p>
                <p className="text-sm text-[#8A95A8] mt-1">
                  {results.monthlyRevenue > 0
                    ? `At this rate, you'll have ${formatCurrency(results.fymTotal)} in ${results.runwayMonths} months`
                    : "Start with $0.97. Every journey begins with proof."}
                </p>
              </CardContent>
            </Card>

            {/* Freedom Number Card */}
            <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-xl hover:translate-y-[-2px] hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-[#8A95A8] font-medium uppercase tracking-wide">
                  Your Freedom Number
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-4xl md:text-5xl font-bold tabular-nums ${getFreedomColor(freedomPct)}`}
                >
                  {formatCurrency(animFreedomNumber)}
                </p>
                <p className="text-sm text-[#8A95A8] mt-1">
                  Annual revenue needed: {formatCurrency(results.fymFreedomNumber)}{" "}
                  | Monthly: {formatCurrency(results.fymFreedomNumber / 12)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={handleSave}
              disabled={saving}
              variant="outline"
              className="transition-transform active:scale-95"
            >
              {saving
                ? "Saving..."
                : savedToday
                  ? "Already logged today. See you tomorrow."
                  : "Save Entry"}
            </Button>
            <Button
              onClick={handleShare}
              disabled={sharing}
              className="bg-[#0B1D3A] hover:bg-[#132D5E] text-white"
            >
              {sharing ? "Creating badge..." : "Share"}
            </Button>
          </div>

          <ShareModal
            open={shareOpen}
            onOpenChange={setShareOpen}
            freedomNumber={shareData.freedomNumber}
            shareUrl={shareData.shareUrl}
          />
        </>
      )}
    </div>
  );
}
