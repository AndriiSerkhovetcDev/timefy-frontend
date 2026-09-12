import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "./authStore";
import type { User } from "./types";
import { endCurrentSession } from "./endSession";
import { allowSessionRestore, isSessionRestoreSuppressed } from "./sessionRestore";

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
    allowSessionRestore();
    logoutCurrentSession.mockReset();
    logoutCurrentSession.mockResolvedValue(undefined);
    useAuthStore.setState({ user, token: "access-token" });
  });

  it("clears local authorization even when backend logout cannot be confirmed", async () => {
    logoutCurrentSession.mockRejectedValue(new TypeError("Network request failed"));

    await endCurrentSession();

    expect(logoutCurrentSession).toHaveBeenCalledOnce();
    expect(useAuthStore.getState()).toMatchObject({ user: null, token: null });
    expect(isSessionRestoreSuppressed()).toBe(true);
  });

  it("calls the business logout endpoint for another authorized role", async () => {
    useAuthStore.setState({ user: { ...user, role: "ADMIN" }, token: "admin-token" });

    await endCurrentSession();

    expect(logoutCurrentSession).toHaveBeenCalledOnce();
    expect(useAuthStore.getState()).toMatchObject({ user: null, token: null });
  });
});
