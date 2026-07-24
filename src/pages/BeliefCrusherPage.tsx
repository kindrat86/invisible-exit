import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, X, Brain, Sparkles, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

/**
 * EXPERT SECRETS: Chapter 6 — The False Belief Patterns
 *
 * Russell: "Before someone buys, they have 3 false beliefs.
 * If you don't break all 3, they won't buy."
 *
 * This interactive page takes the prospect through each false belief:
 *   1. Present the belief
 *   2. Let them self-identify ("Do you believe this?")
 *   3. Break it with story + evidence
 *   4. Replace with new belief
 *   5. Move to next belief
 *
 * At the end, all 3 beliefs are crushed → they're ready for the offer.
 */

interface Belief {
  id: string;
  type: "Vehicle" | "Internal" | "External";
  icon: typeof Brain;
  color: string;
  falseBelief: string;
  selfIdentify: string;
  breakingStory: string;
  evidence: string[];
  newBelief: string;
  epiphany: string;
}

const BELIEFS: Belief[] = [
  {
    id: "vehicle",
    type: "The Vehicle Belief",
    icon: Brain,
    color: "text-red-500",
    falseBelief: "I need to quit my job to build something real.",
    selfIdentify: "Do you believe you can't start until you leave?",
    breakingStory:
      "I almost quit. Resignation letter drafted. Title: 'Resignation_Final_v3.docx.' Then I opened my bank statement: my salary was the only thing keeping me solvent while I built. If I quit, I'd need to raise $500K and give up 20% equity. My salary cost me nothing. That night I deleted the letter. I didn't quit. I built WITHIN my constraints — and built sustainable side revenue while staying employed.",
    evidence: [
      "Salary = non-dilutive runway (0% equity cost vs 20% for VC funding)",
      "Corporate skills (P&L, team management, execution) are exactly what solo founders lack",
      "5 hours/week constraint forces focus that 60-hour founders can't replicate",
      "Invisible Exit members are building while employed RIGHT NOW",
    ],
    newBelief: "My job IS the vehicle. It funds my build without dilution.",
    epiphany: "The vehicle isn't a startup. The vehicle is YOUR JOB.",
  },
  {
    id: "internal",
    type: "The Internal Belief",
    icon: Sparkles,
    color: "text-amber-500",
    falseBelief: "I don't have the skills to build a product.",
    selfIdentify: "Do you believe you're not 'technical enough'?",
    breakingStory:
      "I'm a Managing Director, not a developer. I can't write production code. But I can manage teams, read P&Ls, execute roadmaps, and navigate stakeholders. Those are the skills that matter. In 2025, code is a commodity — AI writes it, no-code assembles it. What's rare is operational excellence. What's rare is someone who can manage a P&L and execute under pressure. That's you. The technical part is the smallest piece. The system handles it.",
    evidence: [
      "AI + no-code tools handle 90% of technical implementation",
      "The Idea Pipeline filters specifically for no-code builds",
      "Jennifer L., Operations Manager, built a logistics SaaS with zero coding",
      "Your 15 years of management experience = the unfair advantage",
    ],
    newBelief: "My management skills ARE the skill. Code is a commodity.",
    epiphany: "The world has enough coders. It's desperately short on operators.",
  },
  {
    id: "external",
    type: "The External Belief",
    icon: Check,
    color: "text-blue-500",
    falseBelief: "If I build something, my employer will find out.",
    selfIdentify: "Do you fear your employer discovering your side business?",
    breakingStory:
      "Week 3. Team call. A colleague said: 'Hey, has anyone seen this website? It looks like something we'd build.' My blood ran cold for 3 seconds. Then I remembered: different name, different entity, different Stripe, different hosting. Zero connection to me. The call moved on. I've been building for 14 months. Zero detection. Not because I'm lucky — because the Triple-Separation Protocol makes detection mathematically impossible. When the system is right, getting caught isn't a risk. It's an impossibility.",
    evidence: [
      "Wyoming LLC = anonymous ownership, no public name disclosure",
      "Separate Stripe, hosting, domain, email = zero digital footprint overlap",
      "14 months of building with zero detection (including a near-miss)",
      "The Stealth Ops Hub automates a 47-point compliance audit",
    ],
    newBelief: "With the Triple-Separation Protocol, my employer cannot find out.",
    epiphany: "Anonymity isn't hiding. It's freedom to fail without consequences.",
  },
];

