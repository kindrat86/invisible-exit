/**
 * Auto-generated tax guides for all 50 states + DC.
 * Each entry follows the TaxGuide interface with state-specific tax data.
 */

export interface TaxGuide {
  slug: string;
  stateName: string;
  abbreviation: string;
  incomeTaxRate: string;
  selfEmploymentTaxNote: string;
  salesTaxNote: string;
  estimatedTaxBurden: { revenue: string; totalRate: string; estimatedTax: string }[];
  availableCredits: { name: string; description: string }[];
  deductions: string[];
  filingDeadlines: string;
  quarterlyPaymentInfo: string;
  faqs: { question: string; answer: string }[];
}

const STATE_DATA: Record<string, { name: string; abbr: string; incomeTax: string; salesTax: string; notes: string }> = {
  alabama: { name: "Alabama", abbr: "AL", incomeTax: "2–5%", salesTax: "4% (up to 11% with local)", notes: "Alabama allows federal AGI as starting point" },
  alaska: { name: "Alaska", abbr: "AK", incomeTax: "None", salesTax: "0–7% (local only)", notes: "No state income tax or sales tax" },
  arizona: { name: "Arizona", abbr: "AZ", incomeTax: "2.5% flat", salesTax: "5.6%", notes: "Flat rate simplifies filing" },
  arkansas: { name: "Arkansas", abbr: "AR", incomeTax: "2–4.9%", salesTax: "6.5%", notes: "Narrow brackets for low earners" },
  california: { name: "California", abbr: "CA", incomeTax: "1–13.3%", salesTax: "7.25%", notes: "Highest top rate; $800 annual LLC tax" },
  colorado: { name: "Colorado", abbr: "CO", incomeTax: "4.4% flat", salesTax: "2.9%", notes: "Flat income tax, moderate rates" },
  connecticut: { name: "Connecticut", abbr: "CT", incomeTax: "3–6.99%", salesTax: "6.35%", notes: "High sales tax, moderate income tax" },
  delaware: { name: "Delaware", abbr: "DE", incomeTax: "2.2–6.6%", salesTax: "None", notes: "No state-level sales tax" },
  "district-of-columbia": { name: "District of Columbia", abbr: "DC", incomeTax: "4–10.75%", salesTax: "6%", notes: "Treatment similar to a state" },
  florida: { name: "Florida", abbr: "FL", incomeTax: "None", salesTax: "6%", notes: "No personal income tax" },
  georgia: { name: "Georgia", abbr: "GA", incomeTax: "1–5.75%", salesTax: "4%", notes: "Relatively low brackets" },
  hawaii: { name: "Hawaii", abbr: "HI", incomeTax: "1.4–11%", salesTax: "4%", notes: "High top rate but narrow bands" },
  idaho: { name: "Idaho", abbr: "ID", incomeTax: "5.8% flat", salesTax: "6%", notes: "Flat rate since 2023" },
  illinois: { name: "Illinois", abbr: "IL", incomeTax: "4.95% flat", salesTax: "6.25%", notes: "Flat income tax, high sales tax" },
  indiana: { name: "Indiana", abbr: "IN", incomeTax: "3.15% flat", salesTax: "7%", notes: "Flat tax falling to 2.9% by 2027" },
  iowa: { name: "Iowa", abbr: "IA", incomeTax: "3.9–5.7%", salesTax: "6%", notes: "Moving to flat rate by 2026" },
  kansas: { name: "Kansas", abbr: "KS", incomeTax: "3.1–5.7%", salesTax: "6.5%", notes: "High sales tax" },
  kentucky: { name: "Kentucky", abbr: "KY", incomeTax: "4% flat", salesTax: "6%", notes: "Flat rate, reduced from 5% in 2023" },
  louisiana: { name: "Louisiana", abbr: "LA", incomeTax: "1.85–4.25%", salesTax: "4.45%", notes: "Low income tax rates" },
  maine: { name: "Maine", abbr: "ME", incomeTax: "5.8–7.15%", salesTax: "5.5%", notes: "Moderate rates" },
  maryland: { name: "Maryland", abbr: "MD", incomeTax: "2–5.75%", salesTax: "6%", notes: "County-level tax adds 1–3%" },
  massachusetts: { name: "Massachusetts", abbr: "MA", incomeTax: "5% flat", salesTax: "6.25%", notes: "Flat income tax" },
  michigan: { name: "Michigan", abbr: "MI", incomeTax: "4.25% flat", salesTax: "6%", notes: "Flat income tax" },
  minnesota: { name: "Minnesota", abbr: "MN", incomeTax: "5.35–9.85%", salesTax: "6.875%", notes: "High top rate" },
  mississippi: { name: "Mississippi", abbr: "MS", incomeTax: "4% flat (phasing down)", salesTax: "7%", notes: "Phasing out income tax entirely" },
  missouri: { name: "Missouri", abbr: "MO", incomeTax: "2–4.95%", salesTax: "4.225%", notes: "Low brackets" },
  montana: { name: "Montana", abbr: "MT", incomeTax: "1–5.9%", salesTax: "None", notes: "No sales tax" },
  nebraska: { name: "Nebraska", abbr: "NE", incomeTax: "2.46–5.84%", salesTax: "5.5%", notes: "Moderate rates" },
  nevada: { name: "Nevada", abbr: "NV", incomeTax: "None", salesTax: "6.85%", notes: "No income tax; commerce tax for $4M+ revenue" },
  "new-hampshire": { name: "New Hampshire", abbr: "NH", incomeTax: "None (interest/dividends only)", salesTax: "None", notes: "No broad income or sales tax" },
  "new-jersey": { name: "New Jersey", abbr: "NJ", incomeTax: "1.4–10.75%", salesTax: "6.625%", notes: "High top rate" },
  "new-mexico": { name: "New Mexico", abbr: "NM", incomeTax: "1.7–5.9%", salesTax: "5%", notes: "Moderate rates" },
  "new-york": { name: "New York", abbr: "NY", incomeTax: "4–10.9%", salesTax: "4%", notes: "NYC adds 3.876% for city residents" },
  "north-carolina": { name: "North Carolina", abbr: "NC", incomeTax: "4.5% flat", salesTax: "4.75%", notes: "Falling to 3.99% by 2026" },
  "north-dakota": { name: "North Dakota", abbr: "ND", incomeTax: "1.1–2.9%", salesTax: "5%", notes: "Very low rates" },
  ohio: { name: "Ohio", abbr: "OH", incomeTax: "2.75–3.5%", salesTax: "5.75%", notes: "Low rates, narrowing brackets" },
  oklahoma: { name: "Oklahoma", abbr: "OK", incomeTax: "0.25–4.75%", salesTax: "4.5%", notes: "Low starting rate" },
  oregon: { name: "Oregon", abbr: "OR", incomeTax: "4.75–9.9%", salesTax: "None", notes: "No sales tax; high income tax" },
  pennsylvania: { name: "Pennsylvania", abbr: "PA", incomeTax: "3.07% flat", salesTax: "6%", notes: "Low flat rate" },
  "rhode-island": { name: "Rhode Island", abbr: "RI", incomeTax: "3.75–5.99%", salesTax: "7%", notes: "Moderate rates" },
  "south-carolina": { name: "South Carolina", abbr: "SC", incomeTax: "3–6.4%", salesTax: "6%", notes: "Falling to 3.99% flat by 2026" },
  "south-dakota": { name: "South Dakota", abbr: "SD", incomeTax: "None", salesTax: "4.5%", notes: "No income tax" },
  tennessee: { name: "Tennessee", abbr: "TN", incomeTax: "None", salesTax: "7%", notes: "No income tax; high sales tax" },
  texas: { name: "Texas", abbr: "TX", incomeTax: "None", salesTax: "6.25%", notes: "No income tax; franchise tax for $1.23M+ revenue" },
  utah: { name: "Utah", abbr: "UT", incomeTax: "4.65% flat", salesTax: "6.1%", notes: "Flat rate" },
  vermont: { name: "Vermont", abbr: "VT", incomeTax: "3.35–8.75%", salesTax: "6%", notes: "Progressive rates" },
  virginia: { name: "Virginia", abbr: "VA", incomeTax: "2–5.75%", salesTax: "5.3%", notes: "Brackets are narrow" },
  washington: { name: "Washington", abbr: "WA", incomeTax: "None", salesTax: "6.5%", notes: "No income tax; 7% capital gains tax on $250K+" },
  "west-virginia": { name: "West Virginia", abbr: "WV", incomeTax: "2.36–5.12%", salesTax: "6%", notes: "Moderate rates" },
  wisconsin: { name: "Wisconsin", abbr: "WI", incomeTax: "3.5–7.65%", salesTax: "5%", notes: "Moderate rates" },
  wyoming: { name: "Wyoming", abbr: "WY", incomeTax: "None", salesTax: "4%", notes: "No income tax; low sales tax" },
};

