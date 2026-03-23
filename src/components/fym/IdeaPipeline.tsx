import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Rocket,
  Plus,
  ArrowLeft,
  Check,
  X,
  ChevronDown,
  Search,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import ProgressRing from "@/components/fym/ProgressRing";
import ContextualUpgradeCard from "@/components/fym/ContextualUpgradeCard";
import {
  PIPELINE_QUESTIONS,
  PIPELINE_CATEGORIES,
} from "@/lib/pipeline-questions";
import { ACTION_PLAN_TASKS, ACTION_PLAN_PHASES } from "@/lib/pipeline-action-plan";
import {
  usePipelineHistory,
  useSavePipelineEntry,
  useUpdateActionPlan,
} from "@/hooks/useIdeaPipeline";
import { allIdeas } from "@/data/idea-generator";
import type { PipelineEntry, PipelineVerdict, DecisionNode, IdeaEntry } from "@/types/fym";

interface IdeaPipelineProps {
  userId: string;
  onSwitchTab?: (tab: string) => void;
  pendingIdea?: IdeaEntry | null;
  onClearPendingIdea?: () => void;
  hasFullAccess?: boolean;
}

type View = "history" | "wizard" | "results";

// -- Scoring --

function computeScores(answers: Record<string, boolean>) {
  const categoryScores: Record<string, number> = {};
  let total = 0;

  for (const cat of PIPELINE_CATEGORIES) {
    const catQuestions = PIPELINE_QUESTIONS.filter((q) => q.category === cat.key);
    let catScore = 0;
    for (const q of catQuestions) {
      if (answers[q.id]) catScore += q.yesScore;
    }
    categoryScores[cat.key] = catScore;
    total += catScore;
  }

  return { total, categoryScores };
}

function computeVerdict(
  total: number,
  categoryScores: Record<string, number>,
  answers: Record<string, boolean>
): { verdict: PipelineVerdict; nodes: DecisionNode[] } {
  const nodes: DecisionNode[] = [];
  let dominated = false;

  const criticalQs = PIPELINE_QUESTIONS.filter((q) => q.impact === "Critical");
  const criticalYes = criticalQs.filter((q) => answers[q.id]).length;
  const gate1Pass = criticalYes / criticalQs.length >= 0.5;
  nodes.push({
    label: "Critical Questions",
    passed: gate1Pass,
    reason: gate1Pass
      ? `${criticalYes}/${criticalQs.length} critical signals confirmed`
      : `Only ${criticalYes}/${criticalQs.length} critical signals -- too many unknowns`,
  });
  if (!gate1Pass) dominated = true;

  const weakCategories: string[] = [];
  for (const cat of PIPELINE_CATEGORIES) {
    if (categoryScores[cat.key] / cat.maxScore < 0.25) {
      weakCategories.push(cat.label);
    }
  }
  const gate2Pass = weakCategories.length === 0;
  nodes.push({
    label: "Category Balance",
    passed: gate2Pass,
    reason: gate2Pass
      ? "No critically weak category -- balanced opportunity"
      : `Dangerously weak in: ${weakCategories.join(", ")}`,
  });
  if (!gate2Pass) dominated = true;

  const demandScore = (categoryScores.market ?? 0) + (categoryScores.revenue ?? 0);
  const gate3Pass = demandScore >= 20;
  nodes.push({
    label: "Demand Validation",
    passed: gate3Pass,
    reason: gate3Pass
      ? `Market + Revenue score ${demandScore}/40 -- strong demand signal`
      : `Market + Revenue score ${demandScore}/40 -- demand not proven`,
  });

  const gate4Pass = (categoryScores.build ?? 0) >= 10;
  nodes.push({
    label: "Weekend Buildable",
    passed: gate4Pass,
    reason: gate4Pass
      ? `Build score ${categoryScores.build}/20 -- feasible as a side project`
      : `Build score ${categoryScores.build}/20 -- too complex for a weekend build`,
  });

  const gate5Pass = (categoryScores.invisibility ?? 0) >= 10;
  nodes.push({
    label: "Invisibility Safe",
    passed: gate5Pass,
    reason: gate5Pass
      ? `Invisibility score ${categoryScores.invisibility}/20 -- can run stealth`
      : `Invisibility score ${categoryScores.invisibility}/20 -- exposure risk too high`,
  });

  const passedGates = nodes.filter((n) => n.passed).length;
  let verdict: PipelineVerdict;

  if (dominated || total < 40) {
    verdict = "NO_GO";
  } else if (total >= 70 && passedGates >= 4) {
    verdict = "GO";
  } else if (total >= 50 && passedGates >= 3) {
    verdict = "CONDITIONAL_GO";
  } else {
    verdict = "NO_GO";
  }

  return { verdict, nodes };
}

