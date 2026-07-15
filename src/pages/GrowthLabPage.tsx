import { Link } from "react-router-dom";
import {
  Target,
  Anchor,
  Megaphone,
  Calendar,
  Users,
  TrendingUp,
  ArrowRight,
  Zap,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const TOOLS = [
  {
    icon: Target,
    title: "Dream 100 Tracker",
    description: "100 identified targets across 3 tiers. Track outreach stages, touch counts, and follow-ups. The Russell Brunson strategy, built as a functional tool.",
    link: "/dream-100-tracker",
    stat: "100 targets",
    statColor: "text-blue-400",
    items: ["3 tiers: Partners, Affiliates, Amplifiers", "5-stage pipeline tracking", "5x follow-up rule built in", "CSV export + localStorage"],
  },
  {
    icon: Anchor,
    title: "Hooks Library",
    description: "50+ ready-to-deploy content hooks categorized by the 6 Story Gaps, 5 awareness levels, and 4 platforms. Track each hook from draft → deployed → winner.",
    link: "/hooks",
    stat: "50+ hooks",
    statColor: "text-amber-400",
    items: ["Who / What / Where / When / Why / How gaps", "Platform + awareness filtering", "Deployment status tracking", "Copy-and-deploy workflow"],
  },
  {
    icon: Megaphone,
    title: "Ad Creative Library",
    description: "8 ready-to-launch ad concepts with full targeting presets, copy, and budget recommendations. Track campaigns from concept → live → winning.",
    link: "/ad-library",
    stat: "8 campaigns",
    statColor: "text-emerald-400",
    items: ["4 audience archetypes mapped", "4 targeting presets (Meta, LinkedIn, Reddit, Google)", "Campaign status tracking", "Phased launch sequence"],
  },
  {
    icon: Calendar,
    title: "Content Calendar",
    description: "30 days of multi-platform content from Seinfeld email stories. Pre-written for Twitter, Reddit, LinkedIn, and YouTube. Copy, paste, post.",
    link: "/content-calendar",
    stat: "30 days",
    statColor: "text-purple-400",
    items: ["Daily content for 4 platforms", "Seinfeld + Soap Opera sequences", "Platform-optimized formatting", "Copy-and-publish workflow"],
  },
  {
    icon: Users,
    title: "Dream 100 Strategy",
    description: "The framework for identifying, researching, and building relationships with the 100 people who already have your audience's attention.",
    link: "/dream-100",
    stat: "Framework",
    statColor: "text-cyan-400",
    items: ["Tiered partner identification", "5-step outreach playbook", "Affiliate + JV infrastructure", "30% recurring affiliate program"],
  },
  {
    icon: TrendingUp,
    title: "Traffic Blueprint",
    description: "The complete traffic strategy: where your dream customer hides, how to infiltrate congregations, and the phased plan from 0 to 100K visitors.",
    link: "/traffic-blueprint",
    stat: "Full plan",
    statColor: "text-rose-400",
    items: ["Where they hide mapping", "Organic + paid traffic strategy", "90-day execution roadmap", "Channel-by-channel playbook"],
  },
];

const STATS = [
  { value: "100", label: "Dream 100 targets", icon: Target },
  { value: "50+", label: "Content hooks ready", icon: Anchor },
  { value: "8", label: "Ad concepts tested", icon: Megaphone },
  { value: "30", label: "Days of content", icon: Calendar },
];

const GrowthLabPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Growth Lab — Distribution Engine | Invisible Exit"
        description="The complete traffic and distribution toolkit: Dream 100 tracker, hooks library, ad creative library, content calendar, and traffic blueprint. Everything you need to fill the funnel."
        url="/growth-lab"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Zap className="w-4 h-4" />
            Traffic Secrets · Fill Your Funnel
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
            The <span className="text-gradient-light">Growth Lab</span>
          </h1>
          <p className="text-body-lg text-white/60 max-w-2xl mx-auto mb-4">
            World-class content is worthless without distribution. This is the engine that puts it in front of people.
          </p>
          <p className="text-base text-white/40 max-w-xl mx-auto mb-8">
            6 tools. 100 targets. 50+ hooks. 8 ad campaigns. 30 days of content. One unified system.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <stat.icon className="w-5 h-5 text-primary-light mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-4 text-center">The Toolkit</p>
          <h2 className="text-h1 text-foreground mb-4 text-center">6 Distribution Tools</h2>
          <p className="text-body text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Each tool is functional, not theoretical. Track real outreach, deploy real hooks, launch real campaigns.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool) => (
              <Link
                key={tool.title}
                to={tool.link}
                className="card-base p-6 card-hover group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <tool.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className={`text-xs font-bold ${tool.statColor}`}>
                    {tool.stat}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {tool.description}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {tool.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                  Open tool <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The Framework */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">The System</p>
          <h2 className="text-h1 text-foreground mb-8 text-center">
            How These Tools Work Together
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { step: "1", title: "Identify Your Dream 100", body: "Use the Dream 100 Tracker to identify the 100 people and communities who already have your audience. Research their content, find your angle.", tool: "Dream 100 Tracker" },
              { step: "2", title: "Arm Yourself with Hooks", body: "Browse the Hooks Library for ready-to-deploy content hooks. Filter by platform and Story Gap. Mark hooks as deployed as you use them.", tool: "Hooks Library" },
              { step: "3", title: "Publish Daily Content", body: "Use the Content Calendar's 30 days of pre-written content. Each day is ready for 4 platforms. Copy, paste, post. Track what works.", tool: "Content Calendar" },
              { step: "4", title: "Launch Paid Campaigns", body: "Use the Ad Creative Library's 8 ad concepts. Start with $5/day Reddit, scale winners. Track campaigns from concept to winning.", tool: "Ad Creative Library" },
              { step: "5", title: "Build Dream 100 Relationships", body: "Follow the 5-step outreach playbook. 5 touches minimum. Goal: podcast interviews, affiliate partnerships, co-created content.", tool: "Dream 100 Strategy" },
              { step: "6", title: "Scale What Works", body: "Use the Traffic Blueprint to scale from 0 to 100K visitors. Double down on winning hooks, ads, and channels. Kill losers fast.", tool: "Traffic Blueprint" },
            ].map((s) => (
              <div key={s.step} className="card-base p-5 flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-bold text-sm shrink-0">
                  {s.step}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-foreground">{s.title}</h3>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">{s.tool}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <Zap className="w-12 h-12 text-primary-light mx-auto mb-6" />
          <h2 className="text-h1 text-white mb-4">Stop Planning. Start Distributing.</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            The Ferrari is out of the garage. Every tool here is functional, tracked, and ready. Pick one and start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dream-100-tracker" className="btn-primary text-lg">
              Start with Dream 100 <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/hooks" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors text-lg font-semibold">
              Browse Hooks <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GrowthLabPage;
