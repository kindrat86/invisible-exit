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
  Compass,
  Zap,
  CheckCircle2,
  CheckCircle,
  Clock,
} from "lucide-react";
import SidebarProgressRing from "@/components/fym/SidebarProgressRing";
import FoundingBadge from "@/components/FoundingBadge";
import { useState } from "react";
import { toast } from "sonner";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  email: string;
  freedomPct: number;
  isStarter: boolean;
  subscriptionTier?: string;
  phaseCompletion?: Record<number, boolean>;
  pipelineValidationsRemaining?: number;
}

interface NavItem {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gated: boolean;
  gateId?: string;
  badge?: string;
  badgeVariant?: "default" | "warning";
}

interface PhaseGroup {
  phase: number;
  title: string;
  items: NavItem[];
}

const FOUNDING_PHASE_GROUPS: PhaseGroup[] = [
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
      { value: "pipeline", label: "Pipeline Validation", icon: GitBranch, gated: false },
    ],
  },
  {
    phase: 4,
    title: "Build It",
    items: [
      { value: "brand", label: "Brand Manager", icon: Palette, gated: false },
      { value: "launch", label: "Launch Control", icon: Rocket, gated: false },
    ],
  },
  {
    phase: 5,
    title: "Scale It",
    items: [
      { value: "trends", label: "Trends", icon: TrendingUp, gated: false },
      { value: "stealth-full", label: "Full Stealth Ops", icon: Shield, gated: false },
      { value: "scenarios", label: "Scenario Engine", icon: BarChart3, gated: false },
      { value: "reverse-calc", label: "Reverse Calculator", icon: ArrowDownRight, gated: false },
      { value: "roadmap", label: "Shape the Roadmap", icon: Compass, gated: false },
    ],
  },
];

function getStarterPhaseGroups(pipelineValidationsRemaining: number): PhaseGroup[] {
  const badgeText = pipelineValidationsRemaining > 0
    ? `${pipelineValidationsRemaining} left`
    : "0 left";
  const badgeVariant = pipelineValidationsRemaining > 0 ? "default" as const : "warning" as const;

  return [
    {
      phase: 1,
      title: "Know Your Number",
      items: [
        { value: "calculator", label: "Calculator", icon: Calculator, gated: false },
        { value: "history", label: "History", icon: Clock, gated: false },
      ],
    },
    {
      phase: 2,
      title: "Protect Yourself",
      items: [
        { value: "invisibility", label: "Invisibility Audit", icon: Shield, gated: false },
        { value: "stealth-core", label: "Core Actions", icon: Lock, gated: false },
      ],
    },
    {
      phase: 3,
      title: "Pick Your Idea",
      items: [
        { value: "ideas", label: "Idea Finder", icon: Lightbulb, gated: false },
        { value: "pipeline", label: "Validate", icon: CheckCircle, gated: false, badge: badgeText, badgeVariant },
      ],
    },
  ];
}

// Flatten all valid tab names (includes all possible tabs)
export const ALL_PHASE_TABS = FOUNDING_PHASE_GROUPS.flatMap((g) =>
  g.items.map((i) => i.value)
);

function getRecommendedPhase(phaseCompletion?: Record<number, boolean>, maxPhase = 5): number {
  if (!phaseCompletion) return 1;
  for (let i = 1; i <= maxPhase; i++) {
    if (!phaseCompletion[i]) return i;
  }
  return maxPhase;
}

export default function DashboardSidebar({
  activeTab,
  onTabChange,
  email,
  freedomPct,
  isStarter,
  subscriptionTier,
  phaseCompletion,
  pipelineValidationsRemaining = 1,
}: DashboardSidebarProps) {
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const navGroups = isStarter
    ? getStarterPhaseGroups(pipelineValidationsRemaining)
    : FOUNDING_PHASE_GROUPS;

  const maxPhase = isStarter ? 3 : 5;
  const recommendedPhase = getRecommendedPhase(phaseCompletion, maxPhase);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleNav = (tab: string) => {
    onTabChange(tab);
    setOpenMobile(false);
  };

  const handleUpgrade = () => {
    onTabChange("upgrade");
    setOpenMobile(false);
  };

  // Find which phase the active tab belongs to
  const activePhase = navGroups.find((g) =>
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
            {subscriptionTier === "founding" ? (
              <span className="text-[10px] font-semibold text-[#60A5FA] leading-tight flex items-center gap-1">
                Founding Member ✦
              </span>
            ) : (
              <span className="text-[10px] text-[#9CA3AF] leading-tight">
                FYM Dashboard
              </span>
            )}
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
        {navGroups.map((group) => {
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
                              : "text-[#4A5568] hover:bg-[#F4F7FB] hover:text-[#0B1D3A]"
                          }
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 ${
                              isActive
                                ? "text-[#60A5FA]"
                                : "text-[#9CA3AF]"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </SidebarMenuButton>
                        {item.badge && (
                          <SidebarMenuBadge>
                            <span
                              className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full ${
                                item.badgeVariant === "warning"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-blue-100/80 text-blue-700"
                              }`}
                            >
                              {item.badge}
                            </span>
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
            className="w-full bg-[#1B2A4A] hover:bg-[#0B1D3A] text-white text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mb-2 group-data-[collapsible=icon]:p-2"
          >
            <Rocket className="h-3.5 w-3.5 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">
              Upgrade
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
            {subscriptionTier === "founding" && (
              <div className="mt-0.5">
                <FoundingBadge compact />
              </div>
            )}
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
