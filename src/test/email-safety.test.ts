import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmail } from "../../api/email-sequence";

describe("native lifecycle email safety", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "test-key";
    delete process.env.UNSUB_SECRET;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.RESEND_API_KEY;
    delete process.env.UNSUB_SECRET;
  });

  it("fails closed when unsubscribe signing is unavailable", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: "accepted-id" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendEmail("person@example.com", "Subject", "<p>Body</p>");

    expect(result).toEqual({ success: false, error: "UNSUB_SECRET not set" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("adds BCC and signed one-click unsubscribe metadata", async () => {
    process.env.UNSUB_SECRET = "test-secret";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: "accepted-id" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const email = "Person@Example.com";
    const result = await sendEmail(email, "Subject", "<p>Body</p>");

    expect(result).toEqual({ success: true, id: "accepted-id" });
    expect(fetchMock).toHaveBeenCalledOnce();
    const request = fetchMock.mock.calls[0][1];
    const payload = JSON.parse(String(request.body));
    const token = createHmac("sha256", "test-secret")
      .update(email.trim().toLowerCase())
      .digest("hex");
    const unsubscribeUrl = `https://invisibleexit.com/api/unsubscribe?email=${encodeURIComponent(email.trim().toLowerCase())}&token=${token}`;

    expect(payload.bcc).toEqual(["sales@sipiteno.com"]);
    expect(payload.html).toContain(unsubscribeUrl);
    expect(payload.headers).toEqual({
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    });
  });

  it("does not expose raw provider failure bodies", async () => {
    process.env.UNSUB_SECRET = "test-secret";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      text: async () => "provider echoed person@example.com",
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendEmail("person@example.com", "Subject", "<p>Body</p>");

    expect(result).toEqual({ success: false, error: "Resend 422" });
    expect(JSON.stringify(result)).not.toContain("person@example.com");
    expect(JSON.stringify(result)).not.toContain("provider echoed");
  });

  it("runs the native email safety suite during production prebuild", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    expect(pkg.scripts.prebuild).toContain("vitest run src/test/email-safety.test.ts");
  });
});
