import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Target,
  Users,
  Video,
  Image as ImageIcon,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  Copy,
  Check,
  ChevronDown,
  Megaphone,
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface AdConcept {
  angle: string;
  hook: string;
  bodyCopy: string;
  cta: string;
  format: "Image" | "Video" | "Carousel";
  audience: string;
  estimatedCpc: string;
}

const AD_CONCEPTS: AdConcept[] = [
  {
    angle: "Curiosity — The Taxi Moment",
    hook: "I screamed in a taxi over $0.97.",
    bodyCopy: "A stranger paid for something I built while I slept.\n\nThat $0.97 changed how I see my $120K salary.\n\nNot because of the money. Because of what it proved:\n\n→ My worth exists outside the company\n→ I can build invisible income while employed\n→ The cage has a door\n\nI built 5 tools that help you find yours.",
    cta: "Calculate Your Freedom Number",
    format: "Image",
    audience: "Corporate managers, 32-45, interested in entrepreneurship",
    estimatedCpc: "$0.80-$1.50",
  },
  {
    angle: "Fear — The Discovery Nightmare",
    hook: "My colleague found my side business on a team call.",
    bodyCopy: "3 seconds of pure panic.\n\nThen I remembered: different entity, different name, different Stripe, different hosting.\n\nZero connection to me.\n\nThe call moved on. Nobody knew.\n\nIf you're building on the side, your stealth setup isn't optional.\n\nIt's career insurance.",
    cta: "Audit Your Stealth Score",
    format: "Video",
    audience: "Employed professionals interested in side hustles",
    estimatedCpc: "$0.60-$1.20",
  },
  {
    angle: "Math — The Equity Trap",
    hook: "Your 0.5% equity is worth less than you think.",
    bodyCopy: "$1B exit × 0.5% = $5M\nAfter dilution: $2.4M\nAfter taxes: $1.7M\nInvested at 5%: $85K/year\n\nThat's less than your current salary.\n\nEven a billion-dollar exit doesn't buy freedom.\nIt buys a longer leash.\n\nThe math doesn't lie.",
    cta: "See the Full Breakdown",
    format: "Image",
    audience: "Startup employees with equity compensation",
    estimatedCpc: "$1.00-$2.00",
  },
  {
    angle: "Aspiration — The Identity Shift",
    hook: "The first $0.97 online isn't money. It's an identity shift.",
    bodyCopy: "For 8 years, I defined myself by my salary.\n$120K = what I'm worth.\n\nThen a stranger paid me $0.97 for something I built.\n\nSuddenly my salary stopped being my identity.\nIt became one income stream.\n\nEmployee → owner.\n\nThe first dollar changes everything.",
    cta: "Start Your Shift",
    format: "Carousel",
    audience: "Career-focused professionals feeling stuck",
    estimatedCpc: "$0.70-$1.30",
  },
  {
    angle: "Authority — The System Beats Idea",
    hook: "I spent 3 months choosing the 'right' idea. Then I launched the wrong one.",
    bodyCopy: "It made $9/month.\n\nThe system worked regardless.\n\nMonth 4: first customer\nMonth 6: $850 MRR\nMonth 9: $2,100 MRR\nMonth 12: $4,100 MRR\n\nI didn't have a better idea. I had a better system.\n\n5 tools. 5 hours/week. Still employed.",
    cta: "See the 5-Tool System",
    format: "Video",
    audience: "Aspiring entrepreneurs, side-hustle seekers",
    estimatedCpc: "$0.50-$1.00",
  },
  {
    angle: "Comparison — Bonus vs MRR",
    hook: "My boss got a €15K bonus. My side business made $4,100/month.",
    bodyCopy: "He was thrilled.\n\nHis bonus: capped. Decided by someone else.\nMy MRR: compounding. 8% monthly growth.\n\n$49,200/year.\nNo boss. No board. No equity dilution.\n\nDifferent games.\nDifferent math.\n\nWhich are you playing?",
    cta: "Run the Numbers",
    format: "Image",
    audience: "Corporate employees, mid-to-senior level",
    estimatedCpc: "$0.80-$1.50",
  },
  {
    angle: "Vulnerability — Almost Quit",
    hook: "Month 4. Zero customers. I almost deleted everything.",
    bodyCopy: "11 PM on a Tuesday.\nCursor over 'Cancel Subscription.'\n\nThen I opened my freedom number calculation.\n\nThe math hadn't changed.\n$4,000/month = optionality.\n\nThe math doesn't care about your feelings.\n\nTwo weeks later: first customer. $9/month.\n\nConsistency beats motivation.",
    cta: "Calculate Your Freedom Number",
    format: "Carousel",
    audience: "Aspiring entrepreneurs who have tried and failed",
    estimatedCpc: "$0.60-$1.10",
  },
  {
    angle: "Contrarian — Anonymity Is Strategy",
    hook: "I deleted my personal Twitter (2K followers) and went anonymous.",
    bodyCopy: "In 3 weeks, the anonymous account passed my personal account in engagement.\n\nNobody knows it's me.\n\nAnonymity means I can:\n→ Experiment without fear\n→ Build in any market\n→ Fail without consequences\n→ Stay employed\n\nAnonymity isn't hiding.\nIt's strategy.",
    cta: "Build Your Faceless Brand",
    format: "Image",
    audience: "Content creators, employed professionals",
    estimatedCpc: "$0.50-$0.90",
  },
];

