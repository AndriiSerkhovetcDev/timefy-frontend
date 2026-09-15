import { beforeEach, describe, expect, it, vi } from "vitest";
import { httpClient } from "@/shared/api/httpClient";
import {
  acceptEmployeeInvitation,
  addOrganizationMemberAsEmployee,
  createEmployeeInvitation,
  createOrganization,
  getMyOrganizations,
  getOrganizationEmployees,
  previewEmployeeInvitation,
  revokeEmployeeInvitation,
  updateOrganization,
} from "./organizationApi";

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

  it("creates and revokes an employee invitation with string identifiers", async () => {
    vi.mocked(httpClient.post).mockResolvedValue({ data: {} });
    await createEmployeeInvitation({
      organisationId: "9007199254740993",
      position: "Адміністратор",
      isBookable: false,
    });
    await revokeEmployeeInvitation("9007199254740993", "invite-uuid");

    expect(httpClient.post).toHaveBeenNthCalledWith(
      1,
      "/organisations/employee-invitations/create",
      {
        organisationId: "9007199254740993",
        position: "Адміністратор",
        isBookable: false,
      },
    );
    expect(httpClient.post).toHaveBeenNthCalledWith(
      2,
      "/organisations/employee-invitations/revoke",
      { organisationId: "9007199254740993", invitationId: "invite-uuid" },
    );
  });

  it("uses public request options only for invitation preview", async () => {
    vi.mocked(httpClient.post).mockResolvedValue({ data: {} });
    await previewEmployeeInvitation("opaque-token");
    await acceptEmployeeInvitation("opaque-token");

    expect(httpClient.post).toHaveBeenNthCalledWith(
      1,
      "/organisations/employee-invitations/preview",
      { token: "opaque-token" },
      { includeAuthorization: false, retryUnauthorized: false },
    );
    expect(httpClient.post).toHaveBeenNthCalledWith(
      2,
      "/organisations/employee-invitations/accept",
      { token: "opaque-token" },
    );
  });

  it("adds an existing member without converting bigint identifiers", async () => {
    vi.mocked(httpClient.post).mockResolvedValue({ data: {} });
    await addOrganizationMemberAsEmployee({
      organisationId: "9007199254740993",
      memberId: "9007199254740995",
      position: null,
      isBookable: true,
    });
    expect(httpClient.post).toHaveBeenCalledWith("/organisations/employees/add-member", {
      organisationId: "9007199254740993",
      memberId: "9007199254740995",
      position: null,
      isBookable: true,
    });
  });

  it("requests the employee list with the organization identifier", async () => {
    vi.mocked(httpClient.post).mockResolvedValue({ data: { items: [], pagination: {} } });
    const payload = { organisationId: "9007199254740993" };
    const controller = new AbortController();

    await getOrganizationEmployees(payload, controller.signal);

    expect(httpClient.post).toHaveBeenCalledWith("/organisations/employees/list", payload, {
      signal: controller.signal,
    });
  });
});
