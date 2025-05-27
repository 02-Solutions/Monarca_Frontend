/**
 * File: Bookings.test.tsx
 * Description: Test suite for the Bookings page component
 * Last edited: 16/05/2025
 * Author: Gabriel Edid Harari
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Bookings from "../../pages/Bookings";

// Mock window.location.reload
const reloadMock = vi.fn();
Object.defineProperty(window, "location", {
  value: { reload: reloadMock },
  writable: true,
});

// Mock API service
vi.mock("../../utils/apiService", () => ({
  getRequest: vi.fn().mockResolvedValue([
    {
      id: 1,
      status: "pending",
      motive: "Business",
      title: "Test Trip",
      destination: { city: "New York" },
      requests_destinations: [{ departure_date: "2024-01-01", destination_order: 1 }]
    }
  ])
}));

// Mock components
vi.mock("../../components/RefreshButton", () => ({
  default: () => (
    <button 
      title="Refrescar" 
      onClick={() => window.location.reload()}
    >
      Refresh
    </button>
  )
}));

vi.mock("../../components/Refunds/Table", () => ({
  default: ({ columns, data }: any) => (
    <div data-testid="table">
      <div data-testid="columns-count">{columns.length}</div>
      <div data-testid="rows-count">{data.length}</div>
      {data.map((row: any, index: number) => (
        <div key={index} data-testid={`row-${index}`}>
          {row.title}
        </div>
      ))}
    </div>
  )
}));

vi.mock("../../components/Refunds/Button", () => ({
  default: ({ label, onClickFunction }: any) => (
    <button onClick={onClickFunction}>{label}</button>
  )
}));

vi.mock("../../components/GoBack", () => ({
  default: () => <div>Go Back</div>
}));

describe("Bookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it("renders the Bookings page with initial structure", async () => {
    renderWithRouter(<Bookings />);

    expect(screen.getByText("Viajes por Reservar")).toBeInTheDocument();
    expect(screen.getByTitle("Refrescar")).toBeInTheDocument();
    expect(screen.getByTestId("table")).toBeInTheDocument();
  });

  it("renders with correct column count", async () => {
    renderWithRouter(<Bookings />);
    
    // Wait for API data to load
    await screen.findByTestId("columns-count");
    expect(screen.getByTestId("columns-count").textContent).toBe("6");
  });

  it("reloads the page when refresh button is clicked", () => {
    renderWithRouter(<Bookings />);

    const refreshButton = screen.getByTitle("Refrescar");
    fireEvent.click(refreshButton);

    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});
