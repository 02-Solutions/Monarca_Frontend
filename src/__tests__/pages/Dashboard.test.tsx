import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dashboard } from "./../../pages/Dashboard";
import * as appContext from "../../hooks/app/appContext";

describe("Dashboard", () => {
  const mockSetPageTitle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(appContext, "useApp").mockReturnValue({
      setPageTitle: mockSetPageTitle,
      pageTitle: "Mock Title", // Add the required pageTitle property
      // Add any other required properties from your ContextType here
    });
  });

  it("renders dashboard with correct title and cards", () => {
    render(<Dashboard title="Dashboard Test" />);

    expect(mockSetPageTitle).toHaveBeenCalledWith("Dashboard Test");

    expect(screen.getByText("Crear solicitud de viaje")).toBeInTheDocument();
    expect(screen.getByText("Historial de viajes")).toBeInTheDocument();
    expect(screen.getByText("Solicitud de reembolso")).toBeInTheDocument();

    const svgElements = document.querySelectorAll("svg");
    expect(svgElements.length).toBe(3);
  });

  it("updates page title when title prop changes", () => {
    const { rerender } = render(<Dashboard title="Initial Title" />);
    expect(mockSetPageTitle).toHaveBeenCalledWith("Initial Title");

    rerender(<Dashboard title="Updated Title" />);
    expect(mockSetPageTitle).toHaveBeenCalledWith("Updated Title");
  });
});
