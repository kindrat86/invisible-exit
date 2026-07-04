import { Shield, Check, RotateCcw } from "lucide-react";

/**
 * DOTCOM SECRETS: Risk Reversal — "Better Than Risk-Free" Guarantee
 * Upgraded from the thin "Zero Risk" box to Russell's full pattern.
 */
const GuaranteeBox = () => {
  return (
    <section className="px-6 py-8">
      <div className="max-w-[720px] mx-auto">
        <div className="relative rounded-2xl border-2 border-success/40 bg-gradient-to-br from-success/[0.08] to-transparent overflow-hidden">
          {/* Badge */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-success text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
              🛡️ Iron-Clad Guarantee
            </div>
          </div>

          <div className="p-8 pt-10">
            {/* Icon + Title */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-success/15 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-success" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                My 30-Day "Better Than Risk-Free" Guarantee
              </h3>
              <p className="text-sm text-white/50">
                Here's why this guarantee is even better than you think.
              </p>
            </div>

            {/* Body */}
            <div className="space-y-4 text-sm leading-relaxed text-white/70 max-w-lg mx-auto">
              <p>
                Try the full Founding Member toolkit for{" "}
                <strong className="text-white">a full 30 days</strong>. Use every tool.
                Calculate your freedom number. Run the stealth audit. Validate your first idea.
                Set up your entity.
              </p>
              <p>
                If you're not absolutely convinced this is the most practical, actionable system
                for building a side business while employed — email me one word:{" "}
                <span className="inline-flex items-center gap-1 bg-white/10 rounded px-2 py-0.5 font-mono text-xs">
                  <RotateCcw className="w-3 h-3" /> "refund"
                </span>
              </p>
              <p>
                I'll return every cent. No forms. No exit surveys. No "let me try to save this"
                call. Just a refund, processed within 24 hours.
              </p>
            </div>

            {/* The "Better Than Risk-Free" Part */}
            <div className="mt-6 rounded-xl p-5 bg-amber-500/10 border border-amber-500/20 max-w-lg mx-auto">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-400 mb-3">
                But here's what makes it "better than risk-free":
              </p>
              <div className="space-y-2">
                {[
                  "You keep the basic $0.97/month membership forever",
                  "You keep every framework, checklist, and the freedom number calculation",
                  "You keep every insight from the Idea Pipeline and Stealth Ops Hub",
                  "You owe nothing. We part as friends. No hard feelings.",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                    <span className="text-sm text-amber-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom */}
            <p className="text-center text-sm text-white/50 mt-6 font-medium">
              The risk is entirely on me. You have nothing to lose and everything to gain.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeBox;
