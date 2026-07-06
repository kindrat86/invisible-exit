import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Shield,
  Copy,
  Check,
  Star,
  ArrowRight,
  Mail,
  Gift,
  BarChart3,
  FileText,
  MessageSquare,
  Megaphone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

/**
 * TRAFFIC SECRETS: Chapters 15-16 — Partnership / JV Traffic
 *
 * Russell's insight: the fastest traffic is someone else's audience.
 * This page is the offer to potential JV partners (not affiliates).
 * A JV partner gets:
 *   - A custom offer for their audience
 *   - A revenue split (not just commission)
 *   - Co-branded landing pages
 *   - Recognition as a co-creator
 */
const JV_OFFER_ITEMS = [
  {
    icon: DollarSign,
    title: "50% Revenue Share",
    desc: "Not 30% commission. 50% of every dollar your audience pays. If they send 100 people at $17.99/mo = $899.50/month residual for you.",
  },
  {
    icon: Star,
    title: "Co-Branded Landing Page",
    desc: "A custom landing page that features YOU as the recommend-er. Your face, your quote, your story — plus the Invisible Exit offer. Built in 48 hours.",
  },
  {
    icon: Target,
    title: "Dedicated Tracking",
    desc: "Unique Stripe link, custom UTM parameters, and a weekly report of clicks, conversions, and commissions. No mystery. No guesswork.",
  },
  {
    icon: Gift,
    title: "Free Founding Membership",
    desc: "Full lifetime access — worth $215/year — free for you and your team. Use it personally so your recommendation is genuine.",
  },
];

const REVENUE_EXAMPLES = [
  { audience: "5,000 newsletter subs", clickRate: "3%", clicks: 150, convRate: "2%", buyers: 3, price: "$17.99", monthly: "$27", annual: "$323" },
  { audience: "20,000 YouTube subs", clickRate: "1%", clicks: 200, convRate: "3%", buyers: 6, price: "$47", monthly: "$141", annual: "$1,692" },
  { audience: "50K social followers", clickRate: "0.5%", clicks: 250, convRate: "2%", buyers: 5, price: "$17.99", monthly: "$45", annual: "$539" },
  { audience: "100K podcast downloads/mo", clickRate: "2%", clicks: 2000, convRate: "1%", buyers: 20, price: "$0.97", monthly: "$10", annual: "$116" },
];

const DREAM_100_APPLICATION_STEPS = [
  {
    step: 1,
    title: "Who You Reach",
    description: "Tell us about your audience: size, platform, demographics, and why they'd resonate with the corporate escape story.",
  },
  {
    step: 2,
    title: "Your Story",
    description: "Share your personal connection to the 'golden handcuffs' problem — or why your audience needs this solution.",
  },
  {
    step: 3,
    title: "The Offer",
    description: "We build a co-branded landing page with your story plus a custom offer for your audience. You get 50% of all revenue.",
  },
];

