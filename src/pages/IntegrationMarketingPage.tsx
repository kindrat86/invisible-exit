import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  Copy,
  Check,
  Mail,
  Link2,
  Plug,
  ArrowRight,
  Users,
  DollarSign,
  Zap,
  FileText,
  Shield,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

/**
 * TRAFFIC SECRETS: Secret #17 — Integration Marketing
 *
 * Russell Brunson: "Each of your Dream 100 has a distribution channel,
 * and it's your job to figure out how you can plug your products into
 * their channels."
 *
 * This page provides embeddable widgets, email sequence integrations,
 * and partnership templates that other creators/newsletter owners can
 * drop into their existing funnels — creating integration marketing
 * opportunities that work while we sleep.
 */

const INTEGRATION_TYPES = [
  {
    icon: Mail,
    title: "Email Sequence Integration",
    description:
      "Add an Invisible Exit mention to your welcome sequence, newsletter, or autoresponder. Perfect for career coaches, FIRE bloggers, and personal finance newsletters.",
    placements: [
      "Welcome email (day 2-3): 'Here's a tool I use to track my side income'",
      "Newsletter sponsor slot: 1-2 sentences with affiliate link",
      "Autoresponder integration: after a relevant topic email",
      "Broadcast email: dedicated recommendation",
    ],
    revenue: "30% recurring commission",
    setup: "Copy swipe copy + drop in your affiliate link",
  },
  {
    icon: Code2,
    title: "Embedded Calculator Widget",
    description:
      "Embed the Freedom Number Calculator directly on your blog or website. Visitors calculate their number on your site, then convert through your affiliate link.",
    placements: [
      "Blog sidebar (career/business content)",
      "Resource page on your site",
      "Inside a course module about side income",
      "As a lead magnet on your landing page",
    ],
    revenue: "Affiliate attribution on all conversions",
    setup: "Copy iframe embed code → paste into your HTML",
  },
  {
    icon: FileText,
    title: "Thank-You Page Upsell",
    description:
      "After someone buys your product or opts into your list, show an Invisible Exit recommendation on the thank-you page. This is Russell's highest-converting integration spot.",
    placements: [
      "Post-purchase thank-you page",
      "Post-optin confirmation page",
      "Course completion page",
      "Download confirmation page",
    ],
    revenue: "30% recurring on every conversion",
    setup: "Copy the thank-you page HTML block → paste",
  },
  {
    icon: Plug,
    title: "Content Co-Creation",
    description:
      "Co-create a piece of content with Adrian (interview, guest post, Twitter thread, or video). We provide the story; you get original content + affiliate revenue.",
    placements: [
      "Podcast interview (30-45 min)",
      "Guest blog post (1500-3000 words)",
      "Twitter/X thread takeover",
      "YouTube collaboration",
    ],
    revenue: "Full affiliate revenue + content for your channel",
    setup: "Email Adrian to coordinate",
  },
];

const EMBED_WIDGET = `<iframe 
  src="https://invisibleexit.com/freedom?embed=true" 
  width="100%" 
  height="500" 
  frameborder="0"
  style="border-radius:12px; border:1px solid #e5e7eb;"
  title="Freedom Number Calculator">
</iframe>`;

const THANK_YOU_BLOCK = `<div style="max-width:500px;margin:24px auto;padding:24px;border-radius:12px;background:#0f172a;color:white;font-family:sans-serif;text-align:center;">
  <h3 style="color:#60a5fa;font-size:14px;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">Recommended Resource</h3>
  <p style="font-size:16px;line-height:1.6;margin-bottom:16px;">Want to build a side business without quitting your job? Calculate your Freedom Number — the exact MRR you need to never work for someone else again.</p>
  <a href="YOUR_AFFILIATE_LINK" style="display:inline-block;padding:12px 28px;background:#3b82f6;color:white;text-decoration:none;border-radius:8px;font-weight:600;">Calculate Your Freedom Number →</a>
  <p style="font-size:12px;color:#94a3b8;margin-top:12px;">5 AI tools. $0.97/month. Cancel anytime.</p>
</div>`;

const EMAIL_SWIPE = `Subject: The math that makes your salary irrelevant

Hey [FIRST_NAME],

Quick story.

A Managing Director at a European tech company did the math on his 0.5% equity:

$1B exit × 0.5% = $5M
After dilution: $4M
After taxes: $2.4M
Invested at 5%: $120K/year

That's his salary. Even a billion-dollar exit doesn't buy freedom.

So he built something on the side. 5 hours a week. Completely anonymous.

Month 4: first $9 customer.
Month 12: $4,100 MRR.
Month 14: he turned down a VP promotion.

The system is called Invisible Exit. 5 AI tools for employed professionals who want to build recurring revenue without their employer finding out.

[YOUR_AFFILIATE_LINK]

$0.97/month to start. Cancel anytime.

[YOUR_NAME]`;

