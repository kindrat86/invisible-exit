import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Check,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

/**
 * DOTCOM SECRETS: "The Ask Campaign"
 * Russell Brunson's concept: ask your audience what they want, then build it.
 * This creates:
 *   1. Market research (what content/products to build next)
 *   2. Engagement (people invest when they're heard)
 *   3. Content generation (FAQs become blog posts, courses, etc.)
 */
const AskCampaignPage = () => {
  const [question, setQuestion] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const CATEGORIES = [
    { id: "stealth", label: "Staying invisible / employer detection", icon: HelpCircle },
    { id: "ideas", label: "Finding & validating micro-SaaS ideas", icon: Lightbulb },
    { id: "building", label: "Building without coding skills", icon: Check },
    { id: "launch", label: "Launching & getting first customers", icon: TrendingUp },
    { id: "legal", label: "Legal: non-compete, IP, entity setup", icon: Check },
    { id: "time", label: "Time management with 5 hrs/week", icon: Check },
    { id: "pricing", label: "Pricing & revenue models", icon: TrendingUp },
    { id: "other", label: "Something else entirely", icon: MessageCircle },
  ];

  const POPULAR_QUESTIONS = [
    "How do I know if my specific employment contract allows this?",
    "What if I'm in a country where LLCs don't exist?",
    "How do I find customers without showing my face or using LinkedIn?",
    "Can I do this if I'm already on a PIP (performance improvement plan)?",
    "What's the actual tech stack for someone who can't code?",
    "How do I handle taxes from my side business?",
    "What if my spouse doesn't support me building something?",
    "How long until I replace a $200K salary specifically?",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !email) return;
    setLoading(true);
    trackEvent("ask_campaign_submitted", {
      category,
      question_length: question.length,
    });
    try {
      await supabase.from("feature_requests").insert({
        title: question,
        description: `Ask Campaign submission. Category: ${category || "general"}`,
        email,
        source: "ask_campaign",
      });
      setSubmitted(true);
      toast.success("Question submitted! I'll answer it in an upcoming email.");
    } catch (err) {
      // Fallback to subscribers table
      try {
        await supabase.from("subscribers").upsert({
          email,
          source: "ask_campaign",
          metadata: { question, category },
        }, { onConflict: "email" });
        setSubmitted(true);
        toast.success("Question received!");
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(222_47%_11%)]">
      <SEOHead
        title="Ask Adrian Anything | Invisible Exit"
        description="What's your #1 biggest question about building a side business while employed? Submit your question and Adrian will answer it personally."
        url="/ask"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <MessageCircle className="w-4 h-4" />
            Ask Campaign
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            What's Your{" "}
            <span className="text-gradient-light">#1 Biggest Question</span>{" "}
            About Building a Side Business While Employed?
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-4">
            No question is too basic. No question is too specific.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto mb-8">
            I read every question personally. The most common ones become blog posts,
            masterclass slides, and sometimes entire tools. This is how I decide what to build next.
          </p>
        </div>
      </section>

      {/* ── Ask Form ── */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-foreground font-semibold text-sm mb-3">
                  Which area is your question about?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${
                        category === cat.id
                          ? "bg-primary/10 border-primary/40 text-primary"
                          : "bg-surface border-border text-muted-foreground hover:border-primary/20"
                      }`}
                    >
                      <cat.icon className="w-5 h-5" />
                      <span className="text-xs font-medium leading-tight">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question */}
              <div>
                <label className="block text-foreground font-semibold text-sm mb-2">
                  Your #1 biggest question:
                </label>
                <textarea
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  placeholder="Be as specific as possible. The more detail you give, the better I can help."
                  className="w-full rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground py-4 px-5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {question.length} characters
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-foreground font-semibold text-sm mb-2">
                  Where should I send my answer?
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground py-4 px-5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg"
              >
                {loading ? "Submitting..." : "Submit My Question"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>

              <p className="text-center text-muted-foreground text-xs">
                I'll never share your question publicly without permission. No spam, ever.
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto text-center card-base p-8 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Got it. Thank you.
              </h2>
              <p className="text-muted-foreground mb-6">
                I read every question. If yours is one of the most common, I'll answer it
                in an upcoming email or blog post. Either way, you'll hear from me.
              </p>
              <div className="space-y-3">
                <Link
                  to="/freedom"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 px-6 rounded-xl transition-all"
                >
                  Calculate Your Freedom Number (Free)
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/story"
                  className="block text-center text-primary hover:text-primary-hover text-sm font-medium"
                >
                  Read my full story →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Popular Questions ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <div className="text-center mb-10">
            <p className="text-eyebrow text-primary mb-3">Most Asked Questions</p>
            <h2 className="text-h2 text-foreground mb-4">
              What Others Are Asking
            </h2>
            <p className="text-body text-muted-foreground max-w-xl mx-auto">
              These are real questions from managers like you. Tap any to use it as your own.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {POPULAR_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuestion(q);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-left card-base p-4 card-hover group"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-foreground">{q}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why I Ask ── */}
      <section className="bg-white section-normal">
        <div className="container-narrow max-w-2xl">
          <p className="text-eyebrow text-primary mb-3 text-center">Why This Matters</p>
          <div className="space-y-4 text-body text-muted-foreground">
            <p>
              Russell Brunson teaches the <strong className="text-foreground">Ask Campaign</strong>:
              the fastest way to know what your audience wants is to ask them.
            </p>
            <p>
              Every question you submit shapes what I build next. The 47-point contract audit
              checklist came from a manager who asked about IP assignment clauses. The faceless
              brand builder came from someone who couldn't risk LinkedIn exposure.
            </p>
            <p>
              Your question might become the next tool. Or the next blog post. Or the answer
              that helps 100 other managers who are too afraid to ask.
            </p>
            <p className="text-foreground font-medium">
              So ask. I'm listening.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AskCampaignPage;
