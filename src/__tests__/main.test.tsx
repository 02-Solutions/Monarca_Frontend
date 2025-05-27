import { describe, it, expect, vi } from "vitest";
import { router } from "../main";

// Mock all components that cause import issues
vi.mock("../pages/Dashboard", () => ({
  Dashboard: ({ title }: { title: string }) => (
    <div data-testid="dashboard">{title}</div>
  ),
}));

vi.mock("../pages/Login", () => ({
  default: () => <div data-testid="login">Login Page</div>,
}));

vi.mock("../pages/Register", () => ({
  default: () => <div data-testid="register">Register Page</div>,
}));

vi.mock("../pages/Refunds/RefundsAcceptance", () => ({
  default: () => <div data-testid="refunds-acceptance">Refunds Acceptance</div>,
}));

vi.mock("../pages/CreateTravelRequest", () => ({
  default: () => (
    <div data-testid="create-travel-request">Create Travel Request</div>
  ),
}));

vi.mock("../hooks/auth/authContext", () => ({
  ProtectedRoute: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="protected-route">{children}</div>
  ),
  PermissionProtectedRoute: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="permission-route">{children}</div>
  ),
}));

describe("Router Configuration", () => {
  it("has correct routes defined", () => {
    const routes = router.routes;

    // Find public routes
    const loginRoute = routes.find((route) => route.path === "/");
    expect(loginRoute).toBeDefined();

    const registerRoute = routes.find((route) => route.path === "/register");
    expect(registerRoute).toBeDefined();

    // Find protected routes container
    const protectedRouteContainer = routes.find(
      (route) => route.path === "/" && route.children,
    );
    expect(protectedRouteContainer).toBeDefined();

    // Check protected routes exist
    const dashboardRoute = protectedRouteContainer?.children?.find(
      (route) => route.path === "/dashboard",
    );
    expect(dashboardRoute).toBeDefined();

    const refundsRoute = protectedRouteContainer?.children?.find(
      (route) => route.path === "/refunds",
    );
    expect(refundsRoute).toBeDefined();
  });
});
