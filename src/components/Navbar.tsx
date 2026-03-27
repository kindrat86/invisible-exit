import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1B2A4A]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-white text-xl font-bold tracking-tight">
          Invisible Exit
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/blog"
            className="text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            Blog
          </Link>
          <Link
            to="/login"
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
