import { useState } from "react";
import { Link } from "react-router-dom";
import { Mic, Copy, Check, Clock, Mail, ArrowRight, Radio } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const STORY_FORMATS = [
  {
    duration: "5 min",
    icon: Clock,
    title: "The Elevator Version",
    use: "Podcast intros, networking, quick interviews",
    body: `I'm Adrian. Managing Director at a European tech company. $120K salary, less than 0.5% equity.

Six months ago, I was in a taxi in Amsterdam at 6 AM on the first morning of my family vacation. Two notifications hit my phone simultaneously.

The first: corporate escalation emails. People at my company fighting over responsibilities at 6 AM on my vacation.

The second: a Stripe notification. "$0.97 received." A stranger had paid for a landing page I built while I slept.

I screamed in the taxi. The driver thought I was insane.

That $0.97 wasn't money. It was proof that the cage has a door. That's when I realized: my salary isn't my worth. It's one income stream. And I needed to build more.

I built Invisible Exit — 5 tools that help corporate managers build anonymous recurring revenue while employed. $0.97/month. Still employed. Still invisible.`,
  },
  {
    duration: "15 min",
    icon: Clock,
    title: "The Standard Interview Version",
    use: "Standard podcast segments, guest appearances",
    body: `THE SETUP: I'm 37. Managing Director at a European tech company. $120K salary. Less than 0.5% equity. On paper, I won the career lottery. I managed teams of 40+. Ran P&L reviews. Navigated corporate politics.

THE FALSE PEACE: For 8 years, I told myself the same story: the IPO is coming. When it comes, my 0.5% becomes real money. The golden handcuffs felt like a partnership.

THE MATH: Then I did the math. $1B exit × 0.5% = $5M. After dilution and taxes: $2.4M. Invested at 5%: $120K/year. That's my salary. Even a billion-dollar exit doesn't buy freedom. It buys a longer leash.

THE EPIPHANY: Amsterdam. 6 AM. Taxi. Two notifications side by side. Corporate email — colleagues fighting over responsibilities at 6 AM on my vacation. Stripe notification — $0.97 from a stranger. I screamed. My wife understood: this wasn't about money. This was proof the cage has a door.

THE 3 SECRETS I LEARNED:
1. Your job is the launchpad, not the trap. Your salary is runway funding. Your corporate skills are what solo founders lack. Your 5 hours/week forces focus.
2. Anonymity is your greatest asset. Separate entity, separate name, separate everything. You can experiment without fear.
3. The system beats the idea. I spent 3 months choosing the "right" idea. Then launched the wrong one. It made $9/month. The system worked regardless.

THE RESULTS: Month 1-3: zero customers. Month 4: first $9 customer. Month 6: $850 MRR. Month 9: $2,100 MRR. Month 12: $4,100 MRR. Still employed. Still invisible.

THE LESSON: The first dollar online isn't about money. It's about the identity shift from employee to owner. Once you feel it, you can't unfeel it.`,
  },
  {
    duration: "45 min",
    icon: Clock,
    title: "The Full Masterclass Version",
    use: "Long-form podcasts, keynote talks, webinars",
    body: `[Full 10-chapter Epiphany Bridge narrative — same as /story page]

This version covers:
- Chapter 1: Background (the perfect employee)
- Chapter 2: The Hook (0.5% equity math)
- Chapter 3: The Origin (Amsterdam taxi)
- Chapter 4: The Epiphany (corporate loyalty is a transaction)
- Chapter 5: Secret #1 — The Vehicle (your job is the launchpad)
- Chapter 6: Secret #2 — The Stealth (anonymity as strategy)
- Chapter 7: Secret #3 — The System (system beats idea)
- Chapter 8: Internal Conflict (Month 4, the wall, almost quit)
- Chapter 9: External Conflict (competitor near-miss)
- Chapter 10: The One Thing (12-month timeline, $4,100 MRR)

For the full version, read: invisibleexit.com/story`,
  },
];

const PITCH_TEMPLATES = [
  {
    name: "Cold Podcast Pitch",
    subject: "Story pitch: The manager who screamed in a taxi over $0.97",
    body: `Hi [HOST_NAME],

I've been listening to [PODCAST_NAME] since [SPECIFIC_EPISODE]. Your episode on [SPECIFIC_TOPIC] changed how I think about [SPECIFIC_THING].

I have a story your audience would love:

I'm a 37-year-old Managing Director at a European tech company. $120K salary, 0.5% equity. I was the perfect employee — until a taxi ride in Amsterdam at 6 AM changed everything.

Two notifications hit my phone simultaneously:
1. Corporate escalation emails (colleagues fighting over responsibilities on my vacation)
2. A Stripe notification ($0.97 from a stranger who bought something I built)

I screamed in the taxi. The $0.97 wasn't money — it was proof that the cage has a door.

Over the next 12 months, I built $4,100/month in recurring revenue while still employed. My employer never found out. I turned down a promotion. I documented everything.

The story covers:
- The math that proves even a $1B IPO won't buy freedom
- How anonymity is a competitive advantage (not a limitation)
- The "Month 4 wall" every founder hits
- Why your job is the perfect launchpad, not a trap

I can do 15 or 45 minutes. Happy to share the full timeline, revenue numbers, and the stealth system.

Would this fit your show?

Adrian
escape@invisibleexit.com
invisibleexit.com/story`,
  },
  {
    name: "Warm Intro Pitch",
    subject: "Following up — the anonymous founder story for [PODCAST_NAME]",
    body: `Hi [HOST_NAME],

Following up on my note from last week. I know you're busy, so I'll keep this short.

I'm the anonymous Managing Director who built $4,100/month in side revenue while employed — without my employer finding out. The story involves a $0.97 Stripe notification in an Amsterdam taxi that triggered an identity shift.

Your audience of [AUDIENCE_DESCRIPTION] is exactly who this story is for. I can talk about:
- Why I turned down a VP promotion (the math)
- The stealth setup that saved my career (3 seconds of panic on a team call)
- The boring product (a PDF generator for electricians) that pays my mortgage
- The system that lets you build in 5 hours/week

15 or 45 minutes. Your call. I'm flexible on timing.

Here's the full story if you want to prep: invisibleexit.com/story

Adrian`,
  },
  {
    name: "Guest Post Pitch",
    subject: "Article pitch: 'Even a $1B IPO won't buy your freedom' (with math)",
    body: `Hi [EDITOR_NAME],

I'd like to pitch an article for [PUBLICATION_NAME]:

**Title:** Even a $1B IPO Won't Buy Your Freedom (Here's the Math)

**Angle:** Corporate managers earning $120K-$200K with <0.5% equity are trapped by a math problem they've never calculated. I'll break down the numbers (even a billion-dollar exit barely covers your salary in passive income) and share the alternative: building $4,000/month in recurring revenue while employed.

**What I'll cover:**
- The equity math (with real numbers, not platitudes)
- Why I turned down a VP promotion (the side-business math won)
- The "stealth ops" framework (entity separation, compliance)
- How to build in 5 hours/week without your employer finding out

**About me:** Anonymous Managing Director (37) at a European tech company. $4,100 MRR in side businesses. Identity protected by design. Founder of Invisible Exit.

**Word count:** 1,500-2,500 words. Original content. Available to write within 2 weeks.

Examples of my writing: invisibleexit.com/blog

Adrian
escape@invisibleexit.com`,
  },
];

