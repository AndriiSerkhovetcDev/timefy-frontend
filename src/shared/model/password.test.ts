import { describe, expect, it } from "vitest";
import { getPasswordRequirementResults, getPasswordStrength } from "./password";

describe("password feedback", () => {
  it("uses the same four requirements as password validation", () => {
    const results = getPasswordRequirementResults("Password1!");

    expect(results.every((requirement) => requirement.met)).toBe(true);
    expect(getPasswordStrength("Password1!")).toEqual({ score: 4, label: "Надійний" });
  });

  it("does not count unsupported special characters", () => {
    expect(getPasswordStrength("Password1?")).toEqual({ score: 3, label: "Добрий" });
  });

  it("reports an empty password without marking requirements as met", () => {
    expect(getPasswordStrength("")).toEqual({ score: 0, label: "Ще не введено" });
  });
});
