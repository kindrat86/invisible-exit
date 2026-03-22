import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, Rocket, Eye, BarChart3, Lightbulb, Shield, Radio, Palette, ArrowRight, Check } from "lucide-react";

const TOOLS = [
  {
    icon: BarChart3,
    name: "FYM Dashboard",
    tagline: "Track your freedom number",
    starter: "Basic calculator, 1 scenario",
    full: "Unlimited scenarios, trends, export",
  },
  {
    icon: Lightbulb,
    name: "Idea Pipeline",
    tagline: "Validate micro-SaaS ideas in 48 hours",
    starter: "3 ideas, basic validation",
    full: "Unlimited ideas, AI analysis, scoring",
  },
  {
    icon: Shield,
    name: "Stealth Ops Hub",
    tagline: "Stay invisible to your employer",
    starter: "Basic invisibility score",
    full: "Full audit, fixes, compliance playbook",
  },
  {
    icon: Radio,
    name: "Launch Control",
    tagline: "Ship products faster than your day job allows",
    starter: "View-only checklist",
    full: "Full launch automation, tracking",
  },
  {
    icon: Palette,
    name: "Brand Manager",
    tagline: "Build your anonymous brand presence",
    starter: "Basic templates",
    full: "Content calendar, YouTube scripts, Reddit playbooks",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [foundingCount, setFoundingCount] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Invisible Exit — Build Invisible Recurring Revenue While Employed";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "5 AI-powered tools for corporate managers building anonymous micro-SaaS businesses. Start for $0.97/month."
      );
    }
  }, []);

  useEffect(() => {
    const fetchFoundingCount = async () => {
      const { data, error } = await supabase.rpc("get_founding_member_count");
      if (!error && data !== null) setFoundingCount(data);
    };
    fetchFoundingCount();
  }, []);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier: "starter", returnUrl: window.location.origin + "/oto/founding" },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const foundingSpots = foundingCount !== null ? Math.max(0, 100 - foundingCount) : null;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero -- Hook + CTA above fold */}
      <section className="bg-[#1B2A4A] pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[#60A5FA] text-sm tracking-widest uppercase mb-6">FOR CORPORATE MANAGERS WHO WANT OUT</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            I Built a $10K/Month Business While My Employer Had No Idea
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto mb-4">
            5 AI-powered tools that help you calculate your freedom number, validate ideas, stay invisible, launch products, and build your brand — all in 5 hours a week.
          </p>
          <p className="text-white/50 text-base mb-10">
            Worth $97/month individually. Start for $0.97/month.
          </p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="bg-[#60A5FA] hover:bg-[#3b82f6] text-white font-bold text-lg px-10 py-5 rounded-xl transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {checkoutLoading ? "Loading..." : "Start Your Invisible Exit — $0.97/month"}
            {!checkoutLoading && <ArrowRight className="w-5 h-5" />}
          </button>
          <p className="text-white/40 text-sm mt-4">Cancel anytime. No contracts. No sales calls.</p>
        </div>
      </section>

      {/* The Backstory -- A Day in Ivan's Life */}
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
            <p>I close the laptop. Go to bed. Set the alarm. The cycle repeats.</p>
          </div>
        </div>
      </article>

      {/* The Moment Everything Changed */}
      <article className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-400 text-sm tracking-widest uppercase mb-8">THE MOMENT EVERYTHING CHANGED</p>
          <div className="text-gray-700 text-lg leading-[1.8] space-y-6">
            <p>
              One evening, I sat down and did the math. I have 0.01% equity. If the company sells for $100 million — a very optimistic scenario — my share is $10,000. Before tax. After 5 years of giving this company everything.
            </p>
            <p>
              I watched colleagues check their stock prices. I watched Americans in similar roles making multiples more. And the truth hit: even if this company sells, my share won't set me free. 0.01% is not a partnership. It's a leash.
            </p>
            <p>
              I'd tried before. A cybersecurity venture with a partner who had a worker's mentality. Failed. An app development project with someone who thought like an employee. Failed. Random products that made a few dollars but never scaled. Every attempt crashed into the same walls: no time, compliance risk, the wrong partners, and the constant fear of discovery.
            </p>
            <p>Then AI happened. And the math changed completely.</p>
          </div>
        </div>
      </article>

      {/* The Amsterdam Epiphany */}
      <article className="bg-[#1B2A4A] py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-white/40 text-sm tracking-widest uppercase mb-8">THE EPIPHANY</p>
          <div className="text-white/80 text-lg leading-[1.8] space-y-6">
            <p>
              Amsterdam. 6 AM. Raining. I had just landed on a KLM flight with my wife and 8-year-old for a family vacation. We climbed into a Tesla taxi outside Schiphol. The driver started the meter. My phone buzzed.
            </p>
            <p>Two notifications sat side by side in the same tray.</p>
            <p>
              The first: a chain of corporate escalation emails. People at my company fighting over responsibilities, grey zones, internal conflicts that had been kicked up to me. Again. At 6 AM. On the first morning of my vacation.
            </p>
            <p>The second: a Stripe notification. "$0.97 received."</p>
            <p>
              A complete stranger, somewhere in the world, had found a landing page I built for plumbers in the USA. A business I know nothing about. In a country I don't live in. Under a name that isn't mine. And they paid me. While I slept on a plane.
            </p>
            <p className="text-white text-xl font-medium">I screamed.</p>
            <p>
              The taxi driver looked in the rearview mirror, shocked. He asked: "Hey, does KLM offer cakes on the plane?" He thought I was high.
            </p>
            <p>
              My wife looked at me like I was insane. Screaming about less than one euro in a taxi in Amsterdam. Then she saw my face. And she understood: this wasn't about the money. This was the proof that the cage has a door.
            </p>
          </div>
        </div>
      </article>

      {/* What Changed Inside */}
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
              The irony: the moment I stopped caring about the corporate game, I became better at it. The $0.97 made me a better Managing Director, because I was no longer playing for survival.
            </p>
          </div>
        </div>
      </article>

      {/* What I Discovered — Teaching Point */}
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
              I took everything I learned — the frameworks, the failures, the tools that actually work — and built them into a system. 5 tools. One mission: help corporate managers build invisible recurring revenue.
            </p>
          </div>
        </div>
      </article>

      {/* 5 Tool Cards */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-gray-400 text-sm tracking-widest uppercase mb-4">THE 5 TOOLS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Build Your Invisible Exit
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Each tool solves a specific problem in your journey from "trapped" to "free." All 5 included at $0.97/month.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool) => (
              <div key={tool.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <tool.icon className="w-8 h-8 text-[#1B2A4A] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-1">{tool.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{tool.tagline}</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-gray-700 text-sm">{tool.starter}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                    <span className="text-gray-400 text-sm">{tool.full}</span>
                  </div>
                </div>
              </div>
            ))}
            {/* Founding member card */}
            <div className="bg-[#1B2A4A] rounded-2xl p-6 text-white flex flex-col justify-between">
              <div>
                <Rocket className="w-8 h-8 text-[#60A5FA] mb-4" />
                <h3 className="text-xl font-bold mb-1">Full Toolkit</h3>
                <p className="text-white/60 text-sm mb-4">Unlock everything across all 5 tools</p>
                <p className="text-3xl font-bold">
                  $17.99<span className="text-base font-normal text-white/50">/month</span>
                </p>
                <p className="text-white/40 text-sm mt-1">Founding member price, locked for life</p>
              </div>
              {foundingSpots !== null && (
                <p className="text-[#60A5FA] text-sm mt-4 font-medium">
                  {foundingSpots > 0 ? `${foundingSpots} of 100 founding spots remaining` : "Founding spots filled"}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Price Anchor + CTA */}
      <section className="bg-[#1B2A4A] py-20 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-white/40 text-sm tracking-widest uppercase mb-6">START TODAY</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            5 Tools. $0.97/month. Cancel Anytime.
          </h2>
          <p className="text-white/60 text-lg mb-4">
            Individual value: $97/month. Start with simplified access for less than a coffee.
          </p>
          <p className="text-white/50 text-base mb-10">
            After checkout, you'll see an option to unlock the full toolkit at founding member pricing ($17.99/month locked for life).
          </p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="bg-[#60A5FA] hover:bg-[#3b82f6] text-white font-bold text-lg px-10 py-5 rounded-xl transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {checkoutLoading ? "Loading..." : "Start Your Invisible Exit — $0.97/month"}
            {!checkoutLoading && <ArrowRight className="w-5 h-5" />}
          </button>
          <p className="text-white/30 text-sm mt-4">Secure payment via Stripe. No sales calls. No spam.</p>
        </div>
      </section>

      {/* What I Believe -- Polarity */}
      <article className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-400 text-sm tracking-widest uppercase mb-8">WHAT I BELIEVE</p>
          <div className="text-gray-700 text-lg leading-[1.8] space-y-6">
            <p>
              Corporate loyalty is a transaction, not a virtue. Companies design equity structures to retain you, not to reward you. 0.01% is not a partnership. It's a leash disguised as an incentive.
            </p>
            <p>The acquisition payout is a lottery ticket. You can't build your life on someone else's exit timeline.</p>
            <p>
              Your 15 years of corporate operations experience isn't a weakness. It's founder gold. You understand customers, systems, and execution better than any 22-year-old with a pitch deck.
            </p>
            <p>
              You don't need to quit your job to start. You don't need a co-founder. You don't need venture capital. You don't need anyone's permission. You need 5 hours a week and a system that works within your constraints.
            </p>
            <p>The cage has a door. Most people never look for it.</p>
          </div>
        </div>
      </article>

      {/* FAQ */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-400 text-sm tracking-widest uppercase mb-8">QUESTIONS</p>
          <div className="space-y-8">
            {[
              {
                q: "What do I get for $0.97/month?",
                a: "Access to all 5 tools with simplified functionality: FYM Dashboard (1 scenario), Idea Pipeline (3 ideas), Stealth Ops Hub (basic audit), Launch Control (checklist view), and Brand Manager (basic templates). Enough to get started and see if this is for you.",
              },
              {
                q: "What's the difference between $0.97 and $19.97?",
                a: "At $0.97/month you get simplified versions of all 5 tools. At $17.99/month (founding member price, locked for life), everything is fully unlocked: unlimited scenarios, AI analysis, full compliance playbook, launch automation, content calendar, and more.",
              },
              {
                q: "Can my employer find out?",
                a: "The Stealth Ops Hub is specifically designed to help you stay invisible. It includes entity separation guidance, digital footprint auditing, and compliance checks. The full version includes a detailed playbook.",
              },
              {
                q: "What if I don't have a business idea yet?",
                a: "That's exactly what the Idea Pipeline is for. It helps you validate micro-SaaS ideas based on your industry experience, time constraints, and invisibility requirements.",
              },
              {
                q: "Who is Adrian?",
                a: "A 37-year-old Managing Director at a European tech company. $120K salary. 0.01% equity. 18-month IPO clock. Building invisible recurring revenue and documenting the process. Identity protected — because that's the whole point.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. No contracts, no commitments. Cancel from your dashboard in one click.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1B2A4A] py-20 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">The Cage Has a Door.</h2>
          <p className="text-white/60 text-lg mb-10">$0.97/month. 5 tools. 5 hours a week. Start building your exit.</p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="bg-[#60A5FA] hover:bg-[#3b82f6] text-white font-bold text-lg px-10 py-5 rounded-xl transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {checkoutLoading ? "Loading..." : "Start for $0.97/month"}
            {!checkoutLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
