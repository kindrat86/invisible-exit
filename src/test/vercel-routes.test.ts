import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

interface Rewrite {
  source: string;
  destination: string;
}

const config = JSON.parse(readFileSync(resolve(process.cwd(), "vercel.json"), "utf8")) as {
  rewrites?: Rewrite[];
};

function hasSpaRewrite(source: string): boolean {
  return (config.rewrites ?? []).some(
    (rewrite) => rewrite.source === source && rewrite.destination === "/index.html",
  );
}

describe("Vercel checkout return routing", () => {
  it("serves the paid welcome route through the SPA", () => {
    expect(hasSpaRewrite("/welcome")).toBe(true);
  });

  it("keeps the legacy checkout success route available", () => {
    expect(hasSpaRewrite("/checkout/success")).toBe(true);
  });
});
