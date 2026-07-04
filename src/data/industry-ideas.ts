/**
 * Industry-specific micro-SaaS ideas for /ideas/:profession pages.
 * PLACEHOLDER — will be replaced by full data.
 */

export interface IndustryIdea {
  slug: string;
  profession: string;
  icon: string;
  unfairAdvantage: string;
  avgSalary: string;
  transferableSkills: string[];
  ideas: {
    name: string;
    description: string;
    targetCustomer: string;
    pricing: string;
    difficulty: "Low" | "Medium" | "High";
    revenuePotential: string;
  }[];
  toolsTheyAlreadyKnow: string[];
  whatToAvoid: string;
  faqs: { question: string; answer: string }[];
}

export const industryIdeas: IndustryIdea[] = [
  {
    slug: "for-accountants",
    profession: "Accountants",
    icon: "📊",
    unfairAdvantage: "Accountants understand compliance, billing cycles, and financial workflows — the exact pain points businesses pay to solve.",
    avgSalary: "$70K-$120K",
    transferableSkills: ["Financial modeling", "Compliance", "Reconciliation", "Tax preparation", "Spreadsheet automation", "Client communication"],
    ideas: [
      { name: "Automated Invoice Reconciliation Tool", description: "AI-powered tool that matches bank transactions to invoices automatically, saving accounting firms 10+ hours per week.", targetCustomer: "Small accounting firms (2-10 people)", pricing: "$49/month", difficulty: "Medium", revenuePotential: "$3K-$8K/month" },
      { name: "Tax Deadline Tracker for Clients", description: "A dashboard that tracks all client tax deadlines and sends automated reminders to both accountant and client.", targetCustomer: "CPA firms with 20+ clients", pricing: "$29/month", difficulty: "Low", revenuePotential: "$2K-$5K/month" },
      { name: "Bookkeeping Error Detector", description: "AI that scans QuickBooks/Xero data for common categorization errors before they become audit problems.", targetCustomer: "Bookkeeping services", pricing: "$39/month", difficulty: "Medium", revenuePotential: "$4K-$10K/month" },
      { name: "1099 Contractor Compliance Monitor", description: "Tracks contractor payment thresholds and auto-generates 1099 forms when thresholds are crossed.", targetCustomer: "Businesses with 5+ contractors", pricing: "$19/month", difficulty: "Low", revenuePotential: "$2K-$6K/month" },
      { name: "Cash Flow Forecasting Dashboard", description: "Predictive cash flow tool that uses historical data to project 90-day cash positions for small businesses.", targetCustomer: "Small businesses ($1M-$10M revenue)", pricing: "$59/month", difficulty: "High", revenuePotential: "$5K-$12K/month" },
    ],
    toolsTheyAlreadyKnow: ["QuickBooks", "Xero", "Excel/Google Sheets", "TurboTax", "Stripe", "Bloomberg Terminal"],
    whatToAvoid: "Do not build tools that compete directly with your accounting firm's services or use client data from your employer. Focus on serving a different segment (e.g., small businesses if your firm serves enterprises).",
    faqs: [
      { question: "Can I build a SaaS while working at an accounting firm?", answer: "Yes, if you avoid serving the same client segment and do not use firm resources. Build tools for small businesses or solo entrepreneurs, not enterprise clients your firm serves." },
      { question: "What is the best micro-SaaS for accountants?", answer: "Automation tools that save time on repetitive tasks: invoice reconciliation, deadline tracking, and error detection. These solve painful, expensive problems that firms gladly pay $29-$59/month to solve." },
    ],
  },
];
