import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Table from "./../../components/Refunds/Table.tsx";

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

  it("renders table with headers and data", () => {
    render(<Table columns={mockColumns} data={mockData} itemsPerPage={3} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("City")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("handles pagination correctly", () => {
    render(<Table columns={mockColumns} data={mockData} itemsPerPage={3} />);

    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Next page"));
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("John")).not.toBeInTheDocument();
  });

  it("displays no data message when empty", () => {
    render(<Table columns={mockColumns} data={[]} />);

    expect(screen.getByText("No hay datos disponibles")).toBeInTheDocument();
    expect(screen.queryByLabelText("Previous page")).not.toBeInTheDocument();
  });

  it("handles null/undefined values", () => {
    const dataWithNulls = [
      { id: 1, name: null, age: undefined, city: "New York" },
    ];

    render(<Table columns={mockColumns} data={dataWithNulls} />);

    const cells = screen.getAllByText("N/A");
    expect(cells).toHaveLength(2);
    expect(screen.getByText("New York")).toBeInTheDocument();
  });

  it("applies correct CSS classes for rounded corners", () => {
    render(<Table columns={mockColumns} data={mockData.slice(0, 1)} />);

    const firstHeader = screen.getByText("Name").closest("th");
    const lastHeader = screen.getByText("City").closest("th");

    expect(firstHeader).toHaveClass("rounded-l-lg");
    expect(lastHeader).toHaveClass("rounded-r-lg");
  });

  it("handles page boundary conditions", () => {
    render(<Table columns={mockColumns} data={mockData} itemsPerPage={3} />);

    const prevButton = screen.getByLabelText("Previous page");
    const nextButton = screen.getByLabelText("Next page");

    expect(prevButton).toBeDisabled();

    fireEvent.click(nextButton);
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(nextButton).toBeDisabled();
  });

  it("renders JSX content in cells", () => {
    const dataWithJSX = [
      { id: 1, name: <span>Custom Name</span>, age: 25, city: "NYC" },
    ];

    render(<Table columns={mockColumns} data={dataWithJSX} />);
    expect(screen.getByText("Custom Name")).toBeInTheDocument();
  });
});
