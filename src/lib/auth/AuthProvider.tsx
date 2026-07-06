import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@/lib/auth/types";
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionTier = "free" | "starter" | "pro";

interface AuthContextValue {
    user: User | null;
    session: Session | null;
    tier: SubscriptionTier;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [tier, setTier] = useState<SubscriptionTier>("free");
    const [loading, setLoading] = useState(true);

  useEffect(() => {
        // Get initial session
                supabase.auth.getSession().then(({ data: { session: s } }) => {
                        setSession(s);
                        setUser(s?.user ?? null);
                        if (s?.user) fetchTier(s.user.id);
                        setLoading(false);
                });

                // Listen for auth changes
                const { data: { subscription } } = supabase.auth.onAuthStateChange(
                        (_event, s) => {
                                  setSession(s);
                                  setUser(s?.user ?? null);
                                  if (s?.user) fetchTier(s.user.id);
                                  else setTier("free");
                        },
                      );

                return () => subscription.unsubscribe();
  }, []);

  async function fetchTier(userId: string) {
        const { data } = await supabase
          .from("user_subscriptions")
          .select("tier, subscription_status, current_period_end")
          .eq("user_id", userId)
          .maybeSingle();

      if (
              data &&
              data.subscription_status === "active" &&
              new Date(data.current_period_end) > new Date()
            ) {
              setTier(data.tier as SubscriptionTier);
      } else {
              setTier("free");
      }
  }

  async function signOut() {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setTier("free");
  }

  return (
    <AuthContext.Provider value={{ user, session, tier, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
