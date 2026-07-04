import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  TrendingUp,
  ArrowRight,
  Check,
  Layers,
  Search,
  Clock,
  Target,
  PenLine,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const PILLAR_GUIDES = [
  {
    title: "The Complete Guide to Building a Side Business While Employed",
    slug: "complete-guide-building-side-business-while-employed",
    targetWords: 5000,
    targetKeyword: "side business while employed",
    searchVolume: "2,400/mo",
    keywordDifficulty: "Medium",
    structure: [
      "Section 1: The Problem — Why employed professionals are uniquely positioned (but uniquely trapped)",
      "Section 2: The Math — Freedom Number framework, equity math, MRR vs salary",
      "Section 3: The Vehicle — Why your job is the launchpad, not the trap (Secret #1)",
      "Section 4: The Stealth — Entity separation, anonymity stack, non-compete navigation (Secret #2)",
      "Section 5: The System — The Cartridge System, why system beats idea (Secret #3)",
      "Section 6: The Tools — 5-tool stack walkthrough (FYM, Pipeline, Stealth Ops, Launch, Brand)",
      "Section 7: The Timeline — Month-by-month roadmap ($0 → $4,100 MRR in 12 months)",
      "Section 8: The Mistakes — 10 common failures and how to avoid each",
      "Section 9: The Legal — Non-compete, IP assignment, employment contract clauses",
      "Section 10: The First Customer — Outreach scripts, validation, pricing",
    ],
    internalLinks: [
      "→ /freedom (Freedom Number Calculator)",
      "→ /story (Amsterdam origin story)",
      "→ /masterclass (3 Secrets framework)",
      "→ /frameworks (3 proprietary methodologies)",
      "→ /blog/non-compete (Legal guide)",
      "→ /blog/first-10-customers (Customer acquisition)",
    ],
    estimatedTime: "8-10 hours writing + 2 hours editing",
  },
  {
    title: "Micro-SaaS Ideas for Corporate Managers: The Definitive Guide",
    slug: "micro-saas-ideas-corporate-managers-definitive-guide",
    targetWords: 4000,
    targetKeyword: "micro saas ideas",
    searchVolume: "12,000/mo",
    keywordDifficulty: "High",
    structure: [
      "Section 1: What is micro-SaaS (and why it beats traditional startups for employed founders)",
      "Section 2: The boring business advantage — why boring industries pay better",
      "Section 3: 50+ micro-SaaS ideas by industry (healthcare, legal, finance, real estate, education, HR)",
      "Section 4: The 48-hour validation framework — test before you build",
      "Section 5: AI tools that replace a 5-person team (the Invisible Exit stack)",
      "Section 6: Pricing models — subscription, one-time, freemium, usage-based",
      "Section 7: Case studies — 3 products from $0 to $4K MRR (pseudonymous)",
      "Section 8: The build-vs-buy decision — when to build, when to buy, when to partner",
    ],
    internalLinks: [
      "→ /ideas (Industry ideas directory — 155 pages)",
      "→ /blog/validate-micro-saas-idea-in-48-hours (Validation framework)",
      "→ /best (AI tools directory)",
      "→ /masterclass (Free masterclass)",
    ],
    estimatedTime: "6-8 hours writing + 2 hours editing",
  },
  {
    title: "The Non-Compete Clause Survival Guide for Side Business Founders",
    slug: "non-compete-survival-guide-side-business-founders",
    targetWords: 3500,
    targetKeyword: "non compete side business",
    searchVolume: "1,300/mo",
    keywordDifficulty: "Low",
    structure: [
      "Section 1: What a non-compete actually covers (and what it doesn't)",
      "Section 2: State-by-state enforceability guide (California, New York, Texas, Florida, Illinois)",
      "Section 3: The Triple-Separation Protocol — how to build without triggering clauses",
      "Section 4: IP assignment clauses — what your employer actually owns",
      "Section 5: Moonlighting clauses — what they say vs what they mean",
      "Section 6: The Stealth Ops checklist — 15-point pre-launch audit",
      "Section 7: What to do if you get caught — damage control playbook",
      "Section 8: When to talk to a lawyer (and when not to)",
    ],
    internalLinks: [
      "→ /non-compete (State-by-state matrix — 50 pages)",
      "→ /guides (State guides)",
      "→ /freedom (Calculate your freedom number first)",
    ],
    estimatedTime: "5-6 hours writing + 1 hour legal review",
  },
  {
    title: "How to Build an Audience Anonymously (The Faceless Brand Playbook)",
    slug: "build-audience-anonymously-faceless-brand-playbook",
    targetWords: 4000,
    targetKeyword: "anonymous side business, faceless brand",
    searchVolume: "880/mo",
    keywordDifficulty: "Low",
    structure: [
      "Section 1: Why anonymity is strategy, not limitation",
      "Section 2: The anonymity stack — entity, domain, email, payment, social, content",
      "Section 3: Building a faceless personal brand — Adrian case study",
      "Section 4: Content strategy for anonymous creators — Twitter, Reddit, YouTube, LinkedIn",
      "Section 5: The 90-day content calendar — story-driven content that converts without a face",
      "Section 6: How to handle discovery — what to do when someone connects the dots",
      "Section 7: Transitioning from anonymous to public — when and how (if ever)",
    ],
    internalLinks: [
      "→ /story (Adrian's origin story)",
      "→ /content-calendar (90-day content calendar)",
      "→ /blog/how-to-build-a-business-while-employed-without-using-your-real-name (Anonymity guide)",
      "→ /freedom (Start building)",
    ],
    estimatedTime: "6-8 hours writing + 2 hours editing",
  },
  {
    title: "From $120K Salary to $4K MRR: The 12-Month Transition Timeline",
    slug: "120k-salary-to-4k-mrr-12-month-timeline",
    targetWords: 4500,
    targetKeyword: "passive income while employed",
    searchVolume: "6,600/mo",
    keywordDifficulty: "High",
    structure: [
      "Section 1: Month 0 — The decision (and the math behind it)",
      "Section 2: Months 1-3 — System setup, first product, zero revenue",
      "Section 3: Month 4 — The wall, the near-quit, the first customer ($9/mo)",
      "Section 4: Months 5-8 — Finding product-market fit ($100 → $850 MRR)",
      "Section 5: Months 9-12 — Scaling the system ($850 → $4,100 MRR)",
      "Section 6: The identity shift — how earning online changes your relationship with your salary",
      "Section 7: The decision point — when MRR exceeds your comfort threshold, what next?",
      "Section 8: The mistakes that cost me 3 months (and how to avoid them)",
    ],
    internalLinks: [
      "→ /freedom (Freedom Number Calculator)",
      "→ /story (Full origin story — 11 chapters)",
      "→ /masterclass (The 3 Secrets)",
      "→ /proof (Case studies and proof)",
      "→ /timeline (Revenue milestones)",
    ],
    estimatedTime: "7-9 hours writing + 2 hours editing",
  },
];

