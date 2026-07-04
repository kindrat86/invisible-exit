/**
 * Role salary → side business conversion pages for /salaries/:slug.
 * Each page targets "[role] salary" search + shows freedom number math.
 */

export interface SalaryEntry {
  slug: string;
  role: string;
  avgSalary: string;
  salaryRange: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  freedomNumber: string;
  transferableSkills: string[];
  bestMicroSaaSIdeas: string[];
  timeline: string;
  faqs: { question: string; answer: string }[];
}

export const salaries: SalaryEntry[] = [
  {
    slug: "product-manager",
    role: "Product Manager",
    avgSalary: "$147K",
    salaryRange: "$120K-$170K",
    metaTitle: "Product Manager Salary: From $147K to Freedom Number | Invisible Exit",
    metaDescription: "Product managers earn $147K/year on average. See exactly how much MRR you need to replace your salary and the best micro-SaaS ideas for PMs.",
    h1: "Product Manager Salary: Your Freedom Number Math",
    intro: "You earn $147K/year as a Product Manager. You're great at building products for others — but what if you built one for yourself? Here's the math on replacing your salary with recurring revenue.",
    freedomNumber: "$4,500/month",
    transferableSkills: ["User research", "Spec writing", "Cross-functional collaboration", "Roadmap prioritization", "A/B testing analysis"],
    bestMicroSaaSIdeas: ["Product analytics dashboard for small teams", "Customer feedback aggregator with AI tagging", "Sprint retrospective tool with AI insights"],
    timeline: "12-18 months",
    faqs: [
      { question: "What's the best micro-SaaS for a product manager?", answer: "Tools that other product managers need: feedback aggregation, roadmap visualization, sprint tracking. You know the pain because you live it." },
      { question: "Can I build a micro-SaaS without a technical co-founder?", answer: "Yes. AI coding tools (Cursor, Claude) let you build functional MVPs without writing traditional code. Your product skills + AI = shippable product." },
    ],
  },
  {
    slug: "software-engineer",
    role: "Software Engineer",
    avgSalary: "$155K",
    salaryRange: "$120K-$200K",
    metaTitle: "Software Engineer Salary: From $155K to Freedom Number | Invisible Exit",
    metaDescription: "Software engineers earn $155K/year on average. See the exact MRR needed to replace your salary and the best micro-SaaS ideas for engineers.",
    h1: "Software Engineer Salary: Your Freedom Number Math",
    intro: "You earn $155K/year. You can technically build anything. The challenge isn't code — it's choosing what to build and staying invisible while you do it.",
    freedomNumber: "$4,800/month",
    transferableSkills: ["Full-stack development", "System architecture", "Database optimization", "API design", "DevOps"],
    bestMicroSaaSIdeas: ["Automated API documentation generator", "GitHub commit analysis tool for teams", "Database backup monitoring SaaS"],
    timeline: "8-14 months",
    faqs: [
      { question: "How do I avoid IP claims from my employer?", answer: "Use personal equipment, build outside work hours, and choose a different domain than your employer's business. Most IP clauses cover work-related inventions." },
      { question: "Should I build in my tech stack or try something new?", answer: "Use what you know. Speed matters more than novelty. You'll ship 3x faster in a stack you've already mastered." },
    ],
  },
  {
    slug: "marketing-manager",
    role: "Marketing Manager",
    avgSalary: "$112K",
    salaryRange: "$90K-$140K",
    metaTitle: "Marketing Manager Salary: From $112K to Freedom Number | Invisible Exit",
    metaDescription: "Marketing managers earn $112K/year. See how much MRR replaces your salary and the best micro-SaaS ideas for marketers.",
    h1: "Marketing Manager Salary: Your Freedom Number Math",
    intro: "You earn $112K/year as a Marketing Manager. You already know how to get attention. Now apply those skills to your own product — and keep 100% of the revenue.",
    freedomNumber: "$3,500/month",
    transferableSkills: ["Content strategy", "SEO", "Social media distribution", "Email marketing", "Analytics and tracking"],
    bestMicroSaaSIdeas: ["Content repurposing tool (blog→social→email)", "Social media analytics comparator", "Landing page A/B testing simplifier"],
    timeline: "12-18 months",
    faqs: [
      { question: "Should I build a product or a service first?", answer: "Start with a productized service. You know how to sell. Package your marketing expertise as a fixed-price offering, build a SaaS version from the repeatable parts." },
      { question: "What's the biggest advantage marketers have in micro-SaaS?", answer: "Distribution. Most founders can build but can't sell. You already know how to get attention. That's the harder half." },
    ],
  },
  {
    slug: "data-analyst",
    role: "Data Analyst",
    avgSalary: "$98K",
    salaryRange: "$75K-$125K",
    metaTitle: "Data Analyst Salary: From $98K to Freedom Number | Invisible Exit",
    metaDescription: "Data analysts earn $98K/year. See how much MRR replaces your salary and the best micro-SaaS ideas for analysts.",
    h1: "Data Analyst Salary: Your Freedom Number Math",
    intro: "You earn $98K/year as a Data Analyst. You spend your days building dashboards and reports for others. What if you built one that paid you every month?",
    freedomNumber: "$3,200/month",
    transferableSkills: ["SQL", "Python scripting", "Dashboard development", "Statistical analysis", "Data pipeline management"],
    bestMicroSaaSIdeas: ["Automated PDF report generator from SQL queries", "Dashboard template marketplace", "Data quality monitoring SaaS"],
    timeline: "12-18 months",
    faqs: [
      { question: "Can I use the same tools I use at work?", answer: "Use the same CATEGORIES of tools but on personal accounts and hardware. Never use your employer's data, database access, or licensed software for your side business." },
      { question: "What's the easiest micro-SaaS for data analysts?", answer: "Build a reporting tool for a niche industry. Small businesses and agencies pay $19-$49/month for automated reports they'd otherwise build manually in Excel." },
    ],
  },
];
