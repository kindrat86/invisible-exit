import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  TrendingDown,
  Clock,
  Lock,
  ArrowRight,
  Check,
  Calculator,
  ShieldQuestion,
  Lightbulb,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

/**
 * TRAFFIC SECRETS: Secret #19 — Cold Traffic Bridge
 *
 * Russell Brunson: "If someone is NOT aware of your product or even
 * the desire itself, your headline starts with the PROBLEM."
 *
 * This page is designed for the COLDEST traffic: people who are
 * stressed about their job but haven't even considered that building
 * a side business is possible. They're 6+ months before becoming our
 * dream customer.
 *
 * Cold Traffic Avatar:
 *   - Feels stuck but can't articulate why
 *   - Blames themselves, not the system
 *   - Has never searched "side business" or "passive income"
 *   - Thinks entrepreneurs are a different species
 *   - Believes loyalty will be rewarded
 *
 * Bridge: Problem Awareness → Desire Crystallization → Our Solution
 */

const PROBLEM_SIGNALS = [
  {
    text: "You checked work email before getting out of bed this morning",
    feeling: "Anxiety before the day even starts",
  },
  {
    text: "Your bonus this year was good, but it didn't change your life",
    feeling: "The golden handcuffs feel tighter, not looser",
  },
  {
    text: "You've said 'next year will be different' 3+ times",
    feeling: "Hope稀释 — dilution of hope with each repetition",
  },
  {
    text: "You can't remember the last time you felt excited on a Sunday night",
    feeling: "Sunday dread has become your baseline state",
  },
  {
    text: "You make more than your parents ever did, and somehow still feel broke",
    feeling: "Lifestyle inflation ate your raises",
  },
  {
    text: "You've thought about quitting, but 'it's not that bad'",
    feeling: "Comfortable misery is still misery",
  },
];

const FALSE_BELIEFS = [
  {
    belief: "\"I'm lucky to have this job.\"",
    bridge:
      "Your employer is lucky to have you. You generate 3-5x your salary in value. The gap between what you produce and what you keep is the cost of not having your own income stream.",
  },
  {
    belief: "\"Starting something takes too much time.\"",
    bridge:
      "It takes 5 focused hours per week. Less than one Netflix binge. The question isn't whether you have time — it's whether you're willing to redirect 5 hours from consuming to building.",
  },
  {
    belief: "\"I don't have an entrepreneur personality.\"",
    bridge:
      "Neither did 90% of people who now run profitable side businesses. Entrepreneurship isn't a personality type — it's a skill set. Your corporate skills (project management, stakeholder communication, data analysis) are exactly what solo founders lack.",
  },
  {
    belief: "\"What if my employer finds out?\"",
    bridge:
      "Thousands of employed professionals run side businesses without their employers knowing. Separate entity. Separate name. Separate bank account. It's not paranoid — it's professional.",
  },
  {
    belief: "\"I should be grateful. Other people have it worse.\"",
    bridge:
      "Gratitude for your job and building your own income stream aren't opposites. You can appreciate your salary AND recognize it's one income stream, not your identity. The most grateful people are the ones with options.",
  },
];

const AWARENESS_LADDER = [
  {
    stage: "Most Unaware",
    state: "I feel stuck but can't name why",
    bridgedBy: "You're on this page right now",
  },
  {
    stage: "Problem Aware",
    state: "I know I'm trapped by the golden handcuffs",
    bridgedBy: "The equity math breakdown",
  },
  {
    stage: "Solution Aware",
    state: "I know I need a side income, but how?",
    bridgedBy: "The Freedom Number Calculator",
  },
  {
    stage: "Product Aware",
    state: "I've seen the 5 tools — are they right for me?",
    bridgedBy: "The Free Masterclass",
  },
  {
    stage: "Most Aware",
    state: "I'm ready to start building my exit",
    bridgedBy: "Start for $0.97/month",
  },
];

