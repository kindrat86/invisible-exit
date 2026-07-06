/** Auto-generated insurance guides for all 50 states + DC. */

export interface InsuranceGuide {
  slug: string;
  stateName: string;
  abbreviation: string;
  generalLiabilityRequired: boolean;
  workersCompRequired: boolean;
  recommendedPolicies: { name: string; description: string; typicalCost: string; bestFor: string }[];
  stateSpecificRules: string;
  costEstimates: { revenueLevel: string; monthlyPremiumEstimate: string; notes: string }[];
  faqs: { question: string; answer: string }[];
}

const stateInfo: Record<string, { name: string; abbr: string }> = {
  alabama: { name: "Alabama", abbr: "AL" },
  alaska: { name: "Alaska", abbr: "AK" },
  arizona: { name: "Arizona", abbr: "AZ" },
  arkansas: { name: "Arkansas", abbr: "AR" },
  california: { name: "California", abbr: "CA" },
  colorado: { name: "Colorado", abbr: "CO" },
  connecticut: { name: "Connecticut", abbr: "CT" },
  delaware: { name: "Delaware", abbr: "DE" },
  "district-of-columbia": { name: "District of Columbia", abbr: "DC" },
  florida: { name: "Florida", abbr: "FL" },
  georgia: { name: "Georgia", abbr: "GA" },
  hawaii: { name: "Hawaii", abbr: "HI" },
  idaho: { name: "Idaho", abbr: "ID" },
  illinois: { name: "Illinois", abbr: "IL" },
  indiana: { name: "Indiana", abbr: "IN" },
  iowa: { name: "Iowa", abbr: "IA" },
  kansas: { name: "Kansas", abbr: "KS" },
  kentucky: { name: "Kentucky", abbr: "KY" },
  louisiana: { name: "Louisiana", abbr: "LA" },
  maine: { name: "Maine", abbr: "ME" },
  maryland: { name: "Maryland", abbr: "MD" },
  massachusetts: { name: "Massachusetts", abbr: "MA" },
  michigan: { name: "Michigan", abbr: "MI" },
  minnesota: { name: "Minnesota", abbr: "MN" },
  mississippi: { name: "Mississippi", abbr: "MS" },
  missouri: { name: "Missouri", abbr: "MO" },
  montana: { name: "Montana", abbr: "MT" },
  nebraska: { name: "Nebraska", abbr: "NE" },
  nevada: { name: "Nevada", abbr: "NV" },
  "new-hampshire": { name: "New Hampshire", abbr: "NH" },
  "new-jersey": { name: "New Jersey", abbr: "NJ" },
  "new-mexico": { name: "New Mexico", abbr: "NM" },
  "new-york": { name: "New York", abbr: "NY" },
  "north-carolina": { name: "North Carolina", abbr: "NC" },
  "north-dakota": { name: "North Dakota", abbr: "ND" },
  ohio: { name: "Ohio", abbr: "OH" },
  oklahoma: { name: "Oklahoma", abbr: "OK" },
  oregon: { name: "Oregon", abbr: "OR" },
  pennsylvania: { name: "Pennsylvania", abbr: "PA" },
  "rhode-island": { name: "Rhode Island", abbr: "RI" },
  "south-carolina": { name: "South Carolina", abbr: "SC" },
  "south-dakota": { name: "South Dakota", abbr: "SD" },
  tennessee: { name: "Tennessee", abbr: "TN" },
  texas: { name: "Texas", abbr: "TX" },
  utah: { name: "Utah", abbr: "UT" },
  vermont: { name: "Vermont", abbr: "VT" },
  virginia: { name: "Virginia", abbr: "VA" },
  washington: { name: "Washington", abbr: "WA" },
  "west-virginia": { name: "West Virginia", abbr: "WV" },
  wisconsin: { name: "Wisconsin", abbr: "WI" },
  wyoming: { name: "Wyoming", abbr: "WY" },
};

// States requiring workers' comp even for 1 employee
const wcStrictStates = new Set(["CA", "NY", "DC", "MO", "NJ", "IL", "OH", "HI", "WA", "OR", "CO", "AK", "KY"]);

