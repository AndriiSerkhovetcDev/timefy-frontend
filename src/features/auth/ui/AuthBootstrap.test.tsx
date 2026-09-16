import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/features/auth/model/authStore";
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

  it("does not proactively refresh a persisted session", async () => {
    useAuthStore.setState({ user: null, token: "persisted-token" });

    renderBootstrap();

    expect(await screen.findByText("Застосунок готовий")).toBeTruthy();
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("does not request a refresh when the local session has no token", async () => {
    renderBootstrap();

    expect(await screen.findByText("Застосунок готовий")).toBeTruthy();
    expect(refreshSession).not.toHaveBeenCalled();
  });
});
