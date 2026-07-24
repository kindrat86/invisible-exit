import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calculator,
  Lock,
  Check,
  DollarSign,
  TrendingUp,
  Shield,
  Rocket,
  ChevronDown,
} from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import ShareableResult from "@/components/ShareableResult";

type Step = "intro" | "salary" | "expenses" | "timeline" | "result" | "email";

interface CalcResult {
  freedomNumber: number;
  annualSalary: number;
  monthlyExpenses: number;
  customers29: number;
  customers9: number;
  timelineMonths: number;
  invisibilityScore: number;
}

const SqueezePage = () => {
  const [step, setStep] = useState<Step>("intro");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailDelivered, setEmailDelivered] = useState(false);

  // Inputs
  const [salary, setSalary] = useState("");
  const [expenses, setExpenses] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("5");

  // ── DOTCOM SECRETS Ch 14: Order Bump ──
  // Checkbox on the email step that adds a $7 one-time to the $0.97/mo checkout
  const [addStealthBlueprint, setAddStealthBlueprint] = useState(false);

  // Calculated result
  const [result, setResult] = useState<CalcResult | null>(null);

  const calculate = (): CalcResult => {
    const annualSalary = parseInt(salary) || 120000;
    const monthlyExpenses = parseInt(expenses) || 5000;
    const hrs = parseInt(hoursPerWeek) || 5;

    // Freedom number = monthly expenses + (salary / 12 * 0.3 buffer)
    // This replaces your salary + covers expenses
    const monthlySalaryReplacement = annualSalary / 12;
    const freedomNumber = Math.round(
      (monthlyExpenses + monthlySalaryReplacement) / 100
    ) * 100;

    // Customer calculations
    const customers29 = Math.ceil(freedomNumber / 29);
    const customers9 = Math.ceil(freedomNumber / 9);

    // Timeline based on hours/week (more hours = faster)
    // Base: 18 months at 5 hrs/week, scales down with more time
    const timelineMonths = Math.round(18 * (5 / Math.max(hrs, 1)));

    // Invisibility score (static for now — would be computed from stealth audit)
    const invisibilityScore = 72;

    return {
      freedomNumber,
      annualSalary,
      monthlyExpenses,
      customers29,
      customers9,
      timelineMonths: Math.max(timelineMonths, 8),
      invisibilityScore,
    };
  };

  const handleCalculate = () => {
    const res = calculate();
    setResult(res);
    setStep("email");
    trackEvent("freedom_number_calculated", {
      freedomNumber: res.freedomNumber,
      salary: res.annualSalary,
    });
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !result) return;
    setLoading(true);
    try {
      // ── Send to API endpoint (handles both Turso DB insert + Resend welcome) ──
      const apiRes = await fetch("/api/newsletter-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "squeeze_freedom_page",
          metadata: {
            freedom_number: result.freedomNumber,
            salary: result.annualSalary,
            timeline: result.timelineMonths,
            add_stealth_blueprint: addStealthBlueprint,
          },
        }),
      });

      if (!apiRes.ok) {
        const errData = await apiRes.json().catch(() => ({}));
        console.error("Newsletter API error:", errData);
        if (apiRes.status === 429) {
          toast.error("Too many attempts. Please try again in a few minutes.");
          return;
        }
        // Fail open: the result is the promise — never hold it hostage to a
        // backend hiccup. The email send failed, so soften the messaging.
        trackEvent("squeeze_email_capture_failed", { status: apiRes.status });
        toast.error("Couldn't send the email breakdown — but here's your number.");
        setStep("result");
        return;
      }

      trackEvent("squeeze_page_submitted", {
        source: "freedom_calculator",
        freedomNumber: result.freedomNumber,
        add_stealth_blueprint: addStealthBlueprint,
      });
      toast.success("Check your inbox — your detailed breakdown is on the way!");
      setEmailDelivered(true);
      setStep("result");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (n: number) => `$${n.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-[hsl(222_47%_11%)]">
      <SEOHead
        title="Free Freedom Number Calculator | Invisible Exit"
        description="Calculate exactly how much recurring revenue you need to quit your job. Free tool. Takes 90 seconds."
        url="/freedom"
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 mb-8">
            <Calculator className="w-8 h-8 text-primary-light" />
          </div>

          {/* ─── STEP: INTRO — calculator first, one ask above the fold ─── */}
          {step === "intro" && (
            <div className="animate-fade-in max-w-md mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                How much recurring revenue do you actually need to{" "}
                <span className="text-gradient-light">leave your job?</span>
              </h1>

              <p className="text-eyebrow text-primary-light mb-3">Step 1 of 3</p>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                What's your current annual salary?
              </h2>
              <p className="text-white/50 text-sm mb-8">
                This is the number your side business needs to replace.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (salary) {
                    trackEvent("freedom_calc_started", { salary: parseInt(salary) || 0 });
                    setStep("expenses");
                  }
                }}
              >
                <div className="relative mb-6">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    aria-label="Annual salary"
                    enterKeyHint="next"
                    autoFocus
                    value={salary}
                    onChange={(e) => setSalary(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="120000"
                    className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 py-4 pl-12 pr-5 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 min-h-[56px]"
                  />
                </div>

                {/* Quick selects */}
                <div className="grid grid-cols-3 gap-2 mb-8">
                  {["$80K", "$120K", "$160K", "$200K", "$250K", "$300K+"].map(
                    (val) => {
                      const num = parseInt(val.replace(/[^0-9]/g, "")) * 1000;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSalary(String(num))}
                          className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                            salary === String(num)
                              ? "bg-primary text-white"
                              : "bg-white/5 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!salary}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-40 min-h-[52px]"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
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
            </div>
          )}

          {/* ─── STEP: SALARY ─── */}
          {step === "salary" && (
            <div className="animate-fade-in max-w-md mx-auto">
              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={`h-1.5 rounded-full transition-all ${
                      n === 1 ? "w-8 bg-primary" : "w-4 bg-white/15"
                    }`}
                  />
                ))}
              </div>

              <p className="text-eyebrow text-primary-light mb-3">
                Step 1 of 3
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                What's your current annual salary?
              </h2>
              <p className="text-white/50 text-sm mb-8">
                This is the number your side business needs to replace.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (salary) {
                    trackEvent("freedom_calc_income_entered", { salary: parseInt(salary) || 0 });
                    setStep("expenses");
                  }
                }}
              >
                <div className="relative mb-6">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    aria-label="Annual salary"
                    enterKeyHint="next"
                    autoFocus
                    value={salary}
                    onChange={(e) => setSalary(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="120000"
                    className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 py-4 pl-12 pr-5 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 min-h-[56px]"
                  />
                </div>

                {/* Quick selects */}
                <div className="grid grid-cols-3 gap-2 mb-8">
                  {["$80K", "$120K", "$160K", "$200K", "$250K", "$300K+"].map(
                    (val) => {
                      const num = parseInt(val.replace(/[^0-9]/g, "")) * 1000;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSalary(String(num))}
                          className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                            salary === String(num)
                              ? "bg-primary text-white"
                              : "bg-white/5 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!salary}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-40 min-h-[52px]"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* ─── STEP: EXPENSES ─── */}
          {step === "expenses" && (
            <div className="animate-fade-in max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={`h-1.5 rounded-full transition-all ${
                      n <= 2 ? "w-8 bg-primary" : "w-4 bg-white/15"
                    }`}
                  />
                ))}
              </div>

              <p className="text-eyebrow text-primary-light mb-3">
                Step 2 of 3
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                What are your monthly living expenses?
              </h2>
              <p className="text-white/50 text-sm mb-8">
                Mortgage, food, kids, car, everything. This is your survival
                floor.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (expenses) {
                    trackEvent("freedom_calc_expenses_entered", { expenses: parseInt(expenses) || 0 });
                    setStep("timeline");
                  }
                }}
              >
                <div className="relative mb-6">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    aria-label="Monthly living expenses"
                    enterKeyHint="next"
                    autoFocus
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="5000"
                    className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 py-4 pl-12 pr-5 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 min-h-[56px]"
                  />
                </div>

                <div className="grid grid-cols-4 gap-2 mb-8">
                  {["$3K", "$5K", "$8K", "$12K"].map((val) => {
                    const num = parseInt(val.replace(/[^0-9]/g, "")) * 1000;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setExpenses(String(num))}
                        className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                          expenses === String(num)
                            ? "bg-primary text-white"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("salary")}
                    className="px-6 py-4 rounded-xl bg-white/5 text-white/50 hover:text-white/80 transition-colors text-sm font-medium"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!expenses}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-40 min-h-[52px]"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ─── STEP: TIMELINE ─── */}
          {step === "timeline" && (
            <div className="animate-fade-in max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-1.5 rounded-full transition-all bg-primary w-8"
                  />
                ))}
              </div>

              <p className="text-eyebrow text-primary-light mb-3">
                Step 3 of 3
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                How many hours per week can you commit?
              </h2>
              <p className="text-white/50 text-sm mb-8">
                Be honest. Most corporate managers have 5. That's enough.
              </p>

              <div className="grid grid-cols-4 gap-2 mb-8">
                {["3", "5", "10", "15+"].map((val) => (
                  <button
                    key={val}
                    onClick={() => setHoursPerWeek(val.replace("+", ""))}
                    className={`py-4 rounded-xl text-lg font-bold transition-all ${
                      hoursPerWeek === val.replace("+", "")
                        ? "bg-primary text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {val}
                    <span className="block text-xs font-normal opacity-60">
                      hrs/wk
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("expenses")}
                  className="px-6 py-4 rounded-xl bg-white/5 text-white/50 hover:text-white/80 transition-colors text-sm font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    trackEvent("freedom_calc_hours_entered", { hoursPerWeek: parseInt(hoursPerWeek) || 5 });
                    handleCalculate();
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 min-h-[52px]"
                >
                  See My Freedom Number
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP: EMAIL GATE — number is calculated, email unlocks it ─── */}
          {step === "email" && result && (
            <div className="animate-scale-in max-w-lg mx-auto">
              {/* The locked number teaser */}
              <div className="relative bg-gradient-to-br from-primary/15 to-transparent rounded-2xl p-8 border border-primary/25 mb-6 overflow-hidden">
                <p className="text-white/50 text-xs uppercase tracking-wide mb-2">
                  Your Freedom Number Is Ready
                </p>
                <p className="text-5xl sm:text-6xl font-bold text-primary-light mb-2 blur-lg select-none" aria-hidden="true">
                  $4,200
                  <span className="text-lg text-white/50 block sm:inline sm:ml-2">
                    /month MRR
                  </span>
                </p>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex items-center gap-2 bg-[hsl(222_47%_14%)]/90 border border-white/15 rounded-full px-4 py-2 text-white/80 text-xs font-semibold">
                    <Lock className="w-3.5 h-3.5" />
                    Enter your email below to unlock your number
                  </span>
                </div>
                <p className="text-white/40 text-sm mt-3">
                  Calculated from your {formatMoney(result.annualSalary)} salary
                  and {formatMoney(result.monthlyExpenses)}/mo expenses. One
                  step left.
                </p>
              </div>

              {/* What the unlock reveals */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 mb-4 text-left">
                <p className="text-white/40 text-[11px] uppercase tracking-wider font-semibold mb-3 text-center">
                  What you'll see on the next screen
                </p>
                <div className="space-y-2.5">
                  {[
                    "Your exact Freedom Number — the MRR that replaces your salary",
                    "How many customers you need at $29/mo and $9/mo pricing",
                    `Your realistic timeline at ${hoursPerWeek} hours/week`,
                    "The invisibility benchmark members use to stay undetected",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-primary-light mt-0.5 shrink-0" />
                      <span className="text-white/70 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Founding membership open */}
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 mb-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <p className="text-amber-200 text-xs">
                  Founding membership open. Lock in your price now.
                </p>
              </div>

              {/* Social proof bar — removed fabricated counts */}
              <div className="flex items-center justify-center gap-3 mb-4 text-white/40 text-xs">
                <span className="flex items-center gap-1">
                  <span className="text-amber-400">★★★★★</span>
                </span>
              </div>

              {/* EXPERT SECRETS Ch 11: Pre-Frame Objection Crusher — right before email capture */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-4">
                <p className="text-white/40 text-[11px] uppercase tracking-wider font-semibold mb-3 text-center">
                  Questions Before You Enter Your Email?
                </p>
                <div className="space-y-3">
                  {[
                    { q: "Is this really free?", a: "Yes. The calculator and your result are 100% free. No credit card. No trial. Your email is where I send the detailed breakdown — and it unlocks your number on the next screen instantly." },
                    { q: "What if I don't have a business idea?", a: "The calculator doesn't require one. It just needs your salary, expenses, and hours. The Freedom Number works whether you have an idea or not — it tells you the target, not the path." },
                    { q: "Will this work for my situation?", a: "The math is the math. Salary, expenses, hours — these are universal inputs. The formula applies whether you're at $80K or $250K." },
                    { q: "What if I'm not technical?", a: "The calculator doesn't require technical skills. It asks 3 questions in 30 seconds. The system that follows is designed for non-technical managers." },
                  ].map((item) => (
                    <details key={item.q} className="group">
                      <summary className="flex items-center justify-between text-sm text-white/70 cursor-pointer list-none select-none py-1.5">
                        {item.q}
                        <ChevronDown className="w-3.5 h-3.5 text-white/30 transition-transform group-open:rotate-180 shrink-0" />
                      </summary>
                      <p className="text-xs text-white/50 leading-relaxed mt-1 pl-0">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>

              {/* Email gate — unlocks the result */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-4">
                <p className="text-white/70 text-sm mb-1 font-semibold">
                  Enter your email → see your Freedom Number
                </p>
                <p className="text-white/50 text-sm mb-4">
                  Your number appears instantly on the next screen. I'll also
                  send the full breakdown: your personalized exit timeline,
                  customer acquisition plan, and the 5-tool system that gets you
                  there.
                </p>

                <form onSubmit={handleSubmitEmail} className="space-y-3">
                  <input
                    type="email"
                    required
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your best email address"
                    className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 py-3.5 px-5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[52px]"
                  />

                  {/* ── DOTCOM SECRETS Ch 14: ORDER BUMP ── */}
                  <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${addStealthBlueprint ? "bg-primary/10 border-primary/40" : "bg-white/5 border-white/10 hover:bg-white/[0.07]"}`}>
                    <input
                      type="checkbox"
                      checked={addStealthBlueprint}
                      onChange={(e) => setAddStealthBlueprint(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded accent-primary shrink-0 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-white text-sm font-semibold">
                          YES — send me the $7 Stealth Ops Blueprint offer next
                        </span>
                      </div>
                      <p className="text-white/50 text-xs leading-relaxed mb-1">
                        The 47-point employment contract audit + entity setup walkthroughs
                        (normally $47, $7 one-time for founding members).
                      </p>
                      <p className="text-white/60 text-[11px] italic">
                        You'll complete the purchase on the next page — nothing is charged here.
                      </p>
                    </div>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-base py-3.5 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 min-h-[52px]"
                  >
                    {loading ? "Unlocking..." : "Show Me My Freedom Number"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              </div>

              {/* Direct CTA — skip email */}
              <Link
                to="/tripwire"
                className="block text-center w-full py-3.5 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all text-sm"
              >
                Skip email — get the $7 Stealth Ops Blueprint →
              </Link>
            </div>
          )}

          {/* ─── STEP: RESULT — unlocked after email ─── */}
          {step === "result" && result && (
            <div className="animate-scale-in max-w-lg mx-auto">
              {/* The big number — revealed */}
              <div className="bg-gradient-to-br from-primary/15 to-transparent rounded-2xl p-8 border border-primary/25 mb-6">
                <p className="text-white/50 text-xs uppercase tracking-wide mb-2">
                  Your Freedom Number
                </p>
                <p className="text-5xl sm:text-6xl font-bold text-primary-light mb-2">
                  {formatMoney(result.freedomNumber)}
                  <span className="text-lg text-white/50 block sm:inline sm:ml-2">
                    /month MRR
                  </span>
                </p>
                <p className="text-white/40 text-sm mt-3">
                  That's the monthly recurring revenue that replaces your{" "}
                  {formatMoney(result.annualSalary)} salary and covers your{" "}
                  {formatMoney(result.monthlyExpenses)}/mo expenses.
                </p>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <TrendingUp className="w-5 h-5 text-primary-light mb-2" />
                  <p className="text-white/50 text-xs mb-1">
                    At $29/mo pricing
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {result.customers29}{" "}
                    <span className="text-sm font-normal text-white/50">
                      customers
                    </span>
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <Rocket className="w-5 h-5 text-primary-light mb-2" />
                  <p className="text-white/50 text-xs mb-1">
                    At $9/mo pricing
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {result.customers9}{" "}
                    <span className="text-sm font-normal text-white/50">
                      customers
                    </span>
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <Calculator className="w-5 h-5 text-primary-light mb-2" />
                  <p className="text-white/50 text-xs mb-1">
                    Timeline ({hoursPerWeek} hrs/wk)
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {result.timelineMonths}{" "}
                    <span className="text-sm font-normal text-white/50">
                      months
                    </span>
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <Shield className="w-5 h-5 text-primary-light mb-2" />
                  <p className="text-white/50 text-xs mb-1">
                    Avg member invisibility score
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {result.invisibilityScore}
                    <span className="text-sm font-normal text-white/50">
                      /100 avg
                    </span>
                  </p>
                </div>
              </div>

              {/* ── WHAT HAPPENS IF YOU DO NOTHING (Brunson Ch 21) ── */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-4 text-center">
                <p className="text-white/40 text-[11px] uppercase tracking-wider font-semibold mb-2">
                  What Happens If You Do Nothing?
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  Nothing changes. You keep your job. You keep waiting for the IPO.{" "}
                  <strong className="text-white">6 months from now</strong>, you'll
                  still have the same salary, the same 0.5% equity, and{" "}
                  <strong className="text-amber-300">$0 in recurring revenue.</strong>{" "}
                  Except the founding price will be gone, and you'll wish you'd
                  locked it in today.
                </p>
              </div>

              <p className="text-white/70 mb-2">
                {emailDelivered ? (
                  <>
                    I just sent a detailed breakdown to{" "}
                    <strong className="text-white">{email}</strong> — including
                    your personalized exit timeline, the Amsterdam moment that
                    started everything, and the 5-tool system that gets you to{" "}
                    {formatMoney(result.freedomNumber)}/month.
                  </>
                ) : (
                  <>
                    Your detailed breakdown for{" "}
                    <strong className="text-white">{email}</strong> is queued —
                    your personalized exit timeline and the 5-tool system that
                    gets you to {formatMoney(result.freedomNumber)}/month.
                  </>
                )}
              </p>
              <p className="text-white/40 text-xs mb-4">
                But you don't need to wait. Here's your next step right now:
              </p>

              <div className="space-y-3 mt-6">
                <Link
                  to={addStealthBlueprint ? "/tripwire" : "/start"}
                  onClick={() =>
                    trackEvent("homepage_cta_clicked", { source: "squeeze_post_email" })
                  }
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 min-h-[52px]"
                >
                  {addStealthBlueprint ? "Get the $7 Blueprint + Start" : "Get All 5 Tools — $0.97/month"}
                </Link>
                <Link
                  to="/story"
                  className="w-full inline-flex items-center justify-center gap-2 text-primary-light hover:text-white transition-colors text-sm font-medium"
                >
                  Read my full story first →
                </Link>
              </div>

              <ShareableResult
                freedomNumber={`${formatMoney(result.freedomNumber)}/month MRR`}
              />
            </div>
          )}

          {/* ─── THE STORY: narrative moved below the calculator ─── */}
          <div className="max-w-lg mx-auto mt-16 pt-12 border-t border-white/10">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-6">The Story Behind This Calculator</p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 leading-tight">
              How Much Recurring Revenue Do You Actually Need to{" "}
              <span className="text-gradient-light">Walk Away?</span>
            </h2>

            <p className="text-lg sm:text-xl text-white/70 max-w-xl mx-auto mb-6">
              Not how much you <em>want</em>. What your specific salary, expenses, and hours-per-week{" "}
              <strong className="text-white">require</strong>. Takes 30 seconds.
            </p>

            <div className="max-w-sm mx-auto text-left mb-8 space-y-2.5">
              {[
                "The exact MRR that replaces <strong>your</strong> salary",
                "How many customers you need (at any price point)",
                "Your timeline based on <strong>your</strong> hours/week",
                "The stealth checklist members use to stay invisible",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check className="w-5 h-5 text-primary-light mt-0.5 shrink-0" />
                  <span className="text-white/70 text-sm" dangerouslySetInnerHTML={{ __html: item }} />
                </div>
              ))}
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 mb-8 max-w-lg mx-auto text-left">
              <p className="text-primary-light text-xs font-semibold uppercase tracking-wider mb-2">This is for someone like David</p>
              <p className="text-white/60 text-xs leading-relaxed">
                38. Senior Product Manager. $145K. 0.4% equity. Been telling himself "after the IPO" for 3 years.{" "}
                <strong className="text-white/80">He just ran this calculator. Now he knows the truth.</strong>
              </p>
            </div>

            <p className="text-white/40 text-xs italic mt-2">
              Because 6 months from now, you will either have the number — or you will still be guessing.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SqueezePage;
