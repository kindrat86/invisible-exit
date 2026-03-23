import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Shield, AlertTriangle, Clock, ChevronRight } from "lucide-react";
import ProgressRing from "@/components/fym/ProgressRing";
import { PLAYBOOK_MISSIONS } from "@/data/anonymity-playbook";
import { usePlaybookProgress } from "@/hooks/usePlaybookProgress";

interface StealthScoreViewProps {
  userId: string;
  onOpenSubTab: (tab: string) => void;
}

function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 86) return { label: "STEALTH MODE", color: "#22C55E" };
  if (score >= 61) return { label: "LOW RISK", color: "#60A5FA" };
  if (score >= 31) return { label: "MODERATE RISK", color: "#FBBF24" };
  return { label: "HIGH RISK", color: "#F87171" };
}

export default function StealthScoreView({
  userId,
  onOpenSubTab,
}: StealthScoreViewProps) {
  const { isStepCompleted, toggleStep, getMissionProgress } =
    usePlaybookProgress(userId);

  // Calculate stealth score from completed playbook steps
  const { score, topActions } = useMemo(() => {
    let totalSteps = 0;
    let completedSteps = 0;

    const incompleteActions: Array<{
      missionId: string;
      stepId: string;
      title: string;
      why: string;
      time: string;
      cost: string;
      points: number;
    }> = [];

    for (const mission of PLAYBOOK_MISSIONS) {
      for (const step of mission.steps) {
        totalSteps++;
        if (isStepCompleted(mission.id, step.id)) {
          completedSteps++;
        } else {
          // Assign points based on step position (earlier = higher impact)
          const pointValue = Math.max(3, 10 - PLAYBOOK_MISSIONS.indexOf(mission));
          incompleteActions.push({
            missionId: mission.id,
            stepId: step.id,
            title: step.title,
            why: step.description.slice(0, 100) + (step.description.length > 100 ? "..." : ""),
            time: step.estimated_time,
            cost: step.cost || "Free",
            points: pointValue,
          });
        }
      }
    }

    const rawScore = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    const score = Math.min(100, rawScore);

    // Pick top 3 by points
    const topActions = incompleteActions
      .sort((a, b) => b.points - a.points)
      .slice(0, 3);

    return { score, topActions };
  }, [isStepCompleted]);

  const { label, color } = getScoreLabel(score);

  const subTabs = [
    {
      id: "templates",
      icon: FileText,
      title: "Legal Templates",
      description: "Browse contract templates, entity formation guides, IP protection docs.",
    },
    {
      id: "playbook",
      icon: Shield,
      title: "Anonymity Playbook",
      description: "Step-by-step missions to make your business invisible.",
    },
    {
      id: "compliance",
      icon: AlertTriangle,
      title: "Compliance Database",
      description: "Search employment contract clauses and what they mean for you.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stealth Score Header */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6">
        <div className="flex items-center gap-6">
          <div className="relative shrink-0">
            <ProgressRing value={score} size={100} strokeWidth={8} color={color} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#0B1D3A]">{score}</span>
              <span className="text-[8px] text-[#8A95A8]">/100</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0B1D3A]">Your Stealth Score</h2>
            <p className="text-sm font-semibold mt-1" style={{ color }}>
              {label}
            </p>
            <p className="text-xs text-[#4A5568] mt-1">
              Based on your completed anonymity actions.
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Actions */}
      {topActions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#0B1D3A] mb-3">
            3 Highest-Impact Actions This Week
          </h3>
          <div className="space-y-3">
            {topActions.map((action) => (
              <Card key={action.stepId} className="bg-white border border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      id={`stealth-${action.stepId}`}
                      checked={false}
                      onCheckedChange={() => toggleStep(action.missionId, action.stepId)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={`stealth-${action.stepId}`}
                        className="text-sm font-semibold text-[#0B1D3A] cursor-pointer"
                      >
                        {action.title}
                      </label>
                      <p className="text-xs text-[#4A5568] mt-1">{action.why}</p>
                      <div className="flex gap-4 mt-2 text-xs text-[#8A95A8]">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {action.time}
                        </span>
                        <span>{action.cost}</span>
                        <span className="text-[#60A5FA] font-medium">
                          +{action.points} points
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab links */}
      <div>
        <h3 className="text-sm font-semibold text-[#0B1D3A] mb-3">
          Deep Dive
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onOpenSubTab(tab.id)}
                className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:shadow-md hover:border-[#60A5FA]/30 transition-all group"
              >
                <Icon className="h-5 w-5 text-[#60A5FA] mb-2" />
                <h4 className="text-sm font-semibold text-[#0B1D3A] mb-1 group-hover:text-[#60A5FA] transition-colors">
                  {tab.title}
                </h4>
                <p className="text-xs text-[#4A5568]">{tab.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
