interface PriceCardProps {
  onUpgrade: () => void;
  loading: boolean;
}

const PriceCard = ({ onUpgrade, loading }: PriceCardProps) => {
  return (
    <section className="px-6 py-16">
      <div className="max-w-[720px] mx-auto">
        <div className="relative bg-[#0f1a2e] border-2 border-[#60A5FA] rounded-2xl p-10 text-center shadow-[0_0_48px_rgba(96,165,250,0.1)]">
          {/* Badge */}
          <span className="absolute -top-[14px] left-1/2 -translate-x-1/2 inline-block bg-[#60A5FA] text-[#0B1D3A] text-[13px] font-bold uppercase tracking-[1.5px] px-5 py-1.5 rounded-full whitespace-nowrap">
            FOUNDING MEMBERS ONLY
          </span>

          {/* Strikethrough price */}
          <p className="text-base text-[#8A95A8] mt-4 mb-2">
            Public price after founding closes:{" "}
            <span className="line-through text-[#dc2626]">$97.99/month</span>
          </p>

          {/* Main price */}
          <div className="mb-2">
            <span className="text-[44px] md:text-[56px] font-extrabold text-white leading-none">
              $17.99
            </span>
            <span className="text-[18px] text-[#8A95A8] ml-1">/month</span>
          </div>

          {/* Price lock note */}
          <p className="text-sm text-[#60A5FA] mb-8">
            Locked for life. Your rate never increases.
          </p>

          {/* CTA Button */}
          <button
            onClick={onUpgrade}
            disabled={loading}
            className="w-full max-w-[440px] mx-auto block bg-[#60A5FA] hover:bg-[#93c5fd] text-[#0B1D3A] font-bold text-[17px] py-[18px] px-12 rounded-[10px] shadow-[0_4px_24px_rgba(96,165,250,0.25)] hover:shadow-[0_4px_32px_rgba(96,165,250,0.35)] hover:-translate-y-[1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Become a Founding Member"}
          </button>

          {/* Sub-text */}
          <p className="text-[13px] text-[#4A5568] mt-4">
            Secure payment via Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PriceCard;
