/**
 * Non-Compete Matrix: profession × state enforceability cross-reference for pSEO.
 *
 * Generates 100 pages (10 key professions × 10 key states) analyzing how
 * non-compete law interacts with each profession's specific risk profile.
 * Combines state-level enforceability data from state-guides.ts with
 * profession-specific legal considerations.
 *
 * Consume via:
 *   import { nonCompeteMatrix, generateNonCompeteMatrix } from "@/data/non-compete-matrix";
 *
 * LEGAL DISCLAIMER: This information reflects general non-compete enforcement patterns
 * as of 2024-2025 and is NOT legal advice. Non-compete law is rapidly evolving (the
 * FTC's proposed nationwide ban, state-level reforms, etc.). Always consult a licensed
 * employment attorney in your jurisdiction before relying on any of this analysis.
 */

import { stateGuides, type StateGuide } from "./state-guides";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NonCompeteMatrixEntry {
  slug: string; // e.g., "software-engineers-california"
  profession: string;
  state: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  canBuild: boolean;
  enforceabilityStatus: string;
  keyRisks: string[];
  safeHarbors: string[];
  faqs: { question: string; answer: string }[];
}

// ---------------------------------------------------------------------------
// Profession non-compete profiles
// ---------------------------------------------------------------------------

interface ProfessionProfile {
  /** Display name (matches task specification). */
  name: string;
  /** URL-safe slug derived from name. */
  slug: string;
  /** Clauses typically found in this profession's employment agreements. */
  typicalClauses: string[];
  /** Risks inherent to the profession regardless of state. */
  inherentRisks: string[];
  /** Mitigation strategies that apply across all states. */
  inherentSafeHarbors: string[];
  /** Special regulatory framework, if any (bar rules, FINRA, HIPAA, etc.). */
  specialRules: string;
}

