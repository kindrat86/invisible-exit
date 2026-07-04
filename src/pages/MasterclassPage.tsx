import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Calendar, Clock, Check } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const WHAT_YOU_LEARN = [
  {
    title: "Secret #1: The Vehicle",
    description: "Why your corporate job is the perfect launchpad for a micro-SaaS — and why most founders get this backwards.",
  },
  {
    title: "Secret #2: The Stealth System",
    description: "How to build revenue your employer will never find — entity separation, digital footprint, compliance.",
  },
  {
    title: "Secret #3: The 5-Hour Framework",
    description: "The exact weekly operating system that turns 5 hours into more progress than 40 hours of unfocused work.",
  },
];

const MasterclassPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    trackEvent("masterclass_registered", { source: "masterclass_page" });
    try {
      await supabase
        .from("subscribers")
        .upsert(
          { email, source: "masterclass_registration" },
          { onConflict: "email" }
        );
      await supabase.functions
        .invoke("newsletter-welcome", { body: { email } })
        .catch(() => {});
      setRegistered(true);
      toast.success("You're registered! Check your email for the access link.");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Free Masterclass: Build a $4K/Month Side Business While Employed | Invisible Exit"
        description="45-minute masterclass for corporate managers. Learn the 3 secrets to building invisible recurring revenue without quitting your job."
        url="/masterclass"
      />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Play className="w-4 h-4" />
            Free 45-Minute Masterclass
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            How Corporate Managers Are Building{" "}
            <span className="text-gradient-light">$4,000/Month Side Businesses</span>{" "}
            in 12 Months
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-4">
            Without quitting your job. Without writing code. Without your employer finding out.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-white/50 text-sm mb-12">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> 45 minutes
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Watch on-demand
            </span>
            <span>·</span>
            <span>Free replay included</span>
          </div>

          {/* Video placeholder */}
          <div className="mx-auto max-w-2xl rounded-2xl overflow-hidden shadow-2xl shadow-black/40 mb-8 border border-white/10">
            <div className="aspect-video bg-[hsl(222_47%_14%)] flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <p className="text-white/50 text-sm">Register below to unlock the replay</p>
              </div>
            </div>
          </div>

          {!registered ? (
            <form onSubmit={handleRegister} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 py-3.5 px-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[48px]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 min-h-[48px] whitespace-nowrap"
                >
                  {loading ? "..." : "Watch Free"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-white/40 text-xs mt-3">
                We'll send the replay link to your inbox. No spam.
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto card-glass p-6 animate-scale-in">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
                <Check className="w-5 h-5 text-success" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">You're registered!</h2>
              <p className="text-white/70 text-sm">
                Check <strong className="text-white">{email}</strong> for the replay link.
                The masterclass takes 45 minutes — watch it on your lunch break.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="bg-white section-normal">
        <div className="container-narrow">
          <p className="text-eyebrow text-primary mb-4 text-center">What You'll Learn</p>
          <h2 className="text-h1 text-foreground mb-12 text-center">3 Secrets in 45 Minutes</h2>
          <div className="space-y-6">
            {WHAT_YOU_LEARN.map((item, i) => (
              <div key={i} className="card-base p-6 sm:p-8 card-hover">
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-sm shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-h3 text-foreground mb-2">{item.title}</h3>
                    <p className="text-body text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="bg-surface section-normal">
        <div className="container-narrow text-center">
          <p className="text-eyebrow text-primary mb-4">Who Is This For?</p>
          <h2 className="text-h1 text-foreground mb-8">Corporate Managers Earning $120K-$200K</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              "You have a stable salary but feel trapped by the golden handcuffs",
              "You have less than 0.5% equity and an uncertain IPO timeline",
              "You want to build something that's yours — but you can't quit yet",
              "You have 5 hours a week and want to use them strategically",
              "You're worried your employer might find out about your side project",
              "You don't know how to code but want to build a real product",
            ].map((item, i) => (
              <div key={i} className="card-base p-5">
                <Check className="w-5 h-5 text-success mb-2" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MasterclassPage;
