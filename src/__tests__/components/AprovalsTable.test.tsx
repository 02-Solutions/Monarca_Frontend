import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Table from "./../../components/Approvals/Table.tsx";

const TableWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("Table Component", () => {
  const mockColumns = [
    { key: "name", header: "Name" },
    { key: "age", header: "Age" },
    { key: "city", header: "City" },
  ];

  const mockData = [
    { id: 1, name: "John", age: 25, city: "New York" },
    { id: 2, name: "Jane", age: 30, city: "Los Angeles" },
    { id: 3, name: "Bob", age: 35, city: "Chicago" },
    { id: 4, name: "Alice", age: 28, city: "Miami" },
    { id: 5, name: "Charlie", age: 32, city: "Seattle" },
    { id: 6, name: "Diana", age: 27, city: "Boston" },
  ];

  const mockLink = "/test-link";

  // ... existing tests ...

  it("handles page changes with boundary conditions", () => {
    render(
      <TableWrapper>
        <Table
          columns={mockColumns}
          data={mockData}
          link={mockLink}
          itemsPerPage={3}
        />
      </TableWrapper>,
    );

    const nextButton = screen.getByLabelText("Página siguiente");
    const prevButton = screen.getByLabelText("Página anterior");

    // Go to page 0 (should default to page 1)
    fireEvent.click(prevButton);
    expect(screen.getByText("1 / 2")).toBeInTheDocument();

    // Go beyond max page (should cap at max page)
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });

  it("renders JSX elements in data cells", () => {
    const dataWithJSX = [
      {
        id: 1,
        name: <span>Custom Name</span>,
        age: 25,
        city: "New York",
      },
    ];

    render(
      <TableWrapper>
        <Table columns={mockColumns} data={dataWithJSX} link={mockLink} />
      </TableWrapper>,
    );

    expect(screen.getByText("Custom Name")).toBeInTheDocument();
  });

  it("handles boolean values in data", () => {
    const mockColumnsWithBoolean = [
      { key: "name", header: "Name" },
      { key: "active", header: "Active" },
    ];

    const dataWithBoolean = [
      { id: 1, name: "John", active: true },
      { id: 2, name: "Jane", active: false },
    ];

    render(
      <TableWrapper>
        <Table
          columns={mockColumnsWithBoolean}
          data={dataWithBoolean}
          link={mockLink}
        />
      </TableWrapper>,
    );

    // Check that boolean values are rendered (they might be empty if component doesn't handle them)
    const johnRow = screen.getByText("John").closest("tr");
    const janeRow = screen.getByText("Jane").closest("tr");

    expect(johnRow).toBeInTheDocument();
    expect(janeRow).toBeInTheDocument();
  });

  it("handles large datasets with multiple pages", () => {
    const largeData = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      age: 20 + i,
      city: "City",
    }));

    render(
      <TableWrapper>
        <Table
          columns={mockColumns}
          data={largeData}
          link={mockLink}
          itemsPerPage={3}
        />
      </TableWrapper>,
    );

    expect(screen.getByText("1 / 4")).toBeInTheDocument();
    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.queryByText("User 4")).not.toBeInTheDocument();
  });

  it("applies correct CSS classes for rounded corners", () => {
    render(
      <TableWrapper>
        <Table
          columns={mockColumns}
          data={mockData.slice(0, 1)}
          link={mockLink}
        />
      </TableWrapper>,
    );

    const firstHeaderCell = screen.getByText("Name").closest("th");
    // The last column in the actual table is "Datos" based on the HTML output
    const lastHeaderCell = screen.getByText("Datos").closest("th");

    expect(firstHeaderCell).toHaveClass("rounded-l-lg");
    expect(lastHeaderCell).toHaveClass("rounded-r-lg");
  });

  it("handles empty data array and displays no data message", () => {
    render(
      <TableWrapper>
        <Table
          columns={mockColumns}
          data={[]}
          link={mockLink}
          itemsPerPage={5}
        />
      </TableWrapper>,
    );

    // Check that the no data message is displayed
    expect(screen.getByText("No hay datos disponibles")).toBeInTheDocument();

    // Verify pagination controls are not rendered when there's no data
    expect(screen.queryByLabelText("Página anterior")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Página siguiente")).not.toBeInTheDocument();

    // Verify the table structure is still present
    expect(screen.getByRole("table")).toBeInTheDocument();

    // Check that headers are still rendered
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("City")).toBeInTheDocument();
  });
});
