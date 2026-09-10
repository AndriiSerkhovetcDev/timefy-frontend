import { beforeEach, describe, expect, it, vi } from "vitest";
import { exchangeExternalAuthCode } from "./authApi";

describe("exchangeExternalAuthCode", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: {} }),
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
});
