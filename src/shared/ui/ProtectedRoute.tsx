import { useAuthStore, selectIsAuthenticated } from "@/features/auth/model/authStore";
import { RouteGuard } from "./RouteGuard";

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  return <RouteGuard condition={isAuthenticated} redirectTo="/login" />;
};
