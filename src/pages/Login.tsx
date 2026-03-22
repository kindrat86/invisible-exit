import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type Mode = "password" | "magic" | "forgot";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/fym/dashboard", { replace: true });
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
      navigate("/fym/dashboard");
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/fym/dashboard` },
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
    <div className="min-h-screen flex items-center justify-center bg-[#0B1D3A] px-4">
      <Card className="w-full max-w-md border-[#132D5E] bg-[#0B1D3A]">
        <CardHeader className="text-center">
          <p className="text-[#D4A843] text-xs tracking-widest uppercase font-semibold mb-2">
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
                  className="bg-[#132D5E] border-[#1E3A5F] text-white placeholder:text-gray-400"
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
                  className="bg-[#132D5E] border-[#1E3A5F] text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#D4A843] hover:bg-[#E0BC5E] text-[#0B1D3A] font-semibold"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  className="text-[#4A90D9] hover:underline"
                  onClick={() => setMode("forgot")}
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  className="text-[#4A90D9] hover:underline"
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
                  className="bg-[#132D5E] border-[#1E3A5F] text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#D4A843] hover:bg-[#E0BC5E] text-[#0B1D3A] font-semibold"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </Button>
              <button
                type="button"
                className="text-sm text-[#4A90D9] hover:underline w-full text-center"
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
                  className="bg-[#132D5E] border-[#1E3A5F] text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#D4A843] hover:bg-[#E0BC5E] text-[#0B1D3A] font-semibold"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <button
                type="button"
                className="text-sm text-[#4A90D9] hover:underline w-full text-center"
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
