/**
 * @file GoBack.test.tsx
 * @description This file contains the test suite for the GoBack component. It tests that the back button renders with the correct label and navigates to /dashboard when clicked.
 * @lastEdited 2025-05-27
 * @author Leon Blanga
 */


import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GoBack from "../../components/GoBack";
import { vi } from "vitest";

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("GoBack", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it("renderiza el botón con ícono y texto", () => {
    render(<GoBack />);
    const btn = screen.getByRole("button", { name: /Regresar/i });
    expect(btn).toBeInTheDocument();
    // comprueba aria-label
    expect(btn).toHaveAttribute("aria-label", "Regresar");
    // el texto "Regresar" está presente
    expect(btn).toHaveTextContent("Regresar");
  });

  it("navega a /dashboard al hacer clic", async () => {
    render(<GoBack />);
    const btn = screen.getByRole("button", { name: /Regresar/i });
    await userEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
