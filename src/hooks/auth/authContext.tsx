// src/hooks/auth/authContext.tsx
import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

import Layout from "../../components/Layout";
import { getRequest, postRequest } from "../../utils/apiService";

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

export interface ContextType {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
  loadingProfile: Boolean;
  handleLogout: () => Promise<void>;
}
// Auth state interface
export interface AuthState {
  isAuthenticated: boolean;
  userId: string;
  userName: string;
  userPermissions: Permission[];
  userRole: string;
}

// Create the auth context with proper typing
export const AuthContext = createContext<ContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = (): ContextType => {
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
  const [loadingProfile, setLoadingProfile] = React.useState<Boolean>(true);
  const [authState, setAuthState] = React.useState<AuthState>({
    isAuthenticated: false,
    userId: "",
    userName: "",
    userRole: "",
    userPermissions: [],
  });


  useEffect(() => {
    const getAuthState = async () => {
      getRequest("/login/profile")
        .then((response) => {
          if (response?.status) {
            setAuthState({
              isAuthenticated: true,
              userId: response.user.id,
              userName: response.user.name,
              userRole: response.user.role.name,
              userPermissions: response.user.role.permissions,
            });
            setLoadingProfile(false);
          } else {
            setAuthState((prevState) => ({
              ...prevState,
              isAuthenticated: false,
            }));
            setLoadingProfile(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching auth state:", error);
          setAuthState((prevState) => ({
            ...prevState,
            isAuthenticated: false,
          }));
          setLoadingProfile(false);
        });
    };

    getAuthState();
    
  }, []);

  const handleLogout = async () => {
    const response = await postRequest("/login/logout", {});
    if (response.status) {
      setAuthState({
        isAuthenticated: false,
        userId: "",
        userName: "",
        userRole: "",
        userPermissions: [],
      });
    }
  }

  return (
    <AuthContext.Provider value={{ 
      authState, 
      setAuthState,
      loadingProfile,
      handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Basic protected route wrapper component with Layout
export const ProtectedRoute: React.FC = () => {
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
  const { authState } = useAuth();

  // First check authentication
  if (!authState.isAuthenticated) {
    return <Navigate to="/example" replace />;
  }

  // Then check permissions
  const hasPermission = requireAll
    ? requiredPermissions.every((permission) =>
        authState.userPermissions.includes(permission)
      )
    : requiredPermissions.some((permission) =>
        authState.userPermissions.includes(permission)
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
