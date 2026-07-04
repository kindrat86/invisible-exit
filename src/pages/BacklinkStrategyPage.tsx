import { Link } from "react-router-dom";
import { Link2, FileText, Mail, Search, TrendingUp, ArrowRight, Check, Target, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const GUEST_POST_TARGETS = [
  {
    site: "Indie Hackers",
    dr: "72",
    audience: "Founders, side-hustlers",
    angle: "How I built $4K MRR while employed (full timeline)",
    format: "Article or community post",
  },
  {
    site: "Mid (Medium publication)",
    dr: "95",
    audience: "Tech professionals, entrepreneurs",
    angle: "The math that proves your equity won't buy freedom",
    format: "Long-form article (2000+ words)",
  },
  {
    site: "Substack newsletters (career/finance)",
    dr: "50-80",
    audience: "Corporate professionals",
    angle: "Why I turned down a VP promotion (the MRR math)",
    format: "Guest post or cross-publication",
  },
  {
    site: "SaaStr / SaaS blogs",
    dr: "68",
    audience: "SaaS founders",
    angle: "Micro-SaaS for boring industries: the playbook",
    format: "Tactical how-to article",
  },
  {
    site: "r/Entrepreneur, r/SideHustle (Reddit)",
    dr: "92",
    audience: "Aspiring entrepreneurs",
    angle: "Value-first story posts (not link drops)",
    format: "Text post with engagement",
  },
  {
    site: "Dev.to / HackerNoon",
    dr: "70+",
    audience: "Developers, tech managers",
    angle: "Building micro-SaaS with AI tools (no code required)",
    format: "Technical-leaning article",
  },
  {
    site: "Career blogs (Ask a Manager, etc.)",
    dr: "65-85",
    audience: "Corporate employees",
    angle: "Side businesses that don't violate your employment contract",
    format: "Guest expert article",
  },
  {
    site: "FIRE / finance blogs",
    dr: "40-60",
    audience: "Financial independence seekers",
    angle: "Recurring revenue vs. stock options: which buys freedom faster?",
    format: "Comparison/guest post",
  },
];

const LINK_TYPES = [
  {
    icon: FileText,
    type: "Guest Posts",
    difficulty: "Medium",
    authority: "High",
    desc: "Write original articles for complementary sites. 1-2 per month. Each includes 1-2 contextual backlinks to pillar content.",
    examples: ["Indie Hackers community posts", "Medium publications", "Dev.to tutorials", "SaaS blog guest articles"],
  },
  {
    icon: Mail,
    type: "HARO / Source Requests",
    difficulty: "Low",
    authority: "Very High (DR 80+)",
    desc: "Respond to journalist queries on Connectively/HARO. 15 min/response. High DR backlinks from news sites.",
    examples: ["Forbes tech quotes", "Inc.com entrepreneur features", "Fast Company career articles", "Business Insider side-hustle pieces"],
  },
  {
    icon: Link2,
    type: "Link Exchanges",
    difficulty: "Low",
    authority: "Medium",
    desc: "Exchange links with complementary (non-competing) sites. Tool directories, resource lists, 'sites we recommend' pages.",
    examples: ["Side-hustle tool directories", 'No-code tool "resources" pages', "Micro-SaaS community link lists", "Career resource hubs"],
  },
  {
    icon: Search,
    type: "Resource Page Links",
    difficulty: "Medium",
    authority: "Medium-High",
    desc: "Find 'best tools for X' or 'resources for Y' pages and pitch Invisible Exit for inclusion.",
    examples: ['"Best tools for side businesses"', '"Resources for corporate entrepreneurs"', '"Micro-SaaS tools and platforms"', '"Financial independence resources"'],
  },
  {
    icon: Target,
    type: "Broken Link Building",
    difficulty: "Medium",
    authority: "High",
    desc: "Find broken links on relevant sites, create replacement content, pitch site owners to link to you instead.",
    examples: ["Dead micro-SaaS tool links", "Outdated side-hustle guides", "Broken career resource pages"],
  },
  {
    icon: TrendingUp,
    type: "Skyscraper Content",
    difficulty: "High",
    authority: "Very High",
    desc: "Find top-performing content in the niche, create something 10x better, then reach out to everyone who linked to the original.",
    examples: ['"Micro-SaaS ideas" (ours: 500+ ideas)', '"Side business while employed" (ours: full system)', '"Anonymous business" (ours: stealth framework)'],
  },
];

const CADENCE = [
  { week: "Week 1", task: "Set up Connectively (HARO) account. Respond to 3 queries.", links: "0-3 potential" },
  { week: "Week 2", task: "Pitch 2 guest posts (Indie Hackers + Dev.to). Find 5 resource pages.", links: "0-2 potential" },
  { week: "Week 3", task: "Publish first guest post. 5 HARO responses. 3 link exchange outreach.", links: "1-3 potential" },
  { week: "Week 4", task: "Publish pillar content (3000+ words). Pitch it to 10 linkers of competing content.", links: "0-2 potential" },
  { week: "Monthly target", task: "4 guest post pitches + 10 HARO responses + 5 link outreach", links: "2-5 quality backlinks/month" },
];

const BacklinkStrategyPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Backlink Strategy — Guest Posts, HARO & Link Building Framework | Invisible Exit"
        description="The complete backlink acquisition plan: guest post targets, HARO workflow, link exchange framework, and skyscraper content strategy. Turn 229 pages into an authoritative domain."
        url="/backlink-strategy"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Link2 className="w-4 h-4" />
            SEO Authority Building
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            <span className="text-gradient-light">Backlink</span> Strategy
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            229 pages. Zero roads leading to them.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            One guest post on a DR-70 site = more SEO value than 50 blog posts.
            Here's the framework to build the roads.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-white section-normal">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">The Problem</p>
          <h2 className="text-h1 text-foreground mb-4">A Library With No Roads</h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            You've built 229 pages of content. But Google doesn't rank content nobody links to.
            Without backlinks, your domain authority is near zero. Without authority, you don't rank.
            Without ranking, traffic stays at zero. Backlinks are the roads to your library.
          </p>
        </div>
      </section>

      {/* Guest Post Targets */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-4 text-center">The Targets</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">Guest Post Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {GUEST_POST_TARGETS.map((target) => (
              <div key={target.site} className="card-base p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-foreground text-sm">{target.site}</h3>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">DR {target.dr}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Audience: {target.audience}</p>
                <p className="text-xs text-foreground mb-2"><span className="text-muted-foreground">Angle:</span> {target.angle}</p>
                <p className="text-xs text-muted-foreground italic">{target.format}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Link Types */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-4 text-center">The Methods</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">6 Link Building Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {LINK_TYPES.map((lt) => (
              <div key={lt.type} className="card-base p-6 card-hover">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <lt.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{lt.type}</h3>
                <div className="flex gap-2 mb-3">
                  <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded">{lt.difficulty}</span>
                  <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded">{lt.authority}</span>
                </div>
                <p className="text-caption mb-3">{lt.desc}</p>
                <div className="space-y-1">
                  {lt.examples.map((ex) => (
                    <div key={ex} className="flex items-start gap-1.5">
                      <Check className="w-3 h-3 text-success mt-1 shrink-0" />
                      <span className="text-xs text-muted-foreground">{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Cadence */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">The Cadence</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">Monthly Link Building Schedule</h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {CADENCE.map((item) => (
              <div key={item.week} className={`card-base p-4 flex items-center gap-4 ${item.week === "Monthly target" ? "bg-primary/5 border-primary/20" : ""}`}>
                <span className={`inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-bold shrink-0 ${item.week === "Monthly target" ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                  {item.week}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{item.task}</p>
                  <p className="text-xs text-muted-foreground">{item.links}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">The Tools</p>
          <h2 className="text-h1 text-foreground mb-8 text-center">Recommended Link Building Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              { tool: "Connectively (HARO)", purpose: "Journalist queries → high-DR backlinks", cost: "Free" },
              { tool: "Ahrefs Free Backlink Checker", purpose: "Check competitor backlinks", cost: "Free" },
              { tool: "Google Search Console", purpose: "Track rankings & impressions", cost: "Free" },
              { tool: "Hunter.io", purpose: "Find editor/host email addresses", cost: "Free tier" },
            ].map((t) => (
              <div key={t.tool} className="card-base p-4 flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{t.tool}</p>
                  <p className="text-xs text-muted-foreground">{t.purpose}</p>
                </div>
                <span className="text-xs bg-success/10 text-success px-2 py-1 rounded shrink-0">{t.cost}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <Link2 className="w-12 h-12 text-primary-light mx-auto mb-6" />
          <h2 className="text-h1 text-white mb-4">Start Building Roads.</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            One quality backlink per week. In 6 months, 26 backlinks. That's enough to transform
            your domain authority and unlock the traffic your 229 pages deserve.
          </p>
          <Link to="/traffic-blueprint" className="btn-primary text-lg">
            Back to Traffic Blueprint
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BacklinkStrategyPage;
