import { Link } from "react-router-dom";

const FOOTER_SECTIONS = [
  {
    title: "Playbook",
    links: [
      { label: "Blog", to: "/blog" },
      { label: "My Story", to: "/story" },
      { label: "Who Is Adrian?", to: "/adrian" },
      { label: "Free Freedom Calculator", to: "/freedom" },
      { label: "Free Masterclass", to: "/masterclass" },
      { label: "The Inner Circle", to: "/inner-circle" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Ideas by Profession", to: "/ideas" },
      { label: "State Guides", to: "/guides" },
      { label: "Best Tools", to: "/best" },
      { label: "Calculators", to: "/calculators" },
      { label: "Data Reports", to: "/data" },
      { label: "Resources", to: "/resources" },
    ],
  },
  {
    title: "Reference",
    links: [
      { label: "Glossary", to: "/glossary" },
      { label: "Comparisons", to: "/compare" },
      { label: "About", to: "/about" },
      { label: "Affiliates (30%)", to: "/affiliates" },
      { label: "Affiliate Assets", to: "/affiliate-assets" },
      { label: "Dream 100", to: "/dream-100" },
      { label: "Traffic Blueprint", to: "/traffic-blueprint" },
      { label: "Pro ($47/mo)", to: "/pro" },
      { label: "Intensive ($2K)", to: "/intensive" },
      { label: "RSS Feed", to: "/blog/rss.xml" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-[hsl(222_47%_9%)] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top: Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 md:py-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/30">
                <span className="block w-3 h-3 rounded-sm bg-primary" />
              </span>
              <span>Invisible Exit</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Build a side business while employed. Stay invisible. Calculate your exit.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-white/90 font-semibold text-sm mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-white/50 hover:text-primary-light text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-white/5">
          <p className="text-white/30 text-xs sm:text-sm order-2 sm:order-1">
            © {new Date().getFullYear()} Invisible Exit. All rights reserved.
          </p>
          <p className="text-white/30 text-xs sm:text-sm order-1 sm:order-2">
            Built by a corporate manager, for corporate managers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
