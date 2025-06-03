import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RequestRow from "../../components/RequestRow.tsx";

describe("RequestRow", () => {
  it("renders the component with initial data", () => {
    render(<RequestRow />);

    // Check if main button is rendered
    expect(screen.getByRole("button", { name: /viajes/i })).toBeInTheDocument();

    // Check if table headers are rendered
    expect(screen.getByText("Autorización")).toBeInTheDocument();
    expect(screen.getByText("Viaje")).toBeInTheDocument();
    expect(screen.getByText("Fecha Salida")).toBeInTheDocument();
    expect(screen.getByText("Población")).toBeInTheDocument();
    expect(screen.getByText("País")).toBeInTheDocument();
    expect(screen.getByText("Razón")).toBeInTheDocument();
    expect(screen.getByText("Comprobación")).toBeInTheDocument();
    expect(screen.getByText("Reembolso")).toBeInTheDocument();
    expect(screen.getByText("Moneda")).toBeInTheDocument();
  });

  it("renders initial data rows", () => {
    render(<RequestRow />);

    // Check if initial data is displayed
    expect(screen.getByDisplayValue("0001")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0002")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Cancún")).toBeInTheDocument();
    expect(screen.getByDisplayValue("CDMX")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Viaje")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Auditoría")).toBeInTheDocument();
  });

  it("renders employee information section", () => {
    render(<RequestRow />);

    // Check employee info section
    expect(screen.getByText("Empleado: 000001")).toBeInTheDocument();
    expect(screen.getByText("Nombre: Juan Pérez")).toBeInTheDocument();
    expect(screen.getByText("Acreedor: 000001")).toBeInTheDocument();
    expect(screen.getByText("Posición: 000001")).toBeInTheDocument();
    expect(screen.getByText("Correo: juan@mail.com")).toBeInTheDocument();
    expect(screen.getByText("Sociedad: 000001")).toBeInTheDocument();
  });

  it("allows editing input fields", () => {
    render(<RequestRow />);

    // Find and edit a city input field
    const cityInput = screen.getByDisplayValue("Cancún");
    fireEvent.change(cityInput, { target: { value: "Guadalajara" } });
    expect(screen.getByDisplayValue("Guadalajara")).toBeInTheDocument();

    // Find and edit a reason input field
    const reasonInput = screen.getByDisplayValue("Viaje");
    fireEvent.change(reasonInput, { target: { value: "Conferencia" } });
    expect(screen.getByDisplayValue("Conferencia")).toBeInTheDocument();
  });

  it("allows changing status dropdown values", () => {
    render(<RequestRow />);

    // Find status dropdowns by role and options
    const statusDropdowns = screen.getAllByRole("combobox");
    const statusDropdown = statusDropdowns.find((dropdown) =>
      dropdown.querySelector('option[value="autorizado"]'),
    );

    expect(statusDropdown).toBeInTheDocument();

    // Change the dropdown value
    fireEvent.change(statusDropdown!, { target: { value: "pendiente" } });

    // Check that the change occurred by checking if the dropdown has the new value
    expect(statusDropdown).toHaveValue("pendiente");
  });

  it("allows changing currency dropdown values", () => {
    render(<RequestRow />);

    // Find currency dropdowns by looking for dropdowns with MXN options
    const currencyDropdowns = screen.getAllByRole("combobox");
    const currencyDropdown = currencyDropdowns.find((dropdown) =>
      dropdown.querySelector('option[value="MXN"]'),
    );

    expect(currencyDropdown).toBeInTheDocument();

    // Change the currency dropdown
    fireEvent.change(currencyDropdown!, { target: { value: "USD" } });

    // Check that the change occurred
    expect(currencyDropdown).toHaveValue("USD");
  });

  it("allows editing date fields", () => {
    render(<RequestRow />);

    // Find date inputs by their type attribute and placeholder
    const dateInputs = screen.getAllByPlaceholderText("DD/MM/YYYY");
    expect(dateInputs.length).toBeGreaterThan(0);

    // Verify they are date type inputs
    expect(dateInputs[0]).toHaveAttribute("type", "date");

    // Change a date - ensure the element exists before using it
    const firstDateInput = dateInputs[0];
    if (firstDateInput) {
      fireEvent.change(firstDateInput, { target: { value: "2025-01-15" } });
      expect(firstDateInput).toHaveValue("2025-01-15");
    }
  });

  it("renders dropdown options correctly", () => {
    render(<RequestRow />);

    // Check if dropdown options exist in the DOM
    expect(screen.getAllByText("Autorizado")).toHaveLength(2); // 2 options in 2 dropdowns
    expect(screen.getAllByText("Pendiente")).toHaveLength(2); // 2 options in 2 dropdowns
    expect(screen.getAllByText("MXN")).toHaveLength(2); // 2 currency options
    expect(screen.getAllByText("USD")).toHaveLength(2); // 2 currency options
  });

  it("allows editing refund amounts", () => {
    render(<RequestRow />);

    // Find and edit refund input
    const refundInput = screen.getByDisplayValue("$100");
    fireEvent.change(refundInput, { target: { value: "$150" } });
    expect(screen.getByDisplayValue("$150")).toBeInTheDocument();
  });

  it("allows editing country fields", () => {
    render(<RequestRow />);

    // Find country inputs
    const countryInputs = screen.getAllByDisplayValue("MX");
    expect(countryInputs.length).toBeGreaterThan(0);

    // Change country (filter to get only input fields, not dropdowns)
    const countryInput = countryInputs.find(
      (input) => input.tagName === "INPUT",
    );
    if (countryInput) {
      fireEvent.change(countryInput, { target: { value: "US" } });
      expect(screen.getByDisplayValue("US")).toBeInTheDocument();
    }
  });

  it("allows editing settlement fields", () => {
    render(<RequestRow />);

    // Find and edit settlement input
    const settlementInput = screen.getByDisplayValue("A liquidar");
    fireEvent.change(settlementInput, { target: { value: "Liquidado" } });
    expect(screen.getByDisplayValue("Liquidado")).toBeInTheDocument();
  });

  it("handles multiple row editing independently", () => {
    render(<RequestRow />);

    // Get all city inputs (should be 2)
    const cancunInput = screen.getByDisplayValue("Cancún");
    const cdmxInput = screen.getByDisplayValue("CDMX");

    // Edit both independently
    fireEvent.change(cancunInput, { target: { value: "Monterrey" } });
    fireEvent.change(cdmxInput, { target: { value: "Tijuana" } });

    // Both changes should be present
    expect(screen.getByDisplayValue("Monterrey")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tijuana")).toBeInTheDocument();
  });

  it("maintains data structure when editing", () => {
    render(<RequestRow />);

    // Edit multiple fields and ensure they all persist
    const viageInput = screen.getByDisplayValue("0001");
    const auditoriaReason = screen.getByDisplayValue("Auditoría");

    fireEvent.change(viageInput, { target: { value: "0003" } });
    fireEvent.change(auditoriaReason, { target: { value: "Revisión" } });

    // Both original and new values should coexist
    expect(screen.getByDisplayValue("0003")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Revisión")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0002")).toBeInTheDocument(); // Second row ID should remain
  });
});
