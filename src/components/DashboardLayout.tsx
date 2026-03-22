import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopBar from "@/components/DashboardTopBar";

interface DashboardLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  email: string;
  freedomPct: number;
  isStarter: boolean;
  children: React.ReactNode;
}

export default function DashboardLayout({
  activeTab,
  onTabChange,
  email,
  freedomPct,
  isStarter,
  children,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        email={email}
        freedomPct={freedomPct}
        isStarter={isStarter}
      />
      <SidebarInset className="bg-gradient-to-b from-[#F4F7FB] to-[#EDF2F7]">
        <DashboardTopBar activeTab={activeTab} onTabChange={onTabChange} />
        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
