import { beforeEach, describe, expect, it, vi } from "vitest";
import { httpClient } from "@/shared/api/httpClient";
import { createOrganization, getMyOrganizations, updateOrganization } from "./organizationApi";

vi.mock("@/shared/api/httpClient", () => ({
  httpClient: { get: vi.fn(), post: vi.fn(), postForm: vi.fn() },
}));

describe("organizationApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates multipart data without converting identifiers or optional values", async () => {
    vi.mocked(httpClient.postForm).mockResolvedValue({ data: { id: "123" } });
    await createOrganization({
      slug: "timefy-team",
      displayName: "Timefy Team",
      organisationType: "COMPANY",
      taxId: "00123456",
    });

    const [endpoint, body] = vi.mocked(httpClient.postForm).mock.calls[0];
    expect(endpoint).toBe("/organisations/create");
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get("taxId")).toBe("00123456");
    expect((body as FormData).has("legalName")).toBe(false);
  });

  it("unwraps the current user's organization list", async () => {
    vi.mocked(httpClient.get).mockResolvedValue({ data: { items: [{ id: "9007199254740993" }] } });
    await expect(getMyOrganizations()).resolves.toEqual([{ id: "9007199254740993" }]);
  });

  it("sends bigint identifiers as strings for partial updates", async () => {
    vi.mocked(httpClient.post).mockResolvedValue({ data: {} });
    await updateOrganization({ organisationId: "9007199254740993", displayName: "Нова назва" });
    expect(httpClient.post).toHaveBeenCalledWith("/organisations/update", {
      organisationId: "9007199254740993",
      displayName: "Нова назва",
    });
  });
});