const PROFESSION_PROFILES: ProfessionProfile[] = [
  {
    name: "Software Engineers",
    slug: "software-engineers",
    typicalClauses: [
      "Invention assignment agreements claiming ownership of side projects",
      "Moonlighting prohibitions restricting outside employment",
      "Non-solicit clauses covering coworkers and customers",
    ],
    inherentRisks: [
      "Invention assignment clauses may claim ownership of code you write on personal time if broadly drafted",
      "Using familiar code patterns or libraries from work can blur IP ownership lines",
      "GitHub commit history on employer devices can be subpoenaed in disputes",
    ],
    inherentSafeHarbors: [
      "Build on a separate personal device using a different tech stack than your employer's",
      "Document your personal-time development with timestamps and personal resources",
      "Review your invention assignment agreement for the 'pre-existing inventions' schedule — list your side project there",
    ],
    specialRules:
      "No profession-specific non-compete shield, but software engineers are the most common targets of invention assignment enforcement.",
  },
  {
    name: "Product Managers",
    slug: "product-managers",
    typicalClauses: [
      "Non-compete covering the same product category or industry",
      "Confidentiality of roadmap, pricing, and strategy",
      "Non-solicit of team members and customers",
    ],
    inherentRisks: [
      "Knowledge of employer's product roadmap and competitive strategy is considered proprietary",
      "Building tools for the same user segment as your employer risks trade secret claims",
      "PMs often have access to customer data and feedback that can inadvertently inform side projects",
    ],
    inherentSafeHarbors: [
      "Target a completely different customer segment or industry than your employer",
      "Never reference or reuse internal strategy documents, roadmaps, or competitive analysis",
      "Use no-code tools or partner with a developer rather than using employer engineering resources",
    ],
    specialRules:
      "PMs face fewer invention assignment risks than engineers but greater trade secret exposure due to broad information access.",
  },
  {
    name: "Lawyers",
    slug: "lawyers",
    typicalClauses: [
      "Non-solicit of clients (enforceable and common)",
      "Confidentiality of client information and case strategy",
      "Fee-splitting prohibitions",
    ],
    inherentRisks: [
      "Soliciting your firm's clients for a SaaS product can trigger breach of fiduciary duty claims",
      "Providing legal advice through your SaaS risks unauthorized practice of law (UPL) charges",
      "Using firm resources (Westlaw, LexisNexis research) for side-business development is a violation",
    ],
    inherentSafeHarbors: [
      "ABA Model Rule 5.6 prohibits non-competes that restrict a lawyer's right to practice — non-competes between lawyers are unenforceable in ALL states",
      "Build tools that assist legal workflows (document automation, compliance tracking) rather than dispensing legal advice",
      "Target a client segment entirely separate from your firm's practice area",
    ],
    specialRules:
      "ABA Model Rule of Professional Conduct 5.6(a) renders non-compete agreements between lawyers and law firms unenforceable in every U.S. jurisdiction. This is the strongest profession-specific protection available.",
  },
  {
    name: "Doctors",
    slug: "doctors",
    typicalClauses: [
      "Geographic non-compete restricting practice within a radius",
      "Non-solicit of patients and referral sources",
      "Confidentiality of patient information (HIPAA + contract)",
    ],
    inherentRisks: [
      "Handling any patient data in your SaaS triggers HIPAA compliance requirements with severe penalties",
      "Non-solicit of patients is strictly enforced even in states that ban employee non-competes",
      "Medical staff bylaws may contain restrictive covenants separate from employment agreements",
    ],
    inherentSafeHarbors: [
      "Build tools that never touch Protected Health Information (PHI) — focus on workflow, education, or compliance",
      "Several states (CA, DE, MA, NH, TN for some specialties) ban or limit physician non-competes specifically",
      "Target healthcare administration rather than clinical care delivery to reduce regulatory burden",
    ],
    specialRules:
      "Physician non-competes face growing legislative restrictions. California bans them outright. Other states have enacted or are considering physician-specific bans or caps.",
  },
  {
    name: "Financial Analysts",
    slug: "financial-analysts",
    typicalClauses: [
      "Non-compete covering the same financial sector",
      "Non-disclosure of models, forecasts, and client data",
      "FINRA Form U-5 reporting requirements for departure",
      "Garden leave provisions requiring notice periods",
    ],
    inherentRisks: [
      "Material Non-Public Information (MNPI) exposure — using employer data even inadvertently can trigger SEC enforcement",
      "FINRA registered representatives face additional regulatory layers beyond state non-compete law",
      "Client lists and portfolio strategies are treated as trade secrets with strong enforcement",
    ],
    inherentSafeHarbors: [
      "Build tools that only use user-supplied or public market data — never employer proprietary datasets",
      "FINRA Rule 204 limits post-employment restrictions on registered reps in some contexts",
      "Use clean-room development practices: no employer models, data, or tools touch your side project",
    ],
    specialRules:
      "FINRA-registered financial professionals face overlapping federal (SEC/FINRA) and state regulatory frameworks. Non-compete enforceability for registered reps is governed by both state law and FINRA rules.",
  },
  {
    name: "Accountants",
    slug: "accountants",
    typicalClauses: [
      "Non-solicit of clients (heavily enforced)",
      "Confidentiality of client financial data and methodologies",
      "Non-compete at partner/senior level covering accounting services",
    ],
    inherentRisks: [
      "Client lists and relationships are the core asset — soliciting them triggers strong enforcement",
      "Using firm-developed methodologies or templates in your SaaS is IP infringement",
      "AICPA Code of Professional Conduct imposes ethical duties beyond contract law",
    ],
    inherentSafeHarbors: [
      "Target small businesses or individuals outside your firm's client base entirely",
      "Build automation tools (reconciliation, deadline tracking) that don't compete with accounting services",
      "Use only public APIs and user-supplied data — never employer client data",
    ],
    specialRules:
      "Partner-level non-competes in accounting firms are among the most aggressively enforced, but tools targeting non-competing segments face minimal risk.",
  },
  {
    name: "Marketers",
    slug: "marketers",
    typicalClauses: [
      "Non-solicit of clients and agency contacts",
      "Confidentiality of campaign data, strategies, and pricing",
      "Non-compete covering the same industry vertical",
    ],
    inherentRisks: [
      "Campaign performance data and customer lists are treated as trade secrets",
      "Using employer's proprietary strategies or frameworks in your SaaS creates IP exposure",
      "Marketing tools that target the same industry as your employer risk direct competition claims",
    ],
    inherentSafeHarbors: [
      "Build tools for a different market segment or industry than your employer serves",
      "Use no-code platforms (Bubble, Softr) to develop without touching employer engineering resources",
      "Never use employer's campaign data, A/B test results, or customer insights in your product",
    ],
    specialRules:
      "Marketers face moderate non-compete risk. Marketing roles less commonly have enforceable non-competes than sales or finance, but non-solicit and confidentiality clauses are standard.",
  },
  {
    name: "Sales Managers",
    slug: "sales-managers",
    typicalClauses: [
      "Non-solicit of customers and prospects (strongly enforced)",
      "Non-compete covering the same territory or product line",
      "Confidentiality of pricing, pipeline, and customer data",
      "Commission clawback or forfeiture provisions",
    ],
    inherentRisks: [
      "Customer and prospect lists are the highest-enforced trade secret category — courts routinely enforce non-solicit",
      "CRM data (Salesforce, HubSpot) exported to your SaaS is clear-cut theft",
      "Sales playbooks and objection-handling scripts may be proprietary employer IP",
    ],
    inherentSafeHarbors: [
      "Build tools that serve a completely different customer base than your employer's",
      "Never export, copy, or reference employer CRM data in your side business",
      "Focus on sales enablement tools (templates, training) rather than customer-facing platforms",
    ],
    specialRules:
      "Sales non-solicit agreements are the most aggressively enforced restrictive covenants in U.S. employment law. Even states that ban non-competes generally enforce customer non-solicit provisions.",
  },
  {
    name: "Consultants",
    slug: "consultants",
    typicalClauses: [
      "Broad non-compete covering consulting services (MBB firms: 12-24 months)",
      "Non-solicit of clients and employees (12-24 months)",
      "IP assignment covering methodologies, frameworks, and deliverables",
      "Garden leave with partial compensation",
    ],
    inherentRisks: [
      "Top consulting firms (McKinsey, BCG, Bain, Deloitte) have the most aggressive non-compete enforcement teams",
      "Proprietary frameworks and methodologies are core firm IP — building SaaS that productizes them is high-risk",
      "Client relationships developed through consulting work belong to the firm, not the consultant",
    ],
    inherentSafeHarbors: [
      "Build tools completely unrelated to your firm's service offerings and methodologies",
      "Target a different company-size segment (e.g., SMB if your firm serves enterprise)",
      "Consider the consulting firm's garden leave period as a natural transition window to build before launching",
    ],
    specialRules:
      "Management consulting firms are the most aggressive enforcers of non-competes and non-solicits in professional services. IP assignment clauses are typically the broadest in the industry.",
  },
  {
    name: "Designers",
    slug: "designers",
    typicalClauses: [
      "IP assignment covering creative work and design assets",
      "Non-solicit of clients (for agency designers)",
      "Confidentiality of brand guidelines and design systems",
    ],
    inherentRisks: [
      "IP assignment clauses may claim ownership of designs created during employment, even on personal time",
      "Reusing employer's design system components or brand assets is clear-cut IP infringement",
      "Portfolio pieces created at work may be restricted from use in promoting your side business",
    ],
    inherentSafeHarbors: [
      "Create all side-business design assets from scratch — never reuse employer templates or components",
      "Use no-code tools (Webflow, Framer) to ship products without writing code",
      "Document personal-time creation with version history and personal tool licenses",
    ],
    specialRules:
      "Designers face IP assignment risks similar to engineers. The 'works made for hire' doctrine and invention assignment clauses can capture creative output beyond code.",
  },
];

