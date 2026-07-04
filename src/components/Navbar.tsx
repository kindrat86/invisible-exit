import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Blog", to: "/blog" },
  { label: "Ideas", to: "/ideas" },
  { label: "Guides", to: "/guides" },
  { label: "Tools", to: "/best" },
  { label: "Calculators", to: "/calculators" },
  { label: "Glossary", to: "/glossary" },
  { label: "Affiliates", to: "/affiliates" },
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
    return () => { document.body.style.overflow = ""; };
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
              <span>Invisible Exit</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
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
                to="/login"
                className="text-white/60 hover:text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
              >
                Login
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

      {/* Mobile slide-down menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

          {/* Menu panel */}
          <div className="absolute top-16 left-0 right-0 bg-[hsl(222_47%_11%)] border-t border-white/10 shadow-2xl overflow-y-auto safe-bottom animate-slide-down max-h-[calc(100vh-4rem)]">
            <div className="px-4 py-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium transition-colors min-h-[52px] ${
                    location.pathname.startsWith(link.to)
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  <ArrowRight className="w-4 h-4 opacity-40" />
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
                <Link
                  to="/login"
                  className="flex items-center justify-center px-4 py-3.5 rounded-xl text-base font-medium text-white/80 border border-white/15 hover:bg-white/5 transition-colors min-h-[48px]"
                >
                  Login
                </Link>
                <Link
                  to="/oto/founding"
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-base font-semibold bg-primary text-white hover:bg-primary-hover transition-colors min-h-[48px]"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
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
