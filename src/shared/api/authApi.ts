import type { User } from "@/features/auth/model/types";

type LoginData = {
  login: string;
  password: string;
};

type RegisterData = {
  login: string;
  email: string;
  phone: string;
  password: string;
};

export type AuthResponse = {
  data: {
    user: {
      id: string;
      login: string;
      role: "ADMIN" | "SUPPORT" | "OWNER";
      email: string;
      phone: string;
    };
    token: string;
  };
};

type CheckField = "login" | "email" | "phone";

type CheckExistsResponse = {
  data: {
    checkLogin: boolean;
    checkEmail: boolean;
    checkPhone: boolean;
  };
};

//api
const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_LOGIN_URL = `${API_BASE_URL}/auth/login`;
const API_REGISTER_URL = `${API_BASE_URL}/auth/register`;
const API_CHECK_LOGIN_URL = `${API_BASE_URL}/auth/check`;
const API_GOOGLE_AUTH_URL = `${API_BASE_URL}/auth/google`;

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(API_LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Помилка входу");

  return response.json();
};

export const registration = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(API_REGISTER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Помилка реєстрації");

  return response.json();
};

export const checkIsExists = async (
  field: CheckField,
  value: string,
): Promise<CheckExistsResponse> => {
  const response = await fetch(API_CHECK_LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [field]: value }),
  });
  if (!response.ok) throw new Error("Помилка перевірки");
  return response.json();
};

export const googleAuth = (): Promise<{ token: string; user: User }> => {
  return new Promise((resolve, reject) => {
    const popup = window.open(
      API_GOOGLE_AUTH_URL,
      "google-auth",
      "width=500,height=600,left=400,top=100",
    );

    if (!popup) {
      reject(new Error("Браузер заблокував popup"));
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      console.log("message received:", event.data);
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "AUTH_SUCCESS") {
        window.removeEventListener("message", handleMessage);
        resolve(event.data.payload);
      }

      if (event.data?.type === "AUTH_ERROR") {
        window.removeEventListener("message", handleMessage);
        reject(new Error(event.data.message));
      }
    };

    window.addEventListener("message", handleMessage);
  });
};
