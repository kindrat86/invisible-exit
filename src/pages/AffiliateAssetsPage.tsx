import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Mail, FileText, Image, Link2, DollarSign, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const SWIPE_EMAILS = [
  {
    name: "Story-Based Email",
    subject: "He screamed in a taxi (and why it matters for you)",
    body: `Hey [FIRST_NAME],

A 37-year-old Managing Director sat in a taxi in Amsterdam at 6 AM.

Two notifications lit up his phone:

1. Corporate escalation emails — colleagues fighting over responsibilities on the first day of his vacation.

2. A Stripe notification — "$0.97 received" from a stranger who bought something he'd built while he slept.

He screamed. The driver thought he was insane.

That $0.97 wasn't money. It was proof that the cage has a door.

His name is Adrian. He built Invisible Exit — 5 tools that help corporate managers build invisible recurring revenue while employed.

No quitting. No coding. No employer finding out.

$0.97/month. All 5 tools. Cancel anytime.

[YOUR AFFILIATE LINK]

Talk soon,
[YOUR NAME]`,
  },
  {
    name: "Problem-Agitation Email",
    subject: "Even a $1B exit won't buy your freedom",
    body: `Hey [FIRST_NAME],

Quick math:

$1B exit × 0.5% equity = $5M
After dilution (~20%) = $4M
After taxes (~40%) = $2.4M
Invested at 5% = $120K/year

Your salary: $120K/year.

Even a BILLION DOLLAR EXIT doesn't buy your freedom. It buys a longer leash.

That's the problem Invisible Exit solves. It's a system for building $4,000/month in recurring revenue from products YOU own — while you're still employed.

5 AI-powered tools. $0.97/month. Cancel anytime.

[YOUR AFFILIATE LINK]

[YOUR NAME]`,
  },
  {
    name: "Quick Promo Email",
    subject: "5 tools for building a side business while employed ($0.97/mo)",
    body: `Hey [FIRST_NAME],

If you've ever thought about building something on the side but didn't know where to start, this is worth a look:

Invisible Exit — 5 AI-powered tools that help corporate managers build anonymous micro-SaaS businesses:

✅ Freedom Number Calculator (know exactly how much you need)
✅ Idea Pipeline (500+ validated ideas, 48h validation)
✅ Stealth Ops Hub (entity separation, compliance audit)
✅ Launch Control (go-live automation for 5 hrs/week)
✅ Brand Manager (faceless audience building)

All 5 tools. $0.97/month. 30-day money-back guarantee.

[YOUR AFFILIATE LINK]

[YOUR NAME]`,
  },
];

const SOCIAL_POSTS = [
  {
    platform: "Twitter/X",
    text: "If you earn $120K with 0.5% equity, even a $1B exit won't buy your freedom.\n\n$1B × 0.5% = $5M\n− dilution = $4M\n− taxes = $2.4M\n@ 5% = $120K/yr\n\nYour salary: $120K.\n\nThe cage has a door: [YOUR LINK]",
  },
  {
    platform: "LinkedIn",
    text: "For 8 years, I believed the IPO would save me.\n\nThen I did the math: even a billion-dollar exit, after dilution and taxes, invested at 5%, barely covers my salary.\n\nThe golden handcuffs were never designed to come off.\n\nThat's why I built something on the side. 5 tools. $0.97/month.\n\n[YOUR LINK]",
  },
  {
    platform: "Reddit",
    text: "I calculated whether my company's IPO would actually buy freedom. The math is brutal.\n\n$1B exit × 0.5% equity = $5M. After dilution and taxes: $2.4M. At 5%: $120K/year. That's my salary.\n\nEven the best-case IPO doesn't buy freedom. It buys a longer leash.\n\nFound a system that actually works for building side revenue while employed: [YOUR LINK]",
  },
];

const BANNERS = [
  { size: "728×90", name: "Leaderboard", desc: "Top of blog post or newsletter" },
  { size: "300×250", name: "Medium Rectangle", desc: "Sidebar or in-content" },
  { size: "120×600", name: "Skyscraper", desc: "Sidebar placement" },
  { size: "320×50", name: "Mobile Banner", desc: "Mobile top/bottom" },
  { size: "1200×630", name: "Social Share", desc: "OG image for link previews" },
];

const LINK_STRUCTURES = [
  { format: "Standard", url: "https://invisibleexit.com/?ref=AFFILIATE_CODE" },
  { format: "Squeeze Page", url: "https://invisibleexit.com/freedom?ref=AFFILIATE_CODE" },
  { format: "Story Page", url: "https://invisibleexit.com/story?ref=AFFILIATE_CODE" },
  { format: "Masterclass", url: "https://invisibleexit.com/masterclass?ref=AFFILIATE_CODE" },
];

