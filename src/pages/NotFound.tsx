import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const links = [
    { href: "/", title: "Homepage", desc: "5 AI tools for building a side business while employed" },
    { href: "/blog", title: "Blog", desc: "Strategies for invisible recurring revenue" },
    { href: "/freedom", title: "Freedom Calculator", desc: "Calculate how much you need to quit your job" },
    { href: "/glossary", title: "Glossary", desc: "Key terms for employed founders" },
    { href: "/guides", title: "State Guides", desc: "LLC formation and anonymity by state" },
    { href: "/ideas", title: "Micro-SaaS Ideas", desc: "500+ ideas scored by industry fit" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6 py-16">
      <SEOHead
        title="Page Not Found | Invisible Exit"
        description="The page you're looking for doesn't exist. Explore Invisible Exit's tools for building a side business while employed."
        url="/404"
        noindex
      />
      <div className="w-full max-w-2xl text-center">
        <div className="mb-4 bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-8xl font-extrabold text-transparent">
          404
        </div>
        <h1 className="mb-3 text-3xl font-bold">This page doesn't exist</h1>
        <p className="mb-10 text-lg text-muted-foreground">
          The page you're looking for may have been moved, deleted, or never existed.
          Here's where you can go from here:
        </p>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block rounded-xl border border-border bg-card p-5 text-left transition hover:border-primary hover:bg-accent"
            >
              <div className="mb-1 font-semibold">{link.title}</div>
              <div className="text-sm text-muted-foreground">{link.desc}</div>
            </Link>
          ))}
        </div>

        <Link
          to="/"
          className="inline-block rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-3.5 font-semibold text-white transition hover:opacity-90"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
