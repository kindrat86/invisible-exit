import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function read(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("truthful checkout after retiring the unsupported Blueprint", () => {
  it("fails the retired server checkout tiers closed and keeps Starter to one line item", () => {
    const api = read("api/create-checkout.ts");
    expect(api).toContain('tier === "tripwire" || tier === "tripwire_bump"');
    expect(api).toContain("temporarily unavailable");
    expect(api).not.toContain("{ price: tripwirePrice, quantity: 1 }");
  });

  it("replaces the tripwire sales page with an unavailable notice and no purchase action", () => {
    const page = read("src/pages/TripwirePage.tsx");
    expect(page).toContain("The Stealth Ops Blueprint is temporarily unavailable");
    expect(page).toContain('to="/start"');
    expect(page).not.toContain("handlePurchase");
    expect(page).not.toContain("tripwire_bump");
    expect(page).not.toContain("89 pages + 3 videos");
    expect(page).not.toContain("kept me invisible for 14 months");
  });

  it("advertises the actual $9 Starter charge on every checkout surface", () => {
    const surfaces = [
      read("src/pages/StartPage.tsx"),
      read("src/pages/Index.tsx"),
      read("src/pages/PricingPage.tsx"),
      read("api/email-sequence.ts"),
      read("api/winback-sequence.ts"),
    ];
    for (const surface of surfaces) {
      expect(surface).not.toMatch(/\$16(?:\s|<|\.|,|\)|$)/);
      expect(surface).not.toContain("first charge $16");
    }
    expect(surfaces[0]).toContain("$9/month");
    expect(surfaces[1]).toContain("$9/month");
    expect(surfaces[2]).toContain("$9");
  });

  it("runs the paid-path retirement tests during production prebuild", () => {
    const pkg = JSON.parse(read("package.json"));
    expect(pkg.scripts.prebuild).toContain("src/test/create-checkout-tripwire-retirement.test.ts");
    expect(pkg.scripts.prebuild).toContain("src/test/first-charge-honesty.test.ts");
  });
});
