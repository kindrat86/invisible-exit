// Depth sections for high-impression /tax-guides/<state> pages (organic depth slice 2026-10-08).
// GUARDRAIL 5.1: every number in this file resolves to a source in
// research/tax-depth-claims-20261008.json. Do not add unsourced figures.
// Claims and access dates are recorded per source. URL delta: 0 (existing pages only).

export interface TaxDepthSource {
  label: string;
  url: string;
}

export interface TaxDepth {
  seoTitle: string;
  seoDescription: string;
  heading: string;
  paragraphs: string[];
  bullets: string[];
  sources: TaxDepthSource[];
  lastVerified: string;
  verificationNote?: string;
}

export const taxDepth: Record<string, TaxDepth> = {
  "new-jersey": {
    seoTitle:
      "New Jersey LLC Tax: Filing Fees, Minimums and Deadlines (NJ) | Invisible Exit",
    seoDescription:
      "What a New Jersey LLC actually pays: $150 per owner partnership filing fee (over two owners), $500 minimum Corporation Business Tax, due dates. Official NJ sources.",
    heading: "New Jersey LLC Taxes: The Filing Fee, the Minimums, and When They Are Due",
    paragraphs: [
      "Most multi-member LLCs in New Jersey are treated as partnerships for federal income tax purposes, and that is where the state's best-known LLC charge comes from. The Division of Taxation's 2025 NJ-1065 instructions state that entities classified as partnerships with income derived from New Jersey sources and more than two owners must pay a filing fee of $150 for each owner, up to a maximum of $250,000. The fee is due on or before the 15th day of the fourth month after the close of each privilege period, which for calendar-year filers lands in April alongside the federal partnership return.",
      "Corporations in New Jersey pay the Corporation Business Tax instead, and the state publishes its rates plainly: 9% on adjusted entire net income (or the portion allocable to New Jersey), 7.5% for corporations with entire net income of $100,000 or less, and 6.5% for those at $50,000 or less. The CBT also carries a minimum tax based on New Jersey gross receipts, starting at $500 for receipts under $100,000 and rising in steps to $2,000 for receipts of $1,000,000 or more. An LLC that elects corporate treatment files under this regime, so the election changes both the rate and the minimum.",
      "For a side business, the practical reading is this: the per-owner filing fee scales with ownership, the minimums are fixed by statute, and neither one waits for you to be profitable. If you are searching \"New Jersey LLC annual fee\" or \"NJ-1065 filing fee\", the numbers above are the current official ones; confirm your entity's federal classification before you pick which schedule applies to you.",
    ],
    bullets: [
      "Partnership filing fee: $150 per owner for entities with more than two owners, capped at $250,000 (NJ-1065 instructions).",
      "Filing fee due: the 15th day of the fourth month after the close of the privilege period (NJ-1065 instructions).",
      "Corporation Business Tax: 9% top rate; 7.5% at $100,000 or less of entire net income; 6.5% at $50,000 or less (NJ Division of Taxation).",
      "CBT minimum tax: $500 on gross receipts under $100,000, rising to $2,000 at $1,000,000 or more (NJ Division of Taxation).",
    ],
    sources: [
      {
        label: "NJ Division of Taxation, Corporation Filing Responsibilities (CBT rates and minimums)",
        url: "https://www.nj.gov/treasury/taxation/ot4.shtml",
      },
      {
        label: "2025 NJ-1065 instructions (partnership filing fee)",
        url: "https://www.nj.gov/treasury/taxation/pdf/current/1065i.pdf",
      },
    ],
    lastVerified: "2026-10-08",
    verificationNote:
      "Fee and rate language quoted from the Division of Taxation page and the 2025 NJ-1065 instruction PDF, both captured live on 2026-10-08.",
  },
  missouri: {
    seoTitle:
      "Missouri Tax Guide for Side Businesses: 4.7% Top Rate, 4.225% Sales Tax | Invisible Exit",
    seoDescription:
      "Missouri's 2025 top individual income tax rate is 4.7% with no tax below $1,313 of taxable income; state sales tax is 4.225%. Figures from the Missouri DOR.",
    heading: "Missouri Income Tax Brackets, the $100 Estimated-Payment Trigger, and Sales Tax",
    paragraphs: [
      "Missouri's individual income tax is indexed for inflation, and the Department of Revenue's published 2025 rate chart tops out at 4.7%. The same chart shows how gently the brackets start: taxable income from $0 to $1,313 owes $0, and the rate only reaches the top 4.70% marginal band on taxable income over $9,191. A side business that nets, say, a few thousand dollars a year on top of a salary pays Missouri tax only on what falls into those upper slices, and the chart is printed on the department's own Tax Rate Chart and year-changes pages.",
      "The filing question that catches side businesses is estimated tax. Under Missouri law, quoting the Department of Revenue's reference guide: \"a taxpayer must file Form MO-1040ES, Estimated Tax Declaration for Individuals, if their tax liability is expected to be $100 or more and Missouri tax is not withheld.\" A $100 expected liability is a low bar; a profitable side business with no Missouri withholding will usually cross it in its first profitable quarter.",
      "On the sales side, Missouri's state sales and use tax rate is 4.225%, and the Department of Revenue is explicit that cities, counties and certain districts add local sales taxes on top, so what you collect depends on the combined rate at the seller's location. If you sell taxable goods or services in Missouri, use the department's rate tables rather than the bare 4.225% state figure when you set checkout prices.",
    ],
    bullets: [
      "Top individual income tax rate: 4.7% for 2025; taxable income up to $1,313 owes $0 (Missouri DOR rate chart).",
      "Top 4.70% marginal band applies to taxable income over $9,191 (Missouri DOR rate chart).",
      "Form MO-1040ES required if expected liability is $100 or more and Missouri tax is not withheld (DOR reference guide).",
      "State sales and use tax: 4.225%, plus local taxes that vary by location (Missouri DOR).",
    ],
    sources: [
      {
        label: "Missouri DOR, Individual Income Tax Year Changes (2025 rate chart)",
        url: "https://dor.mo.gov/taxation/individual/tax-types/income/year-changes/",
      },
      {
        label: "Missouri DOR, 4711 Income Tax Reference Guide (MO-1040ES trigger)",
        url: "https://dor.mo.gov/forms/4711_2023.pdf",
      },
      {
        label: "Missouri DOR, Sales/Use Tax (state rate and local add-ons)",
        url: "https://dor.mo.gov/taxation/business/tax-types/sales-use/",
      },
    ],
    lastVerified: "2026-10-08",
  },
  kentucky: {
    seoTitle:
      "Kentucky Tax Guide for Side Businesses: 4% Flat Rate and the $175 LLET | Invisible Exit",
    seoDescription:
      "Kentucky's individual income tax is a flat 4% (KRS 141.019), LLCs owe the $175 minimum Limited Liability Entity Tax, and sales tax is 6% with no local add-ons.",
    heading: "Kentucky's Flat 4% Income Tax, the $175 Entity Tax, and 6% Sales Tax",
    paragraphs: [
      "Kentucky's individual income tax is a flat tax. The Department of Revenue states the rate as \"four (4) percent\" of taxable income under KRS 141.019, with no brackets to navigate. For a side business taxed on the owner's personal return, every additional dollar of Kentucky taxable income costs the same 4 cents at the state level, which makes the state one of the simpler ones to plan for; the department's own estimate voucher threshold aside, the flat rate is the whole computation.",
      "LLCs in Kentucky also meet the Limited Liability Entity Tax (LLET). The Department of Revenue's LLET page sets a $175 minimum: a company whose total gross receipts or total gross profits are $3 million or less \"just pays a $175 minimum LLET.\" Above that scale, tax is computed at 0.095% of Kentucky gross receipts or 0.75% of Kentucky gross profits, and the company pays the smaller of the two. A typical side-business LLC lands in the minimum category, so the recurring entity-level cost is $175 a year.",
      "Sales tax is a single statewide number: the Department of Revenue imposes Kentucky Sales and Use Tax \"at the rate of 6 percent of gross receipts or purchase price\" and notes there are no local sales and use taxes in Kentucky. That combination, one flat income rate, a $175 entity minimum, and no local sales-tax patchwork, is why Kentucky consistently ranks among the least complicated states in which to run a small side business.",
    ],
    bullets: [
      "Individual income tax: flat 4% under KRS 141.019 (Kentucky Department of Revenue).",
      "LLET minimum: $175; companies with total gross receipts or profits of $3 million or less pay just the minimum (KY Department of Revenue).",
      "Above $3 million, LLET is 0.095% of gross receipts or 0.75% of gross profits, whichever is smaller (KY Department of Revenue).",
      "Sales and use tax: 6% statewide, with no local sales or use taxes (KY Department of Revenue).",
    ],
    sources: [
      {
        label: "Kentucky DOR, Individual Income Tax (4% rate, KRS 141.019)",
        url: "https://revenue.ky.gov/Individual/Individual-Income-Tax/Pages/default.aspx",
      },
      {
        label: "Kentucky DOR, Corporation Income and Limited Liability Entity Tax",
        url: "https://revenue.ky.gov/Business/Corporation-Income-and-Limited-Liability-Entity-Tax/Pages/default.aspx",
      },
      {
        label: "Kentucky DOR, Sales & Use Tax (6%, no local taxes)",
        url: "https://revenue.ky.gov/Business/Sales-Use-Tax/Pages/default.aspx",
      },
    ],
    lastVerified: "2026-10-08",
  },
  california: {
    seoTitle:
      "California LLC Tax: The $800 Annual Tax and the LLC Fee Bands | Invisible Exit",
    seoDescription:
      "California charges every LLC an $800 annual tax plus a fee from $900 to $11,790 once California income passes $250,000. Rates and due dates from the FTB.",
    heading: "California's $800 Annual LLC Tax, the Fee Bands, and the Due Dates",
    paragraphs: [
      "California's best-known business tax hits LLCs directly. The Franchise Tax Board's LLC page states that every LLC doing business or organized in California must pay an annual tax of $800, and that the tax \"will be due, even if you are not conducting business, until you cancel your LLC.\" For a first year, the FTB gives you until the 15th day of the 4th month from the date you file with the Secretary of State to pay it; after that, the $800 is due by the 15th day of the 4th month of each taxable year. The first-year exception the FTB describes applied to tax years beginning on or after January 1, 2021 and before January 1, 2024, so a new LLC formed today should plan on owing the $800 in year one.",
      "Above $250,000 of total California income, a second charge appears: the LLC fee. The FTB's published bands are $900 at $250,000 to $499,999; $2,500 at $500,000 to $999,999; $6,000 at $1,000,000 to $4,999,999; and $11,790 at $5,000,000 or more. LLCs must estimate and pay this fee by the 15th day of the 6th month of the current tax year, which arrives before you necessarily know your final number, so the FTB expects an estimate and true-up on the return.",
      "The planning takeaway for a California side business is that the state's floor is the highest in the country: $800 before you earn a dollar, and the fee schedule means a genuinely profitable LLC's state bill can exceed its federal-rate expectation. If you are searching \"California LLC $800 tax\" or \"CA LLC fee brackets\", the figures above are the FTB's current published ones.",
    ],
    bullets: [
      "Annual LLC tax: $800, due even with no business activity, until cancellation (California FTB).",
      "First-year $800 due by the 15th day of the 4th month from SOS filing; subsequent years by the 15th day of the 4th month of the tax year (FTB).",
      "LLC fee: $900 at $250k-$499,999; $2,500 at $500k-$999,999; $6,000 at $1M-$4,999,999; $11,790 at $5M or more of California income (FTB).",
      "LLC fee estimated and paid by the 15th day of the 6th month of the current tax year (FTB).",
    ],
    sources: [
      {
        label: "California FTB, Limited Liability Company (annual tax and LLC fee)",
        url: "https://www.ftb.ca.gov/file/business/types/limited-liability-company/index.html",
      },
    ],
    lastVerified: "2026-10-08",
  },
  washington: {
    seoTitle:
      "Washington Tax Guide for Side Businesses: B&O Rates for Services and Retail | Invisible Exit",
    seoDescription:
      "Washington taxes business gross receipts, not profits: 1.5% B&O on services under $1M, 0.471% retailing, plus sales tax changes from ESSB 5814. WA DOR figures.",
    heading: "Washington's B&O Tax: Why Gross Receipts, Not Profit, Is What Gets Taxed",
    paragraphs: [
      "Washington has what its Department of Revenue calls \"a unique business tax structure\": most businesses pay a gross receipts tax known as business and occupation (B&O) tax. Because the tax is on gross income, the department notes that businesses cannot deduct expenses such as labor, materials, taxes, or other costs of doing business. A side business running at a thin margin feels this differently from a high-margin one: the B&O rate applies whether the receipts came with profit attached or not.",
      "The rate depends on classification, and the department's published table matters most at the small end. Service and other activities with less than $1,000,000 in prior-year income pay 1.5% (.015); that same classification pays 1.75% at $1,000,000 to $4,999,999 and 2.1% at $5 million or more. Retailing is 0.471% (.00471) and both manufacturing and wholesaling are 0.484% (.00484). A freelancing or consulting side business usually lands in the service classification at the 1.5% rate; a business selling goods pays the retailing rate instead, plus it collects sales tax from customers.",
      "One recent change to know about: the department announces that starting October 1, 2025, some business services are subject to retail sales tax under state law ESSB 5814, meaning vendors add sales tax to those services and sellers must collect it. If your service business just crossed into a taxed category, your invoicing needs to change, not just your B&O return. Confirm your classifications in the department's tax-rate lookup before you set prices.",
    ],
    bullets: [
      "B&O tax is a gross receipts tax; expenses cannot be deducted (Washington DOR).",
      "Service and other activities: 1.5% under $1M prior-year income; 1.75% at $1M-$4,999,999; 2.1% at $5M or more (WA DOR classifications table).",
      "Retailing 0.471%; manufacturing and wholesaling 0.484% (WA DOR classifications table).",
      "From October 1, 2025, some business services became subject to retail sales tax under ESSB 5814 (WA DOR).",
    ],
    sources: [
      {
        label: "Washington DOR, Business & occupation tax classifications",
        url: "https://dor.wa.gov/taxes-rates/business-occupation-tax/business-occupation-tax-classifications",
      },
      {
        label: "Washington DOR, Business & occupation tax (gross receipts basis)",
        url: "https://dor.wa.gov/taxes-rates/business-occupation-tax",
      },
      {
        label: "Washington DOR, Retail sales tax (ESSB 5814 services change)",
        url: "https://dor.wa.gov/taxes-rates/retail-sales-tax",
      },
    ],
    lastVerified: "2026-10-08",
  },
};

