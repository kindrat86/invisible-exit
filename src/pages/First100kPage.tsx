import { Link } from "react-router-dom";
import {
  Rocket,
  TrendingUp,
  Users,
  Mail,
  Mic,
  Video,
  DollarSign,
  Check,
  ArrowRight,
  Flag,
  Target,
  Compass,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface Phase {
  phase: string;
  title: string;
  subtitle: string;
  duration: string;
  goal: string;
  traffic: number;
  emails: number;
  mrr: string;
  color: string;
  borderColor: string;
  tasks: { category: string; task: string }[];
  milestones: string[];
}

const PHASES: Phase[] = [
  {
    phase: "Phase 0",
    title: "Foundation",
    subtitle: "Infrastructure & Assets",
    duration: "Weeks 1-2",
    goal: "Everything ready for traffic. Zero inbound yet.",
    traffic: 0,
    emails: 0,
    mrr: "$0",
    color: "text-slate-400",
    borderColor: "border-slate-400",
    tasks: [
      { category: "SEO", task: "All 795 pages indexed in Google Search Console" },
      { category: "Email", task: "17-email sequence deployed (Supabase Edge Functions)" },
      { category: "Email", task: "Squeeze page live with instant lead magnet delivery" },
      { category: "Tracking", task: "PostHog, GA4, Meta/LinkedIn/Reddit pixels verified" },
      { category: "Social", task: "Twitter/X, LinkedIn, YouTube profiles set up with branding" },
      { category: "Content", task: "90-day content calendar loaded (7 stories × 4 platforms)" },
      { category: "Ads", task: "8 ad concepts ready, 4 targeting presets configured" },
    ],
    milestones: [
      "Google Search Console shows pages indexing",
      "First test email received from squeeze page",
      "All pixels firing correctly (verified in Meta Events Manager)",
    ],
  },
  {
    phase: "Phase 1",
    title: "First Blood",
    subtitle: "0 → 1,000 Unique Visitors / Month",
    duration: "Month 1",
    goal: "Prove the funnel converts. First email subscribers. First $0.97 customer.",
    traffic: 1000,
    emails: 100,
    mrr: "$0.97",
    color: "text-emerald-500",
    borderColor: "border-emerald-400",
    tasks: [
      { category: "Reddit", task: "Post 2 value-first stories/week in r/FIRE, r/SideHustle" },
      { category: "Indie Hackers", task: "Publish full build timeline post. Comment daily." },
      { category: "SEO", task: "Monitor GSC for first impressions. Fix any indexing errors." },
      { category: "Content", task: "Publish 4 blog posts (1/week). 800+ words each." },
      { category: "Email", task: "First 100 subscribers. Monitor open rates (target: 40%+)." },
      { category: "Ads", task: "Turn on $5/day Reddit ads → blog posts (retargeting pixel)" },
    ],
    milestones: [
      "First subscriber from squeeze page",
      "First $0.97 customer",
      "Reddit post hits 100+ upvotes",
      "GSC shows first organic impressions",
    ],
  },
  {
    phase: "Phase 2",
    title: "Traction",
    subtitle: "1,000 → 10,000 UV / Month",
    duration: "Months 2-3",
    goal: "SEO kicks in. Social channels build momentum. Email list reaches 1,000.",
    traffic: 10000,
    emails: 1000,
    mrr: "$50-$200",
    color: "text-blue-500",
    borderColor: "border-blue-400",
    tasks: [
      { category: "SEO", task: "First organic keyword rankings (top 100). Optimize title tags." },
      { category: "Content", task: "Publish 8 more blog posts. 2 pillar posts (3000+ words)." },
      { category: "Social", task: "Twitter: 3 threads/week. LinkedIn: 3 posts/week." },
      { category: "YouTube", task: "Publish first 4 videos (faceless). 1 every 2 weeks." },
      { category: "Ads", task: "Meta retargeting live ($10/day). Test 3 ad concepts." },
      { category: "Podcast", task: "Pitch 10 podcasts. Land first 2 appearances." },
      { category: "Dream 100", task: "Email 5 partners/week. First partnership conversation." },
    ],
    milestones: [
      "1,000 email subscribers",
      "First organic Google visitor",
      "First podcast appearance published",
      "Meta retargeting ROAS positive",
      "YouTube channel hits 100 subscribers",
    ],
  },
  {
    phase: "Phase 3",
    title: "Growth",
    subtitle: "10,000 → 50,000 UV / Month",
    duration: "Months 4-6",
    goal: "Multiple traffic channels working. SEO compounding. Dream 100 partnerships live.",
    traffic: 50000,
    emails: 5000,
    mrr: "$500-$2,000",
    color: "text-amber-500",
    borderColor: "border-amber-400",
    tasks: [
      { category: "SEO", task: "Rank top 10 for 20+ keywords. Build 5 backlinks (guest posts)." },
      { category: "Content", task: "Publish 12 more blog posts. 3 more pillar posts." },
      { category: "YouTube", task: "Publish 2 videos/month. First video hits 1,000 views." },
      { category: "Podcast", task: "6+ podcast appearances. Start own show?" },
      { category: "Dream 100", task: "First 3 partnerships signed. Affiliate program live." },
      { category: "Ads", task: "Scale winners to $30/day. Kill losers. A/B test hooks." },
      { category: "Community", task: "Launch Discord/Skool community for members." },
    ],
    milestones: [
      "5,000 email subscribers",
      "First $1,000 MRR month",
      "First Dream 100 partnership drives traffic",
      "First video hits 1,000 views",
      "10 backlinks from DR 50+ sites",
    ],
  },
  {
    phase: "Phase 4",
    title: "Scale",
    subtitle: "50,000 → 100,000+ UV / Month",
    duration: "Months 7-12",
    goal: "Traffic compounds. Brand search volume grows. Paid ads at scale.",
    traffic: 100000,
    emails: 15000,
    mrr: "$2,000-$4,100",
    color: "text-primary",
    borderColor: "border-primary",
    tasks: [
      { category: "SEO", task: "Rank top 3 for 10+ keywords. Build 20+ backlinks." },
      { category: "Content", task: "Publish 2 posts/week consistently. Update old content." },
      { category: "YouTube", task: "4 videos/month. First video hits 10,000 views." },
      { category: "Ads", task: "$50-100/day. Multi-platform. Profitable CAC." },
      { category: "Dream 100", task: "10+ active partners. 5+ affiliates driving revenue." },
      { category: "Brand", task: "Brand search volume growing (people searching 'Invisible Exit')" },
      { category: "PR", task: "Featured in 1 publication (Indie Hackers, Morning Brew, etc.)" },
    ],
    milestones: [
      "15,000 email subscribers",
      "$4,100 MRR (freedom number hit)",
      "100,000 monthly unique visitors",
      "Brand search volume > 500/month",
      "First viral content piece (100K+ views)",
    ],
  },
];

const TRAFFIC_PROJECTIONS = [
  { source: "Organic Search (SEO)", phase1: "10%", phase2: "25%", phase3: "40%", phase4: "45%", notes: "Compounds over time. Highest quality traffic." },
  { source: "Email (Owned)", phase1: "5%", phase2: "15%", phase3: "20%", phase4: "20%", notes: "Highest conversion. The asset you control." },
  { source: "Social (Earned)", phase1: "40%", phase2: "25%", phase3: "15%", phase4: "10%", notes: "Front-loaded. Drives early momentum." },
  { source: "Referral (Dream 100)", phase1: "0%", phase2: "5%", phase3: "10%", phase4: "15%", notes: "Compounds as partnerships grow." },
  { source: "Paid Ads", phase1: "5%", phase2: "15%", phase3: "10%", phase4: "5%", notes: "Tested and scaled. Decreasing as organic grows." },
  { source: "Direct (Brand)", phase1: "0%", phase2: "5%", phase3: "5%", phase4: "5%", notes: "Brand search. The ultimate signal." },
];

const FIRST_100K = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="0 → 100,000 Visitors Roadmap — Phased Traffic Plan | Invisible Exit"
        description="The complete 12-month roadmap from 0 to 100,000 monthly visitors. 5 phases with specific tasks, milestones, traffic sources, and revenue projections."
        url="/traffic-roadmap"
      />
      <Navbar />

      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Rocket className="w-4 h-4" />
            Secret #15: Your First 100,000
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            0 → 100,000 <span className="text-gradient-light">Visitors</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            Russell's 15th secret: the phased roadmap from zero to 100,000 monthly visitors.
            5 phases. 12 months. Specific tasks, milestones, and projections for each.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            This isn't a wish list. It's a sequenced operational plan.
          </p>
        </div>
      </section>

      {/* Current Status */}
      <section className="bg-amber-50 border-b border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50 py-6">
        <div className="container-narrow flex flex-col sm:flex-row items-center justify-center gap-4">
          <Compass className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-foreground text-center">
            <strong>Current status:</strong> Phase 0 complete (infrastructure built). Phase 1
            starts the moment social content goes live and ads turn on. Everything below is the
            roadmap from here.
          </p>
        </div>
      </section>

      {/* Phases */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">The 5 Phases</h2>
          <p className="text-muted-foreground mb-8">
            Each phase has a specific traffic goal, email list size, and MRR target. Don't skip ahead.
          </p>
          <div className="space-y-8">
            {PHASES.map((p, i) => (
              <div key={i} className={`card-base p-6 md:p-8 border-l-4 ${p.borderColor}`}>
                {/* Phase Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-sm font-bold uppercase tracking-wider ${p.color}`}>
                        {p.phase}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs bg-surface-dark text-white">
                        {p.duration}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">{p.title}</h3>
                    <p className="text-muted-foreground">{p.subtitle}</p>
                  </div>
                  <div className="flex gap-6 shrink-0">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Traffic</p>
                      <p className={`text-lg font-bold ${p.color}`}>{p.traffic.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Emails</p>
                      <p className={`text-lg font-bold ${p.color}`}>{p.emails.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">MRR</p>
                      <p className={`text-lg font-bold ${p.color}`}>{p.mrr}</p>
                    </div>
                  </div>
                </div>

                {/* Goal */}
                <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-sm text-foreground">
                    <strong>Goal:</strong> {p.goal}
                  </p>
                </div>

                {/* Tasks */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                    Key Tasks
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {p.tasks.map((t, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-xs font-semibold text-primary uppercase">{t.category}:</span>{" "}
                          <span className="text-sm text-muted-foreground">{t.task}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                    Milestones
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.milestones.map((m, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface text-xs text-foreground border border-border"
                      >
                        <Flag className="w-3 h-3 text-primary" />
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Traffic Source Projections */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Traffic Source Mix by Phase
          </h2>
          <p className="text-muted-foreground mb-8">
            Early traffic is social-heavy. Over time, SEO and email dominate. Paid ads bridge the gap.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-surface-dark text-white">
                  <th className="p-3 text-left">Source</th>
                  <th className="p-3 text-center">Phase 1</th>
                  <th className="p-3 text-center">Phase 2</th>
                  <th className="p-3 text-center">Phase 3</th>
                  <th className="p-3 text-center">Phase 4</th>
                  <th className="p-3 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {TRAFFIC_PROJECTIONS.map((row, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="p-3 font-semibold text-foreground">{row.source}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.phase1}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.phase2}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.phase3}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.phase4}</td>
                    <td className="p-3 text-xs text-muted-foreground">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            The Clock Is Ticking
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Every day without content going live is a day the compounding hasn't started.
            Phase 1 begins when you publish the first post.
          </p>
          <Link
            to="/traffic-blueprint"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
          >
            Full Traffic Blueprint <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FIRST_100K;
