/**
 * Side-Project Ownership Check — pure client-side risk logic.
 * Directive invisibleexit-rework phase 3.
 *
 * Everything here is deterministic and local: no network, no storage.
 * The legal statements rendered by the result come from
 * src/data/ip-statutes.json (verified against official legislature pages,
 * 2026-11-03). This module only combines the user's answers with that
 * dataset; it never asserts law on its own.
 */
import ipStatutes from "@/data/ip-statutes.json";

export type RiskLevel = "low" | "moderate" | "elevated" | "high";

export interface CheckAnswers {
  /** Where do you work (state code, e.g. "CA")? */
  workState: string;
  /** Governing-law state if different from work state (state code or "") */
  governingState: string;
  /** Built entirely on your own time? */
  ownTimeOnly: boolean;
  /** Only your own equipment, supplies, facilities and trade secrets? */
  ownEquipmentAndAccountsOnly: boolean;
  /** Does the project overlap your employer's business or anticipated R&D? */
  overlapsEmployerBusiness: boolean;
  /** Did any of it result from work you performed for the employer? */
  fromJobDuties: boolean;
  /** Optional pasted IP / outside-employment clause ("" if none) */
  clauseText: string;
}

export interface FlaggedPhrase {
  phrase: string;
  why: string;
}

export interface RiskReason {
  /** short heading shown in the reasons list */
  title: string;
  detail: string;
  /** risk weight this reason contributed */
  weight: "info" | "warn" | "high";
}

export interface StatuteBlock {
  stateName: string;
  citation: string | null;
  officialUrl: string;
  operativeText: string | null;
  noticeRequirement: string | null;
  specialRules: string;
  hasOwnTimeStatute: boolean;
  statuteType: string;
}

export interface CheckResult {
  level: RiskLevel;
  headline: string;
  score: number; // 0-100, higher = riskier
  reasons: RiskReason[];
  statute: StatuteBlock | null;
  noStatuteStateName: string | null;
  clauseFlags: FlaggedPhrase[];
  seeLawyer: boolean;
}

interface StateEntry {
  name: string;
  has_own_time_statute: boolean;
  statute_type: string;
  citation: string | null;
  official_url: string;
  operative_text: string | null;
  notice_requirement: string | null;
  special_rules: string;
}

const states = ipStatutes.states as Record<string, StateEntry>;

/**
 * Phrases commonly found in invention-assignment / outside-employment
 * clauses that broaden employer claims. Explanations describe WHAT the
 * phrase does in the contract, not what a court will do.
 */
export const CLAUSE_FLAGS: Array<{ phrase: string; why: string }> = [
  {
    phrase: "hereby assign",
    why: "Present-tense automatic assignment: the language tries to transfer ownership the moment something is created, instead of only agreeing to assign future rights. Broad present assignment language is what courts examine first in ownership disputes.",
  },
  {
    phrase: "during the term of employment",
    why: "Claims everything created while you are employed, whenever and with whatever it was made. If your state has an own-time carve-out, this wording may be limited by it; otherwise it is generally enforceable as written.",
  },
  {
    phrase: "whether or not during working hours",
    why: "Explicitly reaches work done outside your scheduled hours. This wording exists to defeat an 'I built it at night' argument.",
  },
  {
    // Kept BEFORE "relates to the business": the specific employer-targeted
    // form is matched first so the generic form can be suppressed for it.
    phrase: "relates to the employer's business",
    why: "The carve-out statutes protect own-time work EXCEPT where it relates to the employer's business or actual or demonstrably anticipated R&D. This phrase in your clause is the one most likely to reach your project.",
  },
  {
    phrase: "relates to the business",
    why: "The classic catch-all: if the side project relates to anything the employer does, the clause claims it. This is also the main exception in state carve-out statutes (e.g. 'relates ... to the employer's business, or actual or demonstrably anticipated research or development').",
  },
  {
    phrase: "conceived",
    why: "Claims rights from the moment of conception, before reduction to practice or writing any code. Used to reach ideas you have not built yet.",
  },
  {
    phrase: "outside employment",
    why: "An outside-employment clause restricts or requires disclosure of any outside activity, even unpaid or unlaunched ones. This affects your job (approval, discipline), separate from who owns the IP.",
  },
  {
    phrase: "prior inventions",
    why: "The clause asks you to list what you already own. If your project existed before signing and you did not list it, later assignment language may try to reach it. Check what you signed and when.",
  },
  {
    phrase: "non-compete",
    why: "Restricts working in a competing area after leaving. Federal trade-rule status and state enforceability vary; several states refuse to enforce them. A non-compete reaching your own side project is a separate risk from IP assignment.",
  },
];

