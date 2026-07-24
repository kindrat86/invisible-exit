import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Anchor,
  Copy,
  Check,
  ArrowRight,
  Youtube,
  Twitter,
  Linkedin,
  MessageSquare,
  Search,
  Zap,
  Target,
  TrendingUp,
  Lightbulb,
  Flame,
  Eye,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

/**
 * TRAFFIC SECRETS: Secret #7-8 — The Hooks Library
 *
 * Russell Brunson: "Traffic = Hooks × Content."
 * Every piece of content (video, thread, post, ad, email) needs a hook.
 * Without hooks, there is no content engine.
 *
 * This page is the master swipe file — categorized by:
 *   1. The 6 Story Gaps (Who, What, Where, When, Why, How)
 *   2. Awareness Level (Unaware → Most Aware)
 *   3. Platform (YouTube, Twitter/X, LinkedIn, Reddit)
 *
 * Every hook here is ready to copy and deploy.
 */

interface Hook {
  text: string;
  platform: "youtube" | "twitter" | "linkedin" | "reddit" | "any";
  awareness: "unaware" | "problem" | "solution" | "product" | "most";
  gap: "who" | "what" | "where" | "when" | "why" | "how";
}

const STORY_GAPS = [
  {
    id: "who",
    icon: Target,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    title: "The WHO Gap",
    subtitle: "Identity & belonging hooks",
    desc: "Hooks that make the reader see themselves in the story. 'Are you the kind of person who...'",
  },
  {
    id: "what",
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    title: "The WHAT Gap",
    subtitle: "The thing / the offer / the result",
    desc: "Hooks about the specific outcome or tool. 'This $0.97 thing changed how I see my salary.'",
  },
  {
    id: "where",
    icon: Search,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    title: "The WHERE Gap",
    subtitle: "Location & context hooks",
    desc: "Hooks anchored to a place or moment. 'Amsterdam. 6 AM. Raining. Two notifications changed everything.'",
  },
  {
    id: "when",
    icon: TrendingUp,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    title: "The WHEN Gap",
    subtitle: "Timing & urgency hooks",
    desc: "Hooks that trigger 'why didn't I start sooner?' or 'if not now, when?' The cost-of-waiting angle.",
  },
  {
    id: "why",
    icon: Flame,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    title: "The WHY Gap",
    subtitle: "Purpose & meaning hooks",
    desc: "Hooks about identity, legacy, and the deeper reason. 'I didn't want to quit. I wanted to matter.'",
  },
  {
    id: "how",
    icon: Lightbulb,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    title: "The HOW Gap",
    subtitle: "Method & system hooks",
    desc: "Hooks about the process. 'The system matters more than the idea. Here's the 5-tool framework.'",
  },
];

