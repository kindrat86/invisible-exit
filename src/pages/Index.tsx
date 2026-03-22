import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Invisible Exit: How Corporate Managers Build Recurring Revenue Invisibly";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "The Invisible Exit Method: how Managing Directors and corporate executives build $2,500-$4,000/month in recurring revenue using AI, without their employer knowing. By Adrian."
      );
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "Invisible Exit: How Corporate Managers Build Recurring Revenue Invisibly");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc)
      ogDesc.setAttribute(
        "content",
        "The Invisible Exit Method: how MDs build $2,500-$4,000/month in recurring revenue using AI, invisibly."
      );
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", "https://invisibleexit.com");
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      email: email.trim().toLowerCase(),
      source: "funnel-hub",
    });
    setLoading(false);
    if (error && error.code !== "23505") {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero -- Hook: Identity + Curiosity */}
      <section className="bg-[#1B2A4A] pt-32 pb-24 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            I'm a Managing Director. I Build Businesses Nobody Knows About. This Is My Story.
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto">
            My name is Adrian. I earn $120K/year, hold 0.01% equity, and have 18 months until the IPO window. I also have invisible recurring revenue that my employer will never see. Here's how that happened.
          </p>
        </div>
      </section>

      {/* The Backstory -- Brunson: Hero's Two Journeys */}
      <article className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-400 text-sm tracking-widest uppercase mb-8">THE BACKSTORY</p>
          <div className="text-gray-700 text-lg leading-[1.8] space-y-6">
            <p>
              I wake at 6:30 AM in a nice apartment in a European city. My wife is already getting our 8-year-old ready for school. Before my feet hit the floor, I check my phone: Slack notifications, email chains from last night, someone escalated a conflict about responsibilities. Again.
            </p>
            <p>
              I shower, put on a good suit, kiss my kid, and commute 25 minutes to an office where I'm the highest-ranking operational leader. By 9 AM I'm mediating between teams who can't agree on who owns what. By 11 AM I'm on a call with a founder who makes decisions I disagree with but can't override. By 2 PM I'm reviewing metrics that prove my execution is carrying the company. By 5 PM I'm resolving another grey-zone conflict between colleagues who have bigger equity than me but contribute less.
            </p>
            <p>
              I get home at 7 PM. Dinner with my family. Put my kid to bed. Sit on the couch with my wife. Open YouTube. Watch Alex Hormozi talk about building real wealth. Watch Matt Wolfe review AI tools. Open Reddit: r/microsaas, r/entrepreneur. Read about solo founders building $5K-$10K MRR businesses.
            </p>
            <p>
              At 11 PM, the voice starts: "Maybe I should just wait for the IPO." "You're good at your job, maybe that's enough." "Your family is happy. Why risk it?" "You've failed before. What makes this time different?" "You're 37. Real founders started at 22."
            </p>
            <p>
              I close the laptop. Go to bed. Set the alarm. The cycle repeats.
            </p>
          </div>
        </div>
      </article>

      {/* The Separation -- what made Adrian different */}
      <article className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-400 text-sm tracking-widest uppercase mb-8">THE MOMENT EVERYTHING CHANGED</p>
          <div className="text-gray-700 text-lg leading-[1.8] space-y-6">
            <p>
              One evening, I sat down and did the math. I have 0.01% equity. If the company sells for $100 million -- a very optimistic scenario -- my share is $10,000. Before tax. After 5 years of giving this company everything.
            </p>
            <p>
              I watched colleagues check their stock prices. I watched Americans in similar roles making multiples more. And the truth hit: even if this company sells, my share won't set me free. 0.01% is not a partnership. It's a leash.
            </p>
            <p>
              I'd tried before. A cybersecurity venture with a partner who had a worker's mentality. Failed. An app development project with someone who thought like an employee. Failed. Random products that made a few dollars but never scaled. Every attempt crashed into the same walls: no time, compliance risk, the wrong partners, and the constant fear of discovery.
            </p>
            <p>
              Then AI happened. And the math changed completely.
            </p>
          </div>
        </div>
      </article>

      {/* The Epiphany Bridge -- Brunson: THE core story */}
      <article className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-white/40 text-sm tracking-widest uppercase mb-8">THE EPIPHANY</p>
          <div className="text-white/80 text-lg leading-[1.8] space-y-6">
            <p>
              Amsterdam. 6 AM. Raining. I had just landed on a KLM flight with my wife and 8-year-old for a family vacation. We climbed into a Tesla taxi outside Schiphol. The driver started the meter. My phone buzzed.
            </p>
            <p>
              Two notifications sat side by side in the same tray.
            </p>
            <p>
              The first: a chain of corporate escalation emails. People at my company fighting over responsibilities, grey zones, internal conflicts that had been kicked up to me. Again. At 6 AM. On the first morning of my vacation.
            </p>
            <p>
              The second: a Stripe notification. "$0.97 received."
            </p>
            <p>
              A complete stranger, somewhere in the world, had found a landing page I built for plumbers in the USA. A business I know nothing about. In a country I don't live in. Under a name that isn't mine. And they paid me. While I slept on a plane.
            </p>
            <p className="text-white text-xl font-medium">
              I screamed.
            </p>
            <p>
              The taxi driver looked in the rearview mirror, shocked. He asked: "Hey, does KLM offer cakes on the plane?" He thought I was high.
            </p>
            <p>
              My wife looked at me like I was insane. Screaming about less than one euro in a taxi in Amsterdam. Then she saw my face. And she understood: this wasn't about the money. This was the proof that the cage has a door.
            </p>
            <p>
              I didn't explain anything to the driver. Just smiled. "No, no. Received very nice news." He started telling us about Amsterdam, how the Dutch survived by fighting the water and then became the biggest empire in the world. From zero to hero. It was a good parallel.
            </p>
          </div>
        </div>
      </article>

      {/* The Transformation -- Brunson: Internal journey */}
      <article className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-400 text-sm tracking-widest uppercase mb-8">WHAT CHANGED INSIDE</p>
          <div className="text-gray-700 text-lg leading-[1.8] space-y-6">
            <p>
              Later that day, I jumped on a call for those corporate escalations. People fighting over who should do what. And something had shifted. I told them: "The world is changing. You need to become decision makers, not children who need me each time you cannot agree."
            </p>
            <p>
              My co-workers were surprised by my directness. I had always thought like that, but wore the corporate mask, stayed politically correct. The $0.97 didn't just validate my business. It freed my mind.
            </p>
            <p>
              I resolved the issue faster, better, more effectively, because I was already detached from the corporate game. I wasn't playing for survival anymore. I was playing while already planning my exit.
            </p>
            <p>
              That afternoon, sitting somewhere in Amsterdam with my family, I looked at my wife and kid and thought: we will be free. We will travel wherever we want, whenever we want, without being dependent on a corporate calendar.
            </p>
            <p>
              The irony: the moment I stopped caring about the corporate game, I became better at it. The $0.97 made me a better Managing Director, because I was no longer playing for survival.
            </p>
          </div>
        </div>
      </article>

      {/* The New Opportunity -- what Adrian discovered */}
      <article className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-400 text-sm tracking-widest uppercase mb-8">WHAT I DISCOVERED</p>
          <div className="text-gray-700 text-lg leading-[1.8] space-y-6">
            <p>
              The $0.97 was proof. Proof that a complete stranger will pay you for something you built alone, with AI, anonymously, while sleeping. And if $0.97 works, $97 works. $970 works. $9,700/month works. The model scales. And nobody needs to know.
            </p>
            <p>
              What used to take 40 hours a week now takes 5. What used to require a development team now requires AI tools and clear instructions. What used to be visible to your employer can now be completely invisible.
            </p>
            <p>
              I'm not selling you anything here. I'm telling you what happened. A Managing Director with 0.01% equity, an 18-month IPO clock, and a family to protect found a way to build recurring revenue that his employer will never see.
            </p>
            <p>
              If you're in a similar position -- golden handcuffs, limited time, compliance constraints -- and you want to follow this journey, I write about it. The frameworks, the failures, the numbers, the tools. Everything I learn, documented as I go.
            </p>
          </div>
        </div>
      </article>

      {/* The Villain -- Brunson: Polarity creates movement */}
      <article className="bg-[#1B2A4A] py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-white/40 text-sm tracking-widest uppercase mb-8">WHAT I BELIEVE</p>
          <div className="text-white/80 text-lg leading-[1.8] space-y-6">
            <p>
              Corporate loyalty is a transaction, not a virtue. Companies design equity structures to retain you, not to reward you. 0.01% is not a partnership. It's a leash disguised as an incentive.
            </p>
            <p>
              The acquisition payout is a lottery ticket. You can't build your life on someone else's exit timeline.
            </p>
            <p>
              Your 15 years of corporate operations experience isn't a weakness. It's founder gold. You understand customers, systems, and execution better than any 22-year-old with a pitch deck.
            </p>
            <p>
              You don't need to quit your job to start. You don't need a co-founder. You don't need venture capital. You don't need anyone's permission. You need 5 hours a week and a system that works within your constraints.
            </p>
            <p>
              The cage has a door. Most people never look for it.
            </p>
          </div>
        </div>
      </article>

      {/* Email Capture -- the only CTA */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-xl text-center">
          {submitted ? (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                You're In.
              </h2>
              <p className="text-gray-600 text-lg">
                Check your inbox. I'll send you what I'm learning as I build -- the numbers, the frameworks, the failures. No hype. No pitch decks. Just the journey.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Follow the Journey
              </h2>
              <p className="text-gray-600 text-lg mb-10">
                I document everything: the frameworks, the failures, the revenue numbers, the tools that work and the ones that don't. If you're in a similar position, join the list. No spam. No sales pitches. Just the truth about building invisible income.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-5 py-4 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#60A5FA] transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1B2A4A] hover:bg-[#0f1a2e] text-white font-semibold px-8 py-4 rounded-xl transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? "..." : "Join"}
                </button>
              </form>
              <p className="text-gray-400 text-sm mt-4">
                No credit card. No sales funnel. Just updates from someone building the same thing you're thinking about.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* About -- Brunson: Character Flaws create relatability */}
      <article className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-400 text-sm tracking-widest uppercase mb-8">ABOUT ADRIAN</p>
          <div className="text-gray-700 text-lg leading-[1.8] space-y-6">
            <p>
              I'm 37. Managing Director at a 26-year-old tech company in Europe. $120K salary. 0.01% equity. Married, one kid. I've failed at more side projects than I'd like to admit: a cybersecurity venture, app development, random product ideas that went nowhere.
            </p>
            <p>
              I'm not a guru. I'm not selling a course. I'm a corporate manager who's building invisible income and documenting the process in real time. The wins and the failures. The revenue and the doubts.
            </p>
            <p>
              My identity is protected because that's the whole point. If I can build this without anyone knowing who I am, so can you.
            </p>
          </div>
          <p className="text-gray-400 text-sm mt-8 text-right">-- Adrian, The Quiet Rebel</p>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default Index;
