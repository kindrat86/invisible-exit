/**
 * First-year pages for /first-year/:slug.
 * "First year building a micro-SaaS as a [profession]"
 */
export interface FirstYearEntry {
  slug: string;
  profession: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  advantages: string[];
  challenges: string[];
  monthlyPlan: { month: number; focus: string; goal: string; deliverable: string; realityCheck: string }[];
  yearEndExpectations: { metric: string; target: string; stretchGoal: string }[];
  lessonsLearned: string[];
  faqs: { question: string; answer: string }[];
}

interface ProfFY { slug: string; name: string; advantage: string; challenge: string; }

const profFYData: ProfFY[] = [
  { slug: "accountant", name: "Accountant", advantage: "financial modeling and compliance mindset", challenge: "perfectionism in non-financial areas" },
  { slug: "lawyer", name: "Lawyer", advantage: "analytical rigor and risk assessment", challenge: "over-analyzing instead of shipping" },
  { slug: "teacher", name: "Teacher", advantage: "content creation and explanation skills", challenge: "limited technical confidence" },
  { slug: "nurse", name: "Nurse", advantage: "process optimization and empathy", challenge: "HIPAA and regulatory complexity" },
  { slug: "software-engineer", name: "Software Engineer", advantage: "direct coding ability", challenge: "over-building features" },
  { slug: "marketer", name: "Marketer", advantage: "audience building and positioning", challenge: "focusing on promotion over product" },
  { slug: "hr-manager", name: "HR Manager", advantage: "process design and people systems", challenge: "imposter syndrome in technical areas" },
  { slug: "consultant", name: "Consultant", advantage: "structured problem-solving", challenge: "treating it like a client engagement" },
  { slug: "designer", name: "Designer", advantage: "visual and UX expertise", challenge: "polishing design instead of testing" },
  { slug: "financial-analyst", name: "Financial Analyst", advantage: "quantitative modeling", challenge: "analysis paralysis on market data" },
  { slug: "product-manager", name: "Product Manager", advantage: "product sense and prioritization", challenge: "researching instead of building" },
  { slug: "sales-manager", name: "Sales Manager", advantage: "customer acquisition and closing", challenge: "selling before the product is ready" },
  { slug: "doctor", name: "Doctor", advantage: "deep domain credibility", challenge: "limited time availability" },
  { slug: "real-estate-agent", name: "Real Estate Agent", advantage: "market knowledge and negotiation", challenge: "inconsistent income complicates planning" },
  { slug: "recruiter", name: "Recruiter", advantage: "networking and matching skills", challenge: "building a product vs a service" },
  { slug: "project-manager", name: "Project Manager", advantage: "execution and timeline management", challenge: "over-planning instead of iterating" },
  { slug: "data-analyst", name: "Data Analyst", advantage: "data fluency and dashboarding", challenge: "building tools nobody asked for" },
  { slug: "customer-success-manager", name: "Customer Success Manager", advantage: "retention and feedback loops", challenge: "over-serving early users" },
  { slug: "operations-manager", name: "Operations Manager", advantage: "process optimization", challenge: "optimizing before having customers" },
  { slug: "executive-assistant", name: "Executive Assistant", advantage: "productivity and scheduling systems", challenge: "undervaluing own expertise" },
  { slug: "virtual-assistant", name: "Virtual Assistant", advantage: "remote work and client management", challenge: "transitioning from service to product" },
  { slug: "photographer", name: "Photographer", advantage: "visual content creation", challenge: "treating it as portfolio not product" },
  { slug: "writer", name: "Writer", advantage: "content at scale and storytelling", challenge: "endless polishing instead of publishing" },
  { slug: "trainer", name: "Trainer", advantage: "instructional design and curriculum", challenge: "building courses nobody pre-bought" },
  { slug: "supply-chain-manager", name: "Supply Chain Manager", advantage: "logistics and vendor management", challenge: "optimizing supply before demand exists" },
];

