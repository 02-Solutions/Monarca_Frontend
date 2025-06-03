import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MyDocument from "./../../utils/pdfViewer.tsx";

// Mock @react-pdf/renderer components
vi.mock("@react-pdf/renderer", () => ({
 Document: ({ children }: { children: React.ReactNode }) => <div data-testid="document">{children}</div>,
 Page: ({ children, size }: { children: React.ReactNode; size: string }) => 
   <div data-testid="page" data-size={size}>{children}</div>,
 View: ({ children }: { children: React.ReactNode }) => 
   <div data-testid="view">{children}</div>,
 Text: ({ children }: { children: React.ReactNode }) => <span data-testid="text">{children}</span>,
 StyleSheet: {
   create: vi.fn((styles) => styles)
 }
}));

describe("MyDocument Component", () => {
 it("renders document structure correctly", () => {
   const { getByTestId, getAllByTestId } = render(<MyDocument />);
   
   expect(getByTestId("document")).toBeInTheDocument();
   expect(getByTestId("page")).toBeInTheDocument();
   expect(getByTestId("page")).toHaveAttribute("data-size", "A4");
   expect(getAllByTestId("view")).toHaveLength(2);
   expect(getAllByTestId("text")).toHaveLength(2);
 });

 it("renders correct text content", () => {
   const { getByText } = render(<MyDocument />);
   
   expect(getByText("Section #1")).toBeInTheDocument();
   expect(getByText("Section #2")).toBeInTheDocument();
 });
});
