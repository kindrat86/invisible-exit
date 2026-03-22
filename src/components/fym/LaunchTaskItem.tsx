import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Clock, Lightbulb } from "lucide-react";
import type { LaunchTask } from "@/types/fym";

interface LaunchTaskItemProps {
  task: LaunchTask;
  checked: boolean;
  onToggle: (taskId: string) => void;
}

export default function LaunchTaskItem({
  task,
  checked,
  onToggle,
}: LaunchTaskItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-lg border transition-all duration-200 ${
        checked
          ? "border-gray-100 bg-gray-50/50"
          : "border-gray-200/80 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-3 p-3.5">
        <div className="pt-0.5">
          <Checkbox
            checked={checked}
            onCheckedChange={() => onToggle(task.id)}
            className="h-5 w-5 transition-transform duration-200 data-[state=checked]:scale-110 data-[state=checked]:bg-[#60A5FA] data-[state=checked]:border-[#60A5FA]"
          />
        </div>

        <div className="flex-1 min-w-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 w-full text-left"
          >
            <span
              className={`text-sm font-medium transition-all duration-200 ${
                checked
                  ? "line-through text-gray-400"
                  : "text-[#0B1D3A]"
              }`}
            >
              {task.title}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-gray-400 shrink-0 transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {expanded && (
            <div className="mt-2.5 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <p className="text-sm text-gray-600 leading-relaxed">
                {task.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {task.estimatedMinutes > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
                    <Clock className="h-3 w-3" />~{task.estimatedMinutes} min
                  </span>
                )}
              </div>

              <div className="flex items-start gap-2 bg-amber-50/60 border border-amber-100 rounded-md px-3 py-2">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  {task.tip}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