const AUDIENCE_ARCHETYPES = [
  {
    name: "The Loyal Employee",
    description: "8+ years at same company. Believes the IPO is coming. Has never tried to earn outside the company.",
    painPoint: "Hasn't realized they're trapped yet",
    bestAngle: "The Equity Math",
    pixel: "Meta + LinkedIn",
    landingPage: "/cost-of-waiting/calculator or /compare page",
  },
  {
    name: "The Frustrated Manager",
    description: "Knows they're stuck. Reads FIRE blogs. Dreams about quitting but has a mortgage.",
    painPoint: "Can't see a realistic exit path",
    bestAngle: "Freedom Number / System Beats Idea",
    pixel: "Meta + Reddit",
    landingPage: "/freedom (squeeze) or /masterclass",
  },
  {
    name: "The Aspiring Founder",
    description: "Has tried side hustles before. Has ideas but no system. Consumes startup content.",
    pain: "Lacks a repeatable framework",
    bestAngle: "System Beats Idea / 5-Tool Stack",
    pixel: "Meta + Google",
    landingPage: "/masterclass or /frameworks",
  },
  {
    name: "The Stealth Builder",
    description: "Already building on the side. Worried about getting caught. Needs stealth ops.",
    painPoint: "Fear of employer discovery",
    bestAngle: "The Discovery Nightmare / Stealth Audit",
    pixel: "Reddit + Meta",
    landingPage: "/stealth-ops or /freedom",
  },
];

const TARGETING_PRESETS = [
  {
    platform: "Meta (Facebook + Instagram)",
    preset: "Corporate Managers 32-45",
    targeting: "Job titles: Director, VP, Senior Manager, Head of + interest: Entrepreneurship, FIRE, Side Hustle",
    budget: "$10/day",
    objective: "Traffic → Squeeze page",
    expectedCpc: "$0.80-$1.50",
  },
  {
    platform: "LinkedIn Ads",
    preset: "Tech Company Employees with Equity",
    targeting: "Job seniority: Director+ at companies with 50-500 employees + industry: Technology, Finance",
    budget: "$20/day",
    objective: "Lead gen → Masterclass signup",
    expectedCpc: "$3.00-$6.00",
  },
  {
    platform: "Reddit Ads",
    preset: "FIRE + Side Hustle Subreddits",
    targeting: "Subreddits: r/FIRE, r/SideHustle, r/Entrepreneur, r/cscareerquestions",
    budget: "$5/day",
    objective: "Traffic → Blog posts → Retargeting",
    expectedCpc: "$0.30-$0.80",
  },
  {
    platform: "Google Ads (Search)",
    preset: "High-Intent Search Terms",
    targeting: "Keywords: 'should I quit my job calculator', 'how to start a business while employed', 'non-compete loophole'",
    budget: "$15/day",
    objective: "Direct traffic → highest-intent pages",
    expectedCpc: "$2.00-$5.00",
  },
];

