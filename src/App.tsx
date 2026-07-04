import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import PostHogPageviewTracker from "./components/PostHogPageviewTracker.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import BackToTop from "./components/BackToTop.tsx";
import ReadingProgress from "./components/ReadingProgress.tsx";
import { ScrollReveal } from "./components/ScrollReveal.tsx";
import { MobileCTABar } from "./components/MobileCTABar.tsx";

// ── Eager: only the homepage (LCP-critical, highest-traffic) ──
import Index from "./pages/Index.tsx";

// ── Lazy: all other routes (code-splitting for smaller initial bundle) ──
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// SEO content pages — lazy-loaded but pre-rendered by prerender-meta.mjs
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const BlogCategory = lazy(() => import("./pages/BlogCategory.tsx"));
const ComparePage = lazy(() => import("./pages/ComparePage.tsx"));
const GlossaryIndex = lazy(() => import("./pages/GlossaryIndex.tsx"));
const GlossaryTermPage = lazy(() => import("./pages/GlossaryTermPage.tsx"));
const StateGuidePage = lazy(() => import("./pages/StateGuidePage.tsx"));
const IndustryIdeasPage = lazy(() => import("./pages/IndustryIdeasPage.tsx"));
const BestToolsPage = lazy(() => import("./pages/BestToolsPage.tsx"));
const CalculatorPage = lazy(() => import("./pages/CalculatorPage.tsx"));
const DataReportPage = lazy(() => import("./pages/DataReportPage.tsx"));
const ResourcePage = lazy(() => import("./pages/ResourcePage.tsx"));

// pSEO expansion pages (Greg Isenberg)
const AlternativesPage = lazy(() => import("./pages/AlternativesPage.tsx"));
const SalaryPage = lazy(() => import("./pages/SalaryPage.tsx"));
const RevenueMilestonePage = lazy(() => import("./pages/RevenueMilestonePage.tsx"));
const TimelinePage = lazy(() => import("./pages/TimelinePage.tsx"));
const ProfessionStackPage = lazy(() => import("./pages/ProfessionStackPage.tsx"));
const CostOfWaitingPage = lazy(() => import("./pages/CostOfWaitingPage.tsx"));
const ProfessionStatePage = lazy(() => import("./pages/ProfessionStatePage.tsx"));
const NonCompeteMatrixPage = lazy(() => import("./pages/NonCompeteMatrixPage.tsx"));

// pSEO expansion pages (Greg Isenberg Round 2)
const ProfessionMistakesPage = lazy(() => import("./pages/ProfessionMistakesPage.tsx"));
const RedditStrategyPage = lazy(() => import("./pages/RedditStrategyPage.tsx"));
const PricingModelPage = lazy(() => import("./pages/PricingModelPage.tsx"));
const BreakEvenPage = lazy(() => import("./pages/BreakEvenPage.tsx"));
const ProfessionVsCareerPage = lazy(() => import("./pages/ProfessionVsCareerPage.tsx"));
const FirstYearPage = lazy(() => import("./pages/FirstYearPage.tsx"));
const ToolCrossReferencePage = lazy(() => import("./pages/ToolCrossReferencePage.tsx"));

