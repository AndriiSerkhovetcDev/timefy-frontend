import { useAuthStore } from "@/features/auth/model/authStore";
import type { User } from "@/features/auth/model/types";
import { API_V1_BASE_URL } from "./apiConfig";

type RequestOptions = RequestInit & {
  baseUrl?: string;
  includeAuthorization?: boolean;
  retryUnauthorized?: boolean;
};

const getToken = () => useAuthStore.getState().token;

type ApiErrorPayload = {
  message?: string;
  errorCode?: string;
};

type RefreshResponse = {
  data: {
    token: string;
    user: User;
  };
};

let activeRefreshRequest: Promise<RefreshResponse> | null = null;

export class ApiError extends Error {
  readonly status: number;
  readonly errorCode?: string;
  readonly retryAfterSeconds?: number;

  constructor(
    message: string,
    status: number,
    options: { errorCode?: string; retryAfterSeconds?: number } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = options.errorCode;
    this.retryAfterSeconds = options.retryAfterSeconds;
  }
}

const getRetryAfterSeconds = (response: Response) => {
  const value = response.headers.get("Retry-After");
  if (!value) return undefined;

  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.ceil(seconds);

  const retryAt = Date.parse(value);
  if (Number.isNaN(retryAt)) return undefined;
  return Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
};

const createApiError = async (response: Response) => {
  const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;
  return new ApiError(payload.message ?? "Щось пішло не так", response.status, {
    errorCode: payload.errorCode,
    retryAfterSeconds: getRetryAfterSeconds(response),
  });
};

const wait = (seconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, seconds * 1000));

const executeRefresh = async (hasRetriedConcurrent = false): Promise<RefreshResponse> => {
  const response = await fetch(`${API_V1_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (response.ok) {
    const refreshResponse = (await response.json()) as RefreshResponse;
    useAuthStore.getState().login(refreshResponse.data.user, refreshResponse.data.token);
    return refreshResponse;
  }

  const error = await createApiError(response);

  if (error.status === 401 && error.errorCode === "AUTH_REFRESH_INVALID") {
    useAuthStore.getState().logout();
    throw error;
  }

  if (
    error.status === 409 &&
    error.errorCode === "AUTH_REFRESH_CONCURRENT" &&
    !hasRetriedConcurrent
  ) {
    await wait(error.retryAfterSeconds ?? 1);
    return executeRefresh(true);
  }

  throw error;
};

export const refreshSession = () => {
  activeRefreshRequest ??= executeRefresh().finally(() => {
    activeRefreshRequest = null;
  });

  return activeRefreshRequest;
};

const canRefreshRequest = (
  error: ApiError,
  token: string | null,
  retryUnauthorized: boolean,
  hasRetriedAfterRefresh: boolean,
) =>
  retryUnauthorized &&
  !hasRetriedAfterRefresh &&
  Boolean(token) &&
  error.status === 401 &&
  error.errorCode === "UNAUTHORIZED";

const request = async <T>(
  endpoint: string,
  options: RequestOptions = {},
  hasRetriedAfterRefresh = false,
): Promise<T> => {
  const token = getToken();
  const {
    baseUrl = API_V1_BASE_URL,
    includeAuthorization = true,
    retryUnauthorized = true,
    ...requestOptions
  } = options;
  const isFormData = requestOptions.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(requestOptions.headers as Record<string, string>),
  };

  if (token && includeAuthorization) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    const error = await createApiError(response);
    if (canRefreshRequest(error, token, retryUnauthorized, hasRetriedAfterRefresh)) {
      await refreshSession();
      return request<T>(endpoint, options, true);
    }

    throw error;
  }

  return response.json();
};

export const httpClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
  postForm: <T>(endpoint: string, body: FormData, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "POST", body }),
  put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

export const resolveApiAssetUrl = (path?: string | null) => {
  if (!path || /^(https?:|data:|blob:)/.test(path)) return path ?? undefined;

  const apiOrigin = new URL(API_V1_BASE_URL, window.location.origin).origin;
  return new URL(path, apiOrigin).toString();
};

export const isApiAssetUrl = (path: string) => {
  if (!/^https?:/.test(path)) return true;

  const apiOrigin = new URL(API_V1_BASE_URL, window.location.origin).origin;
  return new URL(path).origin === apiOrigin;
};

export const fetchApiAsset = async (
  path: string,
  hasRetriedAfterRefresh = false,
): Promise<Blob> => {
  const token = getToken();
  const url = resolveApiAssetUrl(path) ?? path;

  const response = await fetch(url, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    const error = await createApiError(response);

    if (canRefreshRequest(error, token, true, hasRetriedAfterRefresh)) {
      await refreshSession();
      return fetchApiAsset(path, true);
    }

    throw error;
  }

  return response.blob();
};

export const versionApiAssetUrl = (path: string) => {
  const url = new URL(path, window.location.origin);
  url.searchParams.set("v", Date.now().toString());

  return /^https?:/.test(path) ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
};