/**
 * Match a flag phrase inside the user's clause, case-insensitive.
 * "relates to the employer's business" also matches variants like
 * "relates to the business of the employer".
 */
export function findClauseFlags(clauseText: string): FlaggedPhrase[] {
  if (!clauseText || !clauseText.trim()) return [];
  const haystack = clauseText.toLowerCase();
  const found: FlaggedPhrase[] = [];
  const seen = new Set<string>();
  for (const { phrase, why } of CLAUSE_FLAGS) {
    let hit = false;
    if (phrase === "relates to the employer's business") {
      // Matches relate/relates/related/relating + "employer's business" in its
      // common legal phrasings ("business of the employer", "his employer", ...).
      hit =
        /relat(?:e|es|ed|ing)\s+to\s+(?:the\s+)?(?:employer'?s|business\s+of\s+(?:the|his|her|my)\s+employer)/.test(
          haystack,
        );
    } else if (phrase === "relates to the business") {
      // skip if the fuller employer's-business variant already matched
      hit =
        !seen.has("relates to the employer's business") &&
        /relat(?:e|es|ed|ing)\s+to\s+(?:the|my|his|her|its)\s+business/.test(haystack);
    } else if (phrase === "during the term of employment") {
      const variants = [
        "during the term of employment",
        "during the term of his employment",
        "during the term of her employment",
        "during the term of my employment",
        "during employment",
      ];
      hit = variants.some((v) => haystack.includes(v));
    } else {
      hit = haystack.includes(phrase);
    }
    if (hit) {
      seen.add(phrase);
      found.push({ phrase, why });
    }
  }
  return found;
}

function statuteBlockFor(code: string): StatuteBlock | null {
  const e = states[code];
  if (!e) return null;
  return {
    stateName: e.name,
    citation: e.citation,
    officialUrl: e.official_url,
    operativeText: e.operative_text,
    noticeRequirement: e.notice_requirement,
    specialRules: e.special_rules,
    hasOwnTimeStatute: e.has_own_time_statute,
    statuteType: e.statute_type,
  };
}

/**
 * Core scoring. Rules (all grounded in the dataset / standard doctrine,
 * each surfaced to the user with its reason):
 *
 * Baseline by statute type of the governing state:
 *  - employee_favoring (own-time carve-out): base 20
 *  - none_found (contract governs): base 45
 *  - employer_favoring (NV/ND/ID default-to-employer): base 65
 *  - unsettled_employer_acquisition_default (MT): base 55
 *
 * Answers:
 *  - ownTimeOnly=false: +25 (the carve-outs only protect own-time work)
 *  - ownEquipmentAndAccountsOnly=false: +15 (carve-outs require own equipment)
 *  - overlapsEmployerBusiness=true: +25 (the statutory exception itself)
 *  - fromJobDuties=true: +25 (universally assigned to the employer)
 *  - clause flags: +4 each, capped +16
 *
 * Level: <35 low, <55 moderate, <75 elevated, else high.
 * seeLawyer: high, OR elevated with overlap/duties, OR no-carve-out state with overlap.
 */