// ---------------------------------------------------------------------------
// State configuration (10 key states)
// ---------------------------------------------------------------------------

const KEY_STATE_SLUGS = [
  "california",
  "texas",
  "new-york",
  "florida",
  "illinois",
  "washington",
  "georgia",
  "massachusetts",
  "colorado",
  "north-carolina",
] as const;

function findState(slug: string): StateGuide | undefined {
  return stateGuides.find((s) => s.slug === slug);
}

// ---------------------------------------------------------------------------
// State-specific risk and safe-harbor data
// ---------------------------------------------------------------------------

interface StateNCProfile {
  /** Additional risks specific to this state's enforcement climate. */
  stateRisks: string[];
  /** Protections available under this state's law. */
  stateSafeHarbors: string[];
}

function getStateProfile(state: StateGuide): StateNCProfile {
  switch (state.slug) {
    case "california":
      return {
        stateRisks: [
          "California's $800 annual LLC franchise tax applies regardless of profit",
          "Invention assignment clauses may still be enforceable even though non-competes are void",
        ],
        stateSafeHarbors: [
          "Cal. Bus. & Prof. Code §16600 voids non-competes — the strongest protection in the U.S.",
          "Labor Code §2870 protects employee inventions created on personal time with personal resources (with exceptions for employer's business)",
        ],
      };

    case "texas":
      return {
        stateRisks: [
          "Texas enforces non-competes that are ancillary to an otherwise enforceable agreement and reasonable in scope, geography, and duration (Tex. Bus. & Com. Code §15.50)",
          "Recent Texas reforms (2023-2025) have tightened reasonableness standards but enforcement remains strong for high earners",
        ],
        stateSafeHarbors: [
          "Texas requires the non-compete to be tied to an enforceable agreement (usually a confidentiality or non-solicit clause) — if that underlying agreement fails, the non-compete may also fail",
          "No state income tax means your SaaS profits are not taxed at the state level",
        ],
      };

    case "new-york":
      return {
        stateRisks: [
          "NY courts enforce non-competes if reasonable in duration, geography, and scope, though recent reforms (2023+) restrict use for lower-wage workers",
          "NYC has additional worker protection laws that may limit enforceability within the five boroughs",
        ],
        stateSafeHarbors: [
          "NY requires employer consideration (continued employment alone may not suffice for existing employees)",
          "Recent NY legislation restricts non-competes for workers earning below a threshold (check current limits)",
          "Courts apply 'blue pencil' doctrine — may modify rather than void overly broad agreements",
        ],
      };

    case "florida":
      return {
        stateRisks: [
          "Florida strongly enforces non-competes under Fla. Stat. §542.335 — courts routinely uphold reasonable restrictions",
          "Florida's statutory framework presumes enforceability if the employer shows a legitimate business interest",
        ],
        stateSafeHarbors: [
          "No state income tax reduces the financial burden of side-business operations",
          "Fla. Stat. §542.335 requires the employer to plead and prove a legitimate business interest — vague claims may not survive",
          "Florida courts will reduce overly broad restrictions rather than void the entire agreement (reformation)",
        ],
      };

    case "illinois":
      return {
        stateRisks: [
          "Illinois enforces non-competes for workers earning above $75K/year (Freedom to Work Act, 2023 reform)",
          "The $75K threshold increases annually — verify current limits before relying on it",
        ],
        stateSafeHarbors: [
          "Illinois bans non-competes for workers earning under $75K/year (rising to $90K by 2037) — covers many professionals",
          "The Freedom to Work Act requires employers to advise employees in writing to consult an attorney before signing",
          "Illinois courts apply strict 'reasonableness' scrutiny to duration and geographic scope",
        ],
      };

    case "washington":
      return {
        stateRisks: [
          "Washington enforces non-competes for workers earning above approximately $120K/year (threshold adjusts annually)",
          "WA requires a 14-day advance notice before requiring a non-compete as a condition of employment",
        ],
        stateSafeHarbors: [
          "Non-competes are void for workers below the ~$120K earnings threshold (RCW 49.62)",
          "WA law requires garden leave compensation if the employer enforces a non-compete post-termination",
          "No personal wage income tax (7% capital gains tax applies to investment gains over ~$270K)",
        ],
      };

    case "georgia":
      return {
        stateRisks: [
          "Georgia's Restrictive Covenants Act (O.C.G.A. §13-8-50 et seq., effective 2011) provides a favorable framework for employers to enforce non-competes",
          "Georgia courts can 'blue pencil' (modify) overly broad agreements to make them enforceable rather than voiding them",
        ],
        stateSafeHarbors: [
          "Georgia courts apply reasonableness tests to duration and scope — 2-year limits are typical",
          "The 2011 Act requires non-competes to protect legitimate business interests, providing some defense if the interest is speculative",
        ],
      };

    case "massachusetts":
      return {
        stateRisks: [
          "MA enforces non-competes under the 2018 MA Noncompetition Agreement Act (M.G.L. c. 149, §24L) with strict requirements but continued enforceability",
          "MA requires 'garden leave' compensation (50% of salary) or other mutually agreed consideration during the restricted period",
          "The $500 LLC filing fee is among the highest in the U.S.",
        ],
        stateSafeHarbors: [
          "MA non-competes are limited to 12 months (with narrow exceptions for trade secret theft)",
          "Non-competes are void for non-exempt employees, students, and low-wage workers (under the MA minimum salary threshold)",
          "MA requires 10 business days advance notice before an employee signs, and the agreement must advise consulting an attorney",
        ],
      };

    case "colorado":
      return {
        stateRisks: [
          "Colorado voids non-competes for workers earning under $100K/year (C.R.S. §8-2-113, 2022 reform) but enforces them for higher earners",
          "The $100K threshold adjusts annually for inflation",
        ],
        stateSafeHarbors: [
          "Non-competes are void for workers below the $100K earnings threshold — protects the majority of professionals",
          "Colorado requires non-competes to protect trade secrets and be no broader than necessary",
          "Annual LLC report costs only $10 — among the cheapest in the U.S.",
        ],
      };

    case "north-carolina":
      return {
        stateRisks: [
          "NC enforces non-competes if reasonable in scope, geography, and duration, with no statutory income threshold",
          "NC courts tend to enforce non-competes more readily than courts in reform states",
        ],
        stateSafeHarbors: [
          "NC requires the employer to show a legitimate business interest (trade secrets, customer relationships, specialized training)",
          "Courts apply strict reasonableness review — overly broad restrictions may be struck entirely (NC does not always blue-pencil)",
          "Non-competes must be supported by adequate consideration (continued employment alone is debated)",
        ],
      };

    default:
      return { stateRisks: [], stateSafeHarbors: [] };
  }
}

