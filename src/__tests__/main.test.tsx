// src/__tests__/main.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Import the routes directly to test configuration
import { router } from "../main";

// Mock the components
vi.mock("../pages/Dashboard", () => ({
  Dashboard: ({ title }) => <div data-testid="dashboard">{title}</div>,
}));

vi.mock("../pages/Login", () => ({
  default: () => <div data-testid="login">Login Page</div>,
}));

vi.mock("../hooks/auth/authContext", () => ({
  ProtectedRoute: ({ children }) => (
    <div data-testid="protected-route">{children}</div>
  ),
  PermissionProtectedRoute: ({ children }) => (
    <div data-testid="permission-route">{children}</div>
  ),
}));

describe("Router Configuration", () => {
  it("has correct routes defined", () => {
    // Test route existence
    const routes = router.routes;

    // Find login route
    const loginRoute = routes.find((route) => route.path === "/login");
    expect(loginRoute).toBeDefined();

    // Find dashboard route
    const rootRoute = routes.find((route) => route.path === "/");
    expect(rootRoute).toBeDefined();

    const dashboardRoute = rootRoute?.children?.find(
      (route) => route.path === "/dashboard",
    );
    expect(dashboardRoute).toBeDefined();

    // Test protected routes
    const travelRequestsRoute = rootRoute?.children?.find(
      (route) => route.path === "/travel-requests",
    );
    expect(travelRequestsRoute).toBeDefined();
  });
});
