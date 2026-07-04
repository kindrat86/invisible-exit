import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  X,
  Users,
  Shield,
  Rocket,
  Eye,
  TrendingUp,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

const OLD_VS_NEW = [
  {
    aspect: "The Vehicle",
    oldWay: "Climb the corporate ladder. Wait for equity to vest. Hope the IPO delivers.",
    newWay: "Build invisible recurring revenue. Own products, not promises.",
    oldIcon: TrendingUp,
    newIcon: Rocket,
  },
  {
    aspect: "The Timeline",
    oldWay: "5-8 years to a liquidity event you don't control.",
    newWay: "12-18 months to $4,000/month MRR you own today.",
    oldIcon: Lock,
    newIcon: Shield,
  },
  {
    aspect: "The Visibility",
    oldWay: "LinkedIn brand. Conference talks. Your name on everything.",
    newWay: "Anonymous entities. Separate identities. Zero exposure.",
    oldIcon: Eye,
    newIcon: Shield,
  },
  {
    aspect: "The Skill Set",
    oldWay: "Learn to pitch investors. Build a deck. Network at events.",
    newWay: "Use your existing P&L, team management, and execution skills.",
    oldIcon: TrendingUp,
    newIcon: Users,
  },
  {
    aspect: "The Risk",
    oldWay: "Quit your job. Burn the bridge. Sink or swim.",
    newWay: "Keep your salary. Build in 5 hours/week. The job funds the exit.",
    oldIcon: Lock,
    newIcon: Shield,
  },
];

const PRINCIPLES = [
  {
    num: "01",
    title: "Revenue beats equity.",
    body: "0.5% equity in someone else's company is a leash, not an asset. $4,000/month in recurring revenue from products you own is freedom you control today — not in 5 years when an IPO 'might' happen.",
  },
  {
    num: "02",
    title: "Anonymity is the advantage.",
    body: "The faceless founder can experiment without fear, fail without consequence, and build in any market — all while the employer, the LinkedIn network, and the competitors have no idea. The mask IS the moat.",
  },
  {
    num: "03",
    title: "Constraints produce focus.",
    body: "5 hours a week isn't a limitation. It's a forcing function. Full-time founders with 60 hours dilute their effort across a dozen priorities. The 5-hour builder does one thing that matters — every single week.",
  },
  {
    num: "04",
    title: "The system beats the idea.",
    body: "Stop obsessing over finding the 'right' idea. Build the framework first — freedom number, idea pipeline, stealth ops, launch control, brand. Once the system exists, you can swap ideas in and out like cartridges.",
  },
  {
    num: "05",
    title: "Boring products pay mortgages.",
    body: "A PDF generator for electricians beats a sexy AI tool. Boring markets have less competition, higher willingness to pay, and lower churn. The Idea Pipeline scores for revenue probability, not excitement.",
  },
  {
    num: "06",
    title: "Your job is the launchpad, not the trap.",
    body: "Your salary is runway funding that costs zero equity. Your corporate skills (managing teams, reading P&Ls, executing under pressure) are exactly what solo founders lack. The job isn't what you escape — it's what funds the escape.",
  },
];

const ManifestoPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="The Invisible Exit Manifesto — A Movement for Trapped Managers"
        description="This isn't a side-hustle course. It's a new vehicle for financial freedom. Read the 6 principles of the Invisible Builder movement."
        url="/manifesto"
      />
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary-light mb-6 animate-fade-in">
            The Manifesto
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] animate-fade-up">
            This Isn't a Side-Hustle Course.
            <br />
            <span className="text-gradient-light">
              It's a New Vehicle.
            </span>
          </h1>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
            Every other program teaches you to improve — to build a better
            business, to hustle harder, to optimize your side project. We don't
            teach improvement. We offer a fundamentally different path to
            financial freedom.
          </p>
          <p className="text-lg text-white/50 max-w-xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "200ms" }}>
            If you're a corporate manager earning $120K-$200K with golden
            handcuffs and less than 0.5% equity — this is your declaration of
            independence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "300ms" }}>
            <Link
              to="/freedom"
              onClick={() => trackEvent("manifesto_hero_cta")}
              className="btn-primary text-lg px-8 inline-flex items-center gap-2"
            >
              Calculate Your Freedom Number
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/story"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors"
            >
              Read my origin story →
            </Link>
          </div>
        </div>
      </section>

      {/* ── The Problem: Improvement vs New Opportunity ── */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4">The Distinction</p>
          <h2 className="text-h1 text-foreground mb-6">
            Improvement vs.{" "}
            <span className="text-primary">A New Opportunity</span>
          </h2>
          <div className="max-w-2xl text-body text-muted-foreground space-y-5">
            <p>
              <strong className="text-foreground">Improvement</strong> is: "How
              to build a better side business." It competes with 10,000 other
              courses, books, and YouTube channels. It positions you as just
              another person learning to hustle.
            </p>
            <p>
              <strong className="text-primary">
                A New Opportunity
              </strong>{" "}
              is: "A fundamentally different vehicle for financial freedom —
              one designed specifically for employed managers who need to stay
              invisible." It creates a category that didn't exist before. A
              category we own.
            </p>
            <p className="text-foreground font-medium text-lg pt-4">
              We don't teach you to build a side business. We hand you the
              Invisible Exit System — the world's first anonymity-native,
              stealth-first framework for building recurring revenue while
              employed.
            </p>
          </div>
        </div>
      </section>

      {/* ── Us vs Them ── */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">Two Paths</p>
            <h2 className="text-h1 text-foreground mb-4">The Old Way vs. The Invisible Way</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              You've been sold one path your entire career. Here's why it was
              never designed to take you where you want to go.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {OLD_VS_NEW.map((row) => (
              <div
                key={row.aspect}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white border border-border card-hover"
              >
                {/* Old Way */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                    <X className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                      {row.aspect} — Old Way
                    </p>
                    <p className="text-sm text-muted-foreground">{row.oldWay}</p>
                  </div>
                </div>
                {/* New Way */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-1">
                      {row.aspect} — Invisible Way
                    </p>
                    <p className="text-sm text-foreground">{row.newWay}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The 6 Principles ── */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The Declaration</p>
            <h2 className="text-h1 text-foreground mb-4">
              The 6 Principles of the Invisible Builder
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              These aren't tips. They're the foundational beliefs of a movement.
              If you agree with all six, you're one of us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {PRINCIPLES.map((p, i) => (
              <div
                key={p.num}
                className="card-base p-6 sm:p-8 card-hover animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-sm mb-4">
                  {p.num}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-3">{p.title}</h3>
                <p className="text-caption text-muted-foreground leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Future-Based Cause ── */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary-light mb-4">The Vision</p>
          <h2 className="text-h1 text-white mb-6">
            A Future Where 10,000 Managers
            <br />
            <span className="text-gradient-light">Own Their Exit</span>
          </h2>
          <div className="max-w-2xl mx-auto text-body text-white/60 space-y-5 text-left">
            <p>
              Imagine a world where corporate managers don't wait 8 years for an
              IPO that may never deliver freedom. Where they don't gamble their
              family's future on a 0.5% equity lottery ticket.
            </p>
            <p>
              Imagine if 10,000 managers — each building quietly, each earning
              $4,000/month from products they own — walked into their annual
              review knowing the golden handcuffs were already off.
            </p>
            <p>
              Not because they quit. Not because they burned a bridge. But
              because they built an invisible exit — a door only they could see
              and only they could open.
            </p>
            <p className="text-white font-medium text-lg pt-4">
              That's the future we're building. One manager at a time.
            </p>
          </div>
        </div>
      </section>

      {/* ── Call to Adventure ── */}
      <section className="bg-white section-normal border-t border-border">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">Your Move</p>
          <h2 className="text-h1 text-foreground mb-4">
            If You've Read This Far, You're Already Different
          </h2>
          <p className="text-body text-muted-foreground max-w-xl mx-auto mb-8">
            97% of managers will read this and go back to their spreadsheet.
            3% will calculate their freedom number. That 3% is who this is for.
          </p>
          <Link
            to="/freedom"
            onClick={() => trackEvent("manifesto_final_cta")}
            className="btn-primary text-lg px-8 inline-flex items-center gap-2"
          >
            Calculate Your Freedom Number — Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            90 seconds. No credit card. The first step of the invisible exit.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ManifestoPage;