// ---------------------------------------------------------------------------
// Entry builder
// ---------------------------------------------------------------------------

function enforceabilityStatusText(
  profile: ProfessionProfile,
  state: StateGuide,
): string {
  const baseStatus = (() => {
    switch (state.nonCompeteEnforceable) {
      case "not_enforced":
        return `Non-competes are essentially void in ${state.state}`;
      case "limited":
        return `Non-compete enforcement is limited in ${state.state}`;
      case "enforced":
        return `Non-competes are enforceable in ${state.state}`;
    }
  })();

  // Profession-specific overrides
  if (profile.name === "Lawyers") {
    return `Non-competes between lawyers are unenforceable nationwide under ABA Model Rule 5.6. In ${state.state}, ${state.nonCompeteNotes.toLowerCase()}`;
  }
  if (profile.name === "Doctors" && state.slug === "california") {
    return `Physician non-competes are void in California under Bus. & Prof. Code §16600`;
  }

  return `${baseStatus} (${state.nonCompeteNotes})`;
}

function buildEntry(
  profile: ProfessionProfile,
  state: StateGuide,
): NonCompeteMatrixEntry {
  const slug = `${profile.slug}-${state.slug}`;
  const stateProfile = getStateProfile(state);

  // canBuild is true everywhere — you can always start a side SaaS with proper
  // precautions. The risk profile (not permission) varies by state and profession.
  const canBuild = true;

  const enforceabilityStatus = enforceabilityStatusText(profile, state);

  const keyRisks = [...profile.inherentRisks, ...stateProfile.stateRisks];

  const safeHarbors = [
    ...profile.inherentSafeHarbors,
    ...stateProfile.stateSafeHarbors,
  ];

  const h1 = `Non-Compete Guide for ${profile.name} in ${state.state}`;

  const metaTitle = `Non-Competes for ${profile.name} in ${state.state}`;
  const metaDescription =
    `Can ${profile.name.toLowerCase()} in ${state.state} start a side business? ` +
    `Non-compete enforceability, ${state.abbreviation}-specific risks, and safe harbors for building micro-SaaS.`;

  const professionLower = profile.name.toLowerCase().replace(/s$/, "");
  const article = /^[aeiou]/i.test(professionLower)
    ? `an ${professionLower}`
    : `a ${professionLower}`;

  const faqs = buildFaqs(
    profile,
    state,
    canBuild,
    enforceabilityStatus,
    keyRisks,
    safeHarbors,
  );

  return {
    slug,
    profession: profile.name,
    state: state.state,
    metaTitle,
    metaDescription,
    h1,
    canBuild,
    enforceabilityStatus,
    keyRisks,
    safeHarbors,
    faqs,
  };
}

