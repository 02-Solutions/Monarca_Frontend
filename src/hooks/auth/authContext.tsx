// src/hooks/auth/authContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "../../components/Layout"; // Import your Layout component

// Define user roles
export type UserRole = "n2" | "n1" | "SOI" | "requester" | "agency";

// Auth state interface
export interface AuthState {
  isAuthenticated: boolean;
  userId: string;
  userRole: UserRole;
}

// Create the auth context with proper typing
export const AuthContext = createContext<AuthState | undefined>(undefined);

// Hardcoded authentication until backend is ready
export const getAuthState = (): AuthState => {
  return {
    isAuthenticated: true,
    userId: "user123",
    userRole: "SOI", // Change this to test different roles
  };
};

// Custom hook to use the auth context
export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth provider component with proper typing
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const authState = getAuthState();

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

// Basic protected route wrapper component with Layout
export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = getAuthState();

  if (!isAuthenticated) {
    return <Navigate to="/example" replace />;
  }

  return (
    <AuthProvider>
      <Layout>
        <Outlet />
      </Layout>
    </AuthProvider>
  );
};

// Role-based protected route component with Layout
interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const { isAuthenticated, userRole } = getAuthState();

  // First check authentication
  if (!isAuthenticated) {
    return <Navigate to="/example" replace />;
  }

  // Then check role authorization
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and authorized, render the route with Layout
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};
