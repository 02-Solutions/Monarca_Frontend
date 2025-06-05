import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { TextArea } from "../../../components/ui/TextArea";

describe("TextArea", () => {
  it("renders with default props", () => {
    render(<TextArea />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<TextArea className="custom-class" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("custom-class");
  });

  it("handles value changes", () => {
    const handleChange = vi.fn();
    render(<TextArea onChange={handleChange} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "test" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("applies default styles", () => {
    render(<TextArea />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("block");
    expect(textarea).toHaveClass("p-2.5");
    expect(textarea).toHaveClass("w-full");
    expect(textarea).toHaveClass("text-sm");
    expect(textarea).toHaveClass("text-gray-900");
    expect(textarea).toHaveClass("bg-gray-50");
    expect(textarea).toHaveClass("rounded-lg");
    expect(textarea).toHaveClass("border");
    expect(textarea).toHaveClass("border-gray-300");
  });

  it("forwards additional props to textarea element", () => {
    render(
      <TextArea
        data-testid="test-textarea"
        disabled
        placeholder="Enter text"
        rows={5}
      />
    );
    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAttribute("placeholder", "Enter text");
    expect(textarea).toHaveAttribute("rows", "5");
  });

  it("works with ref forwarding", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<TextArea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