// Funnel & marketing pages
const SqueezePage = lazy(() => import("./pages/SqueezePage.tsx"));
const DownsellPage = lazy(() => import("./pages/DownsellPage.tsx"));
const MasterclassPage = lazy(() => import("./pages/MasterclassPage.tsx"));
const AffiliatesPage = lazy(() => import("./pages/AffiliatesPage.tsx"));
const IntensivePage = lazy(() => import("./pages/IntensivePage.tsx"));
const StoryPage = lazy(() => import("./pages/StoryPage.tsx"));
const AdrianPage = lazy(() => import("./pages/AdrianPage.tsx"));
const InnerCirclePage = lazy(() => import("./pages/InnerCirclePage.tsx"));
const Dream100Page = lazy(() => import("./pages/Dream100Page.tsx"));
const TrafficBlueprintPage = lazy(() => import("./pages/TrafficBlueprintPage.tsx"));
const ContentCalendarPage = lazy(() => import("./pages/ContentCalendarPage.tsx"));
const AffiliateAssetsPage = lazy(() => import("./pages/AffiliateAssetsPage.tsx"));
const PodcastPitchPage = lazy(() => import("./pages/PodcastPitchPage.tsx"));
const BacklinkStrategyPage = lazy(() => import("./pages/BacklinkStrategyPage.tsx"));
const ProPage = lazy(() => import("./pages/ProPage.tsx"));
const FunnelMetricsPage = lazy(() => import("./pages/FunnelMetricsPage.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));

// App pages (authenticated, never crawled)
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
        <ScrollToTop />
        <ReadingProgress />
        <PostHogPageviewTracker />
        <ScrollReveal />
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
          {/* ── pSEO Expansion (Greg Isenberg) ── */}
          <Route path="/alternatives/:slug" element={<AlternativesPage />} />
          <Route path="/alternatives" element={<Navigate to="/blog" replace />} />
          <Route path="/salaries/:slug" element={<SalaryPage />} />
          <Route path="/salaries" element={<Navigate to="/blog" replace />} />
          <Route path="/milestones/:slug" element={<RevenueMilestonePage />} />
          <Route path="/milestones" element={<Navigate to="/blog" replace />} />
          <Route path="/timeline/:slug" element={<TimelinePage />} />
          <Route path="/timeline" element={<Navigate to="/blog" replace />} />
          <Route path="/stack/:slug" element={<ProfessionStackPage />} />
          <Route path="/stack" element={<Navigate to="/blog" replace />} />
          <Route path="/cost-of-waiting/:slug" element={<CostOfWaitingPage />} />
          <Route path="/cost-of-waiting" element={<Navigate to="/blog" replace />} />
          <Route path="/ideas/:profession/in/:state" element={<ProfessionStatePage />} />
          <Route path="/non-compete/:slug" element={<NonCompeteMatrixPage />} />
          {/* ── pSEO Expansion Round 2 (Greg Isenberg) ── */}
          <Route path="/mistakes/:slug" element={<ProfessionMistakesPage />} />
          <Route path="/mistakes" element={<Navigate to="/blog" replace />} />
          <Route path="/reddit/:slug" element={<RedditStrategyPage />} />
          <Route path="/reddit" element={<Navigate to="/blog" replace />} />
          <Route path="/pricing-models/:slug" element={<PricingModelPage />} />
          <Route path="/pricing-models" element={<Navigate to="/blog" replace />} />
          <Route path="/break-even/:slug" element={<BreakEvenPage />} />
          <Route path="/break-even" element={<Navigate to="/blog" replace />} />
          <Route path="/vs/:slug" element={<ProfessionVsCareerPage />} />
          <Route path="/vs" element={<Navigate to="/blog" replace />} />
          <Route path="/first-year/:slug" element={<FirstYearPage />} />
          <Route path="/first-year" element={<Navigate to="/blog" replace />} />
          <Route path="/tools/:slug" element={<ToolCrossReferencePage />} />
          <Route path="/tools" element={<Navigate to="/best" replace />} />
          <Route path="/non-compete" element={<Navigate to="/blog" replace />} />
          {/* ── Funnel Pages ── */}
          <Route path="/freedom" element={<SqueezePage />} />
          <Route path="/oto/downsell" element={<DownsellPage />} />
          <Route path="/masterclass" element={<MasterclassPage />} />
          <Route path="/affiliates" element={<AffiliatesPage />} />
          <Route path="/intensive" element={<IntensivePage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/adrian" element={<AdrianPage />} />
          <Route path="/inner-circle" element={<InnerCirclePage />} />
          <Route path="/dream-100" element={<Dream100Page />} />
          <Route path="/traffic-blueprint" element={<TrafficBlueprintPage />} />
          <Route path="/content-calendar" element={<ContentCalendarPage />} />
          <Route path="/affiliate-assets" element={<AffiliateAssetsPage />} />
          <Route path="/podcast-pitch" element={<PodcastPitchPage />} />
          <Route path="/backlink-strategy" element={<BacklinkStrategyPage />} />
          <Route path="/pro" element={<ProPage />} />
          <Route path="/funnel-metrics" element={<FunnelMetricsPage />} />
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
        <BackToTop />
        <MobileCTABar />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
