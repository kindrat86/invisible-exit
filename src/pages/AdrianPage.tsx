import { Link } from "react-router-dom";
import { ArrowRight, Lock, MessageSquare, Mail, Video } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FrameworkDiagram from "@/components/FrameworkDiagram";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

const TIMELINE = [
  { year: "1989", event: "Born in Eastern Europe. Parents were engineers. I learned to code at 11 from a pirated QBasic manual." },
  { year: "2007", event: "First year university. Started a web design freelance business. Made €200/month. Thought I was rich." },
  { year: "2011", event: "Graduated. Took the safe job at a tech company. Folded the freelance business. First mistake." },
  { year: "2013", event: "Promoted to Senior Manager. Started believing the corporate ladder myth." },
  { year: "2016", event: "Married. My wife is a data analyst. She thinks in numbers. I think in narratives. We argue productively." },
  { year: "2018", event: "Promoted to Director. Stock options. Golden handcuffs phase 1 begins." },
  { year: "2020", event: "Daughter born. Everything changed. The stakes got real. 'Someday' started feeling expensive." },
  { year: "2022", event: "Promoted to Managing Director. 0.5% equity. IPO announced for 2025. Golden handcuffs phase 2: locked." },
  { year: "2024", event: "Amsterdam. The taxi. The $0.97. The door." },
  { year: "2025", event: "Built the system. $4,100 MRR. Still employed. Still invisible. Launched Invisible Exit to share the system." },
];

const FAQS = [
  {
    q: "Why are you anonymous?",
    a: "Because the system I teach depends on it. My employer cannot know about my side businesses. My professional network cannot connect my products to my name. If I revealed my identity, I would violate the exact principle that makes this work. Anonymity isn't a gimmick — it's the core strategy.",
  },
  {
    q: "Is 'Adrian' your real name?",
    a: "It's a name I chose for this project. It's not my legal name, but it's the name I respond to in this context. My real identity is irrelevant. What matters is whether the system works. It does. My Stripe dashboard doesn't care what I call myself.",
  },
  {
    q: "How do I know you're not lying about the revenue?",
    a: "You don't. And I can't prove it without revealing my identity, which I won't do. Here's what I can tell you: the system is based on verifiable math. $29/month × 138 customers = $4,002/month. That's not a claim — it's arithmetic. If the math makes sense to you, try the system for $0.97. If it doesn't work, refund.",
  },
  {
    q: "Will you ever reveal your identity?",
    a: "Maybe. When my employment situation changes — either I leave voluntarily or the IPO happens — I may go public. Until then, the anonymity is non-negotiable. It protects my family, my career, and the integrity of the system.",
  },
  {
    q: "How can I trust advice from someone I can't see?",
    a: "You shouldn't trust blindly. Read the story. Check the math. Try the tools for $0.97. The 30-day money-back guarantee means the risk is on me, not you. If the system doesn't work, you lose nothing. If it does, you gain everything. That's the deal.",
  },
];

const AdrianPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Who Is Adrian? — The Anonymous Founder Behind Invisible Exit"
        description="37-year-old Managing Director. $120K salary. <0.5% equity. Building $4K/month on the side. Identity protected by design."
        url="/adrian"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary-light mb-6">The Attractive Character</p>

          {/* Visual identity — anonymous avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-primary to-accent-primary flex items-center justify-center border-4 border-white/10 shadow-2xl shadow-primary/20">
                <span className="text-5xl sm:text-6xl font-bold text-white">A</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[hsl(142_71%_45%)] text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-[hsl(222_47%_11%)]">
                ANONYMOUS
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            I'm <span className="text-gradient-light">Adrian</span>.
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-4">
            37. Managing Director. $120K salary. Less than 0.5% equity.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto mb-8">
            Building $4,000+/month in invisible recurring revenue while employed.
            Identity protected — because that's the whole point.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/story"
              onClick={() => trackEvent("adrian_story_clicked")}
              className="btn-primary text-lg"
            >
              Read My Full Story
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/masterclass"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
            >
              <Video className="w-4 h-4" /> Watch the Masterclass
            </Link>
          </div>
        </div>
      </section>

      {/* The Archetype */}
      <section className="bg-white section-normal">
        <div className="container-standard">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-eyebrow text-primary mb-4">The Archetype</p>
            <h2 className="text-h1 text-foreground mb-4">The Reluctant Hero</h2>
            <p className="text-body text-muted-foreground">
              I didn't want to build this. I wanted the IPO to save me. When it couldn't,
              I built the door myself — reluctantly, imperfectly, and only because the
              alternative was spending the rest of my life in a cage I was pretending was
              a corner office.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Before",
                state: "The Believer",
                body: "Believed in corporate loyalty. Believed the 0.5% would save him. Believed 'someday' was a plan.",
                color: "text-muted-foreground",
              },
              {
                title: "The Shift",
                state: "The Skeptic",
                body: "Amsterdam. Did the math. Realized the golden handcuffs were never designed to come off. Started building in secret.",
                color: "text-primary",
              },
              {
                title: "After",
                state: "The Reluctant Leader",
                body: "$4,100 MRR. Still employed. Built the system, then built a platform to share it. Not because he wanted to lead — because the math demanded it.",
                color: "text-success",
              },
            ].map((phase) => (
              <div key={phase.title} className="card-base p-6">
                <p className="text-eyebrow text-muted-foreground mb-2">{phase.title}</p>
                <h3 className={`text-lg font-bold mb-3 ${phase.color}`}>{phase.state}</h3>
                <p className="text-caption">{phase.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before the Before — false peace */}
      <section className="bg-surface section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">Before the Before</p>
          <h2 className="text-h1 text-foreground mb-6 text-center">I was happy. That was the problem.</h2>
          <div className="max-w-2xl mx-auto text-body text-muted-foreground space-y-5">
            <p>
              Before Amsterdam, before the math, before any of this — I was content. Genuinely content.
              I liked my job. I respected my colleagues. I believed in the mission. The promotion ladder
              felt like a path, not a trap.
            </p>
            <p>
              Every year, I'd get a raise. Every two years, more equity. The IPO was "coming." I'd look at
              my stock options spreadsheet and feel a warm glow of future wealth. I'd read startup
              failure stories and feel grateful I had a "real" job.
            </p>
            <p>
              That false peace was the most dangerous part. Not because I was unhappy — unhappy people
              change things. Because I was <em className="text-foreground">comfortable</em>. Comfortable
              people don't look for doors. They don't even see the cage.
            </p>
            <p className="text-foreground font-medium">
              The cage didn't feel like a cage. It felt like a corner office with a nice chair and a
              good dental plan. That's what made it so effective.
            </p>
          </div>
        </div>
      </section>

      {/* The Dark Night — dramatized "All is Lost" */}
      <section className="bg-white section-normal border-t border-border">
        <div className="container-narrow">
          <p className="text-eyebrow text-muted-foreground mb-4 text-center">The Dark Night</p>
          <h2 className="text-h1 text-foreground mb-6 text-center">The Tuesday I Almost Deleted Everything</h2>
          <div className="max-w-2xl mx-auto text-body text-muted-foreground space-y-5">
            <p>
              Month 4. A Tuesday in November. 11 PM. My daughter was asleep. My wife was reading
              in the other room. I sat at my desk staring at a Stripe dashboard that read <strong className="text-foreground">$0.00</strong>.
            </p>
            <p>
              I'd launched 6 weeks ago. I'd told 200 people on an email list. I'd posted in 3 Reddit
              communities. I'd optimized the landing page 12 times. Zero customers. Not even a free trial sign-up
              in 9 days.
            </p>
            <p>
              The voice in my head was loud and specific: <em className="text-foreground">"You're not a founder. You're a manager. Go back to managing. This isn't for you. Delete the domain, cancel the hosting, stop pretending."</em>
            </p>
            <p>
              I had my cursor over the "Cancel Subscription" button on the hosting dashboard. My hand was on
              the mouse. I could feel the relief of giving up — the comfort of going back to just being an employee.
            </p>
            <p className="text-foreground font-medium">
              Then I opened my Freedom Number calculation. <strong>$4,000/month MRR = optionality.</strong>
              The math hadn't changed because I had a bad week. The math doesn't care about feelings.
              I closed the hosting tab. I opened the Idea Pipeline. I pivoted.
            </p>
            <p>
              Two weeks later: first paying customer. $9/month. A stranger in Ohio. I didn't scream this time.
              I just sat quietly and thought: <em className="text-primary">the door is still there.</em>
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-surface section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">Origin Story</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">The Full Timeline</h2>
          <div className="relative max-w-2xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />
            {TIMELINE.map((item, i) => (
              <div
                key={item.year}
                className={`relative flex items-start gap-6 mb-8 ${
                  i % 2 === 0 ? "sm:flex-row-reverse sm:text-right" : ""
                }`}
              >
                <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full bg-primary -translate-x-1/2 mt-2 ring-4 ring-surface" />
                <div className="ml-12 sm:ml-0 sm:w-1/2 sm:px-6">
                  <p className="text-primary font-bold text-lg mb-1">{item.year}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beliefs */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">What I Believe</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">My Core Beliefs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                belief: "Corporate loyalty is a transaction, not a virtue.",
                body: "Companies design equity structures to keep you, not to reward you. Less than 0.5% is a leash disguised as a partnership.",
              },
              {
                belief: "The acquisition payout is a lottery ticket.",
                body: "You can't build your life on someone else's exit timeline. Even a $1B exit, after dilution and taxes, invested at 5%, barely covers your salary.",
              },
              {
                belief: "Your corporate experience is founder gold.",
                body: "15 years of operations experience isn't a weakness. It's what solo founders lack. You understand customers, systems, and execution better than anyone with just a pitch deck.",
              },
              {
                belief: "You don't need to quit to start.",
                body: "You don't need a co-founder. You don't need venture capital. You need 5 hours a week and a system that works within your constraints.",
              },
              {
                belief: "Anonymity is a strategy, not a limitation.",
                body: "When you're anonymous, you can experiment without fear. Fail publicly without consequences. Build in any market. The mask is the advantage.",
              },
              {
                belief: "The system beats the idea.",
                body: "Stop obsessing over the 'right' idea. Build the system first. Once you have the system, you can swap ideas in and out like cartridges.",
              },
            ].map((item) => (
              <div key={item.belief} className="card-base p-6">
                <h3 className="font-bold text-foreground mb-3 text-lg leading-snug">
                  {item.belief}
                </h3>
                <p className="text-caption">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Framework */}
      <section className="bg-surface section-normal border-t border-border">
        <div className="container-standard">
          <p className="text-eyebrow text-primary mb-4 text-center">My System</p>
          <h2 className="text-h1 text-foreground mb-4 text-center">The Invisible Exit Framework</h2>
          <p className="text-body text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            This is the system I built. It's not theory. It's what took me from $0 to $4,100 MRR.
          </p>
          <FrameworkDiagram />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">Questions</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">About Adrian</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {FAQS.map((faq) => (
              <div key={faq.q} className="card-base p-6">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-caption">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-white mb-4">This is who I am.</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            A 37-year-old Managing Director who figured out the cage has a door.
            The system works. I'm proof.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/freedom" className="btn-primary text-lg">
              Calculate Your Freedom Number
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/story"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
            >
              Read my full story →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdrianPage;
