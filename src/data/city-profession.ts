/**
 * City × Profession cross-dimensional pages for programmatic SEO.
 *
 * Dynamically generates pages that combine city-specific local context
 * (networking scene, cost of living, salary, meetups) with profession-specific
 * micro-SaaS ideas, producing local-intent landing pages like:
 *
 *   /cities/austin/for/software-engineers
 *   /cities/san-francisco/for/marketers
 *   /cities/remote/for/consultants
 *
 * Total: 14 cities × 10 professions = 140 pages.
 *
 * Consume via:
 *   import { cityProfessionPages, generateCityProfessionPages } from "@/data/city-profession";
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CityProfessionPage {
  slug: string; // e.g., "austin-for-software-engineers"
  city: string;
  citySlug: string;
  profession: string;
  professionSlug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  localScene: string; // description of the local tech/business scene
  costProfile: string; // cost of living context
  networkingOps: string[]; // local networking opportunities
  bestIdeas: string[]; // 5 profession-specific micro-SaaS ideas suited to this city
  advantages: string[]; // why this city is good for this profession
  faqs: { question: string; answer: string }[];
}

// ---------------------------------------------------------------------------
// Source data: 14 cities (rich, unique local context per city)
// ---------------------------------------------------------------------------

interface CityDatum {
  slug: string;
  name: string;
  state: string;
  costOfLiving: "Low" | "Moderate" | "High" | "Very High" | "Varies";
  scene: string; // distinctive local scene description
  avgSalary: string; // representative all-profession avg salary
  meetups: string; // comma-separated real meetup/event names
  advantage: string; // city-wide structural advantage for side-business builders
}

const CITIES: CityDatum[] = [
  {
    slug: "austin",
    name: "Austin",
    state: "Texas",
    costOfLiving: "High",
    scene:
      "live-music-meets-tech capital where SXSW energy, Tesla's relocation, and a flood of West Coast transplants turned a college town into one of America's fastest-growing startup hubs",
    avgSalary: "$75K",
    meetups:
      "Capital Factory mentor hours, Austin Tech Alliance mixers, Austin Startups meetup, 1 Million Cups Austin, ADPList mentoring sessions",
    advantage:
      "no state income tax and a $300 LLC with no annual report means your SaaS revenue stays in your pocket, while a dense early-adopter community provides beta testers and first customers",
  },
  {
    slug: "san-francisco",
    name: "San Francisco",
    state: "California",
    costOfLiving: "Very High",
    scene:
      "undisputed capital of venture-backed tech, where every coffee shop hosts a founder pitch and the density of engineers, investors, and paying B2B customers is unmatched anywhere on Earth",
    avgSalary: "$110K",
    meetups:
      "SF Startup Grind, Y Combinator alumni nights, SaaStr monthly, Hackers & Founders SF, Indie Hackers SF meetups",
    advantage:
      "a few hundred paying customers live within a 7-mile radius, and California's near-total ban on non-competes means your employer cannot legally block your side business",
  },
  {
    slug: "new-york",
    name: "New York",
    state: "New York",
    costOfLiving: "Very High",
    scene:
      "the densest B2B market in the country — finance, media, advertising, and fashion headquarters stacked on top of each other, with a startup scene that rivals SF for deal flow",
    avgSalary: "$85K",
    meetups:
      "NY Tech Meetup, Product Guild NYC, SaaS Meetup NYC, New York Angels pitches, Tech:NYC events",
    advantage:
      "enterprise buyers in finance, media, and advertising pay premium B2B pricing ($99-$499/month) and decide fast, meaning a single warm intro can land a five-figure ARR customer",
  },
  {
    slug: "seattle",
    name: "Seattle",
    state: "Washington",
    costOfLiving: "High",
    scene:
      "Amazon and Microsoft's home turf, with a deep bench of senior engineers and a quietly booming cloud and developer-tools ecosystem fed by thousands of ex-Big-Tech alumni",
    avgSalary: "$95K",
    meetups:
      "Seattle Startup Week, Puget Sound Python, Seattle React.js, IGNITE entrepreneur sessions, GeekWire events",
    advantage:
      "no state income tax (like Texas) plus a talent pool of sophisticated engineer users willing to pay $50-$100/month for tools that save them time, plus non-competes are restricted for workers under $100K",
  },
  {
    slug: "denver",
    name: "Denver",
    state: "Colorado",
    costOfLiving: "Moderate",
    scene:
      "fast-growing mountain tech hub attracting remote-first companies and burnout refugees from the coasts, with a collaborative (not cutthroat) startup culture and a strong outdoors-meets-hustle ethos",
    avgSalary: "$72K",
    meetups:
      "Denver Startup Week, Boulder-Denver New Tech Meetup, Startup Grind Denver, Turing School demo nights, Colorado SaaS meetups",
    advantage:
      "Colorado restricts non-competes for workers earning under ~$101K, the $50 LLC is one of the cheapest in the US, and the 4.4% flat income tax keeps more revenue than coastal states",
  },
  {
    slug: "boston",
    name: "Boston",
    state: "Massachusetts",
    costOfLiving: "High",
    scene:
      "biotech-and-SaaS powerhouse where MIT, Harvard, and Mass General spin out deep-technical companies, and the Route 128 corridor hosts a dense cluster of enterprise software and life-science firms",
    avgSalary: "$82K",
    meetups:
      "Boston New Technology meetups, MIT Enterprise Forum, MassChallenge events, Boston Product Management Group, Harvard Innovation Labs sessions",
    advantage:
      "the density of PhDs, engineers, and domain experts means technically demanding vertical SaaS (biotech, legal, compliance) finds both sophisticated builders and high-budget customers here",
  },
  {
    slug: "chicago",
    name: "Chicago",
    state: "Illinois",
    costOfLiving: "Moderate",
    scene:
      "diversified Midwest economy spanning finance, logistics, manufacturing, and healthcare — creating B2B SaaS niches in unsexy-but-profitable verticals that coastal hubs completely overlook",
    avgSalary: "$70K",
    meetups:
      "Chicago Tech Meetup, 1871 startup hub events, Chicago Innovation nights, Builtin Chicago sessions, TechNexus meetups",
    advantage:
      "Illinois bans non-competes for workers under $75K, the $150 LLC is reasonable, and the city's enterprise density in logistics and manufacturing means niche B2B products find paying corporate customers",
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    state: "California",
    costOfLiving: "Very High",
    scene:
      "the capital of the creator economy — home to YouTube studios, podcast networks, talent agencies, and gaming studios — plus a fast-growing SaaS scene in Santa Monica and Venice Beach",
    avgSalary: "$78K",
    meetups:
      "LA Tech meetup, Silicon Beach events, Product School LA, Creator Economy meetups, Cross Campus sessions",
    advantage:
      "the density of YouTubers, podcasters, and creators means any tool targeting the creator economy has both a massive addressable market and in-person networking the rest of the country can't match",
  },
  {
    slug: "dallas",
    name: "Dallas",
    state: "Texas",
    costOfLiving: "Moderate",
    scene:
      "DFW metroplex corporate powerhouse — AT&T, Toyota, JCPenney, and HP headquarters — with a fast-growing fintech and enterprise-software corridor that's more affordable than Austin",
    avgSalary: "$65K",
    meetups:
      "Dallas Startup Week, The DEC Network events, Dallas Tech Meetup, Capital Factory Dallas, DFW Startup Community",
    advantage:
      "same no-income-tax advantage as Austin with cheaper housing, plus the density of Fortune 500 HQs creates B2B SaaS opportunities targeting enterprise adjacencies and vendor ecosystems",
  },
  {
    slug: "portland",
    name: "Portland",
    state: "Oregon",
    costOfLiving: "High",
    scene:
      "indie-hacker haven that celebrates bootstrapped, quirky, independent products over VC-chasing — a city where 'keep it weird' applies to software and open-source culture runs deep",
    avgSalary: "$68K",
    meetups:
      "Portland Indie Hackers, PIE (Portland Incubator Experiment), TechfestPDX, Oregon Entrepreneurs Network, PDX Python meetups",
    advantage:
      "Oregon bans non-competes for workers under ~$95K, the city's indie culture means local press and customers actively support bootstrapped products, and open-source networks provide free distribution",
  },
  {
    slug: "atlanta",
    name: "Atlanta",
    state: "Georgia",
    costOfLiving: "Moderate",
    scene:
      "the leading tech hub of the Southeast — processing 70% of all US payment-card transactions, with a deep fintech talent pool from Fiserv, Global Payments, and NCR plus a booming Black-founder ecosystem",
    avgSalary: "$62K",
    meetups:
      "Atlanta Tech Meetup, Techstars Atlanta, Center for Civic Innovation, ATDC events, Atlanta Black Tech meetups",
    advantage:
      "fintech dominance creates B2B SaaS opportunities in payments, lending, and financial infrastructure that don't exist elsewhere, plus the $100 LLC and moderate costs keep runway long",
  },
  {
    slug: "phoenix",
    name: "Phoenix",
    state: "Arizona",
    costOfLiving: "Moderate",
    scene:
      "emerging desert tech hub absorbing California transplants and remote workers, with a fast-growing startup scene, ASU's research pipeline, and one of the most affordable major metros in the Sun Belt",
    avgSalary: "$58K",
    meetups:
      "Phoenix Startup Week, Seed Spot events, Arizona Technology Council, ASU Skysong sessions, Gangplank meetups",
    advantage:
      "the $50 LLC is one of the cheapest in the US with member anonymity protections, the 2.5% flat income tax is among the lowest, and low housing costs stretch every dollar of SaaS revenue",
  },
  {
    slug: "miami",
    name: "Miami",
    state: "Florida",
    costOfLiving: "High",
    scene:
      "crypto-and-fintech boomtown that rebranded itself as the 'capital of capital' — attracting founders, VCs, and remote workers from SF and NYC, plus serving as the gateway to Latin American markets",
    avgSalary: "$60K",
    meetups:
      "eMerge Americas, Refresh Miami, Miami Tech Meetup, Mana Commons events, Blacktech Week sessions",
    advantage:
      "Florida has no state income tax, banned non-competes for most workers in 2024, and the city's Latin America gateway position creates unique opportunities for bilingual SaaS and cross-border payment tools",
  },
  {
    slug: "remote",
    name: "Remote",
    state: "Anywhere",
    costOfLiving: "Varies",
    scene:
      "the distributed workforce — no commute, no office politics, and the freedom to choose your LLC's home state, your timezone, and your own peak-productivity hours",
    avgSalary: "Varies",
    meetups:
      "Indie Hackers community, WIP.co maker chat, Trends.vc, MicroConf Connect, r/SaaS and r/Entrepreneur",
    advantage:
      "remote work is the ultimate unfair advantage: full control over your schedule, no office surveillance beyond company-issued laptops, and the ability to form your LLC in Wyoming or Delaware regardless of where you live",
  },
];

// ---------------------------------------------------------------------------
// Source data: 10 professions (rich, unique idea sets per profession)
// ---------------------------------------------------------------------------

interface ProfessionDatum {
  slug: string;
  name: string;
  ideas: string[]; // 5 micro-SaaS ideas
  unfairAdvantage: string; // why this profession has an edge
  whatToAvoid: string; // conflict-of-interest warning
}

const PROFESSIONS: ProfessionDatum[] = [
  {
    slug: "software-engineers",
    name: "Software Engineers",
    ideas: [
      "AI code review SaaS that catches security flaws before merge",
      "Developer dashboard that unifies GitHub, CI, and incident alerts",
      "API monitoring and synthetic-request service for indie SaaS",
      "CI/CD pipeline cost optimizer that cuts cloud build minutes",
      "AI code-documentation generator wired to your repo",
    ],
    unfairAdvantage:
      "you can build, ship, and iterate the product yourself — no technical co-founder or contractor needed",
    whatToAvoid:
      "do not use your employer's code, infra, or repos. Build on personal hardware, in an unrelated domain.",
  },
  {
    slug: "product-managers",
    name: "Product Managers",
    ideas: [
      "Feature-voting and roadmap SaaS for customer-driven prioritization",
      "Changelog generator that turns commits into customer-ready updates",
      "Customer-interview insight tagger synced to Notion and Linear",
      "Launch checklist SaaS coordinating PM, eng, marketing, and support",
      "Product analytics onboarding tool for non-technical founders",
    ],
    unfairAdvantage:
      "you understand customer discovery, prioritization, and go-to-market — the exact skills that turn a side project into revenue",
    whatToAvoid:
      "do not build tools that compete with your employer's product roadmap or use customer data from your company.",
  },
  {
    slug: "marketers",
    name: "Marketers",
    ideas: [
      "SEO content brief generator wired to live SERP data",
      "Social media scheduling tool optimized for indie SaaS launches",
      "Email sequence builder with AI subject-line testing",
      "UGC discovery and licensing platform for D2C brands",
      "Attribution dashboard connecting Stripe to ad spend for bootstrappers",
    ],
    unfairAdvantage:
      "you already know how to find customers and write copy that converts — the hardest part of getting a SaaS to revenue",
    whatToAvoid:
      "do not reuse your employer's customer lists, creative assets, or media-buying data. Build for a different audience segment.",
  },
  {
    slug: "designers",
    name: "Designers",
    ideas: [
      "Brand asset manager with AI-powered logo variants",
      "Figma plugin that exports production-ready React components",
      "Design-system documentation generator synced to Storybook",
      "AI mockup generator for landing-page hero sections",
      "Client-proof gallery tool for freelance designers",
    ],
    unfairAdvantage:
      "you can design a credible brand and landing page without paying an agency — instantly lowering customer-acquisition cost",
    whatToAvoid:
      "do not reuse your employer's design files, brand assets, or component libraries in your own product.",
  },
  {
    slug: "consultants",
    name: "Consultants",
    ideas: [
      "Proposal and SOW generator for independent consultants",
      "Time-tracking and invoicing SaaS for billable-hour work",
      "Client portal for secure document sharing and status updates",
      "Knowledge-base productizer that turns your decks into a paid product",
      "Engagement-scoping tool with templated deliverables and pricing",
    ],
    unfairAdvantage:
      "you already sell expertise — a productized version of your methodology is the most natural SaaS pivot there is",
    whatToAvoid:
      "do not use client data, proprietary frameworks, or deliverables from your firm. Rebuild methodologies from scratch.",
  },
  {
    slug: "financial-analysts",
    name: "Financial Analysts",
    ideas: [
      "FP&A dashboard for seed-stage founders replacing Excel chaos",
      "Cap-table and runway visualizer for pre-Series A startups",
      "Automated board-deck builder pulling from Stripe and QuickBooks",
      "Scenario-modeling SaaS for bootstrapped SaaS pricing experiments",
      "Investor-reporting automation for portfolio companies",
    ],
    unfairAdvantage:
      "you speak the language of revenue, margins, and unit economics — the language investors and B2B buyers pay to understand",
    whatToAvoid:
      "do not use employer models, client financials, or proprietary datasets. Target a completely different company segment.",
  },
  {
    slug: "data-analysts",
    name: "Data Analysts",
    ideas: [
      "No-code SQL dashboard builder for non-technical founders",
      "Data-quality monitor that alerts on pipeline anomalies",
      "AI chart-explainer that turns dashboards into plain-English summaries",
      "ETL-light connector between Google Sheets and warehouses",
      "Embedded analytics widget for SaaS apps to show customers their data",
    ],
    unfairAdvantage:
      "you can build the data pipeline and the analytics layer yourself — and every SaaS eventually needs both",
    whatToAvoid:
      "do not use employer data, schemas, or proprietary ETL code. Rebuild connectors and models from public data.",
  },
  {
    slug: "accountants",
    name: "Accountants",
    ideas: [
      "Automated invoice-reconciliation tool matching bank feeds to invoices",
      "Tax-deadline tracker with automated client reminders for CPA firms",
      "Bookkeeping error detector scanning QuickBooks and Xero",
      "1099 contractor compliance monitor with auto-generation",
      "Cash-flow forecasting dashboard for small businesses",
    ],
    unfairAdvantage:
      "you understand compliance, billing cycles, and financial workflows — the exact pain points businesses pay $29-$99/month to solve",
    whatToAvoid:
      "do not build tools that compete with your firm's services or use client data from your employer. Target a different client segment.",
  },
  {
    slug: "lawyers",
    name: "Lawyers",
    ideas: [
      "Contract clause risk scanner for non-lawyers in plain language",
      "State-specific NDA generator for startups and freelancers",
      "Legal deadline calculator by jurisdiction and case type",
      "Client-intake automation for high-volume law firms",
      "Privacy policy generator for SaaS and indie hackers",
    ],
    unfairAdvantage:
      "you understand regulatory compliance and contract language — among the most monetizable niche expertise in B2B SaaS",
    whatToAvoid:
      "do not practice law through your SaaS (unauthorized practice of law). Build tools that assist non-lawyers or streamline firm operations.",
  },
  {
    slug: "project-managers",
    name: "Project Managers",
    ideas: [
      "Async standup tool for distributed teams replacing Slack chaos",
      "Resource-allocation dashboard for agencies and consultancies",
      "Risk register SaaS with automated stakeholder updates",
      "Retrospective and action-tracker for engineering teams",
      "Project kickoff checklist productizer for freelance PMs",
    ],
    unfairAdvantage:
      "you already ship deliverables on time and on budget — the exact operational discipline that gets a SaaS to launch",
    whatToAvoid:
      "do not reuse employer project plans, client lists, or proprietary methodologies. Build for a different industry vertical.",
  },
];

// ---------------------------------------------------------------------------
// Text generation helpers
// ---------------------------------------------------------------------------

/** Lower-case singular-ish form for use mid-sentence. */
function lowerProfession(name: string): string {
  return name.toLowerCase();
}