const AD_LIBRARY = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatIcon = (f: string) => {
    if (f === "Video") return <Video className="w-4 h-4" />;
    if (f === "Carousel") return <ImageIcon className="w-4 h-4" />;
    return <ImageIcon className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Ad Creative Library — 8 Ready-to-Launch Campaigns | Invisible Exit"
        description="8 Facebook, Instagram, LinkedIn, and Reddit ad concepts with full targeting presets, copy, and budget recommendations for the Invisible Exit funnel."
        url="/ad-library"
      />
      <Navbar />

      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Megaphone className="w-4 h-4" />
            Secret #6: Traffic You Control
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            The Ad Creative <span className="text-gradient-light">Library</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            8 ready-to-launch ad concepts. 4 targeting presets. Full copy, format, audience, and
            budget for each.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            All pixels are installed. All landing pages are built. The only thing missing was
            the creative. Until now.
          </p>
        </div>
      </section>

      {/* Status Banner */}
      <section className="bg-amber-50 border-b border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50 py-4">
        <div className="container-narrow flex items-center justify-center gap-3">
          <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-foreground text-center">
            <strong>Pixels installed:</strong> Meta, LinkedIn, Reddit, Google Ads ·{" "}
            <strong>Landing pages ready:</strong> Squeeze, Masterclass, Blog ·{" "}
            <strong>Status:</strong> Turn on $10/day Meta retargeting to start
          </p>
        </div>
      </section>

      {/* Audience Archetypes */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            4 Audience Archetypes for Paid Traffic
          </h2>
          <p className="text-muted-foreground mb-8">
            Each archetype gets a different angle, pixel, and landing page.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AUDIENCE_ARCHETYPES.map((a) => (
              <div key={a.name} className="card-base p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">{a.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{a.description}</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold text-foreground">Pain:</span> <span className="text-muted-foreground">{a.painPoint || a.pain}</span></p>
                  <p><span className="font-semibold text-foreground">Best Angle:</span> <span className="text-muted-foreground">{a.bestAngle}</span></p>
                  <p><span className="font-semibold text-foreground">Channels:</span> <span className="text-muted-foreground">{a.pixel}</span></p>
                  <p><span className="font-semibold text-foreground">Landing:</span> <span className="text-primary">{a.landingPage}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Concepts */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            8 Ad Concepts — Ready to Launch
          </h2>
          <p className="text-muted-foreground mb-8">
            Each concept includes hook, body copy, CTA, format, audience, and estimated CPC.
            Copy and paste into your ad platform.
          </p>
          <div className="space-y-6">
            {AD_CONCEPTS.map((ad, i) => (
              <div key={i} className="card-base overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white font-bold text-sm">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{ad.angle}</p>
                      <p className="text-xs text-muted-foreground italic">"{ad.hook}"</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                      {formatIcon(ad.format)}
                      {ad.format}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Body Copy</p>
                    <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-sans">{ad.bodyCopy}</pre>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">CTA</p>
                      <p className="text-sm text-primary font-medium">{ad.cta}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Est. CPC</p>
                      <p className="text-sm text-foreground">{ad.estimatedCpc}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Target Audience</p>
                      <p className="text-sm text-muted-foreground">{ad.audience}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(`${ad.hook}\n\n${ad.bodyCopy}\n\nCTA: ${ad.cta}`, `ad-${i}`)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      copied === `ad-${i}`
                        ? "bg-success/15 text-success"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    {copied === `ad-${i}` ? (
                      <><Check className="w-4 h-4" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy Ad Copy</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Targeting Presets */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            4 Targeting Presets
          </h2>
          <p className="text-muted-foreground mb-8">
            Plug-and-play targeting for each platform. Start at $10/day, scale winners.
          </p>
          <div className="space-y-4">
            {TARGETING_PRESETS.map((t, i) => (
              <div key={i} className="card-base p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground">{t.platform}</h3>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {t.budget}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Preset</p>
                    <p className="text-foreground">{t.preset}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Objective</p>
                    <p className="text-muted-foreground">{t.objective}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Targeting</p>
                    <p className="text-muted-foreground">{t.targeting}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Expected CPC</p>
                    <p className="text-foreground">{t.expectedCpc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Launch Sequence */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            The Phased Launch Sequence
          </h2>
          <div className="space-y-4">
            <div className="card-base p-6 border-l-4 border-emerald-400">
              <p className="font-bold text-foreground mb-1">Phase 1 (Week 1-2): Warm Up</p>
              <p className="text-sm text-muted-foreground">$5/day Reddit ads → blog posts. Goal: build retargeting audience. 1,000+ pixel fires.</p>
            </div>
            <div className="card-base p-6 border-l-4 border-amber-400">
              <p className="font-bold text-foreground mb-1">Phase 2 (Week 3-4): Retarget</p>
              <p className="text-sm text-muted-foreground">$10/day Meta retargeting → squeeze page. Goal: first email captures. Test 3 ad concepts.</p>
            </div>
            <div className="card-base p-6 border-l-4 border-blue-400">
              <p className="font-bold text-foreground mb-1">Phase 3 (Week 5-8): Test</p>
              <p className="text-sm text-muted-foreground">$15/day across Meta + Reddit. Test all 8 concepts. Kill bottom 50%. Scale top 2.</p>
            </div>
            <div className="card-base p-6 border-l-4 border-primary">
              <p className="font-bold text-foreground mb-1">Phase 4 (Week 9+): Scale</p>
              <p className="text-sm text-muted-foreground">$30-50/day on winning concepts. Add LinkedIn for B2B targeting. Add Google search ads for high-intent terms.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AD_LIBRARY;
