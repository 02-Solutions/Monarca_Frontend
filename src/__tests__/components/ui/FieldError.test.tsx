import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FieldError from "../../../components/ui/FieldError";

describe("FieldError", () => {
  it("renders error message when provided", () => {
    render(<FieldError msg="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("does not render anything when no message is provided", () => {
    const { container } = render(<FieldError />);
    expect(container).toBeEmptyDOMElement();
  });

  it("applies correct styles to error message", () => {
    render(<FieldError msg="Error message" />);
    const errorElement = screen.getByText("Error message");
    expect(errorElement).toHaveClass("mt-1");
    expect(errorElement).toHaveClass("text-sm");
    expect(errorElement).toHaveClass("text-red-600");
  });

  it("renders as a paragraph element", () => {
    render(<FieldError msg="Error message" />);
    const errorElement = screen.getByText("Error message");
    expect(errorElement.tagName).toBe("P");
  });
});
