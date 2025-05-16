import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CreateTravelRequest from "../../pages/CreateTravelRequest";

// Mock the CreateTravelRequestForm component
vi.mock("../../components/travel-requests/CreateTravelRequestForm", () => ({
  default: vi.fn(() => (
    <div data-testid="mocked-create-travel-request-form">
      Mocked Create Travel Request Form
    </div>
  )),
}));

describe("CreateTravelRequest", () => {
  it("renders the CreateTravelRequestForm component", () => {
    render(<CreateTravelRequest />);

    // Check if the mocked component is rendered
    expect(
      screen.getByTestId("mocked-create-travel-request-form")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Create Travel Request Form")
    ).toBeInTheDocument();
  });

  it("renders inside a div wrapper", () => {
    const { container } = render(<CreateTravelRequest />);

    // Check the container structure
    const rootDiv = container.firstChild;
    expect(rootDiv).toBeInTheDocument();
    expect(rootDiv?.nodeName).toBe("DIV");
  });
});
