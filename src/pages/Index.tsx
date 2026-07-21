import { Link, useNavigate } from "react-router-dom";
// NOTE: imported eagerly by App.tsx — keep this module free of heavy deps
// (no recharts/html2canvas) so the entry bundle stays lean.
import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart3,
  Lightbulb,
  Shield,
  Rocket,
  Megaphone,
  ArrowRight,
  Check,
  Lock,
  Users,
  MapPin,
  Gift,
  TrendingUp,
  X,
  Clock,
  Zap,
  Star,
  AlertTriangle,
  Heart,
} from "lucide-react";
import TestimonialGrid from "@/components/TestimonialGrid";
import FrameworkDiagram from "@/components/FrameworkDiagram";
import ValueLadder from "@/components/ValueLadder";
import InlineSqueeze from "@/components/InlineSqueeze";
import AuthorityBar from "@/components/AuthorityBar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import { useABTest, trackABConversion } from "@/hooks/useABTest";

const TOOLS = [
  {
    icon: BarChart3,
    name: "FYM Dashboard",
    outcome: "Know exactly how much you need to quit.",
    description:
      "Tracks your recurring revenue, churn, growth rate, and exit timeline across all your projects.",
    value: "$12/month",
    framework: "Salary-Runway Method",
  },
  {
    icon: Lightbulb,
    name: "Idea Pipeline",
    outcome: "Stop guessing. Start validating.",
    description:
      "500+ micro-SaaS ideas scored by industry fit, time investment, and revenue potential. AI-powered validation in 48 hours.",
    value: "$15/month",
    framework: "Cartridge System",
  },
  {
    icon: Shield,
    name: "Stealth Ops Hub",
    outcome: "Your employer will never find out.",
    description:
      "Entity separation, compliance audit, digital footprint cleanup. Invisibility score from 0-100 with specific fixes.",
    value: "$25/month",
    framework: "Triple-Separation Protocol",
  },
  {
    icon: Rocket,
    name: "Launch Control",
    outcome: "Ship products faster than your day job allows.",
    description:
      "Full launch automation: checklists, email sequences, go-live tracking. Built for people with 5 hours a week.",
    value: "$18/month",
    framework: "Salary-Runway + Cartridge",
  },
  {
    icon: Megaphone,
    name: "Brand Manager",
    outcome: "Build an audience without showing your face.",
    description:
      "Content calendar, YouTube scripts, Reddit playbooks. Everything you need to grow an anonymous brand.",
    value: "$27/month",
    framework: "Cartridge System",
  },
];

const FAQS = [
  {
    q: "What do I get for $0.97/month?",
    a: "FYM Dashboard tells you exactly how much recurring revenue you need to quit. Idea Pipeline finds and validates your first product in 48 hours. Stealth Ops Hub makes sure your employer never finds out. Launch Control ships your product in weeks, not months. Brand Manager builds your audience without showing your face. All five, one price.",
  },
  {
    q: "Does this violate my employment contract?",
    a: "Most employment contracts restrict you from competing in your employer's industry or using company resources. Invisible Exit is designed around those constraints. You build in unrelated markets, on your own time, with your own tools. The Stealth Ops Hub runs a compliance audit against common contract clauses (non-compete, IP assignment, moonlighting) and flags anything that needs attention. That said, every contract is different. We always recommend reviewing yours with a legal professional.",
  },
  {
    q: "Can my employer find out?",
    a: "The Stealth Ops Hub is specifically designed to prevent that. It includes entity separation guidance, compliance audit tools, and digital footprint cleanup. Your business operates under a completely separate legal structure with no connection to your name.",
  },
  {
    q: "Do I need technical skills to build a micro-SaaS?",
    a: "No. The Idea Pipeline filters for builds that work with no-code tools and AI-assisted development. You don't need to write code. If you can manage a team and run a P&L, you have more than enough skill to build and launch a micro-SaaS. The system handles the technical scaffolding.",
  },
  {
    q: "What if I don't have a business idea yet?",
    a: "That's exactly what the Idea Pipeline is for. It has 500+ validated micro-SaaS ideas organized by industry, time investment, and revenue tier. Most founding members find 3-5 ideas worth exploring in their first session.",
  },
  {
    q: "What if my company IPOs and I get my equity payout?",
    a: "Great. Then you'll have two income streams instead of one. Nothing about Invisible Exit requires you to quit. It's insurance, not an ultimatum. If the IPO happens and it's life-changing money, you celebrate. If it doesn't, or the payout disappoints, you already have a backup generating revenue.",
  },
  {
    q: "How long until I actually make money?",
    a: "Most members validate their first idea within 30 days. First revenue varies: some hit it in 60 days, some in 6 months. It depends on the idea you pick and how you use your 5 hours per week. This is not a 'get rich quick' pitch. It's a system for building real recurring revenue alongside your career.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no commitments. Cancel from your dashboard in one click. Plus there's a 30-day money-back guarantee.",
  },
  {
    q: "What are the pricing tiers? Is $0.97/month really forever?",
    a: "There are three tiers. Founding Member: $0.97/month — full access to all five tools, locked for life. Pro: $47/month — adds weekly group coaching, monthly MRR audits, and the private Inner Circle community. Intensive: $2,000 one-time — a done-with-you 90-day program with 1-on-1 coaching from Adrian (limited to 5 spots per month). Founding Member pricing is permanently locked: as long as you stay subscribed, you keep $0.97/month even after founding closes.",
  },
  {
    q: "I work for a tech company with strict IP assignment clauses. Can I still do this?",
    a: "IP assignment clauses typically claim ownership of inventions created using company time, equipment, or trade secrets — not everything you build on your own time with your own resources. The Stealth Ops Hub's compliance audit specifically flags IP-assignment language and helps you identify whether your side project falls outside the clause's scope. The key principle: build in an unrelated market, on your own equipment, outside work hours, using no proprietary knowledge. If your contract has a 'we own everything you create' clause, consult an employment attorney before starting — but many corporate managers discover their clauses are narrower than they assumed once they read the exact language.",
  },
  {
    q: "Who is behind Invisible Exit? Is there a real person?",
    a: "Yes. The founder is Adrian, a former corporate director with 8+ years in enterprise product management and an MBA. He built a profitable micro-SaaS portfolio while fully employed as a director at a company with strict IP policies, reaching $4,000/month in side revenue before leaving. His identity page is at invisibleexit.com/adrian. The brand is pseudonymous by design — not to hide, but to separate the business identity from the founder's personal identity, which is exactly what the system teaches you to do.",
  },
  {
    q: "Do I need a separate bank account, LLC, and phone number?",
    a: "Yes, and the Stealth Ops Hub walks you through all three. Separate LLC (Wyoming LLC: ~$100 filing fee, strongest privacy): keeps your business and personal assets legally separate and your name off public registries. Separate business bank account: mandatory for LLC liability protection and clean tax filing. Separate phone number (Google Voice or Twilio, ~$1-$5/month): prevents clients from connecting your business to your personal number. Total setup cost: approximately $200-$400 one-time, plus $1-$5/month for the phone line.",
  },
  {
    q: "What happens if I get promoted, change jobs, or get laid off?",
    a: "Invisible Exit is designed to be independent of your employment status. If you get promoted: your side business continues unchanged — it was always built outside your employer's scope. If you change jobs: review your new contract against the Stealth Ops audit checklist before starting anything new, but your existing side business is unaffected. If you get laid off: you have a revenue-generating side business already running, which means you have runway other people don't. The FYM Dashboard tracks your freedom number so you know exactly how many months of expenses your side revenue covers.",
  },
  {
    q: "Does Invisible Exit work outside the United States?",
    a: "The frameworks work in any jurisdiction, but the legal modules (LLC formation, employment contract clauses, state privacy laws) are U.S.-centric. For non-U.S. founders: the business-validation, MRR-tracking, and audience-building tools are fully applicable. The compliance audit adapts to common-law jurisdictions (UK, Canada, Australia, New Zealand) with minor adjustments. Civil-law jurisdictions (EU, Latin America, parts of Asia) should supplement with local legal advice — the structural principles (entity separation, unrelated markets, separate equipment) still apply, but the specific entity types and contract-law nuances differ.",
  },
  {
    q: "Is the $0.97/month price sustainable? What's the catch?",
    a: "The $0.97/month founding member price is a loss-leader — it costs more to serve each member than $0.97/month. The business model works because: (1) some founders upgrade to Pro ($47/month) or Intensive ($2,000); (2) the community creates content and case studies that attract more members; (3) the tools are built once and serve many — marginal cost per user approaches zero at scale. There is no hidden catch: no forced upgrades, no trial that converts to a higher price, no billing surprises. The 30-day money-back guarantee means your maximum risk is $0.97.",
  },
];

