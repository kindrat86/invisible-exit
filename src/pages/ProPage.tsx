import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Users, Video, FileText, MessageSquare, TrendingUp, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const INCLUDES = [
  {
    icon: Users,
    title: "Full Inner Circle Access",
    description: "Private community of corporate managers building invisible businesses. Weekly office hours, MRR leaderboard, accountability partners.",
    value: "$49/month",
  },
  {
    icon: Video,
    title: "Weekly Group Coaching Calls",
    description: "Live 60-minute group sessions with Adrian. Hot-seat reviews, Q&A, strategy breakdowns. All calls recorded and archived.",
    value: "$199/month",
  },
  {
    icon: FileText,
    title: "Idea Validation Reports",
    description: "Submit up to 3 ideas/month. Get a written validation report with market sizing, pricing research, and go/no-go recommendation.",
    value: "$150/month",
  },
  {
    icon: MessageSquare,
    title: "Priority Slack Access",
    description: "Direct Slack channel to Adrian and the community. Responses within 12 hours. No question is too small.",
    value: "$99/month",
  },
  {
    icon: TrendingUp,
    title: "Monthly MRR Audit",
    description: "Submit your dashboard. Get a personalized monthly review with specific recommendations to increase MRR, reduce churn, and optimize pricing.",
    value: "$199/month",
  },
  {
    icon: Star,
    title: "All 5 Core Tools (Included)",
    description: "FYM Dashboard, Idea Pipeline, Stealth Ops Hub, Launch Control, Brand Manager. Everything in the $0.97 plan, included.",
    value: "$12/month",
  },
];

const COMPARISON = [
  { feature: "5 AI Tools (FYM, Pipeline, Stealth, Launch, Brand)", starter: true, pro: true, founding: true },
  { feature: "Email sequence (17 stories)", starter: true, pro: true, founding: true },
  { feature: "Private community access", starter: false, pro: true, founding: false },
  { feature: "Weekly group coaching calls", starter: false, pro: true, founding: false },
  { feature: "Idea validation reports (3/mo)", starter: false, pro: true, founding: false },
  { feature: "Priority Slack access", starter: false, pro: true, founding: false },
  { feature: "Monthly MRR audit", starter: false, pro: true, founding: false },
  { feature: "Lifetime price lock", starter: false, pro: false, founding: true },
  { feature: "Founding member badge", starter: false, pro: false, founding: true },
];

const FAQS = [
  {
    q: "How is Pro different from the $0.97 starter plan?",
    a: "Starter is DIY — you get the 5 tools and email sequence, but you're on your own. Pro is done-with-others: weekly coaching calls, community access, idea validation reports, and monthly MRR audits. You get direct access to Adrian and a community of peers.",
  },
  {
    q: "How is Pro different from the $2,000 Intensive?",
    a: "The Intensive is 1-on-1 with Adrian for 90 days. Pro is group-based and ongoing. The Intensive includes a custom stealth audit, idea sprint, and launch review — all personalized to you. Pro gives you ongoing access at a fraction of the cost.",
  },
  {
    q: "Can I upgrade from Starter to Pro later?",
    a: "Yes, anytime. Your existing subscription is prorated. The $47/month kicks in on your next billing cycle. No setup fees.",
  },
  {
    q: "What if I join and it's not worth it?",
    a: "30-day money-back guarantee. If you attend one coaching call, submit one idea, and don't find it 10x more valuable than the $0.97 plan, email 'refund' and get every cent back.",
  },
  {
    q: "When are the coaching calls?",
    a: "Tuesdays at 7 PM CET (1 PM ET) and Thursdays at 12 PM CET (6 AM PT). Attend either. All calls recorded. Submit questions in advance via Slack.",
  },
];

const ProPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [appStep, setAppStep] = useState(0);
  const [situation, setSituation] = useState("");
  const [paymentPlan, setPaymentPlan] = useState<"monthly" | "annual">("monthly");

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    trackEvent("intensive_applied", { source: "pro_page" });
    try {
      await supabase
        .from("subscribers")
        .upsert(
          {
            email,
            source: "pro_page_application",
            metadata: {
              situation,
              payment_plan: paymentPlan,
            },
          },
          { onConflict: "email" }
        );
      setApplied(true);
      toast.success("Application received! Check your email within 48 hours.");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Invisible Exit Pro — Group Coaching + Community ($47/month)"
        description="Weekly group coaching with Adrian, private community access, idea validation reports, and monthly MRR audits. For managers who want done-with-others support. $47/month."
        url="/pro"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Star className="w-4 h-4" />
            The Middle Ground
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Not DIY. Not $2,000.
            <br />
            <span className="text-gradient-light">Done-With-Others.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-4">
            Weekly coaching. Private community. Idea validation. MRR audits.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto mb-10">
            For managers who want more than tools — but don't need 1-on-1 coaching (yet).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-white/50 text-sm mb-2">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> Community access
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Video className="w-4 h-4" /> Weekly calls
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> Priority Slack
            </span>
          </div>
        </div>
      </section>

      {/* Value Stack */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">What's Included</p>
            <h2 className="text-h1 text-foreground mb-4">Everything in Pro</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {INCLUDES.map((item) => (
              <div key={item.title} className="card-base p-6 sm:p-8 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-h3 text-foreground">{item.title}</h3>
                      <span className="text-sm font-bold text-primary shrink-0">{item.value}</span>
                    </div>
                    <p className="text-caption">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Total Value */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">The Math</p>
          <h2 className="text-h1 text-foreground mb-4">Total Value: $708/month</h2>
          <div className="max-w-lg mx-auto space-y-3 mb-8">
            {INCLUDES.map((item) => (
              <div key={item.title} className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">{item.title}</span>
                <span className="text-sm text-muted-foreground">{item.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-4 border-t-2 border-border">
              <span className="text-muted-foreground">Total individual value:</span>
              <span className="text-muted-foreground line-through">$708/month</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground font-semibold text-lg">Your price:</span>
              <span className="text-4xl sm:text-5xl font-bold text-primary">$47<span className="text-lg font-normal text-muted-foreground">/mo</span></span>
            </div>
            <p className="text-caption text-center mt-4">
              That's $8,496/year in value for $564/year. Save 93% vs. individual pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">Compare Plans</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">Which Tier Is Right for You?</h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-2xl mx-auto">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">Feature</th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-muted-foreground">$0.97</th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-primary bg-primary/5">$47 Pro</th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-muted-foreground">$17.99</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-border">
                    <td className="py-3 px-4 text-sm text-foreground">{row.feature}</td>
                    <td className="text-center py-3 px-4">
                      {row.starter ? <Check className="w-4 h-4 text-success mx-auto" /> : <span className="text-muted-foreground/30">—</span>}
                    </td>
                    <td className="text-center py-3 px-4 bg-primary/5">
                      {row.pro ? <Check className="w-4 h-4 text-success mx-auto" /> : <span className="text-muted-foreground/30">—</span>}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.founding ? <Check className="w-4 h-4 text-success mx-auto" /> : <span className="text-muted-foreground/30">—</span>}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-border">
                  <td className="py-4 px-4"></td>
                  <td className="text-center py-4 px-4">
                    <Link to="/freedom" className="text-xs font-medium text-muted-foreground hover:text-primary">Start →</Link>
                  </td>
                  <td className="text-center py-4 px-4 bg-primary/5">
                    <span className="text-xs font-bold text-primary">Apply below →</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <Link to="/oto/founding" className="text-xs font-medium text-muted-foreground hover:text-primary">Join →</Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface section-normal border-t border-border">
        <div className="container-narrow">
          <h2 className="text-h1 text-foreground mb-8 text-center">Questions</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {FAQS.map((faq) => (
              <div key={faq.q} className="card-base p-6">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-caption">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-4">Apply for Pro</h2>
          <p className="text-body text-white/60 mb-6 max-w-xl mx-auto">
            Limited to 50 Pro members to keep coaching calls personal.
            Applications reviewed within 48 hours.
          </p>

          {/* DOTCOM SECRETS Ch 16: Payment Plan Toggle */}
          {!applied && (
            <div className="max-w-md mx-auto mb-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex gap-2">
                <button
                  onClick={() => setPaymentPlan("monthly")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                    paymentPlan === "monthly"
                      ? "bg-primary text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  $47/month
                  <span className="block text-xs font-normal opacity-80">Cancel anytime</span>
                </button>
                <button
                  onClick={() => setPaymentPlan("annual")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                    paymentPlan === "annual"
                      ? "bg-primary text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  $470/year
                  <span className="block text-xs font-normal opacity-80">Save $94/year</span>
                </button>
              </div>
            </div>
          )}

          {!applied ? (
            <form onSubmit={handleApply} className="max-w-md mx-auto">
              {/* DOTCOM SECRETS Ch 8: Qualify Backend Buyers — multi-step form */}
              {appStep === 0 && (
                <div className="animate-fade-in">
                  <p className="text-white/40 text-xs mb-2 text-center">Step 1 of 3</p>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your best email"
                    className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 py-4 px-5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4 min-h-[52px]"
                  />
                  <button
                    type="button"
                    onClick={() => email && setAppStep(1)}
                    disabled={!email}
                    className="btn-primary w-full text-lg disabled:opacity-40"
                  >
                    Continue →
                  </button>
                </div>
              )}

              {appStep === 1 && (
                <div className="animate-fade-in">
                  <p className="text-white/40 text-xs mb-3 text-center">Step 2 of 3</p>
                  <p className="text-white/60 text-sm font-medium mb-4">What's your current situation?</p>
                  <div className="space-y-2 mb-4">
                    {[
                      { val: "employed", label: "Employed — building on the side" },
                      { val: "thinking", label: "Thinking about starting — need a system" },
                      { val: "started", label: "Already started — need help scaling" },
                      { val: "other", label: "Something else" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => { setSituation(opt.val); setAppStep(2); }}
                        className={`w-full py-3 px-4 rounded-lg text-left text-sm transition-all ${
                          situation === opt.val
                            ? "bg-primary text-white"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setAppStep(0)}
                    className="text-white/40 hover:text-white/60 text-xs py-2"
                  >
                    ← Back
                  </button>
                </div>
              )}

              {appStep === 2 && (
                <div className="animate-fade-in">
                  <p className="text-white/40 text-xs mb-3 text-center">Step 3 of 3</p>
                  <p className="text-white/60 text-sm font-medium mb-4">
                    {paymentPlan === "annual" ? "Lock in $470/year — save $94" : "Confirm $47/month"}
                  </p>
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-4 text-center">
                    <p className="text-white/50 text-xs">Your plan</p>
                    <p className="text-white font-bold text-lg">{paymentPlan === "annual" ? "$470/year" : "$47/month"}</p>
                    {paymentPlan === "annual" && <p className="text-primary-light text-xs">You save $94 vs monthly</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full text-lg"
                  >
                    {loading ? "Submitting..." : `Apply for Pro — ${paymentPlan === "annual" ? "$470/year" : "$47/month"}`}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </button>
                  <p className="text-white/40 text-xs mt-3">
                    30-day money-back guarantee. Cancel anytime.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAppStep(1)}
                    className="text-white/40 hover:text-white/60 text-xs py-2"
                  >
                    ← Back
                  </button>
                </div>
              )}
            </form>
          ) : (
            <div className="max-w-md mx-auto card-glass p-8 animate-scale-in">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Application Received</h3>
              <p className="text-white/70 text-sm mb-4">
                You'll receive a payment link and onboarding details within 48 hours.
              </p>
              <Link to="/" className="text-primary-light hover:text-white text-sm transition-colors">
                ← Back to homepage
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProPage;
