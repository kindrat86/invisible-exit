import FreedomLevelStepper from "./FreedomLevelStepper";
import { FREEDOM_LEVELS, LEVEL_ZERO_COPY } from "@/lib/fym-calculations";

interface FreedomLevelsProps {
  currentLevel: number;
  progressToNext: number;
  monthsToNextLevel: number | null;
}

export default function FreedomLevels({
  currentLevel,
  progressToNext,
  monthsToNextLevel,
}: FreedomLevelsProps) {
  const currentLevelDef =
    currentLevel > 0 ? FREEDOM_LEVELS[currentLevel - 1] : null;
  const nextLevelDef =
    currentLevel < 5 ? FREEDOM_LEVELS[currentLevel] : null;

  const motivationalCopy =
    currentLevel === 0
      ? LEVEL_ZERO_COPY
      : currentLevelDef?.motivationalCopy ?? "";

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
        Progress
      </p>
      <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-4">
        Your Freedom Level
      </h3>

      <FreedomLevelStepper
        currentLevel={currentLevel}
        progressToNext={progressToNext}
      />

      {/* Detail card */}
      <div
        className="mt-4 rounded-xl border border-gray-100 p-6 shadow-sm"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)" }}
      >
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-gray-900">
            Level {currentLevel}
          </span>
          <span className="text-sm text-gray-500">
            {currentLevelDef?.name ?? "Pre-Launch"}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {currentLevelDef?.description ??
            "You haven't earned your first dollar yet. Once a stranger pays you for something you built, you'll unlock Level 1."}
        </p>

        {nextLevelDef && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span>Progress to Level {nextLevelDef.level}: {nextLevelDef.name}</span>
              <span>{Math.round(progressToNext)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#60A5FA] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            {monthsToNextLevel !== null && monthsToNextLevel > 0 && (
              <p className="text-xs text-gray-400 mt-1.5">
                {monthsToNextLevel} months to Level {nextLevelDef.level} at
                current growth rate
              </p>
            )}
          </div>
        )}

        <p className="text-sm text-gray-500 italic">{motivationalCopy}</p>
      </div>
    </div>
  );
}
