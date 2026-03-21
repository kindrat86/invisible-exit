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
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 p-6">
      <p className="section-label mb-1">Progress</p>
      <h3 className="section-title mb-4">Your Freedom Level</h3>

      <FreedomLevelStepper
        currentLevel={currentLevel}
        progressToNext={progressToNext}
      />

      {/* Detail card */}
      <div className="mt-4 bg-gray-50/80 rounded-lg p-5">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-gray-900 font-mono tabular-nums">
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
              <span className="font-mono tabular-nums">{Math.round(progressToNext)}%</span>
            </div>
            <div className="h-2 bg-gray-200/60 rounded-full overflow-hidden">
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

        <p className="text-sm text-gray-500 italic border-l-2 border-[#60A5FA]/30 pl-3">
          {motivationalCopy}
        </p>
      </div>
    </div>
  );
}
