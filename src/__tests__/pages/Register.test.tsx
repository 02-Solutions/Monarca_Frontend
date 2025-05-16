// src/pages/Register.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Register from "../../pages/Register"; // Nombre del archivo/component real

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Register (Forgot Password)", () => {
  it("renders the forgot password form elements", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByText("¿Olvidaste tu contraseña?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ingresa tu correo electrónico con el cual inicias sesión para recuperar tu contraseña."
      )
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Correo")).toBeInTheDocument();
    expect(screen.getByText("Enviar")).toBeInTheDocument();
    expect(screen.getByText("¿Ya tienes cuenta?")).toBeInTheDocument();
    expect(screen.getByText("Inicia sesión")).toBeInTheDocument();
  });

  it("navigates to /dashboard on form submit", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText("Correo");
    const submitButton = screen.getByText("Enviar");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(submitButton);

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
