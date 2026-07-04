import { Link } from "react-router-dom";
import {
  Search,
  Globe,
  MessageSquare,
  Mic,
  Users,
  Newspaper,
  GraduationCap,
  Briefcase,
  ArrowRight,
  ExternalLink,
  Target,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface Community {
  name: string;
  type: string;
  size: string;
  intent: string;
  angle: string;
  difficulty: "Low" | "Medium" | "High";
}

const COMMUNITIES: Community[] = [
  // Reddit
  { name: "r/cscareerquestions", type: "Reddit", size: "1.2M", intent: "Career strategy, compensation, golden handcuffs", angle: "The 0.5% equity math post", difficulty: "Medium" },
  { name: "r/experienceddevs", type: "Reddit", size: "450K", intent: "Senior devs frustrated with corporate", angle: "Anonymous side business case study", difficulty: "Medium" },
  { name: "r/FIRE", type: "Reddit", size: "800K", intent: "Financial independence, retire early", angle: "MRR vs stock options: which buys freedom faster", difficulty: "Low" },
  { name: "r/Entrepreneur", type: "Reddit", size: "2.1M", intent: "Side businesses, startups", angle: "Micro-SaaS from $0 to $4K MRR timeline", difficulty: "High" },
  { name: "r/SideHustle", type: "Reddit", size: "1.5M", intent: "Side income, extra revenue streams", angle: "5-hour weekend system for employed professionals", difficulty: "Low" },
  { name: "r/personalfinance", type: "Reddit", size: "18M", intent: "Money management, investing", angle: "Recurring revenue as diversification", difficulty: "High" },
  { name: "r/digitalnomad", type: "Reddit", size: "2M", intent: "Location independence", angle: "Build the system first, then go nomad", difficulty: "Medium" },
  { name: "r/EntrepreneurRideAlong", type: "Reddit", size: "350K", intent: "Real-time business building", angle: "Month-by-month $0→$4K MRR build log", difficulty: "Low" },

  // Communities / Forums
  { name: "Indie Hackers", type: "Community", size: "500K+", intent: "Bootstrapped founders, MRR-focused", angle: "Corporate manager building anonymously — full timeline", difficulty: "Low" },
  { name: "Hacker News", type: "Community", size: "8M/month", intent: "Tech, startups, building", angle: "Micro-SaaS without code: the AI tool stack", difficulty: "High" },
  { name: "Product Hunt", type: "Community", size: "3M+", intent: "New products, tools", angle: "Launch Invisible Exit tools as standalone PH posts", difficulty: "Medium" },
  { name: "Dev.to", type: "Community", size: "1.2M", intent: "Developer tutorials", angle: "Building micro-SaaS with AI (no-code path)", difficulty: "Low" },
  { name: "MicroConf Connect", type: "Community", size: "30K", intent: "Bootstrapped SaaS founders", angle: "The corporate-to-SaaS pipeline", difficulty: "Medium" },

  // LinkedIn
  { name: "LinkedIn (managers 30-45)", type: "LinkedIn", size: "50M+", intent: "Career advancement, networking", angle: "Short posts about equity math, golden handcuffs", difficulty: "Medium" },
  { name: "LinkedIn Groups (Career Strategy)", type: "LinkedIn", size: "10K-100K", intent: "Career transitions", angle: "Side business as career insurance", difficulty: "Medium" },

  // Twitter/X
  { name: "Twitter/X (Tech/Startup)", type: "Twitter", size: "Niche", intent: "Building in public, tech commentary", angle: "Anonymous building — the Adrian thread series", difficulty: "Low" },
  { name: "FinTwit (Financial Twitter)", type: "Twitter", size: "Large", intent: "Investing, money, FIRE", angle: "MRR > stock options (math thread)", difficulty: "Medium" },

  // Podcasts
  { name: "Indie Hackers Podcast", type: "Podcast", size: "200K/listeners", intent: "Founder stories", angle: "The $0.97 taxi moment", difficulty: "Medium" },
  { name: "My First Million", type: "Podcast", size: "500K", intent: "Business ideas, trends", angle: "Micro-SaaS for boring industries", difficulty: "High" },
  { name: "The Tim Ferriss Show", type: "Podcast", size: "2M+", intent: "Lifestyle design, optimization", angle: "The invisible exit system", difficulty: "High" },
  { name: "ChooseFI", type: "Podcast", size: "300K", intent: "Financial independence", angle: "Recurring revenue as FI accelerator", difficulty: "Medium" },
  { name: "Side Hustle School", type: "Podcast", size: "400K", intent: "Daily side hustle stories", angle: "5 tools, 5 hours/week, $4K MRR", difficulty: "Low" },
  { name: "The Side Hustle Show", type: "Podcast", size: "250K", intent: "Practical side income", angle: "The system-beats-idea framework", difficulty: "Low" },

  // Newsletters
  { name: "Morning Brew", type: "Newsletter", size: "4M", intent: "Business news", angle: "Sponsored placement or guest feature", difficulty: "High" },
  { name: "Indie Hackers Newsletter", type: "Newsletter", size: "200K", intent: "Founder stories, MRR", angle: "Anonymous founder feature", difficulty: "Medium" },
  { name: "Steli's Daily", type: "Newsletter", size: "50K", intent: "Sales, startups", angle: "Corporate skills as founder superpowers", difficulty: "Medium" },

  // YouTube
  { name: "YouTube (Personal Finance)", type: "YouTube", size: "Large", intent: "Money, FIRE, investing", angle: "How $0.97 changed my view of $120K salary", difficulty: "Medium" },
  { name: "YouTube (Side Hustle)", type: "YouTube", size: "Medium", intent: "Side income tutorials", angle: "Build a micro-SaaS in 5 hrs/week (full walkthrough)", difficulty: "Low" },
  { name: "YouTube (Tech/Career)", type: "YouTube", size: "Large", intent: "Career advice, tech industry", angle: "Why I turned down a VP promotion", difficulty: "Medium" },

  // Other
  { name: "Quora", type: "Q&A", size: "300M", intent: "Answering questions about career change", angle: "Answer 'should I quit my job' with the freedom number concept", difficulty: "Low" },
  { name: "Medium", type: "Publication", size: "100M+", intent: "Long-form articles", angle: "The math that proves your equity won't buy freedom (3000+ words)", difficulty: "Low" },
  { name: "Substack (career/finance)", type: "Newsletter", size: "Various", intent: "Career change, FIRE, burnout", angle: "Guest post or cross-publication", difficulty: "Medium" },
];

const PLATFORM_BREAKDOWN = [
  {
    icon: MessageSquare,
    platform: "Reddit",
    count: 8,
    totalReach: "26M+",
    strategy: "Value-first storytelling posts. No link drops. Comment for 2 weeks before posting. Each profession has a dedicated subreddit strategy page.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Users,
    platform: "Communities",
    count: 5,
    totalReach: "13M+",
    strategy: "Indie Hackers is priority #1 — our exact audience. Post the full build timeline. Engage in comments daily. MicroConf for high-trust relationships.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Briefcase,
    platform: "LinkedIn",
    count: 2,
    totalReach: "50M+",
    strategy: "Adrian posts 3x/week. Short-form (200 words). Equity math, golden handcuffs, system beats idea. LinkedIn articles monthly. No product pitch in first 90 days.",
    color: "text-blue-600",
    bg: "bg-blue-600/10",
  },
  {
    icon: Mic,
    platform: "Podcasts",
    count: 6,
    strategy: "Start with Side Hustle School + Side Hustle Show (lowest friction). Graduate to Indie Hackers Podcast. Pitch 10/month. Land first 3 within 90 days.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Newspaper,
    platform: "Newsletters",
    count: 3,
    totalReach: "4.2M+",
    strategy: "Morning Brew for scale (expensive but high reach). Indie Hackers newsletter for targeting. Guest articles in career/finance Substacks.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Globe,
    platform: "YouTube",
    count: 3,
    strategy: "Faceless channel. Script-ready content from the Content Calendar. 1 video/week. Prioritize 'side hustle' and 'personal finance' search terms.",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
];

const WHERE_THEY_HIDE = () => {
  const difficultyColor = (d: string) =>
    d === "Low" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" :
    d === "Medium" ? "text-amber-600 dark:text-amber-400 bg-amber-500/10" :
    "text-red-600 dark:text-red-400 bg-red-500/10";

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Where Your Dream Customer Hides — Community Atlas | Invisible Exit"
        description="31 communities, subreddits, podcasts, newsletters, and platforms where corporate managers trapped by golden handcuffs congregate online."
        url="/where"
      />
      <Navbar />

      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Search className="w-4 h-4" />
            Secret #2: Where Are They Concentrating?
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Where Your Dream Customer <span className="text-gradient-light">Hides</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            Russell's second secret: your dream customer already congregates somewhere online.
            Find those watering holes. Show up. Add value.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            31 communities across 7 platform types, ranked by reach, intent, and effort required.
          </p>
        </div>
      </section>

      {/* Platform Summary */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            The 7 Concentration Zones
          </h2>
          <p className="text-muted-foreground mb-8">
            Your dream customer hangs out in all of these. Priority order matters.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PLATFORM_BREAKDOWN.map((p) => (
              <div key={p.platform} className="card-base p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${p.bg} flex items-center justify-center`}>
                    <p.icon className={`w-5 h-5 ${p.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{p.platform}</h3>
                    <p className="text-xs text-muted-foreground">
                      {p.count} communities{p.totalReach ? ` · ${p.totalReach} reach` : ""}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.strategy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Community Atlas */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            The Complete Atlas
          </h2>
          <p className="text-muted-foreground mb-8">
            31 communities. Start with Low difficulty. Graduate to High once you have proof and momentum.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-surface-dark text-white">
                  <th className="p-3 text-left">Community</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Size</th>
                  <th className="p-3 text-left">Audience Intent</th>
                  <th className="p-3 text-left">Entry Angle</th>
                  <th className="p-3 text-center">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {COMMUNITIES.map((c, i) => (
                  <tr key={i} className="border-b border-border hover:bg-white/5">
                    <td className="p-3 font-semibold text-foreground">{c.name}</td>
                    <td className="p-3 text-muted-foreground">{c.type}</td>
                    <td className="p-3 text-muted-foreground">{c.size}</td>
                    <td className="p-3 text-muted-foreground">{c.intent}</td>
                    <td className="p-3 text-foreground">{c.angle}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${difficultyColor(c.difficulty)}`}>
                        {c.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The Numbers */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">31</p>
              <p className="text-sm text-muted-foreground">Communities mapped</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">7</p>
              <p className="text-sm text-muted-foreground">Platform types</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">100M+</p>
              <p className="text-sm text-muted-foreground">Total reach</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">14</p>
              <p className="text-sm text-muted-foreground">Low-difficulty entry points</p>
            </div>
          </div>
          <div className="card-base p-6 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50">
            <p className="text-sm text-foreground">
              <strong>Russell's rule:</strong> Don't try to be everywhere. Pick 3 communities. Show
              up daily for 90 days. Then expand. <strong>Start with:</strong> Indie Hackers,
              r/FIRE, and Side Hustle School podcast.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WHERE_THEY_HIDE;
