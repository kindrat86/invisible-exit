import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  calculateFreedomNumber,
  calculateRequiredGrowthRate,
  getRealityCheckZone,
  formatCurrency,
} from "@/lib/fym-calculations";

interface OnboardingWizardProps {
  userId: string;
  onComplete: () => void;
}

const TAKE_HOME_PRESETS = [
  { label: "$3K", value: 3000 },
  { label: "$5K", value: 5000 },
  { label: "$8K", value: 8000 },
  { label: "$12K", value: 12000 },
];

const EXPERIENCE_OPTIONS = [
  {
    value: "failed",
    label: "Yes, it didn't work out",
    subtext: "Good. You know what doesn't work. We'll skip those.",
  },
  {
    value: "running",
    label: "Yes, it's still running",
    subtext: "Let's see if we can make it invisible and scalable.",
  },
  {
    value: "first_time",
    label: "No, this is my first time",
    subtext: "Clean slate. No bad habits to unlearn.",
  },
];

const CONCERN_OPTIONS = [
  "Getting caught by employer",
  "Not having enough time",
  "Not being technical enough",
  "Wasting money on something that fails",
  "Legal/compliance risk",
];

export default function OnboardingWizard({
  userId,
  onComplete,
}: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [monthlyTakeHome, setMonthlyTakeHome] = useState(5000);
  const [exitMonths, setExitMonths] = useState(18);
  const [experience, setExperience] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const freedomNumber = calculateFreedomNumber(monthlyTakeHome);
  const requiredMonthlyRevenue = monthlyTakeHome;
  const requiredGrowthRate = calculateRequiredGrowthRate(100, requiredMonthlyRevenue, exitMonths);
  const realityZone = getRealityCheckZone(requiredGrowthRate);

  const toggleConcern = (concern: string) => {
    setConcerns((prev) => {
      if (prev.includes(concern)) return prev.filter((c) => c !== concern);
      if (prev.length >= 2) return prev;
      return [...prev, concern];
    });
  };

  const handleComplete = useCallback(async () => {
    setSaving(true);
    try {
      // Save first fym_entry from onboarding data
      const { error: entryError } = await supabase.from("fym_entries").insert({
        user_id: userId,
        runway_months: exitMonths,
        monthly_burn: monthlyTakeHome,
        monthly_revenue: 0,
        fym_monthly: -monthlyTakeHome,
        fym_total: -monthlyTakeHome * exitMonths,
        fym_freedom_number: freedomNumber,
        monthly_growth_rate: 15,
        corporate_salary: monthlyTakeHome * 12,
        target_monthly_revenue: monthlyTakeHome,
        freedom_level: 0,
        combined_readiness_score: 0,
      });

      if (entryError) throw entryError;

      // Mark onboarding complete via localStorage (Supabase fallback)
      localStorage.setItem(`onboarding_completed_${userId}`, "true");
      localStorage.setItem(
        `onboarding_data_${userId}`,
        JSON.stringify({
          monthlyTakeHome,
          exitMonths,
          experience,
          concerns,
          completedAt: new Date().toISOString(),
        })
      );

      toast.success("Welcome aboard. Your dashboard is ready.");
      onComplete();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [userId, monthlyTakeHome, exitMonths, experience, concerns, freedomNumber, onComplete]);

  const handleSkip = () => {
    localStorage.setItem(`onboarding_completed_${userId}`, "true");
    onComplete();
  };

  const canGoNext = () => {
    if (step === 0) return monthlyTakeHome > 0;
    if (step === 1) return true;
    if (step === 2) return experience !== "";
    if (step === 3) return concerns.length > 0;
    return true;
  };

  const realityLabel = {
    very_achievable: "Very achievable",
    within_average: "Realistic",
    ambitious: "Ambitious but doable",
    very_aggressive: "Aggressive",
    unrealistic: "Will need more time or lower expenses",
  }[realityZone];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto"
      style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #0F1D36 60%, #0A1628 100%)" }}
    >
      <div className="w-full max-w-lg mx-auto px-4 py-8">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "bg-[#60A5FA] scale-110"
                  : i < step
                    ? "bg-[#60A5FA]/50"
                    : "bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 animate-fade-in">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  What's your monthly take-home after taxes?
                </h2>
                <p className="text-white/50 text-sm">
                  This is the number your side business needs to replace.
                </p>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-lg font-mono">$</span>
                <Input
                  type="number"
                  value={monthlyTakeHome}
                  onChange={(e) => setMonthlyTakeHome(parseFloat(e.target.value) || 0)}
                  className="pl-8 bg-white/10 border-white/20 text-white text-lg font-mono h-12"
                  min={500}
                  max={100000}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {TAKE_HOME_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setMonthlyTakeHome(p.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      monthlyTakeHome === p.value
                        ? "bg-[#60A5FA] text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  When do you want to be free?
                </h2>
                <p className="text-white/50 text-sm">
                  Most members aim for 12-24 months.
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-4xl font-bold text-white font-mono">
                    {exitMonths}
                  </span>
                  <span className="text-white/50 ml-2">months</span>
                </div>
                <Slider
                  value={[exitMonths]}
                  onValueChange={([v]) => setExitMonths(v)}
                  min={6}
                  max={60}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>6 months</span>
                  <span>60 months</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Have you tried building a side business before?
                </h2>
              </div>

              <div className="space-y-3">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setExperience(opt.value)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      experience === opt.value
                        ? "border-[#60A5FA] bg-[#60A5FA]/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <p className={`font-medium text-sm ${
                      experience === opt.value ? "text-[#60A5FA]" : "text-white/80"
                    }`}>
                      {opt.label}
                    </p>
                    {experience === opt.value && (
                      <p className="text-xs text-white/50 mt-1">{opt.subtext}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  What concerns you most about doing this?
                </h2>
                <p className="text-white/50 text-sm">Pick up to 2.</p>
              </div>

              <div className="space-y-2">
                {CONCERN_OPTIONS.map((concern) => (
                  <button
                    key={concern}
                    onClick={() => toggleConcern(concern)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      concerns.includes(concern)
                        ? "border-[#60A5FA] bg-[#60A5FA]/10 text-[#60A5FA]"
                        : "border-white/10 text-white/70 hover:border-white/20"
                    }`}
                  >
                    {concern}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Here's your personalized exit plan.
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wider text-white/40 mb-1">
                    Freedom Number
                  </p>
                  <p className="text-2xl font-bold text-white font-mono">
                    {formatCurrency(freedomNumber)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">
                      Timeline
                    </p>
                    <p className="text-lg font-bold text-white font-mono">
                      {exitMonths} months
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">
                      Required Growth
                    </p>
                    <p className="text-lg font-bold text-white font-mono">
                      {requiredGrowthRate > 0 ? `${requiredGrowthRate.toFixed(1)}%` : "—"}/mo
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wider text-white/40 mb-1">
                    Reality Check
                  </p>
                  <p className="text-sm text-white/80">{realityLabel}</p>
                </div>

                <div className="bg-[#60A5FA]/10 border border-[#60A5FA]/20 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wider text-[#60A5FA]/60 mb-1">
                    Your First Move
                  </p>
                  <p className="text-sm text-white/80">
                    {concerns.includes("Getting caught by employer")
                      ? "Complete your Invisibility Audit — make sure you're protected before you start building."
                      : concerns.includes("Not being technical enough")
                        ? "Browse the Idea Directory for no-code business ideas that match your skills."
                        : "Log your numbers in the Calculator and find your freedom level."}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleComplete}
                disabled={saving}
                className="w-full bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold h-12 text-base"
              >
                {saving ? "Setting up your dashboard..." : "Enter Your Dashboard"}
              </Button>
            </div>
          )}
        </div>

        {/* Navigation */}
        {step < 4 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="text-white/50 hover:text-white hover:bg-white/10"
            >
              Back
            </Button>
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canGoNext()}
              className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold px-8"
            >
              Next
            </Button>
          </div>
        )}

        {/* Skip link */}
        <div className="text-center mt-6">
          <button
            onClick={handleSkip}
            className="text-white/30 text-xs hover:text-white/50 transition-colors"
          >
            I'll set this up later
          </button>
        </div>
      </div>
    </div>
  );
}
