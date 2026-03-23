import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Rocket, Shield, List } from "lucide-react";
import { allIdeas } from "@/data/idea-generator";
import type { IdeaEntry } from "@/types/fym";

interface IdeaQuizProps {
  onValidateIdea?: (idea: IdeaEntry) => void;
  onSwitchTab?: (tab: string) => void;
  onBrowseAll: () => void;
}

const STEPS = [
  {
    question: "What industry are you in?",
    options: ["Healthcare", "Finance", "Technology", "Engineering", "Legal", "Other"],
  },
  {
    question: "How many hours per week can you commit?",
    options: ["2-3 hours", "4-6 hours", "7-10 hours", "10+"],
  },
  {
    question: "What's your technical comfort level?",
    options: ["No-Code Only", "Low-Code OK", "Can Write Prompts", "Developer"],
  },
  {
    question: "Do you want to serve your current industry or a different one?",
    options: ["My Industry", "Different Industry", "Either"],
  },
  {
    question: "What's your starting budget?",
    options: ["$0 - just time", "Under $500", "$500-$2,000", "$2,000+"],
  },
];

const TIME_MAP: Record<string, string[]> = {
  "2-3 hours": ["2-3 hrs/week"],
  "4-6 hours": ["2-3 hrs/week", "5-7 hrs/week"],
  "7-10 hours": ["5-7 hrs/week", "10-15 hrs/week"],
  "10+": ["10-15 hrs/week", "15+ hrs/week"],
};

const TECH_MAP: Record<string, string[]> = {
  "No-Code Only": ["No-Code"],
  "Low-Code OK": ["No-Code", "Low-Code"],
  "Can Write Prompts": ["No-Code", "Low-Code", "Some Coding"],
  "Developer": ["No-Code", "Low-Code", "Some Coding", "Developer Required"],
};

const BUDGET_MAP: Record<string, string[]> = {
  "$0 - just time": ["$0", "$0-$50", "$0-$100"],
  "Under $500": ["$0", "$0-$50", "$0-$100", "$100-$500"],
  "$500-$2,000": ["$0", "$0-$50", "$0-$100", "$100-$500", "$500-$2K"],
  "$2,000+": ["$0", "$0-$50", "$0-$100", "$100-$500", "$500-$2K", "$2K-$5K", "$2K+", "$5K+"],
};

function getWhyFits(idea: IdeaEntry, answers: string[]): string {
  const parts: string[] = [];
  if (idea.invisibility_score >= 8) parts.push("highly invisible");
  if (idea.time_investment.includes("2-3") || idea.time_investment.includes("5-7"))
    parts.push("fits your available time");
  if (idea.technical_difficulty === "No-Code") parts.push("no coding required");
  else if (idea.technical_difficulty === "Low-Code") parts.push("minimal technical setup");
  if (idea.startup_cost.includes("$0")) parts.push("zero startup cost");

  if (parts.length === 0) return `Matches your ${answers[0] || "industry"} background and skill level.`;
  return `${parts.join(", ").replace(/^./, (c) => c.toUpperCase())}. Matches your profile.`;
}

