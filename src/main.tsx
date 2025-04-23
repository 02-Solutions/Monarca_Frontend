import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Example from "./pages/Example.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { Refunds } from "./pages/Refunds/Refunds.tsx";
import { Unauthorized } from "./pages/Unauthorized.tsx";
import {
  ProtectedRoute,
  PermissionProtectedRoute,
} from "./hooks/auth/authContext";
import "flowbite";

const router = createBrowserRouter([
  // Basic protected routes (requires only authentication)
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      // Routes protected by specific permissions
      {
        path: "/approval",
        element: (
          <PermissionProtectedRoute requiredPermissions={["approve_trip"]} />
        ),
        children: [
          {
            path: "",
            element: <div>Trips to Approve</div>, // Replace with your actual component
          },
          {
            path: "history",
            element: (
              <PermissionProtectedRoute
                requiredPermissions={["view_approval_history"]}
              />
            ),
            children: [
              {
                path: "",
                element: <div>Approval History</div>, // Replace with your actual component
              },
            ],
          },
        ],
      },
      // Routes protected for booking permission
      {
        path: "/booking",
        element: (
          <PermissionProtectedRoute requiredPermissions={["book_trip"]} />
        ),
        children: [
          {
            path: "",
            element: <div>Trips to Book</div>, // Replace with your actual component
          },
          {
            path: "history",
            element: (
              <PermissionProtectedRoute
                requiredPermissions={["view_booking_history"]}
              />
            ),
            children: [
              {
                path: "",
                element: <div>Booking History</div>, // Replace with your actual component
              },
            ],
          },
        ],
      },
      {
        path: "/refunds",
        element: <Refunds />,
      },
    ],
  },
  // Public routes (no authentication required)
  {
    path: "/example",
    element: <Example />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  // Catch-all route for non-existent pages
  {
    path: "*",
    element: <Navigate to="/example" replace />,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
