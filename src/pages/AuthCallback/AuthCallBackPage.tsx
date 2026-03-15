import type { User } from "@/features/auth/model/types";
import { useEffect } from "react";

export const AuthCallbackPage = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const token = params.get("token");

    if (error) {
      window.opener?.postMessage({ type: "AUTH_ERROR", message: error }, window.location.origin);
      setTimeout(() => window.close(), 100);
      return;
    }

    const user: User = {
      id: params.get("id") ?? "",
      login: params.get("login") ?? "",
      role: params.get("role") as "ADMIN" | "SUPPORT" | "OWNER",
      email: params.get("email") ?? "",
      phone: params.get("phone") ?? "",
    };

    const type = token ? "AUTH_SUCCESS" : "AUTH_ERROR";
    const payload = token ? { user, token } : { message: "Помилка авторизації" };

    window.opener?.postMessage({ type, payload }, window.location.origin);
    setTimeout(() => window.close(), 100);
  }, []);

  return <div>Авторизація...</div>;
};
