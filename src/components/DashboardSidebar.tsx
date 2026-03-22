import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Calculator,
  History,
  TrendingUp,
  EyeOff,
  Shield,
  Lightbulb,
  GitBranch,
  Palette,
  Rocket,
  Lock,
  LogOut,
  BarChart3,
  ArrowDownRight,
  Zap,
  CheckCircle2,
} from "lucide-react";
import SidebarProgressRing from "@/components/fym/SidebarProgressRing";
import { useState } from "react";
import { toast } from "sonner";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  email: string;
  freedomPct: number;
  isStarter: boolean;
  phaseCompletion?: Record<number, boolean>;
}

interface NavItem {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gated: boolean;
  gateId?: string;
}

interface PhaseGroup {
  phase: number;
  title: string;
  items: NavItem[];
}

const PHASE_GROUPS: PhaseGroup[] = [
  {
    phase: 1,
    title: "Know Your Number",
    items: [
      { value: "calculator", label: "Calculator", icon: Calculator, gated: false },
      { value: "history", label: "History", icon: History, gated: false },
    ],
  },
  {
    phase: 2,
    title: "Protect Yourself",
    items: [
      { value: "invisibility", label: "Invisibility Audit", icon: EyeOff, gated: false },
      { value: "stealth-core", label: "Core Stealth Actions", icon: Shield, gated: false },
    ],
  },
  {
    phase: 3,
    title: "Pick Your Idea",
    items: [
      { value: "ideas", label: "Idea Recommender", icon: Lightbulb, gated: false },
      { value: "pipeline", label: "Pipeline Validation", icon: GitBranch, gated: false, gateId: "pipeline-unlimited" },
    ],
  },
  {
    phase: 4,
    title: "Build It",
    items: [
      { value: "brand", label: "Brand Manager", icon: Palette, gated: true, gateId: "brand" },
      { value: "launch", label: "Launch Control", icon: Rocket, gated: true, gateId: "launch" },
    ],
  },
  {
    phase: 5,
    title: "Scale It",
    items: [
      { value: "trends", label: "Trends", icon: TrendingUp, gated: true, gateId: "trends" },
      { value: "stealth-full", label: "Full Stealth Ops", icon: Shield, gated: true, gateId: "stealth-full" },
      { value: "scenarios", label: "Scenario Engine", icon: BarChart3, gated: true, gateId: "scenarios" },
      { value: "reverse-calc", label: "Reverse Calculator", icon: ArrowDownRight, gated: true, gateId: "reverse-calc" },
    ],
  },
];

// Flatten all valid tab names
export const ALL_PHASE_TABS = PHASE_GROUPS.flatMap((g) =>
  g.items.map((i) => i.value)
);

function getRecommendedPhase(phaseCompletion?: Record<number, boolean>): number {
  if (!phaseCompletion) return 1;
  for (let i = 1; i <= 5; i++) {
    if (!phaseCompletion[i]) return i;
  }
  return 5;
}

export default function DashboardSidebar({
  activeTab,
  onTabChange,
  email,
  freedomPct,
  isStarter,
  phaseCompletion,
}: DashboardSidebarProps) {
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const recommendedPhase = getRecommendedPhase(phaseCompletion);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleNav = (tab: string) => {
    onTabChange(tab);
    setOpenMobile(false);
  };

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier: "founding", returnUrl: window.location.origin + "/dashboard" },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch {
      toast.error("Could not start checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Find which phase the active tab belongs to
  const activePhase = PHASE_GROUPS.find((g) =>
    g.items.some((i) => i.value === activeTab)
  )?.phase ?? 0;

  return (
    <Sidebar collapsible="icon" className="border-r border-[#EDF2F7]">
      {/* Header: Logo + Progress Ring */}
      <SidebarHeader className="p-4 pb-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <SidebarProgressRing value={freedomPct} size={48} />
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-[#0B1D3A] font-bold text-sm leading-tight truncate">
              Invisible Exit
            </span>
            <span className="text-[10px] text-[#9CA3AF] leading-tight">
              FYM Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Overview link */}
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "overview"}
                tooltip="Overview"
                onClick={() => handleNav("overview")}
                className={
                  activeTab === "overview"
                    ? "bg-[#60A5FA]/10 text-[#60A5FA] font-medium border-l-2 border-[#60A5FA] rounded-l-none"
                    : "text-[#4A5568] hover:bg-[#F4F7FB] hover:text-[#0B1D3A]"
                }
              >
                <Zap className={`h-4 w-4 shrink-0 ${activeTab === "overview" ? "text-[#60A5FA]" : "text-[#9CA3AF]"}`} />
                <span className="truncate">Overview</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Phase Navigation */}
      <SidebarContent>
        {PHASE_GROUPS.map((group) => {
          const isCompleted = phaseCompletion?.[group.phase] ?? false;
          const isRecommended = group.phase === recommendedPhase;

          return (
            <SidebarGroup key={group.phase}>
              <SidebarGroupLabel
                className={`text-[10px] uppercase tracking-wider font-semibold flex items-center gap-2 ${
                  isRecommended && !isCompleted
                    ? "text-[#60A5FA]"
                    : "text-[#9CA3AF]"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                  isCompleted
                    ? "bg-green-100 text-green-600"
                    : isRecommended
                      ? "bg-[#60A5FA]/10 text-[#60A5FA] ring-1 ring-[#60A5FA]/30"
                      : "bg-gray-100 text-gray-400"
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    group.phase
                  )}
                </span>
                <span className="group-data-[collapsible=icon]:hidden">
                  {group.title}
                </span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive = activeTab === item.value;
                    const isLocked = item.gated && isStarter;
                    const Icon = item.icon;

                    return (
                      <SidebarMenuItem key={item.value}>
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={item.label}
                          onClick={() => handleNav(item.value)}
                          className={
                            isActive
                              ? "bg-[#60A5FA]/10 text-[#60A5FA] font-medium border-l-2 border-[#60A5FA] rounded-l-none"
                              : isLocked
                                ? "text-[#9CA3AF] hover:bg-[#F4F7FB] hover:text-[#4A5568]"
                                : "text-[#4A5568] hover:bg-[#F4F7FB] hover:text-[#0B1D3A]"
                          }
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 ${
                              isActive
                                ? "text-[#60A5FA]"
                                : isLocked
                                  ? "text-[#9CA3AF]/50"
                                  : "text-[#9CA3AF]"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </SidebarMenuButton>
                        {isLocked && (
                          <SidebarMenuBadge>
                            <Lock className="h-3 w-3 text-[#9CA3AF]/50" />
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {/* Footer: Upgrade CTA + User */}
      <SidebarFooter className="p-3">
        {isStarter && (
          <button
            onClick={handleUpgrade}
            disabled={checkoutLoading}
            className="w-full bg-[#1B2A4A] hover:bg-[#0B1D3A] text-white text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-2 group-data-[collapsible=icon]:p-2"
          >
            <Rocket className="h-3.5 w-3.5 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">
              {checkoutLoading ? "..." : "Upgrade"}
            </span>
          </button>
        )}
        <SidebarSeparator />
        <div className="flex items-center gap-2 pt-2">
          <div className="w-7 h-7 rounded-full bg-[#60A5FA]/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-[#60A5FA]">
              {email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-xs text-[#4A5568] truncate">{email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[#9CA3AF] hover:text-[#0B1D3A] transition-colors p-1 shrink-0"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