function generateInsights(answers: Record<string, boolean>) {
  const strengths: string[] = [];
  const redFlags: string[] = [];

  for (const q of PIPELINE_QUESTIONS) {
    if (answers[q.id]) {
      strengths.push(q.positiveImplication);
    } else if (q.impact === "Critical") {
      redFlags.push(q.negativeImplication);
    }
  }

  return { strengths: strengths.slice(0, 8), redFlags: redFlags.slice(0, 6) };
}

// -- Helpers --

function getVerdictColor(verdict: PipelineVerdict) {
  if (verdict === "GO") return "#4ADE80";
  if (verdict === "CONDITIONAL_GO") return "#FBBF24";
  return "#F87171";
}

function getVerdictLabel(verdict: PipelineVerdict) {
  if (verdict === "GO") return "GO";
  if (verdict === "CONDITIONAL_GO") return "CONDITIONAL GO";
  return "NO-GO";
}

function getVerdictSummary(verdict: PipelineVerdict) {
  if (verdict === "GO")
    return "This idea passes all critical gates. Commit your weekend -- build it.";
  if (verdict === "CONDITIONAL_GO")
    return "Promising but with gaps. Address the red flags below before committing.";
  return "Too many critical gaps. Save your weekend and pick a stronger idea.";
}

function getScoreColor(score: number) {
  if (score >= 70) return "#4ADE80";
  if (score >= 50) return "#FBBF24";
  return "#F87171";
}

// -- Component --

