import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen flex items-center justify-center bg-[#1B2A4A] px-4">
      <SEOHead
        title="Log In | Invisible Exit"
        description="Log in to your Invisible Exit dashboard."
        url="/login"
        noindex
      />
      <Card className="w-full max-w-md border-white/10 bg-[#1B2A4A]">
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
    </div>
  );
}
