import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0f1a2e] border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="text-white font-bold text-lg">Invisible Exit</span>

        <div className="flex items-center gap-6">
          <Link to="/privacy" className="text-white/50 hover:text-white/80 text-sm transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-white/50 hover:text-white/80 text-sm transition-colors">
            Terms of Service
          </Link>
        </div>

        <span className="text-white/30 text-xs">&copy; {new Date().getFullYear()} Invisible Exit</span>
      </div>
    </footer>
  );
};

export default Footer;
