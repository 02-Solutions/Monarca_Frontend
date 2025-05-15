import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { vi } from "vitest";
import Request from "../../pages/Requests.tsx";
import RequestRow from "../../components/RequestRow";

vi.mock("../../components/RequestRow", () => ({
  default: vi.fn(() => (
    <div data-testid="mocked-request-row:">Mocked Request Row</div>
  )),
}));

describe("Request", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders RequestRow component", () => {
    render(<Request />);
    expect(RequestRow).toHaveBeenCalled();
    expect(screen.getByTestId("mocked-request-row:")).toBeInTheDocument();
  });

  it("applies correct styles to the container", () => {
    const { container } = render(<Request />);

    const minDiv = container.firstChild;
    expect(minDiv).toHaveClass("mt-6 px-4");
    expect(minDiv).toHaveClass("px-4");
  });
});