const SE_TAX_NOTE = "Federal 15.3% self-employment tax applies to all net earnings from your side business ($142,800 wage base for Social Security portion, unlimited for Medicare).";

const BASE_CREDITS = [
  { name: "Qualified Business Income (QBI) Deduction", description: "Federal deduction of up to 20% of qualified business income for pass-through entities (LLC, sole proprietorship). Phaseout starts at $191,950 (single) / $383,900 (joint, 2025)." },
  { name: "Home Office Deduction", description: "Deduct $5/sq ft (up to 300 sq ft, max $1,500) or actual expenses. Available if you use part of your home exclusively and regularly for business." },
  { name: "Equipment Deduction (Section 179)", description: "Deduct up to $1.22M (2025) in business equipment purchases in the year placed in service, rather than depreciating over time." },
  { name: "Startup Cost Deduction", description: "Deduct up to $5,000 in startup costs (legal, marketing, research) in your first year of active business." },
  { name: "Health Insurance Premiums", description: "Self-employed individuals can deduct 100% of health insurance premiums for themselves and dependents, above-the-line (no itemizing needed)." },
  { name: "Retirement Plans (SEP IRA)", description: "Contribute up to 25% of net earnings (max $70,000 for 2025) to a SEP IRA. Contributions are tax-deductible and grow tax-deferred." },
  { name: "Internet & Phone", description: "Deduct a percentage of your internet and phone bills based on business usage. If you have a dedicated business line, it's 100% deductible." },
  { name: "Vehicle Mileage", description: "Deduct 70¢/mile (2025 IRS rate) for business driving. Keep a mileage log. Standard mileage rate includes gas, maintenance, depreciation." },
];

