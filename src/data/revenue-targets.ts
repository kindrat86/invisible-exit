/**
 * Revenue Target × Profession pSEO pages for /revenue/:tier/for/:profession.
 *
 * Targets ultra-high-intent searches like:
 *   "how to make $5k month as a software engineer"
 *   "passive income ideas for marketers earning 10k month"
 *   "micro saas ideas to replace 3k month salary"
 *
 * 25 professions × 5 revenue tiers = 125 pages.
 *
 * Each page provides: realistic revenue math, required customer count,
 * pricing strategy, timeline, and profession-specific micro-SaaS ideas
 * that can hit the target.
 */

export interface RevenueTarget {
  slug: string;
  profession: string;
  professionSlug: string;
  tier: string;
  tierSlug: string;
  monthlyRevenue: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  customerMath: string;
  pricingStrategy: string;
  timeline: string;
  bestIdeas: readonly string[];
  faqs: { question: string; answer: string }[];
}

const TIERS = [
  { tier: "$1K/month", tierSlug: "1000", customers: "20-100 customers", pricing: "$10-$50/month per customer", timeline: "3-6 months", desc: "first $1,000 of recurring revenue" },
  { tier: "$3K/month", tierSlug: "3000", customers: "30-300 customers", pricing: "$10-$100/month per customer", timeline: "6-12 months", desc: "enough to cover a mortgage or replace a junior salary" },
  { tier: "$5K/month", tierSlug: "5000", customers: "50-500 customers", pricing: "$10-$100/month per customer", timeline: "8-18 months", desc: "the threshold where most people can quit their day job" },
  { tier: "$10K/month", tierSlug: "10000", customers: "100-1,000 customers", pricing: "$10-$100/month per customer", timeline: "12-24 months", desc: "top 1% of solo SaaS founders" },
  { tier: "$20K/month", tierSlug: "20000", customers: "200-2,000 customers", pricing: "$10-$100/month per customer", timeline: "18-36 months", desc: "elite micro-SaaS territory — rarefied air" },
] as const;

