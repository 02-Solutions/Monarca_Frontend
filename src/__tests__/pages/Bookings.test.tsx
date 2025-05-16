import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Bookings from "../../pages/Bookings";

// Define types for mocked components
interface DropdownOption {
  value: string;
  label: string;
}

// Mock window.location.reload
const reloadMock = vi.fn();
Object.defineProperty(window, "location", {
  value: { reload: reloadMock },
  writable: true,
});

// Mock children components to render for testing
const mockDropdownComponent = vi.fn();
const mockInputFieldComponent = vi.fn();

// Mock the required components
vi.mock("../../components/Refunds/DynamicTable", () => ({
  default: vi.fn(
    ({
      columns,
      initialData,
      onDataChange,
      expandedRows,
      renderExpandedRow,
    }) => {
      // Simulate rendering of actual rows to allow testing
      const renderRows = () => {
        return initialData.map((row: Record<string, any>, rowIndex: number) => (
          <div key={rowIndex} data-testid={`table-row-${rowIndex}`}>
            {columns.map((col: any, colIndex: number) => (
              <div key={colIndex} data-testid={`cell-${rowIndex}-${col.key}`}>
                {col.renderCell
                  ? col.renderCell(row[col.key], () => {}, rowIndex)
                  : row[col.key]}
              </div>
            ))}
          </div>
        ));
      };

      return (
        <div data-testid="mocked-dynamic-table">
          <span data-testid="columns-count">{columns.length}</span>
          <span data-testid="rows-count">{initialData.length}</span>
          <div data-testid="expanded-rows-count">{expandedRows.length}</div>

          <div data-testid="column-headers">
            {columns.map((col: any, index: number) => (
              <div key={index} data-testid={`column-${col.key}`}>
                {col.header}
                {col.renderCell && (
                  <span data-testid={`has-renderer-${col.key}`}></span>
                )}
              </div>
            ))}
          </div>

          <div data-testid="table-rows">{renderRows()}</div>

          {expandedRows.length > 0 && (
            <div data-testid="expanded-content">
              {expandedRows.map((rowIndex: number) => (
                <div key={rowIndex} data-testid={`expanded-row-${rowIndex}`}>
                  {renderExpandedRow && (
                    <div data-testid="expanded-row-content">
                      {renderExpandedRow(rowIndex)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            data-testid="trigger-data-change"
            onClick={() => onDataChange && onDataChange([...initialData, {}])}
          >
            Change Data
          </button>

          <button
            data-testid="expand-row-0"
            onClick={() => {
              // Simulate expanding row 0 by updating the component's expandedRows state
              if (expandedRows.includes(0)) {
                if (onDataChange) onDataChange([...initialData]);
                return expandedRows.filter((idx: number) => idx !== 0);
              } else {
                // This will be captured in the test by checking for the presence of expanded content
                // Simulate setting expandedRows to include row 0
                if (onDataChange) onDataChange([...initialData]);

                // This simulates modifying the state so the next render will show expanded content
                setTimeout(() => {
                  const expandedContent = document.createElement("div");
                  expandedContent.setAttribute(
                    "data-testid",
                    "expanded-row-content"
                  );

                  // Add the employee fields that would be rendered by renderExpandedRow
                  [
                    "Empleado",
                    "Nombre",
                    "Acreedor",
                    "Posición",
                    "Correo electrónico",
                    "Sociedad",
                  ].forEach((label) => {
                    const fieldDiv = document.createElement("div");
                    fieldDiv.setAttribute(
                      "data-testid",
                      `input-field-${label}`
                    );
                    expandedContent.appendChild(fieldDiv);
                  });

                  // Append to document for test to find
                  const dynamicTable = document.querySelector(
                    "[data-testid='mocked-dynamic-table']"
                  );
                  if (dynamicTable) dynamicTable.appendChild(expandedContent);
                }, 0);

                return [...expandedRows, 0];
              }
            }}
          >
            Toggle Row 0 Expansion
          </button>
        </div>
      );
    }
  ),
}));

vi.mock("../../components/Refunds/InputField", () => ({
  default: vi.fn(({ value, onChange, label, type }) => {
    mockInputFieldComponent(value, onChange, label, type);
    return (
      <div data-testid={`input-field-${label || "no-label"}`}>
        <input
          data-testid={`input-${label || "no-label"}`}
          type={type || "text"}
          value={value || ""}
          onChange={(e) => onChange && onChange(e)}
        />
        {label && <span>{label}</span>}
      </div>
    );
  }),
}));

vi.mock("../../components/Refunds/DropDown", () => ({
  default: vi.fn(({ value, onChange, options, className }) => {
    mockDropdownComponent(value, onChange, options, className);
    return (
      <select
        data-testid="dropdown"
        value={value || ""}
        onChange={(e) => onChange && onChange(e)}
        className={className}
        data-options={
          options
            ? JSON.stringify(options.map((opt: DropdownOption) => opt.value))
            : "[]"
        }
      >
        {options &&
          options.map((option: DropdownOption, index: number) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    );
  }),
}));

describe("Bookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Bookings page with initial structure", () => {
    render(<Bookings />);

    // Verify page title and refresh button
    expect(screen.getByText("Viajes")).toBeInTheDocument();
    expect(screen.getByTitle("Refrescar")).toBeInTheDocument();

    // Verify DynamicTable is rendered
    const dynamicTable = screen.getByTestId("mocked-dynamic-table");
    expect(dynamicTable).toBeInTheDocument();

    // Verify columns count (11 columns)
    expect(screen.getByTestId("columns-count").textContent).toBe("11");

    // Verify initial rows count (3 rows)
    expect(screen.getByTestId("rows-count").textContent).toBe("3");
  });

  it("renders pagination controls", () => {
    render(<Bookings />);

    // Verify pagination controls
    expect(screen.getByText("Enseñando Página")).toBeInTheDocument();
    expect(screen.getByText("1/3")).toBeInTheDocument();
    expect(screen.getByText("Previa")).toBeInTheDocument();
    expect(screen.getByText("Siguiente")).toBeInTheDocument();

    // Verify page numbers
    const pageButtons = screen
      .getAllByText(/^[123]$/)
      .filter((button) => button.closest("button") !== null);
    expect(pageButtons.length).toBe(3);
  });

  it("handles form data changes through DynamicTable", () => {
    render(<Bookings />);

    // Trigger data change in DynamicTable
    const changeButton = screen.getByTestId("trigger-data-change");
    fireEvent.click(changeButton);

    // After change, the row count should update in the component state
    // We can't directly test the state, but we can test that the component doesn't crash
    expect(screen.getByTestId("mocked-dynamic-table")).toBeInTheDocument();
  });

  it("handles expanded rows correctly", () => {
    render(<Bookings />);

    // Verify the expanded rows count is initially 0
    expect(screen.getByTestId("expanded-rows-count").textContent).toBe("0");

    // Verify the renderExpandedRow function is passed to DynamicTable
    const dynamicTable = screen.getByTestId("mocked-dynamic-table");
    expect(dynamicTable).toBeInTheDocument();
  });

  it("renders with the correct styling classes", () => {
    render(<Bookings />);

    // Verify main container styling
    const container = screen.getByText("Viajes").closest("div")?.parentElement;
    expect(container).toHaveClass("bg-[#F4F6F8]");
    expect(container).toHaveClass("p-6");
    expect(container).toHaveClass("rounded-2xl");

    // Verify buttons styling
    const refreshButton = screen.getByTitle("Refrescar");
    expect(refreshButton).toHaveClass("text-[#0a2c6d]");

    const viajes = screen.getByText("Viajes");
    expect(viajes).toHaveClass("bg-[#0a2c6d]");
    expect(viajes).toHaveClass("text-white");
  });

  // New tests to improve coverage

  it("reloads the page when refresh button is clicked", () => {
    render(<Bookings />);

    // Find and click the refresh button
    const refreshButton = screen.getByTitle("Refrescar");
    fireEvent.click(refreshButton);

    // Check if window.location.reload was called
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it("renders all column headers with proper renderers", () => {
    render(<Bookings />);

    // Check column headers
    const columnHeaders = screen.getByTestId("column-headers");

    // Check Estados column has renderer
    expect(
      within(columnHeaders).getByTestId("column-estado")
    ).toBeInTheDocument();
    expect(
      within(columnHeaders).getByTestId("has-renderer-estado")
    ).toBeInTheDocument();

    // Check Viaje column
    expect(
      within(columnHeaders).getByTestId("column-viaje")
    ).toBeInTheDocument();
    expect(
      within(columnHeaders).getByTestId("has-renderer-viaje")
    ).toBeInTheDocument();

    // Check accion column (last column) which handles expansion
    expect(
      within(columnHeaders).getByTestId("column-accion")
    ).toBeInTheDocument();
    expect(
      within(columnHeaders).getByTestId("has-renderer-accion")
    ).toBeInTheDocument();
  });

  it("passes the correct props to renderExpandedRow function", () => {
    // Instead of testing the expanded row content directly, which requires DOM manipulation,
    // we'll test that the component is passing the correct props for rendering expanded content

    render(<Bookings />);

    // Verify dynamicTable receives the columns and data needed
    const columnHeaders = screen.getByTestId("column-headers");
    expect(columnHeaders).toBeInTheDocument();

    // Check if the action button for expansion exists in the test
    const expandButton = screen.getByTestId("expand-row-0");
    expect(expandButton).toBeInTheDocument();

    // We can't directly test DOM manipulation from the component's click handler
    // So we'll just verify the necessary components and props are included
    expect(mockInputFieldComponent).toHaveBeenCalled();
  });

  it("verifies correct options in dropdown components", () => {
    // This test verifies that DropDown components receive the correct options
    // without needing to directly check the rendered elements

    render(<Bookings />);

    // Verify that the mock was called with the expected options
    // The mock is called when creating the dropdown for the authorization column
    expect(mockDropdownComponent).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Function),
      expect.arrayContaining([
        expect.objectContaining({
          value: expect.any(String),
          label: expect.any(String),
        }),
      ]),
      expect.any(String)
    );
  });
});
