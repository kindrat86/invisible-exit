import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X, UserCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

/**
 * EXPERT SECRETS: Chapter 1 — The Charismatic Leader / Audience Qualification
 *
 * Russell: "Not everyone is your customer. The faster you repel the
 * wrong people, the faster you attract the right ones."
 *
 * This page helps visitors self-qualify. They answer 5 questions about
 * their situation. Based on the match score, they either get:
 *   - "You're exactly who we built this for" → freedom calculator
 *   - "This might not be for you right now" → blog/learning resources
 *
 * This creates a "selected" feeling for those who qualify.
 */

interface Question {
  id: string;
  question: string;
  options: { text: string; score: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: "role",
    question: "What's your role?",
    options: [
      { text: "Manager / Director / VP", score: 3 },
      { text: "Individual contributor", score: 1 },
      { text: "Founder / Entrepreneur", score: 0 },
      { text: "Student / Between roles", score: 0 },
    ],
  },
  {
    id: "salary",
    question: "What's your salary range?",
    options: [
      { text: "$120K - $200K+", score: 3 },
      { text: "$80K - $120K", score: 2 },
      { text: "$40K - $80K", score: 1 },
      { text: "Below $40K / N/A", score: 0 },
    ],
  },
  {
    id: "equity",
    question: "Do you have equity you're waiting to vest?",
    options: [
      { text: "Yes, less than 1%, waiting for IPO/acquisition", score: 3 },
      { text: "Yes, significant equity (1%+)", score: 2 },
      { text: "No equity, just salary", score: 1 },
      { text: "I don't know / N/A", score: 0 },
    ],
  },
  {
    id: "time",
    question: "How many hours per week can you commit to building?",
    options: [
      { text: "5 hours (evenings/weekends)", score: 3 },
      { text: "10-15 hours", score: 3 },
      { text: "Less than 5 hours", score: 1 },
      { text: "Zero right now", score: 0 },
    ],
  },
  {
    id: "desire",
    question: "What do you want most right now?",
    options: [
      { text: "Financial freedom while keeping my job", score: 3 },
      { text: "A side income stream", score: 2 },
      { text: "To learn new skills", score: 1 },
      { text: "I'm not sure yet", score: 0 },
    ],
  },
];

const MAX_SCORE = 15;

const IsThisYouPage = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const matchPercent = Math.round((totalScore / MAX_SCORE) * 100);
  const isHighMatch = matchPercent >= 60;

  const handleAnswer = (qId: string, score: number) => {
    const newAnswers = { ...answers, [qId]: score };
    setAnswers(newAnswers);
    trackEvent("is_this_you_answered", { question: qId, score });

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      setTimeout(() => {
        setDone(true);
        trackEvent("is_this_you_completed", { total_score: score, match: matchPercent });
      }, 200);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(222_47%_11%)]">
      <SEOHead
        title="Is This You? Find Out If Invisible Exit Is Right for You"
        description="5 questions. 30 seconds. Find out if you're the kind of corporate manager who can build invisible recurring revenue while employed."
        url="/is-this-you"
      />

      <div className="mx-auto max-w-xl px-4 sm:px-6 py-16 md:py-24">
        {/* Progress */}
        {!done && (
          <div className="flex items-center justify-center gap-2 mb-10">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i <= step ? "w-8 bg-primary" : "w-4 bg-white/15"
                }`}
              />
            ))}
          </div>
        )}

        {/* Questions */}
        {!done && step < QUESTIONS.length && (
          <div className="animate-fade-in text-center">
            <p className="text-eyebrow text-primary-light mb-3">
              Question {step + 1} of {QUESTIONS.length}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 leading-tight">
              {QUESTIONS[step].question}
            </h2>

            <div className="space-y-3 max-w-md mx-auto">
              {QUESTIONS[step].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(QUESTIONS[step].id, opt.score)}
                  className={`w-full py-4 px-5 rounded-xl text-left text-sm font-medium transition-all border ${
                    answers[QUESTIONS[step].id] === opt.score
                      ? "bg-primary text-white border-primary"
                      : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>

            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="mt-6 text-white/30 hover:text-white/50 text-xs transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {done && (
          <div className="animate-scale-in text-center">
            {/* Score circle */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke={isHighMatch ? "#10b981" : "#f59e0b"}
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - matchPercent / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold ${isHighMatch ? "text-success" : "text-amber-400"}`}>
                  {matchPercent}%
                </span>
              </div>
            </div>

            {isHighMatch ? (
              <>
                <div className="inline-flex items-center gap-2 bg-success/15 border border-success/30 text-success text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">
                  <UserCheck className="w-3.5 h-3.5" />
                  Perfect Match
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                  You're Exactly Who We{" "}
                  <span className="text-gradient-light">Built This For.</span>
                </h2>
                <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
                  You're a corporate manager with golden handcuffs, enough time
                  to build, and a real desire for financial freedom. Invisible
                  Exit was designed specifically for your situation.
                </p>

                <Link
                  to="/freedom"
                  onClick={() => trackEvent("is_this_you_qualified_cta")}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 min-h-[52px]"
                >
                  Calculate Your Freedom Number
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">
                  Partial Match
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                  This Might Not Be for You{" "}
                  <span className="text-amber-400">Right Now.</span>
                </h2>
                <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
                  And that's completely okay. Invisible Exit is designed for
                  employed managers earning $120K+ with equity they're waiting
                  to vest. If that's not you yet, here's what I'd recommend
                  instead.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-xl p-5 max-w-md mx-auto text-left mb-6">
                  <p className="text-white/50 text-xs mb-3 font-semibold uppercase tracking-wide">Start here instead:</p>
                  <div className="space-y-2">
                    <Link to="/blog" className="flex items-center gap-2 text-primary-light hover:text-white text-sm transition-colors">
                      <ArrowRight className="w-4 h-4" /> Read the blog first
                    </Link>
                    <Link to="/story" className="flex items-center gap-2 text-primary-light hover:text-white text-sm transition-colors">
                      <ArrowRight className="w-4 h-4" /> Read Adrian's story
                    </Link>
                    <Link to="/free-book" className="flex items-center gap-2 text-primary-light hover:text-white text-sm transition-colors">
                      <ArrowRight className="w-4 h-4" /> Get the free book
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* Retry */}
            <button
              onClick={() => { setStep(0); setAnswers({}); setDone(false); }}
              className="text-white/30 hover:text-white/50 text-xs transition-colors"
            >
              Retake the assessment
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default IsThisYouPage;
