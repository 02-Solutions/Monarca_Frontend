// src/hooks/auth/authContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "../../components/Layout";

// Define permissions
export type Permission =
  | "view_dashboard"
  | "create_trip"
  | "approve_trip"
  | "book_trip"
  | "view_reports"
  | "manage_users"
  | "view_approval_history"
  | "view_booking_history";

// Auth state interface
export interface AuthState {
  isAuthenticated: boolean;
  userId: string;
  userName: string;
  userPermissions: Permission[];
}

// Create the auth context with proper typing
export const AuthContext = createContext<AuthState | undefined>(undefined);

// Hardcoded authentication until backend is ready
export const getAuthState = (): AuthState => {
  return {
    isAuthenticated: true,
    userId: "user123",
    userName: "John Doe",
    userPermissions: [
      "view_dashboard",
      "create_trip",
      "approve_trip",
      "view_approval_history",
    ], // Example permissions
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

// Auth provider component
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

// Permission-based protected route component
interface PermissionProtectedRouteProps {
  requiredPermissions: Permission[];
  requireAll?: boolean; // If true, user must have ALL permissions; if false, ANY permission is sufficient
}

export const PermissionProtectedRoute: React.FC<
  PermissionProtectedRouteProps
> = ({ requiredPermissions, requireAll = true }) => {
  const { isAuthenticated, userPermissions } = getAuthState();

  // First check authentication
  if (!isAuthenticated) {
    return <Navigate to="/example" replace />;
  }

  // Then check permissions
  const hasPermission = requireAll
    ? requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
      )
    : requiredPermissions.some((permission) =>
        userPermissions.includes(permission)
      );

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and authorized, render the route
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};
