/**
 * Profession × State cross-dimensional pages for programmatic SEO.
 *
 * Dynamically generates pages that combine profession-specific micro-SaaS insights
 * (from industry-ideas.ts) with state-specific LLC formation costs, tax rates, and
 * non-compete enforceability data (from state-guides.ts).
 *
 * Capable of generating all 25 professions × 51 states = 1,275 combinations,
 * but only renders a curated subset (top 10 professions × 5 biggest states = 50 pages).
 *
 * Consume via:
 *   import { professionStatePages, generateProfessionStatePages } from "@/data/profession-states";
 *
 * LEGAL DISCLAIMER: Non-compete and regulatory information is general in nature and
 * based on publicly known enforcement patterns as of 2024-2025. It is NOT legal advice.
 * Consult a licensed attorney for your specific situation.
 */

import { industryIdeas, type IndustryIdea } from "./industry-ideas";
import { stateGuides, type StateGuide } from "./state-guides";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProfessionStatePage {
  slug: string; // e.g., "for-accountants-in-texas"
  profession: string;
  professionSlug: string;
  state: string;
  stateSlug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  faqs: { question: string; answer: string }[];
}

// ---------------------------------------------------------------------------
// Curated subset configuration
// ---------------------------------------------------------------------------

/** Top 10 professions most relevant to InvisibleExit's corporate-manager audience. */
const CURATED_PROFESSION_SLUGS = [
  "for-software-engineers",
  "for-product-managers",
  "for-marketers",
  "for-financial-analysts",
  "for-consultants",
  "for-designers",
  "for-sales-managers",
  "for-accountants",
  "for-lawyers",
  "for-data-analysts",
] as const;

/** 5 biggest US states by population. */
const CURATED_STATE_SLUGS = [
  "california",
  "texas",
  "new-york",
  "florida",
  "illinois",
] as const;

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

function findProfession(slug: string): IndustryIdea | undefined {
  return industryIdeas.find((p) => p.slug === slug);
}

function findState(slug: string): StateGuide | undefined {
  return stateGuides.find((s) => s.slug === slug);
}

// ---------------------------------------------------------------------------
// Text generation helpers
// ---------------------------------------------------------------------------

/** Singular lower-case form of a profession name with indefinite article. */
function withArticle(professionName: string): string {
  const singular = professionNameNameToSingular(professionName);
  return /^[aeiou]/i.test(singular) ? `an ${singular}` : `a ${singular}`;
}

function professionNameNameToSingular(name: string): string {
  const lower = name.toLowerCase();
  const irregular: Record<string, string> = {
    "software engineers": "software engineer",
    "product managers": "product manager",
    "marketing managers": "marketing manager",
    "financial analysts": "financial analyst",
    "management consultants": "management consultant",
    "sales managers": "sales manager",
    "data analysts": "data analyst",
    "customer success managers": "customer success manager",
    "operations managers": "operations manager",
    "executive assistants": "executive assistant",
    "virtual assistants": "virtual assistant",
    "real estate agents": "real estate agent",
    "project managers": "project manager",
    "supply chain managers": "supply chain manager",
    "corporate trainers": "corporate trainer",
  };
  return irregular[lower] ?? lower.replace(/s$/, "");
}

function nonCompetePhrase(state: StateGuide): string {
  switch (state.nonCompeteEnforceable) {
    case "not_enforced":
      return `non-competes are essentially void in ${state.state} (${state.nonCompeteNotes})`;
    case "limited":
      return `non-compete enforcement is limited in ${state.state} (${state.nonCompeteNotes})`;
    case "enforced":
      return `non-competes are enforceable in ${state.state} (${state.nonCompeteNotes})`;
  }
}

function llcPhrase(state: StateGuide): string {
  const annualPart = state.annualReportRequired
    ? `plus a $${state.annualReportFee} annual report fee`
    : `with no annual report required`;
  return `LLC formation costs $${state.llcFilingFee} ${annualPart}`;
}

function taxPhrase(state: StateGuide): string {
  if (state.stateIncomeTaxRate.includes("0%")) {
    return `${state.state} levies no state income tax, letting you keep more of your SaaS revenue`;
  }
  return `${state.state}'s income tax rate is ${state.stateIncomeTaxRate}`;
}

// ---------------------------------------------------------------------------
// FAQ generators
// ---------------------------------------------------------------------------

