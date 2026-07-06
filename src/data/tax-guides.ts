// Tax Guides: state-by-state tax info for side hustlers and small business owners
// 50 US states + DC = 51 entries

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

export const taxGuides: TaxGuide[] = [
  {
    slug: "alabama",
    stateName: "Alabama",
    abbreviation: "AL",
    incomeTaxRate: "2–5%",
    selfEmploymentTaxNote: "Federal 15.3% SE tax applies to all net earnings. Alabama allows a deduction for half of SE tax on the state return.",
    salesTaxNote: "State rate 4%, local rates up to 7% — combined can exceed 11% in some cities.",
    estimatedTaxBurden: [
      { revenue: "$10,000", totalRate: "17.3%", estimatedTax: "$1,730" },
      { revenue: "$30,000", totalRate: "18.5%", estimatedTax: "$5,550" },
      { revenue: "$50,000", totalRate: "19.2%", estimatedTax: "$9,600" },
      { revenue: "$100,000", totalRate: "20.1%", estimatedTax: "$20,100" }
    ],
    availableCredits: [
      { name: "Small Business Health Insurance Credit", description: "Up to 50% of premiums paid for employee health plans." },
      { name: "Alabama New Markets Development Credit", description: "For businesses investing in low-income communities." },
      { name: "Enterprise Zone Credit", description: "Job creation credit for businesses in designated zones." }
    ],
    deductions: ["Federal self-employment tax deduction (50%)", "Home office deduction (Form 40, Schedule A)", "Health insurance premiums for self-employed", "Business use of vehicle (standard or actual mileage)"],
    filingDeadlines: "Individual: April 15 (Form 40). Corporate: March 15 (Form 20C). Extensions available.",
    quarterlyPaymentInfo: "Due April 15, June 15, Sept 15, Jan 15. Use Form 2210V for estimated tax payments. Penalty for underpayment applies if total due exceeds $500.",
    faqs: [
      { question: "Does Alabama tax retirement income? answer: Yes, but with an age-based exemption ($12K for 65+, $20K for 85+)." },
      { question: "Are Alabama quarterly estimated taxes required for side hustlers? answer: Yes if you expect to owe more than $500 after withholding." }
    ]
  },
  {
    slug: "alaska",
    stateName: "Alaska",
    abbreviation: "AK",
    incomeTaxRate: "None (no state income tax)",
    selfEmploymentTaxNote: "Federal 15.3% SE tax applies. No state-level income tax means no state deduction for SE tax.",
    salesTaxNote: "No state sales tax. Local municipalities may levy up to 7% sales tax — check your borough.",
    estimatedTaxBurden: [
      { revenue: "$10,000", totalRate: "15.3%", estimatedTax: "$1,530" },
      { revenue: "$30,000", totalRate: "15.3%", estimatedTax: "$4,590" },
      { revenue: "$50,000", totalRate: "15.3%", estimatedTax: "$7,650" },
      { revenue: "$100,000", totalRate: "15.3%", estimatedTax: "$15,300" }
    ],
    availableCredits: [
      { name: "Alaska Fisheries Business Credit", description: "Credit for businesses in commercial fishing and processing." },
      { name: "Alaska Oil & Gas Tax Credit", description: "Available only to qualified oil and gas producers." },
      { name: "Rural Business Development Credit", description: "For businesses operating in rural or remote communities." }
    ],
    deductions: ["Federal SE tax deduction (50%)", "Business mileage deduction", "Home office deduction", "Business equipment Section 179 deduction"],
    filingDeadlines: "No individual income tax return. Corporate filers use April 15. Annual report due Jan 2 every two years.",
    quarterlyPaymentInfo: "Not applicable for state income tax — no state income tax. Federal estimated tax payments still required via Form 1040-ES.",
    faqs: [
      { question: "Does Alaska really have no income tax? answer: Correct — no state income tax on wages, business income, or investments." },
      { question: "Do I need to file anything with Alaska for my side hustle? answer: No state income tax return, but you may need to file for business licenses locally." }
    ]
  },
  {
    slug: "arizona",
    stateName: "Arizona",
    abbreviation: "AZ",
    incomeTaxRate: "2.5–2.98%",
    selfEmploymentTaxNote: "Federal 15.3% SE tax applies. Arizona conforms to federal treatment of SE tax.",
    salesTaxNote: "State rate 5.6%, plus local transaction privilege tax (TPT) — combined up to 10.5%.",
    estimatedTaxBurden: [
      { revenue: "$10,000", totalRate: "17.8%", estimatedTax: "$1,780" },
      { revenue: "$30,000", totalRate: "18.0%", estimatedTax: "$5,400" },
      { revenue: "$50,000", totalRate: "18.1%", estimatedTax: "$9,050" },
      { revenue: "$100,000", totalRate: "18.3%", estimatedTax: "$18,300" }
    ],
    availableCredits: [
      { name: "Arizona Small Business Tax Credit", description: "Credit for businesses with 20 or fewer employees investing in technology." },
      { name: "Renewable Energy Tax Credit", description: "For businesses installing solar or renewable energy systems." },
      { name: "Angel Investment Credit", description: "For investors funding qualified small businesses in Arizona." }
    ],
    deductions: ["Federal SE tax deduction (50%)", "Arizona standard deduction ($12,550 single)", "Home office deduction for state", "Business personal property deduction"],
    filingDeadlines: "Individual: April 15 (Form 140, 140EZ). Corporate: April 15. Extensions granted to October 15.",
    quarterlyPaymentInfo: "Estimated payments due April 15, June 15, Sept 15, Jan 15. Use Form 140-ES. Underpayment penalty applies if payments fall short by $1,000+.",
    faqs: [
      { question: "Is Arizona's income tax rate changing? answer: Arizona has a flat rate that drops to 2.5% as revenues meet triggers." },
      { question: "Do I need to register for TPT as a side hustler? answer: Yes if you sell goods — services may be exempt depending on the type." }
    ]
  },
  {
    slug: "arkansas",
    stateName: "Arkansas",
    abbreviation: "AR",
    incomeTaxRate: "0.9–3.9%",
    selfEmploymentTaxNote: "Federal 15.3% SE tax applies. Arkansas allows the federal SE tax deduction on state returns.",
    salesTaxNote: "State rate 6.5%, local rates up to 5.125% — combined can reach 11.625%.",
    estimatedTaxBurden: [
      { revenue: "$10,000", totalRate: "16.2%", estimatedTax: "$1,620" },
      { revenue: "$30,000", totalRate: "17.5%", estimatedTax: "$5,250" },
      { revenue: "$50,000", totalRate: "18.0%", estimatedTax: "$9,000" },
      { revenue: "$100,000", totalRate: "18.5%", estimatedTax: "$18,500" }
    ],
    availableCredits: [
      { name: "Arkansas Small Business and Workforce Development Credit", description: "For businesses creating new jobs in Arkansas." },
      { name: "Arkansas Invest in Tech Credit", description: "Credit for software development and tech innovation." },
      { name: "Enterprise Zone Credit", description: "For businesses in distressed communities creating jobs." }
    ],
    deductions: ["Federal SE tax deduction (50%)", "Standard mileage deduction", "Home office deduction", "Start-up cost deduction (up to $5,000)"],
    filingDeadlines: "Individual: April 15 (Form AR1000F/AR1000S). Corporate: March 15. Extension to October 15.",
    quarterlyPaymentInfo: "Due April 15, June 15, Sept 15, Jan 15. Use Form AR1100ES. Threshold for underpayment penalty: $1,000.",
    faqs: [
      { question: "What is Arkansas's current top income tax rate? answer: The top rate is 3.9%, down from higher rates due to recent tax reform." },
      { question: "Do I need to collect sales tax on digital services? answer: Yes, Arkansas taxes digital products and services." }
    ]
  },
  {
    slug: "california",
    stateName: "California",
    abbreviation: "CA",
    incomeTaxRate: "1–13.3%",
    selfEmploymentTaxNote: "Federal 15.3% SE tax applies. CA does not conform fully — no deduction for SE tax at the state level.",
    salesTaxNote: "State rate 7.25%, local rates push combined to 10.25%+ in many areas.",
    estimatedTaxBurden: [
      { revenue: "$10,000", totalRate: "16.3%", estimatedTax: "$1,630" },
      { revenue: "$30,000", totalRate: "22.5%", estimatedTax: "$6,750" },
      { revenue: "$50,000", totalRate: "25.1%", estimatedTax: "$12,550" },
      { revenue: "$100,000", totalRate: "28.6%", estimatedTax: "$28,600" }
    ],
    availableCredits: [
      { name: "California Competes Tax Credit", description: "Negotiated credit for businesses creating jobs in CA." },
      { name: "Small Business Hiring Credit", description: "Credit for hiring qualified employees (up to $1,000 per hire)." },
      { name: "Research & Development Credit", description: "Up to 15% for qualified R&D activities conducted in CA." },
      { name: "California New Employment Credit", description: "For hiring long-term unemployed workers in designated areas." }
    ],
    deductions: ["Home office deduction (CA-540)", "Business expense deduction", "Health insurance premiums (self-employed)", "CA Keogh/SEP-IRA deduction"],
    filingDeadlines: "Individual: April 15 (Form 540). LLC: $800 franchise tax due regardless of income, due April 15. Extension to October 15.",
    quarterlyPaymentInfo: "Due April 15, June 15, Sept 15, Jan 15. Use Form 540-ES. Underpayment penalty triggers if you miss by $500+. CA is aggressive on penalties — pay on time.",
    faqs: [
      { question: "What is California's LLC franchise tax? answer: $800 per year minimum even if your LLC has no income." },
      { question: "Can I deduct my home office in California? answer: Yes, but CA has stricter rules — the space must be used exclusively and regularly for business." }
    ]
  },
  {
    slug: "colorado",
    stateName: "Colorado",
    abbreviation: "CO",
    incomeTaxRate: "4.4–4.55%",
    selfEmploymentTaxNote: "Federal 15.3% SE tax applies. Colorado follows federal income tax treatment for SE deduction.",
    salesTaxCode: "State rate 2.9%, local rates vary widely — combined up to 8.5% in some cities.",
    salesTaxNote: "State rate 2.9%, local rates vary widely — combined up to 8.5% in some cities.",
    estimatedTaxBurden: [
      { revenue: "$10,000", totalRate: "19.7%", estimatedTax: "$1,970" },
      { revenue: "$30,000", totalRate: "19.8%", estimatedTax: "$5,940" },
      { revenue: "$50,000", totalRate: "19.9%", estimatedTax: "$9,950" },
      { revenue: "$100,000", totalRate: "19.9%", estimatedTax: "$19,900" }
    ],
    availableCredits: [
      { name: "Colorado Job Growth Incentive Tax Credit", description: "For businesses creating net new jobs in Colorado." },
      { name: "Colorado Innovation Tax Credit", description: "For R&D and tech innovation activities." },
      { name: "Enterprise Zone Credits", description: "Several credits for businesses in designated enterprise zones." }
    ],
    deductions: ["Federal SE tax deduction (50%)", "Home office deduction", "Business mileage (Colorado follows federal standard)", "Health insurance premiums for self-employed"],
    filingDeadlines: "Individual: April 15 (Form DR 0104). Corporate: April 15. Extension to October 15 with payment.",
    quarterlyPaymentInfo: "Due April 15, June 15, Sept 15, Jan 15. Use Form DR 0104ES. Threshold for underpayment: $5,000 for individuals.",
    faqs: [
      { question: "What is Colorado's flat income tax rate? answer: 4.4% as of 2025, with a slight drop to 4.4% from 4.55% under TABOR." },
      { question: "Do I need to collect Colorado sales tax for my online side hustle? answer: Yes if you have nexus (physical presence or significant economic activity)." }
    ]
  },
  {
    slug: "connecticut",
    stateName: "Connecticut",
    abbreviation: "CT",
    incomeTaxRate: "3–6.99%",
    selfEmploymentTaxNote: "Federal 15.3% SE tax applies. CT allows the SE tax deduction for state purposes.",
    salesTaxNote: "State rate 6.35%. No local sales taxes. Certain goods (clothing under $250) exempt.",
    estimatedTaxBurden: [
      { revenue: "$10,000", totalRate: "18.3%", estimatedTax: "$1,830" },
      { revenue: "$30,000", totalRate: "19.5%", estimatedTax: "$5,850" },
      { revenue: "$50,000", totalRate: "20.8%", estimatedTax: "$10,400" },
      { revenue: "$100,000", totalRate: "22.3%", estimatedTax: "$22,300" }
    ],
    availableCredits: [
      { name: "Connecticut Small Business Job Creation Credit", description: "For businesses creating new positions in CT." },
      { name: "Digital Animation Tax Credit", description: "For digital media production businesses." },
      { name: "Urban and Industrial Sites Credit", description: "For redeveloping contaminated or urban sites." }
    ],
    deductions: ["Federal SE tax deduction (50%)", "Home office deduction", "Connecticut pension/IRA deduction", "Business equipment (Section 179 deduction at state level)"],
    filingDeadlines: "Individual: April 15 (Form CT-1040). Corporate: April 15. Extension to October 15.",
    quarterlyPaymentInfo: "Due April 15, June 15, Sept 15, Jan 15. Use Form CT-1040ES. Penalty if underpayment exceeds $1,000.",
    faqs: [
      { question: "Does Connecticut tax retirement income? answer: CT fully exempts pension and annuity income up to $60K (married) / $35K (single)." },
      { question: "Are side hustle earnings taxed the same as wages in CT? answer: Yes — business income is taxed at ordinary income rates on the CT-1040." }
    ]
  },
  {
    slug: "delaware",
    stateName: "Delaware",
    abbreviation: "DE",
    incomeTaxRate: "0% for LLC income (pass-through); 2.2–6.6% for individuals",
    selfEmploymentTaxNote: "Federal 15.3% SE tax applies. Delaware LLCs do not pay DE corporate income tax — income passes through to owner.",
    salesTaxNote: "No state sales tax. Delaware is a sales-tax-free state, but gross receipts tax may apply.",
    estimatedTaxBurden: [
      { revenue: "$10,000", totalRate: "15.3%", estimatedTax: "$1,530" },
      { revenue: "$30,000", totalRate: "16.5%", estimatedTax: "$4,950" },
      { revenue: "$50,000", totalRate: "16.8%", estimatedTax: "$8,400" },
      { revenue: "$100,000", totalRate: "18.5%", estimatedTax: "$18,500" }
    ],
    availableCredits: [
      { name: "Delaware Small Business Job Creation Credit", description: "For creating net new jobs in the state." },
      { name: "Delaware Blue Collar Training Credit", description: "For training employees in skilled trades." },
      { name: "Commercial Brownfields Credit", description: "For remediating and reusing brownfield sites." }
    ],
    deductions: ["Federal SE tax deduction", "Delaware itemized deductions (limited)", "Business expense deduction", "SEP/Simple IRA contributions"],
    filingDeadlines: "Individual: April 15 (Form 200-01). Corporate: April 15. LLC franchise tax: due June 1 annually.",
    quarterlyPaymentInfo: "Individual estimated payments due April 15, June 15, Sept 15, Jan 15. Use Form 200-ES. LLC franchise tax is a flat $300 — paid annually, not quarterly.",
    faqs: [
      { question: "How much is the Delaware LLC franchise tax? answer: A flat $300 per year, due June 1." },
      { question: "Does Delaware have a sales tax? answer: No — Delaware is one of five states with no state sales tax." }
    ]
  },
  {
    slug: "district-of-columbia",
    stateName: "District of Columbia",
    abbreviation: "DC",
    incomeTaxRate: "4–10.75%",
    selfEmploymentTaxNote: "Federal 15.3% SE tax applies. DC follows federal guidelines for SE tax deduction.",
    salesTaxNote: "State (district) rate 6%. Some services taxed; groceries and prescription drugs exempt.",
    estimatedTaxBurden: [
      { revenue: "$10,000", totalRate: "19.3%", estimatedTax: "$1,930" },
      { revenue: "$30,000", totalRate: "22.8%", estimatedTax: "$6,840" },
      { revenue: "$50,000", totalRate: "24.0%", estimatedTax: "$12,000" },
      { revenue: "$100,000", totalRate: "26.1%", estimatedTax: "$26,100" }
    ],
    availableCredits: [
      { name: "DC Small Business Job Creation Credit", description: "For qualified businesses creating new local jobs." },
      { name: "DC Qualified High Technology Credit", description: "For tech businesses located in DC." },
      { name: "Clean Energy Tax Credit", description: "For businesses installing solar or energy efficiency upgrades." }
    ],
    deductions: ["Federal SE tax deduction", "DC standard deduction ($12,500 single)", "Home office deduction", "Business start-up costs (up to $5,000)"],
    filingDeadlines: "Individual: April 15 (Form D-40). Corporate: April 15. Extension to October 15.",
    quarterlyPaymentInfo: "Due April 15, June 15, Sept 15, Jan 15. Use Form D-40ES. Underpayment threshold: $500.",
    faqs: [
      { question: "What is DC's top income tax rate? answer: 10.75% on income over $1M — one of the highest in the US." },
      { question: "Do I need a DC business license for a side hustle? answer: Yes — DC requires a Basic Business License (BBL) for most business activities." }
    ]
  },
  {
    slug: "florida",
    stateName: "Florida",
    abbreviation: "FL",
    incomeTaxRate: "None (no state income tax)",
    selfEmploymentTaxNote: "Federal 15.3% SE tax applies. No state income tax means no state-level filing required for business income.",
    salesTaxNote: "State rate 6%, local option up to 2.5% — combined up to 8.5%. Services generally exempt.",
    estimatedTaxBurden: [
      { revenue: "$10,000", totalRate: "15.3%", estimatedTax: "$1,530" },
      { revenue: "$30,000", totalRate: "15.3%", estimatedTax: "$4,590" },
      { revenue: "$50,000", totalRate: "15.3%", estimatedTax: "$7,650" },
      { revenue: "$100,000", totalRate: "15.3%", estimatedTax: "$15,300" }
    ],
    availableCredits: [
      { name: "Florida Small Business Tax Credit", description: "For businesses hiring from targeted groups (veterans, ex-felons)." },
      { name: "Florida Renewable Energy Credit", description: "For businesses investing in renewable energy systems." },
      { name: "Enterprise Zone Credit", description: "For job creation in designated enterprise zones." }
    ],
    deductions: ["Federal SE tax deduction (50%) — federal only", "Home office deduction (federal only)", "Business mileage (federal standard)", "Florida does not allow state-level deductions since no income tax exists"],
    filingDeadlines: "No individual income tax return. Corporate filers: April 15 (Form F-1120). Sales tax returns monthly/quarterly.",
    quarterlyPaymentInfo: "Not applicable for state income tax — no state income tax. Federal estimated taxes still required via Form 1040-ES.",
    faqs: [
      { question: "Does Florida really have no income tax? answer: Yes — Florida has no personal income tax on wages, business income, or investments." },
      { question: "Do I need a Florida business license for my side hustle? answer: Yes — county/city business tax receipts (occupational license) are required." }
    ]
  },
  {
    slug: "georgia",
    stateName: "Georgia",
    abbreviation: "GA",
    incomeTaxRate: "1–5.49%",
    selfEmploymentTaxNote: "Federal 15.3% SE tax applies. Georgia allows the SE tax deduction on state returns.",
    salesTaxNote: "State rate 4%, local rates up to 4% — combined up to 8%. Most services exempt.",
    estimatedTaxBurden: [
      { revenue: "$10,000", totalRate: "16.3%", estimatedTax: "$1,630" },
      { revenue: "$30,000", totalRate: "18.2%", estimatedTax: "$5,460" },
      { revenue: "$50,000", totalRate: "19.5%", estimatedTax: "$9,750" },
      { revenue: "$100,000", totalRate: "20.5%", estimatedTax: "$20,500" }
    ],
    availableCredits: [
      { name: "Georgia Small Business Growth Credit", description: "Credit for businesses increasing employment by 20%+." },
      { name: "Georgia Film Tax Credit", description: "Up to 30% for qualified film, TV, and digital production." },
      { name: "Georgia Job Tax Credit", description: "For creating jobs in rural or less-developed counties." }
    ],
    deductions: ["Federal SE tax deduction (50%)", "Georgia standard deduction ($4,600 single)", "Home office deduction", "Business mileage deduction"],
    filingDeadlines: "Individual: April 15 (Form 500). Corporate: April 15. Extension to October 15.",
    quarterlyPaymentInfo: "Due April 15, June 15, Sept 15, Jan 15. Use Form 500ES. Underpayment penalty threshold: $500.",
    faqs: [
      { question: "What is Georgia's current income tax rate? answer: A flat 5.39% rate is being phased in, currently at 5.49% with further reductions scheduled." },
      { question: "Is Georgia a good state for a side hustle from a tax perspective? answer: Moderately — no local income tax, modest state rate, but sales tax can add up." }
    ]
  },
  {
    slug: "hawaii",
    stateName: "Hawaii",
    abbreviation: "HI",
    incomeTaxRate: "1.4–8.25% (up to 11% for top brackets)",
    selfEmploymentTaxNote: "Federal 15.3% SE tax applies. Hawaii conforms to federal SE tax deduction.",
    salesTaxNote: "General Excise Tax (GET) of 4% (general) / 0.5% (wholesale). No separate sales tax — GET applies to gross income.",
    estimatedTaxBurden: [
      { revenue: "$10,000", totalRate: "16.7%", estimatedTax: "$1,670" },
      { revenue: "$30,000", totalRate: "20.5%", estimatedTax: "$6,150" },
      { revenue: "$50,000", totalRate: "23.0%", estimatedTax: "$11,500" },
      { revenue: "$100,000", totalRate: "26.3%", estimatedTax: "$26,300" }
    ],
    availableCredits: [
      { name: "Hawaii High Technology Business Credit", description: "Up to 100% of qualified R&D expenses for tech businesses." },
      { name: "Hawaii Renewable Energy Credit", description: "For businesses installing solar thermal, PV, or wind systems." },
      { name: "Hawaii Capital Goods Excise Tax Credit", description: "For capital investments in manufacturing equipment." }
    ],
    deductions: ["Federal SE tax deduction (50%)", "Home office deduction", "Business operating expenses", "GET deductible as business expense"],
    filingDeadlines: "Individual: April 20 (Form N-11 or N-15). Corporate: April 20. Extension to October 20.",
    quarterlyPaymentInfo: "Due April 20, June 20, Sept 20, Jan 20. Use Form N-20. Underpayment penalty threshold: $500.",
    faqs: [
      { question: "What is Hawaii's General Excise Tax (GET)? answer: A tax on gross income, not a sales tax — it applies even to services, at 4% for most businesses." },
      { question: "Are Hawaii income tax rates the highest in the US? answer: Among the highest — top brackets exceed 10% for high earners." }
    ]
  },
  {
    slug: "idaho",
    stateName: "Idaho",
    abbreviation: "ID",
    incomeTaxRate: "5.695–6.695% (flat rate phasing to 5.695%)",
    selfEmploymentTaxNote: "Federal 15.3% SE tax applies. Idaho allows the SE tax deduction.",
    salesTaxNote: "State rate 6%, no local sales taxes. Most services exempt.",
    estimatedTaxBurden: [
      { revenue: "$10,000", totalRate: "21.0%", estimatedTax: "$2,100" },
      { revenue: "$30,000", totalRate: "21.5%", estimatedTax: "$6,450" },
      { revenue: "$50,000", totalRate: "21.8%", estimatedTax: "$10,900" },
      { revenue: "$100,000", totalRate: "22.0%", estimatedTax: "$22,000" }
    ],
    availableCredits: [
      { name: "Idaho Business Growth Credit", description: "For businesses creating new jobs in Idaho." },
      { name: "Idaho Investment Tax Credit", description: "3% of qualified investment in depreciable property." },
      { name: "Idaho Reemployment Credit", description: "For hiring unemployed workers." }
    ],
    deductions: ["Federal SE tax deduction (50%)", "Idaho standard deduction ($12,550 single)", "Home office deduction", "Retirement contributions (SEP IRA, Solo 401k)"],
    filingDeadlines: "Individual: April 15 (Form 40). Corporate: April 15. Extension to October 15.",
    quarterlyPaymentInfo: "Due April 15, June 15, Sept 15, Jan 15. Use Form 40ES. Underpayment penalty triggers at $500.",
    faqs: [
      { question: "Is Idaho's income tax flat or progressive? answer: Idaho has a near-flat rate, phasing to a flat 5.695%." },
      { question: "Does Idaho tax digital products? answer: Yes — Idaho's sales tax applies to digital goods and some services." }
    ]
  },
  {
    slug: "illinois",
    stateName: "Illinois",
    abbreviation: "IL",
    incomeTaxRate: "4.95% (flat)",
    selfEmploymentTaxNote: "Federal 15.3% SE tax applies. Illinois does not allow SE tax deduction on state return.",
    salesTaxNote: "State rate 6.25%, local rates add 1–4.75% — combined up to 11%. Groceries, drugs, and medical appliances at 1%.",
    estimatedTaxBurden: [
      { revenue: "$10,000", totalRate: "20.3%", estimatedTax: "$2,030" },
      { revenue: "$30,000", totalRate: "20.3%", estimatedTax: "$6,090" },
      { revenue: "$50,000", totalRate: "20.3%", estimatedTax: "$10,150" },
      { revenue: "$100,000", totalRate: "20.3%", estimatedTax: "$20,300" }
    ],
    availableCredits: [
      { name: "Illinois Small Business Job Creation Credit", description: "Credit of $2,500 per new job created." },
      { name: "Illinois EDGE Credit", description: "Economic Development for a Growing Economy — available for large job generators." },
      { name: "Illinois Research & Development Credit", description: "6.5% of qualified R&D expenditures exceeding base amount." }
    ],
    deductions: ["Home office deduction", "Business expense deduction", "Retirement contributions deduction", "Illinois does not allow SE tax deduction on state return"],
    filingDeadlines: "Individual: April 15 (Form IL-1040). Corporate: April 15. Extension to October 15.",
    quarterlyPaymentInfo: "Due April 15, June 15, Sept 15, Jan 15. Use Form IL-1040-ES. Underpayment threshold: $1,000.",
    faqs: [
      { question: "Is Illinois's flat 4.95% rate really that low? answer: It's moderate, but combined with sales and property taxes, IL is a high-tax state overall." },
      { question: "Do I need to pay Illinois quarterly taxes for my side hustle? answer: Yes if you expect to owe $1,000 or more after credits and withholding." }
    ]
  },
  {
    slug: "indiana",
    stateName: "Indiana",
    abbreviation: "IN",
    incomeTaxRate: "3.05–3.15% (flat)",
    selfEmploymentTaxNote: "Federal 15.3% SE tax applies. Indiana allows the SE tax deduction."
  }
];