const BASE_DEDUCTIONS = [
  "One-half of self-employment tax (deducted above the line)",
  "Business insurance premiums (liability, professional, cyber)",
  "Software subscriptions (tools, SaaS, cloud services)",
  "Professional fees (accountant, bookkeeper, attorney)",
  "Education and training (courses, conferences, books)",
  "Office supplies and small equipment",
  "Marketing and advertising expenses",
  "Travel and meals (80% deductible for business meals)",
  "Interest on business loans or credit cards",
  "Bank fees and merchant processing fees",
];

const QBI = "Make estimated quarterly tax payments using IRS Form 1040-ES (federal) and your state equivalent. Penalties apply if you owe more than $1,000 at filing time. Pay by April 15, June 15, Sept 15, Jan 15.";

function makeFAQs(stateName: string): { question: string; answer: string }[] {
  return [
    { question: `Do I need to pay estimated quarterly taxes in ${stateName}?`, answer: `Yes, if you expect to owe more than $1,000 in federal tax on your side business income. ${stateName} also requires quarterly payments if your state tax liability exceeds certain thresholds. The QBI deduction reduces your taxable income, so calculate estimated taxes on after-deduction profit.` },
    { question: `How does self-employment tax work for a side business in ${stateName}?`, answer: `Self-employment tax (15.3%) is federal — it's the same in every state. However, half of it is deductible on both federal and ${stateName} returns. If ${stateName} has no income tax (like TX, FL, NV), you only pay federal SE tax plus any state sales tax obligations.` },
    { question: `Can I deduct my home office in ${stateName}?`, answer: `Yes, the home office deduction is federal and follows IRS rules in ${stateName}. You can use the simplified method ($5/sq ft, max $1,500) or actual expenses. ${stateName} generally follows federal rules but may have different forms — check ${stateName} Department of Revenue instructions.` },
    { question: `What sales tax obligations does a side business have in ${stateName}?`, answer: `${stateName} requires sales tax collection if you sell physical products or certain digital services to customers within the state. You likely need a sales tax permit. Sales tax rates vary by locality and product type.` },
    { question: `What happens if I don't report side business income in ${stateName}?`, answer: `Failure to report can trigger audits, penalties, and interest. Most states share information with the IRS. If your side business is structured as an LLC, the state may require annual reports and franchise tax payments regardless of profitability.` },
  ];
}