/** Cost-of-living guidance text tuned to the level. */
function costText(city: CityDatum): string {
  switch (city.costOfLiving) {
    case "Very High":
      return `${city.name}'s cost of living is very high, which means you need either a W-2 cushion or a fast path to revenue — but the trade-off is that local B2B customers pay premium pricing ($99-$499/month) that offsets the burn rate.`;
    case "High":
      return `${city.name}'s cost of living is high, so plan for a 3-to-6-month runway before your SaaS covers living costs. The upside: local customers and network density shorten the time-to-first-customer.`;
    case "Moderate":
      return `${city.name}'s cost of living is moderate, which is a real advantage — your SaaS revenue covers personal burn-rate sooner, letting you reach profitability on fewer customers than a coastal founder needs.`;
    case "Low":
      return `${city.name}'s low cost of living is a structural edge: you can reach personal profitability on as few as 20-40 paying customers, something impossible in SF or NYC.`;
    case "Varies":
      return `because you're remote, your cost of living depends on where you choose to live — geo-arbitrage (earning in dollars, spending in a cheaper market) is one of the most powerful runway multipliers available.`;
  }
}

/** Intro paragraph specific to the city × profession combination. */
function introText(city: CityDatum, prof: ProfessionDatum): string {
  return (
    `${city.name} is ${city.scene}. ` +
    `For ${lowerProfession(prof.name)}, ${prof.unfairAdvantage} — and ${city.name}'s ${city.scene.includes("no state income tax") ? "tax and networking advantages" : "local ecosystem"} make it an unusually good place to turn that edge into ${prof.name === "Consultants" ? "a productized offering" : "a profitable micro-SaaS"}. ` +
    `${city.advantage}.`
  );
}