// States requiring workers' comp at 3+ employees
const wcThreePlus = new Set(["AL", "AR", "GA", "ID", "KS", "LA", "MD", "MI", "MN", "MS", "MT", "NC", "ND", "NE", "NM", "OK", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WI", "WV", "WY"]);

function makeFaq(q: string, a: string) {
  return { question: q, answer: a };
}

function getPolicies(slug: string, regionPremium: number) {
  const basePolicies = [
    {
      name: "General Liability Insurance",
      description: "Covers third-party bodily injury, property damage, and advertising injury claims against your business.",
      typicalCost: `$${regionPremium - 10}–$${regionPremium + 15}/mo`,
      bestFor: "Every business — required by most commercial leases and client contracts",
    },
    {
      name: "Professional Liability (E&O)",
      description: "Covers errors, omissions, and negligence claims if your product or advice causes client financial loss.",
      typicalCost: `$${regionPremium + 20}–$${regionPremium + 60}/mo`,
      bestFor: "Consultants, SaaS builders, freelancers, and any business selling advice or services",
    },
    {
      name: "Business Owner's Policy (BOP)",
      description: "Bundles general liability + commercial property insurance at a discount. Also covers business interruption.",
      typicalCost: `$${regionPremium + 35}–$${regionPremium + 80}/mo`,
      bestFor: "Businesses with physical assets or a home office with dedicated equipment",
    },
    {
      name: "Cyber Liability Insurance",
      description: "Covers data breach response, customer notification, legal defense, and regulatory fines.",
      typicalCost: `$${regionPremium + 40}–$${regionPremium + 120}/mo`,
      bestFor: "SaaS businesses, any company storing customer data, or businesses with payment processing",
    },
  ];
  return basePolicies;
}

function getCostEstimates(slug: string, multiplier: number) {
  return [
    { revenueLevel: "Pre-revenue / $0–$10K/year", monthlyPremiumEstimate: `$${Math.round(25 * multiplier)}–$${Math.round(60 * multiplier)}`, notes: "General liability only. Basic LLM-based tools." },
    { revenueLevel: "$10K–$50K/year", monthlyPremiumEstimate: `$${Math.round(60 * multiplier)}–$${Math.round(150 * multiplier)}`, notes: "Add professional liability (E&O) as clients require it." },
    { revenueLevel: "$50K–$100K/year", monthlyPremiumEstimate: `$${Math.round(120 * multiplier)}–$${Math.round(250 * multiplier)}`, notes: "BOP recommended. Cyber insurance if handling customer data." },
    { revenueLevel: "$100K+/year", monthlyPremiumEstimate: `$${Math.round(200 * multiplier)}–$${Math.round(450 * multiplier)}`, notes: "Full stack: GL + E&O + cyber + umbrella. Consider an insurance broker." },
  ];
}

function getRules(s: { name: string; abbr: string }) {
  if (s.abbr === "CA") {
    return `California requires workers' compensation insurance even if you have zero employees (sole proprietors with no staff are exempt). The state also has strict general liability requirements for contractors. CA's minimum liability limits are among the highest in the US. Premiums in CA are approximately 25% above the national average due to litigation risk.`;
  }
  if (s.abbr === "NY") {
    return `New York requires workers' compensation for all employers with even one employee. Failure to carry WC is a felony. General liability is not state-mandated for LLCs, but most NYC commercial leases require $1M–$2M in coverage. NY has a state-run insurance fund for high-risk businesses.`;
  }
  if (s.abbr === "TX") {
    return `Texas is the only state where workers' compensation is entirely voluntary for private employers. However, going without WC means you lose the exclusive-remedy defense — employees can sue you for negligence. General liability is not required by the state but is strongly recommended for client contracts.`;
  }
  if (s.abbr === "WA") {
    return `Washington has a state-run workers' compensation system (L&I) — private WC insurance is not available. Almost all employers must participate, including sole proprietors who can opt out. General liability rates in WA are average. The state has specific requirements for gig economy and independent contractor insurance.`;
  }
  if (s.abbr === "FL") {
    return `Florida requires workers' compensation for construction businesses with 1+ employees and non-construction with 4+ employees. General liability is not state-mandated for LLCs, but Florida's property insurance market is volatile — expect higher premiums for any business with physical assets.`;
  }
  const wcNote = wcStrictStates.has(s.abbr)
    ? `${s.name} requires workers' compensation insurance from your very first employee (including part-time).`
    : wcThreePlus.has(s.abbr)
    ? `${s.name} requires workers' compensation once you have 3+ employees (or 1+ in construction).`
    : `${s.name} has relatively moderate workers' compensation requirements. Check the state labor board for specific thresholds based on your industry.`;
  return `${wcNote} General liability insurance is not state-mandated for LLCs in ${s.name}, but most commercial contracts and client agreements will require it. ${s.name} follows standard common law for liability and torts. Premiums in ${s.name} are roughly at the national average.`;
}

const stateKeys = Object.keys(stateInfo);
const premiumMap: Record<string, number> = {
  california: 65, "new-york": 70, "new-jersey": 60, massachusetts: 55,
  connecticut: 55, "rhode-island": 50, hawaii: 50, alaska: 55,
  florida: 50, louisiana: 50, texas: 45, illinois: 50,
  "district-of-columbia": 60, maryland: 50, virginia: 45, washington: 45,
  oregon: 45, colorado: 45, arizona: 42, nevada: 42,
  utah: 40, "north-carolina": 40, georgia: 40, tennessee: 38,
  "south-carolina": 38, alabama: 38, mississippi: 35, arkansas: 35,
  oklahoma: 38, kentucky: 38, missouri: 38, kansas: 35,
  nebraska: 35, iowa: 35, minnesota: 42, wisconsin: 40,
  michigan: 42, ohio: 40, indiana: 38, "west-virginia": 38,
  vermont: 40, "new-hampshire": 40, maine: 42, delaware: 45,
  pennsylvania: 45, "north-dakota": 35, "south-dakota": 35, montana: 38,
  idaho: 38, wyoming: 35,
};

const insuranceGuides: InsuranceGuide[] = stateKeys.map((slug) => {
  const s = stateInfo[slug];
  const basePremium = premiumMap[slug] || 40;
  const isWcStrict = wcStrictStates.has(s.abbr);
  const isWcThreePlus = wcThreePlus.has(s.abbr);
  const multiplier = basePremium / 40;

  return {
    slug,
    stateName: s.name,
    abbreviation: s.abbr,
    generalLiabilityRequired: false,
    workersCompRequired: isWcStrict || !isWcThreePlus,
    recommendedPolicies: getPolicies(slug, basePremium),
    stateSpecificRules: getRules(s),
    costEstimates: getCostEstimates(slug, multiplier),
    faqs: [
      makeFaq(`Do I need general liability insurance for my LLC in ${s.name}?`, `No — ${s.name} does not require general liability insurance to form or operate an LLC. However, almost every commercial lease, business bank account application, and client contract will require it. The $30-$50/month cost is worth it for the peace of mind.`),
      makeFaq(`When do I need workers' compensation insurance in ${s.name}?`, isWcStrict ? `Immediately if you have any employees at all. ${s.name} requires workers' comp from your very first hire, including part-time employees. Sole proprietors with no employees are typically exempt.` : isWcThreePlus ? `In ${s.name}, you need workers' compensation insurance once you have 3 or more employees (or 1+ in construction). If you're a solo founder with no employees, you're not required to carry it yet.` : `Check ${s.name}'s specific threshold — most states require it at 3-5 employees. As a solo founder, you typically don't need it until you hire staff.`),
      makeFaq(`Can I use a PEO to get cheaper insurance in ${s.name}?`, `Yes. Professional Employer Organizations (PEOs) like Gusto, BambooHR, or TriNet pool your employees with other small businesses, often getting better rates on workers' comp and health insurance. For solo SaaS founders in ${s.name}, this is rarely the cheapest option — stick with an independent insurance broker.`),
      makeFaq(`What's the minimum insurance I need as a solo SaaS founder in ${s.name}?`, `General liability ($1M per occurrence) and professional liability/errors & omissions ($1M per claim). If you store any customer data, add cyber liability. Total cost in ${s.name}: roughly $${Math.round(60 * multiplier)}-$${Math.round(120 * multiplier)}/month for all three.`),
    ],
  };
});

export { insuranceGuides };
