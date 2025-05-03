import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreateTravelRequest from "./pages/CreateTravelRequest.tsx";

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
import { Dashboard } from "./pages/Dashboard.tsx";
import { Refunds } from "./pages/Refunds/Refunds.tsx";
import { Unauthorized } from "./pages/Unauthorized.tsx";



const router = createBrowserRouter([
  // Basic protected routes (requires only authentication)
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/requests",
        element: <Requests />,
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
        path: "/travel-requests",
        element: (
          <PermissionProtectedRoute requiredPermissions={["create_trip"]} />
        ),
        children: [
          {
            path: "create", // full URL = /travel-requests/create
            element: <CreateTravelRequest />,
          },
        ],
      },
    ],
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
  // Catch-all route for non-existent pages
  // TODO: Add a 404 page
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