function makeBurden(rate: string): { revenue: string; totalRate: string; estimatedTax: string }[] {
  const isZero = rate.toLowerCase().includes("none");
  if (isZero) {
    return [
      { revenue: "$10,000", totalRate: "15.3%", estimatedTax: "$1,530" },
      { revenue: "$30,000", totalRate: "15.3%", estimatedTax: "$4,590" },
      { revenue: "$50,000", totalRate: "15.3%", estimatedTax: "$7,650" },
      { revenue: "$100,000", totalRate: "15.3%", estimatedTax: "$15,300" },
    ];
  }
  // Extract approximate rate
  const match = rate.match(/([\d.]+)/g);
  const topRate = match ? parseFloat(match[match.length - 1]) : 5;
  return [
    { revenue: "$10,000", totalRate: `${(15.3 + topRate / 2).toFixed(1)}%`, estimatedTax: `$${Math.round(10000 * (0.153 + topRate / 200))}` },
    { revenue: "$30,000", totalRate: `${(15.3 + topRate / 2).toFixed(1)}%`, estimatedTax: `$${Math.round(30000 * (0.153 + topRate / 200))}` },
    { revenue: "$50,000", totalRate: `${(15.3 + topRate / 2).toFixed(1)}%`, estimatedTax: `$${Math.round(50000 * (0.153 + topRate / 200))}` },
    { revenue: "$100,000", totalRate: `${(15.3 + topRate / 2).toFixed(1)}%`, estimatedTax: `$${Math.round(100000 * (0.153 + topRate / 200))}` },
  ];
}

function getTaxFilingDeadlines(stateName: string, abbr: string): string {
  return `Federal: April 15, 2026. ${stateName} (${abbr}): Same date as federal (most states) or March 15 if fiscal year-end. Extensions to Oct 15 available.`;
}

export const taxGuides: TaxGuide[] = Object.entries(STATE_DATA).map(([slug, data]) => ({
  slug,
  stateName: data.name,
  abbreviation: data.abbr,
  incomeTaxRate: data.incomeTax,
  selfEmploymentTaxNote: `${SE_TAX_NOTE} ${data.name}: ${data.notes}.`,
  salesTaxNote: `State rate ${data.salesTax}. ${data.salesTax === "None" ? "No state-level sales tax." : "Local jurisdictions may add additional sales tax."}`,
  estimatedTaxBurden: makeBurden(data.incomeTax),
  availableCredits: [
    ...BASE_CREDITS,
    { name: `${data.name} Small Business Credit`, description: `${data.name} offers various tax credits for small businesses. Check ${data.abbr} Department of Revenue for current offerings specific to your industry and revenue level.` },
  ],
  deductions: BASE_DEDUCTIONS,
  filingDeadlines: getTaxFilingDeadlines(data.name, data.abbr),
  quarterlyPaymentInfo: `Federal: ${QBI} ${data.name} (${data.abbr}): File quarterly state estimates using the state's equivalent of Form 1040-ES. Payment thresholds and due dates generally mirror federal.`,
  faqs: makeFAQs(data.name),
}));
