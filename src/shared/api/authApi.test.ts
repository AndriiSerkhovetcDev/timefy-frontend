import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  changePassword,
  createPassword,
  disconnectGoogle,
  exchangeExternalAuthCode,
  login,
  logoutCurrentSession,
  registration,
} from "./authApi";

const authResponse = {
  data: {
    token: "access-token",
    user: {
      login: "user",
      role: "USER",
      email: "user@example.com",
      phone: null,
      emailVerified: true,
    },
  },
};

describe("exchangeExternalAuthCode", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(authResponse),
      }),
    );
  });

  it("posts the provider and one-time code to API v2 with cookies and no cache", async () => {
    await exchangeExternalAuthCode("GOOGLE", "one-time-code");

    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/v2/auth/exchange", {
      method: "POST",
      body: JSON.stringify({ provider: "GOOGLE", code: "one-time-code" }),
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
  });

  it("sends cookies for login", async () => {
    await login({ login: "user", password: "Password1!" });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("sends cookies for registration", async () => {
    await registration({
      login: "user",
      email: "user@example.com",
      phone: "+380501234567",
      password: "Password1!",
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("logs out the current backend session with cookies", async () => {
    await logoutCurrentSession();

    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/v1/auth/logout", {
      method: "POST",
      body: undefined,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  });

  it("creates credentials without sending confirmPassword", async () => {
    await createPassword({ login: "new_login", password: "Password1!" });

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/v1/auth/create-password",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ login: "new_login", password: "Password1!" }),
      }),
    );
  });

  it("changes the password with the current and new values", async () => {
    await changePassword({ currentPassword: "Current1!", newPassword: "NewPassword1!" });

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/v1/auth/change-password",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          currentPassword: "Current1!",
          newPassword: "NewPassword1!",
        }),
      }),
    );
  });

  it("disconnects Google authentication through API v2", async () => {
    await disconnectGoogle();

    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/v2/auth/google/disconnect", {
      method: "POST",
      body: undefined,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  });
});
