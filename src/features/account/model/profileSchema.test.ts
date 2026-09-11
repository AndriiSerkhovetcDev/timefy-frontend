import { describe, expect, it } from "vitest";
import { didEmailChange } from "./profileSchema";

describe("didEmailChange", () => {
  it("ignores casing and surrounding whitespace", () => {
    expect(didEmailChange("User@Example.com", " user@example.com ")).toBe(false);
  });

  it("detects a different normalized email", () => {
    expect(didEmailChange("old@example.com", "new@example.com")).toBe(true);
  });
});