export default function IdeaQuiz({
  onValidateIdea,
  onSwitchTab,
  onBrowseAll,
}: IdeaQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = answer;
    setAnswers(newAnswers);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowResults(true);
    }
  };

  const recommendations = useMemo(() => {
    if (!showResults) return [];

    let pool = [...allIdeas];

    // Filter by industry (step 0)
    const industry = answers[0];
    if (industry && industry !== "Other") {
      const industryPool = pool.filter((i) => i.industry === industry);
      if (industryPool.length >= 3) pool = industryPool;
    }

    // Filter by time (step 1)
    const timeAnsw = answers[1];
    if (timeAnsw && TIME_MAP[timeAnsw]) {
      const filtered = pool.filter((i) => TIME_MAP[timeAnsw].includes(i.time_investment));
      if (filtered.length >= 3) pool = filtered;
    }

    // Filter by tech level (step 2)
    const techAnsw = answers[2];
    if (techAnsw && TECH_MAP[techAnsw]) {
      const filtered = pool.filter((i) => TECH_MAP[techAnsw].includes(i.technical_difficulty));
      if (filtered.length >= 3) pool = filtered;
    }

    // Filter by budget (step 4)
    const budgetAnsw = answers[4];
    if (budgetAnsw && BUDGET_MAP[budgetAnsw]) {
      const filtered = pool.filter((i) => BUDGET_MAP[budgetAnsw].some((b) => i.startup_cost.includes(b)));
      if (filtered.length >= 3) pool = filtered;
    }

    // Sort by invisibility score (higher is better), then featured
    pool.sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return b.invisibility_score - a.invisibility_score;
    });

    return pool.slice(0, 3);
  }, [showResults, answers]);

  const retakeQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#0B1D3A] mb-1">Your Top 3 Ideas</h2>
          <p className="text-sm text-[#4A5568]">
            Based on your answers, these are your best matches.
          </p>
        </div>

        <div className="space-y-4">
          {recommendations.map((idea, idx) => (
            <div
              key={idea.id}
              className={`bg-white rounded-xl border p-6 transition-all duration-300 hover:shadow-md ${
                idx === 0 ? "border-[#60A5FA] ring-1 ring-[#60A5FA]/20" : "border-gray-200"
              }`}
            >
              {idx === 0 && (
                <Badge className="bg-[#60A5FA]/10 text-[#60A5FA] border-[#60A5FA]/20 mb-3">
                  Best Match
                </Badge>
              )}
              <h3 className="font-bold text-[#0B1D3A] text-base mb-2">
                {idea.title}
              </h3>
              <p className="text-sm text-[#4A5568] mb-3">{idea.description}</p>

              <div className="flex gap-2 flex-wrap mb-3">
                <div className="flex items-center gap-1 text-xs text-[#8A95A8]">
                  <Shield className="h-3 w-3" />
                  Invisibility: {idea.invisibility_score}/10
                </div>
                <Badge variant="outline" className="text-xs">{idea.revenue_tier}</Badge>
                <Badge variant="outline" className="text-xs">{idea.time_investment}</Badge>
              </div>

              <p className="text-xs text-[#60A5FA] italic mb-4">
                {getWhyFits(idea, answers)}
              </p>

              {onValidateIdea && (
                <Button
                  onClick={() => onValidateIdea(idea)}
                  className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white text-sm"
                  size="sm"
                >
                  <Rocket className="h-3.5 w-3.5 mr-1.5" />
                  Validate This Idea
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" size="sm" onClick={retakeQuiz}>
            Retake Quiz
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBrowseAll}
            className="text-[#60A5FA]"
          >
            <List className="h-4 w-4 mr-1.5" />
            Browse all ideas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#0B1D3A] mb-1">Find Your Idea</h2>
        <p className="text-sm text-[#4A5568]">
          5 quick questions. We'll match you with the best ideas for your situation.
        </p>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i < currentStep
                ? "bg-[#60A5FA]"
                : i === currentStep
                  ? "bg-[#60A5FA]/50"
                  : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-xs text-[#8A95A8] uppercase tracking-wider mb-2">
          Question {currentStep + 1} of {STEPS.length}
        </p>
        <h3 className="text-lg font-bold text-[#0B1D3A] mb-6">
          {STEPS[currentStep].question}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {STEPS[currentStep].options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                answers[currentStep] === option
                  ? "border-[#60A5FA] bg-[#60A5FA]/10 text-[#60A5FA]"
                  : "border-gray-200 text-[#4A5568] hover:border-[#60A5FA]/50 hover:bg-[#60A5FA]/5"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Back button */}
      {currentStep > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentStep((s) => s - 1)}
          className="text-[#8A95A8]"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      )}

      {/* Browse all link */}
      <div className="text-center">
        <button
          onClick={onBrowseAll}
          className="text-xs text-[#8A95A8] hover:text-[#60A5FA] transition-colors"
        >
          Skip quiz and browse all ideas
        </button>
      </div>
    </div>
  );
}
