/**
 * Profession mistakes pages for /mistakes/:slug.
 * "Common mistakes [profession] make building a side business"
 */
export interface ProfessionMistake {
  slug: string;
  profession: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  mistakes: { mistake: string; why: string; fix: string }[];
  positiveSigns: string[];
  faqs: { question: string; answer: string }[];
}

const professions = [
  { slug: "accountants", name: "Accountants", icon: "📊", weakness: "over-engineering financial models before validating demand" },
  { slug: "lawyers", name: "Lawyers", icon: "⚖️", weakness: "analyzing every legal risk instead of shipping" },
  { slug: "teachers", name: "Teachers", icon: "📚", weakness: "over-preparing content instead of testing the market" },
  { slug: "nurses", name: "Nurses", icon: "🏥", weakness: "ignoring HIPAA and regulatory considerations" },
  { slug: "software-engineers", name: "Software Engineers", icon: "💻", weakness: "building too many features before launching" },
  { slug: "marketers", name: "Marketers", icon: "📢", weakness: "focusing on branding before product-market fit" },
  { slug: "hr-managers", name: "HR Managers", icon: "👤", weakness: "worrying about employer conflicts instead of validating ideas" },
  { slug: "consultants", name: "Consultants", icon: "💼", weakness: "treating every side project like a client engagement" },
  { slug: "designers", name: "Designers", icon: "🎨", weakness: "perfecting design instead of testing functionality" },
  { slug: "financial-analysts", name: "Financial Analysts", icon: "📈", weakness: "building elaborate spreadsheets instead of MVPs" },
  { slug: "product-managers", name: "Product Managers", icon: "📋", weakness: "over-researching competitors instead of talking to users" },
  { slug: "sales-managers", name: "Sales Managers", icon: "🤝", weakness: "treating the product as a sales pitch instead of a solution" },
  { slug: "doctors", name: "Doctors", icon: "⚕️", weakness: "requiring clinical-grade evidence before launching anything" },
  { slug: "real-estate-agents", name: "Real Estate Agents", icon: "🏠", weakness: "focusing on commissions instead of recurring revenue" },
  { slug: "recruiters", name: "Recruiters", icon: "🔍", weakness: "treating the business as another placement instead of a product" },
  { slug: "project-managers", name: "Project Managers", icon: "✅", weakness: "creating elaborate project plans instead of shipping" },
  { slug: "data-analysts", name: "Data Analysts", icon: "📊", weakness: "building dashboards nobody asked for" },
  { slug: "customer-success", name: "Customer Success Managers", icon: "💬", weakness: "over-serving early users instead of scaling acquisition" },
  { slug: "operations-managers", name: "Operations Managers", icon: "⚙️", weakness: "optimizing processes before having customers" },
  { slug: "executive-assistants", name: "Executive Assistants", icon: "📌", weakness: "undervaluing their own domain expertise" },
  { slug: "virtual-assistants", name: "Virtual Assistants", icon: "🖥️", weakness: "trading time for money instead of building products" },
  { slug: "photographers", name: "Photographers", icon: "📸", weakness: "focusing on portfolio instead of product" },
  { slug: "writers", name: "Writers", icon: "✍️", weakness: "polishing content endlessly instead of publishing" },
  { slug: "trainers", name: "Trainers", icon: "🎯", weakness: "building courses nobody has pre-purchased" },
  { slug: "supply-chain", name: "Supply Chain Managers", icon: "📦", weakness: "optimizing logistics before validating demand" },
];

