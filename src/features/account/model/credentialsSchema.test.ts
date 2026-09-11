import { describe, expect, it } from "vitest";
import { changePasswordSchema, createPasswordSchema } from "./credentialsSchema";

describe("credentials schemas", () => {
  it("normalizes login without modifying the password", () => {
    const result = createPasswordSchema.parse({
      login: "  valid_login  ",
      password: "Password1! ",
      confirmPassword: "Password1! ",
    });

    expect(result.login).toBe("valid_login");
    expect(result.password).toBe("Password1! ");
  });

  it("rejects unsupported login characters", () => {
    expect(
      createPasswordSchema.safeParse({
        login: "invalid-login",
        password: "Password1!",
        confirmPassword: "Password1!",
      }).success,
    ).toBe(false);
  });

  it("rejects passwords longer than 72 UTF-8 bytes", () => {
    const oversizedPassword = `Password1!${"🙂".repeat(16)}`;

    expect(
      createPasswordSchema.safeParse({
        login: "valid_login",
        password: oversizedPassword,
        confirmPassword: oversizedPassword,
      }).success,
    ).toBe(false);
  });

  it("validates confirmation and current password", () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: "Current1!",
        newPassword: "NewPassword1!",
        confirmPassword: "Different1!",
      }).success,
    ).toBe(false);
  });
});
