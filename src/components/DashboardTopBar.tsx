import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Calculator } from "lucide-react";

interface DashboardTopBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tier?: string;
}

const TAB_LABELS: Record<string, { phase: string; label: string }> = {
  overview: { phase: "", label: "Overview" },
  calculator: { phase: "Phase 1", label: "Calculator" },
  history: { phase: "Phase 1", label: "History" },
  invisibility: { phase: "Phase 2", label: "Invisibility Audit" },
  "stealth-core": { phase: "Phase 2", label: "Core Stealth Actions" },
  ideas: { phase: "Phase 3", label: "Idea Recommender" },
  pipeline: { phase: "Phase 3", label: "Pipeline Validation" },
  brand: { phase: "Phase 4", label: "Brand Manager" },
  launch: { phase: "Phase 4", label: "Launch Control" },
  trends: { phase: "Phase 5", label: "Trends" },
  "stealth-full": { phase: "Phase 5", label: "Full Stealth Ops" },
  scenarios: { phase: "Phase 5", label: "Scenario Engine" },
  "reverse-calc": { phase: "Phase 5", label: "Reverse Calculator" },
};

export default function DashboardTopBar({
  activeTab,
  onTabChange,
  tier,
}: DashboardTopBarProps) {
  const tab = TAB_LABELS[activeTab] ?? { phase: "", label: "Dashboard" };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-[#EDF2F7] px-4 h-12 flex items-center gap-3 sticky top-0 z-10">
      <SidebarTrigger className="text-[#4A5568] hover:text-[#0B1D3A]" />

      <Separator orientation="vertical" className="h-5 bg-[#EDF2F7]" />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm min-w-0">
        {tab.phase && (
          <>
            <span className="text-[#9CA3AF] hidden sm:inline">{tab.phase}</span>
            <span className="text-[#9CA3AF] hidden sm:inline">/</span>
          </>
        )}
        <span className="text-[#0B1D3A] font-medium truncate">{tab.label}</span>
      </nav>

      <div className="flex-1" />

      {/* Founding Member pill */}
      {tier === "founding" && (
        <span className="bg-[#60A5FA]/10 text-[#60A5FA] text-[10px] font-semibold px-2.5 py-1 rounded-full hidden sm:inline-flex items-center gap-1">
          ✦ Founding Member
        </span>
      )}

      {/* Quick action */}
      {activeTab !== "calculator" && (
        <button
          onClick={() => onTabChange("calculator")}
          className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Calculator className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New Entry</span>
        </button>
      )}
    </header>
  );
}