const HOOKS: Hook[] = [
  // ── WHO GAP (Identity & Belonging) ──
  { text: "If you're a corporate manager earning $120K+ and you've never checked if your side business is legal, this thread is for you.", platform: "twitter", awareness: "unaware", gap: "who" },
  { text: "Are you the person other people ask for career advice? This is for you.", platform: "linkedin", awareness: "unaware", gap: "who" },
  { text: "I built a $4K/month side business while working full-time. My employer never found out. Here's how (for managers only):", platform: "twitter", awareness: "problem", gap: "who" },
  { text: "If you have vesting equity and less than 1%, you need to hear this.", platform: "linkedin", awareness: "unaware", gap: "who" },
  { text: "The person who told you to 'be patient and wait for the IPO' was wrong. Here's the math they didn't show you.", platform: "twitter", awareness: "unaware", gap: "who" },
  { text: "For the 37-year-old Managing Director who wonders if they're trapped: you are. But there's a door.", platform: "linkedin", awareness: "problem", gap: "who" },
  { text: "You're not 'lucky to have this job.' You're the asset. Here's proof:", platform: "twitter", awareness: "unaware", gap: "who" },
  { text: "If your identity is wrapped up in your job title, this will hurt. But it's the most important thing you'll read today.", platform: "linkedin", awareness: "unaware", gap: "who" },

  // ── WHAT GAP (The Thing / The Result) ──
  { text: "I screamed in a taxi over $0.97. Here's why that changed everything:", platform: "twitter", awareness: "unaware", gap: "what" },
  { text: "$1B exit × 0.5% equity = $5M, right? Wrong. Here's what you actually get (after dilution, vesting, and taxes):", platform: "youtube", awareness: "unaware", gap: "what" },
  { text: "This $0.97/month tool does what my $120K salary couldn't: prove my worth exists outside the company.", platform: "twitter", awareness: "solution", gap: "what" },
  { text: "5 tools. $0.97/month. That's the entire system a corporate manager needs to build invisible recurring revenue. No code. No quitting. No employer finding out.", platform: "linkedin", awareness: "product", gap: "what" },
  { text: "I spent 90 days choosing the perfect idea. Then I launched the wrong one. It made $4,100/month. Here's why the system beat the idea:", platform: "youtube", awareness: "problem", gap: "what" },
  { text: "A stranger paid me $0.97 while I slept. That's worth more than any raise I ever got. Here's why:", platform: "twitter", awareness: "unaware", gap: "what" },
  { text: "Your freedom number isn't $1M. It's probably $4,000/month MRR. Here's how to calculate yours in 90 seconds:", platform: "twitter", awareness: "problem", gap: "what" },

  // ── WHERE GAP (Location & Context) ──
  { text: "Amsterdam. 6 AM. Raining. Two notifications changed my life. Here's the story:", platform: "twitter", awareness: "unaware", gap: "where" },
  { text: "On a KLM flight, 35,000 feet above the Atlantic, I realized my employer would never give me freedom. So I built my own.", platform: "linkedin", awareness: "unaware", gap: "where" },
  { text: "In a taxi in Amsterdam, between my sleeping wife and our 8-year-old, I got the notification that changed everything.", platform: "youtube", awareness: "unaware", gap: "where" },
  { text: "6 AM on the first morning of my vacation. My phone buzzed. Two notifications. One was corporate politics. The other was freedom.", platform: "twitter", awareness: "unaware", gap: "where" },
  { text: "My colleague found a website that looked like my side project. On a team call. With 12 people watching. Here's what happened next:", platform: "youtube", awareness: "problem", gap: "where" },

  // ── WHEN GAP (Timing & Urgency) ──
  { text: "Every month you wait costs you ~$4,000 in unrealized MRR. That's $48,000/year of delay. Here's how to stop the clock:", platform: "twitter", awareness: "problem", gap: "when" },
  { text: "You've been telling yourself 'next quarter' for 3 years. The IPO is always 18 months away. Here's what that actually costs you:", platform: "linkedin", awareness: "unaware", gap: "when" },
  { text: "I waited 8 years for the IPO. It came. My 0.5% was worth less than my salary. Don't wait like I did. Here's what to do instead:", platform: "twitter", awareness: "unaware", gap: "when" },
  { text: "The best time to start building was 5 years ago. The second best time is your next 5-hour weekend. Here's the system:", platform: "twitter", awareness: "problem", gap: "when" },
  { text: "If you don't start building invisible income this year, you'll be in the exact same job, with the exact same equity, in 2027. Here's how to change that:", platform: "linkedin", awareness: "problem", gap: "when" },
  { text: "Founding membership open. After that, the price goes up and the founding member benefits expire. Here's why it matters:", platform: "twitter", awareness: "most", gap: "when" },

  // ── WHY GAP (Purpose & Meaning) ──
  { text: "I didn't want to quit my job. I wanted to matter outside of it. Here's what I learned about identity and optionality:", platform: "linkedin", awareness: "unaware", gap: "why" },
  { text: "Corporate loyalty is a transaction, not a virtue. Here's the mindset shift that changed everything for me:", platform: "twitter", awareness: "unaware", gap: "why" },
  { text: "The golden handcuffs don't feel like handcuffs. They feel like belonging. That's what makes them so dangerous. Here's how to break free:", platform: "linkedin", awareness: "unaware", gap: "why" },
  { text: "Your 15 years of corporate experience isn't a weakness. It's founder gold. Here's why:", platform: "twitter", awareness: "problem", gap: "why" },
  { text: "I built Invisible Exit not to escape my job, but to prove my worth exists outside it. Here's the manifesto:", platform: "linkedin", awareness: "product", gap: "why" },
  { text: "Why do we define ourselves by our job titles? 'Director of Engineering' IS your identity. But it doesn't have to be. Here's the alternative:", platform: "twitter", awareness: "unaware", gap: "why" },
  { text: "I wanted to leave the key for the next person trapped in the same cage. That's why I built this. Not for money. For freedom.", platform: "linkedin", awareness: "solution", gap: "why" },

  // ── HOW GAP (Method & System) ──
  { text: "How to build recurring side revenue without quitting your job, without writing code, and without your employer finding out (full system):", platform: "youtube", awareness: "problem", gap: "how" },
  { text: "The 5-tool system that takes you from 'trapped in golden handcuffs' to real recurring revenue in 12 months:", platform: "twitter", awareness: "solution", gap: "how" },
  { text: "Step 1: Calculate your freedom number (90 seconds). Step 2: Validate one micro-SaaS idea (48 hours). Step 3: Build invisible revenue (5h/week). Here's the full framework:", platform: "twitter", awareness: "problem", gap: "how" },
  { text: "I set up my side business so my employer could never find it. Here's the Triple-Separation Protocol (entity, name, payment processor):", platform: "youtube", awareness: "problem", gap: "how" },
  { text: "How to validate a micro-SaaS idea in 48 hours without writing a single line of code:", platform: "twitter", awareness: "solution", gap: "how" },
  { text: "The exact tech stack a non-technical manager used to build recurring monthly revenue. No code required:", platform: "twitter", awareness: "solution", gap: "how" },
  { text: "How to build an anonymous brand without showing your face, using your real name, or linking to your LinkedIn:", platform: "youtube", awareness: "problem", gap: "how" },
  { text: "Step-by-step: how I set up a separate LLC, separate name, and separate Stripe account so my employer can never connect my side business to me:", platform: "twitter", awareness: "solution", gap: "how" },

  // ── REDDIT-SPECIFIC (value-first, no link in hook) ──
  { text: "I did the math on my 0.5% equity. Even a $1B exit wouldn't replace my salary. Here's the full breakdown (and what I'm doing instead):", platform: "reddit", awareness: "unaware", gap: "what" },
  { text: "I'm a Managing Director earning $120K. I built recurring side revenue working 5 hours/week. AMA about the system (not the idea):", platform: "reddit", awareness: "problem", gap: "how" },
  { text: "The cost of waiting: I calculated that every month I delayed starting my side business cost me ~$4,000 in unrealized MRR. Here's the math that woke me up:", platform: "reddit", awareness: "problem", gap: "when" },
  { text: "How I set up a side business so my employer can never find it (entity separation, name separation, payment separation):", platform: "reddit", awareness: "solution", gap: "how" },
  { text: "I got my first Stripe notification ($0.97) while on vacation. It changed how I see my $120K salary more than any raise ever did. Here's why:", platform: "reddit", awareness: "unaware", gap: "why" },

  // ── AD HOOKS (for paid traffic) ──
  { text: "⚠️ Your 0.5% equity is worth less than you think. Here's the math nobody showed you.", platform: "any", awareness: "unaware", gap: "what" },
  { text: "The cage has a door. Here's the key nobody told you about.", platform: "any", awareness: "unaware", gap: "why" },
  { text: "Founding membership open. After that, the price doubles. Here's what you get:", platform: "any", awareness: "most", gap: "when" },
  { text: "5 tools. $0.97/month. Cancel anytime. If you're a corporate manager, this will change how you see your salary.", platform: "any", awareness: "product", gap: "what" },
  { text: "Stop waiting for the IPO. Start building your own exit. Here's the system:", platform: "any", awareness: "problem", gap: "when" },
];

