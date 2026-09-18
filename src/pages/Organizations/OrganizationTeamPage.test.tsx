import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getOrganizationEmployees } from "@/features/organization/api/organizationApi";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import type { Employee, EmployeeListRequest } from "@/features/organization/model/types";
import { OrganizationTeamPage } from "./OrganizationTeamPage";

vi.mock("@/features/organization/api/organizationApi", () => ({
  getOrganizationEmployees: vi.fn(),
}));

vi.mock("@/features/organization/ui/EmployeeInvitationCard", () => ({
  EmployeeInvitationCard: () => <div>Форма запрошення</div>,
}));

const employee: Employee = {
  organisationId: "123",
  memberId: "456",
  login: "andrii",
  email: "andrii@example.com",
  phone: "+380965683455",
  position: "Адміністратор",
  isBookable: true,
  memberIsActive: true,
  createdAt: "2026-09-18T08:00:00.000Z",
  updatedAt: "2026-09-18T08:00:00.000Z",
};

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/organizations/123/team"]}>
      <Routes>
        <Route path="/organizations/:organizationId/team" element={<OrganizationTeamPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe("OrganizationTeamPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useOrganizationStore.setState({
      items: [
        {
          id: "123",
          slug: "test-company",
          displayName: "Тестова компанія",
          legalName: null,
          organisationType: "INDIVIDUAL",
          taxId: null,
          logoUrl: null,
          position: null,
          isOwner: true,
        },
      ],
      details: {},
    });
    vi.mocked(getOrganizationEmployees).mockImplementation(async (payload) => ({
      items: [employee],
      pagination: {
        page: payload.page ?? 1,
        limit: payload.limit ?? 25,
        total: 60,
        pages: 3,
      },
    }));
  });

  afterEach(() => {
    cleanup();
    useOrganizationStore.setState({ items: [], details: {} });
  });

  it("loads another server page and resets pagination after debounced search", async () => {
    renderPage();

    await waitFor(() => expect(getOrganizationEmployees).toHaveBeenCalledTimes(1));
    expect(vi.mocked(getOrganizationEmployees).mock.calls[0]?.[0]).toMatchObject({
      organisationId: "123",
      page: 1,
      limit: 25,
      search: null,
      sort: { field: "createdAt", order: "desc" },
    });

    fireEvent.click(await screen.findByRole("button", { name: "Наступна" }));

    await waitFor(() =>
      expect(
        vi.mocked(getOrganizationEmployees).mock.calls.some(([payload]) => payload.page === 2),
      ).toBe(true),
    );

    fireEvent.change(screen.getByPlaceholderText("Пошук за ім’ям або контактами"), {
      target: { value: "andrii" },
    });

    await waitFor(
      () => {
        const requests = vi
          .mocked(getOrganizationEmployees)
          .mock.calls.map(([payload]) => payload as EmployeeListRequest);
        expect(requests.some((payload) => payload.page === 1 && payload.search === "andrii")).toBe(
          true,
        );
      },
      { timeout: 1200 },
    );
  });
});
