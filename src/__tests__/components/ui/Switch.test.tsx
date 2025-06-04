import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Switch from "../../../components/ui/Switch";

describe("Switch", () => {
  it("renders with default props", () => {
    render(<Switch checked={false} onChange={() => {}} />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).not.toBeChecked();
  });

  it("renders in checked state", () => {
    render(<Switch checked={true} onChange={() => {}} />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeChecked();
    expect(switchElement).toHaveClass("bg-indigo-600");
  });

  it("renders in unchecked state", () => {
    render(<Switch checked={false} onChange={() => {}} />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();
    expect(switchElement).toHaveClass("bg-gray-300");
  });

  it("handles onChange event", () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} />);
    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("applies disabled state", () => {
    render(<Switch checked={false} onChange={() => {}} disabled={true} />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeDisabled();
    expect(switchElement).toHaveClass("cursor-not-allowed opacity-50");
  });

  it("merges custom className with base styles", () => {
    render(
      <Switch checked={false} onChange={() => {}} className="custom-class" />
    );
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveClass("custom-class");
    expect(switchElement).toHaveClass("relative inline-flex");
  });

  it("renders with custom screen reader label", () => {
    render(
      <Switch checked={false} onChange={() => {}} srLabel="Custom toggle" />
    );
    expect(screen.getByText("Custom toggle")).toBeInTheDocument();
  });

  it("applies correct transform class based on checked state", () => {
    const { rerender } = render(<Switch checked={false} onChange={() => {}} />);
    let thumb = screen
      .getByRole("switch")
      .querySelector("span[aria-hidden='true']");
    expect(thumb).toHaveClass("translate-x-1");

    rerender(<Switch checked={true} onChange={() => {}} />);
    thumb = screen
      .getByRole("switch")
      .querySelector("span[aria-hidden='true']");
    expect(thumb).toHaveClass("translate-x-7");
  });
});