const JVPage = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [audienceSize, setAudienceSize] = useState("");
  const [platform, setPlatform] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:escape@invisibleexit.com?subject=JV%20Partnership%20Application&body=Audience%20Size:%20${encodeURIComponent(audienceSize)}%0D%0APlatform:%20${encodeURIComponent(platform)}%0D%0AEmail:%20${encodeURIComponent(email)}%0D%0A---%0D%0AHi%20Adrian,%0D%0A%0D%0AI'd%20like%20to%20partner%20on%20a%20JV.%20My%20audience%20details%20above.%0D%0A%0D%0AHere's%20how%20I'd%20like%20to%20promote%20it:`;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="JV Partner Program — 50% Revenue Share | Invisible Exit"
        description="Joint venture partnership program for creators, podcasters, and community leaders. 50% revenue share, co-branded landing pages, dedicated tracking. Build a recurring income stream by recommending Invisible Exit to your audience."
        url="/partners/jv"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Users className="w-4 h-4" />
            TRAFFIC SECRETS: Partnership Engine
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Your Audience Is Trapped in{" "}
            <span className="text-gradient-light">Golden Handcuffs</span>.
            <br />
            Here's How to Free Them —{" "}
            <span className="text-amber-400">Together.</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-4">
            50% revenue share. Co-branded landing page. Dedicated tracking.
            Built in 48 hours.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto mb-10">
            Your audience of corporate managers, career professionals, and aspiring founders
            IS the Invisible Exit target. Let's build a custom offer they can't refuse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#apply" className="btn-primary text-lg">
              Apply for JV Partnership
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              to="/dream-100"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
            >
              <Target className="w-4 h-4" /> See Dream 100 Framework
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Benefit Cards */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-4 text-center">Why Partner With Us</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">The JV Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {JV_OFFER_ITEMS.map((item) => (
              <div key={item.title} className="card-base p-6 card-hover">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-h3 text-foreground mb-2">{item.title}</h3>
                <p className="text-caption">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Calculator */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">The Math</p>
          <h2 className="text-h1 text-foreground mb-4 text-center">What 50% Means For You</h2>
          <p className="text-body text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Even a small audience generates meaningful revenue when the offer is $17.99/month
            recurring and you keep half.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {REVENUE_EXAMPLES.map((ex, i) => (
              <div key={i} className="card-base p-5">
                <p className="text-sm font-bold text-foreground mb-2">{ex.audience}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Clicks:</span>{" "}
                    <span className="text-foreground font-medium">{ex.clicks}</span>
                    <span className="text-muted-foreground/50"> ({ex.clickRate})</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Buyers:</span>{" "}
                    <span className="text-foreground font-medium">{ex.buyers}</span>
                    <span className="text-muted-foreground/50"> ({ex.convRate})</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-border mt-1">
                    <span className="text-muted-foreground">Your 50%:</span>{" "}
                    <span className="text-emerald-500 font-bold">{ex.monthly}/month</span>
                    <span className="text-muted-foreground"> ({ex.annual}/year)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6 max-w-lg mx-auto">
            These are conservative estimates based on Russell's benchmark conversion rates.
            Your actual results will vary — but the upside is real.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">The Process</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">How a JV Partnership Works</h2>
          <div className="space-y-6 max-w-2xl mx-auto">
            {[
              {
                step: "1",
                title: "You Apply",
                body: "Tell us about your audience size, platform, and demographics. We review within 48 hours.",
              },
              {
                step: "2",
                title: "We Build Your Page",
                body: "Our team builds a co-branded landing page featuring your story, your face, and a custom offer for your audience. Includes unique tracking, Stripe link, and UTM parameters.",
              },
              {
                step: "3",
                title: "You Promote",
                body: "Send your audience to the co-branded page however you like: email, social, podcast, video. We provide swipe copy, banners, and scripts.",
              },
              {
                step: "4",
                title: "You Get Paid",
                body: "Every month, you receive 50% of all subscription revenue from your referrals. Paid via Stripe Connect or PayPal. No minimum threshold.",
              },
            ].map((s) => (
              <div key={s.step} className="card-base p-6 flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white font-bold text-lg shrink-0">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-caption">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Swipe Copy */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">Done-For-You</p>
          <h2 className="text-h1 text-foreground mb-4 text-center">JV Partner Swipe Copy</h2>
          <p className="text-body text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Copy these templates. Add your personal opening. Send to your audience.
            We handle the landing page and tracking.
          </p>

          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              {
                title: "Email to Your List",
                body: `Subject: The traffic secret nobody talks about

Hey [NAME],

I found something that changed how I think about corporate jobs.

It's called Invisible Exit — 5 tools that help corporate managers build anonymous side businesses while employed. No code. No quitting. No employer finding out.

The creator (a fellow Managing Director at a European tech company) built $4,100/month in side revenue while working full-time. His employer never knew.

I negotiated a special deal for my audience: [YOUR_CUSTOM_OFFER].

Check it out here: [YOUR_CO_BRANDED_LINK]

I honestly wish I'd had this system when I was stuck in golden handcuffs. If you know anyone in a corporate job who dreams of starting something — send this to them.

[YOUR_NAME]`,
              },
              {
                title: "Social Post (LinkedIn/Twitter)",
                body: `The fastest way to build recurring revenue isn't the right idea. It's the right system.

I partnered with Invisible Exit because their audience IS my audience: corporate managers who feel trapped but can't quit.

5 tools that help you:
→ Calculate your freedom number
→ Validate a micro-SaaS idea in 48 hours
→ Set up anonymous entity separation
→ Launch in 5 hours/week
→ Build a faceless brand

My audience gets a custom offer + my personal guarantee.

Link in bio.`,
              },
            ].map((swipe) => (
              <div key={swipe.title} className="card-base overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
                  <p className="text-sm font-semibold text-foreground">{swipe.title}</p>
                  <button
                    onClick={() => handleCopy(swipe.body, `swipe-${swipe.title}`)}
                    className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      copied === `swipe-${swipe.title}` ? "bg-success/15 text-success" : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    {copied === `swipe-${swipe.title}` ? (
                      <><Check className="w-4 h-4" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy</>
                    )}
                  </button>
                </div>
                <pre className="p-5 whitespace-pre-wrap text-sm text-foreground leading-relaxed font-sans">{swipe.body}</pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">Skip the Wait</p>
          <h2 className="text-h1 text-foreground mb-4 text-center">Apply for JV Partnership</h2>
          <p className="text-body text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            Fill this out and I'll review within 48 hours. If there's a fit, we'll have
            your co-branded landing page live within a week.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Your Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourplatform.com"
                  className="w-full rounded-xl border border-border bg-background text-foreground px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[48px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Audience Size *</label>
                <select
                  required
                  value={audienceSize}
                  onChange={(e) => setAudienceSize(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background text-foreground px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[48px]"
                >
                  <option value="">Select audience size...</option>
                  <option value="1k-5k">1,000 - 5,000</option>
                  <option value="5k-10k">5,000 - 10,000</option>
                  <option value="10k-50k">10,000 - 50,000</option>
                  <option value="50k-100k">50,000 - 100,000</option>
                  <option value="100k+">100,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Primary Platform *</label>
                <select
                  required
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background text-foreground px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[48px]"
                >
                  <option value="">Select platform...</option>
                  <option value="newsletter">Email Newsletter</option>
                  <option value="youtube">YouTube</option>
                  <option value="podcast">Podcast</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="community">Private Community (Slack/Discord)</option>
                  <option value="blog">Blog / Website</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn-primary w-full text-lg"
              >
                Apply Now — Opens Email
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-muted-foreground text-center">
                This opens your email client with a pre-filled application. Send it and I'll respond within 48 hours.
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto card-base p-8 text-center animate-scale-in">
              <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Email Opened</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Check your email client. The pre-filled application should be open. Hit send and I'll review within 48 hours.
              </p>
              <p className="text-xs text-muted-foreground">
                Didn't open? Email me directly:{" "}
                <a href="mailto:escape@invisibleexit.com" className="text-primary hover:underline">
                  escape@invisibleexit.com
                </a>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <Megaphone className="w-12 h-12 text-primary-light mx-auto mb-6" />
          <h2 className="text-h1 text-white mb-4">Your Audience Needs This.</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            Every corporate manager in your audience has wondered about building something on
            the side. Give them a system that works. Keep 50% of the revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#apply" className="btn-primary text-lg">
              Apply for JV Partnership
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              to="/affiliates"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
            >
              <DollarSign className="w-4 h-4" /> Or Join the Affiliate Program (30%)
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JVPage;
