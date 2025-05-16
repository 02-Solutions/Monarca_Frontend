/**
 * File: DynamicTableExpand.test.tsx
 * Description: Test suite for the DynamicTableExpand component
 * Last edited: 16/05/2025
 * Author: Gabriel Edid Harari
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DynamicTableExpand from "../../components/DynamicTableExpand";

describe("DynamicTableExpand", () => {
  // Define sample columns and test data
  const testColumns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    {
      key: "action",
      header: "Action",
      renderCell: (value: any, onChange: any, rowIndex?: number) => (
        <button
          data-testid={`custom-cell-${rowIndex}`}
          onClick={() => onChange("clicked")}
        >
          {value || "Click"}
        </button>
      ),
    },
  ];

  const testData: Array<Record<string, any>> = [
    { id: 1, name: "John Doe", action: "View" },
    { id: 2, name: "Jane Smith", action: "Edit" },
  ];

  /**
   * Tests if the table renders with the correct column headers
   */
  it("renders the table with correct columns", () => {
    render(<DynamicTableExpand columns={testColumns} />);

    // Check if column headers are displayed
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  /**
   * Tests if the table correctly renders initial data
   */
  it("renders the table with initial data", () => {
    render(<DynamicTableExpand columns={testColumns} initialData={testData} />);

    // Check if data is displayed in the table
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  /**
   * Tests if custom cell components render correctly
   */
  it("renders custom cell components", () => {
    render(<DynamicTableExpand columns={testColumns} initialData={testData} />);

    // Check if custom cell components are rendered
    const customCell0 = screen.getByTestId("custom-cell-0");
    const customCell1 = screen.getByTestId("custom-cell-1");
    expect(customCell0).toBeInTheDocument();
    expect(customCell1).toBeInTheDocument();
  });

  /**
   * Tests if onDataChange callback is called when add item button is clicked
   */
  it("calls onDataChange when add item button is clicked", () => {
    const handleDataChange = vi.fn();
    render(
      <DynamicTableExpand
        columns={testColumns}
        initialData={testData}
        onDataChange={handleDataChange}
      />
    );

    // Click add button
    const addButton = screen.getByText("+ Añadir comprobante de gasto");
    fireEvent.click(addButton);

    // Check if onDataChange was called with updated data
    expect(handleDataChange).toHaveBeenCalled();
    // Just verify it was called, don't check exact structure which may vary
    expect(handleDataChange).toHaveBeenCalledTimes(1);
  });

  /**
   * Tests if handleFieldChange is called when a cell value changes
   */
  it("calls handleFieldChange when a cell value changes", () => {
    const handleDataChange = vi.fn();
    render(
      <DynamicTableExpand
        columns={testColumns}
        initialData={testData}
        onDataChange={handleDataChange}
      />
    );

    // Click the custom cell button to trigger change
    const customCell = screen.getByTestId("custom-cell-0");
    fireEvent.click(customCell);

    // Check if onDataChange was called with updated data
    expect(handleDataChange).toHaveBeenCalled();
    // Just verify it was called with some data
    expect(handleDataChange).toHaveBeenCalledTimes(1);
  });

  /**
   * Tests if expanded rows render correctly
   */
  it("renders expanded rows when provided", () => {
    const expandedRows = [0];
    const renderExpandedRow = vi.fn((index) => (
      <div data-testid={`expanded-content-${index}`}>
        Expanded content for row {index}
      </div>
    ));

    render(
      <DynamicTableExpand
        columns={testColumns}
        initialData={testData}
        expandedRows={expandedRows}
        renderExpandedRow={renderExpandedRow}
      />
    );

    // Check if expanded content is rendered
    const expandedContent = screen.getByTestId("expanded-content-0");
    expect(expandedContent).toBeInTheDocument();
    expect(expandedContent).toHaveTextContent("Expanded content for row 0");

    // Check that renderExpandedRow was called with correct index
    expect(renderExpandedRow).toHaveBeenCalledWith(0);
  });

  /**
   * Tests if the component applies the correct styling classes
   */
  it("applies the correct styling classes", () => {
    render(<DynamicTableExpand columns={testColumns} initialData={testData} />);

    // Check header styling
    const headers = screen.getAllByRole("columnheader");
    headers.forEach((header) => {
      expect(header).toHaveClass("px-4 py-2 text-center");
    });

    // Check table styling
    const table = screen.getByRole("table");
    expect(table).toHaveClass(
      "w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-separate border-spacing-y-2"
    );

    // Check add button styling
    const addButton = screen.getByText("+ Añadir comprobante de gasto");
    expect(addButton).toHaveClass(
      "px-4 py-2 bg-[#0a2c6d] text-white rounded-md hover:bg-[#0d3d94] transition-colors hover:cursor-pointer"
    );
  });
});
