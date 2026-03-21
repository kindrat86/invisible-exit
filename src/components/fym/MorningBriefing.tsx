import { memo, useState, useEffect } from "react";
import { FREEDOM_LEVELS } from "@/lib/fym-calculations";
import { formatCurrency } from "@/lib/fym-calculations";
import type { MorningBriefingData } from "@/types/fym";

interface MorningBriefingProps {
  briefing: MorningBriefingData | null;
  hasEntries: boolean;
}

function MorningBriefingInner({ briefing, hasEntries }: MorningBriefingProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const levelName =
    briefing && briefing.currentLevel > 0
      ? FREEDOM_LEVELS[briefing.currentLevel - 1]?.name
      : "Pre-Launch";

  return (
    <div
      className="rounded-xl p-5 mb-6 transition-all duration-500 ease-out"
      style={{
        background: "linear-gradient(to right, #1B2A4A, #0F1D36)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
      }}
    >
      {!hasEntries || !briefing ? (
        <div>
          <p className="text-xs uppercase tracking-wider text-white/50 mb-2">
            Welcome
          </p>
          <p className="text-sm text-white/80">
            Let's calculate your first FYM score. Fill in your numbers below and
            save your first entry. Your journey starts today.
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Morning Briefing
            </p>
            <p className="text-xs uppercase tracking-wider text-white/50">
              {briefing.date}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/80 mb-3">
            <span>
              FYM Score:{" "}
              <span
                className={`font-bold ${briefing.fymGap >= 0 ? "text-green-400" : "text-white"}`}
              >
                {formatCurrency(briefing.fymGap)}/mo{" "}
                {briefing.fymGap < 0 ? "gap" : "surplus"}
              </span>
            </span>
            <span>
              Level{" "}
              <span className="font-bold text-white">
                {briefing.currentLevel}
              </span>{" "}
              of 5: {levelName}
            </span>
            {briefing.streak > 0 && (
              <span>
                Streak:{" "}
                <span className="font-bold text-white">
                  {briefing.streak} days
                </span>
              </span>
            )}
          </div>

          {briefing.daysTracked > 1 && (
            <div className="text-sm text-white/70 mb-3 space-y-0.5">
              <p>Since you started tracking:</p>
              <p>
                Revenue: {formatCurrency(briefing.revenueChange.from)} {"->"}{" "}
                {formatCurrency(briefing.revenueChange.to)}{" "}
                <span className="text-green-400">
                  (+
                  {formatCurrency(
                    briefing.revenueChange.to - briefing.revenueChange.from
                  )}
                  )
                </span>
              </p>
              {briefing.levelChange.from !== briefing.levelChange.to && (
                <p>
                  Freedom Level: {briefing.levelChange.from} {"->"}  {briefing.levelChange.to}
                </p>
              )}
              <p>Days tracked: {briefing.daysTracked}</p>
            </div>
          )}

          <p className="text-sm text-blue-300 font-medium">
            Today's focus: {briefing.todaysFocus}
            {briefing.focusEstimate && (
              <span className="text-white/50 font-normal">
                {" "}
                Estimated time: {briefing.focusEstimate}.
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

const MorningBriefing = memo(MorningBriefingInner);
export default MorningBriefing;
