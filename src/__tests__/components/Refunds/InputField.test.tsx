import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InputField from "../../../components/Refunds/InputField";

describe("InputField", () => {
  const defaultProps = {
    value: "",
    onChange: vi.fn(),
  };

  it("renders with basic props", () => {
    render(<InputField {...defaultProps} />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<InputField {...defaultProps} label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("shows required indicator when required", () => {
    render(<InputField {...defaultProps} label="Test Label" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("handles value changes", () => {
    const handleChange = vi.fn();
    render(<InputField {...defaultProps} onChange={handleChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test value" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("shows error message when provided", () => {
    render(<InputField {...defaultProps} error="Error message" />);
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("validates required field", () => {
    render(<InputField {...defaultProps} required />);
    const input = screen.getByRole("textbox");

    // Trigger validation by blurring
    fireEvent.blur(input);

    expect(screen.getByText("Este campo es obligatorio")).toBeInTheDocument();
  });

  it("applies custom validation", () => {
    const validateField = vi.fn().mockReturnValue("Custom error");
    render(
      <InputField
        {...defaultProps}
        value="test"
        validateField={validateField}
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    expect(validateField).toHaveBeenCalledWith("test");
    expect(screen.getByText("Custom error")).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<InputField {...defaultProps} disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<InputField {...defaultProps} className="custom-class" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-class");
  });

  it("handles focus and blur events", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(<InputField {...defaultProps} onFocus={onFocus} onBlur={onBlur} />);

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    expect(onFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("applies correct styles for different states", () => {
    const { rerender } = render(<InputField {...defaultProps} />);
    const input = screen.getByRole("textbox");

    // Default state
    expect(input).toHaveClass("border-gray-300");

    // Error state
    rerender(<InputField {...defaultProps} error="Error" />);
    expect(input).toHaveClass("border-red-500");

    // Required and invalid state
    rerender(<InputField {...defaultProps} required />);
    fireEvent.blur(input);
    expect(input).toHaveClass("border-red-500");
  });

  it("handles different input types", () => {
    const { rerender } = render(<InputField {...defaultProps} type="number" />);
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();

    rerender(<InputField {...defaultProps} type="checkbox" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();

    rerender(<InputField {...defaultProps} type="radio" />);
    expect(screen.getByRole("radio")).toBeInTheDocument();

    rerender(<InputField {...defaultProps} type="date" />);
    const dateInput = screen.getByRole("spinbutton");
    expect(dateInput).toHaveAttribute("type", "date");
  });

  it("handles checkbox and radio input states", () => {
    const { rerender } = render(
      <InputField {...defaultProps} type="checkbox" value="true" />
    );
    expect(screen.getByRole("checkbox")).toBeChecked();

    rerender(<InputField {...defaultProps} type="radio" value="true" />);
    expect(screen.getByRole("radio")).toBeChecked();
  });

  it("applies correct placeholder for date inputs", () => {
    render(<InputField {...defaultProps} type="date" />);
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("placeholder", "DD/MM/YYYY");
  });
});
