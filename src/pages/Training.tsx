import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Training = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Free Training: The Invisible Exit Method | Invisible Exit";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Free 15-minute training reveals how Managing Directors build $2,500-$4,000/month recurring revenue invisibly. Plus a one-page blueprint."
      );
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "Free Training: The Invisible Exit Method | Invisible Exit");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc)
      ogDesc.setAttribute(
        "content",
        "Free 15-minute training reveals how Managing Directors build $2,500-$4,000/month recurring revenue invisibly."
      );
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", "https://invisibleexit.com/training");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      first_name: firstName.trim(),
      email: email.trim().toLowerCase(),
      source: "training",
    });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        navigate("/thank-you");
        return;
      }
      toast.error("Something went wrong. Please try again.");
      return;
    }
    navigate("/thank-you");
  };

  return (
    <div className="min-h-screen bg-[#1B2A4A] flex items-center justify-center px-6 py-16">
      <div className="mx-auto max-w-xl w-full text-center">
        <p className="text-white/60 text-sm tracking-widest uppercase mb-6">
          FOR MANAGING DIRECTORS AT SCALE-UPS
        </p>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
          The Invisible Exit Method
        </h1>

        <p className="text-white/70 text-lg mb-4">
          How Managing Directors Build $2,500-$4,000/Month Recurring Revenue Without Employer Notice
        </p>

        <p className="text-white/50 text-base mb-10">
          Free 15-minute training + The Invisible Exit Method blueprint
        </p>

        {/* Video Placeholder */}
        <div className="rounded-xl bg-[#0f1a2e] border border-white/10 flex items-center justify-center h-48 md:h-56 mb-10">
          <span className="text-white/30 text-sm">Training video coming soon</span>
        </div>

        {/* Bullets */}
        <ul className="text-left text-white/70 text-base space-y-3 mb-10 max-w-md mx-auto">
          <li className="flex items-start gap-3">
            <span className="text-[#60A5FA] mt-1 shrink-0">&#10003;</span>
            <span>The 7 phases of The Invisible Exit Method</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#60A5FA] mt-1 shrink-0">&#10003;</span>
            <span>Build $2,500-$4,000/mo in 18 months</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#60A5FA] mt-1 shrink-0">&#10003;</span>
            <span>5-7 hours per week, 100% compliant</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#60A5FA] mt-1 shrink-0">&#10003;</span>
            <span>The 5 core tools that make it possible</span>
          </li>
        </ul>

        {/* Email Capture Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#60A5FA] transition-colors"
          />
          <input
            type="email"
            placeholder="Your Best Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#60A5FA] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-bold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50 uppercase tracking-wide"
          >
            {loading ? "Sending..." : "Send Me the Training"}
          </button>
        </form>

        <p className="text-white/30 text-sm mt-6">
          No credit card required. No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default Training;
