import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/features/auth/model/authStore";
import { resendVerifyEmail, verifyEmail } from "@/shared/api/authApi";
import { VerifyEmailForm } from "./VerifyEmailForm";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("@/shared/api/authApi", () => ({
  resendVerifyEmail: vi.fn().mockResolvedValue(undefined),
  verifyEmail: vi.fn().mockResolvedValue({ data: { codeVerified: false } }),
}));

describe("VerifyEmailForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(resendVerifyEmail).mockResolvedValue(undefined);
    vi.mocked(verifyEmail).mockResolvedValue({ data: { codeVerified: false } });
    useAuthStore.setState({
      user: {
        login: "testuser",
        role: "USER",
        email: "test@example.com",
        phone: null,
        emailVerified: false,
      },
      token: "token",
    });
  });

  afterEach(() => {
    cleanup();
    useAuthStore.setState({ user: null, token: null });
  });

  it("sends a code only after user action and verifies automatically after the sixth digit", async () => {
    render(
      <MemoryRouter>
        <VerifyEmailForm />
      </MemoryRouter>,
    );

    expect(resendVerifyEmail).not.toHaveBeenCalled();
    expect(screen.queryByRole("group", { name: "Шестизначний код підтвердження" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Надіслати код" }));

    await waitFor(() => expect(resendVerifyEmail).toHaveBeenCalledWith({ login: "testuser" }));
    expect(screen.getByRole("group", { name: "Шестизначний код підтвердження" })).toBeTruthy();

    for (let index = 0; index < 6; index += 1) {
      fireEvent.change(screen.getByLabelText(`Цифра ${index + 1} з 6`), {
        target: { value: String(index + 1) },
      });
    }

    await waitFor(() =>
      expect(verifyEmail).toHaveBeenCalledWith({ login: "testuser", code: "123456" }),
    );
    expect(verifyEmail).toHaveBeenCalledTimes(1);

    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("Невірний код"));
    expect((screen.getByLabelText("Цифра 1 з 6") as HTMLInputElement).value).toBe("1");
  });

  it("updates the current user without navigating when embedded in the cabinet", async () => {
    vi.mocked(verifyEmail).mockResolvedValue({ data: { codeVerified: true } });

    render(
      <MemoryRouter>
        <VerifyEmailForm redirectTo={null} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Надіслати код" }));
    await waitFor(() =>
      expect(screen.getByRole("group", { name: "Шестизначний код підтвердження" })).toBeTruthy(),
    );

    fireEvent.change(screen.getByLabelText("Цифра 1 з 6"), {
      target: { value: "123456" },
    });

    await waitFor(() => expect(useAuthStore.getState().user?.emailVerified).toBe(true));
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
