import { Link } from "react-router-dom";
import { ArrowRight, Target, Users, Mail, Search, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const DREAM_100_TIERS = [
  {
    tier: "Tier 1 — Dream Partners",
    description: "Influencers and creators who already speak to corporate managers, ambitious professionals, and the 'golden handcuffs' audience.",
    examples: [
      "Career coaches with 10K+ audience (LinkedIn, YouTube, newsletters)",
      "Personal finance creators covering FIRE / financial independence",
      "Productivity / self-improvement creators (Ali Abdaal tier)",
      "Startup/side-hustle podcast hosts (Indie Hackers, My First Million tier)",
      "Corporate escape story accounts (anonymous founder brands)",
    ],
    action: "Personal cold email with a free year of Invisible Exit. Goal: interview on their podcast or a co-created piece of content.",
  },
  {
    tier: "Tier 2 — Strategic Affiliates",
    description: "Communities, newsletters, and platforms where our exact audience already gathers.",
    examples: [
      "r/cscareerquestions, r/experienceddevs, r/FIRE, r/Entrepreneur (Reddit)",
      "Indie Hackers community members with corporate backgrounds",
      "LinkedIn creators in the B2B SaaS / career strategy space",
      "Substack newsletters on career change, burnout, or corporate exit",
      "Private Slack/Discord communities for managers and directors",
    ],
    action: "Affiliate program pitch (30% recurring). Provide swipe copy, banner assets, and a custom landing page.",
  },
  {
    tier: "Tier 3 — Content Amplifiers",
    description: "Platforms and channels that can distribute our story to new audiences at scale.",
    examples: [
      "Guest posts on career/business publications (Mid, Substack features)",
      "Podcast guest appearances (origin story focused)",
      "YouTube collaborations (faceless channel crossovers)",
      "Twitter/X threads from the Adrian persona",
      "Conference talks (remote, anonymous, pre-recorded)",
    ],
    action: "Provide a media kit, the Amsterdam origin story in 3 formats (5/15/45 min), and a pre-built presentation deck.",
  },
];

const OUTREACH_PLAYBOOK = [
  {
    step: "1",
    title: "Identify",
    body: "Build a spreadsheet of 100 names. Columns: name, platform, audience size, audience overlap with 'corporate manager trapped by golden handcuffs', contact method, tier.",
  },
  {
    step: "2",
    title: "Research",
    body: "Before outreach, consume 3+ pieces of their content. Find the specific angle where Invisible Exit complements their message without competing. Note their content style, tone, and recent topics.",
  },
  {
    step: "3",
    title: "First Touch",
    body: "Personal email or DM. Reference a specific piece of their content. Introduce Adrian's story (not the product). Offer value first: a free founding membership, an exclusive interview, or a guest post. No pitch in the first message.",
  },
  {
    step: "4",
    title: "Follow-Up",
    body: "Russell's rule: follow up 5 times. Most partnerships close on touch #3-5. Send a different angle each time: new testimonial, new data point, new content piece. Never guilt-trip.",
  },
  {
    step: "5",
    title: "Deliver Value",
    body: "Once they engage, over-deliver. Free access. Custom content for their audience. Affiliate setup. The goal is to make promoting Invisible Exit the easiest yes they've ever said.",
  },
];

const Dream100Page = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Dream 100 — Strategic Partner Framework | Invisible Exit"
        description="How we identify, research, and build relationships with the 100 people who already have our audience. The Russell Brunson Dream 100 strategy, adapted."
        url="/dream-100"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Target className="w-4 h-4" />
            Growth Strategy
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            The <span className="text-gradient-light">Dream 100</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-4">
            100 people already have your audience.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            Stop trying to build an audience from scratch. Find the people who already
            serve corporate managers and build relationships with them.
          </p>
        </div>
      </section>

      {/* The Concept */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">The Strategy</p>
          <h2 className="text-h1 text-foreground mb-6 text-center">Why Dream 100?</h2>
          <div className="max-w-2xl mx-auto text-body text-muted-foreground space-y-5 text-center">
            <p>
              Russell Brunson's core growth insight: you don't need a million followers.
              You need relationships with 100 people who each have an audience that
              matches yours.
            </p>
            <p>
              If each Dream 100 partner has 5,000 followers and just 1% convert, that's
              <strong className="text-foreground"> 5,000 new users</strong> — without spending
              a dollar on ads.
            </p>
            <p>
              This page documents our framework for identifying, researching, and building
              those relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-4 text-center">The Target List</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">Three Tiers of Partners</h2>
          <div className="space-y-8 max-w-4xl mx-auto">
            {DREAM_100_TIERS.map((tier) => (
              <div key={tier.tier} className="card-base p-6 sm:p-8">
                <h3 className="text-lg font-bold text-foreground mb-2">{tier.tier}</h3>
                <p className="text-caption text-muted-foreground mb-4">{tier.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {tier.examples.map((ex) => (
                    <div key={ex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Search className="w-3.5 h-3.5 text-primary mt-1 shrink-0" />
                      <span>{ex}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-primary/5 rounded-lg p-4 border-l-3 border-primary">
                  <p className="text-sm text-foreground">
                    <strong>Action:</strong> {tier.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Playbook */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">The Process</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">The Outreach Playbook</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {OUTREACH_PLAYBOOK.map((step) => (
              <div key={step.step} className="card-base p-5 flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-bold text-lg shrink-0">
                  {step.step}
                </span>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                  <p className="text-caption">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliate CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <Users className="w-12 h-12 text-primary-light mx-auto mb-6" />
          <h2 className="text-h1 text-white mb-4">Are You One of the 100?</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            If you have an audience of corporate managers, ambitious professionals, or
            side-business builders, we want to partner with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/affiliates" className="btn-primary text-lg">
              See Affiliate Program
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/partners/jv" className="btn-secondary text-lg border-white/20 text-white hover:bg-white/10">
              JV Partnership (50%)
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="mailto:escape@invisibleexit.com?subject=Dream%20100%20Partnership"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
            >
              <Mail className="w-4 h-4" /> Pitch a partnership
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dream100Page;