const PROFESSIONS = [
  { name: "Software Engineers", slug: "software-engineers", ideas: ["API monitoring SaaS", "GitHub analytics dashboard", "CI/CD optimization tool", "Code review AI assistant", "Developer documentation generator"], skills: "full-stack development, API design, and DevOps" },
  { name: "Product Managers", slug: "product-managers", ideas: ["Roadmap prioritization tool", "Customer feedback aggregator", "Feature voting platform", "Sprint analytics dashboard", "PRD template generator"], skills: "user research, spec writing, and cross-functional leadership" },
  { name: "Marketers", slug: "marketers", ideas: ["Social media scheduling AI", "Content calendar generator", "Email sequence optimizer", "SEO keyword tracker", "Ad copy A/B tester"], skills: "content creation, SEO, and audience building" },
  { name: "Financial Analysts", slug: "financial-analysts", ideas: ["Personal finance dashboard", "Investment portfolio tracker", "Expense categorization tool", "Financial model templates", "Dividend tracker SaaS"], skills: "financial modeling, data analysis, and Excel mastery" },
  { name: "Consultants", slug: "consultants", ideas: ["Client portal SaaS", "Proposal generator", "Time tracking invoicer", "Knowledge base builder", "Contract template platform"], skills: "client management, domain expertise, and structured thinking" },
  { name: "Designers", slug: "designers", ideas: ["Design system generator", "Color palette AI", "Figma plugin marketplace", "Brand kit builder", "Logo variation generator"], skills: "visual design, UI/UX, and creative tools" },
  { name: "Sales Managers", slug: "sales-managers", ideas: ["CRM automation tool", "Sales sequence builder", "Pipeline visualizer", "Commission calculator", "Cold email optimizer"], skills: "sales processes, CRM systems, and relationship management" },
  { name: "Accountants", slug: "accountants", ideas: ["Tax deduction finder", "Invoice automation SaaS", "Bookkeeping dashboard", "Receipt OCR tool", "Payroll calculator"], skills: "financial compliance, bookkeeping, and tax knowledge" },
  { name: "Lawyers", slug: "lawyers", ideas: ["Contract review AI", "Legal document generator", "Case management tool", "Billable hours tracker", "Client intake automation"], skills: "legal drafting, compliance, and analytical reasoning" },
  { name: "Data Analysts", slug: "data-analysts", ideas: ["Data visualization dashboard", "ETL pipeline builder", "SQL query optimizer", "Report automation tool", "Data quality monitor"], skills: "SQL, data visualization, and statistical analysis" },
  { name: "Nurses", slug: "nurses", ideas: ["Shift scheduling tool", "Patient education platform", "Medication tracker app", "Nurse staffing marketplace", "CE course aggregator"], skills: "patient care, health systems, and clinical knowledge" },
  { name: "HR Managers", slug: "hr-managers", ideas: ["Employee onboarding automation", "360 feedback tool", "Job description generator", "Culture survey platform", "Benefits comparison tool"], skills: "people operations, compliance, and organizational design" },
  { name: "Teachers", slug: "teachers", ideas: ["Lesson plan marketplace", "Grading automation tool", "Parent communication portal", "Worksheet generator AI", "Curriculum planning tool"], skills: "curriculum design, communication, and educational technology" },
  { name: "Real Estate Agents", slug: "real-estate-agents", ideas: ["Property listing optimizer", "Lead nurturing CRM", "Virtual tour creator", "Market analysis dashboard", "Open house scheduler"], skills: "local market knowledge, sales, and client management" },
  { name: "Recruiters", slug: "recruiters", ideas: ["Candidate sourcing AI", "Interview scheduler", "Resume parser tool", "Job board aggregator", "Reference check automator"], skills: "talent assessment, sourcing, and candidate experience" },
  { name: "Project Managers", slug: "project-managers", ideas: ["Gantt chart generator", "Resource allocation tool", "Risk assessment dashboard", "Meeting notes automator", "Status report generator"], skills: "planning, stakeholder management, and process optimization" },
  { name: "Customer Success Managers", slug: "customer-success-managers", ideas: ["Health score dashboard", "Churn prediction tool", "Onboarding checklist builder", "Customer feedback aggregator", "Renewal reminder automation"], skills: "relationship building, account management, and data analysis" },
  { name: "Operations Managers", slug: "operations-managers", ideas: ["Workflow automation builder", "Inventory tracker", "Vendor management portal", "Process documentation tool", "Compliance checklist SaaS"], skills: "process optimization, supply chain, and operational efficiency" },
  { name: "Executive Assistants", slug: "executive-assistants", ideas: ["Calendar optimization AI", "Meeting prep brief generator", "Travel booking automator", "Expense report tool", "Inbox triage assistant"], skills: "scheduling, coordination, and administrative systems" },
  { name: "Virtual Assistants", slug: "virtual-assistants", ideas: ["Client management dashboard", "Task batching tool", "Invoice generator", "Time block scheduler", "Standard operating procedure builder"], skills: "task management, communication, and remote collaboration" },
  { name: "Photographers", slug: "photographers", ideas: ["Photo delivery portal", "Booking calendar SaaS", "Contract generator", "Editing preset marketplace", "Client gallery tool"], skills: "visual composition, editing software, and client service" },
  { name: "Writers", slug: "writers", ideas: ["AI writing assistant SaaS", "Content brief generator", "Editorial calendar tool", "Plagiarism checker API", "Freelance rate calculator"], skills: "content creation, editing, and narrative structure" },
  { name: "Trainers", slug: "trainers", ideas: ["Course platform builder", "Workout tracker app", "Client portal SaaS", "Progress photo tool", "Booking and payment system"], skills: "fitness programming, client motivation, and health knowledge" },
  { name: "Supply Chain Managers", slug: "supply-chain-managers", ideas: ["Inventory forecasting tool", "Supplier comparison dashboard", "Shipping tracker API", "Demand planning SaaS", "Warehouse layout optimizer"], skills: "logistics, forecasting, and vendor negotiation" },
  { name: "Doctors", slug: "doctors", ideas: ["Patient education platform", "Telemedicine scheduling tool", "Medical reference app", "CME tracker", "Practice management dashboard"], skills: "clinical expertise, patient communication, and medical systems" },
] as const;

