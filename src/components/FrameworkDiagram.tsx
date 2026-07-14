import { BarChart3, Lightbulb, Shield, Rocket, Megaphone, ArrowRight, Link as LinkIcon } from "lucide-react";

/**
 * EXPERT SECRETS Ch 10-11: Proprietary Frameworks Diagram
 *
 * The 5 tools are the "cartridges" (implementation) of the 3 proprietary
 * frameworks. Each tool maps to a specific framework:
 *
 *   FYM Dashboard      ← The Salary-Runway Method
 *   Idea Pipeline      ← The Cartridge System
 *   Stealth Ops Hub    ← The Triple-Separation Protocol
 *   Launch Control     ← The Salary-Runway Method + The Cartridge System
 *   Brand Manager      ← The Cartridge System (distribution)
 *
 * This transforms "5 tools" into "3 named methodologies you can't get
 * anywhere else."
 */

interface FrameworkLink {
  name: string;
  href: string;
  color: string;
}

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
    framework: {
      name: "The Salary-Runway Method",
      href: "/frameworks",
      color: "text-blue-400",
    },
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
    framework: {
      name: "The Cartridge System",
      href: "/frameworks",
      color: "text-amber-400",
    },
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
    framework: {
      name: "The Triple-Separation Protocol",
      href: "/frameworks",
      color: "text-emerald-400",
    },
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
    framework: {
      name: "Salary-Runway + Cartridge",
      href: "/frameworks",
      color: "text-purple-400",
    },
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
    framework: {
      name: "The Cartridge System",
      href: "/frameworks",
      color: "text-pink-400",
    },
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
              <p className={`text-[10px] leading-relaxed ${stage.framework.color} font-semibold mb-1.5 flex items-center justify-center gap-1`}>
                <LinkIcon className="w-3 h-3" />
                <a href={stage.framework.href} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                  {stage.framework.name}
                </a>
              </p>
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
                <p className={`text-[11px] ${stage.framework.color} font-medium mt-0.5 flex items-center gap-1`}>
                  <LinkIcon className="w-3 h-3" />
                  {stage.framework.name}
                </p>
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

      {/* Result banner with note about frameworks */}
      <div className="mt-8 text-center space-y-3">
        <div className="inline-block bg-gradient-to-r from-primary to-accent-primary text-white px-8 py-4 rounded-xl shadow-lg">
          <p className="text-sm font-bold tracking-wide">
            RESULT: $4,000+/month MRR while employed — in 12 months
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Each tool implements one of{" "}
          <a href="/frameworks" className="text-primary underline hover:text-primary-hover font-medium">
            3 proprietary frameworks
          </a>
          . You're not buying features — you're buying a methodology nobody else teaches.
        </p>
      </div>
    </div>
  );
};

export default FrameworkDiagram;
