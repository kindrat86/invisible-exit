import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Mail,
  Megaphone,
  Mic,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Check,
  Target,
  Radio,
  FileText,
  BarChart3,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const THREE_SOURCES = [
  {
    icon: Target,
    name: "Traffic You Control",
    score: "45",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    status: "Infrastructure built, campaigns NOT running",
    items: [
      "Meta Pixel installed (1278454893564023)",
      "LinkedIn Insight Tag installed (7293451)",
      "Reddit Pixel installed (a2_iqsi13q5oijk)",
      "Google Ads tracking installed (AW-18046014876)",
      "Landing pages ready for every source",
    ],
    next: "Turn on $10/day Meta retargeting. Test squeeze page. Scale winners.",
    link: "/affiliates",
    linkLabel: "Set Up Affiliate Program",
  },
  {
    icon: Search,
    name: "Traffic You Don't Control",
    score: "65",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    status: "229 SEO pages live, social accounts empty",
    items: [
      "229 pages in sitemap (55 blog + 52 state + 26 industry + 21 comparison + 31 glossary + more)",
      "Social profiles claimed: YouTube, Twitter/X, LinkedIn, GitHub",
      "robots.txt allows 19 AI bots",
      "llms.txt + RSS feed published",
      "Per-post OG images generated at build time",
    ],
    next: "Start publishing 1 thread/day + 1 video/week. Backlink outreach: 5 guest posts.",
    link: "/backlink-strategy",
    linkLabel: "Backlink Strategy Framework",
  },
  {
    icon: Mail,
    name: "Traffic You Own",
    score: "85",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    status: "World-class — top 5% infrastructure",
    items: [
      "17-email sequence (5 Soap Opera + 12 Seinfeld)",
      "Squeeze page with Freedom Number lead magnet",
      "Multiple capture points (freedom, story, masterclass, intensive)",
      "Supabase subscribers table with source tracking",
      "Automated email scheduling via Edge Functions",
    ],
    next: "Fix instant lead magnet delivery. Add list segmentation. Start broadcasts.",
    link: "/content-calendar",
    linkLabel: "90-Day Content Calendar",
  },
];

const TRAFFIC_ENGINES = [
  {
    icon: Megaphone,
    title: "Social Content Engine",
    score: "30",
    gap: "YouTube: 0 videos. Twitter: 0 threads. LinkedIn: 0 posts. Reddit: 0 contributions.",
    plan: "Post 1 story per day for 90 days. Each email story = 1 thread + 1 Reddit post + 1 video script.",
    link: "/content-calendar",
    linkLabel: "See the 90-Day Plan",
  },
  {
    icon: Users,
    title: "Dream 100 Engine",
    score: "55",
    gap: "Framework documented. 0 relationships built. 0 outreach sent.",
    plan: "List 100 partners. Email 5/week. First partnership within 30 days.",
    link: "/dream-100",
    linkLabel: "View Dream 100 Framework",
  },
  {
    icon: Mic,
    title: "Podcast Outreach Engine",
    score: "40",
    gap: "Amsterdam story is ready. 0 podcast appearances.",
    plan: "Pitch 10 podcasts. 3-format story ready (5/15/45 min).",
    link: "/podcast-pitch",
    linkLabel: "Get the Pitch Kit",
  },
  {
    icon: FileText,
    title: "Pillar Content Engine",
    score: "50",
    gap: "55 posts avg 724 words. No definitive 3000+ word guides.",
    plan: "Publish 3 pillar guides (5000+ words each) as linkable assets.",
    link: "/content-strategy",
    linkLabel: "Hub-and-Spoke Content Strategy",
  },
  {
    icon: MessageSquare,
    title: "Community Engine",
    score: "35",
    gap: "Inner Circle page exists. No community built. 0 community contributions.",
    plan: "100 value-first contributions in r/FIRE, r/cscareerquestions, Indie Hackers.",
    link: "/inner-circle",
    linkLabel: "Build the Inner Circle",
  },
  {
    icon: TrendingUp,
    title: "Affiliate Engine",
    score: "55",
    gap: "30% recurring program exists. No affiliate assets (swipe copy, banners, templates).",
    plan: "Create swipe file, banner ads, email templates, custom landing pages.",
    link: "/affiliate-assets",
    linkLabel: "Download Affiliate Assets",
  },
];

const WEEKLY_CADENCE = [
  { day: "Mon", task: "1 Twitter/X thread from a Seinfeld email story", time: "30 min" },
  { day: "Tue", task: "1 Reddit post in target subreddit (value-first, no link)", time: "20 min" },
  { day: "Wed", task: "1 LinkedIn post (career-focused angle)", time: "30 min" },
  { day: "Thu", task: "1 blog post or pillar content update", time: "60 min" },
  { day: "Fri", task: "5 Dream 100 outreach emails", time: "45 min" },
  { day: "Sat", task: "1 YouTube Short (faceless, screen-recorded)", time: "45 min" },
  { day: "Sun", task: "1 podcast pitch email + weekly analytics review", time: "30 min" },
];

const TrafficBlueprintPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Traffic Blueprint — The Complete Distribution Plan | Invisible Exit"
        description="The full Traffic Secrets execution plan: social content engine, Dream 100 outreach, podcast pitches, pillar content, affiliate assets, and the 90-day publishing cadence."
        url="/traffic-blueprint"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <TrendingUp className="w-4 h-4" />
            Traffic Secrets Execution Plan
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
            The Complete{" "}
            <span className="text-gradient-light">Traffic Blueprint</span>
          </h1>
          <p className="text-body-lg text-white/60 max-w-2xl mx-auto mb-4">
            World-class funnel. World-class story. Zero distribution.
          </p>
          <p className="text-base text-white/40 max-w-xl mx-auto">
            This page documents the plan to fix that. Every traffic engine, ranked by gap size,
            with a specific next action for each.
          </p>
        </div>
      </section>

      {/* The Score */}
      <section className="bg-white section-normal">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">The Diagnosis</p>
          <h2 className="text-h1 text-foreground mb-4">
            Traffic Secrets Score: <span className="text-primary">61/100</span>
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            DotCom Secrets: 84/100. Expert Secrets: 88/100. Traffic Secrets: 61/100.
            The 23-point gap is entirely distribution. Everything is built. Nothing is distributed.
            This page is the fix.
          </p>
        </div>
      </section>

      {/* Three Traffic Sources */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-4 text-center">Russell's Framework</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">The Three Traffic Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {THREE_SOURCES.map((src) => (
              <div key={src.name} className={`card-base p-6 sm:p-8 border-2 ${src.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${src.bg} flex items-center justify-center`}>
                    <src.icon className={`w-6 h-6 ${src.color}`} />
                  </div>
                  <span className={`text-3xl font-bold ${src.color}`}>{src.score}</span>
                </div>
                <h3 className="text-h3 text-foreground mb-2">{src.name}</h3>
                <p className="text-xs text-muted-foreground italic mb-4">{src.status}</p>
                <div className="space-y-2 mb-6">
                  {src.items.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <Check className={`w-3.5 h-3.5 ${src.color} mt-1 shrink-0`} />
                      <span className="text-xs text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-primary/5 rounded-lg p-3 border-l-2 border-primary mb-4">
                  <p className="text-xs text-foreground">
                    <strong>Next:</strong> {src.next}
                  </p>
                </div>
                <Link
                  to={src.link}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  {src.linkLabel} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Six Traffic Engines */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-4 text-center">The Execution</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">Six Traffic Engines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {TRAFFIC_ENGINES.map((engine) => (
              <div key={engine.title} className="card-base p-6 card-hover">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <engine.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-foreground">{engine.title}</h3>
                      <span className={`text-sm font-bold ${parseInt(engine.score) < 50 ? "text-red-500" : "text-amber-500"}`}>
                        {engine.score}/100
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground/60 uppercase tracking-wide font-semibold mb-1">Gap</p>
                    <p className="text-sm text-red-500/80">{engine.gap}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground/60 uppercase tracking-wide font-semibold mb-1">Plan</p>
                    <p className="text-sm text-muted-foreground">{engine.plan}</p>
                  </div>
                  <Link
                    to={engine.link}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors mt-2"
                  >
                    {engine.linkLabel} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Cadence */}
      <section className="bg-surface section-normal border-t border-border">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">The Cadence</p>
          <h2 className="text-h1 text-foreground mb-4 text-center">The Weekly Publishing Schedule</h2>
          <p className="text-body text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Total time: ~4 hours/week. This is the minimum to start the compounding flywheel.
            Execute for 90 days. Then review.
          </p>
          <div className="max-w-2xl mx-auto space-y-3">
            {WEEKLY_CADENCE.map((day) => (
              <div key={day.day} className="card-base p-4 flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white font-bold text-sm shrink-0">
                  {day.day}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{day.task}</p>
                  <p className="text-xs text-muted-foreground">{day.time}</p>
                </div>
              </div>
            ))}
            <div className="card-base p-4 flex items-center gap-4 bg-primary/5 border-primary/20">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-success text-white shrink-0">
                <BarChart3 className="w-5 h-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Total: ~4 hours/week</p>
                <p className="text-xs text-muted-foreground">Execute for 90 days. The flywheel compounds.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <Radio className="w-12 h-12 text-primary-light mx-auto mb-6" />
          <h2 className="text-h1 text-white mb-4">The Engine Is Built.</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            The funnel converts. The story sells. The emails follow up. All that's missing
            is people. This blueprint brings them.
          </p>
          <Link to="/freedom" className="btn-primary text-lg">
            Start the Flywheel
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TrafficBlueprintPage;
