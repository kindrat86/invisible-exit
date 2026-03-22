import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1B2A4A]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <Link to="/" className="text-white text-xl font-bold tracking-tight">
          Invisible Exit
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
