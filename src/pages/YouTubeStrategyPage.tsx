import { Link } from "react-router-dom";
import {
  Video,
  Youtube,
  Play,
  Calendar,
  Eye,
  ThumbsUp,
  MessageSquare,
  Copy,
  Check,
  ArrowRight,
  Search,
  Zap,
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const VIDEO_PIPELINE = [
  {
    priority: 1,
    title: "How to Build a Side Business Without Your Employer Finding Out",
    format: "Long-form (8-12 min)",
    searchVolume: "High",
    keyword: "side business while employed",
    hook: "3 seconds of panic. That's what happened when my colleague found my website on a team call. Here's how I survived it — and how you can set up the same protection.",
    script: "HOOK (0:00-0:15): 'My colleague found a website that looked like my side project. On a team call. With 12 people watching. My blood ran cold for 3 seconds. Then I remembered my stealth setup — and you're about to learn yours.'\n\nPROBLEM (0:15-2:00): Why employed founders get discovered. The 5 common mistakes (same name, same email, same hosting, employer device, LinkedIn overlap).\n\nSOLUTION (2:00-7:00): The Triple-Separation Protocol. Separate entity, separate name, separate payment processor. Walkthrough of each. Show the Stealth Ops Hub.\n\nPROOF (7:00-9:00): The team call story. 3 seconds of panic → zero connection → call moved on.\n\nCTA (9:00-10:00): 'Audit your own stealth score at invisibleexit.com. Link in description.'",
    thumbnail: "Split screen: 'Employer Finds Side Business' (red) vs 'Complete Stealth Setup' (green). Shocked face emoji.",
  },
  {
    priority: 2,
    title: "How $0.97 Changed My Relationship With My $120K Salary",
    format: "Long-form (6-8 min)",
    searchVolume: "Medium",
    keyword: "first dollar online identity shift",
    hook: "When I got my first Stripe notification — $0.97 from a stranger — I expected excitement. What I didn't expect was how it would change my relationship with my salary.",
    script: "HOOK (0:00-0:10): 'This notification changed my life more than any raise ever did. It was for $0.97.'\n\nSTORY (0:10-3:00): The Amsterdam taxi moment. Two notifications. The scream. The identity shift.\n\nINSIGHT (3:00-5:00): Why the first dollar matters more than the amount. Employee → owner psychology.\n\nFRAMEWORK (5:00-6:30): Freedom Number concept. Your salary = one income stream, not your identity.\n\nCTA (6:30-7:00): 'Calculate your freedom number at invisibleexit.com.'",
    thumbnail: "Phone screen showing Stripe $0.97 notification, next to $120K salary. Split contrast.",
  },
  {
    priority: 3,
    title: "Your 0.5% Equity Is Worth Less Than You Think (The Math)",
    format: "Long-form (10-15 min)",
    searchVolume: "High",
    keyword: "startup equity calculator, equity math",
    hook: "$1 billion exit × 0.5% equity = $5 million, right? Wrong. Here's what you actually get — and why it changes everything.",
    script: "HOOK (0:00-0:20): Show the math on screen. '$1B × 0.5% = $5M... then reality hits.'\n\nMATH BREAKDOWN (0:20-5:00): Dilution (3 rounds), vesting cliffs, tax implications. Step by step with on-screen numbers.\n\nRESULT (5:00-6:00): $1.7M after everything. Invested at 5% = $85K/year. Less than your salary.\n\nSOLUTION (6:00-10:00): Why building recurring revenue is the actual escape hatch. The 5-tool system.\n\nCTA (10:00-11:00): 'Calculate your own freedom number.'",
    thumbnail: "Calculator showing $5,000,000 crossed out. Real number: $1,700,000 in red.",
  },
  {
    priority: 4,
    title: "I Spent 3 Months Choosing the Right Idea. Then I Launched the Wrong One.",
    format: "Long-form (8-10 min)",
    searchVolume: "Medium",
    keyword: "micro saas idea validation, system beats idea",
    hook: "The system worked regardless. Month 4: first $9 customer. Month 12: $4,100 MRR. Here's the system.",
    script: "HOOK (0:00-0:15): 'I spent 90 days choosing the perfect idea. Then I launched the wrong one. It made $4,100/month.'\n\nTHE WRONG WAY (0:15-3:00): Idea paralysis. Researching, planning, optimizing. Zero revenue.\n\nTHE SYSTEM (3:00-7:00): The Cartridge System. Build the system, not the idea. Show the pipeline. How I swapped ideas in and out.\n\nTIMELINE (7:00-8:30): Month-by-month MRR chart on screen.\n\nCTA (8:30-9:00): 'Get the 5-tool system at invisibleexit.com.'",
    thumbnail: "Timeline graph: $0 → $4,100 with month markers. Text: 'Wrong idea. Right system.'",
  },
  {
    priority: 5,
    title: "Month 4, Zero Customers — The Night I Almost Deleted Everything",
    format: "Long-form (6-8 min)",
    searchVolume: "Medium",
    keyword: "side business failure, giving up on startup",
    hook: "11 PM. Cursor over 'Cancel Subscription.' The voice said 'go back to managing.' Here's what saved me.",
    script: "HOOK (0:00-0:10): 'Month 4. Zero customers. This is the night I almost quit.'\n\nSTORY (0:10-3:00): The Month 4 wall. The voice. The cancel tab.\n\nTURNING POINT (3:00-5:00): Opening the freedom number calculation. The math hadn't changed.\n\nRESULT (5:00-6:30): Two weeks later — first customer. $9/month. Then the compounding.\n\nLESSON (6:30-7:00): 'The system doesn't care about your feelings. It needs consistency.'",
    thumbnail: "Dark screen, cursor over red 'Cancel Subscription' button. Timestamp: 11:00 PM.",
  },
  {
    priority: 6,
    title: "Why I Turned Down a VP Promotion (The MRR Math)",
    format: "Short (3-5 min)",
    searchVolume: "Low",
    keyword: "turn down promotion, career vs business",
    hook: "Director → VP. 15% raise. More equity. I said no. Here's the math that made it easy.",
    script: "HOOK (0:00-0:10): '15% raise. More equity. More prestige. I turned it down. The math made it obvious.'\n\nMATH (0:10-2:00): Raise = €18K/year. Cost = 10+ hrs/week. Side business grew $600 MRR = $7,200/year. The promotion would kill the compounding.\n\nINSIGHT (2:00-3:00): Freedom number = option to say no.\n\nCTA (3:00): 'Calculate your freedom number.'",
    thumbnail: "Two paths: 'VP Promotion +18K' vs 'Side Business +$600/mo compounding'. Arrow pointing to compounding path.",
  },
];

const YOUTUBE_STRATEGY = [
  {
    phase: "Phase 1: Foundation",
    timeline: "Weeks 1-2",
    tasks: [
      "Channel art: logo, banner, about section (faceless brand)",
      "Upload first 2 videos (priorities #1 and #2)",
      "Create 3 playlists: 'Stealth Ops', 'Freedom Math', 'Origin Story'",
      "Set up channel tags and description with target keywords",
    ],
  },
  {
    phase: "Phase 2: Consistency",
    timeline: "Weeks 3-8",
    tasks: [
      "Publish 1 video per week (priorities #3-6)",
      "Create YouTube Shorts from each video (60-second clips)",
      "Engage with 5 comments per video in first 24 hours",
      "Cross-post video links to Reddit + Indie Hackers (value-first)",
    ],
  },
  {
    phase: "Phase 3: Growth",
    timeline: "Months 3-6",
    tasks: [
      "Target search-optimized topics (side business, micro-SaaS, employed founder)",
      "Collaborate with 2 faceless channels in the space",
      "Test thumbnail variations (YouTube's built-in A/B testing)",
      "Analyze retention graphs — fix drop-off points in next videos",
    ],
  },
  {
    phase: "Phase 4: Scale",
    timeline: "Months 7-12",
    tasks: [
      "Publish 2 videos/week (1 long-form + 1 Short)",
      "Apply for YouTube Partner Program at 1K subscribers",
      "Launch 'Invisible Exit' podcast as video podcast (faceless)",
      "Use YouTube ads to retarget viewers to squeeze page",
    ],
  },
];

const SEO_TARGETS = [
  { keyword: "side business while employed", volume: "2,400/mo", difficulty: "Medium", intent: "High — problem aware" },
  { keyword: "how to start a business without quitting", volume: "1,900/mo", difficulty: "Medium", intent: "High — solution aware" },
  { keyword: "anonymous side business", volume: "880/mo", difficulty: "Low", intent: "Medium — product aware" },
  { keyword: "micro saas ideas", volume: "12,000/mo", difficulty: "High", intent: "High — solution aware" },
  { keyword: "non compete side business", volume: "1,300/mo", difficulty: "Low", intent: "High — problem aware" },
  { keyword: "passive income while employed", volume: "6,600/mo", difficulty: "High", intent: "Medium — problem aware" },
  { keyword: "stealth startup", volume: "4,400/mo", difficulty: "Medium", intent: "Medium — solution aware" },
];

const YOUTUBE_STRATEGY_PAGE = () => {
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="YouTube Strategy — 6 Video Scripts + Channel Plan | Invisible Exit"
        description="Complete YouTube strategy for faceless channel: 6 priority video scripts with hooks, thumbnails, SEO keywords, and a 4-phase channel growth plan."
        url="/youtube-strategy"
      />
      <Navbar />

      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Youtube className="w-4 h-4" />
            Secret #10: Google & YouTube
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            YouTube <span className="text-gradient-light">Strategy</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            YouTube is the second-largest search engine in the world. Our dream customer
            searches it for career advice, side business tutorials, and startup stories.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            6 priority video scripts. Full hooks, story beats, thumbnails, and SEO keywords.
            Faceless format. Ready to record.
          </p>
        </div>
      </section>

      {/* Video Pipeline */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            6 Priority Videos
          </h2>
          <p className="text-muted-foreground mb-8">
            Ranked by search volume and audience intent. Record in this order.
          </p>
          <div className="space-y-6">
            {VIDEO_PIPELINE.map((v, i) => (
              <div key={i} className="card-base overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-500 text-white font-bold text-sm">
                      #{v.priority}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{v.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {v.format} · Keyword: <code className="text-red-500">{v.keyword}</code> · {v.searchVolume} volume
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-wide mb-1">▶ Hook (0-15 sec)</p>
                    <p className="text-sm text-foreground italic">{v.hook}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-1">📝 Script Outline</p>
                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed font-sans">{v.script}</pre>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Thumbnail Concept</p>
                      <p className="text-sm text-foreground">{v.thumbnail}</p>
                    </div>
                    <div className="flex items-end justify-end">
                      <button
                        onClick={() => handleCopy(`TITLE: ${v.title}\n\nHOOK: ${v.hook}\n\nSCRIPT:\n${v.script}\n\nTHUMBNAIL: ${v.thumbnail}`, i)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          copied === i
                            ? "bg-success/15 text-success"
                            : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        }`}
                      >
                        {copied === i ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Script</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Keywords */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Target Keywords</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            YouTube SEO is keyword-driven. These are the search terms our dream customer uses.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-surface-dark text-white">
                  <th className="p-3 text-left">Keyword</th>
                  <th className="p-3 text-center">Monthly Volume</th>
                  <th className="p-3 text-center">Difficulty</th>
                  <th className="p-3 text-left">Intent</th>
                </tr>
              </thead>
              <tbody>
                {SEO_TARGETS.map((k, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="p-3 font-semibold text-foreground">{k.keyword}</td>
                    <td className="p-3 text-center text-muted-foreground">{k.volume}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        k.difficulty === "Low" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                        k.difficulty === "Medium" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                        "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}>{k.difficulty}</span>
                    </td>
                    <td className="p-3 text-muted-foreground">{k.intent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Channel Growth Plan */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            4-Phase Channel Growth Plan
          </h2>
          <p className="text-muted-foreground mb-8">
            From zero to monetized in 12 months. Each phase builds on the last.
          </p>
          <div className="space-y-4">
            {YOUTUBE_STRATEGY.map((p, i) => (
              <div key={i} className="card-base p-6 border-l-4 border-red-400">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground">{p.phase}</h3>
                  <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">
                    {p.timeline}
                  </span>
                </div>
                <ul className="space-y-2">
                  {p.tasks.map((t, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Metrics Framework */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">What to Measure</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Russell says: "Don't optimize for views. Optimize for the action that happens AFTER the view."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-base p-6 text-center">
              <Eye className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-1">Vanity Metrics</h3>
              <p className="text-sm text-muted-foreground">Views, impressions, subscriber count. Track but don't optimize for these.</p>
            </div>
            <div className="card-base p-6 text-center border-2 border-primary">
              <ArrowRight className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-1">Action Metrics</h3>
              <p className="text-sm text-muted-foreground">Click-through rate on description links. Squeeze page visits from YouTube. Email captures from video CTAs.</p>
            </div>
            <div className="card-base p-6 text-center">
              <ThumbsUp className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-1">Quality Metrics</h3>
              <p className="text-sm text-muted-foreground">Average view duration, retention curve, like ratio, comment quality. These signal algorithmic boost.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default YOUTUBE_STRATEGY_PAGE;