const ColdTrafficBridgePage = () => {
  const [checkedSignals, setCheckedSignals] = useState<number[]>([]);
  const [showBridge, setShowBridge] = useState(false);

  const toggleSignal = (idx: number) => {
    setCheckedSignals((prev) => {
      const next = prev.includes(idx)
        ? prev.filter((i) => i !== idx)
        : [...prev, idx];
      if (next.length >= 3 && !showBridge) {
        setShowBridge(true);
        trackEvent("cold_traffic_bridge_unlocked", {
          signals_checked: next.length,
        });
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Do You Feel Stuck in Your Career? (You're Not Crazy) | Invisible Exit"
        description="If you've ever felt trapped by a good job — salary too comfortable to leave, equity that never materializes, Sunday dread you can't explain — this is for you."
        url="/feeling-stuck"
      />
      <Navbar />

      {/* Hero — Problem-First (for cold traffic) */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <AlertCircle className="w-4 h-4" />
            Not a sales page. Not a pitch. Just a question.
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Do you feel stuck —
            <br />
            <span className="text-blue-400">but can't explain why?</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            You have a good salary. A respectable title. Benefits. On paper,
            you've made it. And yet, there's this feeling you can't shake. A
            quiet voice that says: <em>"Is this it? Is this the next 30 years?"</em>
          </p>
          <p className="text-white/40 mt-4 text-sm">
            You're not broken. You're not ungrateful. You're just starting to
            notice the cage.
          </p>
        </div>
      </section>

      {/* Problem Signals — Interactive Checklist */}
      <section className="section py-16">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Check the ones that feel familiar:
            </h2>
            <p className="text-white/50 text-sm">
              Be honest. Nobody's watching.
            </p>
          </div>

          <div className="grid gap-3 max-w-2xl mx-auto">
            {PROBLEM_SIGNALS.map((signal, idx) => (
              <button
                key={idx}
                onClick={() => toggleSignal(idx)}
                className={`flex items-start gap-4 p-5 rounded-xl border text-left transition-all ${
                  checkedSignals.includes(idx)
                    ? "bg-blue-500/10 border-blue-500/30"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <div
                  className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    checkedSignals.includes(idx)
                      ? "bg-blue-500 border-blue-500"
                      : "border-white/20"
                  }`}
                >
                  {checkedSignals.includes(idx) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      checkedSignals.includes(idx) ? "text-white" : "text-white/70"
                    }`}
                  >
                    {signal.text}
                  </p>
                  {checkedSignals.includes(idx) && (
                    <p className="text-blue-400/60 text-sm mt-1 italic">
                      → {signal.feeling}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {checkedSignals.length > 0 && (
            <div className="text-center mt-6">
              <p className="text-white/50 text-sm">
                {checkedSignals.length} checked
                {checkedSignals.length >= 3 &&
                  " — keep reading. This page was written for you."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* The Bridge — Desire Crystallization */}
      {showBridge && (
        <section className="section py-16 bg-gradient-to-b from-transparent to-blue-950/20">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <Lightbulb className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Here's what nobody has told you:
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
                The feeling isn't a sign that something is wrong with you. It's a
                sign that you're waking up to something. The cage isn't your job —
                it's the belief that your salary is the only way to earn.
              </p>
            </div>

            {/* False Belief Bridge */}
            <div className="grid gap-4 max-w-3xl mx-auto mb-12">
              {FALSE_BELIEFS.map((fb, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-white/5 p-6"
                >
                  <p className="text-white/40 font-medium mb-3 text-sm">
                    {fb.belief}
                  </p>
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-white/70 leading-relaxed">{fb.bridge}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* The Shift */}
            <div className="max-w-2xl mx-auto rounded-2xl border border-blue-500/20 bg-blue-500/5 p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-3">
                The shift that changes everything:
              </h3>
              <p className="text-2xl text-blue-400 font-semibold mb-2">
                Your salary isn't your worth.
              </p>
              <p className="text-xl text-white/60">
                It's one income stream.
              </p>
              <p className="text-white/40 text-sm mt-4 leading-relaxed">
                The moment you build a second income stream — even $9/month from a
                stranger — something shifts. You stop feeling dependent. You start
                thinking like an owner. The cage doesn't disappear, but you see
                the door.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Awareness Ladder — Where are you? */}
      <section className="section py-16">
        <div className="container-narrow">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
            Where are you on the awareness ladder?
          </h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {AWARENESS_LADDER.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{step.stage}</p>
                  <p className="text-white/50 text-sm italic">"{step.state}"</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-400/60 text-xs">{step.bridgedBy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Warm, not aggressive */}
      <section className="section py-16 bg-gradient-to-b from-blue-950/20 to-transparent">
        <div className="container-narrow text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            If you checked 3 or more, here's your next step:
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            Don't start a business. Don't quit your job. Don't even sign up for
            anything yet. Just calculate one number — your Freedom Number. It
            takes 2 minutes and it will tell you exactly how far you are from the
            door.
          </p>
          <Link
            to="/freedom"
            onClick={() => trackEvent("cold_traffic_bridge_cta_click")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
          >
            <Calculator className="w-5 h-5" />
            Calculate My Freedom Number
          </Link>
          <p className="text-white/30 text-sm mt-4">
            Free. No email required. No pitch on the next page.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ColdTrafficBridgePage;