const baseMonthlyPlan = [
  { month: 1, focus: "Idea + Validation", goal: "Identify one painful problem", deliverable: "10 customer interviews completed", realityCheck: "You'll feel like you're wasting time. You're not. The problem you pick determines everything." },
  { month: 2, focus: "Pre-sell", goal: "Get 3 paying customers before building", deliverable: "Landing page + 3 pre-orders", realityCheck: "Most people skip this. Those who skip it waste 3 months building the wrong thing." },
  { month: 3, focus: "MVP Build", goal: "Ship the simplest version that solves the problem", deliverable: "Functional product with 1 core feature", realityCheck: "It will be ugly. That's fine. Ugly and shipped beats beautiful and unfinished." },
  { month: 4, focus: "Onboard early users", goal: "Get 5-10 active users", deliverable: "Onboarding flow + weekly check-ins", realityCheck: "Half your pre-orders will churn. That's normal. Focus on the ones who stay." },
  { month: 5, focus: "Iterate on feedback", goal: "Reach 10 paying customers", deliverable: "3 feature iterations based on usage data", realityCheck: "Users will ask for features you never planned. Say no to 90% of them." },
  { month: 6, focus: "First marketing push", goal: "Reach $500 MRR", deliverable: "10 SEO blog posts + 50 Reddit comments", realityCheck: "Marketing will feel harder than building. It is. But it's more important." },
  { month: 7, focus: "Optimize conversion", goal: "Improve trial-to-paid rate", deliverable: "A/B test pricing page and onboarding", realityCheck: "Small changes have big effects. A single headline change can double conversion." },
  { month: 8, focus: "Content engine", goal: "Publish 2 articles per week", deliverable: "20+ blog posts indexed by Google", realityCheck: "SEO takes 3-6 months to compound. You won't see results until month 10." },
  { month: 9, focus: "Community + distribution", goal: "Reach $1K MRR", deliverable: "Active in 5 communities, 100 email subscribers", realityCheck: "Word-of-mouth will start. Your first organic referrals are magical." },
  { month: 10, focus: "Scale acquisition", goal: "Reach $2K MRR", deliverable: "Partnerships, guest posts, or paid acquisition test", realityCheck: "You'll need to choose: double down on what works or try new channels. Always choose the former." },
  { month: 11, focus: "Retention + expansion", goal: "Reduce churn to <5%", deliverable: "Annual plans, dunning campaigns, feature upgrades", realityCheck: "Acquisition is exciting; retention is boring. But retention compounds." },
  { month: 12, focus: "Year review + next steps", goal: "Reach $3K MRR or decide to pivot", deliverable: "Year-end review, updated roadmap, new pricing", realityCheck: "You'll be tempted to start a second product. Don't. Double down on what's working." },
];

function generateFirstYear(p: ProfFY): FirstYearEntry {
  return {
    slug: `first-year-as-${p.slug}`,
    profession: p.name,
    metaTitle: `First Year Building Micro-SaaS as a ${p.name}: Month by Month (2026)`,
    metaDescription: `A complete 12-month roadmap for ${p.name.toLowerCase()}s building a micro-SaaS side business. Advantages, challenges, monthly milestones, and realistic expectations.`,
    h1: `First Year Building Micro-SaaS as a ${p.name}: Month by Month`,
    intro: `Your first year as a ${p.name} building a side business will be the steepest learning curve of your career. The good news: your ${p.advantage} gives you a genuine head start. The challenge: ${p.challenge}. This month-by-month plan accounts for both.`,
    advantages: [
      `Your ${p.advantage} is a competitive advantage that outsiders can't replicate`,
      "Professional network of potential early adopters",
      "Stable income removes the desperation that kills good decisions",
      "Experience managing complex projects and stakeholders",
      "Domain credibility that builds trust with users",
    ],
    challenges: [
      `${p.challenge} will slow you down if you're not aware of it`,
      "Limited time (5-10 hours/week means every hour matters)",
      "Decision fatigue from wearing every hat (builder, marketer, support)",
      "Imposter syndrome when operating outside your domain",
      "Balancing day job performance with side business growth",
    ],
    monthlyPlan: baseMonthlyPlan.map(m => ({
      ...m,
      realityCheck: p.challenge.includes("over") || p.challenge.includes("perfection")
        ? `${m.realityCheck} Watch for your tendency toward ${p.challenge}.`
        : m.realityCheck,
    })),
    yearEndExpectations: [
      { metric: "Monthly recurring revenue", target: "$1K-$3K", stretchGoal: "$4K+" },
      { metric: "Paying customers", target: "30-50", stretchGoal: "100+" },
      { metric: "Monthly churn rate", target: "<8%", stretchGoal: "<5%" },
      { metric: "Time invested per week", target: "8-12 hours", stretchGoal: "Sustainable 15+" },
      { metric: "Blog posts published", target: "30+", stretchGoal: "50+" },
    ],
    lessonsLearned: [
      "The problem you choose matters more than the solution you build",
      "Distribution is 80% of success — start marketing on Day 1",
      "Your first 10 customers will teach you more than any course or book",
      "Saying no to features is harder and more important than saying yes",
      "Consistency beats intensity — 1 hour daily beats 7 hours on Sunday",
    ],
    faqs: [
      {
        question: `How much can a ${p.name.toLowerCase()} realistically earn in the first year?`,
        answer: "$1K-$3K MRR is realistic with consistent effort. Some reach $4K+ in year one, but that requires either exceptional execution or an existing audience. The goal of year one isn't revenue — it's finding product-market fit.",
      },
      {
        question: `Do I need to know how to code as a ${p.name.toLowerCase()}?`,
        answer: "No. AI tools (Claude, Cursor, v0) can handle most development. Your ${p.advantage} is more valuable than coding ability. Focus on identifying problems and validating solutions — let AI handle the implementation.",
      },
      {
        question: "What's the biggest mistake in the first year?",
        answer: "Building before validating. 80% of first-year failures come from building a product nobody wants. The fix: pre-sell before building. If you can't get 3 people to pay $29 for a promise, the idea isn't ready.",
      },
    ],
  };
}

export const firstYearEntries: FirstYearEntry[] = profFYData.map(generateFirstYear);
