import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FilePreviewer from "./../../components/Refunds/FilePreviewer.tsx";

// Mock the utility functions
vi.mock("../../utils/formatDate", () => ({
  default: vi.fn((date) => `Formatted: ${date}`),
}));

vi.mock("../../utils/formatMoney", () => ({
  default: vi.fn((amount) => `$${amount.toFixed(2)}`),
}));

describe("FilePreviewer Component", () => {
  const mockFile = {
    file_url_pdf: "https://example.com/file.pdf",
    file_url_xml: "https://example.com/file.xml",
    class: "Expense",
    amount: 1500.5,
    date: "2024-01-15",
    status: "Approved",
  };

  it("renders file information and download links correctly", () => {
    render(<FilePreviewer file={mockFile} fileIndex={0} />);

    // Check if file details are displayed
    expect(screen.getByText("Expense")).toBeInTheDocument();
    expect(screen.getByText("$1500.50")).toBeInTheDocument();
    expect(screen.getByText("Formatted: 2024-01-15")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();

    // Check iframe is rendered with correct src
    const iframe = screen.getByTitle("Comprobante de Solicitud 1");
    expect(iframe).toHaveAttribute(
      "src",
      "https://example.com/file.pdf#navpanes=0&view=FitH",
    );

    // Check download links
    const xmlLink = screen.getByText("Descargar XML");
    const pdfLink = screen.getByText("Descargar PDF");

    expect(xmlLink).toHaveAttribute("href", "https://example.com/file.xml");
    expect(xmlLink).toHaveAttribute("download", "comprobante1.xml");
    expect(pdfLink).toHaveAttribute("href", "https://example.com/file.pdf");
    expect(pdfLink).toHaveAttribute("download", "comprobante1.pdf");
  });
});
