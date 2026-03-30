import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * OAuth callback route – exchanges the code in the URL hash for a session.
 * Supabase appends #access_token=... after OAuth redirects.
 * This page simply waits for the session to appear and redirects to /dashboard.
 */
export default function AuthCallback() {
    const navigate = useNavigate();

  useEffect(() => {
        supabase.auth.onAuthStateChange((event) => {
                if (event === "SIGNED_IN") {
                          navigate("/dashboard", { replace: true });
                }
        });

                // Fallback: if already signed in, redirect immediately
                supabase.auth.getSession().then(({ data: { session } }) => {
                        if (session) navigate("/dashboard", { replace: true });
                });
  }, [navigate]);

  return (
        <div className="min-h-screen flex items-center justify-center bg-[#1B2A4A]">
              <p className="text-white animate-pulse">Completing sign-in...</p>p>
        </div>div>
      );
}</div>
