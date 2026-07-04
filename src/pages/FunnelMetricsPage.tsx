import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  TrendingDown,
  Users,
  Mail,
  DollarSign,
  Target,
  BarChart3,
  ArrowRight,
  AlertTriangle,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const FUNNEL_STAGES = [
  {
    stage: "Traffic",
    icon: Users,
    target: "1,000 visitors/month",
    current: "Unknown — no ad campaigns, no social content",
    conversion: "—",
    status: "blocked",
    notes: "Start $10/day Meta retargeting + 1 social post/day from content calendar",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    stage: "Blog Readers",
    icon: BarChart3,
    target: "500 readers/month (50% of traffic)",
    current: "234 pages of content, unknown traffic",
    conversion: "50%",
    status: "ready",
    notes: "Exit intent popup now captures blog traffic. 55 blog posts + 160 pSEO pages.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    stage: "Squeeze Submissions",
    icon: Mail,
    target: "150 emails/month (30% of blog readers)",
    current: "Infrastructure ready, instant delivery working",
    conversion: "30%",
    status: "ready",
    notes: "Squeeze page delivers Freedom Number instantly + viral share buttons",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    stage: "Email Opens",
    icon: Target,
    target: "60% open rate (90/month)",
    current: "20 emails (5 Soap Opera + 12 Seinfeld + 3 Win-Back)",
    conversion: "60%",
    status: "ready",
    notes: "17+ emails with story-driven subject lines. Buyer suppression active.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    stage: "Click-Throughs",
    icon: ArrowRight,
    target: "15% CTR (14 clicks/month)",
    current: "Every email has checkout CTA",
    conversion: "15%",
    status: "ready",
    notes: "All CTAs route through ?checkout=starter. Tracked via PostHog.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    stage: "Checkout Started",
    icon: DollarSign,
    target: "40% of clicks (5.6/month)",
    current: "Stripe checkout via create-checkout Edge Function",
    conversion: "40%",
    status: "ready",
    notes: "Conversion tracked via Google, Reddit, Meta pixels.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    stage: "Purchases ($0.97)",
    icon: Check,
    target: "50% checkout completion (2.8/month)",
    current: "0 — no traffic yet",
    conversion: "50%",
    status: "blocked",
    notes: "Funnel is ready. Waiting for traffic input.",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    stage: "OTO Upgrade ($17.99)",
    icon: TrendingDown,
    target: "20% of buyers (0.56/month)",
    current: "OTO page with order bump + countdown + downsell",
    conversion: "20%",
    status: "ready",
    notes: "Full OTO stack: video placeholder, value stack, scarcity, downsell.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    stage: "Pro Upgrade ($47)",
    icon: Users,
    target: "10% of buyers (0.28/month)",
    current: "NEW: /pro page with comparison table + application",
    conversion: "10%",
    status: "ready",
    notes: "Mid-tier fills the $17.99 → $2,000 gap.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    stage: "Intensive ($2,000)",
    icon: Target,
    target: "2% of buyers (0.056/month = ~1 per 18 months)",
    current: "/intensive page with $3,459 value stack",
    conversion: "2%",
    status: "ready",
    notes: "Application-based. Limited to 5/month.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

const TRACKING_PLATFORMS = [
  { name: "PostHog", purpose: "Full funnel analytics + session recording", events: "21+ tracked events", status: "active" },
  { name: "Google Analytics 4", purpose: "Standard web analytics", events: "G-1LJVDK6QJN", status: "active" },
  { name: "Google Tag Manager", purpose: "Tag management", events: "GTM-T8X36MNB", status: "active" },
  { name: "Meta Pixel", purpose: "Facebook/Instagram ad tracking", events: "1278454893564023", status: "active" },
  { name: "LinkedIn Insight", purpose: "LinkedIn ad tracking", events: "7293451", status: "active" },
  { name: "Reddit Pixel", purpose: "Reddit ad tracking", events: "a2_iqsi13q5oijk", status: "active" },
  { name: "Google Ads", purpose: "Search/display ad conversion", events: "AW-18046014876", status: "active" },
];

const FunnelMetricsPage = () => {
  const calcRef = useRef<HTMLDivElement>(null);

  // Interactive funnel calculator logic
  useEffect(() => {
    const trafficSlider = document.getElementById("traffic-slider") as HTMLInputElement;
    const blogCvrSlider = document.getElementById("blog-cvr-slider") as HTMLInputElement;
    const emailCvrSlider = document.getElementById("email-cvr-slider") as HTMLInputElement;
    if (!trafficSlider || !blogCvrSlider || !emailCvrSlider) return;

    const calculate = () => {
      const traffic = parseInt(trafficSlider.value);
      const blogCvr = parseInt(blogCvrSlider.value) / 100;
      const emailCvr = parseInt(emailCvrSlider.value) / 100;

      // Russell's benchmark rates
      const emailOpenRate = 0.50;
      const checkoutCompletion = 0.40;
      const otoUpgradeRate = 0.20;
      const proUpgradeRate = 0.10;

      const emails = Math.round(traffic * blogCvr);
      const emailClicks = Math.round(emails * emailOpenRate * emailCvr);
      const buyers = Math.round(emailClicks * checkoutCompletion);
      const otoBuyers = Math.round(buyers * otoUpgradeRate);
      const proBuyers = Math.round(otoBuyers * proUpgradeRate);

      const mrr = (buyers * 0.97) + (otoBuyers * 17.99) + (proBuyers * 47);
      const monthsTo4k = mrr > 0 ? Math.ceil(4000 / mrr) : Infinity;
      const cac = buyers > 0 ? 0 / buyers : 0; // $0 ad spend

      const fmt = (n: number) => n.toLocaleString();
      const fmtMoney = (n: number) => `$${Math.round(n).toLocaleString()}`;

      const update = (id: string, val: string) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      update("traffic-display", fmt(traffic));
      update("blog-cvr-display", `${parseInt(blogCvrSlider.value)}%`);
      update("email-cvr-display", `${parseInt(emailCvrSlider.value)}%`);
      update("calc-emails", fmt(emails));
      update("calc-buyers", fmt(buyers));
      update("calc-oto", fmt(otoBuyers));
      update("calc-mrr", fmtMoney(mrr));
      update("calc-timeline", monthsTo4k === Infinity ? "∞" : `${monthsTo4k}`);
      update("calc-cac", `Customer acquisition cost: <strong>$${cac.toFixed(2)}</strong> (at $0 ad spend)`);
    };

    calculate();
    trafficSlider.addEventListener("input", calculate);
    blogCvrSlider.addEventListener("input", calculate);
    emailCvrSlider.addEventListener("input", calculate);

    return () => {
      trafficSlider.removeEventListener("input", calculate);
      blogCvrSlider.removeEventListener("input", calculate);
      emailCvrSlider.removeEventListener("input", calculate);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Funnel Metrics — Internal Analytics Dashboard | Invisible Exit"
        description="The complete funnel visualization: traffic to blog to squeeze to email to checkout to OTO to Pro to Intensive. Target conversion rates and tracking infrastructure."
        url="/funnel-metrics"
        noindex
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <BarChart3 className="w-4 h-4" />
            Internal Dashboard (noindex)
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Funnel <span className="text-gradient-light">Metrics</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            The complete funnel from traffic to Intensive. Every stage, target conversion, and status.
          </p>
          <p className="text-sm text-white/40 max-w-xl mx-auto">
            Tracking infrastructure: 7 platforms, 21+ events. Every step measured.
          </p>
        </div>
      </section>

      {/* Funnel Visualization */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">The Funnel</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">From Visitor to Intensive Client</h2>

          <div className="max-w-3xl mx-auto space-y-3">
            {FUNNEL_STAGES.map((stage, i) => (
              <div key={stage.stage} className="card-base overflow-hidden">
                <div className="flex items-stretch">
                  {/* Stage number */}
                  <div className={`flex items-center justify-center w-16 shrink-0 ${stage.bg}`}>
                    <span className={`text-2xl font-bold ${stage.color}`}>{i + 1}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <stage.icon className={`w-5 h-5 ${stage.color}`} />
                        <h3 className="font-bold text-foreground">{stage.stage}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          stage.status === "ready" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-500"
                        }`}>
                          {stage.status === "ready" ? "READY" : "BLOCKED"}
                        </span>
                        {stage.conversion !== "—" && (
                          <span className="text-xs font-bold text-muted-foreground">
                            {stage.conversion} CVR
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm"><span className="text-muted-foreground">Target:</span> <span className="text-foreground font-medium">{stage.target}</span></p>
                      <p className="text-sm"><span className="text-muted-foreground">Current:</span> <span className="text-muted-foreground">{stage.current}</span></p>
                      <p className="text-xs text-muted-foreground italic mt-2">{stage.notes}</p>
                    </div>
                  </div>
                </div>

                {/* Arrow between stages */}
                {i < FUNNEL_STAGES.length - 1 && (
                  <div className="flex justify-center py-1 bg-surface/30">
                    <TrendingDown className="w-4 h-4 text-muted-foreground/30 rotate-[-90deg]" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Projected Revenue */}
          <div className="card-base p-6 mt-8 max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <p className="text-eyebrow text-primary mb-2 text-center">Projected Monthly Revenue (at target conversion)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">2.8</p>
                <p className="text-xs text-muted-foreground">$0.97 buyers</p>
                <p className="text-xs text-success">$2.72/mo</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0.56</p>
                <p className="text-xs text-muted-foreground">$17.99 OTO</p>
                <p className="text-xs text-success">$10.07/mo</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0.28</p>
                <p className="text-xs text-muted-foreground">$47 Pro</p>
                <p className="text-xs text-success">$13.16/mo</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">~1/18mo</p>
                <p className="text-xs text-muted-foreground">$2K Intensive</p>
                <p className="text-xs text-success">$111/mo avg</p>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              <strong className="text-foreground">Total projected MRR:</strong> ~$137/month at 1,000 visitors/month.
              <br />
              At 10,000 visitors/month: <strong className="text-foreground">~$1,370/month</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Tracking Platforms */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">Tracking Infrastructure</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">7 Platforms, 21+ Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {TRACKING_PLATFORMS.map((p) => (
              <div key={p.name} className="card-base p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.purpose}</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground shrink-0">{p.events}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Funnel Calculator (Ch 7: Funnel Math) ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">Interactive Funnel Calculator</p>
          <h2 className="text-h1 text-foreground mb-4 text-center">Know Your Numbers</h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto text-center mb-10">
            Russell Brunson says: "The person who knows their funnel math wins."
            Drag the sliders to see your projected revenue at any traffic level.
          </p>

          <div className="max-w-2xl mx-auto card-base p-6 sm:p-8">
            {/* Traffic Slider */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Monthly Traffic: <span className="text-primary" id="traffic-display">1,000</span> visitors
              </label>
              <input
                type="range"
                min="100"
                max="50000"
                step="100"
                defaultValue="1000"
                id="traffic-slider"
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>100</span>
                <span>10K</span>
                <span>25K</span>
                <span>50K</span>
              </div>
            </div>

            {/* Blog Conversion Slider */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Blog → Squeeze Conversion: <span className="text-primary" id="blog-cvr-display">5%</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                defaultValue="5"
                id="blog-cvr-slider"
                className="w-full accent-primary"
              />
            </div>

            {/* Email Conversion Slider */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email → Checkout CTR: <span className="text-primary" id="email-cvr-display">3%</span>
              </label>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                defaultValue="3"
                id="email-cvr-slider"
                className="w-full accent-primary"
              />
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t-2 border-border">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary tabular-nums" id="calc-emails">50</p>
                <p className="text-xs text-muted-foreground">Emails Captured</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground tabular-nums" id="calc-buyers">1</p>
                <p className="text-xs text-muted-foreground">$0.97 Buyers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-500 tabular-nums" id="calc-oto">0</p>
                <p className="text-xs text-muted-foreground">$17.99 OTO</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-success tabular-nums" id="calc-mrr">$0</p>
                <p className="text-xs text-muted-foreground">Projected MRR</p>
              </div>
            </div>

            {/* Break-even Analysis */}
            <div className="mt-6 bg-primary/5 border border-primary/15 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">
                At this rate, you'd hit <strong className="text-foreground">$4,000/month MRR</strong> in{" "}
                <strong className="text-primary" id="calc-timeline">— months</strong>.
              </p>
              <p className="text-xs text-muted-foreground mt-1" id="calc-cac">
                Customer acquisition cost: <strong>$—</strong> (at $0 ad spend)
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4 max-w-lg mx-auto">
            Assumptions: 50% of squeeze optins open emails. 40% of checkout starts complete.
            20% of $0.97 buyers upgrade to OTO. 10% of OTO buyers go Pro ($47).
            These are Russell's benchmark conversion rates from Dotcom Secrets.
          </p>
        </div>
      </section>

      {/* Blockers */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">Current Blockers</p>
          <h2 className="text-h1 text-foreground mb-8 text-center">What's Preventing Revenue</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              {
                blocker: "Zero traffic input",
                impact: "Funnel is ready but no visitors are entering. Like a water slide with no water.",
                fix: "Turn on $10/day Meta retargeting. Post 1 social content/day from /content-calendar. Send 5 Dream 100 outreach emails/week.",
              },
              {
                blocker: "No list size data",
                impact: "Can't optimize funnel without knowing conversion rates at each stage.",
                fix: "Check PostHog + GA4 dashboards weekly. Document squeeze conversion %, email open rate, checkout completion rate.",
              },
              {
                blocker: "No A/B testing",
                impact: "Don't know if current headlines, CTAs, or email subjects are optimal.",
                fix: "Test 2 squeeze page variants (different headlines). Test 5 email subject lines. Use PostHog experiments.",
              },
            ].map((b) => (
              <div key={b.blocker} className="card-base p-6 border-l-4 border-red-500/40">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <h3 className="font-bold text-foreground">{b.blocker}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{b.impact}</p>
                <p className="text-sm"><span className="font-semibold text-primary">Fix:</span> {b.fix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-4">The Funnel Is Ready.</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            Every stage built. Every event tracked. Every email sequenced.
            The only missing input is traffic. Turn the key.
          </p>
          <Link to="/traffic-blueprint" className="btn-primary text-lg">
            Go to Traffic Blueprint
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FunnelMetricsPage;
