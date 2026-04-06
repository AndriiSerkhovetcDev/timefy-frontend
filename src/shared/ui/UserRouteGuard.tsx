import { Navigate, Outlet } from "react-router-dom";
import { selectUser, useAuthStore } from "@/features/auth/model/authStore";

export const UserRouteGuard = () => {
  const user = useAuthStore(selectUser);

  if (!user) return <Navigate to="/login" replace />;
  if (user.emailVerified) return <Navigate to="/" replace />;

  return <Outlet />;
};
