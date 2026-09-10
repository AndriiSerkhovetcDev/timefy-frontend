import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EXTERNAL_AUTH_PROVIDERS } from "../model/externalAuth";
import { GoogleAuth } from "./GoogleAuth";

const { startExternalAuthorization } = vi.hoisted(() => ({
  startExternalAuthorization: vi.fn(),
}));

vi.mock("../model/externalAuth", async (importOriginal) => {
  const original = await importOriginal<typeof import("../model/externalAuth")>();
  return { ...original, startExternalAuthorization };
});

afterEach(cleanup);

describe("GoogleAuth", () => {
  it("starts the enabled Google API v2 flow through top-level navigation", () => {
    render(<GoogleAuth />);
    fireEvent.click(screen.getByRole("button", { name: "Увійти через Google" }));

    expect(startExternalAuthorization).toHaveBeenCalledWith("GOOGLE");
    expect(EXTERNAL_AUTH_PROVIDERS.GOOGLE.authorizationUrl).toBe(
      "http://localhost:3000/api/v2/auth/oauth/google",
    );
    expect(EXTERNAL_AUTH_PROVIDERS.FACEBOOK.enabled).toBe(false);
    expect(EXTERNAL_AUTH_PROVIDERS.INSTAGRAM.enabled).toBe(false);
    expect(EXTERNAL_AUTH_PROVIDERS.APPLE.enabled).toBe(false);
  });
});
