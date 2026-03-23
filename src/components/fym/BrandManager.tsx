import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Target,
  Palette,
  Globe,
  MessageSquare,
  Megaphone,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import ProgressRing from "@/components/fym/ProgressRing";
import { Lock, Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BRAND_PHASES } from "@/data/brand-playbook";
import { useBrandManager } from "@/hooks/useBrandManager";
import type { BrandPhase, BrandTask } from "@/types/fym";

const PHASE_ICONS: Record<string, React.ReactNode> = {
  Target: <Target className="h-5 w-5" />,
  Palette: <Palette className="h-5 w-5" />,
  Globe: <Globe className="h-5 w-5" />,
  MessageSquare: <MessageSquare className="h-5 w-5" />,
  Megaphone: <Megaphone className="h-5 w-5" />,
};

function getScoreColor(score: number) {
  if (score >= 90) return "#4ADE80";
  if (score >= 60) return "#60A5FA";
  if (score >= 30) return "#FBBF24";
  return "#F87171";
}

function getScoreLabel(score: number) {
  if (score >= 90) return "LAUNCH READY";
  if (score >= 50) return "ALMOST READY";
  if (score > 0) return "IN PROGRESS";
  return "NOT STARTED";
}

function LockedPhasesUpgradeBanner() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier: "founding", returnUrl: window.location.origin + "/dashboard" },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch {
      toast.error("Could not start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#60A5FA]/5 border border-[#60A5FA]/20 rounded-xl p-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#60A5FA]/10 flex items-center justify-center mx-auto mb-3">
        <Rocket className="w-6 h-6 text-[#60A5FA]" />
      </div>
      <h3 className="text-base font-semibold text-[#0B1D3A] mb-1">
        Unlock the full brand toolkit
      </h3>
      <p className="text-sm text-[#4A5568] max-w-md mx-auto mb-4">
        Complete your positioning, then build your visual identity, set up payments, find your voice, and grow organically.
      </p>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm"
      >
        {loading ? "Loading..." : "See Founding Toolkit — $17.99/mo"}
      </button>
      <p className="text-xs text-[#9CA3AF] mt-2">
        Founding price, locked for life. Cancel anytime.
      </p>
    </div>
  );
}

interface BrandManagerProps {
  userId: string;
  hasFullAccess?: boolean;
}

