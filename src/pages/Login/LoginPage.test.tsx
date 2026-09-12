import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";

vi.mock("@/features/auth/ui/LoginForm", () => ({
  LoginForm: () => <div>Форма входу</div>,
}));

vi.mock("@/features/auth/ui/GoogleAuth", () => ({
  GoogleAuth: () => <button type="button">Увійти через Google</button>,
}));

const renderLoginPage = (state?: { reason: string }) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: "/login", state }]}>
      <LoginPage />
    </MemoryRouter>,
  );

describe("LoginPage", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps the existing login actions in the redesigned layout", () => {
    renderLoginPage();

    expect(screen.getByRole("heading", { name: "З поверненням" })).toBeTruthy();
    expect(screen.getByText("Форма входу")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Увійти через Google" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Забули пароль?" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Зареєструватися" })).toBeTruthy();
  });

  it("preserves the EMAIL_CHANGED message", () => {
    renderLoginPage({ reason: "EMAIL_CHANGED" });

    expect(screen.getByText("Email змінено")).toBeTruthy();
    expect(
      screen.getByText("Увійдіть повторно та підтвердьте нову електронну адресу."),
    ).toBeTruthy();
  });
});
