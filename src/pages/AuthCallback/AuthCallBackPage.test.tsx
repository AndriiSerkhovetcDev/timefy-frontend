import { StrictMode } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/features/auth/model/authStore";
import { clearOAuthCallback } from "@/features/auth/model/oauthCallback";
import type { ExternalAuthExchangeResponse } from "@/shared/api/authApi";
import { AuthCallbackPage } from "./AuthCallBackPage";

const { exchangeExternalAuthCode } = vi.hoisted(() => ({
  exchangeExternalAuthCode: vi.fn(),
}));

vi.mock("@/shared/api/authApi", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/shared/api/authApi")>();
  return { ...original, exchangeExternalAuthCode };
});

const user = {
  login: "oauth-user",
  role: "USER" as const,
  email: "oauth@example.com",
  phone: "",
  emailVerified: true,
};

const renderCallback = () =>
  render(
    <StrictMode>
      <MemoryRouter>
        <AuthCallbackPage />
      </MemoryRouter>
    </StrictMode>,
  );

describe("AuthCallbackPage", () => {
  beforeEach(() => {
    clearOAuthCallback();
    exchangeExternalAuthCode.mockReset();
    useAuthStore.setState({ user: null, token: null });
  });

  afterEach(() => {
    cleanup();
    window.history.replaceState({}, "", "/");
  });

  it("cleans the URL immediately and exchanges a code only once in Strict Mode", async () => {
    let resolveExchange: (response: ExternalAuthExchangeResponse) => void = () => undefined;
    exchangeExternalAuthCode.mockReturnValue(
      new Promise<ExternalAuthExchangeResponse>((resolve) => {
        resolveExchange = resolve;
      }),
    );
    window.history.replaceState({}, "", "/auth/callback?provider=GOOGLE&code=single-use-code");

    renderCallback();

    expect(window.location.pathname).toBe("/auth/callback");
    expect(window.location.search).toBe("");
    expect(exchangeExternalAuthCode).toHaveBeenCalledOnce();
    expect(exchangeExternalAuthCode).toHaveBeenCalledWith("GOOGLE", "single-use-code");

    resolveExchange({ data: { provider: "GOOGLE", token: "access-token", user } });

    await waitFor(() => expect(useAuthStore.getState().token).toBe("access-token"));
    expect(useAuthStore.getState().user).toEqual(user);
  });

  it("shows one safe failure state and does not retry a rejected exchange", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    exchangeExternalAuthCode.mockRejectedValue(new Error("sensitive backend reason"));
    window.history.replaceState({}, "", "/auth/callback?provider=GOOGLE&code=rejected-code");

    const view = renderCallback();

    expect(
      await screen.findByRole("heading", { name: "Не вдалося завершити авторизацію" }),
    ).toBeTruthy();
    view.rerender(
      <StrictMode>
        <MemoryRouter>
          <AuthCallbackPage />
        </MemoryRouter>
      </StrictMode>,
    );

    expect(exchangeExternalAuthCode).toHaveBeenCalledOnce();
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("keeps the deprecated token and user callback compatible", async () => {
    const serializedUser = encodeURIComponent(JSON.stringify(user));
    window.history.replaceState({}, "", `/auth/callback?token=legacy-token&user=${serializedUser}`);

    renderCallback();

    await waitFor(() => expect(useAuthStore.getState().token).toBe("legacy-token"));
    expect(useAuthStore.getState().user).toEqual(user);
    expect(exchangeExternalAuthCode).not.toHaveBeenCalled();
    expect(window.location.search).toBe("");
  });

  it("shows the same safe failure for missing credentials and callback errors", async () => {
    window.history.replaceState({}, "", "/auth/callback?provider=GOOGLE&error=denied");
    renderCallback();

    expect(
      await screen.findByRole("heading", { name: "Не вдалося завершити авторизацію" }),
    ).toBeTruthy();
    expect(document.body.textContent).not.toContain("denied");
    expect(exchangeExternalAuthCode).not.toHaveBeenCalled();
  });
});
