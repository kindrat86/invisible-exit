import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

interface PriceCardProps {
  onUpgrade: () => void;
  loading: boolean;
}

const PriceCard = ({ onUpgrade, loading }: PriceCardProps) => {
  const [bumpChecked, setBumpChecked] = useState(true);

  return (
    <section className="px-6 py-16">
      <div className="max-w-[720px] mx-auto">
        <div className="relative bg-white/5 border-2 border-[#60A5FA] rounded-2xl p-10 text-center shadow-[0_0_48px_rgba(96,165,250,0.1)]">
          {/* Badge */}
          <span className="absolute -top-[14px] left-1/2 -translate-x-1/2 inline-block bg-[#60A5FA] text-white text-[13px] font-bold uppercase tracking-[1.5px] px-5 py-1.5 rounded-full whitespace-nowrap">
            FOUNDING MEMBERS ONLY
          </span>

          {/* Strikethrough price */}
          <p className="text-base text-white/70 mt-4 mb-2">
            Public price after founding closes:{" "}
            <span className="line-through text-[#dc2626]">$97.99/month</span>
          </p>

          {/* Main price */}
          <div className="mb-2">
            <span className="text-[44px] md:text-[56px] font-extrabold text-white leading-none">
              $17.99
            </span>
            <span className="text-[18px] text-white/60 ml-1">/month</span>
          </div>

          {/* Price lock note */}
          <p className="text-sm text-[#60A5FA] mb-6">
            Locked for life. Your rate never increases.
          </p>

          {/* ── ORDER BUMP ── */}
          <div className={`mb-6 text-left rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${bumpChecked ? "border-[#60A5FA] bg-[rgba(96,165,250,0.08)]" : "border-white/15 bg-white/[0.03]"}`}>
            <label className="flex items-start gap-3 p-5 cursor-pointer">
              <input
                type="checkbox"
                checked={bumpChecked}
                onChange={(e) => setBumpChecked(e.target.checked)}
                className="mt-1 w-5 h-5 accent-[#60A5FA] cursor-pointer shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-white font-semibold text-sm">
                    📋 Add: Stealth Ops Quickstart Checklist
                  </p>
                  <span className="text-[#60A5FA] font-bold text-sm shrink-0">+$7 one-time</span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">
                  The exact 27-point checklist for entity separation, digital footprint cleanup,
                  and compliance audit. Check every box before you launch. Normally $27 — add it now for $7.
                </p>
                {bumpChecked && (
                  <p className="text-[#60A5FA] text-xs mt-2 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Added to your order
                  </p>
                )}
              </div>
            </label>
          </div>

          {/* CTA Button */}
          <button
            onClick={onUpgrade}
            disabled={loading}
            className="w-full max-w-[440px] mx-auto bg-[#60A5FA] hover:bg-[#93c5fd] text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-[0_4px_24px_rgba(96,165,250,0.25)] hover:shadow-[0_4px_32px_rgba(96,165,250,0.35)] hover:-translate-y-[1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              "Loading..."
            ) : (
              <span className="flex flex-col items-center leading-tight">
                <span>Become a Founding Member {bumpChecked ? "+ Checklist" : ""}</span>
                <span className="text-sm font-normal opacity-80">
                  $17.99/mo{bumpChecked ? " + $7 one-time" : ""}
                </span>
              </span>
            )}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>

          {/* Sub-text */}
          <p className="text-[13px] text-white/40 mt-4">
            Secure payment via Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PriceCard;
