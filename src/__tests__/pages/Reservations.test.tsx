import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import Reservations from "./../../pages/Reservations/Reservations.tsx";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "test-id" }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("../../utils/apiService", () => ({
  getRequest: vi.fn(),
  postRequest: vi.fn(),
  patchRequest: vi.fn(),
}));

vi.mock("../../utils/formatDate", () => ({
  default: vi.fn((date) => date),
}));

const { getRequest } = await import("../../utils/apiService");

const mockData = {
  destination: { city: "Origin City", country: "Origin Country" },
  requests_destinations: [
    {
      id: "dest-1",
      destination_order: 1,
      destination: { city: "Test City", country: "Test Country" },
      departure_date: "2024-01-15",
      arrival_date: "2024-01-20",
      is_hotel_required: true,
      is_plane_required: true,
      stay_days: 5,
      details: "Test details",
    },
  ],
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("Reservations Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getRequest).mockResolvedValue(mockData);
  });

  it("renders form and fetches data", async () => {
    render(
      <Wrapper>
        <Reservations />
      </Wrapper>
    );

    expect(screen.getByText("Asignar reservaciones")).toBeInTheDocument();

    await waitFor(() => {
      expect(getRequest).toHaveBeenCalledWith("/requests/test-id");
    });
  });

  it("handles form input changes", async () => {
    render(
      <Wrapper>
        <Reservations />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Destino #1")).toBeInTheDocument();
    });

    // Get the hotel section first, then find the input within it
    const hotelSection = screen.getByText("Información del hotel").closest('div');
    const hotelTitleInput = within(hotelSection!).getByRole('textbox', { name: /título/i }) as HTMLInputElement;
    
    fireEvent.change(hotelTitleInput, { target: { value: "Test Hotel", name: "hotel_title" } });
    
    expect(hotelTitleInput).toHaveValue("Test Hotel");
  });

  it("shows error when submitting empty form", async () => {
    render(
      <Wrapper>
        <Reservations />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Enviar reservaciones")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Enviar reservaciones"));

    expect(toast.error).toHaveBeenCalledWith("Por favor completa todos los campos requeridos.");
  });

  it("handles API error", async () => {
    vi.mocked(getRequest).mockRejectedValue(new Error("API Error"));

    render(
      <Wrapper>
        <Reservations />
      </Wrapper>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error fetching data");
    });
  });
});
