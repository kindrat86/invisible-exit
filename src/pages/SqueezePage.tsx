import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Lock } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import ShareableResult from "@/components/ShareableResult";

const SqueezePage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    trackEvent("squeeze_page_submitted", { source: "freedom_calculator" });
    try {
      // Add to subscribers
      await supabase
        .from("subscribers")
        .upsert(
          { email, source: "squeeze_freedom_page" },
          { onConflict: "email" }
        );

      // Send welcome email (which triggers Soap Opera sequence)
      await supabase.functions
        .invoke("newsletter-welcome", { body: { email } })
        .catch((err) => console.error("Welcome email error:", err));

      setSubmitted(true);
      toast.success("Check your inbox — your Freedom Number calculator is on its way!");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(222_47%_11%)]">
      <SEOHead
        title="Free Freedom Number Calculator | Invisible Exit"
        description="Calculate exactly how much recurring revenue you need to quit your job. Free tool. Takes 90 seconds."
        url="/freedom"
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 md:py-32">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 mb-8">
            <Calculator className="w-8 h-8 text-primary-light" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Discover Your <span className="text-gradient-light">Freedom Number</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-xl mx-auto mb-2">
            The exact monthly recurring revenue you need to never work for someone else again.
          </p>
          <p className="text-base text-white/50 max-w-lg mx-auto mb-12">
            Free calculator. Takes 90 seconds. No credit card. No spam.
          </p>

          {!submitted ? (
            <>
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your best email address"
                  className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 py-4 px-5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 disabled:opacity-50 min-h-[52px]"
                >
                  {loading ? "Calculating..." : "Get My Freedom Number"}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>

              <div className="flex items-center justify-center gap-4 mt-8 text-white/40 text-sm">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  100% Private
                </span>
                <span>·</span>
                <span>No spam, ever</span>
                <span>·</span>
                <span>Unsubscribe anytime</span>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-white/40 text-sm mb-4">What you'll discover:</p>
                <ul className="text-left max-w-sm mx-auto space-y-3 text-white/70 text-sm">
                  {[
                    "The exact MRR number that replaces your salary",
                    "Your timeline to freedom (in months, not years)",
                    "How many customers you need at your price point",
                    "Your invisibility score (can your employer find out?)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary-light mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="max-w-md mx-auto card-glass p-8 animate-scale-in">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-success text-2xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Here's Your Freedom Number</h2>
              <p className="text-white/70 mb-2">
                Based on a $120K salary and standard living expenses:
              </p>

              {/* Instant result — not email-gated */}
              <div className="bg-white/10 rounded-xl p-6 mb-6 border border-white/15">
                <p className="text-white/50 text-xs uppercase tracking-wide mb-1">Your Freedom Number</p>
                <p className="text-4xl font-bold text-primary-light mb-2">$4,000<span className="text-lg text-white/50">/month MRR</span></p>
                <div className="space-y-1 text-left mt-4">
                  <p className="text-sm text-white/60">At $29/month pricing: <span className="text-white font-semibold">138 customers</span></p>
                  <p className="text-sm text-white/60">At $9/month pricing: <span className="text-white font-semibold">445 customers</span></p>
                  <p className="text-sm text-white/60">Timeline (5 hrs/week): <span className="text-white font-semibold">12-18 months</span></p>
                </div>
              </div>

              <p className="text-white/50 text-sm mb-4">
                I just sent a detailed breakdown to <strong className="text-white">{email}</strong> —
                including your personalized exit timeline, the Amsterdam moment that started everything,
                and the 5-tool system that gets you to $4,000/month.
              </p>

              <div className="space-y-3">
                <a
                  href="/?checkout=starter"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 min-h-[52px]"
                >
                  Get All 5 Tools — $0.97/month
                </a>
                <Link
                  to="/story"
                  className="w-full inline-flex items-center justify-center gap-2 text-primary-light hover:text-white transition-colors text-sm font-medium"
                >
                  Read my full story first →
                </Link>
              </div>

              <ShareableResult freedomNumber="$4,000/month MRR" />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SqueezePage;