function buildCanBuildFaq(profession: IndustryIdea, state: StateGuide): string {
  let ncPart: string;
  switch (state.nonCompeteEnforceable) {
    case "not_enforced":
      ncPart = `Yes — and ${state.state} is one of the best states to do it. Non-competes are essentially void, so your employer cannot use a restrictive covenant to block your side business.`;
      break;
    case "limited":
      ncPart = `Yes. ${state.state} limits non-compete enforceability (${state.nonCompeteNotes.toLowerCase()}), which provides meaningful protection for side-business builders.`;
      break;
    case "enforced":
      ncPart = `Yes, but proceed carefully. ${state.state} enforces non-competes (${state.nonCompeteNotes.toLowerCase()}). The key rule: do not build a product that directly competes with your employer, and never use company time, devices, or data.`;
      break;
  }

  return `${ncPart} ${profession.whatToAvoid} Form an LLC ($${state.llcFilingFee} in ${state.state}) to separate your side-business liability, and use a personal device for all entrepreneurial work.`;
}

function buildCostFaq(profession: IndustryIdea, state: StateGuide): string {
  const annual = state.annualReportRequired
    ? state.annualReportFee === 0
      ? ` The annual report is free but still must be filed.`
      : ` The annual report costs $${state.annualReportFee}.`
    : ` ${state.state} does not require an annual report, keeping ongoing costs near zero.`;

  const tax = state.stateIncomeTaxRate.includes("0%")
    ? ` ${state.state} has no state income tax, so your SaaS profits are only subject to federal tax plus the 15.3% self-employment tax.`
    : ` ${state.state}'s income tax rate is ${state.stateIncomeTaxRate}, which applies to your SaaS profits on top of federal and self-employment taxes.`;

  return `Forming an LLC in ${state.state} costs $${state.llcFilingFee}.${annual}${tax} For ${profession.profession.toLowerCase()} earning ${profession.avgSalary}, the LLC structure provides liability protection and keeps your side-business income separate from your W-2 employment.`;
}

// ---------------------------------------------------------------------------
// Page builder
// ---------------------------------------------------------------------------

function buildPage(profession: IndustryIdea, state: StateGuide): ProfessionStatePage {
  const slug = `${profession.slug}-in-${state.slug}`;
  const article = withArticle(profession.profession);
  const professionLower = profession.profession.toLowerCase();

  const metaTitle = `Micro-SaaS Ideas for ${profession.profession} in ${state.state}`;
  const metaDescription =
    `How ${professionLower} in ${state.state} can launch a profitable micro-SaaS. ` +
    `${state.abbreviation} LLC costs ($${state.llcFilingFee}), non-compete rules, and 5 tailored ideas.`;
  const h1 = `Micro-SaaS Ideas for ${profession.profession} in ${state.state}`;

  const intro =
    `${profession.unfairAdvantage} ` +
    `In ${state.state}, ${nonCompetePhrase(state)}. ` +
    `${llcPhrase(state)}, and ${taxPhrase(state)}.`;

  const faqs = [
    {
      question: `Can ${article} in ${state.state} build a SaaS while employed?`,
      answer: buildCanBuildFaq(profession, state),
    },
    {
      question: `What does it cost to form an LLC in ${state.state} as ${article}?`,
      answer: buildCostFaq(profession, state),
    },
  ];

  return {
    slug,
    profession: profession.profession,
    professionSlug: profession.slug,
    state: state.state,
    stateSlug: state.slug,
    metaTitle,
    metaDescription,
    h1,
    intro,
    faqs,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generates profession × state cross-product pages.
 *
 * Without arguments, returns the curated subset of 50 pages
 * (top 10 professions × 5 biggest states).
 *
 * Pass explicit slug arrays to generate any combination — including the
 * full 25 × 51 = 1,275 matrix if desired:
 *
 *   generateProfessionStatePages(
 *     industryIdeas.map(p => p.slug),
 *     stateGuides.map(s => s.slug),
 *   )
 */
export function generateProfessionStatePages(
  professionSlugs: readonly string[] = CURATED_PROFESSION_SLUGS,
  stateSlugs: readonly string[] = CURATED_STATE_SLUGS,
): ProfessionStatePage[] {
  const professions = professionSlugs
    .map(findProfession)
    .filter((p): p is IndustryIdea => p !== undefined);

  const states = stateSlugs
    .map(findState)
    .filter((s): s is StateGuide => s !== undefined);

  const pages: ProfessionStatePage[] = [];
  for (const profession of professions) {
    for (const state of states) {
      pages.push(buildPage(profession, state));
    }
  }
  return pages;
}

/**
 * Look up a single profession-state page by its combined slug
 * (e.g., "for-accountants-in-texas").
 */
export function getProfessionStatePage(slug: string): ProfessionStatePage | undefined {
  return professionStatePages.find((p) => p.slug === slug);
}

/**
 * Pre-computed curated subset: top 10 professions × 5 biggest states = 50 pages.
 * Import this directly in route loaders; call `generateProfessionStatePages()`
 * if you need a different combination.
 */
export const professionStatePages: ProfessionStatePage[] =
  generateProfessionStatePages();
