import { memo } from "react";
import { FREEDOM_LEVELS } from "@/lib/fym-calculations";

interface FreedomLevelStepperProps {
  currentLevel: number;
  progressToNext: number;
}

function FreedomLevelStepperInner({
  currentLevel,
  progressToNext,
}: FreedomLevelStepperProps) {
  return (
    <>
      {/* Desktop: horizontal stepper */}
      <div className="hidden sm:block w-full pb-2">
        <div className="flex items-center px-2">
          {FREEDOM_LEVELS.map((level, idx) => {
            const isCompleted = currentLevel >= level.level;
            const isCurrent = currentLevel === level.level - 1;
            const isFuture = currentLevel < level.level - 1;
            const isLast = idx === FREEDOM_LEVELS.length - 1;

            return (
              <div key={level.level} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isCompleted
                        ? "bg-[#2563EB] text-white"
                        : isCurrent
                          ? "bg-[#60A5FA] text-white ring-4 ring-blue-200/60 animate-pulse-ring"
                          : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {level.level}
                  </div>
                  <p
                    className={`text-[11px] mt-1.5 text-center leading-tight max-w-[90px] ${
                      isCompleted
                        ? "text-[#2563EB] font-medium"
                        : isCurrent
                          ? "text-[#60A5FA] font-medium"
                          : "text-gray-400"
                    }`}
                  >
                    {level.name}
                  </p>
                </div>

                {!isLast && (
                  <div className="flex-1 h-0.5 mx-1.5 relative">
                    <div className="absolute inset-0 bg-gray-200 rounded" />
                    {isCompleted && (
                      <div className="absolute inset-0 bg-[#2563EB] rounded transition-all duration-500" />
                    )}
                    {isCurrent && (
                      <div
                        className="absolute top-0 left-0 h-full bg-[#60A5FA] rounded transition-all duration-500 ease-out"
                        style={{ width: `${progressToNext}%` }}
                      />
                    )}
                    {isFuture && (
                      <div
                        className="absolute inset-0 rounded"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(90deg, #D1D5DB 0px, #D1D5DB 4px, transparent 4px, transparent 8px)",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical stepper */}
      <div className="flex sm:hidden flex-col gap-2">
        {FREEDOM_LEVELS.map((level) => {
          const isCompleted = currentLevel >= level.level;
          const isCurrent = currentLevel === level.level - 1;

          return (
            <div key={level.level} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                  isCompleted
                    ? "bg-green-400 text-white"
                    : isCurrent
                      ? "bg-[#60A5FA] text-white ring-4 ring-blue-200/60 animate-pulse-ring"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {level.level}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-medium truncate ${
                      isCompleted
                        ? "text-green-600"
                        : isCurrent
                          ? "text-[#60A5FA]"
                          : "text-gray-400"
                    }`}
                  >
                    {level.name}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] text-gray-400 font-mono ml-2">
                      {Math.round(progressToNext)}%
                    </span>
                  )}
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      isCompleted
                        ? "bg-[#2563EB]"
                        : isCurrent
                          ? "bg-[#60A5FA]"
                          : "bg-transparent"
                    }`}
                    style={{
                      width: isCompleted
                        ? "100%"
                        : isCurrent
                          ? `${progressToNext}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

const FreedomLevelStepper = memo(FreedomLevelStepperInner);
export default FreedomLevelStepper;
