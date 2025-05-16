/**
 * File: Error.test.tsx
 * Description: Test suite for the Error page component (404 Not Found)
 * Last edited: 16/05/2025
 * Author: Gabriel Edid Harari
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "../../pages/Error";

/**
 * Mock react-router-dom's Link component to simplify testing
 */
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({ to, children, className }: any) => (
      <a href={to} className={className} data-testid={`link-to-${to}`}>
        {children}
      </a>
    ),
  };
});

describe("NotFound", () => {
  /**
   * Tests if the 404 error page renders correctly with all expected content
   */
  it("renders the 404 error page", () => {
    render(<NotFound />);

    // Check if the 404 text is displayed
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Página no encontrada")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Lo sentimos, la página que estás buscando no existe o fue movida."
      )
    ).toBeInTheDocument();
  });

  /**
   * Tests if navigation links render with correct destinations
   */
  it("renders navigation links", () => {
    render(<NotFound />);

    // Check if the links are displayed with correct destinations
    const homeLink = screen.getByTestId("link-to-/");
    const dashboardLink = screen.getByTestId("link-to-/dashboard");

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveTextContent("Ir al Inicio");
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveTextContent("Ir al Panel");
  });

  /**
   * Tests if the 404 icon renders correctly with proper attributes
   */
  it("renders the 404 icon", () => {
    render(<NotFound />);

    const icon = screen.getByAltText("404 icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute(
      "src",
      "https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
    );
    expect(icon).toHaveClass("w-25 h-25 opacity-70");
  });

  /**
   * Tests if the correct CSS classes are applied for styling
   */
  it("applies the correct CSS classes for styling", () => {
    render(<NotFound />);

    // Check if the container has the correct styling classes
    const container = screen.getByText("404").closest("div");
    expect(container).toHaveClass("text-center");

    // Check if the links have the correct styling classes
    const homeLink = screen.getByTestId("link-to-/");
    const dashboardLink = screen.getByTestId("link-to-/dashboard");

    expect(homeLink).toHaveClass(
      "block w-full py-2 text-center text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
    );
    expect(dashboardLink).toHaveClass(
      "block w-full py-2 mt-3 text-center text-white bg-gray-600 rounded hover:bg-gray-500 transition-colors"
    );
  });
});
