import { useAuthStore } from "./authStore";
import { logoutCurrentSession } from "@/shared/api/authApi";

export const endCurrentSession = async () => {
  const { token, logout } = useAuthStore.getState();

  if (token) {
    await logoutCurrentSession().catch(() => undefined);
  }

  logout();
};
