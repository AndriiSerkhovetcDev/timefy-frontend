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
      emailVerified: boolean;
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

type VerifyEmailPayload = {
  login: string;
  code: string;
};

type VerifyEmailResponse = {
  codeVerified: boolean;
};

type ResendVerifyEmailPayload = {
  login: string;
};

//api
const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_LOGIN_URL = `${API_BASE_URL}/auth/login`;
const API_REGISTER_URL = `${API_BASE_URL}/auth/register`;
const API_CHECK_LOGIN_URL = `${API_BASE_URL}/auth/check`;
const API_VERIFY_EMAIL = `${API_BASE_URL}/auth/verify-email`;
const API_RESEND_VERIFY_EMAIL = `${API_BASE_URL}/auth/resend-verify-email`;
export const API_GOOGLE_AUTH_URL = `${API_BASE_URL}/auth/google`;

//headers
const HEADERS = { "Content-Type": "application/json" };

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(API_LOGIN_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Помилка входу");

  return response.json();
};

export const registration = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(API_REGISTER_URL, {
    method: "POST",
    headers: HEADERS,
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
    headers: HEADERS,
    body: JSON.stringify({ [field]: value }),
  });
  if (!response.ok) throw new Error("Помилка перевірки");
  return response.json();
};

export const verifyEmail = async (payload: VerifyEmailPayload): Promise<VerifyEmailResponse> => {
  const response = await fetch(API_VERIFY_EMAIL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Помилка перевірки");
  return response.json();
};

export const resendVerifyEmail = async (payload: ResendVerifyEmailPayload): Promise<void> => {
  const response = await fetch(API_RESEND_VERIFY_EMAIL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Помилка надсилання коду");
};
