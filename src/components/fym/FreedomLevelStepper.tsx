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
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center min-w-[500px] px-2">
        {FREEDOM_LEVELS.map((level, idx) => {
          const isCompleted = currentLevel >= level.level;
          const isCurrent = currentLevel === level.level - 1;
          const isFuture = currentLevel < level.level - 1;
          const isLast = idx === FREEDOM_LEVELS.length - 1;

          return (
            <div key={level.level} className="flex items-center flex-1">
              {/* Node */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-400 text-white"
                      : isCurrent
                        ? "bg-[#60A5FA] text-white ring-4 ring-blue-200 animate-pulse"
                        : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {level.level}
                </div>
                <p
                  className={`text-[10px] mt-1.5 text-center leading-tight max-w-[80px] ${
                    isCompleted
                      ? "text-green-600 font-medium"
                      : isCurrent
                        ? "text-[#60A5FA] font-medium"
                        : "text-gray-400"
                  }`}
                >
                  {level.name}
                </p>
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-1 relative">
                  <div className="absolute inset-0 bg-gray-200 rounded" />
                  {isCompleted && (
                    <div className="absolute inset-0 bg-green-400 rounded transition-all duration-500" />
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
  );
}

const FreedomLevelStepper = memo(FreedomLevelStepperInner);
export default FreedomLevelStepper;
