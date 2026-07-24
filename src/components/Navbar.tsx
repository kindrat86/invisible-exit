import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, ChevronDown, Search, LayoutDashboard, BookOpen } from "lucide-react";

type NavLinkDef = { to: string; labelKey?: string; label?: string };

const NAV_GROUPS: { labelKey: string; links: NavLinkDef[] }[] = [
  {
    labelKey: "Build",
    links: [
      { label: "Blog", to: "/blog" },
      { label: "Micro-SaaS Ideas", to: "/ideas" },
      { label: "AI Tool Ideas", to: "/ideas/for-accountants/with/chatgpt" },
      { label: "Budget Stacks", to: "/budget/0-dollars" },
      { label: "Time Strategy", to: "/hours/5-hours-per-week" },
      { label: "State Guides", to: "/guides" },
      { label: "Tool Stacks", to: "/stack" },
      { label: "First Year Roadmaps", to: "/first-year" },
    ],
  },
  {
    labelKey: "Learn",
    links: [
      { label: "Calculators", to: "/calculators" },
      { label: "Best Tools", to: "/best" },
      { label: "Tool Cross-Reference", to: "/tools" },
      { label: "Data Reports", to: "/data" },
      { label: "Glossary", to: "/glossary" },
      { label: "Resources", to: "/resources" },
      { label: "Timeline", to: "/timeline" },
      { label: "Revenue Milestones", to: "/milestones" },
      { label: "Break-Even Calculator", to: "/break-even" },
    ],
  },
  {
    labelKey: "Decide",
    links: [
      { label: "Comparisons", to: "/compare" },
      { label: "Career vs SaaS", to: "/vs" },
      { label: "Alternatives", to: "/alternatives" },
      { label: "Salaries to SaaS", to: "/salaries" },
      { label: "Common Mistakes", to: "/mistakes" },
      { label: "Reddit Strategy", to: "/reddit" },
      { label: "Non-Compete Guide", to: "/non-compete" },
    ],
  },
  {
    labelKey: "Story",
    links: [
      { label: "Free Book (Just Pay Shipping)", to: "/free-book" },
      { label: "My Origin Story", to: "/story" },
      { label: "The Manifesto", to: "/manifesto" },
      { label: "Who Is Adrian?", to: "/adrian" },
      { label: "Inner Circle", to: "/inner-circle" },
      { label: "Affiliates", to: "/affiliates" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
];

// Flatten for desktop
const DESKTOP_LINKS: NavLinkDef[] = [
  { label: "Blog", to: "/blog" },
  { label: "Ideas", to: "/ideas" },
  { label: "Guides", to: "/guides" },
  { label: "Tools", to: "/best" },
  { label: "Calculators", to: "/calculators" },
  { label: "Glossary", to: "/glossary" },
  { label: "Pricing", to: "/pricing" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const location = useLocation();
  const lastScrollY = useRef(0);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      // Compact mode: shrink after 100px scroll, restore immediately when near top
      setCompact(currentY > 100);
      lastScrollY.current = currentY;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock scroll when mobile menu open + Escape to close + focus management
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      drawerCloseRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  // Touch ripple helper
  const handleRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  // ONE FUNNEL, ONE OFFER (DotCom Secrets): on the homepage the nav competes
  // with the funnel, so resource links are hidden there. They remain in the
  // footer (and on every other page) for discovery + SEO interlinking.
  const isHomepage = location.pathname === "/";

  const navbarHeight = compact ? "h-14" : "h-16 lg:h-20";
  const logoSize = compact ? "w-7 h-7" : "w-8 h-8";
  const pulseBlock = compact ? "w-2.5 h-2.5" : "w-3 h-3";
  const brandFontSize = compact ? "text-base" : "text-lg";

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
          <div className={`flex items-center justify-between transition-all duration-300 ${navbarHeight}`}>
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-bold tracking-tight transition-opacity hover:opacity-80"
              aria-label="Invisible Exit home"
            >
              <span className={`inline-flex items-center justify-center rounded-lg bg-primary/20 border border-primary/30 transition-all duration-300 ${logoSize}`}>
                <span className={`block rounded-sm bg-primary transition-all duration-300 ${pulseBlock}`} />
              </span>
              <span className={`inline transition-all duration-300 ${brandFontSize}`}>Invisible Exit</span>
            </Link>

            {/* Desktop nav — suppressed on the homepage (one funnel, one offer) */}
            <div className="hidden lg:flex items-center gap-1">
              {!isHomepage && DESKTOP_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={handleRipple}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith(link.to)
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label ?? link.labelKey}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/free-book"
                className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-semibold px-3 py-2 rounded-lg transition-colors hover:bg-amber-500/10"
              >
                <BookOpen className="w-4 h-4" />
                Free Book
              </Link>
              <Link
                to="/freedom"
                className="text-white/60 hover:text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
              >
                Free Calculator
              </Link>
              <Link
                to="/start"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:scale-[0.97]"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile: hamburger only */}
            <div className="flex lg:hidden items-center gap-1">
              <button
                ref={hamburgerRef}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex items-center justify-center w-11 h-11 -mr-2 rounded-lg text-white hover:bg-white/10 transition-colors active:scale-95"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-drawer"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Scroll progress indicator — thin line at bottom of navbar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-75"
            id="navbar-scroll-progress"
          />
        </div>
      </header>

      {/* Mobile right-side drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" onClick={() => setMobileOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in touch-none" />

          {/* Drawer panel — slides in from right */}
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[hsl(222_47%_11%)] shadow-2xl overflow-y-auto overscroll-contain safe-top safe-bottom"
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
              <span className="text-white font-bold text-lg">Menu</span>
              <button
                ref={drawerCloseRef}
                onClick={() => {
                  setMobileOpen(false);
                  hamburgerRef.current?.focus();
                }}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors active:scale-95"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grouped navigation */}
            <div className="px-3 py-4">
              {NAV_GROUPS.map((group, gi) => (
                <div key={group.labelKey} className={gi > 0 ? "mt-6" : ""}>
                  <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">
                    {group.labelKey}
                  </h3>
                  <div className="space-y-0.5">
                    {group.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center justify-between px-3 py-3 rounded-xl text-[15px] font-medium transition-colors active:bg-white/15 ${
                          location.pathname.startsWith(link.to)
                            ? "text-white bg-white/10"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {link.label ?? link.labelKey}
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
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-base font-semibold bg-primary text-white hover:bg-primary-hover transition-colors active:scale-[0.97]"
                  style={{ minHeight: "48px" }}
                >
                  Calculate Freedom Number (Free)
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/start"
                  className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-white/80 border border-white/15 hover:bg-white/5 transition-colors active:scale-[0.97]"
                  style={{ minHeight: "44px" }}
                >
                  Get Started
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
