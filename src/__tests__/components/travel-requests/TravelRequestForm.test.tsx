// src/components/travel-requests/__tests__/TravelRequestForm.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TravelRequestForm from "../../../components/travel-requests/TravelRequestForm";
import { useNavigate } from "react-router-dom";
import { useDestinations } from "../../../hooks/destinations/useDestinations";
import { useCreateTravelRequest } from "../../../hooks/requests/useCreateRequest";
import { useUpdateTravelRequest } from "../../../hooks/requests/useUpdateRequest";

/* ---------------------------------------------------------------- */
/*  Test setup / mocks                                              */
/* ---------------------------------------------------------------- */

// Polyfill ResizeObserver for jsdom
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(global as any).ResizeObserver = ResizeObserverMock;

// Mock external hooks
vi.mock("react-router-dom", () => ({ useNavigate: vi.fn() }));
vi.mock("../../../hooks/destinations/useDestinations", () => ({
  useDestinations: vi.fn(),
}));
vi.mock("../../../hooks/requests/useCreateRequest", () => ({
  useCreateTravelRequest: vi.fn(),
}));
vi.mock("../../../hooks/requests/useUpdateRequest", () => ({
  useUpdateTravelRequest: vi.fn(),
}));

/* ---------------------------------------------------------------- */
/*  Shared test data                                                */
/* ---------------------------------------------------------------- */

const mockNavigate = vi.fn();
const mockDestinationOptions = [
  { id: "1", name: "Destination 1" },
  { id: "2", name: "Destination 2" },
];

beforeEach(() => {
  vi.clearAllMocks();

  (useNavigate as any).mockReturnValue(mockNavigate);
  (useDestinations as any).mockReturnValue({
    destinationOptions: mockDestinationOptions,
    isLoading: false,
  });
  (useCreateTravelRequest as any).mockReturnValue({
    createTravelRequestMutation: vi.fn(),
    isPending: false,
  });
  (useUpdateTravelRequest as any).mockReturnValue({
    updateTravelRequestMutation: vi.fn(),
    isPending: false,
  });
});

/* ---------------------------------------------------------------- */
/*  Tests                                                           */
/* ---------------------------------------------------------------- */

describe("TravelRequestForm", () => {
  it("renders the form with initial values", () => {
    render(<TravelRequestForm />);

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/motivo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prioridad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dinero adelantado/i)).toBeInTheDocument();
  });

  it("shows validation errors for required fields", async () => {
    render(<TravelRequestForm />);
    await userEvent.click(screen.getByRole("button", { name: /crear viaje/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/escribe el título del viaje/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/escribe el motivo del viaje/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/selecciona fecha de llegada/i)
      ).toBeInTheDocument();
    });
  });

  it("allows adding and removing destinations", async () => {
    render(<TravelRequestForm />);

    await userEvent.click(
      screen.getByRole("button", { name: /\+ añadir destino/i })
    );
    expect(screen.getByText(/destino #2/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /quitar/i }));
    expect(screen.queryByText(/destino #2/i)).not.toBeInTheDocument();
  });

  it("calculates stay days based on arrival and departure dates", async () => {
    render(<TravelRequestForm />);

    await userEvent.type(screen.getByLabelText(/fecha salida/i), "2024-03-01");
    await userEvent.type(screen.getByLabelText(/fecha llegada/i), "2024-03-05");

    await waitFor(() => {
      expect(screen.getByLabelText(/no\. días estancia/i)).toHaveValue(4);
    });
  });

  it("submits the form with valid data", async () => {
    const mockCreateMutation = vi.fn();
    (useCreateTravelRequest as any).mockReturnValue({
      createTravelRequestMutation: mockCreateMutation,
      isPending: false,
    });

    render(<TravelRequestForm />);
    const user = userEvent.setup();

    /* --- basic fields --- */
    await user.type(screen.getByLabelText(/título/i), "Test Trip");
    await user.type(screen.getByLabelText(/motivo/i), "Business Meeting");
    await user.type(screen.getByLabelText(/dinero adelantado/i), "1000");

    /* --- origin city dropdown --- */
    await user.click(screen.getByLabelText(/ciudad origen/i));
    await user.click(
      await screen.findByRole("option", { name: "Destination 1" })
    );

    /* --- priority dropdown --- */
    await user.click(screen.getByLabelText(/prioridad/i));
    await user.click(await screen.findByRole("option", { name: "Alta" }));

    /* --- destination dropdown inside Destino #1 --- */
    await user.click(screen.getByLabelText(/destino/i));
    await user.click(
      await screen.findByRole("option", { name: "Destination 1" })
    );

    /* --- remaining fields inside Destino #1 --- */
    await user.type(screen.getByLabelText(/detalles/i), "Hotel details");
    await user.type(screen.getByLabelText(/fecha salida/i), "2024-03-01");
    await user.type(screen.getByLabelText(/fecha llegada/i), "2024-03-05");

    /* --- submit --- */
    await user.click(screen.getByRole("button", { name: /crear viaje/i }));

    await waitFor(() => {
      expect(mockCreateMutation).toHaveBeenCalledWith({
        id_origin_city: "1",
        title: "Business Meeting", // motive is used as title in payload
        motive: "Business Meeting",
        priority: "alta",
        advance_money: 1000,
        requirements: undefined,
        requests_destinations: [
          {
            id_destination: "1",
            destination_order: 1,
            stay_days: 4,
            arrival_date: expect.any(String),
            departure_date: expect.any(String),
            is_hotel_required: true,
            is_plane_required: true,
            is_last_destination: true,
            details: "Hotel details",
          },
        ],
      });
    });
  });

  it("handles form submission errors", async () => {
    const mockCreateMutation = vi
      .fn()
      .mockRejectedValue(new Error("API Error"));
    (useCreateTravelRequest as any).mockReturnValue({
      createTravelRequestMutation: mockCreateMutation,
      isPending: false,
    });

    render(<TravelRequestForm />);
    const user = userEvent.setup();

    // Same happy-path typing sequence as above
    await user.type(screen.getByLabelText(/título/i), "Test Trip");
    await user.type(screen.getByLabelText(/motivo/i), "Business Meeting");
    await user.type(screen.getByLabelText(/dinero adelantado/i), "1000");

    await user.click(screen.getByLabelText(/ciudad origen/i));
    await user.click(
      await screen.findByRole("option", { name: "Destination 1" })
    );

    await user.click(screen.getByLabelText(/prioridad/i));
    await user.click(await screen.findByRole("option", { name: "Alta" }));

    await user.click(screen.getByLabelText(/destino/i));
    await user.click(
      await screen.findByRole("option", { name: "Destination 1" })
    );

    await user.type(screen.getByLabelText(/detalles/i), "Hotel details");
    await user.type(screen.getByLabelText(/fecha salida/i), "2024-03-01");
    await user.type(screen.getByLabelText(/fecha llegada/i), "2024-03-05");

    await user.click(screen.getByRole("button", { name: /crear viaje/i }));

    await waitFor(() => expect(mockCreateMutation).toHaveBeenCalled());
  });
});
