import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import { AccountNavigation } from "./AccountNavigation";

describe("AccountNavigation", () => {
  afterEach(() => {
    cleanup();
    useOrganizationStore.setState({ items: [], details: {}, selectedId: null });
  });

  it("shows collapsed navigation tooltips when links receive keyboard focus", () => {
    render(
      <MemoryRouter initialEntries={["/account"]}>
        <AccountNavigation isCollapsed />
      </MemoryRouter>,
    );

    const personalDataLink = screen.getByRole("link", { name: "Особисті дані" });
    fireEvent.focus(personalDataLink);

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.textContent).toContain("Особисті дані");
    expect(personalDataLink.getAttribute("aria-describedby")).toBe(tooltip.id);
  });
});
