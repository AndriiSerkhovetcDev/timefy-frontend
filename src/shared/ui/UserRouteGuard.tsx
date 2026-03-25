import { RouteGuard } from "./RouteGuard";
import { selectUser, useAuthStore } from "@/features/auth/model/authStore";

export const UserRouteGuard = () => {
  const user = useAuthStore(selectUser);
  return <RouteGuard condition={!!user} redirectTo="/login" />;
};
