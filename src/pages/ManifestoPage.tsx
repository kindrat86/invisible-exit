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
  Headphones,
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

      {/* ── The Rallying Cry + Reluctant Hero (Expert Secrets Ch 2 + 15) ── */}
      <section className="bg-gradient-to-br from-primary to-primary-dark section-wide">
        <div className="container-narrow text-center">
          {/* Reluctant Hero vulnerability */}
          <p className="text-eyebrow text-primary-light mb-4">Why I Built This (The Truth)</p>
          <div className="max-w-2xl mx-auto text-white/70 text-body space-y-4 mb-12 text-left">
            <p>
              I need to be honest with you. I didn't want to build Invisible Exit.
            </p>
            <p>
              I wanted to keep building micro-SaaS products in peace. I wanted to
              collect my $4,100/month, walk into work calm, and go home. I didn't
              want to be a guru, a coach, or a movement leader. That's not my
              personality. I'm an introvert who manages 40 people and hides behind
              a pseudonym.
            </p>
            <p>
              But then a colleague pulled me aside and said: <em>"Something changed. What happened?"</em>
              And I realized: if I kept this to myself, I'd be no better than the
              company holding my 0.5% equity. Hoarding something valuable. Hoping
              nobody notices.
            </p>
            <p className="text-white font-medium">
              So I'm sharing it. Reluctantly. Imperfectly. But completely. Because
              the cage has a door, and I found the key. The least I can do is leave
              it unlocked for the next person.
            </p>
          </div>

          {/* The Rallying Cry */}
          <div className="border-t border-white/10 pt-12">
            <p className="text-eyebrow text-primary-light mb-4">Our Rallying Cry</p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 max-w-2xl mx-auto">
              <p className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">
                "We don't wait for exits.
                <br />
                <span className="text-gradient-light">We build our own."</span>
              </p>
              <p className="text-white/50 text-sm">
                Say it. Mean it. Build it. This is what separates the 3% from the 97%.
              </p>
            </div>
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
          <p className="text-body text-muted-foreground max-w-xl mx-auto mb-4">
            97% of managers will read this and go back to their spreadsheet.
            3% will calculate their freedom number. That 3% is who this is for.
          </p>

          {/* EXPERT SECRETS Ch 15: 5-Year Close micro-version */}
          <div className="bg-surface border border-border rounded-xl p-5 max-w-lg mx-auto mb-8 text-left">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-3">The Fork in the Road</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              <strong className="text-foreground">Path A:</strong> You close this tab. Five years from now, you're in the same chair, with the same 0.5%, telling the same story.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-primary">Path B:</strong> You spend 90 seconds on one calculator. Five years from now, you own $8,000/month in recurring revenue — and your employer still has no idea.
            </p>
          </div>

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
          <p className="text-xs text-muted-foreground/50 mt-2 italic">
            Because 6 months from now, you'll either have the number — or you'll still be guessing.
          </p>
        </div>
      </section>

      {/* EXPERT SECRETS Ch 7: Video Section — The Story in 3 Minutes */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">Watch The Story</p>
          <h2 className="text-h1 text-foreground mb-4">The Moment That Changed Everything</h2>
          <p className="text-body text-muted-foreground max-w-xl mx-auto mb-8">
            If you prefer watching over reading, here's the Amsterdam taxi story in 3 minutes.
            Same story. Same system. Less text.
          </p>
          <div className="max-w-xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-surface-dark border border-border">
              {/* Video placeholder — replace src with actual video URL when recorded */}
              <video
                className="w-full h-full object-cover"
                controls
                poster="/og-image.png"
                preload="metadata"
              >
                <source src="" type="video/mp4" />
                <p className="flex items-center justify-center h-full text-muted-foreground text-sm p-8">
                  <Headphones className="w-6 h-6 mr-3 shrink-0" />
                  Video coming soon. In the meantime,{' '}
                  <Link to="/story" className="text-primary hover:underline mx-1">
                    read the full story here
                  </Link>
                  .
                </p>
              </video>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Can't see the video?{' '}
              <Link to="/story" className="text-primary hover:underline">
                Read the 10-chapter story
              </Link>
              {' '}— it's the same content, just text.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ManifestoPage;
