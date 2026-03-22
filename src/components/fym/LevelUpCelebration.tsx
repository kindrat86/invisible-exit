import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FREEDOM_LEVELS, formatCurrency } from "@/lib/fym-calculations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface LevelUpCelebrationProps {
  previousLevel: number;
  newLevel: number;
  freedomPct: number;
  onDismiss: () => void;
  hasFullAccess?: boolean;
}

const LEVEL_MESSAGES: Record<string, string> = {
  "0->1": "A stranger paid you. You're not dreaming. This is real.",
  "1->2": "You have a safety net. Six months of breathing room.",
  "2->3": "Your side income covers half your expenses. You have negotiation power.",
  "3->4": "Walk-away money. Your salary is optional.",
  "4->5": "True FYM. You are free.",
};

function getLevelMessage(from: number, to: number): string {
  const key = `${from}->${to}`;
  if (LEVEL_MESSAGES[key]) return LEVEL_MESSAGES[key];
  // For jumps of more than 1 level, use the target level message
  for (let i = to; i > 0; i--) {
    const k = `${i - 1}->${i}`;
    if (LEVEL_MESSAGES[k]) return LEVEL_MESSAGES[k];
  }
  return "You're making progress. Keep building.";
}

export default function LevelUpCelebration({
  previousLevel,
  newLevel,
  freedomPct,
  onDismiss,
  hasFullAccess = true,
}: LevelUpCelebrationProps) {
  const levelDef = newLevel > 0 ? FREEDOM_LEVELS[newLevel - 1] : null;
  const levelName = levelDef?.name ?? "Pre-Launch";
  const message = getLevelMessage(previousLevel, newLevel);

  useEffect(() => {
    // Fire confetti on mount
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });

    // Second burst slightly delayed
    const timer = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5, x: 0.3 },
      });
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5, x: 0.7 },
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-badge", {
        body: {
          badge_value: freedomPct,
          badge_type: "level",
          level: newLevel,
          level_name: levelName,
        },
      });

      if (error || !data?.share_url) {
        toast.error("Failed to create badge.");
        return;
      }

      // Copy share URL to clipboard
      await navigator.clipboard.writeText(data.share_url);
      toast.success("Share link copied to clipboard.");
    } catch {
      toast.error("Failed to create badge.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Level Up text */}
        <h1 className="text-5xl font-bold text-white mb-8 tracking-tight">
          Level Up.
        </h1>

        {/* Level badge */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
          <div className="text-center">
            <span className="text-4xl font-bold text-white">{newLevel}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-1">
          Level {newLevel}: {levelName}
        </h2>

        <p className="text-white/70 text-base leading-relaxed mt-4 mb-8">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center flex-wrap">
          <Button
            onClick={handleShare}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Share Badge
          </Button>
          <Button
            onClick={onDismiss}
            className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold px-8"
          >
            Continue
          </Button>
        </div>

        {!hasFullAccess && (
          <p className="text-xs text-white/30 mt-4">
            Founding members unlock 8 more tools to accelerate from Level {newLevel} to Level 5.
          </p>
        )}
      </div>
    </div>
  );
}
