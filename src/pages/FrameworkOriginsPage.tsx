import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Shield,
  Layers,
  Calendar,
  Lightbulb,
  Check,
  BookOpen,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

/**
 * EXPERT SECRETS: Chapter 16 — Becoming the Expert / Authority
 *
 * Russell: "When you have proprietary frameworks, you're not a reseller.
 * You're a thought leader. People follow thought leaders, not resellers."
 *
 * This page documents the ORIGIN STORY of each framework — when Adrian
 * discovered it, what problem it solved, and how it was named. This
 * transforms "5 tools" into "3 proprietary methodologies" that no one
 * else can teach.
 */

const FRAMEWORKS = [
  {
    num: "01",
    name: "The Salary-Runway Method",
    icon: TrendingUp,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    originDate: "Month 2",
    originTitle: "The Near-Quit Moment",
    originStory:
      "I had my resignation letter drafted. Saved in Google Docs. Title: 'Resignation_Final_v3.docx.' Then I opened my bank statement and realized: my salary was the only thing keeping me solvent while I built. VC funding would cost 20% equity. My salary cost nothing. That night I deleted the letter and renamed the concept: salary = non-dilutive runway.",
    theMethod: [
      "Calculate your effective hourly rate (salary / actual hours worked)",
      "Identify 5 hours of weekly dead time (commute, lunch, evenings)",
      "Map corporate skills to founder skills (P&L = unit economics, team management = hiring, stakeholder navigation = sales)",
      "Track runway months: savings / monthly burn rate = how long you can build before revenue replaces salary",
    ],
    theOutput: "A financial runway that costs zero equity and funds your build for 12-18 months.",
    theBigIdea:
      "Your job isn't what you escape FROM. It's what funds the escape. The salary IS the runway.",
  },
  {
    num: "02",
    name: "The Triple-Separation Protocol",
    icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    originDate: "Week 3",
    originTitle: "The 3-Second Panic",
    originStory:
      "Week 3 of building. Team call. A colleague says: 'Hey, has anyone seen this website? It looks like something we'd build.' My blood ran cold for exactly 3 seconds. Then I remembered: different name, different entity, different Stripe, different hosting. Zero connection. Those 3 seconds of panic were the best $25/month I ever spent — because they proved the system worked. I named the protocol that night.",
    theMethod: [
      "SEPARATE THE LEGAL ENTITY — Wyoming LLC (anonymous, $100 filing, no state tax)",
      "SEPARATE THE DIGITAL FOOTPRINT — different registrar, different hosting, different Stripe, different email provider",
      "SEPARATE THE IDENTITY — no real name, no LinkedIn cross-link, no employer mention, no professional network overlap",
    ],
    theOutput: "Mathematical zero connection between your employment identity and your business identity.",
    theBigIdea:
      "Anonymity isn't hiding. It's the freedom to experiment, fail, and build without consequences.",
  },
  {
    num: "03",
    name: "The Cartridge System",
    icon: Layers,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    originDate: "Month 5",
    originTitle: "The Wrong Idea That Made $9",
    originStory:
      "I spent 3 months choosing the 'right' idea. Spreadsheets. Market sizing. Competitor analysis. Analysis paralysis disguised as research. Then I launched the WRONG idea. It made $9/month. I almost quit. Instead, I pivoted — without rebuilding the infrastructure. Second product: $47/mo. Third: $850. Fourth: $4,100. The system didn't care which idea I picked. That's when I named it: ideas are cartridges. The system is the printer.",
    theMethod: [
      "Build the 5-tool pipeline FIRST (freedom number → idea validation → stealth ops → launch → brand)",
      "Launch the 'wrong' idea to test the system — prove the pipeline works before optimizing the product",
      "Pivot ideas WITHOUT rebuilding infrastructure — swap the cartridge, keep the printer",
      "Score each idea on: market size × willingness to pay × your unfair advantage × build difficulty",
    ],
    theOutput: "A repeatable system that produces validated products regardless of which idea you start with.",
    theBigIdea:
      "Stop obsessing over the idea. Build the system first. The system works with any cartridge.",
  },
];

const MILESTONES = [
  { date: "2024-Q1", event: "Drafted resignation letter. Deleted it. Named the concept: Salary-Runway Method." },
  { date: "2024-Q2", event: "Team call panic. Named the Triple-Separation Protocol that night." },
  { date: "2024-Q3", event: "Launched wrong idea. Made $9. Named the Cartridge System." },
  { date: "2024-Q4", event: "Pivoted 3 times. $4,100 MRR. System proven." },
  { date: "2025-Q1", event: "Built Invisible Exit. Codified the 3 frameworks into teachable methodologies." },
  { date: "2025-Q2", event: "Launched the 5-tool pipeline as the implementation of all 3 frameworks." },
];

const FrameworkOriginsPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="The 3 Frameworks — Proprietary Methodologies | Invisible Exit"
        description="The Salary-Runway Method, The Triple-Separation Protocol, and The Cartridge System. Three proprietary frameworks developed over 14 months of building invisible recurring revenue."
        url="/frameworks"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary-light mb-6 animate-fade-in">
            The Methodologies
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] animate-fade-up">
            3 Frameworks That Took Me{" "}
            <span className="text-gradient-light">14 Months of Failure</span>{" "}
            to Discover
          </h1>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
            These aren't tips. They aren't theories. Each is a named, documented
            methodology with a specific origin story, a step-by-step process,
            and a measurable output. No one else teaches these because no one
            else built them.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/50 text-sm animate-fade-up" style={{ animationDelay: "200ms" }}>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> 3 named methodologies
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> 14 months of development
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" /> $4,100/month MRR proven
            </span>
          </div>
        </div>
      </section>

      {/* Each Framework */}
      {FRAMEWORKS.map((fw, idx) => (
        <section
          key={fw.num}
          className={idx % 2 === 0 ? "bg-white section-normal" : "bg-surface section-normal border-y border-border"}
        >
          <div className="container-narrow">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left: Framework identity */}
              <div className="lg:col-span-1">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${fw.bg} border ${fw.border} mb-4`}>
                  <fw.icon className={`w-7 h-7 ${fw.color}`} />
                </div>
                <p className={`text-xs font-bold uppercase tracking-wide ${fw.color} mb-2`}>
                  Framework #{fw.num}
                </p>
                <h2 className="text-h2 text-foreground mb-3">{fw.name}</h2>
                <p className="text-caption text-muted-foreground mb-4">
                  <strong>Origin:</strong> {fw.originDate}
                </p>
                <div className={`rounded-xl ${fw.bg} border ${fw.border} p-4`}>
                  <p className={`text-sm font-bold ${fw.color} mb-1`}>The Big Idea</p>
                  <p className="text-sm text-foreground/80 italic leading-relaxed">
                    "{fw.theBigIdea}"
                  </p>
                </div>
              </div>

              {/* Right: Origin story + Method */}
              <div className="lg:col-span-2 space-y-6">
                {/* Origin Story */}
                <div>
                  <p className="text-eyebrow text-primary mb-2">The Origin</p>
                  <h3 className="text-lg font-bold text-foreground mb-3">{fw.originTitle}</h3>
                  <div className="border-l-2 border-primary/30 pl-5 py-1">
                    <p className="text-body text-muted-foreground leading-relaxed">
                      {fw.originStory}
                    </p>
                  </div>
                </div>

                {/* The Method */}
                <div>
                  <p className="text-eyebrow text-primary mb-2">The Method</p>
                  <div className="space-y-2.5">
                    {fw.theMethod.map((step, si) => (
                      <div key={si} className="flex items-start gap-3">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg ${fw.bg} ${fw.color} text-xs font-bold shrink-0 mt-0.5`}>
                          {si + 1}
                        </span>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* The Output */}
                <div className={`rounded-xl ${fw.bg} border ${fw.border} p-4`}>
                  <p className={`text-xs font-bold uppercase tracking-wide ${fw.color} mb-1`}>The Output</p>
                  <p className="text-sm font-semibold text-foreground">{fw.theOutput}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Timeline */}
      <section className="hero-dark section-wide">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary-light mb-4">The Timeline</p>
            <h2 className="text-h1 text-white mb-4">How the Frameworks Were Built</h2>
            <p className="text-body text-white/60 max-w-xl mx-auto">
              Each framework was born from a specific moment of failure or
              insight. Here's the chronological story.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-1">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex items-start gap-4 py-4 border-b border-white/5 last:border-0">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary-light font-bold text-xs">
                    {i + 1}
                  </div>
                  {i < MILESTONES.length - 1 && <div className="w-px h-8 bg-white/10 mt-1" />}
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-primary-light text-xs font-mono mb-1">{m.date}</p>
                  <p className="text-white/70 text-sm leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white section-normal">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-foreground mb-4">
            These Frameworks Are Built Into Every Tool.
          </h2>
          <p className="text-body text-muted-foreground max-w-xl mx-auto mb-8">
            The Salary-Runway Method powers the FYM Dashboard. The Triple-Separation
            Protocol powers the Stealth Ops Hub. The Cartridge System powers the
            Idea Pipeline. You don't learn them — you use them.
          </p>
          <Link
            to="/freedom"
            onClick={() => trackEvent("frameworks_page_cta_clicked")}
            className="btn-primary text-lg px-8 inline-flex items-center gap-2"
          >
            Start Using the Frameworks
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FrameworkOriginsPage;
