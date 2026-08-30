import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * D3a honesty gate: the starter checkout always adds the $7 one-time
 * Stealth Ops Blueprint (api/create-checkout.ts line_items), so the first
 * charge is $16. Any buyer-facing surface that fires starter checkout or
 * promises a "today" price must disclose the $16 breakdown.
 */

function read(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("first-charge honesty ($16 = $9/mo + $7 one-time blueprint)", () => {
  it("starter checkout adds the tripwire bump on the server side", () => {
    const api = read("api/create-checkout.ts");
    expect(api).toContain('tier === "starter" || tier === "tripwire_bump"');
    expect(api).toContain("{ price: starterPrice, quantity: 1 }");
    expect(api).toContain("{ price: tripwirePrice, quantity: 1 }");
  });

  it("/start discloses the $16 first charge on every price promise", () => {
    const page = read("src/pages/StartPage.tsx");
    expect(page).toContain("first charge is $16");
    expect(page).toContain(">$16</span>");
    expect(page).toContain("First charge $16");
    expect(page).toContain("$16 first charge");
    // the old false promise must be gone
    expect(page.match(/\$9 charged today/g)).toBeNull();
  });

  it("the homepage checkout-steps and FAQ disclose $16", () => {
    const page = read("src/pages/Index.tsx");
    expect(page).toContain("First charge $16");
    expect(page).toContain("you pay $16 today");
    expect(page).toContain("The first charge is $16");
    expect(page.match(/\$9 charged today/g)).toBeNull();
  });

  it("/pricing shows the firstChargeNote on the Founder card", () => {
    const page = read("src/pages/PricingPage.tsx");
    expect(page).toContain("firstChargeNote");
    expect(page).toContain("First charge $16 today");
    expect(page.match(/\$9 charged today/g)).toBeNull();
  });

  it("email CTA blocks disclose the first charge", () => {
    for (const f of ["api/email-sequence.ts", "api/winback-sequence.ts"]) {
      const src = read(f);
      expect(src).toContain("first charge $16");
    }
  });
});
