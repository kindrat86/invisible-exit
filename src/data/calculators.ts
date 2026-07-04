/**
 * Calculator page data for /calculators/{slug} pages.
 * Each calculator is a data-driven interactive concept page.
 * The actual JS interactivity renders client-side; this data
 * powers the SEO content, schema, and prerendered HTML.
 */

export interface CalculatorData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  formula: string;
  inputs: {
    label: string;
    id: string;
    type: "number" | "select";
    default: string;
    options?: string[];
    min?: number;
    max?: number;
    suffix?: string;
  }[];
  resultLabel: string;
  resultSuffix: string;
  example: {
    scenario: string;
    result: string;
  };
  explanation: string;
  relatedCalculators: string[];
  faqs: { question: string; answer: string }[];
}

export const calculators: CalculatorData[] = [
  {
    slug: "freedom-number",
    title: "Freedom Number Calculator — How Much Do You Need to Quit?",
    metaTitle: "Freedom Number Calculator: When Can You Quit? | Invisible Exit",
    metaDescription:
      "Calculate your freedom number — the monthly recurring revenue that makes your job optional. Based on your real expenses, not your salary.",
    h1: "Freedom Number Calculator",
    intro:
      "Your freedom number is the monthly recurring revenue that covers your essential expenses and makes your job optional. Most people overestimate this number by 50-100% because they confuse lifestyle spending with survival spending. Calculate your real number below.",
    formula: "Essential monthly expenses / expected monthly revenue per customer = customers needed",
    inputs: [
      { label: "Essential monthly expenses (housing, food, insurance)", id: "expenses", type: "number", default: "4000", min: 500, max: 20000, suffix: "/month" },
      { label: "Expected monthly price per customer", id: "price", type: "number", default: "29", min: 5, max: 500, suffix: "/month" },
      { label: "Current monthly recurring revenue", id: "currentMrr", type: "number", default: "0", min: 0, max: 50000, suffix: "/month" },
    ],
    resultLabel: "Customers needed for freedom",
    resultSuffix: "customers",
    example: {
      scenario: "A manager with $4,000/month essential expenses, charging $29/month per customer, currently at $0 MRR.",
      result: "138 customers needed. At 5 new customers per month, that is 28 months to freedom.",
    },
    explanation:
      "Your freedom number is NOT your salary. It is the minimum monthly income that covers your true essentials: housing, food, health insurance, debt minimums, and basic transportation. Work-related costs (commute, clothes, meals) disappear when you leave. Convenience and prestige spending are optional. The number that makes your job optional is typically 40-60% lower than your after-tax salary.",
    relatedCalculators: ["micro-saas-pricing", "churn-impact", "runway-calculator"],
    faqs: [
      { question: "What is a freedom number?", answer: "Your freedom number is the monthly recurring revenue that covers essential expenses, making your job optional. It is typically 40-60% lower than your salary because work-related and lifestyle costs are excluded." },
      { question: "How is the freedom number different from FI/RE?", answer: "FI/RE calculates total investment needed to withdraw 4% annually. The freedom number focuses on recurring revenue from a business, which is faster to build and does not require $1M+ in capital." },
      { question: "How many customers do I need?", answer: "Divide your freedom number by your monthly price. At $4,000/month expenses and $29/month pricing, you need 138 customers. That is achievable in 12-18 months with consistent effort." },
    ],
  },
  {
    slug: "micro-saas-pricing",
    title: "Micro-SaaS Pricing Calculator — What Should You Charge?",
    metaTitle: "Micro-SaaS Pricing Calculator | Invisible Exit",
    metaDescription:
      "Calculate the optimal price for your micro-SaaS based on value delivered, customer segment, and revenue goals. Stop guessing your pricing.",
    h1: "Micro-SaaS Pricing Calculator",
    intro:
      "Pricing is the single highest-leverage decision in your micro-SaaS. Most founders undercharge by 50-80%. This calculator helps you find the price that aligns your revenue goals with the value you deliver to customers.",
    formula: "Value delivered to customer / 10x = monthly price (value-based pricing rule of thumb)",
    inputs: [
      { label: "Hours saved per month for your customer", id: "hoursSaved", type: "number", default: "10", min: 1, max: 200, suffix: "hours" },
      { label: "Customer's hourly cost (employee rate)", id: "hourlyRate", type: "number", default: "50", min: 15, max: 500, suffix: "/hour" },
      { label: "Revenue goal (monthly)", id: "revenueGoal", type: "number", default: "4000", min: 500, max: 50000, suffix: "/month" },
    ],
    resultLabel: "Recommended monthly price",
    resultSuffix: "/month",
    example: {
      scenario: "A tool that saves a marketing manager 10 hours/month, whose time is worth $50/hour, targeting $4,000/month revenue.",
      result: "Value delivered: $500/month. Recommended price: $49/month (10:1 value ratio). You need 82 customers to hit $4,000/month.",
    },
    explanation:
      "The golden rule of SaaS pricing: deliver 10x more value than you charge. If your tool saves a customer $500/month in time or revenue, charging $49/month gives a 10:1 value ratio. This makes the purchase decision obvious. Most micro-SaaS products should charge $19-$99/month. Below $19, you need too many customers. Above $99, you need enterprise sales.",
    relatedCalculators: ["freedom-number", "churn-impact"],
    faqs: [
      { question: "Should I charge weekly or monthly?", answer: "Monthly. Weekly billing creates 52 cancellation opportunities per year vs 12 for monthly. Monthly is the industry standard and reduces admin complexity." },
      { question: "Should I offer a free plan?", answer: "Only for user acquisition. A 14-day free trial converts better than a permanent free tier. Free users consume support resources without generating revenue." },
      { question: "What if competitors charge less?", answer: "Compete on value, not price. If your tool saves 10 hours/month at $50/hour, charging $49 is a bargain even if a competitor charges $9. Differentiate on outcome, not cost." },
    ],
  },
  {
    slug: "churn-impact",
    title: "Churn Impact Calculator — What Is Churn Really Costing You?",
    metaTitle: "SaaS Churn Calculator: What Churn Costs | Invisible Exit",
    metaDescription:
      "See how monthly churn rate impacts your MRR over 12-24 months. Calculate the real cost of customer loss and find your break-even growth rate.",
    h1: "Churn Impact Calculator",
    intro:
      "Churn is the silent killer of recurring revenue. A 5% monthly churn rate means you lose 46% of your customers every year. This calculator shows exactly how churn impacts your revenue over time.",
    formula: "Ending MRR = Starting MRR x (1 + growth rate - churn rate)^months",
    inputs: [
      { label: "Starting monthly recurring revenue", id: "startingMrr", type: "number", default: "2000", min: 0, max: 100000, suffix: "/month" },
      { label: "Monthly churn rate (%)", id: "churnRate", type: "number", default: "5", min: 0, max: 30, suffix: "%" },
      { label: "New MRR added per month", id: "newMrr", type: "number", default: "500", min: 0, max: 50000, suffix: "/month" },
      { label: "Time period (months)", id: "months", type: "number", default: "12", min: 1, max: 36, suffix: "months" },
    ],
    resultLabel: "Projected MRR after",
    resultSuffix: "/month",
    example: {
      scenario: "$2,000 starting MRR, 5% monthly churn, adding $500 new MRR per month, over 12 months.",
      result: "Ending MRR: ~$4,200/month. Without churn, it would be $8,000. Churn cost you $3,800 in year one.",
    },
    explanation:
      "Churn compounds against you. At 5% monthly churn, you keep only 54% of customers after 12 months. Reducing churn from 5% to 3% can double your revenue over 2 years without acquiring a single new customer. Focus on retention before growth — it is the highest-ROI activity in SaaS.",
    relatedCalculators: ["freedom-number", "micro-saas-pricing"],
    faqs: [
      { question: "What is a good churn rate for micro-SaaS?", answer: "Under 3% monthly is good. Under 5% is acceptable. Above 5% means your product or onboarding has problems. Above 10% is critical — fix retention before growth." },
      { question: "How do I reduce churn?", answer: "Improve onboarding (first 7 days determine retention), fix top 3 support complaints, add annual billing (reduces cancel opportunities), and proactively contact at-risk customers before they cancel." },
      { question: "What is revenue churn vs customer churn?", answer: "Customer churn measures how many users leave. Revenue churn measures how much MRR you lose. If high-paying customers stay but low-paying ones leave, revenue churn can be lower than customer churn." },
    ],
  },
  {
    slug: "runway-calculator",
    title: "Runway Calculator — How Many Months Do You Have?",
    metaTitle: "Startup Runway Calculator | Invisible Exit",
    metaDescription:
      "Calculate your personal financial runway — how many months you can survive without income. Know your real number before making the jump.",
    h1: "Personal Runway Calculator",
    intro:
      "Your runway is how many months you can survive on savings without any income. The longer your runway, the more risks you can take. Most corporate managers have more runway than they think — but only if they calculate it honestly.",
    formula: "Total savings / monthly essential expenses = runway in months",
    inputs: [
      { label: "Total liquid savings", id: "savings", type: "number", default: "30000", min: 0, max: 1000000, suffix: "" },
      { label: "Monthly essential expenses", id: "burn", type: "number", default: "4000", min: 500, max: 20000, suffix: "/month" },
      { label: "Expected monthly business income", id: "bizIncome", type: "number", default: "0", min: 0, max: 50000, suffix: "/month" },
    ],
    resultLabel: "Months of runway",
    resultSuffix: "months",
    example: {
      scenario: "$30,000 in savings, $4,000/month expenses, $0 business income.",
      result: "7.5 months of runway. If the business generates $2,000/month, runway extends to 15 months.",
    },
    explanation:
      "Runway is your most important metric as a side-business founder. It determines how much time you have before you MUST return to a job. The goal is to extend runway by reducing expenses and increasing business income simultaneously. 12 months of runway gives you enough time to validate, launch, and reach early traction.",
    relatedCalculators: ["freedom-number", "micro-saas-pricing"],
    faqs: [
      { question: "How much runway do I need before quitting?", answer: "Minimum 12 months. Ideally 18-24 months. This gives you time to validate your idea, build a product, acquire customers, and reach ramen profitability without panic." },
      { question: "Does my side business income extend runway?", answer: "Yes. Every dollar of recurring revenue reduces your monthly burn. At $2,000/month MRR and $4,000/month expenses, your net burn is only $2,000/month, effectively doubling your runway." },
      { question: "Should I use savings to fund my side business?", answer: "Minimally. The beauty of micro-SaaS is low startup cost ($500-$5,000). Preserve savings for personal runway. Fund the business from your salary or early revenue." },
    ],
  },
  {
    slug: "equity-vs-saas",
    title: "Equity vs Micro-SaaS Calculator — Which Makes You Richer?",
    metaTitle: "Corporate Equity vs Building SaaS Calculator | Invisible Exit",
    metaDescription:
      "Compare the real financial outcome of waiting for your corporate equity vs building your own micro-SaaS. The math may surprise you.",
    h1: "Equity vs. Micro-SaaS Calculator",
    intro:
      "If you are waiting for a corporate equity event (IPO, acquisition, vesting), you are making a bet. This calculator compares the expected value of that bet against building your own micro-SaaS over the same time period.",
    formula: "Expected equity value = headline value x probability of exit x (1 - dilution) x (1 - tax)",
    inputs: [
      { label: "Your equity headline value", id: "equityValue", type: "number", default: "500000", min: 0, max: 10000000, suffix: "" },
      { label: "Probability of successful exit (%)", id: "exitProb", type: "number", default: "20", min: 1, max: 100, suffix: "%" },
      { label: "Years until potential exit", id: "yearsToExit", type: "number", default: "4", min: 1, max: 10, suffix: "years" },
      { label: "Micro-SaaS monthly growth (new customers/month)", id: "growth", type: "number", default: "5", min: 1, max: 50, suffix: "/month" },
    ],
    resultLabel: "Break-even comparison",
    resultSuffix: "",
    example: {
      scenario: "$500K equity, 20% exit probability, 4-year timeline vs 5 new customers/month at $29/month.",
      result: "Expected equity value: $100K (after probability). SaaS value at year 4: $62,000/year MRR + $200K+ asset value. SaaS wins in expected value.",
    },
    explanation:
      "Corporate equity has a headline value and a real expected value. A $500K grant with a 20% exit probability has an expected value of $100K — spread over 4+ years. Meanwhile, a micro-SaaS adding 5 customers/month at $29/month generates $62,000/year in MRR by year 4, plus the business itself is sellable for $150K-$250K. The micro-SaaS has higher expected value, monthly cash flow, and full control.",
    relatedCalculators: ["freedom-number", "runway-calculator"],
    faqs: [
      { question: "Does this mean I should ignore my equity?", answer: "No. Your equity is free upside. But do not let it be your only plan. Build your own asset simultaneously. If the equity pays out, you have two assets. If it does not, you still have one." },
      { question: "What probability should I use for my equity?", answer: "For pre-IPO startups: 15-25%. For late-stage companies with confirmed IPO plans: 40-60%. For early-stage startups: 5-10%. Be honest with yourself." },
    ],
  },
];