export default function IdeaPipeline({
  userId,
  pendingIdea,
  onClearPendingIdea,
  onSwitchTab,
  hasFullAccess = true,
}: IdeaPipelineProps) {
  const { data: history = [], isLoading } = usePipelineHistory(userId);
  const saveMutation = useSavePipelineEntry(userId);
  const updateActionPlan = useUpdateActionPlan(userId);

  const completedValidations = history.filter(
    (entry) => entry.verdict !== null
  ).length;
  const starterValidationLimit = 3;
  const canValidate = hasFullAccess || completedValidations < starterValidationLimit;

  const [view, setView] = useState<View>(() => (pendingIdea ? "wizard" : "history"));
  const [viewingEntry, setViewingEntry] = useState<PipelineEntry | null>(null);

  // Wizard state
  const [ideaName, setIdeaName] = useState(() => pendingIdea?.title ?? "");
  const [ideaDescription, setIdeaDescription] = useState(
    () => pendingIdea?.description ?? ""
  );
  const [sourceIdeaId, setSourceIdeaId] = useState<string | null>(
    () => pendingIdea?.id ?? null
  );
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showIdeaPicker, setShowIdeaPicker] = useState(false);
  const [ideaSearch, setIdeaSearch] = useState("");

  // Action plan checkbox state for results view
  const [actionChecked, setActionChecked] = useState<Record<string, boolean>>({});

  const categoryQuestions = useMemo(() => {
    return PIPELINE_CATEGORIES.map((cat) => ({
      ...cat,
      questions: PIPELINE_QUESTIONS.filter((q) => q.category === cat.key),
    }));
  }, []);

  const scores = useMemo(() => computeScores(answers), [answers]);

  const handleToggle = useCallback((questionId: string, checked: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: checked }));
  }, []);

  const startNewValidation = useCallback(
    (idea?: IdeaEntry) => {
      // Check if starter can validate
      if (!canValidate) {
        // Show Moment 5 instead
        setView("history");
        return;
      }
      setIdeaName(idea?.title ?? "");
      setIdeaDescription(idea?.description ?? "");
      setSourceIdeaId(idea?.id ?? null);
      setAnswers({});
      setCurrentStep(0);
      setActionChecked({});
      setViewingEntry(null);
      setView("wizard");
    },
    [canValidate]
  );

  // Auto-start if pending idea
  const [pendingHandled, setPendingHandled] = useState(false);
  if (pendingIdea && !pendingHandled) {
    setPendingHandled(true);
    startNewValidation(pendingIdea);
    onClearPendingIdea?.();
  }

  const handleSave = async () => {
    const { total, categoryScores } = scores;
    const { verdict, nodes } = computeVerdict(total, categoryScores, answers);
    const { strengths, redFlags } = generateInsights(answers);

    const payload = {
      idea_name: ideaName,
      idea_description: ideaDescription,
      source_idea_id: sourceIdeaId,
      total_score: total,
      market_score: categoryScores.market ?? 0,
      revenue_score: categoryScores.revenue ?? 0,
      build_score: categoryScores.build ?? 0,
      invisibility_score: categoryScores.invisibility ?? 0,
      moat_score: categoryScores.moat ?? 0,
      verdict,
      answers,
      action_plan_checked: {},
      strengths,
      red_flags: redFlags,
      decision_nodes: nodes,
    };

    try {
      const saved = await saveMutation.mutateAsync(payload);
      toast.success(`Idea validated: ${getVerdictLabel(verdict)}`);
      setViewingEntry(saved);
      setActionChecked({});
      setView("results");
    } catch {
      toast.error(
        "Failed to save. The idea_pipeline table may need to be created in Supabase."
      );
    }
  };

  const handleActionToggle = useCallback(
    (taskId: string, checked: boolean) => {
      setActionChecked((prev) => {
        const next = { ...prev, [taskId]: checked };
        if (viewingEntry) {
          updateActionPlan.mutate({
            entryId: viewingEntry.id,
            actionPlanChecked: next,
          });
        }
        return next;
      });
    },
    [viewingEntry, updateActionPlan]
  );

  const openEntryResults = useCallback((entry: PipelineEntry) => {
    setViewingEntry(entry);
    setActionChecked(entry.action_plan_checked ?? {});
    setView("results");
  }, []);

  const filteredIdeas = useMemo(() => {
    if (!ideaSearch) return allIdeas.slice(0, 20);
    const q = ideaSearch.toLowerCase();
    return allIdeas
      .filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 20);
  }, [ideaSearch]);

  // Get latest completed validation for Moment 5
  const latestCompleted = history.find((e) => e.verdict !== null);

  // -- HISTORY VIEW --
  if (view === "history") {
    // If starter can't validate and tries to start new: show Moment 5
    const showLimitCard = !canValidate;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0B1D3A]">Idea Pipeline</h2>
            <p className="text-sm text-[#8A95A8] mt-1">
              Validate ideas in 48 hours. No wasted weekends.
            </p>
          </div>
          <Button
            onClick={() => {
              if (!canValidate) {
                // Will show moment 5 card below
                return;
              }
              startNewValidation();
            }}
            className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white"
            disabled={showLimitCard}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Validation
          </Button>
        </div>

        {/* Moment 5: Pipeline limit reached */}
        {showLimitCard && latestCompleted && (
          <ContextualUpgradeCard
            momentId="pipeline-limit"
            dynamicValues={{
              previousIdeaName: latestCompleted.idea_name,
              previousScore: latestCompleted.total_score,
            }}
          />
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : history.length === 0 ? (
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <Rocket className="h-12 w-12 text-[#8A95A8] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#0B1D3A] mb-2">
                No ideas validated yet
              </h3>
              <p className="text-[#4A5568] mb-6 max-w-md mx-auto">
                Run your first idea through the 48-hour validation framework.
                Get a clear GO or NO-GO before you waste a weekend building.
              </p>
              <Button
                onClick={() => startNewValidation()}
                className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Validate Your First Idea
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <Card
                key={entry.id}
                className="bg-white border border-gray-200 cursor-pointer hover:translate-y-[-1px] hover:shadow-md transition-all duration-300"
                onClick={() => openEntryResults(entry)}
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#0B1D3A] text-sm truncate">
                      {entry.idea_name}
                    </h3>
                    <p className="text-xs text-[#8A95A8] mt-1">
                      {new Date(entry.created_at).toLocaleDateString()} -- Score:{" "}
                      {entry.total_score}/100
                    </p>
                  </div>
                  <Badge
                    className="ml-4 flex-shrink-0 font-bold text-xs"
                    style={{
                      backgroundColor: `${getVerdictColor(entry.verdict)}20`,
                      color: getVerdictColor(entry.verdict),
                      borderColor: getVerdictColor(entry.verdict),
                    }}
                  >
                    {getVerdictLabel(entry.verdict)}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // -- WIZARD VIEW --
  if (view === "wizard") {
    const isInputStep = currentStep === 0;
    const currentCategory = !isInputStep ? categoryQuestions[currentStep - 1] : null;
    const totalSteps = PIPELINE_CATEGORIES.length + 1;

    return (
      <div className="space-y-6">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#8A95A8] -ml-2"
              onClick={() => {
                setView("history");
                onClearPendingIdea?.();
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Pipeline
            </Button>
            <span className="text-[#8A95A8]">
              {isInputStep
                ? "Step 1 -- Describe Your Idea"
                : `Step ${currentStep + 1} of ${totalSteps} -- ${currentCategory?.label}`}
            </span>
          </div>
          <Progress
            value={(currentStep / (totalSteps - 1)) * 100}
            className="h-2"
          />
        </div>

        {/* Input Step */}
        {isInputStep && (
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-[#0B1D3A]">
                What idea do you want to validate?
              </CardTitle>
              <p className="text-sm text-[#8A95A8]">
                Enter details manually or pick from the Idea Directory.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#4A5568] block mb-1">
                  Idea Name
                </label>
                <Input
                  placeholder="e.g., AI Receipt Scanner for Freelancers"
                  value={ideaName}
                  onChange={(e) => setIdeaName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#4A5568] block mb-1">
                  Short Description
                </label>
                <Input
                  placeholder="e.g., Scans receipts and auto-categorizes expenses for tax prep"
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs text-[#8A95A8]">or</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowIdeaPicker(true)}
                >
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Pick from Idea Directory
                </Button>
                {sourceIdeaId && (
                  <Badge variant="secondary" className="text-xs">
                    Linked to directory idea
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Questions */}
        {currentCategory && (
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-[#0B1D3A]">
                {currentCategory.label}
              </CardTitle>
              <p className="text-sm text-[#8A95A8]">
                Max {currentCategory.maxScore} points -- Score so far:{" "}
                {scores.categoryScores[currentCategory.key] ?? 0}/
                {currentCategory.maxScore}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentCategory.questions.map((q) => (
                <div
                  key={q.id}
                  className="flex items-start justify-between gap-4"
                >
                  <label htmlFor={q.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm text-[#4A5568]">{q.text}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] flex-shrink-0 ${
                          q.impact === "Critical"
                            ? "border-red-300 text-red-600"
                            : q.impact === "Important"
                              ? "border-amber-300 text-amber-600"
                              : "border-gray-300 text-gray-500"
                        }`}
                      >
                        {q.impact}
                      </Badge>
                    </div>
                    <span className="block text-xs text-[#8A95A8] mt-0.5">
                      {q.hint}
                    </span>
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
          {currentStep < PIPELINE_CATEGORIES.length ? (
            <Button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={isInputStep && (!ideaName.trim() || !ideaDescription.trim())}
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
              {saveMutation.isPending ? "Saving..." : "Get Verdict"}
            </Button>
          )}
        </div>

        {/* Idea Picker Dialog */}
        <Dialog open={showIdeaPicker} onOpenChange={setShowIdeaPicker}>
          <DialogContent className="sm:max-w-lg max-h-[70vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pick from Idea Directory</DialogTitle>
            </DialogHeader>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A95A8]" />
              <Input
                placeholder="Search ideas..."
                value={ideaSearch}
                onChange={(e) => setIdeaSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="space-y-2">
              {filteredIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="p-3 rounded-lg border border-gray-100 hover:border-[#60A5FA] hover:bg-blue-50/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setIdeaName(idea.title);
                    setIdeaDescription(idea.description);
                    setSourceIdeaId(idea.id);
                    setShowIdeaPicker(false);
                    setIdeaSearch("");
                  }}
                >
                  <p className="font-medium text-sm text-[#0B1D3A]">
                    {idea.title}
                  </p>
                  <p className="text-xs text-[#8A95A8] line-clamp-1 mt-0.5">
                    {idea.description}
                  </p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // -- RESULTS VIEW --
  const entry = viewingEntry;
  if (!entry) return null;

  const verdictColor = getVerdictColor(entry.verdict);
  const checkedCount = ACTION_PLAN_TASKS.filter(
    (t) => actionChecked[t.id]
  ).length;

  const isGoVerdict = entry.verdict === "GO" || entry.verdict === "CONDITIONAL_GO";

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="text-[#8A95A8] -ml-2"
        onClick={() => setView("history")}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Pipeline
      </Button>

      {/* Score + Verdict */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-8 flex flex-col items-center">
          <div className="relative">
            <ProgressRing
              value={entry.total_score}
              size={160}
              strokeWidth={10}
              color={getScoreColor(entry.total_score)}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[#0B1D3A]">
                {entry.total_score}
              </span>
              <span className="text-xs text-[#8A95A8]">/100</span>
            </div>
          </div>
          <Badge
            className="mt-4 text-base font-bold px-4 py-1.5"
            style={{
              backgroundColor: `${verdictColor}20`,
              color: verdictColor,
              borderColor: verdictColor,
            }}
          >
            {getVerdictLabel(entry.verdict)}
          </Badge>
          <p className="text-sm text-[#4A5568] mt-3 text-center max-w-md">
            {getVerdictSummary(entry.verdict)}
          </p>
          <div className="mt-4 text-center">
            <h3 className="font-bold text-[#0B1D3A]">{entry.idea_name}</h3>
            <p className="text-xs text-[#8A95A8] mt-1">
              Validated {new Date(entry.created_at).toLocaleDateString()}
            </p>
          </div>
          {/* Retake button: hidden for starters */}
          {hasFullAccess && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                const idea = sourceIdeaId
                  ? allIdeas.find((i) => i.id === entry.source_idea_id)
                  : undefined;
                startNewValidation(
                  idea ?? ({
                    id: "",
                    title: entry.idea_name,
                    description: entry.idea_description,
                  } as IdeaEntry)
                );
              }}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Retake
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-sm text-[#8A95A8] font-medium uppercase tracking-wide">
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {PIPELINE_CATEGORIES.map((cat) => {
            const catScore =
              entry[`${cat.key}_score` as keyof PipelineEntry] as number;
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

      {/* Decision Tree */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-sm text-[#8A95A8] font-medium uppercase tracking-wide">
            Decision Gates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {entry.decision_nodes.map((node, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${
                node.passed
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-2">
                {node.passed ? (
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                )}
                <span
                  className={`text-sm font-medium ${
                    node.passed ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {node.label}
                </span>
              </div>
              <p
                className={`text-xs mt-1 ml-6 ${
                  node.passed ? "text-green-700" : "text-red-700"
                }`}
              >
                {node.reason}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strengths */}
      {entry.strengths.length > 0 && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-sm text-[#8A95A8] font-medium uppercase tracking-wide">
              Strengths ({entry.strengths.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {entry.strengths.map((s, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-green-100 bg-green-50 flex items-start gap-2"
              >
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-green-800">{s}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Red Flags */}
      {entry.red_flags.length > 0 && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-sm text-[#8A95A8] font-medium uppercase tracking-wide">
              Red Flags ({entry.red_flags.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {entry.red_flags.map((f, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-red-100 bg-red-50 flex items-start gap-2"
              >
                <X className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-800">{f}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 48-Hour Action Plan: Full for founding, contextual upgrade for starters */}
      {!hasFullAccess ? (
        <>
          {/* Moment 4: Contextual upgrade for starters after validation */}
          <ContextualUpgradeCard
            momentId={isGoVerdict ? "pipeline-go" : "pipeline-nogo"}
            dynamicValues={{
              score: entry.total_score,
              verdict: getVerdictLabel(entry.verdict),
            }}
          />

          {/* Blurred action plan preview for GO/CONDITIONAL GO */}
          {isGoVerdict && (
            <div className="relative rounded-lg border overflow-hidden">
              <div className="filter blur-[6px] pointer-events-none select-none opacity-60 p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border" />
                    <span className="text-sm">Research 3 competitor products in your niche</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border bg-green-500" />
                    <span className="text-sm line-through text-muted-foreground">Set up landing page with value proposition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border" />
                    <span className="text-sm">Write 3 Reddit posts for target subreddits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border" />
                    <span className="text-sm">Configure Stripe for $0.97 test pricing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border" />
                    <span className="text-sm">Launch micro-test and collect 10 signups</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        // Full action plan for founding users
        entry.verdict !== "NO_GO" && (
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm text-[#8A95A8] font-medium uppercase tracking-wide">
                48-Hour Action Plan ({checkedCount}/{ACTION_PLAN_TASKS.length}{" "}
                completed)
              </CardTitle>
              <Progress
                value={(checkedCount / ACTION_PLAN_TASKS.length) * 100}
                className="h-2 mt-2"
              />
            </CardHeader>
            <CardContent className="space-y-4">
              {ACTION_PLAN_PHASES.map((phase) => {
                const phaseTasks = ACTION_PLAN_TASKS.filter(
                  (t) => t.phase === phase.key
                );
                return (
                  <Collapsible key={phase.key} defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                      <span className="text-sm font-medium text-[#0B1D3A]">
                        {phase.label}
                      </span>
                      <ChevronDown className="h-4 w-4 text-[#8A95A8]" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2">
                      {phaseTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-3 p-2"
                        >
                          <Checkbox
                            id={task.id}
                            checked={actionChecked[task.id] ?? false}
                            onCheckedChange={(checked) =>
                              handleActionToggle(task.id, checked === true)
                            }
                          />
                          <label
                            htmlFor={task.id}
                            className={`text-sm cursor-pointer ${
                              actionChecked[task.id]
                                ? "text-[#8A95A8] line-through"
                                : "text-[#4A5568]"
                            }`}
                          >
                            {task.text}
                          </label>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
