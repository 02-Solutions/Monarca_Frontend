import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
import Error from "./pages/Error.tsx";
import Historial from "./pages/Historial/Historial.tsx";
import Bookings from "./pages/Bookings.tsx";
import { Refunds } from "./pages/Refunds/Refunds.tsx";
import { Vouchers } from "./pages/Refunds/Vouchers.tsx";
import Reservations from "./pages/Reservations/Reservations.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import RefundsAcceptance from "./pages/Refunds/RefundsAcceptance.tsx";
import { Unauthorized } from "./pages/Unauthorized.tsx";
import RequestInfo from "./pages/RequestInfo.tsx";
import { Approvals } from "./pages/Approvals/Approvals.tsx";
import { RefundsReview } from "./pages/Refunds/RefundsReview.tsx";
import { CheckRefunds } from "./pages/Refunds/CheckRefunds.tsx";

export const router = createBrowserRouter([
  // Public routes (no authentication required)
  {
    path: "/",
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
    path: "*",
    element: <Error />,
  },

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
        path: "/approvals",
        element: <Approvals />,
      },
      {
        path: "/requests/:id",
        element: <RequestInfo />,
      },
      {
        path: "/requests/create",
        element: <CreateTravelRequest />,
      },
      {
        path: "/requests/:id/edit",
        element: <EditTravelRequest />,
      },
      {
        path: "/history",
        element: <Historial />,
      },
      {
        path: "/refunds",
        element: <Refunds />,
      },
      {
        path: "/refunds/:id",
        element: <Vouchers />,
      },
      {
        path: "/check-refunds",
        element: <CheckRefunds />,
      },
      {
        path: "/bookings",
        element: <Bookings />,
      },
      {
        path: "/bookings/:id",
        element: <Reservations />,
      },
      {
        path: "/refunds-review",
        element: <RefundsReview />,
      },
      {
        path: "/refunds-review/:id",
        element: <RefundsAcceptance />,
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
    ],
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
