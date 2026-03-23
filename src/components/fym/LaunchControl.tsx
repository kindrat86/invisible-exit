import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RotateCcw, Lock, Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
  hasFullAccess?: boolean;
}

export default function LaunchControl({ userId, hasFullAccess = true }: LaunchControlProps) {
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
        {LAUNCH_PHASES.map((phase) => {
          const isLocked = !hasFullAccess && phase.id !== "validate";

          if (isLocked) {
            return (
              <div
                key={phase.id}
                className="rounded-xl border border-gray-200/80 bg-white/80 border-l-4 border-l-gray-200 opacity-50 p-5 flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400">{phase.name}</h3>
                  <p className="text-xs text-gray-400">{phase.tagline} &middot; {phase.tasks.length} tasks</p>
                </div>
              </div>
            );
          }

          return (
            <LaunchPhaseCard
              key={phase.id}
              phase={phase}
              completedTasks={completedTasks}
              onToggleTask={handleToggleTask}
              isExpanded={!!expandedPhases[phase.id]}
              onToggleExpand={() => toggleExpand(phase.id)}
            />
          );
        })}
      </div>

      {/* Single upgrade CTA for locked phases */}
      {!hasFullAccess && (
        <div className="mt-4 bg-[#60A5FA]/5 border border-[#60A5FA]/20 rounded-xl p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#60A5FA]/10 flex items-center justify-center mx-auto mb-3">
            <Rocket className="w-6 h-6 text-[#60A5FA]" />
          </div>
          <h3 className="text-base font-semibold text-[#0B1D3A] mb-1">
            Ready to build? Unlock the full checklist.
          </h3>
          <p className="text-sm text-[#4A5568] max-w-md mx-auto mb-4">
            Founding members get all 41 steps from validated idea to first paying customer, while keeping your day job.
          </p>
          <button
            onClick={async () => {
              const { data } = await supabase.functions.invoke("create-checkout", {
                body: { tier: "founding", returnUrl: window.location.origin + "/dashboard" },
              });
              if (data?.url) window.location.href = data.url;
            }}
            className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            See Founding Toolkit — $17.99/mo
          </button>
          <p className="text-xs text-[#9CA3AF] mt-2">
            Founding price, locked for life. Cancel anytime.
          </p>
        </div>
      )}

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
