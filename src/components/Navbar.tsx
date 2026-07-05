import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_GROUPS = [
  {
    labelKey: "nav.build",
    links: [
      { labelKey: "nav.blog", to: "/blog" },
      { labelKey: "nav.microSaaSIdeas", to: "/ideas" },
      { labelKey: "nav.aiToolIdeas", to: "/ideas/for-accountants/with/chatgpt" },
      { labelKey: "nav.budgetStacks", to: "/budget/0-dollars" },
      { labelKey: "nav.timeStrategy", to: "/hours/5-hours-per-week" },
      { labelKey: "nav.stateGuides", to: "/guides" },
      { labelKey: "nav.toolStacks", to: "/stack" },
      { labelKey: "nav.firstYearRoadmaps", to: "/first-year" },
    ],
  },
  {
    labelKey: "nav.learn",
    links: [
      { labelKey: "nav.calculators", to: "/calculators" },
      { labelKey: "nav.bestTools", to: "/best" },
      { labelKey: "nav.toolCrossReference", to: "/tools" },
      { labelKey: "nav.dataReports", to: "/data" },
      { labelKey: "nav.glossary", to: "/glossary" },
      { labelKey: "nav.resources", to: "/resources" },
      { labelKey: "nav.timeline", to: "/timeline" },
      { labelKey: "nav.revenueMilestones", to: "/milestones" },
      { labelKey: "nav.pricingModels", to: "/pricing-models" },
      { labelKey: "nav.breakEvenCalculator", to: "/break-even" },
    ],
  },
  {
    labelKey: "nav.decide",
    links: [
      { labelKey: "nav.comparisons", to: "/compare" },
      { labelKey: "nav.careerVsSaaS", to: "/vs" },
      { labelKey: "nav.alternatives", to: "/alternatives" },
      { labelKey: "nav.salariesToSaaS", to: "/salaries" },
      { labelKey: "nav.commonMistakes", to: "/mistakes" },
      { labelKey: "nav.redditStrategy", to: "/reddit" },
      { labelKey: "nav.nonCompeteGuide", to: "/non-compete" },
    ],
  },
  {
    labelKey: "nav.story",
    links: [
      { labelKey: "nav.myOriginStory", to: "/story" },
      { labelKey: "nav.theManifesto", to: "/manifesto" },
      { labelKey: "nav.whoIsAdrian", to: "/adrian" },
      { labelKey: "nav.innerCircle", to: "/inner-circle" },
      { labelKey: "nav.affiliates", to: "/affiliates" },
    ],
  },
];

// Flatten for desktop
const DESKTOP_LINKS = [
  { labelKey: "nav.blog", to: "/blog" },
  { labelKey: "nav.ideas", to: "/ideas" },
  { labelKey: "nav.guides", to: "/guides" },
  { labelKey: "nav.tools", to: "/best" },
  { labelKey: "nav.calculators", to: "/calculators" },
  { labelKey: "nav.glossary", to: "/glossary" },
];

const Navbar = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top ${
          scrolled
            ? "bg-[hsl(222_47%_11%)] shadow-lg shadow-black/20"
            : "bg-[hsl(222_47%_11%)]"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-bold text-lg tracking-tight transition-opacity hover:opacity-80"
              aria-label="Invisible Exit home"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/30">
                <span className="block w-3 h-3 rounded-sm bg-primary animate-pulse" />
              </span>
              <span className="inline">Invisible Exit</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {DESKTOP_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith(link.to)
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>

            {/* Desktop CTA + Language */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageSwitcher variant="compact" className="text-white/80" />
              <Link
                to="/freedom"
                className="text-white/60 hover:text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
              >
                {t("nav.freeCalculator")}
              </Link>
              <Link
                to="/oto/founding"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
              >
                {t("nav.getStarted")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile: language + hamburger */}
            <div className="flex lg:hidden items-center gap-1">
              <LanguageSwitcher variant="compact" className="text-white/80" />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex items-center justify-center w-11 h-11 -mr-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile right-side drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

          {/* Drawer panel — slides in from right */}
          <div
            className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[hsl(222_47%_11%)] shadow-2xl overflow-y-auto safe-top safe-bottom"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "drawerSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          >
            <style>{`
              @keyframes drawerSlideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            `}</style>

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 sticky top-0 bg-[hsl(222_47%_11%)]/95 backdrop-blur-xl z-10">
              <span className="text-white font-bold text-lg">{t("nav.menu")}</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors"
                aria-label={t("nav.closeMenu")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grouped navigation */}
            <div className="px-3 py-4">
              {NAV_GROUPS.map((group, gi) => (
                <div key={group.labelKey} className={gi > 0 ? "mt-6" : ""}>
                  <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                    {t(group.labelKey)}
                  </h3>
                  <div className="space-y-0.5">
                    {group.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center justify-between px-3 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                          location.pathname.startsWith(link.to)
                            ? "text-white bg-white/10"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {t(link.labelKey)}
                        <ArrowRight className="w-4 h-4 opacity-30" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTAs */}
            <div className="sticky bottom-0 px-5 py-4 border-t border-white/10 bg-[hsl(222_47%_11%)]/95 backdrop-blur-xl safe-bottom">
              <div className="space-y-2.5">
                <Link
                  to="/freedom"
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-base font-semibold bg-primary text-white hover:bg-primary-hover transition-colors"
                  style={{ minHeight: "48px" }}
                >
                  {t("cta.calculateFreedomNumber")}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/oto/founding"
                  className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-white/80 border border-white/15 hover:bg-white/5 transition-colors"
                  style={{ minHeight: "44px" }}
                >
                  {t("cta.getStartedPrice")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
