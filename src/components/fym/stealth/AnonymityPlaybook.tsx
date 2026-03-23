import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Clock, DollarSign, RotateCcw, Wrench } from "lucide-react";
import { PLAYBOOK_MISSIONS } from "@/data/anonymity-playbook";
import { usePlaybookProgress } from "@/hooks/usePlaybookProgress";
import type { PlaybookCategory, PlaybookDifficulty } from "@/types/stealth";

const CATEGORIES: PlaybookCategory[] = [
  "Digital Identity",
  "Entity Setup",
  "Financial Separation",
  "Communication",
  "Operational Security",
];

const DIFFICULTIES: PlaybookDifficulty[] = ["Beginner", "Intermediate", "Advanced"];

function getDifficultyBadgeClasses(d: PlaybookDifficulty): string {
  switch (d) {
    case "Beginner":
      return "bg-green-100 text-green-800";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800";
    case "Advanced":
      return "bg-red-100 text-red-800";
  }
}

export default function AnonymityPlaybook({ userId }: { userId: string }) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [expandedMission, setExpandedMission] = useState<string | null>(null);
  const { isStepCompleted, toggleStep, getMissionProgress, resetMission } =
    usePlaybookProgress(userId);

  const filtered = useMemo(() => {
    let result = PLAYBOOK_MISSIONS;
    if (categoryFilter !== "all") result = result.filter((m) => m.category === categoryFilter);
    if (difficultyFilter !== "all") result = result.filter((m) => m.difficulty === difficultyFilter);
    return result;
  }, [categoryFilter, difficultyFilter]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            {DIFFICULTIES.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-sm text-[#8A95A8] flex items-center ml-auto">
          {filtered.length} mission{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Mission Cards */}
      <div className="space-y-4">
        {filtered.map((mission) => {
          const { completed, total } = getMissionProgress(mission.id, mission.steps.length);
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
          const isExpanded = expandedMission === mission.id;

          return (
            <Collapsible
              key={mission.id}
              open={isExpanded}
              onOpenChange={(open) => setExpandedMission(open ? mission.id : null)}
            >
              <Card className="bg-white border border-gray-200 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <CardContent className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-2 flex-wrap mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {mission.category}
                          </Badge>
                          <Badge className={`text-xs ${getDifficultyBadgeClasses(mission.difficulty)}`}>
                            {mission.difficulty}
                          </Badge>
                          {pct === 100 && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Completed
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-bold text-[#0B1D3A] text-sm mb-1">{mission.title}</h3>
                        <p className="text-sm text-[#4A5568] line-clamp-2 mb-3">{mission.description}</p>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#8A95A8]">
                              {completed} of {total} steps completed
                            </span>
                            <span className="text-[#0B1D3A] font-medium">{pct}%</span>
                          </div>
                          <Progress value={pct} className="h-2" />
                        </div>

                        <div className="flex gap-3 mt-3 text-xs text-[#8A95A8]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {mission.estimated_time}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {mission.cost_estimate}
                          </span>
                        </div>
                      </div>

                      <ChevronDown
                        className={`h-5 w-5 text-[#8A95A8] flex-shrink-0 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardContent>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="border-t border-gray-100 px-5 pb-5">
                    {/* Tools needed */}
                    {mission.tools_needed.length > 0 && (
                      <div className="pt-4 pb-3">
                        <p className="text-xs text-[#8A95A8] uppercase mb-2 flex items-center gap-1">
                          <Wrench className="h-3 w-3" />
                          Tools Needed
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {mission.tools_needed.map((tool) => (
                            <Badge key={tool} variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Steps */}
                    <div className="space-y-3 pt-2">
                      {mission.steps.map((step, i) => {
                        const checked = isStepCompleted(mission.id, step.id);
                        return (
                          <div
                            key={step.id}
                            className={`p-4 rounded-lg border transition-colors ${
                              checked
                                ? "bg-green-50/50 border-green-200"
                                : "bg-gray-50 border-gray-100"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id={step.id}
                                checked={checked}
                                onCheckedChange={() => toggleStep(mission.id, step.id)}
                                className="mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <label
                                  htmlFor={step.id}
                                  className={`text-sm font-medium cursor-pointer ${
                                    checked ? "text-green-700 line-through" : "text-[#0B1D3A]"
                                  }`}
                                >
                                  {i + 1}. {step.title}
                                </label>
                                <p className="text-xs text-[#4A5568] mt-1">{step.description}</p>

                                <div className="flex gap-3 mt-2 text-xs text-[#8A95A8] flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {step.estimated_time}
                                  </span>
                                  {step.cost && (
                                    <span className="flex items-center gap-1">
                                      <DollarSign className="h-3 w-3" />
                                      {step.cost}
                                    </span>
                                  )}
                                </div>

                                {step.tools && step.tools.length > 0 && (
                                  <div className="flex gap-1 mt-2 flex-wrap">
                                    {step.tools.map((t) => (
                                      <Badge key={t} variant="outline" className="text-[10px]">
                                        {t}
                                      </Badge>
                                    ))}
                                  </div>
                                )}

                                {step.tip && (
                                  <p className="text-xs text-[#60A5FA] mt-2 italic">
                                    Tip: {step.tip}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reset */}
                    {completed > 0 && (
                      <div className="pt-3 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetMission(mission.id)}
                          className="text-xs text-[#8A95A8]"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Reset Progress
                        </Button>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#4A5568] text-lg font-medium mb-2">No missions match your filters.</p>
          <p className="text-[#8A95A8]">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
