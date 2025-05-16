import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Requests from "../../pages/Requests";

// Mock the RequestRow component
vi.mock("../../components/RequestRow", () => ({
  default: vi.fn(() => (
    <div data-testid="mocked-request-row">Mocked Request Row</div>
  )),
}));

describe("Requests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders RequestRow component", () => {
    render(<Requests />);
    expect(screen.getByTestId("mocked-request-row")).toBeInTheDocument();
    expect(screen.getByText("Mocked Request Row")).toBeInTheDocument();
  });

  it("applies correct styles to the container", () => {
    const { container } = render(<Requests />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass("mt-6");
    expect(mainDiv).toHaveClass("px-4");
  });

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