export default function BrandManager({ userId, hasFullAccess = true }: BrandManagerProps) {
  const {
    state,
    updateTask,
    resetAll,
    launchReadinessScore,
    phaseCompletionCounts,
  } = useBrandManager(userId);

  const [activePhaseIndex, setActivePhaseIndex] = useState<number | null>(null);

  const activePhase =
    activePhaseIndex !== null ? BRAND_PHASES[activePhaseIndex] : null;

  // ── Overview View ──
  if (!activePhase) {
    return (
      <div className="space-y-6">
        {/* Launch Readiness Score */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-8 flex flex-col items-center">
            <div className="relative">
              <ProgressRing
                value={launchReadinessScore}
                size={160}
                strokeWidth={10}
                color={getScoreColor(launchReadinessScore)}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#0B1D3A]">
                  {launchReadinessScore}%
                </span>
              </div>
            </div>
            <p
              className="text-lg font-bold mt-4 uppercase tracking-wide"
              style={{ color: getScoreColor(launchReadinessScore) }}
            >
              {getScoreLabel(launchReadinessScore)}
            </p>
            <p className="text-xs text-[#8A95A8] mt-2">
              Complete all 5 phases to be launch ready
            </p>
          </CardContent>
        </Card>

        {/* Phase Cards */}
        <div className="space-y-3">
          {BRAND_PHASES.map((phase, index) => {
            const counts = phaseCompletionCounts[phase.id];
            const phasePct =
              counts.total > 0
                ? Math.round((counts.done / counts.total) * 100)
                : 0;
            const isComplete = counts.done === counts.total;
            const isLocked = !hasFullAccess && index > 0;

            return (
              <Card
                key={phase.id}
                className={`bg-white border transition-all duration-300 ${
                  isLocked
                    ? "opacity-50 border-gray-200"
                    : isComplete
                      ? "border-green-300 ring-1 ring-green-200 cursor-pointer hover:translate-y-[-2px] hover:shadow-md"
                      : "border-gray-200 cursor-pointer hover:translate-y-[-2px] hover:shadow-md"
                }`}
                onClick={() => !isLocked && setActivePhaseIndex(index)}
              >
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    isLocked ? "bg-gray-100 text-gray-400" : "bg-[#F4F7FB] text-[#60A5FA]"
                  }`}>
                    {isLocked ? <Lock className="h-5 w-5" /> : PHASE_ICONS[phase.icon]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm ${isLocked ? "text-gray-400" : "text-[#0B1D3A]"}`}>
                      {phase.title}
                    </h3>
                    <p className="text-xs text-[#8A95A8] truncate">
                      {phase.subtitle}
                    </p>
                    {!isLocked && (
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={phasePct} className="h-1.5 flex-1" />
                        <span className="text-xs text-[#8A95A8] flex-shrink-0">
                          {counts.done}/{counts.total}
                        </span>
                      </div>
                    )}
                  </div>
                  {!isLocked && (
                    <div className="flex-shrink-0">
                      <ProgressRing
                        value={phasePct}
                        size={48}
                        strokeWidth={4}
                        color={isComplete ? "#4ADE80" : "#60A5FA"}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Single upgrade CTA for locked phases */}
        {!hasFullAccess && (
          <LockedPhasesUpgradeBanner />
        )}

        {/* Reset */}
        <div className="flex justify-center pt-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#8A95A8] hover:text-red-500"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset All Progress
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear all your Brand Manager entries and start fresh.
                  This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={resetAll}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Reset Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  // ── Phase Detail View ──
  return (
    <PhaseDetail
      phase={activePhase}
      state={state}
      updateTask={updateTask}
      onBack={() => setActivePhaseIndex(null)}
    />
  );
}

// ── Phase Detail Component ──

interface PhaseDetailProps {
  phase: BrandPhase;
  state: ReturnType<typeof useBrandManager>["state"];
  updateTask: ReturnType<typeof useBrandManager>["updateTask"];
  onBack: () => void;
}

function PhaseDetail({ phase, state, updateTask, onBack }: PhaseDetailProps) {
  const completedCount = phase.tasks.filter(
    (t) => state.taskCompletions[t.id]?.completed
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-[#8A95A8] mb-3 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to overview
        </Button>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#4A5568] font-medium">{phase.title}</span>
          <span className="text-[#8A95A8]">
            {completedCount}/{phase.tasks.length} complete
          </span>
        </div>
        <Progress
          value={(completedCount / phase.tasks.length) * 100}
          className="h-2"
        />
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        {phase.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            completion={state.taskCompletions[task.id]}
            onUpdate={(update) => updateTask(task.id, update)}
          />
        ))}
      </div>

      {/* Bottom nav */}
      <Button
        variant="outline"
        onClick={onBack}
        className="w-full"
      >
        Back to Overview
      </Button>
    </div>
  );
}

// ── Individual Task Card ──

interface TaskCardProps {
  task: BrandTask;
  completion: ReturnType<typeof useBrandManager>["state"]["taskCompletions"][string] | undefined;
  onUpdate: (update: Partial<{
    completed: boolean;
    textValue: string;
    selectedOption: string;
  }>) => void;
}

function TaskCard({ task, completion, onUpdate }: TaskCardProps) {
  const isCompleted = completion?.completed ?? false;

  const handleTextBlur = useCallback(
    (value: string) => {
      onUpdate({
        textValue: value,
        completed: value.trim().length > 0,
      });
    },
    [onUpdate]
  );

  const handleChoiceSelect = useCallback(
    (option: string) => {
      onUpdate({
        selectedOption: option,
        completed: true,
      });
    },
    [onUpdate]
  );

  const handleCheckboxToggle = useCallback(
    (checked: boolean) => {
      onUpdate({ completed: checked });
    },
    [onUpdate]
  );

  return (
    <Card
      className={`bg-white border transition-all duration-300 ${
        isCompleted ? "border-green-200 bg-green-50/30" : "border-gray-200"
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-2">
          <div
            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
              isCompleted ? "bg-green-400" : "bg-gray-300"
            }`}
          />
          <div className="flex-1">
            <h4 className="font-bold text-[#0B1D3A] text-sm">{task.title}</h4>
            <p className="text-sm text-[#4A5568] mt-1">{task.description}</p>
          </div>
        </div>

        {/* Task type-specific UI */}
        <div className="ml-5 mt-3">
          {task.type === "checkbox" && (
            <div className="flex items-center gap-3">
              <Checkbox
                id={task.id}
                checked={isCompleted}
                onCheckedChange={(checked) =>
                  handleCheckboxToggle(checked === true)
                }
              />
              <label
                htmlFor={task.id}
                className="text-sm text-[#4A5568] cursor-pointer"
              >
                I've done this
              </label>
            </div>
          )}

          {task.type === "fill-in" && (
            <div className="space-y-2">
              {task.prompt && (
                <p className="text-xs text-[#8A95A8] font-medium">
                  {task.prompt}
                </p>
              )}
              <Textarea
                placeholder={task.placeholder}
                defaultValue={completion?.textValue ?? ""}
                onBlur={(e) => handleTextBlur(e.target.value)}
                className="min-h-[80px] text-sm"
              />
            </div>
          )}

          {task.type === "choice" && task.options && (
            <div className="flex flex-wrap gap-2">
              {task.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleChoiceSelect(option)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                    completion?.selectedOption === option
                      ? "bg-[#60A5FA] text-white border-[#60A5FA]"
                      : "bg-white text-[#4A5568] border-gray-200 hover:border-[#60A5FA] hover:text-[#60A5FA]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {task.type === "template" && task.templateContent && (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <pre className="text-sm text-[#4A5568] whitespace-pre-wrap font-sans leading-relaxed">
                  {task.templateContent}
                </pre>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id={task.id}
                  checked={isCompleted}
                  onCheckedChange={(checked) =>
                    handleCheckboxToggle(checked === true)
                  }
                />
                <label
                  htmlFor={task.id}
                  className="text-sm text-[#4A5568] cursor-pointer"
                >
                  I've done this
                </label>
              </div>
            </div>
          )}

          {/* Hint */}
          {task.hint && (
            <p className="text-xs text-[#8A95A8] mt-3 leading-relaxed">
              {task.hint}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
