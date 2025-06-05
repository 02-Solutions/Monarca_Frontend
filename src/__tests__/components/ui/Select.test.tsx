import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Select from "../../../components/ui/Select";

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Setup before tests
beforeAll(() => {
  window.ResizeObserver = ResizeObserverMock;
});

const mockOptions = [
  { id: 1, name: "Option 1" },
  { id: 2, name: "Option 2" },
  { id: 3, name: "Option 3" },
];

describe("Select", () => {
  it("renders with placeholder when no value is selected", () => {
    render(<Select options={mockOptions} value={null} onChange={() => {}} />);
    expect(screen.getByText("Selecciona una opción")).toBeInTheDocument();
  });

  it("renders selected value when provided", () => {
    render(
      <Select
        options={mockOptions}
        value={mockOptions[0]}
        onChange={() => {}}
      />
    );
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(
      <Select
        options={mockOptions}
        value={null}
        onChange={() => {}}
        isLoading={true}
      />
    );
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  it("shows disabled state", () => {
    render(
      <Select
        options={mockOptions}
        value={null}
        onChange={() => {}}
        isDisabled={true}
      />
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("bg-gray-100 cursor-not-allowed");
  });

  it("shows no options message when options array is empty", async () => {
    render(<Select options={[]} value={null} onChange={() => {}} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(
      await screen.findByText("No hay opciones disponibles.")
    ).toBeInTheDocument();
  });

  it("calls onChange when an option is selected", async () => {
    const handleChange = vi.fn();
    render(
      <Select options={mockOptions} value={null} onChange={handleChange} />
    );
    const button = screen.getByRole("button");
    await userEvent.click(button);
    const option = await screen.findByText("Option 1");
    await userEvent.click(option);
    expect(handleChange).toHaveBeenCalledWith(mockOptions[0]);
  });

  it("applies correct direction class", async () => {
    render(
      <Select
        options={mockOptions}
        value={null}
        onChange={() => {}}
        direction="up"
      />
    );
    const button = screen.getByRole("button");
    await userEvent.click(button);
    const optionsList = await screen.findByRole("listbox");
    expect(optionsList).toHaveClass("bottom-full mb-1");
  });

  it("shows check icon for selected option", async () => {
    render(
      <Select
        options={mockOptions}
        value={mockOptions[0]}
        onChange={() => {}}
      />
    );
    const button = screen.getByRole("button");
    await userEvent.click(button);
    // Get all elements with the text "Option 1"
    const allOptions = await screen.findAllByText("Option 1");
    // The dropdown option will have the class "font-semibold"
    const dropdownOption = allOptions.find((el) =>
      el.className.includes("font-semibold")
    );
    expect(dropdownOption).toBeDefined();
    expect(dropdownOption).toHaveClass("font-semibold");
  });
});
