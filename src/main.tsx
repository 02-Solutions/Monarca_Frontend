import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Example from "./pages/Example.tsx";

// Hardcoded authentication until backend is ready
const isAuthenticated = () => {
  // For testing purposes, this could be controlled by localStorage
  // return localStorage.getItem("isAuthenticated") === "true";
  return true; // Change to true to test protected routes
};

// Protected router wrapper
const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    // Redirect to example page if not authenticated
    return <Navigate to="/example" replace />;
  }

  // If authenticated render the child components
  return <Outlet />;
};

const router = createBrowserRouter([
  //Protected Routes
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
      },
    ],
  },

  //Public Routes
  {
    path: "/example",
    element: <Example />,
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
