import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";

vi.mock("@/features/auth/ui/LoginForm", () => ({
  LoginForm: () => <div>Форма входу</div>,
}));

vi.mock("@/features/auth/ui/GoogleAuth", () => ({
  GoogleAuth: () => <button type="button">Увійти через Google</button>,
}));

vi.mock("@/shared/api/authApi", () => ({
  forgotPasswordEmailStep: vi.fn().mockResolvedValue({ success: true }),
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
    expect(screen.getByRole("button", { name: "Забули пароль?" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Зареєструватися" })).toBeTruthy();
  });

  it("opens password recovery in a dialog", () => {
    renderLoginPage();

    fireEvent.click(screen.getByRole("button", { name: "Забули пароль?" }));

    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Відновлення пароля" })).toBeTruthy();
    expect(screen.getByLabelText(/Email або логін/)).toBeTruthy();
  });

  it("shows only the success state after requesting a recovery link", async () => {
    renderLoginPage();
    fireEvent.click(screen.getByRole("button", { name: "Забули пароль?" }));
    fireEvent.change(screen.getByLabelText(/Email або логін/), {
      target: { value: "user@example.com" },
    });

    await waitFor(() =>
      expect(
        (screen.getByRole("button", { name: "Надіслати посилання" }) as HTMLButtonElement).disabled,
      ).toBe(false),
    );
    fireEvent.click(screen.getByRole("button", { name: "Надіслати посилання" }));

    expect(await screen.findByRole("heading", { name: "Перевірте пошту" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Відновлення пароля" })).toBeNull();
  });

  it("preserves the EMAIL_CHANGED message", () => {
    renderLoginPage({ reason: "EMAIL_CHANGED" });

    expect(screen.getByText("Email змінено")).toBeTruthy();
    expect(
      screen.getByText("Увійдіть повторно та підтвердьте нову електронну адресу."),
    ).toBeTruthy();
  });
});
