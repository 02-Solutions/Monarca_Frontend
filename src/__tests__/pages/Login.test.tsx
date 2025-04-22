import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../../pages/Login";

describe("LoginPage", () => {
  it("renders login form elements", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    // Check if page title is displayed
    expect(screen.getByText("INICIO DE SESIÓN")).toBeInTheDocument();

    // Check if input fields exist
    expect(screen.getByPlaceholderText("Correo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();

    // Check if submit button exists
    expect(screen.getByText("Continuar")).toBeInTheDocument();
  });
});
