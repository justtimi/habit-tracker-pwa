import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SigunupForm";
import { AuthService } from "@/lib/auth";

describe("auth flow", () => {
  beforeEach(() => {
    localStorage?.removeItem("habit-tracker-users");
localStorage?.removeItem("habit-tracker-session");
localStorage?.removeItem("habit-tracker-habits");
  });

  it("submits the signup form and creates a session", () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    const session = AuthService.getSession();

    expect(session).not.toBeNull();
    expect(session?.email).toBe("test@example.com");
  });

  it("shows an error for duplicate signup email", () => {
    AuthService.signup("test@example.com", "password123");

    render(<SignupForm />);

    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    expect(screen.getByText("User already exists")).toBeInTheDocument();
  });

  it("submits the login form and stores the active session", () => {
    AuthService.signup("login@test.com", "123456");

    render(<LoginForm />);

    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "login@test.com" },
    });

    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByTestId("auth-login-submit"));

    const session = AuthService.getSession();

    expect(session).not.toBeNull();
    expect(session?.email).toBe("login@test.com");
  });

  it("shows an error for invalid login credentials", () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "wrong@test.com" },
    });

    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByTestId("auth-login-submit"));

    expect(
      screen.getByText("Invalid email or password")
    ).toBeInTheDocument();
  });
});