import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Calculator } from "lucide-react";

interface DashboardTopBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TAB_LABELS: Record<string, { group: string; label: string }> = {
  overview: { group: "", label: "Overview" },
  calculator: { group: "Track", label: "Calculator" },
  history: { group: "Track", label: "History" },
  trends: { group: "Track", label: "Trends" },
  invisibility: { group: "Track", label: "Invisibility" },
  ideas: { group: "Build", label: "Ideas" },
  pipeline: { group: "Build", label: "Pipeline" },
  brand: { group: "Build", label: "Brand" },
  launch: { group: "Ship", label: "Launch" },
  stealth: { group: "Ship", label: "Stealth Ops" },
};

export default function DashboardTopBar({
  activeTab,
  onTabChange,
}: DashboardTopBarProps) {
  const tab = TAB_LABELS[activeTab] ?? { group: "", label: "Dashboard" };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-[#EDF2F7] px-4 h-12 flex items-center gap-3 sticky top-0 z-10">
      <SidebarTrigger className="text-[#4A5568] hover:text-[#0B1D3A]" />

      <Separator orientation="vertical" className="h-5 bg-[#EDF2F7]" />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm min-w-0">
        {tab.group && (
          <>
            <span className="text-[#9CA3AF] hidden sm:inline">{tab.group}</span>
            <span className="text-[#9CA3AF] hidden sm:inline">/</span>
          </>
        )}
        <span className="text-[#0B1D3A] font-medium truncate">{tab.label}</span>
      </nav>

      <div className="flex-1" />

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