const AffiliateAssetsPage = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Affiliate Assets — Swipe Copy, Emails, Banners | Invisible Exit"
        description="Everything our affiliates need: pre-written emails, social media posts, banner specs, and tracking link formats. Copy, paste, earn 30% recurring."
        url="/affiliate-assets"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <DollarSign className="w-4 h-4" />
            Affiliate Resource Hub
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Affiliate <span className="text-gradient-light">Assets</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Everything you need to promote Invisible Exit and earn 30% recurring commission.
          </p>
        </div>
      </section>

      {/* Commission Summary */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { plan: "Starter ($0.97)", perRef: "$0.29/mo", annual: "$3.48/yr" },
              { plan: "Founding ($17.99)", perRef: "$5.40/mo", annual: "$64.80/yr" },
              { plan: "Intensive ($2,000)", perRef: "$600 one-time", annual: "$600" },
            ].map((tier) => (
              <div key={tier.plan} className="card-base p-6 text-center">
                <p className="text-eyebrow text-primary mb-2">{tier.plan}</p>
                <p className="text-2xl font-bold text-foreground">{tier.perRef}</p>
                <p className="text-sm text-muted-foreground">per referral</p>
                <p className="text-xs text-success mt-2 font-medium">{tier.annual} annual value</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking Links */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">Step 1</p>
          <h2 className="text-h1 text-foreground mb-4 text-center">Your Tracking Links</h2>
          <p className="text-body text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Replace <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm">AFFILIATE_CODE</code> with your unique referral code from the dashboard.
            60-day cookie window on all links.
          </p>
          <div className="space-y-3 max-w-2xl mx-auto">
            {LINK_STRUCTURES.map((link) => (
              <div key={link.format} className="card-base p-4 flex items-center gap-3">
                <Link2 className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{link.format}</p>
                  <p className="text-sm text-foreground font-mono truncate">{link.url}</p>
                </div>
                <button
                  onClick={() => handleCopy(link.url, `link-${link.format}`)}
                  className={`shrink-0 p-2 rounded-lg transition-all ${
                    copied === `link-${link.format}` ? "bg-success/15 text-success" : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                >
                  {copied === `link-${link.format}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Swipe Emails */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">Step 2</p>
          <h2 className="text-h1 text-foreground mb-4 text-center">Swipe Emails</h2>
          <p className="text-body text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Pre-written emails. Copy, personalize, send to your list. Replace [YOUR AFFILIATE LINK] and [FIRST_NAME].
          </p>
          <div className="space-y-6 max-w-2xl mx-auto">
            {SWIPE_EMAILS.map((email) => (
              <div key={email.name} className="card-base overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-border bg-surface/50">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{email.name}</p>
                    <p className="text-xs text-muted-foreground">Subject: {email.subject}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(email.body, `email-${email.name}`)}
                    className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      copied === `email-${email.name}` ? "bg-success/15 text-success" : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    {copied === `email-${email.name}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied === `email-${email.name}` ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="p-5 whitespace-pre-wrap text-sm text-foreground leading-relaxed font-sans">
                  {email.body}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Posts */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">Step 3</p>
          <h2 className="text-h1 text-foreground mb-4 text-center">Social Media Posts</h2>
          <p className="text-body text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Ready-to-post copy for Twitter, LinkedIn, and Reddit. Replace [YOUR LINK].
          </p>
          <div className="space-y-4 max-w-2xl mx-auto">
            {SOCIAL_POSTS.map((post) => (
              <div key={post.platform} className="card-base overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
                  <span className="text-sm font-semibold text-primary">{post.platform}</span>
                  <button
                    onClick={() => handleCopy(post.text, `social-${post.platform}`)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      copied === `social-${post.platform}` ? "bg-success/15 text-success" : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    {copied === `social-${post.platform}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied === `social-${post.platform}` ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="p-5 whitespace-pre-wrap text-sm text-foreground leading-relaxed font-sans">
                  {post.text}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Specs */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">Step 4</p>
          <h2 className="text-h1 text-foreground mb-4 text-center">Banner Ad Specs</h2>
          <p className="text-body text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Standard IAB banner sizes. Assets available after affiliate approval. All banners use the Invisible Exit brand guidelines.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {BANNERS.map((banner) => (
              <div key={banner.size} className="card-base p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Image className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{banner.size} — {banner.name}</p>
                  <p className="text-xs text-muted-foreground">{banner.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-4">Ready to Earn?</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            Apply to the affiliate program. Get approved within 48 hours. Access all assets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/affiliates" className="btn-primary text-lg">
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/traffic-blueprint" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
              Back to Traffic Blueprint
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AffiliateAssetsPage;
