import type { User } from "@/features/auth/model/types";
import { httpClient } from "./httpClient";
import type { ExternalAuthProvider } from "@/features/auth/model/externalAuth";
import { API_V2_BASE_URL } from "./apiConfig";
import { parseAuthResponse } from "./authResponse";

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
    user: User;
    token: string;
  };
};

export type ExternalAuthExchangeResponse = {
  data: {
    token: string;
    user: User;
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

type resetPasswordPayload = {
  newPassword: string;
  token: string;
};

type CreatePasswordPayload = {
  login: string;
  password: string;
};

type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

type CreatePasswordResponse = {
  status: number;
  code: string;
  message: string;
  data: { user: User };
};

export type ForgotPassEmailStepPayload = { email: string } | { login: string };

//api
const API_LOGIN_URL = "/auth/login";
const API_REGISTER_URL = "/auth/register";
const API_CHECK_LOGIN_URL = "/auth/check";
const API_VERIFY_EMAIL = "/auth/verify-email";
const API_RESEND_VERIFY_EMAIL = "/auth/resend-verify-email";
const API_FORGOT_PASS_EMAIL_STEP = "/auth/forgot-password";
const API_FORGOT_PASS_RESET_PASS = "/auth/reset-password";
const API_OAUTH_EXCHANGE = "/auth/exchange";
const API_LOGOUT = "/auth/logout";
const API_CREATE_PASSWORD = "/auth/create-password";
const API_CHANGE_PASSWORD = "/auth/change-password";

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await httpClient.post(API_LOGIN_URL, payload, {
    credentials: "include",
    includeAuthorization: false,
    retryUnauthorized: false,
  });
  return parseAuthResponse(response);
};

export const registration = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await httpClient.post(API_REGISTER_URL, payload, {
    credentials: "include",
    includeAuthorization: false,
    retryUnauthorized: false,
  });
  return parseAuthResponse(response);
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

export const resetPassword = async (
  payload: resetPasswordPayload,
): Promise<{ success: boolean }> => {
  return httpClient.post(API_FORGOT_PASS_RESET_PASS, payload);
};

export const exchangeExternalAuthCode = async (
  provider: ExternalAuthProvider,
  code: string,
): Promise<ExternalAuthExchangeResponse> => {
  const response = await httpClient.post(
    API_OAUTH_EXCHANGE,
    { provider, code },
    {
      baseUrl: API_V2_BASE_URL,
      credentials: "include",
      cache: "no-store",
      includeAuthorization: false,
      retryUnauthorized: false,
    },
  );
  return parseAuthResponse(response);
};

export const logoutCurrentSession = (): Promise<void> =>
  httpClient.post(API_LOGOUT, undefined, {
    credentials: "include",
    retryUnauthorized: false,
  });

export const createPassword = (payload: CreatePasswordPayload): Promise<CreatePasswordResponse> =>
  httpClient.post(API_CREATE_PASSWORD, payload, { credentials: "include" });

export const changePassword = async (payload: ChangePasswordPayload): Promise<AuthResponse> => {
  const response = await httpClient.post(API_CHANGE_PASSWORD, payload, {
    credentials: "include",
  });
  return parseAuthResponse(response);
};
