import { useAuthStore } from "@/features/auth/model/authStore";
import type { User } from "@/features/auth/model/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { httpClient, refreshSession } from "./httpClient";

const user: User = {
  login: "session-user",
  role: "USER",
  email: "session@example.com",
  phone: null,
  emailVerified: true,
  authData: { isWeb: true, isGoogle: false },
};

const response = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(headers),
    json: () => Promise.resolve(body),
  }) as Response;

describe("httpClient session refresh", () => {
  beforeEach(() => {
    useAuthStore.setState({ user, token: "old-token" });
  });

  it("shares one refresh between concurrent protected requests and retries each once", async () => {
    let refreshCalls = 0;
    let protectedCalls = 0;

    vi.stubGlobal(
      "fetch",
      vi.fn((url: string | URL | Request, options?: RequestInit) => {
        if (String(url).endsWith("/auth/refresh")) {
          refreshCalls += 1;
          return Promise.resolve(
            response(200, { data: { token: "new-token", user: { ...user, login: "refreshed" } } }),
          );
        }

        protectedCalls += 1;
        const authorization = (options?.headers as Record<string, string>).Authorization;
        return Promise.resolve(
          authorization === "Bearer old-token"
            ? response(401, { errorCode: "UNAUTHORIZED" })
            : response(200, { data: { ok: true } }),
        );
      }),
    );

    await Promise.all([httpClient.get("/protected"), httpClient.get("/protected")]);

    expect(refreshCalls).toBe(1);
    expect(protectedCalls).toBe(4);
    expect(useAuthStore.getState()).toMatchObject({
      token: "new-token",
      user: { login: "refreshed" },
    });
  });

  it("does not refresh again when the retried request returns 401", async () => {
    let refreshCalls = 0;

    vi.stubGlobal(
      "fetch",
      vi.fn((url: string | URL | Request) => {
        if (String(url).endsWith("/auth/refresh")) {
          refreshCalls += 1;
          return Promise.resolve(response(200, { data: { token: "new-token", user } }));
        }

        return Promise.resolve(response(401, { errorCode: "UNAUTHORIZED" }));
      }),
    );

    await expect(httpClient.get("/protected")).rejects.toMatchObject({
      status: 401,
      errorCode: "UNAUTHORIZED",
    });
    expect(refreshCalls).toBe(1);
  });

  it("clears the session only when refresh credentials are invalid", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(response(401, { errorCode: "UNAUTHORIZED" }))
        .mockResolvedValueOnce(response(401, { errorCode: "AUTH_REFRESH_INVALID" })),
    );

    await expect(httpClient.get("/protected")).rejects.toMatchObject({
      errorCode: "AUTH_REFRESH_INVALID",
    });
    expect(useAuthStore.getState()).toMatchObject({ user: null, token: null });
  });

  it("keeps the local session after a temporary refresh failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(response(401, { errorCode: "UNAUTHORIZED" }))
        .mockRejectedValueOnce(new TypeError("Network request failed")),
    );

    await expect(httpClient.get("/protected")).rejects.toThrow("Network request failed");
    expect(useAuthStore.getState()).toMatchObject({ user, token: "old-token" });
  });

  it("waits and retries a concurrent refresh only once", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        response(409, { errorCode: "AUTH_REFRESH_CONCURRENT" }, { "Retry-After": "0" }),
      )
      .mockResolvedValueOnce(response(200, { data: { token: "new-token", user } }));
    vi.stubGlobal("fetch", fetchMock);

    await refreshSession();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(useAuthStore.getState().token).toBe("new-token");
  });

  it("refreshes a protected request for another authorized role", async () => {
    const admin = { ...user, role: "ADMIN" as const };
    useAuthStore.setState({ user: admin, token: "admin-token" });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response(401, { errorCode: "UNAUTHORIZED" }))
      .mockResolvedValueOnce(response(200, { data: { token: "new-admin-token", user: admin } }))
      .mockResolvedValueOnce(response(200, { data: { ok: true } }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(httpClient.get("/protected")).resolves.toEqual({ data: { ok: true } });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(useAuthStore.getState()).toMatchObject({ user: admin, token: "new-admin-token" });
  });

  it("exposes error codes and Retry-After values to feature flows", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          response(
            429,
            { errorCode: "AUTH_RATE_LIMITED", message: "Забагато запитів" },
            { "Retry-After": "12" },
          ),
        ),
    );

    await expect(httpClient.post("/protected", {})).rejects.toMatchObject({
      status: 429,
      errorCode: "AUTH_RATE_LIMITED",
      retryAfterSeconds: 12,
      message: "Забагато запитів",
    });
  });
});
