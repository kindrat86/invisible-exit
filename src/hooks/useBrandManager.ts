import { useState, useCallback, useMemo } from "react";
import { BRAND_PHASES, TOTAL_MAX_SCORE } from "@/data/brand-playbook";
import type { BrandManagerState, BrandTaskCompletion } from "@/types/fym";

const STORAGE_KEY_PREFIX = "brand_manager_";

function loadState(userId: string): BrandManagerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + userId);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted data — start fresh
  }
  return {
    taskCompletions: {},
    currentPhaseIndex: 0,
    startedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  };
}

function saveState(userId: string, state: BrandManagerState) {
  localStorage.setItem(STORAGE_KEY_PREFIX + userId, JSON.stringify(state));
}

export function useBrandManager(userId: string) {
  const [state, setState] = useState<BrandManagerState>(() => loadState(userId));

  const updateTask = useCallback(
    (taskId: string, completion: Partial<BrandTaskCompletion>) => {
      setState((prev) => {
        const existing = prev.taskCompletions[taskId] ?? {
          completed: false,
          updatedAt: new Date().toISOString(),
        };
        const updated: BrandManagerState = {
          ...prev,
          taskCompletions: {
            ...prev.taskCompletions,
            [taskId]: {
              ...existing,
              ...completion,
              updatedAt: new Date().toISOString(),
            },
          },
          lastUpdatedAt: new Date().toISOString(),
        };
        saveState(userId, updated);
        return updated;
      });
    },
    [userId]
  );

  const resetAll = useCallback(() => {
    const fresh: BrandManagerState = {
      taskCompletions: {},
      currentPhaseIndex: 0,
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };
    setState(fresh);
    saveState(userId, fresh);
  }, [userId]);

  const launchReadinessScore = useMemo(() => {
    let completedWeight = 0;
    for (const phase of BRAND_PHASES) {
      for (const task of phase.tasks) {
        const c = state.taskCompletions[task.id];
        if (c?.completed) {
          completedWeight += task.weight;
        }
      }
    }
    return Math.round((completedWeight / TOTAL_MAX_SCORE) * 100);
  }, [state.taskCompletions]);

  const phaseCompletionCounts = useMemo(() => {
    const counts: Record<string, { done: number; total: number }> = {};
    for (const phase of BRAND_PHASES) {
      let done = 0;
      for (const task of phase.tasks) {
        if (state.taskCompletions[task.id]?.completed) done++;
      }
      counts[phase.id] = { done, total: phase.tasks.length };
    }
    return counts;
  }, [state.taskCompletions]);

  return {
    state,
    updateTask,
    resetAll,
    launchReadinessScore,
    phaseCompletionCounts,
  };
}
