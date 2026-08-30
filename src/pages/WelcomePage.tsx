import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { completeCheckoutLogin } from "@/lib/checkout";
import { trackEvent } from "@/lib/analytics";

const WelcomePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setError(true);
      return;
    }

    let cancelled = false;
    completeCheckoutLogin(sessionId)
      .then(() => {
        if (cancelled) return;
        trackEvent("welcome_login_ok", { session_id_present: true });
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <SEOHead
        title="Welcome | Invisible Exit"
        description="Finish setting up your Invisible Exit account."
        url="/welcome"
        noindex
      />
      <section className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        {error ? (
          <>
            <AlertCircle className="mx-auto mb-4 h-10 w-10 text-destructive" aria-hidden="true" />
            <h1 className="text-2xl font-semibold text-foreground">We could not verify your checkout</h1>
            <p className="mt-3 text-muted-foreground">
              Your payment may still be complete. Return to checkout or email escape@invisibleexit.com and we will help restore access.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link className="btn-primary" to="/start">
                Return to checkout
              </Link>
              <a className="btn-secondary" href="mailto:escape@invisibleexit.com?subject=Checkout%20access%20help">
                Email support
              </a>
            </div>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" aria-hidden="true" />
            <h1 className="text-2xl font-semibold text-foreground">Setting up your account</h1>
            <p className="mt-3 text-muted-foreground">Your payment is being verified. The dashboard will open automatically.</p>
          </>
        )}
      </section>
    </main>
  );
};

export default WelcomePage;
