import { describe, expect, it } from "vitest";
import { emailSchema, normalizeEmail } from "./email";

describe("emailSchema", () => {
  it("normalizes casing and surrounding whitespace", () => {
    expect(emailSchema.parse("  User.Name@Example.COM  ")).toBe("user.name@example.com");
  });

  it.each(["", "user", "user@", "@example.com", "user@@example.com", "user name@example.com"])(
    "rejects an invalid email: %s",
    (email) => {
      expect(emailSchema.safeParse(email).success).toBe(false);
    },
  );

  it("rejects an email longer than 254 characters", () => {
    const email = `${"a".repeat(245)}@example.com`;

    expect(emailSchema.safeParse(email).success).toBe(false);
  });
});

describe("normalizeEmail", () => {
  it("trims and lowercases an email", () => {
    expect(normalizeEmail(" User@Example.com ")).toBe("user@example.com");
  });
});
