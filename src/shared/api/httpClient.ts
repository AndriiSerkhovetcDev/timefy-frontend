import { useAuthStore } from "@/features/auth/model/authStore";
import { API_V1_BASE_URL } from "./apiConfig";

type RequestOptions = RequestInit & {
  baseUrl?: string;
};

const getToken = () => useAuthStore.getState().token;

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const request = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const token = getToken();
  const { baseUrl = API_V1_BASE_URL, ...requestOptions } = options;
  const isFormData = requestOptions.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(requestOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(error.message ?? "Щось пішло не так", response.status);
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

export const fetchApiAsset = (path: string) => {
  const token = getToken();
  const url = resolveApiAssetUrl(path) ?? path;

  return fetch(url, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(error.message ?? "Не вдалося завантажити файл", response.status);
    }

    return response.blob();
  });
};

export const versionApiAssetUrl = (path: string) => {
  const url = new URL(path, window.location.origin);
  url.searchParams.set("v", Date.now().toString());

  return /^https?:/.test(path) ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
};
