import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Build",
    links: [
      { label: "Blog", to: "/blog" },
      { label: "Micro-SaaS Ideas", to: "/ideas" },
      { label: "State Guides", to: "/guides" },
      { label: "Tool Stacks", to: "/stack" },
    ],
  },
  {
    label: "Learn",
    links: [
      { label: "Calculators", to: "/calculators" },
      { label: "Best Tools", to: "/best" },
      { label: "Data Reports", to: "/data" },
      { label: "Glossary", to: "/glossary" },
      { label: "Resources", to: "/resources" },
      { label: "Timeline", to: "/timeline" },
      { label: "Revenue Milestones", to: "/milestones" },
    ],
  },
  {
    label: "Decide",
    links: [
      { label: "Comparisons", to: "/compare" },
      { label: "Alternatives", to: "/alternatives" },
      { label: "Salaries → SaaS", to: "/salaries" },
      { label: "Non-Compete Guide", to: "/non-compete" },
    ],
  },
  {
    label: "Story",
    links: [
      { label: "My Origin Story", to: "/story" },
      { label: "Who Is Adrian?", to: "/adrian" },
      { label: "Inner Circle", to: "/inner-circle" },
      { label: "Affiliates (30%)", to: "/affiliates" },
    ],
  },
];

// Flatten for desktop
const DESKTOP_LINKS = [
  { label: "Blog", to: "/blog" },
  { label: "Ideas", to: "/ideas" },
  { label: "Guides", to: "/guides" },
  { label: "Tools", to: "/best" },
  { label: "Calculators", to: "/calculators" },
  { label: "Glossary", to: "/glossary" },
];

const Navbar = () => {
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
            ? "bg-[hsl(222_47%_11%)]/95 backdrop-blur-xl shadow-lg shadow-black/20"
            : "bg-[hsl(222_47%_11%)]/80 backdrop-blur-md"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-bold text-lg tracking-tight transition-opacity hover:opacity-80"
              aria-label="Invisible Exit home"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/30">
                <span className="block w-3 h-3 rounded-sm bg-primary animate-pulse" />
              </span>
              <span className="hidden xs:inline sm:inline">Invisible Exit</span>
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
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/freedom"
                className="text-white/60 hover:text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
              >
                Free Calculator
              </Link>
              <Link
                to="/oto/founding"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center w-11 h-11 -mr-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
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
              <span className="text-white font-bold text-lg">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grouped navigation */}
            <div className="px-3 py-4">
              {NAV_GROUPS.map((group, gi) => (
                <div key={group.label} className={gi > 0 ? "mt-6" : ""}>
                  <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                    {group.label}
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
                        {link.label}
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
                  Calculate Freedom Number (Free)
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/oto/founding"
                  className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-white/80 border border-white/15 hover:bg-white/5 transition-colors"
                  style={{ minHeight: "44px" }}
                >
                  Get Started — $0.97/month
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
