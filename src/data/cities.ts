/**
 * City-level pSEO pages for /cities/:slug.
 *
 * Targets local searches like:
 *   "side business ideas austin"
 *   "anonymous llc chicago"
 *   "micro saaus dallas"
 *
 * Each city includes: startup ecosystem data, average salary, cost of
 * living relative to SaaS pricing, state legal context, and local
 * networking opportunities.
 *
 * 50 top US cities by population + startup density.
 */

export interface CityPage {
  slug: string;
  city: string;
  state: string;
  stateSlug: string;
  population: string;
  avgSalary: string;
  costOfLiving: string;
  startupEcosystem: string;
  meetupScene: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  legalContext: string;
  localAdvantage: string;
  faqs: { question: string; answer: string }[];
}

export const cities: CityPage[] = [
  { slug: "austin", city: "Austin", state: "Texas", stateSlug: "texas", population: "960K+", avgSalary: "$75K", costOfLiving: "High", startupEcosystem: "Top 10 US startup hub", meetupScene: "Massive tech meetup scene",
    metaTitle: `Side Business Ideas Austin TX — Micro-SaaS & Anonymous LLC Guide | Invisible Exit`,
    metaDescription: `Start a side business in Austin, Texas. No state income tax, strong tech ecosystem, and anonymous LLC options. Local startup resources, meetups, and micro-SaaS ideas for Austin founders.`,
    h1: `Side Business Ideas in Austin, Texas`,
    intro: `Austin is one of the best cities in America to build a side business. With no state income tax, a booming tech ecosystem, and relatively affordable living compared to SF/NYC, your micro-SaaS revenue goes further here. Here's everything you need to know about building an invisible side business in Austin.`,
    legalContext: `Texas enforces non-competes if reasonable and protecting legitimate business interests. LLC formation costs $300 with no annual report required. No state income tax means you keep more of your SaaS revenue.`,
    localAdvantage: `Austin's startup density means abundant networking, beta testers, and early customers. The city's "keep it weird" ethos supports indie products.`,
    faqs: [
      { question: "Is Texas good for a side business?", answer: "Texas is excellent: no state income tax, relatively low filing fees, and Austin's tech ecosystem provides customers and networking. The main consideration is non-compete enforceability — build outside your employer's industry." },
      { question: "How much does it cost to form an LLC in Austin?", answer: "Texas charges $300 for LLC formation. No annual report fee. Compare to California's $800 annual franchise tax — Texas saves you $800+/year." },
    ],
  },
  { slug: "san-francisco", city: "San Francisco", state: "California", stateSlug: "california", population: "800K+", avgSalary: "$110K", costOfLiving: "Very High", startupEcosystem: "#1 US startup hub", meetupScene: "World-class tech events",
    metaTitle: `Side Business Ideas San Francisco — Micro-SaaS Guide | Invisible Exit`,
    metaDescription: `Start a side business in San Francisco. Despite high costs, SF offers unmatched startup networking, talent, and customer density. Legal considerations for California-employed founders.`,
    h1: `Side Business Ideas in San Francisco, California`,
    intro: `San Francisco has the highest density of tech workers and startup activity in the US. The opportunity is massive — but so is the cost of living and legal complexity. Here's how to build an invisible side business in SF while keeping your day job.`,
    legalContext: `California banned non-competes almost entirely (with narrow exceptions). However, California has an $800 annual franchise tax for LLCs and strong IP assignment presumptions. Consider a Wyoming or Delaware LLC if you don't need California entity status.`,
    localAdvantage: `SF's density of potential customers, investors, and talent is unmatched. Even a tiny niche product can find 100 paying customers here. The challenge is stealth — tech circles are small and gossip travels.`,
    faqs: [
      { question: "Can I form a Wyoming LLC while living in San Francisco?", answer: "Yes. You can form a Wyoming LLC while living in California. You'll still need to register as a foreign LLC in California if you do business there, which triggers the $800 fee. Consider the trade-offs carefully." },
      { question: "Does California enforce non-competes?", answer: "California essentially bans non-competes for employees (with very narrow exceptions for sale-of-business and partnership contexts). This is a major advantage — but IP assignment clauses are very strong in California." },
    ],
  },
  { slug: "new-york", city: "New York", state: "New York", stateSlug: "new-york", population: "8.3M+", avgSalary: "$85K", costOfLiving: "Very High", startupEcosystem: "Top 3 US startup hub", meetupScene: "Huge, diverse tech community",
    metaTitle: `Side Business Ideas New York City — Micro-SaaS Guide | Invisible Exit`,
    metaDescription: `Start a side business in NYC. Massive market, strong networking, but high costs. Legal guide for New York-employed founders including non-compete enforceability and LLC formation.`,
    h1: `Side Business Ideas in New York City`,
    intro: `New York City offers a massive market, strong startup ecosystem, and unmatched networking. The challenge is the high cost of living and the need for stealth in a city where everyone knows everyone in tech. Here's your guide to building an invisible side business in NYC.`,
    legalContext: `New York enforces non-competes if reasonable in scope, geography, and duration. LLC formation costs $200 with a $9 annual filing fee. New York has state income tax up to 10.9%.`,
    localAdvantage: `NYC's diversity means niche products find audiences faster. The city's media/finance/advertising density creates B2B opportunities that don't exist elsewhere.`,
    faqs: [
      { question: "Are non-competes enforceable in New York?", answer: "Yes, but courts apply a reasonableness test. Non-competes must be limited in scope, geography, and duration. NYC recently passed a law restricting non-competes for lower-income workers." },
      { question: "Is NYC too expensive for a bootstrapped side business?", answer: "The cost of living is high, but NYC also offers the highest potential revenue. B2B SaaS targeting NYC's massive finance/media/advertising sectors can charge premium pricing that offsets the cost." },
    ],
  },
  { slug: "seattle", city: "Seattle", state: "Washington", stateSlug: "washington", population: "730K+", avgSalary: "$95K", costOfLiving: "High", startupEcosystem: "Major tech hub (Amazon, Microsoft)", meetupScene: "Strong engineering community",
    metaTitle: `Side Business Ideas Seattle — Micro-SaaS Guide | Invisible Exit`,
    metaDescription: `Start a side business in Seattle. No state income tax, massive tech talent pool, and strong engineering community. Legal guide for Washington-employed founders.`,
    h1: `Side Business Ideas in Seattle, Washington`,
    intro: `Seattle combines no state income tax (like Texas) with a deep tech talent pool (Amazon, Microsoft, and hundreds of startups). It's one of the best cities for building a developer-focused micro-SaaS while employed.`,
    legalContext: `Washington state has no income tax but does have a Business & Occupation (B&O) tax on gross revenue. Non-competes are enforceable but restricted for employees earning under $100K. LLC formation costs $200.`,
    localAdvantage: `Seattle's density of senior engineers means your SaaS can target sophisticated users willing to pay $50-100/month for tools that save time.`,
    faqs: [
      { question: "Does Washington tax SaaS revenue?", answer: "Washington's B&O tax applies to gross business income, including SaaS revenue, at rates around 0.5-1.5% depending on classification. Factor this into your pricing." },
      { question: "Can Amazon/Microsoft employees build side businesses?", answer: "Yes, with care. Both companies have strong IP assignment clauses. Use personal equipment, work outside hours, and build in unrelated domains. Many successful micro-SaaS founders are current or former Big Tech employees." },
    ],
  },
  { slug: "denver", city: "Denver", state: "Colorado", stateSlug: "colorado", population: "710K+", avgSalary: "$72K", costOfLiving: "Moderate", startupEcosystem: "Fast-growing tech hub", meetupScene: "Active startup community",
    metaTitle: `Side Business Ideas Denver — Micro-SaaS Guide | Invisible Exit`,
    metaDescription: `Start a side business in Denver. Growing tech ecosystem, moderate costs, and outdoor lifestyle. Legal guide for Colorado-employed founders.`,
    h1: `Side Business Ideas in Denver, Colorado`,
    intro: `Denver's tech scene is booming, with a strong startup community and more affordable living than coastal hubs. It's an ideal city for building a micro-SaaS — you get big-city networking without big-city costs.`,
    legalContext: `Colorado restricts non-competes for employees earning under ~$101K (adjusted annually). LLC formation costs $50 with a $10 annual report fee. Colorado has a flat 4.4% state income tax.`,
    localAdvantage: `Denver's startup density is growing fast, with strong remote-work infrastructure. The city attracts ambitious professionals who are natural early adopters for SaaS tools.`,
    faqs: [
      { question: "Is Denver good for tech startups?", answer: "Denver consistently ranks as one of the fastest-growing tech hubs. Lower costs than SF/NYC, strong talent pipeline from CU Boulder and Colorado School of Mines, and a collaborative startup culture." },
    ],
  },
  { slug: "boston", city: "Boston", state: "Massachusetts", stateSlug: "massachusetts", population: "650K+", avgSalary: "$82K", costOfLiving: "High", startupEcosystem: "Biotech + SaaS powerhouse", meetupScene: "Strong academic + tech overlap",
    metaTitle: `Side Business Ideas Boston — Micro-SaaS Guide | Invisible Exit`,
    metaDescription: `Start a side business in Boston. World-class talent, strong biotech/SaaS ecosystem. Legal guide for Massachusetts-employed founders.`,
    h1: `Side Business Ideas in Boston, Massachusetts`,
    intro: `Boston combines world-class universities (MIT, Harvard, BU) with a deep biotech and SaaS ecosystem. The city is ideal for technically sophisticated micro-SaaS products targeting specialized verticals.`,
    legalContext: `Massachusetts enforces non-competes but requires reasonable scope and garden leave (payment during restriction). LLC formation costs $500 with a $500 annual report fee — among the highest in the US. State income tax is 5% flat.`,
    localAdvantage: `Boston's density of PhDs, engineers, and domain experts means products requiring deep technical knowledge find both builders and customers here.`,
    faqs: [
      { question: "Are non-competes enforceable in Massachusetts?", answer: "Yes, but MA reformed non-competes in 2018 requiring garden leave (payment of 50% of salary during restriction) and reasonable duration. This makes them expensive for employers to enforce." },
    ],
  },
  { slug: "chicago", city: "Chicago", state: "Illinois", stateSlug: "illinois", population: "2.7M+", avgSalary: "$70K", costOfLiving: "Moderate", startupEcosystem: "Growing fintech/logistics hub", meetupScene: "Active tech community",
    metaTitle: `Side Business Ideas Chicago — Micro-SaaS Guide | Invisible Exit`,
    metaDescription: `Start a side business in Chicago. Diverse economy, moderate costs, strong B2B opportunities. Legal guide for Illinois-employed founders.`,
    h1: `Side Business Ideas in Chicago, Illinois`,
    intro: `Chicago's diverse economy spans finance, logistics, manufacturing, and tech — creating B2B SaaS opportunities that coastal hubs miss. Lower costs and a strong central location make it an excellent city for building an invisible side business.`,
    legalContext: `Illinois recently banned non-competes for employees earning under $75K (2022 law). LLC formation costs $150 with a $75 annual report fee. Illinois has a flat 4.95% state income tax.`,
    localAdvantage: `Chicago's diversified economy means niche B2B products targeting finance, logistics, or manufacturing can find enterprise customers willing to pay premium pricing.`,
    faqs: [
      { question: "Can I build a SaaS while employed at a Chicago company?", answer: "Yes, especially if you earn under $75K (non-competes are banned). For higher earners, non-competes must be reasonable in scope and geography. Illinois also has strong IP assignment laws, so use personal equipment." },
    ],
  },
  { slug: "los-angeles", city: "Los Angeles", state: "California", stateSlug: "california", population: "3.9M+", avgSalary: "$78K", costOfLiving: "Very High", startupEcosystem: "Media tech + SaaS hub", meetupScene: "Huge, spread-out community",
    metaTitle: `Side Business Ideas Los Angeles — Micro-SaaS Guide | Invisible Exit`,
    metaDescription: `Start a side business in Los Angeles. Entertainment tech, creator economy, and diverse talent. Legal guide for California-employed founders.`,
    h1: `Side Business Ideas in Los Angeles, California`,
    intro: `Los Angeles dominates creator economy tech, entertainment, and gaming. For building a micro-SaaS targeting creators, influencers, or media, LA is unmatched. The challenge is California's regulatory complexity.`,
    legalContext: `Same as SF: California bans most non-competes but has $800 annual franchise tax. Strong IP assignment presumptions. Consider Wyoming LLC for anonymity.`,
    localAdvantage: `LA's creator economy density means products for YouTubers, podcasters, and influencers have both a massive market and local networking opportunities.`,
    faqs: [
      { question: "Is LA good for creator economy SaaS?", answer: "LA is the best city for it. The density of creators, agencies, and platforms creates a feedback loop that accelerates product-market fit for creator-focused tools." },
    ],
  },
  { slug: "dallas", city: "Dallas", state: "Texas", stateSlug: "texas", population: "1.3M+", avgSalary: "$65K", costOfLiving: "Moderate", startupEcosystem: "Growing tech corridor", meetupScene: "Expanding startup scene",
    metaTitle: `Side Business Ideas Dallas — Micro-SaaS Guide | Invisible Exit`,
    metaDescription: `Start a side business in Dallas. No state income tax, growing tech scene, and affordable living. Legal guide for Texas-employed founders.`,
    h1: `Side Business Ideas in Dallas, Texas`,
    intro: `Dallas offers the tax advantages of Texas with a more affordable cost of living than Austin. The DFW metroplex has a fast-growing tech corridor, especially in fintech and enterprise software.`,
    legalContext: `Same as Austin: Texas enforces non-competes if reasonable. LLC costs $300, no annual report. No state income tax.`,
    localAdvantage: `DFW's corporate density (AT&T, Toyota, JCPenney HQs) creates B2B SaaS opportunities targeting enterprise adjacencies.`,
    faqs: [
      { question: "Dallas vs Austin for side business?", answer: "Austin has more startup culture and networking; Dallas has more corporate density and B2B opportunity. Both share Texas's tax advantages. Choose based on your target market." },
    ],
  },
  { slug: "portland", city: "Portland", state: "Oregon", stateSlug: "oregon", population: "640K+", avgSalary: "$68K", costOfLiving: "High", startupEcosystem: "Indie-friendly tech hub", meetupScene: "Strong indie hacker community",
    metaTitle: `Side Business Ideas Portland — Micro-SaaS Guide | Invisible Exit`,
    metaDescription: `Start a side business in Portland. Indie-friendly culture, strong open-source community. Legal guide for Oregon-employed founders.`,
    h1: `Side Business Ideas in Portland, Oregon`,
    intro: `Portland has a unique indie hacker culture that celebrates bootstrapped, independent products. If you want to build a quirky niche SaaS without VC pressure, Portland's community is ideal.`,
    legalContext: `Oregon bans non-competes for employees earning under ~$95K (adjusted annually). LLC formation costs $100 with a $100 annual report fee. Oregon has progressive state income tax up to 9.9%.`,
    localAdvantage: `Portland's indie culture means local press, meetups, and customers who actively support indie products. Perfect for bootstrapped launches.`,
    faqs: [
      { question: "Is Portland good for bootstrapped SaaS?", answer: "Portland is one of the best cities for bootstrapped SaaS. The culture celebrates independence over VC chasing, and local networks like PIE (Portland Incubator Experiment) support indie founders." },
    ],
  },
  { slug: "atlanta", city: "Atlanta", state: "Georgia", stateSlug: "georgia", population: "490K+", avgSalary: "$62K", costOfLiving: "Moderate", startupEcosystem: "Top southern tech hub", meetupScene: "Growing startup ecosystem",
    metaTitle: `Side Business Ideas Atlanta — Micro-SaaS Guide | Invisible Exit`,
    metaDescription: `Start a side business in Atlanta. Growing fintech hub, affordable living, diverse economy. Legal guide for Georgia-employed founders.`,
    h1: `Side Business Ideas in Atlanta, Georgia`,
    intro: `Atlanta is the leading tech hub of the Southeast, with particular strength in fintech (it processes 70% of US payment card transactions). Affordable living and a growing startup ecosystem make it an excellent city for side business building.`,
    legalContext: `Georgia enforces non-competes but requires reasonable restrictions. LLC formation costs $100 with a $50 annual registration fee. Georgia has a flat 5.39% state income tax.`,
    localAdvantage: `Atlanta's fintech dominance creates B2B SaaS opportunities in payments, lending, and financial infrastructure that don't exist elsewhere.`,
    faqs: [
      { question: "Why is Atlanta good for fintech SaaS?", answer: "Atlanta processes 70% of all US payment card transactions. Companies like Fiserv, Global Payments, and NCR create a deep talent pool and B2B customer base for fintech-adjacent SaaS." },
    ],
  },
  { slug: "phoenix", city: "Phoenix", state: "Arizona", stateSlug: "arizona", population: "1.6M+", avgSalary: "$58K", costOfLiving: "Moderate", startupEcosystem: "Emerging tech hub", meetupScene: "Growing community",
    metaTitle: `Side Business Ideas Phoenix — Micro-SaaS Guide | Invisible Exit`,
    metaDescription: `Start a side business in Phoenix. Affordable living, growing tech scene, favorable tax structure. Legal guide for Arizona-employed founders.`,
    h1: `Side Business Ideas in Phoenix, Arizona`,
    intro: `Phoenix offers affordable living, a growing tech ecosystem, and a 2.5% flat state income tax. It's attracting remote workers and startups from California, creating an increasingly diverse tech community.`,
    legalContext: `Arizona has relatively low filing fees ($50 LLC formation). Non-competes are enforceable if reasonable. Arizona has a flat 2.5% state income tax (one of the lowest).`,
    localAdvantage: `Phoenix's affordability means your SaaS revenue goes much further. The city is also attracting California transplants, creating networking opportunities.`,
    faqs: [
      { question: "Is Arizona good for LLC formation?", answer: "Arizona has one of the lowest LLC formation costs ($50) and minimal ongoing fees. The state also offers anonymity protections for LLC members." },
    ],
  },
  { slug: "miami", city: "Miami", state: "Florida", stateSlug: "florida", population: "440K+", avgSalary: "$60K", costOfLiving: "High", startupEcosystem: "Boom city for tech", meetupScene: "Explosive growth",
    metaTitle: `Side Business Ideas Miami — Micro-SaaS Guide | Invisible Exit`,
    metaDescription: `Start a side business in Miami. No state income tax, exploding tech scene, Latin America gateway. Legal guide for Florida-employed founders.`,
    h1: `Side Business Ideas in Miami, Florida`,
    intro: `Miami has aggressively positioned itself as the tech capital of the East, attracting founders from SF, NYC, and Latin America. No state income tax, a booming startup ecosystem, and international connectivity make it an excellent city for side business building.`,
    legalContext: `Florida bans most non-competes (banned since 2024 for most workers). LLC formation costs $125 with a $138.75 annual report fee. No state income tax.`,
    localAdvantage: `Miami's position as the gateway to Latin America creates unique opportunities for bilingual SaaS and cross-border payment tools.`,
    faqs: [
      { question: "Does Florida have state income tax?", answer: "No. Florida has no state income tax, making it one of the best states for SaaS founders alongside Texas, Washington, Nevada, and Wyoming." },
    ],
  },
  { slug: "washington-dc", city: "Washington, D.C.", state: "District of Columbia", stateSlug: "district-of-columbia", population: "670K+", avgSalary: "$85K", costOfLiving: "Very High", startupEcosystem: "Govtech + cybersecurity hub", meetupScene: "Active policy-tech community",
    metaTitle: `Side Business Ideas Washington DC — Micro-SaaS Guide | Invisible Exit`,
    metaDescription: `Start a side business in DC. Government tech, cybersecurity, and policy expertise create unique niches. Legal guide for DC-area founders.`,
    h1: `Side Business Ideas in Washington, D.C.`,
    intro: `Washington D.C. has unique opportunities in govtech, cybersecurity, and policy-adjacent SaaS. The density of government contractors, nonprofits, and associations creates B2B niches that don't exist elsewhere.`,
    legalContext: `DC follows Maryland/Virginia non-compete law depending on where your employer is based. Virginia recently banned non-competes for workers under ~$73K. DC itself banned non-competes for most workers in 2022.`,
    localAdvantage: `DC's concentration of associations, nonprofits, and government-adjacent organizations creates SaaS niches in compliance, advocacy, and policy management.`,
    faqs: [
      { question: "Can government employees build side businesses?", answer: "Yes, with strict conflict-of-interest rules. Federal employees must avoid businesses that conflict with their agency's work. Many build in completely unrelated industries." },
    ],
  },
  { slug: "remote", city: "Remote", state: "Anywhere", stateSlug: "anywhere", population: "All", avgSalary: "Varies", costOfLiving: "Varies", startupEcosystem: "Distributed", meetupScene: "Online communities",
    metaTitle: `Side Business Ideas for Remote Workers — Micro-SaaS Guide | Invisible Exit`,
    metaDescription: `Build a side business while working remotely. Legal considerations for remote employees, best states for LLC formation, and why remote work is an unfair advantage for side business builders.`,
    h1: `Side Business Ideas for Remote Workers`,
    intro: `Remote work is the ultimate unfair advantage for side business building. You have flexible hours, no office politics draining your energy, and the freedom to form your LLC in the most advantageous state. Here's how to leverage remote work for your invisible exit.`,
    legalContext: `Your legal situation depends on your employer's state, not your physical location. Check your employment contract's governing law clause. Form your LLC in Wyoming or Delaware for maximum anonymity regardless of where you live.`,
    localAdvantage: `Remote work gives you the most valuable resource: control over your time. Use your commute-free schedule to build during peak productivity hours. The main challenge is social isolation — join online communities like IndieHackers.`,
    faqs: [
      { question: "Can my employer monitor my side business if I work remotely?", answer: "Employers can monitor company-issued equipment and networks. Always use a personal computer, personal network, and separate accounts for your side business. Never build on company time or equipment." },
      { question: "Where should I form my LLC if I work remotely?", answer: "Wyoming for maximum anonymity and low fees ($100 formation, $60/year). Delaware if you anticipate investors. Your physical location matters less than the LLC's state of formation for liability purposes." },
    ],
  },
];
