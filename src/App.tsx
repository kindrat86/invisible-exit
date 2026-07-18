import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANGUAGE_MAP } from "@/i18n/languages";
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
import ExitIntentPopup from "./components/ExitIntentPopup.tsx";
import { AutoTranslate } from "@/i18n/AutoTranslate.tsx";
// Eager: the homepage is the money page — no spinner between prerendered
// shell and hydrated hero.
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
const AiToolProfessionPage = lazy(() => import("./pages/AiToolProfessionPage.tsx"));
const BudgetPage = lazy(() => import("./pages/BudgetPage.tsx"));
const HoursPage = lazy(() => import("./pages/HoursPage.tsx"));

// Funnel & marketing pages
const SqueezePage = lazy(() => import("./pages/SqueezePage.tsx"));
const DownsellPage = lazy(() => import("./pages/DownsellPage.tsx"));
const MasterclassPage = lazy(() => import("./pages/MasterclassPage.tsx"));
const AffiliatesPage = lazy(() => import("./pages/AffiliatesPage.tsx"));
const IntensivePage = lazy(() => import("./pages/IntensivePage.tsx"));
const StoryPage = lazy(() => import("./pages/StoryPage.tsx"));
const ManifestoPage = lazy(() => import("./pages/ManifestoPage.tsx"));
const PillarFreedomNumberPage = lazy(() => import("./pages/PillarFreedomNumberPage.tsx"));
const AlternativesComparePage = lazy(() => import("./pages/AlternativesComparePage.tsx"));
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
const TripwirePage = lazy(() => import("./pages/TripwirePage.tsx"));
const WeekendWorkshopPage = lazy(() => import("./pages/WeekendWorkshopPage.tsx"));
const AskCampaignPage = lazy(() => import("./pages/AskCampaignPage.tsx"));
const BookFunnelPage = lazy(() => import("./pages/BookFunnelPage.tsx"));
const FoundingWallPage = lazy(() => import("./pages/FoundingWallPage.tsx"));
const FrameworkOriginsPage = lazy(() => import("./pages/FrameworkOriginsPage.tsx"));
const ProofPage = lazy(() => import("./pages/ProofPage.tsx"));
const BeliefCrusherPage = lazy(() => import("./pages/BeliefCrusherPage.tsx"));
const LexiconPage = lazy(() => import("./pages/LexiconPage.tsx"));
const OneThingPage = lazy(() => import("./pages/OneThingPage.tsx"));
const JoinMovementPage = lazy(() => import("./pages/JoinMovementPage.tsx"));
const IsThisYouPage = lazy(() => import("./pages/IsThisYouPage.tsx"));
const DreamCustomerPage = lazy(() => import("./pages/DreamCustomerPage.tsx"));
const WhereTheyHidePage = lazy(() => import("./pages/WhereTheyHidePage.tsx"));
const AdLibraryPage = lazy(() => import("./pages/AdLibraryPage.tsx"));
const HSOMatrixPage = lazy(() => import("./pages/HSOMatrixPage.tsx"));
const First100kPage = lazy(() => import("./pages/First100kPage.tsx"));
const GrowingGridPage = lazy(() => import("./pages/GrowingGridPage.tsx"));
const YouTubeStrategyPage = lazy(() => import("./pages/YouTubeStrategyPage.tsx"));
const Dream100TrackerPage = lazy(() => import("./pages/Dream100TrackerPage.tsx"));
const PillarHubPage = lazy(() => import("./pages/PillarHubPage.tsx"));
const ExploreHubPage = lazy(() => import("./pages/ExploreHubPage.tsx"));
const CostAnalysisPage = lazy(() => import("./pages/CostAnalysisPage.tsx"));
const HowToGuidePage = lazy(() => import("./pages/HowToGuidePage.tsx"));
const IsItLegalPage = lazy(() => import("./pages/IsItLegalPage.tsx"));
const CostAnalysisHubPage = lazy(() => import("./pages/CostAnalysisHubPage.tsx"));
const HowToHubPage = lazy(() => import("./pages/HowToHubPage.tsx"));
const IsItLegalHubPage = lazy(() => import("./pages/IsItLegalHubPage.tsx"));
const BankingPage = lazy(() => import("./pages/BankingPage.tsx"));
const BankingHubPage = lazy(() => import("./pages/BankingHubPage.tsx"));
const TaxGuidePage = lazy(() => import("./pages/TaxGuidePage.tsx"));
const TaxGuideHubPage = lazy(() => import("./pages/TaxGuideHubPage.tsx"));
const TimeFrameworkPage = lazy(() => import("./pages/TimeFrameworkPage.tsx"));
const TimeFrameworkHubPage = lazy(() => import("./pages/TimeFrameworkHubPage.tsx"));
const NdaGuidePage = lazy(() => import("./pages/NdaGuidePage.tsx"));
const NdaGuideHubPage = lazy(() => import("./pages/NdaGuideHubPage.tsx"));
const InsurancePage = lazy(() => import("./pages/InsurancePage.tsx"));
const InsuranceHubPage = lazy(() => import("./pages/InsuranceHubPage.tsx"));
const ColdTrafficBridgePage = lazy(() => import("./pages/ColdTrafficBridgePage.tsx"));
const IntegrationMarketingPage = lazy(() => import("./pages/IntegrationMarketingPage.tsx"));
const JVPage = lazy(() => import("./pages/JVPage.tsx"));
const HubAndSpokePage = lazy(() => import("./pages/HubAndSpokePage.tsx"));
const HooksLibraryPage = lazy(() => import("./pages/HooksLibraryPage.tsx"));
const GrowthHackingPage = lazy(() => import("./pages/GrowthHackingPage.tsx"));
const PressPage = lazy(() => import("./pages/PressPage.tsx"));
const GrowthLabPage = lazy(() => import("./pages/GrowthLabPage.tsx"));
// ── Greg Isenberg pSEO Round 4 ──
const SideHustlePage = lazy(() => import("./pages/SideHustlePage.tsx"));
const BudgetStartPage = lazy(() => import("./pages/BudgetStartPage.tsx"));
const NichePage = lazy(() => import("./pages/NichePage.tsx"));
// ── Greg Isenberg pSEO Round 5 ──
const QuitJobPage = lazy(() => import("./pages/QuitJobPage.tsx"));
const WeekendBuildPage = lazy(() => import("./pages/WeekendBuildPage.tsx"));
const FailureStoryPage = lazy(() => import("./pages/FailureStoryPage.tsx"));
// ── Greg Isenberg pSEO Round 6 ──
const ToolReviewPage = lazy(() => import("./pages/ToolReviewPage.tsx"));
const CaseStudyPage = lazy(() => import("./pages/CaseStudyPage.tsx"));
const RevenueTargetPage = lazy(() => import("./pages/RevenueTargetPage.tsx"));
const CityPage = lazy(() => import("./pages/CityPage.tsx"));
const SkillMonetizationPage = lazy(() => import("./pages/SkillMonetizationPage.tsx"));
// ── Greg Isenberg pSEO Round 7 ──
const AudiencePage = lazy(() => import("./pages/AudiencePage.tsx"));
const CityProfessionPage = lazy(() => import("./pages/CityProfessionPage.tsx"));
const ExitStrategyPage = lazy(() => import("./pages/ExitStrategyPage.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));

// Checkout / Order pages
const StartPage = lazy(() => import("./pages/StartPage.tsx"));
const PricingPage = lazy(() => import("./pages/PricingPage.tsx"));

// App pages (authenticated, never crawled)
const OTOFounding = lazy(() => import("./pages/OTOFounding.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Signup = lazy(() => import("./pages/Signup.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Badge = lazy(() => import("./pages/Badge.tsx"));
const Confirmation = lazy(() => import("./pages/Confirmation.tsx"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess.tsx"));
const AdminFeatureRequests = lazy(() => import("./pages/AdminFeatureRequests.tsx"));

const queryClient = new QueryClient();

/**
 * Handles /:lang/* URLs for localization.
 * When a user visits /es/blog, this sets the i18next language to Spanish
 * and navigates to /blog (so the actual page renders).
 * The language is persisted to localStorage so it sticks across navigation.
 */
function LangRedirectWrapper() {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && LANGUAGE_MAP[lang]) {
      // Set and persist the language BEFORE navigating
      i18n.changeLanguage(lang);
      try {
        localStorage.setItem("i18n_lang", lang);
      } catch {
        // ignore
      }
      // Set a flag so the i18n init code knows not to override from URL
      try {
        sessionStorage.setItem("i18n_lang_set", "1");
      } catch {
        // ignore
      }
      // Navigate to the path without the lang prefix
      const segments = location.pathname.split("/").filter(Boolean);
      const rest = "/" + segments.slice(1).join("/");
      navigate(rest, { replace: true });
    }
  }, [lang, location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

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
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-3 border-primary border-t-transparent animate-spin" />
              <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
            </div>
          </div>
        }>
        <AutoTranslate>
        <div className="page-enter">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/start" element={<StartPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/oto/founding" element={<OTOFounding />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/feature-requests" element={<AdminFeatureRequests />} />
          <Route path="/fym/badge/:shareId" element={<Badge />} />
          {/* Redirects from old URLs */}
          <Route path="/fym" element={<Navigate to="/" replace />} />
          <Route path="/idea-pipeline" element={<Navigate to="/ideas" replace />} />
          <Route path="/stealth-ops" element={<Navigate to="/" replace />} />
          <Route path="/launch-control" element={<Navigate to="/" replace />} />
          <Route path="/brand-manager" element={<Navigate to="/" replace />} />
          <Route path="/founding-member" element={<Navigate to="/oto/founding" replace />} />
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

          {/* AI Tool × Profession cross pages */}
          <Route path="/ideas/:profession/with/:tool" element={<AiToolProfessionPage />} />

          {/* Budget pages */}
          <Route path="/budget/:amount" element={<BudgetPage />} />
          <Route path="/budget" element={<Navigate to="/blog" replace />} />

          {/* Hours pages */}
          <Route path="/hours/:slug" element={<HoursPage />} />
          <Route path="/hours" element={<Navigate to="/blog" replace />} />

          {/* ── Greg Isenberg pSEO - Cost Analysis pages ── */}
          <Route path="/cost-analysis/:slug" element={<CostAnalysisPage />} />
          <Route path="/cost-analysis" element={<CostAnalysisHubPage />} />

          {/* ── Greg Isenberg pSEO - How-To guides ── */}
          <Route path="/how-to/:slug" element={<HowToGuidePage />} />
          <Route path="/how-to" element={<HowToHubPage />} />

          {/* ── Greg Isenberg pSEO - Is It Legal pages ── */}
          <Route path="/is-it-legal/:slug" element={<IsItLegalPage />} />
          <Route path="/is-it-legal" element={<IsItLegalHubPage />} />

          {/* ── Banking guides ── */}
          <Route path="/banking/:state" element={<BankingPage />} />
          <Route path="/banking" element={<BankingHubPage />} />

          {/* ── Tax guides (Greg Isenberg pSEO Round 8) ── */}
          <Route path="/tax-guides/:state" element={<TaxGuidePage />} />
          <Route path="/tax-guides" element={<TaxGuideHubPage />} />

          {/* ── NDA guides ── */}
          <Route path="/nda-guides/:state" element={<NdaGuidePage />} />
          <Route path="/nda-guides" element={<NdaGuideHubPage />} />

          {/* ── Insurance guides ── */}
          <Route path="/insurance/:state" element={<InsurancePage />} />
          <Route path="/insurance" element={<InsuranceHubPage />} />

          {/* ── Time framework guides ── */}
          <Route path="/time-frameworks/:slug" element={<TimeFrameworkPage />} />
          <Route path="/time-frameworks" element={<TimeFrameworkHubPage />} />

          {/* ── Greg Isenberg pSEO Round 4 ── */}
          <Route path="/side-hustles/:slug" element={<SideHustlePage />} />
          <Route path="/side-hustles" element={<Navigate to="/blog" replace />} />
          <Route path="/by-budget/:slug" element={<BudgetStartPage />} />
          <Route path="/by-budget" element={<Navigate to="/blog" replace />} />
          <Route path="/niches/:slug" element={<NichePage />} />
          <Route path="/niches" element={<Navigate to="/blog" replace />} />

          {/* ── Greg Isenberg pSEO Round 5 ── */}
          <Route path="/quit-your-job/:slug" element={<QuitJobPage />} />
          <Route path="/quit-your-job" element={<Navigate to="/blog" replace />} />
          <Route path="/weekend-builds/:slug" element={<WeekendBuildPage />} />
          <Route path="/weekend-builds" element={<Navigate to="/blog" replace />} />
          <Route path="/failure-stories/:slug" element={<FailureStoryPage />} />
          <Route path="/failure-stories" element={<Navigate to="/blog" replace />} />

          {/* ── Greg Isenberg pSEO Round 6 ── */}
          <Route path="/reviews/:slug" element={<ToolReviewPage />} />
          <Route path="/reviews" element={<Navigate to="/blog" replace />} />
          <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
          <Route path="/case-studies" element={<Navigate to="/blog" replace />} />
          <Route path="/revenue/:slug" element={<RevenueTargetPage />} />
          <Route path="/revenue" element={<Navigate to="/blog" replace />} />
          <Route path="/cities/:slug" element={<CityPage />} />
          <Route path="/cities" element={<Navigate to="/blog" replace />} />
          <Route path="/skills/:slug" element={<SkillMonetizationPage />} />
          <Route path="/skills" element={<Navigate to="/blog" replace />} />

          {/* ── Greg Isenberg pSEO Round 7 ── */}
          <Route path="/audience/:slug" element={<AudiencePage />} />
          <Route path="/audience" element={<Navigate to="/blog" replace />} />
          <Route path="/cities/:citySlug/for/:professionSlug" element={<CityProfessionPage />} />

          {/* ── Greg Isenberg pSEO: Exit Strategy pages ── */}
          <Route path="/exit-strategies/:slug" element={<ExitStrategyPage />} />
          <Route path="/exit-strategies" element={<Navigate to="/blog" replace />} />

          <Route path="/non-compete" element={<Navigate to="/blog" replace />} />
          {/* ── Funnel Pages ── */}
          <Route path="/freedom" element={<SqueezePage />} />
          <Route path="/oto/downsell" element={<DownsellPage />} />
          <Route path="/masterclass" element={<MasterclassPage />} />
          <Route path="/affiliates" element={<AffiliatesPage />} />
          <Route path="/intensive" element={<IntensivePage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/manifesto" element={<ManifestoPage />} />
          <Route path="/guides/freedom-number" element={<PillarFreedomNumberPage />} />
          <Route path="/compare" element={<ComparePage />} />
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
          <Route path="/tripwire" element={<TripwirePage />} />
          <Route path="/weekend-workshop" element={<WeekendWorkshopPage />} />
          <Route path="/ask" element={<AskCampaignPage />} />
          <Route path="/free-book" element={<BookFunnelPage />} />
          <Route path="/founding-wall" element={<FoundingWallPage />} />
          <Route path="/frameworks" element={<FrameworkOriginsPage />} />
          <Route path="/proof" element={<ProofPage />} />
          <Route path="/beliefs" element={<BeliefCrusherPage />} />
          <Route path="/lexicon" element={<LexiconPage />} />
          <Route path="/one-thing" element={<OneThingPage />} />
          <Route path="/join" element={<JoinMovementPage />} />
          <Route path="/is-this-you" element={<IsThisYouPage />} />
          <Route path="/who" element={<DreamCustomerPage />} />
          <Route path="/where" element={<WhereTheyHidePage />} />
          <Route path="/ad-library" element={<AdLibraryPage />} />
          <Route path="/hso" element={<HSOMatrixPage />} />
          <Route path="/traffic-roadmap" element={<First100kPage />} />
          <Route path="/testing" element={<GrowingGridPage />} />
          <Route path="/youtube-strategy" element={<YouTubeStrategyPage />} />
          <Route path="/dream-100-tracker" element={<Dream100TrackerPage />} />
          <Route path="/pillar-hub" element={<PillarHubPage />} />
          <Route path="/explore" element={<ExploreHubPage />} />
          <Route path="/feeling-stuck" element={<ColdTrafficBridgePage />} />
          <Route path="/partners/embed" element={<IntegrationMarketingPage />} />
          <Route path="/partners/jv" element={<JVPage />} />
          <Route path="/content-strategy" element={<HubAndSpokePage />} />
          <Route path="/hooks" element={<HooksLibraryPage />} />
          <Route path="/growth" element={<GrowthHackingPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/growth-lab" element={<GrowthLabPage />} />
          <Route path="/oto/second-tool" element={<Navigate to="/" replace />} />
          {/* Redirects from /fym/ prefixed URLs (legacy worktree) */}
          <Route path="/fym/oto/founding" element={<Navigate to="/oto/founding" replace />} />
          <Route path="/fym/oto/second-tool" element={<Navigate to="/" replace />} />
          <Route path="/fym/dashboard" element={<Navigate to="/dashboard" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}

          {/* ── i18n: Language-prefixed routes (/:lang/*) ── */}
          {/* Handles /es, /ar, /ja, etc. — strips lang prefix, sets i18next, redirects */}
          <Route path="/:lang" element={<LangRedirectWrapper />} />
          <Route path="/:lang/*" element={<LangRedirectWrapper />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
        </AutoTranslate>
        </Suspense>
        </ErrorBoundary>
        <BackToTop />
        <MobileCTABar />
        <ExitIntentPopup />
        {/* Brunson Trust Bar — Dotcom Secrets Ch 7 */}
        <div dangerouslySetInnerHTML={{ __html: `<!-- BRUNSON TRUST BAR -- idempotency:trust-bar-v1 -->
<section class="brunson-trust-bar" style="background:linear-gradient(135deg, #0f172a, #1e293b);color:#e8eaed;padding:40px 24px;margin:60px 0 0;border-top:3px solid #00d4aa;text-align:center;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">
  <div style="max-width:900px;margin:0 auto">
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:28px;margin-bottom:28px">
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">$4,000</span><br><span style="font-size:.82rem;color:#94a3b8">Monthly Recurring Target</span></div>
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">138</span><br><span style="font-size:.82rem;color:#94a3b8">Customers Onboarded</span></div>
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">$0.97</span><br><span style="font-size:.82rem;color:#94a3b8">Tripwire Start</span></div>
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">5</span><br><span style="font-size:.82rem;color:#94a3b8">AI Tools Included</span></div>
    </div>
    <p style="font-size:1.05rem;margin-bottom:24px;color:#cbd5e1">Your corporate job pays the bills. A side business pays your freedom. Start for less than a coffee.</p>
    <a href="/#start" style="display:inline-block;background:linear-gradient(135deg,#00d4aa,#2deec0);color:#04130e;padding:14px 32px;border-radius:12px;font-weight:700;text-decoration:none;font-size:.95rem;box-shadow:0 8px 24px -10px rgba(0,212,170,.5)">Get Started for $0.97</a>
    <p style="margin-top:18px;font-size:.78rem;color:#6b7178">30-day money-back guarantee. If you do not build revenue, you do not pay.</p>
  </div>
</section>` }} />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
