import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Confirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Email Confirmed | Invisible Exit";
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard", { replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1D3A] px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">
          Email Confirmed
        </h1>
        <p className="text-white/60 mb-8">
          Your account is ready. Sign in to access your FYM Dashboard.
        </p>
        <Link
          to="/login"
          className="inline-block w-full bg-[#D4A843] hover:bg-[#E0BC5E] text-[#0B1D3A] font-semibold text-lg px-10 py-4 rounded-xl transition-colors"
        >
          Open My Dashboard
        </Link>
      </div>
    </div>
  );
}
