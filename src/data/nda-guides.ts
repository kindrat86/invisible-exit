/** Auto-generated NDA guides for all 50 states + DC. */

export interface NdaGuide {
  slug: string;
  stateName: string;
  abbreviation: string;
  ndaEnforceability: "strong" | "moderate" | "weak" | "varies";
  ndaKeyRules: string;
  sideBusinessImplications: string;
  whatToCheck: string[];
  faqs: { question: string; answer: string }[];
}

const ndaEnforce: Record<string, "strong" | "moderate" | "weak" | "varies"> = {
  alabama: "moderate", alaska: "moderate", arizona: "moderate", arkansas: "moderate",
  california: "weak", colorado: "weak", connecticut: "moderate", delaware: "moderate",
  "district-of-columbia": "varies", florida: "moderate", georgia: "moderate", hawaii: "moderate",
  idaho: "moderate", illinois: "moderate", indiana: "moderate", iowa: "moderate",
  kansas: "moderate", kentucky: "moderate", louisiana: "moderate", maine: "moderate",
  maryland: "moderate", massachusetts: "moderate", michigan: "moderate", minnesota: "moderate",
  mississippi: "moderate", missouri: "moderate", montana: "moderate", nebraska: "moderate",
  nevada: "moderate", "new-hampshire": "moderate", "new-jersey": "moderate", "new-mexico": "moderate",
  "new-york": "moderate", "north-carolina": "moderate", "north-dakota": "moderate", ohio: "moderate",
  oklahoma: "moderate", oregon: "moderate", pennsylvania: "moderate", "rhode-island": "moderate",
  "south-carolina": "moderate", "south-dakota": "moderate", tennessee: "moderate", texas: "moderate",
  utah: "moderate", vermont: "moderate", virginia: "moderate", washington: "moderate",
  "west-virginia": "moderate", wisconsin: "moderate", wyoming: "moderate",
};

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

function makeFaq(q: string, a: string) {
  return { question: q, answer: a };
}

const stateKeys = Object.keys(stateInfo);

const ndaGuides: NdaGuide[] = stateKeys.map((slug) => {
  const s = stateInfo[slug];
  const enf = ndaEnforce[slug] || "moderate";
  const isWeak = enf === "weak";
  const isVaries = enf === "varies";
  const isModerate = enf === "moderate";

  const keyRules = isWeak
    ? `${s.name} courts narrowly construe non-disclosure agreements. California, Colorado, and North Dakota each have public policy limitations that make broad NDAs difficult to enforce — especially those covering trade secret definitions or unlimited duration.`
    : isVaries
    ? `In ${s.name} (DC), enforceability depends heavily on the specific language. Courts will scrutinize NDAs for reasonableness of scope, duration, and geographic limits. Overly broad agreements are likely to be modified or voided.`
    : `In ${s.name}, NDAs are generally enforceable if they are reasonable in scope, duration, and geography. Non-compete restrictions within NDAs face additional scrutiny, but pure confidentiality provisions are typically upheld.`;

  const implications = isWeak
    ? `Good news: broad NDAs from your employer are harder to enforce in ${s.name}. If your employer claims you breached an NDA by starting a side business, they must prove specific confidential information was used — not just that you work in the same industry. However, you should still avoid using any employer-provided data, client lists, or proprietary tools.`
    : isVaries
    ? `The mixed legal landscape in ${s.name} means you should be extra cautious. An NDA your employer asks you to sign may or may not hold up in court, but the legal fees to fight it are real. Have any pre-existing side-business NDA reviewed by a ${s.name}-licensed attorney before signing.`
    : `${s.name} courts generally favor enforcing NDAs as written. Before starting a side business, review any NDA you've signed with your employer for clauses about "other business activities," "corporate opportunities," or "business interests" — these can be interpreted broadly.`;

  const whatToCheck = [
    "Does the NDA define 'confidential information' narrowly or broadly?",
    "Is there a time limit on confidentiality obligations?",
    "Does the NDA include a non-compete or non-solicitation clause?",
    "Does the agreement cover 'all business activities' or only your specific role?",
    "Are there exceptions for independently developed information?",
    `Has your employer publicly litigated an NDA case in ${s.name} recently?`,
    "Does the NDA require you to assign inventions created outside of work?",
  ];

  const faqs = [
    makeFaq(
      `Does my employer's NDA prevent me from starting a side business in ${s.name}?`,
      `Not automatically. An NDA protects specific confidential information — it doesn't ban you from working on your own projects. However, if your side business operates in the same industry as your employer, they may argue you're using their confidential information. In ${s.name}, ${isWeak ? "courts are skeptical of such broad claims" : isVaries ? "outcomes depend heavily on the specific NDA language" : "you should be cautious as courts tend to uphold NDAs as written"}.`
    ),
    makeFaq(
      `Can I start a side business if I signed an NDA in ${s.name}?`,
      `Yes, but with precautions. Don't use your employer's equipment, data, or time. Keep your side business in a different niche if possible. If your NDA has a broad definition of "confidential information," ask an attorney to review it. ${s.name} law ${isWeak ? "gives you some protection against overreach" : isVaries ? "is unclear — get specific legal advice" : "generally favors the employer's NDA rights"}.`
    ),
    makeFaq(
      `What happens if my employer sues me for violating an NDA in ${s.name}?`,
      isWeak
        ? `They would need to prove you actually disclosed or used specific confidential information — not just that you started a competing business. ${s.name} courts require specific evidence, not general allegations. However, legal defense costs can still be significant ($10K-$50K+).`
        : `They would likely get a temporary restraining order and discovery into your side business. ${s.name} courts take NDAs seriously, so you'd need to prove you didn't use any protected information. Legal costs typically start at $15K-$75K.`
    ),
    makeFaq(
      `Should I sign a new NDA with my employer if I already have a side business in ${s.name}?`,
      `Not without reviewing it carefully. If you already have a side business, ask your employer to explicitly exclude it from the NDA's scope in writing before signing. If they refuse, consider whether the risk is worth it — you may need to disclose your side business or pause it.`
    ),
  ];

  return { slug, stateName: s.name, abbreviation: s.abbr, ndaEnforceability: enf, ndaKeyRules: keyRules, sideBusinessImplications: implications, whatToCheck, faqs };
});

export { ndaGuides };
