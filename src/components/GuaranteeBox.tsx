import { Shield, Check, RotateCcw } from "lucide-react";

/**
 * DOTCOM SECRETS: Risk Reversal Component
 *
 * Russell's rule: "Make the guarantee so good the prospect feels stupid saying no."
 *
 * This component renders the "better than risk-free" guarantee box pattern
 * used across ClickFunnels and Russell's own funnels.
 *
 * Features:
 *   - Bold visual badge
 *   - "Even better than you think" framing
 *   - Specific refund terms (no fine print)
 *   - What they keep even if they refund
 *   - Time-limited guarantee window
 */

interface GuaranteeBoxProps {
  variant?: "standard" | "bold" | "minimal";
  days?: number;
  title?: string;
  keepText?: string;
  className?: string;
}

export default function GuaranteeBox({
  variant = "bold",
  days = 30,
  title,
  keepText = "the free tools, the calculator, and every piece of content you downloaded",
  className = "",
}: GuaranteeBoxProps) {
  if (variant === "minimal") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Shield className="w-5 h-5 text-success shrink-0" />
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">{days}-day money-back guarantee.</strong>{" "}
          No questions. No forms. Email one word: "refund."
        </p>
      </div>
    );
  }

  const isBold = variant === "bold";

  return (
    <div
      className={`relative rounded-2xl border-2 overflow-hidden ${
        isBold
          ? "border-success/40 bg-gradient-to-br from-success/[0.08] to-transparent"
          : "border-border bg-surface"
      } ${className}`}
    >
      {isBold && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-success text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
            🛡️ Iron-Clad Guarantee
          </div>
        </div>
      )}

      <div className="p-6 sm:p-8 pt-8">
        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isBold ? "bg-success/15" : "bg-primary/10"}`}>
            <Shield className={`w-7 h-7 ${isBold ? "text-success" : "text-primary"}`} />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${isBold ? "text-foreground" : "text-foreground"}`}>
              {title || `My ${days}-Day "Better Than Risk-Free" Guarantee`}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Here's why this guarantee is even better than you think.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className={`space-y-4 text-sm leading-relaxed ${isBold ? "text-muted-foreground" : "text-muted-foreground"}`}>
          <p>
            Try the system for <strong className="text-foreground">a full {days} days</strong>.
            Use the tools. Calculate your freedom number. Run the stealth audit. Validate your
            first idea.
          </p>
          <p>
            If you're not absolutely convinced this is the most practical, actionable system
            for building a side business while employed — email me one word:{" "}
            <span className="inline-flex items-center gap-1 bg-muted/50 rounded px-2 py-0.5 font-mono text-xs">
              <RotateCcw className="w-3 h-3" /> "refund"
            </span>
          </p>
          <p>
            I'll return every cent. No forms. No exit surveys. No "let me try to save this"
            call. Just a refund, processed within 24 hours.
          </p>
        </div>

        {/* The "Better Than Risk-Free" Part */}
        <div className={`mt-6 rounded-xl p-5 ${isBold ? "bg-amber-50 border border-amber-200" : "bg-primary/5 border border-primary/15"}`}>
          <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${isBold ? "text-amber-700" : "text-primary"}`}>
            But here's what makes it "better than risk-free":
          </p>
          <div className="space-y-2">
            {[
              `You keep ${keepText}`,
              "You keep every insight, every framework, every checklist",
              "You keep your calculated freedom number — that knowledge is yours forever",
              "You owe nothing. We part as friends. No hard feelings.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isBold ? "text-amber-600" : "text-primary"}`} />
                <span className={`text-sm ${isBold ? "text-amber-900" : "text-foreground"}`}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom statement */}
        <p className="text-center text-sm text-muted-foreground mt-6 font-medium">
          The risk is entirely on me. You have nothing to lose and everything to gain.
        </p>
      </div>
    </div>
  );
}