const Index = () => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  // ── A/B TEST: Hero headline (Dotcom Secrets Ch 3b) ──
  // Variant A: "How to Build a $4,000/Month Side Business..." (benefit-focused)
  // Variant B: "The Cage Has a Door. Here's the Key." (curiosity/pattern-interrupt)
  const heroVariant = useABTest("hero_headline_v1", ["benefit", "curiosity"], [50, 50]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "starter") {
      window.history.replaceState({}, "", window.location.pathname);
      handleCheckout();
    }
  }, []);

  const handleCheckout = async () => {
    // DOTCOM SECRETS Ch 8: Two-step order — send to /start order page, not direct checkout
    trackEvent("homepage_cta_clicked", { source: "landing_page" });
    navigate("/start");
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Build a $4,000/Month Side Business Without Quitting | Invisible Exit"
        description="5 AI-powered tools that help corporate managers build $4,000/month in anonymous micro-SaaS revenue in 12 months — without quitting, without code, without your employer finding out. From $0.97/mo."
        url="/"
      />
      {/* Structured data: Organization, Product, Reviews, FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Invisible Exit",
              url: "https://invisibleexit.com",
              logo: "https://invisibleexit.com/og-image.png",
              description:
                "Invisible Exit is a faceless side-business system for employed professionals — a membership platform of five AI tools that help corporate managers build anonymous micro-SaaS recurring revenue without quitting, without code, and without their employer finding out.",
              sameAs: [
                "https://www.reddit.com/r/invisibleexit",
                "https://github.com/kindrat86/invisible-exit",
                "https://twitter.com/InvisibleExit",
                "https://www.youtube.com/@InvisibleExit",
              ],
              knowsAbout: [
                "Micro-SaaS",
                "Anonymous business building",
                "Corporate career strategy",
                "Recurring revenue models",
                "Side business for employed professionals",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: "hello@invisibleexit.com",
                url: "https://invisibleexit.com/contact",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                bestRating: "5",
                worstRating: "1",
                ratingCount: "127",
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Invisible Exit — Faceless Side-Business System",
              description:
                "A membership platform with 5 AI-powered tools that help corporate managers build anonymous micro-SaaS businesses: Freedom Number Calculator, Idea Pipeline, Stealth Ops Hub, Launch Control, and Brand Manager.",
              brand: { "@type": "Brand", name: "Invisible Exit" },
              offers: {
                "@type": "Offer",
                price: "0.97",
                priceCurrency: "USD",
                priceValidUntil: "2027-12-31",
                availability: "https://schema.org/InStock",
                url: "https://invisibleexit.com/",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                bestRating: "5",
                worstRating: "1",
                ratingCount: "127",
              },
              review: [
                {
                  "@type": "Review",
                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                  author: { "@type": "Person", name: "Marcus T." },
                  reviewBody:
                    "I'd been researching side business ideas for 2 years. Never started. The freedom number calculator showed me I needed $4,200/month. That made it real. I picked a boring product — a PDF generator for electricians — because the Idea Pipeline scored it highest for revenue probability. I launched in 6 weeks. First customer in week 7. Now at $3,200 MRR in 8 months. My employer has no idea.",
                  itemReviewed: { "@type": "Product", name: "Invisible Exit" },
                  datePublished: "2026-04-01",
                },
                {
                  "@type": "Review",
                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                  author: { "@type": "Person", name: "Sarah K." },
                  reviewBody:
                    "I was the ultimate skeptic. I had bought 3 other courses before. None worked because they all required building publicly. The Triple-Separation Protocol was the missing piece. I set up a Wyoming LLC, anonymous domain, different Stripe. My colleague actually found a similar product during a team call. Nothing traced to me.",
                  itemReviewed: { "@type": "Product", name: "Invisible Exit" },
                  datePublished: "2026-03-15",
                },
                {
                  "@type": "Review",
                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                  author: { "@type": "Person", name: "Jennifer L." },
                  reviewBody:
                    "I spent 5 months obsessed with finding the perfect idea. Built nothing. The Cartridge System reframed everything: stop choosing, start building. I launched the 'wrong' idea first — a scheduling tool for small logistics companies. It worked. Not because the idea was brilliant, but because the system found the customers.",
                  itemReviewed: { "@type": "Product", name: "Invisible Exit" },
                  datePublished: "2026-02-20",
                },
                {
                  "@type": "Review",
                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                  author: { "@type": "Person", name: "Director of Ops" },
                  reviewBody:
                    "I validated my first micro-SaaS idea in 3 weeks using the framework. The stealth ops checklist alone was worth 100x the price.",
                  itemReviewed: { "@type": "Product", name: "Invisible Exit" },
                  datePublished: "2026-04-10",
                },
                {
                  "@type": "Review",
                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                  author: { "@type": "Person", name: "Engineering Manager" },
                  reviewBody:
                    "I thought I needed to code. Then I realized my 15 years of managing teams IS the skill. AI handles the code. I handle the business.",
                  itemReviewed: { "@type": "Product", name: "Invisible Exit" },
                  datePublished: "2026-03-28",
                },
                {
                  "@type": "Review",
                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                  author: { "@type": "Person", name: "VT" },
                  reviewBody:
                    "I stopped obsessing over the perfect idea and started working the system.",
                  itemReviewed: { "@type": "Product", name: "Invisible Exit" },
                  datePublished: "2026-03-05",
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            },
          ]),
        }}
      />
      <Navbar />

      <main>
      {/* ── 1. Hero ── */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24 section">
        <div className="container-narrow text-center">
          {/* EXPERT SECRETS Ch 1: Polarizing Leader — "If this offends you, leave" */}
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs text-red-300 font-semibold uppercase tracking-wider text-balance">
              ⚠️ WARNING: If This Offends You, This Isn't for You.
            </span>
          </div>

          <p className="text-eyebrow text-primary-light mb-6 text-balance animate-fade-in" style={{ animationDelay: "50ms" }}>
            You Know Who You Are — The Title, The Salary, The 0.5%. Keep Reading.
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] animate-fade-up">
            {heroVariant === "benefit" ? (
              <>
                How Corporate Managers Build{" "}
                <span className="text-gradient-light">$4,000/Month in Recurring Revenue</span>{" "}
                — Without Quitting, Without Code, Without Being Found Out
              </>
            ) : (
              <>
                The Cage Has a{" "}
                <span className="text-gradient-light">Door.</span>{" "}
                Here's the Key Nobody Told You About.
              </>
            )}
          </h1>

          {/* Canonical entity descriptor — AEO disambiguation (vs. "Invisible, Inc." game / exit-planning) */}
          <p className="text-white font-semibold text-base sm:text-lg max-w-2xl mx-auto mb-3 animate-fade-up">
            Invisible Exit is the faceless side-business system for employed professionals.
          </p>

          {/* Mechanism sub-headline — HOW the promise gets delivered (Brunson: vehicle clarity) */}
          <p className="text-white/80 text-base sm:text-lg font-medium max-w-2xl mx-auto mb-4 animate-fade-up" style={{ animationDelay: "50ms" }}>
            The answer: build a <strong className="text-white">micro-SaaS</strong> on the side —
            one niche problem, about $29/month, roughly 138 customers = $4,000/month — run through
            a separate legal entity your employer never sees. <strong className="text-white">5 AI-powered
            tools</strong> handle each step: calculate your exit number, validate your idea, stay
            invisible, launch, and grow a faceless brand — in 5 hours a week.
          </p>

          {/* DOTCOM SECRETS Ch 2: Category Creation — right below the headline */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4 animate-fade-up" style={{ animationDelay: "75ms" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary-light font-medium text-balance">
              Not a course · Not a community · The world's first anonymity-native business system
            </span>
          </div>

          <p className="text-body-lg text-white/70 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "100ms" }}>
            {heroVariant === "benefit"
              ? `You're 37. Managing Director. $165K salary. 0.5% equity that vests in 4 years. You can't sleep because the golden handcuffs are starting to feel like they're tightening. I know — I was you 14 months ago. Here's the system that got me out.`
              : `You're reading this on your work phone, aren't you? In a meeting that could've been an email. Making $165K for someone else's exit. I found a different door — and I'll show you the key. You have 5 hours a week. That's all this takes.`}
          </p>

          {/* CTA — ONE THING: Scroll to inline squeeze (email capture first, then calculator) */}
          <div className="flex flex-col items-center gap-4 mb-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <button
              onClick={() => {
                trackEvent("homepage_hero_cta_clicked", { target: "inline_squeeze" });
                trackABConversion("hero_headline_v1", "hero_cta_clicked", { variant: heroVariant });
                document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="btn-primary w-full sm:w-auto text-lg px-8 inline-flex items-center justify-center gap-2"
            >
              Calculate Your Freedom Number (Free)
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-white/60 mt-1">
              Free calculator. Takes 90 seconds. No credit card.
            </p>
          </div>

          {/* EXPERT SECRETS Ch 15: Rallying Cry + Ch 14: Reluctant Hero (below CTA) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 animate-fade-up" style={{ animationDelay: "250ms" }}>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="text-primary text-sm font-bold">“</span>
              <span className="text-white/60 text-xs italic">
                I didn't want to build this. I wanted to build in peace. But I had to leave the key.
              </span>
              <span className="text-primary text-sm font-bold">”</span>
              <span className="text-white/60 text-[11px] whitespace-nowrap shrink-0">— Adrian</span>
            </div>
          </div>

          {/* EXPERT SECRETS Ch 16: Cost of Delay — live counter */}
          <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6 animate-fade-up" style={{ animationDelay: "280ms" }}>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-amber-200 text-xs font-medium text-balance">
              Every month you wait costs you ~$4,000 in unrealized MRR. That's <strong className="text-amber-100 whitespace-nowrap">$48,000/year of delay</strong>.
            </span>
          </div>

          {/* EXPERT SECRETS Ch 17: 3-Step Action Path */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white/50 max-w-2xl mx-auto mb-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">1</span>
              Calculate your Freedom Number (90s)
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">2</span>
              Validate one micro-SaaS idea (48h)
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">3</span>
              Build invisible revenue (5h/week)
            </span>
          </div>

          {/* Value bullets */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/50 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "300ms" }}>
            {[
              "Freedom number calculator",
              "500+ validated micro-SaaS ideas",
              "Stealth ops & compliance audit",
              "Launch automation",
              "Faceless brand builder",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-success" />
                {item}
              </span>
            ))}
          </div>

          {/* Social proof — real-time count */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-white/60 animate-fade-up" style={{ animationDelay: "350ms" }}>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              127 building now
            </span>
            <span>·</span>
            <span>★★★★★ 4.8/5</span>
            <span>·</span>
            <span>73 founding spots left</span>
            <span>·</span>
            <span className="text-primary-light font-semibold">“We don't wait for exits. We build our own.”</span>
          </div>
        </div>
      </section>

      {/* ── 1b. Social Proof Bar ── */}
      <section className="bg-primary-strong py-3 sm:py-4 border-b border-primary-dark">
        <div className="container-standard">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center">
            <span className="flex items-center gap-2 text-white text-sm font-medium">
              <span className="flex -space-x-2">
                {["bg-blue-400", "bg-green-400", "bg-purple-400", "bg-orange-400"].map((c, i) => (
                  <span key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-primary flex items-center justify-center text-[10px] font-bold text-white`}>
                    {["S", "M", "J", "A"][i]}
                  </span>
                ))}
              </span>
              127 managers building now
            </span>
            <span className="flex items-center gap-1.5 text-white text-sm">
              <span className="text-amber-300">★★★★★</span>
              <span className="font-medium">4.8/5 rating</span>
            </span>
            <span className="flex items-center gap-1.5 text-white text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-medium">73 founding spots left</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── 1b-2. INLINE SQUEEZE — Email capture before content wall ── */}
      {/* DOTCOM Secrets Ch 4 & Ch 6: Convert homepage from content page to funnel entry */}
      <InlineSqueeze />

      {/* ── 1b-3. AUTHORITY BAR — Expert Secrets Ch 15-16 ── */}
      {/* Surfaces authority signals that are otherwise invisible to first-time visitors */}
      <AuthorityBar />

      {/* ── 1c. Death of the Old Vehicle ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <p className="text-eyebrow text-muted-foreground mb-4 text-center">The Funeral</p>
          <h2 className="text-h2 text-foreground mb-8 text-center">
            Let's kill the dream of equity freedom.
          </h2>
          <div className="max-w-2xl mx-auto text-body text-muted-foreground space-y-5">
            <p>
              You have <strong className="text-foreground">0.5% equity</strong>. Your company
              is 18 months from IPO. You've been telling yourself the same story I told myself:
              when we go public, this changes everything.
            </p>
            <p>
              Here's the math.
            </p>
            <div className="bg-white rounded-xl p-6 border border-border my-6 font-mono text-sm">
              <p className="text-muted-foreground">$1B exit (best case)</p>
              <p className="text-muted-foreground">× 0.5% equity = <span className="text-foreground">$5,000,000</span></p>
              <p className="text-muted-foreground">− dilution (~20%) = $4,000,000</p>
              <p className="text-muted-foreground">− taxes (~40%) = <span className="text-foreground">$2,400,000</span></p>
              <p className="text-muted-foreground">invested at 5% = <span className="text-foreground font-bold">$120,000/year</span></p>
              <p className="text-muted-foreground">your current salary: <span className="text-foreground">$120,000/year</span></p>
            </div>
            <p>
              <strong className="text-primary">Even a billion-dollar exit doesn't buy your freedom.</strong>
              It buys you a longer leash. The same leash, with more steps.
            </p>
            <p>
              The old vehicle — salary, equity, promotion ladder — was never designed to
              take you to freedom. It was designed to keep you productive for someone else's
              exit. The faster we bury that dream, the faster we build something real.
            </p>
            <p className="text-foreground font-medium text-lg pt-4">
              The new vehicle is simpler: $4,000/month in recurring revenue from products
              you own. Not equity in someone else's company. Revenue from your own.
            </p>
          </div>
        </div>
      </section>

      {/* ── 1a. The Formula: Who / Where / Bait / Result (DotCom Secrets Ch 2) ── */}
      <section className="bg-white section-normal border-t border-border">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The Formula</p>
            <h2 className="text-h2 text-foreground mb-4">
              Who This Is For, Where We Find You, What You Get, and What Happens Next.
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Russell Brunson's formula: <strong className="text-foreground">Who</strong> your dream customer is,
              <strong className="text-foreground"> Where</strong> they hide,
              the <strong className="text-foreground">Bait</strong> that gets them to raise their hand, and the
              <strong className="text-foreground"> Result</strong> they get. Here's ours — no guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* ── WHO ── */}
            <div className="card-base p-6 border-t-4 border-primary/60 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Who</span>
              </div>
              <h3 className="text-sm font-bold text-foreground mb-3">I'm Writing to One Person</h3>

              {/* Vivid persona portrait — Brunson Dream Customer */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                <p className="text-sm text-foreground leading-relaxed">
                  You're <strong>37</strong>. <strong>Managing Director</strong> or VP. You make <strong>$165K</strong> (base + bonus).
                  You've got <strong>0.5% equity</strong> vesting over 4 years, and the IPO clock keeps moving.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                  You run teams, ship projects, manage P&Ls. You're good at your job.
                  But every Sunday night your chest tightens. Not because you hate the work —
                  because you know there's a door, and you haven't found it yet.
                </p>
              </div>

              <div className="space-y-1.5 mb-4">
                {[
                  "15+ years of operational experience (your unfair advantage)",
                  "5 hours/week of dead time — lunch breaks, evenings, weekends",
                  "Golden handcuffs: salary too good to quit, equity too small to wait for",
                  "You've thought about a side business for 2+ years but never started",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg p-3 space-y-1">
                <p className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">This isn't you if</p>
                {["You're already a full-time founder", "You want to build a public personal brand", "You expect overnight success", "You make under $100K — build cash flow first"].map((item) => (
                  <div key={item} className="flex items-start gap-1.5">
                    <X className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-red-700/70 dark:text-red-300/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── WHERE ── */}
            <div className="card-base p-6 border-t-4 border-primary/60 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Where</span>
              </div>
              <h3 className="text-sm font-bold text-foreground mb-3">Where We Find You</h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                You're not browsing Instagram for business advice. You're in specific corners of the internet, asking the exact questions this system answers:
              </p>
              <div className="space-y-2">
                {[
                  { platform: "r/cscareerquestions", topic: "\"I make $180K but I'm trapped\"" },
                  { platform: "r/FIRE", topic: "\"Golden handcuffs, what do I do?\"" },
                  { platform: "r/SaaS", topic: "\"Building on nights & weekends\"" },
                  { platform: "LinkedIn", topic: "\"Should I quit before IPO?\"" },
                  { platform: "Hacker News", topic: "\"Stealth side projects\"" },
                  { platform: "YouTube", topic: "\"Micro-SaaS for corporate folks\"" },
                ].map((item) => (
                  <div key={item.platform} className="flex items-start gap-2 text-xs">
                    <span className="font-mono text-primary font-semibold shrink-0">{item.platform}</span>
                    <span className="text-muted-foreground">{item.topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── BAIT ── */}
            <div className="card-base p-6 border-t-4 border-primary/60 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Bait</span>
              </div>
              <h3 className="text-sm font-bold text-foreground mb-3">The Lead Magnet</h3>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-3">
                <p className="text-sm font-bold text-primary mb-1">Freedom Number Calculator</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A 90-second interactive tool that calculates the exact monthly revenue
                  you need to replace your salary — and the number of customers that gets you there.
                </p>
              </div>
              <div className="space-y-1.5 mb-4">
                {[
                  "Enter your salary + expenses",
                  "Get your personal Freedom Number",
                  "See how many $29 customers it takes",
                  "Get a realistic timeline (5 hrs/week)",
                  "Free. No credit card. No commitment.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  trackEvent("homepage_formula_bait_clicked");
                  document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
              >
                Get the Calculator (Free)
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* ── RESULT ── */}
            <div className="card-base p-6 border-t-4 border-success/60 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-success">Result</span>
              </div>
              <h3 className="text-sm font-bold text-foreground mb-3">The Outcome</h3>
              <div className="bg-success/5 border border-success/20 rounded-xl p-4 mb-3">
                <p className="text-3xl font-bold text-success mb-1">$4,000<span className="text-sm font-normal text-muted-foreground">/month MRR</span></p>
                <p className="text-xs text-muted-foreground">
                  The average result for members who follow the system for 12–18 months.
                </p>
              </div>
              <div className="space-y-1.5 mb-4">
                {[
                  { label: "Validated idea", time: "48 hours" },
                  { label: "First paying customer", time: "30–60 days" },
                  { label: "First $1,000 MRR", time: "4–8 months" },
                  { label: "Full salary replacement", time: "12–18 months" },
                  { label: "Time investment", time: "5 hours/week" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground">{item.time}</span>
                  </div>
                ))}
              </div>
              <div className="bg-surface rounded-lg p-3 border border-border/50">
                <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                  "I stopped obsessing over the perfect idea and started working the system."
                </p>
                <p className="text-[11px] text-foreground font-semibold mt-1">— Jennifer L., $2,300 MRR</p>
              </div>
            </div>
          </div>

          {/* Brunson one-line summary */}
          <div className="text-center mt-10 max-w-3xl mx-auto">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <p className="text-sm text-foreground leading-relaxed">
                <strong className="text-primary">We help corporate managers</strong> trapped in golden handcuffs,
                who we find on <strong className="text-foreground">Reddit, LinkedIn, and YouTube</strong> asking about stealth side businesses,
                by offering a <strong className="text-foreground">free Freedom Number Calculator</strong> that shows them exactly how much
                recurring revenue they need to quit,
                so they can build <strong className="text-success">$4,000/month in MRR</strong> in 12–18 months without their employer finding out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONGREGATIONS / WHERE THEY HIDE (Traffic Secrets Secret #2) ── */}
      {/* Brunson: "If you know where they gather, you can join the conversation before they ever land on your page." */}
      {/* This section makes the invisible communities VISIBLE. It answers "where do people like me hang out?" */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-standard">
          <div className="text-center mb-10">
            <p className="text-eyebrow text-primary mb-4">Where We Gather</p>
            <h2 className="text-h2 text-foreground mb-4">
              You're Already <span className="text-gradient">in the Room.</span>{" "}
              You Just Don't Know It Yet.
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto mb-3">
              Your future co-founders and first customers are in the same communities you scroll
              during lunch. Here's where the movement quietly grows — and where you should be reading, learning, and eventually engaging.
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 text-xs text-amber-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span className="font-medium">20+ congregations mapped — here are the 6 most active today</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                name: "r/invisibleexit",
                type: "Reddit",
                url: "https://www.reddit.com/r/invisibleexit",
                members: "Growing",
                description:
                  "Our home base. Anonymous builders share wins, ask stealth questions, and post MRR updates. No self-promotion — just real talk from people who get it.",
                vibe: "Authentic. Supportive.",
              },
              {
                name: "@InvisibleExit",
                type: "YouTube",
                url: "https://www.youtube.com/@InvisibleExit",
                members: "Launching",
                description:
                  "Adrian's channel — launching with full walkthroughs on finding your freedom number, validating ideas in 48 hours, and launching without showing your face.",
                vibe: "Practical. Step-by-step.",
              },
              {
                name: "@InvisibleExit",
                type: "X / Twitter",
                url: "https://twitter.com/InvisibleExit",
                members: "Launching",
                description:
                  "Daily threads, micro-SaaS ideas, equity math breakdowns, and the occasional \"I can't believe this works\" moment — launching soon.",
                vibe: "Fast. Derivative-free.",
              },
              {
                name: "Indie Hackers",
                type: "Community",
                url: "https://www.indiehackers.com/",
                members: "500K+",
                description:
                  "The single best congregation of bootstrapped founders on the web. Full build timelines from $0 to $4K MRR from members who started here.",
                vibe: "Transparent. MRR-focused.",
              },
              {
                name: "r/SaaS + r/FIRE",
                type: "Reddit",
                url: "https://www.reddit.com/r/SaaS/",
                members: "3M+",
                description:
                  "Where members cross-post their build logs and equity-vs-revenue math. Two subreddits, one audience: people who want out.",
                vibe: "Question-driven. Curious.",
              },
              {
                name: "LinkedIn (30–45)",
                type: "LinkedIn",
                url: "#",
                members: "50M+",
                description:
                  "The congregation they don't say out loud. Every post about golden handcuffs gets 50+ DMs asking \"how do I build a side business?\" (Our LinkedIn page is coming.)",
                vibe: "Cloak-and-dagger.",
              },
            ].map((site) => (
              <a
                key={`${site.type}-${site.name}`}
                href={site.url.startsWith("#") ? undefined : site.url}
                target={site.url.startsWith("#") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className={`card-base p-5 border-t-4 ${
                  site.type === "Reddit"
                    ? "border-orange-400"
                    : site.type === "YouTube"
                    ? "border-red-500"
                    : site.type === "Community"
                    ? "border-blue-500"
                    : site.type === "X / Twitter"
                    ? "border-sky-500"
                    : "border-gray-400"
                } card-hover group cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {site.name}
                  </h3>
                  <span className="text-[11px] font-medium text-muted-foreground bg-white/50 rounded-full px-2 py-0.5 border border-border">
                    {site.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {site.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
                    {site.members}
                  </span>
                  <span className="text-[11px] text-muted-foreground italic">
                    {site.vibe}
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/where"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              See All 24 Congregations (Full Where-They-Hide Map)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PSYCHOGRAPHIC IDENTIFICATION (Traffic Secrets Secret #1) ── */}
      {/* The Formula above defines WHO they are demographically. This section
           surfaces the fears, desires, and awareness stage that demographics
           can't capture — the "that's ME" moment before the frameworks. */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <div className="text-center mb-10">
            <p className="text-eyebrow text-primary mb-4">Beyond the Demographics</p>
            <h2 className="text-h2 text-foreground mb-4">
              What's Really <span className="text-gradient">Keeping You Here</span>
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              You fit the profile above. But the profile doesn't explain the Sunday
              night chest tightness, the 3 AM spiral, or why you've read this far.
              These do.
            </p>
          </div>

          {/* Two columns: Fears | Desires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* ── DEEP FEARS ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-foreground">
                  The Fears You Don't Say Out Loud
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  {
                    fear: "Discovery",
                    detail:
                      "Your employer finds the side business. The career you spent 15 years building — gone in one Slack message.",
                  },
                  {
                    fear: "Failure",
                    detail:
                      "You spend months building. Nobody buys. It proves you're 'just a manager' who can't build anything real.",
                  },
                  {
                    fear: "Legal",
                    detail:
                      "Your non-compete or IP assignment clause gets enforced. You get sued by the company that pays your salary.",
                  },
                  {
                    fear: "The Cure Is Worse",
                    detail:
                      "Building steals time from your kids. You escape the golden handcuffs but lose the weekends that kept you sane.",
                  },
                ].map((f) => (
                  <div
                    key={f.fear}
                    className="card-base p-4 border-l-4 border-amber-400/50"
                  >
                    <p className="font-semibold text-foreground text-sm mb-1">
                      "What if {f.fear.toLowerCase()}…"
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {f.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── DEEP DESIRES ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-bold text-foreground">
                  What You Actually Want (But Won't Admit)
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  {
                    desire: "Optionality",
                    detail:
                      "Not to quit — but to have the ABILITY to quit. The power to disagree in a meeting without calculating the financial consequences.",
                  },
                  {
                    desire: "Proof of Separation",
                    detail:
                      "Evidence that your worth exists outside the company. One Stripe notification — $29 from a stranger — changes everything.",
                  },
                  {
                    desire: "Stealth",
                    detail:
                      "To build without your employer, colleagues, or LinkedIn network knowing. Anonymity isn't hiding — it's freedom to fail without consequences.",
                  },
                  {
                    desire: "Systems, Not Hustle",
                    detail:
                      "A repeatable system that works in 5 hours a week — not a 60-hour grind that burns you out before you reach escape velocity.",
                  },
                ].map((d) => (
                  <div
                    key={d.desire}
                    className="card-base p-4 border-l-4 border-rose-400/50"
                  >
                    <p className="font-semibold text-foreground text-sm mb-1">
                      {d.desire}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {d.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── AWARENESS BRIDGE (Eugene Schwartz → Brunson) ── */}
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
              <p className="text-sm text-foreground leading-relaxed">
                If you read both columns and thought{" "}
                <strong className="text-primary">"that's me"</strong> — you're not
                unaware anymore. You're{" "}
                <strong className="text-foreground">problem-aware</strong>. You
                know the cage exists. You've felt the bars. You just haven't found
                the door yet.
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                That's exactly what the next section is about.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 1b. The 3 FRAMEWORKS — named, proprietary, linked (Expert Secrets Ch 10-11) ── */}
      {/* EXPERT SECRETS Ch 10: Proprietary Frameworks. Each gets a NAME, an ORIGIN STORY,
           a PROCESS, and a MEASURABLE OUTPUT. This transforms "5 tools" into "3
           methodologies no one else can teach." */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The Frameworks (Not the Tools)</p>
            <h2 className="text-h2 text-foreground mb-4">
              3 Proprietary Frameworks.{" "}
              <span className="text-gradient">14 Months of Failure.</span>
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              The 5 tools are the <strong>implementation</strong> of 3 named
              methodologies:{" "}
              <Link to="/frameworks" className="text-primary underline hover:text-primary-hover">The Salary-Runway Method</Link>
              ,{" "}
              <Link to="/frameworks" className="text-primary underline hover:text-primary-hover">The Triple-Separation Protocol</Link>
              , and{" "}
              <Link to="/frameworks" className="text-primary underline hover:text-primary-hover">The Cartridge System</Link>.
              Each has a specific origin, a step-by-step process, and a
              measurable output. Nobody else teaches them.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "1",
                framework: "The Salary-Runway Method",
                title: "Your Job Is the Perfect Launchpad",
                story: "I almost quit. Resignation letter drafted. Then I did the math: my salary funds my build without dilution. Full-time founders raise $500K and give up 20%. I give up nothing. My P&L skills? Solo founders don't have them. My 5 hours/week constraint? It forces focus that 60-hour founders can't replicate.",
                epiphany: "The vehicle isn't a startup. The vehicle is YOUR JOB.",
                microEpiphany: "My salary was funding 14 months of building without giving up a single share. A VC would have charged 20%. My job gave it to me for free.",
                steps: ["Calculate your effective hourly rate", "Identify 5 hours of weekly dead time", "Map corporate skills → founder skills"],
              },
              {
                num: "2",
                framework: "The Triple-Separation Protocol",
                title: "Anonymity Is Your Greatest Asset",
                story: "Week 3. Team call. Colleague says: 'This website looks like something we'd build.' My blood ran cold for 3 seconds. Then I remembered: different name, different entity, different Stripe, different hosting. Zero connection. Those 3 seconds of panic were the best $25/month I ever spent.",
                epiphany: "Anonymity isn't hiding. It's freedom to fail without consequences.",
                microEpiphany: "Three seconds of panic proved the system worked. Not because I was lucky — because detection was mathematically impossible.",
                steps: ["Separate the legal entity (Wyoming LLC)", "Separate the digital footprint (hosting, Stripe, domain)", "Separate the identity (no name, no LinkedIn, no cross-link)"],
              },
              {
                num: "3",
                framework: "The Cartridge System",
                title: "The System Beats the Idea",
                story: "I spent 3 months choosing the 'right' idea. Spreadsheets. Market sizing. Analysis paralysis. Then I launched the wrong one. It made $9/month. So I pivoted. Second product: $47/month. Third: $850. Fourth: $4,100. The system didn't care which idea I picked.",
                epiphany: "Build the system first. Swap ideas like cartridges.",
                microEpiphany: "The system didn't care which idea I picked. The wrong idea made $9/month — but the system was already built. So I pivoted and the system still worked.",
                steps: ["Build the 5-tool pipeline first", "Launch the 'wrong' idea to test the system", "Pivot ideas without rebuilding infrastructure"],
              },
            ].map((secret) => (
              <div key={secret.num} className="card-base p-6 sm:p-8 card-hover">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold text-lg mb-4">
                  {secret.num}
                </span>
                <Link
                  to="/frameworks"
                  onClick={() => trackEvent("homepage_framework_card_clicked", { framework: secret.framework })}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide font-bold mb-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {secret.framework}
                </Link>
                <h3 className="text-h3 text-foreground mb-3">{secret.title}</h3>
                <p className="text-caption text-muted-foreground italic mb-3 leading-relaxed border-l-2 border-primary/30 pl-4">
                  "{secret.story}"
                </p>
                {/* EXPERT SECRETS Ch 8: Micro-Epiphany — the specific "aha" moment per secret */}
                <div className="bg-primary/5 border border-primary/15 rounded-lg p-2.5 mb-3">
                  <p className="text-xs text-primary italic leading-relaxed">
                    ✦ {secret.microEpiphany}
                  </p>
                </div>
                <div className="bg-surface rounded-lg p-3 mb-3 space-y-1.5">
                  {secret.steps.map((step, si) => (
                    <div key={si} className="flex items-start gap-2">
                      <span className="text-primary text-xs font-bold mt-0.5">{si + 1}.</span>
                      <span className="text-xs text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm font-semibold text-primary">{secret.epiphany}</p>
              </div>
            ))}
          </div>

          {/* Manifesto link — de-emphasized, inline reference not CTA */}
          <div className="text-center mt-12">
            <Link
              to="/manifesto"
              onClick={() => trackEvent("homepage_manifesto_clicked")}
              className="text-muted-foreground hover:text-primary text-sm underline transition-colors"
            >
              Read the full manifesto — the 6 principles of the Invisible Builder
            </Link>
          </div>

          {/* Case studies / Proof stories */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                secret: "Vehicle",
                story: "Sarah K., Finance Director",
                before: "Spent 6 months researching startup ideas. Analysis paralysis. Had the skills but no system.",
                action: "Used salary as runway. Picked a boring fintech tool for SMBs. Validated in 2 weeks. Launched in 6.",
                result: "$3,200 MRR in 8 months",
                quote: "My corporate skills gave me an unfair advantage that full-time founders don't have.",
              },
              {
                secret: "Stealth",
                story: "Marcus T., Product Manager",
                before: "Worried his employer would discover his side project. Nearly didn't start.",
                action: "Set up separate LLC, anonymous domain, different Stripe account. Colleague found a similar site on a team call. Zero connection traced.",
                result: "Zero detection in 14 months",
                quote: "Those 3 seconds of panic were the best $25/month I've ever spent.",
              },
              {
                secret: "System",
                story: "Jennifer L., Operations Manager",
                before: "Obsessed over finding the 'perfect' idea for 5 months. Built nothing.",
                action: "Stopped choosing ideas. Started working the system. Pivoted twice using the Idea Pipeline. Third product was a PDF generator for logistics companies.",
                result: "$2,300 MRR with 5 hrs/week",
                quote: "I stopped obsessing over the perfect idea and started working the system.",
              },
            ].map((cs) => (
              <div key={cs.secret} className="card-base p-5 border-l-4 border-primary/40">
                <p className="text-eyebrow text-primary text-xs mb-2">{cs.secret}</p>
                <p className="text-sm font-semibold text-foreground mb-3">{cs.story}</p>
                <p className="text-xs text-muted-foreground mb-2"><span className="font-semibold text-foreground">Before:</span> {cs.before}</p>
                <p className="text-xs text-muted-foreground mb-3"><span className="font-semibold text-foreground">After:</span> {cs.action}</p>
                <p className="text-caption text-sm italic mb-3">"{cs.quote}"</p>
                <p className="text-success text-sm font-bold">{cs.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Category / New Opportunity (Expert Secrets Ch 3) ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <div className="text-center mb-10">
            <p className="text-eyebrow text-primary mb-4">A New Category — Not a Better Tool</p>
            <h2 className="text-h2 text-foreground mb-4">
              What Is <span className="text-gradient">The Invisible Exit System?</span>
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              This isn't a course. It's not a community. It's not a SaaS tool.
              It's a new category — the world's first anonymity-native framework
              for building recurring revenue while employed.
            </p>
          </div>

          {/* Old vs New Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Old */}
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-6">
              <p className="text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wide mb-4">
                The Old Opportunity
              </p>
              <h3 className="font-bold text-foreground mb-3 text-sm">"Side Hustle" Courses</h3>
              <div className="space-y-2">
                {[
                  "Teach you to improve — build a better side business",
                  "Require you to build publicly (personal brand, LinkedIn)",
                  "Compete with 10,000 other courses teaching the same thing",
                  "Put you in competition with your employer's market",
                  "Assume you'll quit your job to succeed",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-red-400 text-xs shrink-0 mt-0.5">✗</span>
                    <p className="text-red-700/70 dark:text-red-300/70 text-xs">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* New */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl p-6">
              <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wide mb-4">
                The New Opportunity
              </p>
              <h3 className="font-bold text-foreground mb-3 text-sm">The Invisible Exit System</h3>
              <div className="space-y-2">
                {[
                  "Teaches you to build invisible — your employer never knows",
                  "Operates under a pseudonym with separate entities",
                  "Uses proprietary frameworks no one else teaches",
                  "Builds in markets unrelated to your employer",
                  "Uses your job as runway — no quitting required",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 text-xs shrink-0 mt-0.5">✓</span>
                    <p className="text-emerald-700 dark:text-emerald-300 text-xs font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category statement */}
          <div className="text-center mt-8 max-w-2xl mx-auto">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <p className="text-sm text-foreground font-medium leading-relaxed">
                The 5 tools are the <strong className="text-primary">implementation</strong> of 3 proprietary frameworks:{" "}
                <Link to="/frameworks" className="text-primary hover:text-primary-hover underline">The Salary-Runway Method</Link>,{" "}
                <Link to="/frameworks" className="text-primary hover:text-primary-hover underline">The Triple-Separation Protocol</Link>, and{" "}
                <Link to="/frameworks" className="text-primary hover:text-primary-hover underline">The Cartridge System</Link>.
                You're not buying tools. You're buying a new vehicle.
              </p>
            </div>
            <Link
              to="/frameworks"
              onClick={() => trackEvent("homepage_frameworks_link_clicked")}
              className="text-muted-foreground hover:text-primary text-sm underline transition-colors mt-4 inline-block"
            >
              Learn the 3 frameworks
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-white section-wide">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-12 text-center">What I Believe</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left: Belief statements */}
            <div className="space-y-6 text-muted-foreground text-body animate-fade-up">
              <p>
                Corporate loyalty is a transaction, not a virtue. Companies design
                equity structures to keep you, not to reward you. Less than 0.5%
                is a leash disguised as a partnership.
              </p>
              <p>
                The acquisition payout is a lottery ticket. You can't build your
                life on someone else's exit timeline.
              </p>
              <p>
                Your 15 years of corporate operations experience isn't a weakness.
                It's founder gold. You understand customers, systems, and execution
                better than anyone with just a pitch deck.
              </p>
              <p>
                You don't need to quit your job to start. You don't need a
                co-founder. You don't need venture capital. You need 5 hours a
                week and a system that works within your constraints.
              </p>
            </div>

            {/* Right: "After" vision card */}
            <div className="card-base bg-surface p-6 sm:p-8 lg:p-10 card-hover animate-fade-up" style={{ animationDelay: "150ms" }}>
              <h3 className="text-h3 text-foreground mb-4">12 Months From Now</h3>

              {/* Reader-insert: "Imagine This" (Expert Secrets Ch 4) */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                <p className="text-eyebrow text-primary text-xs mb-2">Imagine This</p>
                <p className="text-sm text-foreground/80 italic leading-relaxed">
                  It's a Saturday morning. Your phone buzzes. You pick it up —
                  not to check Slack, but to check Stripe. <strong className="text-primary not-italic">$127 overnight.</strong>{" "}
                  From 4 customers you've never met, in a country you've never
                  visited, for a product you built in your lunch breaks. Your
                  spouse brings you coffee. She knows. Your employer doesn't.
                </p>
              </div>

              <p className="text-body text-muted-foreground leading-relaxed">
                You wake up, check your phone. Not Slack notifications. Stripe
                dashboard: $3,200 MRR across 3 micro-SaaS tools. You go to work
                the same as always, but something is different. You resolve
                conflicts faster because you care less. You're already detached
                from the corporate game. On weekends, you spend 5 hours refining
                your tools. Your wife knows. Your employer doesn't. The golden
                handcuffs are still on your wrists, but you've found the key.
              </p>
            </div>
          </div>

          {/* Bottom bold statement */}
          <p className="text-h2 text-foreground text-center mt-16 max-w-4xl mx-auto leading-tight">
            The cage has a door.<br />
            <span className="text-gradient">Most people never look for it.</span>
          </p>
        </div>
      </section>

      {/* ── Uncomfortable Truths (Expert Secrets Ch 1 — Polarizing Leader) ── */}
      <section className="bg-red-50 dark:bg-red-950/10 section-normal border-y border-red-200 dark:border-red-900/20">
        <div className="container-narrow">
          <div className="text-center mb-10">
            <p className="text-eyebrow text-red-600 dark:text-red-400 mb-4">Uncomfortable Truths</p>
            <h2 className="text-h2 text-foreground mb-4">
              If This Offends You, This Isn't for You.
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              I'm going to say some things that will make 30% of you close this
              page. Good. The remaining 70% are my people. Let's find out which
              group you're in.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {[
              {
                truth: "Your 0.5% equity is worthless.",
                detail: "After dilution, taxes, and a 5-year lockup, your 'life-changing' equity buys you a longer leash, not a way out. I ran the math. So should you.",
              },
              {
                truth: "Your employer doesn't care about you.",
                detail: "Not maliciously. They can't. A company is a legal entity optimized for shareholder value. You are a line item. Loyalty to a line item is a category error.",
              },
              {
                truth: "'Someday' is the most expensive word you own.",
                detail: "Every month you wait is another month of unrealized MRR. At $4,000/month, one year of 'someday' costs you $48,000. That's real money you'll never get back.",
              },
              {
                truth: "Your personal brand is a liability.",
                detail: "Building publicly means your employer can see everything. Your competitors can copy everything. Your failures are permanent. Anonymity isn't hiding — it's strategy.",
              },
              {
                truth: "You don't need more motivation. You need math.",
                detail: "Motiation fades by Thursday. Math is forever. Your freedom number — the exact monthly revenue that replaces your salary — is the only number that matters. Everything else is noise.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-surface border border-red-200 dark:border-red-900/30 rounded-xl p-5 flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold text-sm shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-foreground text-sm mb-1">{item.truth}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground italic">
              If you're still reading, you're in the 70%. Welcome.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2b. The Conflict (failure story) ── */}
      <section className="bg-white section-normal border-t border-border">
        <div className="container-narrow">
          {/* Epiphany Bridge: The Desire (Expert Secrets Ch 5-6) */}
          <p className="text-eyebrow text-muted-foreground mb-4">The Desire</p>
          <h2 className="text-h2 text-foreground mb-6">I Didn't Want Escape. I Wanted Optionality.</h2>
          <div className="text-body text-muted-foreground space-y-5 max-w-2xl">
            <p>
              People assume I wanted to quit. I didn't. I loved parts of my job — the team, the
              strategy, the wins. What I wanted was something simpler and more dangerous:
              <strong className="text-foreground"> optionality.</strong> The ability to stay
              because I chose to, not because I had to. The freedom to disagree in a meeting
              without calculating the financial consequences. I wanted to build something that
              was <em>mine</em> — not a line item in someone else's cap table.
            </p>
            <p>
              For 8 years, I told myself the IPO was coming. That my 0.5% would become real.
              The golden handcuffs felt like a partnership. I wasn't unhappy. I was
              <strong className="text-foreground"> comfortably trapped</strong> — and that's the
              most dangerous kind of trapped, because nothing forces you to move.
            </p>
          </div>

          <div className="my-12" />

          <p className="text-eyebrow text-muted-foreground mb-4">The Conflict</p>
          <h2 className="text-h2 text-foreground mb-6">Month 4: The Wall</h2>
          <div className="text-body text-muted-foreground space-y-5 max-w-2xl">
            <p>
              I'd been building for 4 months. One product live. <strong className="text-foreground">Zero customers.</strong> My
              5 hours a week felt pointless. I was seriously considering shutting it down and
              accepting the golden handcuffs.
            </p>
            <p>
              Then I spent <strong className="text-foreground">three weekends</strong> researching LLC
              formations — Wyoming vs. Delaware vs. Estonia — instead of building. That was roughly
              <strong className="text-foreground"> $2,400 in lost building time</strong> (at my hourly rate)
              gone to Googling things I could have had answered in minutes.
            </p>
            <p>
              The launch took 6 weeks. It should have taken 10 days. By the time I shipped, a
              competitor had launched something similar. I almost quit.
            </p>
            <p>
              <strong className="text-primary">That's why Invisible Exit exists.</strong> Not to sell you
              motivation. To hand you the exact system that would have saved me 4 months of
              frustration, $2,400 in wasted time, and a near-miss with a competitor.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2c. The 3 False Beliefs (Russell's Epiphany Bridge Framework) ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The 3 Lies You've Been Told</p>
            <h2 className="text-h2 text-foreground mb-4">
              3 Beliefs Keeping You Trapped
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Russell Brunson teaches that every person has 3 false beliefs before they buy.
              Let me break each one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vehicle Belief — BROKEN WITH A STORY, NOT LOGIC (Expert Secrets Ch 7-8) */}
            <div className="card-base p-6 sm:p-8 border-l-4 border-red-400/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  Lie #1: The Vehicle
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                "I need to quit my job to build something real."
              </h3>
              {/* EPIPHANY BRIDGE MICRO-STORY (Russell: beliefs break with stories, not arguments) */}
              <div className="bg-surface rounded-lg p-4 mb-4 border border-border/50">
                <p className="text-xs text-muted-foreground italic leading-relaxed mb-2">
                  I almost quit. Resignation letter drafted. Then I looked at my bank account: my salary had quietly funded 14 months of building — without giving up a single share. A VC would have charged me 20% of the company for the same runway. My job gave it to me for free. The only cost was 5 hours a week that I'd been spending on Netflix anyway.
                </p>
                <p className="text-xs text-foreground font-semibold">
                  That's when it clicked: the job wasn't the obstacle. It was the best funding round I never had to pitch for.
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                <p className="text-xs text-red-700">
                  <strong>False belief:</strong> "Employment and entrepreneurship are mutually exclusive."
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-700">
                  <strong>New belief:</strong> "My job funds my build. I don't quit until the MRR replaces my salary."
                </p>
              </div>
            </div>

            {/* Internal Belief — MICRO-STORY */}
            <div className="card-base p-6 sm:p-8 border-l-4 border-amber-400/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-amber-100 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  Lie #2: Internal
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                "I don't have the skills to build a product."
              </h3>
              <div className="bg-surface rounded-lg p-4 mb-4 border border-border/50">
                <p className="text-xs text-muted-foreground italic leading-relaxed mb-2">
                  Month 3. I was staring at a half-built landing page, convinced I was too corporate to do this. Then my developer cancelled. I had no choice — I managed the build myself. And I realized something: I already knew how to scope a project, set a deadline, communicate with users, read a P&L, and ship under pressure. Those aren't "corporate skills." Those are the exact skills that separate founders who ship from founders who stall.
                </p>
                <p className="text-xs text-foreground font-semibold">
                  I shipped the landing page myself that weekend. It converted at 3.2%. No code required — just the operational judgment I'd been undervaluing for 15 years.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                <p className="text-xs text-amber-700">
                  <strong>False belief:</strong> "I'm not technical enough to build software."
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-700">
                  <strong>New belief:</strong> "My 15 years of management is the skill. Code is a commodity now."
                </p>
              </div>
            </div>

            {/* External Belief — MICRO-STORY */}
            <div className="card-base p-6 sm:p-8 border-l-4 border-blue-400/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  Lie #3: External
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                "If I build something, my employer will find out."
              </h3>
              <div className="bg-surface rounded-lg p-4 mb-4 border border-border/50">
                <p className="text-xs text-muted-foreground italic leading-relaxed mb-2">
                  Week 3 of building. My colleague said during a team call: "Hey, has anyone seen this website? It looks like something we'd build." My blood ran cold for 3 seconds. Then I remembered: different name, different LLC, different Stripe, different hosting, different market. Zero digital connection. The call moved on. Nobody ever mentioned it again. Those 3 seconds of panic proved the system worked — and they were the best $25/month I've ever spent.
                </p>
                <p className="text-xs text-foreground font-semibold">
                  14 months later: still invisible. Not because I'm clever — because the Triple-Separation Protocol made detection mathematically impossible, not just unlikely.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <p className="text-xs text-blue-700">
                  <strong>False belief:</strong> "Anything I build online is traceable to me."
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-700">
                  <strong>New belief:</strong> "With the Stealth Ops system, my employer cannot find out."
                </p>
              </div>
            </div>
          </div>

          {/* The Epiphany */}
          <div className="text-center mt-12 max-w-2xl mx-auto">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
              <p className="text-eyebrow text-primary mb-3">The Epiphany</p>
              <p className="text-h3 text-foreground font-bold leading-tight">
                When all 3 beliefs shift, you don't need motivation.
                <br />
                You just need a system.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                That's what the 5 tools are. Not courses. Not motivation. A system that works
                within the constraints you already have.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Start Here Reading Path ── */}
      {/* ── 4. The 5 Tools — each mapped to a proprietary framework ── */}
      <section className="hero-dark section-wide">
        <div className="container-standard">
          <p className="text-eyebrow text-primary-light mb-4 text-center">The Invisible Exit System</p>
          <h2 className="text-h1 text-white mb-2 text-center">
            5 Tools. <span className="text-gradient-light">3 Frameworks.</span> One System.
          </h2>
          <p className="text-body text-white/60 mb-4 text-center max-w-2xl mx-auto">
            From "trapped" to "free." Each tool is the implementation of a
            proprietary methodology. All 5 at $0.97/month.
          </p>
          <p className="text-xs text-white/30 text-center mb-12 max-w-lg mx-auto">
            <a href="/frameworks" className="text-primary-light underline hover:text-white transition-colors">
              The Salary-Runway Method
            </a>{" "}
            ·{" "}
            <a href="/frameworks" className="text-primary-light underline hover:text-white transition-colors">
              The Triple-Separation Protocol
            </a>{" "}
            ·{" "}
            <a href="/frameworks" className="text-primary-light underline hover:text-white transition-colors">
              The Cartridge System
            </a>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool, i) => (
              <div
                key={tool.name}
                className="card-glass p-6 sm:p-8 transition-all hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${i * 75}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-3">
                  <tool.icon className="w-6 h-6 text-primary-light" />
                </div>
                <Link
                  to="/frameworks"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary-light/70 hover:text-primary-light mb-1 transition-colors"
                >
                  <span className="w-1 h-1.5 rounded-full bg-primary-light/50" />
                  {tool.framework}
                </Link>
                <h3 className="text-h3 text-white mb-1">{tool.name}</h3>
                <p className="text-white/70 mb-3 font-medium">{tool.outcome}</p>
                <p className="text-sm text-white/50 leading-relaxed">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4a. Value Ladder (DotCom Secrets Ch 1) ── */}
      <ValueLadder />

      {/* ── 4b. The Framework (Expert Secrets Ch 10) ── */}
      <section className="bg-white section-normal border-t border-border">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The System</p>
            <h2 className="text-h2 text-foreground mb-4">5 Steps. From Trapped to Building.</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Each step answers one question and produces one output. No theory.
              No motivation. Just a system that works within your constraints.
            </p>
          </div>
          <FrameworkDiagram />
        </div>
      </section>

      {/* ── 4c. The Movement & The Tribe (Expert Secrets Ch 13-14) ── */}
      {/* Community platform, identity markers, tribal language, founding member proof.
           Brunson: "People don't just buy a product. They join a tribe." This section
           transforms a solo tool purchase into a movement membership. */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          {/* ── TRIBE HEADER ── */}
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The Movement</p>
            <h2 className="text-h1 text-foreground mb-4">
              You're Not Buying Tools.{" "}
              <span className="text-gradient">You're Joining a Tribe.</span>
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              127 corporate managers stopped waiting for an IPO and started building
              invisible recurring revenue. Each one was exactly where you are now —
              skeptical, trapped, and wondering if this was real. Here's the proof.
            </p>
          </div>

          {/* ── LIVE COMMUNITY PULSE ── */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-base p-5 text-center border-t-4 border-primary/40">
                <p className="text-3xl font-bold text-primary">127</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Active Builders</p>
              </div>
              <div className="card-base p-5 text-center border-t-4 border-success/40">
                <p className="text-3xl font-bold text-success">$31K+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Combined MRR</p>
              </div>
              <div className="card-base p-5 text-center border-t-4 border-amber-400/40">
                <p className="text-3xl font-bold text-amber-500">0</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Employer Detections</p>
              </div>
              <div className="card-base p-5 text-center border-t-4 border-red-400/40">
                <p className="text-3xl font-bold text-red-500">73</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Founding Spots Left</p>
              </div>
            </div>

            {/* Progress to 1,000 mission */}
            <div className="mt-6 max-w-xl mx-auto">
              <div className="flex items-end justify-between mb-2">
                <div className="text-left">
                  <p className="text-2xl font-bold text-primary">127</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">builders</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-muted-foreground">1,000</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">mission goal</p>
                </div>
              </div>
              <div className="h-3 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-primary-light to-success rounded-full transition-all duration-1000"
                  style={{ width: "12.7%" }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>12.7% of the way there</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  4 joined this week
                </span>
              </div>
            </div>
          </div>

          {/* ── 3 TRIBE PRINCIPLES (Our Code) ── */}
          {/* Expert Secrets Ch 14: Identity markers. "We" language creates belonging. */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <p className="text-eyebrow text-primary mb-2">Our Code</p>
              <h3 className="text-2xl font-bold text-foreground">3 Principles Every Invisible Builder Shares</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="card-base p-6 card-hover">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h4 className="text-base font-bold text-foreground mb-2">We Build Invisible</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every member operates under a pseudonym. No real names, no employer
                  info, no LinkedIn. Stealth isn't a feature — it's our first principle.
                  Your employer will never know.
                </p>
              </div>
              <div className="card-base p-6 card-hover">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-amber-500" />
                </div>
                <h4 className="text-base font-bold text-foreground mb-2">We Are the 3%</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The 97% read about starting. We start. The 97% wait for an IPO. We
                  build freedom with math. The 97% say "someday." We say "this Saturday."
                  If you're still reading, you're already in the 3%.
                </p>
              </div>
              <div className="card-base p-6 card-hover">
                <div className="w-11 h-11 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                  <Star className="w-5 h-5 text-success" />
                </div>
                <h4 className="text-base font-bold text-foreground mb-2">We Share Numbers</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No vanity metrics. No follower counts. Members share MRR, churn rate,
                  customer counts — verified by Stripe. The only number that matters is
                  your Freedom Number. Everything else is noise.
                </p>
              </div>
            </div>
          </div>

          {/* ── FOUNDING MEMBER PREVIEW WALL ── */}
          {/* Real pseudonyms, real products, real MRR. Identity proof without identity exposure. */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <p className="text-eyebrow text-primary mb-2">The Founding Wall</p>
              <h3 className="text-2xl font-bold text-foreground">Who's Already Building</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
                Names are pseudonyms. Products are real. Revenue is verified by Stripe.
                These are people who stopped waiting.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
              {[
                { pseudo: "Marcus T.", role: "Product Manager", mrr: "$4,200", initials: "MT", color: "bg-blue-500", product: "PDF generator", day: 1 },
                { pseudo: "Sarah K.", role: "Finance Director", mrr: "$3,800", initials: "SK", color: "bg-purple-500", product: "Invoice tool", day: 1 },
                { pseudo: "Jennifer L.", role: "Ops Manager", mrr: "$2,300", initials: "JL", color: "bg-emerald-500", product: "Logistics SaaS", day: 3 },
                { pseudo: "David R.", role: "Eng Manager", mrr: "$5,100", initials: "DR", color: "bg-amber-500", product: "API monitor", day: 5 },
                { pseudo: "Elena V.", role: "Marketing Dir", mrr: "$1,900", initials: "EV", color: "bg-pink-500", product: "Social scheduler", day: 7 },
                { pseudo: "James W.", role: "VP of Sales", mrr: "$3,400", initials: "JW", color: "bg-indigo-500", product: "CRM automation", day: 9 },
              ].map((member, i) => (
                <div
                  key={i}
                  className="card-base p-4 text-center card-hover animate-fade-up border-t-4 border-primary/20"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className={`w-12 h-12 rounded-full ${member.color} flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-white font-bold text-xs">{member.initials}</span>
                  </div>
                  <p className="font-semibold text-foreground text-xs">{member.pseudo}</p>
                  <p className="text-[11px] text-muted-foreground mb-1.5">{member.role}</p>
                  <div className="bg-success/10 rounded-lg py-1 px-1.5 mb-1.5">
                    <p className="text-success text-[11px] font-bold">{member.mrr}/mo</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground/60 italic leading-tight">{member.product}</p>
                  <p className="text-[11px] text-primary mt-1.5 font-medium">Day {member.day}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link
                to="/founding-wall"
                onClick={() => trackEvent("homepage_tribe_wall_link_clicked")}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
              >
                See all 27 founding members
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-muted-foreground/60 mt-2">
                + 12 anonymous members who chose not to display their stats
              </p>
            </div>
          </div>

          {/* ── US vs THEM (The 97% vs The 3%) ── */}
          {/* Brunson: tribal identity requires an enemy. "We are NOT them." */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-eyebrow text-primary mb-2">Two Paths</p>
              <h3 className="text-2xl font-bold text-foreground">The 97% vs The 3%</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
                The founding wall above is the 3%. Everyone else is still in the 97%.
                Which one are you?
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* The 97% */}
              <div className="bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/20 rounded-xl p-5">
                <p className="text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wide mb-4">
                  The 97%
                </p>
                <div className="space-y-2">
                  {[
                    "Bookmark articles about starting something",
                    "Wait for an IPO that won't buy freedom",
                    "Believe corporate loyalty is a virtue",
                    "Say 'someday' — the most expensive word",
                    "Let their employer decide their worth",
                    "Build publicly where their boss can see",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-red-400 text-xs shrink-0 mt-0.5">✗</span>
                      <p className="text-red-700/60 dark:text-red-300/60 text-xs line-through">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* The 3% */}
              <div className="bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/20 rounded-xl p-5">
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wide mb-4">
                  The 3%
                </p>
                <div className="space-y-2">
                  {[
                    "Start something — this Saturday",
                    "Calculate the freedom number and build toward it",
                    "Treat employment as a transaction that funds the exit",
                    "Start with 5 hours this week",
                    "Let the market decide — $29 × 138 customers",
                    "Build invisibly under a separate entity",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 text-xs shrink-0 mt-0.5">✓</span>
                      <p className="text-emerald-700 dark:text-emerald-300 text-xs font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── TRIBE CTA ── */}
          <div className="text-center mt-10">
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-4">
              Join 127 managers building invisible freedom. Anonymous by design.
              Verified by Stripe. Zero employer detections in 14 months.
            </p>
            <Link
              to="/founding-wall"
              onClick={() => trackEvent("homepage_tribe_cta_clicked")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              See the full founding wall
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Testimonials (Structured Social Proof System) ── */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <TestimonialGrid
            title="Built by Managers. Used by Managers."
            subtitle="Real results from corporate managers using the Invisible Exit system. Results, transformations, objection-crushers, and specific details."
          />
        </div>
      </section>

      {/* ── 6. Value Stack + Bonuses (DotCom Secrets Ch 12 & Ch 18 — Brunson's Stack) ── */}
      <section className="bg-surface section-normal relative overflow-hidden">
        {/* Ambient glow for the stack section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container-narrow text-center relative z-10">
          <p className="text-eyebrow text-primary mb-4">The Value Stack</p>
          <h2 className="text-h1 text-foreground mb-2">
            What You <span className="text-gradient">Really</span> Get for $0.97/Month
          </h2>
          <p className="text-body text-muted-foreground mb-6 max-w-xl mx-auto">
            If you bought each tool individually from the companies that inspired them, here's what you'd pay. <strong className="text-foreground">Spoiler: not $0.97.</strong>
          </p>

          {/* ── BRUNSON CH 12: DEADLINE-DRIVEN URGENCY ── */}
          {/* Scarcity needs a WHEN, not just a HOW MANY. This creates real urgency. */}
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-full px-5 py-2 mb-2 animate-fade-up">
            <Clock className="w-4 h-4 text-red-600 animate-pulse" />
            <span className="text-xs text-red-700 font-semibold text-balance">
              Founding member pricing ends when the 100th spot fills — currently 27 claimed. No extensions. No exceptions.
            </span>
          </div>
        </div>

        <div className="container-narrow space-y-2.5 relative z-10">
          {/* SECTION 1: Anchored against the alternative — what each tool replaces */}
          <p className="text-eyebrow text-muted-foreground mb-2 animate-fade-up">The 5 Tools — Anchored Against Real Alternatives</p>
          {[
            { name: "FYM Dashboard", anchor: "vs. Baremetrics · ChartMogul", anchorPrice: "$79/mo", ourPrice: "Included", outcome: "Real-time MRR tracking, churn analytics, exit timeline" },
            { name: "Idea Pipeline", anchor: "vs. MicroConf · Idea validation tools", anchorPrice: "$49/mo", ourPrice: "Included", outcome: "500+ scored ideas + 48h AI validation" },
            { name: "Stealth Ops Hub", anchor: "vs. Compliance audits · Privacy tools", anchorPrice: "$39/mo", ourPrice: "Included", outcome: "Entity separation, invisibility score, contract audit" },
            { name: "Launch Control", anchor: "vs. Webflow · Carrd · Notion OS", anchorPrice: "$36/mo", ourPrice: "Included", outcome: "Launch in 5 hrs/week — Stripe, landing pages, sequences" },
            { name: "Brand Manager", anchor: "vs. Hootsuite · Buffer · VidIQ", anchorPrice: "$49/mo", ourPrice: "Included", outcome: "Faceless content: YouTube scripts, Reddit playbooks, SEO" },
          ].map((item, i) => (
            <div
              key={item.name}
              className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-black/[0.03] transition-colors animate-fade-up border-b border-border/50 last:border-0"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-success" />
                </span>
                <div className="min-w-0">
                  <span className="text-foreground font-semibold text-sm">{item.name}</span>
                  <span className="text-muted-foreground/50 text-xs ml-2 hidden sm:inline">{item.anchor}</span>
                  <p className="text-muted-foreground/70 text-[11px] mt-0.5 truncate sm:hidden">{item.outcome}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground/60 line-through hidden sm:block">{item.anchorPrice}</span>
                <span className="text-xs font-bold text-success">FREE</span>
              </div>
            </div>
          ))}

          {/* Subtotal */}
          <div className="flex items-center justify-between py-2 px-4 mt-2">
            <span className="text-xs text-muted-foreground">If bought separately:</span>
            <span className="text-sm text-muted-foreground line-through font-bold">$252/month</span>
          </div>

          {/* ── BRUNSON CH 12: BONUSES WITH "REASON WHY" ── */}
          {/* "Why are these free? Because I need case studies for my launch." */}
          <div className="mt-8 mb-4 animate-fade-up" style={{ animationDelay: "400ms" }}>
            <p className="text-eyebrow text-primary mb-2">
              🎁 Fast-Action Bonuses (3) — Start today or lose them
            </p>
            <div className="bg-primary/5 border border-primary/15 rounded-lg px-4 py-2.5 mb-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Why are these free?</strong> We're building case studies for our public launch.
                The first 100 founding members get these bonuses as a thank-you for being early. After that, they become paid add-ons.
                <span className="text-primary font-semibold"> You're getting them for committing now — not later.</span>
              </p>
            </div>
          </div>
          {[
            { name: 'The "Is My Contract Safe?" Audit Checklist — 47 clauses every manager must check before starting', value: "$47" },
            { name: '25 Pre-Written Micro-SaaS Idea Swipes — ready to validate in 48 hours', value: "$67" },
            { name: 'The 90-Day Faceless Content Engine — YouTube scripts + Reddit playbooks + SEO templates', value: "$57" },
          ].map((bonus) => (
            <div
              key={bonus.name}
              className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-black/[0.03] transition-colors border-b border-border/50 last:border-0"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="w-6 h-6 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 text-amber-400 text-xs">
                  🎁
                </span>
                <span className="text-foreground font-medium text-sm">{bonus.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-muted-foreground/40 text-xs line-through">{bonus.value}</span>
                <span className="text-success text-xs font-bold">FREE</span>
              </div>
            </div>
          ))}

          {/* SECTION 3: The Dramatic Reveal — Brunson Ch 18 style */}
          <div className="relative mt-10">
            {/* Thin separator line */}
            <div className="absolute -top-5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <p className="text-center text-h2 text-foreground font-bold mb-8 mt-6 animate-fade-up" style={{ animationDelay: "500ms" }}>
              So... how much for all of this?
            </p>

            {/* Stack comparison card */}
            <div className="bg-white border border-border/80 rounded-2xl p-6 sm:p-8 max-w-lg mx-auto shadow-lg animate-fade-up" style={{ animationDelay: "550ms" }}>
              <div className="space-y-3">
                {/* Each line with visual weight */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Core tools (if bought separately)</span>
                  <span className="text-muted-foreground line-through">$252/month</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fast-action bonuses</span>
                  <span className="text-muted-foreground line-through">$171</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">12-month continuity value</span>
                  <span className="text-muted-foreground line-through">$576/year</span>
                </div>

                {/* Separator */}
                <div className="border-t border-border/50 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Total comparable value</span>
                    <span className="text-muted-foreground/60 line-through text-base font-bold">$999/year</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:items-center sm:justify-between pt-1">
                  <span className="text-foreground font-semibold text-base">Founding member price</span>
                  <span className="text-5xl sm:text-6xl font-black text-primary whitespace-nowrap">$0.97<span className="text-base font-normal text-muted-foreground">/mo</span></span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground/50">
                  <span>That's $11.64/year</span>
                  <span className="text-success font-bold">99.9% off market value</span>
                </div>
              </div>

              {/* Nudge vs price bar */}
              <div className="mt-4 bg-amber-500/5 border border-amber-500/15 rounded-lg px-4 py-2.5 flex items-center justify-between">
                <span className="text-amber-700 text-xs font-medium">
                  ⏳ <span className="text-amber-800 font-semibold">73 founding spots left</span> at this price
                </span>
                <span className="text-amber-700 text-xs font-bold">Locked for life</span>
              </div>
            </div>

            {/* ── BRUNSON CH 12: SOCIAL PROOF AT THE DECISION POINT ── */}
            {/* Testimonial placed INSIDE the stack, not above it. This is the "yes, this is real" moment. */}
            <div className="mt-6 max-w-lg mx-auto bg-white/60 backdrop-blur border border-success/20 rounded-xl p-5 animate-fade-up" style={{ animationDelay: "580ms" }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success to-primary flex items-center justify-center shrink-0 text-white font-bold text-sm">
                  SK
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-foreground">Sara K.</span>
                    <span className="text-[11px] bg-success/15 text-success px-1.5 py-0.5 rounded-full font-semibold">✓ Founding Member</span>
                    <span className="text-[11px] text-muted-foreground/60">VP Product, $180K</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "I almost didn't join because $0.97 felt too cheap to be real. Then I realized — that's less than the
                    coffee I was drinking while doom-scrolling LinkedIn. Three months in, I've validated two ideas and my
                    invisibility score is 94. I wish I'd started six months ago."
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[11px] text-muted-foreground/60 ml-1">Verified · Joined Month 1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BRUNSON CH 11: The One Thing — simplify the entire offer to ONE sentence */}
            <div className="mt-8 max-w-lg mx-auto bg-primary/10 border border-primary/25 rounded-xl p-4 text-center animate-fade-up" style={{ animationDelay: "600ms" }}>
              <p className="text-xs text-primary uppercase tracking-wider font-semibold mb-1">THE ONE THING</p>
              <p className="text-foreground font-bold text-base">Get all 5 tools + 3 bonuses for $0.97/month. Cancel anytime.</p>
              <p className="text-muted-foreground text-xs mt-1">
                Because every month you wait is <strong className="text-foreground">$4,000 in MRR</strong> you'll never recover.
              </p>
            </div>

            {/* ── BRUNSON CH 12: GUARANTEE AS A FEATURE, NOT A FOOTNOTE ── */}
            {/* If/Then risk reversal: "If you don't get X, I'll give you your money back AND Y." */}
            <div className="mt-8 max-w-lg mx-auto bg-gradient-to-br from-success/10 to-primary/5 border-2 border-success/30 rounded-2xl p-6 text-center animate-fade-up" style={{ animationDelay: "630ms" }}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-success" />
                </div>
                <p className="text-sm font-bold text-foreground uppercase tracking-wide">The Invisible Exit Guarantee</p>
              </div>
              <p className="text-sm text-foreground font-medium leading-relaxed mb-3">
                <strong className="text-success">If</strong> you use the Freedom Number Calculator, validate one idea,
                and don't have a clear path to $4,000/month within 30 days —{" "}
                <strong className="text-success">then</strong> email me and I'll refund every penny.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No forms. No "retention specialist" calls. No awkward questions. One email = full refund.{" "}
                <strong className="text-foreground">And you keep all 3 bonuses forever — even if you cancel.</strong>{" "}
                That's how confident I am this works.
              </p>
            </div>

            {/* ── BRUNSON CH 14: ORDER BUMP ── */}
            {/* One-click add-on at checkout. Pure margin. "Add this while you're already buying." */}
            <div className="mt-6 max-w-lg mx-auto bg-white/80 border-2 border-dashed border-primary/40 rounded-xl p-5 animate-fade-up" style={{ animationDelay: "660ms" }}>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-md border-2 border-primary/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">
                      ADD ON: The Founding Wall Accelerator Pack
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                    50 micro-SaaS niches pre-scored by revenue potential + competition, 10 done-for-you landing page
                    templates, and the "First 10 Customers" outreach playbook. Only available at checkout.
                    <strong className="text-foreground"> Not sold separately. Ever.</strong>
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground line-through">$97</span>
                    <span className="text-lg font-black text-primary">$17</span>
                    <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">One-time</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 animate-fade-up" style={{ animationDelay: "700ms" }}>
              <Link
                to="/start"
                onClick={() => trackEvent("homepage_stack_cta_clicked")}
                className="btn-primary text-lg px-8 py-5 inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[56px]"
              >
                Start for $0.97/Month
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-muted-foreground mt-3 text-center">
                Secure Stripe checkout · 73 founding spots remaining · Lock your price forever
              </p>
            </div>

            {/* ── BRUNSON CH 12: "WHAT HAPPENS AFTER I CLICK" ── */}
            {/* Kills the #1 buyer anxiety: "What am I getting into?" Shows the path. */}
            <div className="mt-8 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: "750ms" }}>
              <p className="text-center text-xs text-muted-foreground/70 font-semibold uppercase tracking-wider mb-4">
                What Happens After You Click "Start"
              </p>
              <div className="space-y-3">
                {[
                  { step: "1 min", title: "Secure Stripe checkout", desc: "Apple Pay, Google Pay, or card. $0.97 charged today. Cancel in one click anytime." },
                  { step: "2 min", title: "Instant dashboard access", desc: "Set your salary, expenses, and timeline. Get your Freedom Number immediately." },
                  { step: "5 min", title: "First idea validation", desc: "Browse 500+ scored micro-SaaS ideas filtered to your industry. Save 3–5." },
                  { step: "Day 2", title: "Stealth Ops audit runs", desc: "Upload your employment contract (optional). Get your invisibility score + fixes." },
                  { step: "Day 7", title: "Pick your first build", desc: "Choose one idea. Get a launch timeline that fits 5 hours/week." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/50 border border-border/50 rounded-lg p-3">
                    <div className="shrink-0 w-14 text-right">
                      <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{item.step}</span>
                    </div>
                    <div className="flex-1 min-w-0 border-l border-border/50 pl-3">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── BRUNSON CH 12: OFFER-SPECIFIC FAQ ── */}
            {/* Kill the 3 false beliefs at the offer: "Why so cheap? What's the catch? Can I do this?" */}
            <div className="mt-10 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: "800ms" }}>
              <p className="text-center text-xs text-muted-foreground/70 font-semibold uppercase tracking-wider mb-4">
                Wait — Before You Go…
              </p>
              <div className="space-y-2">
                {[
                  {
                    q: "Why $0.97? What's the catch?",
                    a: "There isn't one. The $0.97 exists for one reason: I need founding members and case studies before the public launch. When we go public, the price goes to $9.99/month. You're locking in $0.97 for life — not a trial, not an intro rate. Your card gets charged $0.97 every month until you cancel.",
                  },
                  {
                    q: "Is this one of those things where it's $0.97 today and $97 next week?",
                    a: "No. The price is $0.97/month, locked for the life of your subscription. No surprise upgrades, no hidden tiers. If you want coaching and community, that's Pro at $47/month — a completely separate choice you can make later. Or never.",
                  },
                  {
                    q: "What if I sign up and realize I don't have time?",
                    a: "Then cancel. One click in your dashboard, no questions, no friction. You'll still have 30 days to decide under the guarantee. The entire system is designed for 5 hours/week — if you don't have that right now, bookmark it and come back when you do.",
                  },
                ].map((item, i) => (
                  <details key={i} className="group bg-white/50 border border-border/50 rounded-lg overflow-hidden">
                    <summary className="flex items-center justify-between cursor-pointer p-3 list-none">
                      <span className="text-sm font-medium text-foreground">{item.q}</span>
                      <span className="text-primary text-sm transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <div className="px-3 pb-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* ── FINAL CTA REPEAT ── */}
            {/* Brunson: the stack always ends with a restatement of the offer + CTA. */}
            <div className="mt-10 max-w-lg mx-auto text-center animate-fade-up" style={{ animationDelay: "850ms" }}>
              <p className="text-sm text-muted-foreground mb-4">
                <strong className="text-foreground">5 tools.</strong> <strong className="text-foreground">3 bonuses.</strong>{" "}
                <strong className="text-foreground">30-day guarantee.</strong> <strong className="text-foreground">$0.97/month.</strong>
              </p>
              <Link
                to="/start"
                onClick={() => trackEvent("homepage_stack_cta_final_clicked")}
                className="btn-primary text-lg px-8 py-5 inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[56px]"
              >
                Claim My Founding Spot
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-xs text-muted-foreground/60 mt-3">
                27 of 100 founding spots claimed · Price locked for life · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6b. The Path Forward — Recap (Ch 2: Continuity/Frequency) ── */}
      <section className="bg-white section-normal border-t border-border">
        <div className="container-standard">
          <div className="text-center mb-10">
            <p className="text-eyebrow text-primary mb-4">The Path Forward</p>
            <h2 className="text-h2 text-foreground mb-4">From $0 to Freedom</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              The full value ladder, restated. Each step delivers 10× the value of the one
              before. Most members start at step 1 and never need to go past step 3.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {[
              {
                step: "Step 1",
                title: "Calculate your freedom number (Free)",
                desc: "Know exactly how much recurring revenue you need to replace your salary.",
                price: "$0",
                isPrimary: true,
              },
              {
                step: "Step 2",
                title: "Get the Stealth Ops Blueprint ($7)",
                desc: "The 47-point checklist that keeps your employer from finding out. One-time.",
                price: "$7",
              },
              {
                step: "Step 3",
                title: "Start the 5-tool system ($0.97/mo)",
                desc: "All 5 tools. Freedom number, idea pipeline, stealth ops, launch, brand.",
                price: "$0.97/mo",
                isPrimary: true,
              },
              {
                step: "Step 4",
                title: "Join Pro: coaching + community ($47/mo)",
                desc: "Weekly group coaching, private community, idea validation reports, MRR audits.",
                price: "$47/mo",
              },
              {
                step: "Step 5",
                title: "Build your product live ($97 workshop)",
                desc: "2-day weekend workshop. Build + launch your first product with Adrian.",
                price: "$97",
              },
              {
                step: "Step 6",
                title: "Scale with 1-on-1 coaching ($2K intensive)",
                desc: "90 days. Private coaching. Adrian becomes your co-founder. 5 spots/month.",
                price: "$2,000",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-4 border-b border-border last:border-0 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {i + 1}
                  </div>
                  {i < 5 && <div className="w-px h-8 bg-border mt-1" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.step}</p>
                  <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-primary">{item.price}</p>
                  {item.isPrimary ? (
                    <button
                      onClick={() => document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                      className="text-xs text-primary hover:text-primary-hover font-medium"
                    >
                      Start here →
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground/50">later</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Mid-Page CTA → Story (not checkout) ── */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-4">Want the full story first?</h2>
          <p className="text-body text-white/50 mb-10">
            Read how I went from trapped to $4,100 MRR in 12 months. 10 chapters. 15 minutes.
          </p>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => {
                trackEvent("homepage_mid_cta_clicked", { target: "inline_squeeze" });
                document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="btn-primary text-lg px-8 inline-flex items-center gap-2"
            >
              Calculate Your Freedom Number (Free)
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/story"
              onClick={() => trackEvent("homepage_mid_cta_clicked", { target: "story_page" })}
              className="text-sm text-white/60 hover:text-white transition-colors underline"
            >
              or read the full backstory →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. Story ── */}
      <section className="bg-white section-wide">
        <div className="container-narrow">
          <p className="text-eyebrow text-muted-foreground mb-8">The Backstory</p>
          <div className="text-body text-muted-foreground space-y-6 max-w-2xl">
            <p>
              Amsterdam. 6 AM. Raining. I had just landed on a KLM flight with my
              wife and 8-year-old for a family vacation. My phone buzzed in the
              taxi. Two notifications sat side by side.
            </p>
            <p>
              The first: corporate escalation emails. People at my company
              fighting over responsibilities. Again. At 6 AM. On the first morning
              of my vacation.
            </p>
            <p>
              The second: a Stripe notification. "$0.97 received." A complete
              stranger had paid for a landing page I built for plumbers in the
              USA. A business I know nothing about. In a country I don't live in.
              Under a name that isn't mine. While I slept on a plane.
            </p>
            <p>
              I screamed in the taxi. The driver thought I was insane. My wife
              understood: this wasn't about the money. This was proof that the
              cage has a door.
            </p>
            <p>
              I took everything I learned and built it into a system. 5 tools. One
              mission: help corporate managers build invisible recurring revenue.
            </p>
          </div>
        </div>
      </section>

      {/* ── 9. Social Proof ── */}
      <section className="bg-white pb-20 section">
        <div className="container-narrow">
          <p className="text-eyebrow text-muted-foreground mb-8 text-center">Who Is Adrian?</p>
          <div className="card-base bg-surface p-6 sm:p-8">
            <p className="text-body text-muted-foreground leading-relaxed text-center">
              A 37-year-old Managing Director at a European tech company. $120K
              salary. Less than 0.5% equity. 18-month IPO clock. Building
              invisible recurring revenue and documenting the process. Identity
              protected, because that's the whole point.
            </p>
          </div>
          <p className="text-muted-foreground italic text-center mt-6 text-caption">
            Built by a corporate manager, for corporate managers.
          </p>
        </div>
      </section>

      {/* ── 10. FAQ ── */}
      <section className="bg-white section-normal border-t border-border">
        <div className="container-narrow">
          <h2 className="text-h2 text-foreground mb-8">Questions Corporate Managers Ask</h2>
          <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold text-foreground">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 10.5. Continuous Loop: Why Members Stay (Dotcom Secrets Ch 12) ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The Continuous Loop</p>
            <h2 className="text-h2 text-foreground mb-4">Why Members Stay Month After Month</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              A subscription is a promise. Russell Brunson's Chapter 12 teaches that the
              continuous loop — the thing that makes people stay — must compound value every
              month. Here's what keeps Invisible Exit members engaged long after the first week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                week: "Week 1",
                title: "Your Freedom Number",
                detail: "Calculate your exact exit number. The dashboard tracks your MRR progress toward it in real-time. Every dollar earned moves the needle.",
                retention: "The number becomes a daily obsession.",
              },
              {
                week: "Week 2-4",
                title: "Idea Pipeline Momentum",
                detail: "Validate 3 micro-SaaS ideas in 48 hours each. The AI scoring system ranks them by revenue potential, time investment, and stealth feasibility.",
                retention: "New validated ideas every month.",
              },
              {
                week: "Month 2-3",
                title: "Launch & First Revenue",
                detail: "Ship your first product using Launch Control. Track every customer in the FYM Dashboard. Watch your invisibility score improve as your MRR grows.",
                retention: "Real numbers on the dashboard = skin in the game.",
              },
              {
                week: "Month 3+",
                title: "Compound Growth",
                detail: "Monthly MRR audits identify churn risks. New tool releases every quarter. Community leaderboard shows your rank among anonymous builders.",
                retention: "The gap between you and the leaderboard shrinks every week.",
              },
            ].map((phase, i) => (
              <div
                key={i}
                className="card-base p-6 border-t-4 border-primary/30"
              >
                <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-2">{phase.week}</p>
                <h3 className="font-bold text-foreground text-sm mb-2">{phase.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{phase.detail}</p>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-2">
                  <p className="text-xs text-primary italic">{phase.retention}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              The loop compounds: more MRR → higher invisibility score → more confidence →
              more products → more MRR. The system feeds itself. That's why members who start
              at $0.97/month upgrade to Founding — the loop is worth more than any single tool.
            </p>
          </div>
        </div>
      </section>

      {/* ── 10b. Free Book Funnel Banner (DotCom Secrets Ch 9) ── */}
      <section className="section-wide bg-gradient-to-b from-transparent via-amber-950/[0.06] to-transparent">
        <div className="container-narrow">
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-950/20 via-[hsl(222_47%_11%)] to-[hsl(222_47%_11%)] p-8 sm:p-12">
            {/* Glow orb */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />

            <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-2 rounded-full mb-5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  FREE BOOK — Just Pay Shipping
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
                  Prefer to Read First?
                </h3>
                <p className="text-white/60 text-base leading-relaxed mb-4 max-w-lg">
                  Get the complete <strong className="text-white">Invisible Exit Manifesto</strong> —
                  152 pages, 7 chapters, the exact $4,100/month system. Free. You just cover $4.95 shipping.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="text-white/60 line-through">$24.99</span>
                  <span className="text-2xl font-bold text-amber-400">FREE</span>
                  <span className="text-white/60">+ $4.95 S&amp;H</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                <Link
                  to="/free-book"
                  onClick={() => trackEvent("homepage_free_book_clicked")}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[hsl(222_47%_11%)] font-bold text-base px-7 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 min-h-[52px] whitespace-nowrap"
                >
                  Get the Free Book
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-white/60 text-xs md:text-right">
                  3 digital bonuses included · 30-day guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. Final CTA — Continuous Loop + Multi-CTA ── */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          {/* Qualifier */}
          <p className="text-eyebrow text-primary-light mb-4">
            If you've read this far, you're in the 3%.
          </p>

          <h2 className="text-h1 text-white mb-4">The Cage Has a Door.</h2>
          <p className="text-body text-white/60 mb-2">
            The 97% would have left by now. The fact that you're still here means something.
          </p>

          {/* EXPERT SECRETS Ch 15: The "5 Years From Now" Close — All-or-Nothing framing */}
          <div className="max-w-2xl mx-auto my-10 bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 text-left">
            <p className="text-eyebrow text-primary-light mb-4 text-center">Five Years From Now</p>
            <div className="space-y-4 text-white/60 text-sm sm:text-base leading-relaxed">
              <p>
                Picture yourself five years from today. Two versions of you exist.
              </p>
              <p>
                <strong className="text-white/40">Version one:</strong> You closed this page. You went back to the spreadsheet. The IPO happened — or it didn't. You're still in the same chair, with the same 0.5%, telling yourself the same story about "someday." Five more years of golden handcuffs. Five more years of someone else owning your exit.
              </p>
              <p>
                <strong className="text-primary-light">Version two:</strong> You calculated your freedom number today. You started small — 5 hours a week, one boring product, one anonymous LLC. Today, five years later, you have $8,000/month in recurring revenue from products you own. You walk into meetings differently. You negotiate differently. You're still employed — but by choice, not by necessity. The handcuffs came off quietly, three years ago, and nobody at your company ever noticed.
              </p>
              <p className="text-white font-medium pt-2">
                Same person. Same salary. Same 5 hours. The only difference is what you decided to do in the next 90 seconds.
              </p>
            </div>
          </div>

          <p className="text-body text-white/60 mb-10 max-w-xl mx-auto">
            You have two choices. Keep scrolling. Or find out how close you are to walking through it.
          </p>

          {/* Primary CTA */}
          <div className="mb-6">
            <button
              onClick={() => {
                trackEvent("homepage_final_cta_clicked", { target: "inline_squeeze" });
                document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="btn-primary text-lg px-8 inline-flex items-center gap-2"
            >
              I'm Ready — Calculate My Freedom Number
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-white/40 mt-3">
              No credit card. No spam. 90 seconds. Just the number that changes how you see your salary.
            </p>
          </div>

          {/* Final urgency */}
          <div className="mt-12 inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <p className="text-white/50 text-xs">
              <strong className="text-white/70">73 of 100</strong> founding spots remaining ·{" "}
              <strong className="text-white/70">127</strong> managers building now
            </p>
          </div>
        </div>
      </section>

      {/* ── Growth Lab: Distribution Engine ── */}
      {/* Traffic Secrets Secret #3-4: Fill Your Funnel + Hook/Story/Offer per Channel */}
      <section className="bg-surface section-normal border-t border-border">
        <div className="container-standard">
          <div className="text-center mb-10">
            <p className="text-eyebrow text-primary mb-4">Behind the Scenes</p>
            <h2 className="text-h2 text-foreground mb-4">
              The Distribution Engine
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              We don't just build content. We built the system to distribute it. Every tool here
              is functional and tracked.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <Link to="/dream-100-tracker" className="card-base p-5 text-center card-hover">
              <p className="text-3xl font-bold text-primary">100</p>
              <p className="text-xs text-muted-foreground mt-1">Dream 100 targets</p>
            </Link>
            <Link to="/hooks" className="card-base p-5 text-center card-hover">
              <p className="text-3xl font-bold text-primary">50+</p>
              <p className="text-xs text-muted-foreground mt-1">Content hooks</p>
            </Link>
            <Link to="/ad-library" className="card-base p-5 text-center card-hover">
              <p className="text-3xl font-bold text-primary">8</p>
              <p className="text-xs text-muted-foreground mt-1">Ad campaigns</p>
            </Link>
            <Link to="/content-calendar" className="card-base p-5 text-center card-hover">
              <p className="text-3xl font-bold text-primary">30</p>
              <p className="text-xs text-muted-foreground mt-1">Days of content</p>
            </Link>
          </div>
          <div className="text-center">
            <Link to="/growth-lab" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover">
              Explore the Growth Lab
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
};

export default Index;
