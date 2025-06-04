import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DynamicTable from "../../components/Reservations/DynamicTable";

// Sample columns and data for Reservations DynamicTable
describe("DynamicTable (Reservations)", () => {
  const testColumns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    {
      key: "action",
      header: "Action",
      renderCell: (value: any, onChange: any) => (
        <button data-testid="custom-cell" onClick={() => onChange("clicked")}>
          {value || "Click"}
        </button>
      ),
    },
  ];

  const testData = [
    { id: 1, name: "John Doe", action: "View" },
    { id: 2, name: "Jane Smith", action: "Edit" },
  ];

  it("renders the table with correct columns", () => {
    render(<DynamicTable columns={testColumns} />);
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("renders the table with initial data", () => {
    render(<DynamicTable columns={testColumns} initialData={testData} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("renders custom cell components", () => {
    render(<DynamicTable columns={testColumns} initialData={testData} />);
    const customCells = screen.getAllByTestId("custom-cell");
    expect(customCells.length).toBe(2);
  });

  it("calls onDataChange when a cell value changes", () => {
    const handleDataChange = vi.fn();
    render(
      <DynamicTable
        columns={testColumns}
        initialData={testData}
        onDataChange={handleDataChange}
      />
    );
    // Click the first custom cell button
    const customCells = screen.getAllByTestId("custom-cell");
    expect(customCells[0]).toBeDefined();
    fireEvent.click(customCells[0]!);
    expect(handleDataChange).toHaveBeenCalled();
    expect(handleDataChange).toHaveBeenCalledTimes(1);
  });
});
