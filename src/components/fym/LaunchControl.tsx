import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import LaunchProgressHeader from "./LaunchProgressHeader";
import LaunchPhaseCard from "./LaunchPhaseCard";
import { LAUNCH_PHASES, TOTAL_TASKS, ENCOURAGEMENT_MESSAGES } from "@/data/launch-phases";
import { useLaunchState } from "@/hooks/useLaunchProgress";

interface LaunchControlProps {
  userId: string;
}

export default function LaunchControl({ userId }: LaunchControlProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    completedTasks,
    toggleTask,
    ideaId,
    ideaTitle,
    selectIdea,
    isLoading,
  } = useLaunchState(userId);

  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>(
    {}
  );
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  // Pick up idea from URL params (from Idea Directory "Launch This Idea")
  useEffect(() => {
    const paramIdeaId = searchParams.get("ideaId");
    const paramIdeaTitle = searchParams.get("ideaTitle");
    if (paramIdeaId && paramIdeaTitle && !ideaId) {
      selectIdea(paramIdeaId, paramIdeaTitle);
      // Clean URL params
      setSearchParams({ tab: "launch" }, { replace: true });
    }
  }, [searchParams, ideaId, selectIdea, setSearchParams]);

  // Auto-expand the current (first incomplete) phase
  const currentPhaseId = useMemo(() => {
    for (const phase of LAUNCH_PHASES) {
      const allDone = phase.tasks.every((t) => completedTasks[t.id]);
      if (!allDone) return phase.id;
    }
    return LAUNCH_PHASES[LAUNCH_PHASES.length - 1].id;
  }, [completedTasks]);

  // Set initial expansion state
  useEffect(() => {
    if (!isLoading) {
      setExpandedPhases((prev) => {
        if (Object.keys(prev).length === 0) {
          return { [currentPhaseId]: true };
        }
        return prev;
      });
    }
  }, [isLoading, currentPhaseId]);

  const toggleExpand = useCallback((phaseId: string) => {
    setExpandedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  }, []);

  const handleToggleTask = useCallback(
    (taskId: string) => {
      const wasChecked = !!completedTasks[taskId];
      toggleTask(taskId);

      if (!wasChecked) {
        // Show encouragement
        const msg =
          ENCOURAGEMENT_MESSAGES[
            Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)
          ];
        toast.success(msg);

        // Check if this was the last task overall
        const newCompleted = Object.values({
          ...completedTasks,
          [taskId]: true,
        }).filter(Boolean).length;
        if (newCompleted === TOTAL_TASKS) {
          setTimeout(() => setShowCompletionDialog(true), 500);
        } else {
          // Check if this completes a phase -- auto-expand next
          for (const phase of LAUNCH_PHASES) {
            const phaseTasks = phase.tasks;
            const isThisPhase = phaseTasks.some((t) => t.id === taskId);
            if (isThisPhase) {
              const allDone = phaseTasks.every(
                (t) => t.id === taskId || completedTasks[t.id]
              );
              if (allDone) {
                const nextPhase = LAUNCH_PHASES.find(
                  (p) => p.sortOrder === phase.sortOrder + 1
                );
                if (nextPhase) {
                  setTimeout(() => {
                    setExpandedPhases((prev) => ({
                      ...prev,
                      [nextPhase.id]: true,
                    }));
                  }, 300);
                }
              }
              break;
            }
          }
        }
      }
    },
    [completedTasks, toggleTask]
  );

  const handleReset = useCallback(() => {
    // Clear all tasks by toggling each completed one off
    Object.keys(completedTasks).forEach((taskId) => {
      if (completedTasks[taskId]) toggleTask(taskId);
    });
    setExpandedPhases({ [LAUNCH_PHASES[0].id]: true });
    setShowResetDialog(false);
    toast.success("Launch progress reset. Fresh start.");
  }, [completedTasks, toggleTask]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-28 bg-white rounded-xl border border-gray-200/80 animate-pulse" />
        <div className="h-20 bg-white rounded-xl border border-gray-200/80 animate-pulse" />
        <div className="h-20 bg-white rounded-xl border border-gray-200/80 animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <LaunchProgressHeader
        completedTasks={completedTasks}
        ideaTitle={ideaTitle}
      />

      <div className="space-y-3">
        {LAUNCH_PHASES.map((phase) => (
          <LaunchPhaseCard
            key={phase.id}
            phase={phase}
            completedTasks={completedTasks}
            onToggleTask={handleToggleTask}
            isExpanded={!!expandedPhases[phase.id]}
            onToggleExpand={() => toggleExpand(phase.id)}
          />
        ))}
      </div>

      {/* Reset button */}
      <div className="mt-6 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowResetDialog(true)}
          className="text-gray-400 hover:text-gray-600 text-xs"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset Progress
        </Button>
      </div>

      {/* Reset confirmation */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Launch Progress?</DialogTitle>
            <DialogDescription>
              This will uncheck all tasks and start your launch playbook from
              scratch. This can't be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReset}
            >
              Reset Everything
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* All-complete celebration */}
      <Dialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
      >
        <DialogContent className="sm:max-w-lg text-center">
          <div className="py-4">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-[#0B1D3A] mb-3">
              You Did It.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              Every phase complete. You went from idea to live, accepting
              payments, with real customers. While keeping your day job.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Most people dream about this. You executed it. Head to your
              Calculator and update your numbers -- your freedom level just
              changed.
            </p>
            <Button
              onClick={() => setShowCompletionDialog(false)}
              className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
