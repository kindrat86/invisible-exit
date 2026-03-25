import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import NotFound from "./pages/NotFound.tsx";
import OTOFounding from "./pages/OTOFounding.tsx";
import Login from "./pages/Login.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Badge from "./pages/Badge.tsx";
import Confirmation from "./pages/Confirmation.tsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.tsx";
import AdminFeatureRequests from "./pages/AdminFeatureRequests.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import PostHogPageviewTracker from "./components/PostHogPageviewTracker.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PostHogPageviewTracker />
        <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/oto/founding" element={<OTOFounding />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin/feature-requests" element={<AdminFeatureRequests />} />
          <Route path="/fym/badge/:shareId" element={<Badge />} />
          {/* Redirects from old URLs */}
          <Route path="/fym" element={<Navigate to="/" replace />} />
          <Route path="/idea-pipeline" element={<Navigate to="/" replace />} />
          <Route path="/ideas" element={<Navigate to="/" replace />} />
          <Route path="/stealth-ops" element={<Navigate to="/" replace />} />
          <Route path="/launch-control" element={<Navigate to="/" replace />} />
          <Route path="/brand-manager" element={<Navigate to="/" replace />} />
          <Route path="/founding-member" element={<Navigate to="/" replace />} />
          <Route path="/training" element={<Navigate to="/" replace />} />
          <Route path="/thank-you" element={<Navigate to="/" replace />} />
          <Route path="/blog" element={<Navigate to="/" replace />} />
          <Route path="/oto/second-tool" element={<Navigate to="/" replace />} />
          {/* Redirects from /fym/ prefixed URLs (legacy worktree) */}
          <Route path="/fym/oto/founding" element={<Navigate to="/oto/founding" replace />} />
          <Route path="/fym/oto/second-tool" element={<Navigate to="/" replace />} />
          <Route path="/fym/dashboard" element={<Navigate to="/dashboard" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
