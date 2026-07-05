import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/login` },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("Check your email to confirm your account.");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1B2A4A] px-4 py-12">
      <SEOHead title="Sign Up | Invisible Exit" description="Create your Invisible Exit account." url="/signup" noindex />
      <Card className="w-full max-w-md border-white/10 bg-[#1B2A4A]">
        <CardHeader className="text-center">
          <p className="text-blue-400 text-xs tracking-widest uppercase font-semibold mb-2">INVISIBLE EXIT</p>
          <CardTitle className="text-xl font-bold text-white">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-green-400">Confirmation email sent!</p>
              <p className="text-gray-400 text-sm">Check your inbox and click the link to activate your account.</p>
              <Link to="/login" className="text-blue-400 hover:underline text-sm">Back to Sign In</Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required minLength={6} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
                </div>
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#1B2A4A] px-2 text-gray-400">or</span>
                </div>
              </div>

              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" onClick={handleGoogleLogin}>
                Continue with Google
              </Button>

              <p className="text-center text-sm text-gray-400 mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:underline">Sign In</Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