function generateMistake(p: typeof professions[0]): ProfessionMistake {
  const profLower = p.name.toLowerCase();
  return {
    slug: `mistakes-${p.slug}-make`,
    profession: p.name,
    metaTitle: `7 Mistakes ${p.name} Make Building a Side Business (2026)`,
    metaDescription: `The most common mistakes ${profLower} make when building a micro-SaaS side business — and exactly how to avoid them. Real examples and fixes.`,
    h1: `7 Mistakes ${p.name} Make When Building a Side Business`,
    intro: `${p.name} have unique advantages when building side businesses — deep domain expertise, analytical skills, and professional networks. But those same strengths can become liabilities. Here are the 7 mistakes that derail ${profLower} most often, and how to fix each one.`,
    mistakes: [
      {
        mistake: `Over-committing to ${p.weakness}`,
        why: `${p.name} are trained to be thorough and rigorous. In a day job, that's an asset. In a side business, it becomes perfection paralysis — you spend weekends polishing instead of shipping.`,
        fix: "Set a hard deadline for every milestone. Use the 48-hour rule: if you can't validate an idea in 48 hours, it's too complex. Ship the ugly version first.",
      },
      {
        mistake: "Choosing ideas that compete with their employer",
        why: `Many ${profLower} naturally gravitate toward problems in their own industry. This creates legal risk (non-compete violations) and ethical conflicts.`,
        fix: "Build in an unrelated market. Your industry knowledge is transferable — the workflow patterns, not the domain content. Use the Stealth Ops Hub to audit compliance.",
      },
      {
        mistake: "Underpricing or giving the product away for free",
        why: `${p.name} often undervalue their work because they're used to salaried income. They price at $5/month when they should charge $29/month.`,
        fix: "Price based on value delivered, not your comfort level. If your product saves someone 5 hours/week, it's worth at least $29/month. Test higher prices — you'll be surprised.",
      },
      {
        mistake: "Building features instead of finding customers",
        why: "Feature creep is the #1 killer of side projects. Instead of talking to users, you add another dashboard, another integration, another setting.",
        fix: "Follow the 10-customer rule: don't add any feature until 10 paying customers have specifically requested it. Spend 80% of your time on acquisition, not development.",
      },
      {
        mistake: "Not setting up proper legal separation",
        why: "Many professionals skip entity formation, use personal email for business, or accidentally use employer devices. This creates discoverable connections.",
        fix: "Form an anonymous LLC (Wyoming or Delaware), use a separate email, domain, and device. Run the Stealth Ops compliance audit before launching anything publicly.",
      },
      {
        mistake: "Quitting too early when growth is slow",
        why: "Corporate careers have predictable advancement timelines. Side businesses don't. The first 6 months often show zero revenue, which feels like failure.",
        fix: "Set realistic expectations: 12-18 months to $4,000/month MRR is normal. Track your freedom number, not your monthly revenue. The compounding starts after month 8.",
      },
      {
        mistake: "Ignoring distribution until the product is 'ready'",
        why: `${p.name} are builders by nature. They assume a good product will market itself. It won't — distribution is 80% of success.`,
        fix: "Start building your audience on Day 1. Post on Reddit, write SEO content, create YouTube videos. Distribution takes longer than product development — start now.",
      },
    ],
    positiveSigns: [
      "You have 3+ paying customers within 90 days of launching",
      "Users are requesting features you haven't built yet",
      "Your churn rate is below 5% per month",
      "You're spending more time on marketing than development",
      "Your entity separation is complete and compliant",
    ],
    faqs: [
      {
        question: `Can ${profLower} build side businesses without violating employment contracts?`,
        answer: `Yes, if you build in unrelated markets, use your own time and equipment, and operate through a separate legal entity. Always review your specific contract with a legal professional.`,
      },
      {
        question: `How much time should ${profLower} invest weekly?`,
        answer: "5-10 focused hours per week is sufficient. Consistency matters more than total hours — 1 hour daily beats 7 hours on Sunday.",
      },
      {
        question: `What's the biggest advantage ${profLower} have in building side businesses?`,
        answer: `Domain expertise. ${p.name} understand specific workflows, pain points, and industry patterns that outsiders miss. The key is applying that expertise to a non-competing market.`,
      },
    ],
  };
}

export const professionMistakes: ProfessionMistake[] = professions.map(generateMistake);
