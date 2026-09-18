import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMyOrganizations } from "@/features/organization/api/organizationApi";
import { useAuthStore } from "@/features/auth/model/authStore";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import type { OrganizationPreview } from "@/features/organization/model/types";
import { OrganizationWorkspaceLayout } from "./OrganizationWorkspaceLayout";

vi.mock("@/features/organization/api/organizationApi", () => ({
  getMyOrganizations: vi.fn(),
}));

vi.mock("@/features/auth/ui", () => ({
  UserMenu: () => <div>Меню користувача</div>,
}));

const memberOrganization: OrganizationPreview = {
  id: "123",
  slug: "test-company",
  displayName: "Тестова компанія",
  legalName: null,
  organisationType: "INDIVIDUAL",
  taxId: null,
  logoUrl: null,
  position: "Працівник",
  isOwner: false,
};

const renderLayout = () =>
  render(
    <MemoryRouter initialEntries={["/organizations/123"]}>
      <Routes>
        <Route path="/organizations/:organizationId" element={<OrganizationWorkspaceLayout />}>
          <Route index element={<div>Вміст компанії</div>} />
        </Route>
        <Route path="/account/organizations" element={<div>Список компаній</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe("OrganizationWorkspaceLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      token: "access-token",
      user: {
        login: "member",
        role: "USER",
        email: "member@example.com",
        phone: null,
        emailVerified: true,
      },
    });
    useOrganizationStore.setState({
      items: [],
      details: {
        "123": {
          id: "123",
          slug: "cached-company",
          displayName: "Кешована компанія",
          legalName: null,
          organisationType: "INDIVIDUAL",
          taxId: null,
          logoUrl: null,
          ownerId: "member",
          isActive: true,
          createdAt: "2026-09-18T08:00:00.000Z",
          updatedAt: "2026-09-18T08:00:00.000Z",
        },
      },
      error: null,
      isLoading: false,
      userId: "member@example.com",
    });
  });

  afterEach(() => {
    cleanup();
    useAuthStore.setState({ token: null, user: null });
    useOrganizationStore.setState({ items: [], details: {}, error: null, isLoading: false });
  });

  it("does not grant owner access from cached organization details", async () => {
    let resolveOrganizations!: (items: OrganizationPreview[]) => void;
    vi.mocked(getMyOrganizations).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveOrganizations = resolve;
        }),
    );

    renderLayout();

    expect(screen.getByText("Завантажуємо компанію…")).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Команда" })).toBeNull();

    await act(async () => {
      resolveOrganizations([memberOrganization]);
    });

    await waitFor(() => expect(screen.getByText("Вміст компанії")).toBeTruthy());
    expect(screen.getAllByText("Тестова компанія").length).toBeGreaterThan(0);
    expect(screen.queryByRole("link", { name: "Команда" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Налаштування" })).toBeNull();
  });

  it("shows collapsed navigation tooltips when links receive keyboard focus", async () => {
    vi.mocked(getMyOrganizations).mockResolvedValue([{ ...memberOrganization, isOwner: true }]);

    renderLayout();

    await waitFor(() => expect(screen.getByText("Вміст компанії")).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: "Згорнути бокову панель" }));

    const homeLink = screen.getByRole("link", { name: "Головна" });
    fireEvent.focus(homeLink);

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.textContent).toContain("Головна");
    expect(homeLink.getAttribute("aria-describedby")).toBe(tooltip.id);
  });
});
