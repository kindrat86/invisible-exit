import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1B2A4A]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-white text-xl font-bold tracking-tight">
          Invisible Exit
        </Link>
        <Link
          to="/login"
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
