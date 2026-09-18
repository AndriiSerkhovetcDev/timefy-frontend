import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/features/auth/model/authStore";
import * as organizationApi from "@/features/organization/api/organizationApi";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import { OrganizationSettingsPage } from "./OrganizationSettingsPage";

const userEmail = "owner@example.com";

const renderPage = (organizationId = "missing") =>
  render(
    <MemoryRouter initialEntries={[`/organizations/${organizationId}/settings`]}>
      <Routes>
        <Route
          path="/organizations/:organizationId/settings"
          element={<OrganizationSettingsPage />}
        />
      </Routes>
    </MemoryRouter>,
  );

describe("OrganizationSettingsPage", () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: "access-token",
      user: {
        login: "owner",
        role: "USER",
        email: userEmail,
        phone: null,
        emailVerified: true,
      },
    });
    useOrganizationStore.setState({
      items: [],
      details: {},
      userId: userEmail,
      loadedUserId: null,
      isLoading: true,
      error: null,
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    useAuthStore.setState({ token: null, user: null });
    useOrganizationStore.setState({
      items: [],
      details: {},
      userId: null,
      loadedUserId: null,
      isLoading: false,
      error: null,
    });
  });

  it("shows not-found only after the initial organization load completes", () => {
    renderPage();

    expect(screen.getByLabelText("Завантаження налаштувань компанії")).toBeTruthy();
    expect(screen.queryByText("Компанію не знайдено або вона недоступна.")).toBeNull();

    act(() => {
      useOrganizationStore.setState({
        loadedUserId: userEmail,
        isLoading: false,
      });
    });

    expect(screen.queryByLabelText("Завантаження налаштувань компанії")).toBeNull();
    expect(screen.getByText("Компанію не знайдено або вона недоступна.")).toBeTruthy();
  });

  it("asks for confirmation before deleting the organization logo", async () => {
    const organization = {
      id: "company-1",
      slug: "timefy-team",
      displayName: "Timefy Team",
      legalName: "Timefy Team LLC",
      organisationType: "COMPANY" as const,
      taxId: "12345678",
      logoUrl: "/files/logo.webp",
      position: null,
      isOwner: true,
    };
    const deleteLogo = vi
      .spyOn(organizationApi, "deleteOrganizationLogo")
      .mockResolvedValue({ organisationId: organization.id, logoUrl: null });
    vi.spyOn(organizationApi, "getMyOrganizations").mockResolvedValue([
      { ...organization, logoUrl: null },
    ]);
    useOrganizationStore.setState({
      items: [organization],
      details: {},
      loadedUserId: userEmail,
      isLoading: false,
      error: null,
    });
    renderPage(organization.id);

    const trigger = screen.getByRole("button", { name: "Видалити" });
    fireEvent.click(trigger);

    expect(screen.getByRole("heading", { name: "Видалити логотип?" })).toBeTruthy();
    expect(deleteLogo).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Скасувати" }));
    await waitFor(() =>
      expect(screen.queryByRole("heading", { name: "Видалити логотип?" })).toBeNull(),
    );
    await waitFor(() => expect(document.activeElement).toBe(trigger));

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Видалити логотип" }));

    await waitFor(() => expect(deleteLogo).toHaveBeenCalledWith(organization.id));
    await waitFor(() =>
      expect(screen.queryByRole("heading", { name: "Видалити логотип?" })).toBeNull(),
    );
  });
});
