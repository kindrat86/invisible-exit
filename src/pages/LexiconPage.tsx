import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, TrendingUp, Shield, Layers, Lock, DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

/**
 * EXPERT SECRETS: Chapter 13 — Us vs Them / Tribal Identity
 *
 * Russell: "A movement needs shared language. When people use the same
 * words, they feel like they belong to the same tribe."
 *
 * This page defines the proprietary vocabulary of the Invisible Exit
 * movement. Each term reinforces the worldview and creates in-group
 * identity. Members who use these terms signal belonging.
 */

interface Term {
  term: string;
  pronunciation?: string;
  definition: string;
  origin: string;
  usage: string;
  category: "core" | "framework" | "metric" | "identity";
}

const TERMS: Term[] = [
  {
    term: "Freedom Number",
    definition: "The exact monthly recurring revenue needed to replace your salary and cover expenses. The number that makes employment optional.",
    origin: "Born from the realization that 0.5% equity = $120K/year passive = your salary. Freedom isn't a feeling — it's a number.",
    usage: "'I calculated my Freedom Number: $4,200/month. That's 145 customers at $29.'",
    category: "metric",
  },
  {
    term: "Golden Handcuffs",
    definition: "The equity, salary, and benefits that keep you tethered to a job you'd otherwise leave. They feel like rewards but function as restraints.",
    origin: "Universal term, repurposed: 'The handcuffs are gold, but they're still handcuffs.'",
    usage: "'I'm wearing the golden handcuffs. 0.5% equity, 18-month IPO clock. The cage is comfortable. That's the problem.'",
    category: "core",
  },
  {
    term: "The Invisible Exit",
    definition: "Building recurring revenue under a pseudonymous identity while employed, so that your employer never knows until you choose to leave.",
    origin: "Coined in Amsterdam, 6 AM, after receiving a Stripe notification while reading corporate emails.",
    usage: "'I'm building my Invisible Exit. 5 hours a week. Nobody at work knows.'",
    category: "core",
  },
  {
    term: "The Salary-Runway Method",
    definition: "Proprietary framework. Treats your employment salary as non-dilutive startup funding — runway that costs zero equity.",
    origin: "Named the night Adrian deleted his resignation letter and reframed salary as funding.",
    usage: "'Using the Salary-Runway Method, I have 14 months of runway at zero equity cost.'",
    category: "framework",
  },
  {
    term: "The Triple-Separation Protocol",
    definition: "Proprietary framework. Three layers of separation: legal entity, digital footprint, and identity. Makes employer detection mathematically impossible.",
    origin: "Named the night of the '3-second panic' — when a colleague found a similar website on a team call.",
    usage: "'I set up the Triple-Separation Protocol: Wyoming LLC, anonymous domain, separate Stripe. Zero connection.'",
    category: "framework",
  },
  {
    term: "The Cartridge System",
    definition: "Proprietary framework. Build the 5-tool pipeline first, then swap product ideas in and out like cartridges in a printer. The system doesn't care which idea you pick.",
    origin: "Named after pivoting from a $9/month product to $4,100/month — without rebuilding infrastructure.",
    usage: "'Stop choosing ideas. Use the Cartridge System. Build the pipeline, swap cartridges.'",
    category: "framework",
  },
  {
    term: "The 3%",
    definition: "The minority of corporate managers who act instead of bookmark. The ones who calculate their freedom number and start building.",
    origin: "'97% will read this and go back to their spreadsheet. 3% will calculate their freedom number.'",
    usage: "'You read the whole page? You're in the 3%. Welcome.'",
    category: "identity",
  },
  {
    term: "The Cage Has a Door",
    definition: "The core metaphor of the movement. Employment feels like a cage, but it has a door — you just have to look for it and build the key.",
    origin: "Amsterdam taxi moment: the first $0.97 Stripe payment proved the door existed.",
    usage: "'The cage has a door. Most people never look for it. I found it.'",
    category: "core",
  },
  {
    term: "Cartridge",
    definition: "A product idea that plugs into the 5-tool pipeline. Interchangeable. The system works with any cartridge — the pipeline is what matters.",
    origin: "From the Cartridge System: 'ideas are cartridges, the system is the printer.'",
    usage: "'My first cartridge made $9. Third cartridge hit $850. The printer works.'",
    category: "framework",
  },
  {
    term: "Stealth Score",
    definition: "A 0-100 rating of how invisible your side business is to your employer. Based on entity separation, digital footprint, and identity overlap.",
    origin: "Adrian's Stealth Ops Hub: automated compliance audit producing a numeric invisibility score.",
    usage: "'My Stealth Score went from 34 to 92 after I set up the Triple-Separation Protocol.'",
    category: "metric",
  },
  {
    term: "5 Hours",
    definition: "The weekly time budget for building. Not a limitation — a forcing function that creates ruthless focus.",
    origin: "'I have 5 hours a week. That's enough. It has to be enough. And it is.'",
    usage: "'I built $4,100/month in 5 hours a week. The constraint was the advantage.'",
    category: "core",
  },
  {
    term: "Invisible Builder",
    definition: "A corporate manager who builds recurring revenue anonymously while employed. Member of the Invisible Exit movement.",
    origin: "Identity marker for members of the movement. Anonymous by design, not by accident.",
    usage: "'I'm an Invisible Builder. My Stripe dashboard grows. My LinkedIn stays empty.'",
    category: "identity",
  },
  {
    term: "Boring Product",
    definition: "A micro-SaaS in an unsexy market (plumbing, logistics, electricians). Less competition, higher willingness to pay, lower churn.",
    origin: "'The boring product (a PDF generator for electricians) pays most of the mortgage.'",
    usage: "'I chose a boring product — scheduling tool for dental offices. $47/month per user. Zero competition.'",
    category: "core",
  },
  {
    term: "We don't wait for exits. We build our own.",
    definition: "The movement's rallying cry. Replaces the passive 'waiting for IPO' mentality with active building.",
    origin: "Adopted as the official rallying cry of the Invisible Exit movement.",
    usage: "[Used as a statement of identity and commitment by members of the 3%.]",
    category: "identity",
  },
];

