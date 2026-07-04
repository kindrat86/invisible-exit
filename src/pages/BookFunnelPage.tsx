import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  BookOpen,
  Star,
  Shield,
  Clock,
  Truck,
  Lock,
} from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import GuaranteeBox from "@/components/GuaranteeBox";

/**
 * DOTCOM SECRETS: Chapter 9 — Book Funnels
 *
 * Russell's highest-converting organic funnel: "Free Book — Just Pay Shipping."
 *
 * Structure:
 *   1. Book cover mockup + "FREE" badge
 *   2. What's inside (chapter-by-chapter hook)
 *   3. Bonuses (digital downloads included free)
 *   4. Social proof (reader reviews)
 *   5. Order form (shipping info → $4.95 S&H)
 *   6. Order bump (audiobook upgrade $9)
 *   7. Risk reversal
 *
 * This captures cold organic/blog traffic that isn't ready for the
 * squeeze calculator yet. It's a lower-friction entry point.
 */
const CHAPTERS = [
  {
    num: "1",
    title: "The $5 Million Lie",
    hook: "Why even a billion-dollar IPO exit doesn't buy your freedom (the math that changed everything).",
  },
  {
    num: "2",
    title: "The Amsterdam Taxi",
    hook: "6 AM. Two notifications. The moment I realized the cage has a door.",
  },
  {
    num: "3",
    title: "Your Job Is the Launchpad",
    hook: "The Salary-Runway Method: how your employment is the best funding round you'll never raise.",
  },
  {
    num: "4",
    title: "The Triple-Separation Protocol",
    hook: "Different name, different entity, different Stripe, different hosting. Zero connection.",
  },
  {
    num: "5",
    title: "The Cartridge System",
    hook: "Stop choosing the 'right' idea. Build the system, swap ideas like cartridges.",
  },
  {
    num: "6",
    title: "The 5-Tool Pipeline",
    hook: "Freedom number → idea validation → stealth ops → launch → faceless brand. The exact stack.",
  },
  {
    num: "7",
    title: "The Boring Product That Pays the Mortgage",
    hook: "My $4,100/month doesn't come from the exciting product. It comes from a PDF generator for electricians.",
  },
];

const BONUSES = [
  {
    title: "The 47-Point Employment Contract Audit Checklist",
    desc: "The exact checklist that found 3 clauses in my contract I didn't know about. One could have cost me everything.",
    value: "$47",
  },
  {
    title: "25 Done-For-You Micro-SaaS Idea Swipes",
    desc: "25 fully-researched ideas with target market, pricing model, and validation criteria. Pick one. Start this weekend.",
    value: "$47",
  },
  {
    title: "The Faceless Founder Content Calendar",
    desc: "12 months of pre-written content prompts. Never stare at a blank screen again.",
    value: "$27",
  },
];

const REVIEWS = [
  {
    name: "Marcus T.",
    role: "Product Manager, $165K",
    stars: 5,
    text: "I read this in one sitting. The equity math alone was worth 100x the shipping cost. I've already started building.",
  },
  {
    name: "Sarah K.",
    role: "Finance Director, $140K",
    stars: 5,
    text: "The Triple-Separation Protocol is genius. I set up my LLC last weekend. My employer will never find out.",
  },
  {
    name: "Jennifer L.",
    role: "Operations Manager, $130K",
    stars: 5,
    text: "The Cartridge System changed how I think about ideas. I stopped researching and started building. $2,300 MRR in 5 months.",
  },
];

const BookFunnelPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [addAudiobook, setAddAudiobook] = useState(true);

  // Countdown: 24 hours from first visit
  const [timeLeft, setTimeLeft] = useState({ hrs: 23, mins: 59, secs: 59 });

  useEffect(() => {
    trackEvent("book_funnel_page_viewed");
    const STORAGE_KEY = "book_funnel_deadline";
    let deadline = sessionStorage.getItem(STORAGE_KEY);
    if (!deadline) {
      deadline = (Date.now() + 24 * 60 * 60 * 1000).toString();
      sessionStorage.setItem(STORAGE_KEY, deadline);
    }
    const tick = () => {
      const remaining = parseInt(deadline!) - Date.now();
      if (remaining <= 0) {
        setTimeLeft({ hrs: 0, mins: 0, secs: 0 });
        return;
      }
      setTimeLeft({
        hrs: Math.floor(remaining / (1000 * 60 * 60)),
        mins: Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((remaining % (1000 * 60)) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    trackEvent("book_ordered", {
      audiobook: addAudiobook,
      total: addAudiobook ? 13.95 : 4.95,
    });
    try {
      // Route through Stripe checkout for real payment processing
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          tier: addAudiobook ? "book_audiobook" : "book",
          returnUrl: window.location.origin + "/confirmation?tier=book",
          cancelUrl: window.location.origin + "/free-book",
          email,
        },
      });
      if (error) throw error;
      if (data?.url) {
        // Also upsert subscriber for tracking
        await supabase.from("subscribers").upsert(
          {
            email,
            source: "book_funnel_free_book",
            metadata: {
              audiobook_upgrade: addAudiobook,
              total_paid: addAudiobook ? 13.95 : 4.95,
            },
          },
          { onConflict: "email" }
        );
        window.location.href = data.url;
        return;
      }
      // Fallback: if no checkout URL, still capture the lead
      await supabase.from("subscribers").upsert(
        {
          email,
          source: "book_funnel_free_book",
          metadata: {
            audiobook_upgrade: addAudiobook,
            total_paid: addAudiobook ? 13.95 : 4.95,
            checkout_pending: true,
          },
        },
        { onConflict: "email" }
      );
      setOrdered(true);
      toast.success("Your book is being prepared for shipping!");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = addAudiobook ? 13.95 : 4.95;

  return (
    <div className="min-h-screen bg-[hsl(222_47%_11%)]">
      <SEOHead
        title="FREE BOOK: The Invisible Exit Manifesto | Invisible Exit"
        description="Get the complete Invisible Exit Manifesto FREE — just pay shipping. 7 chapters. The exact system for building invisible recurring revenue while employed."
        url="/free-book"
      />

      {/* Urgency Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-amber-600/95 backdrop-blur-sm border-b border-amber-400/20 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <Clock className="w-4 h-4 text-white animate-pulse shrink-0" />
          <p className="text-white text-sm font-semibold">
            FREE book offer ends in{" "}
            <span className="tabular-nums font-bold">
              {String(timeLeft.hrs).padStart(2, "0")}:{String(timeLeft.mins).padStart(2, "0")}:
              {String(timeLeft.secs).padStart(2, "0")}
            </span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-20 pb-16 md:pt-28">
        {/* ── Hero: Book Cover + Offer ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center mb-16">
          {/* Book Cover Mockup */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-64 h-96 sm:w-72 sm:h-[432px]">
              {/* Book shadow */}
              <div className="absolute inset-0 bg-black/40 rounded-r-lg rounded-l-sm translate-x-2 translate-y-2 blur-md" />
              {/* Book spine */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-primary/80 to-primary-dark rounded-l-sm" />
              {/* Book cover */}
              <div className="relative h-full ml-2 bg-gradient-to-br from-[hsl(222_47%_14%)] to-[hsl(222_47%_8%)] rounded-r-lg border border-white/10 overflow-hidden shadow-2xl">
                <div className="h-full flex flex-col items-center justify-between p-6 text-center">
                  <div>
                    <p className="text-primary-light text-xs font-bold uppercase tracking-[2px] mb-3">
                      The Manifesto
                    </p>
                    <h2 className="text-2xl font-bold text-white leading-tight mb-2">
                      The Invisible Exit
                    </h2>
                    <div className="w-12 h-0.5 bg-primary mx-auto mb-3" />
                    <p className="text-white/50 text-xs leading-relaxed">
                      How Corporate Managers Are Building $4,000/Month Side Businesses
                      Without Quitting Their Jobs
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-amber-400 text-sm">★★★★★</div>
                    <p className="text-white/40 text-[10px] uppercase tracking-wide">
                      Adrian
                    </p>
                  </div>
                </div>
              </div>
              {/* FREE badge */}
              <div className="absolute -top-3 -right-3 w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-xl rotate-12">
                <span className="text-white font-bold text-xl text-center leading-none">
                  FREE
                </span>
              </div>
            </div>
          </div>

          {/* Offer */}
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <BookOpen className="w-4 h-4" />
              FREE BOOK — JUST PAY SHIPPING
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Get the Complete{" "}
              <span className="text-gradient-light">Invisible Exit Manifesto</span>{" "}
              FREE
            </h1>

            <p className="text-lg text-white/70 mb-4 leading-relaxed">
              152 pages. 7 chapters. The exact system I used to build $4,100/month
              in invisible recurring revenue while working my $120K corporate job.
            </p>

            <p className="text-base text-white/50 mb-6">
              I'll send you the physical book for FREE. You just cover $4.95 shipping.
              Why? Because people who pay shipping actually read it.
            </p>

            {/* Price block */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-white/40 text-xl line-through">$24.99</span>
                <span className="text-4xl font-bold text-success">FREE</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Just pay shipping & handling:</span>
                <span className="text-white font-bold">$4.95</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-3 text-white/40 text-xs">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Ships in 48 hours
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> 30-day guarantee
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Discreet packaging
              </span>
            </div>
          </div>
        </div>

        {/* ── Order Form / Confirmation ── */}
        {!ordered ? (
          <div className="max-w-lg mx-auto bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 mb-16">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Claim Your FREE Book Below
            </h3>

            <form onSubmit={handleOrder} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email (we'll send shipping confirmation)"
                className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 py-3.5 px-5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
              />

              {/* Order Bump: Audiobook */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  addAudiobook
                    ? "bg-primary/10 border-primary/40"
                    : "bg-white/5 border-white/10 hover:bg-white/[0.07]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={addAudiobook}
                  onChange={(e) => setAddAudiobook(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded accent-primary shrink-0 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-white text-sm font-semibold">
                      YES! Add the Audiobook + Digital Version
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Save $15
                    </span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">
                    Get instant access to the audiobook (2.5 hours) + PDF + ePub.
                    Listen on your commute. Normally $24.99. Add it for just{" "}
                    <strong className="text-amber-300">$9 one-time</strong>.
                  </p>
                </div>
              </label>

              {/* Total */}
              <div className="bg-white/[0.03] rounded-lg p-4 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">The Invisible Exit Manifesto:</span>
                  <span className="text-success font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Shipping & handling:</span>
                  <span className="text-white/70">$4.95</span>
                </div>
                {addAudiobook && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Audiobook + Digital upgrade:</span>
                    <span className="text-white/70">$9.00</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-white font-bold">Total today:</span>
                  <span className="text-2xl font-bold text-primary-light">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-[hsl(222_47%_11%)] font-bold text-lg py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 disabled:opacity-50 min-h-[56px]"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <BookOpen className="w-5 h-5" />
                    Claim My FREE Book Now
                  </>
                )}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
              <p className="text-white/30 text-xs text-center">
                Secure checkout via Stripe · 30-day money-back guarantee
              </p>
            </form>
          </div>
        ) : (
          <div className="max-w-lg mx-auto bg-gradient-to-br from-success/[0.1] to-transparent border border-success/30 rounded-2xl p-8 mb-16 text-center animate-scale-in">
            <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">You're In!</h3>
            <p className="text-white/70 mb-2">
              Your FREE book is being prepared. Shipping confirmation is on its way to{" "}
              <strong className="text-white">{email}</strong>.
            </p>
            <p className="text-white/50 text-sm mb-6">
              While you wait for the physical book, start with the Freedom Number
              calculator — it takes 90 seconds.
            </p>
            <Link
              to="/freedom"
              className="btn-primary inline-flex items-center gap-2"
            >
              Calculate My Freedom Number (Free)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* ── What's Inside ── */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <p className="text-eyebrow text-primary-light mb-3">What's Inside</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              7 Chapters. Each One a Framework.
            </h2>
            <p className="text-white/50 text-sm">
              Not motivation. Not theory. Each chapter gives you a named framework
              with a specific output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHAPTERS.map((ch) => (
              <div
                key={ch.num}
                className="flex items-start gap-4 bg-white/[0.03] border border-white/10 rounded-xl p-5"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/15 text-primary-light font-bold text-sm shrink-0">
                  {ch.num}
                </span>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{ch.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{ch.hook}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bonuses ── */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <p className="text-eyebrow text-amber-400 mb-3">FREE Bonuses</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              3 Digital Bonuses Included FREE
            </h2>
            <p className="text-white/50 text-sm">
              When you claim your free book today, you also get instant access to
              these 3 digital downloads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BONUSES.map((bonus, i) => (
              <div
                key={i}
                className="bg-primary/[0.06] border border-primary/20 rounded-xl p-5"
              >
                <span className="text-2xl mb-2 block">🎁</span>
                <h3 className="text-white font-semibold text-sm mb-2">
                  {bonus.title}
                </h3>
                <p className="text-white/50 text-xs leading-relaxed mb-3">
                  {bonus.desc}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-white/30 text-xs line-through">
                    {bonus.value}
                  </span>
                  <span className="text-success text-sm font-bold">FREE</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bonus total */}
          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm">
              Total bonus value:{" "}
              <span className="text-white/30 line-through">$121</span>{" "}
              <span className="text-success font-bold">Included FREE</span>
            </p>
          </div>
        </div>

        {/* ── Reviews ── */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-1 mb-3">
              <span className="text-amber-400 text-lg">★★★★★</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              What Managers Are Saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REVIEWS.map((review, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-5"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: review.stars }).map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm italic mb-4 leading-relaxed">
                  "{review.text}"
                </p>
                <div>
                  <p className="text-white font-semibold text-sm">{review.name}</p>
                  <p className="text-white/40 text-xs">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Why Free? ── */}
        <div className="max-w-xl mx-auto mb-16 text-center">
          <p className="text-eyebrow text-primary-light mb-3">Why Am I Giving This Away?</p>
          <p className="text-white/60 text-sm leading-relaxed">
            Because my mission isn't to sell books. It's to help 1,000 corporate
            managers build invisible recurring revenue. The book is the gateway.
            If you read it and want the interactive tools, you'll join Invisible
            Exit at $0.97/month. If not, you keep the book and the bonuses. No risk.
          </p>
        </div>

        {/* ── Guarantee ── */}
        <div className="max-w-lg mx-auto mb-16">
          <GuaranteeBox
            days={30}
            title="My 30-Day Better Than Risk-Free Guarantee"
            keepText="the book, the bonuses, and every framework inside"
          />
        </div>

        {/* ── Final CTA ── */}
        {!ordered && (
          <div className="text-center border-t border-white/5 pt-8">
            <button
              onClick={() => {
                const el = document.querySelector("form");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[hsl(222_47%_11%)] font-bold text-lg py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 min-h-[56px]"
            >
              <BookOpen className="w-5 h-5" />
              Yes — Send Me the FREE Book
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-white/30 text-xs mt-3">
              Only 500 free copies available. 127 claimed this month.
            </p>
          </div>
        )}

        {/* ── Footer Link ── */}
        <div className="text-center pt-8 border-t border-white/5">
          <Link
            to="/freedom"
            className="text-white/40 underline hover:text-white/60 transition-colors text-sm"
          >
            No thanks, I'll just calculate my freedom number →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookFunnelPage;