function generateRevenueTargets(): RevenueTarget[] {
  const pages: RevenueTarget[] = [];
  for (const prof of PROFESSIONS) {
    for (const tier of TIERS) {
      const slug = `${tier.tierSlug}-for-${prof.slug}`;
      pages.push({
        slug,
        profession: prof.name,
        professionSlug: prof.slug,
        tier: tier.tier,
        tierSlug: tier.tierSlug,
        monthlyRevenue: tier.tier,
        metaTitle: `How to Make ${tier.tier} as ${prof.name} (${tier.timeline}) | Invisible Exit`,
        metaDescription: `Realistic path to ${tier.tier} in recurring revenue for ${prof.name.toLowerCase()}. Customer math, pricing strategy, and ${prof.ideas.length} micro-SaaS ideas that leverage your ${prof.skills}.`,
        h1: `How to Make ${tier.tier} as ${prof.name}`,
        intro: `Making ${tier.tier} in recurring revenue is ${tier.desc}. For ${prof.name.toLowerCase()}, this is achievable because you already have the ${prof.skills} that customers will pay for. Here's the exact math, pricing strategy, and ideas to get there in ${tier.timeline}.`,
        customerMath: `At ${tier.pricing}, you need ${tier.customers} to reach ${tier.tier}. That's not a massive audience — it's a focused niche done well.`,
        pricingStrategy: `Price at ${tier.pricing}. Resist the urge to go cheaper. A $10/month product needs 10x more customers than a $100/month product, which means 10x more marketing, 10x more support, and 10x more churn.`,
        timeline: tier.timeline,
        bestIdeas: prof.ideas,
        faqs: [
          {
            question: `How realistic is ${tier.tier} for a ${prof.name.toLowerCase().replace(/s$/, "")} building a side business?`,
            answer: `${tier.tier} is ${tier.tierSlug === "1000" ? "very achievable — most committed founders reach this within months" : tier.tierSlug === "3000" ? "achievable with consistent effort over 6-12 months" : tier.tierSlug === "5000" ? "the freedom threshold — achievable in 8-18 months of focused work" : tier.tierSlug === "10000" ? "ambitious but realistic — it puts you in the top tier of solo SaaS founders" : "elite territory requiring 18-36 months of sustained effort and multiple product iterations"}. The key is leveraging your ${prof.skills} — you're not starting from scratch.`,
          },
          {
            question: `What's the fastest path to ${tier.tier}?`,
            answer: `Start with the ideas that are closest to your existing skills. ${prof.ideas[0]} and ${prof.ideas[1]} are specifically suited to ${prof.name.toLowerCase()}. Charge from day one — even $10/month validates demand better than 100 free signups.`,
          },
          {
            question: `Should I quit my job to reach ${tier.tier} faster?`,
            answer: `No. The Invisible Exit method is about building until your recurring revenue replaces enough of your salary to make leaving feel safe. ${tier.tier}${tier.tierSlug === "1000" || tier.tierSlug === "3000" ? " is a milestone, not a quitting point — keep your job until you hit your full freedom number" : " may be enough to quit depending on your expenses, but don't leave until you have 6 months of runway saved on top of your MRR"}.`,
          },
        ],
      });
    }
  }
  return pages;
}

export const revenueTargets: RevenueTarget[] = generateRevenueTargets();
