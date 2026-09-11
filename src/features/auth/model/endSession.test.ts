import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "./authStore";
import type { User } from "./types";
import { endCurrentSession } from "./endSession";

const { logoutCurrentSession } = vi.hoisted(() => ({
  logoutCurrentSession: vi.fn(),
}));

vi.mock("@/shared/api/authApi", () => ({ logoutCurrentSession }));

const user: User = {
  login: "session-user",
  role: "USER",
  email: "session@example.com",
  phone: null,
  emailVerified: true,
  authData: { isWeb: true, isGoogle: false },
};

describe("endCurrentSession", () => {
  beforeEach(() => {
    logoutCurrentSession.mockReset();
    useAuthStore.setState({ user, token: "access-token" });
  });

  it("clears local authorization even when backend logout cannot be confirmed", async () => {
    logoutCurrentSession.mockRejectedValue(new TypeError("Network request failed"));

    await endCurrentSession();

    expect(logoutCurrentSession).toHaveBeenCalledOnce();
    expect(useAuthStore.getState()).toMatchObject({ user: null, token: null });
  });

  it("does not call the USER logout endpoint for another role", async () => {
    useAuthStore.setState({ user: { ...user, role: "ADMIN" }, token: "admin-token" });

    await endCurrentSession();

    expect(logoutCurrentSession).not.toHaveBeenCalled();
    expect(useAuthStore.getState()).toMatchObject({ user: null, token: null });
  });
});
