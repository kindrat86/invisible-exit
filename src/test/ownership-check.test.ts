import { describe, expect, it } from "vitest";
import {
  assessOwnershipRisk,
  findClauseFlags,
  ALL_STATE_CODES,
  type CheckAnswers,
} from "@/lib/ownership-check";
import ipStatutes from "@/data/ip-statutes.json";

const base: CheckAnswers = {
  workState: "CA",
  governingState: "",
  ownTimeOnly: true,
  ownEquipmentAndAccountsOnly: true,
  overlapsEmployerBusiness: false,
  fromJobDuties: false,
  clauseText: "",
};

describe("assessOwnershipRisk fixtures", () => {
  it("CA, own time, own equipment, unrelated: LOW", () => {
    const r = assessOwnershipRisk(base);
    expect(r.level).toBe("low");
    expect(r.statute?.stateName).toBe("California");
    expect(r.statute?.operativeText).toBeTruthy();
    expect(r.statute?.officialUrl).toMatch(/leginfo\.legislature\.ca\.gov/);
    expect(r.seeLawyer).toBe(false);
  });

  it("CA, own time but related to employer's business: not LOW", () => {
    const r = assessOwnershipRisk({ ...base, overlapsEmployerBusiness: true });
    expect(r.level).not.toBe("low"); // 20+25 = 45 moderate
    expect(r.reasons.some((x) => x.title.includes("overlaps"))).toBe(true);
    expect(r.seeLawyer).toBe(false); // moderate, carve-out state: information, not alarm
  });

  it("CA, company laptop: rises above LOW even when unrelated", () => {
    const r = assessOwnershipRisk({ ...base, ownEquipmentAndAccountsOnly: false });
    expect(r.score).toBeGreaterThanOrEqual(35); // 20+15
    expect(r.reasons.some((x) => x.title.includes("equipment"))).toBe(true);
  });

  it("CA, built during working hours + from job duties: HIGH", () => {
    const r = assessOwnershipRisk({
      ...base,
      ownTimeOnly: false,
      fromJobDuties: true,
    });
    expect(r.level).toBe("high"); // 20+25+25
    expect(r.seeLawyer).toBe(true);
  });

  it("NV (employer-favoring default) + overlap: HIGH and see a lawyer", () => {
    const r = assessOwnershipRisk({
      ...base,
      workState: "NV",
      overlapsEmployerBusiness: true,
    });
    expect(r.level).toBe("high"); // 65+25
    expect(r.statute?.statuteType).toBe("employer_favoring");
    expect(r.statute?.officialUrl).toMatch(/leg\.state\.nv\.us/);
    expect(r.seeLawyer).toBe(true);
  });

  it("NV clean answers: elevated baseline, statute quoted", () => {
    const r = assessOwnershipRisk({ ...base, workState: "NV" });
    expect(r.level).toBe("elevated"); // 65
    expect(r.statute?.citation).toContain("600.500");
    expect(r.seeLawyer).toBe(false);
  });

  it("TX (no statute) + broad clause: contract governs, flags counted", () => {
    const r = assessOwnershipRisk({
      ...base,
      workState: "TX",
      clauseText:
        "Employee hereby assigns to the Company all inventions whether or not during working hours.",
    });
    expect(r.noStatuteStateName).toBe("Texas");
    expect(r.level).not.toBe("low"); // 45 + 8 = 53 moderate
    expect(r.clauseFlags.map((f) => f.phrase)).toContain("hereby assign");
    expect(r.clauseFlags.map((f) => f.phrase)).toContain("whether or not during working hours");
    expect(r.reasons.some((x) => x.title.includes("contract governs"))).toBe(true);
  });

  it("MT (unsettled employer default) + overlap: see a lawyer", () => {
    const r = assessOwnershipRisk({
      ...base,
      workState: "MT",
      overlapsEmployerBusiness: true,
    });
    expect(r.statute?.statuteType).toBe("unsettled_employer_acquisition_default");
    expect(r.level).toBe("high"); // 55+25=80
    expect(r.seeLawyer).toBe(true);
  });

  it("Governing-law state overrides work state (work in TX, contract governed by CA law)", () => {
    const r = assessOwnershipRisk({
      ...base,
      workState: "TX",
      governingState: "CA",
    });
    expect(r.statute?.stateName).toBe("California");
    expect(r.level).toBe("low");
  });

  it("Unknown state: warns instead of guessing", () => {
    const r = assessOwnershipRisk({ ...base, workState: "" });
    expect(r.statute).toBeNull();
    expect(r.reasons.some((x) => x.title.includes("State not selected"))).toBe(true);
  });
});

describe("findClauseFlags", () => {
  it("finds all 9 flag families in a maximal broad clause", () => {
    const clause = [
      "I hereby assign all inventions conceived during the term of employment,",
      "whether or not during working hours, and whether or not they relate to the business,",
      "I will disclose all outside employment, list prior inventions, and agree to a non-compete.",
    ].join(" ");
    const phrases = findClauseFlags(clause).map((f) => f.phrase);
    expect(phrases).toContain("hereby assign");
    expect(phrases).toContain("during the term of employment");
    expect(phrases).toContain("whether or not during working hours");
    expect(phrases).toContain("relates to the business");
    expect(phrases).toContain("conceived");
    expect(phrases).toContain("outside employment");
    expect(phrases).toContain("prior inventions");
    expect(phrases).toContain("non-compete");
  });

  it("matches the employer's-business variant of the relates flag", () => {
    const r = findClauseFlags(
      "inventions that relate to the business of the employer or its customers",
    );
    expect(r.map((f) => f.phrase)).toContain("relates to the employer's business");
  });

  it("no false positives on a clean short clause", () => {
    expect(findClauseFlags("This agreement is at-will.")).toEqual([]);
  });

  it("empty input: no flags", () => {
    expect(findClauseFlags("")).toEqual([]);
  });
});

describe("dataset integrity for the tool", () => {
  it("all 50 states + DC present and sorted list exposes them", () => {
    expect(ALL_STATE_CODES.length).toBe(51);
    expect(ALL_STATE_CODES).toContain("DC");
    expect(ALL_STATE_CODES).toEqual([...ALL_STATE_CODES].sort());
  });

  it("every result statute carries an official URL and text when claimed", () => {
    const types = new Set<string>();
    for (const code of ALL_STATE_CODES) {
      const r = assessOwnershipRisk({ ...base, workState: code });
      expect(r.statute).not.toBeNull();
      types.add(r.statute!.statuteType);
      expect(r.statute!.officialUrl).toMatch(/^https?:\/\//);
      if (r.statute!.hasOwnTimeStatute) {
        expect(r.statute!.operativeText).toBeTruthy();
      }
    }
    expect(types).toEqual(
      new Set([
        "employee_favoring",
        "none_found",
        "employer_favoring",
        "unsettled_employer_acquisition_default",
      ]),
    );
  });

  it("carves out exactly the 10 documented own-time states", () => {
    const ownTime = Object.entries(ipStatutes.states as Record<string, { has_own_time_statute: boolean }>)
      .filter(([, v]) => v.has_own_time_statute)
      .map(([k]) => k)
      .sort();
    expect(ownTime).toEqual(["CA", "DE", "IL", "KS", "MN", "NC", "NJ", "NY", "UT", "WA"]);
  });
});
