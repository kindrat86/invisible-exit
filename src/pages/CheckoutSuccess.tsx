import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = "Setting up your dashboard... | Invisible Exit";

    if (!sessionId) {
      setError(true);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke(
          "checkout-login",
          { body: { session_id: sessionId } }
        );

        if (cancelled) return;

        if (fnError || !data?.action_link) {
          console.error("checkout-login failed:", fnError);
          setError(true);
          return;
        }

        // Redirect to the magic link which authenticates and sends to /dashboard
        window.location.href = data.action_link;
      } catch (err) {
        if (!cancelled) {
          console.error("checkout-login error:", err);
          setError(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 pb-20 px-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Almost there!
          </h1>
          <p className="text-gray-500 text-lg mb-6">
            Check your email for a login link to access your dashboard.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-medium">
          Setting up your dashboard...
        </p>
        <p className="text-gray-400 text-sm mt-2">
          You'll be redirected automatically.
        </p>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
