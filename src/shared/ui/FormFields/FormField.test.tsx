import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FormField } from "./FormField";

describe("FormField password feedback", () => {
  afterEach(() => {
    cleanup();
  });

  it("does not show password requirements on the login form by default", () => {
    render(<FormField label="Пароль" name="password" type="password" />);

    expect(screen.queryByText("Надійність пароля")).toBeNull();
  });

  it("shows password requirements when explicitly enabled", () => {
    render(
      <FormField
        label="Пароль"
        name="password"
        type="password"
        watchValue="Password1!"
        showPasswordFeedback
      />,
    );

    expect(screen.getByText("Надійність пароля")).toBeTruthy();
    expect(screen.getByText("Надійний")).toBeTruthy();
  });

  it("keeps password requirements hidden until the user starts typing", () => {
    render(
      <FormField
        label="Пароль"
        name="password"
        type="password"
        watchValue=""
        showPasswordFeedback
      />,
    );

    expect(screen.queryByText("Надійність пароля")).toBeNull();
  });
});
