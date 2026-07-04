// State LLC Guides: formation fees, annual reports, non-compete status, tax rates, anonymity
// 50 US states + DC = 51 entries

export interface StateGuide {
  slug: string;
  state: string;
  abbreviation: string;
  llcFilingFee: number;
  annualReportFee: number;
  annualReportRequired: boolean;
  nonCompeteEnforceable: "enforced" | "limited" | "not_enforced";
  nonCompeteNotes: string;
  stateIncomeTaxRate: string;
  selfEmploymentNote: string;
  anonymousLlcAllowed: boolean;
  anonymousLlcNotes: string;
  processingTime: string;
  expeditedAvailable: boolean;
  bestFor: string;
  tips: string[];
  faqs: { question: string; answer: string }[];
}

export const stateGuides: StateGuide[] = [
  {
    slug: "alabama",
    state: "Alabama",
    abbreviation: "AL",
    llcFilingFee: 100,
    annualReportFee: 100,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope, geography, and duration.",
    stateIncomeTaxRate: "2-5%",
    selfEmploymentNote: "Federal 15.3% SE tax applies regardless of state.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members/managers must be listed in annual report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Local businesses in the Southeast",
    tips: [
      "File the Business Privilege License return annually with the annual report.",
      "Alabama requires a registered agent with a physical state address.",
      "Reserve your name online before filing to avoid rejection."
    ],
    faqs: [
      { question: "Is the annual report fee the same every year?", answer: "Yes, $100 is due each year alongside the Business Privilege License return." },
      { question: "Are non-competes enforceable in Alabama?", answer: "Yes, if reasonable in scope, geography, and duration." }
    ]
  },
  {
    slug: "alaska",
    state: "Alaska",
    abbreviation: "AK",
    llcFilingFee: 250,
    annualReportFee: 100,
    annualReportRequired: true,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Allowed for sellers of a business; otherwise disfavored.",
    stateIncomeTaxRate: "0% (no state income tax)",
    selfEmploymentNote: "Federal 15.3% SE tax still applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in biennial report.",
    processingTime: "1-2 weeks",
    expeditedAvailable: false,
    bestFor: "No income tax for LLCs operating in Alaska",
    tips: [
      "Alaska has no state income tax but charges a $100 biennial fee.",
      "A registered agent with an Alaska physical address is required.",
      "Confirm the biennial filing deadline to avoid dissolution."
    ],
    faqs: [
      { question: "Does Alaska have a state income tax?", answer: "No, Alaska levies no personal state income tax." },
      { question: "How often is the Alaska report due?", answer: "Every two years on January 2." }
    ]
  },
  {
    slug: "arizona",
    state: "Arizona",
    abbreviation: "AZ",
    llcFilingFee: 50,
    annualReportFee: 0,
    annualReportRequired: false,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable and protecting legitimate business interests.",
    stateIncomeTaxRate: "2.5-2.98%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members must be disclosed to the state.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Low-cost formation with no annual report",
    tips: [
      "No annual report required, saving ongoing admin burden.",
      "Publish Articles in a county newspaper within 60 days.",
      "File the Arizona transaction privilege tax if you sell goods."
    ],
    faqs: [
      { question: "Is an annual report required in Arizona?", answer: "No, Arizona does not require annual reports for LLCs." },
      { question: "Is publication required after forming an Arizona LLC?", answer: "Yes, Articles must be published in a county newspaper." }
    ]
  },
  {
    slug: "arkansas",
    state: "Arkansas",
    abbreviation: "AR",
    llcFilingFee: 45,
    annualReportFee: 150,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced when reasonable in scope and duration.",
    stateIncomeTaxRate: "0.9-3.9%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Member names appear in annual report.",
    processingTime: "2-4 weeks",
    expeditedAvailable: true,
    bestFor: "Cheap filing fee for Southern operators",
    tips: [
      "The $150 annual fee is high relative to the low filing fee.",
      "Confirm franchise tax obligations if you have employees.",
      "Use the SOS online portal to file faster."
    ],
    faqs: [
      { question: "How much is the Arkansas annual franchise tax?", answer: "$150 for LLCs, due each year by May 1." },
      { question: "Are Arkansas non-competes enforceable?", answer: "Yes, if reasonable in scope and duration." }
    ]
  },
  {
    slug: "california",
    state: "California",
    abbreviation: "CA",
    llcFilingFee: 70,
    annualReportFee: 20,
    annualReportRequired: true,
    nonCompeteEnforceable: "not_enforced",
    nonCompeteNotes: "Banned except for sale-of-business and partnership exit scenarios.",
    stateIncomeTaxRate: "1-13.3%",
    selfEmploymentNote: "California LLCs also pay an $800 franchise tax annually.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Statement of Information discloses managers/members.",
    processingTime: "3-5 weeks",
    expeditedAvailable: true,
    bestFor: "Operating in-state; high taxes but flexible market",
    tips: [
      "Budget for the $800 annual LLC franchise tax regardless of profit.",
      "Non-competes are essentially banned—use NDAs instead.",
      "File the Statement of Information within 90 days of formation."
    ],
    faqs: [
      { question: "Is there a minimum California LLC tax?", answer: "Yes, $800 per year even if the LLC loses money." },
      { question: "Are non-compete agreements valid in California?", answer: "Generally no; only narrow exceptions apply." }
    ]
  },
  {
    slug: "colorado",
    state: "Colorado",
    abbreviation: "CO",
    llcFilingFee: 50,
    annualReportFee: 10,
    annualReportRequired: true,
    nonCompeteEnforceable: "not_enforced",
    nonCompeteNotes: "Void for workers earning under $100K/year (2022 reform).",
    stateIncomeTaxRate: "4.4-4.55%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Registered agent is public; members are not always disclosed.",
    processingTime: "2-3 weeks",
    expeditedAvailable: false,
    bestFor: "Low fees and worker-friendly non-compete rules",
    tips: [
      "Annual report is only $10—very cheap to maintain.",
      "Non-competes voided for sub-$100K earners; verify tier.",
      "Use the Colorado Secretary of State online portal for fastest filing."
    ],
    faqs: [
      { question: "How much is the Colorado annual report?", answer: "$10 per year, filed online." },
      { question: "Are non-competes enforceable in Colorado?", answer: "Only for high earners; voided for those under $100K/year." }
    ]
  },
  {
    slug: "connecticut",
    state: "Connecticut",
    abbreviation: "CT",
    llcFilingFee: 120,
    annualReportFee: 80,
    annualReportRequired: true,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Restricted for lower-wage workers and certain professions.",
    stateIncomeTaxRate: "3-6.99%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members disclosed in annual report.",
    processingTime: "3-5 weeks",
    expeditedAvailable: true,
    bestFor: "Northeast LLCs needing a balanced regulatory environment",
    tips: [
      "Annual report due between Jan 1 and Mar 31 each year.",
      "Verify the new non-compete wage thresholds annually.",
      "Use a Connecticut registered agent to avoid rejections."
    ],
    faqs: [
      { question: "When is the Connecticut annual report due?", answer: "Annually between January 1 and March 31." },
      { question: "Are CT non-competes limited?", answer: "Yes, especially for lower-wage workers." }
    ]
  },
  {
    slug: "delaware",
    state: "Delaware",
    abbreviation: "DE",
    llcFilingFee: 90,
    annualReportFee: 300,
    annualReportRequired: true,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Enforced if reasonable; Delaware is employer-friendly but reviews scope.",
    stateIncomeTaxRate: "0% for LLC income (pass-through)",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: true,
    anonymousLlcNotes: "Members not listed on public filings—strong anonymity.",
    processingTime: "1-2 weeks",
    expeditedAvailable: true,
    bestFor: "Privacy, national prestige, and Court of Chancery",
    tips: [
      "Delaware LLCs pay a flat $300 franchise tax each year.",
      "Use a Delaware registered agent for anonymity.",
      "Operating agreement is not filed but is legally essential."
    ],
    faqs: [
      { question: "Does Delaware LLC income face state tax?", answer: "No—LLC income is pass-through and not taxed at the Delaware level." },
      { question: "Can Delaware LLCs be anonymous?", answer: "Yes, member names are not required on the formation filing." }
    ]
  },
  {
    slug: "district-of-columbia",
    state: "District of Columbia",
    abbreviation: "DC",
    llcFilingFee: 99,
    annualReportFee: 55,
    annualReportRequired: true,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Banned for most non-healthcare workers; repealed in 2020s.",
    stateIncomeTaxRate: "4-10.75%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members appear in the biennial report.",
    processingTime: "3-4 weeks",
    expeditedAvailable: true,
    bestFor: "Operating in DC metro with strong worker protections",
    tips: [
      "File the two-year report by April 1 to avoid penalties.",
      "DC bans non-competes for most workers—check exemptions.",
      "Use a DC registered agent with a physical district address."
    ],
    faqs: [
      { question: "Are DC non-competes enforceable?", answer: "Banned for most non-healthcare workers." },
      { question: "How often is the DC report due?", answer: "Every two years, by April 1." }
    ]
  },
  {
    slug: "florida",
    state: "Florida",
    abbreviation: "FL",
    llcFilingFee: 125,
    annualReportFee: 138.75,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Strongly enforced under Florida's specific statutory framework.",
    stateIncomeTaxRate: "0% (no state income tax)",
    selfEmploymentNote: "Federal 15.3% SE tax still applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members/managers disclosed in annual report.",
    processingTime: "2-4 weeks",
    expeditedAvailable: true,
    bestFor: "No state income tax + warm climate",
    tips: [
      "Annual report is $138.75—higher than most states.",
      "File before May 1 each year to avoid $400 late fee.",
      "Non-competes are enforced—draft carefully."
    ],
    faqs: [
      { question: "Does Florida have a state income tax?", answer: "No, Florida has no personal state income tax." },
      { question: "When is the Florida annual report due?", answer: "Annually between January 1 and May 1." }
    ]
  },
  {
    slug: "georgia",
    state: "Georgia",
    abbreviation: "GA",
    llcFilingFee: 100,
    annualReportFee: 50,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced under Georgia's restrictive covenant statute if reasonable.",
    stateIncomeTaxRate: "1-5.49%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual registration.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Low-cost Southeastern state with worker-friendly covenant rules",
    tips: [
      "Annual registration is only $50.",
      "Georgia non-competes are flexible thanks to a 2011 statute.",
      "File online for fastest turnaround."
    ],
    faqs: [
      { question: "How much is the Georgia annual registration?", answer: "$50 per year." },
      { question: "Are non-competes enforced in Georgia?", answer: "Yes, if reasonable under Georgia's restrictive covenant statute." }
    ]
  },
  {
    slug: "hawaii",
    state: "Hawaii",
    abbreviation: "HI",
    llcFilingFee: 50,
    annualReportFee: 12.5,
    annualReportRequired: true,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Allowed only for legitimate business interests; scrutinized.",
    stateIncomeTaxRate: "1.4-8.2%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members/managers disclosed in annual filing.",
    processingTime: "3-5 weeks",
    expeditedAvailable: false,
    bestFor: "Operating in-state with low annual fees",
    tips: [
      "Annual filing is just $12.50—cheap to maintain.",
      "Hawaii has a high top income tax rate.",
      "Confirm GE tax (general excise) obligations if you sell services."
    ],
    faqs: [
      { question: "How much is the Hawaii LLC annual filing?", answer: "$12.50 per year." },
      { question: "What is Hawaii's general excise tax?", answer: "A gross income tax on business activity, separate from income tax." }
    ]
  },
  {
    slug: "idaho",
    state: "Idaho",
    abbreviation: "ID",
    llcFilingFee: 100,
    annualReportFee: 0,
    annualReportRequired: false,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "5.695-6.695%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed on formation documents.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "No annual report burden",
    tips: [
      "No annual report required—low ongoing admin.",
      "Idaho income tax is flat-ish at high rates.",
      "Use SOS online filing to confirm a registered agent quickly."
    ],
    faqs: [
      { question: "Is an annual report required for Idaho LLCs?", answer: "No, Idaho does not require annual reports." },
      { question: "Are Idaho non-competes enforced?", answer: "Yes, if reasonable." }
    ]
  },
  {
    slug: "illinois",
    state: "Illinois",
    abbreviation: "IL",
    llcFilingFee: 150,
    annualReportFee: 75,
    annualReportRequired: true,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Banned for workers earning under $75K (2023 reform).",
    stateIncomeTaxRate: "4.95%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members appear in annual report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Midwest base with predictable flat tax",
    tips: [
      "Illinois has a flat 4.95% income tax.",
      "Non-competes banned below $75K earnings threshold.",
      "File the annual report before the 1st day of formation month."
    ],
    faqs: [
      { question: "What is Illinois's income tax rate?", answer: "A flat 4.95% on individuals." },
      { question: "Are Illinois non-competes enforceable?", answer: "Only for earners above the $75K threshold." }
    ]
  },
  {
    slug: "indiana",
    state: "Indiana",
    abbreviation: "IN",
    llcFilingFee: 95,
    annualReportFee: 31,
    annualReportRequired: true,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Allowed if reasonable but subject to judicial scrutiny.",
    stateIncomeTaxRate: "3.05-3.15%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members disclosed biennially.",
    processingTime: "2-4 weeks",
    expeditedAvailable: true,
    bestFor: "Low-rate tax environment in the Midwest",
    tips: [
      "Annual report is due every two years—cheap at $31.",
      "Indiana income tax is among the lowest flat rates.",
      "Confirm registered agent consent before filing."
    ],
    faqs: [
      { question: "How often is the Indiana report due?", answer: "Every two years." },
      { question: "What is Indiana's income tax rate?", answer: "Approximately 3.05-3.15%." }
    ]
  },
  {
    slug: "iowa",
    state: "Iowa",
    abbreviation: "IA",
    llcFilingFee: 50,
    annualReportFee: 30,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable and protecting legitimate interests.",
    stateIncomeTaxRate: "0.36-5.7%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members appear in biennial report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Cheap filing fee and modest annual cost",
    tips: [
      "Filing fee is just $50—low entry cost.",
      "Biennial report due in odd years.",
      "Iowa has reformed tax brackets recently—check current rates."
    ],
    faqs: [
      { question: "How often is the Iowa report due?", answer: "Every two years." },
      { question: "What is Iowa's top income tax rate?", answer: "Approximately 5.7%, with a low floor around 0.36%." }
    ]
  },
  {
    slug: "kansas",
    state: "Kansas",
    abbreviation: "KS",
    llcFilingFee: 160,
    annualReportFee: 50,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "3.1-5.7%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Central US operations with predictable tax",
    tips: [
      "Filing fee is higher than neighboring states.",
      "Annual report due on the 15th day of the 4th month.",
      "Use Kansas SOS online portal for fast turnaround."
    ],
    faqs: [
      { question: "How much is the Kansas annual report?", answer: "$50 per year." },
      { question: "Are Kansas non-competes enforceable?", answer: "Yes, if reasonable." }
    ]
  },
  {
    slug: "kentucky",
    state: "Kentucky",
    abbreviation: "KY",
    llcFilingFee: 40,
    annualReportFee: 15,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope, geography, and duration.",
    stateIncomeTaxRate: "2-5%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members appear in annual report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Lowest filing fee and cheap annual cost",
    tips: [
      "$40 filing fee is among the cheapest in the US.",
      "Annual report is only $15—low ongoing cost.",
      "Confirm Kentucky LLET tax obligations if revenue is high."
    ],
    faqs: [
      { question: "What is Kentucky's filing fee?", answer: "$40—one of the lowest in the US." },
      { question: "How much is the annual report?", answer: "$15 per year." }
    ]
  },
  {
    slug: "louisiana",
    state: "Louisiana",
    abbreviation: "LA",
    llcFilingFee: 100,
    annualReportFee: 35,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if specific in scope and duration.",
    stateIncomeTaxRate: "1.85-3%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual report.",
    processingTime: "2-4 weeks",
    expeditedAvailable: true,
    bestFor: "Low-tax Southern state",
    tips: [
      "Annual report is just $35—cheap.",
      "Top income tax rate is low at 3%.",
      "Use Louisiana geauxBiz portal for online filing."
    ],
    faqs: [
      { question: "What is Louisiana's top income tax rate?", answer: "Approximately 3%." },
      { question: "How much is the annual report?", answer: "$35 per year." }
    ]
  },
  {
    slug: "maine",
    state: "Maine",
    abbreviation: "ME",
    llcFilingFee: 175,
    annualReportFee: 0,
    annualReportRequired: false,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Allowed only for legitimate interests; scrutinized.",
    stateIncomeTaxRate: "6.5-7.15%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members disclosed on formation filing.",
    processingTime: "3-5 weeks",
    expeditedAvailable: false,
    bestFor: "Northeast operations with no annual report",
    tips: [
      "No annual report required—low ongoing admin.",
      "Filing fee is $175—higher than average.",
      "Maine income tax rates are among the higher end."
    ],
    faqs: [
      { question: "Does Maine require an annual report?", answer: "No, Maine LLCs do not file annual reports." },
      { question: "What is Maine's top income tax rate?", answer: "Approximately 7.15%." }
    ]
  },
  {
    slug: "maryland",
    state: "Maryland",
    abbreviation: "MD",
    llcFilingFee: 100,
    annualReportFee: 300,
    annualReportRequired: true,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Allowed for legitimate interests but heavily regulated.",
    stateIncomeTaxRate: "2-5.75%",
    selfEmploymentNote: "Federal 15.3% SE tax applies; local counties also tax.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in personal property return.",
    processingTime: "2-4 weeks",
    expeditedAvailable: true,
    bestFor: "Mid-Atlantic base despite high annual fees",
    tips: [
      "The $300 annual fee is high—budget accordingly.",
      "Maryland local counties levy their own income tax.",
      "File the personal property return by April 15."
    ],
    faqs: [
      { question: "How much is the Maryland annual report?", answer: "$300 for LLCs." },
      { question: "Does Maryland tax LLC income?", answer: "Yes, and counties add a local income tax." }
    ]
  },
  {
    slug: "massachusetts",
    state: "Massachusetts",
    abbreviation: "MA",
    llcFilingFee: 500,
    annualReportFee: 0,
    annualReportRequired: false,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Allowed under the 2018 MA Noncompetition Agreement Act with strict rules.",
    stateIncomeTaxRate: "5-9%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members disclosed in the (rare) annual filing.",
    processingTime: "3-5 weeks",
    expeditedAvailable: true,
    bestFor: "Operating in MA despite high filing fee",
    tips: [
      "$500 filing fee is among the highest in the US.",
      "No annual report required—small relief.",
      "Non-competes must comply with the 2018 statute's strict rules."
    ],
    faqs: [
      { question: "How much is the Massachusetts LLC filing fee?", answer: "$500—one of the highest in the US." },
      { question: "Are MA non-competes enforceable?", answer: "Yes, but tightly regulated under the 2018 statute." }
    ]
  },
  {
    slug: "michigan",
    state: "Michigan",
    abbreviation: "MI",
    llcFilingFee: 50,
    annualReportFee: 25,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable and protecting legitimate interests.",
    stateIncomeTaxRate: "4.25%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members appear in annual statement.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Low flat tax + cheap filing fee",
    tips: [
      "$50 filing fee and $25 annual—very cheap.",
      "Michigan has a flat 4.25% income tax.",
      "File the annual statement by February 15."
    ],
    faqs: [
      { question: "What is Michigan's income tax rate?", answer: "A flat 4.25%." },
      { question: "How much is the Michigan annual report?", answer: "$25 per year." }
    ]
  },
  {
    slug: "minnesota",
    state: "Minnesota",
    abbreviation: "MN",
    llcFilingFee: 155,
    annualReportFee: 0,
    annualReportRequired: true,
    nonCompeteEnforceable: "not_enforced",
    nonCompeteNotes: "Banned for most workers starting 2025.",
    stateIncomeTaxRate: "5.35-9.85%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual renewal.",
    processingTime: "3-4 weeks",
    expeditedAvailable: true,
    bestFor: "Worker-friendly state banning non-competes",
    tips: [
      "Annual renewal is free but still mandatory.",
      "Minnesota banned non-competes starting 2025.",
      "Income tax rates are high—plan accordingly."
    ],
    faqs: [
      { question: "Are Minnesota non-competes enforceable?", answer: "No—banned for most workers as of 2025." },
      { question: "Is the Minnesota annual renewal free?", answer: "Yes, no fee, but filing is still required." }
    ]
  },
  {
    slug: "mississippi",
    state: "Mississippi",
    abbreviation: "MS",
    llcFilingFee: 50,
    annualReportFee: 0,
    annualReportRequired: false,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "0-4.4%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members disclosed on filing.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Cheap filing and no annual report",
    tips: [
      "$50 filing fee and no annual report—very cheap.",
      "Mississippi is phasing out income tax—check current rates.",
      "Use the SOS online portal for fast filing."
    ],
    faqs: [
      { question: "Does Mississippi require an annual report?", answer: "No." },
      { question: "What is Mississippi's top income tax rate?", answer: "Approximately 4.4%, scheduled to phase down." }
    ]
  },
  {
    slug: "missouri",
    state: "Missouri",
    abbreviation: "MO",
    llcFilingFee: 50,
    annualReportFee: 0,
    annualReportRequired: false,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "0-4.95%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members appear in annual report (if applicable).",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Cheap filing and no annual report",
    tips: [
      "$50 filing fee and no annual report—very cheap.",
      "Missouri is reducing income tax—check current rate.",
      "Verify franchise tax if assets exceed $1M."
    ],
    faqs: [
      { question: "Does Missouri require an annual report?", answer: "No, Missouri does not require annual reports for LLCs." },
      { question: "What is Missouri's top income tax rate?", answer: "Approximately 4.95%, with cuts ongoing." }
    ]
  },
  {
    slug: "montana",
    state: "Montana",
    abbreviation: "MT",
    llcFilingFee: 70,
    annualReportFee: 20,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable and protecting legitimate interests.",
    stateIncomeTaxRate: "1-5.9%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: false,
    bestFor: "Low-cost Mountain West state",
    tips: [
      "$70 filing fee and $20 annual—cheap to maintain.",
      "Montana has no general sales tax.",
      "File the annual report by April 15."
    ],
    faqs: [
      { question: "How much is the Montana annual report?", answer: "$20 per year." },
      { question: "Does Montana have a sales tax?", answer: "No, Montana has no general state sales tax." }
    ]
  },
  {
    slug: "nebraska",
    state: "Nebraska",
    abbreviation: "NE",
    llcFilingFee: 105,
    annualReportFee: 13,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "2.46-5.84%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members appear in biennial report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: false,
    bestFor: "Low annual cost in the Plains",
    tips: [
      "Annual report is just $13 and due every two years.",
      "Use the Nebraska SOS online portal.",
      "Confirm registered agent consent before filing."
    ],
    faqs: [
      { question: "How often is the Nebraska report due?", answer: "Every two years." },
      { question: "How much is the Nebraska annual fee?", answer: "$13 per biennial report." }
    ]
  },
  {
    slug: "nevada",
    state: "Nevada",
    abbreviation: "NV",
    llcFilingFee: 425,
    annualReportFee: 350,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "0% (no state income tax)",
    selfEmploymentNote: "Federal 15.3% SE tax still applies.",
    anonymousLlcAllowed: true,
    anonymousLlcNotes: "Members not required on public filings—strong anonymity.",
    processingTime: "2-4 weeks",
    expeditedAvailable: true,
    bestFor: "Privacy + no income tax (premium pricing)",
    tips: [
      "Filing fee ($425) and annual ($350) are pricey.",
      "No state income tax and strong anonymity.",
      "Use a Nevada registered agent to maintain privacy."
    ],
    faqs: [
      { question: "Does Nevada have a state income tax?", answer: "No." },
      { question: "Are Nevada LLCs anonymous?", answer: "Yes, member names are not on public filings." }
    ]
  },
  {
    slug: "new-hampshire",
    state: "New Hampshire",
    abbreviation: "NH",
    llcFilingFee: 102,
    annualReportFee: 0,
    annualReportRequired: false,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Allowed if reasonable but closely scrutinized.",
    stateIncomeTaxRate: "0% (no income tax; 5% on dividends/interest)",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed on formation filing.",
    processingTime: "2-3 weeks",
    expeditedAvailable: false,
    bestFor: "No income tax (except on investments)",
    tips: [
      "No wage income tax, but interest/dividends are taxed at 5%.",
      "No annual report required.",
      "Confirm the BET (Business Enterprise Tax) if revenue is high."
    ],
    faqs: [
      { question: "Does New Hampshire tax wages?", answer: "No, but a 5% tax applies to interest and dividends." },
      { question: "Is an annual report required in NH?", answer: "No." }
    ]
  },
  {
    slug: "new-jersey",
    state: "New Jersey",
    abbreviation: "NJ",
    llcFilingFee: 125,
    annualReportFee: 75,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "1.4-10.75%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Northeast corridor with high-income tax bracket",
    tips: [
      "New Jersey has one of the highest top tax rates.",
      "Annual report due on the anniversary month of formation.",
      "Use NJ Division of Revenue online portal."
    ],
    faqs: [
      { question: "What is New Jersey's top income tax rate?", answer: "Approximately 10.75%." },
      { question: "How much is the NJ annual report?", answer: "$75 per year." }
    ]
  },
  {
    slug: "new-mexico",
    state: "New Mexico",
    abbreviation: "NM",
    llcFilingFee: 50,
    annualReportFee: 0,
    annualReportRequired: false,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Allowed if reasonable but healthcare worker rules apply.",
    stateIncomeTaxRate: "1.9-5.9%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: true,
    anonymousLlcNotes: "Members not required on public filings—strong anonymity.",
    processingTime: "2-3 weeks",
    expeditedAvailable: false,
    bestFor: "Cheapest anonymous LLC option",
    tips: [
      "$50 filing fee and no annual report—cheapest anonymous LLC.",
      "Members are not disclosed publicly.",
      "Use a New Mexico registered agent for full privacy."
    ],
    faqs: [
      { question: "Are New Mexico LLCs anonymous?", answer: "Yes, member names are not on the formation filing." },
      { question: "Does New Mexico require an annual report?", answer: "No." }
    ]
  },
  {
    slug: "new-york",
    state: "New York",
    abbreviation: "NY",
    llcFilingFee: 200,
    annualReportFee: 9,
    annualReportRequired: true,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Allowed if reasonable; recent reforms restrict low-wage use.",
    stateIncomeTaxRate: "4-10.9%",
    selfEmploymentNote: "Federal 15.3% SE tax applies; NYC also taxes.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in biennial statement.",
    processingTime: "3-5 weeks",
    expeditedAvailable: true,
    bestFor: "Operating in NY despite publication requirement",
    tips: [
      "NY requires newspaper publication within 120 days of formation.",
      "Publication can cost $200-$2,000 depending on county.",
      "Biennial statement is just $9."
    ],
    faqs: [
      { question: "Does NY require newspaper publication?", answer: "Yes, within 120 days of formation." },
      { question: "How often is the NY report due?", answer: "Every two years; $9 fee." }
    ]
  },
  {
    slug: "north-carolina",
    state: "North Carolina",
    abbreviation: "NC",
    llcFilingFee: 125,
    annualReportFee: 200,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "4.5-4.75%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Southeast state with flat-ish tax",
    tips: [
      "Annual report is $200—budget for it.",
      "NC income tax is flat-ish around 4.5-4.75%.",
      "File by April 15 each year."
    ],
    faqs: [
      { question: "How much is the NC annual report?", answer: "$200 per year." },
      { question: "What is NC's income tax rate?", answer: "Approximately 4.5-4.75%." }
    ]
  },
  {
    slug: "north-dakota",
    state: "North Dakota",
    abbreviation: "ND",
    llcFilingFee: 135,
    annualReportFee: 50,
    annualReportRequired: true,
    nonCompeteEnforceable: "not_enforced",
    nonCompeteNotes: "Banned for most workers under 2019 reform.",
    stateIncomeTaxRate: "0-2.5%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: false,
    bestFor: "Low tax and worker-friendly non-compete stance",
    tips: [
      "ND has very low income tax rates.",
      "Non-competes largely banned for most workers.",
      "Annual report due by November 15."
    ],
    faqs: [
      { question: "Are ND non-competes enforceable?", answer: "No—banned for most workers." },
      { question: "What is ND's top income tax rate?", answer: "Approximately 2.5%." }
    ]
  },
  {
    slug: "ohio",
    state: "Ohio",
    abbreviation: "OH",
    llcFilingFee: 99,
    annualReportFee: 0,
    annualReportRequired: false,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "0-3.5%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed on biennial filing.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "No annual report + low income tax",
    tips: [
      "No annual report required—low ongoing admin.",
      "Ohio income tax brackets top out around 3.5%.",
      "Confirm commercial activity tax (CAT) if revenue exceeds $3M."
    ],
    faqs: [
      { question: "Does Ohio require an annual report?", answer: "No—Ohio does not require annual reports for LLCs." },
      { question: "What is Ohio's top income tax rate?", answer: "Approximately 3.5%." }
    ]
  },
  {
    slug: "oklahoma",
    state: "Oklahoma",
    abbreviation: "OK",
    llcFilingFee: 100,
    annualReportFee: 25,
    annualReportRequired: true,
    nonCompeteEnforceable: "not_enforced",
    nonCompeteNotes: "Banned for most workers under 2024-2025 reform.",
    stateIncomeTaxRate: "0.25-4.75%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Worker-friendly state with low annual cost",
    tips: [
      "Annual report is just $25.",
      "OK banned non-competes—check the latest effective date.",
      "Use OK SOS online filing portal."
    ],
    faqs: [
      { question: "Are OK non-competes enforceable?", answer: "No—banned under recent reform." },
      { question: "How much is the OK annual report?", answer: "$25 per year." }
    ]
  },
  {
    slug: "oregon",
    state: "Oregon",
    abbreviation: "OR",
    llcFilingFee: 100,
    annualReportFee: 100,
    annualReportRequired: true,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Allowed only with legitimate business interest and caps on duration.",
    stateIncomeTaxRate: "4.75-9.9%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members disclosed in annual report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: false,
    bestFor: "West Coast operations outside California",
    tips: [
      "Annual report is $100—moderate.",
      "Oregon has a high top income tax rate.",
      "File the annual report on the anniversary date of formation."
    ],
    faqs: [
      { question: "How much is the OR annual report?", answer: "$100 per year." },
      { question: "What is OR's top income tax rate?", answer: "Approximately 9.9%." }
    ]
  },
  {
    slug: "pennsylvania",
    state: "Pennsylvania",
    abbreviation: "PA",
    llcFilingFee: 125,
    annualReportFee: 7,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "3.07%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual report (new 2024 requirement).",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Flat 3.07% tax + cheap annual fee",
    tips: [
      "PA has a flat 3.07% income tax.",
      "Annual report is just $7—very cheap.",
      "PA introduced an annual report in 2024—don't skip it."
    ],
    faqs: [
      { question: "What is PA's income tax rate?", answer: "A flat 3.07%." },
      { question: "How much is the PA annual report?", answer: "$7 per year (introduced in 2024)." }
    ]
  },
  {
    slug: "rhode-island",
    state: "Rhode Island",
    abbreviation: "RI",
    llcFilingFee: 150,
    annualReportFee: 0,
    annualReportRequired: false,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "3.75-5.99%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed on filing.",
    processingTime: "2-3 weeks",
    expeditedAvailable: false,
    bestFor: "New England base with no annual report",
    tips: [
      "No annual report required.",
      "RI income tax rates are moderate.",
      "Confirm state tax filing obligations annually."
    ],
    faqs: [
      { question: "Does RI require an annual report?", answer: "No." },
      { question: "What is RI's top income tax rate?", answer: "Approximately 5.99%." }
    ]
  },
  {
    slug: "south-carolina",
    state: "South Carolina",
    abbreviation: "SC",
    llcFilingFee: 110,
    annualReportFee: 0,
    annualReportRequired: false,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "0-6.4%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members disclosed on formation filing.",
    processingTime: "2-3 weeks",
    expeditedAvailable: false,
    bestFor: "No annual report + moderate income tax",
    tips: [
      "No annual report required—low ongoing admin.",
      "SC income tax tops out around 6.4%.",
      "Use SC SOS online portal for fast filing."
    ],
    faqs: [
      { question: "Does SC require an annual report?", answer: "No." },
      { question: "What is SC's top income tax rate?", answer: "Approximately 6.4%." }
    ]
  },
  {
    slug: "south-dakota",
    state: "South Dakota",
    abbreviation: "SD",
    llcFilingFee: 150,
    annualReportFee: 50,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "0% (no state income tax)",
    selfEmploymentNote: "Federal 15.3% SE tax still applies.",
    anonymousLlcAllowed: true,
    anonymousLlcNotes: "Members not required on public filings—strong anonymity.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "No income tax + anonymity",
    tips: [
      "No state income tax and strong anonymity.",
      "Annual report is just $50.",
      "Use a South Dakota registered agent for full privacy."
    ],
    faqs: [
      { question: "Does SD have a state income tax?", answer: "No." },
      { question: "Are SD LLCs anonymous?", answer: "Yes, member names are not on public filings." }
    ]
  },
  {
    slug: "tennessee",
    state: "Tennessee",
    abbreviation: "TN",
    llcFilingFee: 300,
    annualReportFee: 0,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "0% (no income tax; Hall income tax repealed)",
    selfEmploymentNote: "Federal 15.3% SE tax still applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members disclosed on franchise tax return.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "No income tax (high filing fee offset)",
    tips: [
      "$300 filing fee is high but no income tax offsets it.",
      "Hall income tax fully repealed in 2021.",
      "Confirm franchise/excise tax obligations annually."
    ],
    faqs: [
      { question: "Does Tennessee have a state income tax?", answer: "No—the Hall income tax was fully repealed in 2021." },
      { question: "How much is the TN LLC filing fee?", answer: "$300—among the highest." }
    ]
  },
  {
    slug: "texas",
    state: "Texas",
    abbreviation: "TX",
    llcFilingFee: 300,
    annualReportFee: 0,
    annualReportRequired: false,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable and protecting legitimate interests.",
    stateIncomeTaxRate: "0% (no state income tax)",
    selfEmploymentNote: "Federal 15.3% SE tax still applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members disclosed in franchise tax report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "No income tax (large market)",
    tips: [
      "No annual report, but franchise tax report is required.",
      "No state income tax—a major benefit.",
      "Franchise tax only applies above the no-tax-due threshold."
    ],
    faqs: [
      { question: "Does Texas have a state income tax?", answer: "No." },
      { question: "Is an annual report required in Texas?", answer: "No, but a franchise tax report may be required." }
    ]
  },
  {
    slug: "utah",
    state: "Utah",
    abbreviation: "UT",
    llcFilingFee: 70,
    annualReportFee: 18,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "4.65-4.85%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual report.",
    processingTime: "1-2 weeks",
    expeditedAvailable: true,
    bestFor: "Low fees + fast processing in Mountain West",
    tips: [
      "$70 filing fee and $18 annual—cheap to maintain.",
      "Utah has a near-flat income tax around 4.65%.",
      "Use the Utah SOS online portal for fast turnaround."
    ],
    faqs: [
      { question: "How much is the Utah annual report?", answer: "$18 per year." },
      { question: "What is Utah's income tax rate?", answer: "Approximately 4.65-4.85%." }
    ]
  },
  {
    slug: "vermont",
    state: "Vermont",
    abbreviation: "VT",
    llcFilingFee: 125,
    annualReportFee: 35,
    annualReportRequired: true,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Allowed if reasonable but subject to judicial scrutiny.",
    stateIncomeTaxRate: "3.35-8.75%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: false,
    bestFor: "New England operations with moderate annual cost",
    tips: [
      "Annual report is just $35.",
      "Vermont has a high top income tax rate.",
      "File the annual report within 3 months of formation anniversary."
    ],
    faqs: [
      { question: "How much is the VT annual report?", answer: "$35 per year." },
      { question: "What is VT's top income tax rate?", answer: "Approximately 8.75%." }
    ]
  },
  {
    slug: "virginia",
    state: "Virginia",
    abbreviation: "VA",
    llcFilingFee: 100,
    annualReportFee: 50,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "2-5.75%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Mid-Atlantic base with predictable tax",
    tips: [
      "Annual report is $50.",
      "VA income tax tops out around 5.75%.",
      "File the annual registration by the last day of the formation month."
    ],
    faqs: [
      { question: "How much is the VA annual report?", answer: "$50 per year." },
      { question: "What is VA's top income tax rate?", answer: "Approximately 5.75%." }
    ]
  },
  {
    slug: "washington",
    state: "Washington",
    abbreviation: "WA",
    llcFilingFee: 200,
    annualReportFee: 60,
    annualReportRequired: true,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Restricted for workers earning under ~$120K/year.",
    stateIncomeTaxRate: "0-7%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "West Coast tech businesses",
    tips: [
      "WA has no personal income tax on wages but a 7% capital gains tax.",
      "Annual report is $60—moderate.",
      "Confirm B&O tax obligations if revenue is significant."
    ],
    faqs: [
      { question: "Does WA tax personal income?", answer: "No wage tax, but a 7% capital gains tax applies." },
      { question: "How much is the WA annual report?", answer: "$60 per year." }
    ]
  },
  {
    slug: "west-virginia",
    state: "West Virginia",
    abbreviation: "WV",
    llcFilingFee: 100,
    annualReportFee: 25,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "3-5.12%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Low-cost Appalachian state",
    tips: [
      "Annual report is just $25.",
      "WV income tax tops out around 5.12%.",
      "File by July 1 each year."
    ],
    faqs: [
      { question: "How much is the WV annual report?", answer: "$25 per year." },
      { question: "What is WV's top income tax rate?", answer: "Approximately 5.12%." }
    ]
  },
  {
    slug: "wisconsin",
    state: "Wisconsin",
    abbreviation: "WI",
    llcFilingFee: 130,
    annualReportFee: 25,
    annualReportRequired: true,
    nonCompeteEnforceable: "enforced",
    nonCompeteNotes: "Enforced if reasonable in scope and duration.",
    stateIncomeTaxRate: "3.5-7.65%",
    selfEmploymentNote: "Federal 15.3% SE tax applies.",
    anonymousLlcAllowed: false,
    anonymousLlcNotes: "Members listed in annual report.",
    processingTime: "2-3 weeks",
    expeditedAvailable: true,
    bestFor: "Midwest state with moderate fees",
    tips: [
      "Annual report is just $25.",
      "WI income tax tops out around 7.65%.",
      "File by the end of the quarter of formation anniversary."
    ],
    faqs: [
      { question: "How much is the WI annual report?", answer: "$25 per year." },
      { question: "What is WI's top income tax rate?", answer: "Approximately 7.65%." }
    ]
  },
  {
    slug: "wyoming",
    state: "Wyoming",
    abbreviation: "WY",
    llcFilingFee: 100,
    annualReportFee: 60,
    annualReportRequired: true,
    nonCompeteEnforceable: "limited",
    nonCompeteNotes: "Allowed if reasonable but courts scrutinize scope.",
    stateIncomeTaxRate: "0% (no state income tax)",
    selfEmploymentNote: "Federal 15.3% SE tax still applies.",
    anonymousLlcAllowed: true,
    anonymousLlcNotes: "Members not required on public filings—best anonymity in the US.",
    processingTime: "1-2 weeks",
    expeditedAvailable: true,
    bestFor: "Best anonymous LLC + no income tax",
    tips: [
      "Wyoming is the top pick for anonymous LLCs.",
      "No state income tax and $60 annual fee.",
      "Use a Wyoming registered agent for maximum privacy."
    ],
    faqs: [
      { question: "Are Wyoming LLCs anonymous?", answer: "Yes—members are not on public filings." },
      { question: "Does Wyoming have a state income tax?", answer: "No." }
    ]
  }
];