const PLATFORM_META: Record<string, { icon: typeof Youtube; label: string; color: string }> = {
  youtube: { icon: Youtube, label: "YouTube", color: "text-red-500" },
  twitter: { icon: Twitter, label: "Twitter/X", color: "text-sky-400" },
  linkedin: { icon: Linkedin, label: "LinkedIn", color: "text-blue-600" },
  reddit: { icon: MessageSquare, label: "Reddit", color: "text-orange-500" },
  any: { icon: Zap, label: "Any Platform", color: "text-primary" },
};

const AWARENESS_META: Record<string, { label: string; pct: string; color: string }> = {
  unaware: { label: "Unaware", pct: "60%", color: "bg-red-500/15 text-red-500" },
  problem: { label: "Problem Aware", pct: "25%", color: "bg-orange-500/15 text-orange-500" },
  solution: { label: "Solution Aware", pct: "10%", color: "bg-amber-500/15 text-amber-500" },
  product: { label: "Product Aware", pct: "4%", color: "bg-emerald-500/15 text-emerald-500" },
  most: { label: "Most Aware", pct: "1%", color: "bg-primary/15 text-primary" },
};

const HooksLibraryPage = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeGap, setActiveGap] = useState<string>("all");
  const [activePlatform, setActivePlatform] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // ── Deployment tracking (localStorage) ──
  // Brunson: hooks aren't "ideas" — they're deployed, tested, and measured.
  // Track: draft (default), deployed, testing, winner, killed
  type HookStatus = "draft" | "deployed" | "testing" | "winner" | "killed";
  const STATUS_KEY = "ie_hooks_status";
  const [statuses, setStatuses] = useState<Record<string, HookStatus>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STATUS_KEY);
      if (saved) setStatuses(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const updateStatus = (hookId: string, status: HookStatus) => {
    const updated = { ...statuses, [hookId]: status };
    setStatuses(updated);
    localStorage.setItem(STATUS_KEY, JSON.stringify(updated));
    trackEvent("hook_status_update", { hook_id: hookId, status });
  };

  const STATUS_META: Record<HookStatus, { label: string; color: string; icon: typeof Zap }> = {
    draft: { label: "Draft", color: "bg-slate-500/15 text-slate-400 border-slate-500/20", icon: Zap },
    deployed: { label: "Deployed", color: "bg-blue-500/15 text-blue-400 border-blue-500/20", icon: ArrowRight },
    testing: { label: "Testing", color: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: TrendingUp },
    winner: { label: "Winner", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: Check },
    killed: { label: "Killed", color: "bg-red-500/15 text-red-400 border-red-500/20", icon: X },
  };

  // Stats
  const statusCounts = {
    total: HOOKS.length,
    draft: HOOKS.filter((_, i) => (statuses[`hook-${i}`] || "draft") === "draft").length,
    deployed: HOOKS.filter((_, i) => statuses[`hook-${i}`] === "deployed").length,
    testing: HOOKS.filter((_, i) => statuses[`hook-${i}`] === "testing").length,
    winner: HOOKS.filter((_, i) => statuses[`hook-${i}`] === "winner").length,
    killed: HOOKS.filter((_, i) => statuses[`hook-${i}`] === "killed").length,
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    trackEvent("hook_copied", { text: text.substring(0, 50), platform: "hooks_library" });
    setTimeout(() => setCopied(null), 3000);
  };

  const filteredHooks = HOOKS.filter((h, i) => {
    const gapMatch = activeGap === "all" || h.gap === activeGap;
    const platformMatch = activePlatform === "all" || h.platform === activePlatform;
    const statusMatch = statusFilter === "all" || (statuses[`hook-${i}`] || "draft") === statusFilter;
    return gapMatch && platformMatch && statusMatch;
  });

  return (
    <div className="min-h-screen">
      <SEOHead
        title="The Hooks Library — 50+ Ready-to-Deploy Content Hooks | Invisible Exit"
        description="The master swipe file of content hooks for corporate escape content. Categorized by the 6 Story Gaps, awareness level, and platform. Copy and deploy."
        url="/hooks"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Anchor className="w-4 h-4" />
            Traffic Secrets: The Hooks Library
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
            Traffic = Hooks{" "}
            <span className="text-gradient-light">× Content</span>
          </h1>
          <p className="text-body-lg text-white/60 max-w-2xl mx-auto mb-4">
            Russell Brunson's core formula. You don't have a traffic problem —
            you have a hooks problem.
          </p>
          <p className="text-base text-white/40 max-w-xl mx-auto mb-8">
            {HOOKS.length}+ ready-to-deploy hooks, categorized by the 6 Story Gaps,
            5 awareness levels, and 4 platforms. Copy. Paste. Publish.
          </p>
          <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-amber-200 text-xs font-medium">
              {statusCounts.deployed + statusCounts.testing} deployed · {statusCounts.winner} winners · {statusCounts.draft} drafts ready
            </span>
          </div>
        </div>
      </section>

      {/* The 6 Story Gaps */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-4 text-center">Secret #7</p>
          <h2 className="text-h1 text-foreground mb-4 text-center">The 6 Story Gaps</h2>
          <p className="text-body text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Russell's framework: every great hook exploits one of 6 "gaps" in your
            audience's story — the things they know they should know but don't.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STORY_GAPS.map((gap) => (
              <button
                key={gap.id}
                onClick={() => setActiveGap(activeGap === gap.id ? "all" : gap.id)}
                className={`card-base p-6 text-left card-hover transition-all ${activeGap === gap.id ? "ring-2 ring-primary" : ""}`}
              >
                <div className={`w-12 h-12 rounded-xl ${gap.bg} flex items-center justify-center mb-4`}>
                  <gap.icon className={`w-6 h-6 ${gap.color}`} />
                </div>
                <h3 className="text-h3 text-foreground mb-1">{gap.title}</h3>
                <p className="text-xs font-semibold text-primary mb-2">{gap.subtitle}</p>
                <p className="text-caption">{gap.desc}</p>
                <div className="mt-3 text-xs font-medium text-primary">
                  {activeGap === gap.id ? "✓ Filtering" : "Click to filter →"}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Platform + Status Filter */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-standard">
          {/* Status Stats Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {(["draft", "deployed", "testing", "winner", "killed"] as const).map((s) => {
              const meta = STATUS_META[s];
              const count = statusCounts[s];
              const isActive = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(isActive ? "all" : s)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isActive ? "ring-2 ring-primary ring-offset-1 ring-offset-surface" : ""
                  } ${meta.color}`}
                >
                  <meta.icon className="w-3.5 h-3.5" />
                  {meta.label}: {count}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-semibold text-muted-foreground mr-2">Platform:</span>
            {["all", "youtube", "twitter", "linkedin", "reddit", "any"].map((p) => {
              const meta = p === "all" ? null : PLATFORM_META[p];
              return (
                <button
                  key={p}
                  onClick={() => setActivePlatform(p)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activePlatform === p
                      ? "bg-primary text-white"
                      : "bg-white border border-border text-foreground hover:bg-primary/5"
                  }`}
                >
                  {meta && <meta.icon className={`w-4 h-4 ${activePlatform === p ? "text-white" : meta.color}`} />}
                  {p === "all" ? "All Platforms" : meta?.label}
                </button>
              );
            })}
          </div>
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Showing <span className="font-bold text-foreground">{filteredHooks.length}</span> hooks
            {activeGap !== "all" && (
              <> · filtered by <span className="font-bold text-primary">{STORY_GAPS.find((g) => g.id === activeGap)?.title}</span></>
            )}
            {statusFilter !== "all" && (
              <> · status: <span className="font-bold text-primary">{STATUS_META[statusFilter as HookStatus].label}</span></>
            )}
          </div>
        </div>
      </section>

      {/* The Hooks */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-4 text-center">The Swipe File</p>
          <h2 className="text-h1 text-foreground mb-4 text-center">{HOOKS.length}+ Ready-to-Deploy Hooks</h2>
          <p className="text-body text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Every hook is categorized by Story Gap, platform, and awareness level.
            Click copy and paste into your content calendar.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {filteredHooks.map((hook, i) => {
              const platform = PLATFORM_META[hook.platform];
              const awareness = AWARENESS_META[hook.awareness];
              const hookId = `hook-${i}`;
              return (
                <div key={hookId} className="card-base p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${platform.color}`}>
                        <platform.icon className="w-3.5 h-3.5" />
                        {platform.label}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${awareness.color}`}>
                        {awareness.label} ({awareness.pct})
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
                      {STORY_GAPS.find((g) => g.id === hook.gap)?.title.replace("The ", "")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed flex-1">{hook.text}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleCopy(hook.text, hookId)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        copied === hookId
                          ? "bg-success/15 text-success"
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                      }`}
                    >
                      {copied === hookId ? (
                        <><Check className="w-3.5 h-3.5" /> Copied!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Copy Hook</>
                      )}
                    </button>
                    <select
                      value={statuses[hookId] || "draft"}
                      onChange={(e) => updateStatus(hookId, e.target.value as HookStatus)}
                      className={`text-xs px-2 py-1.5 rounded-lg border-0 outline-none cursor-pointer font-medium ${STATUS_META[statuses[hookId] as HookStatus || "draft"].color}`}
                    >
                      {(["draft", "deployed", "testing", "winner", "killed"] as HookStatus[]).map((s) => (
                        <option key={s} value={s} className="bg-white text-foreground">
                          {STATUS_META[s].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Framework */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              How to Use This Library
            </h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Russell's publishing cadence: 1 piece of content per day for 90 days.
            Each hook = 1 video, 1 thread, 1 post, or 1 Reddit contribution.
          </p>
          <div className="space-y-4">
            {[
              { step: "1", title: "Pick a hook from this library", body: "Filter by platform (where you're publishing today) and Story Gap (the angle you want to test)." },
              { step: "2", title: "Build the content around the hook", body: "The hook is the first 3 seconds of a video, the first line of a thread, or the title of a post. Everything else supports it." },
              { step: "3", title: "Publish on the weekly cadence", body: "Mon: Twitter thread. Tue: Reddit post. Wed: LinkedIn. Thu: Blog/pillar. Fri: Dream 100 outreach. Sat: YouTube Short. Sun: Podcast pitch." },
              { step: "4", title: "Track which hooks convert", body: "Use PostHog to track hook performance. Double down on winners. Kill losers. The library evolves." },
              { step: "5", title: "Write new hooks from email stories", body: "Every Soap Opera and Seinfeld email can become 5+ hooks. The library grows from your own content." },
            ].map((s) => (
              <div key={s.step} className="card-base p-5 flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-bold text-sm shrink-0">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{s.title}</h3>
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
          <Anchor className="w-12 h-12 text-primary-light mx-auto mb-6" />
          <h2 className="text-h1 text-white mb-4">Hooks Are the Engine.</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            Content without hooks is noise. Content with hooks is traffic.
            This library has {HOOKS.length}+ hooks ready to deploy. Start publishing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/content-calendar" className="btn-primary text-lg">
              See the 90-Day Publishing Plan
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/traffic-blueprint"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
            >
              <TrendingUp className="w-4 h-4" /> View Full Traffic Blueprint
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HooksLibraryPage;
