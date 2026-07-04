const stackItems = [
  {
    featured: true,
    label: "EXCLUSIVE #1",
    badge: "BIGGEST ADVANTAGE",
    title: "Price Locked at $17.99/month. For Life.",
    body: "When founding closes, the public price becomes $97.99/month. Your rate never changes. Not next year. Not in five years. The longer you stay, the wider the gap between what you pay and what everyone else pays.",
    anchor: "That's $960/year in savings versus everyone who joins after you.",
    value: "$960/yr saved",
  },
  {
    label: "EXCLUSIVE #2",
    title: "Shape What Gets Built Next",
    body: "You're not a user. You're a co-creator. Founding Members vote on the roadmap. Your feature requests go to the top of the queue. The tools evolve around your needs, not the other way around.",
    anchor: "What's it worth to have tools built specifically for your situation?",
    value: "Priceless",
  },
  {
    label: "EXCLUSIVE #3",
    title: "See Everything First",
    body: "Every new tool. Every new integration. Every feature. Weeks before anyone else. You get to test, shape, and benefit from what's coming while others are still waiting for the public release.",
    anchor: "Early access to features others pay extra for.",
    value: "$240/yr value",
  },
  {
    label: "EXCLUSIVE #4",
    title: "Your Name on the Founding Wall",
    body: "Permanently listed as one of the original 100 who started Invisible Exit. When this community grows to 10,000 members, your name is still there. This cannot be purchased later at any price.",
    anchor: "Founding status that money can't buy later.",
    value: "Irreplaceable",
  },
  {
    label: "EXCLUSIVE #5",
    title: "Unlimited Access to Every Tool",
    body: "No caps on scenarios, ideas, audits, automations, or content calendars. While standard members hit limits, you use every tool to its full potential. No friction. No upgrade prompts. Just build.",
    anchor: "Standard members pay $47/mo for the same usage. You pay $17.99. Forever.",
    value: "$348/yr saved",
  },
  {
    label: "🎁 BONUS #1",
    title: "Private Community Access",
    body: "Join a private Slack of corporate managers building the same way you are. Share wins, get feedback, find accountability partners. The community is capped at founding members only.",
    anchor: "Mastermind groups like this typically cost $97+/month.",
    value: "$97/mo value",
  },
  {
    label: "🎁 BONUS #2",
    title: "Monthly Masterclass Replays",
    body: "Every month, a new masterclass on building, launching, and scaling micro-SaaS. You get the replay forever. Build a library worth thousands over the year.",
    anchor: "Each masterclass is worth $197 standalone. You get 12/year.",
    value: "$2,364/yr value",
  },
];

const ValueStack = () => {
  return (
    <section className="px-6 py-16">
      <div className="max-w-[720px] mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-[30px] font-bold text-white mb-3">
            What Founding Members Get
          </h2>
          <p className="text-base text-white/70">
            These are not available to anyone else. Ever.
          </p>
        </div>

        {/* Stack items */}
        <div className="space-y-5">
          {stackItems.map((item, i) => (
            <div
              key={i}
              className={`relative rounded-xl p-8 ${
                item.featured
                  ? "border-2 border-[#60A5FA] bg-white/5"
                  : "border border-white/10 bg-white/5"
              }`}
            >
              {/* Featured badge */}
              {item.badge && (
                <span className="absolute -top-[10px] right-5 inline-block bg-[#60A5FA] text-white text-[11px] font-bold uppercase tracking-[1.5px] px-3 py-1 rounded-full">
                  {item.badge}
                </span>
              )}

              <div className="flex items-start justify-between gap-4 mb-3">
                {/* Label */}
                <p className="text-[12px] uppercase tracking-[1.5px] text-[#60A5FA] font-medium">
                  {item.label}
                </p>
                {/* Value anchor */}
                {item.value && (
                  <span className="text-[11px] font-bold text-[#60A5FA] bg-[rgba(96,165,250,0.12)] px-2.5 py-1 rounded-full shrink-0">
                    {item.value}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-[19px] font-semibold text-white mb-3">
                {item.title}
              </h3>

              {/* Body */}
              <p className="text-base leading-[1.7] text-white/70">
                {item.body}
              </p>

              {/* Anchor text */}
              {item.anchor && (
                <p className="mt-3 text-sm italic text-white/50">
                  {item.anchor}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ── Value Anchor Stack (Russell's Ch 13 pattern) ── */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-[12px] uppercase tracking-[1.5px] text-[#60A5FA] font-medium mb-4 text-center">
            Total Value of Founding Membership
          </p>
          <div className="space-y-2 max-w-sm mx-auto">
            {[
              { label: "Price lock savings ($960/yr)", value: "$960" },
              { label: "Unlimited usage ($348/yr saved)", value: "$348" },
              { label: "Community access ($97/mo × 12)", value: "$1,164" },
              { label: "Monthly masterclasses ($197 × 12)", value: "$2,364" },
              { label: "Early access to new features", value: "$240" },
              { label: "Founding wall + status", value: "—" },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-white/50 text-sm">{row.label}</span>
                <span className="text-white/70 text-sm font-mono">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-white/10">
            <span className="text-white font-semibold">Total annual value:</span>
            <span className="text-white/70 line-through text-lg">$5,076</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[#60A5FA] font-semibold">Your founding price:</span>
            <div>
              <span className="text-3xl font-bold text-[#60A5FA]">$17.99</span>
              <span className="text-white/50 text-sm">/mo</span>
            </div>
          </div>
          <p className="text-center text-sm text-white/40 mt-3">
            That's $215/year for $5,076 in value. <strong className="text-success">95.8% off.</strong> Locked for life.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ValueStack;
