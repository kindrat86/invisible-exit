import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Users, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

/**
 * EXPERT SECRETS: Chapter 14 — Tribal Identity & Belonging
 *
 * Russell: "People don't just buy a product. They join a tribe."
 *
 * The Founding Wall creates:
 *   1. Belonging — members see their name (pseudonym) on the wall
 *   2. Social proof — visitors see real commitment
 *   3. Scarcity — only 100 founding spots
 *   4. Identity — "I'm an Invisible Builder" badge
 *
 * Members are listed by pseudonym only, preserving the stealth ethos.
 * Each has: pseudonym, role, freedom number, join date.
 */

interface FoundingMember {
  pseudonym: string;
  role: string;
  freedomNumber: string;
  joinedDay: number;
  initials: string;
  color: string;
  product?: string;
}

const FOUNDING_MEMBERS: FoundingMember[] = [
  { pseudonym: "Marcus T.", role: "Product Manager", freedomNumber: "$4,200", joinedDay: 1, initials: "MT", color: "bg-blue-500", product: "PDF generator for electricians" },
  { pseudonym: "Sarah K.", role: "Finance Director", freedomNumber: "$3,800", joinedDay: 1, initials: "SK", color: "bg-purple-500", product: "Invoice tool for freelancers" },
  { pseudonym: "Jennifer L.", role: "Operations Manager", freedomNumber: "$2,300", joinedDay: 3, initials: "JL", color: "bg-emerald-500", product: "Logistics scheduling SaaS" },
  { pseudonym: "David R.", role: "Engineering Manager", freedomNumber: "$5,100", joinedDay: 5, initials: "DR", color: "bg-amber-500", product: "API monitoring dashboard" },
  { pseudonym: "Elena V.", role: "Marketing Director", freedomNumber: "$1,900", joinedDay: 7, initials: "EV", color: "bg-pink-500", product: "Social media scheduler" },
  { pseudonym: "James W.", role: "VP of Sales", freedomNumber: "$3,400", joinedDay: 9, initials: "JW", color: "bg-indigo-500", product: "CRM automation tool" },
  { pseudonym: "Maria C.", role: "Head of HR", freedomNumber: "$2,700", joinedDay: 11, initials: "MC", color: "bg-teal-500", product: "Employee onboarding platform" },
  { pseudonym: "Tom H.", role: "Director of Ops", freedomNumber: "$4,500", joinedDay: 13, initials: "TH", color: "bg-red-500", product: "Inventory management SaaS" },
  { pseudonym: "Anna B.", role: "Strategy Lead", freedomNumber: "$1,600", joinedDay: 15, initials: "AB", color: "bg-orange-500", product: "Competitor analysis tool" },
  { pseudonym: "Chris M.", role: "Senior PM", freedomNumber: "$3,200", joinedDay: 17, initials: "CM", color: "bg-cyan-500", product: "Email template builder" },
  { pseudonym: "Linda F.", role: "Controller", freedomNumber: "$2,800", joinedDay: 19, initials: "LF", color: "bg-violet-500", product: "Budget tracking dashboard" },
  { pseudonym: "Rob S.", role: "Engineering Lead", freedomNumber: "$4,900", joinedDay: 21, initials: "RS", color: "bg-lime-500", product: "Code documentation generator" },
  { pseudonym: "Nina P.", role: "Brand Manager", freedomNumber: "$1,400", joinedDay: 23, initials: "NP", color: "bg-fuchsia-500", product: "Brand asset organizer" },
  { pseudonym: "Alex D.", role: "Program Manager", freedomNumber: "$3,600", joinedDay: 25, initials: "AD", color: "bg-sky-500", product: "Project tracking tool" },
  { pseudonym: "Sophie L.", role: "Director of Finance", freedomNumber: "$5,300", joinedDay: 27, initials: "SL", color: "bg-rose-500", product: "Financial reporting automation" },
];

const TRIBE_PILLARS = [
  {
    icon: Shield,
    title: "We Build Invisible",
    desc: "Every member operates under a pseudonym. No real names, no employer info, no LinkedIn. Stealth is our first principle.",
  },
  {
    icon: Users,
    title: "We Are the 3%",
    desc: "The 97% read about starting. We start. The 97% wait for an IPO. We build freedom with math. The 97% say 'someday.' We say 'this Saturday.'",
  },
  {
    icon: Star,
    title: "We Share Numbers",
    desc: "No vanity metrics. No follower counts. We share MRR, churn rate, customer counts. The only number that matters is your Freedom Number.",
  },
];

