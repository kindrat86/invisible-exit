import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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

interface IpStatutes {
  legal_disclaimer: string;
  scope_note: string;
  sources_verified: string;
  states: Record<string, StateEntry>;
  llc_owner_public: Record<string, unknown>;
}

const data: IpStatutes = JSON.parse(
  readFileSync(resolve(process.cwd(), "src/data/ip-statutes.json"), "utf8"),
);

/**
 * An URL counts as official if it is on a .gov host (every US state legislature
 * or code publisher uses one) or on one of the small explicit allowlist hosts
 * that are official publishers but sit on their own domain:
 *  - ksrevisor.org          Kansas Office of the Revisor of Statutes
 *  - publications.tnsosfiles.com  Tennessee Secretary of State code publications
 *  - nmonesource.com        New Mexico Compilation Commission (NMSA publisher)
 */
const ALLOWED_OFFICIAL_HOSTS = new Set([
  "ksrevisor.org",
  "www.ksrevisor.org",
  "publications.tnsosfiles.com",
  "www.nmonesource.com",
  "nmonesource.com",
]);

function isOfficialUrl(url: string): boolean {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return false;
  const host = u.hostname.toLowerCase();
  if (host.endsWith(".gov") || host === "gov") return true;
  // Official state-government hosts in the .us namespace (e.g. the Nevada
  // Legislature's leg.state.nv.us, Alaska's legis.state.ak.us).
  if (/\.state\.[a-z]{2}\.us$/.test(host)) return true;
  return ALLOWED_OFFICIAL_HOSTS.has(host);
}

const STATE_CODES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI",
  "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN",
  "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH",
  "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA",
  "WV", "WI", "WY",
];

describe("ip-statutes dataset", () => {
  it("covers all 50 states plus DC exactly once", () => {
    const codes = Object.keys(data.states);
    expect(codes.sort()).toEqual([...STATE_CODES].sort());
  });

  it("every entry has an official_url on a government or allowlisted official-legislature domain", () => {
    for (const [code, entry] of Object.entries(data.states)) {
      expect(entry.official_url, `${code} official_url missing`).toBeTruthy();
      expect(
        isOfficialUrl(entry.official_url),
        `${code} official_url not an official domain: ${entry.official_url}`,
      ).toBe(true);
    }
  });

  it("statute states quote verbatim operative text, a citation, notice and special rules", () => {
    const statutory = Object.entries(data.states).filter(
      ([, e]) => e.statute_type !== "none_found",
    );
    expect(statutory.length).toBeGreaterThanOrEqual(10);
    for (const [code, entry] of statutory) {
      expect(entry.citation, `${code} citation`).toBeTruthy();
      expect(entry.operative_text, `${code} operative_text`).toBeTruthy();
      expect(entry.operative_text!.length, `${code} operative_text length`).toBeGreaterThan(120);
      expect(entry.notice_requirement, `${code} notice_requirement`).toBeTruthy();
      expect(entry.special_rules, `${code} special_rules`).toBeTruthy();
    }
  });

  it("own-time carve-out states contain the operative carve-out language", () => {
    for (const [code, entry] of Object.entries(data.states)) {
      if (!entry.has_own_time_statute) continue;
      expect(
        /own time/i.test(entry.operative_text ?? ""),
        `${code} carve-out text must quote the own-time language`,
      ).toBe(true);
    }
  });

  it("no-statute states say the contract governs and assert no statute text", () => {
    for (const [code, entry] of Object.entries(data.states)) {
      if (entry.statute_type !== "none_found") continue;
      expect(entry.citation, `${code} citation must be null`).toBeNull();
      expect(entry.operative_text, `${code} operative_text must be null`).toBeNull();
      expect(
        /contract governs/i.test(entry.special_rules),
        `${code} must state that the contract governs`,
      ).toBe(true);
    }
  });

  it("claims a disclaimer and a scope note, and records the verification date", () => {
    expect(data.legal_disclaimer).toMatch(/not legal advice/i);
    expect(data.scope_note.length).toBeGreaterThan(80);
    expect(data.sources_verified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("llc_owner_public is null everywhere unless verified with a source URL", () => {
    for (const code of Object.keys(data.states)) {
      const v = data.llc_owner_public[code];
      // Allowed: null (unverified). Anything else must be an object carrying a
      // verified official registry source URL.
      if (v !== null) {
        expect(typeof v).toBe("object");
        const src = (v as { source_url?: string }).source_url;
        expect(src, `${code} llc_owner_public needs a source_url`).toBeTruthy();
        expect(isOfficialUrl(src as string), `${code} llc_owner_public source_url must be official`).toBe(true);
      }
    }
  });
});
