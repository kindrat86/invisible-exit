import { Link } from "react-router-dom";
import { ArrowRight, Layers, TrendingUp, Lightbulb } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

/**
 * EXPERT SECRETS: Chapter 7 — The One Thing
 *
 * Russell: "If you could only teach ONE thing, what would it be?
 * That's the One Thing. Everything else is supporting evidence."
 *
 * This page is intentionally minimalist. One message. One idea.
 * One decision. No stacks, no bonuses, no urgency — just the One Thing.
 *
 * The One Thing: Build the system first. Ideas are cartridges.
 */

const COMPARISON = [
  { approach: "The Thinker", what: "Spends 3 months choosing the 'right' idea", result: "Analysis paralysis. Nothing ships.", icon: Lightbulb },
  { approach: "The Hustler", what: "Builds one idea with brute force", result: "Burns out. Can't pivot when it fails.", icon: TrendingUp },
  { approach: "The System Builder", what: "Builds the pipeline first, then plugs in ideas", result: "Swaps cartridges. Finds what works. Scales.", icon: Layers },
];

const OneThingPage = () => {
  return (
    <div className="min-h-screen bg-[hsl(222_47%_11%)]">
      <SEOHead
        title="The One Thing: Build the System First | Invisible Exit"
        description="If you remember nothing else, remember this: build the system first. Ideas are cartridges you swap in and out. The system is the printer."
        url="/one-thing"
      />
      <Navbar />

      {/* ── The One Statement ── */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-eyebrow text-primary-light mb-8 animate-fade-in">
            The One Thing
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.05] animate-fade-up">
            Build the{" "}
            <span className="text-gradient-light">System</span>{" "}
            First.
          </h1>

          <p className="text-xl sm:text-2xl text-white/60 max-w-2xl mx-auto mb-4 animate-fade-up" style={{ animationDelay: "100ms" }}>
            Ideas are cartridges you swap in and out.
          </p>
          <p className="text-lg text-white/40 max-w-xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: "200ms" }}>
            The system is the printer.
          </p>

          {/* The story in 3 lines */}
          <div className="max-w-lg mx-auto space-y-1 animate-fade-up" style={{ animationDelay: "300ms" }}>
            <div className="bg-white/[0.03] border border-white/10 rounded-lg px-6 py-4">
              <p className="text-white/50 text-sm">
                <span className="text-red-400 font-bold">Product 1:</span> Spent 3 months choosing. Made $9/month.
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-lg px-6 py-4">
              <p className="text-white/50 text-sm">
                <span className="text-amber-400 font-bold">Product 2:</span> Swapped the cartridge. Made $47/month.
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-lg px-6 py-4">
              <p className="text-white/50 text-sm">
                <span className="text-emerald-400 font-bold">Product 3:</span> Same system. Made $850/month.
              </p>
            </div>
            <div className="bg-primary/10 border border-primary/30 rounded-lg px-6 py-4">
              <p className="text-white text-sm font-bold">
                <span className="text-primary-light">Product 4:</span> Same system. $4,100/month. Still growing.
              </p>
            </div>
          </div>

          <p className="text-white/40 text-sm mt-8 italic animate-fade-up" style={{ animationDelay: "400ms" }}>
            The system didn't care which idea I picked.
          </p>
        </div>
      </section>

      {/* ── The 3 Approaches ── */}
      <section className="bg-white/[0.02] border-y border-white/5 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary-light mb-4">3 Ways to Build</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Only One Works While Employed
            </h2>
          </div>

          <div className="space-y-4">
            {COMPARISON.map((c, i) => {
              const isWinner = i === 2;
              return (
                <div
                  key={c.approach}
                  className={`flex items-start gap-4 p-5 rounded-xl border transition-all animate-fade-up ${
                    isWinner
                      ? "bg-primary/10 border-primary/30"
                      : "bg-white/[0.03] border-white/10"
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isWinner ? "bg-primary/20" : "bg-white/5"
                  }`}>
                    <c.icon className={`w-5 h-5 ${isWinner ? "text-primary-light" : "text-white/40"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-bold text-sm ${isWinner ? "text-primary-light" : "text-white/70"}`}>
                        {c.approach}
                      </p>
                      {isWinner && (
                        <span className="bg-primary/20 text-primary-light text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                          This Is Us
                        </span>
                      )}
                    </div>
                    <p className="text-white/50 text-xs mb-1">{c.what}</p>
                    <p className={`text-xs ${isWinner ? "text-success font-medium" : "text-white/40"}`}>
                      {c.result}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── The System (5 Tools) ── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-eyebrow text-primary-light mb-4">The System = 5 Tools</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            The Printer That Prints Freedom
          </h2>

          <div className="space-y-2 text-left max-w-md mx-auto">
            {[
              { step: "1", tool: "FYM Dashboard", question: "How much do I need?" },
              { step: "2", tool: "Idea Pipeline", question: "What should I build?" },
              { step: "3", tool: "Stealth Ops Hub", question: "Will I get caught?" },
              { step: "4", tool: "Launch Control", question: "How do I ship in 5 hrs?" },
              { step: "5", tool: "Brand Manager", question: "How do I get customers?" },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3">
                <span className="w-7 h-7 rounded-lg bg-primary/15 text-primary-light font-bold text-xs flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                <div>
                  <p className="text-white/80 text-sm font-medium">{s.tool}</p>
                  <p className="text-white/40 text-xs italic">"{s.question}"</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-white/40 text-sm mt-8 italic">
            Once you have these 5, you never rebuild. You just swap the cartridge.
          </p>
        </div>
      </section>

      {/* ── The Decision ── */}
      <section className="bg-gradient-to-b from-transparent to-primary/5 py-20 px-4 border-t border-white/5">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            So here's the question:
          </h2>
          <p className="text-xl text-white/70 mb-2">
            Are you going to spend 3 months choosing the "right" idea?
          </p>
          <p className="text-xl text-white font-bold mb-10">
            Or are you going to build the system first?
          </p>

          <Link
            to="/freedom"
            onClick={() => trackEvent("one_thing_cta_clicked")}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 min-h-[52px]"
          >
            Start Building the System
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-white/30 text-xs mt-4">
            Step 1 of the system: calculate your freedom number. 90 seconds. Free.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OneThingPage;
