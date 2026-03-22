import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ProgressRing from "@/components/fym/ProgressRing";
import ContextualUpgradeCard from "@/components/fym/ContextualUpgradeCard";
import {
  INVISIBILITY_QUESTIONS,
  CATEGORIES,
} from "@/lib/invisibility-questions";
import {
  useLatestInvisibilityScore,
  useSaveInvisibilityScore,
} from "@/hooks/useInvisibilityScore";

interface InvisibilityScoreProps {
  userId: string;
  hasFullAccess?: boolean;
}

export default function InvisibilityScore({ userId, hasFullAccess = true }: InvisibilityScoreProps) {
  const { data: latestScore } = useLatestInvisibilityScore(userId);
  const saveMutation = useSaveInvisibilityScore(userId);

  const [answers, setAnswers] = useState<Record<string, boolean>>(() => {
    if (latestScore?.answers && typeof latestScore.answers === "object") {
      return latestScore.answers as Record<string, boolean>;
    }
    return {};
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(() => !!latestScore);

  const categoryQuestions = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      questions: INVISIBILITY_QUESTIONS.filter((q) => q.category === cat.key),
    }));
  }, []);

  const scores = useMemo(() => {
    const categoryScores: Record<string, number> = {};
    let total = 0;

    for (const cat of CATEGORIES) {
      const catQuestions = INVISIBILITY_QUESTIONS.filter(
        (q) => q.category === cat.key
      );
      let catScore = 0;
      for (const q of catQuestions) {
        if (answers[q.id]) catScore += q.yesScore;
      }
      categoryScores[cat.key] = catScore;
      total += catScore;
    }

    return { total, categoryScores };
  }, [answers]);

  const fixes = useMemo(() => {
    return INVISIBILITY_QUESTIONS.filter((q) => !answers[q.id]).sort((a, b) => {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [answers]);

  const handleToggle = useCallback((questionId: string, checked: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: checked }));
  }, []);

  const handleSave = async () => {
    const payload = {
      total_score: scores.total,
      entity_score: scores.categoryScores.entity ?? 0,
      digital_score: scores.categoryScores.digital ?? 0,
      compliance_score: scores.categoryScores.compliance ?? 0,
      operational_score: scores.categoryScores.operational ?? 0,
      financial_score: scores.categoryScores.financial ?? 0,
      answers,
      fixes_count: fixes.length,
    };

    try {
      await saveMutation.mutateAsync(payload);
      toast.success(`Invisibility Score saved: ${scores.total}/100`);
      setShowResults(true);
    } catch {
      toast.error("Failed to save score. The invisibility_scores table may need to be created in Supabase.");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 86) return "#4ADE80";
    if (score >= 61) return "#4ADE80";
    if (score >= 31) return "#FBBF24";
    return "#F87171";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 86) return "STEALTH MODE";
    if (score >= 61) return "LOW RISK";
    if (score >= 31) return "MODERATE RISK";
    return "HIGH RISK";
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = INVISIBILITY_QUESTIONS.length;
  const currentCategory = categoryQuestions[currentStep];

  // Determine visible fixes based on tier
  const visibleFixes = hasFullAccess ? fixes : fixes.slice(0, 3);
  const remainingFixesCount = fixes.length - visibleFixes.length;

  // Results view
  if (showResults) {
    return (
      <div className="space-y-6">
        {/* Score gauge */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-8 flex flex-col items-center">
            <div className="relative">
              <ProgressRing
                value={scores.total}
                size={160}
                strokeWidth={10}
                color={getScoreColor(scores.total)}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#0B1D3A]">
                  {scores.total}
                </span>
                <span className="text-xs text-[#8A95A8]">/100</span>
              </div>
            </div>
            <p
              className="text-lg font-bold mt-4 uppercase tracking-wide"
              style={{ color: getScoreColor(scores.total) }}
            >
              {getScoreLabel(scores.total)}
            </p>
            {latestScore && (
              <p className="text-xs text-[#8A95A8] mt-2">
                Last checked:{" "}
                {new Date(latestScore.created_at).toLocaleDateString()}. Recheck
                monthly.
              </p>
            )}
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setShowResults(false);
                setCurrentStep(0);
              }}
            >
              Retake Assessment
            </Button>
          </CardContent>
        </Card>

        {/* Category breakdown */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-sm text-[#8A95A8] font-medium uppercase tracking-wide">
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {CATEGORIES.map((cat) => {
              const catScore = scores.categoryScores[cat.key] ?? 0;
              const pct = (catScore / cat.maxScore) * 100;
              return (
                <div key={cat.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#4A5568]">{cat.label}</span>
                    <span className="text-[#0B1D3A] font-medium">
                      {catScore}/{cat.maxScore}
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Fix cards */}
        {fixes.length > 0 && (
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm text-[#8A95A8] font-medium uppercase tracking-wide">
                Recommended Fixes ({fixes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {visibleFixes.map((fix) => (
                <div
                  key={fix.id}
                  className="p-4 rounded-lg border border-gray-100 bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-[#0B1D3A] text-sm">
                        Fix: {fix.fixTitle}
                      </p>
                      <p className="text-[#4A5568] text-sm mt-1">
                        {fix.fixDescription}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                        fix.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : fix.priority === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {fix.priority}
                    </span>
                  </div>
                </div>
              ))}

              {/* Starter: show remaining fixes upgrade card */}
              {!hasFullAccess && remainingFixesCount > 0 && (
                <div className="mt-4 rounded-lg border border-amber-200/50 bg-amber-50/30 dark:bg-amber-950/20 p-4">
                  <p className="text-sm font-medium">
                    + {remainingFixesCount} more recommendations identified.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Founding members get the full fix list with step-by-step
                    instructions, cost estimates, and legal templates for each.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Moment 2: Audit complete contextual upgrade (starters only) */}
        {!hasFullAccess && (
          <ContextualUpgradeCard
            momentId="audit-complete"
            dynamicValues={{
              score: scores.total,
              totalFixes: fixes.length,
            }}
          />
        )}
      </div>
    );
  }

  // Wizard view
  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#4A5568]">
            Step {currentStep + 1} of {CATEGORIES.length}
          </span>
          <span className="text-[#8A95A8]">
            Score: {scores.total}/100
          </span>
        </div>
        <Progress
          value={((currentStep + 1) / CATEGORIES.length) * 100}
          className="h-2"
        />
      </div>

      {/* Current category */}
      {currentCategory && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-[#0B1D3A]">
              {currentCategory.label}
            </CardTitle>
            <p className="text-sm text-[#8A95A8]">
              Max {currentCategory.maxScore} points
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentCategory.questions.map((q) => (
              <div
                key={q.id}
                className="flex items-start justify-between gap-4"
              >
                <label
                  htmlFor={q.id}
                  className="flex-1 cursor-pointer"
                >
                  <span className="text-sm text-[#4A5568]">{q.text}</span>
                  <span className="block text-xs text-[#8A95A8] mt-0.5">{q.hint}</span>
                </label>
                <Switch
                  id={q.id}
                  checked={answers[q.id] ?? false}
                  onCheckedChange={(checked) => handleToggle(q.id, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => s - 1)}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        {currentStep < CATEGORIES.length - 1 ? (
          <Button
            onClick={() => setCurrentStep((s) => s + 1)}
            className="bg-[#0B1D3A] hover:bg-[#132D5E] text-white"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white"
          >
            {saveMutation.isPending ? "Saving..." : "Save Score"}
          </Button>
        )}
      </div>
    </div>
  );
}
