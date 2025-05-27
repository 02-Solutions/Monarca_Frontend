/**
 * @file Layout.test.tsx
 * @description This file contains the test suite for the Layout component. It tests the loading state, redirection to login, and proper rendering of Header, Sidebar, Footer and children when authenticated.
 * @lastEdited 2025-05-27
 * @author Leon Blanga
 */

import { render, screen } from "@testing-library/react";
import Layout from "../../components/Layout";
import { useAuth } from "../../hooks/auth/authContext";
import { vi, Mock } from "vitest";

// Mock de useAuth como función
vi.mock("../../hooks/auth/authContext", () => ({
  useAuth: vi.fn(),
}));

// Mocks de componentes internos
vi.mock("react-toastify", () => ({ ToastContainer: () => <div data-testid="toast" /> }));
vi.mock("../../components/Header",  () => ({ __esModule: true, default: () => <div>Header</div> }));
vi.mock("../../components/Sidebar", () => ({ __esModule: true, default: () => <div>Sidebar</div> }));
vi.mock("../../components/Footer",  () => ({ __esModule: true, default: () => <div>Footer</div> }));
vi.mock("react-router-dom", () => ({
  Navigate: ({ to }: { to: string }) => <div>Redirected to {to}</div>
}));

describe("Layout", () => {
  const mockedUseAuth = useAuth as unknown as Mock;

  it("muestra Loading... cuando loadingProfile=true", () => {
    mockedUseAuth.mockReturnValue({ loadingProfile: true, authState: { isAuthenticated: false } });
    render(<Layout><span>child</span></Layout>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirige a /login si no está autenticado", () => {
    mockedUseAuth.mockReturnValue({ loadingProfile: false, authState: { isAuthenticated: false } });
    render(<Layout><span>child</span></Layout>);
    // comprueba que hay un mensaje de redirección
    expect(screen.getByText(/^Redirected to/)).toBeInTheDocument();
    // y que NO aparece el child
    expect(screen.queryByText("child")).toBeNull();
  });

  it("renderiza children, Header, Sidebar y Footer cuando está autenticado", () => {
    mockedUseAuth.mockReturnValue({ loadingProfile: false, authState: { isAuthenticated: true } });
    render(<Layout><span>child</span></Layout>);

    // Componentes y contenido
    ["Header", "Sidebar", "child", "Footer"].forEach(text =>
      expect(screen.getByText(text)).toBeInTheDocument()
    );

    // ToastContainer aparece al menos una vez
    expect(screen.getAllByTestId("toast").length).toBeGreaterThanOrEqual(1);
  });
});
