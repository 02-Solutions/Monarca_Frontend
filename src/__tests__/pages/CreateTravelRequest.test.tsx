/**
 * File: CreateTravelRequest.test.tsx
 * Description: Test suite for the CreateTravelRequest page component
 * Last edited: 16/05/2025
 * Author: Gabriel Edid Harari
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CreateTravelRequest from "../../pages/CreateTravelRequest";
import { MemoryRouter } from "react-router-dom";

/**
 * Mock the CreateTravelRequestForm component to simplify testing
 */
vi.mock("../../components/travel-requests/CreateTravelRequestForm", () => ({
  default: vi.fn(() => (
    <div data-testid="mocked-create-travel-request-form">
      Mocked Create Travel Request Form
    </div>
  )),
}));

describe("CreateTravelRequest", () => {
  /**
   * Tests if the CreateTravelRequestForm component is correctly rendered
   */
  it("renders the CreateTravelRequestForm component", () => {
    render(
      <MemoryRouter>
        <CreateTravelRequest />
      </MemoryRouter>
    );

    // Check if the mocked component is rendered
    expect(
      screen.getByTestId("mocked-create-travel-request-form")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Create Travel Request Form")
    ).toBeInTheDocument();
  });

  /**
   * Tests if the component is wrapped in a div container
   */
  it("renders inside a div wrapper", () => {
    const { container } = render(<CreateTravelRequest />);

    // Check the container structure
    const rootDiv = container.firstChild;
    expect(rootDiv).toBeInTheDocument();
    expect(rootDiv?.nodeName).toBe("DIV");
  });
});
