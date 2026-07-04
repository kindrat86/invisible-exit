import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Shield, Users, Lock, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

/**
 * EXPERT SECRETS: Chapter 14 — Tribal Identity / Belonging Rituals
 *
 * Russell: "Belonging isn't just about being in a group.
 * It's about the ritual of joining. The moment of commitment."
 *
 * This page creates a joining ceremony:
 *   1. The Declaration — visitor publicly commits (checkboxes)
 *   2. The Code — 5 principles they agree to live by
 *   3. The Badge — they receive their Invisible Builder identity
 *   4. The First Step — they're guided to the freedom calculator
 *
 * This transforms "signing up for a newsletter" into "joining a movement."
 */

const DECLARATIONS = [
  "I believe my employment is a transaction, not a bond of loyalty.",
  "I believe my salary is runway funding that costs zero equity.",
  "I believe anonymity is strategy, not cowardice.",
  "I believe the system matters more than the idea.",
  "I believe 'someday' is the most expensive word I own.",
];

const CODE = [
  { icon: Shield, title: "I Will Build Invisible", desc: "Under a pseudonym. Separate entity. Separate Stripe. My employer will not know until I choose to tell them." },
  { icon: Users, title: "I Will Share Numbers, Not Vanity", desc: "MRR, churn, customer counts. Not followers, likes, or impressions. The only number that matters is my freedom number." },
  { icon: Lock, title: "I Will Protect Other Builders", desc: "I will never reveal another member's identity. I will never connect their products to their name. Stealth is sacred." },
  { icon: Heart, title: "I Will Help When I Can", desc: "When I reach my freedom number, I will reach back and help the next manager through the door." },
  { icon: Check, title: "I Will Start, Not Just Research", desc: "I will stop bookmarking articles and start building. This Saturday. 5 hours. One step." },
];

const JoinMovementPage = () => {
  const [checked, setChecked] = useState<boolean[]>(DECLARATIONS.map(() => false));
  const [committed, setCommitted] = useState(false);
  const allChecked = checked.every(Boolean);

  const handleCommit = () => {
    setCommitted(true);
    trackEvent("movement_declaration_committed");
  };

  return (
    <div className="min-h-screen bg-[hsl(222_47%_11%)]">
      <SEOHead
        title="Join the Invisible Exit Movement | Declaration of Independence"
        description="5 declarations. 5 principles. One commitment. Join the movement of corporate managers building invisible freedom."
        url="/join"
      />
      <Navbar />

      {!committed ? (
        <>
          {/* ── Hero ── */}
          <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-eyebrow text-primary-light mb-6 animate-fade-in">
                The Declaration
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1] animate-fade-up">
                Before You Join,{" "}
                <span className="text-gradient-light">Declare.</span>
              </h1>
              <p className="text-lg text-white/60 max-w-xl mx-auto mb-3 animate-fade-up" style={{ animationDelay: "100ms" }}>
                This isn't a newsletter signup. This is a declaration.
              </p>
              <p className="text-base text-white/40 max-w-lg mx-auto mb-12 animate-fade-up" style={{ animationDelay: "200ms" }}>
                Check each statement you agree with. If you can't check all 5,
                this movement isn't for you — and that's okay.
              </p>
            </div>
          </section>

          {/* ── The Declarations ── */}
          <section className="pb-16 px-4">
            <div className="max-w-xl mx-auto space-y-3">
              {DECLARATIONS.map((decl, i) => (
                <label
                  key={i}
                  className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all ${
                    checked[i]
                      ? "bg-primary/10 border-primary/40"
                      : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked[i]}
                    onChange={() => {
                      const next = [...checked];
                      next[i] = !next[i];
                      setChecked(next);
                      trackEvent("movement_declaration_checked", { index: i, checked: next[i] });
                    }}
                    className="mt-0.5 w-5 h-5 rounded accent-primary shrink-0 cursor-pointer"
                  />
                  <span className={`text-sm leading-relaxed ${checked[i] ? "text-white" : "text-white/60"}`}>
                    {decl}
                  </span>
                </label>
              ))}
            </div>

            {/* Commit button */}
            <div className="max-w-xl mx-auto mt-8 text-center">
              <button
                onClick={handleCommit}
                disabled={!allChecked}
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-30 disabled:cursor-not-allowed min-h-[52px]"
              >
                {allChecked ? "I Declare These Beliefs" : `Check all 5 to continue (${checked.filter(Boolean).length}/5)`}
                {allChecked && <ArrowRight className="w-5 h-5" />}
              </button>
              <p className="text-white/30 text-xs mt-3">
                No email required. No payment. Just your word.
              </p>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* ── Committed: The Code ── */}
          <section className="pt-32 pb-16 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6 animate-scale-in">
                <Check className="w-8 h-8 text-success" />
              </div>
              <p className="text-eyebrow text-success mb-4 animate-fade-in">You've Declared.</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight animate-fade-up">
                You Are Now an{" "}
                <span className="text-gradient-light">Invisible Builder.</span>
              </h1>
              <p className="text-lg text-white/60 max-w-xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: "100ms" }}>
                Welcome to the 3%. Here's the code we live by.
              </p>
            </div>
          </section>

          {/* The Code */}
          <section className="pb-16 px-4">
            <div className="max-w-2xl mx-auto space-y-4">
              {CODE.map((principle, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-5 bg-white/[0.03] border border-white/10 rounded-xl animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <principle.icon className="w-5 h-5 text-primary-light" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">{principle.title}</p>
                    <p className="text-white/50 text-xs leading-relaxed">{principle.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── The First Step ── */}
          <section className="py-16 px-4 border-t border-white/5">
            <div className="max-w-xl mx-auto text-center">
              <p className="text-eyebrow text-primary-light mb-4">Your First Act as a Builder</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Calculate Your Freedom Number
              </h2>
              <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
                You declared your beliefs. Now put numbers to them. Your freedom
                number is the exact monthly revenue that replaces your salary.
                90 seconds. Free. This is step 1.
              </p>
              <Link
                to="/freedom"
                onClick={() => trackEvent("join_movement_cta_clicked")}
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 min-h-[52px]"
              >
                Calculate My Freedom Number
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="mt-12 flex items-center justify-center gap-2 text-white/30 text-xs">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>You are builder #{128} of 1,000</span>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
};

export default JoinMovementPage;