const PARTNER_PERKS = [
  {
    icon: DollarSign,
    title: "30% Lifetime Recurring",
    description:
      "Every subscriber you refer earns you 30% — for as long as they stay subscribed. $17.99 founding plan = $5.40/month per referral. 100 referrals = $540/month passive.",
  },
  {
    icon: Shield,
    title: "60-Day Cookie Window",
    description:
      "If someone clicks your link and subscribes within 60 days, you get the commission. No expiration games, no last-touch attribution tricks.",
  },
  {
    icon: Zap,
    title: "Instant Swipe Assets",
    description:
      "Email copy, embed widgets, thank-you page blocks, banner ads, and social media templates — all ready to copy-paste. No design work required.",
  },
  {
    icon: Users,
    title: "Co-Marketing Support",
    description:
      "We'll promote your content to our audience, feature you on the Founding Wall, and cross-promote in our email sequences. Real partnership, not just a link.",
  },
];

const IntegrationMarketingPage = () => {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const copyToClipboard = (text: string, blockId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(blockId);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Integration Marketing — Partner With Invisible Exit"
        description="Embed our Freedom Calculator, add us to your email sequence, or co-create content. 30% recurring commission, 60-day cookies, ready-made assets."
        url="/partners/embed"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Plug className="w-4 h-4" />
            Secret #17: Integration Marketing
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Plug Invisible Exit
            <br />
            <span className="text-blue-400">into your existing funnel</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            You already have an audience, an email list, and trust. We have the
            tools. Here's how to integrate our offer into what you're already
            doing — and earn 30% recurring on every conversion.
          </p>
        </div>
      </section>

      {/* Integration Types */}
      <section className="section py-16">
        <div className="container-narrow">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
            Four ways to integrate
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {INTEGRATION_TYPES.map((type, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-blue-500/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <type.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{type.title}</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {type.description}
                </p>
                <div className="space-y-1 mb-4">
                  {type.placements.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-white/50 text-sm"
                    >
                      <Check className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <p className="text-xs text-white/30 uppercase tracking-wide">
                      Revenue
                    </p>
                    <p className="text-sm text-emerald-400 font-semibold">
                      {type.revenue}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/30 uppercase tracking-wide">
                      Setup
                    </p>
                    <p className="text-sm text-white/50">{type.setup}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready-to-Copy Assets */}
      <section className="section py-16 bg-gradient-to-b from-transparent to-blue-950/20">
        <div className="container-narrow">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
            Copy-paste integration assets
          </h2>
          <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
            Everything below is ready to use. Just replace{" "}
            <code className="text-blue-400">YOUR_AFFILIATE_LINK</code> with your
            actual referral link.
          </p>

          {/* Embed Widget */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="rounded-xl border border-white/10 bg-slate-950/50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <span className="text-white/70 text-sm font-medium">
                    Freedom Calculator Embed Widget
                  </span>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(EMBED_WIDGET, "widget")
                  }
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  {copiedBlock === "widget" ? (
                    <>
                      <Check className="w-3 h-3" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs text-white/60 overflow-x-auto font-mono leading-relaxed">
                {EMBED_WIDGET}
              </pre>
            </div>
          </div>

          {/* Thank-You Page Block */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="rounded-xl border border-white/10 bg-slate-950/50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-white/70 text-sm font-medium">
                    Thank-You Page Block (HTML)
                  </span>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(THANK_YOU_BLOCK, "thankyou")
                  }
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  {copiedBlock === "thankyou" ? (
                    <>
                      <Check className="w-3 h-3" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs text-white/60 overflow-x-auto font-mono leading-relaxed">
                {THANK_YOU_BLOCK}
              </pre>
            </div>
          </div>

          {/* Email Swipe */}
          <div className="max-w-3xl mx-auto">
            <div className="rounded-xl border border-white/10 bg-slate-950/50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-white/70 text-sm font-medium">
                    Email Swipe Copy — "The Equity Math"
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(EMAIL_SWIPE, "email")}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  {copiedBlock === "email" ? (
                    <>
                      <Check className="w-3 h-3" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs text-white/60 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                {EMAIL_SWIPE}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Perks */}
      <section className="section py-16">
        <div className="container-narrow">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
            Why partner with us
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {PARTNER_PERKS.map((perk, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <perk.icon className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white font-semibold">{perk.title}</h3>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  {perk.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section py-16 bg-gradient-to-b from-blue-950/20 to-transparent">
        <div className="container-narrow text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to integrate?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            Get your affiliate link, grab the assets, and plug Invisible Exit
            into your funnel today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/affiliates"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              Get Your Affiliate Link
            </Link>
            <Link
              to="/affiliate-assets"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-colors"
            >
              <FileText className="w-5 h-5" />
              All Swipe Assets
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IntegrationMarketingPage;
