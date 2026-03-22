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
  LayoutDashboard,
  Calculator,
  History,
  TrendingUp,
  EyeOff,
  Lightbulb,
  GitBranch,
  Palette,
  Rocket,
  Shield,
  Lock,
  LogOut,
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
}

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { value: "overview", label: "Overview", icon: LayoutDashboard, gated: false },
    ],
  },
  {
    label: "Track",
    items: [
      { value: "calculator", label: "Calculator", icon: Calculator, gated: false },
      { value: "history", label: "History", icon: History, gated: false },
      { value: "trends", label: "Trends", icon: TrendingUp, gated: true },
      { value: "invisibility", label: "Invisibility", icon: EyeOff, gated: false },
    ],
  },
  {
    label: "Build",
    items: [
      { value: "ideas", label: "Ideas", icon: Lightbulb, gated: false },
      { value: "pipeline", label: "Pipeline", icon: GitBranch, gated: true },
      { value: "brand", label: "Brand", icon: Palette, gated: true },
    ],
  },
  {
    label: "Ship",
    items: [
      { value: "launch", label: "Launch", icon: Rocket, gated: true },
      { value: "stealth", label: "Stealth Ops", icon: Shield, gated: true },
    ],
  },
];

export default function DashboardSidebar({
  activeTab,
  onTabChange,
  email,
  freedomPct,
  isStarter,
}: DashboardSidebarProps) {
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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

      {/* Navigation */}
      <SidebarContent>
        {NAV_GROUPS.map((group, groupIdx) => (
          <SidebarGroup key={groupIdx}>
            {group.label && (
              <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold">
                {group.label}
              </SidebarGroupLabel>
            )}
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
        ))}
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
