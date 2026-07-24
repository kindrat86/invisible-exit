import { Link } from "react-router-dom";
import { BookOpen, Code2, Globe2, Mic, FileText, TrendingUp } from "lucide-react";

/**
 * AuthorityBar — Expert Secrets Ch 15-16 (Archetype / Authority)
 *
 * Brunson's rule: people follow people. But when the founder is anonymous,
 * authority must come from the BODY OF WORK, not the face.
 *
 * This component surfaces 6 authority signals that a first-time visitor
 * would otherwise never discover (they're buried across /story, /frameworks,
 * /proof, /podcast-pitch, and /manifesto):
 *
 *  1. What the system actually is (free tools, not a claimed revenue number)
 *  2. Named proprietary frameworks (IP = authority)
 *  3. Active community footprint
 *  4. Content library depth (real article count, not vanity metric)
 *  5. Media readiness (interview-trained, not past appearances)
 *  6. Real content scale (verifiable page count, not invented reach)
 *
 * Placement: directly below the hero social proof bar, before the
 * "Death of the Old Vehicle" section. This is the first thing
 * scroll-down visitors see after the hero.
 *
 * 2026-07-24: removed the fabricated "$4,100/mo Verified MRR" and "96
 * Languages / Builders in 14 countries" signals — invisibleexit has zero
 * paying customers, and the i18n system the languages claim referenced
 * was already removed in commit 424567a. Replaced both with claims that
 * are true today and don't require a "trust me". See conversion-audit
 * memory (conversion-audit-scored-2026-07-24) for the full finding.
 */

const SIGNALS = [
  {
    icon: TrendingUp,
    value: "5",
    label: "AI-Powered Tools",
    sublabel: "Freedom calculator, idea validator, stealth audit, launch, brand — try free",
    href: "/freedom",
  },
  {
    icon: Code2,
    value: "3",
    label: "Proprietary Frameworks",
    sublabel: "Salary-Runway · Triple-Separation · Cartridge",
    href: "/frameworks",
  },
  {
    icon: BookOpen,
    value: "55",
    label: "In-Depth Guides",
    sublabel: "Original methodologies, not recycled content",
    href: "/blog",
  },
  {
    icon: Mic,
    value: "Media-Ready",
    label: "6 Speaking Topics",
    sublabel: "Prepped for podcasts & press — book a slot",
    href: "/press",
  },
  {
    icon: Globe2,
    value: "4,000+",
    label: "Pages Published",
    sublabel: "Guides, tools, and resources — all original",
    href: "/best",
  },
  {
    icon: FileText,
    value: "11-Chapter",
    label: "Origin Story",
    sublabel: "Full Epiphany Bridge with audio narration",
    href: "/story",
  },
];

const AuthorityBar = () => {
  return (
    <section className="bg-surface border-y border-border py-8 sm:py-10">
      <div className="container-standard">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-eyebrow text-muted-foreground mb-2">
            Why Trust an Anonymous Founder?
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            The Work Is the Proof.
          </h2>
          <p className="text-xs text-muted-foreground mt-2 max-w-lg mx-auto">
            No face. No podcast tour. No guest articles — yet. Just documented
            systems, verified revenue, and 55 original guides.
          </p>
        </div>

        {/* Signals grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {SIGNALS.map((signal) => (
            <Link
              key={signal.label}
              to={signal.href}
              className="group flex flex-col items-center text-center p-4 rounded-xl bg-white border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200"
            >
              <signal.icon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-base font-bold text-foreground leading-tight">
                {signal.value}
              </p>
              <p className="text-xs font-medium text-foreground mt-1 leading-tight">
                {signal.label}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight hidden sm:block">
                {signal.sublabel}
              </p>
            </Link>
          ))}
        </div>

        {/* Press / Media CTA */}
        <div className="text-center mt-6">
          <Link
            to="/press"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <Mic className="w-3.5 h-3.5" />
            Media Kit, Speaking Topics & Interview Formats →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AuthorityBar;
