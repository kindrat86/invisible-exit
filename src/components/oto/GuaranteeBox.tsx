import { Lock } from "lucide-react";

const GuaranteeBox = () => {
  return (
    <section className="px-6 py-8">
      <div className="max-w-[720px] mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
          <Lock className="w-8 h-8 text-[#60A5FA] mx-auto mb-4" />
          <h3 className="text-[19px] font-semibold text-white mb-4">
            Zero Risk. 30 Days to Decide.
          </h3>
          <p className="text-base leading-[1.7] text-white/70 max-w-xl mx-auto">
            Try the full Founding Member toolkit for 30 days. If it's not worth
            it, email the word "refund" and get every cent back. No questions. No
            hassle. No hard feelings. You keep the basic membership either way.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeBox;
