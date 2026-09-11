import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PasswordInput } from "./password-input";

afterEach(cleanup);

describe("PasswordInput", () => {
  it("allows the user to show and hide the password", () => {
    render(<PasswordInput aria-label="Пароль" defaultValue="Password1!" />);

    const input = screen.getByLabelText("Пароль") as HTMLInputElement;
    expect(input.type).toBe("password");

    fireEvent.click(screen.getByRole("button", { name: "Показати пароль" }));
    expect(input.type).toBe("text");

    fireEvent.click(screen.getByRole("button", { name: "Сховати пароль" }));
    expect(input.type).toBe("password");
  });
});