const TARGET_PODCASTS = [
  { name: "Indie Hackers Podcast", audience: "Founders, side-hustlers", why: "Exactly our avatar: aspiring founders with day jobs" },
  { name: "My First Million", audience: "Entrepreneurs, wantrepreneurs", why: "Business ideas + execution angle fits perfectly" },
  { name: "The Side Hustle Show", audience: "Side-hustlers", why: "Literally our audience — people building on the side" },
  { name: "ChooseFI", audience: "FIRE movement", why: "Financial independence audience trapped by golden handcuffs" },
  { name: "The Tim Ferriss Show", audience: "Broad entrepreneur/optimizer", why: "Systems-thinking + anonymity angle is unique" },
  { name: "Software Engineering Daily", audience: "Engineers, tech managers", why: "High-income professionals with the skills to build" },
  { name: "Founder Podcasts (various)", audience: "Early-stage founders", why: "Origin story format matches" },
  { name: "Career transition podcasts", audience: "Professionals considering leaving", why: "The 'don't quit' message is contrarian" },
];

const PodcastPitchPage = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Podcast Pitch Kit — Story Formats & Outreach Templates | Invisible Exit"
        description="The Amsterdam taxi story in 5/15/45-minute formats plus cold pitch templates for podcast outreach. Everything you need to get on shows."
        url="/podcast-pitch"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Mic className="w-4 h-4" />
            Podcast Pitch Kit
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            The <span className="text-gradient-light">Pitch Kit</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            One podcast appearance = 1,000–10,000 new eyeballs.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            The Amsterdam story in 3 formats. Cold pitch templates. Target podcast list.
            Everything needed to start booking appearances.
          </p>
        </div>
      </section>

      {/* Story Formats */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">The Story</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">3 Formats, 1 Story</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {STORY_FORMATS.map((format) => (
              <div key={format.duration} className="card-base overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                      <format.icon className="w-4 h-4" />
                      {format.duration}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{format.title}</p>
                      <p className="text-xs text-muted-foreground">{format.use}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(format.body, `format-${format.duration}`)}
                    className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      copied === `format-${format.duration}` ? "bg-success/15 text-success" : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    {copied === `format-${format.duration}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied === `format-${format.duration}` ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="p-5 whitespace-pre-wrap text-sm text-foreground leading-relaxed font-sans">
                  {format.body}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Podcasts */}
      <section className="bg-surface section-normal border-y border-border">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">The Targets</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">Where to Pitch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {TARGET_PODCASTS.map((pod) => (
              <div key={pod.name} className="card-base p-5">
                <div className="flex items-start gap-3">
                  <Radio className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{pod.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">Audience: {pod.audience}</p>
                    <p className="text-xs text-muted-foreground italic">Why: {pod.why}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pitch Templates */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">The Outreach</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">Pitch Templates</h2>
          <div className="space-y-6 max-w-2xl mx-auto">
            {PITCH_TEMPLATES.map((pitch) => (
              <div key={pitch.name} className="card-base overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-border bg-surface/50">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{pitch.name}</p>
                    <p className="text-xs text-muted-foreground">Subject: {pitch.subject}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(pitch.body, `pitch-${pitch.name}`)}
                    className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      copied === `pitch-${pitch.name}` ? "bg-success/15 text-success" : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    {copied === `pitch-${pitch.name}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied === `pitch-${pitch.name}` ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="p-5 whitespace-pre-wrap text-sm text-foreground leading-relaxed font-sans">
                  {pitch.body}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark section-wide">
        <div className="container-narrow text-center">
          <Mic className="w-12 h-12 text-primary-light mx-auto mb-6" />
          <h2 className="text-h1 text-white mb-4">Pitch 10 This Week.</h2>
          <p className="text-body text-white/60 mb-8 max-w-xl mx-auto">
            3 will ignore you. 3 will say no. 3 will maybe. 1 will say yes.
            That 1 changes everything.
          </p>
          <Link to="/traffic-blueprint" className="btn-primary text-lg">
            Back to Traffic Blueprint
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PodcastPitchPage;
