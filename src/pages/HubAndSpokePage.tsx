import { Link } from "react-router-dom";
import { ArrowRight, Target, FileText, Link2, Search, BookOpen, Share2, TrendingUp, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

/**
 * TRAFFIC SECRETS: Chapters 11-12 — The Magnetic Content Formula
 *
 * Russell's Hub-and-Spoke framework:
 *   - The HUB: A 3000+ word definitive guide on one topic
 *   - The SPOKES: 10+ short pieces that link to the hub
 *   - The AUTHORITY: Each spoke passes link equity to the hub
 *   - The TRAFFIC: The hub ranks for dozens of long-tail keywords
 *
 * This page documents our pillar content strategy and the 3 hubs we need to build.
 */
const PILLAR_HUBS = [
  {
    slug: "how-to-build-a-side-business-while-employed",
    title: "How to Build a Side Business While Employed (The 2025 Playbook)",
    targetKeywords: [
      "build a side business while employed",
      "side business while working full time",
      "how to start a side business while employed",
      "side hustle while working 9-5",
      "build passive income while employed",
    ],
    volume: "22K/mo target keywords",
    wordCount: "5000+ words",
    internalLinks: 15,
    currentStatus: "Not started",
    priority: "Critical",
  },
  {
    slug: "how-to-quit-your-job-without-losing-income",
    title: "How to Quit Your Job Without Losing Income: The Freedom Number System",
    targetKeywords: [
      "how to quit your job without losing income",
      "quit your job and start a business",
      "financial independence calculator",
      "how much money do I need to quit my job",
      "recurring revenue replace salary",
    ],
    volume: "18K/mo target keywords",
    wordCount: "4000+ words",
    internalLinks: 12,
    currentStatus: "Partially covered by /blog posts",
    priority: "High",
  },
  {
    slug: "start-anonymous-business-while-employed",
    title: "How to Start a Business Without Your Employer Finding Out (The Stealth Framework)",
    targetKeywords: [
      "start a business without employer knowing",
      "anonymous business ownership",
      "side business non compete",
      "start an LLC anonymously",
      "stealth business setup",
    ],
    volume: "14K/mo target keywords",
    wordCount: "4000+ words",
    internalLinks: 10,
    currentStatus: "Partially covered by blog posts",
    priority: "High",
  },
];

const PILLAR_STRUCTURE = [
  {
    part: "The Hook",
    elements: [
      "Pattern interrupt headline (curiosity gap)",
      "The 'before' state — specific pain the reader feels right now",
      "One-paragraph story that proves you solved it",
      "The promise: what they'll know after reading",
    ],
  },
  {
    part: "The Framework",
    elements: [
      "Numbered system (e.g., 'The 5-Step Freedom Framework')",
      "Each step = one H2 section with clear action",
      "Inline stats, screenshots, and real numbers",
      "Internal links to spoke pages for deeper dives",
    ],
  },
  {
    part: "The Proof",
    elements: [
      "Real revenue numbers (from FYM Dashboard)",
      "Timeline screenshots (Month 1 → Month 12 arc)",
      "Social proof box (honest community stats)",
      "3 specific case studies with names/results",
    ],
  },
  {
    part: "The Offer",
    elements: [
      "CTA to the Freedom Number calculator (/freedom)",
      "CTA to the relevant spoke content",
      "Soft upsell to founding membership",
      '"What to do next" 3-option framework',
    ],
  },
];

const SPOKE_EXAMPLES = [
  { title: "Micro-SaaS vs Freelancing: Which Builds Freedom Faster?", hub: "Hub 1", type: "Comparison" },
  { title: "The 5-Hour Weekly Operating System for Side Businesses", hub: "Hub 1", type: "Tactical Guide" },
  { title: "Non-Compete Clauses: What Actually Enforceable?", hub: "Hub 3", type: "Legal Explainer" },
  { title: "How Much Does an LLC Cost in Each State?", hub: "Hub 3", type: "Data-Driven" },
  { title: "The $4,000/Month Freedom Number: Real-World Examples", hub: "Hub 2", type: "Case Study" },
  { title: "10 Side Businesses That Don't Violate Your Employment Contract", hub: "Hub 3", type: "Listicle" },
  { title: "Why I Turned Down a VP Promotion (The Math)", hub: "Hub 2", type: "Story" },
  { title: "The 90-Day Content Calendar for Anonymous Brands", hub: "Hub 1", type: "Template" },
  { title: "Stripe, PayPal, or Gumroad: Which Is Safest for Anonymous Businesses?", hub: "Hub 3", type: "Comparison" },
  { title: "How to Validate a Micro-SaaS Idea in 48 Hours", hub: "Hub 1", type: "Tactical Guide" },
];

const HubAndSpokePage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Hub-and-Spoke Content Strategy — 3 Pillar Guides | Invisible Exit"
        description="The complete Traffic Secrets content strategy: 3 pillar guides (5000+ words each) linked to 30+ spoke posts. Turn 229 pages into an SEO machine."
        url="/content-strategy"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <BookOpen className="w-4 h-4" />
            Traffic Secrets Ch 11-12: Magnetic Content
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            The Hub-and-Spoke{" "}
            <span className="text-gradient-light">Content Strategy</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            229 pages with no backlinks? Fix it with pillar content.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            3 pillar guides. 30+ spoke posts. Each spoke links to a hub. Each hub links to
            the funnel. The result: Google sees an authoritative site, not a content farm.
          </p>
        </div>
      </section>

      {/* The Framework */}
      <section className="bg-white section-normal">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">Russell's Framework</p>
          <h2 className="text-h1 text-foreground mb-4">How Hub-and-Spoke Works</h2>
          <div className="max-w-2xl mx-auto text-left space-y-4">
            <div className="card-base p-6 border-l-4 border-primary">
              <p className="font-bold text-foreground mb-2">🏛️ The Hub (Pillar Guide)</p>
              <p className="text-caption">A 4000-5000 word definitive guide on one broad topic. This is the page that ranks for your highest-volume keyword. It links out to spoke pages for deeper dives on subtopics.</p>
            </div>
            <div className="card-base p-6 border-l-4 border-amber-400 ml-4">
              <p className="font-bold text-foreground mb-2">↗️ The Spokes (Supporting Posts)</p>
              <p className="text-caption">10+ shorter posts (800-1500 words) that each cover one subtopic in depth. Every spoke links BACK to the hub. This creates an internal link network that Google rewards.</p>
            </div>
            <div className="card-base p-6 border-l-4 border-emerald-400 ml-8">
              <p className="font-bold text-foreground mb-2">🔗 The Flywheel</p>
              <p className="text-caption">Backlinks to spokes → authority flows to the hub → hub ranks higher → more traffic → more internal clicks to funnel. The system compounds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillar Hubs */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-4 text-center">The Plan</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">3 Pillar Hubs We Need to Build</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {PILLAR_HUBS.map((hub, i) => (
              <div key={hub.slug} className="card-base p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white font-bold text-lg shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">{hub.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                        {hub.wordCount}
                      </span>
                      <span className="text-xs bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-full font-medium">
                        {hub.internalLinks} internal links
                      </span>
                      <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full font-medium">
                        {hub.volume}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        hub.priority === "Critical" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-600"
                      }`}>
                        {hub.priority}
                      </span>
                    </div>
                    <div className="space-y-1 mb-3">
                      {hub.targetKeywords.map((kw) => (
                        <div key={kw} className="flex items-start gap-2">
                          <Search className="w-3 h-3 text-primary mt-1 shrink-0" />
                          <span className="text-xs text-muted-foreground">{kw}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-primary/5 rounded-lg p-3 border-l-2 border-primary">
                      <p className="text-xs text-foreground">
                        <span className="font-semibold">Status:</span> {hub.currentStatus}
                        <br />
                        <span className="font-semibold">Total keyword volume:</span> {hub.volume}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillar Structure */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">The Blueprint</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">Anatomy of a Pillar Guide</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {PILLAR_STRUCTURE.map((section) => (
              <div key={section.part} className="card-base p-6">
                <h3 className="font-bold text-foreground mb-3">{section.part}</h3>
                <div className="space-y-2">
                  {section.elements.map((el) => (
                    <div key={el} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{el}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spoke Examples */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">The Spokes</p>
          <h2 className="text-h1 text-foreground mb-4 text-center">10 Spoke Post Ideas</h2>
          <p className="text-body text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Each spoke links back to its hub. Most already exist as blog posts — they just need
            internal links added.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {SPOKE_EXAMPLES.map((spoke) => (
              <div key={spoke.title} className="card-base p-4 flex items-start gap-3">
                <Link2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-foreground font-medium">{spoke.title}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-primary">{spoke.hub}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{spoke.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Projection */}
      <section className="bg-white section-normal">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">The Impact</p>
          <h2 className="text-h1 text-foreground mb-8">What 3 Pillar Hubs Unlock</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { number: "54K", label: "Combined monthly keyword volume", detail: "Across 3 pillar guides" },
              { number: "37", label: "Internal links per hub (spokes + hub)", detail: "Pumping authority through the site" },
              { number: "6-9", label: "months to rank", detail: "With 2-4 backlinks per hub" },
            ].map((stat) => (
              <div key={stat.number} className="card-base p-6">
                <p className="text-4xl font-bold text-primary mb-1">{stat.number}</p>
                <p className="text-sm font-semibold text-foreground mb-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <Target className="w-12 h-12 text-primary-light mx-auto mb-6" />
          <h2 className="text-h1 text-white mb-4">Build the First Hub This Week.</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            Pick Hub #1: "How to Build a Side Business While Employed." Write 5000 words.
            Link to 15 existing blog posts. Publish. Start the flywheel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/traffic-blueprint" className="btn-primary text-lg">
              Back to Traffic Blueprint
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
              <FileText className="w-4 h-4" /> Browse Existing Blog Posts
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HubAndSpokePage;
