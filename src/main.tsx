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
import { Unauthorized } from "./pages/Unauthorized.tsx";
import { ProtectedRoute, RoleProtectedRoute } from "./hooks/auth/authContext";

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

      // Routes protected for specific roles (n1, n2, SOI)
      {
        path: "/approval",
        element: <RoleProtectedRoute allowedRoles={["n1", "n2", "SOI"]} />,
        children: [
          {
            path: "",
            element: <div>Trips to Approve</div>, // Replace with your actual component
          },
          {
            path: "history",
            element: <div>Approval History</div>, // Replace with your actual component
          },
        ],
      },
      // Routes protected for agency role only
      {
        path: "/booking",
        element: <RoleProtectedRoute allowedRoles={["agency"]} />,
        children: [
          {
            path: "",
            element: <div>Trips to Book</div>, // Replace with your actual component
          },
          {
            path: "history",
            element: <div>Booking History</div>, // Replace with your actual component
          },
        ],
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
