import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { LaunchProgress } from "@/types/fym";

const STORAGE_PREFIX = "fym_launch_progress_";

function readLocalProgress(userId: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + userId);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocalProgress(userId: string, tasks: Record<string, boolean>) {
  localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(tasks));
}

function readLocalIdea(userId: string): { id: string | null; title: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + userId + "_idea");
    return raw ? JSON.parse(raw) : { id: null, title: null };
  } catch {
    return { id: null, title: null };
  }
}

function writeLocalIdea(userId: string, id: string | null, title: string | null) {
  localStorage.setItem(STORAGE_PREFIX + userId + "_idea", JSON.stringify({ id, title }));
}

export function useLatestLaunchProgress(userId: string) {
  return useQuery({
    queryKey: ["launch-progress", userId],
    queryFn: async (): Promise<LaunchProgress | null> => {
      const { data, error } = await supabase
        .from("launch_progress")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        if (error.code === "42P01" || error.message?.includes("does not exist"))
          return null;
        throw error;
      }
      return data as unknown as LaunchProgress;
    },
    enabled: !!userId,
    retry: false,
  });
}

export function useSaveLaunchProgress(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      progress: Pick<
        LaunchProgress,
        "completed_tasks" | "selected_idea_id" | "selected_idea_title" | "notes" | "completed_at"
      >
    ) => {
      // Always persist to localStorage as fallback
      writeLocalProgress(userId, progress.completed_tasks);
      if (progress.selected_idea_id) {
        writeLocalIdea(userId, progress.selected_idea_id, progress.selected_idea_title);
      }

      const { data: existing } = await supabase
        .from("launch_progress")
        .select("id")
        .eq("user_id", userId)
        .limit(1)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from("launch_progress")
          .update({
            completed_tasks: progress.completed_tasks,
            selected_idea_id: progress.selected_idea_id,
            selected_idea_title: progress.selected_idea_title,
            notes: progress.notes,
            completed_at: progress.completed_at,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)
          .select()
          .single();
        if (error) throw error;
        return data as unknown as LaunchProgress;
      } else {
        const { data, error } = await supabase
          .from("launch_progress")
          .insert({
            user_id: userId,
            completed_tasks: progress.completed_tasks,
            selected_idea_id: progress.selected_idea_id,
            selected_idea_title: progress.selected_idea_title,
            notes: progress.notes ?? {},
            completed_at: progress.completed_at,
            started_at: new Date().toISOString(),
          })
          .select()
          .single();
        if (error) throw error;
        return data as unknown as LaunchProgress;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["launch-progress", userId],
      });
    },
    onError: () => {
      // Supabase table may not exist -- localStorage fallback already written
    },
  });
}

export function useLaunchState(userId: string) {
  const { data: dbProgress, isLoading } = useLatestLaunchProgress(userId);
  const saveMutation = useSaveLaunchProgress(userId);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const localTasks = readLocalProgress(userId);
  const localIdea = readLocalIdea(userId);

  const initialTasks =
    dbProgress?.completed_tasks && Object.keys(dbProgress.completed_tasks).length > 0
      ? dbProgress.completed_tasks
      : localTasks;

  const initialIdeaId = dbProgress?.selected_idea_id ?? localIdea.id;
  const initialIdeaTitle = dbProgress?.selected_idea_title ?? localIdea.title;

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(initialTasks);
  const [ideaId, setIdeaId] = useState<string | null>(initialIdeaId);
  const [ideaTitle, setIdeaTitle] = useState<string | null>(initialIdeaTitle);

  // Sync when DB data loads after initial render
  const lastDbRef = useRef<string | null>(null);
  if (dbProgress && dbProgress.id !== lastDbRef.current) {
    lastDbRef.current = dbProgress.id;
    if (Object.keys(dbProgress.completed_tasks).length > 0) {
      setCompletedTasks(dbProgress.completed_tasks);
    }
    if (dbProgress.selected_idea_id) {
      setIdeaId(dbProgress.selected_idea_id);
      setIdeaTitle(dbProgress.selected_idea_title);
    }
  }

  const debouncedSave = useCallback(
    (tasks: Record<string, boolean>) => {
      writeLocalProgress(userId, tasks);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        saveMutation.mutate({
          completed_tasks: tasks,
          selected_idea_id: ideaId,
          selected_idea_title: ideaTitle,
          notes: dbProgress?.notes ?? {},
          completed_at: null,
        });
      }, 500);
    },
    [saveMutation, ideaId, ideaTitle, dbProgress?.notes]
  );

  const toggleTask = useCallback(
    (taskId: string) => {
      setCompletedTasks((prev) => {
        const next = { ...prev, [taskId]: !prev[taskId] };
        if (!next[taskId]) delete next[taskId];
        debouncedSave(next);
        return next;
      });
    },
    [debouncedSave]
  );

  const selectIdea = useCallback(
    (id: string, title: string) => {
      setIdeaId(id);
      setIdeaTitle(title);
      writeLocalIdea(userId, id, title);
      saveMutation.mutate({
        completed_tasks: completedTasks,
        selected_idea_id: id,
        selected_idea_title: title,
        notes: dbProgress?.notes ?? {},
        completed_at: null,
      });
    },
    [saveMutation, completedTasks, dbProgress?.notes]
  );

  return {
    completedTasks,
    toggleTask,
    ideaId,
    ideaTitle,
    selectIdea,
    isLoading,
  };
}
