/**
 * Brunson Trust Bar — Dotcom Secrets Ch 7
 * Social proof metrics strip shown near the bottom of every page.
 * Uses design system tokens instead of inline styles.
 */
const BrunsonTrustBar = () => {
  const metrics = [
    { value: "$4,000", label: "Monthly Recurring Target" },
    { value: "138", label: "Customers Onboarded" },
    { value: "$0.97", label: "Tripwire Start" },
    { value: "5", label: "AI Tools Included" },
  ];

  return (
    <section
      aria-label="Trust metrics"
      className="bg-gradient-to-br from-surface-dark to-surface-dark-2 text-foreground py-10 px-6 mt-16 border-t-[3px] border-t-success"
    >
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex flex-wrap justify-center gap-7 mb-7">
          {metrics.map((m) => (
            <div key={m.value}>
              <span className="text-2xl md:text-3xl font-bold text-success block leading-tight">
                {m.value}
              </span>
              <span className="text-xs md:text-sm text-muted-foreground">
                {m.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-base md:text-lg text-muted-foreground mb-6">
          Your corporate job pays the bills. A side business pays your freedom.{" "}
          <span className="text-foreground font-medium">Start for less than a coffee.</span>
        </p>
        <a
          href="/#start"
          className="inline-block bg-gradient-to-r from-success to-emerald-300 text-success-foreground font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-success/30 hover:shadow-xl hover:shadow-success/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          Get Started for $0.97
        </a>
        <p className="mt-4 text-xs text-muted-foreground">
          30-day money-back guarantee. If you do not build revenue, you do not pay.
        </p>
      </div>
    </section>
  );
};

export default BrunsonTrustBar;
