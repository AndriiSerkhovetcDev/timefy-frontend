import { selectIsAuthenticated, useAuthStore } from "@/features/auth/model/authStore";
import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};
