import { Link } from "react-router-dom";
import { ArrowRight, Users, Lock, MessageSquare, TrendingUp, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

const US_VS_THEM = [
  {
    them: "The 97%",
    us: "The 3%",
    items: [
      { them: "Bookmark articles about starting something", us: "Start something" },
      { them: "Wait for the IPO that won't buy freedom", us: "Calculate the freedom number and build toward it" },
      { them: "Believe corporate loyalty is a virtue", us: "Treat employment as a transaction that funds our exit" },
      { them: "Say 'someday' — the most expensive word", us: "Start with 5 hours this week" },
      { them: "Let their employer decide their worth", us: "Let the market decide — $29 × 138 customers" },
      { them: "Build publicly where their boss can see", us: "Build invisibly under a separate entity" },
      { them: "Obsess over the 'right' idea for months", us: "Build the system, swap ideas in and out" },
    ],
  },
];

const BENEFITS = [
  {
    icon: MessageSquare,
    title: "Weekly Office Hours",
    body: "Adrian hosts a private weekly Q&A. Ask anything about your specific situation. Get answers from someone who's done it.",
  },
  {
    icon: Users,
    title: "Private Community",
    body: "Connect with other corporate managers building invisible businesses. Share wins, debug failures, find accountability partners.",
  },
  {
    icon: Lock,
    title: "Stealth-First Culture",
    body: "Everyone in the circle is anonymous. No real names. No employer info. No LinkedIn. Just pseudonyms, numbers, and progress.",
  },
  {
    icon: TrendingUp,
    title: "MRR Leaderboard",
    body: "Track your progress against other members. Monthly MRR milestones. The leaderboard is anonymous — just handles and numbers.",
  },
];

const InnerCirclePage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="The Invisible Exit Inner Circle — Private Community for Corporate Builders"
        description="A private community of corporate managers building anonymous side businesses. Weekly office hours, MRR leaderboard, stealth-first culture."
        url="/inner-circle"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Lock className="w-4 h-4" />
            Private Community
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            The <span className="text-gradient-light">Inner Circle</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-4">
            You're not alone in this.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto mb-8">
            A private community of corporate managers building invisible recurring revenue.
            Anonymous. Accountable. Relentless.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/freedom"
              onClick={() => trackEvent("inner_circle_cta_clicked")}
              className="btn-primary text-lg"
            >
              Join the Circle
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/story"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
            >
              Read the story first →
            </Link>
          </div>
        </div>
      </section>

      {/* Us vs Them */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The Division</p>
            <h2 className="text-h1 text-foreground mb-4">The 97% vs The 3%</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Every corporate manager falls into one of two camps. The gap isn't talent.
              It isn't luck. It's whether you act.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Them */}
            <div className="card-base p-6 border-2 border-muted-foreground/10">
              <p className="text-eyebrow text-muted-foreground mb-4">The 97%</p>
              <div className="space-y-3">
                {US_VS_THEM[0].items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-muted-foreground/40 mt-0.5">✗</span>
                    <p className="text-sm text-muted-foreground">{item.them}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Us */}
            <div className="card-base p-6 border-2 border-primary/20 bg-primary/[0.02]">
              <p className="text-eyebrow text-primary mb-4">The 3%</p>
              <div className="space-y-3">
                {US_VS_THEM[0].items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground font-medium">{item.us}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-h2 text-foreground mt-12 max-w-3xl mx-auto leading-tight">
            The gap between 97% and 3% isn't talent.
            <br />
            <span className="text-gradient">It's the first $0.97.</span>
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-4 text-center">What's Inside</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">Membership Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card-base p-6 sm:p-8 card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-h3 text-foreground mb-3">{b.title}</h3>
                <p className="text-caption">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Pledge */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">The Pledge</p>
          <h2 className="text-h1 text-foreground mb-8 text-center">What Members Commit To</h2>
          <div className="card-base p-8 max-w-2xl mx-auto bg-surface">
            <div className="space-y-4">
              {[
                "I will build for at least 5 hours every week. No excuses.",
                "I will operate under a pseudonym. My employer will not find out.",
                "I will share my MRR number — honestly — every month.",
                "I will help other members when I can. The circle grows by lifting each other.",
                "I will calculate my freedom number before choosing an idea.",
                "I will treat this as a system, not a lottery ticket.",
              ].map((pledge, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-foreground text-sm">{pledge}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-4">The Circle Is Waiting.</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            Join a community of managers who decided the golden handcuffs aren't enough.
            $0.97/month includes full community access.
          </p>
          <Link to="/freedom" className="btn-primary text-lg">
            Start Your Invisible Exit
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InnerCirclePage;
