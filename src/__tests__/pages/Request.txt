import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import Requests from "../../pages/Requests.tsx";
import RequestRow from "../../components/RequestRow";

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
    expect(RequestRow).toHaveBeenCalled();
    expect(screen.getByTestId("mocked-request-row")).toBeInTheDocument();
  });

  it("applies correct styles to the container", () => {
    const { container } = render(<Requests />);
    const minDiv = container.firstChild;
    expect(minDiv).toHaveClass("mt-6");
    expect(minDiv).toHaveClass("px-4");
  });
});
