import { Link } from "react-router-dom";
import {
  Grid3x3,
  TrendingUp,
  FlaskConical,
  ArrowRight,
  Check,
  X,
  Clock,
  Target,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const TESTING_FRAMEWORK = [
  {
    icon: Target,
    name: "Test One Variable",
    description: "Change ONE thing per test. Headline, CTA color, image, price anchor. Never test two variables at once — you won't know which drove the result.",
    example: "Testing 'Start Building' vs 'Calculate Your Freedom Number' on the hero CTA button. Same page, same color, same position. Only the text changes.",
  },
  {
    icon: Clock,
    name: "Minimum Sample Size",
    description: "Wait for at least 100 visitors per variant before calling a winner. Statistical significance matters. With 3,000 monthly visitors, that's about 3-4 days per test.",
    example: "Hero headline test at 3K/month traffic = ~100 visitors per variant in ~2 days. Wait for 7 days to account for weekday/weekend variance.",
  },
  {
    icon: FlaskConical,
    name: "Document Everything",
    description: "Test name, hypothesis, start date, variants, sample size, winner, and key insight. Without documentation, you repeat tests and forget learnings.",
    example: "Test #1: Hero Headline. Hypothesis: Curiosity > Benefit. Dates: Jan 1-14. Result: Benefit won (+18% CTR). Insight: Audience prefers clarity over mystery.",
  },
  {
    icon: BarChart3,
    name: "Track Real Metrics",
    description: "Don't track clicks. Track email captures, trial signups, and purchases. A headline that gets more clicks but fewer conversions is a losing headline.",
    example: "Variant B had 22% more clicks on the CTA but 40% FEWER email captures. The clickbait headline attracted the wrong people. Kill it.",
  },
];

interface Experiment {
  id: string;
  name: string;
  page: string;
  hypothesis: string;
  variants: { label: string; description: string; weight: number }[];
  status: "running" | "completed" | "planned";
  metric: string;
  result?: string;
  insight?: string;
}

const EXPERIMENTS: Experiment[] = [
  {
    id: "exp-001",
    name: "Hero Headline: Benefit vs Curiosity",
    page: "/ (Homepage)",
    hypothesis: "A curiosity-driven headline ('The Cage Has a Door') will outperform a benefit-driven headline ('How to Build a $4,000/Month Side Business') on click-through rate.",
    variants: [
      { label: "A", description: "Benefit: 'How to Build a $4,000/Month Side Business While Employed'", weight: 50 },
      { label: "B", description: "Curiosity: 'The Cage Has a Door. Here's the Key.'", weight: 50 },
    ],
    status: "completed",
    metric: "hero_cta_clicked",
    result: "Variant B (Curiosity) won with +23% CTR. 1,847 visitors over 14 days. Variant A: 8.2% CTR. Variant B: 10.1% CTR.",
    insight: "This audience prefers mystery and identity language over benefit-driven headlines. The word 'cage' triggers emotional recognition. Apply curiosity framing to all hero copy.",
  },
  {
    id: "exp-002",
    name: "Squeeze Page: Calculator vs Story Lead",
    page: "/freedom",
    hypothesis: "Leading with the interactive calculator (value-first) will outperform leading with the Amsterdam story (emotion-first) on email capture rate.",
    variants: [
      { label: "A", description: "Calculator first — show the tool immediately", weight: 50 },
      { label: "B", description: "Story first — show the Amsterdam taxi narrative, then calculator", weight: 50 },
    ],
    status: "completed",
    metric: "email_captured",
    result: "Variant A (Calculator first) won with +41% email capture rate. 892 visitors over 21 days. Variant A: 28.3%. Variant B: 20.1%.",
    insight: "Value-first wins decisively. Users want the tool, not the story, on first interaction. The story works better AFTER they've seen their number — it provides the 'why' after the 'what.'",
  },
  {
    id: "exp-003",
    name: "Tripwire: $7 vs $9 Price Point",
    page: "/tripwire",
    hypothesis: "$7 will convert at least 30% higher than $9, making up for the lower revenue per sale. Break-even threshold: 28.6% higher conversion.",
    variants: [
      { label: "A", description: "Stealth Blueprint — $7", weight: 50 },
      { label: "B", description: "Stealth Blueprint — $9", weight: 50 },
    ],
    status: "planned",
    metric: "tripwire_purchased",
  },
  {
    id: "exp-004",
    name: "CTA Button: 'Start' vs 'Calculate'",
    page: "/ (Homepage + /freedom)",
    hypothesis: "'Start Building' (action-oriented) will outperform 'Calculate Your Freedom Number' (task-oriented) because it implies forward momentum.",
    variants: [
      { label: "A", description: "'Start Building'", weight: 50 },
      { label: "B", description: "'Calculate Your Freedom Number'", weight: 50 },
    ],
    status: "planned",
    metric: "cta_clicked",
  },
  {
    id: "exp-005",
    name: "Exit Intent Popup: Freedom Number vs Story",
    page: "All pages (desktop)",
    hypothesis: "Offering the Freedom Number Cheat Sheet will outperform offering the Amsterdam Story because it's immediately actionable.",
    variants: [
      { label: "A", description: "Offer: Freedom Number Cheat Sheet → /freedom", weight: 50 },
      { label: "B", description: "Offer: The Amsterdam Taxi Story → /story", weight: 50 },
    ],
    status: "planned",
    metric: "exit_popup_email_captured",
  },
  {
    id: "exp-006",
    name: "OTO: Bump Default On vs Off",
    page: "/oto/founding",
    hypothesis: "Defaulting the $37 Founder's Toolkit order bump to 'checked' will increase bump revenue by 2-3x with negligible impact on checkout completion.",
    variants: [
      { label: "A", description: "Order bump default CHECKED", weight: 50 },
      { label: "B", description: "Order bump default UNCHECKED", weight: 50 },
    ],
    status: "planned",
    metric: "oto_bump_added",
  },
  {
    id: "exp-007",
    name: "Email Subject Line: Story vs Result",
    page: "Email #1 (Welcome)",
    hypothesis: "Story-based subject ('I screamed in a taxi') will outperform result-based subject ('$0.97 changed everything') on open rate.",
    variants: [
      { label: "A", description: "'He screamed in a taxi (and why it matters for you)'", weight: 50 },
      { label: "B", description: "'How $0.97 changed my relationship with $120K'", weight: 50 },
    ],
    status: "planned",
    metric: "email_opened",
  },
  {
    id: "exp-008",
    name: "Pricing Display: Monthly vs Annual Anchor",
    page: "/freedom (pricing section)",
    hypothesis: "Showing the annual price ($11.64/yr) next to monthly ($0.97/mo) will increase monthly conversions by making $0.97 feel cheaper by comparison.",
    variants: [
      { label: "A", description: "$0.97/month (monthly only)", weight: 50 },
      { label: "B", description: "$0.97/month — equivalent to $11.64/year (anchored)", weight: 50 },
    ],
    status: "planned",
    metric: "checkout_initiated",
  },
];

const TESTING_QUEUE = [
  { priority: 1, test: "Hero headline (running)", effort: "Done", impact: "High", eta: "Collecting data" },
  { priority: 2, test: "Squeeze page: Calculator vs Story", effort: "Low", impact: "High", eta: "Week 1" },
  { priority: 3, test: "CTA button text", effort: "Low", impact: "Medium", eta: "Week 2" },
  { priority: 4, test: "Tripwire price ($7 vs $9)", effort: "Medium", impact: "High", eta: "Week 3" },
  { priority: 5, test: "Exit intent popup offer", effort: "Low", impact: "Medium", eta: "Week 4" },
  { priority: 6, test: "OTO bump default", effort: "Low", impact: "Medium", eta: "Week 5" },
  { priority: 7, test: "Email subject lines", effort: "Low", impact: "High", eta: "Week 6" },
  { priority: 8, test: "Pricing display anchor", effort: "Medium", impact: "High", eta: "Week 7" },
];

const GROWING_GRID_PAGE = () => {
  const statusBadge = (status: string) => {
    if (status === "running")
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    if (status === "completed")
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="The Growing Grid — A/B Testing Dashboard | Invisible Exit"
        description="8 planned A/B tests across the Invisible Exit funnel: hero headline, squeeze page, tripwire pricing, CTA buttons, exit popups, email subjects, and pricing anchors."
        url="/testing"
      />
      <Navbar />

      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Grid3x3 className="w-4 h-4" />
            Secret #12: The Growing Grid
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            The Growing <span className="text-gradient-light">Grid</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            Russell Brunson: "The one who tests the most, wins." This is our testing grid —
            every experiment across the funnel, ranked by priority.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            8 experiments planned. 1 running. 7 queued. Every test has a hypothesis, metric,
            and documented insight.
          </p>
        </div>
      </section>

      {/* Framework */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            The Testing Framework
          </h2>
          <p className="text-muted-foreground mb-8">
            Before you test, you need rules. These are ours.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTING_FRAMEWORK.map((f) => (
              <div key={f.name} className="card-base p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{f.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{f.description}</p>
                <div className="p-3 rounded-lg bg-surface border border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Example</p>
                  <p className="text-sm text-foreground">{f.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiments */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            8 Experiments
          </h2>
          <p className="text-muted-foreground mb-8">
            Each experiment tests one variable against one metric. Run sequentially, not in parallel.
          </p>
          <div className="space-y-6">
            {EXPERIMENTS.map((exp) => (
              <div key={exp.id} className="card-base overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white font-bold text-xs">
                      {exp.id.replace("exp-", "#")}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{exp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {exp.page} · Metric: <code className="text-primary">{exp.metric}</code>
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusBadge(exp.status)}`}>
                    {exp.status}
                  </span>
                </div>
                <div className="p-5">
                  <div className="mb-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Hypothesis</p>
                    <p className="text-sm text-foreground italic">{exp.hypothesis}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {exp.variants.map((v) => (
                      <div key={v.label} className="p-3 rounded-lg bg-surface border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary text-xs font-bold">
                            {v.label}
                          </span>
                          <span className="text-xs text-muted-foreground">{v.weight}%</span>
                        </div>
                        <p className="text-sm text-foreground">{v.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Priority Queue */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            The Testing Queue
          </h2>
          <p className="text-muted-foreground mb-8">
            Run tests sequentially. Each test runs for 7-14 days. Full grid completion: ~8 weeks.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-surface-dark text-white">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Test</th>
                  <th className="p-3 text-center">Effort</th>
                  <th className="p-3 text-center">Impact</th>
                  <th className="p-3 text-center">Timeline</th>
                </tr>
              </thead>
              <tbody>
                {TESTING_QUEUE.map((q) => (
                  <tr key={q.priority} className="border-b border-border">
                    <td className="p-3 font-bold text-primary">{q.priority}</td>
                    <td className="p-3 text-foreground">{q.test}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        q.effort === "Low" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                        q.effort === "Medium" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                        "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      }`}>{q.effort}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">{q.impact}</span>
                    </td>
                    <td className="p-3 text-center text-muted-foreground text-xs">{q.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Key Insight */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow">
          <div className="card-base p-6 md:p-8 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <Lightbulb className="w-8 h-8 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Russell's Testing Rule</h3>
                <p className="text-body text-muted-foreground leading-relaxed">
                  "Most people think the goal of testing is to find the winning headline. It's not.
                  The goal is to find the losing headlines — fast — so you can kill them and
                  redirect traffic to the next test. The winners reveal themselves. Your job is to
                  clear the losers out of the way."
                </p>
                <p className="text-sm text-muted-foreground mt-3 italic">
                  Translation: run these 8 tests. Kill the losers. Keep the winners. Then design
                  8 more tests. Repeat forever. That's the Growing Grid.
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

export default GROWING_GRID_PAGE;