/** City-specific networking opportunities list. */
function networkingOps(city: CityDatum, prof: ProfessionDatum): string[] {
  const base = city.meetups.split(", ").map((m) => m.trim());
  const profSpecific = `${prof.name} track at ${city.name} Startup Week`;
  return [...base, profSpecific, "Local startup-weekend hackathons", "Industry-specific monthly meetups"];
}

/** Advantages list blending city + profession strengths. */
function advantagesList(city: CityDatum, prof: ProfessionDatum): string[] {
  const cityAdv = city.advantage.split(", ").slice(0, 2).join("; ");
  return [
    `${city.name}-specific: ${cityAdv}`,
    `Profession-specific: ${prof.unfairAdvantage}.`,
    `${city.name}'s ${city.costOfLiving.toLowerCase()} cost of living ${
      city.costOfLiving === "Very High" || city.costOfLiving === "High"
        ? "raises the bar on runway but also raises the ceiling on local pricing power"
        : "stretches every dollar of SaaS revenue further than coastal hubs"
    }.`,
    `${prof.name} in ${city.name} earn around ${city.avgSalary}, providing the financial runway to bootstrap without outside funding.`,
  ];
}

/** Two profession- and city-specific FAQs with real, specific answers. */
function faqList(city: CityDatum, prof: ProfessionDatum): { question: string; answer: string }[] {
  const profLower = lowerProfession(prof.name);
  return [
    {
      question: `Can ${profLower} in ${city.name} build a micro-SaaS while employed?`,
      answer:
        `Yes. ${prof.whatToAvoid} ${city.name} offers ${city.advantage.toLowerCase()}. ` +
        `The key steps: form an LLC for liability separation, use a personal device and personal network for all side-business work, and never build a product that competes directly with your employer. ` +
        `${prof.name} are well-positioned because ${prof.unfairAdvantage.toLowerCase()}.`,
    },
    {
      question: `What are the best micro-SaaS ideas for ${profLower} in ${city.name} specifically?`,
      answer:
        `${city.name}'s local market rewards products that solve ${city.scene.includes("fintech") ? "fintech and payments" : city.scene.includes("creator") ? "creator-economy" : city.scene.includes("biotech") ? "life-science and compliance" : city.scene.includes("crypto") ? "crypto and cross-border" : "B2B workflow"} pain points. ` +
        `The five ideas above (${prof.ideas.slice(0, 3).join(", ")}, and more) are chosen because they leverage ${prof.name.toLowerCase()}'s domain expertise and can find early customers through ${city.meetups.split(", ")[0]}. ` +
        `Price for ${city.name}'s market: ${city.costOfLiving === "Very High" ? "$49-$199/month reflects local willingness to pay" : "$19-$99/month fits the local mid-market"}.`,
    },
  ];
}

