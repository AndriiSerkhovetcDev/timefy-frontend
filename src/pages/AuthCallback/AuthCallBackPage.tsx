import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/authStore";
import type { User } from "@/features/auth/model/types";

export const AuthCallbackPage = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const token = params.get("token");
    const userRaw = params.get("user");

    if (error || !token || !userRaw) {
      navigate("/login");
      return;
    }

    const user: User = JSON.parse(decodeURIComponent(userRaw));

    login(user, token);
    navigate("/dashboard");
  }, []);

  return <div>Авторизація...</div>;
};
