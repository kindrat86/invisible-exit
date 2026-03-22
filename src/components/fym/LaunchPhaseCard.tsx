import { useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";
import LaunchTaskItem from "./LaunchTaskItem";
import type { LaunchPhase } from "@/types/fym";

interface LaunchPhaseCardProps {
  phase: LaunchPhase;
  completedTasks: Record<string, boolean>;
  onToggleTask: (taskId: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function LaunchPhaseCard({
  phase,
  completedTasks,
  onToggleTask,
  isExpanded,
  onToggleExpand,
}: LaunchPhaseCardProps) {
  const completedCount = useMemo(
    () => phase.tasks.filter((t) => completedTasks[t.id]).length,
    [phase.tasks, completedTasks]
  );

  const totalCount = phase.tasks.length;
  const isComplete = completedCount === totalCount;
  const hasStarted = completedCount > 0;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const borderColor = isComplete
    ? "border-l-emerald-400"
    : hasStarted
    ? "border-l-[#60A5FA]"
    : "border-l-gray-200";

  const bgClass = isComplete
    ? "bg-emerald-50/30"
    : hasStarted
    ? "bg-white"
    : "bg-white/80";

  return (
    <div
      className={`rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 ${borderColor} ${bgClass} overflow-hidden`}
    >
      {/* Header */}
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        {/* Phase number badge */}
        <div
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
            isComplete
              ? "bg-emerald-100 text-emerald-600"
              : hasStarted
              ? "bg-[#60A5FA]/10 text-[#60A5FA]"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {isComplete ? (
            <Check className="h-4.5 w-4.5" />
          ) : (
            phase.sortOrder
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`font-semibold text-sm sm:text-base tracking-tight ${
                isComplete
                  ? "text-emerald-700"
                  : hasStarted
                  ? "text-[#0B1D3A]"
                  : "text-gray-500"
              }`}
            >
              {phase.name}
            </h3>
            <span className="text-xs text-gray-400 hidden sm:inline">
              {phase.tagline}
            </span>
          </div>

          {/* Mini progress bar */}
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1.5 flex-1 max-w-[120px] bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isComplete ? "bg-emerald-400" : "bg-[#60A5FA]"
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 font-mono tabular-nums">
              {completedCount}/{totalCount}
            </span>
          </div>
        </div>

        <ChevronDown
          className={`h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {phase.description}
          </p>

          <div className="space-y-2">
            {phase.tasks.map((task) => (
              <LaunchTaskItem
                key={task.id}
                task={task}
                checked={!!completedTasks[task.id]}
                onToggle={onToggleTask}
              />
            ))}
          </div>

          {/* Completion banner */}
          {isComplete && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4 animate-in fade-in duration-300">
              <p className="text-sm text-emerald-800 font-medium leading-relaxed">
                {phase.completionCopy}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
