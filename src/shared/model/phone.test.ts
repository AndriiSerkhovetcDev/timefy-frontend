import { describe, expect, it } from "vitest";
import { normalizePhone, ukrainianPhoneSchema } from "./phone";

describe("ukrainianPhoneSchema", () => {
  it("normalizes a formatted Ukrainian number", () => {
    expect(ukrainianPhoneSchema.parse("+38 (096) 568-34-56")).toBe("+380965683456");
  });

  it("accepts an already normalized Ukrainian number", () => {
    expect(ukrainianPhoneSchema.parse("+380965683456")).toBe("+380965683456");
  });

  it.each(["", "+38 (096) 568-34", "+48 (096) 568-34-56", "+3809656834567"])(
    "rejects an invalid number: %s",
    (phone) => {
      expect(ukrainianPhoneSchema.safeParse(phone).success).toBe(false);
    },
  );
});

describe("normalizePhone", () => {
  it("removes formatting characters", () => {
    expect(normalizePhone("+38 (050) 123-45-67")).toBe("+380501234567");
  });
});
