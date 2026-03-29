import { httpClient } from "./httpClient";

type LoginPayload = {
  login: string;
  password: string;
};

type RegisterPayload = {
  login: string;
  email: string;
  phone: string;
  password: string;
};

export type AuthResponse = {
  data: {
    user: {
      login: string;
      role: "ADMIN" | "SUPPORT" | "OWNER";
      email: string;
      phone: string;
      emailVerified: boolean;
    };
    token: string;
  };
};

export type ForgotPassResponse = {
  data: {
    success: boolean;
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
  data: {
    codeVerified: boolean;
  };
};

type ResendVerifyEmailPayload = {
  login: string;
};

type ForgotPassEmailStepPayload = { email: string } | { login: string };

//api
const API_LOGIN_URL = "/auth/login";
const API_REGISTER_URL = "auth/register";
const API_CHECK_LOGIN_URL = "/auth/check";
const API_VERIFY_EMAIL = "/auth/verify-email";
const API_RESEND_VERIFY_EMAIL = "/auth/resend-verify-email";
const API_FORGOT_PASS_EMAIL_STEP = "/auth//forgot-password";

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  return httpClient.post(API_LOGIN_URL, payload);
};

export const registration = async (payload: RegisterPayload): Promise<AuthResponse> => {
  return httpClient.post(API_REGISTER_URL, payload);
};

export const checkIsExists = async (
  field: CheckField,
  value: string,
): Promise<CheckExistsResponse> => {
  return httpClient.post(API_CHECK_LOGIN_URL, { [field]: value });
};

export const verifyEmail = async (payload: VerifyEmailPayload): Promise<VerifyEmailResponse> => {
  return httpClient.post(API_VERIFY_EMAIL, payload);
};

export const resendVerifyEmail = async (payload: ResendVerifyEmailPayload): Promise<void> => {
  return httpClient.post(API_RESEND_VERIFY_EMAIL, payload);
};

export const forgotPasswordEmailStep = async (
  payload: ForgotPassEmailStepPayload,
): Promise<{ success: boolean }> => {
  return httpClient.post(API_FORGOT_PASS_EMAIL_STEP, payload);
};