export function assessOwnershipRisk(a: CheckAnswers): CheckResult {
  const gov = (a.governingState || a.workState || "").toUpperCase();
  const entry = states[gov] || null;
  const reasons: RiskReason[] = [];
  const flags = findClauseFlags(a.clauseText);

  let score = 0;
  let statute: StatuteBlock | null = null;
  let noStatuteStateName: string | null = null;

  if (!entry) {
    // Unknown/empty state: cannot say anything statute-specific.
    score = 45;
    reasons.push({
      title: "State not selected",
      detail:
        "Pick the state where you work (and the governing-law state if your contract names a different one) so the check can apply the right statute.",
      weight: "warn",
    });
  } else {
    statute = statuteBlockFor(gov);
    if (entry.statute_type === "employee_favoring") {
      score = 20;
      reasons.push({
        title: `${entry.name} has an own-time invention statute (${entry.citation ?? "state statute"})`,
        detail:
          "The statute limits invention-assignment provisions: work developed entirely on your own time without employer equipment, supplies, facilities or trade secrets is generally outside the employer's reach, unless a statutory exception applies (see below). The full operative text is quoted under 'The statute in your state'.",
        weight: "info",
      });
    } else if (entry.statute_type === "none_found") {
      score = 45;
      noStatuteStateName = entry.name;
      reasons.push({
        title: `No invention-assignment statute found in ${entry.name}: your contract governs`,
        detail:
          "Nothing in this state's laws limits invention-assignment provisions, so whatever your agreement says about ownership, plus ordinary contract law and federal patent/copyright defaults, decides it. What you signed matters more than where you sit.",
        weight: "warn",
      });
    } else if (entry.statute_type === "employer_favoring") {
      score = 65;
      reasons.push({
        title: `${entry.name} defaults toward the employer (${entry.citation ?? "state statute"})`,
        detail: entry.special_rules,
        weight: "high",
      });
    } else {
      // unsettled_employer_acquisition_default
      score = 55;
      reasons.push({
        title: `${entry.name}: unsettled, employer-leaning statute (${entry.citation ?? "state statute"})`,
        detail: entry.special_rules,
        weight: "high",
      });
    }
  }

  if (entry && !a.ownTimeOnly) {
    score += 25;
    reasons.push({
      title: "Some of this was built during working hours",
      detail:
        "Work done on the employer's time is claimed in essentially every scheme, including the strongest own-time carve-out statutes (they protect only work developed 'entirely on his or her own time').",
      weight: "high",
    });
  }
  if (entry && !a.ownEquipmentAndAccountsOnly) {
    score += 15;
    reasons.push({
      title: "Employer equipment, accounts or facilities were used",
      detail:
        "The carve-out statutes protect only work developed without the employer's equipment, supplies, facilities, or trade secret information. A work laptop, work SaaS account or company data takes the project outside the carve-out.",
      weight: "warn",
    });
  }
  if (entry && a.overlapsEmployerBusiness) {
    score += 25;
    reasons.push({
      title: "The project overlaps your employer's business or anticipated R&D",
      detail:
        "This is the statutory exception itself: the own-time carve-outs do not apply to inventions that relate, at conception or reduction to practice, to the employer's business or actual or demonstrably anticipated research or development. Overlap is the single most common way side projects are lost, in carve-out states and contract states alike.",
      weight: "high",
    });
  }
  if (entry && a.fromJobDuties) {
    score += 30;
    reasons.push({
      title: "The project resulted from work performed for the employer",
      detail:
        "Results of work performed for the employer are excluded from every own-time carve-out and assigned under standard agreements. If solving a work problem produced the idea, treat it as claimed.",
      weight: "high",
    });
  }
  if (flags.length > 0) {
    const clauseHit = Math.min(16, flags.length * 4);
    score += clauseHit;
    reasons.push({
      title: `${flags.length} broad phrase${flags.length > 1 ? "s" : ""} found in your pasted clause`,
      detail:
        "Each flagged phrase is quoted under 'Your clause, flagged'. These phrases broaden employer claims; in a contract-governs state they mostly do what they say, and even in carve-out states they matter outside the carve-out's scope.",
      weight: flags.some((f) => f.phrase === "hereby assign") ? "high" : "warn",
    });
  }

  score = Math.max(0, Math.min(100, score));
  const level: RiskLevel =
    score >= 75 ? "high" : score >= 55 ? "elevated" : score >= 35 ? "moderate" : "low";

  const headlines: Record<RiskLevel, string> = {
    low: "Lower risk pattern",
    moderate: "Moderate risk pattern",
    elevated: "Elevated risk pattern",
    high: "High risk pattern",
  };

  const seeLawyer =
    level === "high" ||
    (level === "elevated" && (a.overlapsEmployerBusiness || a.fromJobDuties)) ||
    (!!entry &&
      a.overlapsEmployerBusiness &&
      (entry.statute_type === "none_found" ||
        entry.statute_type === "employer_favoring" ||
        entry.statute_type === "unsettled_employer_acquisition_default"));

  return {
    level,
    headline: headlines[level],
    score,
    reasons,
    statute,
    noStatuteStateName,
    clauseFlags: flags,
    seeLawyer,
  };
}

