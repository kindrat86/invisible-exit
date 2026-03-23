import { useState, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Shield, DollarSign, CheckCircle } from "lucide-react";

interface CoreStealthActionsProps {
  userId: string;
  onSwitchTab?: (tab: string) => void;
}

const CORE_ACTIONS = [
  {
    id: "core_email",
    title: "Set up a separate business email",
    why: "Your employer's IT team can see every email you send from work accounts. A separate Gmail or ProtonMail keeps business communication invisible.",
    time: "10 minutes",
    cost: "Free",
    stepSummary: "Create a new Gmail or ProtonMail account using your business name. Never access it from work devices.",
  },
  {
    id: "core_domain",
    title: "Register a domain with WHOIS privacy",
    why: "Without WHOIS privacy, anyone can look up your domain and see your real name, address, and phone number.",
    time: "15 minutes",
    cost: "$10-15/year",
    stepSummary: "Register via Namecheap or Cloudflare with WHOIS privacy enabled. Use your business name, not your personal name.",
  },
  {
    id: "core_bank",
    title: "Open a separate bank account or payment processor",
    why: "Mixing business and personal finances creates a paper trail your employer's legal team could follow.",
    time: "30 minutes",
    cost: "Free (Stripe/Wise) or $0-25/month (business bank)",
    stepSummary: "Open a Stripe account under your business entity. For banking, use Mercury, Wise, or a local business account.",
  },
  {
    id: "core_devices",
    title: "Never use employer devices, networks, or accounts",
    why: "Most employers have monitoring software on company laptops. VPN logs, browser history, and installed apps are all visible to IT.",
    time: "Ongoing habit",
    cost: "Free",
    stepSummary: "Use a personal laptop on your home network. Never access business tools from the office. Use mobile data if needed.",
  },
  {
    id: "core_entity",
    title: "Choose and register an entity structure",
    why: "An LLC or equivalent creates legal separation between you and your business. Your name is behind a registered agent, not on the storefront.",
    time: "1-2 hours",
    cost: "$50-500 depending on jurisdiction",
    stepSummary: "File an LLC through a registered agent service (e.g., Northwest, Incfile). Use the agent's address, not yours.",
  },
];

const STORAGE_KEY_PREFIX = "core_stealth_";

export default function CoreStealthActions({ userId, onSwitchTab }: CoreStealthActionsProps) {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PREFIX + userId);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const toggle = useCallback(
    (id: string) => {
      setCompleted((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        localStorage.setItem(STORAGE_KEY_PREFIX + userId, JSON.stringify(next));
        return next;
      });
    },
    [userId]
  );

  const completedCount = CORE_ACTIONS.filter((a) => completed[a.id]).length;
  const allComplete = completedCount === CORE_ACTIONS.length;
  const progressPct = (completedCount / CORE_ACTIONS.length) * 100;

  // Sort: incomplete first, completed last
  const sortedActions = [...CORE_ACTIONS].sort((a, b) => {
    const aComplete = completed[a.id] ? 1 : 0;
    const bComplete = completed[b.id] ? 1 : 0;
    return aComplete - bComplete;
  });

  return (
    <div className="space-y-6">
      {/* All complete celebration card */}
      {allComplete && (
        <div className="rounded-xl border-2 border-green-500/30 bg-green-50/30 dark:bg-green-950/20 p-6 text-center">
          <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">All 5 core actions complete.</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            You've covered the fundamentals. Your invisibility score
            likely improved. Retake the audit to see your new score.
          </p>
          <Button
            variant="outline"
            onClick={() => onSwitchTab?.("invisibility")}
          >
            Retake Invisibility Audit
          </Button>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#60A5FA]/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-[#60A5FA]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0B1D3A]">Core Stealth Actions</h2>
            <p className="text-sm text-[#4A5568]">
              {completedCount} of {CORE_ACTIONS.length} completed
            </p>
          </div>
        </div>
        <p className="text-sm text-[#4A5568] mt-2">
          These 5 actions are the foundation of staying invisible. Complete them before you launch anything.
        </p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-[#8A95A8] mb-1">
          <span>Core Stealth Actions: {completedCount} of {CORE_ACTIONS.length} complete</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <Progress value={progressPct} className="h-2" />
      </div>

      {/* Action cards */}
      <div className="space-y-3">
        {sortedActions.map((action) => {
          const done = !!completed[action.id];
          return (
            <div
              key={action.id}
              className={`bg-white rounded-xl border p-5 transition-all duration-300 ${
                done
                  ? "border-green-200 bg-green-50/30"
                  : "border-gray-200 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  id={action.id}
                  checked={done}
                  onCheckedChange={() => toggle(action.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={action.id}
                    className={`text-sm font-semibold cursor-pointer ${
                      done ? "text-green-700 line-through" : "text-[#0B1D3A]"
                    }`}
                  >
                    {action.title}
                  </label>
                  <p className="text-xs text-[#4A5568] mt-1">{action.why}</p>
                  <div className="flex gap-3 mt-2 text-xs text-[#8A95A8]">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {action.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {action.cost}
                    </span>
                  </div>
                  <p className="text-xs text-[#4A5568] mt-2 bg-gray-50 rounded p-2">
                    <span className="font-medium text-[#0B1D3A]">HOW:</span>{" "}
                    {action.stepSummary}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
