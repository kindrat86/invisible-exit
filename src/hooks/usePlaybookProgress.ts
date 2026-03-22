import { useState, useCallback } from "react";

const STORAGE_KEY = "stealth_playbook_progress";

type ProgressMap = Record<string, string[]>;

function readProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeProgress(data: ProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function usePlaybookProgress() {
  const [progress, setProgress] = useState<ProgressMap>(readProgress);

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
      writeProgress(updated);
      return updated;
    });
  }, []);

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
      writeProgress(updated);
      return updated;
    });
  }, []);

  return { isStepCompleted, toggleStep, getMissionProgress, resetMission };
}
