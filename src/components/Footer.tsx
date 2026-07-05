import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const FOOTER_SECTIONS = [
  {
    title: "Playbook",
    links: [
      { label: "Blog", to: "/blog" },
      { label: "My Story", to: "/story" },
      { label: "Manifesto", to: "/manifesto" },
      { label: "Why Not Something Else?", to: "/compare" },
      { label: "Who Is Adrian?", to: "/adrian" },
      { label: "Free Freedom Calculator", to: "/freedom" },
      { label: "Ask Adrian Anything", to: "/ask" },
      { label: "Free Book (Just Pay Shipping)", to: "/free-book" },
      { label: "Founding Wall", to: "/founding-wall" },
      { label: "The 3 Frameworks", to: "/frameworks" },
      { label: "Proof & Results", to: "/proof" },
      { label: "Belief Crusher", to: "/beliefs" },
      { label: "Movement Lexicon", to: "/lexicon" },
      { label: "The One Thing", to: "/one-thing" },
      { label: "Join the Movement", to: "/join" },
      { label: "Is This You?", to: "/is-this-you" },
      { label: "Dream Customer Avatar", to: "/who" },
      { label: "Where They Hide", to: "/where" },
      { label: "Ad Creative Library", to: "/ad-library" },
      { label: "Hook-Story-Offer Matrix", to: "/hso" },
      { label: "0→100K Traffic Roadmap", to: "/traffic-roadmap" },
      { label: "Growing Grid (A/B Tests)", to: "/testing" },
      { label: "YouTube Strategy", to: "/youtube-strategy" },
      { label: "Dream 100 Tracker", to: "/dream-100-tracker" },
      { label: "Pillar Content Hub", to: "/pillar-hub" },
      { label: "Explore Everything", to: "/explore" },
      { label: "Integration Marketing", to: "/partners/embed" },
      { label: "Cold Traffic Bridge", to: "/feeling-stuck" },
      { label: "Free Masterclass", to: "/masterclass" },
      { label: "The Inner Circle", to: "/inner-circle" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Ideas by Profession", to: "/ideas" },
      { label: "AI Tool Ideas", to: "/ideas/for-accountants/with/chatgpt" },
      { label: "Budget Stacks", to: "/budget/0-dollars" },
      { label: "Time Strategy", to: "/hours/5-hours-per-week" },
      { label: "First Year Roadmaps", to: "/first-year" },
      { label: "State Guides", to: "/guides" },
      { label: "Best Tools", to: "/best" },
      { label: "Tool Cross-Reference", to: "/tools" },
      { label: "Tool Stacks", to: "/stack" },
      { label: "Calculators", to: "/calculators" },
      { label: "Break-Even Calculator", to: "/break-even" },
      { label: "Data Reports", to: "/data" },
      { label: "Resources", to: "/resources" },
      { label: "Timeline", to: "/timeline" },
      { label: "Revenue Milestones", to: "/milestones" },
      { label: "Pricing Models", to: "/pricing-models" },
    ],
  },
  {
    title: "Reference",
    links: [
      { label: "Glossary", to: "/glossary" },
      { label: "Comparisons", to: "/compare" },
      { label: "Career vs SaaS", to: "/vs" },
      { label: "Common Mistakes", to: "/mistakes" },
      { label: "Reddit Strategy", to: "/reddit" },
      { label: "Alternatives", to: "/alternatives" },
      { label: "Salaries → SaaS", to: "/salaries" },
      { label: "Non-Compete Guide", to: "/non-compete" },
      { label: "About", to: "/about" },
      { label: "Affiliates (30%)", to: "/affiliates" },
      { label: "Pro ($47/mo)", to: "/pro" },
      { label: "Weekend Workshop ($97)", to: "/weekend-workshop" },
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

// Collapsible section for mobile
function CollapsibleSection({
  title,
  links,
  defaultOpen = false,
}: {
  title: string;
  links: { label: string; to: string }[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/5 md:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 md:hidden"
        aria-expanded={open}
      >
        <h3 className="text-white/90 font-semibold text-sm">{title}</h3>
        <ChevronDown
          className={`w-4 h-4 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Always visible on desktop, toggle on mobile */}
      <div className={`${open ? "block" : "hidden"} md:block pb-4 md:pb-0`}>
        <h3 className="hidden md:block text-white/90 font-semibold text-sm mb-4">{title}</h3>
        <ul className="space-y-2.5 md:space-y-2">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="text-white/70 hover:text-white text-sm transition-colors block py-2 md:py-1.5"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-[hsl(222_47%_9%)] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top: Link columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 md:py-16">
          {/* Brand */}
          <div className="md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/30">
                <span className="block w-3 h-3 rounded-sm bg-primary" />
              </span>
              <span>{t("nav.brand")}</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://www.youtube.com/@InvisibleExit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/InvisibleExit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/invisible-exit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Collapsible sections */}
          {FOOTER_SECTIONS.map((section, i) => (
            <CollapsibleSection
              key={section.title}
              title={section.title}
              links={section.links}
              defaultOpen={i === 0}
            />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-white/5">
          <p className="text-white/50 text-xs sm:text-sm order-2 sm:order-1">
            © {new Date().getFullYear()} {t("nav.brand")}. {t("footer.allRightsReserved")}
          </p>
          <div className="flex items-center gap-4 order-1 sm:order-2">
            <LanguageSwitcher variant="compact" className="text-white/70" />
            <p className="hidden sm:block text-white/50 text-xs sm:text-sm">
              Built by a corporate manager, for corporate managers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
