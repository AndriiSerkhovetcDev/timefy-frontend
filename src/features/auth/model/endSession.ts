import { useAuthStore } from "./authStore";
import { logoutCurrentSession } from "@/shared/api/authApi";

export const endCurrentSession = async () => {
  const { user, logout } = useAuthStore.getState();

  if (user?.role === "USER") {
    await logoutCurrentSession().catch(() => undefined);
  }

  logout();
};
