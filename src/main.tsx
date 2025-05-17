import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreateTravelRequest from "./pages/CreateTravelRequest.tsx";
import EditTravelRequest from "./pages/EditTravelRequest.tsx";

import {
  ProtectedRoute,
  PermissionProtectedRoute,
} from "./hooks/auth/authContext";
import "flowbite";

// ******************* Styles ******************
import "./index.css";
import "./App.css";

// ****************** Pages ******************
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Requests from "./pages/Requests.tsx";
import CreateTravelRequestForm from "./components/travel-requests/CreateTravelRequestForm.tsx";
import Historial from "./pages/Historial/Historial.tsx";
import Bookings from "./pages/Bookings.tsx";
import Reservations from "./pages/Reservations/Reservations.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { Refunds } from "./pages/Refunds/Refunds.tsx";
import { RefundsAcceptance } from "./pages/Refunds/RefundsAcceptance.tsx";
import { Unauthorized } from "./pages/Unauthorized.tsx";
import ApplicationInfo from "./pages/ApplicationInfo.tsx"
import {Approvals} from "./pages/Approvals/Approvals.tsx";


export const router = createBrowserRouter([
  // Basic protected routes (requires only authentication)
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard title="Inicio" />,
      },
      {
        path: "/requests/create",
        element: <CreateTravelRequestForm />,
      },
      {
        path: "/requests",
        element: <Approvals />,
      },
      {
        path: "/application-info",
        element: <ApplicationInfo />,
      },
      {
        path: "/requests",
        element: <Requests />,
      },
      {
        path: "/historial",
        element: <Historial />,
      },
      // Routes protected by specific permissions
       {
        path: "/refunds",
        element: <Refunds />,
      },
      {
        path: "/approval",
        element: (
          <PermissionProtectedRoute requiredPermissions={["approve_trip"]} />
        ),
        children: [
          {
            path: "",
            element: <div>Trips to Approve</div>,
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
                element: <div>Approval History</div>,
              },
            ],
          },
        ],
      },
      {
        path: "/bookings",
        element: <Bookings />,
      },
      // Routes protected for booking permission
      {
        path: "/booking",
        element: (
          <PermissionProtectedRoute requiredPermissions={["book_trip"]} />
        ),
        children: [
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
        path: "/travel-requests/create",
        element: (
          // <PermissionProtectedRoute requiredPermissions={["create_trip"]} />
          <CreateTravelRequest />
        ),
      },
      {
        path: "/travel-requests/:id/edit",
        element: <EditTravelRequest />,
      },
    ],
  },

  // ✅ Public route for Bookings — temp dev only (no auth)
  {
    path: "/bookings",
    element: <Bookings />,
  },

  // Public routes (no authentication required)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/refunds",
    element: <Refunds />,
  },
  {
    path: "/reservations",
    element: <Reservations />,
  },
  // Catch-all route for non-existent pages
  // TODO: Add a 404 page
  {
    path: "/refunds-acceptance",
    element: <RefundsAcceptance />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

const queryClient = new QueryClient();

if (import.meta.env.PROD || !import.meta.env.TEST) {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </StrictMode>
    );
  }
}
