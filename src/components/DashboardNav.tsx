import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface DashboardNavProps {
  email: string;
}

export default function DashboardNav({ email }: DashboardNavProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="text-[#0B1D3A] font-bold text-lg">FYM Dashboard</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#4A5568] hidden sm:inline">
            {email}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-[#4A5568] hover:text-[#0B1D3A]"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
