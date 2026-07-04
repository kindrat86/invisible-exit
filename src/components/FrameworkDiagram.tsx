import { BarChart3, Lightbulb, Shield, Rocket, Megaphone, ArrowRight } from "lucide-react";

const STAGES = [
  {
    num: 1,
    icon: BarChart3,
    name: "FYM Dashboard",
    question: "How much do I need to quit?",
    output: "Your Freedom Number",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    num: 2,
    icon: Lightbulb,
    name: "Idea Pipeline",
    question: "What should I build?",
    output: "Validated idea in 48h",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    num: 3,
    icon: Shield,
    name: "Stealth Ops Hub",
    question: "Can my employer find out?",
    output: "Zero detection",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    num: 4,
    icon: Rocket,
    name: "Launch Control",
    question: "How do I ship in 5 hrs/week?",
    output: "Product live in weeks",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    num: 5,
    icon: Megaphone,
    name: "Brand Manager",
    question: "How do I get customers?",
    output: "Faceless audience growth",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
];

const FrameworkDiagram = () => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Desktop: horizontal flow */}
      <div className="hidden md:flex items-stretch gap-2">
        {STAGES.map((stage, i) => (
          <div key={stage.num} className="flex items-center gap-2 flex-1">
            <div
              className={`flex-1 ${stage.bg} ${stage.border} border rounded-xl p-5 text-center transition-all hover:scale-105 hover:shadow-lg cursor-default`}
            >
              <div className={`w-10 h-10 mx-auto rounded-lg ${stage.bg} flex items-center justify-center mb-3`}>
                <stage.icon className={`w-5 h-5 ${stage.color}`} />
              </div>
              <p className={`text-xs font-bold ${stage.color} mb-1`}>STEP {stage.num}</p>
              <h3 className="text-sm font-bold text-foreground mb-2">{stage.name}</h3>
              <p className="text-xs text-muted-foreground italic mb-2">"{stage.question}"</p>
              <p className="text-xs font-semibold text-foreground">→ {stage.output}</p>
            </div>
            {i < STAGES.length - 1 && (
              <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical flow */}
      <div className="md:hidden space-y-3">
        {STAGES.map((stage, i) => (
          <div key={stage.num}>
            <div className={`flex items-center gap-4 ${stage.bg} ${stage.border} border rounded-xl p-4`}>
              <div className={`w-12 h-12 rounded-lg ${stage.bg} flex items-center justify-center shrink-0`}>
                <stage.icon className={`w-6 h-6 ${stage.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold ${stage.color} mb-0.5`}>STEP {stage.num}</p>
                <h3 className="text-sm font-bold text-foreground">{stage.name}</h3>
                <p className="text-xs text-muted-foreground italic">"{stage.question}"</p>
                <p className="text-xs font-semibold text-foreground mt-1">→ {stage.output}</p>
              </div>
            </div>
            {i < STAGES.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowRight className="w-4 h-4 text-muted-foreground/40 rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Result banner */}
      <div className="mt-8 text-center">
        <div className="inline-block bg-gradient-to-r from-primary to-accent-primary text-white px-8 py-4 rounded-xl shadow-lg">
          <p className="text-sm font-bold tracking-wide">
            RESULT: $4,000+/month MRR while employed — in 12 months
          </p>
        </div>
      </div>
    </div>
  );
};

export default FrameworkDiagram;
