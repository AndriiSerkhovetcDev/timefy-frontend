import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/features/auth/model/authStore";
import { ApiError } from "@/shared/api/httpClient";
import { AuthBootstrap } from "./AuthBootstrap";

const { refreshSession } = vi.hoisted(() => ({
  refreshSession: vi.fn(),
}));

vi.mock("@/shared/api/httpClient", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/shared/api/httpClient")>();
  return { ...original, refreshSession };
});

const renderBootstrap = (path = "/account") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthBootstrap>
        <div>Застосунок готовий</div>
      </AuthBootstrap>
    </MemoryRouter>,
  );

describe("AuthBootstrap", () => {
  beforeEach(() => {
    refreshSession.mockReset();
    useAuthStore.setState({ user: null, token: null });
  });

  afterEach(() => {
    cleanup();
  });

  it("restores a cookie-backed session before rendering a protected route", async () => {
    refreshSession.mockResolvedValue({
      data: {
        token: "new-token",
        user: {
          login: "user",
          role: "USER",
          email: "user@example.com",
          phone: null,
          emailVerified: true,
        },
      },
    });

    renderBootstrap();

    expect(await screen.findByText("Застосунок готовий")).toBeTruthy();
    expect(refreshSession).toHaveBeenCalledOnce();
  });

  it("does not refresh the session before processing an OAuth callback", async () => {
    renderBootstrap("/auth/callback");

    expect(await screen.findByText("Застосунок готовий")).toBeTruthy();
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("renders an anonymous public route after invalid refresh cookies", async () => {
    refreshSession.mockRejectedValue(
      new ApiError("Сесію не відновлено", 401, { errorCode: "AUTH_REFRESH_INVALID" }),
    );

    renderBootstrap("/");

    expect(await screen.findByText("Застосунок готовий")).toBeTruthy();
  });

  it("shows retry UI for a temporary refresh failure on a protected route", async () => {
    refreshSession.mockRejectedValue(new TypeError("Network request failed"));

    renderBootstrap();

    expect(await screen.findByText("Не вдалося перевірити сесію")).toBeTruthy();
    expect(screen.queryByText("Застосунок готовий")).toBeNull();
  });
});
