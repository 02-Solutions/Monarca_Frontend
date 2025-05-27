/**
 * @file Unauthorized.test.tsx
 * @description This file contains the test suite for the Unauthorized component.
 * It tests the rendering of the component and its elements, including the title,
 * messages, and links.
 * @lastEdited 2025-05-13
 * @author Leon Blanga
 */

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Unauthorized } from "../../pages/Unauthorized";
import { beforeEach, describe, expect, it } from "vitest";

describe("Unauthorized component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Unauthorized />
      </MemoryRouter>,
    );
  });

  it("muestra el título principal", () => {
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Acceso no autorizado");
  });

  it("muestra el mensaje de permiso denegado", () => {
    expect(
      screen.getByText("No tienes permiso para acceder a esta página."),
    ).toBeInTheDocument();
  });

  it("muestra el mensaje de contacto al administrador", () => {
    expect(
      screen.getByText(
        "Contacta a un administrador si crees que esto es un error.",
      ),
    ).toBeInTheDocument();
  });

  it("tiene un enlace al dashboard con la ruta correcta", () => {
    const dashLink = screen.getByRole("link", { name: /Ir al Panel/i });
    expect(dashLink).toHaveAttribute("href", "/dashboard");
  });

  it("tiene un enlace al login con la ruta correcta", () => {
    const loginLink = screen.getByRole("link", {
      name: /Ir a la Página de Iniciar Sesión/i,
    });
    expect(loginLink).toHaveAttribute("href", "/");
  });
});
