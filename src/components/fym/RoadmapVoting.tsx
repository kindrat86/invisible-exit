import { Compass, ThumbsUp, MessageSquarePlus } from "lucide-react";

const MOCK_FEATURES = [
  {
    title: "AI-Powered Exit Readiness Score",
    description: "Get a real-time assessment of how ready your business is for a silent exit.",
    votes: 47,
  },
  {
    title: "Automated Entity Formation Wizard",
    description: "Step-by-step guide to set up holding companies and trusts across jurisdictions.",
    votes: 34,
  },
  {
    title: "Revenue Stream Diversification Planner",
    description: "Map out new income channels to reduce single-point-of-failure risk.",
    votes: 28,
  },
  {
    title: "Stealth Brand Identity Generator",
    description: "Create anonymous brand assets, logos, and messaging without revealing your identity.",
    votes: 19,
  },
];

export default function RoadmapVoting() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3 py-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#60A5FA]/10 border border-[#60A5FA]/20">
          <Compass className="w-7 h-7 text-[#60A5FA]" />
        </div>
        <h2 className="text-2xl font-bold text-white">Shape the Roadmap</h2>
        <p className="text-blue-200 max-w-lg mx-auto text-sm leading-relaxed">
          Founding Members vote on what gets built next. Your feature requests
          go to the top of the queue. You're not a user. You're a co-creator.
        </p>
      </div>

      <div className="grid gap-4">
        {MOCK_FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <button
              disabled
              className="flex flex-col items-center gap-1 pt-1 opacity-60"
            >
              <ThumbsUp className="w-5 h-5 text-[#60A5FA]" />
              <span className="text-xs font-semibold text-[#60A5FA]">
                {feature.votes}
              </span>
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm">
                {feature.title}
              </h3>
              <p className="text-blue-300/70 text-xs mt-1 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-center">
        <MessageSquarePlus className="w-6 h-6 text-blue-300/40 mx-auto mb-2" />
        <p className="text-blue-300/40 text-sm font-medium">
          Submit Your Feature Request
        </p>
        <p className="text-blue-300/30 text-xs mt-1">Coming soon</p>
      </div>
    </div>
  );
}
