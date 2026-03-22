import { useState, useCallback } from "react";

const STORAGE_PREFIX = "stealth_playbook_progress_";

type ProgressMap = Record<string, string[]>;

function readProgress(userId: string): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + userId);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeProgress(userId: string, data: ProgressMap) {
  localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(data));
}

export function usePlaybookProgress(userId: string) {
  const [progress, setProgress] = useState<ProgressMap>(() => readProgress(userId));

  const isStepCompleted = useCallback(
    (missionId: string, stepId: string) => {
      return progress[missionId]?.includes(stepId) ?? false;
    },
    [progress],
  );

  const toggleStep = useCallback((missionId: string, stepId: string) => {
    setProgress((prev) => {
      const steps = prev[missionId] ?? [];
      const next = steps.includes(stepId)
        ? steps.filter((s) => s !== stepId)
        : [...steps, stepId];
      const updated = { ...prev, [missionId]: next };
      writeProgress(userId, updated);
      return updated;
    });
  }, [userId]);

  const getMissionProgress = useCallback(
    (missionId: string, totalSteps: number) => {
      const completed = progress[missionId]?.length ?? 0;
      return { completed, total: totalSteps };
    },
    [progress],
  );

  const resetMission = useCallback((missionId: string) => {
    setProgress((prev) => {
      const updated = { ...prev };
      delete updated[missionId];
      writeProgress(userId, updated);
      return updated;
    });
  }, [userId]);

  return { isStepCompleted, toggleStep, getMissionProgress, resetMission };
}
