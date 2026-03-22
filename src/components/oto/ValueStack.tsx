const stackItems = [
  {
    featured: true,
    label: "EXCLUSIVE #1",
    badge: "BIGGEST ADVANTAGE",
    title: "Price Locked at $17.99/month. For Life.",
    body: "When founding closes, the public price becomes $97.99/month. Your rate never changes. Not next year. Not in five years. The longer you stay, the wider the gap between what you pay and what everyone else pays.",
    anchor: "That's $960/year in savings versus everyone who joins after you.",
  },
  {
    label: "EXCLUSIVE #2",
    title: "Shape What Gets Built Next",
    body: "You're not a user. You're a co-creator. Founding Members vote on the roadmap. Your feature requests go to the top of the queue. The tools evolve around your needs, not the other way around.",
    anchor: "What's it worth to have tools built specifically for your situation?",
  },
  {
    label: "EXCLUSIVE #3",
    title: "See Everything First",
    body: "Every new tool. Every new integration. Every feature. Weeks before anyone else. You get to test, shape, and benefit from what's coming while others are still waiting for the public release.",
  },
  {
    label: "EXCLUSIVE #4",
    title: "Your Name on the Founding Wall",
    body: "Permanently listed as one of the original 100 who started Invisible Exit. When this community grows to 10,000 members, your name is still there. This cannot be purchased later at any price.",
  },
  {
    label: "EXCLUSIVE #5",
    title: "Unlimited Access to Every Tool",
    body: "No caps on scenarios, ideas, audits, automations, or content calendars. While standard members hit limits, you use every tool to its full potential. No friction. No upgrade prompts. Just build.",
  },
];

const ValueStack = () => {
  return (
    <section className="px-6 py-16">
      <div className="max-w-[720px] mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-[28px] font-bold text-white mb-3">
            What Founding Members Get
          </h2>
          <p className="text-base text-[#8A95A8]">
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
                  ? "border-2 border-[#60A5FA] bg-gradient-to-br from-[rgba(96,165,250,0.08)] to-[rgba(96,165,250,0.02)]"
                  : "border border-[rgba(96,165,250,0.15)] bg-[#0f1a2e]"
              }`}
            >
              {/* Featured badge */}
              {item.badge && (
                <span className="absolute -top-[10px] right-5 inline-block bg-[#60A5FA] text-[#0B1D3A] text-[11px] font-bold uppercase tracking-[1.5px] px-3 py-1 rounded-full">
                  {item.badge}
                </span>
              )}

              {/* Label */}
              <p className="text-[12px] uppercase tracking-[1.5px] text-[#60A5FA] font-medium mb-3">
                {item.label}
              </p>

              {/* Title */}
              <h3 className="text-[19px] font-semibold text-white mb-3">
                {item.title}
              </h3>

              {/* Body */}
              <p className="text-base leading-[1.7] text-[#8A95A8]">
                {item.body}
              </p>

              {/* Anchor text */}
              {item.anchor && (
                <p className="mt-3 text-sm italic text-[#4A5568]">
                  {item.anchor}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueStack;
