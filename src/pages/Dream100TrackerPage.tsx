import { Link } from "react-router-dom";
import {
  Target,
  Users,
  Mail,
  Search,
  TrendingUp,
  ArrowRight,
  Check,
  Clock,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface DreamTarget {
  name: string;
  platform: string;
  audience: string;
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  angle: string;
  outreach: "Not started" | "Researching" | "First touch sent" | "In conversation" | "Partnered";
  priority: "P0" | "P1" | "P2";
}

const TARGETS: DreamTarget[] = [
  // Tier 1 — Dream Partners
  { name: "Pat Walls (Starter Story)", platform: "Newsletter + Podcast", audience: "500K+", tier: "Tier 1", angle: "Corporate manager builds $4K MRR anonymously — full timeline feature", outreach: "Not started", priority: "P0" },
  { name: "Courtland Allen (Indie Hackers)", platform: "Community + Podcast", audience: "500K+", tier: "Tier 1", angle: "From $120K salary to $4K MRR while employed — IH feature + podcast", outreach: "Not started", priority: "P0" },
  { name: "Pieter Levels (Nomad List)", platform: "Twitter + Products", audience: "300K+", tier: "Tier 1", angle: "Anonymous founder building micro-SaaS — crossover with nomad philosophy", outreach: "Not started", priority: "P1" },
  { name: "Ali Abdaal", platform: "YouTube + Podcast", audience: "5M+", tier: "Tier 1", angle: "Productivity → passive income for professionals (very high reach, lower match)", outreach: "Not started", priority: "P2" },
  { name: "Justin Welsh", platform: "LinkedIn + Newsletter", audience: "500K+", tier: "Tier 1", angle: "Solopreneur who left corporate — the 'invisible' angle is differentiated", outreach: "Not started", priority: "P1" },
  { name: "Nicolas Cole (Ship 30)", platform: "Twitter + Newsletter", audience: "200K+", tier: "Tier 1", angle: "Writing → digital products → the system for employed professionals", outreach: "Not started", priority: "P1" },
  { name: "Dickie Bush (Ship 30)", platform: "Newsletter", audience: "200K+", tier: "Tier 1", angle: "Same as Nicolas Cole — co-target", outreach: "Not started", priority: "P1" },
  { name: "Marc Lou", platform: "YouTube + Twitter", audience: "300K+", tier: "Tier 1", angle: "Indie hacker building micro-SaaS — faceless building angle", outreach: "Not started", priority: "P2" },
  { name: "Daniel Vassallo", platform: "Twitter + Podcast", audience: "200K+", tier: "Tier 1", angle: "Anti-corporate career advice → invisible exit is the system", outreach: "Not started", priority: "P2" },
  { name: "Adam Robinson", platform: "Newsletter + Twitter", audience: "100K+", tier: "Tier 1", angle: "Career → entrepreneurship; the retention.com → invisible exit pipeline", outreach: "Not started", priority: "P2" },

  // Tier 2 — Strategic Affiliates / Communities
  { name: "Indie Hackers Community", platform: "Forum", audience: "500K+ members", tier: "Tier 2", angle: "Post the full $0→$4K MRR timeline as a community story", outreach: "Not started", priority: "P0" },
  { name: "r/FIRE Mods", platform: "Reddit", audience: "800K", tier: "Tier 2", angle: "Sponsored post or AMA about MRR vs stock options", outreach: "Not started", priority: "P1" },
  { name: "r/SideHustle Community", platform: "Reddit", audience: "1.5M", tier: "Tier 2", angle: "Value-first story posts about the 5-tool system", outreach: "Not started", priority: "P1" },
  { name: "MicroConf Connect", platform: "Slack", audience: "30K", tier: "Tier 2", angle: "Bootstrapped SaaS for corporate managers — niche within bootstrapped", outreach: "Not started", priority: "P2" },
  { name: "The Hustle (Daily Newsletter)", platform: "Newsletter", audience: "2M+", tier: "Tier 2", angle: "Sponsored placement or featured story", outreach: "Not started", priority: "P2" },
  { name: "Morning Brew", platform: "Newsletter", audience: "4M+", tier: "Tier 2", angle: "Sponsored placement — expensive but huge reach", outreach: "Not started", priority: "P2" },
  { name: "Trends.vc (Dru Riley)", platform: "Newsletter", audience: "50K+", tier: "Tier 2", angle: "Micro-SaaS trend report feature — perfect audience match", outreach: "Not started", priority: "P1" },
  { name: "Starter Story Weekly", platform: "Newsletter", audience: "200K+", tier: "Tier 2", angle: "Cross-feature with Starter Story main brand", outreach: "Not started", priority: "P1" },

  // Tier 3 — Content Amplifiers / Podcasts
  { name: "Side Hustle School (Chris Guillebeau)", platform: "Podcast", audience: "400K/listeners", tier: "Tier 3", angle: "5 tools, 5 hours/week, $4K MRR — daily show format fits perfectly", outreach: "Not started", priority: "P0" },
  { name: "The Side Hustle Show (Nick Loper)", platform: "Podcast", audience: "250K", tier: "Tier 3", angle: "The system-beats-idea framework — tactical interview", outreach: "Not started", priority: "P0" },
  { name: "Indie Hackers Podcast", platform: "Podcast", audience: "200K", tier: "Tier 3", angle: "The Amsterdam taxi story + full MRR timeline", outreach: "Not started", priority: "P1" },
  { name: "ChooseFI Podcast", platform: "Podcast", audience: "300K", tier: "Tier 3", angle: "Recurring revenue as FIRE accelerator", outreach: "Not started", priority: "P1" },
  { name: "My First Million (Pulte/Shaan)", platform: "Podcast", audience: "500K", tier: "Tier 3", angle: "Micro-SaaS for boring industries — idea-focused episode", outreach: "Not started", priority: "P2" },
  { name: "The Tim Ferriss Show", platform: "Podcast", audience: "2M+", tier: "Tier 3", angle: "Lifestyle design + invisible exit system (very aspirational target)", outreach: "Not started", priority: "P2" },
  { name: "Dev.to Editorial", platform: "Publication", audience: "1.2M", tier: "Tier 3", angle: "Technical tutorial: building micro-SaaS with AI (no code)", outreach: "Not started", priority: "P1" },
  { name: "HackerNoon", platform: "Publication", audience: "3M/month", tier: "Tier 3", angle: "The anonymous founder stack — how to build without being seen", outreach: "Not started", priority: "P1" },
];

const OUTREACH_DASHBOARD = [
  { stage: "Not started", count: 26, color: "text-slate-400", bg: "bg-slate-500/10" },
  { stage: "Researching", count: 0, color: "text-blue-400", bg: "bg-blue-500/10" },
  { stage: "First touch sent", count: 0, color: "text-amber-400", bg: "bg-amber-500/10" },
  { stage: "In conversation", count: 0, color: "text-purple-400", bg: "bg-purple-500/10" },
  { stage: "Partnered", count: 0, color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

const WEEKLY_OUTREACH_CADENCE = [
  { day: "Monday", task: "Research 2 targets: consume 3 pieces of their content, note angle", time: "30 min" },
  { day: "Tuesday", task: "Send 2 personalized first-touch emails (no pitch)", time: "30 min" },
  { day: "Wednesday", task: "Follow up on previous week's outreach (5x rule)", time: "20 min" },
  { day: "Thursday", task: "Send 2 more first-touch emails", time: "30 min" },
  { day: "Friday", task: "Update tracker, note responses, plan next week", time: "15 min" },
];

const DREAM_100_TRACKER = () => {
  const tierColor = (tier: string) =>
    tier === "Tier 1" ? "bg-primary/10 text-primary" :
    tier === "Tier 2" ? "bg-blue-500/10 text-blue-500" :
    "bg-emerald-500/10 text-emerald-500";

  const outreachColor = (status: string) =>
    status === "Not started" ? "bg-slate-500/10 text-slate-400" :
    status === "Researching" ? "bg-blue-500/10 text-blue-400" :
    status === "First touch sent" ? "bg-amber-500/10 text-amber-400" :
    status === "In conversation" ? "bg-purple-500/10 text-purple-400" :
    "bg-emerald-500/10 text-emerald-400";

  const priorityBadge = (p: string) =>
    p === "P0" ? "bg-red-500/10 text-red-500" :
    p === "P1" ? "bg-amber-500/10 text-amber-500" :
    "bg-slate-500/10 text-slate-400";

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Dream 100 Tracker — 26 Named Targets & Outreach Pipeline | Invisible Exit"
        description="The actual Dream 100 list with 26 named targets across 3 tiers, outreach status tracking, and a weekly cadence for building relationships."
        url="/dream-100-tracker"
      />
      <Navbar />

      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Target className="w-4 h-4" />
            Secret #13: The Dream 100
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Dream 100 <span className="text-gradient-light">Tracker</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            The Dream 100 isn't a concept. It's a list. Here's ours: 26 named targets,
            each with an angle, priority, and outreach status.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            Goal: 5 outreach emails per week. First partnership within 30 days. 10 active
            partners within 6 months.
          </p>
        </div>
      </section>

      {/* Dashboard */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Outreach Dashboard</h2>
          <p className="text-muted-foreground mb-8">Where each target stands in the pipeline.</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {OUTREACH_DASHBOARD.map((d) => (
              <div key={d.stage} className={`card-base p-5 text-center ${d.bg}`}>
                <p className={`text-3xl md:text-4xl font-bold ${d.color}`}>{d.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{d.stage}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50">
            <p className="text-sm text-foreground">
              <strong>Status:</strong> 26 targets identified. 0 contacted. Goal: first 5 emails
              sent this week. First response within 14 days.
            </p>
          </div>
        </div>
      </section>

      {/* Target List */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">The Target List</h2>
          <p className="text-muted-foreground mb-8">
            Sorted by priority. P0 = contact this week. P1 = contact within 2 weeks. P2 = within 30 days.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-surface-dark text-white">
                  <th className="p-3 text-left">Target</th>
                  <th className="p-3 text-left">Platform</th>
                  <th className="p-3 text-center">Audience</th>
                  <th className="p-3 text-center">Tier</th>
                  <th className="p-3 text-left">Entry Angle</th>
                  <th className="p-3 text-center">Priority</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {TARGETS.sort((a, b) => {
                  const pOrder = { P0: 0, P1: 1, P2: 2 };
                  return pOrder[a.priority] - pOrder[b.priority];
                }).map((t, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5">
                    <td className="p-3 font-semibold text-foreground">{t.name}</td>
                    <td className="p-3 text-muted-foreground">{t.platform}</td>
                    <td className="p-3 text-center text-muted-foreground">{t.audience}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${tierColor(t.tier)}`}>
                        {t.tier}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">{t.angle}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${priorityBadge(t.priority)}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${outreachColor(t.outreach)}`}>
                        {t.outreach}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Weekly Cadence */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Weekly Outreach Cadence</h2>
          <p className="text-muted-foreground mb-8">
            ~2 hours/week. Consistency beats intensity. 5 touches per week = 260 per year.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {WEEKLY_OUTREACH_CADENCE.map((d) => (
              <div key={d.day} className="card-base p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">{d.day}</span>
                </div>
                <p className="text-sm text-foreground mb-1">{d.task}</p>
                <p className="text-xs text-muted-foreground">{d.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 5x Rule */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow">
          <div className="card-base p-6 md:p-8 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <Star className="w-8 h-8 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Russell's 5x Follow-Up Rule</h3>
                <p className="text-body text-muted-foreground leading-relaxed mb-3">
                  "Most partnerships close on touch #3-5, not #1. The follow-up is where the
                  magic happens. But most people give up after one email."
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Our rule:</strong> Follow up 5 times. Each follow-up adds new value
                  (a new testimonial, a new data point, a new piece of content). Never guilt-trip.
                  Never ask "did you see my email?" The 5th touch is always: "I'll stop bugging
                  you after this — but if there's ever a fit, here's my calendar link."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DREAM_100_TRACKER;
