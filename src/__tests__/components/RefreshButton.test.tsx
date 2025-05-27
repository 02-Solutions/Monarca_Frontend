/**
 * @file RefreshButton.test.tsx
 * @description This file contains the test suite for the RefreshButton component. It tests that the refresh button renders and includes the refresh icon.
 * @lastEdited 2025-05-27
 * @author Leon Blanga
 */

import { render, screen } from "@testing-library/react";
import RefreshButton from "../../components/RefreshButton";

describe("RefreshButton", () => {
  it("renderiza el botón", () => {
    render(<RefreshButton />);
    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
  });

  it("contiene el icono de refrescar (svg)", () => {
    const { container } = render(<RefreshButton />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
