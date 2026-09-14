import { describe, expect, it } from "vitest";
import { organizationSchema } from "./organizationSchema";

const baseValues = {
  logo: null,
  displayName: "Beauty House",
  slug: "beauty-house",
};

describe("organizationSchema", () => {
  it("accepts a company with an 8-digit EDRPOU", () => {
    const result = organizationSchema.safeParse({
      ...baseValues,
      organisationType: "COMPANY",
      legalName: 'ТОВ "Beauty House Україна"',
      taxId: "12345678",
    });

    expect(result.success).toBe(true);
  });

  it("accepts tax identifiers as backend-owned strings", () => {
    const result = organizationSchema.safeParse({
      ...baseValues,
      organisationType: "COMPANY",
      legalName: 'ТОВ "Beauty House Україна"',
      taxId: "1234",
    });

    expect(result.success).toBe(true);
  });

  it("accepts a sole proprietor with a 10-digit RNOKPP", () => {
    const result = organizationSchema.safeParse({
      ...baseValues,
      organisationType: "SOLE_PROPRIETOR",
      legalName: "Іваненко Іван Іванович",
      taxId: "1234567890",
    });

    expect(result.success).toBe(true);
  });

  it("does not impose country-specific tax validation", () => {
    const result = organizationSchema.safeParse({
      ...baseValues,
      organisationType: "SOLE_PROPRIETOR",
      legalName: "Іваненко Іван Іванович",
      taxId: "12345678",
    });

    expect(result.success).toBe(true);
  });

  it("accepts an individual without tax details", () => {
    const result = organizationSchema.safeParse({
      ...baseValues,
      organisationType: "INDIVIDUAL",
    });

    expect(result.success).toBe(true);
  });

  it("requires an organization type", () => {
    const result = organizationSchema.safeParse(baseValues);

    expect(result.success).toBe(false);
  });

  it("trims the display name", () => {
    const result = organizationSchema.parse({
      ...baseValues,
      displayName: "  Beauty House  ",
      organisationType: "INDIVIDUAL",
    });

    expect(result.displayName).toBe("Beauty House");
  });

  it("removes irrelevant tax details from an individual output", () => {
    const result = organizationSchema.parse({
      ...baseValues,
      organisationType: "INDIVIDUAL",
      legalName: "  Іваненко Іван  ",
      taxId: "1234567890",
    });

    expect(result).toMatchObject({
      legalName: undefined,
      taxId: undefined,
    });
  });
});
