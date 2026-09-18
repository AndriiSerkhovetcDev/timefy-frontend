import { act, cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "@/features/auth/model/authStore";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import { OrganizationSettingsPage } from "./OrganizationSettingsPage";

const userEmail = "owner@example.com";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/organizations/missing/settings"]}>
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
});
