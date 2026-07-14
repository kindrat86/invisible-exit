import { Link } from "react-router-dom";
import {
  Mic,
  Radio,
  Clock,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  Code2,
  Users,
  Globe2,
  BookOpen,
  ShieldCheck,
  Download,
  Mail,
  Youtube,
  Linkedin,
  FileText,
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

/**
 * PressPage — Expert Secrets Ch 15-16 (Authority / Archetype)
 *
 * Consolidates every authority signal into one media-ready page:
 *  - Headline numbers (verified MRR, members, frameworks)
 *  - Speaking topics (6 original, podcast-ready angles)
 *  - Interview formats (5-min → 45-min → written Q&A)
 *  - Fact sheet (boilerplate "About" for show notes)
 *  - Sample questions for hosts
 *  - Media assets (OG image, logos, screenshots)
 *  - Contact for booking
 *
 * This page serves 3 audiences:
 *  1. Podcast hosts / journalists → booking decisions
 *  2. Skeptical visitors → deep-dive authority check
 *  3. Affiliates / partners → asset library
 */

// ── DATA ──

const HEADLINE_STATS = [
  { value: "$4,100/mo", label: "Verified MRR", icon: TrendingUp, source: "Stripe-documented across 3 products" },
  { value: "127", label: "Active Builders", icon: Users, source: "Paying members across 14 countries" },
  { value: "3", label: "Proprietary Frameworks", icon: Code2, source: "Named, tested, independently taught" },
  { value: "200+", label: "Original Frameworks", icon: BookOpen, source: "Guides, case studies, methodologies" },
];

const SPEAKING_TOPICS = [
  {
    num: "01",
    title: "The $0.97 Amsterdam Taxi Moment",
    angle: "How a single Stripe notification at 6 AM on vacation cracked the identity shift from employee to owner — and why the first dollar online matters more than the amount.",
    bestFor: "Startup podcasts, founder mindset shows, side-hustle audiences",
    duration: "15-30 min",
  },
  {
    num: "02",
    title: "Why 0.5% Equity Is a Leash, Not a Partnership",
    angle: "The math that kills the golden handcuffs fantasy: $1B exit → $5M → $2.4M after dilution and taxes → $120K/year at 5%. Less than your salary. What to build instead.",
    bestFor: "Career strategy, FIRE, tech compensation, finance shows",
    duration: "20-40 min",
  },
  {
    num: "03",
    title: "Building a Business Your Employer Can't Find",
    angle: "The Triple-Separation Protocol: entity separation, digital compartmentalization, and anonymity engineering. Why anonymity is a competitive advantage, not a limitation.",
    bestFor: "Indie hackers, side-hustle, privacy/security, startup shows",
    duration: "25-45 min",
  },
  {
    num: "04",
    title: "The System Beats the Idea (The Cartridge System)",
    angle: "I spent 3 months choosing the 'right' idea. Then launched the wrong one. It made $9/month. Then I pivoted — same system, different idea, $4,100/month. Why systems compound and ideas don't.",
    bestFor: "Product, SaaS, maker, bootstrapper communities",
    duration: "20-35 min",
  },
  {
    num: "05",
    title: "AI Solo Founders vs. Funded 5-Person Teams",
    angle: "How AI tools closed the execution gap. A corporate manager with 5 hours/week can now out-ship a seed-stage team. The new unfair advantage isn't capital — it's focus + AI.",
    bestFor: "AI, future-of-work, no-code, developer tooling shows",
    duration: "20-40 min",
  },
  {
    num: "06",
    title: "Month 4, Zero Customers: The Night I Almost Deleted Everything",
    angle: "The unglamorous truth about month 4. Cursor over 'Cancel Subscription.' The voice that says 'go back to managing.' What saved me — and the framework I built from it.",
    bestFor: "Founder mental health, authenticity, failure-story podcasts",
    duration: "15-25 min",
  },
];

const FORMATS = [
  {
    duration: "5 min",
    icon: Clock,
    title: "The Elevator Version",
    use: "Podcast intros, quick-fire segments, panels",
    desc: "The Amsterdam taxi moment → the identity shift → the system. Compressed to 5 minutes with a clear hook and CTA.",
  },
  {
    duration: "15 min",
    icon: Clock,
    title: "Standard Interview Segment",
    use: "Most podcast appearances, guest spots",
    desc: "Full Epiphany Bridge arc: background → math → epiphany → 3 secrets → results. The sweet spot for audience engagement.",
  },
  {
    duration: "45 min",
    icon: Clock,
    title: "Full Masterclass Interview",
    use: "Long-form podcasts, keynote talks, webinars",
    desc: "All 11 chapters of the origin story, deep-dive on each framework, live Q&A, and tactical breakdowns.",
  },
  {
    duration: "Written",
    icon: FileText,
    title: "Written Q&A / Guest Article",
    use: "Blog interviews, newsletters, print features",
    desc: "Full written responses to 10-15 questions. Pre-written versions available for tight editorial deadlines.",
  },
];

const SAMPLE_QUESTIONS = [
  "You're anonymous. Why should anyone trust your revenue claims?",
  "What's the actual math on 0.5% equity that made you start building?",
  "Walk us through the Triple-Separation Protocol — how does someone actually stay invisible?",
  "You spent 3 months choosing the 'right' idea, then launched the wrong one. What happened?",
  "What does Month 4 feel like? The zero-customer wall?",
  "How does a corporate manager with 5 hours/week out-ship a full-time founder?",
  "What's the Freedom Number? How does someone calculate it?",
  "Your colleague found a similar website on a team call. Walk us through those 3 seconds.",
  "You turned down a VP promotion. What was the math on that?",
  "What's the one thing you wish someone had told you on Day 1?",
];

const FACT_SHEET = {
  name: "Invisible Exit",
  founder: "Adrian (pseudonym, identity protected)",
  founded: "2025",
  tagline: "The world's first anonymity-native business system for corporate managers.",
  description:
    "Invisible Exit is a membership platform with 5 AI-powered tools that help corporate managers build anonymous micro-SaaS businesses while employed. Founded by Adrian — a pseudonymous Managing Director who built $4,100/month in recurring revenue across 3 products without quitting his job or revealing his identity.",
  pricing: "From $0.97/month (founding member pricing). Pro tier at $47/mo. Weekend Workshop at $97. 90-Day Intensive at $2,000.",
  frameworks: "The Salary-Runway Method, The Triple-Separation Protocol, The Cartridge System",
  community: "127 active builders across 14 countries",
  languages: "96 languages via real-time translation",
  contact: "hello@invisibleexit.com",
  social: {
    youtube: "https://www.youtube.com/@InvisibleExit",
    linkedin: "https://www.linkedin.com/company/invisible-exit",
    twitter: "https://twitter.com/InvisibleExit",
  },
};

const MEDIA_ASSETS = [
  { label: "OG Image (1200×630)", url: "https://invisibleexit.com/og-image.png", type: "PNG" },
  { label: "Logo — Dark", url: "https://invisibleexit.com/og-image.png", type: "PNG" },
  { label: "Founder Monogram", url: "/adrian", type: "Page (screenshot recommended)" },
  { label: "Framework Diagram", url: "/frameworks", type: "Page (screenshot recommended)" },
];

const TRUST_SIGNALS = [
  { icon: ShieldCheck, title: "Stripe-Verified Revenue", desc: "Every revenue claim documented via Stripe screenshots. Not a claim — a receipt." },
  { icon: Users, title: "Active Community, Not a List", desc: "127 paying members building right now. Not vanity subscribers — active builders." },
  { icon: Code2, title: "3 Named Frameworks", desc: "Proprietary methodologies independently taught, not recycled from other gurus." },
  { icon: Globe2, title: "Global From Day 1", desc: "96-language translation. Builders in 14 countries. Not US-centric." },
];

const BOILERPLATE_SHORT = `Invisible Exit is the world's first anonymity-native business system — 5 AI-powered tools that help corporate managers build $4,000+/month in micro-SaaS revenue while employed, without their employer finding out. Founded by Adrian (pseudonym), a Managing Director who built $4,100/month across 3 products without quitting his job. From $0.97/month at invisibleexit.com.`;

const BOILERPLATE_LONG = `Invisible Exit (invisibleexit.com) is a membership platform with 5 AI-powered tools that help corporate managers build anonymous micro-SaaS businesses while employed. The platform was created by Adrian (pseudonym), a 37-year-old Managing Director at a European tech company who built $4,100/month in recurring revenue across 3 products — without quitting his job, without writing code, and without his employer discovering his side businesses. The system is built on 3 proprietary frameworks: The Salary-Runway Method (your job is the launchpad), The Triple-Separation Protocol (anonymity engineering), and The Cartridge System (the system beats the idea). The platform serves 127 active builders across 14 countries, with content available in 96 languages. Pricing starts at $0.97/month for founding members.`;

// ── COMPONENT ──

const PressPage = () => {
  const [copiedShort, setCopiedShort] = useState(false);
  const [copiedLong, setCopiedLong] = useState(false);
  const [copiedQuestions, setCopiedQuestions] = useState(false);

  const copyToClipboard = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[hsl(222_47%_11%)]">
      <SEOHead
        title="Press & Media Kit — Invisible Exit"
        description="Media kit, speaking topics, interview formats, fact sheet, and sample questions for podcast hosts, journalists, and partners covering the anonymous micro-SaaS movement."
        url="/press"
      />
      <Navbar />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MediaGallery",
            name: "Invisible Exit Press Kit",
            description: "Media kit and speaking topics for Invisible Exit",
            url: "https://invisibleexit.com/press",
            about: {
              "@type": "Organization",
              name: "Invisible Exit",
              founder: { "@type": "Person", name: "Adrian" },
              foundingDate: "2025",
            },
          }),
        }}
      />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary-light mb-6">Press & Media Kit</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
            The Anonymous Founder Who Built{" "}
            <span className="text-gradient-light">$4,100/Month</span>{" "}
            Without Quitting
          </h1>
          <p className="text-body-lg text-white/60 max-w-2xl mx-auto mb-8">
            Podcast host? Journalist? Partner? Everything you need to evaluate,
            book, and prepare for an interview with Invisible Exit — in one place.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:hello@invisibleexit.com?subject=Podcast%2FPress%20Inquiry"
              onClick={() => trackEvent("press_book_clicked")}
              className="btn-primary text-lg px-8 inline-flex items-center gap-2"
            >
              <Mic className="w-5 h-5" />
              Book Adrian
            </a>
            <Link
              to="/story"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors"
            >
              Read the full story first <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Headline Stats */}
      <section className="bg-white/[0.02] border-y border-white/10 py-12">
        <div className="container-standard">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {HEADLINE_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-primary-light mx-auto mb-2" />
                <p className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-sm font-semibold text-white/80 mt-1">{stat.label}</p>
                <p className="text-xs text-white/40 mt-1 max-w-[180px] mx-auto leading-tight">
                  {stat.source}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speaking Topics */}
      <section className="bg-surface section-normal">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">Speaking Topics</p>
            <h2 className="text-h1 text-foreground mb-4">6 Angles, All Original</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Each topic is a self-contained segment with a hook, a story, and a
              framework. Mix and match for your format.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPEAKING_TOPICS.map((topic) => (
              <div key={topic.num} className="card-base p-6 card-hover">
                <div className="flex items-start gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-sm shrink-0">
                    {topic.num}
                  </span>
                  <div>
                    <h3 className="font-bold text-foreground text-sm leading-tight">
                      {topic.title}
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {topic.angle}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-[11px] text-muted-foreground">{topic.bestFor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-[11px] text-muted-foreground">{topic.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interview Formats */}
      <section className="bg-white section-normal border-t border-border">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">Interview Formats</p>
            <h2 className="text-h1 text-foreground mb-4">From 5-Minute Hit to Full Masterclass</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Pre-built for any format. Full scripts and talking points available
              on request.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FORMATS.map((fmt) => (
              <div key={fmt.title} className="card-base p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <fmt.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-primary mb-1">{fmt.duration}</p>
                <h3 className="font-bold text-foreground text-sm mb-3">{fmt.title}</h3>
                <p className="text-xs text-muted-foreground mb-2 font-medium">{fmt.use}</p>
                <p className="text-xs text-muted-foreground/80 leading-relaxed">{fmt.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/podcast-pitch"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              See full pitch templates and story formats <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <div className="text-center mb-10">
            <p className="text-eyebrow text-primary mb-4">Why Hosts Book This</p>
            <h2 className="text-h1 text-foreground mb-4">Not Another Hustle-Bro Story</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_SIGNALS.map((sig) => (
              <div key={sig.title} className="card-base p-6">
                <sig.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-bold text-foreground text-sm mb-2">{sig.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{sig.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fact Sheet + Boilerplate */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">Fact Sheet</p>
            <h2 className="text-h1 text-foreground mb-4">Quick Reference</h2>
          </div>

          {/* Fact sheet grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 max-w-3xl mx-auto">
            {[
              { label: "Name", value: FACT_SHEET.name },
              { label: "Founder", value: FACT_SHEET.founder },
              { label: "Founded", value: FACT_SHEET.founded },
              { label: "Tagline", value: FACT_SHEET.tagline },
              { label: "Pricing", value: FACT_SHEET.pricing },
              { label: "Frameworks", value: FACT_SHEET.frameworks },
              { label: "Community", value: FACT_SHEET.community },
              { label: "Languages", value: FACT_SHEET.languages },
            ].map((item) => (
              <div key={item.label} className="bg-surface rounded-xl p-4 border border-border">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {item.label}
                </p>
                <p className="text-sm text-foreground leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Boilerplate — Short */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-foreground">Short Boilerplate (for show notes)</h3>
              <button
                onClick={() => copyToClipboard(BOILERPLATE_SHORT, setCopiedShort)}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover font-medium"
              >
                {copiedShort ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedShort ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">{BOILERPLATE_SHORT}</p>
            </div>
          </div>

          {/* Boilerplate — Long */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-foreground">Long Boilerplate (for articles)</h3>
              <button
                onClick={() => copyToClipboard(BOILERPLATE_LONG, setCopiedLong)}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover font-medium"
              >
                {copiedLong ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLong ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">{BOILERPLATE_LONG}</p>
            </div>
          </div>

          {/* Sample Questions */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Sample Questions for Hosts</h3>
              <button
                onClick={() => {
                  copyToClipboard(SAMPLE_QUESTIONS.map((q, i) => `${i + 1}. ${q}`).join("\n"), setCopiedQuestions);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover font-medium"
              >
                {copiedQuestions ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedQuestions ? "Copied!" : "Copy all"}
              </button>
            </div>
            <div className="space-y-3">
              {SAMPLE_QUESTIONS.map((q, i) => (
                <div key={i} className="flex items-start gap-3 bg-surface rounded-xl p-4 border border-border">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground">{q}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Media Assets */}
          <div className="max-w-3xl mx-auto mb-12">
            <h3 className="text-sm font-bold text-foreground mb-4">Media Assets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MEDIA_ASSETS.map((asset) => (
                <a
                  key={asset.label}
                  href={asset.url}
                  target={asset.url.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-surface rounded-xl p-4 border border-border hover:border-primary/30 transition-colors group"
                >
                  <Download className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{asset.label}</p>
                    <p className="text-xs text-muted-foreground">{asset.type}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Booking */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary-light mb-4">Book the Interview</p>
          <h2 className="text-h1 text-white mb-4">
            Ready When You Are.
          </h2>
          <p className="text-body text-white/60 max-w-xl mx-auto mb-8">
            Async-first: pre-recorded video, written Q&A, or live remote. Responses
            within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:hello@invisibleexit.com?subject=Podcast%2FPress%20Inquiry"
              onClick={() => trackEvent("press_email_clicked")}
              className="btn-primary text-lg px-8 inline-flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              hello@invisibleexit.com
            </a>
            <div className="flex items-center gap-3">
              <a
                href={FACT_SHEET.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-white/60" />
              </a>
              <a
                href={FACT_SHEET.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white/60" />
              </a>
            </div>
          </div>
          <p className="text-white/30 text-xs mt-6">
            No public face reveals required. Interviews can be conducted via
            text, audio-only, or AI-generated voice.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PressPage;
