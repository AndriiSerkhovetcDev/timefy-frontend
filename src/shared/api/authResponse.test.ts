import { describe, expect, it } from "vitest";
import { InvalidAuthResponseError, parseAuthResponse } from "./authResponse";

const validResponse = {
  data: {
    token: "access-token",
    user: {
      login: "user",
      role: "SUPPORT",
      email: "user@example.com",
      phone: null,
      emailVerified: true,
      authData: {
        isWeb: true,
        isGoogle: false,
      },
    },
  },
};

describe("parseAuthResponse", () => {
  it("accepts a complete business auth response", () => {
    expect(parseAuthResponse(validResponse)).toEqual(validResponse);
  });

  it("accepts an auth response with an incomplete profile after registration", () => {
    const registrationResponse = {
      ...validResponse,
      data: {
        ...validResponse.data,
        user: {
          ...validResponse.data.user,
          firstName: null,
          lastName: null,
        },
      },
    };

    expect(parseAuthResponse(registrationResponse)).toEqual(registrationResponse);
  });

  it.each([
    {},
    { data: {} },
    { data: { token: "", user: validResponse.data.user } },
    { data: { token: "access-token" } },
    {
      data: {
        token: "access-token",
        user: { ...validResponse.data.user, role: "OWNER" },
      },
    },
  ])("rejects an incomplete or unsupported auth response", (response) => {
    expect(() => parseAuthResponse(response)).toThrow(InvalidAuthResponseError);
  });
});
