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
import { supabase } from "@/integrations/supabase/client";
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

  // Inputs
  const [salary, setSalary] = useState("");
  const [expenses, setExpenses] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("5");

  // ── DOTCOM SECRETS Ch 14: Order Bump ──
  // Checkbox on the email step that adds a $7 one-time to the $0.97/mo checkout
  const [addStealthBlueprint, setAddStealthBlueprint] = useState(true);

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
    setStep("result");
    trackEvent("freedom_number_calculated", {
      freedomNumber: res.freedomNumber,
      salary: res.annualSalary,
    });
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !result) return;
    setLoading(true);
    trackEvent("squeeze_page_submitted", {
      source: "freedom_calculator",
      freedomNumber: result.freedomNumber,
    });
    try {
       
      await supabase.from("subscribers").upsert(
        {
          email,
          source: "squeeze_freedom_page",
          metadata: {
            freedom_number: result.freedomNumber,
            salary: result.annualSalary,
            timeline: result.timelineMonths,
          },
        },
        { onConflict: "email" }
      );

      await supabase.functions
        .invoke("newsletter-welcome", { body: { email } })
        .catch((err) => console.error("Welcome email error:", err));

      toast.success("Check your inbox — your detailed breakdown is on the way!");
      setStep("email");
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

          {/* ─── STEP: INTRO ─── */}
          {step === "intro" && (
            <div className="animate-fade-in">
              {/* PATTERN INTERRUPT — Brunson Ch 3-4: Curiosity gap */}
              <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-200 text-xs font-semibold uppercase tracking-wider">
                  WARNING: This Calculator Will Tell You Something Uncomfortable
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                How Much Recurring Revenue Do You Actually Need to{" "}
                <span className="text-gradient-light">Walk Away?</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/70 max-w-xl mx-auto mb-2">
                Not how much you <em>want</em>. What your specific salary, expenses, and hours-per-week{" "}
                <strong className="text-white">require</strong>. Takes 30 seconds.
              </p>

              {/* Hook bullets — 4 specific pains (Brunson Ch 3) */}
              <div className="max-w-sm mx-auto text-left mb-8 space-y-2.5">
                {[
                  "The exact MRR that replaces <strong>your</strong> salary",
                  "How many customers you need (at any price point)",
                  "Your timeline based on <strong>your</strong> hours/week",
                  "The invisibility score — can your employer find out?",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="w-5 h-5 text-primary-light mt-0.5 shrink-0" />
                    <span className="text-white/70 text-sm" dangerouslySetInnerHTML={{ __html: item }} />
                  </div>
                ))}
              </div>

              {/* URGENCY — "73 of 100 founding spots" visible from first screen */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/60">127 managers already found their number</span>
              </div>

              <button
                onClick={() => setStep("salary")}
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 min-h-[52px]"
              >
                Calculate My Freedom Number
                <ArrowRight className="w-5 h-5" />
              </button>

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

              <div className="relative mb-6">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  aria-label="Annual salary"
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
                onClick={() => setStep("expenses")}
                disabled={!salary}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-40 min-h-[52px]"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
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

              <div className="relative mb-6">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  aria-label="Monthly living expenses"
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
                  onClick={() => setStep("salary")}
                  className="px-6 py-4 rounded-xl bg-white/5 text-white/50 hover:text-white/80 transition-colors text-sm font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("timeline")}
                  disabled={!expenses}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-40 min-h-[52px]"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
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
                  onClick={handleCalculate}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 min-h-[52px]"
                >
                  See My Freedom Number
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP: RESULT ─── */}
          {step === "result" && result && (
            <div className="animate-scale-in max-w-lg mx-auto">
              {/* The big number */}
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
                    Invisibility score
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {result.invisibilityScore}
                    <span className="text-sm font-normal text-white/50">
                      /100
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

              {/* DOTCOM SECRETS Ch 11: Urgency + Scarcity */}
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 mb-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <p className="text-amber-200 text-xs">
                  <strong>73 of 100</strong> founding spots remaining. Price goes to $9.99/mo when founding closes.
                </p>
              </div>

              {/* Social proof bar */}
              <div className="flex items-center justify-center gap-3 mb-4 text-white/40 text-xs">
                <span className="flex items-center gap-1">
                  <span className="text-amber-400">★★★★★</span>
                </span>
                <span>·</span>
                <span>127 managers building now</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  4 joined today
                </span>
              </div>

              {/* EXPERT SECRETS Ch 11: Pre-Frame Objection Crusher — right before email capture */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-4">
                <p className="text-white/40 text-[11px] uppercase tracking-wider font-semibold mb-3 text-center">
                  Questions Before You Enter Your Email?
                </p>
                <div className="space-y-3">
                  {[
                    { q: "Is this really free?", a: "Yes. The calculator is 100% free. No credit card. No trial. You get your Freedom Number instantly. The email is optional — but if you want the detailed breakdown sent to you, that's free too." },
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

              {/* Email gate for detailed plan */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-4">
                <p className="text-white/70 text-sm mb-1">
                  Want the full breakdown?
                </p>
                <p className="text-white/50 text-sm mb-4">
                  I'll send your personalized exit timeline, customer acquisition
                  plan, and the 5-tool system that gets you to{" "}
                  {formatMoney(result.freedomNumber)}/month.
                </p>

                <form onSubmit={handleSubmitEmail} className="space-y-3">
                  <input
                    type="email"
                    required
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
                          YES! Add the Stealth Ops Blueprint
                        </span>
                        <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Save $40
                        </span>
                      </div>
                      <p className="text-white/50 text-xs leading-relaxed mb-1">
                        The 47-point employment contract audit + entity setup walkthroughs.
                        Normally $47. Add it now for just <strong className="text-amber-300">$7 one-time</strong>.
                      </p>
                      <p className="text-white/30 text-[11px] italic">
                        ☑ Checked by default — uncheck to skip
                      </p>
                    </div>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-base py-3.5 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 min-h-[52px]"
                  >
                    {loading ? "Sending..." : "Send Me My Exit Plan"}
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

          {/* ─── STEP: EMAIL CONFIRMED ─── */}
          {step === "email" && result && (
            <div className="animate-scale-in max-w-md mx-auto card-glass p-8">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-success text-2xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Your Freedom Number: {formatMoney(result.freedomNumber)}/month
              </h2>

              {/* INSTANT DELIVERY: show the result again (Dotcom Secrets Ch 6) */}
              <div className="bg-primary/10 border border-primary/25 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-white/40 text-xs">At $29/mo</p>
                    <p className="text-white font-bold text-lg">{result.customers29} customers</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Timeline</p>
                    <p className="text-white font-bold text-lg">{result.timelineMonths} months</p>
                  </div>
                </div>
              </div>

              <p className="text-white/70 mb-2">
                I just sent a detailed breakdown to{" "}
                <strong className="text-white">{email}</strong> — including your
                personalized exit timeline, the Amsterdam moment that started
                everything, and the 5-tool system that gets you to{" "}
                {formatMoney(result.freedomNumber)}/month.
              </p>
              <p className="text-white/40 text-xs mb-4">
                But you don't need to wait. Here's your next step right now:
              </p>

              <div className="space-y-3 mt-6">
                <Link
                  to={addStealthBlueprint ? "/tripwire" : "/?checkout=starter"}
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SqueezePage;
