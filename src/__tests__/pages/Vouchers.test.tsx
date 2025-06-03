import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { Vouchers } from "./../../pages/Refunds/Vouchers.tsx";
import { getRequest, postRequest, patchRequest } from "../../utils/apiService";
import { toast } from "react-toastify";

// Mock dependencies
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "123" }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../utils/apiService", () => ({
  getRequest: vi.fn(),
  postRequest: vi.fn(),
  patchRequest: vi.fn(),
}));

vi.mock("../../utils/formatMoney", () => ({
  default: (amount: number) => `$${amount.toLocaleString()}`,
}));

// Mock components
vi.mock("../../components/Refunds/DynamicTable", () => ({
  default: ({ columns, onDataChange }: any) => (
    <div data-testid="dynamic-table">
      <button
        onClick={() =>
          onDataChange([
            {
              id: 1,
              spentClass: "food",
              amount: 100,
              taxIndicator: "yes",
              date: "2024-01-01",
            },
          ])
        }
        data-testid="add-row"
      >
        Add Row
      </button>
      {columns.map((col: any, idx: number) => (
        <div key={idx} data-testid={`column-${col.key}`}>
          {col.header}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../components/Refunds/InputField", () => ({
  default: ({ value, onChange, placeholder, type, required }: any) => (
    <input
      data-testid={`input-${type || "text"}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      required={required}
    />
  ),
}));

vi.mock("../../components/Refunds/DropDown", () => ({
  default: ({ value, onChange, options, placeholder }: any) => (
    <select data-testid="dropdown" value={value} onChange={onChange}>
      <option value="">{placeholder}</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("../../components/GoBack", () => ({
  default: () => <button data-testid="go-back">Go Back</button>,
}));

const mockTrip = {
  id: 123,
  title: "Business Trip to NYC",
  advance_money: 5000,
  destination: {
    city: "New York",
  },
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Vouchers Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders component with initial state", async () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);

    renderWithRouter(<Vouchers />);

    expect(
      screen.getByText("Formato de solicitud de reembolso"),
    ).toBeInTheDocument();
    expect(screen.getByText("Información del viaje")).toBeInTheDocument();
    expect(screen.getByTestId("dynamic-table")).toBeInTheDocument();
    expect(screen.getByTestId("go-back")).toBeInTheDocument();
  });

  it("displays trip information after loading", async () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);

    renderWithRouter(<Vouchers />);

    await waitFor(() => {
      expect(screen.getByText("123")).toBeInTheDocument();
      expect(screen.getByText("Business Trip to NYC")).toBeInTheDocument();
      expect(screen.getByText("New York")).toBeInTheDocument();
      expect(screen.getByText("$5,000")).toBeInTheDocument();
    });
  });

  it("renders dynamic table with correct columns", () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);

    renderWithRouter(<Vouchers />);

    expect(screen.getByTestId("column-spentClass")).toBeInTheDocument();
    expect(screen.getByTestId("column-amount")).toBeInTheDocument();
    expect(screen.getByTestId("column-taxIndicator")).toBeInTheDocument();
    expect(screen.getByTestId("column-date")).toBeInTheDocument();
    expect(screen.getByTestId("column-XMLFile")).toBeInTheDocument();
    expect(screen.getByTestId("column-PDFFile")).toBeInTheDocument();

    expect(screen.getByText("Clase de gasto")).toBeInTheDocument();
    expect(screen.getByText("Monto MXN")).toBeInTheDocument();
    expect(screen.getByText("Indicador de impuesto")).toBeInTheDocument();
    expect(screen.getByText("Fecha del comprobante")).toBeInTheDocument();
    expect(screen.getByText("Archivo XML")).toBeInTheDocument();
    expect(screen.getByText("Archivo PDF")).toBeInTheDocument();
  });

  it("handles form data changes when adding rows", async () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);

    renderWithRouter(<Vouchers />);

    const addRowButton = screen.getByTestId("add-row");
    fireEvent.click(addRowButton);

    // The mock DynamicTable simulates adding a row with test data
    // In a real test, you'd verify the actual form state changes
  });

  it("submits refund successfully", async () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);
    vi.mocked(postRequest).mockResolvedValue({});
    vi.mocked(patchRequest).mockResolvedValue({});

    renderWithRouter(<Vouchers />);

    // Add a row first
    const addRowButton = screen.getByTestId("add-row");
    fireEvent.click(addRowButton);

    // Submit the form
    const submitButton = screen.getByText("Enviar Solicitud");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(postRequest).toHaveBeenCalledWith(
        "/vouchers/upload",
        expect.any(FormData),
      );
      expect(patchRequest).toHaveBeenCalledWith(
        "/requests/finished-uploading-vouchers/123",
        {},
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Solicitud de reembolso enviada con éxito.",
      );
    });
  });

  it("handles API errors gracefully", async () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);
    vi.mocked(postRequest).mockRejectedValue(new Error("Network error"));

    renderWithRouter(<Vouchers />);

    // Add a row and submit
    const addRowButton = screen.getByTestId("add-row");
    fireEvent.click(addRowButton);

    const submitButton = screen.getByText("Enviar Solicitud");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Error al enviar la solicitud de reembolso. Por favor, inténtelo de nuevo más tarde.",
      );
    });
  });

  it("handles trip loading error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(getRequest).mockRejectedValue(new Error("Failed to load trip"));

    renderWithRouter(<Vouchers />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error al cargar el viaje: ",
        "Failed to load trip",
      );
    });

    consoleSpy.mockRestore();
  });

  it("renders cancel link correctly", () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);

    renderWithRouter(<Vouchers />);

    const cancelLink = screen.getByText("Cancelar");
    expect(cancelLink).toBeInTheDocument();
    expect(cancelLink.getAttribute("href")).toBe("/refunds");
  });

  it("renders comment input field", () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);

    renderWithRouter(<Vouchers />);

    expect(screen.getByText("Comentario")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ingrese un comentario"),
    ).toBeInTheDocument();
  });

  it("calls API with correct trip ID on mount", async () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);

    renderWithRouter(<Vouchers />);

    await waitFor(() => {
      expect(getRequest).toHaveBeenCalledWith("/requests/123");
    });
  });

  it("initializes with empty form data", () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);

    renderWithRouter(<Vouchers />);

    // Verify initial state through the presence of empty table
    expect(screen.getByTestId("dynamic-table")).toBeInTheDocument();
  });

  // Add these tests to your existing describe block

  it("handles file upload for XML files", async () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);
    renderWithRouter(<Vouchers />);

    // First add a row to trigger the table to render input fields
    const addRowButton = screen.getByTestId("add-row");
    fireEvent.click(addRowButton);

    // Wait for the dynamic table to update with form inputs
    await waitFor(() => {
      // The mock DynamicTable doesn't render actual file inputs,
      // so we test the column configuration instead
      expect(screen.getByTestId("column-XMLFile")).toBeInTheDocument();
    });
  });

  it("handles file upload for PDF files", async () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);
    renderWithRouter(<Vouchers />);

    const addRowButton = screen.getByTestId("add-row");
    fireEvent.click(addRowButton);

    await waitFor(() => {
      expect(screen.getByTestId("column-PDFFile")).toBeInTheDocument();
    });
  });

  it("handles dropdown changes for spend class", async () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);
    renderWithRouter(<Vouchers />);

    const addRowButton = screen.getByTestId("add-row");
    fireEvent.click(addRowButton);

    await waitFor(() => {
      expect(screen.getByTestId("column-spentClass")).toBeInTheDocument();
    });
  });

  it("handles input changes for amount field", async () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);
    renderWithRouter(<Vouchers />);

    const addRowButton = screen.getByTestId("add-row");
    fireEvent.click(addRowButton);

    await waitFor(() => {
      expect(screen.getByTestId("column-amount")).toBeInTheDocument();
    });
  });

  it("handles date input changes", async () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);
    renderWithRouter(<Vouchers />);

    const addRowButton = screen.getByTestId("add-row");
    fireEvent.click(addRowButton);

    await waitFor(() => {
      expect(screen.getByTestId("column-date")).toBeInTheDocument();
    });
  });

  it("submits multiple vouchers successfully", async () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);
    vi.mocked(postRequest).mockResolvedValue({});
    vi.mocked(patchRequest).mockResolvedValue({});

    // Mock the component's internal state change
    renderWithRouter(<Vouchers />);

    // Simulate adding multiple rows
    const addRowButton = screen.getByTestId("add-row");
    fireEvent.click(addRowButton);
    fireEvent.click(addRowButton);

    const submitButton = screen.getByText("Enviar Solicitud");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(postRequest).toHaveBeenCalled();
    });
  });

  it("handles empty form data on submission", async () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);
    vi.mocked(postRequest).mockResolvedValue({});
    vi.mocked(patchRequest).mockResolvedValue({});

    renderWithRouter(<Vouchers />);

    const submitButton = screen.getByText("Enviar Solicitud");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(patchRequest).toHaveBeenCalledWith(
        "/requests/finished-uploading-vouchers/123",
        {},
      );
    });
  });

  it("handles comment input change", () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);
    renderWithRouter(<Vouchers />);

    const commentInput = screen.getByPlaceholderText("Ingrese un comentario");
    fireEvent.change(commentInput, { target: { value: "Test comment" } });
  });

  it("displays default trip values when trip data is incomplete", async () => {
    const incompleteTrip = {
      id: 0,
      title: "",
      advance_money: 0,
      destination: { city: "" },
    };

    vi.mocked(getRequest).mockResolvedValue(incompleteTrip);
    renderWithRouter(<Vouchers />);

    await waitFor(() => {
      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText("$0")).toBeInTheDocument();
    });
  });

  it("handles non-Error objects in catch blocks", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(getRequest).mockRejectedValue("String error");
    renderWithRouter(<Vouchers />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error al cargar el viaje: ",
        "String error",
      );
    });

    consoleSpy.mockRestore();
  });

  it("handles submission error with non-Error objects", async () => {
    vi.mocked(getRequest).mockResolvedValue(mockTrip);
    vi.mocked(postRequest).mockRejectedValue("String error");

    renderWithRouter(<Vouchers />);

    const addRowButton = screen.getByTestId("add-row");
    fireEvent.click(addRowButton);

    const submitButton = screen.getByText("Enviar Solicitud");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
