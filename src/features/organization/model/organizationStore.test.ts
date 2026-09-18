import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMyOrganizations } from "../api/organizationApi";
import type { OrganizationPreview } from "./types";
import { useOrganizationStore } from "./organizationStore";

vi.mock("../api/organizationApi", () => ({
  getMyOrganizations: vi.fn(),
}));

const organization = (id: string): OrganizationPreview => ({
  id,
  slug: `company-${id}`,
  displayName: `Компанія ${id}`,
  legalName: null,
  organisationType: "INDIVIDUAL",
  taxId: null,
  logoUrl: null,
  position: null,
  isOwner: true,
});

const deferred = <Value>() => {
  let resolve!: (value: Value) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<Value>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
};

describe("organizationStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useOrganizationStore.setState({
      items: [],
      details: {},
      selectedId: null,
      userId: null,
      loadedUserId: null,
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("deduplicates concurrent organization requests for the same user", async () => {
    const request = deferred<OrganizationPreview[]>();
    vi.mocked(getMyOrganizations).mockReturnValue(request.promise);

    const load = useOrganizationStore.getState().load;
    const firstResult = load("user@example.com");
    const secondResult = load("user@example.com");

    expect(getMyOrganizations).toHaveBeenCalledTimes(1);

    request.resolve([organization("1")]);

    await expect(firstResult).resolves.toEqual([organization("1")]);
    await expect(secondResult).resolves.toEqual([organization("1")]);
    expect(useOrganizationStore.getState()).toMatchObject({
      items: [organization("1")],
      userId: "user@example.com",
      loadedUserId: "user@example.com",
      isLoading: false,
      error: null,
    });
  });

  it("ignores a stale response after another user starts loading", async () => {
    const oldRequest = deferred<OrganizationPreview[]>();
    const currentRequest = deferred<OrganizationPreview[]>();
    vi.mocked(getMyOrganizations)
      .mockReturnValueOnce(oldRequest.promise)
      .mockReturnValueOnce(currentRequest.promise);

    const load = useOrganizationStore.getState().load;
    const oldResult = load("old@example.com");
    const currentResult = load("current@example.com");

    currentRequest.resolve([organization("current")]);
    await currentResult;

    oldRequest.resolve([organization("old")]);
    await oldResult;

    expect(getMyOrganizations).toHaveBeenCalledTimes(2);
    expect(useOrganizationStore.getState()).toMatchObject({
      items: [organization("current")],
      userId: "current@example.com",
      loadedUserId: "current@example.com",
      isLoading: false,
      error: null,
    });
  });
});
