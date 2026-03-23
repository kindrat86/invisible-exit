import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Shield,
  ShieldCheck,
  Rocket,
  RefreshCw,
  Zap,
  X,
} from "lucide-react";

interface ContextualUpgradeCardProps {
  momentId: string;
  onUpgrade?: () => void;
  dynamicValues?: Record<string, string | number>;
  dismissible?: boolean;
}

const MOMENT_CONFIG: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    body: string;
    cta: string;
  }
> = {
  "third-entry": {
    icon: TrendingUp,
    title: "You've logged 3 entries. Your data has a story.",
    body: "Founding members unlock Trends analysis to see their freedom score and revenue trajectory over time. Spot the patterns. Track the momentum.",
    cta: "See Your Trends",
  },
  "audit-complete": {
    icon: Shield,
    title: "Your score: {score}/100. You've identified the gaps.",
    body: "The full fix list has {totalFixes} specific recommendations with step-by-step instructions, cost estimates, and legal templates. Plus the complete Stealth Ops Hub with anonymity missions and a compliance database for your industry.",
    cta: "Unlock Full Protection",
  },
  "stealth-leveled-up": {
    icon: ShieldCheck,
    title: "Your Stealth Score went from {firstScore} to {latestScore}.",
    body: "You've handled the basics. The full Stealth Ops Hub goes deeper: 15+ legal templates for entity formation and IP protection. 22 anonymity missions with step-by-step checklists. Industry-specific compliance database for healthcare, finance, and engineering.",
    cta: "Unlock Stealth Ops",
  },
  "pipeline-go": {
    icon: Rocket,
    title: "Your idea scored {score}/100. Verdict: {verdict}.",
    body: 'Your personalized 48-Hour Action Plan is ready. It has phase-by-phase checklists, priority tasks, and progress tracking to take this idea from validated to live.\n\nFounding members also get unlimited validations. Most members test 3-5 ideas before picking their winner.',
    cta: "Unlock Action Plan + Unlimited Validations",
  },
  "pipeline-nogo": {
    icon: RefreshCw,
    title: "This idea scored {score}/100. Not the one.",
    body: "That's valuable data. Most successful founders validate 3-5 ideas before finding their winner. Founding members get unlimited validations to find the right fit.",
    cta: "Unlock Unlimited Validations",
  },
  "pipeline-limit": {
    icon: Zap,
    title: "You've used your free validation.",
    body: 'You validated "{previousIdeaName}" and scored {previousScore}/100. Want to compare against alternatives?\n\nFounding members get unlimited validations, full 48-Hour Action Plans, and the complete Build + Launch toolkit.',
    cta: "Unlock Unlimited Validations",
  },
};

function interpolate(
  text: string,
  values?: Record<string, string | number>
): string {
  if (!values) return text;
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key] !== undefined ? String(values[key]) : match;
  });
}

export default function ContextualUpgradeCard({
  momentId,
  onUpgrade,
  dynamicValues,
  dismissible = false,
}: ContextualUpgradeCardProps) {
  const [, setSearchParams] = useSearchParams();
  const [dismissed, setDismissed] = useState(() => {
    if (!dismissible) return false;
    return localStorage.getItem(`upgrade_moment_${momentId}_dismissed`) === "true";
  });

  const config = MOMENT_CONFIG[momentId];
  if (!config || dismissed) return null;

  const Icon = config.icon;
  const title = interpolate(config.title, dynamicValues);
  const body = interpolate(config.body, dynamicValues);

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      setSearchParams({ tab: "upgrade", from: momentId }, { replace: true });
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(`upgrade_moment_${momentId}_dismissed`, "true");
    setDismissed(true);
  };

  return (
    <div className="relative rounded-xl border border-border/50 bg-gradient-to-br from-blue-50/20 to-blue-50/5 dark:from-blue-950/10 dark:to-blue-950/5 p-6">
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors p-1"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-xl bg-[#60A5FA]/10 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-[#60A5FA]" />
        </div>

        <h3 className="text-lg font-semibold text-[#0B1D3A] mb-2">{title}</h3>

        <p className="text-sm text-[#4A5568] max-w-md mb-4 leading-relaxed whitespace-pre-line">
          {body}
        </p>

        <Button
          onClick={handleUpgrade}
          className="bg-[#D4A843] hover:bg-[#C49A3A] text-[#0B1D3A] font-semibold px-6 py-2.5 rounded-xl"
        >
          {config.cta}
        </Button>

        <p className="text-xs text-[#9CA3AF] mt-2">
          $17.99/mo. Founding price. Locked for life.
        </p>
      </div>
    </div>
  );
}
