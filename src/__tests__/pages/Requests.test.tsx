/**
 * File: Requests.test.tsx
 * Description: Test suite for the Requests page component
 * Last edited: 16/05/2025
 * Author: Gabriel Edid Harari
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Requests from "../../pages/Requests";

/**
 * Mock the RequestRow component for simplified testing
 */
vi.mock("../../components/RequestRow", () => ({
  default: vi.fn(() => (
    <div data-testid="mocked-request-row">Mocked Request Row</div>
  )),
}));

describe("Requests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Tests if the RequestRow component renders correctly
   */
  it("renders RequestRow component", () => {
    render(<Requests />);
    expect(screen.getByTestId("mocked-request-row")).toBeInTheDocument();
    expect(screen.getByText("Mocked Request Row")).toBeInTheDocument();
  });

  /**
   * Tests if the correct styles are applied to the container
   */
  it("applies correct styles to the container", () => {
    const { container } = render(<Requests />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass("mt-6");
    expect(mainDiv).toHaveClass("px-4");
  });

  /**
   * Tests if the component has the correct DOM structure
   */
  it("has the correct structure", () => {
    const { container } = render(<Requests />);

    // Check the DOM structure
    const rootElement = container.firstChild;
    expect(rootElement).toBeInTheDocument();
    expect(rootElement?.nodeName).toBe("DIV");

    // Check that RequestRow is a direct child of the container
    const requestRowElement = screen.getByTestId("mocked-request-row");
    expect(requestRowElement.parentElement).toBe(rootElement);
  });
});
