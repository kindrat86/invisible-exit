import { Link } from "react-router-dom";
import {
  Search,
  Lightbulb,
  Briefcase,
  Wrench,
  Calculator,
  BookOpen,
  FileText,
  Globe,
  TrendingUp,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const CATEGORIES = [
  {
    icon: Lightbulb,
    title: "Micro-SaaS Ideas by Profession",
    description: "155 pages. Find validated micro-SaaS ideas tailored to your specific job title and industry.",
    link: "/ideas",
    linkLabel: "Browse 155 Ideas",
    count: "155 pages",
  },
  {
    icon: Briefcase,
    title: "Profession Deep Dives",
    description: "211 pages. Career-vs-business analysis, state guides, salary comparisons, and profession-specific strategies.",
    link: "/ideas",
    linkLabel: "Browse Professions",
    count: "211 pages",
  },
  {
    icon: Wrench,
    title: "AI Tool Cross-Reference",
    description: "120 pages. Which AI tools work best for each profession, budget level, and time constraint.",
    link: "/tools",
    linkLabel: "Browse Tools",
    count: "120 pages",
  },
  {
    icon: Calculator,
    title: "Interactive Calculators",
    description: "Freedom number, break-even analysis, cost-of-waiting, time strategy, and budget calculators.",
    link: "/calculators",
    linkLabel: "Open Calculators",
    count: "5 tools",
  },
  {
    icon: Globe,
    title: "State-by-State Guides",
    description: "52 guides. Anonymous LLC formation, non-compete enforceability, and tax implications for all 50 states + DC.",
    link: "/guides",
    linkLabel: "Browse State Guides",
    count: "52 guides",
  },
  {
    icon: FileText,
    title: "Comparison Pages",
    description: "50 pages. Side business vs career, micro-SaaS vs traditional startup, anonymous vs public founder.",
    link: "/compare",
    linkLabel: "Browse Comparisons",
    count: "50 pages",
  },
  {
    icon: BookOpen,
    title: "Glossary",
    description: "30 defined terms. Every concept, framework, and metric used in the Invisible Exit system.",
    link: "/glossary",
    linkLabel: "Browse Glossary",
    count: "30 terms",
  },
  {
    icon: TrendingUp,
    title: "Data Reports",
    description: "75 pages. Revenue milestones, timelines, salary data, and first-year roadmaps by profession.",
    link: "/data",
    linkLabel: "Browse Data",
    count: "75 reports",
  },
  {
    icon: BookOpen,
    title: "Blog",
    description: "53 articles on building invisible recurring revenue, stealth operations, and micro-SaaS.",
    link: "/blog",
    linkLabel: "Browse Blog",
    count: "53 articles",
  },
];

const CORE_PAGES = [
  { label: "Home", to: "/", desc: "Start here" },
  { label: "Freedom Calculator", to: "/freedom", desc: "Calculate your freedom number" },
  { label: "Origin Story", to: "/story", desc: "The Amsterdam taxi moment" },
  { label: "Free Masterclass", to: "/masterclass", desc: "The 3 Secrets" },
  { label: "Manifesto", to: "/manifesto", desc: "The movement" },
  { label: "The One Thing", to: "/one-thing", desc: "Build the system first" },
  { label: "Is This You?", to: "/is-this-you", desc: "Self-qualification quiz" },
  { label: "Join the Movement", to: "/join", desc: "5 declarations" },
  { label: "Proof & Results", to: "/proof", desc: "Case studies" },
  { label: "Founding Wall", to: "/founding-wall", desc: "Meet the builders" },
  { label: "3 Frameworks", to: "/frameworks", desc: "Proprietary methodologies" },
  { label: "Belief Crusher", to: "/beliefs", desc: "Break 3 false beliefs" },
  { label: "Movement Lexicon", to: "/lexicon", desc: "14 terms that define us" },
  { label: "Dream Customer", to: "/who", desc: "Who we build for" },
  { label: "Where They Hide", to: "/where", desc: "31 community targets" },
];

const ExploreHubPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Explore All Resources — Complete Site Index | Invisible Exit"
        description="Browse all 800+ pages: micro-SaaS ideas by profession, state guides, calculators, comparison pages, glossary terms, data reports, and blog articles."
        url="/explore"
      />
      <Navbar />

      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <LayoutGrid className="w-4 h-4" />
            Complete Resource Index
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Explore <span className="text-gradient-light">Everything</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-4">
            800+ pages of frameworks, calculators, guides, and tools for building invisible
            recurring revenue while employed.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            Start with what matches your situation. Every link below is a rabbit hole.
          </p>
        </div>
      </section>

      {/* Category Grid */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-standard">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Browse by Category</h2>
          <p className="text-muted-foreground mb-8">9 categories, 800+ pages.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.title} className="card-base p-6 card-hover">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <cat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{cat.title}</h3>
                    <span className="text-xs text-muted-foreground">{cat.count}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{cat.description}</p>
                <Link
                  to={cat.link}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
                >
                  {cat.linkLabel} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pages */}
      <section className="bg-surface section-normal border-b border-border">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Core Pages</h2>
          <p className="text-muted-foreground mb-8">The 15 pages that tell the complete story.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CORE_PAGES.map((page) => (
              <Link
                key={page.to}
                to={page.to}
                className="card-base p-4 flex items-center justify-between gap-3 hover:border-primary/30 transition-colors"
              >
                <div>
                  <p className="font-semibold text-foreground text-sm">{page.label}</p>
                  <p className="text-xs text-muted-foreground">{page.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Search prompt */}
      <section className="bg-white section-normal border-b border-border">
        <div className="container-narrow text-center">
          <Search className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Looking for Something Specific?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Use the categories above to drill into your specific profession, state, or tool stack.
            Or start with the Freedom Number Calculator.
          </p>
          <Link
            to="/freedom"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
          >
            Start with Your Freedom Number <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExploreHubPage;
