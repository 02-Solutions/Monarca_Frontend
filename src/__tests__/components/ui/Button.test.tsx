import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../../../components/ui/Button";

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button).toHaveClass("custom-class");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies default styles", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button).toHaveClass("px-5");
    expect(button).toHaveClass("py-2.5");
    expect(button).toHaveClass("text-sm");
    expect(button).toHaveClass("font-medium");
    expect(button).toHaveClass("text-white");
    expect(button).toHaveClass("bg-[var(--blue)]");
    expect(button).toHaveClass("rounded-lg");
  });

  it("forwards additional props to button element", () => {
    render(
      <Button data-testid="test-button" disabled>
        Click me
      </Button>
    );
    const button = screen.getByTestId("test-button");
    expect(button).toBeDisabled();
  });
});
