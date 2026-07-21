import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = "Setting up your dashboard... | Invisible Exit"; // kept for loading state

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

  const seoHead = (
    <SEOHead
      title="Checkout | Invisible Exit"
      description="Setting up your Invisible Exit dashboard."
      url="/checkout/success"
      noindex
    />
  );

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        {seoHead}
        <Navbar />
        <div className="pt-32 pb-20 px-6 text-center">
          {/* Tripwire-to-core upsell: prominent upgrade card */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
            <h2 className="text-lg font-bold text-amber-900 mb-2">
              Lock in the Founding Rate before you go
            </h2>
            <p className="text-amber-700 text-sm mb-4">
              Your Starter plan gives you all 5 tools. Upgrade to <strong>$47/mo Pro</strong> to lock in the founding rate forever and unlock coaching calls, the full Stealth Ops Blueprint, and Launch Control.
            </p>
            <a href="/oto/founding" className="inline-block bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
              Upgrade to Pro — $47/mo Founding Rate →
            </a>
            <p className="text-amber-400 text-xs mt-2 text-center">
              138+ founders already inside. Cancel anytime.
            </p>
          </div>

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
      {seoHead}
      <div className="text-center">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-medium">
          Setting up your dashboard...
        </p>
        <p className="text-gray-400 text-sm mt-2">
          You'll be redirected automatically.
        </p>
        {/* Tripwire-to-core upsell: inline while-you-wait card */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left max-w-sm mx-auto">
          <p className="text-amber-800 text-sm font-semibold mb-1">
            While you wait: your Starter is great — Pro is better.
          </p>
          <p className="text-amber-600 text-xs mb-3">
            Pro ($47/mo) unlocks coaching calls, the full Stealth Ops Blueprint, Launch Control, and the complete exit framework. Founding rate — never goes up.
          </p>
          <a href="/oto/founding" className="inline-block bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
            Explore Pro Plan →
          </a>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