const CATEGORY_META = {
  core: { label: "Core Concepts", icon: BookOpen, color: "text-primary" },
  framework: { label: "Proprietary Frameworks", icon: Layers, color: "text-amber-500" },
  metric: { label: "Movement Metrics", icon: TrendingUp, color: "text-emerald-500" },
  identity: { label: "Identity & Belonging", icon: Shield, color: "text-blue-500" },
};

const LexiconPage = () => {
  const grouped = Object.keys(CATEGORY_META).map((cat) => ({
    category: cat as keyof typeof CATEGORY_META,
    terms: TERMS.filter((t) => t.category === cat),
  }));

  return (
    <div className="min-h-screen">
      <SEOHead
        title="The Invisible Exit Lexicon | Movement Vocabulary"
        description="The proprietary language of the Invisible Exit movement. Freedom Number, Golden Handcuffs, The Cartridge System, and more. Speak the language of the 3%."
        url="/lexicon"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary-light mb-6 animate-fade-in">
            The Lexicon
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] animate-fade-up">
            The Language of{" "}
            <span className="text-gradient-light">the Invisible Builder</span>
          </h1>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
            Every movement has shared vocabulary. When you use these words, you
            signal belonging. When you understand them, you've already joined.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/50 text-sm animate-fade-up" style={{ animationDelay: "200ms" }}>
            <span>{TERMS.length} terms</span>
            <span>·</span>
            <span>4 categories</span>
            <span>·</span>
            <span>3 proprietary frameworks</span>
          </div>
        </div>
      </section>

      {/* Terms by category */}
      {grouped.map((group) => {
        const meta = CATEGORY_META[group.category];
        return (
          <section key={group.category} className="bg-white section-normal border-b border-border last:border-0">
            <div className="container-narrow">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <meta.icon className={`w-5 h-5 ${meta.color}`} />
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wide ${meta.color}`}>{meta.label}</p>
                  <p className="text-muted-foreground text-xs">{group.terms.length} terms</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.terms.map((term) => (
                  <div key={term.term} className="card-base p-5 card-hover">
                    <h3 className="font-bold text-foreground text-base mb-2">
                      {term.term}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {term.definition}
                    </p>
                    {term.origin && (
                      <div className="border-l-2 border-primary/20 pl-3 mb-2">
                        <p className="text-xs text-muted-foreground/70 italic">
                          <span className="font-semibold not-italic">Origin:</span> {term.origin}
                        </p>
                      </div>
                    )}
                    {term.usage && (
                      <div className="bg-surface rounded-lg p-3 mt-2">
                        <p className="text-xs text-foreground/70 italic">
                          {term.usage}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-4">Speak the Language. Join the Movement.</h2>
          <p className="text-body text-white/60 mb-10 max-w-xl mx-auto">
            The vocabulary is the gateway. The system is the vehicle. Your freedom
            number is the destination. Start with 90 seconds.
          </p>
          <Link
            to="/freedom"
            onClick={() => trackEvent("lexicon_cta_clicked")}
            className="btn-primary text-lg px-8 inline-flex items-center gap-2"
          >
            Calculate Your Freedom Number
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LexiconPage;
