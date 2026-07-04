import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import About from "./pages/About.tsx";
import NotFound from "./pages/NotFound.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import BlogCategory from "./pages/BlogCategory.tsx";
import ComparePage from "./pages/ComparePage.tsx";
import GlossaryIndex from "./pages/GlossaryIndex.tsx";
import GlossaryTermPage from "./pages/GlossaryTermPage.tsx";
import StateGuidePage from "./pages/StateGuidePage.tsx";
import IndustryIdeasPage from "./pages/IndustryIdeasPage.tsx";
import BestToolsPage from "./pages/BestToolsPage.tsx";
import CalculatorPage from "./pages/CalculatorPage.tsx";
import DataReportPage from "./pages/DataReportPage.tsx";
import ResourcePage from "./pages/ResourcePage.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import PostHogPageviewTracker from "./components/PostHogPageviewTracker.tsx";

// Lazy-loaded routes (not SEO-critical)
const OTOFounding = lazy(() => import("./pages/OTOFounding.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Badge = lazy(() => import("./pages/Badge.tsx"));
const Confirmation = lazy(() => import("./pages/Confirmation.tsx"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess.tsx"));
const AdminFeatureRequests = lazy(() => import("./pages/AdminFeatureRequests.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PostHogPageviewTracker />
        <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen" />}>
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
          <Route path="/about" element={<About />} />
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
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/category/:category" element={<BlogCategory />} />
          <Route path="/compare" element={<Blog />} />
          <Route path="/compare/:vs" element={<ComparePage />} />
          <Route path="/glossary" element={<GlossaryIndex />} />
          <Route path="/glossary/:slug" element={<GlossaryTermPage />} />
          <Route path="/guides" element={<StateGuidePage />} />
          <Route path="/guides/:state" element={<StateGuidePage />} />
          <Route path="/ideas" element={<IndustryIdeasPage />} />
          <Route path="/ideas/:profession" element={<IndustryIdeasPage />} />
          <Route path="/best" element={<BestToolsPage />} />
          <Route path="/best/:category" element={<BestToolsPage />} />
          <Route path="/calculators" element={<CalculatorPage />} />
          <Route path="/calculators/:name" element={<CalculatorPage />} />
          <Route path="/data" element={<DataReportPage />} />
          <Route path="/data/:report" element={<DataReportPage />} />
          <Route path="/resources" element={<ResourcePage />} />
          <Route path="/resources/:slug" element={<ResourcePage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/oto/second-tool" element={<Navigate to="/" replace />} />
          {/* Redirects from /fym/ prefixed URLs (legacy worktree) */}
          <Route path="/fym/oto/founding" element={<Navigate to="/oto/founding" replace />} />
          <Route path="/fym/oto/second-tool" element={<Navigate to="/" replace />} />
          <Route path="/fym/dashboard" element={<Navigate to="/dashboard" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
