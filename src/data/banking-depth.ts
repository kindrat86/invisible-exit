// Depth sections for high-impression /banking/<state> pages (organic depth slice 2026-10-05).
// GUARDRAIL 5.1: every number in this file resolves to a source in
// research/banking-depth-claims-20261005.json. Do not add unsourced figures.
// Claims and access dates are recorded per source. URL delta: 0 (existing pages only).

export interface DepthSource {
  label: string;
  url: string;
}

export interface BankingDepth {
  seoTitle: string;
  seoDescription: string;
  heading: string;
  paragraphs: string[];
  bullets: string[];
  sources: DepthSource[];
  lastVerified: string;
  verificationNote?: string;
}

export const bankingDepth: Record<string, BankingDepth> = {
  wisconsin: {
    seoTitle:
      "Business Banking in Wisconsin (WI): Best Banks for WI LLCs | Invisible Exit",
    seoDescription:
      "What Wisconsin charges to form an LLC ($170 paper, $130 online per the state DFI fee table), plus the best banks for your WI LLC.",
    heading: "Wisconsin LLC Banking: What the State Charges and How to File",
    paragraphs: [
      "Wisconsin processes LLC filings through the Department of Financial Institutions (DFI). Filing the Articles of Organization costs $170 on paper, or $130 through DFI's online filing system, according to the department's published corporation fee table. The annual report is $40, dropping to $25 when filed online. Those are the state's charges, and they are separate from anything a bank charges you for the account itself.",
      "In a hurry? The same DFI fee table prices next-day expedited processing at $100, with in-person counter service in Madison at $250 for four-hour turnaround and $500 for one-hour turnaround. For most side businesses and LLCs, the standard $130 online filing is the practical route: the expedite fees buy speed, not acceptance.",
      "If a Wisconsin business debit card is a must-have for how you operate, confirm at account opening that the card draws directly from your business checking account and works with your payment processor. None of the state's filing requirements involve your card choice, so this is a pure bank-comparison decision.",
    ],
    bullets: [
      "Articles of Organization: $170 paper, $130 online (Wisconsin DFI fee table).",
      "Annual report: $40 paper, $25 online (Wisconsin DFI fee table).",
      "FDIC deposit insurance covers at least $250,000 per depositor, per insured bank (FDIC).",
      "An EIN from the IRS is free and issued online (IRS).",
    ],
    sources: [
      {
        label: "Wisconsin DFI, Corporation Fees",
        url: "https://dfi.wi.gov/Pages/BusinessServices/BusinessEntities/Fees.aspx",
      },
      {
        label: "FDIC deposit insurance",
        url: "https://www.fdic.gov/deposit-insurance",
      },
      {
        label: "IRS: Get an EIN",
        url: "https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number",
      },
    ],
    lastVerified: "2026-10-05",
    verificationNote:
      "Fee amounts read from the official DFI fee table via its Internet Archive snapshot of 2026-09-17 after the live page would not resolve from our network.",
  },
  missouri: {
    seoTitle:
      "Business Banking in Missouri (MO): Best Banks for MO LLCs | Invisible Exit",
    seoDescription:
      "Missouri LLC formation is $105 paper or $50 online per the Secretary of State, plus the best banks for MO LLCs. Fees verified from official sources.",
    heading: "Missouri LLC Banking: Online Filing Savings and Annual Reports",
    paragraphs: [
      "Missouri's Secretary of State charges $105 to file LLC Articles of Organization on paper and $50 online. The state's own FAQ describes the difference as a savings of \"$55.00\" when an LLC files online, and the official Chapter 347 fee schedule (Limited Liability Companies) lists the same $105 paper certificate fee. For both formation and the annual report, filing online is the cheaper route in Missouri.",
      "After formation, the annual registration report is $45 on paper and $20 online, per the Chapter 347 fee schedule. Set a calendar reminder: skipping the annual report is how good standing is lost, and the state charges reinstatement fees to get it back.",
      "The fee schedule also carries a program called Startup for Soldiers. Quoting the official document: \"All active duty military in Missouri, including those in the Missouri National Guard, may now create new businesses without paying a filing fee with the Office of the Secretary of State.\"",
      "Operating under a trade name? Missouri's FAQ is explicit that registration is required: \"Any person or entity which is doing business under a name other than its true name must register that fictitious name.\" Resolve the DBA before you open the bank account, because banks typically want your formation paperwork to match the name on the account.",
      "Searches like \"banks for small business St. Louis\" or \"business bank account Columbia MO\" reflect a branch-footprint reality: the national banks above serve all Missouri cities, while the online options (Mercury, Relay, Novo) have no branches at all and work the same in Springfield as in St. Louis. If you never visit a branch, the online banks' fee structure is the comparison that matters.",
    ],
    bullets: [
      "LLC Articles of Organization: $105 paper, $50 online (Missouri Secretary of State FAQ and Chapter 347 fee schedule).",
      "Annual registration report: $45 paper, $20 online (Chapter 347 fee schedule).",
      "Active-duty military and Missouri National Guard members may form a business without a filing fee (Startup for Soldiers).",
      "FDIC deposit insurance covers at least $250,000 per depositor, per insured bank (FDIC).",
      "An EIN from the IRS is free and issued online (IRS).",
    ],
    sources: [
      {
        label: "Missouri Secretary of State, Corporations FAQ",
        url: "https://www.sos.mo.gov/business/faqs",
      },
      {
        label: "Missouri Secretary of State, Schedule of Fees and Charges (Chapter 347)",
        url: "https://www.sos.mo.gov/CMSImages/Business/fees.pdf",
      },
      {
        label: "FDIC deposit insurance",
        url: "https://www.fdic.gov/deposit-insurance",
      },
      {
        label: "IRS: Get an EIN",
        url: "https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number",
      },
    ],
    lastVerified: "2026-10-05",
    verificationNote:
      "FAQ page captured live 2026-10-05; fee schedule PDF read via its Internet Archive snapshot after the live download returned an error page.",
  },
  vermont: {
    seoTitle:
      "Business Banking in Vermont (VT): Best Banks for VT LLCs | Invisible Exit",
    seoDescription:
      "Vermont charges $155 to form an LLC and $45 a year for the annual report, per the Secretary of State fee table, plus the best banks for your VT LLC.",
    heading: "Vermont LLC Banking: $155 to Form, $45 a Year, and the Foreign-Qualification Note",
    paragraphs: [
      "Vermont's Secretary of State fee table prices LLC Articles of Organization at $155 (11 V.S.A. § 4023) and the annual report at $45 (11 V.S.A. § 4033), under the domestic limited liability company section of the official schedule. Vermont does not publish a separate discounted online-formation price on that table the way Wisconsin and Missouri do; the amounts listed are the amounts listed.",
      "For context across the states this guide researches in depth: Vermont's $45 annual report is higher than Wisconsin's $40, above Missouri's $20 online rate but equal to Missouri's $45 paper rate, and far above Minnesota's $0 annual renewal. If recurring state cost is a deciding factor in where you form, those four numbers are the comparison.",
      "Several banking searches in Vermont also mention New Hampshire. If your LLC operates across the Connecticut River, one row in the fee table matters: Vermont prices a Statement of Foreign Qualification for LLCs at $170 (11 V.S.A. § 3302). That is the filing an out-of-state LLC uses to register in Vermont, and it is a reminder that where you operate can create filing obligations beyond where you formed. Your formation state and your bank choice do not have to match; check the registration question against where the business actually operates.",
    ],
    bullets: [
      "Articles of Organization: $155 (11 V.S.A. § 4023, Vermont Secretary of State fee table).",
      "Annual report: $45 (11 V.S.A. § 4033).",
      "Statement of Foreign Qualification for an LLC: $170 (11 V.S.A. § 3302).",
      "FDIC deposit insurance covers at least $250,000 per depositor, per insured bank (FDIC).",
      "An EIN from the IRS is free and issued online (IRS).",
    ],
    sources: [
      {
        label: "Vermont Secretary of State, Fees",
        url: "https://sos.vermont.gov/business-services/fees-statutes/",
      },
      {
        label: "FDIC deposit insurance",
        url: "https://www.fdic.gov/deposit-insurance",
      },
      {
        label: "IRS: Get an EIN",
        url: "https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number",
      },
    ],
    lastVerified: "2026-10-05",
  },
  minnesota: {
    seoTitle:
      "Business Banking in Minnesota (MN): Best Banks for MN LLCs | Invisible Exit",
    seoDescription:
      "Minnesota LLC formation costs $135 by mail or $155 online with a $0 annual renewal, per the Secretary of State fee schedule, plus the best banks for MN LLCs.",
    heading: "Minnesota LLC Banking: $0 Annual Renewal and the Wire-Transfer Check",
    paragraphs: [
      "Minnesota organizes LLCs under Chapter 322C, and its official business filing fee schedule lists Articles of Organization at $135 by mail and $155 online or in person. Unusually, mail filing is the cheaper option; in Wisconsin and Missouri, online filing is the discount route. The annual renewal is $0, which makes Minnesota the lowest-recurring-cost state among the four this guide researches in depth.",
      "One honesty note before you rely on those numbers: the live Minnesota fee-schedule page is protected by a bot check as of 2026-10-05, so the figures above were verified from the Secretary of State's own page as archived on 2024-12-27. Confirm the amount at filing time on the state's site.",
      "The top Minnesota banking query that reaches this page is about wire transfers. Wire pricing is set bank by bank, not by the state, so if wires are central to how your business moves money, compare incoming-wire fees and same-day cutoff times across your candidate banks before opening the account; the published comparison tables above do not capture wire pricing. What federal policy does establish is the safety floor: FDIC deposit insurance covers at least $250,000 per depositor, per insured bank, and that protection follows the deposit, not the payment method that funded it.",
    ],
    bullets: [
      "Articles of Organization, Minnesota LLC (Chapter 322C): $135 mail, $155 online/in person (official fee schedule, archived 2024-12-27).",
      "Annual renewal: $0 (same schedule).",
      "FDIC deposit insurance covers at least $250,000 per depositor, per insured bank (FDIC).",
      "An EIN from the IRS is free and issued online (IRS).",
    ],
    sources: [
      {
        label: "Minnesota Secretary of State, Business Filing & Certification Fee Schedule",
        url: "https://www.sos.state.mn.us/business-liens/business-forms-fees/business-filing-certification-fee-schedule/",
      },
      {
        label: "FDIC deposit insurance",
        url: "https://www.fdic.gov/deposit-insurance",
      },
      {
        label: "IRS: Get an EIN",
        url: "https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number",
      },
    ],
    lastVerified: "2026-10-05",
    verificationNote:
      "State fee amounts verified from the official schedule as archived 2024-12-27 (Internet Archive); the live page was bot-gated on 2026-10-05. Re-verify at filing time.",
  },
};
