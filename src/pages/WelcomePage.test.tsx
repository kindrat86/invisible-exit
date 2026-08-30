import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "@/pages/WelcomePage";
import { completeCheckoutLogin } from "@/lib/checkout";
import { trackEvent } from "@/lib/analytics";

vi.mock("@/lib/checkout", () => ({ completeCheckoutLogin: vi.fn() }));
vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));
vi.mock("@/components/SEOHead", () => ({ default: () => null }));

const finishLogin = vi.mocked(completeCheckoutLogin);
const capture = vi.mocked(trackEvent);

function renderRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/dashboard" element={<div>Dashboard ready</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("WelcomePage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("verifies the paid session and opens the dashboard", async () => {
    finishLogin.mockResolvedValue({ id: "usr_1", email: "buyer@example.com" });

    renderRoute("/welcome?session_id=cs_live_paid");

    expect(screen.getByText("Setting up your account")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Dashboard ready")).toBeInTheDocument());
    expect(finishLogin).toHaveBeenCalledWith("cs_live_paid");
    expect(capture).toHaveBeenCalledWith("welcome_login_ok", { session_id_present: true });
  });

  it("shows a recovery action when the session id is missing", async () => {
    renderRoute("/welcome");

    expect(await screen.findByText("We could not verify your checkout")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return to checkout" })).toHaveAttribute("href", "/start");
    expect(finishLogin).not.toHaveBeenCalled();
  });
});
