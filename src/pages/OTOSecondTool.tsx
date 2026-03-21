import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Lightbulb, Rocket, Palette } from "lucide-react";

const tools = [
  {
    slug: "stealth-ops",
    name: "Stealth Ops Hub",
    icon: Shield,
    description:
      "Legal templates, anonymity playbook, compliance database. Make sure nobody at your company ever finds out.",
    cta: "Add Stealth Ops for $0.97/mo",
  },
  {
    slug: "idea-pipeline",
    name: "Idea Pipeline",
    icon: Lightbulb,
    description:
      "Validate new micro-SaaS ideas in 48 hours. AI analysis and go/no-go decision trees before you waste a weekend.",
    cta: "Add Idea Pipeline for $0.97/mo",
  },
  {
    slug: "launch-control",
    name: "Launch Control",
    icon: Rocket,
    description:
      "Step-by-step launch playbook. Go from idea to live and accepting payments faster than your day job allows.",
    cta: "Add Launch Control for $0.97/mo",
  },
  {
    slug: "brand-manager",
    name: "Brand Manager",
    icon: Palette,
    description:
      "Positioning, visual identity, website templates, voice guide. Build organic YouTube and Reddit presence.",
    cta: "Add Brand Manager for $0.97/mo",
  },
];

const OTOSecondTool = () => {
  useEffect(() => {
    document.title = "One More Thing | Invisible Exit";
  }, []);

  return (
    <div className="min-h-screen bg-[#1B2A4A]">
      {/* Section 1: Acknowledgment */}
      <section className="pt-20 pb-12 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Got It. Your FYM Dashboard Is Ready.
          </h1>
          <p className="text-white/70 text-lg">
            You can access it anytime at your dashboard. But before you go, one
            quick thought.
          </p>
        </div>
      </section>

      {/* Section 2: Downsell Pitch */}
      <section className="pb-16 px-6">
        <div className="mx-auto max-w-2xl text-white/80 text-lg leading-[1.8] space-y-6">
          <p>
            Most people who start with FYM Dashboard tell me the same thing
            after a week: "I can see my numbers, but now I need to actually DO
            something about them."
          </p>
          <p>
            That's what the other tools are for. And right now, you can add one
            more for the same $0.97/month you're already paying for FYM.
          </p>
          <p>Pick the one that matches where you are:</p>
        </div>
      </section>

      {/* Section 3: Tool Selection Cards */}
      <section className="pb-16 px-6">
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.slug}
              className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#60A5FA]/20 to-[#60A5FA]/5 flex items-center justify-center mb-4">
                <tool.icon className="h-6 w-6 text-[#60A5FA]" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {tool.name}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">
                {tool.description}
              </p>
              <Link
                to={`/checkout/${tool.slug}`}
                className="block w-full text-center border border-[#60A5FA] text-[#60A5FA] hover:bg-[#60A5FA] hover:text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
              >
                {tool.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Skip Link */}
      <section className="pb-10 px-6 text-center">
        <Link
          to="/confirmation?tier=tool&tools=fym"
          className="text-white/40 hover:text-white/60 text-sm transition-colors"
        >
          No thanks, take me to my dashboard
        </Link>
      </section>

      {/* Section 5: Founding Member Mention */}
      <section className="pb-20 px-6 text-center">
        <p className="text-white/30 text-xs">
          Changed your mind? You can still upgrade to Founding Member ($19/mo,
          all 5 tools) anytime from your dashboard.
        </p>
      </section>
    </div>
  );
};

export default OTOSecondTool;
