import { Link } from "react-router-dom";
import {
  Anchor,
  BookOpen,
  Gift,
  ArrowRight,
  Copy,
  Check,
  Target,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface HSOEntry {
  id: string;
  channel: string;
  hook: string;
  story: string;
  offer: string;
  cta: string;
  landingPage: string;
}

const HSO_MATRIX: HSOEntry[] = [
  {
    id: "twitter-equity",
    channel: "Twitter/X Thread",
    hook: "Your 0.5% equity is worth less than you think (the math that ended my corporate loyalty)",
    story: "I spent 8 years believing the IPO was coming. $1B exit × 0.5% = $5M, right? After dilution (3 rounds), taxes, and vesting cliffs, the real number was $1.7M. Invested at 5%: $85K/year. Less than my salary. The golden handcuffs aren't a partnership. They're a leash.",
    offer: "See the full equity math breakdown and calculate your own freedom number.",
    cta: "Calculate Your Freedom Number",
    landingPage: "/freedom",
  },
  {
    id: "reddit-ih",
    channel: "Reddit (Indie Hackers)",
    hook: "Corporate manager, built $4,100 MRR while employed. Here's the full timeline.",
    story: "Month 1-3: zero customers. Month 4: first $9 customer. Month 6: $850 MRR. Month 9: $2,100. Month 12: $4,100. I didn't have a better idea than anyone else. I had a better system. 5 tools, 5 hours/week, completely anonymous. Still employed.",
    offer: "5 tools that help you do the same — $0.97/month to start.",
    cta: "See the 5-Tool System",
    landingPage: "/masterclass",
  },
  {
    id: "linkedin-identity",
    channel: "LinkedIn Post",
    hook: "The first $0.97 I earned online changed my relationship with my $120K salary.",
    story: "For 8 years, I defined myself by my salary. $120K = what I'm worth. Then a stranger paid me $0.97 for something I built while I slept. Suddenly my salary wasn't my identity — it was one income stream. The shift: employee to owner. That's the real value of the first dollar.",
    offer: "Calculate your freedom number and start the identity shift.",
    cta: "Start Your Shift",
    landingPage: "/freedom",
  },
  {
    id: "youtube-stealth",
    channel: "YouTube Video",
    hook: "How to build a side business without your employer finding out",
    story: "The Stealth Ops setup: separate entity, separate name, separate Stripe, different hosting, anonymous domain registration. When my colleague found a website that looked like my side project on a team call, I had 3 seconds of panic. Then I remembered: zero connection to me. The call moved on. Career saved by $25/month of entity separation.",
    offer: "Audit your own stealth setup with the Stealth Ops Hub.",
    cta: "Audit Your Stealth Score",
    landingPage: "/freedom",
  },
  {
    id: "email-soap-opera",
    channel: "Email (Soap Opera)",
    hook: "I screamed in a taxi over $0.97",
    story: "6 AM. Amsterdam. First morning of my family vacation. Two notifications hit my phone. First: corporate emails — colleagues fighting over responsibilities. Second: Stripe — $0.97 from a stranger. I screamed. My wife thought I was insane. But it wasn't about the money. It was proof the cage has a door.",
    offer: "Get the 5-tool system that started with that $0.97.",
    cta: "See the System",
    landingPage: "/freedom",
  },
  {
    id: "podcast-amsterdam",
    channel: "Podcast Interview",
    hook: "The Amsterdam Taxi Story (origin of Invisible Exit)",
    story: "[5-minute version]: Managing Director at a European tech company. $120K salary. 0.5% equity. On paper, I won the career lottery. Then I did the math on my equity. Then I got a Stripe notification at 6 AM on vacation. The rest is the Invisible Exit story.",
    offer: "Invisible Exit — 5 tools for corporate managers who want invisible income.",
    cta: "Visit invisibleexit.com",
    landingPage: "/",
  },
  {
    id: "blog-pillar",
    channel: "Blog (Pillar Post)",
    hook: "How to Build a $4,000/Month Side Business While Employed (Without Quitting)",
    story: "The complete 12-month playbook: Month 1-2 (system setup), Month 3-4 (first product, first customer), Month 5-8 ($100-$850 MRR), Month 9-12 ($850-$4,100 MRR). Every tool, every framework, every mistake. This is the system beats idea manifesto.",
    offer: "Get all 5 tools in the Invisible Exit membership ($0.97/mo).",
    cta: "Start Building",
    landingPage: "/freedom",
  },
  {
    id: "quora-quit",
    channel: "Quora Answer",
    hook: "Should I quit my $120K job to start a business?",
    story: "No. Don't quit. Your salary is runway funding. Your job is the launchpad, not the trap. Use your corporate income to fund your side business. 5 hours/week is enough if you have a system. I built $4,100 MRR while employed. Never quit. Graduate.",
    offer: "Calculate your freedom number first — then decide.",
    cta: "Calculate Your Freedom Number",
    landingPage: "/freedom",
  },
];

const HSO_FRAMEWORK = [
  {
    icon: Anchor,
    name: "Hook",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    description: "Grab attention in 3 seconds. Pattern interrupt. Curiosity, fear, or contrarian claim. Must make stopping impossible.",
    checklist: [
      "Does it create an open loop?",
      "Is it specific (numbers, not adjectives)?",
      "Does it target one of the 5 deep desires or fears?",
      "Could you scroll past it?",
    ],
  },
  {
    icon: BookOpen,
    name: "Story",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    description: "Deliver the hook's promise through narrative. The Epiphany Bridge. Show the transformation. Make them feel it.",
    checklist: [
      "Does it follow the Hero's Journey arc?",
      "Is there a specific moment of epiphany?",
      "Are there concrete details (dates, amounts, names)?",
      "Does it create emotional identification?",
    ],
  },
  {
    icon: Gift,
    name: "Offer",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    description: "The offer isn't the product. It's the transformation. What life looks like after. Stack the value. Remove the risk.",
    checklist: [
      "Is it transformation-based (not feature-based)?",
      "Is there a value stack (total value > price)?",
      "Is there risk reversal (guarantee)?",
      "Is there urgency or scarcity?",
    ],
  },
];

const HSO_MATRIX_PAGE = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Hook, Story, Offer Matrix — 8 Content Frameworks | Invisible Exit"
        description="Russell Brunson's Hook-Story-Offer framework applied to 8 content channels: Twitter, Reddit, LinkedIn, YouTube, email, podcast, blog, and Quora."
        url="/hso"
      />
      <Navbar />

      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Layers className="w-4 h-4" />
            Secret #5: Hook, Story, Offer
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            The HSO <span className="text-gradient-light">Matrix</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            Russell's framework: every piece of content needs a Hook, a Story, and an Offer.
            Here are 8 ready-to-deploy HSO combinations across every traffic channel.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            Copy. Paste. Post. Each comes with hook, story, offer, CTA, and landing page.
          </p>
        </div>
      </section>

      {/* Framework */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">The Framework</h2>
          <p className="text-muted-foreground mb-8">
            Russell says: all traffic fails without the right H/S/O. Master this first.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HSO_FRAMEWORK.map((f) => (
              <div key={f.name} className="card-base p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center`}>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{f.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{f.description}</p>
                <ul className="space-y-2">
                  {f.checklist.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Matrix */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            8 Ready-to-Deploy HSO Combinations
          </h2>
          <p className="text-muted-foreground mb-8">
            Each entry is a complete content unit. Copy it into your channel of choice.
          </p>
          <div className="space-y-6">
            {HSO_MATRIX.map((entry) => (
              <div key={entry.id} className="card-base overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-primary" />
                    <span className="font-bold text-foreground">{entry.channel}</span>
                  </div>
                  <Link
                    to={entry.landingPage}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    → {entry.landingPage}
                  </Link>
                </div>
                <div className="p-5 space-y-4">
                  {/* Hook */}
                  <div>
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-wide mb-1">▶ Hook</p>
                    <p className="text-foreground font-semibold">{entry.hook}</p>
                  </div>
                  {/* Story */}
                  <div>
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-1">📖 Story</p>
                    <p className="text-body text-muted-foreground leading-relaxed">{entry.story}</p>
                  </div>
                  {/* Offer */}
                  <div>
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-wide mb-1">🎁 Offer</p>
                    <p className="text-body text-foreground">{entry.offer}</p>
                  </div>
                  {/* CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">CTA</p>
                      <p className="text-sm text-primary font-medium">{entry.cta}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(`HOOK: ${entry.hook}\n\nSTORY: ${entry.story}\n\nOFFER: ${entry.offer}\n\nCTA: ${entry.cta}`, entry.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        copied === entry.id
                          ? "bg-success/15 text-success"
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                      }`}
                    >
                      {copied === entry.id ? (
                        <><Check className="w-4 h-4" /> Copied!</>
                      ) : (
                        <><Copy className="w-4 h-4" /> Copy HSO</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HSO_MATRIX_PAGE;
