import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TextAreaField from "../../../components/Refunds/TextArea";

describe("TextAreaField", () => {
  const defaultProps = {
    value: "",
    onChange: vi.fn(),
  };

  it("renders with basic props", () => {
    render(<TextAreaField {...defaultProps} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<TextAreaField {...defaultProps} label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("shows required indicator when required", () => {
    render(<TextAreaField {...defaultProps} label="Test Label" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("handles value changes", () => {
    const handleChange = vi.fn();
    render(<TextAreaField {...defaultProps} onChange={handleChange} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "test value" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("shows error message when provided", () => {
    render(<TextAreaField {...defaultProps} error="Error message" />);
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("validates required field", () => {
    render(<TextAreaField {...defaultProps} required />);
    const textarea = screen.getByRole("textbox");

    // Trigger validation by blurring
    fireEvent.blur(textarea);

    expect(screen.getByText("Este campo es obligatorio")).toBeInTheDocument();
  });

  it("applies custom validation", () => {
    const validateField = vi.fn().mockReturnValue("Custom error");
    render(
      <TextAreaField
        {...defaultProps}
        value="test"
        validateField={validateField}
      />
    );

    const textarea = screen.getByRole("textbox");
    fireEvent.blur(textarea);

    expect(validateField).toHaveBeenCalledWith("test");
    expect(screen.getByText("Custom error")).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<TextAreaField {...defaultProps} disabled />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<TextAreaField {...defaultProps} className="custom-class" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("custom-class");
  });

  it("handles focus and blur events", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(
      <TextAreaField {...defaultProps} onFocus={onFocus} onBlur={onBlur} />
    );

    const textarea = screen.getByRole("textbox");
    fireEvent.focus(textarea);
    expect(onFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(textarea);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("applies correct styles for different states", () => {
    const { rerender } = render(<TextAreaField {...defaultProps} />);
    const textarea = screen.getByRole("textbox");

    // Default state
    expect(textarea).toHaveClass("border-gray-300");

    // Error state
    rerender(<TextAreaField {...defaultProps} error="Error" />);
    expect(textarea).toHaveClass("border-red-500");

    // Required and invalid state
    rerender(<TextAreaField {...defaultProps} required />);
    fireEvent.blur(textarea);
    expect(textarea).toHaveClass("border-red-500");
  });
});
