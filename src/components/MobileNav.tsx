import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";

const NAV_LINKS = [
  { label: "Blog", to: "/blog" },
  { label: "Ideas", to: "/ideas" },
  { label: "Guides", to: "/guides" },
  { label: "Tools", to: "/best" },
  { label: "Data", to: "/data" },
  { label: "Resources", to: "/resources" },
  { label: "Calculators", to: "/calculators" },
  { label: "Glossary", to: "/glossary" },
];

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    const handler = () => setOpen(false);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top ${
          scrolled
            ? "bg-[hsl(222_47%_11%)]/95 backdrop-blur-xl shadow-lg shadow-black/20"
            : "bg-[hsl(222_47%_11%)]/80 backdrop-blur-md"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-bold text-lg"
              onClick={() => setOpen(false)}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/30">
                <span className="block w-3 h-3 rounded-sm bg-primary" />
              </span>
              <span className="hidden sm:inline">Invisible Exit</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/oto/founding"
                className="ml-2 inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden flex items-center justify-center w-11 h-11 -mr-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-[hsl(222_47%_11%)] border-t border-white/10 shadow-2xl overflow-y-auto safe-bottom animate-slide-down max-h-[calc(100vh-4rem)]">
            <div className="px-4 py-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors min-h-[52px]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/oto/founding"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center mt-4 px-4 py-4 rounded-xl text-base font-semibold bg-primary text-white min-h-[52px]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