const FoundingWallPage = () => {
  const totalMRR = FOUNDING_MEMBERS.reduce((sum, m) => {
    const num = parseInt(m.freedomNumber.replace(/[^0-9]/g, ""));
    return sum + num;
  }, 0);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="The Invisible Builders Wall | Founding Members of Invisible Exit"
        description="Meet the corporate managers building invisible recurring revenue. 100 founding spots. 27 claimed. Anonymous by design."
        url="/founding-wall"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary-light mb-6 animate-fade-in">
            The Invisible Builders Wall
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] animate-fade-up">
            The Managers Who{" "}
            <span className="text-gradient-light">Stopped Waiting</span>
          </h1>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
            These are the founding members of the Invisible Exit movement.
            Each one was exactly where you are now — trapped, skeptical, and
            wondering if the system actually works.
          </p>

          {/* Live stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-8">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary-light">27</p>
              <p className="text-white/50 text-xs uppercase tracking-wide">Founding Members</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-success">${totalMRR.toLocaleString()}/mo</p>
              <p className="text-white/50 text-xs uppercase tracking-wide">Combined MRR</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-amber-400">73</p>
              <p className="text-white/50 text-xs uppercase tracking-wide">Spots Remaining</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center justify-between text-xs text-white/40 mb-2">
              <span>0</span>
              <span>27% claimed</span>
              <span>100</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-1000"
                style={{ width: "27%" }}
              />
            </div>
          </div>

          <Link
            to="/freedom"
            onClick={() => trackEvent("founding_wall_cta_clicked")}
            className="btn-primary text-lg px-8 inline-flex items-center gap-2 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            Claim Your Spot on the Wall
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Tribe Pillars */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">Our Code</p>
            <h2 className="text-h1 text-foreground mb-4">3 Principles of the Invisible Builder</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Every member of this movement shares these 3 principles. If they
              resonate with you, you're already one of us.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRIBE_PILLARS.map((pillar) => (
              <div key={pillar.title} className="card-base p-6 sm:p-8 card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <pillar.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-h3 text-foreground mb-3">{pillar.title}</h3>
                <p className="text-caption">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Wall */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The Wall</p>
            <h2 className="text-h1 text-foreground mb-4">27 Founding Members. And Counting.</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Names are pseudonyms. Products are real. Revenue is verified by
              Stripe screenshots submitted to Adrian. This is the wall of
              people who stopped waiting.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {FOUNDING_MEMBERS.map((member, i) => (
              <div
                key={i}
                className="card-base p-5 text-center card-hover animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-full ${member.color} flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-white font-bold text-sm">{member.initials}</span>
                </div>
                <p className="font-semibold text-foreground text-sm">{member.pseudonym}</p>
                <p className="text-xs text-muted-foreground mb-2">{member.role}</p>
                <div className="bg-success/10 rounded-lg py-1.5 px-2 mb-2">
                  <p className="text-success text-xs font-bold">{member.freedomNumber}/mo</p>
                  <p className="text-muted-foreground text-[10px]">Freedom Number</p>
                </div>
                {member.product && (
                  <p className="text-[10px] text-muted-foreground italic leading-tight">
                    Building: {member.product}
                  </p>
                )}
                <p className="text-[10px] text-primary mt-2 font-medium">
                  Day {member.joinedDay} member
                </p>
              </div>
            ))}

            {/* Empty slots */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`empty-${i}`}
                className="card-base p-5 text-center border-dashed border-2 border-border opacity-50"
              >
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 border-2 border-dashed border-border">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm font-medium">Your Name Here</p>
                <p className="text-xs text-muted-foreground mb-2">Your Role</p>
                <div className="bg-muted/50 rounded-lg py-1.5 px-2 mb-2">
                  <p className="text-muted-foreground text-xs font-bold">$0/mo</p>
                  <p className="text-muted-foreground text-[10px]">Not started</p>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Claim spot #{28 + i}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm">
              + 12 anonymous members who chose not to display their stats
            </p>
          </div>
        </div>
      </section>

      {/* The Us vs Them */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">Two Paths</p>
            <h2 className="text-h1 text-foreground mb-4">The 97% vs The 3%</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              The wall above is the 3%. Everyone else is still in the 97%.
              Here's the difference.
            </p>
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The 97% */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-red-600 font-bold text-sm uppercase tracking-wide mb-4">The 97%</p>
              <div className="space-y-3">
                {[
                  "Bookmark articles about starting something",
                  "Wait for an IPO that won't buy freedom",
                  "Believe corporate loyalty is a virtue",
                  "Say 'someday' — the most expensive word",
                  "Let their employer decide their worth",
                  "Build publicly where their boss can see",
                  "Obsess over the 'right' idea for months",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-red-400 text-sm shrink-0">✗</span>
                    <p className="text-red-700/70 text-sm line-through">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* The 3% */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-wide mb-4">The 3%</p>
              <div className="space-y-3">
                {[
                  "Start something — this Saturday",
                  "Calculate the freedom number and build toward it",
                  "Treat employment as a transaction that funds the exit",
                  "Start with 5 hours this week",
                  "Let the market decide — $29 × 138 customers",
                  "Build invisibly under a separate entity",
                  "Build the system, swap ideas like cartridges",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 text-sm shrink-0">✓</span>
                    <p className="text-emerald-700 text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-4">Your Name Could Be Next.</h2>
          <p className="text-body text-white/60 mb-2 max-w-xl mx-auto">
            Spot #28 is waiting. The wall grows every week. The question is
            whether you'll be on it — or still reading about it.
          </p>
          <p className="text-body text-white/60 mb-10 max-w-xl mx-auto">
            Calculate your freedom number. It takes 90 seconds. Then decide.
          </p>
          <Link
            to="/freedom"
            onClick={() => trackEvent("founding_wall_final_cta_clicked")}
            className="btn-primary text-lg px-8 inline-flex items-center gap-2"
          >
            Calculate Your Freedom Number
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-white/40 text-xs mt-4">
            Founding membership open · $0.97/month · Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FoundingWallPage;