const CONTENT_GAPS = [
  {
    gap: "Average post length: 651 words",
    impact: "Google prioritizes comprehensive content. 651 words is thin content.",
    fix: "Pillar guides target 3,500-5,000 words. Update 10 shortest posts to 1,200+ words.",
    priority: "P0",
  },
  {
    gap: "Zero posts over 2,000 words",
    impact: "No linkable assets. Bloggers and journalists don't link to 600-word posts.",
    fix: "Publish 5 pillar guides (3,500+ words each). These become the backlink magnets.",
    priority: "P0",
  },
  {
    gap: "45 of 53 posts under 800 words",
    impact: "Low topical authority. Google sees the site as surface-level, not expert.",
    fix: "Batch-update: 10 posts/week expanded to 1,200+ words with added depth, examples, data.",
    priority: "P1",
  },
  {
    gap: "No content cluster strategy",
    impact: "Pillar pages need cluster content (supporting articles) that link back to them.",
    fix: "Each pillar guide gets 5-8 supporting blog posts that link to it with optimized anchor text.",
    priority: "P1",
  },
  {
    gap: "No original data or research",
    impact: "Original data = backlink magnet. Reporters link to data, not opinions.",
    fix: "Publish 1 original data report per quarter (e.g., 'State of Side Businesses 2026').",
    priority: "P2",
  },
];