/** Next-step pack templates (copy-to-clipboard strings, no backend). */
export const PRIOR_INVENTIONS_TEMPLATE = `Prior Inventions List

To: [HR contact / manager name]
Date: [date]
Re: Invention Assignment Agreement / Employment Agreement dated [date]

This is my list of inventions and intellectual property that existed before the date of the agreement and that I am excluding from assignment, as provided (if applicable) by [statute, e.g. Cal. Lab. Code Sec. 2870 / your state's statute] or by the agreement's own prior-inventions provision.

1. [Project / product name]
   - What it does: [one line]
   - First created / made public: [date]
   - Evidence: [repo, landing page, incorporation doc, first sale]
2. [Repeat as needed]

No other prior inventions are excluded at this time. I will update this list in writing if that changes.

[Your name]`;

export const DISCLOSURE_TEMPLATE = `Side Project Disclosure / Approval Request

To: [manager / HR]
Date: [date]
Re: Outside activity disclosure and approval request

I would like to formally disclose and request approval for an outside activity, per [policy name / handbook section, if you know it].

What it is: [one-line description of the side project / LLC]
Time: built and run entirely on my own time (evenings/weekends), roughly [hours]/week.
Tools: my own equipment and accounts only. No company equipment, systems, licenses, data or trade secrets are used.
Overlap: [state plainly whether the project relates to the employer's business. If there is ANY overlap, say what it is and why it does not compete / seek explicit written clearance.]
Status: [built / launched / earning] since [date].

I am asking for written confirmation that this activity is approved under [policy / outside-employment clause] and that the company asserts no interest in it, so there is a clean record for both sides.

[Your name]`;

export const SEPARATION_CHECKLIST = `Separation Checklist (when you leave the job)

1. Before resigning: re-read the IP assignment, outside-employment, non-compete and non-solicit clauses you signed, and the prior-inventions list you filed (if any).
2. Export and keep your evidence of own-time development: commit history dates, device usage, personal-account subscriptions, receipts for equipment and tools.
3. Remove all company data, licenses, credentials and access from the project. Rebuild anything that was ever touched by company tools on clean foundations.
4. File an updated prior-inventions list if your agreement or state statute provides one, referencing the earlier disclosures and approvals you collected.
5. Keep the written disclosure/approval you requested (see the template). If you never got one, consider asking for a written confirmation of non-interest as part of the exit process.
6. Note which state's law governs your agreement (the choice-of-law clause), and check that state's statute on invention assignment before assuming anything.
7. For anything overlapping your employer's business or anticipated R&D, or any non-compete language: get a lawyer's opinion before you monetize or announce.`;

export const NOT_LEGAL_ADVICE = ipStatutes.legal_disclaimer;

export const ALL_STATE_CODES = Object.keys(states).sort();
