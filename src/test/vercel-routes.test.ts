import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

interface Rewrite {
  source: string;
  destination: string;
}

interface Cron {
  path: string;
  schedule: string;
}

const config = JSON.parse(readFileSync(resolve(process.cwd(), "vercel.json"), "utf8")) as {
  rewrites?: Rewrite[];
  crons?: Cron[];
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

describe("native lifecycle ownership", () => {
  it("keeps the native scheduler route available but unscheduled", () => {
    expect(existsSync(resolve(process.cwd(), "api/email-sequence-scheduler.ts"))).toBe(true);
    expect((config.crons ?? []).some((cron) => cron.path === "/api/email-sequence-scheduler")).toBe(false);
  });

  it("runs the ownership guard during production prebuild", () => {
    const pkg = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8"));
    expect(pkg.scripts.prebuild).toContain("src/test/vercel-routes.test.ts");
  });
});
