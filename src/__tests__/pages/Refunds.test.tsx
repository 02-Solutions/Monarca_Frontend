/**
 * File: Refunds.test.tsx
 * Description: Test suite for the Refunds page component
 * Last edited: 16/05/2025
 * Author: Gabriel Edid Harari
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Refunds } from "../../pages/Refunds/Refunds";

// Mock navigate function
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock API service
vi.mock("../../utils/apiService", () => ({
  getRequest: vi.fn(() =>
    Promise.resolve([
      {
        id: 1,
        title: "Test Trip",
        status: "In Progress",
        advance_money: 1000,
        destination: { city: "NYC" },
        requests_destinations: [
          {
            departure_date: "2024-01-01",
            destination_order: 1,
          },
        ],
        createdAt: "2024-01-01",
      },
    ]),
  ),
}));

// Mock utility functions
vi.mock("../../utils/formatDate", () => ({
  default: (_date: string) => "2024-01-01",
}));

vi.mock("../../utils/formatMoney", () => ({
  default: (value: number) => `$${value.toFixed(2)}`,
}));

// Mock components
vi.mock("../../components/Refunds/Table", () => ({
  default: ({ columns, data }: any) => (
    <div data-testid="table">
      <div data-testid="table-columns">{columns.length}</div>
      <div data-testid="table-rows">{data.length}</div>
      {data.map((item: any, index: number) => (
        <div key={index} data-testid={`table-row-${index}`}>
          {item.action}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../components/Refunds/Button", () => ({
  default: ({ label, onClickFunction }: any) => (
    <button
      data-testid={`button-${label.toLowerCase()}`}
      onClick={onClickFunction}
    >
      {label}
    </button>
  ),
}));

vi.mock("../../components/RefreshButton", () => ({
  default: () => <button data-testid="refresh-button">Refresh</button>,
}));

vi.mock("../../components/GoBack", () => ({
  default: () => <div data-testid="go-back">Go Back</div>,
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("Refunds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it("renders the component with correct title", async () => {
    renderWithRouter(<Refunds />);

    await waitFor(() => {
      expect(
        screen.getByText("Viajes con gastos por comprobar"),
      ).toBeInTheDocument();
    });
  });

  it("renders go back button", async () => {
    renderWithRouter(<Refunds />);

    await waitFor(() => {
      expect(screen.getByTestId("go-back")).toBeInTheDocument();
    });
  });

  it("renders refresh button", async () => {
    renderWithRouter(<Refunds />);

    await waitFor(() => {
      expect(screen.getByTestId("refresh-button")).toBeInTheDocument();
    });
  });

  it("renders table with correct columns", async () => {
    renderWithRouter(<Refunds />);

    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
      expect(screen.getByTestId("table-columns")).toHaveTextContent("7");
    });
  });

  it("renders table with trip data", async () => {
    renderWithRouter(<Refunds />);

    await waitFor(() => {
      expect(screen.getByTestId("table-rows")).toHaveTextContent("1");
    });
  });

  it("navigates when Comprobar button is clicked", async () => {
    renderWithRouter(<Refunds />);

    await waitFor(() => {
      const comprobarButton = screen.getByTestId("button-comprobar");
      fireEvent.click(comprobarButton);
      expect(mockNavigate).toHaveBeenCalledWith("/refunds/1");
    });
  });

  it("shows loading state initially", async () => {
    // Create a new mock that never resolves
    const mockGetRequest = vi.fn(() => new Promise(() => {}));

    // Re-mock the module for this test only
    vi.doMock("../../utils/apiService", () => ({
      getRequest: mockGetRequest,
    }));

    renderWithRouter(<Refunds />);

    expect(screen.getByText("Cargando datos de viajes...")).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Create a fresh mock that rejects
    const mockGetRequest = vi.fn().mockRejectedValue(new Error("API Error"));

    // Reset and override the module mock
    vi.resetModules();
    vi.doMock("../../utils/apiService", () => ({
      getRequest: mockGetRequest,
    }));

    // Import component after mock override
    const { Refunds: FreshRefunds } = await import(
      "../../pages/Refunds/Refunds"
    );
    const { toast } = await import("react-toastify");

    render(
      <MemoryRouter>
        <FreshRefunds />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Error al cargar los viajes. Por favor, inténtelo de nuevo más tarde.",
      );
    });

    consoleSpy.mockRestore();
  });
});
