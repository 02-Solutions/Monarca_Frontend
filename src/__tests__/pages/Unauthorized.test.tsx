
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
import { Unauthorized } from "./../../pages/Unauthorized";
import { beforeEach, describe, expect, it } from "vitest";

describe("Unauthorized component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Unauthorized />
      </MemoryRouter>
    );
  });

  it("muestra el título principal", () => {
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Unauthorized Access");
  });

  it("muestra el mensaje de permiso denegado", () => {
    expect(
      screen.getByText("You don't have permission to access this page.")
    ).toBeInTheDocument();
  });

  it("muestra el mensaje de contacto al administrador", () => {
    expect(
      screen.getByText("Please contact your administrator if you think this is an error.")
    ).toBeInTheDocument();
  });

  it("tiene un enlace al dashboard con la ruta correcta", () => {
    const dashLink = screen.getByRole("link", { name: /go to dashboard/i });
    expect(dashLink).toHaveAttribute("href", "/dashboard");
  });

  it("tiene un enlace a la página de ejemplo con la ruta correcta", () => {
    const exampleLink = screen.getByRole("link", { name: /go to example page/i });
    expect(exampleLink).toHaveAttribute("href", "/example");
  });
});
