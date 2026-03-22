import { useMemo } from "react";
import { Rocket, Target, Clock } from "lucide-react";
import { LAUNCH_PHASES, TOTAL_TASKS } from "@/data/launch-phases";

interface LaunchProgressHeaderProps {
  completedTasks: Record<string, boolean>;
  ideaTitle: string | null;
}

export default function LaunchProgressHeader({
  completedTasks,
  ideaTitle,
}: LaunchProgressHeaderProps) {
  const completedCount = useMemo(
    () => Object.values(completedTasks).filter(Boolean).length,
    [completedTasks]
  );

  const progressPct =
    TOTAL_TASKS > 0 ? Math.round((completedCount / TOTAL_TASKS) * 100) : 0;

  const currentPhase = useMemo(() => {
    for (const phase of LAUNCH_PHASES) {
      const phaseComplete = phase.tasks.every((t) => completedTasks[t.id]);
      if (!phaseComplete) return phase;
    }
    return LAUNCH_PHASES[LAUNCH_PHASES.length - 1];
  }, [completedTasks]);

  const remainingMinutes = useMemo(() => {
    let total = 0;
    for (const phase of LAUNCH_PHASES) {
      for (const task of phase.tasks) {
        if (!completedTasks[task.id] && task.estimatedMinutes > 0) {
          total += task.estimatedMinutes;
        }
      }
    }
    return total;
  }, [completedTasks]);

  const timeDisplay = useMemo(() => {
    if (remainingMinutes === 0) return "Complete!";
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    if (hours === 0) return `~${mins}m left`;
    if (mins === 0) return `~${hours}h left`;
    return `~${hours}h ${mins}m left`;
  }, [remainingMinutes]);

  const allComplete = completedCount === TOTAL_TASKS;

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
      {/* Top row: title + idea badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Rocket className="h-5 w-5 text-[#60A5FA]" />
            <h2 className="section-title">Idea Launch Control</h2>
          </div>
          <p className="text-sm text-gray-500">
            {allComplete
              ? "All phases complete. You did it."
              : `Phase ${currentPhase.sortOrder}: ${currentPhase.name}`}
          </p>
        </div>

        {ideaTitle && (
          <div className="flex items-center gap-1.5 bg-[#60A5FA]/10 border border-[#60A5FA]/20 rounded-lg px-3 py-1.5 shrink-0">
            <Target className="h-3.5 w-3.5 text-[#60A5FA]" />
            <span className="text-xs font-medium text-[#60A5FA] max-w-[150px] truncate">
              {ideaTitle}
            </span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              allComplete ? "bg-emerald-400" : "bg-[#60A5FA]"
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="font-mono tabular-nums">
          {completedCount}/{TOTAL_TASKS} tasks ({progressPct}%)
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {timeDisplay}
        </span>
      </div>
    </div>
  );
}
