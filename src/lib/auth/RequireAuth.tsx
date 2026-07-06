import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./AuthProvider";

/**
 * Route wrapper that redirects unauthenticated users to /login.
 * Wrap any <Route> element to require a logged-in session.
 *
 * Usage:
 *   <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen" />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