// ---------------------------------------------------------------------------
// Page builder
// ---------------------------------------------------------------------------

function buildCityProfessionPage(city: CityDatum, prof: ProfessionDatum): CityProfessionPage {
  const slug = `${city.slug}-for-${prof.slug}`;
  const profLower = lowerProfession(prof.name);

  return {
    slug,
    city: city.name,
    citySlug: city.slug,
    profession: prof.name,
    professionSlug: prof.slug,
    metaTitle: `Micro-SaaS Ideas for ${prof.name} in ${city.name} (${city.state}) | Invisible Exit`,
    metaDescription:
      `Best side business and micro-SaaS ideas for ${profLower} in ${city.name}. ` +
      `Local networking, cost analysis, and ${prof.ideas.length} specific ideas suited to ${city.name}'s market.`,
    h1: `Micro-SaaS Ideas for ${prof.name} in ${city.name}`,
    intro: introText(city, prof),
    localScene:
      `${city.name} has ${city.meetups.toLowerCase()}. ` +
      `The average salary for ${profLower} in ${city.name} is around ${city.avgSalary}, which provides the runway to bootstrap a side business. ` +
      `${city.name} is ${city.scene}.`,
    costProfile: costText(city),
    networkingOps: networkingOps(city, prof),
    bestIdeas: prof.ideas,
    advantages: advantagesList(city, prof),
    faqs: faqList(city, prof),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generates city × profession cross-product pages.
 *
 * Without arguments, returns the full 14 cities × 10 professions = 140 pages.
 *
 * Pass explicit slug arrays to generate any subset:
 *
 *   generateCityProfessionPages(["austin", "remote"], ["software-engineers"])
 *   // → 2 pages
 */
export function generateCityProfessionPages(
  citySlugs: readonly string[] = CITIES.map((c) => c.slug),
  professionSlugs: readonly string[] = PROFESSIONS.map((p) => p.slug),
): CityProfessionPage[] {
  const citySubset = CITIES.filter((c) => citySlugs.includes(c.slug));
  const profSubset = PROFESSIONS.filter((p) => professionSlugs.includes(p.slug));

  const pages: CityProfessionPage[] = [];
  for (const city of citySubset) {
    for (const prof of profSubset) {
      pages.push(buildCityProfessionPage(city, prof));
    }
  }
  return pages;
}

/**
 * Look up a single city-profession page by its combined slug
 * (e.g., "austin-for-software-engineers").
 */
export function getCityProfessionPage(slug: string): CityProfessionPage | undefined {
  return cityProfessionPages.find((p) => p.slug === slug);
}

/**
 * Pre-computed full set: 14 cities × 10 professions = 140 pages.
 * Import this directly in route loaders; call `generateCityProfessionPages()`
 * with explicit slug arrays if you need a different subset.
 */
export const cityProfessionPages: CityProfessionPage[] = generateCityProfessionPages();