const PILLAR_HUB_PAGE = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Pillar Content Hub — 5 Definitive Guides to Write | Invisible Exit"
        description="The pillar content strategy: 5 definitive guides (3,500-5,000 words each) targeting high-volume keywords, designed as linkable assets to transform domain authority."
        url="/pillar-hub"
      />
      <Navbar />

      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Layers className="w-4 h-4" />
            Secret #7: Pillar Content
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Pillar Content <span className="text-gradient-light">Hub</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            Russell says: become the expert. Pillar content is how you do it. These are
            5 definitive guides that establish topical authority and attract backlinks.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            Each guide targets 3,500-5,000 words, a high-volume keyword, and 5+ internal links.
            Total writing time: ~40 hours. ROI: permanent SEO assets.
          </p>
        </div>
      </section>

      {/* Content Gap Analysis */}
      <section className="bg-amber-50 border-b border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50 py-6">
        <div className="container-narrow">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Current State: Content Gap Analysis
          </h2>
          <div className="space-y-3">
            {CONTENT_GAPS.map((g, i) => (
              <div key={i} className="bg-white dark:bg-surface rounded-lg p-4 border border-border flex items-start gap-4">
                <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold shrink-0 ${
                  g.priority === "P0" ? "bg-red-500/10 text-red-500" :
                  g.priority === "P1" ? "bg-amber-500/10 text-amber-500" :
                  "bg-slate-500/10 text-slate-400"
                }`}>{g.priority}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{g.gap}</p>
                  <p className="text-xs text-muted-foreground mt-1"><strong>Impact:</strong> {g.impact}</p>
                  <p className="text-xs text-primary mt-1"><strong>Fix:</strong> {g.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 5 Pillar Guides */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            5 Pillar Guides to Write
          </h2>
          <p className="text-muted-foreground mb-8">
            Each guide is a permanent SEO asset. Write them once, update them annually, and
            they compound traffic for years.
          </p>
          <div className="space-y-8">
            {PILLAR_GUIDES.map((guide, i) => (
              <div key={i} className="card-base overflow-hidden">
                <div className="p-6 border-b border-border bg-surface/50">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white font-bold">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">{guide.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        Target: <strong>{guide.targetWords.toLocaleString()} words</strong> ·
                        Keyword: <code className="text-primary">{guide.targetKeyword}</code> ·
                        Volume: {guide.searchVolume} ·
                        Difficulty: {guide.keywordDifficulty}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Estimated: {guide.estimatedTime}</span>
                  </div>
                </div>

                {/* Structure */}
                <div className="p-6">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                    Section Structure ({guide.structure.length} sections)
                  </p>
                  <div className="space-y-2 mb-6">
                    {guide.structure.map((s, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                          {j + 1}
                        </span>
                        <span className="text-sm text-muted-foreground">{s}</span>
                      </div>
                    ))}
                  </div>

                  {/* Internal Links */}
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                      Internal Linking Targets
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {guide.internalLinks.map((l, j) => (
                        <code key={j} className="text-xs px-2 py-1 rounded bg-primary/5 text-primary border border-primary/10">
                          {l}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Cluster Strategy */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Content Cluster Strategy</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Each pillar guide becomes the hub. Surrounding it are 5-8 supporting articles (cluster
            content) that link back to the pillar with optimized anchor text.
          </p>
          <div className="card-base p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white mb-3">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">The Hub-and-Spoke Model</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-lg mx-auto">
                Pillar guide (hub) → 5-8 supporting blog posts (spokes) → each spoke links
                back to hub → hub links to all spokes → Google sees topical authority.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-white dark:bg-surface border border-border">
                <p className="font-semibold text-foreground mb-2">Example: "Side Business While Employed" Pillar</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>→ Pillar: Complete Guide (5,000 words)</li>
                  <li>→ Spoke 1: "How to validate your idea in 48 hours"</li>
                  <li>→ Spoke 2: "Non-compete clauses explained"</li>
                  <li>→ Spoke 3: "Best AI tools for solo founders"</li>
                  <li>→ Spoke 4: "First 10 customers: outreach scripts"</li>
                  <li>→ Spoke 5: "Time management for employed founders"</li>
                  <li>→ Spoke 6: "Tax implications of side income"</li>
                  <li>→ Spoke 7: "When to tell your employer"</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-white dark:bg-surface border border-border">
                <p className="font-semibold text-foreground mb-2">Why It Works</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✓ Pillar ranks for the broad keyword</li>
                  <li>✓ Spokes rank for long-tail variations</li>
                  <li>✓ Internal links pass authority between pages</li>
                  <li>✓ Google sees a topical cluster, not isolated posts</li>
                  <li>✓ Backlinks to any spoke boost the whole cluster</li>
                  <li>✓ Pillar becomes the definitive resource (linkable asset)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publishing Schedule */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Publishing Schedule</h2>
          <p className="text-muted-foreground mb-8">
            One pillar guide every 2 weeks. 5 guides in 10 weeks. Then maintain.
          </p>
          <div className="space-y-3">
            {PILLAR_GUIDES.map((g, i) => (
              <div key={i} className="card-base p-4 flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white font-bold shrink-0">
                  W{i * 2 + 1}-{i * 2 + 2}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{g.title}</p>
                  <p className="text-xs text-muted-foreground">{g.targetWords.toLocaleString()} words · {g.searchVolume} search volume</p>
                </div>
                <PenLine className="w-5 h-5 text-muted-foreground" />
              </div>
            ))}
            <div className="card-base p-4 flex items-center gap-4 bg-primary/5 border-primary/20">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-success text-white shrink-0">
                <Check className="w-5 h-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Week 11+: Update existing content</p>
                <p className="text-xs text-muted-foreground">Expand 10 shortest blog posts to 1,200+ words each. Refresh stats, add examples.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PILLAR_HUB_PAGE;
