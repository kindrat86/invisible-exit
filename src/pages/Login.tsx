import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";

type Mode = "password" | "magic" | "forgot";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard", { replace: true });
    });
  }, [navigate]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email for the login link.");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email for the password reset link.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1B2A4A] px-4 py-12">
      <SEOHead
        title="Log In | Invisible Exit"
        description="Log in to your Invisible Exit dashboard to access your freedom number calculator, idea pipeline, stealth ops hub, and more."
        url="/login"
        noindex
      />
      <Card className="w-full max-w-md border-white/10 bg-[#1B2A4A] mb-12">
        <CardHeader className="text-center">
          <p className="text-blue-400 text-xs tracking-widest uppercase font-semibold mb-2">
            INVISIBLE EXIT
          </p>
          <CardTitle className="text-xl font-bold text-white">
            {mode === "forgot" ? "Reset Password" : "Sign In"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mode === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                  onClick={() => setMode("forgot")}
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                  onClick={() => setMode("magic")}
                >
                  Sign in with magic link
                </button>
              </div>
            </form>
          )}

          {mode === "magic" && (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-magic" className="text-white">Email</Label>
                <Input
                  id="email-magic"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </Button>
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 hover:underline w-full text-center"
                onClick={() => setMode("password")}
              >
                Back to password sign in
              </button>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm text-gray-400">
                Enter your email and we'll send you a password reset link.
              </p>
              <div className="space-y-2">
                <Label htmlFor="email-forgot" className="text-white">Email</Label>
                <Input
                  id="email-forgot"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 hover:underline w-full text-center"
                onClick={() => setMode("password")}
              >
                Back to sign in
              </button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* ── Content section: explains what Invisible Exit is ── */}
      <div className="w-full max-w-2xl text-center space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What Invisible Exit Is</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            <strong>Invisible Exit is a suite of five connected AI tools</strong> that
            helps employed corporate managers and founders build an anonymous
            micro-SaaS side business — validate a niche, launch it, and reach a
            &ldquo;freedom number&rdquo; of recurring revenue without quitting their
            job or building a public personal brand. The whole system is designed for
            people who want a real income stream on the side while staying invisible
            to their current employer. Plans start at $0.97/month.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">The Five Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {[
              {
                title: "Freedom Number Dashboard",
                desc: "Calculates the monthly side income that would cover your living expenses, so you know the exact target that makes leaving your job optional rather than desperate.",
              },
              {
                title: "Idea Validation",
                desc: "A library of 500+ micro-SaaS ideas scored by industry fit, time investment, and revenue potential, plus AI-powered validation of your own idea in about 48 hours.",
              },
              {
                title: "Compliance & Anonymity",
                desc: "Entity-separation and digital-invisibility guides plus a compliance audit against non-compete, IP-assignment, and moonlighting clauses.",
              },
              {
                title: "Launch Automation",
                desc: "Go-live tooling built for a five-hour weekend: Stripe integration, landing-page generation, and a launch-sequence builder.",
              },
              {
                title: "Faceless Audience Builder",
                desc: "YouTube scripts, Reddit playbooks, and SEO content templates that build demand without ever showing your face or attaching your real name.",
              },
            ].map((tool) => (
              <div key={tool.title} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-blue-400 font-semibold text-sm mb-1">{tool.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500 space-y-2">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 hover:underline">
              Create one here
            </Link>
          </p>
          <p>
            <Link to="/" className="text-blue-400 hover:text-blue-300 hover:underline">
              &larr; Back to home page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
