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

  it("posts only the exchange code to API v2 with cookies and no cache", async () => {
    await exchangeExternalAuthCode("one-time-code");

    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/v2/auth/exchange", {
      method: "POST",
      body: JSON.stringify({ exchangeCode: "one-time-code" }),
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
  });
});
