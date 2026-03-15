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
export const API_GOOGLE_AUTH_URL = `${API_BASE_URL}/auth/google`;

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
