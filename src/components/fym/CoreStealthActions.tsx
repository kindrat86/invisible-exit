import { useState, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Shield } from "lucide-react";

interface CoreStealthActionsProps {
  userId: string;
}

const CORE_ACTIONS = [
  {
    id: "core_email",
    title: "Set up a separate email for your business",
    why: "Your employer monitors corporate email. A separate inbox keeps your business completely off their radar.",
    time: "5 minutes",
    tools: "Gmail or ProtonMail",
  },
  {
    id: "core_domain",
    title: "Register a domain with WHOIS privacy",
    why: "Without WHOIS privacy, anyone can look up the domain owner. Your name and address would be public.",
    time: "15 minutes",
    tools: "Namecheap, Cloudflare, or Porkbun",
  },
  {
    id: "core_bank",
    title: "Open a separate bank account or payment processor",
    why: "Mixing personal and business finances creates a paper trail. Keep them separate from day one.",
    time: "30 minutes",
    tools: "Mercury, Relay, or Stripe Atlas",
  },
  {
    id: "core_devices",
    title: "Never use employer devices, networks, or accounts",
    why: "Your employer owns everything on their devices and network. One slip and IT can see everything.",
    time: "Ongoing",
    tools: "Personal laptop + phone hotspot",
  },
  {
    id: "core_entity",
    title: "Choose an entity structure (LLC via registered agent)",
    why: "An LLC with a registered agent keeps your name off public records. This is the foundation of invisibility.",
    time: "2-3 hours",
    tools: "Northwest Registered Agent or similar",
  },
];

const STORAGE_KEY_PREFIX = "core_stealth_";

export default function CoreStealthActions({ userId }: CoreStealthActionsProps) {
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

  return (
    <div className="space-y-6">
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

      {/* Action cards */}
      <div className="space-y-3">
        {CORE_ACTIONS.map((action) => {
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
                    <span>{action.tools}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