function buildFaqs(
  profile: ProfessionProfile,
  state: StateGuide,
  canBuild: boolean,
  enforceabilityStatus: string,
  keyRisks: string[],
  safeHarbors: string[],
): { question: string; answer: string }[] {
  const professionSingular = profile.name.toLowerCase().replace(/s$/, "");
  const article = /^[aeiou]/i.test(professionSingular)
    ? `an ${professionSingular}`
    : `a ${professionSingular}`;

  // FAQ 1: Can I build?
  let faq1Answer: string;
  if (state.nonCompeteEnforceable === "not_enforced") {
    faq1Answer =
      `Yes. ${enforceabilityStatus}. You face no enforceable non-compete barrier to ` +
      `building a micro-SaaS in ${state.state}. However, you must still avoid using employer ` +
      `trade secrets, client data, or resources. ${profile.specialRules} ` +
      `Focus on these safe practices: ${profile.inherentSafeHarbors[0]}.`;
  } else if (state.nonCompeteEnforceable === "limited") {
    faq1Answer =
      `Yes, with meaningful protections. ${enforceabilityStatus}. ` +
      `Even though some restrictions exist, ${state.state}'s limits provide significant room to build a side business ` +
      `if you avoid direct competition with your employer. ` +
      `${profile.specialRules} ` +
      `Key precaution: ${profile.inherentRisks[0]}`;
  } else {
    faq1Answer =
      `Yes, but you must structure your side business carefully. ${enforceabilityStatus}. ` +
      `The critical rules: (1) do not build a product that directly competes with your employer, ` +
      `(2) never use company time, devices, data, or resources, and ` +
      `(3) review your employment agreement's non-compete and IP assignment clauses before launching. ` +
      `${profile.specialRules}`;
  }

  // FAQ 2: What are the biggest risks?
  const faq2Answer =
    `The top risks for ${profile.name.toLowerCase()} in ${state.state} are:\n` +
    keyRisks.slice(0, 4).map((r, i) => `  ${i + 1}. ${r}`).join("\n") +
    `\n\nTo protect yourself: ${safeHarbors.slice(0, 3).map((s) => s).join(" ")}`;

  return [
    {
      question: `Can ${article} in ${state.state} start a side business?`,
      answer: faq1Answer,
    },
    {
      question: `What non-compete risks should ${profile.name.toLowerCase()} in ${state.state} watch for?`,
      answer: faq2Answer,
    },
  ];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generates the non-compete matrix for profession × state combinations.
 *
 * Without arguments, returns the full 10 × 10 = 100 entry matrix using
 * the key professions and key states defined above.
 *
 * Pass explicit arrays to generate subsets or different combinations.
 */
export function generateNonCompeteMatrix(
  professionNames?: readonly string[],
  stateNames?: readonly string[],
): NonCompeteMatrixEntry[] {
  const profiles = professionNames
    ? PROFESSION_PROFILES.filter((p) => professionNames.includes(p.name))
    : PROFESSION_PROFILES;

  const stateSlugs = stateNames
    ? stateNames.map((name) => name.toLowerCase().replace(/\s+/g, "-"))
    : KEY_STATE_SLUGS;

  const states = stateSlugs
    .map(findState)
    .filter((s): s is StateGuide => s !== undefined);

  const entries: NonCompeteMatrixEntry[] = [];
  for (const profile of profiles) {
    for (const state of states) {
      entries.push(buildEntry(profile, state));
    }
  }
  return entries;
}

/**
 * Look up a single matrix entry by its combined slug
 * (e.g., "software-engineers-california").
 */
export function getNonCompeteEntry(slug: string): NonCompeteMatrixEntry | undefined {
  return nonCompeteMatrix.find((e) => e.slug === slug);
}

/**
 * Pre-computed full matrix: 10 key professions × 10 key states = 100 entries.
 */
export const nonCompeteMatrix: NonCompeteMatrixEntry[] = generateNonCompeteMatrix();