// Shared federal context appended to every depth section (rendered by TaxGuidePage.tsx).
export const taxDepthFederal = {
  heading: "The Federal Layer Every State Sits On",
  paragraphs: [
    "State figures are only half the bill. The IRS taxes self-employment income at 15.3% for Social Security and Medicare (12.4% Social Security plus 2.9% Medicare), with only the first $168,600 of combined wages, tips and net earnings subject to the Social Security part, per the IRS self-employment tax page. You can deduct the employer-equivalent portion of that tax when calculating adjusted gross income, which takes a little of the sting out.",
    "Estimated payments follow the IRS schedule: Form 1040-ES requires payments if you expect to owe at least $1,000 in tax, and the 2026 form's safe harbor is the smaller of 90% of the current-year tax or 100% of the prior-year tax (110% instead of 100% if prior-year AGI exceeded $150,000, or $75,000 for married filing separately). The four 2026 payment dates are April 15, June 15, September 15, and January 15, 2027. Your state's own estimated-payment rules stack on top of these, not instead of them.",
  ],
  bullets: [
    "Self-employment tax: 15.3% total; Social Security part applies only to the first $168,600 of combined wages and net earnings (IRS).",
    "Estimated tax required if you expect to owe at least $1,000 (IRS Form 1040-ES).",
    "Safe harbor: the smaller of 90% of current-year tax or 100% of prior-year tax; 110% of prior year if prior AGI topped $150,000 ($75,000 MFS) (IRS).",
    "2026 payment dates: April 15, June 15, September 15, and January 15, 2027 (IRS).",
  ],
  sources: [
    {
      label: "IRS, Self-employment tax (Social Security and Medicare taxes)",
      url: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes",
    },
    {
      label: "IRS, Form 1040-ES (2026) estimated tax for individuals",
      url: "https://www.irs.gov/forms-pubs/about-form-1040-es",
    },
  ],
  lastVerified: "2026-10-08",
};
