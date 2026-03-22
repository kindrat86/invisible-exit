import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const TOOLS = [
  { name: "FYM Dashboard", href: "/fym" },
  { name: "Idea Pipeline", href: "/idea-pipeline" },
  { name: "Stealth Ops Hub", href: "/stealth-ops" },
  { name: "Launch Control", href: "/launch-control" },
  { name: "Brand Manager", href: "/brand-manager" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1B2A4A]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-white text-xl font-bold tracking-tight">
          Invisible Exit
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button className="text-white/70 hover:text-white text-sm font-medium transition-colors inline-flex items-center gap-1">
              Tools
              <ChevronDown className="w-4 h-4" />
            </button>
            {toolsOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1B2A4A] border border-white/10 rounded-xl shadow-lg py-2">
                {TOOLS.map((tool) => (
                  <Link
                    key={tool.href}
                    to={tool.href}
                    className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            to="/founding-member"
            className="text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            Founding Member
          </Link>
          <Link
            to="/login"
            className="text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            Login
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/70 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1B2A4A] border-t border-white/10 px-6 pb-6">
          <div className="py-3">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Tools</p>
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                to={tool.href}
                className="block py-2 text-sm text-white/70 hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {tool.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-white/10 pt-3 space-y-2">
            <Link
              to="/founding-member"
              className="block py-2 text-sm text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Founding Member
            </Link>
            <Link
              to="/login"
              className="block py-2 text-sm text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