const BeliefCrusherPage = () => {
  const [step, setStep] = useState(0); // 0=intro, 1-3=beliefs, 4=complete
  const [beliefAnswers, setBeliefAnswers] = useState<Record<string, boolean>>({});

  const currentBelief = BELIEFS[step - 1];
  const beliefsCrushed = BELIEFS.filter((b) => beliefAnswers[b.id] !== undefined).length;

  const handleAnswer = (beliefId: string, believes: boolean) => {
    setBeliefAnswers({ ...beliefAnswers, [beliefId]: believes });
    trackEvent("belief_crusher_answered", { belief: beliefId, believed: believes });
  };

  const reset = () => {
    setStep(0);
    setBeliefAnswers({});
    trackEvent("belief_crusher_reset");
  };

  return (
    <div className="min-h-screen bg-[hsl(222_47%_11%)]">
      <SEOHead
        title="The Belief Crusher: 3 Lies Keeping You Trapped | Invisible Exit"
        description="Interactive tool that breaks the 3 false beliefs keeping corporate managers trapped: the vehicle, the internal skills, and the external fear. 3 minutes to freedom."
        url="/beliefs"
      />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 md:py-24">
        {/* Progress bar */}
        {step > 0 && step <= 3 && (
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1.5 rounded-full transition-all ${
                  n <= step ? "w-10 bg-primary" : "w-5 bg-white/15"
                }`}
              />
            ))}
          </div>
        )}

        {/* ── Intro ── */}
        {step === 0 && (
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 mb-8">
              <Brain className="w-8 h-8 text-primary-light" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              3 Beliefs Are{" "}
              <span className="text-gradient-light">Keeping You Trapped.</span>
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-3">
              Russell Brunson discovered that every person has exactly 3 false beliefs
              before they buy. If all 3 aren't broken, you stay stuck.
            </p>
            <p className="text-base text-white/50 max-w-lg mx-auto mb-10">
              This takes 3 minutes. I'll present each belief, you tell me if you
              believe it, and I'll break it with proof. At the end, you'll know
              exactly what's holding you back.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8 max-w-md mx-auto">
              <p className="text-white/50 text-sm mb-3 text-left">The 3 beliefs:</p>
              <div className="space-y-2 text-left">
                {BELIEFS.map((b, i) => (
                  <div key={b.id} className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold ${b.color}`}>
                      {i + 1}
                    </span>
                    <span className="text-white/70 text-sm">{b.type}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setStep(1); trackEvent("belief_crusher_started"); }}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 min-h-[52px]"
            >
              Break My Beliefs
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-white/30 text-xs mt-4">3 minutes. No email required.</p>
          </div>
        )}

        {/* ── Belief Steps ── */}
        {step >= 1 && step <= 3 && currentBelief && (
          <div className="animate-fade-in">
            {/* Belief header */}
            <div className="text-center mb-8">
              <span className={`inline-flex items-center gap-2 bg-white/5 border border-white/10 ${currentBelief.color} text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide`}>
                Belief {step} of 3: {currentBelief.type}
              </span>
            </div>

            {/* If user hasn't answered yet — show the false belief */}
            {beliefAnswers[currentBelief.id] === undefined && (
              <div className="text-center animate-fade-in">
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 sm:p-8 mb-8">
                  <p className="text-red-300 text-sm font-bold uppercase tracking-wide mb-3">
                    The False Belief
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white leading-tight mb-4">
                    "{currentBelief.falseBelief}"
                  </p>
                  <p className="text-white/50 text-sm">{currentBelief.selfIdentify}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAnswer(currentBelief.id, true)}
                    className="py-4 px-6 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 transition-all font-semibold text-sm"
                  >
                    Yes, I believe this
                  </button>
                  <button
                    onClick={() => handleAnswer(currentBelief.id, false)}
                    className="py-4 px-6 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-all font-semibold text-sm"
                  >
                    No, I don't
                  </button>
                </div>
              </div>
            )}

            {/* After answering — show the breaking story */}
            {beliefAnswers[currentBelief.id] !== undefined && (
              <div className="animate-fade-in">
                {/* Acknowledge */}
                <div className="text-center mb-6">
                  <p className="text-white/50 text-sm mb-2">
                    {beliefAnswers[currentBelief.id]
                      ? "I believed this too. Here's what changed my mind:"
                      : "Good. But let me show you why this belief exists — and how to eliminate it permanently:"}
                  </p>
                </div>

                {/* Breaking story */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-6">
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    {currentBelief.breakingStory}
                  </p>

                  {/* Evidence */}
                  <div className="space-y-2 mb-4">
                    {currentBelief.evidence.map((ev, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span className="text-white/60 text-xs">{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* New belief */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 mb-8 text-center">
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-wide mb-2">
                    The New Belief
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-white leading-tight mb-3">
                    "{currentBelief.newBelief}"
                  </p>
                  <p className="text-emerald-300 text-sm font-medium">
                    {currentBelief.epiphany}
                  </p>
                </div>

                {/* Next button */}
                <button
                  onClick={() => {
                    if (step < 3) {
                      setStep(step + 1);
                    } else {
                      setStep(4);
                      trackEvent("belief_crusher_completed");
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 min-h-[52px]"
                >
                  {step < 3 ? "Next Belief →" : "See All 3 Broken →"}
                  {step < 3 && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Complete ── */}
        {step === 4 && (
          <div className="text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-success" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              All 3 Beliefs — <span className="text-gradient-light">Broken.</span>
            </h2>
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-8">
              You no longer need motivation. You need a system. When all 3 beliefs
              shift, the only thing standing between you and freedom is a 90-second
              calculation.
            </p>

            {/* Summary */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 max-w-md mx-auto text-left">
              <p className="text-white/50 text-xs uppercase tracking-wide mb-3 font-bold">Your new beliefs:</p>
              <div className="space-y-3">
                {BELIEFS.map((b, i) => (
                  <div key={b.id} className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-success/15 text-success text-xs shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <p className="text-white/40 text-[10px] uppercase tracking-wide">{b.type}</p>
                      <p className="text-white text-sm font-medium">{b.newBelief}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/freedom"
              onClick={() => trackEvent("belief_crusher_cta_clicked")}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 min-h-[52px]"
            >
              Calculate Your Freedom Number (Free)
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-white/40 text-xs mt-4">90 seconds. No credit card. The system starts here.</p>

            <button
              onClick={reset}
              className="mt-8 inline-flex items-center gap-1.5 text-white/30 hover:text-white/50 transition-colors text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Go through it again
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BeliefCrusherPage;
