import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useFymEntries } from "@/hooks/useFymEntries";
import { useLatestFymEntry } from "@/hooks/useLatestFymEntry";
import { useLatestInvisibilityScore } from "@/hooks/useInvisibilityScore";
import { usePipelineHistory } from "@/hooks/useIdeaPipeline";
import {
  formatCurrency,
  calculateFreedomNumber,
} from "@/lib/fym-calculations";

interface UpgradePageProps {
  userId: string;
}

const CORE_ACTION_IDS = [
  "core_email",
  "core_domain",
  "core_bank",
  "core_devices",
  "core_entity",
];

function calculateStreak(entries: { created_at: string }[]): number {
  if (entries.length === 0) return 0;
  const sorted = [...entries].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const curr = new Date(sorted[i - 1].created_at);
    const prev = new Date(sorted[i].created_at);
    const diffDays = Math.floor(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export default function UpgradePage({ userId }: UpgradePageProps) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { data: entries = [] } = useFymEntries(userId);
  const { data: latestEntry } = useLatestFymEntry(userId);
  const { data: latestInvisibility } = useLatestInvisibilityScore(userId);
  const { data: pipelineHistory = [] } = usePipelineHistory(userId);

  // Build accomplishments
  const accomplishments: string[] = [];

  if (latestEntry) {
    const freedomNumber = calculateFreedomNumber(
      Number(latestEntry.monthly_burn) || 0
    );
    accomplishments.push(
      `Freedom Number calculated: ${formatCurrency(freedomNumber)}`
    );
  }

  if (entries.length > 0) {
    const streak = calculateStreak(entries);
    const streakText = streak > 1 ? ` (${streak}-day streak)` : "";
    accomplishments.push(`${entries.length} entries logged${streakText}`);
  }

  if (latestInvisibility) {
    accomplishments.push(
      `Invisibility Score: ${latestInvisibility.total_score}/100`
    );
  }

  if (pipelineHistory.length > 0) {
    const latest = pipelineHistory[0];
    const verdictLabel =
      latest.verdict === "GO"
        ? "GO"
        : latest.verdict === "CONDITIONAL_GO"
          ? "CONDITIONAL GO"
          : "NO-GO";
    accomplishments.push(
      `Idea validated: "${latest.idea_name}" (${verdictLabel})`
    );
  }

  // Core stealth actions
  try {
    const raw = localStorage.getItem(`core_stealth_${userId}`);
    if (raw) {
      const progress = JSON.parse(raw);
      const coreCompleted = CORE_ACTION_IDS.filter(
        (id) => progress[id]
      ).length;
      if (coreCompleted > 0) {
        accomplishments.push(
          `${coreCompleted} of 5 core stealth actions completed`
        );
      }
    }
  } catch {}

  const validationsUsed = pipelineHistory.filter(
    (e) => e.verdict !== null
  ).length;

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: {
            tier: "founding",
            returnUrl: window.location.origin + "/dashboard",
          },
        }
      );
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch {
      toast.error("Could not start checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background:
            "linear-gradient(135deg, #1B2A4A 0%, #0F1D36 60%, #0A1628 100%)",
        }}
      >
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          Founding Member Toolkit
        </h1>
        <p className="text-white/60 text-base">
          $17.99/month. Locked for life. Cancel anytime.
        </p>
      </div>

      {/* What You've Accomplished */}
      {accomplishments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-[#8A95A8] uppercase tracking-wider mb-4">
            What You've Accomplished
          </h2>
          <div className="space-y-3">
            {accomplishments.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-sm text-[#0B1D3A]">{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What You Unlock */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-sm font-semibold text-[#8A95A8] uppercase tracking-wider">
          What You Unlock
        </h2>

        <div>
          <h3 className="text-xs font-semibold text-[#60A5FA] uppercase tracking-wider mb-2">
            Phase 1 Upgrades
          </h3>
          <ul className="space-y-2 text-sm text-[#4A5568]">
            <li>Scenario Engine: compare 3 growth paths side by side</li>
            <li>Reverse Calculator: work backwards from your goal</li>
            <li>Trends: track your freedom trajectory over time</li>
            <li>Risk Assessment: combined financial + stealth score</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-[#60A5FA] uppercase tracking-wider mb-2">
            Phase 2 Upgrades
          </h3>
          <ul className="space-y-2 text-sm text-[#4A5568]">
            <li>
              Full Stealth Ops: 15+ legal templates, 22 anonymity missions,
              industry compliance database
            </li>
            <li>All invisibility fix recommendations with templates</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-[#60A5FA] uppercase tracking-wider mb-2">
            Phase 3 Upgrades
          </h3>
          <ul className="space-y-2 text-sm text-[#4A5568]">
            <li>
              Unlimited idea validations (you've used {validationsUsed} of 1)
            </li>
            <li>48-Hour Action Plans for every validated idea</li>
            <li>Full idea details: tool stacks + validation scripts</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-[#60A5FA] uppercase tracking-wider mb-2">
            Phase 4 (New)
          </h3>
          <ul className="space-y-2 text-sm text-[#4A5568]">
            <li>Brand Manager: positioning, visual identity, copy</li>
            <li>Launch Control: 47-step go-live checklist</li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Button
          onClick={handleUpgrade}
          disabled={checkoutLoading}
          className="bg-[#D4A843] hover:bg-[#C49A3A] text-[#0B1D3A] font-bold text-base px-10 py-6 rounded-xl shadow-lg"
        >
          {checkoutLoading ? "Loading..." : "Upgrade Now: $17.99/month"}
        </Button>
        <p className="text-xs text-[#9CA3AF] mt-3">
          Founding price. Locked for life. Cancel anytime.
        </p>
      </div>

      {/* Bottom note */}
      <p className="text-center text-xs text-[#9CA3AF] italic pb-8">
        This is the only place you'll see the full list. Inside the dashboard,
        we show you what's relevant to where you are right now.
      </p>
    </div>
  );
}
